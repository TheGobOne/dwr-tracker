'use client'

import { useCallback, useState } from 'react'
import { Settings } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ControlsWindow } from './controls-window'
import { useTracker } from './tracker-context'

const menuItemClass = 'font-display text-[9px] uppercase tracking-wider'

export function TrackerMenu() {
  const { reset } = useTracker()
  const [controlsOpen, setControlsOpen] = useState(false)
  const closeControls = useCallback(() => setControlsOpen(false), [])

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label="Tracker menu"
          className="shrink-0 rounded-sm p-0.5 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary"
        >
          <Settings className="size-6" aria-hidden="true" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setControlsOpen(true)} className={menuItemClass}>
            Controls
          </DropdownMenuItem>
          <DropdownMenuItem onClick={reset} className={`${menuItemClass} text-destructive focus:text-destructive`}>
            Clear
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {controlsOpen && <ControlsWindow onClose={closeControls} />}
    </>
  )
}
