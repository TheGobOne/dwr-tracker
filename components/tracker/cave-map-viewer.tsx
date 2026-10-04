'use client'

import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

export const CAVE_MAPS: Record<string, { title: string; src: string }> = {
  'erdricks-cave': { title: "Erdrick's Cave", src: '/cave-maps/erdricks.png?v=3' },
  'garins-grave': { title: "Garin's Grave", src: '/cave-maps/grave.png?v=3' },
  'mountain-cave': { title: 'Mountain Cave', src: '/cave-maps/mountain.png?v=3' },
  'swamp-north': { title: 'Swamp Cave', src: '/cave-maps/swamp.png?v=3' },
  'swamp-south': { title: 'Swamp Cave', src: '/cave-maps/swamp.png?v=3' },
  charlock: { title: 'Charlock Castle', src: '/cave-maps/charlock.png?v=1' },
}

export function CaveMapViewer({ locationId, onClose }: { locationId: string | null; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const map = locationId ? CAVE_MAPS[locationId] : null

  useEffect(() => {
    if (map) closeRef.current?.focus({ preventScroll: true })
  }, [map])

  if (!map) return null

  const trackerRoot = document.querySelector('[data-tracker-root]')
  if (!trackerRoot) return null

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${map.title} map`}
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/85 p-1.5"
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="dw-window flex h-full max-h-full w-full flex-col gap-2 p-3">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-[10px] text-primary">{map.title}</h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="font-display text-[10px] text-foreground hover:text-primary focus-visible:outline-2 focus-visible:outline-primary"
          >
            CLOSE
          </button>
        </div>
        <img
          src={map.src || '/placeholder.svg'}
          alt={`${map.title} dungeon map`}
          className="min-h-0 w-full flex-1 object-contain"
          style={{ imageRendering: 'pixelated' }}
        />
      </div>
    </div>,
    trackerRoot,
  )
}
