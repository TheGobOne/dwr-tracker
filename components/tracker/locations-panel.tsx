'use client'

import { MapPin } from 'lucide-react'
import { KIND_META, LOCATIONS, type LocationKind } from '@/lib/dw-data'
import { cn } from '@/lib/utils'
import {
  EMPTY_COORDS,
  EW_DIRECTIONS,
  NS_DIRECTIONS,
  useTracker,
  type EWDirection,
  type NSDirection,
} from './tracker-context'

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
        onChange={(e) => updateCoords(locationId, { firstDir: e.target.value as NSDirection })}
        aria-label="First coordinate direction"
        className={cn(fieldClass, 'px-0')}
      >
        <option value="" className="bg-background text-foreground" />
        {NS_DIRECTIONS.map((d) => (
          <option key={d} value={d} className="bg-background text-foreground">
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
        onChange={(e) => updateCoords(locationId, { secondDir: e.target.value as EWDirection })}
        aria-label="Second coordinate direction"
        className={cn(fieldClass, 'px-0')}
      >
        <option value="" className="bg-background text-foreground" />
        {EW_DIRECTIONS.map((d) => (
          <option key={d} value={d} className="bg-background text-foreground">
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
  <div aria-hidden="true" className="invisible flex items-baseline justify-center gap-2">
  <h2 className="font-display text-center text-[9px] uppercase tracking-wider text-primary">{children}</h2>
      {aside && <span className="text-xs text-muted-foreground">{aside}</span>}
    </div>
  )
}

export function LocationsPanel() {
  const { markers, visited, selectedLocation, setSelectedLocation, setTool, requestFocus } = useTracker()

  const markerByLocation = new Map(markers.filter((m) => m.locationId).map((m) => [m.locationId as string, m]))

  return (
    <section aria-labelledby="locations-heading" className="flex flex-col gap-1">
      <h2 id="locations-heading" className="sr-only">
        Locations
      </h2>
      <PanelTitle>Locations</PanelTitle>
      <ul className="grid grid-cols-2 gap-x-1.5 sm:grid-cols-4">
        {ORDERED_LOCATIONS.flatMap((location) => {
          const marker = markerByLocation.get(location.id)
          const isSelected = selectedLocation === location.id
          const isVisited = !!visited[location.id]
          const coordsCell =
            location.id === COORDS_LOCATION_ID
              ? [
                  <li key={`${location.id}-coords`} className="flex h-5 items-center px-0.5">
                    <CoordsInput locationId={location.id} name={location.name} />
                  </li>,
                ]
              : []
          return [
            <li
              key={location.id}
              className={cn(
                'flex h-5 items-center gap-1 rounded-sm border px-0.5',
                isSelected ? 'border-primary' : 'border-transparent',
              )}
            >
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
                className="flex min-w-0 flex-1 items-center gap-1 text-left focus-visible:outline-2 focus-visible:outline-primary"
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
              {marker && (
                <button
                  type="button"
                  aria-label={isSelected ? 'Cancel moving' : `Move ${location.name}`}
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
            </li>,
            ...coordsCell,
          ]
        })}
      </ul>
    </section>
  )
}
