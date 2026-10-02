'use client'

import { useEffect, useRef } from 'react'

export const CAVE_MAPS: Record<string, { title: string; src: string }> = {
  'erdricks-cave': { title: "Erdrick's Cave", src: '/cave-maps/erdricks.png?v=3' },
  'garins-grave': { title: "Garin's Grave", src: '/cave-maps/grave.png?v=3' },
  'mountain-cave': { title: 'Mountain Cave', src: '/cave-maps/mountain.png?v=3' },
  'swamp-north': { title: 'Swamp Cave', src: '/cave-maps/swamp.png?v=3' },
  'swamp-south': { title: 'Swamp Cave', src: '/cave-maps/swamp.png?v=3' },
}

export function CaveMapViewer({ locationId, onClose }: { locationId: string | null; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const map = locationId ? CAVE_MAPS[locationId] : null

  useEffect(() => {
    if (!map) return
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [map, onClose])

  if (!map) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${map.title} map`}
      className="fixed inset-y-0 left-1/2 z-50 flex w-full max-w-[640px] -translate-x-1/2 items-center justify-center bg-black/85 p-1.5"
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
    </div>
  )
}
