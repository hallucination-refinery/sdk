'use client'

import * as React from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import type { RootState } from '@react-three/fiber'

import {
  getDreamdustTunables,
  logOnce,
  subscribeDreamdustTunables,
} from './metrics'
import { PresetAiry, PresetC } from './presets'

type TextureLike = unknown
type Vec3 = [number, number, number]

type DreamdustUniformValueMap = {
  uTime: number
  uViewport: [number, number]
  uInkTex: TextureLike | null
  uInkIntensity: number
  uReveal: number
  uBreath: number
  uBreathAmp: number
  uCascade: number
  uCascadeColor: Vec3
  uCascadeSizeBoost: number
  uVaporGain: number
  uNoiseScale: number
  uNoiseSpeed: number
  uEvolution: number
  uNoiseThreshold: number
  uDriftAmp: number
  uCurlAmp: number
  uPointBaseSize: number
  uDepthMin: number
  uDepthMax: number
  uDepthBias: number
  uDepthNormScale: number
  uGamma: number
  uRimGamma: number
  uFocal: number
  uMinSize: number
  uMaxSize: number
  uSizeGain: number
  uOffsetGain: number
  uInkOffsetBoost: number
  uInkSizeBoost: number
  uTintGain: number
  uInkTintBoost: number
  uVertexInkOk: number
}

export type DreamdustUniforms = {
  [K in keyof DreamdustUniformValueMap]: {
    value: DreamdustUniformValueMap[K]
  }
}

type DreamdustSimCurveUniforms = {
  fadeIn: number
  fadeOut: number
  opacity: number
  size: number
  glowSpread: number
  solidRatio: number
  solidAlpha: number
}

export type DreamdustSimUniforms = {
  numParticles: number
  velocityDamping: number
  gravityY: number
  turbulenceStrength: number
  turbulenceTime: number
  turbulencePositionFrequency: number
  emitterRadius: number
  emitterVelocityStrength: number
  initialRandomVelocity: number
  sparklingIntensity: number
  sparklingProbability: number
  sparklingFrequency: number
  sprite: DreamdustSimCurveUniforms
  rim: DreamdustSimCurveUniforms
  lifetime: DreamdustSimCurveUniforms
}

const DEFAULT_UNIFORM_VALUES: DreamdustUniformValueMap = {
  uTime: 0,
  uViewport: [1, 1],
  uInkTex: null,
  uInkIntensity: 1,
  uReveal: 1,
  uBreath: 0.5,
  uBreathAmp: 0.08,
  uCascade: 0,
  uCascadeColor: [1, 1, 1],
  uCascadeSizeBoost: 0,
  uVaporGain: 0,
  uNoiseScale: 1,
  uNoiseSpeed: 1,
  uEvolution: 1,
  uNoiseThreshold: 1,
  uDriftAmp: 0,
  uCurlAmp: 1,
  uPointBaseSize: 1,
  uDepthMin: 0,
  uDepthMax: 1,
  uDepthBias: 1.8,
  uDepthNormScale: 0.001,
  uGamma: 1,
  uRimGamma: 2,
  uFocal: 1,
  uMinSize: 1,
  uMaxSize: 1,
  uSizeGain: 1,
  uOffsetGain: 0,
  uInkOffsetBoost: 1,
  uInkSizeBoost: 1,
  uTintGain: 1,
  uInkTintBoost: 1,
  uVertexInkOk: 0,
}

const ENGINE_QUERY_KEY = 'engine'
const ENGINE_ENV_KEY = 'DD_ENGINE'
const ENGINE_SIM_VALUE = 'sim'

const SIM_PARAM_ENV_PREFIX = 'DD_SIM_'
const SIM_PARAM_QUERY_PREFIX = 'sim'

const DEFAULT_SIM_CURVE: DreamdustSimCurveUniforms = Object.freeze({
  fadeIn: 0.12,
  fadeOut: 0.4,
  opacity: 1,
  size: 1,
  glowSpread: 0.2,
  solidRatio: 0.35,
  solidAlpha: 0.6,
})

function cloneSimCurve(curve: DreamdustSimCurveUniforms): DreamdustSimCurveUniforms {
  return {
    fadeIn: curve.fadeIn,
    fadeOut: curve.fadeOut,
    opacity: curve.opacity,
    size: curve.size,
    glowSpread: curve.glowSpread,
    solidRatio: curve.solidRatio,
    solidAlpha: curve.solidAlpha,
  }
}

const DEFAULT_SIM_UNIFORMS = Object.freeze({
  numParticles: 0,
  velocityDamping: 0.04,
  gravityY: -0.05,
  turbulenceStrength: 0.4,
  turbulenceTime: 1.2,
  turbulencePositionFrequency: 0.6,
  emitterRadius: 0.45,
  emitterVelocityStrength: 0.35,
  initialRandomVelocity: 0.05,
  sparklingIntensity: 0,
  sparklingProbability: 0,
  sparklingFrequency: 0,
  sprite: cloneSimCurve(DEFAULT_SIM_CURVE),
  rim: cloneSimCurve(DEFAULT_SIM_CURVE),
  lifetime: cloneSimCurve(DEFAULT_SIM_CURVE),
}) as Readonly<Omit<DreamdustSimUniforms, 'sprite' | 'rim' | 'lifetime'>> & {
  sprite: Readonly<DreamdustSimCurveUniforms>
  rim: Readonly<DreamdustSimCurveUniforms>
  lifetime: Readonly<DreamdustSimCurveUniforms>
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

function createDefaultSimUniforms(): DreamdustSimUniforms {
  return {
    numParticles: DEFAULT_SIM_UNIFORMS.numParticles,
    velocityDamping: DEFAULT_SIM_UNIFORMS.velocityDamping,
    gravityY: DEFAULT_SIM_UNIFORMS.gravityY,
    turbulenceStrength: DEFAULT_SIM_UNIFORMS.turbulenceStrength,
    turbulenceTime: DEFAULT_SIM_UNIFORMS.turbulenceTime,
    turbulencePositionFrequency: DEFAULT_SIM_UNIFORMS.turbulencePositionFrequency,
    emitterRadius: DEFAULT_SIM_UNIFORMS.emitterRadius,
    emitterVelocityStrength: DEFAULT_SIM_UNIFORMS.emitterVelocityStrength,
    initialRandomVelocity: DEFAULT_SIM_UNIFORMS.initialRandomVelocity,
    sparklingIntensity: DEFAULT_SIM_UNIFORMS.sparklingIntensity,
    sparklingProbability: DEFAULT_SIM_UNIFORMS.sparklingProbability,
    sparklingFrequency: DEFAULT_SIM_UNIFORMS.sparklingFrequency,
    sprite: cloneSimCurve(DEFAULT_SIM_UNIFORMS.sprite),
    rim: cloneSimCurve(DEFAULT_SIM_UNIFORMS.rim),
    lifetime: cloneSimCurve(DEFAULT_SIM_UNIFORMS.lifetime),
  }
}

type TextureMetrics = {
  width: number
  height: number
  needsUpdate: boolean
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function toFiniteNumber(value: unknown): number | null {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return null
  }
  return value
}

function readTextureDimensions(candidate: unknown):
  | Pick<TextureMetrics, 'width' | 'height'>
  | null {
  if (Array.isArray(candidate)) {
    for (const entry of candidate) {
      const dimensions = readTextureDimensions(entry)
      if (dimensions) {
        return dimensions
      }
    }
    return null
  }

  if (!isRecord(candidate)) {
    return null
  }

  const potential = candidate as { width?: unknown; height?: unknown }
  const width = toFiniteNumber(potential.width)
  const height = toFiniteNumber(potential.height)

  if (width === null || height === null) {
    return null
  }

  return { width, height }
}

function extractInkTextureMetrics(texture: TextureLike): TextureMetrics | null {
  if (!isRecord(texture)) {
    return null
  }

  const record = texture as {
    needsUpdate?: unknown
    image?: unknown
    source?: unknown
    width?: unknown
    height?: unknown
  }

  const needsUpdateValue = record.needsUpdate
  const needsUpdate =
    typeof needsUpdateValue === 'boolean'
      ? needsUpdateValue
      : Boolean(needsUpdateValue)

  const candidates: unknown[] = []

  if ('image' in record) {
    candidates.push(record.image)
  }

  if ('source' in record && isRecord(record.source)) {
    const source = record.source as { data?: unknown }
    if ('data' in source) {
      candidates.push(source.data)
    }
  }

  candidates.push(record)

  for (const candidate of candidates) {
    const dimensions = readTextureDimensions(candidate)
    if (dimensions) {
      return {
        width: dimensions.width,
        height: dimensions.height,
        needsUpdate,
      }
    }
  }

  return null
}

const PRESET_QUERY_KEY = 'preset'
const PRESET_VAPOR_VALUE = 'vapor'
const PRESET_AIRY_VALUE = 'airy'
const PRESET_ENV_KEY = 'DD_PRESET'
const INK_BUMP_QUERY_KEY = 'inkBump'
const INK_BUMP_ENV_KEY = 'DD_INK_BUMP'
const INK_BUMP_SIZE_MULTIPLIER = 1.2
const INK_BUMP_OFFSET_MULTIPLIER = 1.15
const INK_BUMP_TINT_MULTIPLIER = 1.18
const TRUTHY_BUMP_VALUES = new Set(['1', 'true'])

function normalizeGateValue(value: string | null | undefined): string {
  return typeof value === 'string' ? value.trim().toLowerCase() : ''
}

function readEnvValue(key: string): string | undefined {
  if (typeof process === 'undefined') {
    return undefined
  }
  const env = process.env as Record<string, string | undefined> | undefined
  return env?.[key]
}

function readSearchParam(name: string): string | null {
  if (typeof window === 'undefined') {
    return null
  }
  try {
    const params = new URLSearchParams(window.location.search)
    return params.get(name)
  } catch {
    return null
  }
}

function detectSimEngine(): boolean {
  const queryValue = normalizeGateValue(readSearchParam(ENGINE_QUERY_KEY))
  if (queryValue === ENGINE_SIM_VALUE) {
    return true
  }
  const envValue = normalizeGateValue(readEnvValue(ENGINE_ENV_KEY))
  return envValue === ENGINE_SIM_VALUE
}

function detectPresetGate(target: string): boolean {
  if (!target) {
    return false
  }
  const envValue = normalizeGateValue(readEnvValue(PRESET_ENV_KEY))
  if (envValue === target) {
    return true
  }
  const queryValue = normalizeGateValue(readSearchParam(PRESET_QUERY_KEY))
  return queryValue === target
}

function detectVaporPreset(): boolean {
  return detectPresetGate(PRESET_VAPOR_VALUE)
}

function detectAiryPreset(simActive: boolean): boolean {
  if (!simActive) {
    return false
  }
  return detectPresetGate(PRESET_AIRY_VALUE)
}

function detectInkBump(): boolean {
  const envValue = normalizeGateValue(readEnvValue(INK_BUMP_ENV_KEY))
  if (TRUTHY_BUMP_VALUES.has(envValue)) {
    return true
  }
  const queryValue = normalizeGateValue(readSearchParam(INK_BUMP_QUERY_KEY))
  return TRUTHY_BUMP_VALUES.has(queryValue)
}

function toEnvParamKey(name: string): string {
  return name.replace(/([A-Z])/g, '_$1').toUpperCase()
}

function toQueryParamKey(name: string): string {
  if (!name) {
    return SIM_PARAM_QUERY_PREFIX
  }
  const [first, ...rest] = name
  return `${SIM_PARAM_QUERY_PREFIX}${first.toUpperCase()}${rest.join('')}`
}

function readSimOverride(name: string): number | null {
  const queryKey = toQueryParamKey(name)
  const queryValue = readSearchParam(queryKey)
  if (queryValue !== null) {
    const parsed = Number(queryValue)
    if (Number.isFinite(parsed)) {
      return parsed
    }
  }
  const envKey = `${SIM_PARAM_ENV_PREFIX}${toEnvParamKey(name)}`
  const envValue = readEnvValue(envKey)
  if (typeof envValue === 'string') {
    const parsed = Number(envValue)
    if (Number.isFinite(parsed)) {
      return parsed
    }
  }
  return null
}

function resolveSimNumber(name: string, fallback: number): number {
  const override = readSimOverride(name)
  if (override === null) {
    return fallback
  }
  return override
}

function sanitizeParticleCount(value: number): number {
  if (!Number.isFinite(value) || value <= 0) {
    return 0
  }
  return Math.floor(value)
}

function createSimUniforms(): DreamdustSimUniforms {
  const uniforms = createDefaultSimUniforms()
  uniforms.numParticles = sanitizeParticleCount(
    resolveSimNumber('numParticles', uniforms.numParticles),
  )
  const damping = resolveSimNumber('velocityDamping', uniforms.velocityDamping)
  uniforms.velocityDamping = Number.isFinite(damping) ? damping : uniforms.velocityDamping
  const gravity = resolveSimNumber('gravityY', uniforms.gravityY)
  uniforms.gravityY = Number.isFinite(gravity) ? gravity : uniforms.gravityY
  const turbulenceStrength = resolveSimNumber(
    'turbulenceStrength',
    uniforms.turbulenceStrength,
  )
  uniforms.turbulenceStrength = Number.isFinite(turbulenceStrength)
    ? turbulenceStrength
    : uniforms.turbulenceStrength
  const turbulenceTime = resolveSimNumber('turbulenceTime', uniforms.turbulenceTime)
  uniforms.turbulenceTime = Number.isFinite(turbulenceTime)
    ? turbulenceTime
    : uniforms.turbulenceTime
  const turbulencePosFreq = resolveSimNumber(
    'turbulencePositionFrequency',
    uniforms.turbulencePositionFrequency,
  )
  uniforms.turbulencePositionFrequency = Number.isFinite(turbulencePosFreq)
    ? turbulencePosFreq
    : uniforms.turbulencePositionFrequency
  const emitterRadius = resolveSimNumber('emitterRadius', uniforms.emitterRadius)
  uniforms.emitterRadius = Number.isFinite(emitterRadius)
    ? emitterRadius
    : uniforms.emitterRadius
  const emitterVelocity = resolveSimNumber(
    'emitterVelocityStrength',
    uniforms.emitterVelocityStrength,
  )
  uniforms.emitterVelocityStrength = Number.isFinite(emitterVelocity)
    ? emitterVelocity
    : uniforms.emitterVelocityStrength
  const randomVelocity = resolveSimNumber(
    'initialRandomVelocity',
    uniforms.initialRandomVelocity,
  )
  uniforms.initialRandomVelocity = Number.isFinite(randomVelocity)
    ? randomVelocity
    : uniforms.initialRandomVelocity

  const sprite = uniforms.sprite
  sprite.fadeIn = resolveSimNumber('spriteFadeIn', sprite.fadeIn)
  sprite.fadeOut = resolveSimNumber('spriteFadeOut', sprite.fadeOut)
  sprite.opacity = resolveSimNumber('spriteOpacity', sprite.opacity)
  sprite.size = resolveSimNumber('spriteSize', sprite.size)
  sprite.glowSpread = resolveSimNumber('spriteGlowSpread', sprite.glowSpread)
  sprite.solidRatio = resolveSimNumber('spriteSolidRatio', sprite.solidRatio)
  sprite.solidAlpha = resolveSimNumber('spriteSolidAlpha', sprite.solidAlpha)

  const rim = uniforms.rim
  rim.fadeIn = resolveSimNumber('rimFadeIn', rim.fadeIn)
  rim.fadeOut = resolveSimNumber('rimFadeOut', rim.fadeOut)
  rim.opacity = resolveSimNumber('rimOpacity', rim.opacity)
  rim.size = resolveSimNumber('rimSize', rim.size)
  rim.glowSpread = resolveSimNumber('rimGlowSpread', rim.glowSpread)
  rim.solidRatio = resolveSimNumber('rimSolidRatio', rim.solidRatio)
  rim.solidAlpha = resolveSimNumber('rimSolidAlpha', rim.solidAlpha)

  const lifetime = uniforms.lifetime
  lifetime.fadeIn = resolveSimNumber('lifetimeFadeIn', lifetime.fadeIn)
  lifetime.fadeOut = resolveSimNumber('lifetimeFadeOut', lifetime.fadeOut)
  lifetime.opacity = resolveSimNumber('lifetimeOpacity', lifetime.opacity)
  lifetime.size = resolveSimNumber('lifetimeSize', lifetime.size)
  lifetime.glowSpread = resolveSimNumber('lifetimeGlowSpread', lifetime.glowSpread)
  lifetime.solidRatio = resolveSimNumber('lifetimeSolidRatio', lifetime.solidRatio)
  lifetime.solidAlpha = resolveSimNumber('lifetimeSolidAlpha', lifetime.solidAlpha)

  uniforms.sparklingIntensity = 0
  uniforms.sparklingProbability = 0
  uniforms.sparklingFrequency = 0

  return uniforms
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
  simUniforms: DreamdustSimUniforms
  presetAiryActive: boolean
  simEngineActive: boolean
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
  const simEngineActive = React.useMemo(detectSimEngine, [])
  const presetAiryEnabled = React.useMemo(
    () => detectAiryPreset(simEngineActive),
    [simEngineActive],
  )
  const presetVaporEnabled = React.useMemo(detectVaporPreset, [])
  const inkBumpEnabled = React.useMemo(
    () => (presetAiryEnabled ? false : detectInkBump()),
    [presetAiryEnabled],
  )
  const uniformsRef = React.useRef<DreamdustUniforms | null>(null)
  const simUniformsRef = React.useRef<DreamdustSimUniforms | null>(null)

  if (!simUniformsRef.current) {
    simUniformsRef.current = createSimUniforms()
  }

  if (!uniformsRef.current) {
    const breathAmpValue = presetAiryEnabled
      ? PresetAiry.breathAmp
      : presetVaporEnabled
        ? PresetC.breathAmp
        : DEFAULT_UNIFORM_VALUES.uBreathAmp
    const evolutionValue = presetAiryEnabled
      ? PresetAiry.evolution
      : presetVaporEnabled
        ? PresetC.evolution
        : DEFAULT_UNIFORM_VALUES.uEvolution
    const curlAmpValue = presetAiryEnabled
      ? PresetAiry.curlFactor
      : presetVaporEnabled
        ? PresetC.curlFactor
        : DEFAULT_UNIFORM_VALUES.uCurlAmp
    const rimGammaValue = presetAiryEnabled
      ? PresetAiry.rimGamma
      : presetVaporEnabled
        ? PresetC.rimGamma
        : DEFAULT_UNIFORM_VALUES.uRimGamma
    const baseInkGain = presetAiryEnabled
      ? PresetAiry.inkGain
      : presetVaporEnabled
        ? PresetC.inkGain
        : 1
    const inkOffsetBoostValue =
      baseInkGain * (inkBumpEnabled ? INK_BUMP_OFFSET_MULTIPLIER : 1)
    const inkSizeBoostValue =
      baseInkGain * (inkBumpEnabled ? INK_BUMP_SIZE_MULTIPLIER : 1)
    const inkTintBoostValue =
      baseInkGain * (inkBumpEnabled ? INK_BUMP_TINT_MULTIPLIER : 1)

    uniformsRef.current = {
      uTime: { value: DEFAULT_UNIFORM_VALUES.uTime },
      uViewport: { value: initialViewport() },
      uInkTex: { value: DEFAULT_UNIFORM_VALUES.uInkTex },
      uInkIntensity: { value: DEFAULT_UNIFORM_VALUES.uInkIntensity },
      uReveal: { value: DEFAULT_UNIFORM_VALUES.uReveal },
      uBreath: { value: DEFAULT_UNIFORM_VALUES.uBreath },
      uBreathAmp: { value: breathAmpValue },
      uCascade: { value: DEFAULT_UNIFORM_VALUES.uCascade },
      uCascadeColor: { value: [...DEFAULT_UNIFORM_VALUES.uCascadeColor] as Vec3 },
      uCascadeSizeBoost: { value: DEFAULT_UNIFORM_VALUES.uCascadeSizeBoost },
      uVaporGain: { value: DEFAULT_UNIFORM_VALUES.uVaporGain },
      uNoiseScale: { value: DEFAULT_UNIFORM_VALUES.uNoiseScale },
      uNoiseSpeed: { value: DEFAULT_UNIFORM_VALUES.uNoiseSpeed },
      uEvolution: { value: evolutionValue },
      uNoiseThreshold: { value: DEFAULT_UNIFORM_VALUES.uNoiseThreshold },
      uDriftAmp: { value: DEFAULT_UNIFORM_VALUES.uDriftAmp },
      uCurlAmp: { value: curlAmpValue },
      uPointBaseSize: { value: DEFAULT_UNIFORM_VALUES.uPointBaseSize },
      uDepthMin: { value: DEFAULT_UNIFORM_VALUES.uDepthMin },
      uDepthMax: { value: DEFAULT_UNIFORM_VALUES.uDepthMax },
      uDepthBias: { value: DEFAULT_UNIFORM_VALUES.uDepthBias },
      uDepthNormScale: { value: DEFAULT_UNIFORM_VALUES.uDepthNormScale },
      uGamma: { value: DEFAULT_UNIFORM_VALUES.uGamma },
      uRimGamma: { value: rimGammaValue },
      uFocal: { value: DEFAULT_UNIFORM_VALUES.uFocal },
      uMinSize: { value: DEFAULT_UNIFORM_VALUES.uMinSize },
      uMaxSize: { value: DEFAULT_UNIFORM_VALUES.uMaxSize },
      uSizeGain: { value: DEFAULT_UNIFORM_VALUES.uSizeGain },
      uOffsetGain: { value: DEFAULT_UNIFORM_VALUES.uOffsetGain },
      uInkOffsetBoost: { value: inkOffsetBoostValue },
      uInkSizeBoost: { value: inkSizeBoostValue },
      uTintGain: { value: DEFAULT_UNIFORM_VALUES.uTintGain },
      uInkTintBoost: { value: inkTintBoostValue },
      uVertexInkOk: { value: DEFAULT_UNIFORM_VALUES.uVertexInkOk },
    }
  }

  const tunablesRef = React.useRef(getDreamdustTunables())

  const resolveRevealDurationSeconds = React.useCallback(() => {
    if (presetAiryEnabled) {
      return Math.max(MIN_REVEAL_SECONDS, PresetAiry.revealDuration)
    }
    if (presetVaporEnabled) {
      return Math.max(MIN_REVEAL_SECONDS, PresetC.revealDuration)
    }
    const { revealMs } = tunablesRef.current
    const ms = Number.isFinite(revealMs) ? Math.max(100, revealMs) : DEFAULT_REVEAL_MS
    return Math.max(MIN_REVEAL_SECONDS, ms / 1000)
  }, [presetAiryEnabled, presetVaporEnabled])

  const cascadeVaporGain = presetAiryEnabled
    ? PresetAiry.cascadeRate
    : presetVaporEnabled
      ? PresetC.cascadeRate
      : CASCADE_VAPOR_GAIN

  const revealTimelineRef = React.useRef<RevealTimelineState>({
    active: false,
    elapsed: 0,
    duration: resolveRevealDurationSeconds(),
    didLogEnd: false,
  })
  const cascadeTimelineRef = React.useRef<CascadeTimelineState>({
    active: false,
    elapsed: 0,
    duration: CASCADE_DURATION_SECONDS,
    sizeBoost: CASCADE_SIZE_BOOST,
    vaporGain: cascadeVaporGain,
    didLogStart: false,
    didLogEnd: false,
  })
  const breathStateRef = React.useRef({
    phase: 0,
  })
  const lastInkTextureRef = React.useRef<TextureLike | null>(null)

  React.useEffect(() => {
    return subscribeDreamdustTunables((next) => {
      tunablesRef.current = next
      const reveal = revealTimelineRef.current
      if (!reveal.active) {
        reveal.duration = resolveRevealDurationSeconds()
      }
    })
  }, [resolveRevealDurationSeconds])

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
    reveal.duration = resolveRevealDurationSeconds()
    reveal.didLogEnd = false
    if (uniforms) {
      uniforms.uReveal.value = 0
    }
    safeLog('[Dreamdust] reveal start', {
      duration: Number(reveal.duration.toFixed(3)),
    })
  }, [resolveRevealDurationSeconds])

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
    cascade.vaporGain = cascadeVaporGain
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
  }, [cascadeVaporGain])

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

      if (texture === null) {
        lastInkTextureRef.current = null
        return
      }

      if (lastInkTextureRef.current === texture) {
        return
      }

      const metrics = extractInkTextureMetrics(texture)
      if (!metrics) {
        return
      }

      lastInkTextureRef.current = texture
      logOnce('ink-tex bind', metrics)
      safeLog('[Dreamdust] ink-tex bind', metrics)
    },
    [setUniform],
  )

  const simUniforms = simUniformsRef.current
  if (!simUniforms) {
    throw new Error('Dreamdust sim uniforms unavailable')
  }

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
    simUniforms,
    presetAiryActive: presetAiryEnabled,
    simEngineActive,
  }
}
