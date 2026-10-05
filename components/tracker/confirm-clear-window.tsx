'use client'

import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

const buttonClass =
  'font-display text-[10px] uppercase px-2 py-1 border border-border rounded-sm focus-visible:outline-2 focus-visible:outline-primary'

export function ConfirmClearWindow({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  const cancelRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const frame = requestAnimationFrame(() => cancelRef.current?.focus({ preventScroll: true }))
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('keydown', onKey)
    }
  }, [onCancel])

  const trackerRoot = document.querySelector('[data-tracker-root]')
  if (!trackerRoot) return null

  return createPortal(
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-clear-title"
      aria-describedby="confirm-clear-desc"
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) onCancel()
      }}
    >
      <div className="dw-window flex w-full max-w-xs flex-col gap-3 p-3">
        <h2 id="confirm-clear-title" className="font-display text-[10px] text-primary">
          Clear Tracker?
        </h2>
        <p id="confirm-clear-desc" className="font-display text-[8px] leading-relaxed text-foreground">
          This resets all markers, drawings, items, spells, and notes. It cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <button ref={cancelRef} type="button" onClick={onCancel} className={`${buttonClass} text-foreground hover:text-primary`}>
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`${buttonClass} border-destructive text-destructive hover:bg-destructive hover:text-white`}
          >
            Clear
          </button>
        </div>
      </div>
    </div>,
    trackerRoot,
  )
}
