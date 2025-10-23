'use client'

import * as React from 'react'

import {
  getDreamdustCaps,
  readCaps,
  type DreamdustCaps,
  type DreamdustRuntimeCaps,
} from '../../components/dreamdust/capabilities'
import {
  getDreamdustTunables,
  subscribeDreamdustTunables,
  updateDreamdustTunables,
  type DreamdustTunables,
} from '../../components/dreamdust/metrics'
import {
  CASCADE_SIZE_MAX,
  CASCADE_SIZE_MIN,
  CASCADE_SIZE_STEP,
  applyDreamdustPreset,
  applySerializedDreamdustState,
  getCascadeSizeBoost,
  listDreamdustPresets,
  matchDreamdustPreset,
  serializeDreamdustState,
  setCascadeSizeBoost as commitCascadeSizeBoost,
  snapshotDreamdustState,
  subscribeCascadeSizeBoost,
  type DreamdustPresetId,
} from '../../components/dreamdust/presets'

type CapsState = {
  caps: DreamdustCaps | null
  bundle: DreamdustRuntimeCaps | null
  error: string | null
}

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'max-content 1fr',
  gap: '0.5rem 1rem',
  alignItems: 'baseline',
  maxWidth: '520px',
}

const labelStyle: React.CSSProperties = {
  fontWeight: 600,
}

function formatRange(range: Float32Array): string {
  return `[${Array.from(range).map((value) => value.toFixed(2)).join(', ')}]`
}

export default function Page(): JSX.Element {
  const [{ caps, bundle, error }, setCapsState] = React.useState<CapsState>({
    caps: null,
    bundle: null,
    error: null,
  })
  const [devicePixelRatio, setDevicePixelRatio] = React.useState<number | null>(
    null,
  )
  const [fps, setFps] = React.useState<number | null>(null)
  const [tunables, setTunables] = React.useState<DreamdustTunables>(() => getDreamdustTunables())
  const [cascadeSizeBoost, setCascadeSizeBoostState] = React.useState<number>(() =>
    getCascadeSizeBoost(),
  )
  const [selectedPreset, setSelectedPreset] = React.useState<DreamdustPresetId | 'custom'>(() => {
    const match = matchDreamdustPreset(getDreamdustTunables(), getCascadeSizeBoost())
    return match ?? 'custom'
  })
  const [presetJson, setPresetJson] = React.useState('')
  const [presetError, setPresetError] = React.useState<string | null>(null)

  const presetOptions = React.useMemo(() => listDreamdustPresets(), [])

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined
    }

    const updateDpr = () => {
      setDevicePixelRatio(window.devicePixelRatio || 1)
    }

    updateDpr()
    window.addEventListener('resize', updateDpr)

    const canvas = document.createElement('canvas')
    const runtimeCaps = getDreamdustCaps(canvas)
    const gl =
      (canvas.getContext('webgl2') as WebGL2RenderingContext | null) ??
      (canvas.getContext('webgl') as WebGLRenderingContext | null)

    if (!gl) {
      setCapsState({
        caps: null,
        bundle: runtimeCaps,
        error: 'WebGL context unavailable',
      })
    } else {
      setCapsState({
        caps: readCaps(gl),
        bundle: runtimeCaps,
        error: null,
      })
    }

    let rafId = 0
    let frameCount = 0
    let lastSampleTime = performance.now()

    const measure = (now: number) => {
      frameCount += 1
      const elapsed = now - lastSampleTime

      if (elapsed >= 500) {
        const nextFps = (frameCount * 1000) / elapsed
        setFps(Number(nextFps.toFixed(1)))
        frameCount = 0
        lastSampleTime = now
      }

      rafId = window.requestAnimationFrame(measure)
    }

    rafId = window.requestAnimationFrame(measure)

    return () => {
      window.removeEventListener('resize', updateDpr)
      if (rafId !== 0) {
        window.cancelAnimationFrame(rafId)
      }
    }
  }, [])

  React.useEffect(() => {
    return subscribeDreamdustTunables((next) => {
      setTunables(next)
    })
  }, [])

  React.useEffect(() => {
    return subscribeCascadeSizeBoost((next) => {
      setCascadeSizeBoostState(next)
    })
  }, [])

  React.useEffect(() => {
    const match = matchDreamdustPreset(tunables, cascadeSizeBoost)
    setSelectedPreset(match ?? 'custom')
  }, [cascadeSizeBoost, tunables])

  const handlePresetChange = React.useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const value = event.target.value as DreamdustPresetId | 'custom'
      if (value === 'custom') {
        setSelectedPreset('custom')
        return
      }
      applyDreamdustPreset(value)
      setPresetError(null)
    },
    [],
  )

  const handleExport = React.useCallback(() => {
    const snapshot = snapshotDreamdustState()
    setPresetJson(serializeDreamdustState(snapshot))
    setPresetError(null)
  }, [])

  const handleImport = React.useCallback(() => {
    const result = applySerializedDreamdustState(presetJson)
    if (result) {
      setPresetError(null)
      setPresetJson(serializeDreamdustState(result))
    } else {
      setPresetError('Invalid Dreamdust preset JSON')
    }
  }, [presetJson])

  const rows: Array<{ label: string; value: string }> = []

  rows.push({
    label: 'Device Pixel Ratio (current)',
    value:
      devicePixelRatio === null
        ? '—'
        : devicePixelRatio.toFixed(2).replace(/\.00$/, ''),
  })
  rows.push({
    label: 'FPS',
    value: fps === null ? '—' : fps.toFixed(1),
  })

  if (bundle) {
    rows.push(
      {
        label: 'Device Pixel Ratio (snapshot)',
        value: bundle.dpr.toFixed(2).replace(/\.00$/, ''),
      },
      {
        label: 'Vertex Ink Supported',
        value: bundle.vertexInkOk ? 'Yes' : 'No',
      },
      {
        label: 'Float Textures Supported',
        value: bundle.floatOk ? 'Yes' : 'No',
      },
      {
        label: 'Aliased Point Size Range',
        value: formatRange(bundle.aliasedPointSizeRange),
      },
    )
  } else {
    rows.push(
      { label: 'Device Pixel Ratio (snapshot)', value: '—' },
      { label: 'Vertex Ink Supported', value: '—' },
      { label: 'Float Textures Supported', value: '—' },
      { label: 'Aliased Point Size Range', value: '—' },
    )
  }

  if (caps) {
    rows.push(
      { label: 'Max Vertex Attribs', value: caps.maxVertexAttribs.toString() },
      { label: 'Max Texture Size', value: caps.maxTextureSize.toString() },
      {
        label: 'Max Vertex Texture Image Units',
        value: caps.maxVertexTextureImageUnits.toString(),
      },
    )
  } else if (error) {
    rows.push({ label: 'WebGL', value: error })
  } else {
    rows.push({ label: 'WebGL', value: 'Detecting…' })
  }

  return (
    <main style={{ padding: '1.5rem', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
        GL Capabilities
      </h1>
      <div style={gridStyle}>
        {rows.map(({ label, value }) => (
          <React.Fragment key={label}>
            <div style={labelStyle}>{label}</div>
            <div>{value}</div>
          </React.Fragment>
        ))}
      </div>
      <section style={{ marginTop: '2rem', maxWidth: '520px' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>
          Dreamdust Tunables
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'max-content 1fr',
            gap: '0.75rem 1rem',
            alignItems: 'center',
          }}
        >
          {(
            [
              {
                key: 'curlFreq' as const,
                label: 'Curl Frequency',
                min: 0.0005,
                max: 0.02,
                step: 0.0001,
                format: (value: number) => value.toFixed(4),
              },
              {
                key: 'curlAmp' as const,
                label: 'Curl Amplitude',
                min: 0,
                max: 16,
                step: 0.1,
                format: (value: number) => value.toFixed(1),
              },
              {
                key: 'tapGain' as const,
                label: 'Tap Gain',
                min: 0,
                max: 3,
                step: 0.05,
                format: (value: number) => value.toFixed(2),
              },
              {
                key: 'tapTau' as const,
                label: 'Tap Tau (ms)',
                min: 120,
                max: 6000,
                step: 20,
                format: (value: number) => Math.round(value).toString(),
              },
              {
                key: 'decay' as const,
                label: 'Decay Base',
                min: 0.9,
                max: 0.9999,
                step: 0.0005,
                format: (value: number) => value.toFixed(4),
              },
              {
                key: 'revealMs' as const,
                label: 'Reveal Duration (ms)',
                min: 300,
                max: 8000,
                step: 50,
                format: (value: number) => Math.round(value).toString(),
              },
            ] satisfies Array<{
              key: keyof DreamdustTunables
              label: string
              min: number
              max: number
              step: number
              format: (value: number) => string
            }>
          ).map(({ key, label, min, max, step, format }) => {
            const value = tunables[key]
            return (
              <React.Fragment key={key}>
                <label htmlFor={`dreamdust-${key}`} style={labelStyle}>
                  {label}
                </label>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                  }}
                >
                  <input
                    id={`dreamdust-${key}`}
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={(event) => {
                      const nextValue = Number(event.target.value)
                      if (!Number.isFinite(nextValue)) return
                      updateDreamdustTunables({ [key]: nextValue })
                    }}
                    style={{ flex: 1 }}
                  />
                  <span
                    style={{
                      minWidth: '4.5rem',
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: '0.85rem',
                      textAlign: 'right',
                    }}
                  >
                    {format(value)}
                  </span>
                </div>
              </React.Fragment>
            )
          })}
          <React.Fragment key="cascade-size-boost">
            <label htmlFor="dreamdust-cascade-size" style={labelStyle}>
              Cascade Size Boost
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              <input
                id="dreamdust-cascade-size"
                type="range"
                min={CASCADE_SIZE_MIN}
                max={CASCADE_SIZE_MAX}
                step={CASCADE_SIZE_STEP}
                value={cascadeSizeBoost}
                onChange={(event) => {
                  const nextValue = Number(event.target.value)
                  if (!Number.isFinite(nextValue)) return
                  commitCascadeSizeBoost(nextValue)
                }}
                style={{ flex: 1 }}
              />
              <span
                style={{
                  minWidth: '4.5rem',
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '0.85rem',
                  textAlign: 'right',
                }}
              >
                {cascadeSizeBoost.toFixed(2)}
              </span>
            </div>
          </React.Fragment>
        </div>
      </section>
      <section style={{ marginTop: '2rem', maxWidth: '520px' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Presets &amp; JSON</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="dreamdust-preset" style={labelStyle}>
            Preset
          </label>
          <select
            id="dreamdust-preset"
            value={selectedPreset}
            onChange={handlePresetChange}
            style={{
              padding: '0.35rem 0.5rem',
              fontSize: '0.95rem',
              fontFamily: 'inherit',
            }}
          >
            <option value="custom">Custom</option>
            {presetOptions.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.label}
              </option>
            ))}
          </select>
          <p style={{ fontSize: '0.85rem', color: '#678', margin: 0 }}>
            Selecting a preset updates the reveal, curl, tap, decay, and cascade size tunables.
          </p>
        </div>
        <div
          style={{
            marginTop: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}
        >
          <label htmlFor="dreamdust-json" style={labelStyle}>
            Preset JSON
          </label>
          <textarea
            id="dreamdust-json"
            value={presetJson}
            onChange={(event) => {
              setPresetJson(event.target.value)
            }}
            rows={6}
            style={{
              width: '100%',
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '0.85rem',
              padding: '0.5rem',
              borderRadius: '0.25rem',
              border: '1px solid #ccd4da',
              resize: 'vertical',
            }}
          />
          {presetError ? (
            <div style={{ color: '#b33', fontSize: '0.85rem' }}>{presetError}</div>
          ) : null}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={handleExport}
              style={{
                padding: '0.4rem 0.9rem',
                borderRadius: '0.25rem',
                border: '1px solid #ccd4da',
                background: '#f7f9fb',
                cursor: 'pointer',
              }}
            >
              Export
            </button>
            <button
              type="button"
              onClick={handleImport}
              style={{
                padding: '0.4rem 0.9rem',
                borderRadius: '0.25rem',
                border: '1px solid #ccd4da',
                background: '#f7f9fb',
                cursor: 'pointer',
              }}
            >
              Import
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}
