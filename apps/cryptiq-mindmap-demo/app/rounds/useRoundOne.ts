'use client'

import { useCallback, useEffect, useState } from 'react'
import type { Draw3DResult } from '../draw3d/modules/types'

interface TraceWindow extends Window {
  __draw3dTraces?: unknown
}

export type RoundOneState =
  | 'idle'
  | 'hyperdriveDone'
  | 'countdown'
  | 'drawingEnabled'
  | 'resultReceived'
  | 'progressShown'

export interface RoundOneHook {
  state: RoundOneState
  result: Draw3DResult | null
  hyperdriveDone: () => void
  startCountdown: () => void
  enableDrawing: () => void
  onResult: (r?: Draw3DResult) => void
  showProgress: () => void
}

export default function useRoundOne(): RoundOneHook {
  const [state, setState] = useState<RoundOneState>('idle')
  const [result, setResult] = useState<Draw3DResult | null>(null)

  const hyperdriveDone = useCallback(() => setState('hyperdriveDone'), [])
  const startCountdown = useCallback(() => setState('countdown'), [])
  const enableDrawing = useCallback(() => setState('drawingEnabled'), [])
  const onResult = useCallback((r?: Draw3DResult) => {
    let next = r
    if (!next && typeof window !== 'undefined') {
      const traces = (window as TraceWindow).__draw3dTraces
      if (Array.isArray(traces)) {
        next = traces[traces.length - 1]
      } else {
        next = traces
      }
    }
    if (next) setResult(next)
    setState('resultReceived')
  }, [])
  const showProgress = useCallback(() => setState('progressShown'), [])

  useEffect(() => {
    if (state !== 'drawingEnabled' || result) return
    const id = window.setInterval(() => {
      const traces = (window as TraceWindow).__draw3dTraces
      const last = Array.isArray(traces)
        ? traces[traces.length - 1]
        : traces
      if (last) {
        onResult(last as Draw3DResult)
      }
    }, 500)
    return () => clearInterval(id)
  }, [state, onResult, result])

  return {
    state,
    result,
    hyperdriveDone,
    startCountdown,
    enableDrawing,
    onResult,
    showProgress,
  }
}

