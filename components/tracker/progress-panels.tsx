'use client'

import { ITEM_GROUPS, SPELLS } from '@/lib/dw-data'
import { cn } from '@/lib/utils'
import { PanelTitle } from './locations-panel'
import { useTracker } from './tracker-context'

const toggleBase =
  'rounded-sm border px-1.5 py-0.5 text-xs leading-tight transition-colors focus-visible:outline-2 focus-visible:outline-primary'
const toggleOn = 'border-primary bg-primary text-primary-foreground'
const toggleOff = 'border-foreground/25 text-muted-foreground hover:border-foreground hover:text-foreground'

export function ItemsPanel() {
  const { items, toggleItem } = useTracker()
  const all = ITEM_GROUPS.flatMap((g) => g.items)

  return (
    <section aria-labelledby="items-heading" className="flex flex-col gap-1">
      <h2 id="items-heading" className="sr-only">
        Items
      </h2>
      <PanelTitle>Items</PanelTitle>
      <div className="flex flex-wrap gap-1">
        {all.map((item) => {
          const has = !!items[item.id]
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={has}
              onClick={() => toggleItem(item.id)}
              className={cn(toggleBase, has ? toggleOn : toggleOff)}
            >
              {item.name}
            </button>
          )
        })}
      </div>
    </section>
  )
}

export function SpellsPanel() {
  const { spells, updateSpell } = useTracker()

  return (
    <section aria-labelledby="spells-heading" className="flex flex-col gap-1">
      <h2 id="spells-heading" className="sr-only">
        Spells
      </h2>
      <PanelTitle>Spells</PanelTitle>
      <ul className="grid grid-cols-2 gap-1 sm:grid-cols-5">
        {SPELLS.map((name) => {
          const state = spells[name] ?? { learned: false, level: '' }
          return (
            <li key={name} className="flex">
              <button
                type="button"
                aria-pressed={state.learned}
                onClick={() => updateSpell(name, { learned: !state.learned })}
                className={cn(toggleBase, 'min-w-0 flex-1 truncate text-left', state.learned ? toggleOn : toggleOff)}
              >
                {name}
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export function NotesPanel() {
  const { notes, setNotes } = useTracker()
  return (
    <section className="flex flex-col gap-1">
      <label htmlFor="run-notes">
        <PanelTitle>Notes</PanelTitle>
      </label>
      <textarea
        id="run-notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={1}
        placeholder="Shop inventories, townsfolk hints…"
        className="resize-y rounded-sm border border-foreground/25 bg-transparent px-1.5 py-1 text-xs text-foreground placeholder:text-muted-foreground/60 focus-visible:border-primary focus-visible:outline-none"
      />
    </section>
  )
}
