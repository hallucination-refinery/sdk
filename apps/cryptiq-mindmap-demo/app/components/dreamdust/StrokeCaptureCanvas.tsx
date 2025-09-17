'use client'

import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'

export type StrokePoint = {
  x: number
  y: number
  pressure: number
  t: number
}

export type StrokeSegment = {
  from: StrokePoint
  to: StrokePoint
  pressure: number
  t: number
}

export type StrokeCaptureCanvasProps = {
  className?: string
  style?: CSSProperties
  strokeStyle?: string
  lineWidth?: number
  onStrokeStart?(point: StrokePoint): void
  onStrokeSegment?(segment: StrokeSegment): void
  onStrokeEnd?(): void
}

const DEFAULT_STROKE_STYLE = 'rgba(255,255,255,0.8)'
const DEFAULT_LINE_WIDTH = 16
const MAX_DPR = 1.5

const StrokeCaptureCanvas = ({
  className,
  style,
  strokeStyle = DEFAULT_STROKE_STYLE,
  lineWidth = DEFAULT_LINE_WIDTH,
  onStrokeStart,
  onStrokeSegment,
  onStrokeEnd,
}: StrokeCaptureCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const dprRef = useRef(1)
  const isDrawingRef = useRef(false)
  const lastPointRef = useRef<StrokePoint | null>(null)

  const startCallbackRef = useRef<((point: StrokePoint) => void) | null>(
    onStrokeStart ?? null,
  )
  const segmentCallbackRef = useRef<((segment: StrokeSegment) => void) | null>(
    onStrokeSegment ?? null,
  )
  const endCallbackRef = useRef<(() => void) | null>(onStrokeEnd ?? null)
  const strokeStyleRef = useRef(strokeStyle)
  const lineWidthRef = useRef(lineWidth)

  useEffect(() => {
    startCallbackRef.current = onStrokeStart ?? null
  }, [onStrokeStart])

  useEffect(() => {
    segmentCallbackRef.current = onStrokeSegment ?? null
  }, [onStrokeSegment])

  useEffect(() => {
    endCallbackRef.current = onStrokeEnd ?? null
  }, [onStrokeEnd])

  useEffect(() => {
    strokeStyleRef.current = strokeStyle
  }, [strokeStyle])

  useEffect(() => {
    lineWidthRef.current = lineWidth
  }, [lineWidth])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    ctxRef.current = context

    const applyStrokeStyle = () => {
      const ctx = ctxRef.current
      if (!ctx) return
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.strokeStyle = strokeStyleRef.current
      ctx.lineWidth = lineWidthRef.current * dprRef.current
    }

    const rect = () => canvas.getBoundingClientRect()

    const resize = () => {
      dprRef.current = Math.min(window.devicePixelRatio || 1, MAX_DPR)
      const { width, height } = rect()
      const nextWidth = Math.max(Math.floor(width * dprRef.current), 1)
      const nextHeight = Math.max(Math.floor(height * dprRef.current), 1)
      if (canvas.width !== nextWidth) {
        canvas.width = nextWidth
      }
      if (canvas.height !== nextHeight) {
        canvas.height = nextHeight
      }
      context.setTransform(dprRef.current, 0, 0, dprRef.current, 0, 0)
      context.clearRect(0, 0, canvas.width, canvas.height)
      applyStrokeStyle()
    }

    resize()

    let resizeFrame = 0
    const onResize = () => {
      if (resizeFrame) cancelAnimationFrame(resizeFrame)
      resizeFrame = requestAnimationFrame(() => {
        resizeFrame = 0
        resize()
      })
    }

    window.addEventListener('resize', onResize)

    const toPoint = (event: PointerEvent): StrokePoint => {
      const bounds = rect()
      const x = event.clientX - bounds.left
      const y = event.clientY - bounds.top
      let pressure = event.pressure
      if (pressure === undefined) {
        pressure = event.buttons ? 0.5 : 0
      } else if (pressure === 0 && event.buttons) {
        pressure = 0.5
      }
      return {
        x,
        y,
        pressure,
        t: event.timeStamp,
      }
    }

    const drawSegment = (from: StrokePoint, to: StrokePoint) => {
      const ctx = ctxRef.current
      if (!ctx) return
      applyStrokeStyle()
      ctx.beginPath()
      ctx.moveTo(from.x, from.y)
      const mx = (from.x + to.x) / 2
      const my = (from.y + to.y) / 2
      ctx.quadraticCurveTo(from.x, from.y, mx, my)
      ctx.stroke()
    }

    const finishStroke = () => {
      if (!isDrawingRef.current) return
      isDrawingRef.current = false
      lastPointRef.current = null
      endCallbackRef.current?.()
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (event.pointerType === 'mouse' && event.button !== 0) {
        return
      }
      event.preventDefault()
      canvas.setPointerCapture(event.pointerId)
      const point = toPoint(event)
      isDrawingRef.current = true
      lastPointRef.current = point
      applyStrokeStyle()
      startCallbackRef.current?.(point)
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (!isDrawingRef.current) return
      event.preventDefault()
      const point = toPoint(event)
      const last = lastPointRef.current
      if (!last) {
        lastPointRef.current = point
        return
      }
      drawSegment(last, point)
      segmentCallbackRef.current?.({
        from: last,
        to: point,
        pressure: point.pressure,
        t: point.t,
      })
      lastPointRef.current = point
    }

    const handlePointerUp = (event: PointerEvent) => {
      if (!isDrawingRef.current) return
      event.preventDefault()
      if (canvas.hasPointerCapture?.(event.pointerId)) {
        try {
          canvas.releasePointerCapture(event.pointerId)
        } catch {
          // ignore release errors
        }
      }
      finishStroke()
    }

    const handlePointerCancel = (event: PointerEvent) => {
      if (canvas.hasPointerCapture?.(event.pointerId)) {
        try {
          canvas.releasePointerCapture(event.pointerId)
        } catch {
          // ignore release errors
        }
      }
      finishStroke()
    }

    canvas.addEventListener('pointerdown', handlePointerDown, { passive: false })
    canvas.addEventListener('pointermove', handlePointerMove, { passive: false })
    canvas.addEventListener('pointerup', handlePointerUp, { passive: false })
    canvas.addEventListener('pointercancel', handlePointerCancel)
    canvas.addEventListener('pointerleave', handlePointerCancel)

    return () => {
      window.removeEventListener('resize', onResize)
      if (resizeFrame) cancelAnimationFrame(resizeFrame)
      canvas.removeEventListener('pointerdown', handlePointerDown)
      canvas.removeEventListener('pointermove', handlePointerMove)
      canvas.removeEventListener('pointerup', handlePointerUp)
      canvas.removeEventListener('pointercancel', handlePointerCancel)
      canvas.removeEventListener('pointerleave', handlePointerCancel)
      finishStroke()
      ctxRef.current = null
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ ...style, touchAction: 'none' }}
    />
  )
}

export default StrokeCaptureCanvas
