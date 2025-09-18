"use client"

import { getRootState } from '@react-three/fiber'
import type { RootState } from '@react-three/fiber'

/**
 * Safely obtain R3F RootState if a canvas exists and the store is initialized.
 * Returns null on failure to avoid crashes when called too early.
 */
export function getR3FStateOrNull(): RootState | null {
  try {
    if (typeof document === 'undefined') return null
    const canvas = document.querySelector('canvas') as HTMLCanvasElement | null
    if (!canvas) return null
    const state = getRootState(canvas)
    return state ?? null
  } catch {
    return null
  }
}

export type WithR3FCallback<T> = (state: RootState) => T
export type WithR3FFallback<T> = () => T

export function withR3F<T>(callback: WithR3FCallback<T>, fallback?: WithR3FFallback<T>): T | null {
  const state = getR3FStateOrNull()
  if (state) {
    return callback(state)
  }
  return fallback ? fallback() : null
}

