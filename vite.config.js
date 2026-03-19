/**
 * Vite Configuration File
 * Vite is a build tool that aims to provide a faster and leaner development experience for modern web projects.
 */

import { defineConfig } from 'vite' // Helper function to provide IDE type hints for the config object
import react from '@vitejs/plugin-react' // Official plugin for React support in Vite (JSX, Fast Refresh, etc.)

// https://vite.dev/config/
export default defineConfig({
  /**
   * plugins: An array of Vite plugins to use.
   * react(): Enables support for React, including Hot Module Replacement (HMR).
   */
  plugins: [react()],
})

