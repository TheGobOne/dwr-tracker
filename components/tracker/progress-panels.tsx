'use client'

import { Textarea } from '@/components/ui/textarea'
import { ITEM_GROUPS, SPELLS } from '@/lib/dw-data'
import { cn } from '@/lib/utils'
import { useTracker } from './tracker-context'

export function ItemsPanel() {
  const { items, toggleItem } = useTracker()
  const total = ITEM_GROUPS.reduce((n, g) => n + g.items.length, 0)
  const owned = ITEM_GROUPS.reduce((n, g) => n + g.items.filter((i) => items[i.id]).length, 0)

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-muted-foreground">
        Collected <span className="text-foreground">{owned}</span> / {total}
      </p>
      {ITEM_GROUPS.map((group) => (
        <section key={group.label} className="flex flex-col gap-1.5">
          <h3 className="font-display text-[10px] uppercase tracking-wider text-primary">{group.label}</h3>
          <div className="grid grid-cols-2 gap-1.5">
            {group.items.map((item) => {
              const has = !!items[item.id]
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={has}
                  onClick={() => toggleItem(item.id)}
                  className={cn(
                    'rounded-sm border-2 px-2 py-1.5 text-left text-sm leading-tight transition-colors focus-visible:outline-2 focus-visible:outline-primary',
                    has
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-foreground/25 text-muted-foreground hover:border-foreground hover:text-foreground',
                  )}
                >
                  {item.name}
                </button>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}

export function SpellsPanel() {
  const { spells, updateSpell } = useTracker()
  const learned = SPELLS.filter((s) => spells[s]?.learned).length

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted-foreground">
        Learned <span className="text-foreground">{learned}</span> / {SPELLS.length}. Spell levels are shuffled in DWR —
        jot down the level you learned each one.
      </p>
      <ul className="flex flex-col gap-1">
        {SPELLS.map((name) => {
          const state = spells[name] ?? { learned: false, level: '' }
          return (
            <li key={name} className="flex items-center gap-2">
              <button
                type="button"
                aria-pressed={state.learned}
                onClick={() => updateSpell(name, { learned: !state.learned })}
                className={cn(
                  'flex-1 rounded-sm border-2 px-2 py-1 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:outline-primary',
                  state.learned
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-foreground/25 text-muted-foreground hover:border-foreground hover:text-foreground',
                )}
              >
                {name}
              </button>
              <label className="flex items-center gap-1 text-xs text-muted-foreground">
                LV
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={2}
                  value={state.level}
                  onChange={(e) => updateSpell(name, { level: e.target.value.replace(/\D/g, '') })}
                  aria-label={`${name} learned at level`}
                  className="h-7 w-9 rounded-sm border-2 border-foreground/25 bg-transparent text-center text-sm text-foreground focus-visible:border-primary focus-visible:outline-none"
                />
              </label>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export function NotesPanel() {
  const { notes, setNotes } = useTracker()
  return (
    <label className="flex flex-col gap-2 text-sm text-muted-foreground">
      Seed notes, shop inventories, hints from townsfolk…
      <Textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={16}
        placeholder={'Kol shop: Dragon Scale, Herb\nCantlin: Erdrick sword?\nOld man hint: token is south...'}
        className="min-h-64 text-base text-foreground"
      />
    </label>
  )
}
