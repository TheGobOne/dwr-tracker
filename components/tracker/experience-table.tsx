'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const EXP_LEVELS: { level: number; veryFast: number; fast: number; normal: number }[] = [
  { level: 2, veryFast: 3, fast: 5, normal: 7 },
  { level: 3, veryFast: 11, fast: 17, normal: 23 },
  { level: 4, veryFast: 23, fast: 35, normal: 47 },
  { level: 5, veryFast: 55, fast: 82, normal: 110 },
  { level: 6, veryFast: 110, fast: 165, normal: 220 },
  { level: 7, veryFast: 225, fast: 337, normal: 450 },
  { level: 8, veryFast: 400, fast: 600, normal: 800 },
  { level: 9, veryFast: 650, fast: 975, normal: 1300 },
  { level: 10, veryFast: 1000, fast: 1500, normal: 2000 },
  { level: 11, veryFast: 1450, fast: 2175, normal: 2900 },
  { level: 12, veryFast: 2000, fast: 3000, normal: 4000 },
  { level: 13, veryFast: 2750, fast: 4125, normal: 5500 },
  { level: 14, veryFast: 3750, fast: 5625, normal: 7500 },
  { level: 15, veryFast: 5000, fast: 7500, normal: 10000 },
  { level: 16, veryFast: 6500, fast: 9750, normal: 13000 },
  { level: 17, veryFast: 8000, fast: 12000, normal: 16000 },
  { level: 18, veryFast: 9500, fast: 14250, normal: 19000 },
  { level: 19, veryFast: 11000, fast: 16500, normal: 22000 },
  { level: 20, veryFast: 13000, fast: 19500, normal: 26000 },
  { level: 21, veryFast: 15000, fast: 22500, normal: 30000 },
  { level: 22, veryFast: 17000, fast: 25500, normal: 34000 },
]

const WIZARD_PALETTE: Record<string, string> = {
  P: '#6844FC',
  D: '#24188C',
  K: '#000000',
  Y: '#FCD8A8',
  S: '#FCB8A0',
  W: '#AC7C00',
  O: '#F83800',
}

const WIZARD_PIXELS = [
  '.....PP......OO.',
  '....PPPP.....OO.',
  '...PPPPPP.....W.',
  '...PKKKKP.....W.',
  '..PPKYKYKP....W.',
  '..PPKKKKKP....W.',
  '..DPPKKKPPD...W.',
  '.DPPPPPPPPPD.SW.',
  '.DPPPPPPPPPPSSW.',
  'DPPPPPPPPPPPD.W.',
  'DPPPDPPPPDPPD.W.',
  'DPPPDPPPPDPPPDW.',
  'DPPPDPPPPDPPPDW.',
  'DPPPDPPPPDPPPDW.',
  'DDPPPPPPPPPPPDW.',
  '.DDDDDDDDDDDDDW.',
]

function WizardSprite({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" shapeRendering="crispEdges" aria-hidden="true" className={className}>
      {WIZARD_PIXELS.flatMap((row, y) =>
        row.split('').map((cell, x) =>
          WIZARD_PALETTE[cell] ? (
            <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={WIZARD_PALETTE[cell]} />
          ) : null,
        ),
      )}
    </svg>
  )
}

function ExperienceWindow({ onClose }: { onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true })
  }, [])

  const trackerRoot = document.querySelector('[data-tracker-root]')
  if (!trackerRoot) return null

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="exp-table-title"
      className="absolute inset-0 z-50"
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="dw-window absolute top-1/2 right-1.5 bottom-1.5 left-1/2 flex flex-col gap-2 p-2.5">
        <div className="flex items-center justify-between gap-4">
          <h2 id="exp-table-title" className="font-display text-[10px] text-primary">
            Experience Levels
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
        <div className="min-h-0 overflow-y-auto">
          <table className="w-full border-collapse font-display text-[9px] leading-none">
            <thead className="sticky top-0 bg-background">
              <tr className="border-b border-border text-muted-foreground">
                <th scope="col" className="py-1.5 pr-2 text-left font-normal">Level</th>
                <th scope="col" className="py-1.5 pl-2 text-right font-normal text-primary">V. Fast</th>
                <th scope="col" className="py-1.5 pl-2 text-right font-normal">Fast</th>
                <th scope="col" className="py-1.5 pl-2 text-right font-normal">Normal</th>
              </tr>
            </thead>
            <tbody>
              {EXP_LEVELS.map((row) => (
                <tr key={row.level} className="border-b border-border/40 last:border-b-0">
                  <th scope="row" className="py-1 pr-2 text-left font-normal text-foreground">{row.level}</th>
                  <td className="py-1 pl-2 text-right tabular-nums text-primary">{row.veryFast}</td>
                  <td className="py-1 pl-2 text-right tabular-nums text-foreground">{row.fast}</td>
                  <td className="py-1 pl-2 text-right tabular-nums text-foreground">{row.normal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>,
    trackerRoot,
  )
}

export function ExperienceWizard() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        aria-label="Show experience level table"
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
        className="shrink-0 rounded-sm p-0.5 transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-primary"
      >
        <WizardSprite className="size-8" />
      </button>
      {open && <ExperienceWindow onClose={() => setOpen(false)} />}
    </>
  )
}
