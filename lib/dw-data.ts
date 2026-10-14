export const MAP_SIZE = 120

export interface Terrain {
  id: number
  name: string
  color: string
  key: string
}

export const TERRAINS: Terrain[] = [
  { id: 0, name: 'Unexplored', color: '#000000', key: '0' },
  { id: 1, name: 'Water', color: '#0058F8', key: '1' },
  { id: 2, name: 'Grass', color: '#58D854', key: '2' },
  { id: 3, name: 'Forest', color: '#00A800', key: '3' },
  { id: 4, name: 'Hills', color: '#B8F818', key: '4' },
  { id: 5, name: 'Mountain', color: '#7C7C7C', key: '5' },
  { id: 6, name: 'Desert', color: '#FCE0A8', key: '6' },
  { id: 7, name: 'Swamp', color: '#6844FC', key: '7' },
  { id: 8, name: 'Bridge', color: '#AC7C00', key: '8' },
]

export const TERRAIN_RGB: [number, number, number][] = TERRAINS.map((t) => {
  const n = Number.parseInt(t.color.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
})

export type LocationKind = 'castle' | 'town' | 'cave' | 'shrine' | 'special'

export const KIND_META: Record<LocationKind, { label: string; color: string }> = {
  castle: { label: 'Castles', color: '#F8B800' },
  town: { label: 'Towns', color: '#FCFCFC' },
  cave: { label: 'Caves & Dungeons', color: '#FCA044' },
  shrine: { label: 'Shrines', color: '#3CBCFC' },
  special: { label: 'Special Spots', color: '#F878F8' },
}

export const SPLIT_COLORS: Record<string, [string, string]> = {
  'unknown-cave': ['#FCA044', '#3CBCFC'],
}

export const CHARLOCK_LOCKED_COLOR = '#FF2020'
export const CHARLOCK_OPEN_COLOR = '#30F030'

export function locationColor(location: { id: string; kind: LocationKind }, items: Record<string, boolean>) {
  if (location.id === 'charlock') return items['rainbow-drop'] ? CHARLOCK_OPEN_COLOR : CHARLOCK_LOCKED_COLOR
  return KIND_META[location.kind].color
}

export function badgeBackground(locationId: string, fallback: string) {
  const split = SPLIT_COLORS[locationId]
  return split ? `linear-gradient(90deg, ${split[0]} 50%, ${split[1]} 50%)` : fallback
}

export const PIN_COLOR = '#F87858'

export interface DWLocation {
  id: string
  name: string
  abbr: string
  kind: LocationKind
  hint: string
  unknown?: boolean
}

export const LOCATIONS: DWLocation[] = [
  { id: 'tantegel', name: 'Tantegel', abbr: 'T', kind: 'castle', hint: 'Starting castle. Stones of Sunlight in the basement.' },
  { id: 'charlock', name: 'Charlock', abbr: 'C', kind: 'castle', hint: "The Dragonlord's castle. Needs the Rainbow Bridge." },
  { id: 'brecconary', name: 'Brecconary', abbr: 'B', kind: 'town', hint: 'Town with inn, weapon & item shops.' },
  { id: 'garinham', name: 'Garinham', abbr: 'G', kind: 'town', hint: 'Leads to the Grave via the town.' },
  { id: 'kol', name: 'Kol', abbr: 'K', kind: 'town', hint: 'Search spot (vanilla Fairy Flute).' },
  { id: 'rimuldar', name: 'Rimuldar', abbr: 'R', kind: 'town', hint: 'Sells Magic Keys.' },
  { id: 'cantlin', name: 'Cantlin', abbr: 'C', kind: 'town', hint: 'Walled town guarded by a Golem.' },
  { id: 'hauksness', name: 'Hauksness', abbr: 'H', kind: 'town', hint: "Ruined town. Search spot (vanilla Erdrick's Armor)." },
  { id: 'erdricks-cave', name: "Erdrick's", abbr: 'EC', kind: 'cave', hint: "Erdrick's tablet." },
  { id: 'garins-grave', name: 'Grave', abbr: 'GG', kind: 'cave', hint: 'Treasure chests deep inside.' },
  { id: 'mountain-cave', name: 'Mountain', abbr: 'MC', kind: 'cave', hint: 'Two floors of chests.' },
  { id: 'swamp-north', name: 'Swamp (N)', abbr: 'SN', kind: 'cave', hint: 'North entrance. Green Dragon & Gwaelin.' },
  { id: 'swamp-south', name: 'Swamp (S)', abbr: 'SS', kind: 'cave', hint: 'South entrance of the Swamp Cave.' },
  { id: 'staff-shrine', name: 'Staff', abbr: 'SR', kind: 'shrine', hint: 'Requires the Silver Harp.' },
  { id: 'rainbow-shrine', name: 'Rainbow', abbr: 'RD', kind: 'shrine', hint: "Requires Staff, Stones & Token." },
  { id: 'freebie-cave', name: 'Freebie', abbr: 'FC', kind: 'shrine', hint: 'Freebie cave.' },
  { id: 'unknown-town', name: 'Town', abbr: '?', kind: 'town', hint: 'Unidentified town.', unknown: true },
  { id: 'unknown-cave', name: 'Cave', abbr: '?', kind: 'cave', hint: 'Unidentified cave.', unknown: true },
]

export const LOCATION_BY_ID = Object.fromEntries(LOCATIONS.map((l) => [l.id, l])) as Record<string, DWLocation>

export const STAIR_CAVE_IDS = [
  'erdricks-cave',
  'garins-grave',
  'mountain-cave',
  'swamp-north',
  'swamp-south',
  'staff-shrine',
  'rainbow-shrine',
  'freebie-cave',
] as const

const TOWNS_WITHOUT_SHOPS = new Set(['hauksness'])

export function hasEquipmentShop(locationId: string | null) {
  return !!locationId && LOCATION_BY_ID[locationId]?.kind === 'town' && !TOWNS_WITHOUT_SHOPS.has(locationId)
}

export const SHOP_GEAR: { label: string; items: { id: string; name: string; price: number }[] }[] = [
  {
    label: 'Weapons',
    items: [
      { id: 'bamboo-pole', name: 'Bamboo Pole', price: 10 },
      { id: 'club', name: 'Club', price: 60 },
      { id: 'copper-sword', name: 'Copper Sword', price: 180 },
      { id: 'hand-axe', name: 'Hand Axe', price: 560 },
      { id: 'broad-sword', name: 'Broad Sword', price: 1500 },
      { id: 'flame-sword', name: 'Flame Sword', price: 9800 },
    ],
  },
  {
    label: 'Armor',
    items: [
      { id: 'clothes', name: 'Clothes', price: 20 },
      { id: 'leather-armor', name: 'Leather Armor', price: 70 },
      { id: 'chain-mail', name: 'Chain Mail', price: 300 },
      { id: 'half-plate', name: 'Half Plate', price: 1000 },
      { id: 'full-plate', name: 'Full Plate', price: 3000 },
      { id: 'magic-armor', name: 'Magic Armor', price: 7700 },
    ],
  },
  {
    label: 'Shields',
    items: [
      { id: 'small-shield', name: 'Small Shield', price: 90 },
      { id: 'large-shield', name: 'Large Shield', price: 800 },
      { id: 'silver-shield', name: 'Silver Shield', price: 14800 },
    ],
  },
]

export type EquipmentSlotId = 'weapon' | 'armor' | 'shield'

export function shopUpgrades(
  stock: Record<string, boolean> | undefined,
  equipped: Partial<Record<EquipmentSlotId, string>>,
) {
  if (!stock) return []
  return EQUIPMENT_SLOTS.flatMap((slot) => {
    const options = slot.options.map((o) => o.id)
    const currentRank = equipped[slot.id] ? options.indexOf(equipped[slot.id] as string) : -1
    return SHOP_GEAR.flatMap((group) => group.items).filter(
      (item) => stock[item.id] && options.indexOf(item.id) > currentRank,
    )
  })
}

export const EQUIPMENT_SLOTS: { id: EquipmentSlotId; label: string; options: { id: string; name: string }[] }[] = [
  {
    id: 'weapon',
    label: 'Sword',
    options: [...SHOP_GEAR[0].items, { id: 'erdricks-sword', name: "Erdrick's Sword" }],
  },
  {
    id: 'armor',
    label: 'Armor',
    options: [...SHOP_GEAR[1].items, { id: 'erdricks-armor', name: "Erdrick's Armor" }],
  },
  {
    id: 'shield',
    label: 'Shield',
    options: SHOP_GEAR[2].items,
  },
]

export interface ItemDef {
  id: string
  name: string
  wide?: boolean
}

export const ITEM_GROUPS: { label: string; items: ItemDef[] }[] = [
  {
    label: 'Quest Items',
    items: [
      { id: 'silver-harp', name: 'Harp' },
      { id: 'staff-of-rain', name: 'Staff' },
      { id: 'stones-of-sunlight', name: 'Stones' },
      { id: 'erdricks-token', name: 'Token' },
    ],
  },
  {
    label: 'Accessories',
    items: [
      { id: 'death-necklace', name: 'D Neck' },
      { id: 'fairy-flute', name: 'Flute' },
      { id: 'rainbow-drop', name: 'Rainbow Drop', wide: true },
    ],
  },
  {
    label: "Erdrick's Gear",
    items: [
      { id: 'erdricks-sword', name: 'Sword' },
      { id: 'erdricks-armor', name: 'Armor' },
    ],
  },
  {
    label: 'Reserved',
    items: [],
  },
]

export const SPELLS = [
  'Heal',
  'Hurt',
  'Sleep',
  'Radiant',
  'Stopspell',
  'Outside',
  'Return',
  'Repel',
  'Healmore',
  'Hurtmore',
] as const

export interface LocationExtra {
  id: string
  sprite: 'chest' | 'stairs' | 'key'
  label: string
  side?: 'left'
  price?: string
  }
  
  function keyShop(locationId: string, name: string, price: string): LocationExtra {
  return { id: `${locationId}-key`, sprite: 'key', label: `${name} magic key`, side: 'left', price }
}

function chests(locationId: string, name: string, count: number): LocationExtra[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${locationId}-chest-${i + 1}`,
    sprite: 'chest' as const,
    label: count > 1 ? `${name} chest ${i + 1}` : `${name} chest`,
  }))
}

export const LOCATION_EXTRAS: Record<string, LocationExtra[]> = {
  tantegel: [
    ...chests('tantegel', 'Tantegel', 4),
    { id: 'tantegel-stairs', sprite: 'stairs', label: 'Tantegel basement stairs' },
    keyShop('tantegel', 'Tantegel', '85g'),
  ],
  garinham: [...chests('garinham', 'Garinham', 3), { id: 'garinham-stairs', sprite: 'stairs', label: 'Garinham stairs' }],
  hauksness: chests('hauksness', 'Hauksness', 1),
  kol: chests('kol', 'Kol', 1),
  'erdricks-cave': chests('erdricks-cave', "Erdrick's Cave", 1),
  'garins-grave': chests('garins-grave', 'Grave', 5),
  'mountain-cave': chests('mountain-cave', 'Mountain Cave', 5),
  'freebie-cave': chests('freebie-cave', 'Freebie Cave', 1),
  rimuldar: [...chests('rimuldar', 'Rimuldar', 1), keyShop('rimuldar', 'Rimuldar', '53g')],
  cantlin: [keyShop('cantlin', 'Cantlin', '98g')],
}
