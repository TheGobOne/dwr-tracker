'use client'

import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

const STEPS = [
  { browser: 'Chrome / Edge', how: 'Click the install icon in the address bar, or Menu › Install' },
  { browser: 'Safari (Mac)', how: 'File › Add to Dock' },
  { browser: 'Safari (iOS)', how: 'Share › Add to Home Screen' },
  { browser: 'Firefox', how: 'Not supported - use Chrome, Edge, or Safari' },
]

type InstallWindowProps = {
  onClose: () => void
  canInstall: boolean
  onInstall: () => void
}

export function InstallWindow({ onClose, canInstall, onInstall }: InstallWindowProps) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const frame = requestAnimationFrame(() => closeRef.current?.focus({ preventScroll: true }))
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const trackerRoot = document.querySelector('[data-tracker-root]')
  if (!trackerRoot) return null

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="install-title"
      className="absolute inset-0 z-50 flex items-center justify-center p-3"
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="dw-window flex w-full max-w-sm flex-col gap-3 p-2.5">
        <div className="flex items-center justify-between gap-4">
          <h2 id="install-title" className="font-display text-[10px] uppercase text-primary">
            Install as App
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="font-display text-[10px] text-foreground hover:text-primary focus-visible:outline-2 focus-visible:outline-primary"
          >
            CLOSE
          </button>
        </div>
        <div className="flex flex-col items-center gap-2.5 text-center">
          <h3 className="font-display text-[9px] uppercase text-primary">How to Install</h3>
          {STEPS.map((step) => (
            <div key={step.browser} className="flex flex-col gap-1">
              <p className="font-display text-[8px] uppercase text-white">{step.browser}</p>
              <p className="font-display text-[8px] uppercase leading-relaxed text-muted-foreground">{step.how}</p>
            </div>
          ))}
          {canInstall && (
            <button
              type="button"
              onClick={onInstall}
              className="mt-1 rounded-sm border border-primary px-3 py-1.5 font-display text-[9px] uppercase text-primary hover:bg-primary hover:text-primary-foreground focus-visible:outline-2 focus-visible:outline-primary"
            >
              Install Now
            </button>
          )}
        </div>
      </div>
    </div>,
    trackerRoot,
  )
}
