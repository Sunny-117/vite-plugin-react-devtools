/**
 * Source code navigation utilities
 */

import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { join, resolve } from 'node:path'
import type { ReactComponent } from './types'

export interface SourceLocation {
  file: string
  line?: number
  column?: number
}

export interface EditorConfig {
  name: string
  command: string
  args: (file: string, line?: number, column?: number) => string[]
}

/**
 * Supported editors configuration
 */
export const SUPPORTED_EDITORS: Record<string, EditorConfig> = {
  'code': {
    name: 'Visual Studio Code',
    command: 'code',
    args: (file, line, column) => {
      const location = line && column ? `${file}:${line}:${column}` : line ? `${file}:${line}` : file
      return ['--goto', location]
    },
  },
  'code-insiders': {
    name: 'Visual Studio Code Insiders',
    command: 'code-insiders',
    args: (file, line, column) => {
      const location = line && column ? `${file}:${line}:${column}` : line ? `${file}:${line}` : file
      return ['--goto', location]
    },
  },
  'webstorm': {
    name: 'WebStorm',
    command: 'webstorm',
    args: (file, line) => {
      const location = line ? `${file}:${line}` : file
      return ['--line', location]
    },
  },
  'idea': {
    name: 'IntelliJ IDEA',
    command: 'idea',
    args: (file, line) => {
      const location = line ? `${file}:${line}` : file
      return ['--line', location]
    },
  },
  'sublime': {
    name: 'Sublime Text',
    command: 'subl',
    args: (file, line, column) => {
      const location = line && column ? `${file}:${line}:${column}` : line ? `${file}:${line}` : file
      return [location]
    },
  },
  'atom': {
    name: 'Atom',
    command: 'atom',
    args: (file, line, column) => {
      const location = line && column ? `${file}:${line}:${column}` : line ? `${file}:${line}` : file
      return [location]
    },
  },
  'vim': {
    name: 'Vim',
    command: 'vim',
    args: (file, line) => {
      return line ? [`+${line}`, file] : [file]
    },
  },
  'emacs': {
    name: 'Emacs',
    command: 'emacs',
    args: (file, line) => {
      return line ? [`+${line}`, file] : [file]
    },
  },
}

/**
 * Detects available editors on the system
 */
export async function detectAvailableEditors(): Promise<string[]> {
  const available: string[] = []

  for (const [key, config] of Object.entries(SUPPORTED_EDITORS)) {
    try {
      await new Promise<void>((resolve, reject) => {
        const child = spawn(config.command, ['--version'], {
          stdio: 'ignore',
          timeout: 3000,
        })
        child.on('close', (code) => {
          if (code === 0) {
            resolve()
          }
          else {
            reject(new Error(`Command failed with code ${code}`))
          }
        })
        child.on('error', reject)
      })
      available.push(key)
    }
    catch {
      // Editor not available
    }
  }

  return available
}

/**
 * Launches an editor with the specified file and location
 */
export async function launchEditor(
  editor: string,
  file: string,
  line?: number,
  column?: number,
  projectRoot?: string,
): Promise<boolean> {
  const editorConfig = SUPPORTED_EDITORS[editor]
  if (!editorConfig) {
    console.error(`Unsupported editor: ${editor}`)
    return false
  }

  // Resolve file path
  const resolvedFile = projectRoot ? resolve(projectRoot, file) : resolve(file)

  // Check if file exists
  if (!existsSync(resolvedFile)) {
    console.error(`File not found: ${resolvedFile}`)
    return false
  }

  try {
    const args = editorConfig.args(resolvedFile, line, column)

    const child = spawn(editorConfig.command, args, {
      stdio: 'ignore',
      detached: true,
    })

    child.unref()

    // eslint-disable-next-line no-console
    console.log(`🚀 Opened ${resolvedFile} in ${editorConfig.name}`)
    return true
  }
  catch (error) {
    console.error(`Failed to launch ${editorConfig.name}:`, error)
    return false
  }
}

/**
 * Extracts source location from React component
 */
export function getComponentSourceLocation(component: ReactComponent): SourceLocation | null {
  // Try to get source from component's _source property (React DevTools)
  if (component.source) {
    return {
      file: component.source.fileName,
      line: component.source.lineNumber,
      column: component.source.columnNumber,
    }
  }

  // Try to extract from component name and stack trace
  if (component.displayName || component.name) {
    // This is a simplified approach - in a real implementation,
    // you'd need to integrate with Vite's source maps
    return null
  }

  return null
}

/**
 * Resolves component file path using various strategies
 */
export function resolveComponentFile(
  component: ReactComponent,
  projectRoot: string,
  srcDirs: string[] = ['src', 'app', 'components'],
): string | null {
  const location = getComponentSourceLocation(component)
  if (location?.file) {
    return location.file
  }

  // Try to guess file location based on component name
  const componentName = component.displayName || component.name
  if (!componentName) {
    return null
  }

  // Common file patterns
  const patterns = [
    `${componentName}.tsx`,
    `${componentName}.jsx`,
    `${componentName}.ts`,
    `${componentName}.js`,
    `${componentName}/index.tsx`,
    `${componentName}/index.jsx`,
    `${componentName}/index.ts`,
    `${componentName}/index.js`,
  ]

  // Search in common directories
  for (const srcDir of srcDirs) {
    for (const pattern of patterns) {
      const filePath = join(projectRoot, srcDir, pattern)
      if (existsSync(filePath)) {
        return filePath
      }
    }
  }

  return null
}

/**
 * Creates a source navigation handler for components
 */
export function createSourceNavigationHandler(
  editor: string,
  projectRoot: string,
) {
  return async (component: ReactComponent): Promise<boolean> => {
    const location = getComponentSourceLocation(component)

    if (location) {
      return launchEditor(
        editor,
        location.file,
        location.line,
        location.column,
        projectRoot,
      )
    }

    // Fallback: try to resolve file path
    const filePath = resolveComponentFile(component, projectRoot)
    if (filePath) {
      return launchEditor(editor, filePath, undefined, undefined, projectRoot)
    }

    console.warn(`Could not resolve source location for component: ${component.name}`)
    return false
  }
}

/**
 * Integrates with Vite's source maps to get accurate source locations
 */
export async function getSourceMapLocation(
  file: string,
  line: number,
  column: number,
  // sourceMapUrl?: string,
): Promise<SourceLocation | null> {
  // This would require integration with source-map library
  // For now, return the original location
  return {
    file,
    line,
    column,
  }
}
