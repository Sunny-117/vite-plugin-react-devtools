# Source Code Navigation Guide

This guide explains how to use the source code navigation feature in the React DevTools Vite plugin.

## 🚀 Overview

The source navigation feature allows you to quickly jump from React components in the DevTools to their source code in your editor. This dramatically speeds up debugging and development workflows.

## ✨ Features

- **Click-to-Source**: Click the 📝 button next to any component to open its source file
- **Multi-Editor Support**: Works with VS Code, WebStorm, Sublime Text, Atom, Vim, Emacs, and more
- **Smart Path Resolution**: Automatically finds component files using common naming patterns
- **Line-Accurate Navigation**: Opens files at the exact line where the component is defined
- **Zero Configuration**: Works out of the box with sensible defaults

## 🛠️ Setup

### 1. Configure Your Editor

Add the `launchEditor` option to your Vite config:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import reactDevTools from 'vite-plugin-react-devtools'

export default defineConfig({
  plugins: [
    react(),
    reactDevTools({
      launchEditor: 'code', // Your preferred editor
    }),
  ],
})
```

### 2. Supported Editors

| Editor | Configuration Value | Command |
|--------|-------------------|---------|
| Visual Studio Code | `'code'` | `code` |
| VS Code Insiders | `'code-insiders'` | `code-insiders` |
| WebStorm | `'webstorm'` | `webstorm` |
| IntelliJ IDEA | `'idea'` | `idea` |
| Sublime Text | `'sublime'` | `subl` |
| Atom | `'atom'` | `atom` |
| Vim | `'vim'` | `vim` |
| Emacs | `'emacs'` | `emacs` |

### 3. Editor Installation

Make sure your editor's command-line tool is installed and available in your PATH:

#### VS Code
```bash
# Install VS Code command line tools
# On macOS: Cmd+Shift+P → "Shell Command: Install 'code' command in PATH"
# On Windows/Linux: Usually installed automatically
```

#### WebStorm
```bash
# Add WebStorm to PATH
# Tools → Create Command-line Launcher
```

#### Sublime Text
```bash
# Create symlink (macOS/Linux)
ln -s "/Applications/Sublime Text.app/Contents/SharedSupport/bin/subl" /usr/local/bin/subl
```

## 🎯 Usage

### 1. Component Tree Navigation

1. Open React DevTools by clicking the ⚛️ button
2. Navigate to the "Components" tab
3. Find the component you want to inspect
4. Click the 📝 button next to the component name
5. Your editor will open with the component's source file

### 2. Props Inspector Navigation

1. Select a component in the component tree
2. In the props inspector panel, click the 📝 button in the component header
3. The component's source file will open in your editor

### 3. Keyboard Shortcuts

- **Click + Ctrl/Cmd**: Open source in a new editor window (if supported)
- **Right-click**: Context menu with additional options (planned feature)

## 🔧 Advanced Configuration

### Custom Editor Commands

You can extend the plugin to support custom editors:

```typescript
// In your vite.config.ts
reactDevTools({
  launchEditor: 'custom-editor',
  // Custom editor configuration would be added here
})
```

### Project Structure Support

The plugin automatically searches for components in common directories:

- `src/`
- `app/`
- `components/`

And supports common file patterns:

- `ComponentName.tsx`
- `ComponentName.jsx`
- `ComponentName/index.tsx`
- `ComponentName/index.jsx`

### Source Maps Integration

The plugin integrates with Vite's source maps to provide accurate line numbers, even for:

- TypeScript files
- JSX/TSX files
- Files processed by build tools

## 🐛 Troubleshooting

### Editor Not Opening

1. **Check if editor is in PATH**:
   ```bash
   # Test if your editor command works
   code --version
   webstorm --version
   subl --version
   ```

2. **Verify editor configuration**:
   ```typescript
   // Make sure the editor name matches exactly
   reactDevTools({
     launchEditor: 'code', // Not 'vscode' or 'vs-code'
   })
   ```

3. **Check console for errors**:
   Open browser DevTools and look for error messages in the console.

### File Not Found

1. **Component not detected**: The plugin uses React's internal fiber tree to detect components. Make sure your component is properly mounted.

2. **File path resolution**: If the automatic path resolution fails, the plugin will log warnings in the console.

3. **Source maps**: Ensure source maps are enabled in your Vite config:
   ```typescript
   export default defineConfig({
     build: {
       sourcemap: true, // Enable source maps
     },
   })
   ```

### Permission Issues

On some systems, you might need to grant permissions:

```bash
# macOS: Allow terminal access to editors
# System Preferences → Security & Privacy → Privacy → Developer Tools
```

## 🚀 Performance Tips

1. **Editor Startup**: Some editors (like WebStorm) may take time to start. Consider keeping them open during development.

2. **File Watching**: Modern editors with file watching will automatically refresh when files change.

3. **Multiple Projects**: If working with multiple projects, ensure the correct project is open in your editor.

## 🔮 Planned Features

- **Context Menu**: Right-click components for additional options
- **Multiple File Support**: Open related files (tests, styles, etc.)
- **Editor Preferences**: Per-project editor configuration
- **Remote Development**: Support for remote editors and containers
- **Source Map Enhancement**: Better integration with complex build setups

## 📚 API Reference

### Configuration Options

```typescript
interface SourceNavigationOptions {
  launchEditor?: string          // Editor command name
  projectRoot?: string          // Project root directory (auto-detected)
  searchDirs?: string[]         // Directories to search for components
  filePatterns?: string[]       // File naming patterns to try
}
```

### Message Types

The plugin uses these WebSocket message types for source navigation:

- `OPEN_SOURCE`: Request to open a component's source
- `GET_AVAILABLE_EDITORS`: Request list of available editors
- `AVAILABLE_EDITORS`: Response with available editors

## 🤝 Contributing

Found a bug or want to add support for a new editor? Check out our [Contributing Guide](../CONTRIBUTING.md)!

## 📄 License

This feature is part of the React DevTools Vite Plugin, licensed under MIT.
