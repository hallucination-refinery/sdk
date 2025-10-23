'use client'

import * as React from 'react'

import { getR3FStateOrNull } from '../anim/r3fSafe'
import { detectVertexTextureSupport } from './capabilities'
import { createInkField, type InkField } from './InkField'
import {
  getDreamdustTunables,
  markInkFrameCandidate,
  markInkPenDown,
  subscribeDreamdustTunables,
} from './metrics'
import { StrokeCaptureCanvas, type StrokePoint, type StrokeSegment } from './StrokeCaptureCanvas'
import { useDreamdustCtx } from './context'

type RendererLike = {
  getContext: () => WebGLRenderingContext | WebGL2RenderingContext
  domElement?: HTMLCanvasElement
}

type CanvasTextureLike = {
  needsUpdate?: boolean
  dispose?: () => void
}

const FIELD_SIZE = 128
const MAX_DPR = 1.5
const UPLOAD_HZ = 60
const INTENSITY_EPSILON = 0.01
const DEFAULT_PRESSURE = 0.5
const SHORT_TAP_MS = 120
const LONG_STROKE_MS = 250
const SHORT_TRAVEL_PX = 20
const LONG_TRAVEL_PX = 120
const DEFAULT_DECAY_BASE = 0.98
const DEFAULT_TAP_TAU = 900
const IDLE_ZERO_RATIO = 2400 / 900

const clamp = (value: number, min: number, max: number) => {
  if (value < min) return min
  if (value > max) return max
  return value
}

const hueToRgb = (hue: number): [number, number, number] => {
  const normalized = ((hue % 1) + 1) % 1
  const sector = Math.floor(normalized * 6)
  const f = normalized * 6 - sector
  const saturation = 0.85
  const value = 1
  const p = value * (1 - saturation)
  const q = value * (1 - saturation * f)
  const t = value * (1 - saturation * (1 - f))
  switch (sector % 6) {
    case 0:
      return [value, t, p]
    case 1:
      return [q, value, p]
    case 2:
      return [p, value, t]
    case 3:
      return [p, q, value]
    case 4:
      return [t, p, value]
    default:
      return [value, p, q]
  }
}

function nowMs(): number {
  if (typeof performance !== 'undefined') {
    return performance.now()
  }
  return Date.now()
}

function decayRateFromDelta(deltaMs: number, base: number): number {
  const clampedBase = Number.isFinite(base) ? Math.min(Math.max(base, 0), 0.999999) : DEFAULT_DECAY_BASE
  const decayBase = clampedBase > 0 ? clampedBase : DEFAULT_DECAY_BASE
  if (deltaMs <= 0) {
    return decayBase
  }
  const steps = Math.max(1, (deltaMs / 1000) * 60)
  return Math.pow(decayBase, steps)
}

export function InkFieldHost(): React.JSX.Element {
  const {
    startCascade,
    setInkTex,
    setInkIntensity,
    setVertexInkOk,
    setControlsLocked,
    heatmapVisible,
    setHeatmapVisible,
  } = useDreamdustCtx()
  type InkTexState = Parameters<typeof setInkTex>[0]

  const inkFieldRef = React.useRef<InkField | null>(null)
  const rendererRef = React.useRef<RendererLike | null>(null)
  const textureRef = React.useRef<CanvasTextureLike | null>(null)
  const lastStrokeRef = React.useRef(0)
  const intensityRef = React.useRef(0)
  const vertexInkOkRef = React.useRef<boolean | null>(null)
  const [drawEnabled, setDrawEnabled] = React.useState(true)
  const heatmapRef = React.useRef<HTMLCanvasElement | null>(null)
  const lockedControlsRef = React.useRef<{ controls: { enabled?: boolean }; prevEnabled: boolean } | null>(
    null,
  )
  const loggedInkOnceRef = React.useRef(false)
  const tunablesRef = React.useRef(getDreamdustTunables())
  type StrokeStats = {
    startTime: number
    lastTime: number
    totalTravelPx: number
    sumPressure: number
    sampleCount: number
    sumSin: number
    sumCos: number
    sumWeight: number
  }
  const strokeStatsRef = React.useRef<StrokeStats | null>(null)
  const strokeCanvasElementRef = React.useRef<HTMLCanvasElement | null>(null)

  const lockControls = React.useCallback(() => {
    try {
      const state = getR3FStateOrNull()
      const controls = state?.controls as { enabled?: boolean } | undefined
      if (controls && typeof controls === 'object') {
        const prev = typeof controls.enabled === 'boolean' ? controls.enabled : true
        ;(controls as { enabled: boolean }).enabled = false
        lockedControlsRef.current = { controls, prevEnabled: prev }
        return
      }
    } catch {
      // ignore
    }
    lockedControlsRef.current = null
  }, [])

  const unlockControls = React.useCallback(() => {
    const locked = lockedControlsRef.current
    lockedControlsRef.current = null
    if (!locked) {
      return
    }
    try {
      ;(locked.controls as { enabled: boolean }).enabled = locked.prevEnabled
    } catch {
      // ignore restore failures
    }
  }, [])

  const pushTextureUpdate = React.useCallback(
    (field: InkField) => {
      const renderer = rendererRef.current
      if (!renderer) {
        return
      }
      const texture = field.toCanvasTexture(
        renderer as Parameters<InkField['toCanvasTexture']>[0],
        UPLOAD_HZ,
      )
      if (textureRef.current !== texture) {
        textureRef.current = texture
        setInkTex(texture as InkTexState)
      }
    },
    [setInkTex],
  )

  const handleCanvasElement = React.useCallback((canvas: HTMLCanvasElement | null) => {
    strokeCanvasElementRef.current = canvas
  }, [])

  const handleStrokeStart = React.useCallback(
    (point: StrokePoint) => {
      markInkPenDown()
      lockControls()
      setControlsLocked(true)
      const now = nowMs()
      lastStrokeRef.current = now
      const { tapGain } = tunablesRef.current
      const gain = Number.isFinite(tapGain) ? Math.max(0, tapGain) : 1
      const pressure = clamp(point.pressure > 0 ? point.pressure : DEFAULT_PRESSURE, 0, 1)
      const baseImpulse = clamp((0.55 + pressure * 0.4) * gain, 0, 1)
      if (Math.abs(baseImpulse - intensityRef.current) > INTENSITY_EPSILON) {
        intensityRef.current = baseImpulse
        setInkIntensity(baseImpulse)
      }
      strokeStatsRef.current = {
        startTime: point.t,
        lastTime: point.t,
        totalTravelPx: 0,
        sumPressure: pressure,
        sampleCount: 1,
        sumSin: 0,
        sumCos: 0,
        sumWeight: 0,
      }
      const field = inkFieldRef.current
      if (field) {
        field.drawStroke(
          [
            {
              x: point.x,
              y: point.y,
              t: point.t,
              pressure: point.pressure,
            },
          ],
          pressure,
        )
        pushTextureUpdate(field)
        markInkFrameCandidate()
      }
      // One-time debug of caps/viewport/intensity on first stroke
      if (!loggedInkOnceRef.current) {
        if (process.env.NODE_ENV !== 'production') {
          try {
            const state = getR3FStateOrNull()
            const vpW = state?.viewport.width ?? 0
            const vpH = state?.viewport.height ?? 0
            console.warn('[PC] ink debug (host)', {
              vertexInkOk: !!vertexInkOkRef.current,
              uViewport: [vpW, vpH],
              inkIntensity: baseImpulse,
            })
          } catch (error) {
            console.warn('[PC] ink debug (host) failed', error)
          }
        }
        loggedInkOnceRef.current = true
      }
    },
    [lockControls, pushTextureUpdate, setControlsLocked, setInkIntensity],
  )

  const handleStrokeSegment = React.useCallback(
    (segment: StrokeSegment) => {
      const field = inkFieldRef.current
      if (!field) {
        return
      }

      const pressure = clamp(segment.pressure > 0 ? segment.pressure : DEFAULT_PRESSURE, 0, 1)
      field.drawStroke(
        [
          { ...segment.from },
          { ...segment.to },
        ],
        pressure,
      )

      const stats = strokeStatsRef.current
      let pxPerFrame = 0
      if (stats) {
        const canvas = strokeCanvasElementRef.current
        const rect = canvas?.getBoundingClientRect()
        let width = rect?.width ?? 0
        let height = rect?.height ?? 0
        if (width <= 0 && canvas?.width) {
          width = canvas.width
        }
        if (height <= 0 && canvas?.height) {
          height = canvas.height
        }
        if ((width <= 0 || height <= 0) && typeof window !== 'undefined') {
          width = width || window.innerWidth || 0
          height = height || window.innerHeight || 0
        }
        const dxPx = (segment.to.x - segment.from.x) * width
        const dyPx = (segment.to.y - segment.from.y) * height
        const distancePx = Math.hypot(dxPx, dyPx)
        if (Number.isFinite(distancePx) && distancePx > 0) {
          const previousTime = Number.isFinite(stats.lastTime)
            ? stats.lastTime
            : segment.t
          const deltaMs = Math.max(1, segment.t - previousTime)
          pxPerFrame = (distancePx / deltaMs) * 16
          const weight = distancePx
          const angle = Math.atan2(dyPx, dxPx)
          stats.totalTravelPx += distancePx
          stats.sumSin += Math.sin(angle) * weight
          stats.sumCos += Math.cos(angle) * weight
          stats.sumWeight += weight
        }
        stats.sumPressure += pressure
        stats.sampleCount += 1
        stats.lastTime = segment.t
      }

      const now = nowMs()
      lastStrokeRef.current = now
      const velocityBoost = Math.min(0.35, Math.max(0, pxPerFrame) * 0.02)
      const { tapGain } = tunablesRef.current
      const gain = Number.isFinite(tapGain) ? Math.max(0, tapGain) : 1
      const dynamicIntensity = clamp((0.65 + pressure * 0.35 + velocityBoost) * gain, 0, 1)
      if (dynamicIntensity - intensityRef.current > INTENSITY_EPSILON) {
        intensityRef.current = dynamicIntensity
        setInkIntensity(dynamicIntensity)
      }

      pushTextureUpdate(field)
      markInkFrameCandidate()
    },
    [pushTextureUpdate, setInkIntensity],
  )

  const handleStrokeEnd = React.useCallback(() => {
    unlockControls()
    setControlsLocked(false)

    const stats = strokeStatsRef.current
    strokeStatsRef.current = null

    const now = nowMs()
    lastStrokeRef.current = now

    if (!stats) {
      return
    }

    const endTime = Number.isFinite(stats.lastTime) ? stats.lastTime : stats.startTime
    const durationMs = Math.max(0, endTime - stats.startTime)
    const travelPx = Number.isFinite(stats.totalTravelPx) ? stats.totalTravelPx : 0
    const averagePressure = clamp(stats.sumPressure / Math.max(1, stats.sampleCount), 0, 1)
    const { tapGain } = tunablesRef.current
    const gain = Number.isFinite(tapGain) ? Math.max(0, tapGain) : 1

    if (durationMs < SHORT_TAP_MS || travelPx < SHORT_TRAVEL_PX) {
      const impulse = clamp(
        Math.max(intensityRef.current, (0.45 + averagePressure * 0.4) * gain),
        0,
        1,
      )
      if (Math.abs(impulse - intensityRef.current) > INTENSITY_EPSILON) {
        intensityRef.current = impulse
        setInkIntensity(impulse)
      }
      return
    }

    if (durationMs > LONG_STROKE_MS && travelPx > LONG_TRAVEL_PX) {
      const weight = stats.sumWeight
      let avgHue = null as number | null
      if (weight > 0) {
        const avgSin = stats.sumSin / weight
        const avgCos = stats.sumCos / weight
        if (Number.isFinite(avgSin) && Number.isFinite(avgCos) && (avgSin !== 0 || avgCos !== 0)) {
          avgHue = ((Math.atan2(avgSin, avgCos) / (Math.PI * 2)) % 1 + 1) % 1
        }
      }
      const avgHueColor = hueToRgb(avgHue ?? averagePressure)
      startCascade(avgHueColor)
    }
  }, [setControlsLocked, setInkIntensity, startCascade, unlockControls])

  React.useEffect(() => {
    setInkIntensity(0)
    return () => {
      setInkTex(() => undefined)
      setInkIntensity(0)
      setVertexInkOk(false)
      setControlsLocked(false)
      unlockControls()
      inkFieldRef.current?.dispose()
      inkFieldRef.current = null
      rendererRef.current = null
      textureRef.current = null
      strokeStatsRef.current = null
      strokeCanvasElementRef.current = null
    }
  }, [setControlsLocked, setInkIntensity, setInkTex, setVertexInkOk, unlockControls])

  React.useEffect(() => {
    return () => {
      setHeatmapVisible(false)
    }
  }, [setHeatmapVisible])

  React.useEffect(() => {
    if (!drawEnabled) {
      handleStrokeEnd()
    }
  }, [drawEnabled, handleStrokeEnd])

  React.useEffect(() => {
    return subscribeDreamdustTunables((next) => {
      tunablesRef.current = next
    })
  }, [])

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined
    }

    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
    const field = createInkField(FIELD_SIZE, dpr)
    inkFieldRef.current = field

    return () => {
      if (inkFieldRef.current === field) {
        inkFieldRef.current = null
      }
      field.dispose()
    }
  }, [])

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined
    }

    let cancelled = false
    let frame = 0

    const tryAcquireRenderer = () => {
      if (cancelled) {
        return
      }

      const state = getR3FStateOrNull()
      const renderer = state?.gl ?? null
      if (!renderer) {
        frame = window.requestAnimationFrame(tryAcquireRenderer)
        return
      }

      rendererRef.current = renderer
      const gl = renderer.getContext()
      const supported = detectVertexTextureSupport(gl)
      if (vertexInkOkRef.current !== supported) {
        vertexInkOkRef.current = supported
        setVertexInkOk(supported)
      }

      const field = inkFieldRef.current
      if (field) {
        const texture = field.toCanvasTexture(
          renderer as Parameters<InkField['toCanvasTexture']>[0],
          UPLOAD_HZ,
        )
        if (!cancelled) {
          textureRef.current = texture
          setInkTex(texture as InkTexState)
        }
      }
    }

    frame = window.requestAnimationFrame(tryAcquireRenderer)

    return () => {
      cancelled = true
      if (frame) {
        window.cancelAnimationFrame(frame)
      }
    }
  }, [setInkTex, setVertexInkOk])

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined
    }

    let cancelled = false
    let frame = 0
    let lastTick = nowMs()

    const loop = (timestamp: number) => {
      if (cancelled) {
        return
      }

      const delta = timestamp - lastTick
      lastTick = timestamp

      const field = inkFieldRef.current
      if (field) {
        const { decay } = tunablesRef.current
        const decayRate = decayRateFromDelta(delta, decay ?? DEFAULT_DECAY_BASE)
        field.decay(decayRate)
        const renderer = rendererRef.current
        if (renderer) {
          const texture = field.toCanvasTexture(
            renderer as Parameters<InkField['toCanvasTexture']>[0],
            UPLOAD_HZ,
          )
          if (!cancelled && textureRef.current !== texture) {
            textureRef.current = texture
            setInkTex(texture as InkTexState)
          }
        }
      }

      const lastStroke = lastStrokeRef.current
      let targetIntensity = 0
      if (lastStroke > 0) {
        const idle = timestamp - lastStroke
        const { tapTau } = tunablesRef.current
        const tau = Math.max(16, Number.isFinite(tapTau) ? tapTau : DEFAULT_TAP_TAU)
        const idleZero = Math.max(32, tau * IDLE_ZERO_RATIO)
        if (idle <= 16) {
          targetIntensity = 1
        } else if (idle < idleZero) {
          targetIntensity = Math.exp(-idle / tau)
        }
      }

      const currentIntensity = intensityRef.current
      if (Math.abs(targetIntensity - currentIntensity) > INTENSITY_EPSILON) {
        if (!cancelled) {
          intensityRef.current = targetIntensity
          setInkIntensity(targetIntensity)
        }
      } else if (targetIntensity === 0 && currentIntensity !== 0) {
        if (!cancelled) {
          intensityRef.current = 0
          setInkIntensity(0)
        }
      }

      frame = window.requestAnimationFrame(loop)
    }

    frame = window.requestAnimationFrame(loop)

    return () => {
      cancelled = true
      if (frame) {
        window.cancelAnimationFrame(frame)
      }
    }
  }, [setInkIntensity, setInkTex])

  // Heatmap overlay of the ink texture (viewport-aligned)
  React.useEffect(() => {
    if (!heatmapVisible) return
    if (typeof window === 'undefined') return
    let raf = 0
    const draw = () => {
      const canvas = heatmapRef.current
      const tex = textureRef.current as unknown as { image?: HTMLCanvasElement | OffscreenCanvas }
      if (canvas && tex?.image) {
        const ctx = canvas.getContext('2d')
        if (ctx) {
          const src = tex.image as HTMLCanvasElement | OffscreenCanvas
          const renderer = rendererRef.current
          const glCanvas = renderer?.domElement ?? null
          const rect = glCanvas?.getBoundingClientRect()
          const fallbackWidth = window.innerWidth || 0
          const fallbackHeight = window.innerHeight || 0
          const cssWidth = rect?.width ?? glCanvas?.clientWidth ?? fallbackWidth
          const cssHeight = rect?.height ?? glCanvas?.clientHeight ?? fallbackHeight
          const pixelWidth = glCanvas?.width ?? Math.max(1, Math.round(cssWidth * (window.devicePixelRatio || 1)))
          const pixelHeight = glCanvas?.height ?? Math.max(1, Math.round(cssHeight * (window.devicePixelRatio || 1)))
          if (pixelWidth > 0 && canvas.width !== pixelWidth) {
            canvas.width = pixelWidth
          }
          if (pixelHeight > 0 && canvas.height !== pixelHeight) {
            canvas.height = pixelHeight
          }
          if (cssWidth > 0) {
            canvas.style.width = `${cssWidth}px`
          }
          if (cssHeight > 0) {
            canvas.style.height = `${cssHeight}px`
          }
          if (canvas.width === 0 || canvas.height === 0) {
            const fallbackPixelWidth = Math.max(256, Math.round(fallbackWidth || 256))
            const fallbackPixelHeight = Math.max(256, Math.round(fallbackHeight || 256))
            canvas.width = fallbackPixelWidth
            canvas.height = fallbackPixelHeight
            canvas.style.width = `${fallbackPixelWidth}px`
            canvas.style.height = `${fallbackPixelHeight}px`
          }
          ctx.imageSmoothingEnabled = false
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          const srcWidth = src.width || 128
          const srcHeight = src.height || 128
          ctx.drawImage(
            src as CanvasImageSource,
            0,
            0,
            srcWidth,
            srcHeight,
            0,
            0,
            canvas.width,
            canvas.height,
          )
        }
      }
      raf = window.requestAnimationFrame(draw)
    }
    raf = window.requestAnimationFrame(draw)
    return () => window.cancelAnimationFrame(raf)
  }, [heatmapVisible])

  return (
    <div
      inert={drawEnabled ? undefined : true}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 3,
        // Default to capturing input for drawing
        pointerEvents: drawEnabled ? 'auto' : 'none',
      }}
    >
      <StrokeCaptureCanvas
        enabled={drawEnabled}
        onStrokeStart={handleStrokeStart}
        onStrokeSegment={handleStrokeSegment}
        onStrokeEnd={handleStrokeEnd}
        onCanvasElement={handleCanvasElement}
      />
      {heatmapVisible && (
        <canvas
          ref={heatmapRef}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 3,
            pointerEvents: 'none',
            width: '100%',
            height: '100%',
          }}
        />
      )}
      {/* Simple Draw toggle; lives above canvas and canvas overlay */}
      <div
        style={{
          position: 'absolute',
          right: 12,
          bottom: 12,
          zIndex: 4,
          pointerEvents: 'auto',
        }}
      >
        <button
          type="button"
          onClick={() => setDrawEnabled((v) => !v)}
          style={{
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: 12,
            padding: '6px 10px',
            borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.25)',
            background: drawEnabled ? 'rgba(16,160,32,0.85)' : 'rgba(0,0,0,0.55)',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          {drawEnabled ? 'Draw: On' : 'Draw: Off'}
        </button>
        <button
          type="button"
          onClick={() => setHeatmapVisible((v) => !v)}
          style={{
            marginLeft: 8,
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: 12,
            padding: '6px 10px',
            borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.25)',
            background: heatmapVisible ? 'rgba(32,96,192,0.85)' : 'rgba(0,0,0,0.55)',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          {heatmapVisible ? 'Heatmap: On' : 'Heatmap: Off'}
        </button>
      </div>
    </div>
  )
}
