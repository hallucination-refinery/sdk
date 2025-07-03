/**
 * Announce a message to screen readers using ARIA live regions
 */
export function announceToScreenReader(
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
) {
  const announcement = document.createElement('div')
  announcement.setAttribute('role', 'status')
  announcement.setAttribute('aria-live', priority)
  announcement.setAttribute('aria-atomic', 'true')
  announcement.style.position = 'absolute'
  announcement.style.width = '1px'
  announcement.style.height = '1px'
  announcement.style.padding = '0'
  announcement.style.margin = '-1px'
  announcement.style.overflow = 'hidden'
  announcement.style.clip = 'rect(0, 0, 0, 0)'
  announcement.style.whiteSpace = 'nowrap'
  announcement.style.border = '0'
  
  announcement.textContent = message
  document.body.appendChild(announcement)
  
  // Remove the announcement after a delay to clean up
  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}

/**
 * Generate a unique ID for accessibility attributes
 */
export function generateAriaId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Check if the user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return false
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Get appropriate animation duration based on user preferences
 */
export function getAnimationDuration(duration: number): number {
  return prefersReducedMotion() ? 0 : duration
}

/**
 * Format a node label for screen readers
 */
export function formatNodeLabel(
  label: string,
  nodeType?: string,
  connections?: number
): string {
  let formattedLabel = label
  
  if (nodeType) {
    formattedLabel += `, ${nodeType} node`
  }
  
  if (connections !== undefined) {
    formattedLabel += `, ${connections} connection${connections !== 1 ? 's' : ''}`
  }
  
  return formattedLabel
}

/**
 * Generate keyboard navigation instructions
 */
export function getKeyboardInstructions(): string {
  return `
    Use arrow keys to navigate between nodes.
    Press Enter or Space to select a node.
    Press Tab to move to the next interactive element.
    Press Escape to clear selection.
    Press H for help.
  `.trim()
}

/**
 * Check if high contrast mode is preferred
 */
export function prefersHighContrast(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return false
  }
  return (
    window.matchMedia('(prefers-contrast: high)').matches ||
    window.matchMedia('(prefers-contrast: more)').matches
  )
}