import * as THREE from 'three'
import type { BufferGeometry, Object3D, ShaderMaterial, WebGLRenderer } from 'three'

const SLOT_COUNT = 8
const SAMPLE_INTERVAL_MS = 750

const getNow = () => (typeof performance !== 'undefined' ? performance.now() : Date.now())

const formatNumber = (value: number) =>
  Number.isFinite(value) ? Number(value.toFixed(4)) : value

type UniformRecord = Record<string, { value: unknown } | undefined>

type CaptureArgs = {
  renderer: WebGLRenderer
  geometry: BufferGeometry
  object: Object3D
  material: ShaderMaterial
}

export type VertexTelemetryCollector = {
  capture: (args: CaptureArgs) => void
  dispose: () => void
}

const createTelemetryFragmentShader = () => `
  precision highp float;
  uniform float uDebugTelemetryMode;
  varying vec3 vDebugRevealPos;
  varying vec4 vDebugClipPos;
  varying float vDebugSampleSlot;
  void main() {
    if (vDebugSampleSlot < 0.0) {
      discard;
    }
    if (uDebugTelemetryMode < 0.5) {
      gl_FragColor = vec4(vDebugRevealPos, vDebugClipPos.w);
    } else {
      vec3 clipNdc = vDebugClipPos.xyz / max(1e-6, vDebugClipPos.w);
      gl_FragColor = vec4(clipNdc, vDebugClipPos.w);
    }
  }
`

const ensureUniforms = (
  source: ShaderMaterial,
  targetUniforms: UniformRecord,
  telemetryUniform: { value: number }
) => {
  const sourceUniforms = source.uniforms as UniformRecord
  for (const [key, value] of Object.entries(sourceUniforms)) {
    targetUniforms[key] = value
  }
  targetUniforms.uDebugTelemetryMode = telemetryUniform
}

export const createVertexTelemetryCollector = (): VertexTelemetryCollector => {
  let renderTarget: THREE.WebGLRenderTarget | null = null
  let scene: THREE.Scene | null = null
  let camera: THREE.OrthographicCamera | null = null
  let points: THREE.Points<BufferGeometry, ShaderMaterial> | null = null
  let telemetryMaterial: ShaderMaterial | null = null
  const telemetryUniform = { value: 0 }
  const revealBuffer = new Float32Array(SLOT_COUNT * 4)
  const clipBuffer = new Float32Array(SLOT_COUNT * 4)
  let lastSampleMs = 0

  const ensureResources = (
    geometry: BufferGeometry,
    object: Object3D | undefined,
    sourceMaterial: ShaderMaterial,
  ) => {
    if (!renderTarget) {
      renderTarget = new THREE.WebGLRenderTarget(SLOT_COUNT, 1, {
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
    if (!telemetryMaterial) {
      const uniforms: UniformRecord = {}
      telemetryMaterial = new THREE.ShaderMaterial({
        vertexShader: sourceMaterial.vertexShader,
        fragmentShader: createTelemetryFragmentShader(),
        uniforms: uniforms as Record<string, { value: unknown }>,
        depthTest: false,
        depthWrite: false,
        blending: THREE.NoBlending,
      })
      telemetryMaterial.defines = {
        ...sourceMaterial.defines,
        DEBUG_VERTEX_LOG: 1,
        VERTEX_TELEMETRY_PASS: 1,
      }
      ensureUniforms(sourceMaterial, telemetryMaterial.uniforms as UniformRecord, telemetryUniform)
      telemetryMaterial.uniformsNeedUpdate = true
    } else {
      telemetryMaterial.vertexShader = sourceMaterial.vertexShader
      telemetryMaterial.defines = {
        ...sourceMaterial.defines,
        DEBUG_VERTEX_LOG: 1,
        VERTEX_TELEMETRY_PASS: 1,
      }
      telemetryMaterial.needsUpdate = true
      ensureUniforms(sourceMaterial, telemetryMaterial.uniforms as UniformRecord, telemetryUniform)
      telemetryMaterial.uniformsNeedUpdate = true
    }
    if (!points) {
      points = new THREE.Points(geometry, telemetryMaterial)
      points.frustumCulled = false
      scene.add(points)
    } else {
      points.geometry = geometry
      points.material = telemetryMaterial
    }

    const sourceMatrix = object?.matrixWorld ?? points?.matrixWorld
    if (sourceMatrix?.elements) {
      points.matrixWorld.copy(sourceMatrix)
      ;(points as unknown as { matrixWorldNeedsUpdate?: boolean }).matrixWorldNeedsUpdate = false
    } else {
      points.matrixWorld.identity()
    }
  }

  const capture = ({ renderer, geometry, object, material }: CaptureArgs) => {
    if (!material?.defines?.DEBUG_VERTEX_LOG) {
      return
    }
    const now = getNow()
    if (now - lastSampleMs < SAMPLE_INTERVAL_MS) {
      return
    }
    lastSampleMs = now

    ensureResources(geometry, object, material)
    if (!renderTarget || !scene || !camera || !points || !telemetryMaterial) {
      return
    }

    const prevTarget = renderer.getRenderTarget()
    const prevViewport = new THREE.Vector4()
    renderer.getViewport(prevViewport)
    const prevScissor = new THREE.Vector4()
    renderer.getScissor(prevScissor)
    const prevScissorTest = renderer.getScissorTest()
    const prevAutoClear = renderer.autoClear

    try {
      renderer.setRenderTarget(renderTarget)
      renderer.setViewport(0, 0, SLOT_COUNT, 1)
      renderer.setScissorTest(false)
      renderer.autoClear = true

      telemetryUniform.value = 0
      renderer.clear()
      renderer.render(scene, camera)
      renderer.readRenderTargetPixels(renderTarget, 0, 0, SLOT_COUNT, 1, revealBuffer)

      telemetryUniform.value = 1
      renderer.clear()
      renderer.render(scene, camera)
      renderer.readRenderTargetPixels(renderTarget, 0, 0, SLOT_COUNT, 1, clipBuffer)
    } catch {
      renderer.setRenderTarget(prevTarget)
      renderer.setViewport(prevViewport.x, prevViewport.y, prevViewport.z, prevViewport.w)
      renderer.setScissor(prevScissor.x, prevScissor.y, prevScissor.z, prevScissor.w)
      renderer.setScissorTest(prevScissorTest)
      renderer.autoClear = prevAutoClear
      return
    }

    renderer.setRenderTarget(prevTarget)
    renderer.setViewport(prevViewport.x, prevViewport.y, prevViewport.z, prevViewport.w)
    renderer.setScissor(prevScissor.x, prevScissor.y, prevScissor.z, prevScissor.w)
    renderer.setScissorTest(prevScissorTest)
    renderer.autoClear = prevAutoClear

    const samples: Array<{
      slot: number
      revealPos: [number | typeof NaN, number | typeof NaN, number | typeof NaN]
      clipPos: { ndc: [number | typeof NaN, number | typeof NaN, number | typeof NaN]; w: number | typeof NaN }
    }> = []

    for (let slot = 0; slot < SLOT_COUNT; slot += 1) {
      const rOffset = slot * 4
      const cOffset = slot * 4
      const revealX = revealBuffer[rOffset]
      const revealY = revealBuffer[rOffset + 1]
      const revealZ = revealBuffer[rOffset + 2]
      const clipW = clipBuffer[cOffset + 3]

      if (
        revealX === 0 &&
        revealY === 0 &&
        revealZ === 0 &&
        clipBuffer[cOffset] === 0 &&
        clipBuffer[cOffset + 1] === 0 &&
        clipBuffer[cOffset + 2] === 0 &&
        clipW === 0
      ) {
        continue
      }

      samples.push({
        slot,
        revealPos: [formatNumber(revealX), formatNumber(revealY), formatNumber(revealZ)],
        clipPos: {
          ndc: [
            formatNumber(clipBuffer[cOffset]),
            formatNumber(clipBuffer[cOffset + 1]),
            formatNumber(clipBuffer[cOffset + 2]),
          ],
          w: formatNumber(clipW),
        },
      })
    }

    if (samples.length > 0) {
      console.info('[vertex] samples', samples)
    }
  }

  const collector: VertexTelemetryCollector = {
    capture,
    dispose: () => {
      renderTarget?.dispose()
      telemetryMaterial?.dispose()
      if (scene && points) {
        scene.remove(points)
      }
      renderTarget = null
      telemetryMaterial = null
      points = null
      if (typeof window !== 'undefined') {
        const global = window as any
        if (global.vertexTelemetry === collector) {
          global.vertexTelemetry = undefined
        }
      }
    },
  }

  if (typeof window !== 'undefined') {
    ;(window as any).vertexTelemetry = collector
  }

  return collector
}
