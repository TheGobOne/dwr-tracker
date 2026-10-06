'use client'

import { LocationsPanel } from './locations-panel'
import { ItemsPanel, NotesPanel, SpellsPanel } from './progress-panels'

export function TrackerSidebar() {
  return (
    <section
      aria-label="Run progress"
      className="dw-window flex max-h-[44%] shrink-0 flex-col gap-3 overflow-y-auto px-2.5 pt-2.5 pb-3"
    >
      <LocationsPanel />
      <ItemsPanel />
      <SpellsPanel />
      <NotesPanel />
    </section>
  )
}
