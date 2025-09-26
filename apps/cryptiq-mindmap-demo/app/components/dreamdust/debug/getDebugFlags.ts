'use client'

export type DebugFlags = {
  debug: boolean
  engineSim: boolean
  inkProbe: boolean
  simProbe: boolean
  simStats: boolean
  inkStats: boolean
}

const DEFAULT_FLAGS: DebugFlags = {
  debug: false,
  engineSim: false,
  inkProbe: false,
  simProbe: false,
  simStats: false,
  inkStats: false,
}
let cachedSearch: string | null = null
let cachedFlags: DebugFlags = DEFAULT_FLAGS
const toFlag = (value: string | null) =>
  typeof value === 'string' && ['1', 'true'].includes(value.trim().toLowerCase())

export function getDebugFlags(): DebugFlags {
  if (typeof window === 'undefined') return DEFAULT_FLAGS
  const { search } = window.location
  if (cachedSearch === search) return cachedFlags
  cachedSearch = search
  try {
    const params = new URLSearchParams(search)
    const engineSim = (params.get('engine') ?? '').trim().toLowerCase() === 'sim'
    cachedFlags = {
      debug: params.get('debug') === '1',
      engineSim,
      inkProbe: toFlag(params.get('inkProbe')),
      simProbe: toFlag(params.get('simProbe')),
      simStats: engineSim && toFlag(params.get('simStats')),
      inkStats: engineSim && toFlag(params.get('inkStats')),
    }
  } catch {
    cachedFlags = DEFAULT_FLAGS
  }
  return cachedFlags
}
