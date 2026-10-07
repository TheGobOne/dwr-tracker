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
      // Tab cycles only within its own group (DL2 sim boxes, or the two coords boxes) so focus can't wander elsewhere.
      if (e.type === 'keydown' && e.key === 'Tab' && e.target instanceof HTMLElement && e.target.matches('[data-sim-field], [data-coords-field]')) {
        const selector = e.target.matches('[data-sim-field]') ? '[data-sim-field]' : '[data-coords-field]'
        const scope = e.target.closest('[role="dialog"]') ?? document
        const fields = [...scope.querySelectorAll<HTMLElement>(selector)]
        const index = fields.indexOf(e.target)
        const next = fields[(index + (e.shiftKey ? -1 : 1) + fields.length) % fields.length]
        next?.focus()
        if (next instanceof HTMLInputElement) next.select()
      }
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
