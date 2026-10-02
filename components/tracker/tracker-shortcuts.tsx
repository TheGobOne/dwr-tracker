'use client'

import { useEffect, useEffectEvent } from 'react'
import { useTracker } from './tracker-context'

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
    if (e.key === 'Escape') tracker.setSelectedLocation(null)
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
