import { renderHook, act } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useDreamdustUniforms } from '@/app/components/dreamdust/useDreamdustUniforms'

describe('useDreamdustUniforms', () => {
  it('exposes a stable uniforms map with mutators', () => {
    vi.useFakeTimers()
    const { result, rerender, unmount } = renderHook(() => useDreamdustUniforms())

    try {
      const { uniforms, setUniform, updateInkTexture } = result.current
      expect(uniforms.uTime.value).toBe(0)

      rerender()
      expect(result.current.uniforms).toBe(uniforms)

      act(() => {
        setUniform('uInkIntensity', 0.5)
      })
      expect(uniforms.uInkIntensity.value).toBeCloseTo(0.5)

      const fakeTexture = { uuid: 'ink' }
      act(() => {
        updateInkTexture(fakeTexture)
      })
      expect(uniforms.uInkTex.value).toBe(fakeTexture)

      act(() => {
        vi.advanceTimersByTime(100)
      })
      expect(uniforms.uTime.value).toBeGreaterThan(0)
    } finally {
      unmount()
      vi.useRealTimers()
    }
  })
})
