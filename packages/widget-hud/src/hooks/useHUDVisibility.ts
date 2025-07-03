import { useState, useCallback, useEffect } from 'react'

export interface HUDVisibilityOptions {
  defaultVisible?: boolean
  autoHide?: boolean
  autoHideDelay?: number
  hideOnEscape?: boolean
}

export function useHUDVisibility({
  defaultVisible = true,
  autoHide = false,
  autoHideDelay = 3000,
  hideOnEscape = true,
}: HUDVisibilityOptions = {}) {
  const [visible, setVisible] = useState(defaultVisible)
  const [autoHideTimer, setAutoHideTimer] = useState<NodeJS.Timeout | null>(null)
  
  const show = useCallback(() => {
    setVisible(true)
    
    if (autoHide) {
      // Clear existing timer
      if (autoHideTimer) {
        clearTimeout(autoHideTimer)
      }
      
      // Set new timer
      const timer = setTimeout(() => {
        setVisible(false)
      }, autoHideDelay)
      
      setAutoHideTimer(timer)
    }
  }, [autoHide, autoHideDelay, autoHideTimer])
  
  const hide = useCallback(() => {
    setVisible(false)
    
    // Clear auto-hide timer if exists
    if (autoHideTimer) {
      clearTimeout(autoHideTimer)
      setAutoHideTimer(null)
    }
  }, [autoHideTimer])
  
  const toggle = useCallback(() => {
    if (visible) {
      hide()
    } else {
      show()
    }
  }, [visible, show, hide])
  
  // Handle escape key
  useEffect(() => {
    if (!hideOnEscape) return
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && visible) {
        hide()
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [hideOnEscape, visible, hide])
  
  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (autoHideTimer) {
        clearTimeout(autoHideTimer)
      }
    }
  }, [autoHideTimer])
  
  return {
    visible,
    show,
    hide,
    toggle,
  }
}