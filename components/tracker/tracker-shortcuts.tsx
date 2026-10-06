'use client'

import { useEffect, useEffectEvent } from 'react'
import { useTracker } from './tracker-context'

export function TrackerShortcuts() {
  const tracker = useTracker()

  const hasProgress = tracker.canUndo || tracker.markers.length > 0
  const onBeforeUnload = useEffectEvent((e: BeforeUnloadEvent) => {
    if (hasProgress) e.preventDefault()
  })

  useEffect(() => {
    // Keyboard is intentionally disabled for the whole tracker except typing in the coords and notes boxes.
    // Tab stays blocked there too so focus can't wander. Ctrl/Meta combos are left alone for browser shortcuts.
    const blockKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) return
      const inTypingField =
        e.target instanceof HTMLElement && e.target.matches('[data-coords-field], [data-notes-field], [data-sim-field]')
      if (inTypingField && e.key !== 'Tab') return
      e.preventDefault()
      e.stopImmediatePropagation()
    }
    const unloadHandler = (e: BeforeUnloadEvent) => onBeforeUnload(e)
    window.addEventListener('keydown', blockKey, { capture: true })
    window.addEventListener('keyup', blockKey, { capture: true })
    window.addEventListener('beforeunload', unloadHandler)
    return () => {
      window.removeEventListener('keydown', blockKey, { capture: true })
      window.removeEventListener('keyup', blockKey, { capture: true })
      window.removeEventListener('beforeunload', unloadHandler)
    }
  }, [])

  return null
}
