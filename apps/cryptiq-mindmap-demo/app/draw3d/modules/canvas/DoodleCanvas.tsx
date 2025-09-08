import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import type { DoodleCanvasHandle } from '../types'

type Point = { x: number; y: number }
type BBox = { minX: number; minY: number; maxX: number; maxY: number }

function union(b: BBox | null, x: number, y: number): BBox {
  if (!b) return { minX: x, minY: y, maxX: x, maxY: y }
  if (x < b.minX) b.minX = x
  if (y < b.minY) b.minY = y
  if (x > b.maxX) b.maxX = x
  if (y > b.maxY) b.maxY = y
  return b
}

const DoodleCanvas = forwardRef<DoodleCanvasHandle>((_, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dpr = useRef(1)
  const isDrawing = useRef(false)
  const last = useRef<Point | null>(null)
  const strokes = useRef<Point[][]>([])
  const bbox = useRef<BBox | null>(null)
  const length = useRef(0)

  const start = (x: number, y: number) => {
    isDrawing.current = true
    last.current = { x, y }
    strokes.current.push([{ x, y }])
    bbox.current = union(bbox.current, x, y)
  }

  const move = (x: number, y: number) => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    const stroke = strokes.current[strokes.current.length - 1]
    if (!isDrawing.current || !ctx || !last.current || !stroke) return
    stroke.push({ x, y })
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineWidth = 16 * dpr.current
    ctx.strokeStyle = 'rgba(255,255,255,0.8)'
    const { x: lx, y: ly } = last.current
    ctx.beginPath()
    ctx.moveTo(lx, ly)
    const mx = (lx + x) / 2
    const my = (ly + y) / 2
    ctx.quadraticCurveTo(lx, ly, mx, my)
    ctx.stroke()
    last.current = { x, y }
    bbox.current = union(bbox.current, x, y)
    const dx = x - lx
    const dy = y - ly
    length.current += Math.hypot(dx, dy)
  }

  const end = () => {
    isDrawing.current = false
    last.current = null
  }

  const redraw = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (const stroke of strokes.current) {
      if (!stroke.length) continue
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.lineWidth = 16 * dpr.current
      ctx.strokeStyle = 'rgba(255,255,255,0.8)'
      ctx.beginPath()
      const [p0, ...rest] = stroke
      ctx.moveTo(p0.x, p0.y)
      let prev = p0
      for (const p of rest) {
        const mx = (prev.x + p.x) / 2
        const my = (prev.y + p.y) / 2
        ctx.quadraticCurveTo(prev.x, prev.y, mx, my)
        prev = p
      }
      ctx.stroke()
    }
  }

  const clear = () => {
    strokes.current = []
    bbox.current = null
    length.current = 0
    redraw()
  }

  const undo = () => {
    strokes.current.pop()
    bbox.current = null
    length.current = 0
    for (const stroke of strokes.current) {
      let prev: Point | null = null
      for (const p of stroke) {
        bbox.current = union(bbox.current, p.x, p.y)
        if (prev) {
          length.current += Math.hypot(p.x - prev.x, p.y - prev.y)
        }
        prev = p
      }
    }
    redraw()
  }

  useImperativeHandle(ref, () => ({
    clear,
    undo,
    toCanvas: () => canvasRef.current,
    getInkMetrics: () => {
      const b = bbox.current
      const area = b ? (b.maxX - b.minX) * (b.maxY - b.minY) : 0
      return { area, length: length.current }
    },
  }))

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.style.width = '100%'
    canvas.style.height = '100%'

    const rect = () => canvas.getBoundingClientRect()

    const resize = () => {
      dpr.current = Math.min(window.devicePixelRatio || 1, 1.5)
      const { width, height } = rect()
      canvas.width = width * dpr.current
      canvas.height = height * dpr.current
      ctx.setTransform(dpr.current, 0, 0, dpr.current, 0, 0)
      redraw()
    }

    resize()

    let frame = 0
    const onResize = () => {
      if (frame) cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        frame = 0
        resize()
      })
    }
    window.addEventListener('resize', onResize)

    const onPointerDown = (e: PointerEvent) => {
      e.preventDefault()
      canvas.setPointerCapture(e.pointerId)
      const r = rect()
      start(e.clientX - r.left, e.clientY - r.top)
    }
    const onPointerMove = (e: PointerEvent) => {
      if (!isDrawing.current) return
      e.preventDefault()
      const r = rect()
      move(e.clientX - r.left, e.clientY - r.top)
    }
    const onPointerUp = (e: PointerEvent) => {
      if (!isDrawing.current) return
      e.preventDefault()
      end()
    }

    canvas.addEventListener('pointerdown', onPointerDown, { passive: false })
    canvas.addEventListener('pointermove', onPointerMove, { passive: false })
    canvas.addEventListener('pointerup', onPointerUp, { passive: false })

    return () => {
      window.removeEventListener('resize', onResize)
      if (frame) cancelAnimationFrame(frame)
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerup', onPointerUp)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, zIndex: 1, touchAction: 'none' }}
    />
  )
})

// for clearer debugging and linting
DoodleCanvas.displayName = 'DoodleCanvas'

export default DoodleCanvas
