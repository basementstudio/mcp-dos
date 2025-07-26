# MCP DOS - Classic DOS Gaming Server

<a href="https://cursor.com/install-mcp?name=mcp-dos&config=ew0KICAgICAgInR5cGUiOiAic3RkaW8iLA0KICAgICAgImNvbW1hbmQiOiAibnB4IiwNCiAgICAgICJhcmdzIjogWw0KICAgICAgICAiLXkiLA0KICAgICAgICAibWNwLWRvc0BsYXRlc3QiDQogICAgICBdLA0KICAgICAgImVudiI6IHt9DQp9"><img src="https://cursor.com/deeplink/mcp-install-dark.svg" alt="Add mcp-dos MCP server to Cursor" height="32" /></a>

<a href="https://glama.ai/mcp/servers/@basementstudio/mcp-dos">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/@basementstudio/mcp-dos/badge" alt="DOS - Classic DOS Gaming Server MCP server" />
</a>

A Model Context Protocol (MCP) server that provides access to classic DOS games through js-dos emulation. Play legendary games like DOOM, Super Mario, Tetris, and Duke Nukem 3D directly from your AI assistant.

## Features

- **Classic DOS Games**: Play iconic DOS games including DOOM, Super Mario, Tetris, and Duke Nukem 3D
- **Web-based Emulation**: Uses js-dos for authentic DOS gaming experience in the browser
- **Fullscreen Support**: Enjoy games in fullscreen mode with proper controls
- **Keyboard Mapping**: Pre-configured key mappings for each game with on-screen controls
- **Server Management**: Tools to start, stop, and manage the gaming server

## Available Games

- **DOOM** (`doom`) - The legendary first-person shooter
- **Super Mario** (`super-mario`) - Classic platformer adventure
- **Tetris** (`tetris`) - The timeless puzzle game
- **Duke Nukem 3D** (`duke3d`) - Action-packed FPS adventure

## Getting Started

Add this server to your MCP client configuration:

```json
{
  "mcpServers": {
    "mcp-dos": {
      "command": "npx",
      "args": ["-y", "mcp-dos"]
    }
  }
}
```

## Game Controls

Each game comes with pre-configured controls displayed on screen:

### DOOM
- **Arrow Keys**: Movement (Forward/Back/Left/Right)
- **W**: Use
- **S**: Fire
- **A/D**: Strafe left/right
- **Enter**: Menu navigation

### Super Mario
- **Arrow Left/Right**: Movement
- **Alt**: Jump

### Tetris
- **7/8**: Move left/right
- **9**: Rotate piece
- **Space**: Drop piece
- **Enter**: Menu navigation

### Duke Nukem 3D
- **Arrow Keys**: Movement
- **Ctrl**: Fire
- **A**: Jump
- **Enter**: Menu navigation

## Tools Available

### 1. `List DOS Games`
Lists all available DOS games that can be played through the server.

**Returns:**
- Array of available game slugs
- Instructions on how to play games using the `open-dos` tool

### 2. `open-dos`
Opens and plays a specific DOS game using js-dos emulation in a browser window.

**Parameters:**
- `game` (string): DOS game slug to play (e.g., 'doom', 'super-mario', 'tetris', 'duke3d')

**Features:**
- Launches game in a new browser window
- Displays game-specific controls on screen
- Fullscreen support
- Authentic DOS gaming experience

### 3. `close-app`
Closes an existing running mcp-dos server instance.

**Parameters:**
- `port` (number): The port number of the server to close

**Use Cases:**
- Clean up server instances
- Resolve port conflicts
- Server maintenance

## Development

```bash
# Install dependencies
pnpm install

# Build the project
pnpm build

# Run the server
pnpm start
```

## Requirements

- Node.js ≥20.0.0
- Modern web browser with JavaScript enabled
- Internet connection for js-dos CDN resources

> This project is built using the [xmcp](https://xmcp.dev) framework.