'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export const CLEAR_DRAWING_EVENT = 'tracker:clear-drawing'

const INK = '#FCE020'
const LINE_WIDTH = 3

const PENCIL_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="${INK}" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>`
const PENCIL_CURSOR = `url("data:image/svg+xml,${encodeURIComponent(PENCIL_SVG)}") 2 22, crosshair`

const INTERACTIVE = 'button, a, input, select, textarea, label, canvas, [role="dialog"], [role="menu"], [contenteditable="true"]'

type Point = { x: number; y: number }

export function DrawingLayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const strokesRef = useRef<Point[][]>([])
  const activeStrokeRef = useRef<Point[] | null>(null)
  const [penActive, setPenActive] = useState(false)

  const redraw = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const dpr = window.devicePixelRatio || 1
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.strokeStyle = INK
    ctx.lineWidth = LINE_WIDTH
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    for (const stroke of strokesRef.current) {
      if (stroke.length === 0) continue
      ctx.beginPath()
      ctx.moveTo(stroke[0].x, stroke[0].y)
      if (stroke.length === 1) ctx.lineTo(stroke[0].x + 0.01, stroke[0].y)
      for (let i = 1; i < stroke.length; i++) ctx.lineTo(stroke[i].x, stroke[i].y)
      ctx.stroke()
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const root = canvas?.parentElement
    if (!canvas || !root) return
    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = Math.round(root.clientWidth * dpr)
      canvas.height = Math.round(root.clientHeight * dpr)
      redraw()
    }
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(root)
    return () => observer.disconnect()
  }, [redraw])

  useEffect(() => {
    const root = canvasRef.current?.parentElement
    if (!root) return
    const onContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (!target || target === canvasRef.current) return
      if (target.closest(INTERACTIVE)) return
      e.preventDefault()
      setPenActive(true)
    }
    const onClear = () => {
      strokesRef.current = []
      redraw()
    }
    root.addEventListener('contextmenu', onContextMenu)
    window.addEventListener(CLEAR_DRAWING_EVENT, onClear)
    return () => {
      root.removeEventListener('contextmenu', onContextMenu)
      window.removeEventListener(CLEAR_DRAWING_EVENT, onClear)
    }
  }, [redraw])

  useEffect(() => {
    if (!penActive) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPenActive(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [penActive])

  function toPoint(e: React.PointerEvent<HTMLCanvasElement>): Point {
    const rect = e.currentTarget.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    if (e.button !== 0) return
    e.currentTarget.setPointerCapture(e.pointerId)
    const stroke = [toPoint(e)]
    activeStrokeRef.current = stroke
    strokesRef.current.push(stroke)
    redraw()
  }

  function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    const stroke = activeStrokeRef.current
    if (!stroke) return
    stroke.push(toPoint(e))
    redraw()
  }

  function endStroke() {
    activeStrokeRef.current = null
  }

  function handleContextMenu(e: React.MouseEvent<HTMLCanvasElement>) {
    e.preventDefault()
    endStroke()
    setPenActive(false)
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 z-40 size-full"
      style={{
        pointerEvents: penActive ? 'auto' : 'none',
        cursor: penActive ? PENCIL_CURSOR : undefined,
        touchAction: 'none',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endStroke}
      onPointerCancel={endStroke}
      onContextMenu={handleContextMenu}
    />
  )
}
