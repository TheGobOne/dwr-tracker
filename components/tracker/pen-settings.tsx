'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { Pen } from 'lucide-react'
import { Slider } from '@/components/ui/slider'

export const PEN_COLORS = [
  { value: '#00D800', name: 'Green' },
  { value: '#F83800', name: 'Red' },
  { value: '#3CBCFC', name: 'Blue' },
  { value: '#F8B800', name: 'Yellow' },
  { value: '#F878F8', name: 'Pink' },
  { value: '#FCFCFC', name: 'White' },
  { value: '#FC7460', name: 'Salmon' },
  { value: '#E45C10', name: 'Orange' },
  { value: '#B8F818', name: 'Lime' },
  { value: '#00E8D8', name: 'Cyan' },
  { value: '#0058F8', name: 'Navy' },
  { value: '#6844FC', name: 'Purple' },
  { value: '#D800CC', name: 'Magenta' },
  { value: '#AC7C00', name: 'Brown' },
  { value: '#BCBCBC', name: 'Light Gray' },
  { value: '#787878', name: 'Gray' },
  { value: '#3C3C3C', name: 'Dark Gray' },
  { value: '#000000', name: 'Black' },
] as const

export const PEN_SIZE_MIN = 0.2
export const PEN_SIZE_MAX = 1.6
export const PEN_SIZE_DEFAULT = 0.6

type PenSettingsProps = {
  color: string
  size: number
  onColorChange: (color: string) => void
  onSizeChange: (size: number) => void
}

export function PenSettings({ color, size, onColorChange, onSizeChange }: PenSettingsProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const panelId = useId()
  const sizeLabelId = useId()

  useEffect(() => {
    if (!open) return
    function handlePointerDown(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  return (
    <div ref={rootRef} className="pointer-events-auto relative">
      <button
        type="button"
        aria-label="Pen settings"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className={`flex size-[22px] items-center justify-center rounded-sm bg-black/60 outline-none transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-primary ${
          open ? 'text-primary' : 'text-foreground'
        }`}
      >
        <Pen className="size-3" aria-hidden="true" style={{ color }} />
      </button>
      {open && (
        <div
          id={panelId}
          role="dialog"
          aria-label="Pen settings"
          className="dw-window absolute top-full right-0 mt-1.5 flex w-44 flex-col gap-3 p-3"
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span id={sizeLabelId} className="font-display text-[9px] uppercase tracking-wider text-foreground">
                Size
              </span>
              <span
                aria-hidden="true"
                className="flex size-6 items-center justify-center rounded-sm bg-black/60"
              >
                <span
                  className="rounded-full"
                  style={{
                    backgroundColor: color,
                    width: `${4 + ((size - PEN_SIZE_MIN) / (PEN_SIZE_MAX - PEN_SIZE_MIN)) * 14}px`,
                    height: `${4 + ((size - PEN_SIZE_MIN) / (PEN_SIZE_MAX - PEN_SIZE_MIN)) * 14}px`,
                  }}
                />
              </span>
            </div>
            <Slider
              aria-labelledby={sizeLabelId}
              min={PEN_SIZE_MIN}
              max={PEN_SIZE_MAX}
              step={0.1}
              value={[size]}
              onValueChange={(v) => onSizeChange(Array.isArray(v) ? v[0] : v)}
            />
          </div>
          <fieldset className="flex flex-col gap-2">
            <legend className="font-display mb-2 text-[9px] uppercase tracking-wider text-foreground">Color</legend>
            <div className="grid grid-cols-6 gap-1.5">
              {PEN_COLORS.map((c) => {
                const selected = c.value === color
                return (
                  <button
                    key={c.value}
                    type="button"
                    aria-label={c.name}
                    aria-pressed={selected}
                    onClick={() => onColorChange(c.value)}
                    className={`aspect-square rounded-sm border-2 outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                      selected ? 'border-foreground' : 'border-white/20'
                    }`}
                    style={{ backgroundColor: c.value }}
                  />
                )
              })}
            </div>
          </fieldset>
        </div>
      )}
    </div>
  )
}
