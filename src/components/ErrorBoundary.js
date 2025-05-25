// ErrorBoundary.js
import React, { Component } from 'react'
import PropTypes from 'prop-types'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({ errorInfo })

    // If analytics is available, log the error
    if (window.gtag) {
      window.gtag('event', 'error', {
        event_category: 'Error',
        event_label: error.toString(),
        value: 1,
      })
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className='error-container'
          style={{
            padding: '20px',
            margin: '20px auto',
            maxWidth: '600px',
            textAlign: 'center',
            backgroundColor: '#fff8f8',
            borderRadius: '8px',
            border: '1px solid #ffcaca',
          }}>
          <h2 style={{ color: '#d32f2f' }}>Something went wrong</h2>
          <p>We're sorry, but there was an error loading this component.</p>
          <button
            className='btn btn-primary'
            onClick={() => window.location.reload()}
            style={{ marginTop: '15px' }}>
            Reload Page
          </button>
          {process.env.NODE_ENV === 'development' && (
            <details
              style={{
                whiteSpace: 'pre-wrap',
                marginTop: '20px',
                textAlign: 'left',
                padding: '10px',
                backgroundColor: '#f8f8f8',
                borderRadius: '4px',
              }}>
              <summary>Error Details</summary>
              <p>{this.state.error && this.state.error.toString()}</p>
              <p>Component Stack:</p>
              <pre>
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      )
    }

    return this.props.children
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
}

export default ErrorBoundary
