/**
 * ESLint Configuration File (Flat Config format)
 * ESLint is a tool for identifying and reporting on patterns found in ECMAScript/JavaScript code.
 */

import js from '@eslint/js' // The core ESLint recommended rules
import globals from 'globals' // A collection of global variables for different environments (browser, node, etc.)
import reactHooks from 'eslint-plugin-react-hooks' // ESLint rules for React Hooks (e.g., exhaustive-deps)
import reactRefresh from 'eslint-plugin-react-refresh' // Rules to ensure React Fast Refresh works correctly
import { defineConfig, globalIgnores } from 'eslint/config' // Helper functions for defining ESLint config

export default defineConfig([
  // Directories to be ignored by ESLint
  globalIgnores(['dist']),
  
  {
    // Apply this configuration to all JavaScript and JSX files
    files: ['**/*.{js,jsx}'],
    
    // Extend from recommended configurations
    extends: [
      js.configs.recommended, // Basic JavaScript recommended rules
      reactHooks.configs.flat.recommended, // Recommended rules for React Hooks
      reactRefresh.configs.vite, // Vite-specific React Refresh configuration
    ],
    
    languageOptions: {
      ecmaVersion: 2020, // Support for ECMAScript 2020 features
      globals: globals.browser, // Define browser globals like 'window' and 'document'
      parserOptions: {
        ecmaVersion: 'latest', // Use the latest ECMAScript version for parsing
        ecmaFeatures: { jsx: true }, // Enable JSX parsing
        sourceType: 'module', // Use ES Modules (import/export)
      },
    },
    
    rules: {
      /**
       * 'no-unused-vars': Warn about variables that are defined but never used.
       * The 'varsIgnorePattern' allows variables starting with uppercase or underscores (often used for React components or unused arguments).
       */
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
])

