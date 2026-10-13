'use client'

import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

const PARAGRAPHS = [
  'This tracker is made with the use of Assistive AI with Vercel. I am not a coder, programmer, or designer, so this tool is critical to my ability to make rapid changes to the tracker.',
  'No generative AI was used. All art is pulled from NES sprite sheets found online.',
  "I understand if you don't approve and stop using the tracker.",
]

export function AiDisclosureWindow({ onClose }: { onClose: () => void }) {
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
      aria-labelledby="ai-disclosure-title"
      className="absolute inset-0 z-50 flex items-center justify-center p-3"
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="dw-window flex w-full max-w-sm flex-col gap-3 p-2.5">
        <div className="flex items-center justify-between gap-4">
          <h2 id="ai-disclosure-title" className="font-display text-[10px] text-primary">
            AI Disclosure
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
        <div className="flex flex-col gap-2.5">
          {PARAGRAPHS.map((text) => (
            <p key={text} className="font-display text-[8px] leading-relaxed text-foreground">
              {text}
            </p>
          ))}
          <p className="font-display text-[8px] leading-relaxed text-white">Thanks, Gob</p>
        </div>
      </div>
    </div>,
    trackerRoot,
  )
}
