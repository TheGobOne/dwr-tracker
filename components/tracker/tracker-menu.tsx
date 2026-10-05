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
import { useInstallPrompt } from '@/hooks/use-install-prompt'

const menuItemClass = 'font-display text-[9px] uppercase tracking-wider'

export function TrackerMenu() {
  const { reset } = useTracker()
  const { canInstall, installed, install } = useInstallPrompt()
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
        <DropdownMenuContent
          align="end"
          collisionBoundary={
            typeof document === 'undefined'
              ? undefined
              : (document.querySelector('[data-tracker-root]') ?? undefined)
          }
          collisionPadding={6}
        >
          <DropdownMenuItem onClick={() => setControlsOpen(true)} className={menuItemClass}>
            Controls
          </DropdownMenuItem>
          {!installed && (
            <DropdownMenuItem
              onClick={install}
              disabled={!canInstall}
              title={canInstall ? 'Install DWR Tracker as an app' : 'Open in Chrome (outside the preview) to install'}
              className={`${menuItemClass} gap-2`}
            >
              <img
                src="/dragonlord-icon.png"
                alt=""
                aria-hidden="true"
                width={12}
                height={15}
                className="h-[15px] w-3 shrink-0 [image-rendering:pixelated]"
              />
              Install
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={reset} className={`${menuItemClass} text-destructive focus:text-destructive`}>
            Clear
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {controlsOpen && <ControlsWindow onClose={closeControls} />}
    </>
  )
}
