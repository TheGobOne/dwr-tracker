'use client'

import { Settings } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CLEAR_DRAWING_EVENT } from './drawing-layer'
import { useTracker } from './tracker-context'

export function TrackerMenu() {
  const { reset } = useTracker()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Tracker menu"
        className="shrink-0 rounded-sm p-0.5 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary"
      >
        <Settings className="size-6" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => {
            reset()
            window.dispatchEvent(new Event(CLEAR_DRAWING_EVENT))
          }}
          className="font-display text-[9px] uppercase tracking-wider text-destructive focus:text-destructive">
          Clear
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
