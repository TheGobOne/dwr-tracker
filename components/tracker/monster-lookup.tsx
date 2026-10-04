'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'
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

function MonsterWindow({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('')
  const [selectedName, setSelectedName] = useState<string | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [listOpen, setListOpen] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)
  const listId = useId()

  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true })
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase()
    return q ? MONSTERS.filter((m) => m.name.toLowerCase().includes(q)) : MONSTERS
  }, [query])

  const selected = MONSTERS.find((m) => m.name === selectedName) ?? null

  const choose = (name: string) => {
    setSelectedName(name)
    setQuery(name)
    setListOpen(false)
  }

  const trackerRoot = document.querySelector('[data-tracker-root]')
  if (!trackerRoot) return null

  const showList = listOpen && matches.length > 0

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
          <label htmlFor="monster-search" className="sr-only">
            Search monsters
          </label>
          <input
            ref={inputRef}
            id="monster-search"
            type="text"
            role="combobox"
            aria-expanded={showList}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={showList ? `${listId}-${activeIndex}` : undefined}
            autoComplete="off"
            spellCheck={false}
            placeholder="Search monster"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setActiveIndex(0)
              setListOpen(true)
            }}
            onFocus={() => setListOpen(true)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault()
                setListOpen(true)
                setActiveIndex((i) => Math.min(i + 1, matches.length - 1))
              } else if (e.key === 'ArrowUp') {
                e.preventDefault()
                setActiveIndex((i) => Math.max(i - 1, 0))
              } else if (e.key === 'Enter') {
                if (e.nativeEvent.isComposing || e.keyCode === 229) return
                const pick = matches[activeIndex]
                if (pick) {
                  e.preventDefault()
                  choose(pick.name)
                }
              }
            }}
            className="h-6 w-full rounded-sm border border-foreground/25 bg-background px-1.5 font-display text-[9px] uppercase text-foreground placeholder:text-muted-foreground/60 focus-visible:border-primary focus-visible:outline-none"
          />
          {showList && (
            <ul
              id={listId}
              role="listbox"
              aria-label="Monsters"
              className="absolute inset-x-0 top-full z-10 mt-0.5 max-h-40 overflow-y-auto rounded-sm border border-foreground/40 bg-background py-0.5"
            >
              {matches.map((m, i) => (
                <li
                  key={m.name}
                  id={`${listId}-${i}`}
                  role="option"
                  aria-selected={i === activeIndex}
                  onPointerDown={(e) => e.preventDefault()}
                  onClick={() => choose(m.name)}
                  onPointerEnter={() => setActiveIndex(i)}
                  className={cn(
                    'cursor-pointer px-1.5 py-1 font-display text-[9px] uppercase leading-none',
                    i === activeIndex ? 'bg-primary text-primary-foreground' : 'text-foreground',
                  )}
                >
                  {m.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {selected ? (
            <div className="flex flex-col gap-2">
              <dl className="flex flex-col font-display text-[8px] leading-none">
                {selected.stats.map(([label, value]) => (
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
        <span className="truncate">Monster</span>
      </button>
      {open && <MonsterWindow onClose={() => setOpen(false)} />}
    </>
  )
}
