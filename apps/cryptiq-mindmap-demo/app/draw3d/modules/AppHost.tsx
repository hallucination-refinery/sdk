'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import DoodleCanvas from './canvas/DoodleCanvas'
import { make28x28Canvas } from './canvas/preprocess'
import { classify, loadDoodleNet } from './ml/doodlenet'
import type { DoodleCanvasHandle } from './types'
import MorphFormationView from './renderer/MorphFormationView'
import HUD from './ui/HUD'
import { normalizeLabel } from './data/labelMap'
import { rasterToCloud, resampleCloud, getEffectiveRasterConfig } from './canvas/rasterToCloud'
import { capInstances } from './renderer/perf'
import '../styles/draw3d.css'

const formationCache = new Map<
  string,
  { promise: Promise<Float32Array>; meta: { jsonLen: number; flatLen: number; mod3Ok: boolean } }
>()

const MIN_AREA = 32 * 32
const MIN_LENGTH = 80
const IDLE_MS = 3000

async function fetchFormation(name: string, trace?: any): Promise<Float32Array> {
  const url = `/formations/${name}.json`
  const cached = formationCache.get(name)
  const cacheHit = !!cached
  if (cached) {
    if (trace) trace.formation = { url, cacheHit, ...cached.meta }
    return cached.promise
  }
  const meta = { jsonLen: 0, flatLen: 0, mod3Ok: false }
  const promise = (async () => {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json = await res.json()
    meta.jsonLen = JSON.stringify(json).length
    const raw = Array.isArray(json) ? json : json.positions
    const flat: number[] = Array.isArray(raw?.[0])
      ? (raw as number[][]).flat()
      : ((raw as number[]) ?? [])
    meta.flatLen = flat.length
    meta.mod3Ok = flat.length % 3 === 0
    if (!meta.mod3Ok) throw new Error('invalid formation')
    return new Float32Array(flat)
  })()
  formationCache.set(name, { promise, meta })
  try {
    const arr = await promise
    if (trace) trace.formation = { url, cacheHit, ...meta }
    return arr
  } catch (e) {
    formationCache.delete(name)
    throw e
  }
}

function fallbackFormation(count = 256, scale = 1.8): Float32Array {
  const arr = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2
    arr[i * 3] = Math.cos(angle) * scale
    arr[i * 3 + 1] = Math.sin(angle) * scale
    arr[i * 3 + 2] = 0
  }
  return arr
}

function synthesizeCloud(count = 200): Float32Array {
  const arr = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2
    const r = 1.2 + (Math.random() - 0.5) * 0.3
    arr[i * 3] = Math.cos(angle) * r
    arr[i * 3 + 1] = Math.sin(angle) * r
    arr[i * 3 + 2] = (Math.random() - 0.5) * 0.3
  }
  return arr
}

function getEnv() {
  if (typeof navigator === 'undefined') return {}
  const ua = navigator.userAgent
  let browser = 'unknown'
  let os = 'unknown'
  if (/Chrome\//.test(ua)) browser = 'Chrome'
  else if (/Safari\//.test(ua)) browser = 'Safari'
  else if (/Firefox\//.test(ua)) browser = 'Firefox'
  else if (/Edge\//.test(ua)) browser = 'Edge'
  if (/Windows/.test(ua)) os = 'Windows'
  else if (/Mac OS X/.test(ua)) os = 'macOS'
  else if (/Android/.test(ua)) os = 'Android'
  else if (/iPhone|iPad|iPod/.test(ua)) os = 'iOS'
  else if (/Linux/.test(ua)) os = 'Linux'
  let gpu = ''
  const canvas = document.createElement('canvas')
  const gl = canvas.getContext('webgl')
  if (gl) {
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
    if (debugInfo) {
      gpu = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
    }
  }
  return { browser, os, gpu, dpr: window.devicePixelRatio }
}

export default function AppHost() {
  const [morph, setMorph] = useState<{
    source?: Float32Array
    target: Float32Array
    fitScale?: number
    bounce?: boolean
  }>({ target: new Float32Array() })
  const [ready, setReady] = useState(false)
  const [loadMs, setLoadMs] = useState(0)
  const [inferMs, setInferMs] = useState(0)
  const [fps, setFps] = useState(0)
  const [busy, setBusy] = useState(false)
  const [autoEnabled, setAutoEnabled] = useState(true)
  const canvasRef = useRef<DoodleCanvasHandle>(null)
  const canvasWrapRef = useRef<HTMLDivElement>(null)
  const inferRef = useRef(false)
  const timerRef = useRef<number | null>(null)
  const traceEnabled = useMemo(() => {
    if (process.env.NEXT_PUBLIC_DRAW3D_TRACE === '1') return true
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).has('trace')
    }
    return false
  }, [])
  const traceRef = useRef<any | null>(null)
  const devControls = useMemo(() => {
    if (process.env.NEXT_PUBLIC_DRAW3D_DEBUG_UI === '1') return true
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).has('debug')
    }
    return false
  }, [])

  // Integration seam: emit result payload for Mindmap
  const onResult = (payload: {
    label: string
    confidence: number
    topK: Array<{ label: string; confidence: number }>
    formation: Float32Array
    fitScale: number
    counts: { cloud: number; target: number }
    timings: { pre: number; load: number; infer: number }
  }) => {
    // For now, log once per commit to validate payload shape
    console.debug('[result]', payload)
  }

  const meetsInk = () => {
    const m = canvasRef.current?.getInkMetrics()
    const area = m?.area ?? 0
    const length = m?.length ?? 0
    const w = m?.bbox.width ?? 0
    const h = m?.bbox.height ?? 0
    const ok = area > MIN_AREA && length > MIN_LENGTH && w >= 32 && h >= 32
    if (!ok) {
      console.log('[gateRejected]', { area, length, w, h, MIN_AREA, MIN_LENGTH })
    }
    return ok
  }

  const classifyNow = async () => {
    if (inferRef.current) {
      console.log('[commitSuppressed] inFlight')
      return
    }
    if (!meetsInk()) return
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    setMorph((m) => ({ ...m, source: undefined, target: new Float32Array(), fitScale: undefined }))
    const canvas = canvasRef.current?.toCanvas()
    if (!canvas) return
    inferRef.current = true
    setBusy(true)
    const fadeStart = performance.now()
    canvasWrapRef.current?.classList.add('stroke-fade')
    try {
      console.log('[commitFired]')
      if (traceEnabled) {
        traceRef.current = traceRef.current || {}
        traceRef.current.commitFired = performance.now()
      }
      // Defer heavy canvas readbacks until after paint to avoid long-task warnings
      await new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
      )
      const preStart = performance.now()
      const off = make28x28Canvas(canvas)
      let strokeCloud = rasterToCloud(canvas, {
        threshold: 185,
        stride: 3,
        jitter: 0,
      })
      if (strokeCloud.length / 3 > 256) {
        strokeCloud = resampleCloud(strokeCloud, 256)
      }
      let cloudCount = strokeCloud.length / 3
      if (cloudCount === 0) {
        strokeCloud = synthesizeCloud()
        cloudCount = strokeCloud.length / 3
        if (traceEnabled && traceRef.current) traceRef.current.synthesized = true
      }
      if (traceEnabled && traceRef.current) {
        const cfg = getEffectiveRasterConfig()
        traceRef.current.raster = {
          count: cloudCount,
          threshold: cfg.threshold,
          stride: cfg.stride,
          minCount: cfg.minCount,
          jitter: cfg.jitter,
        }
      }
      const preMs = performance.now() - preStart

      let lMs = loadMs
      if (!ready) {
        const loadStart = performance.now()
        await loadDoodleNet()
        lMs = performance.now() - loadStart
        setLoadMs(lMs)
        setReady(true)
      }

      const inferStart = performance.now()
      const preds = await classify(off, 5)
      const iMs = performance.now() - inferStart
      setInferMs(iMs)

      console.log(`pre ${preMs.toFixed(1)}ms load ${lMs.toFixed(1)}ms infer ${iMs.toFixed(1)}ms`)

      const normalized = normalizeLabel(preds[0]?.label ?? '', preds)
      if (traceEnabled && traceRef.current) traceRef.current.classify = { topK: preds, normalized }
      let target: Float32Array
      let fitScale: number | undefined
      let bounce = true

      if (normalized === 'unknown') {
        target = strokeCloud
        bounce = false
      } else if (normalized) {
        try {
          target = await fetchFormation(normalized, traceRef.current)
        } catch {
          target = fallbackFormation()
        }
        const m = canvasRef.current?.getInkMetrics()
        const cw = canvas.width
        const ch = canvas.height
        const bw = m?.bbox.width ?? 0
        const bh = m?.bbox.height ?? 0
        const maxDim = Math.max(bw, bh)
        const maxCanvas = Math.max(cw, ch)
        fitScale = maxDim > 0 ? maxDim / maxCanvas : 1
      } else {
        target = fallbackFormation()
      }

      const revealTime = fadeStart + 300 + 200
      const delay = revealTime - performance.now()
      if (delay > 0) await new Promise((r) => setTimeout(r, delay))
      const maxCount = Math.max(strokeCloud.length, target.length) / 3
      const visibleCount = capInstances(maxCount)
      const capApplied = visibleCount < maxCount
      if (traceEnabled && traceRef.current)
        traceRef.current.morph = {
          targetCount: target.length / 3,
          capApplied,
          visibleCount,
          fitScale: fitScale ?? 1,
          env: getEnv(),
          fps,
        }
      setMorph({ source: strokeCloud, target, fitScale, bounce })
      // Emit result payload for integration validation
      try {
        onResult({
          label: normalized || 'unknown',
          confidence: preds[0]?.confidence ?? 0,
          topK: preds as any,
          formation: target,
          fitScale: fitScale ?? 1,
          counts: { cloud: cloudCount, target: target.length / 3 },
          timings: { pre: preMs, load: lMs, infer: iMs },
        })
      } catch (err) {
        console.warn('[result] emit failed', err)
      }
      if (traceEnabled && traceRef.current) {
        const t = Object.freeze({ ...traceRef.current })
        ;(window as any).__draw3dTraces = ((window as any).__draw3dTraces || []) as any[]
        ;(window as any).__draw3dTraces.push(t)
        console.debug('[trace]', t)
        traceRef.current = null
      }
    } finally {
      inferRef.current = false
      setBusy(false)
    }
  }

  const cancelTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  const resetTimer = () => {
    console.log('[strokeEnd]')
    if (traceEnabled) traceRef.current = { strokeEnd: performance.now() }
    if (!autoEnabled) return
    if (inferRef.current) {
      console.log('[timerCancelled] inFlight')
      return
    }
    if (!meetsInk()) return
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null
      console.log('[timerFired]')
      if (traceEnabled && traceRef.current) traceRef.current.timerFired = performance.now()
      if (!inferRef.current && meetsInk()) classifyNow()
    }, IDLE_MS)
    console.log(`[timerScheduled] ${IDLE_MS}ms`)
    if (traceEnabled && traceRef.current)
      traceRef.current.timerScheduled = { idleMs: IDLE_MS, ts: performance.now() }
  }

  useEffect(() => {
    if (!autoEnabled && timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [autoEnabled])

  // simple fps tracker
  useEffect(() => {
    let frame = 0
    let last = performance.now()
    let raf: number
    const loop = (t: number) => {
      frame++
      const delta = t - last
      if (delta >= 1000) {
        setFps(Math.round((frame * 1000) / delta))
        frame = 0
        last = t
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    if (!devControls) return
    ;(window as any).classifyNow = classifyNow
    return () => {
      delete (window as any).classifyNow
    }
  }, [classifyNow, devControls])

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', background: '#000' }}>
      <HUD
        ready={ready}
        loadMs={Math.round(loadMs)}
        inferMs={Math.round(inferMs)}
        fps={fps}
        instances={morph.target.length / 3}
        onClassify={devControls ? classifyNow : undefined}
        onClear={() => {
          canvasRef.current?.clear()
          setMorph((m) => ({
            ...m,
            source: undefined,
            target: new Float32Array(),
            fitScale: undefined,
          }))
          canvasWrapRef.current?.classList.remove('stroke-fade')
          if (timerRef.current) {
            clearTimeout(timerRef.current)
            timerRef.current = null
          }
        }}
        onUndo={() => {
          canvasRef.current?.undo()
          canvasWrapRef.current?.classList.remove('stroke-fade')
          if (timerRef.current) {
            clearTimeout(timerRef.current)
            timerRef.current = null
          }
        }}
        autoEnabled={autoEnabled}
        onToggleAuto={devControls ? setAutoEnabled : undefined}
        busy={busy}
        devControls={devControls}
        showCopyTrace={traceEnabled}
      />
      <div ref={canvasWrapRef} style={{ position: 'absolute', inset: 0 }}>
        <DoodleCanvas ref={canvasRef} onStrokeStart={cancelTimer} onStrokeEnd={resetTimer} />
      </div>
      <MorphFormationView
        source={morph.source}
        target={morph.target}
        fitScale={morph.fitScale}
        durationMs={500}
        bounce={morph.bounce}
      />
    </div>
  )
}
