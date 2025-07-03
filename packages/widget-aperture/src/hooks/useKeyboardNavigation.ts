import { useCallback, useEffect, useRef } from 'react'
import { announceToScreenReader } from '../utils/accessibility'

export interface KeyboardNavigationOptions {
  onNavigate?: (direction: 'up' | 'down' | 'left' | 'right') => void
  onSelect?: () => void
  onCancel?: () => void
  onHelp?: () => void
  enabled?: boolean
}

export function useKeyboardNavigation({
  onNavigate,
  onSelect,
  onCancel,
  onHelp,
  enabled = true,
}: KeyboardNavigationOptions) {
  const isNavigatingRef = useRef(false)
  
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return
      
      // Prevent default behavior for navigation keys
      const navigationKeys = [
        'ArrowUp',
        'ArrowDown',
        'ArrowLeft',
        'ArrowRight',
        'Enter',
        ' ',
        'Escape',
      ]
      
      if (navigationKeys.includes(event.key)) {
        event.preventDefault()
      }
      
      switch (event.key) {
        case 'ArrowUp':
          onNavigate?.('up')
          if (!isNavigatingRef.current) {
            announceToScreenReader('Navigating up', 'polite')
            isNavigatingRef.current = true
          }
          break
          
        case 'ArrowDown':
          onNavigate?.('down')
          if (!isNavigatingRef.current) {
            announceToScreenReader('Navigating down', 'polite')
            isNavigatingRef.current = true
          }
          break
          
        case 'ArrowLeft':
          onNavigate?.('left')
          if (!isNavigatingRef.current) {
            announceToScreenReader('Navigating left', 'polite')
            isNavigatingRef.current = true
          }
          break
          
        case 'ArrowRight':
          onNavigate?.('right')
          if (!isNavigatingRef.current) {
            announceToScreenReader('Navigating right', 'polite')
            isNavigatingRef.current = true
          }
          break
          
        case 'Enter':
        case ' ':
          onSelect?.()
          announceToScreenReader('Item selected', 'assertive')
          break
          
        case 'Escape':
          onCancel?.()
          announceToScreenReader('Selection cleared', 'polite')
          break
          
        case 'h':
        case 'H':
          if (event.shiftKey || event.key === 'H') {
            onHelp?.()
            announceToScreenReader('Opening help', 'polite')
          }
          break
      }
    },
    [enabled, onNavigate, onSelect, onCancel, onHelp]
  )
  
  const handleKeyUp = useCallback(() => {
    isNavigatingRef.current = false
  }, [])
  
  useEffect(() => {
    if (!enabled) return
    
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [enabled, handleKeyDown, handleKeyUp])
  
  return {
    isNavigating: isNavigatingRef.current,
  }
}