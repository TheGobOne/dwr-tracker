'use client'

import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'
import { useTracker } from '@/components/tracker/tracker-context'
import { HEALMORE, runSimulation, type SimInput } from '@/lib/dragonlord-sim'

const TRIALS = 10000

const pct = (v: number | null) => (v === null ? '-' : `${(v * 100).toFixed(1)}%`)

// Visible width of the DL2 sprite (74x92 art contained in a 36px box). The pixel
// font's glyphs are 1em wide, so font-size = width / characters fills it exactly.

function MapWinRate({ winRate }: { winRate: number }) {
  const label = `${(Math.floor(winRate * 1000) / 10).toFixed(1)}%`
  return (
    <span
      className={cn('block whitespace-nowrap font-display text-[10px] leading-none tabular-nums', winRateColor(winRate))}
    >
      {label}
    </span>
  )
}

type NumberKey = 'maxHp' | 'dl2Hp' | 'mp' | 'attack' | 'defense' | 'agility' | 'fairyWater'

const ATTACK_AT_OPTIONS = [
  { value: 47, label: '47 HP' },
  { value: 48, label: '48 HP' },
  { value: 49, label: '49+ HP' },
] as const

type AttackAt = (typeof ATTACK_AT_OPTIONS)[number]['value']

type FormState = Omit<SimInput, NumberKey | 'healAt'> &
  Record<NumberKey, number | null> & { attackAt: AttackAt; divemore: boolean }

const DEFAULT_FORM: FormState = {
  attackAt: 49,
  maxHp: null,
  dl2Hp: null,
  mp: null,
  attack: null,
  defense: null,
  agility: null,
  fairyWater: null,
  deathNecklace: false,
  erdrickArmor: true,
  divemore: false,
  initiative: 'random',
}

function fightMp(form: Pick<FormState, 'mp' | 'divemore'>) {
  if (form.mp === null) return null
  return Math.max(0, form.mp - (form.divemore ? HEALMORE.cost : 0))
}

const REQUIRED_KEYS: NumberKey[] = ['maxHp', 'mp', 'attack', 'defense', 'agility']

function toSimInput(form: FormState): SimInput | null {
  if (REQUIRED_KEYS.some((k) => form[k] === null)) return null
  const { attackAt, divemore: _divemore, ...rest } = form
  return {
    ...rest,
    maxHp: form.maxHp ?? 0,
    dl2Hp: form.dl2Hp,
    mp: fightMp(form) ?? 0,
    attack: form.attack ?? 0,
    defense: form.defense ?? 0,
    agility: form.agility ?? 0,
    fairyWater: form.fairyWater ?? 0,
    // Attacking at N HP means healing at anything below it.
    healAt: attackAt - 1,
  }
}

const NUMBER_FIELDS: { key: NumberKey; label: string; title: string; max: number }[] = [
  { key: 'maxHp', label: 'DL1 HP', title: 'HP at DL1 (max HP)', max: 999 },
  { key: 'dl2Hp', label: 'DL2 HP', title: 'HP at DL2 (optional, blank uses the DL1 sim)', max: 999 },
  { key: 'mp', label: 'MP', title: 'Max MP', max: 999 },
  { key: 'attack', label: 'ATK', title: 'Attack', max: 999 },
  { key: 'defense', label: 'DEF', title: 'Defense', max: 999 },
  { key: 'agility', label: 'AGI', title: 'Agility', max: 255 },
  { key: 'fairyWater', label: 'F Water', title: 'Fairy Water', max: 6 },
]


function Toggle({
  label,
  title,
  checked,
  onChange,
}: {
  label: string
  title: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex flex-col justify-end">
      <button
        type="button"
        aria-pressed={checked}
        aria-label={title}
        title={title}
        onClick={() => onChange(!checked)}
        className={cn(
          'w-full rounded-sm border px-1 py-1 text-[9px] transition-colors focus-visible:outline-2 focus-visible:outline-primary',
          checked
            ? 'border-primary bg-primary text-primary-foreground'
            : 'border-foreground/25 text-muted-foreground hover:border-foreground hover:text-foreground',
        )}
      >
        {label}
      </button>
    </div>
  )
}

function NumberBox({
  value,
  max,
  onCommit,
}: {
  value: number | null
  max: number
  onCommit: (raw: string) => void
}) {
  return (
    <input
      type="text"
      data-sim-field
      inputMode="numeric"
      pattern="[0-9]*"
      maxLength={String(max).length}
      value={value === null ? '' : String(value)}
      onFocus={(e) => e.currentTarget.select()}
      onChange={(e) => onCommit(e.target.value.replace(/\D/g, ''))}
      onKeyDown={(e) => {
        if (e.key === 'Enter') e.currentTarget.blur()
      }}
      className="w-full rounded-sm border border-border bg-black px-1 py-1 text-center text-[9px] text-foreground tabular-nums outline-none focus-visible:border-primary"
    />
  )
}

const winRateColor = (rate: number) =>
  rate >= 0.9 ? 'text-[#58D854]' : rate < 0.5 ? 'text-[#F83800]' : 'text-foreground'

function SimWindow({
  input,
  setInput,
  summary,
  onClose,
}: {
  input: FormState
  setInput: React.Dispatch<React.SetStateAction<FormState>>
  summary: ReturnType<typeof runSimulation> | null
  onClose: () => void
}) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true })
  }, [])

  const setNumber = (key: NumberKey, raw: string, max: number) => {
    const n = raw === '' ? null : Math.max(0, Math.min(max, Math.floor(Number(raw))))
    setInput((prev) => ({ ...prev, [key]: n }))
  }

  const renderField = (f: (typeof NUMBER_FIELDS)[number]) => (
    <label key={f.key} title={f.title} className="flex flex-col gap-1 whitespace-nowrap text-center text-muted-foreground">
      {f.label}
      <NumberBox value={input[f.key]} max={f.max} onCommit={(raw) => setNumber(f.key, raw, f.max)} />
    </label>
  )

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
  <h2 id="dl2-sim-title" className="whitespace-nowrap text-[10px] text-primary">
  Dragonlord Sim
  </h2>
  <button
  type="button"
  onClick={() => setInput(DEFAULT_FORM)}
  className="text-[10px] text-[#F83800] hover:text-[#FF7759] focus-visible:outline-2 focus-visible:outline-[#F83800]"
  >
  CLEAR
  </button>
  <button
  ref={closeRef}
  type="button"
  onClick={onClose}
  className="text-[10px] text-foreground hover:text-primary focus-visible:outline-2 focus-visible:outline-primary"
  >
  CLOSE
  </button>
  </div>

        <div className="flex min-h-0 flex-col gap-2.5 overflow-y-auto">
          <div className="grid grid-cols-4 items-end gap-1.5">
            {NUMBER_FIELDS.slice(0, 3).map(renderField)}
            <div title={`Healmores castable (${HEALMORE.cost} MP each)`} className="flex flex-col gap-1 whitespace-nowrap text-center text-muted-foreground">
              <span>HM</span>
              <output
                aria-label="Healmores castable"
                className="w-full rounded-sm border border-border/60 px-1 py-1 text-center text-[9px] text-foreground tabular-nums"
              >
                {input.mp === null ? '\u00A0' : Math.floor((fightMp(input) ?? 0) / HEALMORE.cost)}
              </output>
            </div>
            {NUMBER_FIELDS.slice(3).map(renderField)}
          </div>

          <div role="radiogroup" aria-labelledby="dl2-attack-at-label" className="mt-1.5 grid grid-cols-4 items-center gap-1.5">
            <span id="dl2-attack-at-label" className="whitespace-nowrap text-center text-muted-foreground">
              Swing
            </span>
            {ATTACK_AT_OPTIONS.map((o) => {
              const selected = input.attackAt === o.value
              return (
                <button
                  key={o.value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setInput((p) => ({ ...p, attackAt: o.value }))}
                  className={cn(
                    'w-full min-w-0 whitespace-nowrap rounded-sm border px-1 py-1 text-[9px] tabular-nums transition-colors focus-visible:outline-2 focus-visible:outline-primary',
                    selected
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-foreground/25 text-muted-foreground hover:border-foreground hover:text-foreground',
                  )}
                >
                  {o.label}
                </button>
              )
            })}
          </div>

          <div role="group" aria-labelledby="dl-sim-use-label" className="grid grid-cols-4 items-center gap-1.5">
            <span id="dl-sim-use-label" className="whitespace-nowrap text-center text-muted-foreground">
              Use
            </span>
            <Toggle
              label="D Neck"
              title="Death Necklace"
              checked={input.deathNecklace}
              onChange={(v) => setInput((p) => ({ ...p, deathNecklace: v }))}
            />
            <Toggle
              label="Armor"
              title="Erdrick's Armor"
              checked={input.erdrickArmor}
              onChange={(v) => setInput((p) => ({ ...p, erdrickArmor: v }))}
            />
            <Toggle
              label="D Dive"
              title="Cast 1 Healmore on the way to DL (1 fewer for the fight)"
              checked={input.divemore}
              onChange={(v) => setInput((p) => ({ ...p, divemore: v }))}
            />
          </div>

          {summary !== null && (
          <dl className="grid grid-cols-2 gap-x-3 gap-y-1.5 border-t border-border pt-2.5">
            <dt className="text-muted-foreground">Win rate</dt>
            <dd className={cn('text-right tabular-nums', winRateColor(summary.winRate))}>
              {pct(summary.winRate)}
            </dd>
            <dt className="text-muted-foreground">Beat DL1</dt>
            <dd className="text-right tabular-nums text-foreground">{pct(summary.dl1WinRate)}</dd>
            <dt className="text-muted-foreground">DL1 ambush</dt>
                <dd className="text-right tabular-nums text-foreground">{pct(summary.dl1FirstRate)}</dd>
                <dt className="text-muted-foreground">DL1 damage</dt>
                <dd className="text-right tabular-nums text-foreground">
                  {Math.round(summary.avgDl1DamageTaken)}
                </dd>
                <dt className="text-muted-foreground">HP into DL2</dt>
                <dd className="text-right tabular-nums text-foreground">
                  {summary.dl1WinRate ? `${Math.round(summary.avgHpAfterDl1)}/${Math.round(summary.effectiveMaxHp)}` : '—'}
                </dd>
            <dt className="text-muted-foreground">DL2 ambush</dt>
            <dd className="text-right tabular-nums text-foreground">{pct(summary.dlFirstRate)}</dd>
            <dt className="text-muted-foreground">Win, you first</dt>
            <dd className="text-right tabular-nums text-foreground">{pct(summary.winWhenFirst)}</dd>
            <dt className="text-muted-foreground">Win, DL2 first</dt>
            <dd className="text-right tabular-nums text-foreground">{pct(summary.winWhenDlFirst)}</dd>

          </dl>
          )}

          <p className="text-pretty border-t border-border pt-2.5 text-center text-[9px] leading-relaxed text-muted-foreground">
            Manually enter DL2 HP after you fight DL1 or leave blank to sim DL1 damage taken
          </p>
        </div>
      </div>
    </div>,
    trackerRoot,
  )
}

export function DragonlordSimButton() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState<FormState>(DEFAULT_FORM)
  const { resetCount } = useTracker()
  const [seenResetCount, setSeenResetCount] = useState(resetCount)
  if (seenResetCount !== resetCount) {
    setSeenResetCount(resetCount)
    setInput(DEFAULT_FORM)
  }
  const deferredInput = useDeferredValue(input)
  const summary = useMemo(() => {
    const simInput = toSimInput(deferredInput)
    return simInput ? runSimulation(simInput, TRIALS, 1) : null
  }, [deferredInput])

  return (
    <>
      <button
        type="button"
        aria-label={
          summary
            ? `Open Dragonlord fight simulator, win rate ${pct(summary.winRate)}`
            : 'Open Dragonlord fight simulator'
        }
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
        className="group flex shrink-0 flex-row-reverse items-center gap-1 rounded-sm p-0.5 focus-visible:outline-2 focus-visible:outline-primary"
      >
        <img
          src="/dragonlord-icon.png"
          alt=""
          width={36}
          height={36}
          className="size-9 object-contain transition-transform [image-rendering:pixelated] group-hover:scale-110"
        />
        {summary && <MapWinRate winRate={summary.winRate} />}
      </button>
      {open && <SimWindow input={input} setInput={setInput} summary={summary} onClose={() => setOpen(false)} />}
    </>
  )
}
