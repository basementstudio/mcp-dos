import { z } from "zod";
import { type InferSchema } from "xmcp";
import express from "express";
import { createServer } from "http";
import { AddressInfo } from "net";
import open from "open";
import { suppressStdioAsync } from "../utils/suppress-stdio";
import { DOS_GAMES } from "../utils/game-utils";

// Define the schema for tool parameters
export const schema = {
  game: z.string().describe("DOS game slug to play (e.g., 'doom', 'doom2')."),
};

// Define tool metadata
export const metadata = {
  name: "open-dos",
  description: "Open and play a DOS game using js-dos. Use `list` to see the exact key you need to use and the available games.",
  annotations: {
    title: "Play DOS game",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
  },
};

// Global server instance
let globalServer: ReturnType<typeof createServer> | null = null;
let serverPort: number | null = null;

// Utility to find available port starting from 5555
async function findAvailablePort(startPort: number = 5555): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = createServer();

    function tryPort(port: number) {
      server.listen(port, () => {
        const actualPort = (server.address() as AddressInfo).port;
        server.close(() => {
          resolve(actualPort);
        });
      });

      server.on('error', (err: any) => {
        if (err.code === 'EADDRINUSE') {
          // Port is busy, try next one
          tryPort(port + 1);
        } else {
          reject(err);
        }
      });
    }

    tryPort(startPort);
  });
}

// Create HTML content for the game
function createGameHTML(gameSlug: string, useCDN: boolean = false): string {
  const game = DOS_GAMES[gameSlug];
  if (!game) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Game Not Found</title>
</head>
<body>
    <h1>Game "${gameSlug}" not found</h1>
    <p>Available games: ${Object.keys(DOS_GAMES).join(', ')}</p>
</body>
</html>`;
  }

  // Use CDN file if requested and available, otherwise use local file
  const gameFile = useCDN && game.cdnFile ? game.cdnFile : game.file;

  return `<!doctype html>
<html lang="en-us">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title>${game.title}</title>
    <style type="text/css">
      body { margin: 0; padding: 0; }
      .dosbox-container { width: 100vw; height: 100vh; }
      .dosbox-canvas { width: 100%; height: 100%; }
      .dosbox-container > .dosbox-overlay {
        background: url(https://js-dos.com/cdn/${gameSlug.toUpperCase()}.png);
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
      }
      .dosbox-start {
        background: rgba(0, 0, 0, 0.5);
        color: #0f0;
        font-family: monospace;
        font-size: 16px;
        padding: 10px;
        border: none;
        cursor: pointer;
      }
      body { margin: 0; padding: 20px; background: #000; color: #0f0; font-family: monospace; }
      button { background: #0f0; color: #000; border: none; padding: 10px 20px; margin: 10px 0; cursor: pointer; font-family: monospace; }
      button:hover { background: #0a0; }
      .info { background: #333; padding: 10px; margin: 10px 0; border-radius: 5px; }
      .dosbox-fullscreen {
        position: absolute;
        top: 10px;
        right: 10px;
        background: #0f0;
        color: #000;
        border: none;
        padding: 10px 20px;
        margin: 10px 0;
        cursor: pointer;
      }
    </style>
  </head>
  <body>
    <div id="dosbox"></div>
    <button class="dosbox-fullscreen" onclick="dosbox.requestFullScreen();">Fullscreen</button>
    <script type="text/javascript" src="https://js-dos.com/cdn/js-dos-api.js"></script>
    <script type="text/javascript">
      var dosbox = new Dosbox({
        id: "dosbox",
        onload: function (dosbox) {
          dosbox.run("${gameFile}", "${game.executable}");
        },
        onrun: function (dosbox, app) {
          console.log("App '" + app + "' is running");
        }
      });
    </script>
  </body>
</html>`;
}

// Start Express server
async function startServer(): Promise<number> {
  if (globalServer && serverPort) {
    return serverPort;
  }

  const app = express();
  const port = await findAvailablePort();

  // Game route: /:gameSlug with optional CDN parameter
  app.get('/:gameSlug', (req, res) => {
    const gameSlug = req.params.gameSlug;
    const useCDN = req.query.cdn === 'true';
    res.send(createGameHTML(gameSlug, useCDN));
  });

  // API to list available games
  app.get('/api/games', (req, res) => {
    res.json({
      games: Object.keys(DOS_GAMES),
      count: Object.keys(DOS_GAMES).length,
      gameDetails: DOS_GAMES,
      usage: {
        local: "http://localhost:PORT/GAME_SLUG",
        cdn: "http://localhost:PORT/GAME_SLUG?cdn=true"
      }
    });
  });

  // Start server
  globalServer = app.listen(port, () => { });

  serverPort = port;
  return port;
}

// Tool implementation
export default async function openDos({ game }: InferSchema<typeof schema>) {
  try {
    const result = await suppressStdioAsync(async () => {
      const gameSlug = game.toLowerCase();

      // Check if game exists
      if (!DOS_GAMES[gameSlug]) {
        return {
          content: [
            { type: "text", text: `Game "${game}" not found` },
            { type: "text", text: `Available games: ${Object.keys(DOS_GAMES).join(', ')}` }
          ],
          isError: true,
        };
      }

      // Start server if not already running
      const port = await startServer();

      // Build URLs for both local and CDN options
      const localUrl = `http://localhost:${port}/${encodeURIComponent(gameSlug)}`;
      const cdnUrl = `http://localhost:${port}/${encodeURIComponent(gameSlug)}?cdn=true`;
      const gameInfo = DOS_GAMES[gameSlug];

      // Try to open with CDN first if available, otherwise use local
      const useUrl = gameInfo.cdnFile ? cdnUrl : localUrl;

      // Open URL in Chrome
      await open(useUrl, { app: { name: 'google chrome' } });

      return {
        content: [
          { type: "text", text: `Started ${gameInfo.title}` },
          { type: "text", text: `Server running on http://localhost:${port}` },
          { type: "text", text: `Game URL: ${useUrl}` },
          { type: "text", text: `Local files URL: ${localUrl}` },
          ...(gameInfo.cdnFile ? [{ type: "text", text: `CDN URL: ${cdnUrl}` }] : []),
          { type: "text", text: `Help: http://localhost:${port}` },
          { type: "text", text: "\nTo use local files, create an 'upload' directory and place your game ZIP files there." },
          { type: "text", text: "Game files should be legally obtained from sources you own." }
        ],
      };
    });

    return result;
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error starting game: ${error}` }],
      isError: true,
    };
  }
} 