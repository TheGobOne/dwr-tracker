'use client'

import { Eraser, Grid3x3, Hand, MapPin, Maximize, Minus, PaintBucket, Paintbrush, Plus } from 'lucide-react'
import { TERRAINS } from '@/lib/dw-data'
import { cn } from '@/lib/utils'
import { BRUSH_SIZES, useTracker, type Tool } from './tracker-context'

export const FIT_MAP_EVENT = 'dwr:fit-map'

const TOOLS: { id: Tool; label: string; key: string; icon: typeof Paintbrush }[] = [
  { id: 'paint', label: 'Paint', key: 'B', icon: Paintbrush },
  { id: 'fill', label: 'Fill', key: 'F', icon: PaintBucket },
  { id: 'marker', label: 'Marker', key: 'M', icon: MapPin },
  { id: 'pan', label: 'Pan', key: 'H', icon: Hand },
]

const chip =
  'flex h-7 items-center justify-center rounded-sm border-2 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-primary'
const chipIdle = 'border-foreground/30 hover:border-foreground'
const chipActive = 'border-primary bg-primary text-primary-foreground'

function Divider() {
  return <span aria-hidden="true" className="h-5 w-px bg-foreground/25" />
}

export function MapToolbar() {
  const {
    tool,
    setTool,
    terrain,
    setTerrain,
    brushSize,
    setBrushSize,
    zoom,
    setZoom,
    showGrid,
    setShowGrid,
    selectedLocation,
    setSelectedLocation,
    pinLabel,
    setPinLabel,
  } = useTracker()

  return (
    <section aria-label="Map tools" className="dw-window flex shrink-0 flex-col gap-1.5 px-2 py-1.5">
      <div className="flex flex-wrap items-center gap-1.5">
        <div className="flex gap-1" role="group" aria-label="Tool">
          {TOOLS.map(({ id, label, key, icon: Icon }) => (
            <button
              key={id}
              type="button"
              aria-pressed={tool === id}
              aria-label={label}
              title={`${label} (${key})`}
              onClick={() => setTool(id)}
              className={cn(chip, 'w-7', tool === id ? chipActive : chipIdle)}
            >
              <Icon className="size-3.5" aria-hidden="true" />
            </button>
          ))}
        </div>

        <Divider />

        <div className="flex gap-1" role="group" aria-label="Brush size">
          {BRUSH_SIZES.map((size) => (
            <button
              key={size}
              type="button"
              aria-pressed={brushSize === size}
              aria-label={`Brush ${size}`}
              title={`Brush ${size}×${size}`}
              onClick={() => setBrushSize(size)}
              className={cn(chip, 'w-6 font-mono', brushSize === size ? chipActive : chipIdle)}
            >
              {size}
            </button>
          ))}
        </div>

        <Divider />

        <div className="flex items-center gap-1" role="group" aria-label="Zoom">
          <button type="button" aria-label="Zoom out" onClick={() => setZoom(zoom - 1)} className={cn(chip, 'w-7', chipIdle)}>
            <Minus className="size-3.5" aria-hidden="true" />
          </button>
          <span className="w-8 text-center font-mono text-xs text-muted-foreground" aria-live="polite">
            {zoom}x
          </span>
          <button type="button" aria-label="Zoom in" onClick={() => setZoom(zoom + 1)} className={cn(chip, 'w-7', chipIdle)}>
            <Plus className="size-3.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Fit map to view"
            title="Fit map"
            onClick={() => window.dispatchEvent(new Event(FIT_MAP_EVENT))}
            className={cn(chip, 'w-7', chipIdle)}
          >
            <Maximize className="size-3.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-pressed={showGrid}
            aria-label="Toggle grid"
            title="Grid (G)"
            onClick={() => setShowGrid(!showGrid)}
            className={cn(chip, 'w-7', showGrid ? 'border-primary text-primary' : chipIdle)}
          >
            <Grid3x3 className="size-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1" role="group" aria-label="Terrain">
        {TERRAINS.map((t) => {
          const name = t.id === 0 ? 'Eraser' : t.name
          const active = terrain === t.id
          return (
            <button
              key={t.id}
              type="button"
              aria-pressed={active}
              aria-label={name}
              title={`${name} (${t.key})`}
              onClick={() => {
                setTerrain(t.id)
                if (tool !== 'paint' && tool !== 'fill') setTool('paint')
              }}
              className={cn(
                'flex size-7 items-center justify-center rounded-sm border-2 transition-colors focus-visible:outline-2 focus-visible:outline-primary',
                active ? 'border-primary ring-1 ring-primary' : 'border-foreground/30 hover:border-foreground',
              )}
            >
              <span
                aria-hidden="true"
                className="flex size-full items-center justify-center"
                style={{ backgroundColor: t.color }}
              >
                {t.id === 0 && <Eraser className="size-3.5 text-foreground" />}
              </span>
            </button>
          )
        })}
        <span className="ml-1 truncate text-xs text-muted-foreground">
          {terrain === 0 ? 'Eraser' : TERRAINS[terrain]?.name}
        </span>
      </div>

      {tool === 'marker' && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {selectedLocation ? (
            <p>
              Click the map to place.{' '}
              <button
                type="button"
                className="text-primary underline underline-offset-2"
                onClick={() => setSelectedLocation(null)}
              >
                Cancel
              </button>
            </p>
          ) : (
            <>
              <label htmlFor="pin-label" className="shrink-0">
                Pin label
              </label>
              <input
                id="pin-label"
                value={pinLabel}
                onChange={(e) => setPinLabel(e.target.value)}
                placeholder="Chest, Golem, Hint…"
                maxLength={60}
                className="h-6 min-w-0 flex-1 rounded-sm border-2 border-foreground/25 bg-transparent px-1.5 text-xs text-foreground focus-visible:border-primary focus-visible:outline-none"
              />
            </>
          )}
          <span className="ml-auto shrink-0">Right-click removes</span>
        </div>
      )}
    </section>
  )
}
