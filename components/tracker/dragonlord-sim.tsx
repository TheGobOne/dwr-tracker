'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'
import {
  DL2,
  effectiveStats,
  mulberry32,
  runSimulation,
  simulateFight,
  type Initiative,
  type SimInput,
} from '@/lib/dragonlord-sim'

const TRIALS = 10000

const DEFAULT_INPUT: SimInput = {
  maxHp: 150,
  mp: 120,
  attack: 120,
  defense: 90,
  agility: 110,
  herbs: 0,
  fairyWater: 0,
  healAt: 48,
  deathNecklace: false,
  erdrickArmor: true,
  initiative: 'random',
}

type NumberKey = 'maxHp' | 'mp' | 'attack' | 'defense' | 'agility' | 'herbs' | 'fairyWater' | 'healAt'

const NUMBER_FIELDS: { key: NumberKey; label: string; max: number }[] = [
  { key: 'maxHp', label: 'Max HP', max: 999 },
  { key: 'mp', label: 'MP', max: 999 },
  { key: 'attack', label: 'Attack', max: 999 },
  { key: 'defense', label: 'Defense', max: 999 },
  { key: 'agility', label: 'Agility', max: 255 },
  { key: 'healAt', label: 'Heal at', max: 999 },
  { key: 'herbs', label: 'Herbs', max: 6 },
  { key: 'fairyWater', label: 'Fairy', max: 6 },
]

const INITIATIVE_OPTIONS: { value: Initiative; label: string }[] = [
  { value: 'random', label: 'Random' },
  { value: 'first', label: 'Go first' },
  { value: 'ambushed', label: 'Ambushed' },
]

const pct = (n: number | null) => (n === null ? '--' : `${(n * 100).toFixed(1)}%`)

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-1.5 text-foreground hover:text-primary">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="size-3 accent-[var(--primary)]"
      />
      {label}
    </label>
  )
}

function SimWindow({
  input,
  setInput,
  onClose,
}: {
  input: SimInput
  setInput: React.Dispatch<React.SetStateAction<SimInput>>
  onClose: () => void
}) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const [fightSeed, setFightSeed] = useState(1)

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true })
  }, [])

  const summary = useMemo(() => runSimulation(input, TRIALS, 20260601), [input])
  const fight = useMemo(() => simulateFight(input, mulberry32(fightSeed * 7919), true), [input, fightSeed])
  const { maxHp, attack } = effectiveStats(input)

  const setNumber = (key: NumberKey, raw: string, max: number) => {
    const n = Math.max(0, Math.min(max, Math.floor(Number(raw) || 0)))
    setInput((prev) => ({ ...prev, [key]: n }))
  }

  const trackerRoot = document.querySelector('[data-tracker-root]')
  if (!trackerRoot) return null

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dl2-sim-title"
      className="absolute inset-0 z-50"
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="dw-window absolute top-1.5 right-1.5 left-1/2 flex max-h-[calc(100%-0.75rem)] flex-col gap-2 p-2.5 font-display text-[9px] leading-none">
        <div className="flex items-center justify-between gap-4">
          <h2 id="dl2-sim-title" className="text-[10px] text-primary">
            Dragonlord 2
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="text-[10px] text-foreground hover:text-primary focus-visible:outline-2 focus-visible:outline-primary"
          >
            CLOSE
          </button>
        </div>

        <div className="flex min-h-0 flex-col gap-2.5 overflow-y-auto pr-0.5">
          <p className="text-muted-foreground">
            HP {DL2.hpMin}-{DL2.hpMax} · STR {DL2.str} · AGI {DL2.agi}
          </p>

          <div className="grid grid-cols-4 gap-1.5">
            {NUMBER_FIELDS.map((f) => (
              <label key={f.key} className="flex flex-col gap-1 text-muted-foreground">
                {f.label}
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={f.max}
                  value={input[f.key]}
                  onChange={(e) => setNumber(f.key, e.target.value, f.max)}
                  className="w-full rounded-sm border border-border bg-black px-1 py-1 text-[9px] text-foreground tabular-nums outline-none focus-visible:border-primary"
                />
              </label>
            ))}
          </div>

          <div className="flex flex-wrap gap-x-3 gap-y-1.5">
            <Toggle
              label="Death Necklace"
              checked={input.deathNecklace}
              onChange={(v) => setInput((p) => ({ ...p, deathNecklace: v }))}
            />
            <Toggle
              label="Erdrick's Armor"
              checked={input.erdrickArmor}
              onChange={(v) => setInput((p) => ({ ...p, erdrickArmor: v }))}
            />
          </div>

          <div role="radiogroup" aria-label="Initiative" className="flex gap-1">
            {INITIATIVE_OPTIONS.map((o) => (
              <button
                key={o.value}
                type="button"
                role="radio"
                aria-checked={input.initiative === o.value}
                onClick={() => setInput((p) => ({ ...p, initiative: o.value }))}
                className={cn(
                  'flex-1 rounded-sm border px-1 py-1',
                  input.initiative === o.value
                    ? 'border-primary text-primary'
                    : 'border-border text-foreground hover:text-primary',
                )}
              >
                {o.label}
              </button>
            ))}
          </div>

          {input.deathNecklace && (
            <p className="text-muted-foreground">
              Necklace: {maxHp} max HP, {attack} attack
            </p>
          )}

          <dl className="grid grid-cols-2 gap-x-3 gap-y-1.5 border-t border-border pt-2.5">
            <dt className="text-muted-foreground">Win rate</dt>
            <dd
              className={cn(
                'text-right tabular-nums',
                summary.winRate >= 0.9 ? 'text-[#58D854]' : summary.winRate < 0.5 ? 'text-[#F83800]' : 'text-foreground',
              )}
            >
              {pct(summary.winRate)}
            </dd>
            <dt className="text-muted-foreground">Ambushed</dt>
            <dd className="text-right tabular-nums text-foreground">{pct(summary.ambushRate)}</dd>
            <dt className="text-muted-foreground">Win, first</dt>
            <dd className="text-right tabular-nums text-foreground">{pct(summary.winWhenFirst)}</dd>
            <dt className="text-muted-foreground">Win, ambushed</dt>
            <dd className="text-right tabular-nums text-foreground">{pct(summary.winWhenAmbushed)}</dd>
            <dt className="text-muted-foreground">Avg rounds</dt>
            <dd className="text-right tabular-nums text-foreground">{summary.avgRounds.toFixed(1)}</dd>
            <dt className="text-muted-foreground">Avg HP left</dt>
            <dd className="text-right tabular-nums text-foreground">{summary.avgHpLeftOnWin.toFixed(0)}</dd>
            <dt className="text-muted-foreground">Out of heals</dt>
            <dd className="text-right tabular-nums text-foreground">{pct(summary.outOfHealingRate)}</dd>
          </dl>
          <p className="text-muted-foreground">{TRIALS.toLocaleString()} simulated fights</p>

          <div className="flex flex-col gap-1.5 border-t border-border pt-2.5">
            <div className="flex items-center justify-between">
              <h3 className={fight.won ? 'text-[#58D854]' : 'text-[#F83800]'}>Sample fight: {fight.won ? 'Won' : 'Lost'}</h3>
              <button
                type="button"
                onClick={() => setFightSeed((s) => s + 1)}
                className="text-foreground hover:text-primary focus-visible:outline-2 focus-visible:outline-primary"
              >
                REROLL
              </button>
            </div>
            <ol className="flex flex-col gap-1 normal-case leading-snug text-foreground" aria-live="polite">
              {fight.log.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>,
    trackerRoot,
  )
}

export function DragonlordSimButton() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState<SimInput>(DEFAULT_INPUT)

  return (
    <>
      <button
        type="button"
        aria-label="Open Dragonlord 2 fight simulator"
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
        className="shrink-0 rounded-sm p-0.5 transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-primary"
      >
        <img src="/sprites/dragonlord2.png" alt="" width={36} height={36} className="size-9 [image-rendering:pixelated]" />
      </button>
      {open && <SimWindow input={input} setInput={setInput} onClose={() => setOpen(false)} />}
    </>
  )
}
