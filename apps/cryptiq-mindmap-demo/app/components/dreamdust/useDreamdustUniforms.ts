'use client'

import * as React from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import type { RootState } from '@react-three/fiber'

type TextureLike = unknown

type DreamdustUniformValueMap = {
  uTime: number
  uViewport: [number, number]
  uInkTex: TextureLike | null
  uInkIntensity: number
  uNoiseScale: number
  uNoiseSpeed: number
  uNoiseThreshold: number
  uDriftAmp: number
  uDepthBias: number
  uDepthNormScale: number
  uGamma: number
  uFocal: number
  uMinSize: number
  uMaxSize: number
  uSizeGain: number
  uOffsetGain: number
  uTintGain: number
  uVertexInkOk: number
}

export type DreamdustUniforms = {
  [K in keyof DreamdustUniformValueMap]: {
    value: DreamdustUniformValueMap[K]
  }
}

const DEFAULT_UNIFORM_VALUES: DreamdustUniformValueMap = {
  uTime: 0,
  uViewport: [1, 1],
  uInkTex: null,
  uInkIntensity: 1,
  uNoiseScale: 1,
  uNoiseSpeed: 1,
  uNoiseThreshold: 1,
  uDriftAmp: 0,
  uDepthBias: 1.8,
  uDepthNormScale: 0.001,
  uGamma: 1,
  uFocal: 1,
  uMinSize: 1,
  uMaxSize: 1,
  uSizeGain: 1,
  uOffsetGain: 0,
  uTintGain: 1,
  uVertexInkOk: 0,
}

function initialViewport(): [number, number] {
  const viewport: [number, number] = [...DEFAULT_UNIFORM_VALUES.uViewport]
  if (typeof window !== 'undefined') {
    viewport[0] = window.innerWidth
    viewport[1] = window.innerHeight
  }
  return viewport
}

function useOptionalThree<T>(selector: (state: RootState) => T): T | null {
  try {
    return useThree(selector)
  } catch {
    return null
  }
}

type DreamdustUniformName = keyof DreamdustUniforms

type DreamdustUniformValue<Name extends DreamdustUniformName> =
  DreamdustUniforms[Name]['value']

type UseDreamdustUniformsResult = {
  uniforms: DreamdustUniforms
  setUniform: <Name extends DreamdustUniformName>(
    name: Name,
    value: DreamdustUniformValue<Name>,
  ) => void
  updateInkTexture: (texture: TextureLike | null) => void
}

export function useDreamdustUniforms(): UseDreamdustUniformsResult {
  const uniformsRef = React.useRef<DreamdustUniforms | null>(null)

  if (!uniformsRef.current) {
    uniformsRef.current = {
      uTime: { value: DEFAULT_UNIFORM_VALUES.uTime },
      uViewport: { value: initialViewport() },
      uInkTex: { value: DEFAULT_UNIFORM_VALUES.uInkTex },
      uInkIntensity: { value: DEFAULT_UNIFORM_VALUES.uInkIntensity },
      uNoiseScale: { value: DEFAULT_UNIFORM_VALUES.uNoiseScale },
      uNoiseSpeed: { value: DEFAULT_UNIFORM_VALUES.uNoiseSpeed },
      uNoiseThreshold: { value: DEFAULT_UNIFORM_VALUES.uNoiseThreshold },
      uDriftAmp: { value: DEFAULT_UNIFORM_VALUES.uDriftAmp },
      uDepthBias: { value: DEFAULT_UNIFORM_VALUES.uDepthBias },
      uDepthNormScale: { value: DEFAULT_UNIFORM_VALUES.uDepthNormScale },
      uGamma: { value: DEFAULT_UNIFORM_VALUES.uGamma },
      uFocal: { value: DEFAULT_UNIFORM_VALUES.uFocal },
      uMinSize: { value: DEFAULT_UNIFORM_VALUES.uMinSize },
      uMaxSize: { value: DEFAULT_UNIFORM_VALUES.uMaxSize },
      uSizeGain: { value: DEFAULT_UNIFORM_VALUES.uSizeGain },
      uOffsetGain: { value: DEFAULT_UNIFORM_VALUES.uOffsetGain },
      uTintGain: { value: DEFAULT_UNIFORM_VALUES.uTintGain },
      uVertexInkOk: { value: DEFAULT_UNIFORM_VALUES.uVertexInkOk },
    }
  }

  const applyViewport = React.useCallback((width: number, height: number) => {
    const uniforms = uniformsRef.current
    if (!uniforms) return
    const viewport = uniforms.uViewport.value
    if (viewport[0] !== width || viewport[1] !== height) {
      viewport[0] = width
      viewport[1] = height
    }
  }, [])

  const size = useOptionalThree((state) => state.size)
  const viewportState = useOptionalThree((state) => state.viewport)

  const viewportWidth = viewportState?.width ?? size?.width ?? null
  const viewportHeight = viewportState?.height ?? size?.height ?? null

  React.useEffect(() => {
    if (viewportWidth === null || viewportHeight === null) return
    applyViewport(viewportWidth, viewportHeight)
  }, [applyViewport, viewportHeight, viewportWidth])

  React.useEffect(() => {
    if (size) {
      return undefined
    }
    if (
      typeof window === 'undefined' ||
      typeof window.requestAnimationFrame === 'undefined'
    ) {
      return undefined
    }

    let frame = 0
    let last = 0

    const updateFromWindow = () => {
      applyViewport(window.innerWidth, window.innerHeight)
    }

    const loop = (now: number) => {
      if (!last) {
        last = now
      }
      const delta = (now - last) / 1000
      last = now
      const uniforms = uniformsRef.current
      if (uniforms) {
        uniforms.uTime.value += delta
      }
      updateFromWindow()
      frame = window.requestAnimationFrame(loop)
    }

    updateFromWindow()
    frame = window.requestAnimationFrame(loop)

    const handleResize = () => {
      updateFromWindow()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', handleResize)
    }
  }, [applyViewport, size])

  try {
    useFrame((state, delta) => {
      const uniforms = uniformsRef.current
      if (!uniforms) return
      uniforms.uTime.value += delta
      const { width, height } = state.viewport
      applyViewport(width, height)
    })
  } catch {
    // Ignore when executed outside of a react-three-fiber canvas
  }

  const setUniform = React.useCallback(
    <Name extends DreamdustUniformName>(
      name: Name,
      value: DreamdustUniformValue<Name>,
    ) => {
      const uniforms = uniformsRef.current
      if (!uniforms) return
      const uniform = uniforms[name]
      if (!uniform) return
      const current = uniform.value
      if (Array.isArray(current) && Array.isArray(value)) {
        const target = current as number[]
        for (let i = 0; i < Math.min(target.length, value.length); i += 1) {
          target[i] = value[i] as number
        }
        return
      }
      ;(uniform as typeof uniform).value = value as typeof uniform.value
    },
    [],
  )

  const updateInkTexture = React.useCallback(
    (texture: TextureLike | null) => {
      setUniform('uInkTex', texture)
    },
    [setUniform],
  )

  const uniforms = uniformsRef.current
  if (!uniforms) {
    throw new Error('Dreamdust uniforms unavailable')
  }

  return {
    uniforms,
    setUniform,
    updateInkTexture,
  }
}
