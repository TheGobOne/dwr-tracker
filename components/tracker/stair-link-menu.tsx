'use client'

import { useEffect, useRef } from 'react'
import { LOCATION_BY_ID, STAIR_CAVE_IDS, badgeBackground, locationColor } from '@/lib/dw-data'
import { useTracker } from './tracker-context'

export interface StairMenuAnchor {
  stairId: string
  x: number
  y: number
}

export function StairLinkMenu({
  anchor,
  canvasSize,
  onClose,
}: {
  anchor: StairMenuAnchor | null
  canvasSize: number
  onClose: () => void
}) {
  const { stairLinks, setStairLink, items } = useTracker()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!anchor) return
    ref.current?.querySelector<HTMLButtonElement>('[role=menuitemradio]')?.focus()
    function onPointerDown(e: PointerEvent) {
      if (!ref.current?.contains(e.target as Node)) onClose()
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('pointerdown', onPointerDown, true)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('pointerdown', onPointerDown, true)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [anchor, onClose])

  if (!anchor) return null
  const current = stairLinks[anchor.stairId]
  const menuWidth = 150
  const left = Math.max(4, Math.min(canvasSize - menuWidth - 4, anchor.x - menuWidth / 2))
  const openUp = anchor.y > canvasSize - 230

  function pick(caveId: string | null) {
    if (!anchor) return
    setStairLink(anchor.stairId, caveId)
    onClose()
  }

  return (
    <div
      ref={ref}
      role="menu"
      aria-label="Where do these stairs lead?"
      onContextMenu={(e) => e.preventDefault()}
      className="dw-window font-display absolute z-30 flex flex-col gap-0.5 p-1.5 text-[9px] leading-none"
      style={{ left, width: menuWidth, ...(openUp ? { bottom: canvasSize - anchor.y + 22 } : { top: anchor.y + 4 }) }}
    >
      <p className="px-1 pb-1 text-center text-primary">Stairs lead to</p>
      {STAIR_CAVE_IDS.map((id) => {
        const location = LOCATION_BY_ID[id]
        const selected = current === id
        return (
          <button
            key={id}
            type="button"
            role="menuitemradio"
            aria-checked={selected}
            onClick={() => pick(id)}
            className={`flex items-center gap-1.5 rounded-sm px-1 py-1 text-left outline-none hover:bg-white/10 focus-visible:bg-white/10 ${selected ? 'text-primary' : 'text-foreground'}`}
          >
            <span
              aria-hidden="true"
              className="flex h-3.5 w-5 flex-none items-center justify-center rounded-[2px] text-[6px] text-black"
              style={{ background: badgeBackground(id, locationColor(location, items)) }}
            >
              {location.abbr}
            </span>
            {location.name}
          </button>
        )
      })}
      {current && (
        <button
          type="button"
          role="menuitem"
          onClick={() => pick(null)}
          className="mt-0.5 rounded-sm border-t border-white/20 px-1 pt-1.5 pb-1 text-left text-muted-foreground outline-none hover:text-foreground focus-visible:text-foreground"
        >
          Clear
        </button>
      )}
    </div>
  )
}
