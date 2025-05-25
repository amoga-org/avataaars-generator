// setup.js
// This file handles application setup tasks and other initialization

/**
 * Initialize any global configuration or settings
 */
export const initializeApp = () => {
  // Handle any app-wide setup here

  // Log app initialization in development mode
  if (process.env.NODE_ENV === 'development') {
    console.log('Avataaars Generator initialized in development mode')
  }
}

/**
 * Check if an image renderer URL is available and set default if not
 * @returns {string} The image renderer URL
 */
export const getImageRendererUrl = () => {
  return process.env.REACT_APP_IMG_RENDERER_URL || 'https://avataaars.io/'
}

export default { initializeApp, getImageRendererUrl }
