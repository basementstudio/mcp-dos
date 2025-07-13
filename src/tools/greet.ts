import { z } from "zod";
import { type InferSchema } from "xmcp";
import express from "express";
import { createServer } from "http";
import { AddressInfo } from "net";
import open from "open";
import { suppressStdioAsync } from "../utils/suppress-stdio";

// Define the schema for tool parameters
export const schema = {
  name: z.string().describe("The name of the user to greet"),
};

// Define tool metadata
export const metadata = {
  name: "greet",
  description: "Greet the user",
  annotations: {
    title: "Greet the user",
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

// Create HTML content for the greeting
function createGreetingHTML(name: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DOS Greeting</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&display=swap');
        
        body {
            margin: 0;
            padding: 0;
            background-color: #000;
            color: #00ff00;
            font-family: 'Courier Prime', monospace;
            font-size: 16px;
            line-height: 1.4;
            overflow: hidden;
        }
        
        .dos-screen {
            width: 100vw;
            height: 100vh;
            padding: 20px;
            box-sizing: border-box;
            background: linear-gradient(45deg, #000 25%, transparent 25%),
                        linear-gradient(-45deg, #000 25%, transparent 25%),
                        linear-gradient(45deg, transparent 75%, #000 75%),
                        linear-gradient(-45deg, transparent 75%, #000 75%);
            background-size: 4px 4px;
            background-position: 0 0, 0 2px, 2px -2px, -2px 0px;
            position: relative;
        }
        
        .terminal {
            background-color: rgba(0, 0, 0, 0.9);
            border: 2px solid #00ff00;
            padding: 20px;
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            position: relative;
            overflow: auto;
        }
        
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #00ff00;
            padding-bottom: 10px;
        }
        
        .ascii-art {
            font-size: 12px;
            white-space: pre;
            color: #00ffff;
            margin: 20px 0;
        }
        
        .greeting {
            font-size: 24px;
            font-weight: bold;
            color: #ffff00;
            text-align: center;
            margin: 30px 0;
            text-shadow: 0 0 10px #ffff00;
        }
        
        .command-line {
            margin-top: 20px;
            font-family: 'Courier Prime', monospace;
        }
        
        .prompt {
            color: #00ff00;
        }
        
        .cursor {
            background-color: #00ff00;
            animation: blink 1s infinite;
        }
        
        @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
        }
        
        .info {
            margin-top: 20px;
            color: #00ffff;
        }
        
        .close-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            background: none;
            border: 2px solid #ff0000;
            color: #ff0000;
            padding: 5px 10px;
            cursor: pointer;
            font-family: 'Courier Prime', monospace;
            font-size: 14px;
        }
        
        .close-btn:hover {
            background-color: #ff0000;
            color: #000;
        }
        
        .dosbox-container {
            margin-top: 30px;
            border: 2px solid #00ff00;
            padding: 20px;
            background-color: rgba(0, 0, 0, 0.8);
        }
        
        .dosbox-title {
            color: #00ffff;
            margin-bottom: 10px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="dos-screen">
        <div class="terminal">
            <button class="close-btn" onclick="closeWindow()">X</button>
            
            <div class="header">
                <div class="ascii-art">
    ██████╗  ██████╗ ███████╗    ██████╗ ██████╗ ███████╗███████╗████████╗██╗███╗   ██╗ ██████╗ 
    ██╔══██╗██╔═══██╗██╔════╝    ██╔══██╗██╔══██╗██╔════╝██╔════╝╚══██╔══╝██║████╗  ██║██╔════╝ 
    ██║  ██║██║   ██║███████╗    ██████╔╝██████╔╝█████╗  █████╗     ██║   ██║██╔██╗ ██║██║  ███╗
    ██║  ██║██║   ██║╚════██║    ██╔══██╗██╔══██╗██╔══╝  ██╔══╝     ██║   ██║██║╚██╗██║██║   ██║
    ██████╔╝╚██████╔╝███████║    ██║  ██║██║  ██║███████╗███████╗   ██║   ██║██║ ╚████║╚██████╔╝
    ╚═════╝  ╚═════╝ ╚══════╝    ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚══════╝   ╚═╝   ╚═╝╚═╝  ╚═══╝ ╚═════╝ 
                </div>
                <div>DOS Greeting System v1.0</div>
            </div>
            
            <div class="greeting">
                👋 HELLO, ${name.toUpperCase()}!
            </div>
            
            <div class="info">
                <div>System ready.</div>
                <div>Express server running on port ${serverPort || 'unknown'}</div>
                <div>Perfect for integrating DOSBOX.js games and applications!</div>
            </div>
            
            <div class="dosbox-container">
                <div class="dosbox-title">DOSBOX.js Integration Ready</div>
                <div id="dosbox-mount">Ready to load DOS games...</div>
            </div>
            
            <div class="command-line">
                <div><span class="prompt">C:\\></span> greet ${name}</div>
                <div>Hello ${name}! Welcome to DOS Greeting!</div>
                <div><span class="prompt">C:\\></span> server running on localhost:${serverPort || 'unknown'}</div>
                <div><span class="prompt">C:\\></span> <span class="cursor">_</span></div>
            </div>
        </div>
    </div>
    
    <script>
        // Handle window close
        function closeWindow() {
            window.close();
        }
        
        // Add some interactivity
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeWindow();
            }
        });
        
        // Auto-close after 10 seconds
        setTimeout(() => {
            closeWindow();
        }, 10000);
        
        console.log('DOS Greeting System initialized');
        console.log('Server running on port:', ${serverPort || 'unknown'});
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

  // Serve static content
  app.get('/', (req, res) => {
    const name = req.query.name as string || 'User';
    res.send(createGreetingHTML(name));
  });

  // API endpoint for different names
  app.get('/greet/:name', (req, res) => {
    const name = req.params.name;
    res.send(createGreetingHTML(name));
  });

  // Start server
  globalServer = app.listen(port, () => { });

  serverPort = port;
  return port;
}

// Tool implementation
export default async function greet({ name }: InferSchema<typeof schema>) {
  try {
    const result = await suppressStdioAsync(async () => {
      // Start server if not already running
      const port = await startServer();

      // Open URL in Chrome
      const url = `http://localhost:${port}/greet/${encodeURIComponent(name)}`;
      await open(url, { app: { name: 'google chrome' } });

      return {
        content: [
          { type: "text", text: "opened window correctly" },
          { type: "text", text: `Server running on http://localhost:${port}` },
          { type: "text", text: `Opened: ${url}` }
        ],
      };
    });

    return result;
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error opening window` }],
      isError: true,
    };
  }
}
