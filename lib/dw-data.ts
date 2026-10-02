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
  cave: { label: 'Caves & Dungeons', color: '#F87858' },
  shrine: { label: 'Shrines', color: '#3CBCFC' },
  special: { label: 'Special Spots', color: '#F878F8' },
}

export const PIN_COLOR = '#FCA044'

export interface DWLocation {
  id: string
  name: string
  abbr: string
  kind: LocationKind
  hint: string
}

export const LOCATIONS: DWLocation[] = [
  { id: 'tantegel', name: 'Tantegel', abbr: 'TC', kind: 'castle', hint: 'Starting castle. Stones of Sunlight in the basement.' },
  { id: 'charlock', name: 'Charlock', abbr: 'DL', kind: 'castle', hint: "The Dragonlord's castle. Needs the Rainbow Bridge." },
  { id: 'brecconary', name: 'Brecconary', abbr: 'Br', kind: 'town', hint: 'Town with inn, weapon & item shops.' },
  { id: 'garinham', name: 'Garinham', abbr: 'Ga', kind: 'town', hint: 'Leads to the Grave via the town.' },
  { id: 'kol', name: 'Kol', abbr: 'Ko', kind: 'town', hint: 'Search spot (vanilla Fairy Flute).' },
  { id: 'rimuldar', name: 'Rimuldar', abbr: 'Ri', kind: 'town', hint: 'Sells Magic Keys.' },
  { id: 'cantlin', name: 'Cantlin', abbr: 'Ca', kind: 'town', hint: 'Walled town guarded by a Golem.' },
  { id: 'hauksness', name: 'Hauksness', abbr: 'Ha', kind: 'town', hint: "Ruined town. Search spot (vanilla Erdrick's Armor)." },
  { id: 'erdricks-cave', name: "Erdrick's", abbr: 'EC', kind: 'cave', hint: "Erdrick's tablet." },
  { id: 'garins-grave', name: 'Grave', abbr: 'GG', kind: 'cave', hint: 'Treasure chests deep inside.' },
  { id: 'mountain-cave', name: 'Mountain', abbr: 'MC', kind: 'cave', hint: 'Two floors of chests.' },
  { id: 'swamp-north', name: 'Swamp (N)', abbr: 'SN', kind: 'cave', hint: 'North entrance. Green Dragon & Gwaelin.' },
  { id: 'swamp-south', name: 'Swamp (S)', abbr: 'SS', kind: 'cave', hint: 'South entrance of the Swamp Cave.' },
  { id: 'staff-shrine', name: 'Staff', abbr: 'SR', kind: 'shrine', hint: 'Requires the Silver Harp.' },
  { id: 'rainbow-shrine', name: 'Jerk', abbr: 'JC', kind: 'shrine', hint: "Requires Staff, Stones & Erdrick's Token." },
]

export const LOCATION_BY_ID = Object.fromEntries(LOCATIONS.map((l) => [l.id, l])) as Record<string, DWLocation>

export interface ItemDef {
  id: string
  name: string
}

export const ITEM_GROUPS: { label: string; items: ItemDef[] }[] = [
  {
    label: 'Quest Items',
    items: [
      { id: 'silver-harp', name: 'Silver Harp' },
      { id: 'staff-of-rain', name: 'Staff of Rain' },
      { id: 'stones-of-sunlight', name: 'Stones of Sunlight' },
      { id: 'erdricks-token', name: "Erdrick's Token" },
    ],
  },
  {
    label: "Erdrick's Gear",
    items: [
      { id: 'erdricks-sword', name: "Erdrick's Sword" },
      { id: 'erdricks-armor', name: "Erdrick's Armor" },
    ],
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
