'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import DoodleCanvas from './canvas/DoodleCanvas'
import { make28x28Canvas } from './canvas/preprocess'
import { classify, loadDoodleNet } from './ml/doodlenet'
import type { DoodleCanvasHandle } from './types'
import MorphFormationView from './renderer/MorphFormationView'
import HUD from './ui/HUD'
import { normalizeLabel } from './data/labelMap'
import { rasterToCloud, resampleCloud } from './canvas/rasterToCloud'
import '../styles/draw3d.css'

const formationCache = new Map<string, Promise<Float32Array>>()

const MIN_AREA = 32 * 32
const MIN_LENGTH = 80
const IDLE_MS = 3000

async function fetchFormation(name: string): Promise<Float32Array> {
  let promise = formationCache.get(name)
  if (!promise) {
    promise = (async () => {
      const url = `/formations/${name}.json`
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      const raw = Array.isArray(json) ? json : json.positions
      const flat: number[] = Array.isArray(raw?.[0])
        ? (raw as number[][]).flat()
        : ((raw as number[]) ?? [])
      if (flat.length % 3 !== 0) throw new Error('invalid formation')
      return new Float32Array(flat)
    })()
    formationCache.set(name, promise)
  }
  try {
    return await promise
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

export default function AppHost() {
  const [morph, setMorph] = useState<null | {
    source: Float32Array
    target: Float32Array
    fitScale?: number
    bounce?: boolean
  }>(null)
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
  const devControls = useMemo(() => {
    if (process.env.NEXT_PUBLIC_DRAW3D_DEBUG_UI === '1') return true
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).has('debug')
    }
    return false
  }, [])

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
    setMorph(null)
    const canvas = canvasRef.current?.toCanvas()
    if (!canvas) return
    inferRef.current = true
    setBusy(true)
    const fadeStart = performance.now()
    canvasWrapRef.current?.classList.add('stroke-fade')
    try {
      console.log('[commitFired]')
      const preStart = performance.now()
      const off = make28x28Canvas(canvas)
      let strokeCloud = rasterToCloud(canvas, {
        threshold: 200,
        stride: 4
      })
      if (strokeCloud.length / 3 > 256) {
        strokeCloud = resampleCloud(strokeCloud, 256)
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
      let target: Float32Array
      let fitScale: number | undefined
      let bounce = true

      if (normalized === 'unknown') {
        target = strokeCloud
        bounce = false
      } else if (normalized) {
        try {
          target = await fetchFormation(normalized)
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

      setMorph({ source: strokeCloud, target, fitScale, bounce })
    } finally {
      inferRef.current = false
      setBusy(false)
    }
  }

  const resetTimer = () => {
    console.log('[strokeEnd]')
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
      if (!inferRef.current && meetsInk()) classifyNow()
    }, IDLE_MS)
    console.log(`[timerScheduled] ${IDLE_MS}ms`)
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
        instances={morph ? morph.target.length / 3 : 0}
        onClassify={devControls ? classifyNow : undefined}
        onClear={() => {
          canvasRef.current?.clear()
          setMorph(null)
          canvasWrapRef.current?.classList.remove('stroke-fade')
          if (timerRef.current) {
            clearTimeout(timerRef.current)
            timerRef.current = null
          }
        }}
        onUndo={() => {
          canvasRef.current?.undo()
          if (timerRef.current) {
            clearTimeout(timerRef.current)
            timerRef.current = null
          }
        }}
        autoEnabled={autoEnabled}
        onToggleAuto={devControls ? setAutoEnabled : undefined}
        busy={busy}
        devControls={devControls}
      />
      <div ref={canvasWrapRef} style={{ position: 'absolute', inset: 0 }}>
        <DoodleCanvas ref={canvasRef} onStrokeEnd={resetTimer} />
      </div>
      {morph && (
        <MorphFormationView
          source={morph.source}
          target={morph.target}
          fitScale={morph.fitScale}
          durationMs={500}
          bounce={morph.bounce}
        />
      )}
    </div>
  )
}
