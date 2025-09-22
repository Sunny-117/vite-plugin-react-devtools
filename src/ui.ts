/**
 * DevTools UI components and rendering
 */

import type { ReactComponent } from './types'

/**
 * Creates the main DevTools UI
 */
export function createDevToolsUI(): HTMLElement {
  const container = document.createElement('div')
  container.id = 'react-devtools-container'
  container.innerHTML = `
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

      .component-source-btn {
        background: none;
        border: none;
        color: #888;
        cursor: pointer;
        font-size: 12px;
        margin-left: 8px;
        padding: 2px 4px;
        border-radius: 3px;
        transition: all 0.2s ease;
      }

      .component-source-btn:hover {
        background: #3a3a3a;
        color: #61dafb;
      }

      .component-header {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .component-spacer {
        width: 16px;
        display: inline-block;
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
  `

  // Add event listeners
  setupUIEventListeners(container)

  return container
}

/**
 * Sets up event listeners for the DevTools UI
 */
function setupUIEventListeners(container: HTMLElement) {
  // Tab switching
  const tabs = container.querySelectorAll('.devtools-tab')
  tabs.forEach((tab) => {
    tab.addEventListener('click', (e) => {
      const target = e.target as HTMLElement
      const tabName = target.dataset.tab

      // Update active tab
      tabs.forEach(t => t.classList.remove('active'))
      target.classList.add('active')

      // Show/hide tab content
      const tabContents = container.querySelectorAll('.tab-content')
      tabContents.forEach((content) => {
        const contentElement = content as HTMLElement
        contentElement.style.display = content.id === `${tabName}-tab` ? 'block' : 'none'
      })
    })
  })

  // Search functionality
  const searchBox = container.querySelector('#component-search') as HTMLInputElement
  if (searchBox) {
    searchBox.addEventListener('input', (e) => {
      const query = (e.target as HTMLInputElement).value.toLowerCase()
      filterComponents(container, query)
    })
  }
}

/**
 * Renders the component tree in the UI
 */
export function renderComponentTree(container: HTMLElement, components: ReactComponent[], selectedId?: string) {
  const treeContainer = container.querySelector('#component-tree-container')
  if (!treeContainer)
    return

  if (components.length === 0) {
    treeContainer.innerHTML = '<div class="no-components">No React components found</div>'
    return
  }

  const treeHTML = components.map(component => renderComponent(component, selectedId)).join('')
  treeContainer.innerHTML = `<ul class="component-tree">${treeHTML}</ul>`

  // Add click handlers
  const componentItems = treeContainer.querySelectorAll('.component-item')
  componentItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.stopPropagation()
      const componentId = (item as HTMLElement).dataset.componentId
      if (componentId && window.__REACT_DEVTOOLS__) {
        window.__REACT_DEVTOOLS__.send({
          type: 'SELECT_COMPONENT',
          data: { componentId },
        })
      }
    })
  })

  // Add source navigation handlers
  const sourceButtons = treeContainer.querySelectorAll('.component-source-btn')
  sourceButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.stopPropagation()
      const componentId = (button as HTMLElement).dataset.componentId
      const component = findComponentById(components, componentId)

      if (component && window.__REACT_DEVTOOLS__) {
        window.__REACT_DEVTOOLS__.send({
          type: 'OPEN_SOURCE',
          data: { component },
        })
      }
    })
  })

  // Add toggle handlers for component children
  const toggles = treeContainer.querySelectorAll('.component-toggle')
  toggles.forEach((toggle) => {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation()
      const item = (e.target as HTMLElement).closest('.component-item')
      const children = item?.querySelector('.component-children') as HTMLElement
      if (children) {
        const isExpanded = children.style.display !== 'none'
        children.style.display = isExpanded ? 'none' : 'block'
        ;(e.target as HTMLElement).textContent = isExpanded ? '▶' : '▼'
      }
    })
  })
}

/**
 * Finds a component by ID in the component tree
 */
function findComponentById(components: ReactComponent[], id?: string): ReactComponent | null {
  if (!id) return null

  for (const component of components) {
    if (component.id === id) {
      return component
    }

    const found = findComponentById(component.children, id)
    if (found) {
      return found
    }
  }

  return null
}

/**
 * Renders a single component in the tree
 */
function renderComponent(component: ReactComponent, selectedId?: string, depth = 0): string {
  const isSelected = component.id === selectedId
  const hasChildren = component.children.length > 0

  const propsPreview = Object.keys(component.props).length > 0
    ? `<span class="component-props">{${Object.keys(component.props).slice(0, 3).join(', ')}${Object.keys(component.props).length > 3 ? '...' : ''}}</span>`
    : ''

  const statePreview = component.state && Object.keys(component.state).length > 0
    ? `<span class="component-state">state: {${Object.keys(component.state).slice(0, 2).join(', ')}${Object.keys(component.state).length > 2 ? '...' : ''}}</span>`
    : ''

  const hooks = component.hooks || []
  const hooksPreview = hooks.length > 0
    ? `<span class="component-hooks">hooks: ${hooks.length}</span>`
    : ''

  return `
    <div class="component-item ${isSelected ? 'selected' : ''}" data-component-id="${component.id}" style="margin-left: ${depth * 20}px;">
      <div class="component-header">
        ${hasChildren ? `<span class="component-toggle">▼</span>` : '<span class="component-spacer"></span>'}
        <span class="component-name">${component.displayName || component.name}</span>
        <button class="component-source-btn" data-component-id="${component.id}" title="Open in editor">📝</button>
        ${propsPreview}
        ${statePreview}
        ${hooksPreview}
      </div>
      ${hasChildren ? `
        <div class="component-children">
          ${component.children.map(child => renderComponent(child, selectedId, depth + 1)).join('')}
        </div>
      ` : ''}
    </div>
  `
}

/**
 * Updates the props inspector with component details
 */
export function updatePropsInspector(container: HTMLElement, component: ReactComponent) {
  const inspector = container.querySelector('#props-inspector') as HTMLElement
  const propsContent = container.querySelector('#props-content')
  const stateContent = container.querySelector('#state-content')
  const hooksContent = container.querySelector('#hooks-content')

  if (!inspector) return

  // Update component info header
  const componentInfo = inspector.querySelector('.component-info')
  if (componentInfo) {
    componentInfo.innerHTML = `
      <div class="component-title">
        <span class="component-name">${component.displayName || component.name}</span>
        <button class="component-source-btn" data-component-id="${component.id}" title="Open in editor">📝</button>
      </div>
      <div class="component-type">${component.type}</div>
    `

    // Add click handler for source button
    const sourceBtn = componentInfo.querySelector('.component-source-btn')
    if (sourceBtn) {
      sourceBtn.addEventListener('click', () => {
        if (window.__REACT_DEVTOOLS__) {
          window.__REACT_DEVTOOLS__.send({
            type: 'OPEN_SOURCE',
            data: { component },
          })
        }
      })
    }
  }

  // Update props
  if (propsContent) {
    propsContent.innerHTML = renderObjectProperties(component.props)
  }

  // Update state
  if (stateContent) {
    stateContent.innerHTML = renderObjectProperties(component.state || {})
  }

  // Update hooks
  if (hooksContent) {
    const hooks = component.hooks || []
    hooksContent.innerHTML = hooks.length > 0
      ? hooks.map((hook, index) => `
          <div class="hook-item">
            <span class="hook-index">${index}</span>
            <span class="hook-name">${hook.name}</span>
            <span class="hook-type">${hook.type}</span>
            <div class="hook-value">${formatValue(hook.value)}</div>
          </div>
        `).join('')
      : '<div style="color: #666;">No hooks</div>'
  }
}

// Add global function for source navigation
declare global {
  interface Window {
    openComponentSource?: (componentId: string) => void
  }
}

// Set up global source navigation function
if (typeof window !== 'undefined') {
  window.openComponentSource = (componentId: string) => {
    if (window.__REACT_DEVTOOLS__) {
      window.__REACT_DEVTOOLS__.send({
        type: 'OPEN_SOURCE',
        data: { componentId },
      })
    }
  }
}



/**
 * Renders object properties as HTML
 */
function renderObjectProperties(obj: Record<string, unknown>): string {
  if (!obj || Object.keys(obj).length === 0) {
    return '<div style="color: #666;">No properties</div>'
  }

  return Object.entries(obj).map(([key, value]) => `
    <div class="prop-item">
      <span class="prop-key">${key}:</span>
      <span class="prop-value">${formatValue(value)}</span>
    </div>
  `).join('')
}

/**
 * Formats a value for display
 */
function formatValue(value: unknown): string {
  if (value === null)
    return 'null'
  if (value === undefined)
    return 'undefined'
  if (typeof value === 'string')
    return `"${value}"`
  if (typeof value === 'function')
    return `ƒ ${value.name || 'anonymous'}`
  if (typeof value === 'object') {
    if (Array.isArray(value)) {
      return `Array(${value.length})`
    }
    return 'Object'
  }
  return String(value)
}

/**
 * Filters components based on search query
 */
function filterComponents(container: HTMLElement, query: string) {
  const items = container.querySelectorAll('.component-item')
  items.forEach((item) => {
    const name = item.querySelector('.component-name')?.textContent?.toLowerCase() || ''
    const element = item as HTMLElement
    element.style.display = name.includes(query) ? 'block' : 'none'
  })
}

/**
 * Creates the DevTools toggle button
 */
export function createToggleButton(): HTMLElement {
  const button = document.createElement('button')
  button.id = 'react-devtools-toggle'
  button.innerHTML = '⚛️'
  button.style.cssText = `
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
  `

  button.addEventListener('mouseenter', () => {
    button.style.transform = 'scale(1.1)'
  })

  button.addEventListener('mouseleave', () => {
    button.style.transform = 'scale(1)'
  })

  button.addEventListener('click', () => {
    if (window.__REACT_DEVTOOLS_UI__) {
      window.__REACT_DEVTOOLS_UI__.toggle()
    }
  })

  return button
}
