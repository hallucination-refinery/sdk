import { DEFAULT_DREAMDUST_PRESET_ID, loadDreamdustPreset } from '../../../utils/dreamdust/loadPreset'

describe('dreamdust presets', () => {
  it('hydrates baseline preset by default', () => {
    const preset = loadDreamdustPreset()
    expect(preset.id).toBe(DEFAULT_DREAMDUST_PRESET_ID)
    expect(preset.uniforms.uBreathAmp).toBeCloseTo(0.05)
    expect(preset.uniforms.uEvolution).toBeCloseTo(0.85)
  })

  it('hydrates airy preset with expected overrides', () => {
    const preset = loadDreamdustPreset('airy')
    expect(preset.id).toBe('airy')
    expect(preset.uniforms.uCurlAmp).toBeCloseTo(0.25)
    expect(preset.uniforms.uInkOffsetBoost).toBeCloseTo(1.2)
    expect(preset.uniforms.uRimGamma).toBeCloseTo(2.2)
  })

  it('falls back to baseline for unknown preset ids', () => {
    const fallback = loadDreamdustPreset('unknown')
    expect(fallback.id).toBe(DEFAULT_DREAMDUST_PRESET_ID)
    expect(fallback.uniforms.uBreathAmp).toBeCloseTo(0.05)
  })

  it('returns clones for each preset request', () => {
    const first = loadDreamdustPreset('cascade')
    const second = loadDreamdustPreset('cascade')
    expect(first.uniforms).not.toBe(second.uniforms)
    expect(first.uniforms.uCascadeColor).not.toBe(second.uniforms.uCascadeColor)
  })
})
