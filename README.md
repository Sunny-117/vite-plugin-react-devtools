# vite-plugin-react-devtools

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![JSDocs][jsdocs-src]][jsdocs-href]
[![License][license-src]][license-href]

🚀 **The next iteration of React DevTools** - A powerful Vite plugin that brings React DevTools directly into your development workflow.

## ✨ Features

### 🔍 **Core Debugging Features**
- **Component Tree Inspector** - Real-time React component hierarchy visualization
- **Props & State Inspector** - View and edit component props and state in real-time
- **Hooks Debugging** - Inspect useState, useEffect, and custom hooks
- **Source Code Navigation** - Click components to jump directly to source code

### ⚡ **Performance & Developer Experience**
- **WebSocket Communication** - Real-time updates without page refresh
- **Hot Module Replacement** - Seamless integration with Vite's HMR
- **Theme Support** - Light/dark themes with system sync
- **Search & Filter** - Quickly find components in large applications

### 🎯 **Vite Integration**
- **Zero Configuration** - Works out of the box with any React + Vite project
- **Development Focused** - Automatically disabled in production builds
- **Lightweight** - Minimal performance impact on your development server

## 📦 Installation

```bash
# npm
npm install vite-plugin-react-devtools --save-dev

# pnpm
pnpm add -D vite-plugin-react-devtools

# yarn
yarn add -D vite-plugin-react-devtools
```

## 🚀 Quick Start

### Basic Usage

Add the plugin to your `vite.config.js` or `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import reactDevTools from 'vite-plugin-react-devtools'

export default defineConfig({
  plugins: [
    react(),
    reactDevTools(), // Add this line
  ],
})
```

That's it! Start your development server and you'll see a React logo button in the top-right corner of your app.

### With Custom Configuration

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import reactDevTools from 'vite-plugin-react-devtools'

export default defineConfig({
  plugins: [
    react(),
    reactDevTools({
      port: 8097, // WebSocket port (default: 8097)
      componentInspector: true, // Enable component inspector (default: true)
      launchEditor: 'code', // Editor for source navigation (default: 'code')
      enableInProduction: false, // Enable in production (default: false)
    }),
  ],
})
```

## 🎮 Usage

### Opening DevTools

1. **Toggle Button**: Click the ⚛️ button in the top-right corner of your app
2. **Keyboard Shortcut**: Press `Ctrl+Shift+D` (coming soon)
3. **Programmatically**: Use `window.__REACT_DEVTOOLS_UI__.open()`

### Component Tree Navigation

- **Expand/Collapse**: Click the ▶/▼ arrows next to components
- **Select Component**: Click on any component name to inspect it
- **Search**: Use the search box to filter components by name
- **Props Preview**: See a quick preview of component props inline

### Props & State Inspection

- **Real-time Updates**: Props and state update automatically as your app changes
- **Nested Objects**: Expandable tree view for complex data structures
- **Type Information**: Clear indication of data types (string, number, function, etc.)
- **Edit Values**: Click on values to edit them directly (coming soon)

### Hooks Debugging

- **Hook List**: See all hooks used by the selected component
- **Hook Values**: Current values of useState, useReducer, etc.
- **Dependencies**: View useEffect and useMemo dependencies
- **Custom Hooks**: Debug your custom hooks with detailed information

## ⚙️ Configuration Options

```ts
// eslint-disable-next-line ts/no-unused-vars
interface ReactDevToolsOptions {
  /**
   * Port for the DevTools WebSocket server
   * @default 8097
   */
  port?: number

  /**
   * Enable component inspector
   * @default true
   */
  componentInspector?: boolean

  /**
   * Target editor when opening source files
   * @default 'code'
   */
  launchEditor?: 'code' | 'code-insiders' | 'webstorm' | 'atom' | 'sublime' | 'vim' | string

  /**
   * Enable React DevTools in production
   * @default false
   */
  enableInProduction?: boolean
}
```

### Supported Editors

- **VS Code**: `'code'` (default)
- **VS Code Insiders**: `'code-insiders'`
- **WebStorm**: `'webstorm'`
- **Atom**: `'atom'`
- **Sublime Text**: `'sublime'`
- **Vim**: `'vim'`
- **Custom**: Provide your own editor command

## 🔧 Advanced Usage

### Programmatic API

```javascript
// Open DevTools
window.__REACT_DEVTOOLS_UI__.open()

// Close DevTools
window.__REACT_DEVTOOLS_UI__.close()

// Toggle DevTools
window.__REACT_DEVTOOLS_UI__.toggle()

// Send custom message to DevTools
window.__REACT_DEVTOOLS__.send({
  type: 'CUSTOM_MESSAGE',
  data: { /* your data */ }
})
```

### Integration with Testing

```javascript
// In your test setup
beforeEach(() => {
  // Ensure DevTools is available in tests
  if (window.__REACT_DEVTOOLS_UI__) {
    window.__REACT_DEVTOOLS_UI__.close()
  }
})
```

## 🎨 Theming

The DevTools UI automatically adapts to your system theme (light/dark). You can also manually control the theme:

```javascript
// Set theme (coming soon)
window.__REACT_DEVTOOLS_UI__.setTheme('dark') // 'light' | 'dark' | 'auto'
```

## 🔍 Troubleshooting

### DevTools Not Appearing

1. **Check React Version**: Ensure you're using React 16.8+ with hooks support
2. **Verify Plugin Order**: Make sure `reactDevTools()` comes after `react()` in your plugins array
3. **Check Console**: Look for connection messages in the browser console
4. **Port Conflicts**: Try changing the port if 8097 is already in use

### Performance Issues

1. **Large Component Trees**: Use the search feature to filter components
2. **Frequent Updates**: The DevTools refresh every second when open
3. **Production Mode**: Ensure the plugin is disabled in production builds

### WebSocket Connection Issues

```bash
# Check if port is available
netstat -an | grep 8097

# Try a different port
reactDevTools({ port: 8098 })
```

## 🚧 Roadmap

### Phase 1 (Current) ✅
- [x] Component tree inspector
- [x] Props and state inspection
- [x] Basic WebSocket communication
- [x] Toggle UI

### Phase 2 (In Progress) 🚧
- [ ] React Profiler integration
- [ ] Re-render tracking
- [ ] Advanced hooks debugging
- [ ] Source code navigation

### Phase 3 (Planned) 📋
- [ ] Time travel debugging
- [ ] Component snapshots
- [ ] Performance analysis
- [ ] Plugin system

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/Sunny-117/vite-plugin-react-devtools.git

# Install dependencies
pnpm install

# Start development
pnpm dev

# Run tests
pnpm test

# Build the plugin
pnpm build
```

## 📄 License

[MIT](./LICENSE) License © 2024-PRESENT [Sunny-117](https://github.com/Sunny-117)

## 🙏 Acknowledgments

- Inspired by the official [React DevTools](https://github.com/facebook/react/tree/main/packages/react-devtools)
- Built with [Vite](https://vitejs.dev/) plugin architecture
- UI design inspired by modern developer tools

---

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/vite-plugin-react-devtools?style=flat&colorA=080f12&colorB=1fa669
[npm-version-href]: https://npmjs.com/package/vite-plugin-react-devtools
[npm-downloads-src]: https://img.shields.io/npm/dm/vite-plugin-react-devtools?style=flat&colorA=080f12&colorB=1fa669
[npm-downloads-href]: https://npmjs.com/package/vite-plugin-react-devtools
[bundle-src]: https://img.shields.io/bundlephobia/minzip/vite-plugin-react-devtools?style=flat&colorA=080f12&colorB=1fa669&label=minzip
[bundle-href]: https://bundlephobia.com/result?p=vite-plugin-react-devtools
[license-src]: https://img.shields.io/github/license/Sunny-117/vite-plugin-react-devtools.svg?style=flat&colorA=080f12&colorB=1fa669
[license-href]: https://github.com/Sunny-117/vite-plugin-react-devtools/blob/main/LICENSE
[jsdocs-src]: https://img.shields.io/badge/jsdocs-reference-080f12?style=flat&colorA=080f12&colorB=1fa669
[jsdocs-href]: https://www.jsdocs.io/package/vite-plugin-react-devtools
