'use client'

import { Shield, Shirt, Sword, type LucideIcon } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { EQUIPMENT_SLOTS, type EquipmentSlotId } from '@/lib/dw-data'
import { useTracker } from './tracker-context'

const SLOT_ICONS: Record<EquipmentSlotId, LucideIcon> = {
  weapon: Sword,
  armor: Shirt,
  shield: Shield,
}

const NONE = 'none'
const itemClass = 'font-display text-[9px] uppercase tracking-wider'

function toInitials(name: string) {
  if (name.toLowerCase() === 'small shield') return 'sS'
  return name
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((word) => word[0].toUpperCase())
    .join('')
}

export function EquipmentPanels() {
  const { equipment, setEquipped } = useTracker()

  return (
    <div role="group" aria-label="Equipped gear" className="flex gap-1">
      {EQUIPMENT_SLOTS.map((slot) => {
        const Icon = SLOT_ICONS[slot.id]
        const equippedId = equipment[slot.id]
        const equippedName = slot.options.find((o) => o.id === equippedId)?.name
        return (
          <div key={slot.id} className="flex w-8 flex-col items-center gap-0.5">
          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label={`${slot.label}: ${equippedName ?? 'nothing equipped'}`}
              title={equippedName ?? `No ${slot.label.toLowerCase()}`}
              className={`flex size-8 items-center justify-center rounded-sm border bg-black/60 outline-none transition-colors hover:border-primary focus-visible:ring-2 focus-visible:ring-primary ${
                equippedName ? 'border-[#F8D878] text-[#F8D878]' : 'border-muted-foreground/40 text-muted-foreground'
              }`}
            >
              <Icon className="size-4" aria-hidden="true" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              collisionBoundary={
                typeof document === 'undefined'
                  ? undefined
                  : (document.querySelector('[data-tracker-root]') ?? undefined)
              }
              collisionPadding={6}
            >
              <DropdownMenuRadioGroup
                value={equippedId ?? NONE}
                onValueChange={(value) => setEquipped(slot.id, value === NONE ? null : value)}
              >
                <DropdownMenuLabel className={`${itemClass} text-muted-foreground`}>{slot.label}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioItem value={NONE} className={itemClass} closeOnClick>
                  None
                </DropdownMenuRadioItem>
                {slot.options.map((option) => (
                  <DropdownMenuRadioItem key={option.id} value={option.id} className={itemClass} closeOnClick>
                    {option.name}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          {equippedName && (
            <span aria-hidden="true" className="font-display text-[8px] leading-none tracking-wider text-[#F8D878]">
              {equippedName.toLowerCase() === 'small shield' ? (
                <>
                  <span className="text-[5px]">s</span>S
                </>
              ) : (
                toInitials(equippedName)
              )}
            </span>
          )}
          </div>
        )
      })}
    </div>
  )
}
