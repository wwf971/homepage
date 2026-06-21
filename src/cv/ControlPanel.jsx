import React, { useState, useRef } from 'react'
import { toPng, toSvg } from 'html-to-image'
import useCVSettings from './CVSetting.js'
import BackToHome from '@/navi/BackToHome.jsx'
import './ControlPanel.css'

function downloadDataUrl(dataUrl, fileName) {
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const ControlPanel = ({ exportRef }) => {
  const {
    displayStyle,
    heightMode,
    toggleDisplayStyle,
    toggleHeightMode
  } = useCVSettings()

  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: window.innerWidth - 300, y: 20 })
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [isExportingPng, setIsExportingPng] = useState(false)
  const [isExportingSvg, setIsExportingSvg] = useState(false)
  const [exportErrorMessage, setExportErrorMessage] = useState('')
  const panelRef = useRef(null)

  const handleMouseDown = (e) => {
    if (e.target.closest('.control-group')) return

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

  const handleDownloadPng = async () => {
    if (!exportRef?.current || isExportingPng || isExportingSvg) {
      return
    }
    setExportErrorMessage('')
    setIsExportingPng(true)
    try {
      const dataUrl = await toPng(exportRef.current, {
        cacheBust: true,
        pixelRatio: 2,
      })
      downloadDataUrl(dataUrl, 'cv.png')
    } catch {
      setExportErrorMessage('Failed to export PNG.')
    } finally {
      setIsExportingPng(false)
    }
  }

  const handleDownloadSvg = async () => {
    if (!exportRef?.current || isExportingPng || isExportingSvg) {
      return
    }
    setExportErrorMessage('')
    setIsExportingSvg(true)
    try {
      const dataUrl = await toSvg(exportRef.current, {
        cacheBust: true,
      })
      downloadDataUrl(dataUrl, 'cv.svg')
    } catch {
      setExportErrorMessage('Failed to export SVG.')
    } finally {
      setIsExportingSvg(false)
    }
  }

  const prepareContainerForPrintMeasure = (a4Container) => {
    const original = {
      overflow: a4Container.style.overflow,
      height: a4Container.style.height,
      minHeight: a4Container.style.minHeight,
      maxHeight: a4Container.style.maxHeight,
      width: a4Container.style.width,
      margin: a4Container.style.margin,
    }

    a4Container.style.width = '100%'
    a4Container.style.margin = '0'
    a4Container.style.overflow = 'visible'
    a4Container.style.height = 'auto'
    a4Container.style.minHeight = 'auto'
    a4Container.style.maxHeight = 'none'

    a4Container.offsetHeight

    const rect = a4Container.getBoundingClientRect()

    a4Container.style.width = original.width
    a4Container.style.margin = original.margin
    a4Container.style.overflow = original.overflow
    a4Container.style.height = original.height
    a4Container.style.minHeight = original.minHeight
    a4Container.style.maxHeight = original.maxHeight

    return {
      widthMm: Math.ceil(rect.width * 0.264583),
      heightMm: Math.ceil(rect.height * 0.264583),
    }
  }

  const injectPrintStyle = (mode, dimensions = null) => {
    const existingStyle = document.getElementById('dynamic-print-style')
    if (existingStyle) {
      existingStyle.remove()
    }

    document.body.classList.remove('cv-print-continuous', 'cv-print-a4')
    document.body.classList.add(mode === 'a4' ? 'cv-print-a4' : 'cv-print-continuous')

    const style = document.createElement('style')
    style.id = 'dynamic-print-style'

    if (mode === 'a4') {
      style.textContent = `
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
        }
      `
    } else {
      style.textContent = `
        @media print {
          @page {
            size: ${dimensions.widthMm}mm ${dimensions.heightMm}mm;
            margin: 0;
          }
        }
      `
    }

    document.head.appendChild(style)
  }

  const triggerPrint = (mode) => {
    const a4Container = exportRef?.current || document.querySelector('.a4-container')
    if (!a4Container) {
      return
    }

    const cleanupPrintMode = () => {
      document.body.classList.remove('cv-print-continuous', 'cv-print-a4')
      window.removeEventListener('afterprint', cleanupPrintMode)
    }

    window.addEventListener('afterprint', cleanupPrintMode)

    if (mode === 'a4') {
      injectPrintStyle('a4')
    } else {
      const dimensions = prepareContainerForPrintMeasure(a4Container)
      injectPrintStyle('continuous', dimensions)
    }

    window.print()
  }

  const handlePrint = () => {
    triggerPrint('continuous')
  }

  const handlePrintA4 = () => {
    triggerPrint('a4')
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

  const isExporting = isExportingPng || isExportingSvg

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
        <div className="control-panel-title">CV Display Settings</div>
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
        <label className="control-label">Export:</label>
        {exportErrorMessage ? (
          <div className="control-export-error">{exportErrorMessage}</div>
        ) : null}
        <div className="control-export-row">
          <button
            className="export-button"
            type="button"
            onClick={handleDownloadPng}
            disabled={isExporting}
          >
            {isExportingPng ? 'Exporting...' : 'PNG'}
          </button>
          <button
            className="export-button"
            type="button"
            onClick={handleDownloadSvg}
            disabled={isExporting}
          >
            {isExportingSvg ? 'Exporting...' : 'SVG'}
          </button>
        </div>
        <div className="control-export-row">
          <button
            className="export-button export-button-print"
            type="button"
            onClick={handlePrint}
            disabled={isExporting}
          >
            Print
          </button>
          <button
            className="export-button export-button-print"
            type="button"
            onClick={handlePrintA4}
            disabled={isExporting}
          >
            Print A4
          </button>
        </div>
      </div>
    </div>
  )
}

export default ControlPanel
