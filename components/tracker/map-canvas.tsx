'use client'

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { KIND_META, LOCATION_BY_ID, MAP_SIZE, PIN_COLOR, TERRAIN_RGB, TERRAINS } from '@/lib/dw-data'
import { MAX_ZOOM, MIN_ZOOM, useTracker, type Marker } from './tracker-context'

interface Point {
  x: number
  y: number
}

type DragState =
  | { mode: 'paint'; last: Point }
  | { mode: 'pan'; startClient: Point; startScroll: Point }

function markerSize(zoom: number) {
  return Math.max(14, Math.round(zoom * 1.5))
}

function markerColor(marker: Marker) {
  const location = marker.locationId ? LOCATION_BY_ID[marker.locationId] : null
  return location ? KIND_META[location.kind].color : PIN_COLOR
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
    zoom,
    setZoom,
    tool,
    showGrid,
    brushSize,
    selectedLocation,
    beginStroke,
    paintLine,
    fillAt,
    placeMarker,
    removeMarker,
    focusRequest,
  } = useTracker()

  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const offscreenRef = useRef<HTMLCanvasElement | null>(null)
  const dragRef = useRef<DragState | null>(null)
  const zoomRef = useRef(zoom)
  const zoomAnchorRef = useRef<{ tileX: number; tileY: number; offsetX: number; offsetY: number } | null>(null)

  const [hover, setHover] = useState<Point | null>(null)
  const [flash, setFlash] = useState<Point | null>(null)
  const [spaceHeld, setSpaceHeld] = useState(false)
  const [isPanning, setIsPanning] = useState(false)

  const canvasPx = MAP_SIZE * zoom
  const panActive = tool === 'pan' || spaceHeld

  const exploredPct = useMemo(() => {
    let count = 0
    for (let i = 0; i < tiles.length; i++) if (tiles[i] !== 0) count++
    return ((count / tiles.length) * 100).toFixed(1)
  }, [tiles])

  useEffect(() => {
    if (!offscreenRef.current) {
      const c = document.createElement('canvas')
      c.width = MAP_SIZE
      c.height = MAP_SIZE
      offscreenRef.current = c
    }
    const off = offscreenRef.current
    const offCtx = off.getContext('2d')
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
    if (canvas.width !== size * dpr) {
      canvas.width = size * dpr
      canvas.height = size * dpr
    }
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.imageSmoothingEnabled = false
    ctx.clearRect(0, 0, size, size)
    ctx.drawImage(off, 0, 0, size, size)

    if (showGrid && zoom >= 8) {
      ctx.strokeStyle = 'rgba(255,255,255,0.08)'
      ctx.lineWidth = 1
      ctx.beginPath()
      for (let i = 1; i < MAP_SIZE; i++) {
        if (i % 10 === 0) continue
        const p = i * zoom + 0.5
        ctx.moveTo(p, 0)
        ctx.lineTo(p, size)
        ctx.moveTo(0, p)
        ctx.lineTo(size, p)
      }
      ctx.stroke()
    }
    if (showGrid) {
      ctx.strokeStyle = 'rgba(255,255,255,0.22)'
      ctx.lineWidth = 1
      ctx.beginPath()
      for (let i = 10; i < MAP_SIZE; i += 10) {
        const p = i * zoom + 0.5
        ctx.moveTo(p, 0)
        ctx.lineTo(p, size)
        ctx.moveTo(0, p)
        ctx.lineTo(size, p)
      }
      ctx.stroke()
    }

    if (hover && !panActive) {
      const r = tool === 'paint' ? Math.floor(brushSize / 2) : 0
      ctx.strokeStyle = '#FCFCFC'
      ctx.lineWidth = 2
      ctx.strokeRect((hover.x - r) * zoom + 1, (hover.y - r) * zoom + 1, (r * 2 + 1) * zoom - 2, (r * 2 + 1) * zoom - 2)
    }

    const ms = markerSize(zoom)
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `bold ${Math.round(ms * 0.5)}px ui-monospace, monospace`
    for (const marker of markers) {
      const cx = marker.x * zoom + zoom / 2
      const cy = marker.y * zoom + zoom / 2
      const done = marker.locationId ? visited[marker.locationId] : false
      ctx.globalAlpha = done ? 0.55 : 1
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
      const cx = flash.x * zoom + zoom / 2
      const cy = flash.y * zoom + zoom / 2
      ctx.strokeStyle = '#F8B800'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.arc(cx, cy, ms * 1.4, 0, Math.PI * 2)
      ctx.stroke()
    }
  }, [tiles, markers, visited, zoom, canvasPx, showGrid, hover, flash, tool, brushSize, panActive])

  useEffect(() => {
    zoomRef.current = zoom
  }, [zoom])

  useLayoutEffect(() => {
    const anchor = zoomAnchorRef.current
    const container = containerRef.current
    if (!anchor || !container) return
    container.scrollLeft = anchor.tileX * zoom - anchor.offsetX
    container.scrollTop = anchor.tileY * zoom - anchor.offsetY
    zoomAnchorRef.current = null
  }, [zoom])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return
      e.preventDefault()
      const current = zoomRef.current
      const next = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, current + (e.deltaY < 0 ? 1 : -1)))
      if (next === current) return
      const rect = container.getBoundingClientRect()
      const offsetX = e.clientX - rect.left
      const offsetY = e.clientY - rect.top
      zoomAnchorRef.current = {
        tileX: (container.scrollLeft + offsetX) / current,
        tileY: (container.scrollTop + offsetY) / current,
        offsetX,
        offsetY,
      }
      setZoom(next)
    }
    container.addEventListener('wheel', onWheel, { passive: false })
    return () => container.removeEventListener('wheel', onWheel)
  }, [setZoom])

  useEffect(() => {
    const isTyping = (target: EventTarget | null) =>
      target instanceof HTMLElement && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
    const down = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !isTyping(e.target)) {
        e.preventDefault()
        setSpaceHeld(true)
      }
    }
    const up = (e: KeyboardEvent) => {
      if (e.code === 'Space') setSpaceHeld(false)
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [])

  useEffect(() => {
    if (!focusRequest) return
    const container = containerRef.current
    if (!container) return
    container.scrollTo({
      left: focusRequest.x * zoomRef.current - container.clientWidth / 2,
      top: focusRequest.y * zoomRef.current - container.clientHeight / 2,
      behavior: 'smooth',
    })
    setFlash({ x: focusRequest.x, y: focusRequest.y })
    const t = window.setTimeout(() => setFlash(null), 1400)
    return () => window.clearTimeout(t)
  }, [focusRequest])

  function pointerToTile(e: React.PointerEvent | React.MouseEvent): Point {
    const rect = (e.currentTarget as HTMLCanvasElement).getBoundingClientRect()
    return {
      x: Math.min(MAP_SIZE - 1, Math.max(0, Math.floor((e.clientX - rect.left) / zoom))),
      y: Math.min(MAP_SIZE - 1, Math.max(0, Math.floor((e.clientY - rect.top) / zoom))),
    }
  }

  function markerAtPointer(e: React.PointerEvent | React.MouseEvent) {
    const rect = (e.currentTarget as HTMLCanvasElement).getBoundingClientRect()
    const px = e.clientX - rect.left
    const py = e.clientY - rect.top
    const half = markerSize(zoom) / 2 + 2
    for (let i = markers.length - 1; i >= 0; i--) {
      const m = markers[i]
      const cx = m.x * zoom + zoom / 2
      const cy = m.y * zoom + zoom / 2
      if (Math.abs(px - cx) <= half && Math.abs(py - cy) <= half) return m
    }
    return null
  }

  function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    const container = containerRef.current
    if (!container) return
    if (e.button === 2) return
    e.currentTarget.setPointerCapture(e.pointerId)

    if (panActive || e.button === 1) {
      e.preventDefault()
      dragRef.current = {
        mode: 'pan',
        startClient: { x: e.clientX, y: e.clientY },
        startScroll: { x: container.scrollLeft, y: container.scrollTop },
      }
      setIsPanning(true)
      return
    }
    if (e.button !== 0) return

    const tile = pointerToTile(e)
    if (tool === 'paint') {
      beginStroke()
      paintLine(tile.x, tile.y, tile.x, tile.y)
      dragRef.current = { mode: 'paint', last: tile }
    } else if (tool === 'fill') {
      beginStroke()
      fillAt(tile.x, tile.y)
    } else if (tool === 'marker') {
      placeMarker(tile.x, tile.y)
    }
  }

  function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    const tile = pointerToTile(e)
    if (!hover || hover.x !== tile.x || hover.y !== tile.y) setHover(tile)

    const drag = dragRef.current
    if (!drag) return
    if (drag.mode === 'pan') {
      const container = containerRef.current
      if (!container) return
      container.scrollLeft = drag.startScroll.x - (e.clientX - drag.startClient.x)
      container.scrollTop = drag.startScroll.y - (e.clientY - drag.startClient.y)
    } else if (drag.last.x !== tile.x || drag.last.y !== tile.y) {
      paintLine(drag.last.x, drag.last.y, tile.x, tile.y)
      drag.last = tile
    }
  }

  function endDrag() {
    dragRef.current = null
    setIsPanning(false)
  }

  function handleContextMenu(e: React.MouseEvent<HTMLCanvasElement>) {
    e.preventDefault()
    const marker = markerAtPointer(e)
    if (marker) removeMarker(marker.id)
  }

  const hoverTerrain = hover ? TERRAINS[tiles[hover.y * MAP_SIZE + hover.x]] : null
  const hoverMarkers = hover ? markers.filter((m) => m.x === hover.x && m.y === hover.y) : []

  const cursor = panActive ? (isPanning ? 'grabbing' : 'grab') : tool === 'marker' ? 'copy' : 'crosshair'

  return (
    <section aria-label="Overworld map" className="dw-window flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <div
        ref={containerRef}
        className="min-h-[55vh] flex-1 overflow-auto bg-[#050508] lg:min-h-0"
        style={{ overscrollBehavior: 'contain' }}
      >
        <div className="p-6" style={{ width: canvasPx + 48 }}>
          <canvas
            ref={canvasRef}
            role="img"
            aria-label={`Overworld map, ${exploredPct}% explored, ${markers.length} markers placed`}
            width={canvasPx}
            height={canvasPx}
            style={{ width: canvasPx, height: canvasPx, cursor, touchAction: 'none', imageRendering: 'pixelated' }}
            className="block shadow-[0_0_0_2px_#fcfcfc33]"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onPointerLeave={() => setHover(null)}
            onContextMenu={handleContextMenu}
          />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t-2 border-foreground/80 px-3 py-2 text-sm">
        <span className="font-display text-[10px] text-primary" aria-live="polite">
          {hover ? `X ${String(hover.x).padStart(3, '0')}  Y ${String(hover.y).padStart(3, '0')}` : 'X ---  Y ---'}
        </span>
        <span className="text-muted-foreground">{hoverTerrain ? hoverTerrain.name : 'Hover the map'}</span>
        {hoverMarkers.length > 0 && <span className="text-foreground">{hoverMarkers.map((m) => m.label).join(', ')}</span>}
        <span className="ml-auto text-muted-foreground">
          {selectedLocation && tool === 'marker' ? (
            <span className="text-primary">Click the map to place {LOCATION_BY_ID[selectedLocation]?.name}</span>
          ) : (
            <>Explored {exploredPct}%</>
          )}
        </span>
      </div>
    </section>
  )
}
