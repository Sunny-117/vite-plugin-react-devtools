/**
 * Type definitions for React DevTools
 */

export interface ReactComponent {
  id: string
  name: string
  type: 'function' | 'class' | 'memo' | 'forwardRef' | 'fragment' | 'suspense' | 'provider' | 'consumer'
  displayName?: string
  props: Record<string, any>
  state?: Record<string, any>
  hooks?: Hook[]
  children: ReactComponent[]
  parent?: ReactComponent
  fiber?: any // React Fiber node
  source?: ComponentSource
}

export interface Hook {
  id: number
  name: string
  type: 'useState' | 'useEffect' | 'useContext' | 'useReducer' | 'useMemo' | 'useCallback' | 'useRef' | 'custom'
  value: any
  deps?: any[]
  subHooks?: Hook[]
}

export interface ComponentSource {
  fileName: string
  lineNumber: number
  columnNumber: number
}

export interface DevToolsMessage {
  type: string
  data?: any
  id?: string
}

// Client to Server messages
export interface GetComponentTreeMessage extends DevToolsMessage {
  type: 'GET_COMPONENT_TREE'
}

export interface SelectComponentMessage extends DevToolsMessage {
  type: 'SELECT_COMPONENT'
  data: {
    componentId: string
  }
}

export interface UpdatePropsMessage extends DevToolsMessage {
  type: 'UPDATE_PROPS'
  data: {
    componentId: string
    path: string[]
    value: any
  }
}

export interface UpdateStateMessage extends DevToolsMessage {
  type: 'UPDATE_STATE'
  data: {
    componentId: string
    path: string[]
    value: any
  }
}

export interface InspectElementMessage extends DevToolsMessage {
  type: 'INSPECT_ELEMENT'
  data: {
    componentId: string
  }
}

export interface OpenInEditorMessage extends DevToolsMessage {
  type: 'OPEN_IN_EDITOR'
  data: {
    source: ComponentSource
  }
}

// Server to Client messages
export interface ComponentTreeMessage extends DevToolsMessage {
  type: 'COMPONENT_TREE'
  data: {
    tree: ReactComponent[]
    selectedId?: string
  }
}

export interface ComponentSelectedMessage extends DevToolsMessage {
  type: 'COMPONENT_SELECTED'
  data: {
    component: ReactComponent
  }
}

export interface ComponentUpdatedMessage extends DevToolsMessage {
  type: 'COMPONENT_UPDATED'
  data: {
    componentId: string
    props?: Record<string, any>
    state?: Record<string, any>
    hooks?: Hook[]
  }
}

export interface ErrorMessage extends DevToolsMessage {
  type: 'ERROR'
  data: {
    message: string
    stack?: string
  }
}

// DevTools UI State
export interface DevToolsUIState {
  selectedComponentId?: string
  expandedComponents: Set<string>
  searchQuery: string
  showHooks: boolean
  showProps: boolean
  showState: boolean
  theme: 'light' | 'dark' | 'auto'
}

// Plugin configuration
export interface ReactDevToolsConfig {
  port: number
  componentInspector: boolean
  launchEditor: string
  enableInProduction: boolean
  theme?: 'light' | 'dark' | 'auto'
  showInlineProps?: boolean
  hideConsoleLogsInStrictMode?: boolean
}

// Editor configuration
export interface EditorConfig {
  name: string
  command: string
  args: string[]
  pattern: RegExp
}

// Performance profiling types
export interface ProfilerData {
  id: string
  displayName: string
  actualDuration: number
  baseDuration: number
  startTime: number
  commitTime: number
  interactions: Set<any>
}

export interface CommitData {
  commitTime: number
  duration: number
  effectDuration: number
  passiveEffectDuration: number
  priorityLevel: string
  updaters: Array<{
    displayName: string
    id: string
    type: string
  }>
}

// Fiber types (simplified)
export interface FiberNode {
  type: any
  key: string | null
  elementType: any
  stateNode: any
  return: FiberNode | null
  child: FiberNode | null
  sibling: FiberNode | null
  index: number
  ref: any
  pendingProps: any
  memoizedProps: any
  memoizedState: any
  updateQueue: any
  dependencies: any
  mode: number
  flags: number
  subtreeFlags: number
  deletions: FiberNode[] | null
  lanes: number
  childLanes: number
  alternate: FiberNode | null
  actualDuration?: number
  actualStartTime?: number
  selfBaseDuration?: number
  treeBaseDuration?: number
}

// React DevTools backend types
export interface ReactDevToolsBackend {
  version: string
  rendererID: number
  findFiberByHostInstance?: (instance: any) => FiberNode | null
  bundleType: number
  getCurrentFiber?: () => FiberNode | null
  findHostInstancesForFiberID?: (id: string) => any[]
  selectNode?: (node: any) => void
}

// Hook for React DevTools integration
export interface ReactDevToolsHook {
  renderers: Map<number, ReactDevToolsBackend>
  onCommitFiberRoot?: (id: number, root: any, priorityLevel?: any) => void
  onCommitFiberUnmount?: (id: number, fiber: FiberNode) => void
  inject?: (renderer: ReactDevToolsBackend) => number
  // eslint-disable-next-line ts/no-unsafe-function-type
  checkDCE?: (fn: Function) => void
  supportsFiber?: boolean
  isDisabled?: boolean
}

declare global {
  interface Window {
    __REACT_DEVTOOLS_GLOBAL_HOOK__?: ReactDevToolsHook
    __REACT_DEVTOOLS__?: {
      send: (message: DevToolsMessage) => void
    }
    __REACT_DEVTOOLS_UI__?: {
      open: () => void
      close: () => void
      toggle: () => void
      setTheme?: (theme: 'light' | 'dark' | 'auto') => void
    }
  }
}
