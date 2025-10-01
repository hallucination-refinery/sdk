import * as THREE from 'three'
import type { BufferGeometry, Object3D, ShaderMaterial, WebGLRenderer } from 'three'

const SLOT_COUNT = 8
const SAMPLE_INTERVAL_MS = 750

const getNow = () => (typeof performance !== 'undefined' ? performance.now() : Date.now())

const formatNumber = (value: number) => (Number.isFinite(value) ? Number(value.toFixed(4)) : value)

type UniformRecord = Record<string, { value: unknown } | undefined>

type CaptureArgs = {
  renderer: WebGLRenderer
  geometry: BufferGeometry
  object: Object3D
  material: ShaderMaterial
}

export type VertexTelemetryCollector = {
  capture: (args: CaptureArgs) => void
  captureFromGlobal: () => Promise<{ status: string; timestamp: number }>
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
  // Sticky flag to ignore pre-sim telemetry once a populated sim clone has been observed
  let seenSimTelemetry = false
  const telemetryUniform = { value: 0 }
  const revealBuffer = new Float32Array(SLOT_COUNT * 4)
  const clipBuffer = new Float32Array(SLOT_COUNT * 4)
  let lastSampleMs = 0

  const ensureResources = (
    sourceGeometry: BufferGeometry,
    object: Object3D | undefined,
    sourceMaterial: ShaderMaterial
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
    const telemetryGeometry = sourceGeometry.clone()
    const cloneSummary = {
      sourceUuid: sourceGeometry.uuid,
      cloneUuid: telemetryGeometry.uuid,
      sourceAttributes: {
        position: sourceGeometry.getAttribute('position')?.count ?? 0,
        color: sourceGeometry.getAttribute('color')?.count ?? 0,
        aSimUv: sourceGeometry.getAttribute('aSimUv')?.count ?? 0,
        aDepth: sourceGeometry.getAttribute('aDepth')?.count ?? 0,
        aUv: sourceGeometry.getAttribute('aUv')?.count ?? 0,
      },
    }

    const simAttribute = sourceGeometry.getAttribute('aSimUv') as THREE.BufferAttribute | undefined
    if (simAttribute) {
      telemetryGeometry.setAttribute(
        'aSimUv',
        simAttribute.clone() as unknown as THREE.BufferAttribute
      )
    }

    const depthAttribute = sourceGeometry.getAttribute('aDepth') as
      | THREE.BufferAttribute
      | undefined
    if (depthAttribute) {
      telemetryGeometry.setAttribute(
        'aDepth',
        depthAttribute.clone() as unknown as THREE.BufferAttribute
      )
    }

    const debugAttribute = sourceGeometry.getAttribute('aUv') as THREE.BufferAttribute | undefined
    if (debugAttribute) {
      telemetryGeometry.setAttribute(
        'aUv',
        debugAttribute.clone() as unknown as THREE.BufferAttribute
      )
    }

    const cloneCounts = {
      position: telemetryGeometry.getAttribute('position')?.count ?? 0,
      color: telemetryGeometry.getAttribute('color')?.count ?? 0,
      aSimUv: telemetryGeometry.getAttribute('aSimUv')?.count ?? 0,
      aDepth: telemetryGeometry.getAttribute('aDepth')?.count ?? 0,
      aUv: telemetryGeometry.getAttribute('aUv')?.count ?? 0,
    }

    console.info('[vertex] telemetry clone summary', {
      ...cloneSummary,
      cloneAttributes: cloneCounts,
    })

    if (!points) {
      points = new THREE.Points(telemetryGeometry, telemetryMaterial)
      points.frustumCulled = false
      scene.add(points)
    } else {
      points.geometry.dispose()
      points.geometry = telemetryGeometry
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

  const readAttributeCounts = (g: BufferGeometry | null | undefined) => {
    if (!g) {
      return {
        position: 0,
        color: 0,
        aSimUv: 0,
        aDepth: 0,
        aUv: 0,
      }
    }
    return {
      position: g.getAttribute ? g.getAttribute('position')?.count ?? 0 : 0,
      color: g.getAttribute ? g.getAttribute('color')?.count ?? 0 : 0,
      aSimUv: g.getAttribute ? g.getAttribute('aSimUv')?.count ?? 0 : 0,
      aDepth: g.getAttribute ? g.getAttribute('aDepth')?.count ?? 0 : 0,
      aUv: g.getAttribute ? g.getAttribute('aUv')?.count ?? 0 : 0,
    }
  }

  const capture = ({ renderer, geometry, object, material }: CaptureArgs) => {
    if (!material?.defines?.DEBUG_VERTEX_LOG) {
      console.info('[vertex] capture-debug', {
        stage: 'skip',
        reason: 'DEBUG_VERTEX_LOG missing',
      })
      return
    }
    const now = getNow()
    if (now - lastSampleMs < SAMPLE_INTERVAL_MS) {
      console.info('[vertex] capture-debug', {
        stage: 'throttle',
        reason: 'interval window',
        elapsed: Number((now - lastSampleMs).toFixed(2)),
      })
      return
    }
    lastSampleMs = now

    ensureResources(geometry, object, material)
    if (typeof window !== 'undefined') {
      ;(window as any).vertexTelemetry = collector
    }
    if (!renderTarget || !scene || !camera || !points || !telemetryMaterial) {
      console.warn('[vertex] capture-debug', {
        stage: 'ensureResources',
        reason: 'resource allocation failed',
        hasTarget: !!renderTarget,
        hasScene: !!scene,
        hasCamera: !!camera,
        hasPoints: !!points,
        hasMaterial: !!telemetryMaterial,
      })
      return
    }

    const telemetryGeometry = points.geometry as BufferGeometry | undefined
    const geometryAttributes = readAttributeCounts(geometry)
    const telemetryAttributes = readAttributeCounts(telemetryGeometry)
    const telemetryGeometryUuid = telemetryGeometry?.uuid ?? null
    console.info('[vertex] capture-debug', {
      stage: 'attributes',
      geometryUuid: geometry.uuid,
      telemetryGeometryUuid,
      geometryAttributes,
      debugDefines: {
        material: Object.keys(material.defines ?? {}),
        telemetry: Object.keys(telemetryMaterial.defines ?? {}),
      },
    })
    console.info('[vertex] capture-debug', {
      stage: 'telemetry-attributes',
      sourceGeometryUuid: geometry.uuid,
      telemetryGeometryUuid,
      sourceAttributes: geometryAttributes,
      telemetryAttributes,
    })

    // Promote sim telemetry once observed; thereafter ignore pre-sim entries in payload
    if (!seenSimTelemetry && telemetryAttributes.aSimUv > 0) {
      seenSimTelemetry = true
      console.info('[vertex] capture-debug', {
        stage: 'telemetry-promote',
        reason: 'sim telemetry observed',
        telemetryGeometryUuid,
        aSimUv: telemetryAttributes.aSimUv,
      })
    }

    if (geometryAttributes.aSimUv > 0 && telemetryAttributes.aSimUv === 0) {
      console.warn('[vertex] capture-debug', {
        stage: 'attributes-mismatch',
        reason: 'telemetry geometry dropped aSimUv that exists on source',
        source: geometryAttributes,
        telemetry: telemetryAttributes,
      })
    }

    // If we've seen sim telemetry, suppress captures when the current telemetry entry lacks aSimUv
    if (telemetryAttributes.aSimUv === 0 && seenSimTelemetry) {
      console.warn('[vertex] capture-debug', {
        stage: 'missing-attribute',
        reason: 'telemetry geometry has no aSimUv (sim already observed)',
        requiredAttributes: ['aSimUv', 'aDepth', 'aUv'],
        telemetry: telemetryAttributes,
      })
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

    console.info('[vertex] capture-debug', {
      stage: 'buffers',
      revealSample: Array.from(revealBuffer.slice(0, 8)),
      clipSample: Array.from(clipBuffer.slice(0, 8)),
    })

    const samples: Array<{
      slot: number
      revealPos: [number | typeof NaN, number | typeof NaN, number | typeof NaN]
      clipPos: {
        ndc: [number | typeof NaN, number | typeof NaN, number | typeof NaN]
        w: number | typeof NaN
      }
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
    } else {
      console.info('[vertex] capture-debug', {
        stage: 'samples',
        reason: 'zero samples',
        revealBufferZeroCount: revealBuffer.reduce((acc, value) => acc + (value === 0 ? 1 : 0), 0),
        clipBufferZeroCount: clipBuffer.reduce((acc, value) => acc + (value === 0 ? 1 : 0), 0),
      })
    }
  }

  const captureFromGlobal = async () => {
    const args = typeof window !== 'undefined' ? (window as any).__vertexCaptureArgs : null
    if (!args) {
      throw new Error('No render has occurred yet - capture args not available')
    }
    capture(args)
    return { status: 'ok', timestamp: Date.now() }
  }

  const collector: VertexTelemetryCollector = {
    capture,
    captureFromGlobal,
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
