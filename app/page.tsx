import { MapCanvas } from '@/components/tracker/map-canvas'
import { TrackerProvider } from '@/components/tracker/tracker-context'
import { TrackerHeader } from '@/components/tracker/tracker-header'
import { TrackerShortcuts } from '@/components/tracker/tracker-shortcuts'
import { TrackerSidebar } from '@/components/tracker/tracker-sidebar'

export default function Page() {
  return (
    <TrackerProvider>
      <TrackerShortcuts />
      <div data-tracker-root className="mx-auto flex h-dvh w-full max-w-[640px] flex-col gap-1.5 overflow-hidden p-1.5">
        <TrackerHeader />
        <main className="flex min-h-0 flex-1 flex-col gap-1.5">
          <MapCanvas />
          <TrackerSidebar />
        </main>
      </div>
    </TrackerProvider>
  )
}
