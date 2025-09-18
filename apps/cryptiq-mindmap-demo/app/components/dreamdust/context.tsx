'use client'

import * as React from 'react'

type InkTexture = import('three').Texture | null

type CascadeColor = [number, number, number]

type StartCascade = (color: CascadeColor) => void

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
}

const DreamdustContext = React.createContext<DreamdustContextValue | undefined>(
  undefined,
)

export function DreamdustProvider({ children }: React.PropsWithChildren) {
  const cascadeStarterRef = React.useRef<StartCascade>(() => {})
  const [inkTex, setInkTex] = React.useState<InkTexture>()
  const [inkIntensity, setInkIntensity] = React.useState<number>(1)
  const [vertexInkOk, setVertexInkOk] = React.useState<boolean>(false)
  const [controlsLocked, setControlsLocked] = React.useState(false)
  const [heatmapVisible, setHeatmapVisible] = React.useState(false)

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
    }),
    [
      startCascade,
      inkTex,
      inkIntensity,
      vertexInkOk,
      controlsLocked,
      heatmapVisible,
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
