import { createServer } from 'node:http'
import type { Plugin } from 'vite'
import type { WebSocket } from 'ws'
import { WebSocketServer } from 'ws'
import { launchEditor, detectAvailableEditors, createSourceNavigationHandler } from './source-navigation'

export interface ReactDevToolsOptions {
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

interface DevToolsState {
  wss?: WebSocketServer
  clients: Set<WebSocket>
  componentTree?: any
}

const devToolsState: DevToolsState = {
  clients: new Set(),
}

// Global state for source navigation
let globalProjectRoot = ''
let globalEditorName = 'code'
let globalSourceNavigationHandler: ReturnType<typeof createSourceNavigationHandler> | null = null

/**
 * Vite plugin for React DevTools integration
 */
export function reactDevTools(options: ReactDevToolsOptions = {}): Plugin {
  const {
    port = 8097,
    componentInspector: _componentInspector = true,
    launchEditor: editorName = 'code',
    enableInProduction = false,
  } = options

  let isProduction = false
  let projectRoot = ''
  let sourceNavigationHandler: ReturnType<typeof createSourceNavigationHandler> | null = null

  return {
    name: 'vite-plugin-react-devtools',

    configResolved(config: any) {
      isProduction = config.command === 'build' || config.mode === 'production'
      globalProjectRoot = config.root || process.cwd()
      globalEditorName = editorName

      // Initialize source navigation handler
      globalSourceNavigationHandler = createSourceNavigationHandler(editorName, globalProjectRoot)
    },

    configureServer(server) {
      // Skip in production unless explicitly enabled
      if (isProduction && !enableInProduction) {
        return
      }

      // Set up WebSocket server for DevTools communication
      setupWebSocketServer(port)

      // Add middleware for DevTools assets
      server.middlewares.use('/__react-devtools', (req, res, next) => {
        if (req.url === '/__react-devtools/client.js') {
          res.setHeader('Content-Type', 'application/javascript')
          res.end(generateClientScript(port))
        }
        else {
          next()
        }
      })
    },

    transformIndexHtml: {
      order: 'pre',
      handler(html, _context) {
        // Skip in production unless explicitly enabled
        if (isProduction && !enableInProduction) {
          return html
        }

        // Inject DevTools client script
        const devToolsScript = `
          <script type="module">
            import '/__react-devtools/client.js';
          </script>
        `

        return html.replace('<head>', `<head>${devToolsScript}`)
      },
    },

    buildStart() {
      if (!isProduction || enableInProduction) {
        // eslint-disable-next-line no-console
        console.log(`🔧 React DevTools starting on port ${port}`)
      }
    },

    buildEnd() {
      // Clean up WebSocket server
      if (devToolsState.wss) {
        devToolsState.wss.close()
        devToolsState.clients.clear()
      }
    },
  }
}

function setupWebSocketServer(port: number) {
  if (devToolsState.wss) {
    return // Already set up
  }

  const server = createServer()
  const wss = new WebSocketServer({ server })

  wss.on('connection', (ws) => {
    // eslint-disable-next-line no-console
    console.log('🔗 React DevTools client connected')
    devToolsState.clients.add(ws)

    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString())
        handleDevToolsMessage(message, ws)
      }
      catch (error) {
        console.error('Failed to parse DevTools message:', error)
      }
    })

    ws.on('close', () => {
      // eslint-disable-next-line no-console
      console.log('🔌 React DevTools client disconnected')
      devToolsState.clients.delete(ws)
    })

    ws.on('error', (error) => {
      console.error('React DevTools WebSocket error:', error)
      devToolsState.clients.delete(ws)
    })
  })

  server.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`🚀 React DevTools WebSocket server running on port ${port}`)
  })

  devToolsState.wss = wss
}

function handleDevToolsMessage(message: any, ws: WebSocket) {
  switch (message.type) {
    case 'GET_COMPONENT_TREE':
      // TODO: Implement component tree retrieval
      ws.send(JSON.stringify({
        type: 'COMPONENT_TREE',
        data: devToolsState.componentTree || null,
      }))
      break

    case 'SELECT_COMPONENT':
      // TODO: Implement component selection
      broadcastToClients({
        type: 'COMPONENT_SELECTED',
        data: message.data,
      })
      break

    case 'UPDATE_PROPS':
      // TODO: Implement props updating
      // eslint-disable-next-line no-console
      console.log('Update props:', message.data)
      break

    case 'UPDATE_STATE':
      // TODO: Implement state updating
      // eslint-disable-next-line no-console
      console.log('Update state:', message.data)
      break

    case 'OPEN_SOURCE':
      handleOpenSource(message.data)
      break

    case 'GET_AVAILABLE_EDITORS':
      handleGetAvailableEditors(ws)
      break

    default:
      console.warn('Unknown DevTools message type:', message.type)
  }
}

function broadcastToClients(message: any) {
  const messageStr = JSON.stringify(message)
  devToolsState.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(messageStr)
    }
  })
}

/**
 * Handles opening source code in editor
 */
async function handleOpenSource(data: any) {
  if (!globalSourceNavigationHandler) {
    console.warn('Source navigation not initialized')
    return
  }

  try {
    const { component, file, line, column } = data

    if (component) {
      // Open component source
      await globalSourceNavigationHandler(component)
    } else if (file) {
      // Open specific file location
      await launchEditor(globalEditorName, file, line, column, globalProjectRoot)
    }
  } catch (error) {
    console.error('Failed to open source:', error)
  }
}

/**
 * Handles getting available editors
 */
async function handleGetAvailableEditors(ws: WebSocket) {
  try {
    const availableEditors = await detectAvailableEditors()
    ws.send(JSON.stringify({
      type: 'AVAILABLE_EDITORS',
      data: { editors: availableEditors, current: globalEditorName },
    }))
  } catch (error) {
    console.error('Failed to detect editors:', error)
    ws.send(JSON.stringify({
      type: 'AVAILABLE_EDITORS',
      data: { editors: [], current: globalEditorName },
    }))
  }
}

function getUICode(): string {
  // Inline the UI code to avoid file system dependencies
  return `
    function createDevToolsUI() {
      const container = document.createElement('div');
      container.id = 'react-devtools-container';
      container.innerHTML = \`
        <style>
          #react-devtools-container {
            position: fixed;
            top: 0;
            right: 0;
            width: 400px;
            height: 100vh;
            background: #1e1e1e;
            color: #ffffff;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 12px;
            border-left: 1px solid #333;
            z-index: 999999;
            display: flex;
            flex-direction: column;
            box-shadow: -2px 0 10px rgba(0, 0, 0, 0.3);
            transform: translateX(100%);
            transition: transform 0.3s ease;
          }

          #react-devtools-container.open {
            transform: translateX(0);
          }

          .devtools-header {
            background: #2d2d2d;
            padding: 10px;
            border-bottom: 1px solid #333;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .devtools-title {
            font-weight: bold;
            color: #61dafb;
          }

          .devtools-close {
            background: none;
            border: none;
            color: #ffffff;
            cursor: pointer;
            font-size: 16px;
            padding: 0;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .devtools-close:hover {
            background: #444;
            border-radius: 2px;
          }

          .devtools-tabs {
            display: flex;
            background: #2d2d2d;
            border-bottom: 1px solid #333;
          }

          .devtools-tab {
            padding: 8px 16px;
            background: none;
            border: none;
            color: #ccc;
            cursor: pointer;
            border-bottom: 2px solid transparent;
          }

          .devtools-tab.active {
            color: #61dafb;
            border-bottom-color: #61dafb;
          }

          .devtools-tab:hover {
            background: #333;
          }

          .devtools-content {
            flex: 1;
            overflow: auto;
            padding: 10px;
          }

          .component-tree {
            list-style: none;
            padding: 0;
            margin: 0;
          }

          .component-item {
            padding: 4px 0;
            cursor: pointer;
            border-radius: 2px;
            padding-left: 0;
          }

          .component-item:hover {
            background: #333;
          }

          .component-item.selected {
            background: #0e4f79;
          }

          .component-name {
            color: #e06c75;
            font-weight: bold;
          }

          .component-props {
            color: #98c379;
            font-size: 11px;
            margin-left: 10px;
          }

          .component-children {
            margin-left: 20px;
          }

          .component-toggle {
            display: inline-block;
            width: 12px;
            text-align: center;
            cursor: pointer;
            color: #666;
          }

          .props-inspector {
            border-top: 1px solid #333;
            margin-top: 10px;
            padding-top: 10px;
          }

          .props-title {
            font-weight: bold;
            margin-bottom: 8px;
            color: #61dafb;
          }

          .prop-item {
            margin-bottom: 4px;
            padding: 2px 0;
          }

          .prop-key {
            color: #e06c75;
            font-weight: bold;
          }

          .prop-value {
            color: #98c379;
            margin-left: 8px;
          }

          .search-box {
            width: 100%;
            padding: 6px;
            background: #333;
            border: 1px solid #555;
            color: #fff;
            border-radius: 2px;
            margin-bottom: 10px;
          }

          .search-box:focus {
            outline: none;
            border-color: #61dafb;
          }

          .no-components {
            text-align: center;
            color: #666;
            padding: 20px;
          }

          .loading {
            text-align: center;
            color: #61dafb;
            padding: 20px;
          }
        </style>

        <div class="devtools-header">
          <div class="devtools-title">⚛️ React DevTools</div>
          <button class="devtools-close" onclick="window.__REACT_DEVTOOLS_UI__.close()">×</button>
        </div>

        <div class="devtools-tabs">
          <button class="devtools-tab active" data-tab="components">Components</button>
          <button class="devtools-tab" data-tab="profiler">Profiler</button>
        </div>

        <div class="devtools-content">
          <div id="components-tab" class="tab-content">
            <input type="text" class="search-box" placeholder="Search components..." id="component-search">
            <div id="component-tree-container">
              <div class="loading">Loading components...</div>
            </div>
            <div id="props-inspector" class="props-inspector" style="display: none;">
              <div class="props-title">Props</div>
              <div id="props-content"></div>
              <div class="props-title" style="margin-top: 15px;">State</div>
              <div id="state-content"></div>
              <div class="props-title" style="margin-top: 15px;">Hooks</div>
              <div id="hooks-content"></div>
            </div>
          </div>

          <div id="profiler-tab" class="tab-content" style="display: none;">
            <div class="no-components">Profiler coming soon...</div>
          </div>
        </div>
      \`;

      setupUIEventListeners(container);
      return container;
    }

    function setupUIEventListeners(container) {
      const tabs = container.querySelectorAll('.devtools-tab');
      tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
          const target = e.target;
          const tabName = target.dataset.tab;

          tabs.forEach(t => t.classList.remove('active'));
          target.classList.add('active');

          const tabContents = container.querySelectorAll('.tab-content');
          tabContents.forEach(content => {
            content.style.display = content.id === tabName + '-tab' ? 'block' : 'none';
          });
        });
      });

      const searchBox = container.querySelector('#component-search');
      if (searchBox) {
        searchBox.addEventListener('input', (e) => {
          const query = e.target.value.toLowerCase();
          filterComponents(container, query);
        });
      }
    }

    function renderComponentTree(container, components, selectedId) {
      const treeContainer = container.querySelector('#component-tree-container');
      if (!treeContainer) return;

      if (components.length === 0) {
        treeContainer.innerHTML = '<div class="no-components">No React components found</div>';
        return;
      }

      const treeHTML = components.map(component => renderComponent(component, selectedId)).join('');
      treeContainer.innerHTML = '<ul class="component-tree">' + treeHTML + '</ul>';

      const componentItems = treeContainer.querySelectorAll('.component-item');
      componentItems.forEach(item => {
        item.addEventListener('click', (e) => {
          e.stopPropagation();
          const componentId = item.dataset.componentId;
          if (componentId && window.__REACT_DEVTOOLS__) {
            window.__REACT_DEVTOOLS__.send({
              type: 'SELECT_COMPONENT',
              data: { componentId }
            });
          }
        });
      });

      const toggles = treeContainer.querySelectorAll('.component-toggle');
      toggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
          e.stopPropagation();
          const item = e.target.closest('.component-item');
          const children = item?.querySelector('.component-children');
          if (children) {
            const isExpanded = children.style.display !== 'none';
            children.style.display = isExpanded ? 'none' : 'block';
            e.target.textContent = isExpanded ? '▶' : '▼';
          }
        });
      });
    }

    function renderComponent(component, selectedId, depth = 0) {
      const isSelected = component.id === selectedId;
      const hasChildren = component.children.length > 0;

      const propsPreview = Object.keys(component.props).length > 0
        ? '<span class="component-props">{' + Object.keys(component.props).slice(0, 3).join(', ') + (Object.keys(component.props).length > 3 ? '...' : '') + '}</span>'
        : '';

      const childrenHTML = hasChildren
        ? '<div class="component-children">' + component.children.map(child => renderComponent(child, selectedId, depth + 1)).join('') + '</div>'
        : '';

      const toggle = hasChildren ? '<span class="component-toggle">▼</span>' : '<span class="component-toggle"> </span>';

      return '<li class="component-item ' + (isSelected ? 'selected' : '') + '" data-component-id="' + component.id + '" style="padding-left: ' + (depth * 20) + 'px">' +
        toggle +
        '<span class="component-name">' + component.name + '</span>' +
        propsPreview +
        childrenHTML +
        '</li>';
    }

    function updatePropsInspector(container, component) {
      const inspector = container.querySelector('#props-inspector');
      const propsContent = container.querySelector('#props-content');
      const stateContent = container.querySelector('#state-content');
      const hooksContent = container.querySelector('#hooks-content');

      if (!inspector || !propsContent || !stateContent || !hooksContent) return;

      inspector.style.display = 'block';

      propsContent.innerHTML = renderObjectProperties(component.props);

      if (component.state) {
        stateContent.innerHTML = renderObjectProperties(component.state);
      } else {
        stateContent.innerHTML = '<div style="color: #666;">No state</div>';
      }

      if (component.hooks && component.hooks.length > 0) {
        hooksContent.innerHTML = component.hooks.map(hook =>
          '<div class="prop-item">' +
          '<span class="prop-key">' + hook.name + '</span>' +
          '<span class="prop-value">' + JSON.stringify(hook.value) + '</span>' +
          '</div>'
        ).join('');
      } else {
        hooksContent.innerHTML = '<div style="color: #666;">No hooks</div>';
      }
    }

    function renderObjectProperties(obj) {
      if (!obj || Object.keys(obj).length === 0) {
        return '<div style="color: #666;">No properties</div>';
      }

      return Object.entries(obj).map(([key, value]) =>
        '<div class="prop-item">' +
        '<span class="prop-key">' + key + ':</span>' +
        '<span class="prop-value">' + formatValue(value) + '</span>' +
        '</div>'
      ).join('');
    }

    function formatValue(value) {
      if (value === null) return 'null';
      if (value === undefined) return 'undefined';
      if (typeof value === 'string') return '"' + value + '"';
      if (typeof value === 'function') return 'ƒ ' + (value.name || 'anonymous');
      if (typeof value === 'object') {
        if (Array.isArray(value)) {
          return 'Array(' + value.length + ')';
        }
        return 'Object';
      }
      return String(value);
    }

    function filterComponents(container, query) {
      const items = container.querySelectorAll('.component-item');
      items.forEach(item => {
        const name = item.querySelector('.component-name')?.textContent?.toLowerCase() || '';
        item.style.display = name.includes(query) ? 'block' : 'none';
      });
    }

    function createToggleButton() {
      const button = document.createElement('button');
      button.id = 'react-devtools-toggle';
      button.innerHTML = '⚛️';
      button.style.cssText = \`
        position: fixed;
        top: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #61dafb;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        z-index: 999998;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        transition: all 0.2s ease;
      \`;

      button.addEventListener('mouseenter', () => {
        button.style.transform = 'scale(1.1)';
      });

      button.addEventListener('mouseleave', () => {
        button.style.transform = 'scale(1)';
      });

      button.addEventListener('click', () => {
        if (window.__REACT_DEVTOOLS_UI__) {
          window.__REACT_DEVTOOLS_UI__.toggle();
        }
      });

      return button;
    }
  `
}

function getReactDetectorCode(): string {
  return `
    function getReactDevToolsHook() {
      if (typeof window === 'undefined') {
        return null;
      }
      return window.__REACT_DEVTOOLS_GLOBAL_HOOK__ || null;
    }

    function isReactAvailable() {
      const hook = getReactDevToolsHook();
      return !!(hook && hook.renderers && hook.renderers.size > 0);
    }

    function getReactRenderer() {
      const hook = getReactDevToolsHook();
      if (!hook || !hook.renderers) {
        return null;
      }
      const renderers = Array.from(hook.renderers.values());
      return renderers[0] || null;
    }

    function setupReactIntegration() {
      if (typeof window === 'undefined') {
        return;
      }

      const checkReact = () => {
        if (isReactAvailable()) {
          console.log('🔗 React DevTools: React detected');

          const hook = getReactDevToolsHook();
          if (hook) {
            const originalOnCommitFiberRoot = hook.onCommitFiberRoot;
            hook.onCommitFiberRoot = function (id, root, priorityLevel) {
              if (originalOnCommitFiberRoot) {
                originalOnCommitFiberRoot.call(this, id, root, priorityLevel);
              }

              if (window.__REACT_DEVTOOLS__) {
                window.__REACT_DEVTOOLS__.send({
                  type: 'FIBER_COMMIT',
                  data: { id, priorityLevel },
                });
              }
            };
          }
        }
        else {
          setTimeout(checkReact, 100);
        }
      };

      checkReact();
    }
  `
}

function generateClientScript(port: number): string {
  return `
// React DevTools Client Script
(function() {
  'use strict';

  let ws;
  let reconnectAttempts = 0;
  const maxReconnectAttempts = 5;
  let devToolsUI = null;
  let toggleButton = null;

  // Import UI functions (these will be injected)
  ${getUICode()}
  ${getReactDetectorCode()}

  function connect() {
    try {
      ws = new WebSocket('ws://localhost:${port}');

      ws.onopen = function() {
        console.log('🔗 Connected to React DevTools');
        reconnectAttempts = 0;

        // Set up React integration
        setupReactIntegration();

        // Request initial component tree
        requestComponentTree();
      };

      ws.onmessage = function(event) {
        try {
          const message = JSON.parse(event.data);
          handleDevToolsMessage(message);
        } catch (error) {
          console.error('Failed to parse DevTools message:', error);
        }
      };

      ws.onclose = function() {
        console.log('🔌 Disconnected from React DevTools');

        // Attempt to reconnect
        if (reconnectAttempts < maxReconnectAttempts) {
          reconnectAttempts++;
          setTimeout(connect, 1000 * reconnectAttempts);
        }
      };

      ws.onerror = function(error) {
        console.error('React DevTools connection error:', error);
      };

    } catch (error) {
      console.error('Failed to connect to React DevTools:', error);
    }
  }

  function handleDevToolsMessage(message) {
    switch (message.type) {
      case 'COMPONENT_TREE':
        if (devToolsUI && message.data) {
          renderComponentTree(devToolsUI, message.data.tree || [], message.data.selectedId);
        }
        break;

      case 'COMPONENT_SELECTED':
        if (devToolsUI && message.data && message.data.component) {
          updatePropsInspector(devToolsUI, message.data.component);
        }
        break;

      default:
        console.log('Unknown DevTools message:', message);
    }
  }

  function requestComponentTree() {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'GET_COMPONENT_TREE' }));
    }
  }

  function initializeUI() {
    if (devToolsUI) return;

    // Create toggle button
    toggleButton = createToggleButton();
    document.body.appendChild(toggleButton);

    // Create DevTools UI
    devToolsUI = createDevToolsUI();
    document.body.appendChild(devToolsUI);

    // Set up UI API
    window.__REACT_DEVTOOLS_UI__ = {
      toggle: function() {
        devToolsUI.classList.toggle('open');
        if (devToolsUI.classList.contains('open')) {
          requestComponentTree();
        }
      },
      close: function() {
        devToolsUI.classList.remove('open');
      },
      open: function() {
        devToolsUI.classList.add('open');
        requestComponentTree();
      }
    };
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeUI);
  } else {
    initializeUI();
  }

  // Initialize connection
  connect();

  // Expose DevTools API to global scope
  window.__REACT_DEVTOOLS__ = {
    send: function(message) {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
      }
    }
  };

  // Periodically refresh component tree when DevTools is open
  setInterval(function() {
    if (devToolsUI && devToolsUI.classList.contains('open')) {
      requestComponentTree();
    }
  }, 1000);

})();
`
}

// Export the plugin as default
export default reactDevTools
