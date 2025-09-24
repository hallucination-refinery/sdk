'use client'

import { useThree } from '@react-three/fiber'
import * as React from 'react'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as THREE from 'three'

import { markInkFrameCandidate, markInkPenDown } from './metrics'

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

const INK_WORKER_SOURCE = [
  '"use strict";',
  'let ctx = null;',
  'let width = 0;',
  'let height = 0;',
  'let brushRadius = 8;',
  'let lastPoint = null;',
  'let dirty = false;',
  'let revision = 0;',
  '',
  'function paintDisc(point) {',
  '  if (!ctx) return;',
  '  const gradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, brushRadius);',
  "  gradient.addColorStop(0, 'rgba(255,255,255,0.9)');",
  "  gradient.addColorStop(1, 'rgba(255,255,255,0)');",
  '  ctx.fillStyle = gradient;',
  '  ctx.beginPath();',
  '  ctx.arc(point.x, point.y, brushRadius, 0, Math.PI * 2);',
  '  ctx.fill();',
  '}',
  '',
  'function drawBetween(from, to) {',
  '  const dx = to.x - from.x;',
  '  const dy = to.y - from.y;',
  '  const dist = Math.hypot(dx, dy);',
  '  if (!Number.isFinite(dist) || dist === 0) {',
  '    paintDisc(to);',
  '    return;',
  '  }',
  '  const steps = Math.max(1, Math.ceil(dist / (brushRadius * 0.5)));',
  '  for (let i = 1; i <= steps; i += 1) {',
  '    const t = i / steps;',
  '    paintDisc({ x: from.x + dx * t, y: from.y + dy * t });',
  '  }',
  '}',
  '',
  'function handleStroke(message) {',
  '  if (!ctx) return;',
  '  const points = Array.isArray(message.points) ? message.points : [];',
  '  if (message.reset) {',
  '    ctx.clearRect(0, 0, width, height);',
  '    lastPoint = null;',
  '  }',
  '  for (let i = 0; i < points.length; i += 1) {',
  '    const point = points[i];',
  '    if (!point || typeof point.x !== "number" || typeof point.y !== "number") {',
  '      continue;',
  '    }',
  '    if (lastPoint) {',
  '      drawBetween(lastPoint, point);',
  '    } else {',
  '      paintDisc(point);',
  '    }',
  '    lastPoint = point;',
  '    dirty = true;',
  '  }',
  '}',
  '',
  'function computeMetrics(view) {',
  '  const length = view.length;',
  '  let hasInk = false;',
  '  let firstIndex = -1;',
  '  for (let i = 0; i < length; i += 4) {',
  '    if (view[i] || view[i + 1] || view[i + 2] || view[i + 3]) {',
  '      hasInk = true;',
  '      firstIndex = i;',
  '      break;',
  '    }',
  '  }',
  '  let sampleCount = 0;',
  '  let luminanceSum = 0;',
  '  if (hasInk) {',
  '    const totalPixels = length / 4;',
  '    const step = Math.max(1, Math.floor(totalPixels / 64));',
  '    for (let idx = 0; idx < length && sampleCount < 64; idx += step * 4) {',
  '      const r = view[idx];',
  '      const g = view[idx + 1];',
  '      const b = view[idx + 2];',
      '      const a = view[idx + 3];',
  '      if (!(r || g || b || a)) {',
  '        continue;',
  '      }',
  '      luminanceSum += ((0.2126 * r + 0.7152 * g + 0.0722 * b) / 255) * (a / 255);',
  '      sampleCount += 1;',
  '    }',
  '    if (sampleCount === 0 && firstIndex >= 0) {',
  '      const base = firstIndex;',
  '      const r = view[base];',
  '      const g = view[base + 1];',
  '      const b = view[base + 2];',
  '      const a = view[base + 3];',
  '      luminanceSum = ((0.2126 * r + 0.7152 * g + 0.0722 * b) / 255) * (a / 255);',
  '      sampleCount = 1;',
  '    }',
  '  }',
  '  const avgLuma = sampleCount > 0 ? luminanceSum / sampleCount : 0;',
  '  return { hasInk, sampleCount, avgLuma };',
  '}',
  '',
  'function flush(busy) {',
  '  if (!ctx) return;',
  '  if (!dirty && !busy) {',
  '    return;',
  '  }',
  '  dirty = false;',
  '  const image = ctx.getImageData(0, 0, width, height);',
  '  const view = new Uint8Array(image.data.buffer);',
  '  const metrics = computeMetrics(view);',
  '  revision += 1;',
  '  self.postMessage(',
  '    {',
  '      type: "ink",',
  '      buffer: view.buffer,',
  '      width,',
  '      height,',
  '      avgLuma: metrics.avgLuma,',
  '      sampleCount: metrics.sampleCount,',
  '      hasInk: metrics.hasInk,',
  '      revision,',
  '    },',
  '    [view.buffer],',
  '  );',
  '}',
  '',
  'self.onmessage = (event) => {',
  '  const data = event.data;',
  '  if (!data) {',
  '    return;',
  '  }',
  '  if (data.type === "init") {',
  '    const canvas = data.canvas;',
  '    width = data.width;',
  '    height = data.height;',
  '    brushRadius = typeof data.brushRadius === "number" ? data.brushRadius : brushRadius;',
  '    lastPoint = null;',
  '    dirty = false;',
  '    if (canvas && typeof canvas.getContext === "function") {',
  '      ctx = canvas.getContext("2d", { willReadFrequently: true });',
  '    } else {',
  '      ctx = null;',
  '    }',
  '    if (!ctx) {',
  '      self.postMessage({ type: "error", message: "canvas-context-unavailable" });',
  '      return;',
  '    }',
  '    if (typeof ctx.clearRect === "function") {',
  '      ctx.clearRect(0, 0, width, height);',
  '    }',
  '    try {',
  '      ctx.globalCompositeOperation = "lighter";',
  '    } catch (err) {',
  '      // ignore',
  '    }',
  '    revision = 0;',
  '    return;',
  '  }',
  '  if (!ctx) {',
  '    return;',
  '  }',
  '  if (data.type === "stroke") {',
  '    handleStroke(data);',
  '    return;',
  '  }',
  '  if (data.type === "flush") {',
  '    flush(!!data.busy);',
  '  }',
  '};',
].join('\n')

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
  const workerRef = React.useRef<Worker | null>(null)
  const workerUrlRef = React.useRef<string | null>(null)
  const modeRef = React.useRef<'worker' | 'fallback'>('fallback')
  const fallbackCtxRef = React.useRef<CanvasRenderingContext2D | null>(null)
  const flushStateRef = React.useRef<{ handle: number | null; busy: boolean; lastFlush: number }>({
    handle: null,
    busy: false,
    lastFlush: 0,
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
    if (typeof window === 'undefined') {
      return undefined
    }

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

    dataRef.current = data
    textureRef.current = texture
    ctxRef.current = null
    fallbackCtxRef.current = null
    modeRef.current = 'fallback'
    scheduleGuardFanoutLog()

    const ensureFallbackContext = (): CanvasRenderingContext2D | null => {
      const ctx = fallbackCtxRef.current
      if (ctx) {
        return ctx
      }
      const canvas = document.createElement('canvas')
      canvas.width = TEXTURE_SIZE
      canvas.height = TEXTURE_SIZE
      const nextCtx = canvas.getContext('2d', { willReadFrequently: true })
      if (!nextCtx) {
        return null
      }
      nextCtx.clearRect(0, 0, TEXTURE_SIZE, TEXTURE_SIZE)
      nextCtx.globalCompositeOperation = 'lighter'
      fallbackCtxRef.current = nextCtx
      ctxRef.current = nextCtx
      return nextCtx
    }

    const paintDiscFallback = (context: CanvasRenderingContext2D, point: Vec2) => {
      const gradient = context.createRadialGradient(point.x, point.y, 0, point.x, point.y, BRUSH_RADIUS_PX)
      gradient.addColorStop(0, 'rgba(255,255,255,0.9)')
      gradient.addColorStop(1, 'rgba(255,255,255,0)')
      context.fillStyle = gradient
      context.beginPath()
      context.arc(point.x, point.y, BRUSH_RADIUS_PX, 0, Math.PI * 2)
      context.fill()
    }

    const drawBetweenFallback = (context: CanvasRenderingContext2D, from: Vec2, to: Vec2) => {
      const dx = to.x - from.x
      const dy = to.y - from.y
      const dist = Math.hypot(dx, dy)
      if (!Number.isFinite(dist) || dist === 0) {
        paintDiscFallback(context, to)
        return
      }
      const steps = Math.max(1, Math.ceil(dist / BRUSH_STEP))
      for (let i = 1; i <= steps; i += 1) {
        const t = i / steps
        paintDiscFallback(context, { x: from.x + dx * t, y: from.y + dy * t })
      }
    }

    const computeMetrics = (view: Uint8Array) => {
      let hasInk = false
      let firstIndex = -1
      for (let i = 0; i < view.length; i += 4) {
        if (view[i] || view[i + 1] || view[i + 2] || view[i + 3]) {
          hasInk = true
          firstIndex = i
          break
        }
      }
      let sampleCount = 0
      let luminanceSum = 0
      if (hasInk) {
        const totalPixels = view.length / 4
        const step = Math.max(1, Math.floor(totalPixels / 64))
        for (let idx = 0; idx < view.length && sampleCount < 64; idx += step * 4) {
          const r = view[idx]
          const g = view[idx + 1]
          const b = view[idx + 2]
          const a = view[idx + 3]
          if (!(r || g || b || a)) {
            continue
          }
          luminanceSum += ((0.2126 * r + 0.7152 * g + 0.0722 * b) / 255) * (a / 255)
          sampleCount += 1
        }
        if (sampleCount === 0 && firstIndex >= 0) {
          const base = firstIndex
          const r = view[base]
          const g = view[base + 1]
          const b = view[base + 2]
          const a = view[base + 3]
          luminanceSum = ((0.2126 * r + 0.7152 * g + 0.0722 * b) / 255) * (a / 255)
          sampleCount = 1
        }
      }
      return {
        hasInk,
        sampleCount,
        avgLuma: sampleCount > 0 ? luminanceSum / sampleCount : 0,
      }
    }

    const terminateWorker = () => {
      const worker = workerRef.current
      if (worker) {
        try {
          worker.terminate()
        } catch {
          /* noop */
        }
        workerRef.current = null
      }
      if (workerUrlRef.current) {
        try {
          URL.revokeObjectURL(workerUrlRef.current)
        } catch {
          /* noop */
        }
        workerUrlRef.current = null
      }
    }

    const processInkPayload = (payload: {
      data: Uint8Array
      width: number
      height: number
      avgLuma: number
      sampleCount: number
      hasInk: boolean
      revision: number
    }) => {
      const textureCurrent = textureRef.current
      const target = dataRef.current
      if (!textureCurrent || !target) {
        return
      }
      if (target.length !== payload.data.length) {
        const next = new Uint8Array(payload.data.length)
        dataRef.current = next
        textureCurrent.image.data = next
      }
      dataRef.current.set(payload.data)
      const diagnostics = diagnosticsRef.current
      diagnostics.frame += 1
      if (payload.hasInk && diagnostics.pendingLatency && !diagnostics.inkLogged) {
        diagnostics.inkRevision += 1
        const now = getNow()
        const framesSincePenDown =
          diagnostics.penDownFrame === null ? null : diagnostics.frame - diagnostics.penDownFrame
        const latencyFrames =
          framesSincePenDown !== null ? Math.max(0, Math.trunc(framesSincePenDown)) : null
        const latencyMsRaw = diagnostics.penDownTime === null ? null : now - diagnostics.penDownTime
        const latencyMs =
          latencyMsRaw !== null && Number.isFinite(latencyMsRaw) ? latencyMsRaw : null
        const payloadInfo: InkTextureDiagnostic = {
          revision: diagnostics.inkRevision,
          width: TEXTURE_SIZE,
          height: TEXTURE_SIZE,
          format: 'RGBAFormat',
          sampleAvgLuma: payload.avgLuma,
          sampleCount: payload.sampleCount,
          frameIndex: diagnostics.frame,
          latencyFrames,
          latencyMs,
          penDownTimestamp: diagnostics.penDownTime,
          timestamp: now,
        }
        textureCurrent.__akdd07 = payloadInfo
        try {
          console.info('[AK-DD-07] uInkTex bind', {
            width: payloadInfo.width,
            height: payloadInfo.height,
            format: payloadInfo.format,
            sampleAvgLuma: Number(payloadInfo.sampleAvgLuma.toFixed(4)),
            sampleCount: payloadInfo.sampleCount,
            frameIndex: payloadInfo.frameIndex,
            latencyFrames: payloadInfo.latencyFrames,
            latencyMs:
              payloadInfo.latencyMs !== null && Number.isFinite(payloadInfo.latencyMs)
                ? Number(payloadInfo.latencyMs.toFixed(2))
                : null,
            penDownTimestamp: payloadInfo.penDownTimestamp,
            timestamp: payloadInfo.timestamp,
          })
        } catch {
          /* noop */
        }
        diagnostics.inkLogged = true
        diagnostics.pendingLatency = false
        markInkFrameCandidate()
      }
      scheduleGuardFanoutLog()
      textureCurrent.needsUpdate = true
      const cb = onTextureRef.current
      if (typeof cb === 'function') {
        try {
          cb(textureCurrent)
        } catch {
          /* noop */
        }
      }
    }

    const switchToFallback = (reason: string) => {
      if (modeRef.current === 'worker') {
        try {
          console.warn(`[dreamdust] ink-worker { enabled:false, reason:"${reason}" }`)
        } catch {
          /* noop */
        }
      }
      terminateWorker()
      modeRef.current = 'fallback'
      ensureFallbackContext()
    }

    const flushFallback = () => {
      const context = ensureFallbackContext()
      if (!context) {
        return
      }
      const imageData = context.getImageData(0, 0, TEXTURE_SIZE, TEXTURE_SIZE)
      const view = new Uint8Array(imageData.data.buffer)
      const metrics = computeMetrics(view)
      processInkPayload({
        data: view,
        width: TEXTURE_SIZE,
        height: TEXTURE_SIZE,
        avgLuma: metrics.avgLuma,
        sampleCount: metrics.sampleCount,
        hasInk: metrics.hasInk,
        revision: diagnosticsRef.current.inkRevision + 1,
      })
    }

    const scheduleFlushInternal = (busy: boolean) => {
      const state = flushStateRef.current
      state.busy = state.busy || busy
      if (state.handle !== null) {
        if (!readbackCoalesceLoggedRef.current) {
          readbackCoalesceLoggedRef.current = true
          try {
            console.log('[ink] readback coalesced')
          } catch {
            /* noop */
          }
        }
        return
      }
      readbackCoalesceLoggedRef.current = false
      const step = () => {
        readbackCoalesceLoggedRef.current = false
        state.handle = null
        const now = getNow()
        const minInterval = state.busy ? 1000 / 30 : 1000 / 6
        if (now - state.lastFlush < minInterval) {
          state.handle = window.requestAnimationFrame(step)
          return
        }
        const isBusy = state.busy
        state.busy = false
        if (modeRef.current === 'worker' && workerRef.current) {
          try {
            workerRef.current.postMessage({ type: 'flush', busy: isBusy })
          } catch {
            switchToFallback('worker-flush-failed')
            flushFallback()
          }
        } else {
          flushFallback()
        }
        state.lastFlush = now
      }
      state.handle = window.requestAnimationFrame(step)
    }

    const initWorker = () => {
      try {
        const blob = new Blob([INK_WORKER_SOURCE], { type: 'application/javascript' })
        const url = URL.createObjectURL(blob)
        workerUrlRef.current = url
        const worker = new Worker(url, { type: 'module' })
        workerRef.current = worker

        let offscreen: OffscreenCanvas | null = null
        if (typeof OffscreenCanvas === 'function') {
          offscreen = new OffscreenCanvas(TEXTURE_SIZE, TEXTURE_SIZE)
        } else {
          const canvas = document.createElement('canvas')
          if (typeof canvas.transferControlToOffscreen === 'function') {
            canvas.width = TEXTURE_SIZE
            canvas.height = TEXTURE_SIZE
            offscreen = canvas.transferControlToOffscreen()
          }
        }
        if (!offscreen) {
          switchToFallback('offscreen-unavailable')
          return
        }

        modeRef.current = 'worker'

        worker.onmessage = (event: MessageEvent) => {
          const msg = event.data as {
            type?: string
            buffer?: ArrayBuffer
            width?: number
            height?: number
            avgLuma?: number
            sampleCount?: number
            hasInk?: boolean
            revision?: number
            message?: unknown
          }
          if (!msg) {
            return
          }
          if (msg.type === 'ink' && msg.buffer instanceof ArrayBuffer) {
            const view = new Uint8Array(msg.buffer)
            processInkPayload({
              data: view,
              width: typeof msg.width === 'number' ? msg.width : TEXTURE_SIZE,
              height: typeof msg.height === 'number' ? msg.height : TEXTURE_SIZE,
              avgLuma: typeof msg.avgLuma === 'number' ? msg.avgLuma : 0,
              sampleCount: typeof msg.sampleCount === 'number' ? msg.sampleCount : 0,
              hasInk: !!msg.hasInk,
              revision: typeof msg.revision === 'number'
                ? msg.revision
                : diagnosticsRef.current.inkRevision + 1,
            })
            return
          }
          if (msg.type === 'error') {
            switchToFallback(String(msg.message ?? 'worker-error'))
          }
        }

        worker.onerror = (event) => {
          switchToFallback(String(event?.message ?? 'worker-error'))
        }

        worker.postMessage(
          {
            type: 'init',
            canvas: offscreen,
            width: TEXTURE_SIZE,
            height: TEXTURE_SIZE,
            brushRadius: BRUSH_RADIUS_PX,
          },
          [offscreen],
        )

        try {
          console.log('[dreamdust] ink-worker { enabled:true, offscreen:true }')
        } catch {
          /* noop */
        }
      } catch (error) {
        switchToFallback(String(error instanceof Error ? error.message : error))
      }
    }

    initWorker()
    if (modeRef.current === 'fallback') {
      ensureFallbackContext()
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
      const tickWatchdog = () => {
        if (guardLoggedRef.current) {
          stopGuardWatchdog()
          return
        }
        const current = typeof performance !== 'undefined' ? performance.now() : Date.now()
        if (current >= guardDeadlineRef.current) {
          stopGuardWatchdog()
          return
        }
        guardWatchdogRef.current = window.requestAnimationFrame(tickWatchdog)
      }
      guardWatchdogRef.current = window.requestAnimationFrame(tickWatchdog)
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

    const stopFlush = () => {
      const state = flushStateRef.current
      if (state.handle !== null) {
        window.cancelAnimationFrame(state.handle)
        state.handle = null
      }
      state.busy = false
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

    const drawAtClient = (client: Vec2) => {
      const contextElement = gl?.domElement
      const diagnostics = diagnosticsRef.current
      if (!contextElement) {
        return
      }
      const rect = contextElement.getBoundingClientRect()
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
      if (modeRef.current === 'worker' && workerRef.current) {
        try {
          workerRef.current.postMessage({
            type: 'stroke',
            reset: !lastCanvas,
            points: [currentPoint],
          })
        } catch {
          switchToFallback('worker-stroke-failed')
          const ctx = ensureFallbackContext()
          if (ctx) {
            if (!lastCanvas) {
              ctx.clearRect(0, 0, TEXTURE_SIZE, TEXTURE_SIZE)
              paintDiscFallback(ctx, currentPoint)
            } else {
              drawBetweenFallback(ctx, lastCanvas, currentPoint)
            }
          }
        }
      } else {
        const ctx = ensureFallbackContext()
        if (ctx) {
          if (!lastCanvas) {
            ctx.clearRect(0, 0, TEXTURE_SIZE, TEXTURE_SIZE)
            paintDiscFallback(ctx, currentPoint)
          } else {
            drawBetweenFallback(ctx, lastCanvas, currentPoint)
          }
        }
      }
      lastCanvasRef.current = currentPoint
      scheduleFlushInternal(true)
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!event.isPrimary || drawingRef.current) {
        return
      }
      const domElement = gl?.domElement
      if (!domElement) {
        return
      }
      try {
        domElement.setPointerCapture(event.pointerId)
      } catch {
        // Ignore pointer-capture failures
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
      const diagnostics = diagnosticsRef.current
      diagnostics.penDownFrame = diagnostics.frame
      diagnostics.penDownTime = getNow()
      diagnostics.pendingLatency = true
      diagnostics.inkLogged = false
      startGuardWatchdog()
      markInkPenDown()
      drawAtClient({ x: event.clientX, y: event.clientY })
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
          // Ignore release failures
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
          `[PC] draw end { type: '${type}', durationMs: ${durationMs.toFixed(1)}, distancePx: ${distancePx.toFixed(1)} }`,
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
      scheduleFlushInternal(false)
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
    scheduleFlushInternal(false)

    return () => {
      stopFlush()
      readbackCoalesceLoggedRef.current = false
      if (guardFanoutRafRef.current !== null) {
        window.cancelAnimationFrame(guardFanoutRafRef.current)
        guardFanoutRafRef.current = null
      }
      stopGuardWatchdog()
      domElement?.removeEventListener('pointerdown', handlePointerDown)
      domElement?.removeEventListener('pointermove', handlePointerMove)
      domElement?.removeEventListener('pointerup', handlePointerUp)
      domElement?.removeEventListener('pointercancel', handlePointerCancel)
      domElement?.removeEventListener('pointerleave', handlePointerCancel)
      terminateWorker()
      texture.dispose?.()
      ctxRef.current = null
      fallbackCtxRef.current = null
      dataRef.current = null
      textureRef.current = null
      resetDrawingState()
    }
  }, [gl, getNow, scheduleGuardFanoutLog])

  return null
}

export default InkSurface
