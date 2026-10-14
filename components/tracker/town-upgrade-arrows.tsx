'use client'

import { useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { LOCATION_BY_ID, MAP_SIZE, hasEquipmentShop, shopUpgrades } from '@/lib/dw-data'
import { useTracker, type Marker } from './tracker-context'

function townKey(marker: Marker) {
  const location = LOCATION_BY_ID[marker.locationId as string]
  return location.unknown ? `unknown:${marker.x},${marker.y}` : location.id
}

export function TownUpgradeArrows({ scale, markerSize }: { scale: number; markerSize: (marker: Marker) => number }) {
  const { markers, shopStock, equipment } = useTracker()
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <>
      {markers.flatMap((marker) => {
        if (!hasEquipmentShop(marker.locationId)) return []
        const upgrades = shopUpgrades(shopStock[townKey(marker)], equipment)
        if (upgrades.length === 0) return []
        const half = markerSize(marker) / 2
        const left = marker.x * scale + scale / 2 - 7
        const top = marker.y * scale + scale / 2 - half - 15
        const townName = LOCATION_BY_ID[marker.locationId as string].name
        const open = openId === marker.id
        const tooltipId = `upgrades-${marker.id}`
        const flip = marker.x > MAP_SIZE * 0.7
        return [
          <div
            key={marker.id}
            style={{ position: 'absolute', left, top, zIndex: 5 }}
            onPointerEnter={() => setOpenId(marker.id)}
            onPointerLeave={() => setOpenId((id) => (id === marker.id ? null : id))}
          >
            <button
              type="button"
              aria-label={`${townName} upgrades`}
              aria-describedby={tooltipId}
              onFocus={() => setOpenId(marker.id)}
              onBlur={() => setOpenId((id) => (id === marker.id ? null : id))}
              style={{ width: 14, height: 14, borderRadius: 2, background: '#000', color: '#58D854' }}
              className="flex items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <ArrowUp aria-hidden="true" width={12} height={12} strokeWidth={3.5} />
            </button>
            <div
              id={tooltipId}
              role="tooltip"
              hidden={!open}
              style={{
                position: 'absolute',
                top: 0,
                ...(flip ? { right: '100%', marginRight: 4 } : { left: '100%', marginLeft: 4 }),
                background: 'rgba(0,0,0,0.9)',
                color: '#58D854',
                fontSize: 9,
                lineHeight: 1,
                padding: '6px 8px',
                borderRadius: 2,
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
              }}
              className="font-display"
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {upgrades.map((u) => (
                  <span key={u.id}>{u.name}</span>
                ))}
              </div>
            </div>
          </div>,
        ]
      })}
    </>
  )
}
