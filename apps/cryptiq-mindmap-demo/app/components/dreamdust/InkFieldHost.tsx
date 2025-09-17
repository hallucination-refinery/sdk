'use client'

import * as React from 'react'

import { getR3FStateOrNull } from '../anim/r3fSafe'
import { detectVertexTextureSupport } from './capabilities'
import { createInkField, type InkField } from './InkField'
import { useDreamdustCtx } from './context'

const DEFAULT_PRESSURE = 0.5
const INTENSITY_EPSILON = 0.01
const INTENSITY_IDLE_ZERO_MS = 2400
const DECAY_BASE = 0.96

interface StrokePoint {
  x: number
  y: number
}

interface StrokeSegment {
  points: StrokePoint[]
  pressure: number
}

type StrokeCaptureSubscriber = (segment: StrokeSegment) => void

type StrokeCaptureCanvasHandle = {
  subscribe(handler: StrokeCaptureSubscriber): () => void
}

function clamp01(value: number): number {
  if (value <= 0) return 0
  if (value >= 1) return 1
  return value
}

const StrokeCaptureCanvas = React.forwardRef<StrokeCaptureCanvasHandle>((_, ref) => {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null)
  const subscribersRef = React.useRef(new Set<StrokeCaptureSubscriber>())
  const pointerIdRef = React.useRef<number | null>(null)
  const lastPointRef = React.useRef<StrokePoint | null>(null)

  const emitSegment = React.useCallback((points: StrokePoint[], pressure: number) => {
    if (!points.length) return
    const normalizedPressure = pressure > 0 ? pressure : DEFAULT_PRESSURE
    const clampedPressure = clamp01(normalizedPressure)
    const segment: StrokeSegment = { points, pressure: clampedPressure }
    subscribersRef.current.forEach((handler) => handler(segment))
  }, [])

  React.useImperativeHandle(ref, () => ({
    subscribe(handler: StrokeCaptureSubscriber) {
      subscribersRef.current.add(handler)
      return () => {
        subscribersRef.current.delete(handler)
      }
    },
  }))

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      const rect = parent.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
    }

    resize()
    window.addEventListener('resize', resize)

    const resolvePoint = (event: PointerEvent): StrokePoint | null => {
      const rect = canvas.getBoundingClientRect()
      const width = rect.width || 1
      const height = rect.height || 1
      if (width <= 0 || height <= 0) {
        return null
      }
      const x = clamp01((event.clientX - rect.left) / width)
      const y = clamp01((event.clientY - rect.top) / height)
      return { x, y }
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (pointerIdRef.current !== null && pointerIdRef.current !== event.pointerId) {
        return
      }
      const point = resolvePoint(event)
      if (!point) return
      pointerIdRef.current = event.pointerId
      lastPointRef.current = point
      try {
        canvas.setPointerCapture(event.pointerId)
      } catch {
        // ignore pointer capture failures (e.g., Safari)
      }
      emitSegment([point], event.pressure)
      event.preventDefault()
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (pointerIdRef.current !== event.pointerId) return
      const point = resolvePoint(event)
      if (!point) return
      const lastPoint = lastPointRef.current
      lastPointRef.current = point
      if (lastPoint) {
        emitSegment([lastPoint, point], event.pressure)
      } else {
        emitSegment([point], event.pressure)
      }
      event.preventDefault()
    }

    const finishStroke = (event: PointerEvent) => {
      if (pointerIdRef.current !== event.pointerId) return
      pointerIdRef.current = null
      lastPointRef.current = null
      try {
        if (canvas.hasPointerCapture(event.pointerId)) {
          canvas.releasePointerCapture(event.pointerId)
        }
      } catch {
        // ignore errors when releasing pointer capture
      }
      event.preventDefault()
    }

    canvas.addEventListener('pointerdown', handlePointerDown, { passive: false })
    canvas.addEventListener('pointermove', handlePointerMove, { passive: false })
    canvas.addEventListener('pointerup', finishStroke, { passive: false })
    canvas.addEventListener('pointercancel', finishStroke, { passive: false })
    canvas.addEventListener('pointerleave', finishStroke, { passive: false })

    return () => {
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('pointerdown', handlePointerDown)
      canvas.removeEventListener('pointermove', handlePointerMove)
      canvas.removeEventListener('pointerup', finishStroke)
      canvas.removeEventListener('pointercancel', finishStroke)
      canvas.removeEventListener('pointerleave', finishStroke)
    }
  }, [emitSegment])

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        pointerEvents: 'auto',
        touchAction: 'none',
        background: 'transparent',
        cursor: 'crosshair',
      }}
    />
  )
})

StrokeCaptureCanvas.displayName = 'StrokeCaptureCanvas'

function decayRateFromDelta(deltaMs: number): number {
  if (deltaMs <= 0) return DECAY_BASE
  const steps = Math.max(1, (deltaMs / 1000) * 60)
  return Math.pow(DECAY_BASE, steps)
}

function nowMs(): number {
  if (typeof performance !== 'undefined') {
    return performance.now()
  }
  return Date.now()
}

export function InkFieldHost(): JSX.Element {
  const { setInkTex, setInkIntensity, setVertexInkOk } = useDreamdustCtx()
  const [captureHandle, setCaptureHandle] = React.useState<StrokeCaptureCanvasHandle | null>(null)

  const inkFieldRef = React.useRef<InkField | null>(null)
  const rendererRef = React.useRef<import('three').WebGLRenderer | null>(null)
  const textureRef = React.useRef<import('three').CanvasTexture | null>(null)
  const lastStrokeRef = React.useRef<number>(0)
  const intensityRef = React.useRef<number>(0)
  const vertexInkOkRef = React.useRef<boolean | null>(null)

  const handleCaptureRef = React.useCallback((handle: StrokeCaptureCanvasHandle | null) => {
    setCaptureHandle(handle)
  }, [])

  React.useEffect(() => {
    setInkIntensity(0)
    return () => {
      setInkTex(() => undefined)
      setInkIntensity(0)
      setVertexInkOk(false)
      inkFieldRef.current?.dispose()
      inkFieldRef.current = null
      rendererRef.current = null
      textureRef.current = null
    }
  }, [setInkIntensity, setInkTex, setVertexInkOk])

  React.useEffect(() => {
    if (typeof window === 'undefined') return
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    const field = createInkField(128, dpr)
    inkFieldRef.current = field
    return () => {
      field.dispose()
      inkFieldRef.current = null
    }
  }, [])

  React.useEffect(() => {
    if (typeof window === 'undefined') return
    let cancelled = false
    let frame = 0

    const tryAcquireRenderer = () => {
      if (cancelled) return
      const state = getR3FStateOrNull()
      const renderer = state?.gl ?? null
      if (renderer) {
        rendererRef.current = renderer
        const gl = renderer.getContext()
        const supported = detectVertexTextureSupport(gl)
        if (vertexInkOkRef.current !== supported) {
          vertexInkOkRef.current = supported
          setVertexInkOk(supported)
        }
        const field = inkFieldRef.current
        if (field) {
          const texture = field.toCanvasTexture(renderer, 60)
          textureRef.current = texture
          setInkTex(texture)
        }
        return
      }
      frame = window.requestAnimationFrame(tryAcquireRenderer)
    }

    frame = window.requestAnimationFrame(tryAcquireRenderer)

    return () => {
      cancelled = true
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [setInkTex, setVertexInkOk])

  React.useEffect(() => {
    if (!captureHandle) return undefined
    const field = inkFieldRef.current
    if (!field) return undefined

    const unsubscribe = captureHandle.subscribe((segment) => {
      if (!segment.points.length) return
      const activeField = inkFieldRef.current
      if (!activeField) return
      activeField.drawStroke(segment.points, segment.pressure)
      const now = nowMs()
      lastStrokeRef.current = now
      intensityRef.current = 1
      setInkIntensity(1)
    })

    return () => {
      unsubscribe()
    }
  }, [captureHandle, setInkIntensity])

  React.useEffect(() => {
    if (typeof window === 'undefined') return
    let frame = 0
    let lastTick = nowMs()

    const loop = (timestamp: number) => {
      const field = inkFieldRef.current
      if (field) {
        const delta = timestamp - lastTick
        lastTick = timestamp
        const rate = decayRateFromDelta(delta)
        field.decay(rate)
        const renderer = rendererRef.current
        if (renderer) {
          const texture = field.toCanvasTexture(renderer, 60)
          if (textureRef.current !== texture) {
            textureRef.current = texture
            setInkTex(texture)
          }
        }
      }

      const lastStroke = lastStrokeRef.current
      let targetIntensity = 0
      if (lastStroke > 0) {
        const idle = timestamp - lastStroke
        if (idle <= 16) {
          targetIntensity = 1
        } else if (idle < INTENSITY_IDLE_ZERO_MS) {
          targetIntensity = Math.exp(-idle / 900)
        } else {
          targetIntensity = 0
        }
      }

      const current = intensityRef.current
      if (Math.abs(targetIntensity - current) > INTENSITY_EPSILON) {
        intensityRef.current = targetIntensity
        setInkIntensity(targetIntensity)
      } else if (targetIntensity === 0 && current !== 0) {
        intensityRef.current = 0
        setInkIntensity(0)
      }

      frame = window.requestAnimationFrame(loop)
    }

    frame = window.requestAnimationFrame(loop)

    return () => {
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [setInkIntensity, setInkTex])

  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 2,
        pointerEvents: 'none',
      }}
    >
      <StrokeCaptureCanvas ref={handleCaptureRef} />
    </div>
  )
}
