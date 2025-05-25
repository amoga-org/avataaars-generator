// index.js
import './assets/ModernApp.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import { configureUrlQuery } from 'react-url-query'

import App from './components/App'
import Renderer from './components/Renderer'
import ErrorBoundary from './components/ErrorBoundary'
import history from './history'
import reportWebVitals from './reportWebVitals'
import { initializeApp } from './setup'

// Initialize the application
initializeApp()

const params = new URL(document.location.href).searchParams

if (params.get('__render__') !== '1') {
  // link the history used in our app to url-query so it can update the URL with it.
  configureUrlQuery({ history })

  const root = ReactDOM.createRoot(document.getElementById('root'))
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  )
  reportWebVitals()
} else {
  // server rendering mode
  const root = ReactDOM.createRoot(document.body)
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <Renderer />
      </ErrorBoundary>
    </React.StrictMode>
  )
}
