'use client'

import { useCallback, useEffect, useState } from 'react'
import { Settings } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ControlsWindow } from './controls-window'
import { ConfirmClearWindow } from './confirm-clear-window'
import { useTracker } from './tracker-context'
import { useInstallPrompt } from '@/hooks/use-install-prompt'

const GEAR_SEEN_STORAGE_KEY = 'dwr-tracker-gear-hint-seen'
const CONTROLS_SEEN_STORAGE_KEY = 'dwr-tracker-controls-hint-seen'

const menuItemClass = 'font-display text-[9px] uppercase tracking-wider'

export function TrackerMenu() {
  const { canInstall, installed, install } = useInstallPrompt()
  const [controlsOpen, setControlsOpen] = useState(false)
  const closeControls = useCallback(() => setControlsOpen(false), [])
  const { reset } = useTracker()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const closeConfirm = useCallback(() => setConfirmOpen(false), [])
  // Start "seen" so the server render and first paint never flash the hints for returning users.
  const [gearSeen, setGearSeen] = useState(true)
  const [controlsSeen, setControlsSeen] = useState(true)

  useEffect(() => {
    setGearSeen(window.localStorage.getItem(GEAR_SEEN_STORAGE_KEY) === '1')
    setControlsSeen(window.localStorage.getItem(CONTROLS_SEEN_STORAGE_KEY) === '1')
  }, [])

  const markGearSeen = () => {
    if (gearSeen) return
    setGearSeen(true)
    window.localStorage.setItem(GEAR_SEEN_STORAGE_KEY, '1')
  }

  const openControls = () => {
    setControlsOpen(true)
    if (controlsSeen) return
    setControlsSeen(true)
    window.localStorage.setItem(CONTROLS_SEEN_STORAGE_KEY, '1')
  }

  return (
    <>
      <DropdownMenu onOpenChange={(open) => open && markGearSeen()}>
        <DropdownMenuTrigger
          aria-label="Tracker menu"
          className={`shrink-0 rounded-sm p-0.5 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary ${
            gearSeen ? 'text-muted-foreground' : 'animate-dw-gear-rainbow'
          }`}
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
          <DropdownMenuItem onClick={openControls} className={menuItemClass}>
            {!controlsSeen && (
              <span aria-hidden="true" className="animate-dw-hint-blink text-primary">
                {'▶'}
              </span>
            )}
            Controls
            {!controlsSeen && (
              <span aria-hidden="true" className="animate-dw-hint-blink text-primary">
                {'◀'}
              </span>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setConfirmOpen(true)}
            className={`${menuItemClass} text-destructive focus:bg-destructive focus:text-white`}
          >
            Clear
          </DropdownMenuItem>
          {!installed && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={install}
                disabled={!canInstall}
                title={canInstall ? 'Install DWR Tracker as an app' : 'Open in Chrome (outside the preview) to install'}
                className={menuItemClass}
              >
                Install
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {controlsOpen && <ControlsWindow onClose={closeControls} />}
      {confirmOpen && (
        <ConfirmClearWindow
          onCancel={closeConfirm}
          onConfirm={() => {
            reset()
            setConfirmOpen(false)
          }}
        />
      )}
    </>
  )
}
