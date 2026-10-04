'use client'

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'
import { LOCATION_BY_ID, MAP_SIZE, TERRAINS } from '@/lib/dw-data'

export type Tool = 'paint' | 'fill' | 'marker' | 'pan'

export interface Marker {
  id: string
  x: number
  y: number
  locationId: string | null
  label: string
}

export interface SpellState {
  learned: boolean
  level: string
}

export const NS_DIRECTIONS = ['N', 'S'] as const
export const EW_DIRECTIONS = ['E', 'W'] as const
export type NSDirection = (typeof NS_DIRECTIONS)[number] | ''
export type EWDirection = (typeof EW_DIRECTIONS)[number] | ''

export interface ManualCoords {
  first: string
  firstDir: NSDirection
  second: string
  secondDir: EWDirection
}

export const EMPTY_COORDS: ManualCoords = { first: '', firstDir: '', second: '', secondDir: '' }

function pickDirection<T extends string>(value: unknown, allowed: readonly T[]): T | '' {
  return typeof value === 'string' && (allowed as readonly string[]).includes(value) ? (value as T) : ''
}

function sanitizeCoords(raw: unknown): Record<string, ManualCoords> {
  if (!raw || typeof raw !== 'object') return {}
  const result: Record<string, ManualCoords> = {}
  for (const [id, value] of Object.entries(raw as Record<string, Partial<ManualCoords>>)) {
    if (!LOCATION_BY_ID[id] || !value) continue
    result[id] = {
      first: String(value.first ?? '').slice(0, 4),
      firstDir: pickDirection(value.firstDir, NS_DIRECTIONS),
      second: String(value.second ?? '').slice(0, 4),
      secondDir: pickDirection(value.secondDir, EW_DIRECTIONS),
    }
  }
  return result
}

interface Snapshot {
  tiles: Uint8Array
  markers: Marker[]
}

export interface SaveFile {
  version: 1
  seed: string
  tiles: string
  markers: Marker[]
  visited: Record<string, boolean>
  items: Record<string, boolean>
  spells: Record<string, SpellState>
  notes: string
  coords?: Record<string, ManualCoords>
}

const HISTORY_LIMIT = 100
export const MIN_ZOOM = 3
export const MAX_ZOOM = 20
export const BRUSH_SIZES = [1, 3, 5, 9] as const

function emptyTiles() {
  return new Uint8Array(MAP_SIZE * MAP_SIZE)
}

function inBounds(x: number, y: number) {
  return x >= 0 && y >= 0 && x < MAP_SIZE && y < MAP_SIZE
}

function stamp(tiles: Uint8Array, cx: number, cy: number, size: number, value: number) {
  const r = Math.floor(size / 2)
  for (let y = cy - r; y <= cy + r; y++) {
    for (let x = cx - r; x <= cx + r; x++) {
      if (inBounds(x, y)) tiles[y * MAP_SIZE + x] = value
    }
  }
}

function walkLine(x0: number, y0: number, x1: number, y1: number, visit: (x: number, y: number) => void) {
  const dx = Math.abs(x1 - x0)
  const dy = -Math.abs(y1 - y0)
  const sx = x0 < x1 ? 1 : -1
  const sy = y0 < y1 ? 1 : -1
  let err = dx + dy
  let x = x0
  let y = y0
  while (true) {
    visit(x, y)
    if (x === x1 && y === y1) break
    const e2 = 2 * err
    if (e2 >= dy) {
      err += dy
      x += sx
    }
    if (e2 <= dx) {
      err += dx
      y += sy
    }
  }
}

function floodFill(tiles: Uint8Array, sx: number, sy: number, value: number) {
  const target = tiles[sy * MAP_SIZE + sx]
  if (target === value) return false
  const stack = [sy * MAP_SIZE + sx]
  while (stack.length) {
    const idx = stack.pop() as number
    if (tiles[idx] !== target) continue
    tiles[idx] = value
    const x = idx % MAP_SIZE
    const y = (idx - x) / MAP_SIZE
    if (x > 0) stack.push(idx - 1)
    if (x < MAP_SIZE - 1) stack.push(idx + 1)
    if (y > 0) stack.push(idx - MAP_SIZE)
    if (y < MAP_SIZE - 1) stack.push(idx + MAP_SIZE)
  }
  return true
}

let markerCounter = 0
function newMarkerId() {
  markerCounter += 1
  return `m-${Date.now().toString(36)}-${markerCounter}`
}

interface TrackerContextValue {
  tiles: Uint8Array
  markers: Marker[]
  visited: Record<string, boolean>
  items: Record<string, boolean>
  spells: Record<string, SpellState>
  notes: string
  coords: Record<string, ManualCoords>
  seed: string
  tool: Tool
  terrain: number
  brushSize: number
  zoom: number
  showGrid: boolean
  selectedLocation: string | null
  pinLabel: string
  canUndo: boolean
  focusRequest: { x: number; y: number; nonce: number } | null

  setTool: (tool: Tool) => void
  setTerrain: (terrain: number) => void
  setBrushSize: (size: number) => void
  setZoom: (zoom: number) => void
  setShowGrid: (show: boolean) => void
  setSelectedLocation: (id: string | null) => void
  setPinLabel: (label: string) => void
  setNotes: (notes: string) => void
  setSeed: (seed: string) => void
  toggleItem: (id: string) => void
  toggleVisited: (id: string) => void
  updateSpell: (name: string, patch: Partial<SpellState>) => void
  clearSpells: () => void
  updateCoords: (locationId: string, patch: Partial<ManualCoords>) => void

  beginStroke: () => void
  paintLine: (x0: number, y0: number, x1: number, y1: number) => void
  fillAt: (x: number, y: number) => void
  placeMarker: (x: number, y: number) => void
  removeMarker: (id: string) => void
  removeMarkerAt: (x: number, y: number) => boolean
  undo: () => void
  reset: () => void
  requestFocus: (x: number, y: number) => void
  exportSave: () => SaveFile
  importSave: (data: unknown) => void
}

const TrackerContext = createContext<TrackerContextValue | null>(null)

export function TrackerProvider({ children }: { children: ReactNode }) {
  const [tiles, setTilesState] = useState<Uint8Array>(emptyTiles)
  const [markers, setMarkersState] = useState<Marker[]>([])
  const [visited, setVisited] = useState<Record<string, boolean>>({})
  const [items, setItems] = useState<Record<string, boolean>>({})
  const [spells, setSpells] = useState<Record<string, SpellState>>({})
  const [notes, setNotes] = useState('')
  const [coords, setCoords] = useState<Record<string, ManualCoords>>({})
  const [seed, setSeed] = useState('')
  const [tool, setTool] = useState<Tool>('paint')
  const [terrain, setTerrain] = useState(2)
  const [brushSize, setBrushSize] = useState(1)
  const [zoom, setZoomState] = useState(6)
  const [showGrid, setShowGrid] = useState(true)
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [pinLabel, setPinLabel] = useState('')
  const [historyLength, setHistoryLength] = useState(0)
  const [focusRequest, setFocusRequest] = useState<TrackerContextValue['focusRequest']>(null)

  const tilesRef = useRef(tiles)
  const markersRef = useRef(markers)
  const historyRef = useRef<Snapshot[]>([])

  const commitTiles = useCallback((next: Uint8Array) => {
    tilesRef.current = next
    setTilesState(next)
  }, [])

  const commitMarkers = useCallback((next: Marker[]) => {
    markersRef.current = next
    setMarkersState(next)
  }, [])

  const beginStroke = useCallback(() => {
    historyRef.current.push({ tiles: tilesRef.current, markers: markersRef.current })
    if (historyRef.current.length > HISTORY_LIMIT) historyRef.current.shift()
    setHistoryLength(historyRef.current.length)
  }, [])

  const undo = useCallback(() => {
    const snapshot = historyRef.current.pop()
    if (!snapshot) return
    commitTiles(snapshot.tiles)
    commitMarkers(snapshot.markers)
    setHistoryLength(historyRef.current.length)
  }, [commitTiles, commitMarkers])

  const paintLine = useCallback(
    (x0: number, y0: number, x1: number, y1: number) => {
      const next = new Uint8Array(tilesRef.current)
      walkLine(x0, y0, x1, y1, (x, y) => stamp(next, x, y, brushSize, terrain))
      commitTiles(next)
    },
    [brushSize, terrain, commitTiles],
  )

  const fillAt = useCallback(
    (x: number, y: number) => {
      if (!inBounds(x, y)) return
      const next = new Uint8Array(tilesRef.current)
      if (floodFill(next, x, y, terrain)) commitTiles(next)
    },
    [terrain, commitTiles],
  )

  const placeMarker = useCallback(
    (x: number, y: number) => {
      if (!inBounds(x, y)) return
      beginStroke()
      if (selectedLocation) {
        const location = LOCATION_BY_ID[selectedLocation]
        const others = markersRef.current.filter((m) => m.locationId !== selectedLocation)
        commitMarkers([...others, { id: newMarkerId(), x, y, locationId: selectedLocation, label: location?.name ?? '' }])
        setSelectedLocation(null)
      } else {
        const label = pinLabel.trim() || 'Pin'
        commitMarkers([...markersRef.current, { id: newMarkerId(), x, y, locationId: null, label }])
      }
    },
    [beginStroke, commitMarkers, pinLabel, selectedLocation],
  )

  const removeMarker = useCallback(
    (id: string) => {
      beginStroke()
      commitMarkers(markersRef.current.filter((m) => m.id !== id))
    },
    [beginStroke, commitMarkers],
  )

  const removeMarkerAt = useCallback(
    (x: number, y: number) => {
      const target = [...markersRef.current].reverse().find((m) => m.x === x && m.y === y)
      if (!target) return false
      removeMarker(target.id)
      return true
    },
    [removeMarker],
  )

  const setZoom = useCallback((value: number) => {
    setZoomState(Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.round(value))))
  }, [])

  const toggleItem = useCallback((id: string) => setItems((prev) => ({ ...prev, [id]: !prev[id] })), [])
  const toggleVisited = useCallback((id: string) => setVisited((prev) => ({ ...prev, [id]: !prev[id] })), [])
  const updateSpell = useCallback((name: string, patch: Partial<SpellState>) => {
    setSpells((prev) => ({ ...prev, [name]: { ...(prev[name] ?? { learned: false, level: '' }), ...patch } }))
  }, [])
  const clearSpells = useCallback(() => setSpells({}), [])
  const updateCoords = useCallback((locationId: string, patch: Partial<ManualCoords>) => {
    setCoords((prev) => ({ ...prev, [locationId]: { ...(prev[locationId] ?? EMPTY_COORDS), ...patch } }))
  }, [])

  const requestFocus = useCallback((x: number, y: number) => {
    setFocusRequest({ x, y, nonce: Date.now() })
  }, [])

  const reset = useCallback(() => {
    historyRef.current = []
    setHistoryLength(0)
    commitTiles(emptyTiles())
    commitMarkers([])
    setVisited({})
    setItems({})
    setSpells({})
    setNotes('')
    setCoords({})
    setSeed('')
    setSelectedLocation(null)
  }, [commitTiles, commitMarkers])

  const exportSave = useCallback(
    (): SaveFile => ({
      version: 1,
      seed,
      tiles: Array.from(tilesRef.current).join(''),
      markers: markersRef.current,
      visited,
      items,
      spells,
      notes,
      coords,
    }),
    [seed, visited, items, spells, notes, coords],
  )

  const importSave = useCallback(
    (data: unknown) => {
      const save = data as Partial<SaveFile>
      if (!save || save.version !== 1 || typeof save.tiles !== 'string' || save.tiles.length !== MAP_SIZE * MAP_SIZE) {
        throw new Error('This file is not a valid tracker save.')
      }
      const maxTerrain = TERRAINS.length - 1
      const nextTiles = emptyTiles()
      for (let i = 0; i < nextTiles.length; i++) {
        const v = save.tiles.charCodeAt(i) - 48
        nextTiles[i] = v >= 0 && v <= maxTerrain ? v : 0
      }
      const nextMarkers = (Array.isArray(save.markers) ? save.markers : [])
        .filter((m) => m && Number.isInteger(m.x) && Number.isInteger(m.y) && inBounds(m.x, m.y))
        .map((m) => ({
          id: newMarkerId(),
          x: m.x,
          y: m.y,
          locationId: typeof m.locationId === 'string' && LOCATION_BY_ID[m.locationId] ? m.locationId : null,
          label: String(m.label ?? '').slice(0, 60),
        }))
      historyRef.current = []
      setHistoryLength(0)
      commitTiles(nextTiles)
      commitMarkers(nextMarkers)
      setVisited(save.visited ?? {})
      setItems(save.items ?? {})
      setSpells(save.spells ?? {})
      setNotes(String(save.notes ?? ''))
      setCoords(sanitizeCoords(save.coords))
      setSeed(String(save.seed ?? ''))
    },
    [commitTiles, commitMarkers],
  )

  const value = useMemo<TrackerContextValue>(
    () => ({
      tiles,
      markers,
      visited,
      items,
      spells,
      notes,
      coords,
      seed,
      tool,
      terrain,
      brushSize,
      zoom,
      showGrid,
      selectedLocation,
      pinLabel,
      canUndo: historyLength > 0,
      focusRequest,
      setTool,
      setTerrain,
      setBrushSize,
      setZoom,
      setShowGrid,
      setSelectedLocation,
      setPinLabel,
      setNotes,
      setSeed,
      toggleItem,
      toggleVisited,
      updateSpell,
      clearSpells,
      updateCoords,
      beginStroke,
      paintLine,
      fillAt,
      placeMarker,
      removeMarker,
      removeMarkerAt,
      undo,
      reset,
      requestFocus,
      exportSave,
      importSave,
    }),
    [
      tiles,
      markers,
      visited,
      items,
      spells,
      notes,
      coords,
      seed,
      tool,
      terrain,
      brushSize,
      zoom,
      showGrid,
      selectedLocation,
      pinLabel,
      historyLength,
      focusRequest,
      setZoom,
      toggleItem,
      toggleVisited,
      updateSpell,
      clearSpells,
      updateCoords,
      beginStroke,
      paintLine,
      fillAt,
      placeMarker,
      removeMarker,
      removeMarkerAt,
      undo,
      reset,
      requestFocus,
      exportSave,
      importSave,
    ],
  )

  return <TrackerContext.Provider value={value}>{children}</TrackerContext.Provider>
}

export function useTracker() {
  const ctx = useContext(TrackerContext)
  if (!ctx) throw new Error('useTracker must be used inside TrackerProvider')
  return ctx
}
