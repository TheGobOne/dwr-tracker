'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

export const UPDATES: { date: string; notes: string[] }[] = [
  {
    date: '10/13/26',
    notes: [
      'Added equipment slots (top left): click Sword, Armor or Shield to set what you have equipped',
      'Added town upgrade arrows: a green arrow appears next to a town when its shop sells something better than your gear. Hover the arrow to see the upgrades',
      "Rainbow Drop and the Rainbow cave can't be checked until Token, Stones, Harp and Staff are all checked",
      'Charlock shows a lock until the Rainbow Drop is checked',
      'Checking off Rainbow (formerly Jerk) also checks off the Rainbow Drop',
      'Dragonlord Sim: added a +X MP toggle that shows how much spare MP you have, with an optional win chance threshold',
      'Added an AI Disclosure',
    ],
  },
  {
    date: '10/14/26',
    notes: [
      'Checking off the Sword or Armor item now sets it as your equipped gear, and equipping Erdrick\'s Sword or Armor in the panels checks the item off',
      'Entering both coordinates puts a blue magnifying glass on the map at the estimated spot',
      'Right-click a town staircase to link it to another location',
  'Various visual adjustments',
  ],
  },
  {
  date: '10/17/26',
  notes: [
  "Opening a town's shop now highlights the gear you're wearing, and you can't pick anything worse than what you have",
  'Middle-click a cave linked to a town to open its map',
  "Added a pen button next to Move to change the pen's size and color",
  'Checking off Coordinates no longer counts toward unlocking the Rainbow Drop',
  'Various visual adjustments',
  ],
  },
  ]

export const LATEST_UPDATE = UPDATES[UPDATES.length - 1].date
export const UPDATES_SEEN_STORAGE_KEY = 'dwr-tracker-updates-dismissed'

export function UpdatesWindow({ onClose }: { onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const [index, setIndex] = useState(UPDATES.length - 1)
  const [dontShow, setDontShow] = useState(
    () => window.localStorage.getItem(UPDATES_SEEN_STORAGE_KEY) === LATEST_UPDATE,
  )
  const entry = UPDATES[index]

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

  const toggleDontShow = (checked: boolean) => {
    setDontShow(checked)
    if (checked) window.localStorage.setItem(UPDATES_SEEN_STORAGE_KEY, LATEST_UPDATE)
    else window.localStorage.removeItem(UPDATES_SEEN_STORAGE_KEY)
  }

  const trackerRoot = document.querySelector('[data-tracker-root]')
  if (!trackerRoot) return null

  const arrowClass =
    'font-display text-[10px] text-foreground hover:text-primary disabled:opacity-30 disabled:hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary'

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="updates-title"
      className="absolute inset-0 z-50 flex items-center justify-center p-3"
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="dw-window flex w-full max-w-sm flex-col gap-3 p-2.5">
        <div className="flex items-center justify-between gap-4">
          <h2 id="updates-title" className="font-display text-[10px] text-primary">
            Updates
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
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            aria-label="Older updates"
            disabled={index === 0}
            onClick={() => setIndex((i) => i - 1)}
            className={arrowClass}
          >
            {'◀'}
          </button>
          <p className="font-display text-[9px] text-white">{entry.date}</p>
          <button
            type="button"
            aria-label="Newer updates"
            disabled={index === UPDATES.length - 1}
            onClick={() => setIndex((i) => i + 1)}
            className={arrowClass}
          >
            {'▶'}
          </button>
        </div>
        <ul className="flex flex-col gap-2">
          {entry.notes.map((note) => (
            <li key={note} className="flex gap-1.5 font-display text-[8px] leading-relaxed text-foreground">
              <span aria-hidden="true" className="text-primary">
                {'-'}
              </span>
              <span>{note}</span>
            </li>
          ))}
        </ul>
        <label className="flex cursor-pointer items-center gap-2 font-display text-[8px] text-muted-foreground">
          <input
            type="checkbox"
            checked={dontShow}
            onChange={(e) => toggleDontShow(e.target.checked)}
            className="size-3 accent-primary"
          />
          {"Don't show again"}
        </label>
      </div>
    </div>,
    trackerRoot,
  )
}
