'use client'

import * as React from 'react'

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
  style?: React.CSSProperties
  onStrokeStart?(point: StrokePoint): void
  onStrokeSegment?(segment: StrokeSegment): void
  onStrokeEnd?(): void
}

const MAX_DPR = 1.5
const DEFAULT_PRESSURE = 0.5

const clamp01 = (value: number): number => {
  if (!Number.isFinite(value)) {
    return 0
  }
  if (value <= 0) return 0
  if (value >= 1) return 1
  return value
}

const resolvePressure = (event: PointerEvent): number => {
  const { pressure, buttons, pointerType } = event
  if (typeof pressure === 'number' && pressure > 0) {
    return pressure > 1 ? 1 : pressure
  }
  if (pointerType === 'mouse') {
    return buttons ? DEFAULT_PRESSURE : 0
  }
  if (typeof pressure === 'number') {
    return pressure
  }
  return DEFAULT_PRESSURE
}

export function StrokeCaptureCanvas({
  className,
  style,
  onStrokeStart,
  onStrokeSegment,
  onStrokeEnd,
}: StrokeCaptureCanvasProps): React.JSX.Element {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null)
  const pointerIdRef = React.useRef<number | null>(null)
  const isDrawingRef = React.useRef(false)
  const lastPointRef = React.useRef<StrokePoint | null>(null)
  const lastSmoothedRef = React.useRef<StrokePoint | null>(null)

  const startCallbackRef = React.useRef<StrokeCaptureCanvasProps['onStrokeStart']>(
    onStrokeStart,
  )
  const segmentCallbackRef = React.useRef<StrokeCaptureCanvasProps['onStrokeSegment']>(
    onStrokeSegment,
  )
  const endCallbackRef = React.useRef<StrokeCaptureCanvasProps['onStrokeEnd']>(
    onStrokeEnd,
  )

  React.useEffect(() => {
    startCallbackRef.current = onStrokeStart
  }, [onStrokeStart])

  React.useEffect(() => {
    segmentCallbackRef.current = onStrokeSegment
  }, [onStrokeSegment])

  React.useEffect(() => {
    endCallbackRef.current = onStrokeEnd
  }, [onStrokeEnd])

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined
    }

    const canvas = canvasRef.current
    if (!canvas) {
      return undefined
    }

    const updateCanvasSize = () => {
      if (!canvasRef.current) {
        return
      }
      const rect = canvasRef.current.getBoundingClientRect()
      const width = rect.width || 0
      const height = rect.height || 0

      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
      const nextWidth = Math.max(1, Math.round(width * dpr))
      const nextHeight = Math.max(1, Math.round(height * dpr))
      if (canvasRef.current.width !== nextWidth) {
        canvasRef.current.width = nextWidth
      }
      if (canvasRef.current.height !== nextHeight) {
        canvasRef.current.height = nextHeight
      }
    }

    updateCanvasSize()

    let resizeFrame = 0
    const handleResize = () => {
      if (resizeFrame) {
        window.cancelAnimationFrame(resizeFrame)
      }
      resizeFrame = window.requestAnimationFrame(() => {
        resizeFrame = 0
        updateCanvasSize()
      })
    }

    window.addEventListener('resize', handleResize)

    const resolvePoint = (event: PointerEvent): StrokePoint | null => {
      const canvasElement = canvasRef.current
      if (!canvasElement) {
        return null
      }
      const rect = canvasElement.getBoundingClientRect()
      const width = rect.width || 0
      const height = rect.height || 0
      if (width <= 0 || height <= 0) {
        return null
      }

      const normalizedX = clamp01((event.clientX - rect.left) / width)
      const normalizedY = clamp01((event.clientY - rect.top) / height)
      const pressure = resolvePressure(event)

      return {
        x: normalizedX,
        y: normalizedY,
        pressure,
        t: event.timeStamp,
      }
    }

    const finishStroke = (event?: PointerEvent) => {
      if (!isDrawingRef.current) {
        return
      }

      const pointerId = pointerIdRef.current
      if (pointerId !== null && canvas.hasPointerCapture?.(pointerId)) {
        try {
          canvas.releasePointerCapture(pointerId)
        } catch {
          // Ignore capture release errors (e.g., Safari quirks)
        }
      }

      let terminalPoint = lastPointRef.current
      if (event) {
        const maybePoint = resolvePoint(event)
        if (maybePoint) {
          terminalPoint = maybePoint
        }
      }

      if (terminalPoint && lastSmoothedRef.current && segmentCallbackRef.current) {
        const from = lastSmoothedRef.current
        const to = terminalPoint
        const pressure = to.pressure > 0 ? to.pressure : from.pressure || DEFAULT_PRESSURE
        segmentCallbackRef.current({
          from: { ...from, t: to.t },
          to: { ...to },
          pressure,
          t: to.t,
        })
      }

      isDrawingRef.current = false
      pointerIdRef.current = null
      lastPointRef.current = null
      lastSmoothedRef.current = null
      endCallbackRef.current?.()
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (event.pointerType === 'mouse' && event.button !== 0) {
        return
      }
      if (isDrawingRef.current && pointerIdRef.current !== event.pointerId) {
        return
      }

      const point = resolvePoint(event)
      if (!point) {
        return
      }

      event.preventDefault()

      pointerIdRef.current = event.pointerId
      isDrawingRef.current = true
      lastPointRef.current = point
      lastSmoothedRef.current = point

      try {
        canvas.setPointerCapture(event.pointerId)
      } catch {
        // ignore pointer capture failures (e.g., Safari)
      }

      startCallbackRef.current?.(point)
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (!isDrawingRef.current || pointerIdRef.current !== event.pointerId) {
        return
      }

      const point = resolvePoint(event)
      if (!point) {
        return
      }

      const lastPoint = lastPointRef.current
      if (!lastPoint) {
        lastPointRef.current = point
        lastSmoothedRef.current = point
        return
      }

      const smoothingStart = lastSmoothedRef.current ?? lastPoint
      const midPoint: StrokePoint = {
        x: (lastPoint.x + point.x) / 2,
        y: (lastPoint.y + point.y) / 2,
        pressure: point.pressure > 0 ? point.pressure : lastPoint.pressure || DEFAULT_PRESSURE,
        t: point.t,
      }

      if (segmentCallbackRef.current) {
        const segment: StrokeSegment = {
          from: {
            x: smoothingStart.x,
            y: smoothingStart.y,
            pressure: smoothingStart.pressure,
            t: lastPoint.t,
          },
          to: midPoint,
          pressure: midPoint.pressure,
          t: point.t,
        }
        segmentCallbackRef.current(segment)
      }

      lastPointRef.current = point
      lastSmoothedRef.current = midPoint
    }

    const handlePointerUp = (event: PointerEvent) => {
      if (!isDrawingRef.current || pointerIdRef.current !== event.pointerId) {
        return
      }
      event.preventDefault()
      finishStroke(event)
    }

    const handlePointerCancel = (event: PointerEvent) => {
      if (pointerIdRef.current !== event.pointerId) {
        return
      }
      finishStroke(event)
    }

    canvas.addEventListener('pointerdown', handlePointerDown, { passive: false })
    canvas.addEventListener('pointermove', handlePointerMove, { passive: false })
    canvas.addEventListener('pointerup', handlePointerUp, { passive: false })
    canvas.addEventListener('pointercancel', handlePointerCancel)
    canvas.addEventListener('pointerleave', handlePointerCancel)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (resizeFrame) {
        window.cancelAnimationFrame(resizeFrame)
      }
      canvas.removeEventListener('pointerdown', handlePointerDown)
      canvas.removeEventListener('pointermove', handlePointerMove)
      canvas.removeEventListener('pointerup', handlePointerUp)
      canvas.removeEventListener('pointercancel', handlePointerCancel)
      canvas.removeEventListener('pointerleave', handlePointerCancel)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        touchAction: 'none',
        pointerEvents: 'auto',
        background: 'transparent',
        ...style,
      }}
    />
  )
}
