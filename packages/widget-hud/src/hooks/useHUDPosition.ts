import { useState, useEffect, useCallback } from 'react'

export interface HUDPositionState {
  x: number
  y: number
  width: number
  height: number
}

export function useHUDPosition(initialPosition?: Partial<HUDPositionState>) {
  const [position, setPosition] = useState<HUDPositionState>({
    x: initialPosition?.x || 0,
    y: initialPosition?.y || 0,
    width: initialPosition?.width || 300,
    height: initialPosition?.height || 400,
  })
  
  const updatePosition = useCallback((updates: Partial<HUDPositionState>) => {
    setPosition(prev => ({ ...prev, ...updates }))
  }, [])
  
  const constrainToViewport = useCallback(() => {
    if (typeof window === 'undefined') return
    
    setPosition(prev => {
      const maxX = window.innerWidth - prev.width
      const maxY = window.innerHeight - prev.height
      
      return {
        ...prev,
        x: Math.max(0, Math.min(prev.x, maxX)),
        y: Math.max(0, Math.min(prev.y, maxY)),
      }
    })
  }, [])
  
  // Constrain position when window resizes
  useEffect(() => {
    window.addEventListener('resize', constrainToViewport)
    return () => window.removeEventListener('resize', constrainToViewport)
  }, [constrainToViewport])
  
  return {
    position,
    updatePosition,
    constrainToViewport,
  }
}