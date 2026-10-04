'use client'

import { ITEM_GROUPS, SPELLS } from '@/lib/dw-data'
import { cn } from '@/lib/utils'
import { COORDS_LOCATION_ID, CoordsInput, PanelTitle } from './locations-panel'
import { MonsterLookupButton } from './monster-lookup'
import { useTracker } from './tracker-context'

const toggleBase =
  'inline-flex h-4 items-center justify-center rounded-sm border px-1.5 text-[8px] leading-none transition-colors focus-visible:outline-2 focus-visible:outline-primary'
const toggleOn = 'border-primary bg-primary text-primary-foreground'
const toggleOff = 'border-foreground/25 text-muted-foreground hover:border-foreground hover:text-foreground'

export function ItemsPanel() {
  const { items, toggleItem } = useTracker()

  return (
    <section aria-labelledby="items-heading" className="flex flex-col gap-1">
      <h2 id="items-heading" className="sr-only">
        Items
      </h2>
      <PanelTitle>Items</PanelTitle>
      <div className="flex items-stretch gap-1.5">
        {ITEM_GROUPS.map((group, groupIndex) => (
          <div key={group.label} className="flex min-w-0 flex-1 items-stretch gap-1.5">
            {groupIndex > 0 && <div aria-hidden="true" className="w-px self-stretch bg-border" />}
            <ul aria-label={group.label} className="grid min-w-0 flex-1 grid-cols-2 grid-rows-[repeat(2,1rem)] content-start gap-1">
              {group.items.map((item) => {
                const has = !!items[item.id]
                return (
                  <li key={item.id} className="flex">
                    <button
                      type="button"
                      aria-pressed={has}
                      onClick={() => toggleItem(item.id)}
                      className={cn(toggleBase, 'min-w-0 flex-1 px-1', has ? toggleOn : toggleOff)}
                    >
                      <span className="truncate">{item.name}</span>
                    </button>
                  </li>
                )
              })}
              {group.label === "Erdrick's Gear" && (
                <li className="col-span-2 flex items-center">
                  <CoordsInput locationId={COORDS_LOCATION_ID} name="Jerk" horizontal />
                </li>
              )}
              {groupIndex === ITEM_GROUPS.length - 1 && (
              <li className="col-span-2 row-span-2 flex">
                <MonsterLookupButton className={cn(toggleBase, toggleOff, 'h-full min-w-0 flex-1 px-1')} />
                </li>
              )}
            </ul>
          </div>
        ))}
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
                    'min-w-0 flex-1 px-1',
                    state.learned ? toggleOn : toggleOff,
                  )}
                >
                  <span className="truncate">{name}</span>
                </button>
              </li>
            )
          })}
        </ul>
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
  placeholder="Notes"
  rows={2}
  className="h-[3.25rem] shrink-0 resize-none overflow-y-auto rounded-sm border border-foreground/25 bg-transparent px-1.5 py-1 text-[9px] leading-5 text-foreground placeholder:text-foreground/35 [scrollbar-width:none] focus-visible:border-primary focus-visible:outline-none [&::-webkit-scrollbar]:hidden"
      />
    </section>
  )
}
