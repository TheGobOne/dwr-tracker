'use client'

import { useEffect, useEffectEvent } from 'react'
import { TERRAINS } from '@/lib/dw-data'
import { BRUSH_SIZES, useTracker } from './tracker-context'

export function TrackerShortcuts() {
  const tracker = useTracker()

  const onKeyDown = useEffectEvent((e: KeyboardEvent) => {
    const target = e.target
    if (target instanceof HTMLElement && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))) {
      return
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
      e.preventDefault()
      tracker.undo()
      return
    }
    if (e.ctrlKey || e.metaKey || e.altKey) return

    const key = e.key.toLowerCase()
    const terrain = TERRAINS.find((t) => t.key === key)
    if (terrain) {
      tracker.setTerrain(terrain.id)
      if (tracker.tool !== 'paint' && tracker.tool !== 'fill') tracker.setTool('paint')
      return
    }
    const sizeIndex = BRUSH_SIZES.indexOf(tracker.brushSize as (typeof BRUSH_SIZES)[number])
    switch (key) {
      case 'b':
        tracker.setTool('paint')
        break
      case 'f':
        tracker.setTool('fill')
        break
      case 'm':
        tracker.setTool('marker')
        break
      case 'h':
        tracker.setTool('pan')
        break
      case 'g':
        tracker.setShowGrid(!tracker.showGrid)
        break
      case '[':
        tracker.setBrushSize(BRUSH_SIZES[Math.max(0, sizeIndex - 1)])
        break
      case ']':
        tracker.setBrushSize(BRUSH_SIZES[Math.min(BRUSH_SIZES.length - 1, sizeIndex + 1)])
        break
      case '=':
      case '+':
        tracker.setZoom(tracker.zoom + 1)
        break
      case '-':
        tracker.setZoom(tracker.zoom - 1)
        break
      case 'escape':
        tracker.setSelectedLocation(null)
        break
    }
  })

  const hasProgress = tracker.canUndo || tracker.markers.length > 0
  const onBeforeUnload = useEffectEvent((e: BeforeUnloadEvent) => {
    if (hasProgress) e.preventDefault()
  })

  useEffect(() => {
    const keyHandler = (e: KeyboardEvent) => onKeyDown(e)
    const unloadHandler = (e: BeforeUnloadEvent) => onBeforeUnload(e)
    window.addEventListener('keydown', keyHandler)
    window.addEventListener('beforeunload', unloadHandler)
    return () => {
      window.removeEventListener('keydown', keyHandler)
      window.removeEventListener('beforeunload', unloadHandler)
    }
  }, [])

  return null
}
