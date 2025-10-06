'use client'

import * as React from 'react'

import { getDebugFlags, type DebugFlags } from './getDebugFlags'

export type SimTelemetrySnapshot = {
  min: number; max: number; avg: number; nanCount: number; infCount: number; texSize: [number, number]; grid: number
}
export type InkTelemetrySnapshot = { size: number; alpha: number; reveal: number }

const num = (value: unknown, fallback = 0) =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback
const count = (value: unknown) => Math.max(0, Math.floor(num(value)))
const parseSim = (payload: unknown): SimTelemetrySnapshot | null => {
  if (typeof payload !== 'object' || !payload) return null
  const r = payload as Record<string, unknown>
  const tex = Array.isArray(r.texSize) ? r.texSize : []
  return { min: num(r.min), max: num(r.max), avg: num(r.avg), nanCount: count(r.nanCount), infCount: count(r.infCount), texSize: [num(tex[0]), num(tex[1])], grid: count(r.grid) }
}
const parseInk = (payload: unknown): InkTelemetrySnapshot | null => {
  if (typeof payload !== 'object' || !payload) return null
  const r = payload as Record<string, unknown>
  return { size: num(r.size), alpha: num(r.alpha), reveal: num(r.reveal) }
}

export type DreamdustAestheticPreset = 'current' | 'A' | 'B1' | 'B2' | 'C' | 'D1' | 'D2'

type DebugControlState = {
  flags: DebugFlags
  simSnapshot: SimTelemetrySnapshot | null
  inkSnapshot: InkTelemetrySnapshot | null
  aestheticPreset: DreamdustAestheticPreset
  setAestheticPreset: React.Dispatch<React.SetStateAction<DreamdustAestheticPreset>>
}

export function useDebugControls(initialFlags?: DebugFlags): DebugControlState {
  const flags = React.useMemo(() => initialFlags ?? getDebugFlags(), [initialFlags])
  const [simSnapshot, setSimSnapshot] = React.useState<SimTelemetrySnapshot | null>(null)
  const [inkSnapshot, setInkSnapshot] = React.useState<InkTelemetrySnapshot | null>(null)
  const [aestheticPreset, setAestheticPreset] = React.useState<DreamdustAestheticPreset>('current')

  React.useEffect(() => {
    if (!flags.simStats) setSimSnapshot(null)
    if (!flags.inkStats) setInkSnapshot(null)
  }, [flags.simStats, flags.inkStats])

  React.useEffect(() => {
    if (process.env.NODE_ENV === 'production') return
    if (!flags.simStats && !flags.inkStats) return
    if (typeof window === 'undefined') return
    const original = console.info
    if (typeof original !== 'function') return
    const patched: typeof console.info = (...args) => {
      if (flags.simStats && args[0] === '[sim] metrics') {
        const next = parseSim(args[1])
        if (next) setSimSnapshot(next)
      } else if (flags.inkStats && args[0] === '[ink] point-stats') {
        const next = parseInk(args[1])
        if (next) setInkSnapshot(next)
      }
      return original.apply(console, args as Parameters<typeof console.info>)
    }
    console.info = patched
    return () => {
      console.info = original
    }
  }, [flags.inkStats, flags.simStats])

  if (process.env.NODE_ENV === 'production' || (!flags.simStats && !flags.inkStats)) {
    return { flags, simSnapshot: null, inkSnapshot: null, aestheticPreset, setAestheticPreset }
  }
  return { flags, simSnapshot, inkSnapshot, aestheticPreset, setAestheticPreset }
}
