import React, { useState, useRef } from 'react'
import useCVSettings from './CVSetting.js'
import BackToHome from '@/navi/BackToHome.jsx'
import './ControlPanel.css'

const ControlPanel = () => {
  const { 
    displayStyle, 
    heightMode, 
    toggleDisplayStyle, 
    toggleHeightMode 
  } = useCVSettings()

  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: window.innerWidth - 300, y: 20 })
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const panelRef = useRef(null)

  const handleMouseDown = (e) => {
    if (e.target.closest('.control-group')) return // Don't drag when clicking buttons
    
    setIsDragging(true)
    const rect = panelRef.current.getBoundingClientRect()
    setDragStart({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handlePrint = () => {
    // Get the A4 container element
    const a4Container = document.querySelector('.a4-container')
    const cvContent = document.querySelector('.cv-content')
    
    if (!a4Container || !cvContent) {
      console.error('A4 container or CV content not found')
      return
    }
    
    // Temporarily apply print-like styles to measure accurate dimensions
    const originalOverflow = a4Container.style.overflow
    const originalHeight = a4Container.style.height
    const originalMinHeight = a4Container.style.minHeight
    const originalMaxHeight = a4Container.style.maxHeight
    const originalWidth = a4Container.style.width
    const originalMargin = a4Container.style.margin
    
    // Apply print styles: width 100%, no height constraints
    a4Container.style.width = '100%'
    a4Container.style.margin = '0'
    a4Container.style.overflow = 'visible'
    a4Container.style.height = 'auto'
    a4Container.style.minHeight = 'auto'
    a4Container.style.maxHeight = 'none'
    
    // Force layout recalculation
    a4Container.offsetHeight
    
    // Get actual dimensions with print styles
    const rect = a4Container.getBoundingClientRect()
    const widthPx = rect.width
    const heightPx = rect.height
    
    console.log(`[Print] Measured with print styles (width 100%, no height constraints):`)
    console.log(`[Print] Width: ${widthPx}px (${Math.ceil(widthPx * 0.264583)}mm)`)
    console.log(`[Print] Height: ${heightPx}px (${Math.ceil(heightPx * 0.264583)}mm)`)
    console.log(`[Print] scrollHeight: ${a4Container.scrollHeight}px, offsetHeight: ${a4Container.offsetHeight}px`)
    
    // Restore original styles
    a4Container.style.width = originalWidth
    a4Container.style.margin = originalMargin
    a4Container.style.overflow = originalOverflow
    a4Container.style.height = originalHeight
    a4Container.style.minHeight = originalMinHeight
    a4Container.style.maxHeight = originalMaxHeight
    
    // Convert px to mm (96 DPI standard: 1px = 0.264583mm)
    const widthMm = Math.ceil(widthPx * 0.264583)
    const heightMm = Math.ceil(heightPx * 0.264583)
    
    console.log(`[Print] PDF page size: ${widthMm}mm × ${heightMm}mm`)
    
    // Inject dynamic @page style
    const existingStyle = document.getElementById('dynamic-print-style')
    if (existingStyle) {
      existingStyle.remove()
    }
    
    const style = document.createElement('style')
    style.id = 'dynamic-print-style'
    style.textContent = `
      @media print {
        @page {
          size: ${widthMm}mm ${heightMm}mm;
          margin: 0;
        }
      }
    `
    document.head.appendChild(style)
    
    // Trigger print
    window.print()
  }

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, dragStart])

  return (
    <div 
      ref={panelRef}
      className={`control-panel no-render ${isDragging ? 'dragging' : ''}`}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 1000
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="control-panel-header">
        <h3 className="control-panel-title">CV Display Settings</h3>
        <div className="drag-handle">⋮⋮</div>
      </div>
      
      <div className="control-group">
        <BackToHome className="control-nav-button" />
      </div>

      <div className="control-group">
        <label className="control-label">Display Style:</label>
        <button 
          className={`toggle-button ${displayStyle === 'reading' ? 'active' : ''}`}
          onClick={toggleDisplayStyle}
        >
          {displayStyle === 'reading' ? 'Reading Mode' : 'Rendering Mode'}
        </button>
      </div>

      <div className="control-group">
        <label className="control-label">Page Height:</label>
        <button 
          className={`toggle-button ${heightMode === 'content' ? 'active' : ''}`}
          onClick={toggleHeightMode}
        >
          {heightMode === 'content' ? 'Auto Height' : 'A4 Height'}
        </button>
      </div>

      <div className="control-group">
        <button 
          className="print-button"
          onClick={handlePrint}
        >
          Print
        </button>
      </div>
    </div>
  )
}

export default ControlPanel