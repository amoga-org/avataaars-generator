// AvatarForm.js
import React, { useEffect, useState, useContext } from 'react'
import PropTypes from 'prop-types'
import { AvatarStyle } from 'avataaars'
import {
  Button,
  Col,
  FormLabel,
  Form,
  FormControl,
  FormGroup,
} from 'react-bootstrap'

// ref: https://stackoverflow.com/a/1714899/25077
const serializeQuery = function (obj) {
  const str = []
  for (const p in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, p)) {
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]))
    }
  }
  return str.join('&')
}

const OptionSelect = ({ controlId, label, value, children, onChange }) => {
  const handleChange = (event) => {
    if (onChange) {
      onChange(event.target.value)
    }
  }

  return (
    <FormGroup className='row' controlId={controlId}>
      <Col as={FormLabel} sm={3}>
        {label}
      </Col>
      <Col sm={9}>
        <FormControl as='select' value={value} onChange={handleChange}>
          {children}
        </FormControl>
      </Col>
    </FormGroup>
  )
}

OptionSelect.propTypes = {
  controlId: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  children: PropTypes.node,
  onChange: PropTypes.func,
}

const AvatarForm = ({
  avatarStyle,
  optionContext,
  displayingCode,
  displayingImg,
  onDownloadPNG,
  onDownloadSVG,
  onAvatarStyleChange,
  onToggleCode,
  onToggleImg,
}) => {
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0)
  const [onChangeHandlers, setOnChangeHandlers] = useState([])

  useEffect(() => {
    optionContext.addStateChangeListener(() => {
      forceUpdate()
    })

    // Create onChange handlers for each option
    const handlers = optionContext.options.map(
      (option) => (value) => optionContext.setValue(option.key, value)
    )
    setOnChangeHandlers(handlers)

    return () => {
      // Clean up listeners when component unmounts
      optionContext.removeStateChangeListener(forceUpdate)
    }
  }, [optionContext, forceUpdate])

  const handleAvatarStyleChange = (event) => {
    if (onAvatarStyleChange) {
      onAvatarStyleChange(event.target.value)
    }
  }

  const handleDownloadPNG = (event) => {
    event.preventDefault()
    if (onDownloadPNG) {
      onDownloadPNG()
    }
  }

  const handleDownloadSVG = (event) => {
    event.preventDefault()
    if (onDownloadSVG) {
      onDownloadSVG()
    }
  }

  const handleToggleCode = (event) => {
    event.preventDefault()
    if (onToggleCode) {
      onToggleCode()
    }
  }

  const handleToggleImg = (event) => {
    event.preventDefault()
    if (onToggleImg) {
      onToggleImg()
    }
  }

  const selects = optionContext.options.map((option, index) => {
    const optionState = optionContext.getOptionState(option.key)
    if (!optionState || optionState.available <= 0) {
      return null
    }
    const selectOptions = optionState.options.map((type) => (
      <option key={type} value={type}>
        {type}
      </option>
    ))
    const value = optionContext.getValue(option.key)
    return (
      <OptionSelect
        key={option.key}
        controlId={option.key}
        label={option.label}
        value={value}
        onChange={onChangeHandlers[index]}>
        {selectOptions}
      </OptionSelect>
    )
  })

  const labelCol = 3
  const inputCol = 9

  return (
    <Form>
      <FormGroup className='row' controlId='avatar-style'>
        <Col as={FormLabel} sm={3}>
          Avatar Style
        </Col>
        <Col sm={9}>
          <label className='mr-2'>
            <input
              type='radio'
              id='avatar-style-circle'
              name='avatar-style'
              value={AvatarStyle.Circle}
              checked={avatarStyle === AvatarStyle.Circle}
              onChange={handleAvatarStyleChange}
            />{' '}
            Circle
          </label>{' '}
          <label>
            <input
              type='radio'
              id='avatar-style-transparent'
              name='avatar-style'
              value={AvatarStyle.Transparent}
              checked={avatarStyle === AvatarStyle.Transparent}
              onChange={handleAvatarStyleChange}
            />{' '}
            Transparent
          </label>
        </Col>
      </FormGroup>
      {selects}
      <FormGroup className='row'>
        <Col sm={{ span: inputCol, offset: labelCol }}>
          <span>
            More options coming soon,{' '}
            <a
              href='http://eepurl.com/c_7fN9'
              target='_blank'
              rel='noopener noreferrer'>
              subscribe for updates
            </a>
          </span>
        </Col>
      </FormGroup>
      <FormGroup className='row'>
        <Col sm={{ span: inputCol, offset: labelCol }}>
          <Button variant='primary' onClick={handleDownloadPNG}>
            <i className='fa fa-download' /> Download PNG
          </Button>{' '}
          <Button variant='secondary' onClick={handleDownloadSVG}>
            <i className='fa fa-download' /> Download SVG
          </Button>{' '}
          <Button
            variant={displayingCode ? 'success' : 'secondary'}
            onClick={handleToggleCode}>
            <i className='fa fa-code' /> React
          </Button>{' '}
          <Button
            variant={displayingImg ? 'success' : 'secondary'}
            onClick={handleToggleImg}>
            <i className='fa fa-picture-o' /> URL
          </Button>
          <div style={{ marginTop: '10px' }}>
            <iframe
              src={
                'https://platform.twitter.com/widgets/tweet_button.html?' +
                serializeQuery({
                  text: 'I just created my avataaars here 😆',
                  url: document.location.href,
                  hashtags: 'avataaars,avatar',
                  size: 'l',
                  lang: 'en',
                })
              }
              width='140'
              height='28'
              title='Twitter Tweet Button'
              style={{ border: 0, overflow: 'hidden' }}
            />
          </div>
        </Col>
      </FormGroup>
    </Form>
  )
}

AvatarForm.propTypes = {
  avatarStyle: PropTypes.string.isRequired,
  optionContext: PropTypes.object.isRequired,
  displayingCode: PropTypes.bool.isRequired,
  displayingImg: PropTypes.bool.isRequired,
  onDownloadPNG: PropTypes.func,
  onDownloadSVG: PropTypes.func,
  onAvatarStyleChange: PropTypes.func,
  onToggleCode: PropTypes.func,
  onToggleImg: PropTypes.func,
}

export default AvatarForm
