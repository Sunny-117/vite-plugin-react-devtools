// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu({
  rules: {
    // Allow console statements in development files
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    // Allow unused variables with underscore prefix
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    // Allow any type in some cases for React internals
    '@typescript-eslint/no-explicit-any': 'warn',
  },
})
