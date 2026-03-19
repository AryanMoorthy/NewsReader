/**
 * Entry Point of the React Application
 * This file is responsible for mounting the React component tree into the DOM.
 */

import { StrictMode } from 'react' // A tool for highlighting potential problems in an application during development
import { createRoot } from 'react-dom/client' // Modern API for rendering React components into the browser DOM
import './index.css' // Global styles for the entire application
import App from './App.jsx' // The main root component of the application

/**
 * createRoot: Creates a React root for the supplied container.
 * document.getElementById('root'): Targeted the <div> with id='root' in index.html.
 * .render(): Renders a React element into the DOM.
 */
createRoot(document.getElementById('root')).render(
  /**
   * <StrictMode>: Wraps the application to enable additional checks and warnings.
   * It does not render any visible UI. It activates checks for:
   * - Identifying components with unsafe lifecycles
   * - Warning about legacy string ref API usage
   * - Detecting unexpected side effects
   */
  <StrictMode>
    <App /> {/* The starting point of our UI component hierarchy */}
  </StrictMode>,
)

