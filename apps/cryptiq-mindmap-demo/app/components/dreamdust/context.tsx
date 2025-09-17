'use client'

import * as React from 'react'

type InkTexture = import('three').Texture | null

type DreamdustContextValue = {
  inkTex?: InkTexture
  inkIntensity: number
  setInkTex: React.Dispatch<React.SetStateAction<InkTexture | undefined>>
  setInkIntensity: React.Dispatch<React.SetStateAction<number>>
  vertexInkOk: boolean
  setVertexInkOk: React.Dispatch<React.SetStateAction<boolean>>
}

const DreamdustContext = React.createContext<DreamdustContextValue | undefined>(
  undefined,
)

export function DreamdustProvider({ children }: React.PropsWithChildren) {
  const [inkTex, setInkTex] = React.useState<InkTexture>()
  const [inkIntensity, setInkIntensity] = React.useState<number>(1)
  const [vertexInkOk, setVertexInkOk] = React.useState<boolean>(false)

  const value = React.useMemo(
    () => ({
      inkTex,
      inkIntensity,
      setInkTex,
      setInkIntensity,
      vertexInkOk,
      setVertexInkOk,
    }),
    [inkTex, inkIntensity, vertexInkOk],
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
