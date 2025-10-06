'use client'

import * as React from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import type { RootState } from '@react-three/fiber'

import { getDreamdustTunables, logOnce, subscribeDreamdustTunables } from './metrics'
import { PresetAiry, PresetC } from './presets'
import { DEFAULT_DREAMDUST_PRESET_ID, loadDreamdustPreset } from '../../utils/dreamdust/loadPreset'

type TextureLike = unknown
type Vec3 = [number, number, number]

export type DreamdustUniformValueMap = {
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
  uAlphaFloor?: number
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
  uSpriteSharpness: number
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

const DEFAULT_SPRITE_SHARPNESS = 4

export const DEFAULT_POINT_SIZING = Object.freeze({
  baseSize: 6.0,   // Medium particles for density balance
  minSize: 1.2,    // Scaled proportionally
  maxSize: 9.0,    // Scaled proportionally
  sizeGain: 1,
  offsetGain: 1,
}) as const

type PointSizingUniformName =
  | 'uPointBaseSize'
  | 'uMinSize'
  | 'uMaxSize'
  | 'uSizeGain'
  | 'uOffsetGain'

type PointSizingValues = Pick<DreamdustUniformValueMap, PointSizingUniformName>

function isPointSizingUniformName(name: keyof DreamdustUniformValueMap): name is PointSizingUniformName {
  return (
    name === 'uPointBaseSize' ||
    name === 'uMinSize' ||
    name === 'uMaxSize' ||
    name === 'uSizeGain' ||
    name === 'uOffsetGain'
  )
}

function clampNumber(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) {
    return min
  }
  if (value < min) return min
  if (value > max) return max
  return value
}

function clampAlphaFloor(value: unknown): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return 0.1
  }
  return Math.max(0.1, value)
}

function clampNoiseThreshold(value: unknown): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return 0.6
  }
  return clampNumber(value, 0, 1)
}

function clampOffsetGain(value: unknown): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return DEFAULT_POINT_SIZING.offsetGain
  }
  return value >= 0 ? value : DEFAULT_POINT_SIZING.offsetGain
}
function resolvePointSizing(source: PointSizingValues): PointSizingValues {
  const requestedMin = Number.isFinite(source.uMinSize)
    ? (source.uMinSize as number)
    : DEFAULT_POINT_SIZING.minSize
  const requestedMax = Number.isFinite(source.uMaxSize)
    ? (source.uMaxSize as number)
    : DEFAULT_POINT_SIZING.maxSize
  const minFloor = Math.min(DEFAULT_POINT_SIZING.minSize, requestedMin)
  const maxCeiling = Math.max(DEFAULT_POINT_SIZING.maxSize, requestedMax)
  const safeMin = clampNumber(requestedMin, Math.max(0, minFloor), maxCeiling)
  const safeMaxCandidate = clampNumber(requestedMax, safeMin, maxCeiling)
  const minBound = Math.min(safeMin, safeMaxCandidate)
  const maxBound = Math.max(minBound, safeMaxCandidate)
  const requestedBase = Number.isFinite(source.uPointBaseSize)
    ? (source.uPointBaseSize as number)
    : DEFAULT_POINT_SIZING.baseSize
  const base = clampNumber(requestedBase, minBound, maxBound)
  const requestedSizeGain = Number.isFinite(source.uSizeGain)
    ? (source.uSizeGain as number)
    : DEFAULT_POINT_SIZING.sizeGain
  const sizeGain = requestedSizeGain > 0 ? requestedSizeGain : DEFAULT_POINT_SIZING.sizeGain
  const requestedOffsetGain = Number.isFinite(source.uOffsetGain)
    ? (source.uOffsetGain as number)
    : DEFAULT_POINT_SIZING.offsetGain
  const offsetGain = requestedOffsetGain >= 0 ? requestedOffsetGain : DEFAULT_POINT_SIZING.offsetGain
  return {
    uPointBaseSize: base,
    uMinSize: minBound,
    uMaxSize: maxBound,
    uSizeGain: sizeGain,
    uOffsetGain: offsetGain,
  }
}

function applyPointSizingUniformValue(
  uniforms: DreamdustUniforms,
  name: PointSizingUniformName,
  rawValue: number
): number {
  const fallback: PointSizingValues = {
    uPointBaseSize: DEFAULT_POINT_SIZING.baseSize,
    uMinSize: DEFAULT_POINT_SIZING.minSize,
    uMaxSize: DEFAULT_POINT_SIZING.maxSize,
    uSizeGain: DEFAULT_POINT_SIZING.sizeGain,
    uOffsetGain: DEFAULT_POINT_SIZING.offsetGain,
  }

  const current: PointSizingValues = { ...fallback }

  for (const key of Object.keys(current) as PointSizingUniformName[]) {
    const uniform = uniforms[key]
    if (uniform && typeof uniform.value === 'number' && Number.isFinite(uniform.value)) {
      current[key] = uniform.value as PointSizingValues[typeof key]
    }
  }

  current[name] = Number.isFinite(rawValue) ? rawValue : current[name]

  const resolved = resolvePointSizing(current)

  for (const key of Object.keys(resolved) as PointSizingUniformName[]) {
    const uniform = uniforms[key]
    if (uniform) {
      ;(uniform as typeof uniform).value = resolved[key] as typeof uniform.value
    }
  }

  return resolved[name]
}

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

function initialViewport(defaultViewport: [number, number]): [number, number] {
  const viewport: [number, number] = [...defaultViewport]
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

const DEFAULT_REVEAL_MS = 900
const MIN_REVEAL_SECONDS = 0.2
const BREATH_PERIOD_SECONDS = 7.5
const BREATH_SPEED = (Math.PI * 2) / BREATH_PERIOD_SECONDS
const CASCADE_RAMP_S = 0.7
const CASCADE_HOLD_S = 0.2
const CASCADE_DECAY_S = 0.8
const CASCADE_DURATION_SECONDS = CASCADE_RAMP_S + CASCADE_HOLD_S + CASCADE_DECAY_S
const CASCADE_SIZE_PEAK = 0.25
const CASCADE_VAPOR_PEAK = 0.9

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

function readTextureDimensions(
  candidate: unknown
): Pick<TextureMetrics, 'width' | 'height'> | null {
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
    typeof needsUpdateValue === 'boolean' ? needsUpdateValue : Boolean(needsUpdateValue)

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
const PRESET_CASCADE_VALUE = 'cascade'
const PRESET_AIRY_VALUE = 'airy'
const PRESET_ENV_KEY = 'DD_PRESET'
const PRESET_URI_ENV_KEYS = ['DD_PRESET_URI', 'NEXT_PUBLIC_DD_PRESET_URI'] as const
const INK_BUMP_QUERY_KEY = 'inkBump'
const INK_BUMP_ENV_KEY = 'DD_INK_BUMP'
const INK_BUMP_SIZE_MULTIPLIER = 1.2
const INK_BUMP_OFFSET_MULTIPLIER = 1.15
const INK_BUMP_TINT_MULTIPLIER = 1.18
const TRUTHY_BUMP_VALUES = new Set(['1', 'true'])
const PRESET_SWAP_SKIP_KEYS = new Set<keyof DreamdustUniformValueMap>([
  'uTime',
  'uViewport',
  'uInkTex',
  'uReveal',
  'uBreath',
  'uCascade',
  'uCascadeColor',
  'uCascadeSizeBoost',
  'uVaporGain',
  'uDepthBias',
  'uDepthNormScale',
  'uNoiseScale',
  'uNoiseSpeed',
  'uEvolution',
  'uPointBaseSize',
  'uMinSize',
  'uMaxSize',
  'uSizeGain',
  'uOffsetGain',
])

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

function detectPresetUri(): boolean {
  for (const key of PRESET_URI_ENV_KEYS) {
    const raw = readEnvValue(key)
    if (typeof raw === 'string' && raw.trim()) {
      return true
    }
  }
  return false
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

function isDebugPresetId(id: string): boolean {
  const normalized = id.trim().toLowerCase()
  if (!normalized.startsWith('debug')) {
    return false
  }
  const next = normalized.charAt(5)
  return next === '' || next === '/' || next === '-' || next === ':' || next === '_'
}

function readPresetCandidate(): string {
  const queryValue = normalizeGateValue(readSearchParam(PRESET_QUERY_KEY))
  if (queryValue) {
    return queryValue
  }
  const envValue = normalizeGateValue(readEnvValue(PRESET_ENV_KEY))
  if (envValue) {
    return envValue
  }
  return DEFAULT_DREAMDUST_PRESET_ID
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
    resolveSimNumber('numParticles', uniforms.numParticles)
  )
  const damping = resolveSimNumber('velocityDamping', uniforms.velocityDamping)
  uniforms.velocityDamping = Number.isFinite(damping) ? damping : uniforms.velocityDamping
  const gravity = resolveSimNumber('gravityY', uniforms.gravityY)
  uniforms.gravityY = Number.isFinite(gravity) ? gravity : uniforms.gravityY
  const turbulenceStrength = resolveSimNumber('turbulenceStrength', uniforms.turbulenceStrength)
  uniforms.turbulenceStrength = Number.isFinite(turbulenceStrength)
    ? turbulenceStrength
    : uniforms.turbulenceStrength
  const turbulenceTime = resolveSimNumber('turbulenceTime', uniforms.turbulenceTime)
  uniforms.turbulenceTime = Number.isFinite(turbulenceTime)
    ? turbulenceTime
    : uniforms.turbulenceTime
  const turbulencePosFreq = resolveSimNumber(
    'turbulencePositionFrequency',
    uniforms.turbulencePositionFrequency
  )
  uniforms.turbulencePositionFrequency = Number.isFinite(turbulencePosFreq)
    ? turbulencePosFreq
    : uniforms.turbulencePositionFrequency
  const emitterRadius = resolveSimNumber('emitterRadius', uniforms.emitterRadius)
  uniforms.emitterRadius = Number.isFinite(emitterRadius) ? emitterRadius : uniforms.emitterRadius
  const emitterVelocity = resolveSimNumber(
    'emitterVelocityStrength',
    uniforms.emitterVelocityStrength
  )
  uniforms.emitterVelocityStrength = Number.isFinite(emitterVelocity)
    ? emitterVelocity
    : uniforms.emitterVelocityStrength
  const randomVelocity = resolveSimNumber('initialRandomVelocity', uniforms.initialRandomVelocity)
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

type DreamdustUniformValue<Name extends DreamdustUniformName> = DreamdustUniforms[Name]['value']

type UseDreamdustUniformsResult = {
  uniforms: DreamdustUniforms
  tick: (delta: number) => void
  startReveal: () => void
  startCascade: (color: Vec3) => void
  stopCascade: () => void
  setUniform: <Name extends DreamdustUniformName>(
    name: Name,
    value: DreamdustUniformValue<Name>
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
  const allowDebugPresets = React.useMemo(detectPresetUri, [])
  const simEngineActive = React.useMemo(detectSimEngine, [])
  const resolvePresetCandidate = React.useCallback(readPresetCandidate, [])
  const applyPresetGuards = React.useCallback(
    (candidate?: string | null) => {
      const next = loadDreamdustPreset(candidate)
      if (!allowDebugPresets && isDebugPresetId(next.id)) {
        return loadDreamdustPreset(DEFAULT_DREAMDUST_PRESET_ID)
      }
      return next
    },
    [allowDebugPresets],
  )
  const [presetState, setPresetState] = React.useState(() =>
    applyPresetGuards(resolvePresetCandidate())
  )
  const presetIdRef = React.useRef(presetState.id)

  React.useEffect(() => {
    presetIdRef.current = presetState.id
  }, [presetState.id])

  React.useEffect(() => {
    if (typeof window === 'undefined' || typeof window.requestAnimationFrame === 'undefined') {
      return undefined
    }

    let frame = 0

    const pollPreset = () => {
      const candidate = resolvePresetCandidate()
      if (candidate === presetIdRef.current) {
        frame = window.requestAnimationFrame(pollPreset)
        return
      }
      const next = applyPresetGuards(candidate)
      if (next.id !== presetIdRef.current) {
        presetIdRef.current = next.id
        setPresetState(next)
      }
      frame = window.requestAnimationFrame(pollPreset)
    }

    frame = window.requestAnimationFrame(pollPreset)

    return () => {
      window.cancelAnimationFrame(frame)
    }
  }, [applyPresetGuards, resolvePresetCandidate])

  const presetAiryEnabled = presetState.id === PRESET_AIRY_VALUE
  const presetCascadeEnabled = presetState.id === PRESET_CASCADE_VALUE
  const inkBumpEnabled = React.useMemo(
    () => (presetAiryEnabled ? false : detectInkBump()),
    [presetAiryEnabled]
  )
  const uniformsRef = React.useRef<DreamdustUniforms | null>(null)
  const simUniformsRef = React.useRef<DreamdustSimUniforms | null>(null)

  if (!simUniformsRef.current) {
    simUniformsRef.current = createSimUniforms()
  }

  if (!uniformsRef.current) {
    const defaults = presetState.uniforms
    const inkOffsetBase = defaults.uInkOffsetBoost
    const inkSizeBase = defaults.uInkSizeBoost
    const inkTintBase = defaults.uInkTintBoost
    const inkOffsetBoostValue = inkOffsetBase * (inkBumpEnabled ? INK_BUMP_OFFSET_MULTIPLIER : 1)
    const inkSizeBoostValue = inkSizeBase * (inkBumpEnabled ? INK_BUMP_SIZE_MULTIPLIER : 1)
    const inkTintBoostValue = inkTintBase * (inkBumpEnabled ? INK_BUMP_TINT_MULTIPLIER : 1)
    const alphaFloorValue = clampAlphaFloor(defaults.uAlphaFloor)
    const noiseThresholdValue = clampNoiseThreshold(defaults.uNoiseThreshold)
    const offsetGainValue = clampOffsetGain(defaults.uOffsetGain)
    const pointSizingDefaults = resolvePointSizing({
      uPointBaseSize: defaults.uPointBaseSize,
      uMinSize: defaults.uMinSize,
      uMaxSize: defaults.uMaxSize,
      uSizeGain: defaults.uSizeGain,
      uOffsetGain: offsetGainValue,
    })

    uniformsRef.current = {
      uTime: { value: defaults.uTime },
      uViewport: { value: initialViewport(defaults.uViewport) },
      uInkTex: { value: defaults.uInkTex },
      uInkIntensity: { value: defaults.uInkIntensity },
      uReveal: { value: defaults.uReveal },
      uBreath: { value: defaults.uBreath },
      uBreathAmp: { value: defaults.uBreathAmp },
      uCascade: { value: defaults.uCascade },
      uCascadeColor: { value: [...defaults.uCascadeColor] as Vec3 },
      uCascadeSizeBoost: { value: defaults.uCascadeSizeBoost },
      uVaporGain: { value: defaults.uVaporGain },
      uNoiseScale: { value: defaults.uNoiseScale },
      uNoiseSpeed: { value: defaults.uNoiseSpeed },
      uEvolution: { value: defaults.uEvolution },
      uNoiseThreshold: { value: noiseThresholdValue },
      uAlphaFloor: { value: alphaFloorValue },
      uDriftAmp: { value: defaults.uDriftAmp },
      uCurlAmp: { value: defaults.uCurlAmp },
      uPointBaseSize: { value: pointSizingDefaults.uPointBaseSize },
      uDepthMin: { value: defaults.uDepthMin },
      uDepthMax: { value: defaults.uDepthMax },
      uDepthBias: { value: defaults.uDepthBias },
      uDepthNormScale: { value: defaults.uDepthNormScale },
      uGamma: { value: defaults.uGamma },
      uRimGamma: { value: defaults.uRimGamma },
      uFocal: { value: defaults.uFocal },
      uMinSize: { value: pointSizingDefaults.uMinSize },
      uMaxSize: { value: pointSizingDefaults.uMaxSize },
      uSizeGain: { value: pointSizingDefaults.uSizeGain },
      uOffsetGain: { value: pointSizingDefaults.uOffsetGain },
      uInkOffsetBoost: { value: inkOffsetBoostValue },
      uInkSizeBoost: { value: inkSizeBoostValue },
      uTintGain: { value: defaults.uTintGain },
      uInkTintBoost: { value: inkTintBoostValue },
      uVertexInkOk: { value: defaults.uVertexInkOk },
      uSpriteSharpness: {
        value: Number.isFinite(defaults.uSpriteSharpness)
          ? (defaults.uSpriteSharpness as number)
          : DEFAULT_SPRITE_SHARPNESS,
      },
    }
  }

  const tunablesRef = React.useRef(getDreamdustTunables())

  const resolveRevealDurationSeconds = React.useCallback(() => {
    if (presetAiryEnabled) {
      return Math.max(MIN_REVEAL_SECONDS, PresetAiry.revealDuration)
    }
    if (presetCascadeEnabled) {
      return Math.max(MIN_REVEAL_SECONDS, PresetC.revealDuration)
    }
    const { revealMs } = tunablesRef.current
    const ms = Number.isFinite(revealMs) ? Math.max(100, revealMs) : DEFAULT_REVEAL_MS
    return Math.max(MIN_REVEAL_SECONDS, ms / 1000)
  }, [presetAiryEnabled, presetCascadeEnabled])

  const cascadeVaporGain = presetAiryEnabled
    ? PresetAiry.cascadeRate
    : presetCascadeEnabled
      ? PresetC.cascadeRate
      : CASCADE_VAPOR_PEAK

  const revealTimelineRef = React.useRef<RevealTimelineState>({
    active: false,
    elapsed: 0,
    duration: resolveRevealDurationSeconds(),
    didLogEnd: false,
  })
  const revealClampLoggedRef = React.useRef(false)
  const cascadeTimelineRef = React.useRef<CascadeTimelineState>({
    active: false,
    elapsed: 0,
    duration: CASCADE_DURATION_SECONDS,
    sizeBoost: CASCADE_SIZE_PEAK,
    vaporGain: cascadeVaporGain,
    didLogStart: false,
    didLogEnd: false,
  })
  const breathStateRef = React.useRef({
    phase: 0,
  })
  const lastInkTextureRef = React.useRef<TextureLike | null>(null)
  const vertexInkOkPrevRef = React.useRef(presetState.uniforms.uVertexInkOk)

  React.useEffect(() => {
    const uniforms = uniformsRef.current
    if (!uniforms) {
      return
    }

    const defaults = presetState.uniforms
    const inkOffsetBase = defaults.uInkOffsetBoost
    const inkSizeBase = defaults.uInkSizeBoost
    const inkTintBase = defaults.uInkTintBoost
    const inkOffsetValue = inkOffsetBase * (inkBumpEnabled ? INK_BUMP_OFFSET_MULTIPLIER : 1)
    const inkSizeValue = inkSizeBase * (inkBumpEnabled ? INK_BUMP_SIZE_MULTIPLIER : 1)
    const inkTintValue = inkTintBase * (inkBumpEnabled ? INK_BUMP_TINT_MULTIPLIER : 1)
    const alphaFloorValue = clampAlphaFloor(defaults.uAlphaFloor)
    const noiseThresholdValue = clampNoiseThreshold(defaults.uNoiseThreshold)
    const resolvedPointSizing = resolvePointSizing({
      uPointBaseSize: defaults.uPointBaseSize,
      uMinSize: defaults.uMinSize,
      uMaxSize: defaults.uMaxSize,
      uSizeGain: defaults.uSizeGain,
      uOffsetGain: clampOffsetGain(defaults.uOffsetGain),
    })

    for (const key of Object.keys(defaults) as (keyof DreamdustUniformValueMap)[]) {
      if (!(key in uniforms)) {
        continue
      }
      if (PRESET_SWAP_SKIP_KEYS.has(key)) {
        continue
      }

      let nextValue = defaults[key]

      if (key === 'uInkOffsetBoost') {
        nextValue = inkOffsetValue as DreamdustUniformValueMap[typeof key]
      } else if (key === 'uInkSizeBoost') {
        nextValue = inkSizeValue as DreamdustUniformValueMap[typeof key]
      } else if (key === 'uInkTintBoost') {
        nextValue = inkTintValue as DreamdustUniformValueMap[typeof key]
      } else if (isPointSizingUniformName(key)) {
        nextValue = resolvedPointSizing[key] as DreamdustUniformValueMap[typeof key]
      } else if (key === 'uAlphaFloor') {
        nextValue = alphaFloorValue as DreamdustUniformValueMap[typeof key]
      } else if (key === 'uNoiseThreshold') {
        nextValue = noiseThresholdValue as DreamdustUniformValueMap[typeof key]
      }

      const uniform = uniforms[key]
      if (!uniform) {
        continue
      }

      if (Array.isArray(uniform.value) && Array.isArray(nextValue)) {
        const target = uniform.value as number[]
        for (let i = 0; i < Math.min(target.length, nextValue.length); i += 1) {
          target[i] = nextValue[i] as number
        }
      } else {
        ;(uniform as typeof uniform).value = nextValue as typeof uniform.value
      }
    }

    const alphaUniform = uniforms.uAlphaFloor
    if (alphaUniform) {
      alphaUniform.value = alphaFloorValue as typeof alphaUniform.value
    }
    const noiseUniform = uniforms.uNoiseThreshold
    if (noiseUniform) {
      noiseUniform.value = noiseThresholdValue as typeof noiseUniform.value
    }

    vertexInkOkPrevRef.current = defaults.uVertexInkOk
  }, [inkBumpEnabled, presetState, uniformsRef])

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

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      ;(
        window as typeof window & { debugDreamdustUniforms?: DreamdustUniforms | null }
      ).debugDreamdustUniforms = uniformsRef.current
    }
  })

  const size = useOptionalThree((state) => state.size)
  const viewportState = useOptionalThree((state) => state.viewport)

  const viewportWidth = viewportState?.width ?? size?.width ?? null
  const viewportHeight = viewportState?.height ?? size?.height ?? null

  React.useEffect(() => {
    if (viewportWidth === null || viewportHeight === null) return
    applyViewport(viewportWidth, viewportHeight)
  }, [applyViewport, viewportHeight, viewportWidth])

  const tick = React.useCallback((delta: number) => {
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
    const logRevealClamp = () => {
      if (revealClampLoggedRef.current) {
        return
      }
      revealClampLoggedRef.current = true
    }
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
        logRevealClamp()
      }
    } else if (reveal.elapsed >= reveal.duration && uniforms.uReveal.value < 1) {
      uniforms.uReveal.value = 1
      logRevealClamp()
    }

    const cascade = cascadeTimelineRef.current
    let cascadeEnded = false
    if (cascade.active) {
      if (!cascade.didLogStart) {
        cascade.didLogStart = true
        safeLog('[Dreamdust] cascade start', {
          duration: Number(cascade.duration.toFixed(3)),
        })
      }
      const cascadeDuration = CASCADE_DURATION_SECONDS
      cascade.elapsed = Math.min(cascade.elapsed + safeDelta, cascadeDuration)
      const t = cascade.elapsed
      let mix = 0
      if (t < CASCADE_RAMP_S) {
        const s = t / CASCADE_RAMP_S
        mix = cubicEaseInOut(s)
      } else if (t < CASCADE_RAMP_S + CASCADE_HOLD_S) {
        mix = 1
      } else if (t < cascadeDuration) {
        const s = (t - CASCADE_RAMP_S - CASCADE_HOLD_S) / CASCADE_DECAY_S
        mix = 1 - cubicEaseInOut(s)
      } else {
        cascade.active = false
        cascade.elapsed = 0
        mix = 0
        cascadeEnded = true
      }
      uniforms.uCascade.value = mix
      uniforms.uVaporGain.value = CASCADE_VAPOR_PEAK * mix
      uniforms.uCascadeSizeBoost.value = CASCADE_SIZE_PEAK * mix
      if (cascadeEnded && !cascade.didLogEnd) {
        cascade.didLogEnd = true
        safeLog('[Dreamdust] cascade end', {
          duration: Number(cascade.duration.toFixed(3)),
        })
      }
    } else if (uniforms.uVaporGain.value > 1e-4) {
      uniforms.uVaporGain.value = Math.max(
        0,
        uniforms.uVaporGain.value - safeDelta * cascade.vaporGain
      )
    }
  }, [])

  const startReveal = React.useCallback(() => {
    const uniforms = uniformsRef.current
    const reveal = revealTimelineRef.current
    reveal.active = true
    reveal.elapsed = 0
    reveal.duration = resolveRevealDurationSeconds()
    reveal.didLogEnd = false
    revealClampLoggedRef.current = false
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
    if (typeof window === 'undefined' || typeof window.requestAnimationFrame === 'undefined') {
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
    <Name extends DreamdustUniformName>(name: Name, value: DreamdustUniformValue<Name>) => {
      const uniforms = uniformsRef.current
      if (!uniforms) return
      if (isPointSizingUniformName(name) && typeof value === 'number') {
        const uniform = uniforms[name]
        if (!uniform) return
        applyPointSizingUniformValue(uniforms, name, value)
        return
      }

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
      if (name === 'uVertexInkOk') {
        if (typeof value === 'number') {
          if (
            process.env.NODE_ENV !== 'production' &&
            vertexInkOkPrevRef.current === 0 &&
            value > 0
          ) {
            safeLog('[dreamdust] vertex-ink-ok', { value: 1 })
          }
          vertexInkOkPrevRef.current = value
        } else {
          vertexInkOkPrevRef.current = value as number
        }
      }
      ;(uniform as typeof uniform).value = value as typeof uniform.value
    },
    []
  )

  const startCascade = React.useCallback(
    (color: Vec3) => {
      const uniforms = uniformsRef.current
      const cascade = cascadeTimelineRef.current
      cascade.active = true
      cascade.elapsed = 0
      cascade.duration = CASCADE_DURATION_SECONDS
      cascade.sizeBoost = CASCADE_SIZE_PEAK
      cascade.vaporGain = cascadeVaporGain
      cascade.didLogStart = false
      cascade.didLogEnd = false
      if (!uniforms) return
      uniforms.uCascade.value = 0
      uniforms.uCascadeSizeBoost.value = 0
      uniforms.uVaporGain.value = 0
      const target = uniforms.uCascadeColor.value
      for (let i = 0; i < target.length && i < color.length; i += 1) {
        target[i] = color[i]
      }
    },
    [cascadeVaporGain]
  )

  const stopCascade = React.useCallback(() => {
    const uniforms = uniformsRef.current
    const cascade = cascadeTimelineRef.current
    cascade.active = false
    cascade.elapsed = 0
    cascade.didLogStart = false
    cascade.didLogEnd = false
    if (!uniforms) return
    uniforms.uCascade.value = 0
    const defaults = presetState.uniforms
    uniforms.uCascadeSizeBoost.value = defaults.uCascadeSizeBoost
    uniforms.uVaporGain.value = defaults.uVaporGain
    const target = uniforms.uCascadeColor.value
    const fallback = defaults.uCascadeColor
    for (let i = 0; i < target.length && i < fallback.length; i += 1) {
      target[i] = fallback[i]
    }
  }, [presetState.uniforms])

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
      if (process.env.NODE_ENV !== 'production') {
        const uniforms = uniformsRef.current
        if (uniforms) {
          safeLog('[dreamdust] ink-telemetry', {
            intensity: Number(uniforms.uInkIntensity.value.toFixed(3)),
            offsetBoost: Number(uniforms.uInkOffsetBoost.value.toFixed(3)),
            sizeBoost: Number(uniforms.uInkSizeBoost.value.toFixed(3)),
            vertexInkOk: uniforms.uVertexInkOk.value,
          })
        }
      }
    },
    [setUniform]
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
