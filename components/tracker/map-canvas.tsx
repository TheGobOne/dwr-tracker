'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CAVE_MAPS, CaveMapViewer } from './cave-map-viewer'
import { TrackerMenu } from './tracker-menu'
import { KIND_META, LOCATION_BY_ID, MAP_SIZE, PIN_COLOR, TERRAIN_RGB } from '@/lib/dw-data'
import { useTracker, type Marker } from './tracker-context'

const MAX_TRACKER_WIDTH = 640

interface Point {
  x: number
  y: number
}

function markerSize(scale: number, marker?: Marker) {
  const base = Math.max(16, Math.round(scale * 2))
  const isCharlock = marker?.locationId && LOCATION_BY_ID[marker.locationId]?.name === 'Charlock'
  return isCharlock ? base * 2 : Math.round(base * 1.33)
}

function markerColor(marker: Marker) {
  const location = marker.locationId ? LOCATION_BY_ID[marker.locationId] : null
  return location ? KIND_META[location.kind].color : PIN_COLOR
}

const BRIDGE_SPRITE_SRC = '/sprites/bridge.png'

type MapMode = 'place' | 'pen' | 'eraser'

const PEN_COLOR = '#00D800'
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

function translateStroke(stroke: Point[], dx: number, dy: number) {
  return stroke.map((p) => ({ x: p.x + dx, y: p.y + dy }))
}

function svgCursor(svg: string, hotX: number, hotY: number, fallback: string) {
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}") ${hotX} ${hotY}, ${fallback}`
}

const MODE_CURSOR: Record<MapMode, string> = {
  place: 'crosshair',
  pen: svgCursor(
    `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M3 21l1.5-5.5L16 4l4 4L8.5 19.5z" fill="${PEN_COLOR}" stroke="#000" stroke-width="1.5" stroke-linejoin="round"/><path d="M3 21l1.5-5.5 4 4z" fill="#FCFCFC" stroke="#000" stroke-width="1.5" stroke-linejoin="round"/></svg>`,
    3,
    21,
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

function markerText(marker: Marker) {
  const location = marker.locationId ? LOCATION_BY_ID[marker.locationId] : null
  return location ? location.abbr : '!'
}

export function MapCanvas() {
  const {
    tiles,
    markers,
    visited,
    showGrid,
    placeMarker,
    removeMarker,
    shiftMarkers,
    toggleVisited,
    selectedLocation,
    focusRequest,
    drawings,
    setDrawings,
  } = useTracker()
  const [mode, setMode] = useState<MapMode>('place')
  const [activeStroke, setActiveStroke] = useState<Point[] | null>(null)
  const isErasingRef = useRef(false)
  const [slide, setSlide] = useState(false)
  const [held, setHeld] = useState<Point | null>(null)
  const [bridgeImg, setBridgeImg] = useState<HTMLImageElement | null>(null)

  useEffect(() => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => setBridgeImg(img)
    img.src = BRIDGE_SPRITE_SRC
  }, [])

  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const offscreenRef = useRef<HTMLCanvasElement | null>(null)

  const [canvasPx, setCanvasPx] = useState(MAP_SIZE * 4)
  const [hover, setHover] = useState<Point | null>(null)
  const [flash, setFlash] = useState<Point | null>(null)

  const scale = canvasPx / MAP_SIZE

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

    const shift = held && hover ? clampShift(markers, drawings, hover.x - held.x, hover.y - held.y) : null
    const placedStrokes = shift ? drawings.map((s) => translateStroke(s, shift.x, shift.y)) : drawings
    const strokes = activeStroke ? [...placedStrokes, activeStroke] : placedStrokes
    if (strokes.length > 0) {
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.strokeStyle = PEN_COLOR
      ctx.fillStyle = PEN_COLOR
      const width = Math.max(2, scale * 0.6)
      ctx.lineWidth = width
      for (const stroke of strokes) {
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

    if (hover && !slide && mode === 'place') {
      ctx.strokeStyle = '#FCFCFC'
      ctx.lineWidth = 2
      ctx.strokeRect(hover.x * scale, hover.y * scale, scale, scale)
    }

    const displayMarkers = shift ? markers.map((m) => ({ ...m, x: m.x + shift.x, y: m.y + shift.y })) : markers

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
      ctx.globalAlpha = done ? 0.55 : 1
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
      ctx.fillStyle = markerColor(marker)
      ctx.beginPath()
      ctx.roundRect(cx - ms / 2, cy - ms / 2, ms, ms, 3)
      ctx.fill()
      ctx.fillStyle = '#000000'
      ctx.fillText(markerText(marker), cx, cy + 1)
      if (done) {
        ctx.strokeStyle = '#000000'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(cx - ms / 2 + 2, cy + ms / 2 - 2)
        ctx.lineTo(cx + ms / 2 - 2, cy - ms / 2 + 2)
        ctx.stroke()
      }
      ctx.globalAlpha = 1
    }

    if (flash) {
      ctx.strokeStyle = '#F8B800'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.arc(flash.x * scale + scale / 2, flash.y * scale + scale / 2, markerSize(scale) * 1.4, 0, Math.PI * 2)
      ctx.stroke()
    }
  }, [tiles, markers, visited, canvasPx, scale, showGrid, hover, flash, bridgeImg, drawings, activeStroke, mode, slide, held])

  useEffect(() => {
    if (!focusRequest) return
    setFlash({ x: focusRequest.x, y: focusRequest.y })
    const t = window.setTimeout(() => setFlash(null), 1400)
    return () => window.clearTimeout(t)
  }, [focusRequest])

  const [caveMapId, setCaveMapId] = useState<string | null>(null)
  const closeCaveMap = useCallback(() => setCaveMapId(null), [])

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
    if (activeStroke) setDrawings((prev) => [...prev, activeStroke])
    setActiveStroke(null)
    isErasingRef.current = false
  }

  function handleSlideClick(e: React.PointerEvent<HTMLCanvasElement>) {
    const tile = pointerToTile(e)
    if (held) {
      const shift = clampShift(markers, drawings, tile.x - held.x, tile.y - held.y)
      if (shift.x !== 0 || shift.y !== 0) {
        shiftMarkers(shift.x, shift.y)
        setDrawings((prev) => prev.map((s) => translateStroke(s, shift.x, shift.y)))
      }
      setHeld(null)
      return
    }
    if (markers.length === 0 && drawings.length === 0) return
    setHeld(tile)
    setHover(tile)
  }

  function toggleSlide() {
    setSlide((on) => !on)
    setHeld(null)
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
        const hit = markerAtPointer(e)
        if (hit?.locationId && CAVE_MAPS[hit.locationId]) {
          setCaveMapId(hit.locationId)
          return
        }
      }
      setActiveStroke(null)
      setMode('eraser')
      return
    }
    if (e.button !== 0) return
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
      return
    }
    if (mode !== 'place') {
      finishStroke()
      setMode('place')
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
  const cursor = slide ? (held ? 'grabbing' : 'grab') : MODE_CURSOR[mode]

  return (
  <section aria-label="Overworld map" className="dw-window relative flex flex-none flex-col self-center overflow-hidden">
  <h1 className="font-display pointer-events-none absolute inset-x-0 top-1.5 z-10 text-center text-[10px] leading-none text-primary [text-shadow:0_0_3px_#000,0_0_3px_#000]">
        DWR <span className="text-foreground">Tracker</span>
      </h1>
      <div ref={containerRef} className="flex items-center justify-center overflow-hidden bg-[#050508]">
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={`Overworld map, ${exploredPct}% explored, ${markers.length} markers placed${modeLabel}`}
          style={{ width: canvasPx, height: canvasPx, cursor, touchAction: 'none', imageRendering: 'pixelated' }}
          className="block"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={finishStroke}
          onPointerCancel={finishStroke}
          onPointerLeave={() => setHover(null)}
          onContextMenu={handleContextMenu}
          onAuxClick={(e) => e.preventDefault()}
        />
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={slide}
        onClick={toggleSlide}
        className="font-display absolute bottom-1.5 left-1.5 z-10 flex items-center gap-1.5 rounded-sm bg-black/60 px-1.5 py-1 text-[8px] leading-none text-foreground outline-none hover:text-primary focus-visible:ring-2 focus-visible:ring-primary"
      >
        <span
          aria-hidden="true"
          className={`relative h-2.5 w-5 rounded-full border border-foreground transition-colors ${slide ? 'bg-primary' : 'bg-transparent'}`}
        >
          <span
            className={`absolute top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-foreground transition-[left] ${slide ? 'left-[11px]' : 'left-[1px]'}`}
          />
        </span>
        Slide
      </button>
      <div className="absolute right-1.5 bottom-1.5 z-10 rounded-sm bg-black/60">
        <TrackerMenu />
      </div>
      <CaveMapViewer locationId={caveMapId} onClose={closeCaveMap} />
    </section>
  )
}
