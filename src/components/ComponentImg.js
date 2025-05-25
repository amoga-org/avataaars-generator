// ComponentImg.js
import React, { useRef, useEffect, useContext } from 'react'
import { AvatarStyle, OptionContext, allOptions } from 'avataaars'

const ComponentImg = ({ avatarStyle }) => {
  const textAreaRef = useRef(null)
  const optionContext = useContext(OptionContext)

  useEffect(() => {
    const handleOptionValueChange = () => {
      // Force update by leveraging React's state
      forceUpdate()
    }

    optionContext.addValueChangeListener(handleOptionValueChange)

    return () => {
      optionContext.removeValueChangeListener(handleOptionValueChange)
    }
  }, [optionContext])

  const onTextAreaClick = () => {
    if (textAreaRef.current) {
      textAreaRef.current.focus()
      textAreaRef.current.select()
    }
  }

  // Create a simple force update function
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0)

  const props = []
  for (const option of allOptions) {
    const state = optionContext.getOptionState(option.key)
    if (!state || !state.available) {
      continue
    }
    const value = optionContext.getValue(option.key)
    props.push(`${option.key}=${value}`)
  }
  const propsStr = props.join('&')
  const code = `<img src='https://avataaars.io/?avatarStyle=${avatarStyle}&${propsStr}'
/>`

  return (
    <div>
      <h3 style={{ color: '#6A39D7' }}>
        &lt;img&gt; Code{' '}
        <a
          href='https://github.com/gkoberger/avataaars'
          style={{ fontSize: '0.8em' }}
          target='_blank'
          rel='noopener noreferrer'>
          <i className='fa fa-github' /> Repo
        </a>
      </h3>
      <p>You can include this as an SVG &lt;img&gt; from the API.</p>
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

export default ComponentImg
