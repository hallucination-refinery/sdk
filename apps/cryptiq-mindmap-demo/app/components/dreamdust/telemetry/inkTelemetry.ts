import * as THREE from 'three'
import type { WebGLRenderer } from 'three'

type UniformRecord = Record<string, { value: unknown } | undefined>

const SAMPLE_INTERVAL_MS = 1000
const getNow = () => (typeof performance !== 'undefined' ? performance.now() : Date.now())

const detectInkTelemetryEnabled = () => {
  if (typeof window === 'undefined') {
    return false
  }
  try {
    const params = new URLSearchParams(window.location.search)
    if (params.get('engine') !== 'sim') {
      return false
    }
    return params.get('inkStats') === '1'
  } catch {
    return false
  }
}

const clamp01 = (value: number) => {
  if (!Number.isFinite(value)) return 0
  if (value <= 0) return 0
  if (value >= 1) return 1
  return value
}

const resolveNumber = (value: unknown, fallback: number) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }
  if (typeof value === 'object' && value && 'value' in (value as Record<string, unknown>)) {
    return resolveNumber((value as { value: unknown }).value, fallback)
  }
  return fallback
}

const makeVectorUniform = () => [new THREE.Vector4(), new THREE.Vector4(), new THREE.Vector4(), new THREE.Vector4()]

export type InkTelemetryCollector = {
  capture: (renderer: WebGLRenderer, uniforms: UniformRecord) => void
  dispose: () => void
  getTarget: () => THREE.WebGLRenderTarget | null
}

export const createInkTelemetryCollector = (): InkTelemetryCollector => {
  const enabled = detectInkTelemetryEnabled()
  if (!enabled) {
    return {
      capture: () => {},
      dispose: () => {},
      getTarget: () => null,
    }
  }

  let renderTarget: THREE.WebGLRenderTarget | null = null
  let scene: THREE.Scene | null = null
  let camera: THREE.OrthographicCamera | null = null
  let blitMaterial: THREE.ShaderMaterial | null = null
  let quad: THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial> | null = null
  let metricsUniform: { value: THREE.Vector4[] } | null = null
  const readBuffer = new Float32Array(4 * 4)
  let lastSampleMs = 0

  const ensureResources = () => {
    if (!renderTarget) {
      renderTarget = new THREE.WebGLRenderTarget(4, 1, {
        type: THREE.FloatType,
        format: THREE.RGBAFormat,
        depthBuffer: false,
        stencilBuffer: false,
      })
    }
    if (!scene) {
      scene = new THREE.Scene()
    }
    if (!camera) {
      camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    }
    if (!metricsUniform) {
      metricsUniform = { value: makeVectorUniform() }
    }
    if (!blitMaterial) {
      blitMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uMetrics: metricsUniform,
        },
        vertexShader: `
          precision highp float;
          attribute vec3 position;
          void main() {
            gl_Position = vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          precision highp float;
          uniform vec4 uMetrics[4];
          void main() {
            int idx = clamp(int(floor(gl_FragCoord.x)), 0, 3);
            gl_FragColor = uMetrics[idx];
          }
        `,
        depthTest: false,
        depthWrite: false,
        blending: THREE.NoBlending,
      })
      quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), blitMaterial)
      scene!.add(quad)
    }
  }

  const updateMetrics = (uniforms: UniformRecord) => {
    if (!metricsUniform) {
      return
    }
    const vecs = metricsUniform.value
    const get = (key: string, fallback: number) => resolveNumber(uniforms[key]?.value ?? uniforms[key], fallback)

    const reveal = clamp01(get('uReveal', 0))
    const alphaFloor = clamp01(get('uAlphaFloor', 0.06))
    const pointBaseSize = get('uPointBaseSize', 1)
    const focal = Math.max(1e-3, get('uFocal', 1))
    const minSize = get('uMinSize', 0)
    const maxSize = get('uMaxSize', 4)
    const breath = get('uBreath', 0.5)
    const cascade = clamp01(get('uCascade', 0))
    const cascadeBoost = Math.max(0, get('uCascadeSizeBoost', 0))

    const viewDist = focal
    let attenuation = focal / Math.max(1e-3, viewDist)
    attenuation = Math.max(minSize, Math.min(maxSize, attenuation))
    const breathPhase = (breath - 0.5) * 2
    const breathScale = 1 + breathPhase * 0.06
    const cascadeSize = cascade * cascadeBoost
    const pointSize = pointBaseSize * attenuation * breathScale * (1 + cascadeSize)

    const spriteAlpha = 0.85
    const spriteMix = alphaFloor + (1 - alphaFloor) * spriteAlpha
    const revealStrength = reveal
    const alphaPre = spriteMix * revealStrength * Math.max(revealStrength, revealStrength * 0.4)

    vecs[0].set(pointSize, alphaPre, revealStrength, 1)
    vecs[1].set(0, 0, 0, 0)
    vecs[2].set(0, 0, 0, 0)
    vecs[3].set(0, 0, 0, 0)
  }

  const capture = (renderer: WebGLRenderer, uniforms: UniformRecord) => {
    const now = getNow()
    if (now - lastSampleMs < SAMPLE_INTERVAL_MS) {
      return
    }
    lastSampleMs = now

    ensureResources()
    if (!renderTarget || !scene || !camera || !blitMaterial || !metricsUniform) {
      return
    }

    updateMetrics(uniforms)

    const prevTarget = renderer.getRenderTarget()
    const prevViewport = new THREE.Vector4()
    renderer.getViewport(prevViewport)
    const prevScissor = new THREE.Vector4()
    renderer.getScissor(prevScissor)
    const prevScissorTest = renderer.getScissorTest()
    const prevAutoClear = renderer.autoClear

    renderer.setRenderTarget(renderTarget)
    renderer.setViewport(0, 0, 4, 1)
    renderer.setScissorTest(false)
    renderer.autoClear = true
    renderer.clear()
    renderer.render(scene, camera)
    renderer.setRenderTarget(prevTarget)
    renderer.setViewport(prevViewport.x, prevViewport.y, prevViewport.z, prevViewport.w)
    renderer.setScissor(prevScissor.x, prevScissor.y, prevScissor.z, prevScissor.w)
    renderer.setScissorTest(prevScissorTest)
    renderer.autoClear = prevAutoClear

    try {
      renderer.readRenderTargetPixels(renderTarget, 0, 0, 4, 1, readBuffer)
    } catch {
      return
    }

    const pointSize = readBuffer[0]
    const alphaPre = readBuffer[1]
    const revealStrength = readBuffer[2]
    const format = (value: number) => (Number.isFinite(value) ? Number(value.toFixed(4)) : value)
    console.info('[ink] point-stats', {
      size: format(pointSize),
      alpha: format(alphaPre),
      reveal: format(revealStrength),
    })
  }

  const dispose = () => {
    if (renderTarget) {
      renderTarget.dispose()
      renderTarget = null
    }
    if (blitMaterial) {
      blitMaterial.dispose()
      blitMaterial = null
    }
    if (quad) {
      quad.geometry.dispose()
      quad = null
    }
    scene = null
    camera = null
    metricsUniform = null
  }

  return {
    capture,
    dispose,
    getTarget: () => renderTarget,
  }
}
