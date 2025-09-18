'use client'

import * as React from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import type { RootState } from '@react-three/fiber'

import {
  getDreamdustTunables,
  subscribeDreamdustTunables,
} from './metrics'

type TextureLike = unknown
type Vec3 = [number, number, number]

type DreamdustUniformValueMap = {
  uTime: number
  uViewport: [number, number]
  uInkTex: TextureLike | null
  uInkIntensity: number
  uReveal: number
  uBreath: number
  uCascade: number
  uCascadeColor: Vec3
  uCascadeSizeBoost: number
  uVaporGain: number
  uNoiseScale: number
  uNoiseSpeed: number
  uNoiseThreshold: number
  uDriftAmp: number
  uPointBaseSize: number
  uDepthMin: number
  uDepthMax: number
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
  uReveal: 1,
  uBreath: 0.5,
  uCascade: 0,
  uCascadeColor: [1, 1, 1],
  uCascadeSizeBoost: 0,
  uVaporGain: 0,
  uNoiseScale: 1,
  uNoiseSpeed: 1,
  uNoiseThreshold: 1,
  uDriftAmp: 0,
  uPointBaseSize: 1,
  uDepthMin: 0,
  uDepthMax: 1,
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

const DEFAULT_REVEAL_MS = 2000
const MIN_REVEAL_SECONDS = 0.2
const BREATH_PERIOD_SECONDS = 7.5
const BREATH_SPEED = (Math.PI * 2) / BREATH_PERIOD_SECONDS
const CASCADE_DURATION_SECONDS = 1.6
const CASCADE_SIZE_BOOST = 2.4
const CASCADE_VAPOR_GAIN = 1.35

function clamp01(value: number): number {
  if (value < 0) return 0
  if (value > 1) return 1
  return value
}

function cubicEaseInOut(t: number): number {
  const clamped = clamp01(t)
  if (clamped < 0.5) {
    return 4 * clamped * clamped * clamped
  }
  const f = -2 * clamped + 2
  return 1 - (f * f * f) / 2
}

function safeLog(...args: Parameters<typeof console.log>): void {
  try {
    console.log(...args)
  } catch {
    // noop
  }
}

type DreamdustUniformName = keyof DreamdustUniforms

type DreamdustUniformValue<Name extends DreamdustUniformName> =
  DreamdustUniforms[Name]['value']

type UseDreamdustUniformsResult = {
  uniforms: DreamdustUniforms
  tick: (delta: number) => void
  startReveal: () => void
  startCascade: (color: Vec3) => void
  stopCascade: () => void
  setUniform: <Name extends DreamdustUniformName>(
    name: Name,
    value: DreamdustUniformValue<Name>,
  ) => void
  updateInkTexture: (texture: TextureLike | null) => void
}

type RevealTimelineState = {
  active: boolean
  elapsed: number
  duration: number
  didLogEnd: boolean
}

type CascadeTimelineState = {
  active: boolean
  elapsed: number
  duration: number
  sizeBoost: number
  vaporGain: number
  didLogStart: boolean
  didLogEnd: boolean
}

export function useDreamdustUniforms(): UseDreamdustUniformsResult {
  const uniformsRef = React.useRef<DreamdustUniforms | null>(null)

  if (!uniformsRef.current) {
    uniformsRef.current = {
      uTime: { value: DEFAULT_UNIFORM_VALUES.uTime },
      uViewport: { value: initialViewport() },
      uInkTex: { value: DEFAULT_UNIFORM_VALUES.uInkTex },
      uInkIntensity: { value: DEFAULT_UNIFORM_VALUES.uInkIntensity },
      uReveal: { value: DEFAULT_UNIFORM_VALUES.uReveal },
      uBreath: { value: DEFAULT_UNIFORM_VALUES.uBreath },
      uCascade: { value: DEFAULT_UNIFORM_VALUES.uCascade },
      uCascadeColor: { value: [...DEFAULT_UNIFORM_VALUES.uCascadeColor] as Vec3 },
      uCascadeSizeBoost: { value: DEFAULT_UNIFORM_VALUES.uCascadeSizeBoost },
      uVaporGain: { value: DEFAULT_UNIFORM_VALUES.uVaporGain },
      uNoiseScale: { value: DEFAULT_UNIFORM_VALUES.uNoiseScale },
      uNoiseSpeed: { value: DEFAULT_UNIFORM_VALUES.uNoiseSpeed },
      uNoiseThreshold: { value: DEFAULT_UNIFORM_VALUES.uNoiseThreshold },
      uDriftAmp: { value: DEFAULT_UNIFORM_VALUES.uDriftAmp },
      uPointBaseSize: { value: DEFAULT_UNIFORM_VALUES.uPointBaseSize },
      uDepthMin: { value: DEFAULT_UNIFORM_VALUES.uDepthMin },
      uDepthMax: { value: DEFAULT_UNIFORM_VALUES.uDepthMax },
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

  const tunablesRef = React.useRef(getDreamdustTunables())

  const revealTimelineRef = React.useRef<RevealTimelineState>({
    active: false,
    elapsed: 0,
    duration: Math.max(
      MIN_REVEAL_SECONDS,
      (tunablesRef.current.revealMs ?? DEFAULT_REVEAL_MS) / 1000,
    ),
    didLogEnd: false,
  })
  const cascadeTimelineRef = React.useRef<CascadeTimelineState>({
    active: false,
    elapsed: 0,
    duration: CASCADE_DURATION_SECONDS,
    sizeBoost: CASCADE_SIZE_BOOST,
    vaporGain: CASCADE_VAPOR_GAIN,
    didLogStart: false,
    didLogEnd: false,
  })
  const breathStateRef = React.useRef({
    phase: 0,
  })

  React.useEffect(() => {
    return subscribeDreamdustTunables((next) => {
      tunablesRef.current = next
      const reveal = revealTimelineRef.current
      if (!reveal.active) {
        const ms = Number.isFinite(next.revealMs) ? Math.max(100, next.revealMs) : DEFAULT_REVEAL_MS
        reveal.duration = Math.max(MIN_REVEAL_SECONDS, ms / 1000)
      }
    })
  }, [])

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

  const tick = React.useCallback(
    (delta: number) => {
      const uniforms = uniformsRef.current
      if (!uniforms) return
      const safeDelta = Number.isFinite(delta) ? Math.max(0, delta) : 0
      uniforms.uTime.value += safeDelta

      const breath = breathStateRef.current
      breath.phase += safeDelta * BREATH_SPEED
      if (!Number.isFinite(breath.phase)) {
        breath.phase = 0
      } else if (breath.phase > Math.PI * 2 || breath.phase < -Math.PI * 2) {
        breath.phase %= Math.PI * 2
      }
      const breathValue = (Math.sin(breath.phase) + 1) * 0.5
      uniforms.uBreath.value = clamp01(breathValue)

      const reveal = revealTimelineRef.current
      if (reveal.active) {
        reveal.elapsed = Math.min(reveal.elapsed + safeDelta, reveal.duration)
        const progress = reveal.duration > 0 ? reveal.elapsed / reveal.duration : 1
        const eased = cubicEaseInOut(progress)
        uniforms.uReveal.value = eased
        if (reveal.elapsed >= reveal.duration) {
          reveal.active = false
          uniforms.uReveal.value = 1
          if (!reveal.didLogEnd) {
            reveal.didLogEnd = true
            safeLog('[Dreamdust] reveal end', {
              duration: Number(reveal.duration.toFixed(3)),
            })
          }
        }
      }

      const cascade = cascadeTimelineRef.current
      if (cascade.active) {
        if (!cascade.didLogStart) {
          cascade.didLogStart = true
          safeLog('[Dreamdust] cascade start', {
            duration: Number(cascade.duration.toFixed(3)),
          })
        }
        cascade.elapsed = Math.min(cascade.elapsed + safeDelta, cascade.duration)
        const progress = cascade.duration > 0 ? cascade.elapsed / cascade.duration : 1
        const eased = cubicEaseInOut(progress)
        const mix = clamp01(eased)
        uniforms.uCascade.value = mix
        uniforms.uCascadeSizeBoost.value = cascade.sizeBoost
        uniforms.uVaporGain.value = cascade.vaporGain * mix
        if (cascade.elapsed >= cascade.duration) {
          cascade.active = false
          uniforms.uCascade.value = 1
          uniforms.uVaporGain.value = 0
          if (!cascade.didLogEnd) {
            cascade.didLogEnd = true
            safeLog('[Dreamdust] cascade end', {
              duration: Number(cascade.duration.toFixed(3)),
            })
          }
        }
      } else if (uniforms.uVaporGain.value > 1e-4) {
        uniforms.uVaporGain.value = Math.max(
          0,
          uniforms.uVaporGain.value - safeDelta * cascade.vaporGain,
        )
      }
    },
    [],
  )

  const startReveal = React.useCallback(() => {
    const uniforms = uniformsRef.current
    const reveal = revealTimelineRef.current
    reveal.active = true
    reveal.elapsed = 0
    const { revealMs } = tunablesRef.current
    const ms = Number.isFinite(revealMs) ? Math.max(100, revealMs) : DEFAULT_REVEAL_MS
    reveal.duration = Math.max(MIN_REVEAL_SECONDS, ms / 1000)
    reveal.didLogEnd = false
    if (uniforms) {
      uniforms.uReveal.value = 0
    }
    safeLog('[Dreamdust] reveal start', {
      duration: Number(reveal.duration.toFixed(3)),
    })
  }, [])

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
      tick(delta)
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
  }, [applyViewport, size, tick])

  try {
    useFrame((state, delta) => {
      tick(delta)
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

  const startCascade = React.useCallback((color: Vec3) => {
    const uniforms = uniformsRef.current
    const cascade = cascadeTimelineRef.current
    cascade.active = true
    cascade.elapsed = 0
    cascade.duration = CASCADE_DURATION_SECONDS
    cascade.sizeBoost = CASCADE_SIZE_BOOST
    cascade.vaporGain = CASCADE_VAPOR_GAIN
    cascade.didLogStart = false
    cascade.didLogEnd = false
    if (!uniforms) return
    uniforms.uCascade.value = 0
    uniforms.uCascadeSizeBoost.value = cascade.sizeBoost
    uniforms.uVaporGain.value = 0
    const target = uniforms.uCascadeColor.value
    for (let i = 0; i < target.length && i < color.length; i += 1) {
      target[i] = color[i]
    }
  }, [])

  const stopCascade = React.useCallback(() => {
    const uniforms = uniformsRef.current
    const cascade = cascadeTimelineRef.current
    cascade.active = false
    cascade.elapsed = 0
    cascade.didLogStart = false
    cascade.didLogEnd = false
    if (!uniforms) return
    uniforms.uCascade.value = 0
    uniforms.uCascadeSizeBoost.value = DEFAULT_UNIFORM_VALUES.uCascadeSizeBoost
    uniforms.uVaporGain.value = DEFAULT_UNIFORM_VALUES.uVaporGain
    const target = uniforms.uCascadeColor.value
    const defaults = DEFAULT_UNIFORM_VALUES.uCascadeColor
    for (let i = 0; i < target.length && i < defaults.length; i += 1) {
      target[i] = defaults[i]
    }
  }, [])

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
    tick,
    startReveal,
    startCascade,
    stopCascade,
    setUniform,
    updateInkTexture,
  }
}
