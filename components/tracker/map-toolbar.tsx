'use client'

import { Grid3x3, Hand, MapPin, Minus, PaintBucket, Paintbrush, Plus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { TERRAINS } from '@/lib/dw-data'
import { cn } from '@/lib/utils'
import { BRUSH_SIZES, MAX_ZOOM, MIN_ZOOM, useTracker, type Tool } from './tracker-context'

const TOOLS: { id: Tool; label: string; key: string; icon: typeof Paintbrush }[] = [
  { id: 'paint', label: 'Paint', key: 'B', icon: Paintbrush },
  { id: 'fill', label: 'Fill', key: 'F', icon: PaintBucket },
  { id: 'marker', label: 'Marker', key: 'M', icon: MapPin },
  { id: 'pan', label: 'Pan', key: 'H', icon: Hand },
]

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="font-display text-[10px] uppercase tracking-wider text-primary">{children}</h2>
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
    <aside aria-label="Map tools" className="dw-window flex shrink-0 flex-col gap-5 overflow-y-auto p-4 lg:w-56">
      <div className="flex flex-col gap-2">
        <SectionTitle>Tool</SectionTitle>
        <div className="grid grid-cols-4 gap-1.5 lg:grid-cols-2">
          {TOOLS.map(({ id, label, key, icon: Icon }) => (
            <button
              key={id}
              type="button"
              aria-pressed={tool === id}
              onClick={() => setTool(id)}
              className={cn(
                'flex items-center justify-center gap-1.5 rounded-sm border-2 px-2 py-1.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-primary',
                tool === id
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-foreground/30 hover:border-foreground',
              )}
            >
              <Icon className="size-4" aria-hidden="true" />
              <span>{label}</span>
              <kbd className="hidden text-[10px] opacity-60 lg:inline">{key}</kbd>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <SectionTitle>Terrain</SectionTitle>
        <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-5 lg:grid-cols-1">
          {TERRAINS.map((t) => (
            <button
              key={t.id}
              type="button"
              aria-pressed={terrain === t.id}
              onClick={() => {
                setTerrain(t.id)
                if (tool !== 'paint' && tool !== 'fill') setTool('paint')
              }}
              className={cn(
                'flex items-center gap-2 rounded-sm border-2 px-2 py-1 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:outline-primary',
                terrain === t.id ? 'border-primary' : 'border-transparent hover:border-foreground/40',
              )}
            >
              <span
                aria-hidden="true"
                className="size-4 shrink-0 border border-foreground/60"
                style={{ backgroundColor: t.color }}
              />
              <span className="flex-1 truncate">{t.id === 0 ? 'Eraser' : t.name}</span>
              <kbd className="hidden text-[10px] text-muted-foreground lg:inline">{t.key}</kbd>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <SectionTitle>Brush</SectionTitle>
        <div className="flex gap-1.5" role="group" aria-label="Brush size">
          {BRUSH_SIZES.map((size) => (
            <button
              key={size}
              type="button"
              aria-pressed={brushSize === size}
              onClick={() => setBrushSize(size)}
              className={cn(
                'flex-1 rounded-sm border-2 py-1 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-primary',
                brushSize === size
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-foreground/30 hover:border-foreground',
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {tool === 'marker' && (
        <div className="flex flex-col gap-2">
          <SectionTitle>Marker</SectionTitle>
          {selectedLocation ? (
            <p className="text-sm text-muted-foreground">
              Placing a location.{' '}
              <button
                type="button"
                className="text-primary underline underline-offset-2"
                onClick={() => setSelectedLocation(null)}
              >
                Cancel
              </button>
            </p>
          ) : (
            <label className="flex flex-col gap-1 text-sm text-muted-foreground">
              Custom pin label
              <Input
                value={pinLabel}
                onChange={(e) => setPinLabel(e.target.value)}
                placeholder="e.g. Chest, Golem, Hint"
                maxLength={60}
                className="text-foreground"
              />
            </label>
          )}
          <p className="text-xs text-muted-foreground">Right-click a marker to remove it.</p>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <SectionTitle>View</SectionTitle>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Zoom out"
            onClick={() => setZoom(zoom - 1)}
            className="rounded-sm border-2 border-foreground/30 p-1 hover:border-foreground"
          >
            <Minus className="size-4" aria-hidden="true" />
          </button>
          <Slider
            aria-label="Zoom"
            min={MIN_ZOOM}
            max={MAX_ZOOM}
            step={1}
            value={[zoom]}
            onValueChange={(v) => setZoom(Array.isArray(v) ? v[0] : (v as number))}
            className="flex-1"
          />
          <button
            type="button"
            aria-label="Zoom in"
            onClick={() => setZoom(zoom + 1)}
            className="rounded-sm border-2 border-foreground/30 p-1 hover:border-foreground"
          >
            <Plus className="size-4" aria-hidden="true" />
          </button>
        </div>
        <p className="text-xs text-muted-foreground">{zoom}px per tile · Ctrl + scroll to zoom</p>
        <button
          type="button"
          aria-pressed={showGrid}
          onClick={() => setShowGrid(!showGrid)}
          className={cn(
            'flex items-center gap-2 rounded-sm border-2 px-2 py-1 text-sm transition-colors',
            showGrid ? 'border-primary text-primary' : 'border-foreground/30 hover:border-foreground',
          )}
        >
          <Grid3x3 className="size-4" aria-hidden="true" />
          Grid {showGrid ? 'on' : 'off'}
          <kbd className="ml-auto hidden text-[10px] opacity-60 lg:inline">G</kbd>
        </button>
      </div>
    </aside>
  )
}
