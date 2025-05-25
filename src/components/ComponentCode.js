// ComponentCode.js
import React, { useRef, useEffect, useContext } from 'react'
import PropTypes from 'prop-types'
import { AvatarStyle, OptionContext, allOptions } from 'avataaars'

const ComponentCode = ({ avatarStyle }) => {
  const textAreaRef = useRef(null)
  const optionContext = useContext(OptionContext)

  // Create a simple force update function
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0)

  useEffect(() => {
    const handleOptionValueChange = () => {
      forceUpdate()
    }

    optionContext.addValueChangeListener(handleOptionValueChange)

    return () => {
      optionContext.removeValueChangeListener(handleOptionValueChange)
    }
  }, [optionContext, forceUpdate])

  const onTextAreaClick = () => {
    if (textAreaRef.current) {
      textAreaRef.current.focus()
      textAreaRef.current.select()
    }
  }

  const props = []
  for (const option of allOptions) {
    const state = optionContext.getOptionState(option.key)
    if (!state || !state.available) {
      continue
    }
    const value = optionContext.getValue(option.key)
    props.push(`  ${option.key}='${value}'`)
  }
  const propsStr = props.join('\n')
  const code = `<Avatar
  avatarStyle='${avatarStyle}'
${propsStr}
/>`

  return (
    <div>
      <h3 style={{ color: '#6A39D7' }}>
        React Code{' '}
        <a
          href='https://github.com/fangpenlin/avataaars'
          style={{ fontSize: '0.8em' }}
          target='_blank'
          rel='noopener noreferrer'>
          <i className='fa fa-github' /> Repo
        </a>
      </h3>
      <p>
        To use Avataaars in your React app, you need to install the package
        first. You can do it by running
      </p>
      <pre>
        <code>yarn add avataaars</code>
      </pre>
      <p>or</p>
      <pre>
        <code>npm install avataaars --save</code>
      </pre>
      <p>
        if you are using npm. Once you have avataaars package installed, you can
        copy and paste following code into your React component
      </p>
      <textarea
        readOnly
        style={{ width: '100%', height: '10em' }}
        value={code}
        ref={textAreaRef}
        onFocus={onTextAreaClick}
      />
    </div>
  )
}

ComponentCode.propTypes = {
  avatarStyle: PropTypes.string.isRequired,
}

export default ComponentCode
