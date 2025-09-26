import presets from '../../../config/dreamdust-presets.json'
import type { DreamdustUniformValueMap } from '../../components/dreamdust/useDreamdustUniforms'

type DreamdustPresetKey = keyof typeof presets

export type DreamdustPresetId = Exclude<DreamdustPresetKey, number>

export type DreamdustPresetConfig = {
  id: DreamdustPresetId
  uniforms: DreamdustUniformValueMap
}

export const DEFAULT_DREAMDUST_PRESET_ID: DreamdustPresetId = 'baseline'

const PRESET_REGISTRY = new Map<string, DreamdustPresetId>()

for (const key of Object.keys(presets) as DreamdustPresetId[]) {
  PRESET_REGISTRY.set(key.toLowerCase(), key)
}

// Legacy aliases preserved for backwards compatibility.
PRESET_REGISTRY.set('vapor', 'cascade')

function cloneUniformValues(values: DreamdustUniformValueMap): DreamdustUniformValueMap {
  const next: Partial<DreamdustUniformValueMap> = {}
  for (const [key, value] of Object.entries(values) as [keyof DreamdustUniformValueMap, DreamdustUniformValueMap[keyof DreamdustUniformValueMap]][]) {
    if (Array.isArray(value)) {
      next[key] = [...value] as DreamdustUniformValueMap[typeof key]
    } else {
      next[key] = value
    }
  }
  return next as DreamdustUniformValueMap
}

function resolvePresetId(candidate: string | null | undefined): DreamdustPresetId {
  if (typeof candidate !== 'string') {
    return DEFAULT_DREAMDUST_PRESET_ID
  }
  const normalized = candidate.trim().toLowerCase()
  if (!normalized) {
    return DEFAULT_DREAMDUST_PRESET_ID
  }
  return PRESET_REGISTRY.get(normalized) ?? DEFAULT_DREAMDUST_PRESET_ID
}

export function loadDreamdustPreset(candidate?: string | null): DreamdustPresetConfig {
  const id = resolvePresetId(candidate ?? undefined)
  const preset = presets[id]
  return {
    id,
    uniforms: cloneUniformValues(preset.uniforms as DreamdustUniformValueMap),
  }
}
