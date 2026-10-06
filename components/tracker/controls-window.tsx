'use client'

import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

const CONTROL_SECTIONS: { title: string; controls: { input: string; action: string }[] }[] = [
  {
    title: 'Map',
    controls: [
      { input: 'Left click', action: 'Place a marker, or check off a placed location' },
      { input: 'Right click marker', action: 'Remove the marker' },
      { input: 'Middle click marker', action: 'Open the cave or castle map for that location' },
    ],
  },
  {
    title: 'Drawing',
    controls: [
      { input: 'Right click empty', action: 'Switch to the pen, then left drag to draw green lines' },
      { input: 'Middle click', action: 'Switch to the eraser, then left drag over lines to erase' },
      { input: 'Click again', action: 'Right click in pen or middle click in eraser to go back to placing' },
  { input: 'Slide toggle', action: 'Bottom left of the map: turn on to move a group of markers and lines' },
  { input: 'Left drag (Slide)', action: 'Draw a box to select the markers and lines inside it' },
  { input: 'Left click (Slide)', action: 'Click inside the selection to pick it up, then left click again to drop it' },
  { input: 'Right click (Slide)', action: 'Cancel the move, or clear the selection if nothing is held' },
    ],
  },
  {
    title: 'Locations',
    controls: [
      { input: 'Click unplaced', action: 'Select it, then click the map to place it' },
      { input: 'Click placed', action: 'Highlight its marker on the map' },
      { input: 'Pin button', action: 'Move a placed marker to a new spot' },
      { input: '? Town / ? Cave', action: 'Select, then click the map to mark unidentified spots. Place as many as you need' },
    ],
  },
  {
    title: 'Items & Spells',
    controls: [
      { input: 'Click', action: 'Toggle an item or spell as found' },
      { input: 'Coords', action: "Record the token's search coordinates" },
      { input: 'Monsters', action: 'Look up monster stats and grind potential' },
    ],
  },
  {
    title: 'Other',
    controls: [
      { input: 'King', action: 'Show the experience level table' },
      { input: 'Notes', action: 'Free text for anything else in your run' },
      { input: 'Gear > Install', action: 'Install the tracker as an app in Chrome' },
      { input: 'Gear > Clear', action: 'Reset the entire tracker' },
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
      <div className="dw-window absolute top-1.5 right-1.5 bottom-1.5 left-1/2 flex flex-col gap-2 p-2.5">
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
