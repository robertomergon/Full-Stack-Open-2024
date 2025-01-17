import { useState, forwardRef, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'

const Togglable = forwardRef((props, refs) => {
  Togglable.propTypes = {
    buttonLabel: PropTypes.string.isRequired,
    cancelLabel: PropTypes.string
  }
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(refs, () => {
    return {
      toggleVisibility
    }
  })

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div className='togglableContent' style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility}>{props?.cancelLabel ? props.cancelLabel : 'cancel'}</button>
      </div>
    </div>
  )
})

Togglable.displayName = 'Togglable'

export default Togglable