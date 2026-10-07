'use client'

import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

const CONTROL_SECTIONS: { title: string; controls: { input: string; action: string }[] }[] = [
  {
    title: 'Map',
    controls: [
      { input: 'Left click marker', action: 'Check off the location' },
      { input: 'Right click marker', action: 'Remove it' },
      { input: 'Middle click marker', action: 'Open its cave or castle map' },
      { input: 'Right click empty', action: 'Pen: left drag to draw' },
      { input: 'Middle click empty', action: 'Eraser: left drag to erase' },
      { input: 'Same click again', action: 'Back to placing markers' },
    ],
  },
  {
    title: 'Move mode',
    controls: [
      { input: 'Left drag', action: 'Box-select markers and lines' },
      { input: 'Drag selection', action: 'Move it' },
      { input: 'Right click', action: 'Clear the selection' },
    ],
  },
  {
    title: 'Locations, Items, and Spells',
    controls: [
      { input: 'Locations', action: 'Left click to highlight, then left click to place on map' },
  { input: 'Pin', action: 'Move a placed marker' },
  { input: 'Belt count', action: 'Left click +1, right click -1' },

    ],
  },
  {
    title: 'Corners',
    controls: [
      { input: 'King', action: 'Experience table' },
      { input: 'DL2', action: 'Fight sim (heals at 48 HP)' },
    ],
  },
]

export function ControlsWindow({ onClose }: { onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const frame = requestAnimationFrame(() => closeRef.current?.focus({ preventScroll: true }))
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const trackerRoot = document.querySelector('[data-tracker-root]')
  if (!trackerRoot) return null

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="controls-title"
      className="absolute inset-0 z-50"
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="dw-window absolute top-1.5 right-1.5 left-1/2 flex max-h-[calc(100%-0.75rem)] flex-col gap-2 p-2.5">
        <div className="flex items-center justify-between gap-4">
          <h2 id="controls-title" className="font-display text-[10px] text-primary">
            Controls
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="font-display text-[10px] text-foreground hover:text-primary focus-visible:outline-2 focus-visible:outline-primary"
          >
            CLOSE
          </button>
        </div>
        <div className="flex min-h-0 flex-col gap-3 overflow-y-auto pr-1">
          {CONTROL_SECTIONS.map((section) => (
            <section key={section.title} aria-labelledby={`controls-${section.title}`} className="flex flex-col gap-1.5">
              <h3
                id={`controls-${section.title}`}
                className="border-b border-border pb-1 font-display text-[9px] uppercase text-muted-foreground"
              >
                {section.title}
              </h3>
              <dl className="flex flex-col gap-1.5">
                {section.controls.map((control) => (
                  <div key={control.input} className="flex gap-2">
                    <dt className="w-24 shrink-0 font-display text-[8px] leading-relaxed text-white">{control.input}</dt>
                    <dd className="min-w-0 flex-1 font-display text-[8px] leading-relaxed text-foreground">{control.action}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
      </div>
    </div>,
    trackerRoot,
  )
}
