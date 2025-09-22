# vite-plugin-react-devtools

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![JSDocs][jsdocs-src]][jsdocs-href]
[![License][license-src]][license-href]

🚀 **The next iteration of React DevTools** - A powerful Vite plugin that brings React DevTools directly into your development workflow with advanced debugging capabilities, source code navigation, and performance analysis.

## ✨ Features Overview

### 🔍 **Core Debugging Features**
- **🌳 Component Tree Inspector** - Real-time React component hierarchy visualization with search and filtering
- **🔧 Props & State Inspector** - View and edit component props, state, and hooks in real-time
- **🪝 Advanced Hooks Debugging** - Inspect useState, useEffect, useContext, and custom hooks with dependency tracking
- **📝 Source Code Navigation** - Click-to-source functionality with multi-editor support (VS Code, WebStorm, Sublime, etc.)

### ⚡ **Performance & Analysis**
- **📊 React Profiler Integration** - Component rendering performance analysis with flame graphs
- **🔄 Re-render Tracking** - Highlight and analyze component re-renders with reason detection
- **⏱️ Time Travel Debugging** - State history recording with rollback and replay capabilities
- **🎯 Performance Bottleneck Detection** - Identify slow components and optimization opportunities

### 🛠️ **Developer Experience**
- **🔌 WebSocket Communication** - Real-time updates without page refresh
- **🔥 Hot Module Replacement** - Deep integration with Vite's HMR system
- **🎨 Advanced Theming** - Light/dark themes with system sync and customization
- **🔍 Smart Search & Filter** - Quickly find components in large applications
- **🚀 Zero Configuration** - Works out of the box with intelligent defaults

### 🎯 **Vite Integration**
- **⚡ Native Vite Plugin** - Built specifically for Vite with optimal performance
- **🏗️ Development Focused** - Automatically disabled in production builds
- **📦 Lightweight** - Minimal impact on development server performance
- **🗺️ Source Map Integration** - Accurate line-by-line navigation with TypeScript support

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

## 📝 Source Code Navigation

### Overview

The source navigation feature allows you to quickly jump from React components in the DevTools to their source code in your editor. This dramatically speeds up debugging and development workflows.

### Features

- **Click-to-Source**: Click the 📝 button next to any component to open its source file
- **Multi-Editor Support**: Works with VS Code, WebStorm, Sublime Text, Atom, Vim, Emacs, and more
- **Smart Path Resolution**: Automatically finds component files using common naming patterns
- **Line-Accurate Navigation**: Opens files at the exact line where the component is defined
- **Zero Configuration**: Works out of the box with sensible defaults

### Supported Editors

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

### Editor Setup

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

### Usage

1. **Component Tree Navigation**:
   - Open React DevTools by clicking the ⚛️ button
   - Navigate to the "Components" tab
   - Find the component you want to inspect
   - Click the 📝 button next to the component name
   - Your editor will open with the component's source file

2. **Props Inspector Navigation**:
   - Select a component in the component tree
   - In the props inspector panel, click the 📝 button in the component header
   - The component's source file will open in your editor

### Troubleshooting

#### Editor Not Opening

1. **Check if editor is in PATH**:
   ```bash
   # Test if your editor command works
   code --version
   webstorm --version
   subl --version
   ```

2. **Verify editor configuration**:
   ```typescript
   reactDevTools({
     launchEditor: 'code', // Make sure this matches your editor
   })
   ```

3. **Check console for errors**: Open browser DevTools and look for error messages.

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

## 🚧 Roadmap & Feature Status

### Phase 1: Core Features ✅ **COMPLETED**
- [x] **Component Tree Inspector** - Real-time React component hierarchy visualization
- [x] **Props & State Inspector** - View and edit component props and state
- [x] **Hooks Debugging** - Inspect useState, useEffect, and custom hooks
- [x] **Source Code Navigation** - Click-to-source with multi-editor support
- [x] **WebSocket Communication** - Real-time updates without page refresh
- [x] **Basic Theme Support** - Light/dark themes with system sync

### Phase 2: Performance Features 🚧 **IN PROGRESS**
- [ ] **React Profiler Integration** - Component rendering performance analysis
- [ ] **Re-render Tracking** - Highlight and analyze component re-renders
- [ ] **Performance Bottleneck Detection** - Identify slow components
- [ ] **Flame Graph Visualization** - Visual performance analysis
- [ ] **Render Timing Statistics** - Detailed timing information

### Phase 3: Advanced Features 📋 **PLANNED**
- [ ] **Time Travel Debugging** - State history recording with rollback
- [ ] **Component Snapshots** - Save and compare component states
- [ ] **HMR Deep Integration** - Enhanced Hot Module Replacement
- [ ] **Console Integration** - Access selected component via `$r`
- [ ] **Network Request Tracking** - API calls associated with components

### Phase 4: UI/UX Enhancements 🎨 **PLANNED**
- [ ] **Advanced Theming** - Custom color schemes and theme editor
- [ ] **Layout Customization** - Adjustable panels and multiple layouts
- [ ] **Keyboard Shortcuts** - Full keyboard navigation support
- [ ] **Search & Filter Enhancements** - Advanced component filtering
- [ ] **Export/Import** - Save and share debugging sessions

### Phase 5: Extensibility 🔌 **PLANNED**
- [ ] **Plugin System** - Third-party plugin support
- [ ] **Custom Inspectors** - User-defined component inspectors
- [ ] **API Extensions** - Extensible DevTools API
- [ ] **Integration Ecosystem** - Redux, Zustand, React Query support

## 🏗️ Development Guide

### Project Architecture

```
vite-plugin-react-devtools/
├── src/
│   ├── index.ts              # Main plugin entry point
│   ├── types.ts              # TypeScript type definitions
│   ├── react-detector.ts     # React component detection utilities
│   ├── source-navigation.ts  # Source code navigation functionality
│   └── ui.ts                # DevTools UI components
├── example/                 # Example React app for testing
├── docs/                    # Documentation
├── test/                    # Test files
└── package.json            # Plugin dependencies
```

### Core Components

#### 1. Main Plugin (`src/index.ts`)
- Sets up WebSocket server for DevTools communication
- Injects client script into the browser
- Handles plugin lifecycle and configuration
- Manages source navigation integration

#### 2. React Detection (`src/react-detector.ts`)
- Accesses React's internal DevTools hook
- Converts Fiber nodes to our component format
- Extracts component hierarchy, props, state, and hooks
- Integrates with React's lifecycle events

#### 3. Source Navigation (`src/source-navigation.ts`)
- Multi-editor support (VS Code, WebStorm, Sublime, etc.)
- Smart path resolution for component files
- Launches editors with accurate line numbers
- Integrates with Vite's source maps

#### 4. UI Components (`src/ui.ts`)
- Creates the main DevTools panel interface
- Renders component tree visualization
- Implements props/state/hooks inspector
- Manages floating toggle button and interactions

### Communication Flow

The plugin uses a WebSocket-based architecture for real-time communication:

1. **Plugin Setup**: Vite plugin creates WebSocket server on specified port
2. **Client Injection**: Browser receives DevTools client script via HTML transformation
3. **React Integration**: Client hooks into React's internal DevTools hook
4. **Data Flow**: Component data flows through WebSocket to DevTools UI
5. **User Interaction**: UI sends commands (select component, open source) back to React app

### Development Workflow

#### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm/yarn
- A React project for testing

#### Setup Development Environment

1. **Clone and Install**
   ```bash
   git clone https://github.com/Sunny-117/vite-plugin-react-devtools.git
   cd vite-plugin-react-devtools
   pnpm install
   ```

2. **Start Development**
   ```bash
   # Build plugin in watch mode
   pnpm dev

   # In another terminal, run example app
   cd example
   pnpm install
   pnpm dev
   ```

3. **Test the Plugin**
   - Navigate to `http://localhost:3000`
   - Click the ⚛️ button to open DevTools
   - Test component inspection and source navigation

#### Testing Strategy

**Unit Tests**
```bash
pnpm test              # Run unit tests
pnpm test --watch      # Watch mode
pnpm typecheck         # Type checking
```

**Integration Tests**
- Use the example app to test all features
- Test with different React patterns (hooks, classes, memo, etc.)
- Verify WebSocket communication and error handling
- Test source navigation with different editors

**Manual Testing Checklist**
- [ ] Component tree renders correctly
- [ ] Props/state inspection works
- [ ] Source navigation opens correct files
- [ ] WebSocket connection is stable
- [ ] UI responds to component changes
- [ ] Search and filtering work
- [ ] Theme switching functions properly

## 📋 Complete Feature List

### 🔍 **Core Debugging Features**

#### Component Tree Inspector ✅
- [x] Display React component hierarchy in real-time
- [x] Component search and filtering functionality
- [x] Show component names, props, state, and hooks
- [x] Component selection and highlighting
- [x] Expand/collapse component tree nodes
- [x] Component type indicators (functional/class/memo/etc.)

#### Props and State Inspector ✅
- [x] Real-time props viewing and editing
- [x] Real-time state viewing and editing
- [x] Support for complex data types (objects, arrays, functions)
- [x] JSON-like expandable tree view
- [x] Type information display
- [ ] Value change highlighting
- [ ] Inline editing capabilities

#### Source Code Navigation ✅
- [x] Click component to jump to source code
- [x] Support multiple editors (VS Code, WebStorm, Sublime, etc.)
- [x] Smart path resolution for components
- [x] Line number accuracy
- [x] Integration with Vite's source maps

#### Basic Theme Support ✅
- [x] Light/dark theme toggle
- [x] Sync with system theme preference
- [x] Basic color scheme customization
- [x] Consistent styling with Vite dev server

### ⚡ **Performance Features**

#### React Profiler Integration 📋
- [ ] Component rendering performance analysis
- [ ] Render timing statistics
- [ ] Flame graph visualization
- [ ] Performance bottleneck identification
- [ ] Commit phase analysis
- [ ] Interaction tracking

#### Re-render Tracking 📋
- [ ] Highlight components that re-render
- [ ] Analyze re-render reasons (props/state changes)
- [ ] Render frequency statistics
- [ ] Performance impact assessment
- [ ] Re-render cascade visualization

#### Hooks Debugging ✅
- [x] Display all hooks with current values
- [x] useState, useEffect, useContext detailed info
- [x] Custom hooks debugging support
- [ ] Hook dependency tracking
- [ ] Hook call order visualization
- [ ] useDebugValue integration

### 🛠️ **Advanced Features**

#### Time Travel Debugging 📋
- [ ] State history recording
- [ ] State rollback functionality
- [ ] Action replay system
- [ ] Timeline visualization
- [ ] Snapshot comparison
- [ ] Undo/redo operations

#### HMR Integration 📋
- [ ] Deep integration with Vite HMR
- [ ] Module update visualization
- [ ] Dependency graph display
- [ ] Preserve DevTools state during HMR
- [ ] Smart component state recovery

#### Console Integration 📋
- [ ] Access selected component via `$r`
- [ ] Expose component methods as global variables
- [ ] Debug helper functions
- [ ] Console logging integration
- [ ] Error boundary integration

### 🎨 **UI/UX Enhancements**

#### Advanced Theming 📋
- [ ] Custom color schemes
- [ ] Theme editor interface
- [ ] Import/export themes
- [ ] Component-specific styling
- [ ] Animation preferences

#### Layout Customization 📋
- [ ] Adjustable panel sizes
- [ ] Multiple layout modes (sidebar, bottom panel, popup)
- [ ] Dockable panels
- [ ] Full-screen mode
- [ ] Multi-monitor support

#### Keyboard Shortcuts 📋
- [ ] Component navigation shortcuts
- [ ] Search shortcuts
- [ ] Panel switching shortcuts
- [ ] Quick actions
- [ ] Customizable key bindings

### 🔌 **Extensibility**

#### Plugin System 📋
- [ ] Third-party plugin support
- [ ] Plugin marketplace
- [ ] Custom inspector plugins
- [ ] Theme plugins
- [ ] Integration plugins

#### API Extensions 📋
- [ ] Public DevTools API
- [ ] Custom message types
- [ ] Event system
- [ ] Plugin lifecycle hooks
- [ ] Configuration API

#### Integration Ecosystem 📋
- [ ] Redux DevTools integration
- [ ] Zustand store inspection
- [ ] React Query cache visualization
- [ ] React Router navigation tracking
- [ ] Context API visualization

### 📱 **Mobile & Responsive**

#### Mobile Support 📋
- [ ] Touch-friendly interface
- [ ] Mobile layout optimization
- [ ] Gesture support
- [ ] Responsive design
- [ ] Mobile debugging features

#### Remote Debugging 📋
- [ ] Remote device connection
- [ ] Network debugging
- [ ] Mobile app integration
- [ ] Cross-platform support
- [ ] Cloud debugging

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Ways to Contribute

- 🐛 **Bug Reports**: Found a bug? [Open an issue](https://github.com/Sunny-117/vite-plugin-react-devtools/issues)
- 💡 **Feature Requests**: Have an idea? [Start a discussion](https://github.com/Sunny-117/vite-plugin-react-devtools/discussions)
- 📝 **Documentation**: Improve docs, add examples, write guides
- 🔧 **Code**: Fix bugs, implement features, improve performance
- 🎨 **Design**: UI/UX improvements, themes, icons

### Development Setup

```bash
# Clone the repository
git clone https://github.com/Sunny-117/vite-plugin-react-devtools.git
cd vite-plugin-react-devtools

# Install dependencies
pnpm install

# Start development
pnpm dev

# Run tests
pnpm test

# Build the plugin
pnpm build

# Lint and format
pnpm lint
pnpm format
```

### Contribution Guidelines

1. **Fork the repository** and create a feature branch
2. **Write tests** for new functionality
3. **Follow the coding style** (ESLint + Prettier)
4. **Update documentation** as needed
5. **Submit a pull request** with a clear description

### Code Style

- Use TypeScript for all new code
- Follow the existing ESLint configuration
- Add JSDoc comments for public APIs
- Write tests for new functionality
- Keep commits atomic and well-described

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
