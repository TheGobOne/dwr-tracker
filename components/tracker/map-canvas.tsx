'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
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

function markerText(marker: Marker) {
  const location = marker.locationId ? LOCATION_BY_ID[marker.locationId] : null
  return location ? location.abbr : '!'
}

export function MapCanvas() {
  const { tiles, markers, visited, showGrid, placeMarker, removeMarker, toggleVisited, selectedLocation, focusRequest } =
    useTracker()
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
    if (!container) return
    const root = container.closest<HTMLElement>('[data-tracker-root]')
  let frame = 0
  const fit = () => {
  const height = Math.floor(container.clientHeight)
  if (root) {
  const horizontalChrome = root.offsetWidth - container.clientWidth
  const nextMaxWidth = `${Math.min(MAX_TRACKER_WIDTH, height + horizontalChrome)}px`
  if (root.style.maxWidth !== nextMaxWidth) root.style.maxWidth = nextMaxWidth
  }
  const available = Math.floor(Math.min(container.clientWidth, height))
  const next = Math.max(MAP_SIZE, available)
  setCanvasPx((prev) => (prev === next ? prev : next))
  }
  // Layout writes are deferred to the next frame so they don't re-trigger the observer within the same loop.
  const scheduleFit = () => {
  cancelAnimationFrame(frame)
  frame = requestAnimationFrame(fit)
  }
  fit()
  const observer = new ResizeObserver(scheduleFit)
  observer.observe(container)
  return () => {
  cancelAnimationFrame(frame)
  observer.disconnect()
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

    if (hover) {
      ctx.strokeStyle = '#FCFCFC'
      ctx.lineWidth = 2
      ctx.strokeRect(hover.x * scale, hover.y * scale, scale, scale)
    }

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    for (const marker of markers) {
      const ms = markerSize(scale, marker)
      ctx.font = `bold ${Math.round(ms * 0.5)}px ui-monospace, monospace`
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
  }, [tiles, markers, visited, canvasPx, scale, showGrid, hover, flash, bridgeImg])

  useEffect(() => {
    if (!focusRequest) return
    setFlash({ x: focusRequest.x, y: focusRequest.y })
    const t = window.setTimeout(() => setFlash(null), 1400)
    return () => window.clearTimeout(t)
  }, [focusRequest])

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

  function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    if (e.button !== 0) return
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
    const tile = pointerToTile(e)
    if (!hover || hover.x !== tile.x || hover.y !== tile.y) setHover(tile)
  }

  function handleContextMenu(e: React.MouseEvent<HTMLCanvasElement>) {
    e.preventDefault()
    const marker = markerAtPointer(e)
    if (marker) removeMarker(marker.id)
  }

  return (
  <section aria-label="Overworld map" className="dw-window relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
  <h1 className="font-display pointer-events-none absolute inset-x-0 top-1.5 z-10 text-center text-[10px] leading-none text-primary [text-shadow:0_0_3px_#000,0_0_3px_#000]">
        DWR <span className="text-foreground">Tracker</span>
      </h1>
      <div ref={containerRef} className="flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-[#050508]">
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={`Overworld map, ${exploredPct}% explored, ${markers.length} markers placed`}
          style={{ width: canvasPx, height: canvasPx, cursor: 'crosshair', touchAction: 'none', imageRendering: 'pixelated' }}
          className="block"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerLeave={() => setHover(null)}
          onContextMenu={handleContextMenu}
        />
      </div>
    </section>
  )
}
