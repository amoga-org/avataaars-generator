// Renderer.js
import '../assets/App.css'

import React, { useEffect, useContext } from 'react'
import PropTypes from 'prop-types'
import { Avatar, AvatarStyle, OptionContext, allOptions } from 'avataaars'
import {
  UrlQueryParamTypes,
  UrlUpdateTypes,
  addUrlProps,
} from 'react-url-query'
import { fromPairs } from 'lodash'

const updateType = UrlUpdateTypes.pushIn
const urlPropsQueryConfig = {
  ...fromPairs(
    allOptions.map((option) => [
      option.key,
      {
        type: UrlQueryParamTypes.string,
        updateType,
      },
    ])
  ),
  avatarStyle: {
    type: UrlQueryParamTypes.string,
    updateType,
  },
}

const Renderer = ({ avatarStyle, ...props }) => {
  const optionContext = useContext(OptionContext)

  useEffect(() => {
    updateOptionContext(props)

    const anyWindow = window
    setTimeout(() => {
      anyWindow.prerenderReady = true
    }, 500)
  }, [props])

  const updateOptionContext = (nextProps) => {
    optionContext.setData(nextProps)
  }

  return (
    <main role='main'>
      <Avatar
        style={{
          position: 'absolute',
          left: '0',
          right: '0',
          bottom: '0',
          top: '0',
          width: '100%',
          height: '100%',
        }}
        avatarStyle={avatarStyle}
      />
    </main>
  )
}

Renderer.propTypes = {
  avatarStyle: PropTypes.string,
  onChangeUrlQueryParams: PropTypes.func,
  onChangeAvatarStyle: PropTypes.func,
}

Renderer.defaultProps = {
  avatarStyle: AvatarStyle.Circle,
}

export default addUrlProps({ urlPropsQueryConfig })(Renderer)
