'use client'

import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useTracker } from './tracker-context'

type GoldChest = { id: string; x: number; y: number }

type MapInfo = {
  title: string
  src: string
  width?: number
  height?: number
  goldChests?: GoldChest[]
}

export const CAVE_MAPS: Record<string, MapInfo> = {
  'erdricks-cave': { title: "Erdrick's Cave", src: '/cave-maps/erdricks.png?v=3' },
  'garins-grave': { title: "Garin's Grave", src: '/cave-maps/grave.png?v=3' },
  'mountain-cave': { title: 'Mountain Cave', src: '/cave-maps/mountain.png?v=3' },
  'swamp-north': { title: 'Swamp Cave', src: '/cave-maps/swamp.png?v=3' },
  'swamp-south': { title: 'Swamp Cave', src: '/cave-maps/swamp.png?v=3' },
  charlock: { title: 'Charlock Castle', src: '/cave-maps/charlock.png?v=1' },
  tantegel: {
    title: 'Tantegel Castle',
    src: '/cave-maps/tantegel.png?v=1',
    width: 547,
    height: 514,
    goldChests: [
      { id: 'chest-1', x: 57.5, y: 248 },
      { id: 'chest-2', x: 73, y: 264.5 },
      { id: 'chest-3', x: 57.5, y: 280.5 },
      { id: 'chest-4', x: 89, y: 280.5 },
    ],
  },
}

const CHEST_RING_PX = 22

export function CaveMapViewer({ locationId, onClose }: { locationId: string | null; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const { shopStock, toggleShopItem } = useTracker()
  const map = locationId ? CAVE_MAPS[locationId] : null

  useEffect(() => {
    if (map) closeRef.current?.focus({ preventScroll: true })
  }, [map])

  if (!map || !locationId) return null

  const trackerRoot = document.querySelector('[data-tracker-root]')
  if (!trackerRoot) return null

  const goldKey = `${locationId}:gold-chests`
  const goldState = shopStock[goldKey] ?? {}
  const hasOverlay = !!(map.goldChests && map.width && map.height)

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
        {hasOverlay ? (
          <div className="flex min-h-0 flex-1 items-center justify-center" style={{ containerType: 'size' }}>
            <div
              className="relative"
              style={{
                width: `min(100cqw, calc(100cqh * ${map.width! / map.height!}))`,
                aspectRatio: `${map.width} / ${map.height}`,
              }}
            >
              <img
                src={map.src || '/placeholder.svg'}
                alt={`${map.title} map`}
                className="block size-full"
                style={{ imageRendering: 'pixelated' }}
              />
              {map.goldChests!.map((chest, i) => {
                const hasGold = !!goldState[chest.id]
                return (
                  <button
                    key={chest.id}
                    type="button"
                    aria-pressed={hasGold}
                    aria-label={`Treasury chest ${i + 1}${hasGold ? ', has gold' : ''}`}
                    onClick={() => toggleShopItem(goldKey, chest.id)}
                    className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-primary hover:bg-primary/20 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-foreground"
                    style={{
                      left: `${(chest.x / map.width!) * 100}%`,
                      top: `${(chest.y / map.height!) * 100}%`,
                      width: `${(CHEST_RING_PX / map.width!) * 100}%`,
                      aspectRatio: '1',
                    }}
                  >
                    {hasGold && (
                      <span
                        aria-hidden="true"
                        className="block size-[55%] rounded-full border border-[#8a5a00] bg-[#f8c800] shadow-[inset_-1px_-1px_0_#c08000,inset_1px_1px_0_#fff3a0]"
                      />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        ) : (
          <img
            src={map.src || '/placeholder.svg'}
            alt={`${map.title} dungeon map`}
            className="min-h-0 w-full flex-1 object-contain"
            style={{ imageRendering: 'pixelated' }}
          />
        )}
      </div>
    </div>,
    trackerRoot,
  )
}
