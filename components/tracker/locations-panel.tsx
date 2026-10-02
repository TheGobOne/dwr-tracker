'use client'

import { Crosshair, MapPin, Trash2 } from 'lucide-react'
import { KIND_META, LOCATIONS, PIN_COLOR, type LocationKind } from '@/lib/dw-data'
import { cn } from '@/lib/utils'
import { useTracker } from './tracker-context'

const KIND_ORDER: LocationKind[] = ['castle', 'town', 'cave', 'shrine', 'special']

function coord(x: number, y: number) {
  return `${x},${y}`
}

function IconButton({
  label,
  onClick,
  children,
  active,
}: {
  label: string
  onClick: () => void
  children: React.ReactNode
  active?: boolean
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn(
        'rounded-sm border-2 p-1 transition-colors focus-visible:outline-2 focus-visible:outline-primary',
        active ? 'border-primary bg-primary text-primary-foreground' : 'border-foreground/25 hover:border-foreground',
      )}
    >
      {children}
    </button>
  )
}

export function LocationsPanel() {
  const { markers, visited, toggleVisited, selectedLocation, setSelectedLocation, setTool, requestFocus, removeMarker } =
    useTracker()

  const markerByLocation = new Map(markers.filter((m) => m.locationId).map((m) => [m.locationId as string, m]))
  const pins = markers.filter((m) => !m.locationId)
  const foundCount = markerByLocation.size

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-muted-foreground">
        Found <span className="text-foreground">{foundCount}</span> / {LOCATIONS.length}. Pick a location, then click the
        map to drop it.
      </p>

      {KIND_ORDER.map((kind) => (
        <section key={kind} aria-labelledby={`kind-${kind}`} className="flex flex-col gap-1.5">
          <h3 id={`kind-${kind}`} className="font-display text-[10px] uppercase tracking-wider" style={{ color: KIND_META[kind].color }}>
            {KIND_META[kind].label}
          </h3>
          <ul className="flex flex-col gap-1">
            {LOCATIONS.filter((l) => l.kind === kind).map((location) => {
              const marker = markerByLocation.get(location.id)
              const isSelected = selectedLocation === location.id
              const isVisited = !!visited[location.id]
              return (
                <li
                  key={location.id}
                  className={cn(
                    'flex items-center gap-2 rounded-sm border-2 px-2 py-1',
                    isSelected ? 'border-primary' : 'border-transparent',
                  )}
                >
                  <input
                    type="checkbox"
                    checked={isVisited}
                    onChange={() => toggleVisited(location.id)}
                    aria-label={`Mark ${location.name} as cleared`}
                    className="size-4 shrink-0 accent-[var(--primary)]"
                  />
                  <span
                    aria-hidden="true"
                    className="flex h-5 w-7 shrink-0 items-center justify-center rounded-[3px] font-mono text-[11px] font-bold text-black"
                    style={{ backgroundColor: KIND_META[kind].color }}
                  >
                    {location.abbr}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={cn('truncate text-sm leading-tight', isVisited && 'text-muted-foreground line-through')} title={location.hint}>
                      {location.name}
                    </p>
                    <p className="text-xs leading-tight text-muted-foreground">
                      {marker ? coord(marker.x, marker.y) : 'Not found'}
                    </p>
                  </div>
                  {marker && (
                    <IconButton label={`Show ${location.name} on map`} onClick={() => requestFocus(marker.x, marker.y)}>
                      <Crosshair className="size-3.5" aria-hidden="true" />
                    </IconButton>
                  )}
                  <IconButton
                    label={isSelected ? 'Cancel placing' : marker ? `Move ${location.name}` : `Place ${location.name}`}
                    active={isSelected}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedLocation(null)
                      } else {
                        setSelectedLocation(location.id)
                        setTool('marker')
                      }
                    }}
                  >
                    <MapPin className="size-3.5" aria-hidden="true" />
                  </IconButton>
                </li>
              )
            })}
          </ul>
        </section>
      ))}

      <section aria-labelledby="pins-heading" className="flex flex-col gap-1.5">
        <h3 id="pins-heading" className="font-display text-[10px] uppercase tracking-wider" style={{ color: PIN_COLOR }}>
          Custom Pins
        </h3>
        {pins.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Use the Marker tool with no location selected to drop pins for chests, hints or anything else.
          </p>
        ) : (
          <ul className="flex flex-col gap-1">
            {pins.map((pin) => (
              <li key={pin.id} className="flex items-center gap-2 px-2 py-1">
                <span
                  aria-hidden="true"
                  className="flex h-5 w-7 shrink-0 items-center justify-center rounded-[3px] font-mono text-[11px] font-bold text-black"
                  style={{ backgroundColor: PIN_COLOR }}
                >
                  !
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm leading-tight">{pin.label}</p>
                  <p className="text-xs leading-tight text-muted-foreground">{coord(pin.x, pin.y)}</p>
                </div>
                <IconButton label={`Show ${pin.label} on map`} onClick={() => requestFocus(pin.x, pin.y)}>
                  <Crosshair className="size-3.5" aria-hidden="true" />
                </IconButton>
                <IconButton label={`Remove ${pin.label}`} onClick={() => removeMarker(pin.id)}>
                  <Trash2 className="size-3.5" aria-hidden="true" />
                </IconButton>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
