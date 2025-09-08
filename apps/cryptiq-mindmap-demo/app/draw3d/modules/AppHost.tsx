'use client'

import { useEffect, useRef, useState } from 'react'
import DoodleCanvas from './canvas/DoodleCanvas'
import { make28x28Canvas } from './canvas/preprocess'
import { classify, loadDoodleNet } from './ml/doodlenet'
import type { DoodleCanvasHandle } from './types'
import FormationView from './renderer/FormationView'
import HUD from './ui/HUD'

const aliasMap: Record<string, string> = {
  ship: 'boat',
  cellphone: 'phone',
  mobile: 'phone',
  leaf: 'flower',
  mug: 'phone',
  telephone: 'phone',
}

const seeded = new Set([
  'balloon',
  'bird',
  'boat',
  'car',
  'cat',
  'cup',
  'fish',
  'flower',
  'house',
  'phone',
  'tree',
])

const MIN_AREA = 32 * 32
const MIN_LENGTH = 80

async function fetchFormation(name: string): Promise<Float32Array> {
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
  const [positions, setPositions] = useState<Float32Array | null>(null)
  const [ready, setReady] = useState(false)
  const [loadMs, setLoadMs] = useState(0)
  const [inferMs, setInferMs] = useState(0)
  const [fps, setFps] = useState(0)
  const [busy, setBusy] = useState(false)
  const canvasRef = useRef<DoodleCanvasHandle>(null)
  const inferRef = useRef(false)

  const meetsInk = () => {
    const { area, length } = canvasRef.current?.getInkMetrics() ?? { area: 0, length: 0 }
    return area > MIN_AREA && length > MIN_LENGTH
  }

  const classifyNow = async () => {
    if (inferRef.current || !meetsInk()) return
    const canvas = canvasRef.current?.toCanvas()
    if (!canvas) return
    inferRef.current = true
    setBusy(true)
    try {
      const preStart = performance.now()
      const off = make28x28Canvas(canvas)
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
      const [pred] = await classify(off, 1)
      const iMs = performance.now() - inferStart
      setInferMs(iMs)

      console.log(`pre ${preMs.toFixed(1)}ms load ${lMs.toFixed(1)}ms infer ${iMs.toFixed(1)}ms`)

      const label = pred?.label
      if (label) {
        const normalized = aliasMap[label] ?? (seeded.has(label) ? label : 'unknown')
        try {
          const form = await fetchFormation(normalized)
          setPositions(form)
        } catch {
          setPositions(fallbackFormation())
        }
      }
    } finally {
      inferRef.current = false
      setBusy(false)
    }
  }

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
    ;(window as any).classifyNow = classifyNow
    return () => {
      delete (window as any).classifyNow
    }
  }, [classifyNow])

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', background: '#000' }}>
      <HUD
        ready={ready}
        loadMs={Math.round(loadMs)}
        inferMs={Math.round(inferMs)}
        fps={fps}
        instances={positions ? positions.length / 3 : 0}
        onClassify={classifyNow}
        onClear={() => {
          canvasRef.current?.clear()
          setPositions(null)
        }}
        onUndo={() => {
          canvasRef.current?.undo()
        }}
        busy={busy}
      />
      <DoodleCanvas ref={canvasRef} />
      {positions && <FormationView positions={positions} />}
    </div>
  )
}
