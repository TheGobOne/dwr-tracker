'use client'

import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'
import { SHOP_GEAR } from '@/lib/dw-data'
import { useTracker } from './tracker-context'

export interface ShopTown {
  key: string
  name: string
}

export function ShopWindow({ town, onClose }: { town: ShopTown | null; onClose: () => void }) {
  const { shopStock, toggleShopItem } = useTracker()
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (town) closeRef.current?.focus({ preventScroll: true })
  }, [town])

  if (!town) return null
  const trackerRoot = document.querySelector('[data-tracker-root]')
  if (!trackerRoot) return null
  const stock = shopStock[town.key] ?? {}

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="shop-window-title"
      className="absolute inset-0 z-50"
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose()
      }}
    >
      <div className="dw-window absolute top-1.5 left-1.5 flex w-max max-w-[calc(100%-0.75rem)] max-h-[calc(100%-0.75rem)] flex-col gap-2.5 p-2.5 font-display text-[9px] leading-none">
        <div className="flex items-center justify-between gap-4">
          <h2 id="shop-window-title" className="whitespace-nowrap text-[10px] text-primary">
            {town.name} Shop
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="text-[10px] text-foreground hover:text-primary focus-visible:outline-2 focus-visible:outline-primary"
          >
            CLOSE
          </button>
        </div>
        <div className="grid min-h-0 grid-cols-3 gap-2 overflow-y-auto">
          {SHOP_GEAR.map((group) => (
            <fieldset key={group.label} className="flex min-w-max flex-col gap-1">
              <legend className="mb-1 text-muted-foreground">{group.label}</legend>
              {group.items.map((item) => {
                const on = !!stock[item.id]
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggleShopItem(town.key, item.id)}
                    className={cn(
                      'flex w-full items-center justify-between gap-2 whitespace-nowrap rounded-sm border px-1 py-1 text-left text-[9px] transition-colors focus-visible:outline-2 focus-visible:outline-primary',
                      on
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-foreground/25 text-muted-foreground hover:border-foreground hover:text-foreground',
                    )}
                  >
                    <span>{item.name}</span>
                    <span className="tabular-nums opacity-80">{item.price}g</span>
                  </button>
                )
              })}
            </fieldset>
          ))}
        </div>
      </div>
    </div>,
    trackerRoot,
  )
}
