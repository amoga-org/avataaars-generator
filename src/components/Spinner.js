// Spinner.js
import React from 'react'
import PropTypes from 'prop-types'

const Spinner = ({
  size = 'medium',
  color = '#6A39D7',
  label = 'Loading...',
}) => {
  const sizeMap = {
    small: 20,
    medium: 32,
    large: 48,
  }

  const spinnerSize = sizeMap[size] || sizeMap.medium

  return (
    <div
      className='spinner-container'
      style={{ textAlign: 'center', padding: '20px' }}>
      <div
        className='spinner'
        style={{
          display: 'inline-block',
          width: `${spinnerSize}px`,
          height: `${spinnerSize}px`,
          border: `4px solid rgba(0, 0, 0, 0.1)`,
          borderLeftColor: color,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '10px',
        }}
      />

      {label && <div style={{ color: '#666', fontSize: '14px' }}>{label}</div>}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

Spinner.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  color: PropTypes.string,
  label: PropTypes.string,
}

export default Spinner
