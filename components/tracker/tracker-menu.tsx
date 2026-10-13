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
import { AiDisclosureWindow } from './ai-disclosure-window'
import { InstallWindow } from './install-window'
import { ConfirmClearWindow } from './confirm-clear-window'
import { useTracker } from './tracker-context'
import { useInstallPrompt } from '@/hooks/use-install-prompt'

const GEAR_SEEN_STORAGE_KEY = 'dwr-tracker-gear-hint-seen'
const CONTROLS_SEEN_STORAGE_KEY = 'dwr-tracker-controls-hint-seen'

const menuItemClass = 'font-display text-[9px] uppercase tracking-wider whitespace-nowrap'

export function TrackerMenu() {
  const { canInstall, installed, install } = useInstallPrompt()
  const [controlsOpen, setControlsOpen] = useState(false)
  const closeControls = useCallback(() => setControlsOpen(false), [])
  const { reset } = useTracker()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const closeConfirm = useCallback(() => setConfirmOpen(false), [])
  const [disclosureOpen, setDisclosureOpen] = useState(false)
  const closeDisclosure = useCallback(() => setDisclosureOpen(false), [])
  const [installOpen, setInstallOpen] = useState(false)
  const closeInstall = useCallback(() => setInstallOpen(false), [])
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
          className="w-max min-w-max"
        >
          <DropdownMenuItem
            onClick={() => setConfirmOpen(true)}
            className={`${menuItemClass} text-destructive focus:bg-destructive focus:text-white`}
          >
            Clear
          </DropdownMenuItem>
          <DropdownMenuSeparator />
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
          {!installed && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setInstallOpen(true)} className={menuItemClass}>
                Install as App
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setDisclosureOpen(true)} className={menuItemClass}>
            AI Disclosure
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {controlsOpen && <ControlsWindow onClose={closeControls} />}
      {disclosureOpen && <AiDisclosureWindow onClose={closeDisclosure} />}
      {installOpen && (
        <InstallWindow
          onClose={closeInstall}
          canInstall={canInstall}
          onInstall={() => {
            install()
            setInstallOpen(false)
          }}
        />
      )}
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
