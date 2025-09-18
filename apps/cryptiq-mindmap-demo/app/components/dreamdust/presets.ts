import { getDreamdustTunables, updateDreamdustTunables, type DreamdustTunables } from './metrics'

export type DreamdustPresetId = 'calm' | 'breathy' | 'vaporizeFast'

export type DreamdustPreset = {
  id: DreamdustPresetId
  label: string
  description: string
  tunables: DreamdustTunables
  cascadeSizeBoost: number
}

const CASCADE_SIZE_STORAGE_KEY = 'dreamdust:cascade-size-boost'
export const CASCADE_SIZE_MIN = 0.8
export const CASCADE_SIZE_MAX = 2.4
export const CASCADE_SIZE_STEP = 0.05
const CASCADE_SIZE_DEFAULT = 1.5
const CASCADE_SIZE_TOLERANCE = 1e-3

const TUNABLE_KEYS = [
  'curlFreq',
  'curlAmp',
  'tapGain',
  'tapTau',
  'decay',
  'revealMs',
] as const satisfies readonly (keyof DreamdustTunables)[]

const TUNABLE_TOLERANCES: Record<keyof DreamdustTunables, number> = {
  curlFreq: 1e-6,
  curlAmp: 1e-3,
  tapGain: 1e-3,
  tapTau: 1,
  decay: 1e-4,
  revealMs: 1,
}

const PRESET_CONFIGS = [
  {
    id: 'calm',
    label: 'Calm',
    description: 'Long, gentle reveal with slow curls and lingering ink.',
    tunables: {
      curlFreq: 0.0018,
      curlAmp: 6.5,
      tapGain: 0.85,
      tapTau: 1400,
      decay: 0.992,
      revealMs: 3600,
    },
    cascadeSizeBoost: 1.3,
  },
  {
    id: 'breathy',
    label: 'Breathy',
    description: 'Default balance tuned for soft motion and steady decay.',
    tunables: {
      curlFreq: 0.0025,
      curlAmp: 8,
      tapGain: 1,
      tapTau: 900,
      decay: 0.98,
      revealMs: 2000,
    },
    cascadeSizeBoost: CASCADE_SIZE_DEFAULT,
  },
  {
    id: 'vaporizeFast',
    label: 'Vaporize Fast',
    description: 'Aggressive energy with rapid reveal and heightened curls.',
    tunables: {
      curlFreq: 0.0055,
      curlAmp: 11.5,
      tapGain: 1.35,
      tapTau: 720,
      decay: 0.965,
      revealMs: 1200,
    },
    cascadeSizeBoost: 1.85,
  },
] as const satisfies readonly DreamdustPreset[]

const PRESET_BY_ID = new Map<DreamdustPresetId, (typeof PRESET_CONFIGS)[number]>(
  PRESET_CONFIGS.map((preset) => [preset.id, preset]),
)

function clampCascadeSizeBoost(value: number): number {
  if (!Number.isFinite(value)) {
    return CASCADE_SIZE_DEFAULT
  }
  if (value < CASCADE_SIZE_MIN) {
    return CASCADE_SIZE_MIN
  }
  if (value > CASCADE_SIZE_MAX) {
    return CASCADE_SIZE_MAX
  }
  return Number(value)
}

function readStoredCascadeSizeBoost(): number {
  if (typeof window === 'undefined') {
    return CASCADE_SIZE_DEFAULT
  }
  try {
    const raw = window.localStorage?.getItem(CASCADE_SIZE_STORAGE_KEY)
    if (!raw) {
      return CASCADE_SIZE_DEFAULT
    }
    const parsed = Number(raw)
    if (Number.isFinite(parsed)) {
      return clampCascadeSizeBoost(parsed)
    }
  } catch {
    // Ignore storage read failures.
  }
  return CASCADE_SIZE_DEFAULT
}

function persistCascadeSizeBoost(value: number): void {
  if (typeof window === 'undefined') {
    return
  }
  try {
    window.localStorage?.setItem(CASCADE_SIZE_STORAGE_KEY, String(value))
  } catch {
    // Ignore storage write failures (e.g., private mode).
  }
}

let cascadeSizeBoost = readStoredCascadeSizeBoost()

const cascadeSizeListeners = new Set<(value: number) => void>()

function emitCascadeSizeBoost(value: number): void {
  if (cascadeSizeListeners.size === 0) {
    return
  }
  const snapshot = value
  cascadeSizeListeners.forEach((listener) => {
    try {
      listener(snapshot)
    } catch {
      // Ignore listener failures to avoid cascading errors.
    }
  })
}

function cloneTunables(tunables: DreamdustTunables): DreamdustTunables {
  return { ...tunables }
}

export function getCascadeSizeBoost(): number {
  return cascadeSizeBoost
}

export function setCascadeSizeBoost(value: number): number {
  const clamped = clampCascadeSizeBoost(value)
  if (clamped === cascadeSizeBoost) {
    return cascadeSizeBoost
  }
  cascadeSizeBoost = clamped
  persistCascadeSizeBoost(cascadeSizeBoost)
  emitCascadeSizeBoost(cascadeSizeBoost)
  return cascadeSizeBoost
}

export function subscribeCascadeSizeBoost(
  listener: (value: number) => void,
): () => void {
  cascadeSizeListeners.add(listener)
  try {
    listener(cascadeSizeBoost)
  } catch {
    // Ignore initial listener errors.
  }
  return () => {
    cascadeSizeListeners.delete(listener)
  }
}

export function listDreamdustPresets(): DreamdustPreset[] {
  return PRESET_CONFIGS.map((preset) => ({
    id: preset.id,
    label: preset.label,
    description: preset.description,
    cascadeSizeBoost: preset.cascadeSizeBoost,
    tunables: cloneTunables(preset.tunables),
  }))
}

export function getDreamdustPreset(id: DreamdustPresetId): DreamdustPreset | null {
  const preset = PRESET_BY_ID.get(id)
  if (!preset) {
    return null
  }
  return {
    id: preset.id,
    label: preset.label,
    description: preset.description,
    cascadeSizeBoost: preset.cascadeSizeBoost,
    tunables: cloneTunables(preset.tunables),
  }
}

function tunablesRoughlyEqual(a: DreamdustTunables, b: DreamdustTunables): boolean {
  for (const key of TUNABLE_KEYS) {
    const delta = Math.abs(a[key] - b[key])
    if (delta > (TUNABLE_TOLERANCES[key] ?? 0)) {
      return false
    }
  }
  return true
}

export function matchDreamdustPreset(
  tunables: DreamdustTunables,
  sizeBoost: number = cascadeSizeBoost,
): DreamdustPresetId | null {
  for (const preset of PRESET_CONFIGS) {
    if (Math.abs(sizeBoost - preset.cascadeSizeBoost) > CASCADE_SIZE_TOLERANCE) {
      continue
    }
    if (tunablesRoughlyEqual(tunables, preset.tunables)) {
      return preset.id
    }
  }
  return null
}

export function applyDreamdustPreset(id: DreamdustPresetId): DreamdustPreset | null {
  const preset = PRESET_BY_ID.get(id)
  if (!preset) {
    return null
  }
  const applied = updateDreamdustTunables(preset.tunables)
  setCascadeSizeBoost(preset.cascadeSizeBoost)
  return {
    id: preset.id,
    label: preset.label,
    description: preset.description,
    cascadeSizeBoost: cascadeSizeBoost,
    tunables: cloneTunables(applied),
  }
}

export type DreamdustStateSnapshot = {
  version: 1
  presetId: DreamdustPresetId | null
  tunables: DreamdustTunables
  cascadeSizeBoost: number
}

type DreamdustStatePayload = {
  presetId?: DreamdustPresetId
  tunables?: Partial<DreamdustTunables>
  cascadeSizeBoost?: number
}

function sanitizePresetId(id: unknown): DreamdustPresetId | undefined {
  if (typeof id !== 'string') {
    return undefined
  }
  return PRESET_BY_ID.has(id as DreamdustPresetId)
    ? (id as DreamdustPresetId)
    : undefined
}

function sanitizeTunables(
  value: unknown,
): Partial<DreamdustTunables> | undefined {
  if (!value || typeof value !== 'object') {
    return undefined
  }
  const record = value as Record<string, unknown>
  const sanitized: Partial<DreamdustTunables> = {}
  let count = 0
  for (const key of TUNABLE_KEYS) {
    const candidate = record[key]
    if (typeof candidate === 'number' && Number.isFinite(candidate)) {
      sanitized[key] = candidate
      count += 1
    }
  }
  return count > 0 ? sanitized : undefined
}

function sanitizeCascadeSize(value: unknown): number | undefined {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return undefined
  }
  return clampCascadeSizeBoost(value)
}

function parseDreamdustState(serialized: string): DreamdustStatePayload | null {
  if (serialized.trim() === '') {
    return null
  }
  let parsed: unknown
  try {
    parsed = JSON.parse(serialized)
  } catch {
    return null
  }
  if (!parsed || typeof parsed !== 'object') {
    return null
  }
  const record = parsed as Record<string, unknown>
  const payload: DreamdustStatePayload = {}
  const presetId = sanitizePresetId(record.presetId)
  if (presetId) {
    payload.presetId = presetId
  }
  const tunables = sanitizeTunables(record.tunables)
  if (tunables) {
    payload.tunables = tunables
  }
  const cascade = sanitizeCascadeSize(record.cascadeSizeBoost)
  if (typeof cascade === 'number') {
    payload.cascadeSizeBoost = cascade
  }
  return payload
}

export function snapshotDreamdustState(): DreamdustStateSnapshot {
  const tunables = getDreamdustTunables()
  const sizeBoost = getCascadeSizeBoost()
  const presetId = matchDreamdustPreset(tunables, sizeBoost)
  return {
    version: 1,
    presetId,
    tunables: cloneTunables(tunables),
    cascadeSizeBoost: sizeBoost,
  }
}

export function serializeDreamdustState(
  snapshot: DreamdustStateSnapshot = snapshotDreamdustState(),
  space = 2,
): string {
  return JSON.stringify(snapshot, null, space)
}

export function applySerializedDreamdustState(
  serialized: string,
): DreamdustStateSnapshot | null {
  const payload = parseDreamdustState(serialized)
  if (!payload) {
    return null
  }

  let presetApplied = false
  if (payload.presetId && !payload.tunables) {
    const applied = applyDreamdustPreset(payload.presetId)
    presetApplied = !!applied
  }

  if (!presetApplied && payload.tunables) {
    updateDreamdustTunables(payload.tunables)
    if (payload.presetId && payload.cascadeSizeBoost === undefined) {
      const preset = PRESET_BY_ID.get(payload.presetId)
      if (preset) {
        setCascadeSizeBoost(preset.cascadeSizeBoost)
      }
    }
  }

  if (payload.cascadeSizeBoost !== undefined) {
    setCascadeSizeBoost(payload.cascadeSizeBoost)
  }

  const current = snapshotDreamdustState()
  return current
}
