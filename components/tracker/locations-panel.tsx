'use client'

import { Check, MapPin } from 'lucide-react'
import { KIND_META, LOCATIONS, LOCATION_EXTRAS, badgeBackground, locationColor, type DWLocation, type LocationKind } from '@/lib/dw-data'
import { cn } from '@/lib/utils'
import {
  EMPTY_COORDS,
  EW_DIRECTIONS,
  NS_DIRECTIONS,
  useTracker,
  type EWDirection,
  type NSDirection,
} from './tracker-context'

export const COORDS_LOCATION_ID = 'rainbow-shrine'

const fieldClass =
  'h-4 rounded-[2px] border border-border bg-input/40 font-mono text-[8px] text-foreground focus-visible:outline-1 focus-visible:outline-primary'

export function CoordsInput({
  locationId,
  name,
  horizontal = false,
}: {
  locationId: string
  name: string
  horizontal?: boolean
}) {
  const { coords, updateCoords } = useTracker()
  const value = coords[locationId] ?? EMPTY_COORDS
  
  return (
  <fieldset
    className={cn(
      'flex shrink-0',
      horizontal
        ? 'w-full min-w-0 flex-row items-center gap-2'
        : 'min-w-0 flex-1 flex-row items-center gap-2 sm:w-full sm:flex-col sm:items-stretch sm:gap-0.5',
    )}
  >
      <legend className="sr-only">{`${name} coordinates`}</legend>
      <div className={cn('flex min-w-0 items-center gap-0.5', horizontal ? 'flex-1' : 'flex-1 sm:flex-none')}>
      <input
        type="text"
        inputMode="numeric"
        maxLength={4}
        value={value.first}
        onChange={(e) => updateCoords(locationId, { first: e.target.value })}
        aria-label="First coordinate"
        data-coords-field
        className={cn(fieldClass, 'w-0 min-w-0 flex-1 px-0.5 text-center')}
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
      </div>
      <div className={cn('flex min-w-0 items-center gap-0.5', horizontal ? 'flex-1' : 'flex-1 sm:flex-none')}>
      <input
        type="text"
        inputMode="numeric"
        maxLength={4}
        value={value.second}
        onChange={(e) => updateCoords(locationId, { second: e.target.value })}
        aria-label="Second coordinate"
        data-coords-field
        className={cn(fieldClass, 'w-0 min-w-0 flex-1 px-0.5 text-center')}
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
      </div>
    </fieldset>
  )
}

const KIND_ORDER: LocationKind[] = ['castle', 'town', 'cave', 'shrine', 'special']

const ORDERED_LOCATIONS = KIND_ORDER.flatMap((kind) => LOCATIONS.filter((l) => l.kind === kind && !l.unknown))

const UNKNOWN_LOCATIONS = LOCATIONS.filter((l) => l.unknown)

function UnknownLocationButton({ location }: { location: DWLocation }) {
  const { markers, selectedLocation, setSelectedLocation, setTool } = useTracker()
  const isSelected = selectedLocation === location.id
  const count = markers.filter((m) => m.locationId === location.id).length

  return (
    <button
      type="button"
      aria-pressed={isSelected}
      aria-label={`Place unknown ${location.name.toLowerCase()}${count ? ` (${count} placed)` : ''}`}
      onClick={() => {
        setSelectedLocation(isSelected ? null : location.id)
        setTool('marker')
      }}
      className={cn(
        'flex h-5 w-full items-center gap-1 rounded-sm border px-0.5 focus-visible:outline-2 focus-visible:outline-primary',
        isSelected ? 'border-primary' : 'border-transparent',
      )}
    >
      <span
        aria-hidden="true"
        className="flex h-4 w-6 shrink-0 items-center justify-center rounded-[2px] font-mono text-[7px] leading-none text-black"
        style={{ background: badgeBackground(location.id, KIND_META[location.kind].color) }}
      >
        {location.abbr}
      </span>
      <span className="truncate text-[8px] leading-none text-foreground">{location.name}</span>
    </button>
  )
}


function CoordPart({ direction }: { direction: 'first' | 'second' }) {
  const { coords, updateCoords } = useTracker()
  const value = coords[COORDS_LOCATION_ID] ?? EMPTY_COORDS
  const isFirst = direction === 'first'
  return (
    <div className="flex min-w-0 items-center gap-0.5">
      <input
        type="text"
        inputMode="numeric"
        maxLength={4}
        value={isFirst ? value.first : value.second}
        onChange={(e) => updateCoords(COORDS_LOCATION_ID, isFirst ? { first: e.target.value } : { second: e.target.value })}
        aria-label={isFirst ? 'First coordinate' : 'Second coordinate'}
        data-coords-field
        className={cn(fieldClass, 'w-5 shrink-0 px-0.5 text-center')}
      />
      <select
        value={isFirst ? value.firstDir : value.secondDir}
        onChange={(e) => updateCoords(COORDS_LOCATION_ID, isFirst ? { firstDir: e.target.value as NSDirection } : { secondDir: e.target.value as EWDirection })}
        aria-label={isFirst ? 'First coordinate direction' : 'Second coordinate direction'}
        className={cn(fieldClass, 'px-0')}
      >
        <option value="" className="bg-background text-foreground" />
        {(isFirst ? NS_DIRECTIONS : EW_DIRECTIONS).map((direction) => (
          <option key={direction} value={direction} className="bg-background text-foreground">{direction}</option>
        ))}
      </select>
    </div>
  )
}

export function LocationsPanel() {
  const { markers, visited, items, selectedLocation, setSelectedLocation, setTool, requestFocus, stairLinks } = useTracker()

  const markerByLocation = new Map(markers.filter((m) => m.locationId).map((m) => [m.locationId as string, m]))
  for (const [stairId, caveId] of Object.entries(stairLinks)) {
    if (markerByLocation.has(caveId)) continue
    const town = markers.find((m) => m.locationId && LOCATION_EXTRAS[m.locationId]?.some((extra) => extra.id === stairId))
    if (town) markerByLocation.set(caveId, town)
  }

  return (
    <section aria-labelledby="locations-heading" className="flex flex-col gap-1">
      <h2 id="locations-heading" className="sr-only">
        Locations
      </h2>
          <ul className="grid grid-cols-2 gap-x-1 sm:grid-cols-[repeat(4,minmax(0,auto))_4.5rem] sm:justify-between">
        {ORDERED_LOCATIONS.flatMap((location) => {
          const marker = markerByLocation.get(location.id)
          const isSelected = selectedLocation === location.id
          const isVisited = !!visited[location.id]
          return [
            <li
              key={location.id}
              className={cn(
                'flex h-5 items-center justify-start gap-1 rounded-sm border px-0.5',
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
                className="flex min-w-0 items-center gap-1 focus-visible:outline-2 focus-visible:outline-primary"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'relative flex h-4 w-6 shrink-0 items-center justify-center rounded-[2px] font-mono text-[7px] leading-none text-black',
                    !marker && 'opacity-40',
                  )}
                  style={{ backgroundColor: locationColor(location, items) }}
                >
                  {location.abbr}
                  {isVisited && (
                    <Check
                      className="absolute inset-0 m-auto size-4 text-[#22c55e] drop-shadow-[0_0_1px_#000]"
                      strokeWidth={4}
                    />
                  )}
                </span>
                <span
                  className={cn(
                    'truncate text-[8px] leading-none',
                    marker ? 'text-foreground' : 'text-muted-foreground',
                  )}
                >
                  {location.name}
                  {isVisited && <span className="sr-only"> (visited)</span>}
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
          ]
        })}
        <li className="col-span-2 grid grid-cols-2 gap-x-1 gap-y-0.5 sm:col-span-1 sm:col-start-5 sm:row-span-4 sm:row-start-1 sm:flex sm:flex-col sm:items-center">
          {UNKNOWN_LOCATIONS.map((location) => (
            <UnknownLocationButton key={location.id} location={location} />
          ))}
          <div className="flex min-w-0 w-full items-center gap-1 px-0.5">
            <CoordPart direction="first" />
          </div>
          <div className="flex min-w-0 w-full items-center gap-1 px-0.5">
            <CoordPart direction="second" />
          </div>
        </li>
      </ul>
    </section>
  )
}
