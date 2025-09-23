'use client'

import { useThree } from '@react-three/fiber'
import * as React from 'react'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as THREE from 'three'

type AnyDataTexture = {
  needsUpdate: boolean
  wrapS: unknown
  wrapT: unknown
  minFilter: unknown
  magFilter: unknown
  dispose?: () => void
  __akdd07?: InkTextureDiagnostic
}

type InkTextureDiagnostic = {
  revision: number; width: number; height: number; format: string; sampleAvgLuma: number; sampleCount: number;
  frameIndex: number; latencyFrames: number | null; latencyMs: number | null; penDownTimestamp: number | null; timestamp: number;
}

type ThreeNamespace = {
  DataTexture: new (
    data: Uint8Array,
    width: number,
    height: number,
    format: unknown,
  ) => AnyDataTexture
  ClampToEdgeWrapping: unknown
  LinearFilter: unknown
  RGBAFormat: unknown
}

const THREE_NS = THREE as unknown as ThreeNamespace

export type InkSurfaceProps = {
  onStart?: () => void
  onEnd?: (info: {
    type: 'tap' | 'stroke'
    durationMs: number
    distancePx: number
  }) => void
  onTexture?: (texture: AnyDataTexture) => void
  mirrorLR?: boolean
  mirrorUD?: boolean
}

const TEXTURE_SIZE = 256
const BRUSH_RADIUS_PX = 8
const BRUSH_STEP = BRUSH_RADIUS_PX * 0.5

const clamp01 = (value: number) => {
  if (!Number.isFinite(value)) return 0
  if (value <= 0) return 0
  if (value >= 1) return 1
  return value
}

type Vec2 = { x: number; y: number }

type PointerState = {
  pointerId: number
  startTime: number
  startClient: Vec2
}

export function InkSurface({
  onStart,
  onEnd,
  onTexture,
  mirrorLR = false,
  mirrorUD = false,
}: InkSurfaceProps) {
  const { gl } = useThree()
  const pointerStateRef = React.useRef<PointerState | null>(null)
  const drawingRef = React.useRef(false)
  const lastClientRef = React.useRef<Vec2 | null>(null)
  const lastCanvasRef = React.useRef<Vec2 | null>(null)
  const distanceRef = React.useRef(0)
  const ctxRef = React.useRef<CanvasRenderingContext2D | null>(null)
  const dataRef = React.useRef<Uint8Array | null>(null)
  const textureRef = React.useRef<AnyDataTexture | null>(null)
  const rafRef = React.useRef<number | null>(null)
  const readbackCoalesceLoggedRef = React.useRef(false)
  const onStartRef = React.useRef(onStart)
  const onEndRef = React.useRef(onEnd)
  const onTextureRef = React.useRef(onTexture)
  const mirrorRef = React.useRef({ lr: !!mirrorLR, ud: !!mirrorUD })
  const guardLoggedRef = React.useRef(true)
  const guardWatchdogRef = React.useRef<number | null>(null)
  const guardDeadlineRef = React.useRef(0)
  const guardFanoutRafRef = React.useRef<number | null>(null)
  const diagnosticsRef = React.useRef({
    frame: 0, penDownFrame: null as number | null, penDownTime: null as number | null, pendingLatency: false,
    uvLogged: false, guardLogged: false, inkLogged: false, inkRevision: 0,
  })

  const getNow = React.useCallback(() => {
    return typeof performance !== 'undefined' ? performance.now() : Date.now()
  }, [])

  const scheduleGuardFanoutLog = React.useCallback(() => {
    const diagnostics = diagnosticsRef.current
    if (diagnostics.guardLogged || typeof window === 'undefined') {
      return
    }
    if (guardFanoutRafRef.current !== null) {
      return
    }
    guardFanoutRafRef.current = window.requestAnimationFrame(() => {
      guardFanoutRafRef.current = null
      if (diagnostics.guardLogged) {
        return
      }
      diagnostics.guardLogged = true
      const rect = gl?.domElement?.getBoundingClientRect()
      const size =
        rect && Number.isFinite(rect.width) && Number.isFinite(rect.height)
          ? {
              width: Number(rect.width.toFixed(2)),
              height: Number(rect.height.toFixed(2)),
            }
          : null
      try {
        console.info('[AK-DD-09] caps/guards fan-out', {
          frameIndex: diagnostics.frame, canvas: size, textureSize: TEXTURE_SIZE, mirror: mirrorRef.current,
        })
      } catch {
        // noop
      }
    })
  }, [gl, mirrorRef, diagnosticsRef])

  React.useEffect(() => {
    onStartRef.current = onStart
  }, [onStart])

  React.useEffect(() => {
    onEndRef.current = onEnd
  }, [onEnd])

  React.useEffect(() => {
    onTextureRef.current = onTexture
  }, [onTexture])

  React.useEffect(() => {
    mirrorRef.current = { lr: !!mirrorLR, ud: !!mirrorUD }
  }, [mirrorLR, mirrorUD])

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined
    }

    const canvas = document.createElement('canvas')
    canvas.width = TEXTURE_SIZE
    canvas.height = TEXTURE_SIZE
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) {
      return undefined
    }
    ctx.clearRect(0, 0, TEXTURE_SIZE, TEXTURE_SIZE)
    ctx.globalCompositeOperation = 'lighter'

    const data = new Uint8Array(TEXTURE_SIZE * TEXTURE_SIZE * 4)
    const texture = new THREE_NS.DataTexture(
      data,
      TEXTURE_SIZE,
      TEXTURE_SIZE,
      THREE_NS.RGBAFormat,
    )
    texture.wrapS = THREE_NS.ClampToEdgeWrapping
    texture.wrapT = THREE_NS.ClampToEdgeWrapping
    texture.minFilter = THREE_NS.LinearFilter
    texture.magFilter = THREE_NS.LinearFilter
    texture.needsUpdate = true

    ctxRef.current = ctx
    dataRef.current = data
    textureRef.current = texture
    scheduleGuardFanoutLog()

    const flushTexture = () => {
      const context = ctxRef.current
      const arr = dataRef.current
      const tex = textureRef.current
      if (!context || !arr || !tex) {
        return
      }
      const imageData = context.getImageData(0, 0, TEXTURE_SIZE, TEXTURE_SIZE)
      arr.set(imageData.data)
      const diagnostics = diagnosticsRef.current
      diagnostics.frame += 1
      const pixels = imageData.data
      let nonZeroIndex = -1
      for (let i = 0; i < pixels.length; i += 4) {
        if (pixels[i] || pixels[i + 1] || pixels[i + 2] || pixels[i + 3]) {
          nonZeroIndex = i
          break
        }
      }

      if (nonZeroIndex >= 0 && diagnostics.pendingLatency && !diagnostics.inkLogged) {
        const totalPixels = pixels.length / 4
        const step = Math.max(1, Math.floor(totalPixels / 64))
        let count = 0
        let luminanceSum = 0
        for (let idx = 0; idx < pixels.length && count < 64; idx += step * 4) {
          const r = pixels[idx]
          const g = pixels[idx + 1]
          const b = pixels[idx + 2]
          const a = pixels[idx + 3]
          if (!(r || g || b || a)) {
            continue
          }
          luminanceSum += ((0.2126 * r + 0.7152 * g + 0.0722 * b) / 255) * (a / 255)
          count += 1
        }
        if (count === 0) {
          const base = nonZeroIndex
          const r = pixels[base]
          const g = pixels[base + 1]
          const b = pixels[base + 2]
          const a = pixels[base + 3]
          luminanceSum = ((0.2126 * r + 0.7152 * g + 0.0722 * b) / 255) * (a / 255)
          count = 1
        }
        const now = getNow()
        const framesSincePenDown =
          diagnostics.penDownFrame === null ? null : diagnostics.frame - diagnostics.penDownFrame
        const latencyFrames =
          framesSincePenDown !== null ? Math.max(0, Math.trunc(framesSincePenDown)) : null
        const latencyMsRaw = diagnostics.penDownTime === null ? null : now - diagnostics.penDownTime
        const latencyMs =
          latencyMsRaw !== null && Number.isFinite(latencyMsRaw) ? latencyMsRaw : null
        diagnostics.inkRevision += 1
        const payload: InkTextureDiagnostic = {
          revision: diagnostics.inkRevision,
          width: TEXTURE_SIZE,
          height: TEXTURE_SIZE,
          format: 'RGBAFormat',
          sampleAvgLuma: count > 0 ? luminanceSum / count : 0,
          sampleCount: count,
          frameIndex: diagnostics.frame,
          latencyFrames,
          latencyMs,
          penDownTimestamp: diagnostics.penDownTime,
          timestamp: now,
        }
        tex.__akdd07 = payload
        try {
          console.info('[AK-DD-07] uInkTex bind', {
            width: payload.width, height: payload.height, format: payload.format,
            sampleAvgLuma: Number(payload.sampleAvgLuma.toFixed(4)), sampleCount: payload.sampleCount,
            frameIndex: payload.frameIndex, latencyFrames: payload.latencyFrames,
            latencyMs:
              payload.latencyMs !== null && Number.isFinite(payload.latencyMs)
                ? Number(payload.latencyMs.toFixed(2))
                : null,
            penDownTimestamp: payload.penDownTimestamp, timestamp: payload.timestamp,
          })
        } catch {
          // noop
        }
        diagnostics.inkLogged = true
        diagnostics.pendingLatency = false
      }
      scheduleGuardFanoutLog()
      tex.needsUpdate = true
      const cb = onTextureRef.current
      if (typeof cb === 'function') {
        try {
          cb(tex)
        } catch {
          // Ignore downstream texture update errors
        }
      }
    }

    const scheduleFlush = () => {
      if (rafRef.current !== null) {
        if (!readbackCoalesceLoggedRef.current) {
          readbackCoalesceLoggedRef.current = true
          console.log('[ink] readback coalesced')
        }
        return
      }
      readbackCoalesceLoggedRef.current = false
      rafRef.current = window.requestAnimationFrame(() => {
        readbackCoalesceLoggedRef.current = false
        rafRef.current = null
        flushTexture()
      })
    }

    const stopGuardWatchdog = () => {
      if (guardWatchdogRef.current !== null) {
        window.cancelAnimationFrame(guardWatchdogRef.current)
        guardWatchdogRef.current = null
      }
      guardDeadlineRef.current = 0
    }

    const startGuardWatchdog = () => {
      stopGuardWatchdog()
      guardLoggedRef.current = false
      const now = typeof performance !== 'undefined' ? performance.now() : Date.now()
      guardDeadlineRef.current = now + 3000
      const tick = () => {
        if (guardLoggedRef.current) {
          stopGuardWatchdog()
          return
        }
        const current = typeof performance !== 'undefined' ? performance.now() : Date.now()
        if (current >= guardDeadlineRef.current) {
          stopGuardWatchdog()
          return
        }
        guardWatchdogRef.current = window.requestAnimationFrame(tick)
      }
      guardWatchdogRef.current = window.requestAnimationFrame(tick)
    }

    const logInkGuard = (rawU: number, rawV: number, clampedU: number, clampedV: number) => {
      if (guardLoggedRef.current) {
        return
      }
      guardLoggedRef.current = true
      stopGuardWatchdog()
      const within =
        Number.isFinite(rawU) &&
        Number.isFinite(rawV) &&
        rawU >= 0 &&
        rawU <= 1 &&
        rawV >= 0 &&
        rawV <= 1
      const formatValue = (value: number) => (Number.isFinite(value) ? value.toFixed(3) : 'NaN')
      const mirror = mirrorRef.current
      try {
        console.log(
          `[PC] ink-uv guard ${within ? 'ok' : 'violation'} { raw: [${formatValue(rawU)}, ${formatValue(rawV)}], clamped: [${formatValue(clampedU)}, ${formatValue(clampedV)}], mirror: { lr: ${mirror.lr}, ud: ${mirror.ud} } }`,
        )
      } catch {
        // noop
      }
    }

    const resetDrawingState = () => {
      drawingRef.current = false
      pointerStateRef.current = null
      lastClientRef.current = null
      lastCanvasRef.current = null
      distanceRef.current = 0
      guardLoggedRef.current = true
      stopGuardWatchdog()
      const diagnostics = diagnosticsRef.current
      diagnostics.pendingLatency = false
      diagnostics.penDownFrame = null
      diagnostics.penDownTime = null
    }

    const paintDisc = (point: Vec2) => {
      const context = ctxRef.current
      if (!context) {
        return
      }
      const { x, y } = point
      const gradient = context.createRadialGradient(x, y, 0, x, y, BRUSH_RADIUS_PX)
      gradient.addColorStop(0, 'rgba(255,255,255,0.9)')
      gradient.addColorStop(1, 'rgba(255,255,255,0)')
      context.fillStyle = gradient
      context.beginPath()
      context.arc(x, y, BRUSH_RADIUS_PX, 0, Math.PI * 2)
      context.fill()
    }

    const drawBetween = (from: Vec2, to: Vec2) => {
      const dx = to.x - from.x
      const dy = to.y - from.y
      const dist = Math.hypot(dx, dy)
      if (!Number.isFinite(dist) || dist === 0) {
        paintDisc(to)
        return
      }
      const steps = Math.max(1, Math.ceil(dist / BRUSH_STEP))
      for (let i = 1; i <= steps; i++) {
        const t = i / steps
        paintDisc({ x: from.x + dx * t, y: from.y + dy * t })
      }
    }

    const drawAtClient = (client: Vec2) => {
      const context = ctxRef.current
      const domElement = gl?.domElement
      if (!context || !domElement) {
        return
      }
      const rect = domElement.getBoundingClientRect()
      const width = rect.width || 0
      const height = rect.height || 0
      const rawU = width > 0 ? (client.x - rect.left) / width : Number.NaN
      const rawV = height > 0 ? (client.y - rect.top) / height : Number.NaN
      const u = clamp01(rawU)
      const v = clamp01(rawV)
      logInkGuard(rawU, rawV, u, v)
      if (width <= 0 || height <= 0) {
        return
      }
      const canvasX = u * TEXTURE_SIZE
      const canvasY = v * TEXTURE_SIZE
      const diagnostics = diagnosticsRef.current
      if (!diagnostics.uvLogged && Number.isFinite(rawU) && Number.isFinite(rawV)) {
        diagnostics.uvLogged = true
        const normalizedOk = u >= 0 && u <= 1 && v >= 0 && v <= 1
        const canvasOk =
          canvasX >= 0 && canvasX <= TEXTURE_SIZE && canvasY >= 0 && canvasY <= TEXTURE_SIZE
        const fmt = (value: number, digits: number) =>
          Number.isFinite(value) ? Number(value.toFixed(digits)) : null
        try {
          console.info('[AK-DD-08] ink-uv normalized', {
            raw: { u: [fmt(rawU, 4), fmt(rawU, 4)], v: [fmt(rawV, 4), fmt(rawV, 4)] },
            normalized: { u: [fmt(u, 4), fmt(u, 4)], v: [fmt(v, 4), fmt(v, 4)] },
            canvas: { x: [fmt(canvasX, 2), fmt(canvasX, 2)], y: [fmt(canvasY, 2), fmt(canvasY, 2)] },
            normalizedOk, canvasOk, textureSize: TEXTURE_SIZE, mirror: mirrorRef.current,
          })
        } catch {
          // noop
        }
      }
      const lastClient = lastClientRef.current
      if (lastClient) {
        distanceRef.current += Math.hypot(client.x - lastClient.x, client.y - lastClient.y) || 0
      }
      lastClientRef.current = { x: client.x, y: client.y }
      const lastCanvas = lastCanvasRef.current
      const currentPoint = { x: canvasX, y: canvasY }
      if (lastCanvas) {
        drawBetween(lastCanvas, currentPoint)
      } else {
        paintDisc(currentPoint)
      }
      lastCanvasRef.current = currentPoint
      scheduleFlush()
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!event.isPrimary || drawingRef.current) {
        return
      }
      const domElement = gl?.domElement
      if (!domElement) {
        return
      }
      if (!ctxRef.current) {
        return
      }
      try {
        domElement.setPointerCapture(event.pointerId)
      } catch {
        // Ignore pointer-capture failures (e.g., unsupported elements)
      }
      pointerStateRef.current = {
        pointerId: event.pointerId,
        startTime: typeof performance !== 'undefined' ? performance.now() : event.timeStamp,
        startClient: { x: event.clientX, y: event.clientY },
      }
      drawingRef.current = true
      lastClientRef.current = null
      lastCanvasRef.current = null
      distanceRef.current = 0
      ctxRef.current.clearRect(0, 0, TEXTURE_SIZE, TEXTURE_SIZE) // single-stroke heatmap
      const diagnostics = diagnosticsRef.current
      diagnostics.penDownFrame = diagnostics.frame
      diagnostics.penDownTime = getNow()
      diagnostics.pendingLatency = true
      startGuardWatchdog()
      drawAtClient({ x: event.clientX, y: event.clientY })
      scheduleFlush()
      try {
        console.log('[PC] draw start')
      } catch {
        // noop
      }
      const cb = onStartRef.current
      if (typeof cb === 'function') {
        try {
          cb()
        } catch {
          // Ignore downstream handler failures
        }
      }
    }

    const finishDrawing = (event?: PointerEvent) => {
      if (!drawingRef.current) {
        return
      }
      const state = pointerStateRef.current
      if (event && state && event.pointerId !== state.pointerId) {
        return
      }
      if (event) {
        drawAtClient({ x: event.clientX, y: event.clientY })
      }
      const domElement = gl?.domElement
      const pointerId = event?.pointerId ?? state?.pointerId
      if (domElement && typeof pointerId === 'number') {
        try {
          domElement.releasePointerCapture(pointerId)
        } catch {
          // Ignore release failures when capture was never established
        }
      }
      drawingRef.current = false
      const startTime = state?.startTime ?? (typeof performance !== 'undefined' ? performance.now() : 0)
      const durationMs =
        (typeof performance !== 'undefined' ? performance.now() : event?.timeStamp ?? startTime) - startTime
      const distancePx = distanceRef.current
      const type: 'tap' | 'stroke' = durationMs < 160 && distancePx < 12 ? 'tap' : 'stroke'
      try {
        console.log(
          `[PC] draw end { type: '${type}', durationMs: ${durationMs.toFixed(1)}, distancePx: ${distancePx.toFixed(
            1,
          )} }`,
        )
      } catch {
        // noop
      }
      const cb = onEndRef.current
      if (typeof cb === 'function') {
        try {
          cb({ type, durationMs, distancePx })
        } catch {
          // Ignore downstream handler failures
        }
      }
      scheduleFlush()
      resetDrawingState()
    }

    const handlePointerMove = (event: PointerEvent) => {
      const state = pointerStateRef.current
      if (!drawingRef.current || !state || event.pointerId !== state.pointerId) {
        return
      }
      drawAtClient({ x: event.clientX, y: event.clientY })
    }

    const handlePointerUp = (event: PointerEvent) => {
      finishDrawing(event)
    }

    const handlePointerCancel = (event: PointerEvent) => {
      finishDrawing(event)
    }

    const domElement = gl?.domElement
    domElement?.addEventListener('pointerdown', handlePointerDown, { passive: true })
    domElement?.addEventListener('pointermove', handlePointerMove, { passive: true })
    domElement?.addEventListener('pointerup', handlePointerUp, { passive: true })
    domElement?.addEventListener('pointercancel', handlePointerCancel, { passive: true })
    domElement?.addEventListener('pointerleave', handlePointerCancel, { passive: true })

    flushTexture()

    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      readbackCoalesceLoggedRef.current = false
      if (guardFanoutRafRef.current !== null) {
        window.cancelAnimationFrame(guardFanoutRafRef.current)
        guardFanoutRafRef.current = null
      }
      domElement?.removeEventListener('pointerdown', handlePointerDown)
      domElement?.removeEventListener('pointermove', handlePointerMove)
      domElement?.removeEventListener('pointerup', handlePointerUp)
      domElement?.removeEventListener('pointercancel', handlePointerCancel)
      domElement?.removeEventListener('pointerleave', handlePointerCancel)
      texture?.dispose?.()
      ctxRef.current = null
      dataRef.current = null
      textureRef.current = null
      resetDrawingState()
    }
  }, [gl, getNow, scheduleGuardFanoutLog])

  return null
}

export default InkSurface
