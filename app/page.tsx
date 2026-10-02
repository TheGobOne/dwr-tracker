import { MapCanvas } from '@/components/tracker/map-canvas'
import { MapToolbar } from '@/components/tracker/map-toolbar'
import { TrackerProvider } from '@/components/tracker/tracker-context'
import { TrackerHeader } from '@/components/tracker/tracker-header'
import { TrackerShortcuts } from '@/components/tracker/tracker-shortcuts'
import { TrackerSidebar } from '@/components/tracker/tracker-sidebar'

export default function Page() {
  return (
    <TrackerProvider>
      <TrackerShortcuts />
      <div className="flex min-h-dvh flex-col gap-3 p-3 lg:h-dvh lg:overflow-hidden">
        <TrackerHeader />
        <main className="flex min-h-0 flex-1 flex-col gap-3 lg:flex-row">
          <MapToolbar />
          <MapCanvas />
          <TrackerSidebar />
        </main>
      </div>
    </TrackerProvider>
  )
}
