'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CAVE_MAPS, CaveMapViewer } from './cave-map-viewer'
import { ExperienceWizard } from './experience-table'
import { EquipmentPanels } from './equipment-panels'
import { DragonlordSimButton } from './dragonlord-sim'
import { cn } from '@/lib/utils'
import { ShopWindow, type ShopTown } from './shop-window'
import { TownUpgradeArrows } from './town-upgrade-arrows'
import { StairLinkMenu, type StairMenuAnchor } from './stair-link-menu'
import {
  KIND_META,
  LOCATION_BY_ID,
  LOCATION_EXTRAS,
  MAP_SIZE,
  PIN_COLOR,
  SPLIT_COLORS,
  TERRAIN_RGB,
  hasEquipmentShop,
  locationColor,
} from '@/lib/dw-data'
import { useTracker, type DrawingStroke, type ManualCoords, type Marker } from './tracker-context'
import { PEN_COLORS, PEN_SIZE_DEFAULT, PenSettings } from './pen-settings'
import { COORDS_LOCATION_ID } from './locations-panel'
import { withBase } from '@/lib/base-path'

const MAX_TRACKER_WIDTH = 640

interface Point {
  x: number
  y: number
}

function markerSize(scale: number, marker?: Marker) {
  const base = Math.max(16, Math.round(scale * 2))
  const isCharlock = marker?.locationId && LOCATION_BY_ID[marker.locationId]?.name === 'Charlock'
  return Math.round((isCharlock ? base * 2 : base * 1.33) * MARKER_SCALE)
}

const MARKER_SCALE = 0.9375

function markerColor(marker: Marker, items: Record<string, boolean>) {
  const location = marker.locationId ? LOCATION_BY_ID[marker.locationId] : null
  return location ? locationColor(location, items) : PIN_COLOR
}

const SPRITE_SRC = {
  bridge: withBase('/sprites/bridge.png'),
  chest: withBase('/sprites/chest.png'),
  stairs: withBase('/sprites/stairs.png'),
  key: withBase('/sprites/key.png'),
} as const

type SpriteName = keyof typeof SPRITE_SRC

interface ExtraIcon {
  id: string
  sprite: SpriteName
  x: number
  y: number
  size: number
  price?: string
}

function locationExtraIcons(marker: Marker, scale: number, canvasSize: number): ExtraIcon[] {
  const extras = marker.locationId ? LOCATION_EXTRAS[marker.locationId] : undefined
  if (!extras?.length) return []
  const ms = markerSize(scale, marker)
  const size = Math.max(10, Math.round(ms * 0.6))
  const gap = 2
  const cx = marker.x * scale + scale / 2
  const cy = marker.y * scale + scale / 2
  const below = extras.filter((extra) => extra.side !== 'left')
  const left = extras.filter((extra) => extra.side === 'left')
  const icons: ExtraIcon[] = []

  if (below.length) {
    const total = below.length * size + (below.length - 1) * gap
    const startX = Math.max(1, Math.min(canvasSize - total - 1, cx - total / 2))
    let y = cy + ms / 2 + 4
    if (y + size > canvasSize - 1) y = cy - ms / 2 - 4 - size
    below.forEach((extra, i) => icons.push({ id: extra.id, sprite: extra.sprite, x: startX + i * (size + gap), y, size }))
  }

  if (left.length) {
    const total = left.length * size + (left.length - 1) * gap
    let x = cx - ms / 2 - 4 - size
    if (x < 1) x = cx + ms / 2 + 4
    const startY = Math.max(1, Math.min(canvasSize - total - 1, cy - total / 2))
    left.forEach((extra, i) => icons.push({ id: extra.id, sprite: extra.sprite, x, y: startY + i * (size + gap), size, price: extra.price }))
  }

  return icons
}

interface LinkedCaveBadge {
  caveId: string
  fromX: number
  fromY: number
  x: number
  y: number
  size: number
}

function linkedCaveBadges(
  markers: Marker[],
  stairLinks: Record<string, string>,
  scale: number,
  canvasSize: number,
): LinkedCaveBadge[] {
  const badges: LinkedCaveBadge[] = []
  for (const marker of markers) {
    for (const icon of locationExtraIcons(marker, scale, canvasSize)) {
      const caveId = icon.sprite === 'stairs' ? stairLinks[icon.id] : undefined
      if (!caveId) continue
      const ms = markerSize(scale, marker)
      const badgeSize = Math.round(ms * 0.85)
      const gap = 6
      const x = Math.max(2, Math.min(canvasSize - badgeSize - 2, icon.x + icon.size / 2 - badgeSize / 2))
      let y = icon.y - gap - badgeSize
      if (y < 2) y = icon.y + icon.size + gap
      badges.push({ caveId, fromX: icon.x + icon.size / 2, fromY: icon.y + icon.size / 2, x, y, size: badgeSize })
    }
  }
  return badges
}

function linkedCaveChestIcons(badge: LinkedCaveBadge, canvasSize: number): ExtraIcon[] {
  const chests = (LOCATION_EXTRAS[badge.caveId] ?? []).filter((extra) => extra.sprite === 'chest')
  if (!chests.length) return []
  const size = Math.max(10, Math.round(badge.size * 0.7))
  const gap = 2
  const total = chests.length * size + (chests.length - 1) * gap
  let x = badge.x + badge.size + 5
  if (x + size > canvasSize - 1) x = badge.x - 5 - size
  if (x < 1) x = badge.x + badge.size + 5
  const startY = Math.max(1, Math.min(canvasSize - total - 1, badge.y + badge.size / 2 - total / 2))
  return chests.map((extra, i) => ({ id: extra.id, sprite: extra.sprite, x, y: startY + i * (size + gap), size }))
}

function markerFill(
  ctx: CanvasRenderingContext2D,
  marker: Marker,
  x: number,
  y: number,
  size: number,
  items: Record<string, boolean>,
) {
  const split = marker.locationId ? SPLIT_COLORS[marker.locationId] : undefined
  ctx.beginPath()
  ctx.roundRect(x, y, size, size, 3)
  if (!split) {
    ctx.fillStyle = markerColor(marker, items)
    ctx.fill()
    return
  }
  ctx.save()
  ctx.clip()
  ctx.fillStyle = split[0]
  ctx.fillRect(x, y, size / 2, size)
  ctx.fillStyle = split[1]
  ctx.fillRect(x + size / 2, y, size / 2, size)
  ctx.restore()
}

type MapMode = 'place' | 'pen' | 'eraser'

const ERASER_RADIUS_PX = 10

function clampShift(markers: Marker[], strokes: Point[][], dx: number, dy: number): Point {
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  for (const m of markers) {
    minX = Math.min(minX, m.x)
    minY = Math.min(minY, m.y)
    maxX = Math.max(maxX, m.x + 1)
    maxY = Math.max(maxY, m.y + 1)
  }
  for (const stroke of strokes) {
    for (const p of stroke) {
      minX = Math.min(minX, p.x)
      minY = Math.min(minY, p.y)
      maxX = Math.max(maxX, p.x)
      maxY = Math.max(maxY, p.y)
    }
  }
  if (minX === Infinity) return { x: 0, y: 0 }
  return {
    x: Math.max(Math.ceil(-minX), Math.min(Math.floor(MAP_SIZE - maxX), dx)),
    y: Math.max(Math.ceil(-minY), Math.min(Math.floor(MAP_SIZE - maxY), dy)),
  }
}

type SlideSelection = { markerIds: Set<string>; strokeIdx: Set<number> }
type Bounds = { minX: number; minY: number; maxX: number; maxY: number }

const SELECTION_PAD = 0.3

function itemBounds(markers: Marker[], strokes: Point[][], scale: number): Bounds | null {
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  for (const m of markers) {
    const half = Math.max(0.5, (markerSize(scale, m) / 2 + 2) / scale)
    minX = Math.min(minX, m.x + 0.5 - half)
    minY = Math.min(minY, m.y + 0.5 - half)
    maxX = Math.max(maxX, m.x + 0.5 + half)
    maxY = Math.max(maxY, m.y + 0.5 + half)
  }
  for (const stroke of strokes) {
    for (const p of stroke) {
      minX = Math.min(minX, p.x)
      minY = Math.min(minY, p.y)
      maxX = Math.max(maxX, p.x)
      maxY = Math.max(maxY, p.y)
    }
  }
  return minX === Infinity ? null : { minX, minY, maxX, maxY }
}

function inPaddedBounds(b: Bounds, p: Point) {
  return (
    p.x >= b.minX - SELECTION_PAD &&
    p.x <= b.maxX + SELECTION_PAD &&
    p.y >= b.minY - SELECTION_PAD &&
    p.y <= b.maxY + SELECTION_PAD
  )
}

function translateStroke(stroke: DrawingStroke, dx: number, dy: number): DrawingStroke {
  return Object.assign(
    stroke.map((p) => ({ x: p.x + dx, y: p.y + dy })),
    { color: stroke.color, size: stroke.size },
  )
}

function penCursor(color: string) {
  return svgCursor(
    `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path d="M3 21l1.5-5.5L16 4l4 4L8.5 19.5z" fill="${color}" stroke="#000" stroke-width="1.5" stroke-linejoin="round"/><path d="M3 21l1.5-5.5 4 4z" fill="#FCFCFC" stroke="#000" stroke-width="1.5" stroke-linejoin="round"/></svg>`,
    2,
    16,
    'crosshair',
  )
}

function svgCursor(svg: string, hotX: number, hotY: number, fallback: string) {
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}") ${hotX} ${hotY}, ${fallback}`
}

const MODE_CURSOR: Record<Exclude<MapMode, 'pen'>, string> = {
  place: svgCursor(
    `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><path d="M9 1v16M1 9h16" stroke="#000" stroke-width="3"/><path d="M9 1v16M1 9h16" stroke="#FCFCFC" stroke-width="1"/></svg>`,
    9,
    9,
    'crosshair',
  ),
  eraser: svgCursor(
    `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="${ERASER_RADIUS_PX}" fill="rgba(252,252,252,0.15)" stroke="#000" stroke-width="2"/><circle cx="12" cy="12" r="${ERASER_RADIUS_PX}" fill="none" stroke="#FCFCFC" stroke-width="1"/></svg>`,
    12,
    12,
    'cell',
  ),
}

function distanceToSegment(p: Point, a: Point, b: Point) {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const lenSq = dx * dx + dy * dy
  const t = lenSq === 0 ? 0 : Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / lenSq))
  return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy))
}

function strokeHits(stroke: Point[], p: Point, radius: number) {
  if (stroke.length === 1) return Math.hypot(p.x - stroke[0].x, p.y - stroke[0].y) <= radius
  for (let i = 1; i < stroke.length; i++) if (distanceToSegment(p, stroke[i - 1], stroke[i]) <= radius) return true
  return false
}

const KNOWN_LOCATION_COUNT = Object.values(LOCATION_BY_ID).filter((l) => !l.unknown).length

function estimatedCoordsTile(markers: Marker[], value: ManualCoords | undefined): Point | null {
  if (!value || value.done) return null
  const tantegel = markers.find((m) => m.locationId === 'tantegel')
  const first = value.first?.trim() ?? ''
  const second = value.second?.trim() ?? ''
  if (!tantegel || !value.firstDir || !value.secondDir || !/^\d+$/.test(first) || !/^\d+$/.test(second)) return null
  const ns = Number.parseInt(first, 10)
  const ew = Number.parseInt(second, 10)
  const clamp = (n: number) => Math.max(0, Math.min(MAP_SIZE - 1, n))
  return {
    x: clamp(tantegel.x + (value.secondDir === 'E' ? ew : -ew)),
    y: clamp(tantegel.y + (value.firstDir === 'S' ? ns : -ns)),
  }
}

function markerText(marker: Marker) {
  const location = marker.locationId ? LOCATION_BY_ID[marker.locationId] : null
  return location ? location.abbr : '!'
}

export function MapCanvas() {
  const {
    tiles,
    markers,
    visited,
    items,
    coords,
    showGrid,
    placeMarker,
    removeMarker,
    shiftMarkers,
    toggleVisited,
    selectedLocation,
    focusRequest,
    drawings,
    setDrawings,
    stairLinks,
    setStairLink,
  } = useTracker()
  const [stairMenu, setStairMenu] = useState<StairMenuAnchor | null>(null)
  const closeStairMenu = useCallback(() => setStairMenu(null), [])
  const placedLocationCount = new Set([
    ...markers.flatMap((m) => (m.locationId && !LOCATION_BY_ID[m.locationId]?.unknown ? [m.locationId] : [])),
    ...linkedCaveBadges(markers, stairLinks, 1, MAP_SIZE).map((b) => b.caveId),
  ]).size
  const allLocationsPlaced = placedLocationCount >= KNOWN_LOCATION_COUNT
  const [mode, setMode] = useState<MapMode>('place')
  const [activeStroke, setActiveStroke] = useState<Point[] | null>(null)
  const [penColor, setPenColor] = useState<string>(PEN_COLORS[0].value)
  const [penSize, setPenSize] = useState(PEN_SIZE_DEFAULT)
  const isErasingRef = useRef(false)
  const [slide, setSlide] = useState(false)
  const [held, setHeld] = useState<Point | null>(null)
  const [selection, setSelection] = useState<SlideSelection | null>(null)
  const [box, setBox] = useState<{ start: Point; end: Point } | null>(null)
  const selectedMarkers = useMemo(
    () => (selection ? markers.filter((m) => selection.markerIds.has(m.id)) : []),
    [markers, selection],
  )
  const selectedStrokes = useMemo(
    () => (selection ? drawings.filter((_, i) => selection.strokeIdx.has(i)) : []),
    [drawings, selection],
  )
  const [canvasPx, setCanvasPx] = useState(MAP_SIZE * 4)
  const scale = canvasPx / MAP_SIZE
  const selectionBounds = useMemo(
    () => itemBounds(selectedMarkers, selectedStrokes, scale),
    [selectedMarkers, selectedStrokes, scale],
  )
  const [sprites, setSprites] = useState<Partial<Record<SpriteName, HTMLImageElement>>>({})

  useEffect(() => {
    for (const [name, src] of Object.entries(SPRITE_SRC) as [SpriteName, string][]) {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => setSprites((prev) => ({ ...prev, [name]: img }))
      img.src = src
    }
  }, [])
  const bridgeImg = sprites.bridge ?? null

  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const offscreenRef = useRef<HTMLCanvasElement | null>(null)

  const [hover, setHover] = useState<Point | null>(null)
  const [flash, setFlash] = useState<Point | null>(null)

  const exploredPct = useMemo(() => {
    let count = 0
    for (let i = 0; i < tiles.length; i++) if (tiles[i] !== 0) count++
    return ((count / tiles.length) * 100).toFixed(1)
  }, [tiles])

  useEffect(() => {
    const container = containerRef.current
    const section = container?.parentElement
    const root = container?.closest<HTMLElement>('[data-tracker-root]')
    if (!container || !section || !root) return
    const sidebar = root.querySelector<HTMLElement>('[aria-label="Run progress"]')
    let frame = 0
    const fit = () => {
      const rootStyle = getComputedStyle(root)
      const padX = parseFloat(rootStyle.paddingLeft) + parseFloat(rootStyle.paddingRight)
      const padY = parseFloat(rootStyle.paddingTop) + parseFloat(rootStyle.paddingBottom)
      const main = section.parentElement
      const gap = main ? parseFloat(getComputedStyle(main).rowGap) || 0 : 0
      const chromeX = section.offsetWidth - container.offsetWidth
      const chromeY = section.offsetHeight - container.offsetHeight
      const widthAvail = Math.min(MAX_TRACKER_WIDTH, window.innerWidth) - padX - chromeX
      const heightAvail = root.clientHeight - padY - gap - (sidebar?.offsetHeight ?? 0) - chromeY
      const next = Math.max(MAP_SIZE, Math.floor(Math.min(widthAvail, heightAvail)))
      const nextMaxWidth = `${next + padX + chromeX}px`
      if (root.style.maxWidth !== nextMaxWidth) root.style.maxWidth = nextMaxWidth
      setCanvasPx((prev) => (prev === next ? prev : next))
    }
    // Layout writes are deferred to the next frame so they don't re-trigger the observer within the same loop.
    const scheduleFit = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(fit)
    }
    fit()
    const observer = new ResizeObserver(scheduleFit)
    observer.observe(root)
    if (sidebar) observer.observe(sidebar)
    window.addEventListener('resize', scheduleFit)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('resize', scheduleFit)
    }
  }, [])

  useEffect(() => {
    if (!offscreenRef.current) {
      const c = document.createElement('canvas')
      c.width = MAP_SIZE
      c.height = MAP_SIZE
      offscreenRef.current = c
    }
    const offCtx = offscreenRef.current.getContext('2d')
    if (!offCtx) return
    const image = offCtx.createImageData(MAP_SIZE, MAP_SIZE)
    for (let i = 0; i < tiles.length; i++) {
      const [r, g, b] = TERRAIN_RGB[tiles[i]] ?? TERRAIN_RGB[0]
      image.data[i * 4] = r
      image.data[i * 4 + 1] = g
      image.data[i * 4 + 2] = b
      image.data[i * 4 + 3] = 255
    }
    offCtx.putImageData(image, 0, 0)
  }, [tiles])

  useEffect(() => {
    const canvas = canvasRef.current
    const off = offscreenRef.current
    if (!canvas || !off) return
    const dpr = window.devicePixelRatio || 1
    const size = canvasPx
    if (canvas.width !== Math.round(size * dpr)) {
      canvas.width = Math.round(size * dpr)
      canvas.height = Math.round(size * dpr)
    }
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.imageSmoothingEnabled = false
    ctx.clearRect(0, 0, size, size)
    ctx.drawImage(off, 0, 0, size, size)

    if (showGrid) {
      ctx.strokeStyle = 'rgba(255,255,255,0.18)'
      ctx.lineWidth = 1
      ctx.beginPath()
      for (let i = 10; i < MAP_SIZE; i += 10) {
        const p = Math.round(i * scale) + 0.5
        ctx.moveTo(p, 0)
        ctx.lineTo(p, size)
        ctx.moveTo(0, p)
        ctx.lineTo(size, p)
      }
      ctx.stroke()
    }

    const shift =
      held && hover && selection
        ? clampShift(selectedMarkers, selectedStrokes, hover.x - held.x, hover.y - held.y)
        : null
    const placedStrokes =
      shift && selection
        ? drawings.map((s, i) => (selection.strokeIdx.has(i) ? translateStroke(s, shift.x, shift.y) : s))
        : drawings
    const strokes: DrawingStroke[] = activeStroke
      ? [...placedStrokes, Object.assign([...activeStroke], { color: penColor, size: penSize })]
      : placedStrokes
    if (strokes.length > 0) {
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      for (const stroke of strokes) {
        const color = stroke.color ?? PEN_COLORS[0].value
        const width = Math.max(1.5, scale * (stroke.size ?? PEN_SIZE_DEFAULT))
        ctx.strokeStyle = color
        ctx.fillStyle = color
        ctx.lineWidth = width
        if (stroke.length === 1) {
          ctx.beginPath()
          ctx.arc(stroke[0].x * scale, stroke[0].y * scale, width / 2, 0, Math.PI * 2)
          ctx.fill()
          continue
        }
        ctx.beginPath()
        ctx.moveTo(stroke[0].x * scale, stroke[0].y * scale)
        for (let i = 1; i < stroke.length; i++) ctx.lineTo(stroke[i].x * scale, stroke[i].y * scale)
        ctx.stroke()
      }
    }

    if (hover && !slide && (mode === 'place' || (mode === 'pen' && selectedLocation))) {
      ctx.strokeStyle = '#FCFCFC'
      ctx.lineWidth = 2
      ctx.strokeRect(hover.x * scale, hover.y * scale, scale, scale)
    }

    const displayMarkers =
      shift && selection
        ? markers.map((m) => (selection.markerIds.has(m.id) ? { ...m, x: m.x + shift.x, y: m.y + shift.y } : m))
        : markers

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    const nesFont = getComputedStyle(document.documentElement).getPropertyValue('--font-press-start').trim() || 'monospace'
    for (const marker of displayMarkers) {
      const ms = markerSize(scale, marker)
      const abbrLength = (marker.locationId ? LOCATION_BY_ID[marker.locationId]?.abbr.length : undefined) ?? 1
      ctx.font = `${Math.round(ms * (abbrLength > 1 ? 0.36 : 0.5))}px ${nesFont}`
      const cx = marker.x * scale + scale / 2
      const cy = marker.y * scale + scale / 2
      const done = marker.locationId ? visited[marker.locationId] : false
      if (!marker.locationId) {
        ctx.fillStyle = '#000000'
        ctx.fillRect(cx - ms / 2 - 2, cy - ms / 2 - 2, ms + 4, ms + 4)
        if (bridgeImg) ctx.drawImage(bridgeImg, cx - ms / 2, cy - ms / 2, ms, ms)
        ctx.globalAlpha = 1
        continue
      }
      ctx.fillStyle = '#000000'
      ctx.beginPath()
      ctx.roundRect(cx - ms / 2 - 2, cy - ms / 2 - 2, ms + 4, ms + 4, 4)
      ctx.fill()
      markerFill(ctx, marker, cx - ms / 2, cy - ms / 2, ms, items)
      ctx.fillStyle = '#000000'
      ctx.fillText(markerText(marker), cx, cy + 1)
      ctx.globalAlpha = 1
      if (marker.locationId === 'charlock' && !items['rainbow-drop']) {
        const lw = Math.max(9, ms * 0.36)
        const lh = lw * 0.75
        const lx = cx + ms / 2 - lw * 0.55
        const ly = cy + ms / 2 - lh * 0.55
        const r = lw * 0.3
        ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.arc(lx + lw / 2, ly, r, Math.PI, 0)
        ctx.lineTo(lx + lw / 2 + r, ly + 1)
        ctx.moveTo(lx + lw / 2 - r, ly + 1)
        ctx.lineTo(lx + lw / 2 - r, ly)
        ctx.strokeStyle = '#000000'
        ctx.lineWidth = Math.max(4, lw * 0.32)
        ctx.stroke()
        ctx.strokeStyle = '#F8B800'
        ctx.lineWidth = Math.max(2, lw * 0.16)
        ctx.stroke()
        ctx.lineCap = 'butt'
        ctx.fillStyle = '#000000'
        ctx.fillRect(lx - 2, ly - 2, lw + 4, lh + 4)
        ctx.fillStyle = '#F8B800'
        ctx.fillRect(lx, ly, lw, lh)
        ctx.fillStyle = '#000000'
        const kw = Math.max(2, lw * 0.16)
        ctx.fillRect(lx + lw / 2 - kw / 2, ly + lh * 0.3, kw, lh * 0.45)
      }
      if (done) {
        const h = ms * 0.35
        const ty = cy - ms / 2 - 4 - h * 0.6
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.beginPath()
        ctx.moveTo(cx - h * 0.6, ty + h * 0.05)
        ctx.lineTo(cx - h * 0.15, ty + h * 0.5)
        ctx.lineTo(cx + h * 0.7, ty - h * 0.55)
        ctx.strokeStyle = '#000000'
        ctx.lineWidth = Math.max(4, ms * 0.24)
        ctx.stroke()
        ctx.strokeStyle = '#30F030'
        ctx.lineWidth = Math.max(2, ms * 0.13)
        ctx.stroke()
        ctx.lineCap = 'butt'
        ctx.lineJoin = 'miter'
      }
      {
        for (const icon of locationExtraIcons(marker, scale, size)) {
          const opened = icon.sprite !== 'key' && visited[icon.id]
          ctx.fillStyle = '#000000'
          ctx.fillRect(icon.x - 1, icon.y - 1, icon.size + 2, icon.size + 2)
          ctx.globalAlpha = opened ? 0.3 : 1
          const img = sprites[icon.sprite]
          if (img) ctx.drawImage(img, icon.x, icon.y, icon.size, icon.size)
          ctx.globalAlpha = 1
          if (icon.price) {
            const fontPx = Math.max(7, Math.round(icon.size * 0.5))
            ctx.font = `${fontPx}px ${nesFont}`
            const tw = ctx.measureText(icon.price).width
            const tx = Math.max(tw / 2 + 2, Math.min(size - tw / 2 - 2, icon.x + icon.size / 2))
            const ty = Math.max(fontPx / 2 + 2, icon.y - fontPx / 2 - 3)
            ctx.fillStyle = '#000000'
            ctx.fillRect(tx - tw / 2 - 2, ty - fontPx / 2 - 2, tw + 4, fontPx + 4)
            ctx.fillStyle = '#F8B800'
            ctx.fillText(icon.price, tx, ty + 1)
          }
          if (opened) {
            ctx.strokeStyle = '#FCFCFC'
            ctx.lineWidth = 1.5
            ctx.beginPath()
            ctx.moveTo(icon.x + 1, icon.y + icon.size - 1)
            ctx.lineTo(icon.x + icon.size - 1, icon.y + 1)
            ctx.stroke()
          }
        }
      }
    }

    for (const badge of linkedCaveBadges(displayMarkers, stairLinks, scale, size)) {
      const location = LOCATION_BY_ID[badge.caveId]
      const bx = badge.x + badge.size / 2
      const by = badge.y + badge.size / 2
      const toX = bx < badge.fromX ? badge.x + badge.size + 2 : badge.x - 2
      ctx.setLineDash([3, 3])
      for (const [color, width] of [['#000000', 3.5], ['#FCFCFC', 1.5]] as const) {
        ctx.strokeStyle = color
        ctx.lineWidth = width
        ctx.beginPath()
        ctx.moveTo(badge.fromX, badge.fromY)
        ctx.lineTo(toX, by)
        ctx.stroke()
      }
      ctx.setLineDash([])
      const done = visited[badge.caveId]
      ctx.fillStyle = '#000000'
      ctx.beginPath()
      ctx.roundRect(badge.x - 2, badge.y - 2, badge.size + 4, badge.size + 4, 4)
      ctx.fill()
      ctx.globalAlpha = done ? 0.4 : 1
      markerFill(ctx, { id: badge.caveId, x: 0, y: 0, locationId: badge.caveId, label: '' }, badge.x, badge.y, badge.size, items)
      ctx.font = `${Math.round(badge.size * (location.abbr.length > 1 ? 0.36 : 0.5))}px ${nesFont}`
      ctx.fillStyle = '#000000'
      ctx.fillText(location.abbr, bx, by + 1)
      ctx.globalAlpha = 1
      for (const icon of linkedCaveChestIcons(badge, size)) {
        const opened = visited[icon.id]
        ctx.fillStyle = '#000000'
        ctx.fillRect(icon.x - 1, icon.y - 1, icon.size + 2, icon.size + 2)
        ctx.globalAlpha = opened ? 0.3 : 1
        const img = sprites[icon.sprite]
        if (img) ctx.drawImage(img, icon.x, icon.y, icon.size, icon.size)
        ctx.globalAlpha = 1
        if (opened) {
          ctx.strokeStyle = '#FCFCFC'
          ctx.lineWidth = 1.5
          ctx.beginPath()
          ctx.moveTo(icon.x + 1, icon.y + icon.size - 1)
          ctx.lineTo(icon.x + icon.size - 1, icon.y + 1)
          ctx.stroke()
        }
      }
    }

    const estimate = estimatedCoordsTile(displayMarkers, coords[COORDS_LOCATION_ID])
    if (estimate) {
      const cx = estimate.x * scale + scale / 2
      const cy = estimate.y * scale + scale / 2
      const r = Math.max(5, markerSize(scale) * 0.32)
      const angle = Math.PI / 4
      const hx = cx + Math.cos(angle) * r
      const hy = cy + Math.sin(angle) * r
      const ex = cx + Math.cos(angle) * r * 2.3
      const ey = cy + Math.sin(angle) * r * 2.3
      ctx.lineCap = 'round'
      for (const [color, width] of [
        ['#000000', Math.max(5, r * 0.75)],
        [KIND_META.shrine.color, Math.max(2.5, r * 0.38)],
      ] as const) {
        ctx.strokeStyle = color
        ctx.lineWidth = width
        ctx.beginPath()
        ctx.arc(cx, cy, r, 0, Math.PI * 2)
        ctx.moveTo(hx, hy)
        ctx.lineTo(ex, ey)
        ctx.stroke()
      }
      ctx.lineCap = 'butt'
    }

    if (slide && selectionBounds) {
      const dx = shift?.x ?? 0
      const dy = shift?.y ?? 0
      ctx.strokeStyle = '#F8B800'
      ctx.lineWidth = 2
      ctx.setLineDash([6, 4])
      ctx.strokeRect(
        (selectionBounds.minX - SELECTION_PAD + dx) * scale,
        (selectionBounds.minY - SELECTION_PAD + dy) * scale,
        (selectionBounds.maxX - selectionBounds.minX + SELECTION_PAD * 2) * scale,
        (selectionBounds.maxY - selectionBounds.minY + SELECTION_PAD * 2) * scale,
      )
      ctx.setLineDash([])
    }

    if (box) {
      const x = Math.min(box.start.x, box.end.x) * scale
      const y = Math.min(box.start.y, box.end.y) * scale
      const w = Math.abs(box.end.x - box.start.x) * scale
      const h = Math.abs(box.end.y - box.start.y) * scale
      ctx.fillStyle = 'rgba(248,184,0,0.12)'
      ctx.fillRect(x, y, w, h)
      ctx.strokeStyle = '#FCFCFC'
      ctx.lineWidth = 1
      ctx.setLineDash([4, 3])
      ctx.strokeRect(x + 0.5, y + 0.5, w, h)
      ctx.setLineDash([])
    }

    if (flash) {
      ctx.strokeStyle = '#F8B800'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.arc(flash.x * scale + scale / 2, flash.y * scale + scale / 2, markerSize(scale) * 1.4, 0, Math.PI * 2)
      ctx.stroke()
    }
  }, [tiles, markers, visited, items, coords, stairLinks, canvasPx, scale, showGrid, hover, flash, bridgeImg, sprites, drawings, activeStroke, mode, slide, held, selection, selectedMarkers, selectedStrokes, selectionBounds, box])

  useEffect(() => {
    if (!focusRequest) return
    setFlash({ x: focusRequest.x, y: focusRequest.y })
    const t = window.setTimeout(() => setFlash(null), 1400)
    return () => window.clearTimeout(t)
  }, [focusRequest])

  const [caveMapId, setCaveMapId] = useState<string | null>(null)
  const closeCaveMap = useCallback(() => setCaveMapId(null), [])
  const [shopTown, setShopTown] = useState<ShopTown | null>(null)
  const closeShop = useCallback(() => setShopTown(null), [])

  function pointerToTile(e: React.PointerEvent | React.MouseEvent): Point {
    const rect = (e.currentTarget as HTMLCanvasElement).getBoundingClientRect()
    return {
      x: Math.min(MAP_SIZE - 1, Math.max(0, Math.floor((e.clientX - rect.left) / scale))),
      y: Math.min(MAP_SIZE - 1, Math.max(0, Math.floor((e.clientY - rect.top) / scale))),
    }
  }

  function markerAtPointer(e: React.MouseEvent) {
    const rect = (e.currentTarget as HTMLCanvasElement).getBoundingClientRect()
    const px = e.clientX - rect.left
    const py = e.clientY - rect.top
    for (let i = markers.length - 1; i >= 0; i--) {
      const m = markers[i]
      const half = markerSize(scale, m) / 2 + 2
      const cx = m.x * scale + scale / 2
      const cy = m.y * scale + scale / 2
      if (Math.abs(px - cx) <= half && Math.abs(py - cy) <= half) return m
    }
    return null
  }

  function extraAtPointer(e: React.MouseEvent) {
    const rect = (e.currentTarget as HTMLCanvasElement).getBoundingClientRect()
    const px = e.clientX - rect.left
    const py = e.clientY - rect.top
    for (const marker of markers) {
      const hit = locationExtraIcons(marker, scale, canvasPx).find(
        (icon) => icon.sprite !== 'key' && px >= icon.x - 1 && px <= icon.x + icon.size + 1 && py >= icon.y - 1 && py <= icon.y + icon.size + 1,
      )
      if (hit) return hit
    }
    for (const badge of linkedCaveBadges(markers, stairLinks, scale, canvasPx)) {
      const hit = linkedCaveChestIcons(badge, canvasPx).find(
        (icon) => px >= icon.x - 1 && px <= icon.x + icon.size + 1 && py >= icon.y - 1 && py <= icon.y + icon.size + 1,
      )
      if (hit) return hit
    }
    return null
  }

  function linkedCaveAtPointer(e: React.MouseEvent) {
    const rect = (e.currentTarget as HTMLCanvasElement).getBoundingClientRect()
    const px = e.clientX - rect.left
    const py = e.clientY - rect.top
    return (
      linkedCaveBadges(markers, stairLinks, scale, canvasPx).find(
        (b) => px >= b.x - 2 && px <= b.x + b.size + 2 && py >= b.y - 2 && py <= b.y + b.size + 2,
      ) ?? null
    )
  }

  function pointerToMapPoint(e: React.PointerEvent | React.MouseEvent): Point {
    const rect = (e.currentTarget as HTMLCanvasElement).getBoundingClientRect()
    return {
      x: Math.min(MAP_SIZE, Math.max(0, (e.clientX - rect.left) / scale)),
      y: Math.min(MAP_SIZE, Math.max(0, (e.clientY - rect.top) / scale)),
    }
  }

  function eraseAt(p: Point) {
    const radius = ERASER_RADIUS_PX / scale
    setDrawings((prev) => {
      const next = prev.filter((stroke) => !strokeHits(stroke, p, radius))
      return next.length === prev.length ? prev : next
    })
  }

  function finishStroke() {
    if (activeStroke) {
      const stroke = Object.assign([...activeStroke], { color: penColor, size: penSize })
      setDrawings((prev) => [...prev, stroke])
    }
    setActiveStroke(null)
    isErasingRef.current = false
  }

  function dropHeld(tile: Point) {
    if (!held || !selection) return
    const shift = clampShift(selectedMarkers, selectedStrokes, tile.x - held.x, tile.y - held.y)
    if (shift.x !== 0 || shift.y !== 0) {
      if (selection.markerIds.size > 0) shiftMarkers(shift.x, shift.y, selection.markerIds)
      if (selection.strokeIdx.size > 0) {
        setDrawings((prev) =>
          prev.map((s, i) => (selection.strokeIdx.has(i) ? translateStroke(s, shift.x, shift.y) : s)),
        )
      }
    }
    setHeld(null)
  }

  function handleSlideClick(e: React.PointerEvent<HTMLCanvasElement>) {
    const tile = pointerToTile(e)
    const point = pointerToMapPoint(e)
    if (selectionBounds && inPaddedBounds(selectionBounds, point)) {
      e.currentTarget.setPointerCapture(e.pointerId)
      setHeld(tile)
      setHover(tile)
      return
    }
    e.currentTarget.setPointerCapture(e.pointerId)
    setSelection(null)
    setBox({ start: point, end: point })
  }

  function finishBox() {
    if (!box) return
    const x0 = Math.min(box.start.x, box.end.x)
    const x1 = Math.max(box.start.x, box.end.x)
    const y0 = Math.min(box.start.y, box.end.y)
    const y1 = Math.max(box.start.y, box.end.y)
    const markerIds = new Set(
      markers.filter((m) => m.x + 1 >= x0 && m.x <= x1 && m.y + 1 >= y0 && m.y <= y1).map((m) => m.id),
    )
    const strokeIdx = new Set<number>()
    drawings.forEach((stroke, i) => {
      if (stroke.some((p) => p.x >= x0 && p.x <= x1 && p.y >= y0 && p.y <= y1)) strokeIdx.add(i)
    })
    setSelection(markerIds.size > 0 || strokeIdx.size > 0 ? { markerIds, strokeIdx } : null)
    setBox(null)
  }

  function handlePointerUp(e: React.PointerEvent<HTMLCanvasElement>) {
    if (held) dropHeld(pointerToTile(e))
    else if (box) finishBox()
    else finishStroke()
  }

  function toggleSlide() {
    setSlide((on) => !on)
    setHeld(null)
    setSelection(null)
    setBox(null)
    setActiveStroke(null)
    isErasingRef.current = false
    setMode('place')
  }

  function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    if (slide) {
      if (e.button === 1) e.preventDefault()
      if (e.button === 0) handleSlideClick(e)
      return
    }
    if (e.button === 1) {
      e.preventDefault()
      if (mode === 'eraser') {
        setMode('place')
        return
      }
      if (mode === 'place') {
        const linked = linkedCaveAtPointer(e)
        if (linked && CAVE_MAPS[linked.caveId]) {
          setCaveMapId(linked.caveId)
          return
        }
        const hit = markerAtPointer(e)
        if (hit?.locationId && CAVE_MAPS[hit.locationId]) {
          setCaveMapId(hit.locationId)
          return
        }
        if (hit && hasEquipmentShop(hit.locationId)) {
          const location = LOCATION_BY_ID[hit.locationId as string]
          setShopTown(
            location.unknown
              ? { key: `unknown:${hit.x},${hit.y}`, name: '? Town' }
              : { key: location.id, name: location.name },
          )
          return
        }
      }
      setActiveStroke(null)
      setMode('eraser')
      return
    }
    if (e.button !== 0) return
    if (mode === 'pen' && selectedLocation) {
      const tile = pointerToTile(e)
      placeMarker(tile.x, tile.y)
      return
    }
    if (mode === 'pen') {
      e.currentTarget.setPointerCapture(e.pointerId)
      setActiveStroke([pointerToMapPoint(e)])
      return
    }
    if (mode === 'eraser') {
      e.currentTarget.setPointerCapture(e.pointerId)
      isErasingRef.current = true
      eraseAt(pointerToMapPoint(e))
      return
    }
    const extra = extraAtPointer(e)
    if (extra) {
      toggleVisited(extra.id)
      return
    }
    const linkedCave = linkedCaveAtPointer(e)
    if (linkedCave) {
      toggleVisited(linkedCave.caveId)
      return
    }
    if (!selectedLocation) {
      const hit = markerAtPointer(e)
      if (hit) {
        if (hit.locationId) toggleVisited(hit.locationId)
        return
      }
    }
    const tile = pointerToTile(e)
    placeMarker(tile.x, tile.y)
  }

  function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (box) {
      setBox({ start: box.start, end: pointerToMapPoint(e) })
      return
    }
    if (activeStroke) {
      const p = pointerToMapPoint(e)
      const last = activeStroke[activeStroke.length - 1]
      if (Math.hypot(p.x - last.x, p.y - last.y) * scale >= 1.5) setActiveStroke([...activeStroke, p])
      return
    }
    if (isErasingRef.current) {
      eraseAt(pointerToMapPoint(e))
      return
    }
    const tile = pointerToTile(e)
    if (!hover || hover.x !== tile.x || hover.y !== tile.y) setHover(tile)
  }

  function handleContextMenu(e: React.MouseEvent<HTMLCanvasElement>) {
    e.preventDefault()
    if (slide) {
      setHeld(null)
      setBox(null)
      setSelection(null)
      return
    }
    if (mode !== 'place') {
      finishStroke()
      setMode('place')
      return
    }
    const extra = extraAtPointer(e)
    if (extra) {
      if (extra.sprite === 'stairs') {
        setStairMenu({ stairId: extra.id, x: extra.x + extra.size / 2, y: extra.y + extra.size })
      }
      return
    }
    const linkedCave = linkedCaveAtPointer(e)
    if (linkedCave) {
      const stairId = Object.keys(stairLinks).find((id) => stairLinks[id] === linkedCave.caveId)
      if (stairId) setStairLink(stairId, null)
      return
    }
    const marker = markerAtPointer(e)
    if (marker) {
      removeMarker(marker.id)
      return
    }
    setHover(null)
    setMode('pen')
  }

  const modeLabel = slide ? ', slide mode' : mode === 'pen' ? ', pen mode' : mode === 'eraser' ? ', eraser mode' : ''
  const overSelection =
    !!selectionBounds && !!hover && inPaddedBounds(selectionBounds, { x: hover.x + 0.5, y: hover.y + 0.5 })
  const cursor = slide ? (held ? 'grabbing' : overSelection ? 'grab' : 'crosshair') : mode === 'pen' ? penCursor(penColor) : MODE_CURSOR[mode]

  return (
  <section aria-label="Overworld map" className="dw-window relative flex flex-none flex-col self-center overflow-hidden">
  <div className="font-display pointer-events-none absolute inset-x-0 bottom-0 z-10 flex aspect-[12/1] flex-col items-center justify-center gap-1 text-center text-[10px] leading-none [text-shadow:0_0_3px_#000,0_0_3px_#000]">
  <h1 className={allLocationsPlaced ? 'text-[#58D854]' : 'text-foreground'}>
  Locations {placedLocationCount}/{KNOWN_LOCATION_COUNT}
  </h1>
  </div>
      <div ref={containerRef} className="flex items-center justify-center overflow-hidden bg-[#050508]">
        <div className="relative" style={{ width: canvasPx, height: canvasPx }}>
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={`Overworld map, ${exploredPct}% explored, ${markers.length} markers placed${modeLabel}`}
          style={{ width: canvasPx, height: canvasPx, cursor, touchAction: 'none', imageRendering: 'pixelated' }}
          className="block"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onPointerLeave={() => setHover(null)}
          onContextMenu={handleContextMenu}
          onAuxClick={(e) => e.preventDefault()}
        />
        {!slide && <TownUpgradeArrows scale={scale} markerSize={(m) => markerSize(scale, m)} />}
        <StairLinkMenu anchor={stairMenu} canvasSize={canvasPx} onClose={closeStairMenu} />
        </div>
      </div>
      <div className="pointer-events-none absolute top-0 right-0 z-10 flex items-center justify-end gap-1 p-1">
      <div>
        <PenSettings color={penColor} size={penSize} onColorChange={setPenColor} onSizeChange={setPenSize} />
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={slide}
        onClick={toggleSlide}
        className="font-display pointer-events-auto flex items-center gap-1.5 rounded-sm bg-black/60 px-1.5 py-1 text-[10px] leading-none text-foreground outline-none hover:text-primary focus-visible:ring-2 focus-visible:ring-primary"
      >
        <span
          aria-hidden="true"
          className={`relative h-3 w-6 rounded-full border border-foreground transition-colors ${slide ? 'bg-primary' : 'bg-transparent'}`}
        >
          <span
            className={`absolute top-1/2 size-2 -translate-y-1/2 rounded-full bg-foreground transition-[left] ${slide ? 'left-[13px]' : 'left-[1px]'}`}
          />
        </span>
        Move
      </button>
      </div>
      <div className="absolute top-0 left-0 z-10 w-1/4">
        <EquipmentPanels />
      </div>
      <div className="pointer-events-none absolute bottom-0 left-0 z-10 flex aspect-square w-1/12 items-center justify-center">
        <div className="pointer-events-auto rounded-sm bg-black/60">
          <ExperienceWizard />
        </div>
      </div>
      <div className="absolute right-1.5 bottom-1.5 z-10 rounded-sm bg-black/60">
        <DragonlordSimButton />
      </div>
      <CaveMapViewer locationId={caveMapId} onClose={closeCaveMap} />
      <ShopWindow town={shopTown} onClose={closeShop} />
    </section>
  )
}
