import type { Texture, WebGLRenderer, WebGLRenderTarget } from 'three'

type TextureHandle = {
  texture: Texture | null
  handle: WebGLTexture | null
}

type ReadTarget = {
  isWebGLRenderTarget: true
  width: number
  height: number
  texture: Texture | null
}

type RendererWithInternals = WebGLRenderer & {
  properties?: { get: (target: unknown) => Record<string, unknown> }
}

const GRID_SIZE = 8
const SAMPLE_INTERVAL_MS = 1000

const getNow = () => (typeof performance !== 'undefined' ? performance.now() : Date.now())

const detectSimTelemetryEnabled = () => {
  if (typeof window === 'undefined') {
    return false
  }
  try {
    const params = new URLSearchParams(window.location.search)
    if (params.get('engine') !== 'sim') {
      return false
    }
    return params.get('simStats') === '1'
  } catch {
    return false
  }
}

const createReadTarget = (): ReadTarget => ({
  isWebGLRenderTarget: true,
  width: 0,
  height: 0,
  texture: null,
})

export type SimTelemetryCollector = {
  sample: (
    framebuffer: WebGLFramebuffer | null,
    texture: TextureHandle | null,
    width: number,
    height: number,
  ) => void
  dispose: () => void
}

export const createSimTelemetryCollector = (renderer: WebGLRenderer): SimTelemetryCollector => {
  const enabled = detectSimTelemetryEnabled()
  if (!enabled) {
    return {
      sample: () => {},
      dispose: () => {},
    }
  }

  const internal = renderer as RendererWithInternals
  const readTarget = createReadTarget()
  const buffer = new Float32Array(4)
  const scratchSamples = new Array<number>(GRID_SIZE * GRID_SIZE)
  let lastSampleMs = 0

  const sample = (
    framebuffer: WebGLFramebuffer | null,
    textureHandle: TextureHandle | null,
    width: number,
    height: number,
  ) => {
    if (!framebuffer || !textureHandle || width <= 0 || height <= 0) {
      return
    }
    const now = getNow()
    if (now - lastSampleMs < SAMPLE_INTERVAL_MS) {
      return
    }
    lastSampleMs = now

    readTarget.width = width
    readTarget.height = height
    readTarget.texture = textureHandle.texture

    const props = internal.properties?.get(readTarget)
    if (props) {
      props.__webglFramebuffer = framebuffer
      props.__webglTexture = textureHandle.handle
    }

    let min = Infinity
    let max = -Infinity
    let sum = 0
    let finiteCount = 0
    let nanCount = 0
    let infCount = 0

    for (let yIndex = 0; yIndex < GRID_SIZE; yIndex += 1) {
      const v = GRID_SIZE === 1 ? 0.5 : yIndex / (GRID_SIZE - 1)
      const texY = Math.min(height - 1, Math.max(0, Math.round(v * (height - 1))))
      for (let xIndex = 0; xIndex < GRID_SIZE; xIndex += 1) {
        const u = GRID_SIZE === 1 ? 0.5 : xIndex / (GRID_SIZE - 1)
        const texX = Math.min(width - 1, Math.max(0, Math.round(u * (width - 1))))
        buffer.fill(0)
        try {
          renderer.readRenderTargetPixels(readTarget as unknown as WebGLRenderTarget, texX, texY, 1, 1, buffer)
        } catch {
          return
        }
        const length = Math.hypot(buffer[0] ?? 0, buffer[1] ?? 0, buffer[2] ?? 0)
        scratchSamples[yIndex * GRID_SIZE + xIndex] = length
        if (Number.isNaN(length)) {
          nanCount += 1
          continue
        }
        if (!Number.isFinite(length)) {
          infCount += 1
          continue
        }
        if (length < min) min = length
        if (length > max) max = length
        sum += length
        finiteCount += 1
      }
    }

    const avg = finiteCount > 0 ? sum / finiteCount : 0
    const payload = {
      min: finiteCount > 0 ? Number(min.toFixed(4)) : 0,
      max: finiteCount > 0 ? Number(max.toFixed(4)) : 0,
      avg: finiteCount > 0 ? Number(avg.toFixed(4)) : 0,
      nanCount,
      infCount,
      samples: scratchSamples.map((value) => {
        if (!Number.isFinite(value)) {
          return value
        }
        return Number(value.toFixed(4))
      }),
      texSize: [width, height] as [number, number],
      grid: GRID_SIZE,
    }
    console.info('[sim] metrics', payload)
  }

  return {
    sample,
    dispose: () => {
      readTarget.texture = null
    },
  }
}
