'use client'

import { ITEM_GROUPS, SPELLS } from '@/lib/dw-data'
import { cn } from '@/lib/utils'
import { COORDS_LOCATION_ID, CoordsInput, PanelTitle } from './locations-panel'
import { useTracker } from './tracker-context'

const toggleBase =
  'inline-flex h-4 items-center justify-center rounded-sm border px-1.5 text-[8px] leading-none transition-colors focus-visible:outline-2 focus-visible:outline-primary'
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
      <div className="flex items-center justify-center gap-2">
      <div className="flex min-w-0 flex-wrap justify-center gap-0.5">
        {all.map((item) => {
          const has = !!items[item.id]
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={has}
              onClick={() => toggleItem(item.id)}
              className={cn(toggleBase, 'px-1', has ? toggleOn : toggleOff)}
            >
              {item.name}
            </button>
          )
        })}
      </div>
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
      <div className="flex items-center gap-1.5">
        <ul className="grid flex-1 grid-cols-2 gap-1 sm:grid-cols-5">
          {SPELLS.map((name) => {
            const state = spells[name] ?? { learned: false, level: '' }
            return (
              <li key={name} className="flex">
                <button
                  type="button"
                  aria-pressed={state.learned}
                  onClick={() => updateSpell(name, { learned: !state.learned })}
                  className={cn(
                    toggleBase,
                    'block min-w-0 flex-1 truncate px-1 text-center text-[6px] leading-[14px]',
                    state.learned ? toggleOn : toggleOff,
                  )}
                >
                  {name}
                </button>
              </li>
            )
          })}
        </ul>
        <div aria-hidden="true" className="w-px self-stretch bg-border" />
        <CoordsInput locationId={COORDS_LOCATION_ID} name="Jerk" />
      </div>
    </section>
  )
}

export function NotesPanel() {
  const { notes, setNotes } = useTracker()
  return (
  <section className="flex shrink-0 flex-col gap-1">
  <label htmlFor="run-notes">
  <span className="sr-only">Notes</span>
  <PanelTitle>Notes</PanelTitle>
  </label>
        <textarea
          data-notes-field

  id="run-notes"
  value={notes}
  onChange={(e) => setNotes(e.target.value)}
  rows={2}
  className="h-[3.25rem] shrink-0 resize-none overflow-y-auto rounded-sm border border-foreground/25 bg-transparent px-1.5 py-1 text-[9px] leading-5 text-foreground [scrollbar-width:none] focus-visible:border-primary focus-visible:outline-none [&::-webkit-scrollbar]:hidden"
      />
    </section>
  )
}
