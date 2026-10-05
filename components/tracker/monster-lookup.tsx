'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { MONSTERS, MONSTER_STAT_DEFINITIONS } from '@/lib/monster-data'
import { cn } from '@/lib/utils'

const STAT_DEFINITION_ALIASES: Record<string, string> = {
  SIR: 'SIR (Sleep-Instead-of-Run)',
  '25% Back Attack': 'Back attack = 25%',
  'Hurtmore shot': 'Hurtmore Shot',
  'Hurt B/E AP': 'Hurt B/E',
}

function statDefinition(label: string) {
  return MONSTER_STAT_DEFINITIONS[STAT_DEFINITION_ALIASES[label] ?? label]
}

const GRIND_POTENTIAL: Record<string, 'S' | 'A' | 'B' | 'C' | 'D' | 'F'> = {
  'Metal Scorpion': 'S',
  Magiwyvern: 'S',
  'Axe Knight': 'S',
}

const PROMOTED_STATS = ['XP', 'Gold']

function orderStats(stats: [string, string][]) {
  const promoted = PROMOTED_STATS.flatMap((label) => stats.filter(([l]) => l === label))
  const rest = stats.filter(([l]) => !PROMOTED_STATS.includes(l))
  const strIndex = rest.findIndex(([l]) => l === 'STR')
  if (strIndex === -1) return [...promoted, ...rest]
  return [...rest.slice(0, strIndex), ...promoted, ...rest.slice(strIndex)]
}

function MonsterWindow({ onClose }: { onClose: () => void }) {
  const [selectedName, setSelectedName] = useState('')
  const selectRef = useRef<HTMLSelectElement>(null)

  useEffect(() => {
    selectRef.current?.focus({ preventScroll: true })
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const selected = MONSTERS.find((m) => m.name === selectedName) ?? null

  const trackerRoot = document.querySelector('[data-tracker-root]')
  if (!trackerRoot) return null

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="monster-title"
      className="absolute inset-0 z-50"
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="dw-window absolute top-1.5 right-1/2 bottom-1.5 left-1.5 flex flex-col gap-2 p-2.5">
        <div className="flex items-center justify-between gap-4">
          <h2 id="monster-title" className="font-display text-[10px] text-primary">
            Monsters
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="font-display text-[10px] text-foreground hover:text-primary focus-visible:outline-2 focus-visible:outline-primary"
          >
            CLOSE
          </button>
        </div>

        <div className="relative">
          <label htmlFor="monster-select" className="sr-only">
            Choose a monster
          </label>
          <select
            ref={selectRef}
            id="monster-select"
            value={selectedName}
            onChange={(e) => setSelectedName(e.target.value)}
            className={cn(
              'h-6 w-full appearance-none rounded-sm border border-foreground/25 bg-background pr-5 pl-1.5 font-display text-[9px] uppercase focus-visible:border-primary focus-visible:outline-none',
              selectedName ? 'text-foreground' : 'text-muted-foreground/60',
            )}
          >
            <option value="" disabled>
              Select monster
            </option>
            {MONSTERS.map((m) => (
              <option key={m.name} value={m.name} className="text-foreground">
                {m.name}
              </option>
            ))}
          </select>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 right-1.5 -translate-y-1/2 font-display text-[7px] text-foreground"
          >
            {'▼'}
          </span>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {selected ? (
            <div className="flex flex-col gap-2">
              <dl className="flex flex-col font-display text-[8px] leading-none">
                {orderStats(selected.stats).map(([label, value]) => (
                  <div
                    key={label}
                    title={statDefinition(label)}
                    className="flex items-baseline justify-between gap-1 border-b border-border/40 py-1"
                  >
                    <dt className="truncate text-muted-foreground">{label}</dt>
                    <dd className="shrink-0 tabular-nums text-foreground">{value}</dd>
                  </div>
                ))}
              </dl>
              {selected.notes && (
                <div className="flex flex-col gap-1">
                  <h3 className="font-display text-[9px] text-primary">Notes</h3>
                  <p className="text-[9px] leading-relaxed text-foreground">{selected.notes}</p>
                </div>
              )}
              {GRIND_POTENTIAL[selected.name] && (
                <div className="flex items-center justify-between gap-2 border-t border-border/40 pt-2">
                  <h3 className="font-display text-[9px] text-primary">Grind Potential</h3>
                  <span className="font-display text-[12px] text-foreground">
                    {GRIND_POTENTIAL[selected.name]}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <p className="font-display text-[9px] text-muted-foreground">Select a monster</p>
          )}
        </div>
      </div>
    </div>,
    trackerRoot,
  )
}

export function MonsterLookupButton({ className }: { className?: string }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
        className={className}
      >
        <span className="truncate">Monsters</span>
      </button>
      {open && <MonsterWindow onClose={() => setOpen(false)} />}
    </>
  )
}
