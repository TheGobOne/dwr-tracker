'use client'

import { MapPin } from 'lucide-react'
import { KIND_META, LOCATIONS, type LocationKind } from '@/lib/dw-data'
import { cn } from '@/lib/utils'
import { DIRECTIONS, EMPTY_COORDS, useTracker, type Direction } from './tracker-context'

const COORDS_LOCATION_ID = 'rainbow-shrine'

const fieldClass =
  'h-4 rounded-[2px] border border-border bg-input/40 font-mono text-[10px] text-foreground focus-visible:outline-1 focus-visible:outline-primary'

function CoordsInput({ locationId, name }: { locationId: string; name: string }) {
  const { coords, updateCoords } = useTracker()
  const value = coords[locationId] ?? EMPTY_COORDS

  return (
    <fieldset className="flex shrink-0 items-center gap-0.5">
      <legend className="sr-only">{`${name} coordinates`}</legend>
      <input
        type="text"
        inputMode="numeric"
        maxLength={4}
        value={value.first}
        onChange={(e) => updateCoords(locationId, { first: e.target.value })}
        aria-label="First coordinate"
        className={cn(fieldClass, 'w-7 px-0.5 text-center')}
      />
      <select
        value={value.firstDir}
        onChange={(e) => updateCoords(locationId, { firstDir: e.target.value as Direction })}
        aria-label="First coordinate direction"
        className={cn(fieldClass, 'px-0')}
      >
        {DIRECTIONS.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>
      <input
        type="text"
        inputMode="numeric"
        maxLength={4}
        value={value.second}
        onChange={(e) => updateCoords(locationId, { second: e.target.value })}
        aria-label="Second coordinate"
        className={cn(fieldClass, 'ml-1 w-7 px-0.5 text-center')}
      />
      <select
        value={value.secondDir}
        onChange={(e) => updateCoords(locationId, { secondDir: e.target.value as Direction })}
        aria-label="Second coordinate direction"
        className={cn(fieldClass, 'px-0')}
      >
        {DIRECTIONS.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>
    </fieldset>
  )
}

const KIND_ORDER: LocationKind[] = ['castle', 'town', 'cave', 'shrine', 'special']

const ORDERED_LOCATIONS = KIND_ORDER.flatMap((kind) => LOCATIONS.filter((l) => l.kind === kind))

export function PanelTitle({ children, aside }: { children: React.ReactNode; aside?: React.ReactNode }) {
  return (
  <div className="flex items-baseline justify-center gap-2">
  <h2 className="font-display text-center text-[9px] uppercase tracking-wider text-primary">{children}</h2>
      {aside && <span className="text-xs text-muted-foreground">{aside}</span>}
    </div>
  )
}

export function LocationsPanel() {
  const { markers, visited, toggleVisited, selectedLocation, setSelectedLocation, setTool, requestFocus } = useTracker()

  const markerByLocation = new Map(markers.filter((m) => m.locationId).map((m) => [m.locationId as string, m]))

  return (
    <section aria-labelledby="locations-heading" className="flex flex-col gap-1">
      <h2 id="locations-heading" className="sr-only">
        Locations
      </h2>
      <PanelTitle>Locations</PanelTitle>
      <ul className="grid grid-cols-2 gap-x-1.5 sm:grid-cols-4">
        {ORDERED_LOCATIONS.map((location) => {
          const marker = markerByLocation.get(location.id)
          const isSelected = selectedLocation === location.id
          const isVisited = !!visited[location.id]
          return (
            <li
              key={location.id}
              className={cn(
                'flex h-5 items-center gap-1 rounded-sm border px-0.5',
                isSelected ? 'border-primary' : 'border-transparent',
                location.id === COORDS_LOCATION_ID && 'col-span-2',
              )}
            >
              <input
                type="checkbox"
                checked={isVisited}
                onChange={() => toggleVisited(location.id)}
                aria-label={`Mark ${location.name} as cleared`}
                className="size-3.5 shrink-0 accent-[var(--primary)]"
              />
              <button
                type="button"
                onClick={() => {
                  if (marker) {
                    requestFocus(marker.x, marker.y)
                  } else {
                    setSelectedLocation(isSelected ? null : location.id)
                    setTool('marker')
                  }
                }}
                title={marker ? `${location.name} at ${marker.x},${marker.y} — click to show` : `${location.hint} — click to place`}
                className={cn(
                  'flex min-w-0 items-center gap-1 text-left focus-visible:outline-2 focus-visible:outline-primary',
                  location.id === COORDS_LOCATION_ID ? 'mr-1' : 'flex-1',
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'flex h-4 w-6 shrink-0 items-center justify-center rounded-[2px] font-mono text-[10px] font-bold text-black',
                    !marker && 'opacity-40',
                  )}
                  style={{ backgroundColor: KIND_META[location.kind].color }}
                >
                  {location.abbr}
                </span>
                <span
                  className={cn(
                    'truncate text-xs',
                    isVisited ? 'text-muted-foreground line-through' : marker ? 'text-foreground' : 'text-muted-foreground',
                  )}
                >
                  {location.name}
                </span>
              </button>
              {location.id === COORDS_LOCATION_ID && <CoordsInput locationId={location.id} name={location.name} />}
              {marker && (
                <button
                  type="button"
                  aria-label={isSelected ? 'Cancel moving' : `Move ${location.name}`}
                  title={isSelected ? 'Cancel moving' : 'Move marker'}
                  onClick={() => {
                    setSelectedLocation(isSelected ? null : location.id)
                    setTool('marker')
                  }}
                  className={cn(
                    'shrink-0 rounded-sm p-0.5 transition-colors focus-visible:outline-2 focus-visible:outline-primary',
                    isSelected ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  <MapPin className="size-3" aria-hidden="true" />
                </button>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
