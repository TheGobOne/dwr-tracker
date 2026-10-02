'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LocationsPanel } from './locations-panel'
import { ItemsPanel, NotesPanel, SpellsPanel } from './progress-panels'

const TABS = [
  { value: 'locations', label: 'Map' },
  { value: 'items', label: 'Items' },
  { value: 'spells', label: 'Spells' },
  { value: 'notes', label: 'Notes' },
]

export function TrackerSidebar() {
  return (
    <aside aria-label="Run progress" className="dw-window flex min-h-0 shrink-0 flex-col overflow-hidden lg:w-80">
      <Tabs defaultValue="locations" className="flex min-h-0 flex-1 flex-col gap-0">
        <TabsList className="h-auto! w-full rounded-none border-b-2 border-foreground/80 bg-transparent p-1.5">
          {TABS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="rounded-sm py-1.5 font-display text-[9px] uppercase data-active:bg-primary! data-active:text-primary-foreground!"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          <TabsContent value="locations">
            <LocationsPanel />
          </TabsContent>
          <TabsContent value="items">
            <ItemsPanel />
          </TabsContent>
          <TabsContent value="spells">
            <SpellsPanel />
          </TabsContent>
          <TabsContent value="notes">
            <NotesPanel />
          </TabsContent>
        </div>
      </Tabs>
    </aside>
  )
}
