'use client'

import { Settings } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
        <DropdownMenuItem onClick={reset} className="font-display text-[9px] uppercase tracking-wider">
          Clear
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
