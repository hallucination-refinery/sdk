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
  onForceSample?: (sample: { delta: [number, number]; uv: [number, number] }) => void
  onForceSplat?: (uv: [number, number], radius: number, strength: number) => void
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
  onForceSample,
  onForceSplat,
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
  const onStartRef = React.useRef(onStart)
  const onEndRef = React.useRef(onEnd)
  const onTextureRef = React.useRef(onTexture)
  const onForceSampleRef = React.useRef(onForceSample)
  const mirrorRef = React.useRef({ lr: !!mirrorLR, ud: !!mirrorUD })
  const guardLoggedRef = React.useRef(true)
  const guardWatchdogRef = React.useRef<number | null>(null)
  const guardDeadlineRef = React.useRef(0)

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
    onForceSampleRef.current = onForceSample
  }, [onForceSample])

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
    const ctx = canvas.getContext('2d')
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

    const flushTexture = () => {
      const context = ctxRef.current
      const arr = dataRef.current
      const tex = textureRef.current
      if (!context || !arr || !tex) {
        return
      }
      const imageData = context.getImageData(0, 0, TEXTURE_SIZE, TEXTURE_SIZE)
      arr.set(imageData.data)
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
        return
      }
      rafRef.current = window.requestAnimationFrame(() => {
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

    type PointerInfo = {
      uv: [number, number]
      width: number
      height: number
    }

    const resolvePointer = (client: Vec2): PointerInfo | null => {
      const domElement = gl?.domElement
      if (!domElement) {
        return null
      }
      const rect = domElement.getBoundingClientRect()
      const width = rect.width || 0
      const height = rect.height || 0
      if (width <= 0 || height <= 0) {
        return null
      }
      const offsetX = client.x - rect.left
      const offsetY = client.y - rect.top
      const rawU = width > 0 ? offsetX / width : Number.NaN
      const rawV = height > 0 ? offsetY / height : Number.NaN
      const u = clamp01(rawU)
      const vRaw = clamp01(rawV)
      const mirror = mirrorRef.current
      const v = mirror.ud ? 1 - vRaw : vRaw
      logInkGuard(rawU, rawV, u, v)
      return { uv: [u, v], width, height }
    }

    const drawAtClient = (client: Vec2, infoOverride?: PointerInfo | null) => {
      const context = ctxRef.current
      if (!context) {
        return
      }
      const info = infoOverride ?? resolvePointer(client)
      if (!info) {
        return
      }
      const {
        uv: [u, v],
        width,
        height,
      } = info
      const canvasX = u * TEXTURE_SIZE
      const canvasY = v * TEXTURE_SIZE
      const lastClient = lastClientRef.current
      if (lastClient) {
        distanceRef.current += Math.hypot(client.x - lastClient.x, client.y - lastClient.y) || 0
        const cb = onForceSampleRef.current
        if (typeof cb === 'function' && width > 0 && height > 0) {
          const dxNorm = (client.x - lastClient.x) / width
          const dyNorm = (client.y - lastClient.y) / height
          cb({ delta: [dxNorm, dyNorm], uv: [u, v] })
        }
        if (typeof onForceSplat === 'function') {
          const movePx = Math.hypot(client.x - lastClient.x, client.y - lastClient.y)
          const strength = Math.min(1, movePx / 24)
          onForceSplat([u, v], BRUSH_RADIUS_PX / TEXTURE_SIZE, strength)
        }
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
      try {
        console.warn('[PC] mid-stroke uniforms dump (request)')
        const w: any = window as any
        if (w?.dreamdust?.dumpUniforms) w.dreamdust.dumpUniforms()
      } catch {
        // noop
      }
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
      const pointerInfo = resolvePointer({ x: event.clientX, y: event.clientY })
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
      startGuardWatchdog()
      drawAtClient({ x: event.clientX, y: event.clientY }, pointerInfo)
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
      if (pointerInfo && typeof onForceSplat === 'function') {
        const radius = Math.max(0.06, BRUSH_RADIUS_PX / TEXTURE_SIZE)
        onForceSplat(pointerInfo.uv, radius, 0.6)
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
  }, [gl])

  return null
}

export default InkSurface
