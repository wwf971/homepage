import React, { forwardRef } from 'react'
import useCVSettings from './CVSetting.js'
import './A4Container.css'

const A4Container = forwardRef(function A4Container({ children }, ref) {
  const { displayStyle, heightMode } = useCVSettings()

  const wrapperClasses = [
    'a4-wrapper',
    `style-${displayStyle}`
  ].join(' ')

  const containerClasses = [
    'a4-container',
    `height-${heightMode}`
  ].join(' ')

  return (
    <div className={wrapperClasses}>
      <div className={containerClasses} ref={ref}>
        {children}
      </div>
    </div>
  )
})

export default A4Container