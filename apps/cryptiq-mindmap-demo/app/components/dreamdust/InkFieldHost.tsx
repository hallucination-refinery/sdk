'use client'

import * as React from 'react'

import { getR3FStateOrNull } from '../anim/r3fSafe'
import { detectVertexTextureSupport } from './capabilities'
import { createInkField, type InkField } from './InkField'
import { StrokeCaptureCanvas, type StrokePoint, type StrokeSegment } from './StrokeCaptureCanvas'
import { useDreamdustCtx } from './context'

type RendererLike = {
  getContext: () => WebGLRenderingContext | WebGL2RenderingContext
}

type CanvasTextureLike = {
  needsUpdate?: boolean
  dispose?: () => void
}

const FIELD_SIZE = 128
const MAX_DPR = 1.5
const UPLOAD_HZ = 60
const DECAY_BASE = 0.96
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
  const { setInkTex, setInkIntensity, setVertexInkOk } = useDreamdustCtx()
  type InkTexState = Parameters<typeof setInkTex>[0]

  const inkFieldRef = React.useRef<InkField | null>(null)
  const rendererRef = React.useRef<RendererLike | null>(null)
  const textureRef = React.useRef<CanvasTextureLike | null>(null)
  const lastStrokeRef = React.useRef(0)
  const intensityRef = React.useRef(0)
  const vertexInkOkRef = React.useRef<boolean | null>(null)

  const handleStrokeStart = React.useCallback(
    (_point: StrokePoint) => {
      const now = nowMs()
      lastStrokeRef.current = now
      if (intensityRef.current !== 1) {
        intensityRef.current = 1
        setInkIntensity(1)
      }
    },
    [setInkIntensity],
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
      <StrokeCaptureCanvas
        onStrokeStart={handleStrokeStart}
        onStrokeSegment={handleStrokeSegment}
      />
    </div>
  )
}
