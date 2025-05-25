// Main.js
import '../assets/ModernApp.css'

import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import FileSaver from 'file-saver'
import { Avatar, AvatarStyle, OptionContext, allOptions } from 'avataaars'
import { Button } from 'react-bootstrap'
import { Helmet } from 'react-helmet'
import {
  UrlQueryParamTypes,
  UrlUpdateTypes,
  addUrlProps,
} from 'react-url-query'
import { fromPairs, sample } from 'lodash'

import AvatarForm from './AvatarForm'
import ComponentCode from './ComponentCode'
import ComponentImg from './ComponentImg'
import Spinner from './Spinner'
import { useLocalStorage } from '../hooks'
import { getImageRendererUrl } from '../setup'

function capitalizeFirstLetter(text) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

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

const Main = (props) => {
  const { avatarStyle, onChangeAvatarStyle, onChangeUrlQueryParams } = props
  const [displayComponentCode, setDisplayComponentCode] = useState(false)
  const [displayComponentImg, setDisplayComponentImg] = useState(false)
  const [lastOptions, setLastOptions] = useLocalStorage(
    'avataaars-lastOptions',
    {}
  )
  const [isLoading, setIsLoading] = useState(true)
  const avatarRef = useRef(null)
  const canvasRef = useRef(null)
  const optionContext = useRef(new OptionContext(allOptions)).current

  // Helper function to check if URL has avatar parameters
  const hasUrlParams = () => {
    const params = new URLSearchParams(window.location.search)
    for (const option of optionContext.options) {
      if (params.has(option.key)) {
        return true
      }
    }
    return params.has('avatarStyle')
  }

  useEffect(() => {
    optionContext.addValueChangeListener(onOptionValueChange)
    updateOptionContext(props)

    // Try to load saved options if URL doesn't have any
    if (Object.keys(lastOptions).length > 0 && !hasUrlParams()) {
      const savedOptions = { ...lastOptions }
      optionContext.setData(savedOptions)
      onChangeUrlQueryParams(savedOptions, UrlUpdateTypes.push)
    }

    const anyWindow = window
    setTimeout(() => {
      anyWindow.prerenderReady = true
      setIsLoading(false)
    }, 500)

    return () => {
      optionContext.removeValueChangeListener(onOptionValueChange)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Update option context when props change
  useEffect(() => {
    updateOptionContext(props)
  }, [props]) // eslint-disable-line react-hooks/exhaustive-deps

  const onOptionValueChange = (key, value) => {
    const name = capitalizeFirstLetter(key)
    const handlerName = `onChange${name}`
    const updateHandler = props[handlerName]

    // Save to localStorage
    setLastOptions((prev) => ({
      ...prev,
      [key]: value,
      avatarStyle,
    }))

    if (updateHandler) {
      updateHandler(value)
    }
  }

  const updateOptionContext = (nextProps) => {
    optionContext.setData(nextProps)
  }

  const handleAvatarStyleChange = (avatarStyle) => {
    onChangeAvatarStyle(avatarStyle)
  }

  const handleRandom = () => {
    let values = {
      avatarStyle: avatarStyle,
    }

    for (const option of optionContext.options) {
      if (option.key in values) {
        continue
      }
      const optionState = optionContext.getOptionState(option.key)
      // Notice, when the app just launch and we didn't explore too much
      // options, some of these nested option is not added by the selector
      // yet, so we won't be able to select value for them. But as they
      // keep tapping random button, soon or later we will get all the
      // options. So it should be fine.
      if (!optionState || !optionState.options.length) {
        continue
      }
      values[option.key] = sample(optionState.options)
    }

    // Save to localStorage
    setLastOptions(values)

    optionContext.setData(values)
    onChangeUrlQueryParams(values, UrlUpdateTypes.push)
  }

  const handleDownloadPNG = () => {
    const svgNode = avatarRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const DOMURL = window.URL || window.webkitURL || window

    const data = svgNode.outerHTML
    const img = new Image()
    const svg = new Blob([data], { type: 'image/svg+xml' })
    const url = DOMURL.createObjectURL(svg)

    img.onload = () => {
      ctx.save()
      ctx.scale(2, 2)
      ctx.drawImage(img, 0, 0)
      ctx.restore()
      DOMURL.revokeObjectURL(url)
      canvas.toBlob((imageBlob) => {
        triggerDownload(imageBlob, 'avataaars.png')
      })
    }
    img.src = url
  }

  const handleDownloadSVG = () => {
    const svgNode = avatarRef.current
    const data = svgNode.outerHTML
    const svg = new Blob([data], { type: 'image/svg+xml' })
    triggerDownload(svg, 'avataaars.svg')
  }

  const triggerDownload = (imageBlob, fileName) => {
    FileSaver.saveAs(imageBlob, fileName)
  }

  const handleToggleCode = () => {
    setDisplayComponentCode(!displayComponentCode)
    setDisplayComponentImg(false)
  }

  const handleToggleImg = () => {
    setDisplayComponentImg(!displayComponentImg)
    setDisplayComponentCode(false)
  }

  const title = 'Avataaars Generator - Generate your own avataaars!'
  // Use the image renderer URL from our setup module
  const imageURL = getImageRendererUrl() + location.search

  return (
    <main role='main'>
      <header className='header clearfix'>
        <h2 style={{ color: '#6A39D7' }}>
          avataaars generator
          <Button
            type='submit'
            variant='secondary'
            style={{ marginLeft: '1rem' }}
            onClick={handleRandom}
            className='pull-right'>
            <i className='fas fa-random'></i> Random
          </Button>
        </h2>
      </header>
      <Helmet>
        <meta property='og:title' content={title} />
        <meta property='og:site_name' content='Avataaars Generator' />
        <meta property='og:url' content={document.location.href} />
        <meta property='og:image' content={imageURL} />
        <meta
          property='og:description'
          content='Avataaars Generator is a free online tool for generating your own avatar'
        />
        <meta name='twitter:card' content='photo' />
        <meta name='twitter:site' content='Avataaars Generator' />
        <meta name='twitter:title' content={title} />
        <meta name='twitter:image' content={imageURL} />
        <meta name='twitter:url' content={document.location.href} />
      </Helmet>

      <div className='avatar-container'>
        {isLoading ? (
          <Spinner size='large' label='Loading avatar...' />
        ) : (
          <Avatar ref={avatarRef} avatarStyle={avatarStyle} />
        )}
      </div>

      <AvatarForm
        optionContext={optionContext}
        avatarStyle={avatarStyle}
        displayingCode={displayComponentCode}
        displayingImg={displayComponentImg}
        onDownloadPNG={handleDownloadPNG}
        onDownloadSVG={handleDownloadSVG}
        onAvatarStyleChange={handleAvatarStyleChange}
        onToggleCode={handleToggleCode}
        onToggleImg={handleToggleImg}
      />
      {displayComponentImg && <ComponentImg avatarStyle={avatarStyle} />}
      {displayComponentCode && <ComponentCode avatarStyle={avatarStyle} />}
      <canvas
        style={{ display: 'none' }}
        width='528'
        height='560'
        ref={canvasRef}
      />
    </main>
  )
}

Main.propTypes = {
  avatarStyle: PropTypes.string,
  onChangeUrlQueryParams: PropTypes.func.isRequired,
  onChangeAvatarStyle: PropTypes.func.isRequired,
}

Main.defaultProps = {
  avatarStyle: AvatarStyle.Circle,
}

export default addUrlProps({ urlPropsQueryConfig })(Main)
