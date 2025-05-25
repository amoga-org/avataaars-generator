// OptionContextProvider.js
import React, { createContext, useContext } from 'react'
import PropTypes from 'prop-types'
import { OptionContext } from 'avataaars'

// Create a context for the option context
const AvatarOptionContext = createContext(null)

export const useOptionContext = () => {
  const context = useContext(AvatarOptionContext)
  if (!context) {
    throw new Error(
      'useOptionContext must be used within an OptionContextProvider'
    )
  }
  return context
}

const OptionContextProvider = ({ children, optionContext }) => {
  return (
    <AvatarOptionContext.Provider value={optionContext}>
      {children}
    </AvatarOptionContext.Provider>
  )
}

OptionContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
  optionContext: PropTypes.instanceOf(OptionContext).isRequired,
}

export default OptionContextProvider
