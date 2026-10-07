'use client'

import { useCallback, useState } from 'react'
import { ConfirmClearWindow } from './confirm-clear-window'
import { useTracker } from './tracker-context'

export function ClearTrackerButton() {
  const { reset } = useTracker()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const closeConfirm = useCallback(() => setConfirmOpen(false), [])

  return (
    <>
      <button
        type="button"
        onClick={() => setConfirmOpen(true)}
        aria-haspopup="dialog"
        className="font-display rounded-sm border border-destructive bg-black/60 px-1.5 py-[3px] text-[10px] leading-none text-destructive uppercase outline-none transition-colors hover:bg-destructive hover:text-white focus-visible:ring-2 focus-visible:ring-primary"
      >
        Clear
      </button>
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
