'use client'

import { ItemsPanel, NotesPanel, SpellsPanel } from './progress-panels'

export function TrackerSidebar() {
  return (
    <section
      aria-label="Run progress"
      className="dw-window flex max-h-[44%] shrink-0 flex-col gap-1.5 overflow-y-auto px-2.5 py-1.5"
    >
      <ItemsPanel />
      <SpellsPanel />
      <NotesPanel />
    </section>
  )
}
