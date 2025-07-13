# MCP DOS

A Model Context Protocol (MCP) server that opens DOS-like applications in standalone desktop windows.

## Features

- **Lightweight Desktop Windows**: Uses Neutralino.js (~2MB bundle) instead of heavy Electron
- **Full HTML/CSS/JavaScript Support**: Perfect for integrating DOSBOX.js games and applications
- **Cross-platform**: Works on Windows, macOS, and Linux
- **No Chrome dependency**: Uses system's native webview

## Setup

1. **Install Dependencies**:
   ```bash
   pnpm install
   ```

2. **Install Neutralino CLI globally** (required for running desktop apps):
   ```bash
   npm install -g @neutralinojs/neu
   ```

3. **Build the project**:
   ```bash
   pnpm build
   ```

## Usage

The `greet` tool demonstrates how to create a DOS-like interface in a standalone window:

```bash
# Run the MCP server
pnpm start

# The greet tool will create a DOS-style greeting window
```

## DOSBOX.js Integration

This setup is **perfect for DOSBOX.js** applications! The generated HTML structure includes:

- **DOS-like styling** with green terminal colors
- **Full JavaScript support** for loading DOS games
- **Keyboard handling** for DOS applications
- **Standalone window** that doesn't open the user's browser

### To integrate DOSBOX.js:

1. Add js-dos or dosbox.js to your HTML
2. Create a DOS container element
3. Load your DOS games/applications
4. Everything runs in a true desktop window!

## Why Neutralino.js?

- ✅ **Lightweight**: ~2MB vs ~100MB for Electron
- ✅ **System webview**: No Chrome bundling
- ✅ **True desktop apps**: Not browser tabs
- ✅ **HTML/CSS/JS support**: Perfect for web-based DOS emulators
- ✅ **Cross-platform**: Windows, macOS, Linux

## Development

The main tool is in `src/tools/greet.ts`. It creates a complete Neutralino.js app structure with:

- `neutralino.config.json` - App configuration
- `resources/index.html` - DOS-like interface
- `resources/app.js` - JavaScript for DOS integration
- Proper styling for retro DOS appearance

## Next Steps

1. **Add DOSBOX.js**: Integrate js-dos library for running DOS games
2. **File system access**: Use Neutralino's file APIs for loading DOS files
3. **Game library**: Create a DOS game launcher interface
4. **Save states**: Implement game save/load functionality

Perfect foundation for building a DOS gaming platform! 🎮
