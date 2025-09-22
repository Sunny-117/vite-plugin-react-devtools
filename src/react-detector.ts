/**
 * React component detection and parsing utilities
 */

import type { FiberNode, Hook, ReactComponent, ReactDevToolsHook } from './types'

/**
 * Detects if React is available and gets the DevTools hook
 */
export function getReactDevToolsHook(): ReactDevToolsHook | null {
  if (typeof window === 'undefined') {
    return null
  }

  return window.__REACT_DEVTOOLS_GLOBAL_HOOK__ || null
}

/**
 * Checks if React DevTools hook is available and has renderers
 */
export function isReactAvailable(): boolean {
  const hook = getReactDevToolsHook()
  return !!(hook && hook.renderers && hook.renderers.size > 0)
}

/**
 * Gets the React renderer from the DevTools hook
 */
export function getReactRenderer() {
  const hook = getReactDevToolsHook()
  if (!hook || !hook.renderers) {
    return null
  }

  // Get the first renderer (usually there's only one)
  const renderers = Array.from(hook.renderers.values())
  return renderers[0] || null
}

/**
 * Converts a React Fiber node to our component representation
 */
export function fiberToComponent(fiber: FiberNode, depth = 0): ReactComponent | null {
  if (!fiber) {
    return null
  }

  // Skip certain fiber types that aren't user components
  if (shouldSkipFiber(fiber)) {
    return null
  }

  const component: ReactComponent = {
    id: generateComponentId(fiber),
    name: getComponentName(fiber),
    type: getComponentType(fiber),
    props: fiber.memoizedProps || {},
    state: fiber.memoizedState,
    hooks: extractHooks(fiber),
    children: [],
    fiber,
    source: getComponentSource(fiber),
  }

  // Extract children
  let child = fiber.child
  while (child) {
    const childComponent = fiberToComponent(child, depth + 1)
    if (childComponent) {
      childComponent.parent = component
      component.children.push(childComponent)
    }
    child = child.sibling
  }

  return component
}

/**
 * Gets the component tree from React's fiber tree
 */
export function getComponentTree(): ReactComponent[] {
  const renderer = getReactRenderer()
  if (!renderer || !renderer.getCurrentFiber) {
    return []
  }

  try {
    const rootFiber = renderer.getCurrentFiber()
    if (!rootFiber) {
      return []
    }

    // Find the root container
    let current = rootFiber
    while (current.return) {
      current = current.return
    }

    const components: ReactComponent[] = []

    // Traverse the fiber tree
    if (current.child) {
      const component = fiberToComponent(current.child)
      if (component) {
        components.push(component)
      }
    }

    return components
  }
  catch (error) {
    console.error('Failed to get component tree:', error)
    return []
  }
}

/**
 * Finds a component by ID in the tree
 */
export function findComponentById(tree: ReactComponent[], id: string): ReactComponent | null {
  for (const component of tree) {
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
 * Generates a unique ID for a component based on its fiber
 */
function generateComponentId(fiber: FiberNode): string {
  // Use a combination of fiber properties to create a unique ID
  const type = fiber.type?.name || fiber.type?.displayName || 'Unknown'
  const key = fiber.key || ''
  const index = fiber.index || 0

  // Create a hash-like ID
  return `${type}_${key}_${index}_${Math.random().toString(36).substring(2, 11)}`
}

/**
 * Gets the display name of a component
 */
function getComponentName(fiber: FiberNode): string {
  if (!fiber.type) {
    return 'Unknown'
  }

  // Function component
  if (typeof fiber.type === 'function') {
    return fiber.type.displayName || fiber.type.name || 'Anonymous'
  }

  // String type (DOM element)
  if (typeof fiber.type === 'string') {
    return fiber.type
  }

  // Symbol or other types
  if (fiber.type.$$typeof) {
    return fiber.type.displayName || 'Component'
  }

  return 'Unknown'
}

/**
 * Determines the type of component
 */
function getComponentType(fiber: FiberNode): ReactComponent['type'] {
  if (!fiber.type) {
    return 'function'
  }

  // Check for specific React types
  if (typeof fiber.type === 'string') {
    return 'function' // DOM elements are treated as function components
  }

  if (typeof fiber.type === 'function') {
    // Check if it's a class component
    if (fiber.type.prototype && fiber.type.prototype.isReactComponent) {
      return 'class'
    }

    // Check for React.memo
    if (fiber.type.$$typeof && fiber.type.$$typeof.toString().includes('memo')) {
      return 'memo'
    }

    // Check for React.forwardRef
    if (fiber.type.$$typeof && fiber.type.$$typeof.toString().includes('forward_ref')) {
      return 'forwardRef'
    }

    return 'function'
  }

  return 'function'
}

/**
 * Extracts hooks information from a fiber
 */
function extractHooks(fiber: FiberNode): Hook[] {
  const hooks: Hook[] = []

  if (!fiber.memoizedState) {
    return hooks
  }

  try {
    let hookNode = fiber.memoizedState
    let hookIndex = 0

    while (hookNode) {
      const hook: Hook = {
        id: hookIndex,
        name: getHookName(hookNode, hookIndex),
        type: getHookType(hookNode),
        value: hookNode.memoizedState,
      }

      // Extract dependencies for useEffect, useMemo, useCallback
      if (hookNode.deps) {
        hook.deps = hookNode.deps
      }

      hooks.push(hook)
      hookNode = hookNode.next
      hookIndex++
    }
  }
  catch (error) {
    console.warn('Failed to extract hooks:', error)
  }

  return hooks
}

/**
 * Gets the name of a hook
 */
function getHookName(_hookNode: unknown, index: number): string {
  // This is a simplified implementation
  // In a real implementation, you'd need to analyze the hook more deeply
  return `Hook ${index}`
}

/**
 * Gets the type of a hook
 */
function getHookType(hookNode: unknown): Hook['type'] {
  // This is a simplified implementation
  // In a real implementation, you'd need to analyze the hook structure
  const node = hookNode as Record<string, unknown>

  if (node && typeof node === 'object' && 'queue' in node) {
    return 'useState'
  }

  if (node && typeof node === 'object' && 'deps' in node) {
    return 'useEffect'
  }

  return 'custom'
}

/**
 * Gets the source location of a component
 */
function getComponentSource(_fiber: FiberNode) {
  // This would require source map integration
  // For now, return undefined
  return undefined
}

/**
 * Determines if a fiber should be skipped in the component tree
 */
function shouldSkipFiber(fiber: FiberNode): boolean {
  // Skip certain internal React types
  const skipTypes = [
    'react.strict_mode',
    'react.profiler',
    'react.suspense',
    'react.fragment',
  ]

  if (fiber.type && typeof fiber.type === 'object' && fiber.type.$$typeof) {
    const typeString = fiber.type.$$typeof.toString()
    return skipTypes.some(skipType => typeString.includes(skipType))
  }

  return false
}

/**
 * Sets up React DevTools hook integration
 */
export function setupReactIntegration() {
  if (typeof window === 'undefined') {
    return
  }

  // Wait for React to be available
  const checkReact = () => {
    if (isReactAvailable()) {
      // eslint-disable-next-line no-console
      console.log('🔗 React DevTools: React detected')

      const hook = getReactDevToolsHook()
      if (hook) {
        // Hook into React's commit phases
        const originalOnCommitFiberRoot = hook.onCommitFiberRoot
        hook.onCommitFiberRoot = function (id, root, priorityLevel) {
          // Call original handler
          if (originalOnCommitFiberRoot) {
            originalOnCommitFiberRoot.call(this, id, root, priorityLevel)
          }

          // Notify our DevTools
          if (window.__REACT_DEVTOOLS__) {
            window.__REACT_DEVTOOLS__.send({
              type: 'FIBER_COMMIT',
              data: { id, priorityLevel },
            })
          }
        }
      }
    }
    else {
      // Retry after a short delay
      setTimeout(checkReact, 100)
    }
  }

  checkReact()
}
