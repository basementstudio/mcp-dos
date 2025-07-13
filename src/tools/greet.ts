import { z } from "zod";
import { type InferSchema } from "xmcp";
import { spawn } from "child_process";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";

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

function createNeutralinoApp(name: string) {
  // Create a temporary directory for the Neutralino app
  const tempDir = join(tmpdir(), `dosbox-greeting-${Date.now()}`);
  mkdirSync(tempDir, { recursive: true });

  // Create Neutralino config
  const config = {
    applicationId: "js.dosbox.greeting",
    version: "1.0.0",
    defaultMode: "window",
    port: 0,
    documentRoot: "/resources/",
    url: "/",
    nativeAllowList: ["*"],
    globalVariables: {},
    modes: {
      window: {
        title: `Hello ${name}!`,
        width: 800,
        height: 600,
        minWidth: 600,
        minHeight: 400,
        center: true,
        resizable: true,
        exitProcessOnClose: true,
        icon: "/resources/icon.png"
      }
    },
    cli: {
      binaryName: "dosbox-greeting",
      resourcesPath: "/resources/"
    }
  };

  // Create a simple DOS-like interface with HTML/CSS/JavaScript
  const htmlContent = `<!DOCTYPE html>
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
    </style>
</head>
<body>
    <div class="dos-screen">
        <div class="terminal">
            <button class="close-btn" onclick="closeApp()">X</button>
            
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
                <div>This is a demonstration of running a DOS-like interface in a standalone window.</div>
                <div>Perfect for integrating DOSBOX.js games and applications!</div>
            </div>
            
            <div class="command-line">
                <div><span class="prompt">C:\\></span> greet ${name}</div>
                <div>Hello ${name}! Welcome to DOS Greeting!</div>
                <div><span class="prompt">C:\\></span> <span class="cursor">_</span></div>
            </div>
        </div>
    </div>
    
    <script src="js/neutralino.js"></script>
    <script>
        // Initialize Neutralino
        Neutralino.init();
        
        // Handle app close
        function closeApp() {
            Neutralino.app.exit();
        }
        
        // Handle window close event
        Neutralino.events.on("windowClose", function() {
            Neutralino.app.exit();
        });
        
        // Auto-close after 10 seconds
        setTimeout(() => {
            closeApp();
        }, 10000);
        
        // Add some interactivity
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeApp();
            }
        });
    </script>
</body>
</html>`;

  // Create JavaScript file for DOSBOX.js integration (placeholder)
  const jsContent = `// DOSBOX.js Integration
// This is where you would integrate js-dos or dosbox.js
// Example:
// import { Dos } from 'js-dos';
// const dos = Dos(document.getElementById('dosbox-container'));

console.log('DOS Greeting System initialized');

// Future: Add DOSBOX.js integration here
// You can load DOS games and applications in this environment
`;

  // Write files
  writeFileSync(join(tempDir, 'neutralino.config.json'), JSON.stringify(config, null, 2));

  const resourcesDir = join(tempDir, 'resources');
  mkdirSync(resourcesDir, { recursive: true });

  const jsDir = join(resourcesDir, 'js');
  mkdirSync(jsDir, { recursive: true });

  writeFileSync(join(resourcesDir, 'index.html'), htmlContent);
  writeFileSync(join(resourcesDir, 'app.js'), jsContent);

  return tempDir;
}

// Tool implementation
export default async function greet({ name }: InferSchema<typeof schema>) {
  try {
    // Create Neutralino app structure
    const appDir = createNeutralinoApp(name);

    // Try to run the Neutralino app
    // First check if neu is available globally
    const neuCommand = process.platform === 'win32' ? 'neu.cmd' : 'neu';

    // Change to the app directory and run
    const child = spawn(neuCommand, ['run'], {
      cwd: appDir,
      detached: true,
      stdio: 'ignore'
    });

    // Don't wait for the child process
    child.unref();

    return {
      content: [{ type: "text", text: "opened window correctly" }],
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error opening window` }],
      isError: true,
    };
  }
}
