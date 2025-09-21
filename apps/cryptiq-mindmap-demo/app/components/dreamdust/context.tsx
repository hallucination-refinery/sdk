'use client'

import * as React from 'react'

import { type DreamdustRuntimeCaps } from './capabilities'
import { ackDreamdustCapsFanout } from './metrics'

type InkTexture = import('three').Texture | null

type CascadeColor = [number, number, number]

type StartCascade = (color: CascadeColor) => void

type FrozenDreamdustCaps = Readonly<DreamdustRuntimeCaps>

type MirrorState = Readonly<{ lr: boolean; ud: boolean }>

type DreamdustContextValue = {
  startCascade: StartCascade
  inkTex?: InkTexture
  inkIntensity: number
  setInkTex: React.Dispatch<React.SetStateAction<InkTexture | undefined>>
  setInkIntensity: React.Dispatch<React.SetStateAction<number>>
  vertexInkOk: boolean
  setVertexInkOk: React.Dispatch<React.SetStateAction<boolean>>
  controlsLocked: boolean
  setControlsLocked: React.Dispatch<React.SetStateAction<boolean>>
  heatmapVisible: boolean
  setHeatmapVisible: React.Dispatch<React.SetStateAction<boolean>>
  caps: FrozenDreamdustCaps | null
  setCaps: (caps: FrozenDreamdustCaps | null) => void
  mirror: MirrorState
  setMirrorFlags: (mirrorLR: boolean, mirrorUD: boolean) => void
}

type CapsReadyCallback = (caps: FrozenDreamdustCaps) => void

const capsReadyListeners = new Set<CapsReadyCallback>()
let latestCaps: FrozenDreamdustCaps | null = null

const DreamdustContext = React.createContext<DreamdustContextValue | undefined>(
  undefined,
)

export function DreamdustProvider({ children }: React.PropsWithChildren) {
  const cascadeStarterRef = React.useRef<StartCascade>(() => {})
  const [inkTex, setInkTex] = React.useState<InkTexture>()
  const [inkIntensity, setInkIntensity] = React.useState<number>(1)
  const capsRef = React.useRef<FrozenDreamdustCaps | null>(null)
  const [caps, setCapsState] = React.useState<FrozenDreamdustCaps | null>(null)
  const setCaps = React.useCallback((nextCaps: FrozenDreamdustCaps | null) => {
    if (capsRef.current === nextCaps) {
      return
    }
    capsRef.current = nextCaps
    setCapsState(nextCaps)
    if (nextCaps) {
      latestCaps = nextCaps
      ackDreamdustCapsFanout('context')
      const listeners = Array.from(capsReadyListeners)
      for (const listener of listeners) {
        try {
          listener(nextCaps)
        } catch {
          // Ignore listener errors to keep fan-out resilient.
        }
      }
    } else if (latestCaps) {
      latestCaps = null
    }
  }, [])
  const [vertexInkOkState, setVertexInkOkState] = React.useState<boolean>(false)
  const setVertexInkOk = React.useCallback<React.Dispatch<React.SetStateAction<boolean>>>(
    (update) => {
      setVertexInkOkState((prev) => {
        const next = typeof update === 'function' ? (update as (value: boolean) => boolean)(prev) : update
        if (capsRef.current) {
          ackDreamdustCapsFanout('host')
        }
        return next === prev ? prev : next
      })
    },
    [],
  )
  const vertexInkOk = vertexInkOkState
  const [controlsLocked, setControlsLocked] = React.useState(false)
  const [heatmapVisible, setHeatmapVisible] = React.useState(false)
  const [mirror, setMirror] = React.useState<MirrorState>(() => Object.freeze({ lr: false, ud: true }))
  const setMirrorFlags = React.useCallback((mirrorLR: boolean, mirrorUD: boolean) => {
    setMirror((prev) => {
      const nextLR = !!mirrorLR
      const nextUD = !!mirrorUD
      if (prev.lr === nextLR && prev.ud === nextUD) {
        return prev
      }
      return Object.freeze({ lr: nextLR, ud: nextUD }) as MirrorState
    })
  }, [])

  const startCascade = React.useCallback<StartCascade>((color) => {
    cascadeStarterRef.current(color)
  }, [])

  const value = React.useMemo(
    () => ({
      startCascade,
      inkTex,
      inkIntensity,
      setInkTex,
      setInkIntensity,
      vertexInkOk,
      setVertexInkOk,
      controlsLocked,
      setControlsLocked,
      heatmapVisible,
      setHeatmapVisible,
      caps,
      setCaps,
      mirror,
      setMirrorFlags,
    }),
    [
      startCascade,
      inkTex,
      inkIntensity,
      vertexInkOk,
      controlsLocked,
      heatmapVisible,
      caps,
      mirror,
      setCaps,
      setMirrorFlags,
      setVertexInkOk,
    ],
  )

  return (
    <DreamdustContext.Provider value={value}>
      {children}
    </DreamdustContext.Provider>
  )
}

export function useDreamdustCtx() {
  const context = React.useContext(DreamdustContext)
  if (!context) {
    throw new Error('useDreamdustCtx must be used within a DreamdustProvider')
  }
  return context
}

export function useDreamdustCaps(): FrozenDreamdustCaps | null {
  const context = React.useContext(DreamdustContext)
  return context?.caps ?? null
}

export function onCapsReady(callback?: CapsReadyCallback | null): () => void {
  if (typeof callback !== 'function') {
    return () => {}
  }

  capsReadyListeners.add(callback)

  if (latestCaps) {
    try {
      callback(latestCaps)
    } catch {
      // Listener errors should not disrupt registration.
    }
  }

  return () => {
    capsReadyListeners.delete(callback)
  }
}
