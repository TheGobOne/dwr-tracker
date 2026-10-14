'use client'

import { ITEM_GROUPS, SPELLS } from '@/lib/dw-data'
import { cn } from '@/lib/utils'
import { MonsterLookupButton } from './monster-lookup'
import { MAX_CURSED_BELTS, RAINBOW_DROP_ID, RAINBOW_DROP_PREREQS, useTracker } from './tracker-context'
import { TrackerMenu } from './tracker-menu'

const toggleBase =
  'inline-flex h-4 items-center justify-center rounded-sm border px-1.5 text-[8px] leading-none transition-colors focus-visible:outline-2 focus-visible:outline-primary'
const toggleOn = 'border-primary bg-primary text-primary-foreground'
const toggleOff = 'border-foreground/25 text-muted-foreground hover:border-foreground hover:text-foreground'

export function ItemsPanel() {
  const { items, toggleItem, rainbowDropBlocked, rainbowDeniedKey: deniedKey, denyRainbowDrop } = useTracker()

  const handleToggle = (id: string) => {
    if (id === RAINBOW_DROP_ID && rainbowDropBlocked) {
      denyRainbowDrop()
      return
    }
    toggleItem(id)
  }

  const denied = deniedKey > 0

  return (
    <section aria-labelledby="items-heading" className="flex flex-col gap-1">
      <h2 id="items-heading" className="sr-only">
        Items
      </h2>
      <div className="flex items-stretch gap-1">
        {ITEM_GROUPS.map((group, groupIndex) => (
          <div key={group.label} className="flex min-w-0 flex-1 items-stretch">
            <ul aria-label={group.label} className="grid min-w-0 flex-1 grid-cols-2 grid-rows-[repeat(2,1rem)] content-start gap-1">
              {group.items.map((item) => {
                const has = !!items[item.id]
                const isDrop = item.id === RAINBOW_DROP_ID
                const highlighted = denied && RAINBOW_DROP_PREREQS.includes(item.id)
                return (
                  <li key={item.id} className={cn('flex', item.wide && 'col-span-2')}>
                    <button
                      key={isDrop && denied ? `drop-${deniedKey}` : undefined}
                      type="button"
                      aria-pressed={has}
                      aria-describedby={isDrop ? 'rainbow-drop-hint' : undefined}
                      onClick={() => handleToggle(item.id)}
                      className={cn(
                        toggleBase,
                        'min-w-0 flex-1 px-1',
                        has ? toggleOn : toggleOff,
                        isDrop && denied && 'animate-dw-shake border-destructive text-destructive',
                        highlighted && 'ring-2 ring-destructive ring-offset-1 ring-offset-background',
                      )}
                    >
                      <span className="truncate">{item.name}</span>
                    </button>
                  </li>
                )
              })}
              {group.label === "Erdrick's Gear" && <CursedBelts />}
              {groupIndex === ITEM_GROUPS.length - 1 && (
              <li className="col-span-2 row-span-2 flex">
                <MonsterLookupButton className={cn(toggleBase, toggleOff, 'h-full min-w-0 flex-1 px-1')} />
                </li>
              )}
            </ul>
          </div>
        ))}
      </div>
      <span id="rainbow-drop-hint" className="sr-only">
        Requires Token, Stones, Harp, and Staff.
      </span>
      <span role="status" className="sr-only">
        {denied ? 'Rainbow Drop needs Token, Stones, Harp, and Staff first.' : ''}
      </span>
    </section>
  )
}

function CursedBelts() {
  const { cursedBelts, adjustCursedBelts } = useTracker()
  const active = cursedBelts > 0

  return (
    <li className="col-span-2 flex">
      <button
        type="button"
        aria-describedby="cursed-belts-hint"
        title="Left click: +1 · Right click: -1"
        onClick={() => adjustCursedBelts(1)}
        onContextMenu={(e) => {
          e.preventDefault()
          adjustCursedBelts(-1)
        }}
        className={cn(
          toggleBase,
          'min-w-0 flex-1 gap-1.5 px-1',
          active ? 'border-purple-500 bg-purple-600 text-white' : toggleOff,
        )}
      >
        <span className="truncate">Cursed Belts</span>
        <span className="shrink-0 tabular-nums">- {cursedBelts}</span>
      </button>
      <span id="cursed-belts-hint" className="sr-only">
        {`${cursedBelts} of ${MAX_CURSED_BELTS}. Click to add, right click to remove.`}
      </span>
    </li>
  )
}

export function SpellsPanel() {
  const { spells, updateSpell } = useTracker()

  return (
    <section aria-labelledby="spells-heading" className="flex flex-col gap-1">
      <h2 id="spells-heading" className="sr-only">
        Spells
      </h2>
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
    <section className="flex shrink-0 items-center gap-2">
      <label htmlFor="run-notes" className="sr-only">
        Notes
      </label>
      <textarea
        data-notes-field
        id="run-notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Notes"
        rows={2}
        className="h-[3.25rem] min-w-0 flex-1 resize-none overflow-y-auto rounded-sm border border-foreground/25 bg-transparent px-1.5 py-1 text-[9px] leading-5 text-foreground placeholder:text-foreground/35 [scrollbar-width:none] focus-visible:border-primary focus-visible:outline-none [&::-webkit-scrollbar]:hidden"
      />
      <TrackerMenu />
    </section>
  )
}
