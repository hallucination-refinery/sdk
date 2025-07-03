import { useCallback, useEffect, useRef, useState } from 'react'

export interface FocusManagementOptions {
  initialFocusId?: string
  focusableSelector?: string
  wrap?: boolean
  onFocusChange?: (focusedId: string | null) => void
}

export function useFocusManagement({
  initialFocusId,
  focusableSelector = '[tabindex="0"], button, a, input, select, textarea',
  wrap = true,
  onFocusChange,
}: FocusManagementOptions = {}) {
  const containerRef = useRef<HTMLElement>(null)
  const [focusedId, setFocusedId] = useState<string | null>(initialFocusId || null)
  const focusableElementsRef = useRef<HTMLElement[]>([])
  
  // Update focusable elements when container changes
  const updateFocusableElements = useCallback(() => {
    if (!containerRef.current) return
    
    const elements = Array.from(
      containerRef.current.querySelectorAll<HTMLElement>(focusableSelector)
    ).filter(el => !el.hasAttribute('disabled') && el.tabIndex >= 0)
    
    focusableElementsRef.current = elements
  }, [focusableSelector])
  
  // Focus an element by ID
  const focusById = useCallback((id: string | null) => {
    if (!id) {
      setFocusedId(null)
      onFocusChange?.(null)
      return
    }
    
    const element = containerRef.current?.querySelector<HTMLElement>(`[data-focus-id="${id}"]`)
    if (element) {
      element.focus()
      setFocusedId(id)
      onFocusChange?.(id)
    }
  }, [onFocusChange])
  
  // Move focus in a direction
  const moveFocus = useCallback((direction: 'next' | 'previous') => {
    updateFocusableElements()
    const elements = focusableElementsRef.current
    
    if (elements.length === 0) return
    
    const currentElement = document.activeElement as HTMLElement
    const currentIndex = elements.indexOf(currentElement)
    
    let nextIndex: number
    if (direction === 'next') {
      if (currentIndex === -1) {
        nextIndex = 0
      } else if (currentIndex === elements.length - 1) {
        nextIndex = wrap ? 0 : currentIndex
      } else {
        nextIndex = currentIndex + 1
      }
    } else {
      if (currentIndex === -1) {
        nextIndex = elements.length - 1
      } else if (currentIndex === 0) {
        nextIndex = wrap ? elements.length - 1 : currentIndex
      } else {
        nextIndex = currentIndex - 1
      }
    }
    
    elements[nextIndex].focus()
    const newFocusId = elements[nextIndex].getAttribute('data-focus-id')
    setFocusedId(newFocusId)
    onFocusChange?.(newFocusId)
  }, [wrap, updateFocusableElements, onFocusChange])
  
  // Focus first element
  const focusFirst = useCallback(() => {
    updateFocusableElements()
    const elements = focusableElementsRef.current
    if (elements.length > 0) {
      elements[0].focus()
      const focusId = elements[0].getAttribute('data-focus-id')
      setFocusedId(focusId)
      onFocusChange?.(focusId)
    }
  }, [updateFocusableElements, onFocusChange])
  
  // Focus last element
  const focusLast = useCallback(() => {
    updateFocusableElements()
    const elements = focusableElementsRef.current
    if (elements.length > 0) {
      elements[elements.length - 1].focus()
      const focusId = elements[elements.length - 1].getAttribute('data-focus-id')
      setFocusedId(focusId)
      onFocusChange?.(focusId)
    }
  }, [updateFocusableElements, onFocusChange])
  
  // Trap focus within container
  const trapFocus = useCallback((event: FocusEvent) => {
    if (!containerRef.current) return
    
    const target = event.target as HTMLElement
    if (!containerRef.current.contains(target)) {
      event.preventDefault()
      focusFirst()
    }
  }, [focusFirst])
  
  // Set up initial focus
  useEffect(() => {
    if (initialFocusId) {
      focusById(initialFocusId)
    }
  }, [initialFocusId, focusById])
  
  return {
    containerRef,
    focusedId,
    focusById,
    moveFocus,
    focusFirst,
    focusLast,
    trapFocus,
  }
}