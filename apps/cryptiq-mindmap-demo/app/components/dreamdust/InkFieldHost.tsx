'use client'

import * as React from 'react'

import { getR3FStateOrNull } from '../anim/r3fSafe'
import { detectVertexTextureSupport } from './capabilities'
import { createInkField, type InkField } from './InkField'
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
const DECAY_BASE = 0.98
const INTENSITY_EPSILON = 0.01
const INTENSITY_IDLE_ZERO_MS = 2400
const DEFAULT_PRESSURE = 0.5

function nowMs(): number {
  if (typeof performance !== 'undefined') {
    return performance.now()
  }
  return Date.now()
}

function decayRateFromDelta(deltaMs: number): number {
  if (deltaMs <= 0) {
    return DECAY_BASE
  }
  const steps = Math.max(1, (deltaMs / 1000) * 60)
  return Math.pow(DECAY_BASE, steps)
}

export function InkFieldHost(): React.JSX.Element {
  const {
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

  const handleStrokeStart = React.useCallback(
    (_point: StrokePoint) => {
      void _point
      lockControls()
      setControlsLocked(true)
      const now = nowMs()
      lastStrokeRef.current = now
      if (intensityRef.current !== 1) {
        intensityRef.current = 1
        setInkIntensity(1)
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
              inkIntensity: 1,
            })
          } catch (error) {
            console.warn('[PC] ink debug (host) failed', error)
          }
        }
        loggedInkOnceRef.current = true
      }
    },
    [lockControls, setControlsLocked, setInkIntensity],
  )

  const handleStrokeSegment = React.useCallback(
    (segment: StrokeSegment) => {
      const field = inkFieldRef.current
      if (!field) {
        return
      }

      const pressure = segment.pressure > 0 ? segment.pressure : DEFAULT_PRESSURE
      field.drawStroke(
        [
          { x: segment.from.x, y: segment.from.y },
          { x: segment.to.x, y: segment.to.y },
        ],
        pressure,
      )

      const now = nowMs()
      lastStrokeRef.current = now
      if (intensityRef.current !== 1) {
        intensityRef.current = 1
        setInkIntensity(1)
      }

      const renderer = rendererRef.current
      if (renderer) {
        const texture = field.toCanvasTexture(
          renderer as Parameters<InkField['toCanvasTexture']>[0],
          UPLOAD_HZ,
        )
        if (textureRef.current !== texture) {
          textureRef.current = texture
          setInkTex(texture as InkTexState)
        }
      }
    },
    [setInkIntensity, setInkTex],
  )

  const handleStrokeEnd = React.useCallback(() => {
    unlockControls()
    setControlsLocked(false)
  }, [setControlsLocked, unlockControls])

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
        const decayRate = decayRateFromDelta(delta)
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
        if (idle <= 16) {
          targetIntensity = 1
        } else if (idle < INTENSITY_IDLE_ZERO_MS) {
          targetIntensity = Math.exp(-idle / 900)
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
          const viewportWidth = glCanvas?.width ?? 0
          const viewportHeight = glCanvas?.height ?? 0
          if (viewportWidth > 0 && canvas.width !== viewportWidth) {
            canvas.width = viewportWidth
          }
          if (viewportHeight > 0 && canvas.height !== viewportHeight) {
            canvas.height = viewportHeight
          }
          if (canvas.width === 0 || canvas.height === 0) {
            const fallbackWidth = 256
            const fallbackHeight = 256
            canvas.width = fallbackWidth
            canvas.height = fallbackHeight
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
