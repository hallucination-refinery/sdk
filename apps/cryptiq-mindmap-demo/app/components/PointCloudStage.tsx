'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as React from 'react'
// three types are optional in this workspace; import at runtime only
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as THREE from 'three'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { applyPerspectiveCover, applyPerspectiveFit, depthNormScaleFromRadius } from './anim/camera'
import { createDreamdustMaterial } from './dreamdust/DreamdustMaterial'
import { getDebugFlags } from './dreamdust/debug/getDebugFlags'
import { useDebugControls } from './dreamdust/debug/useDebugControls'
import { getDreamdustCaps, type DreamdustRuntimeCaps } from './dreamdust/capabilities'
import { useDreamdustCtx } from './dreamdust/context'
import {
  ackDreamdustCapsFanout,
  getDreamdustTunables,
  logOnce,
  subscribeDreamdustTunables,
  type DreamdustTunables,
} from './dreamdust/metrics'
import InkSurface from './dreamdust/InkSurface'
import { DEFAULT_POINT_SIZING, useDreamdustUniforms } from './dreamdust/useDreamdustUniforms'
import { PresetAiry } from './dreamdust/presets'
import {
  capInstances,
  clampDPR,
  decimateInterleaved,
  detectMobile,
  pointCap,
} from './pointcloud/budget'
import { ParticleSim } from './dreamdust/sim/ParticleSim'
import DebugHud from './dreamdust/ui/DebugHud'

type PointCloudStageProps = {
  sceneId?: string
  colorUrl?: string
  depthUrl?: string
  depthRgUrl?: string
  zScale?: number
  pointSize?: number
  stride?: number
  perspective?: boolean
}

type DreamdustStageUniforms = ReturnType<typeof useDreamdustUniforms>['uniforms'] & {
  uBaseSize: { value: number }
  uDepthMin: { value: number }
  uDepthMax: { value: number }
  uGamma: { value: number }
  uInvertDepth: { value: number }
  uPVInvCapture: { value: THREE.Matrix4 }
  uHasCapture: { value: number }
  uZNearNdc: { value: number }
  uZFarNdc: { value: number }
  uInkOffsetGain: { value: number }
  uInkSizeGain: { value: number }
  uInkTintGain: { value: number }
  uSimPositionTex?: { value: THREE.DataTexture | null }
  uSimColorTex?: { value: THREE.DataTexture | null }
}

type DreamdustStageUniformsWithReveal = DreamdustStageUniforms & {
  uReveal?: { value: number }
}

type StageSimState = {
  key: string
  count: number
  texSize: [number, number]
  simUvs: Float32Array
  stageUvs: Float32Array
  stageDepths: Float32Array
  positions: Float32Array
  bounds: { center: THREE.Vector3; radius: number }
}

const BLOOM_SETTINGS = {
  strength: 0.2,
  radius: 0.4,
  threshold: 0.8,
} as const

type NavigatorWithPowerHints = Navigator & {
  deviceMemory?: number
  connection?: {
    saveData?: boolean
    effectiveType?: string
  }
}

function isLowPowerDevice(): boolean {
  if (typeof navigator === 'undefined') {
    return false
  }

  const nav = navigator as NavigatorWithPowerHints

  try {
    const connection = nav.connection
    if (connection) {
      if (connection.saveData) {
        return true
      }
      const effectiveType = connection.effectiveType
      if (typeof effectiveType === 'string' && /(slow-2g|2g|3g)/i.test(effectiveType)) {
        return true
      }
    }
  } catch {
    // Ignore connection feature detection errors.
  }

  if (
    typeof nav.hardwareConcurrency === 'number' &&
    Number.isFinite(nav.hardwareConcurrency) &&
    nav.hardwareConcurrency > 0 &&
    nav.hardwareConcurrency <= 4
  ) {
    return true
  }

  const deviceMemory = nav.deviceMemory
  if (
    typeof deviceMemory === 'number' &&
    Number.isFinite(deviceMemory) &&
    deviceMemory > 0 &&
    deviceMemory <= 4
  ) {
    return true
  }

  return detectMobile()
}

function readNoBloomOverride(): boolean {
  if (typeof window === 'undefined') {
    return false
  }
  try {
    const params = new URLSearchParams(window.location.search)
    return params.get('noBloom') === '1'
  } catch {
    return false
  }
}

function readForceBloomOverride(): boolean {
  if (typeof window === 'undefined') {
    return false
  }
  try {
    const params = new URLSearchParams(window.location.search)
    return params.get('forceBloom') === '1'
  } catch {
    return false
  }
}

function readEnvValue(key: string): string | undefined {
  if (typeof process === 'undefined') {
    return undefined
  }
  const env = process.env as Record<string, string | undefined> | undefined
  return env?.[key]
}

function readSearchParamSafe(name: string): string | null {
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

function readNumberOverride(queryKey: string, envKey?: string): number | null {
  const queryValue = readSearchParamSafe(queryKey)
  if (queryValue !== null) {
    const parsed = Number(queryValue)
    if (Number.isFinite(parsed)) {
      return parsed
    }
  }
  if (envKey) {
    const envValue = readEnvValue(envKey)
    if (typeof envValue === 'string') {
      const parsed = Number(envValue)
      if (Number.isFinite(parsed)) {
        return parsed
      }
    }
  }
  return null
}

const FOV_QUERY_KEY = 'fov'
const FOV_ENV_KEY = 'DD_FOV'

function readFovOverride(): number | null {
  return readNumberOverride(FOV_QUERY_KEY, FOV_ENV_KEY)
}

function clampFovDeg(value: number): number {
  if (!Number.isFinite(value)) {
    return 27
  }
  if (value < 10) {
    return 10
  }
  if (value > 100) {
    return 100
  }
  return value
}

function useOptionalDreamdustCtx() {
  try {
    return useDreamdustCtx()
  } catch {
    return null
  }
}

type AssetStatus = 'idle' | 'loading' | 'ready' | 'error'

function useImageData(url: string | null): {
  data: ImageData | null
  width: number
  height: number
  status: AssetStatus
} {
  const [state, setState] = React.useState<{
    data: ImageData | null
    width: number
    height: number
    status: AssetStatus
  }>({
    data: null,
    width: 0,
    height: 0,
    status: 'idle',
  })

  React.useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (!url) {
        setState({ data: null, width: 0, height: 0, status: 'idle' })
        return
      }
      setState({ data: null, width: 0, height: 0, status: 'loading' })
      try {
        const res = await fetch(url, { cache: 'force-cache' })
        if (!res.ok) throw new Error(`Failed to fetch ${url}`)
        const blob = await res.blob()
        const img = await createImageBitmap(blob)
        if (cancelled) return
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d', { willReadFrequently: true })
        if (!ctx) return
        ctx.drawImage(img, 0, 0)
        const imageData = ctx.getImageData(0, 0, img.width, img.height)
        setState({ data: imageData, width: img.width, height: img.height, status: 'ready' })
      } catch {
        if (!cancelled) setState({ data: null, width: 0, height: 0, status: 'error' })
      }
    })()
    return () => {
      cancelled = true
    }
  }, [url])

  return state
}

// Load RG-packed depth (R=hi, G=lo) and reconstruct to Uint16Array
function usePackedDepth(url: string | null): {
  data16: Uint16Array | null
  width: number
  height: number
  status: AssetStatus
} {
  const [state, setState] = React.useState<{
    data16: Uint16Array | null
    width: number
    height: number
    status: AssetStatus
  }>({ data16: null, width: 0, height: 0, status: 'idle' })

  React.useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (!url) {
        setState({ data16: null, width: 0, height: 0, status: 'idle' })
        return
      }
      setState({ data16: null, width: 0, height: 0, status: 'loading' })
      try {
        const res = await fetch(url, { cache: 'force-cache' })
        if (!res.ok) throw new Error(`Failed to fetch ${url}`)
        const blob = await res.blob()
        const img = await createImageBitmap(blob)
        if (cancelled) return
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d', { willReadFrequently: true })
        if (!ctx) throw new Error('2D context unavailable')
        ctx.drawImage(img, 0, 0)
        const imageData = ctx.getImageData(0, 0, img.width, img.height)
        const src = imageData.data
        const out = new Uint16Array(img.width * img.height)
        for (let i = 0, p = 0; p < out.length; i += 4, p++) {
          const hi = src[i]
          const lo = src[i + 1]
          out[p] = (hi << 8) | lo
        }
        setState({ data16: out, width: img.width, height: img.height, status: 'ready' })
      } catch {
        if (!cancelled) setState({ data16: null, width: 0, height: 0, status: 'error' })
      }
    })()
    return () => {
      cancelled = true
    }
  }, [url])

  return state
}

// Shared attribute builder with robust indexing and one-time logging
function buildAttributes(
  colorImage: { data: ImageData; width: number; height: number },
  depth16: { data16: Uint16Array; width: number; height: number },
  stride: number,
  cap: number
) {
  const cw = colorImage.width
  const ch = colorImage.height
  const dw = depth16.width
  const dh = depth16.height
  const w = Math.min(cw, dw)
  const h = Math.min(ch, dh)
  const col = colorImage.data.data
  const dep16 = depth16.data16

  const xs: number[] = []
  const us: number[] = []
  const ds: number[] = []
  const cs: number[] = []
  let minDepth01 = 1.0
  let maxDepth01 = 0.0

  const hash = (x: number, y: number) => {
    const s = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453
    return s - Math.floor(s)
  }

  const safeStride = Math.max(1, Math.floor(stride))
  const cellsX = Math.max(1, Math.ceil(w / safeStride))
  const cellsY = Math.max(1, Math.ceil(h / safeStride))
  const totalCandidates = cellsX * cellsY
  const maxPoints = Math.max(0, Math.floor(cap))
  const keepRatio = Math.min(1, maxPoints / Math.max(1, totalCandidates))
  const [denomX, denomY] = [Math.max(1, w - 1), Math.max(1, h - 1)]
  const [maxColorX, maxColorY] = [Math.max(0, cw - 1), Math.max(0, ch - 1)]
  const [maxDepthX, maxDepthY] = [Math.max(0, dw - 1), Math.max(0, dh - 1)]

  let kept = 0

  const rowPhase = cellsY > 0 ? Math.floor(hash(cellsX + 0.5, cellsY + 0.25) * cellsY) % cellsY : 0

  const sampleCells = (forceKeep: boolean) => {
    for (let rowIter = 0; rowIter < cellsY; rowIter++) {
      const cellY = (rowIter + rowPhase) % cellsY
      const baseY = cellY * safeStride
      const cellHeight = Math.min(safeStride, h - baseY)
      if (cellHeight <= 0) continue

      const rowSeed = hash(cellY + 0.5, (cellY + 1) * 1.41421356237)
      const yOffset = Math.min(cellHeight - 1, Math.floor(rowSeed * cellHeight))
      const sampleY = baseY + yOffset
      const yNorm = sampleY / denomY
      const colorY = Math.round(yNorm * maxColorY)
      const depthY = Math.round(yNorm * maxDepthY)
      const phaseX = cellsX > 0 ? Math.floor(rowSeed * cellsX) % cellsX : 0

      for (let colIter = 0; colIter < cellsX; colIter++) {
        const cellX = (colIter + phaseX) % cellsX
        const baseX = cellX * safeStride
        const cellWidth = Math.min(safeStride, w - baseX)
        if (cellWidth <= 0) continue

        const jitterSeed = hash(cellX + 0.5 + rowSeed * 3.1, cellY + 0.5 + rowSeed * 1.7)
        const xOffset = Math.min(cellWidth - 1, Math.floor(jitterSeed * cellWidth))
        const sampleX = baseX + xOffset
        const xNorm = sampleX / denomX
        const colorX = Math.round(xNorm * maxColorX)
        const depthX = Math.round(xNorm * maxDepthX)

        const pColor = colorY * cw + colorX
        const pDepth = depthY * dw + depthX
        const d01 = dep16[pDepth] / 65535.0
        if (d01 < minDepth01) minDepth01 = d01
        if (d01 > maxDepth01) maxDepth01 = d01

        const r = col[pColor * 4] / 255.0
        const g = col[pColor * 4 + 1] / 255.0
        const b = col[pColor * 4 + 2] / 255.0
        const luma = 0.299 * r + 0.587 * g + 0.114 * b

        if (!forceKeep) {
          const near = 1.0 - d01
          const keep = (0.45 + 0.35 * near + 0.2 * (1.0 - luma)) * keepRatio
          const dropSeed = hash(
            sampleX + rowSeed * 17.0 + cellX * 0.13,
            sampleY + rowSeed * 13.0 + cellY * 0.17
          )
          if (dropSeed > keep) continue
        }
        us.push(xNorm, yNorm)
        ds.push(d01)
        xs.push(0, 0, 0)
        cs.push(r, g, b)
        kept++
      }
    }
  }

  if (maxPoints > 0) {
    sampleCells(false)

    if (kept < 100 && keepRatio < 1) {
      xs.length = 0
      us.length = 0
      ds.length = 0
      cs.length = 0
      kept = 0
      minDepth01 = 1.0
      maxDepth01 = 0.0
      sampleCells(true)
    }
  }

  console.log(
    `[PC] build: color ${cw}x${ch} depth ${dw}x${dh} → grid ${w}x${h} stride=${safeStride} cap=${maxPoints} cells=${cellsX}x${cellsY} candidates=${totalCandidates} kept=${kept} | uvs=${us.length / 2} depths=${ds.length} colors=${cs.length / 3} | depth01[min,max]=[${minDepth01.toFixed(4)},${maxDepth01.toFixed(4)}]`
  )

  return {
    positions: new Float32Array(xs),
    uvs: new Float32Array(us),
    depths: new Float32Array(ds),
    colors: new Float32Array(cs),
    gridW: w,
    gridH: h,
    kept,
  }
}

function PointsMesh({
  colorImage,
  depth16,
  stride = 2,
  pointBudget,
  material,
  uniforms,
  onMaterialValid,
  onInstancesReady,
}: {
  colorImage: { data: ImageData; width: number; height: number }
  depth16: { data16: Uint16Array; width: number; height: number }
  stride?: number
  pointBudget: number
  material: THREE.ShaderMaterial
  uniforms: DreamdustStageUniforms
  onMaterialValid?: () => void
  onInstancesReady?: (count: number) => void
}) {
  const geomRef = React.useRef<THREE.BufferGeometry | null>(null)
  const materialRef = React.useRef<THREE.ShaderMaterial | null>(material)
  const materialValidRef = React.useRef(false)
  const programWaitLoggedRef = React.useRef(false)
  const compileWatchdogLoggedRef = React.useRef(false)
  const fallbackPoints = React.useMemo(
    () =>
      new THREE.PointsMaterial({
        size: 2.0,
        sizeAttenuation: true,
        vertexColors: true,
        transparent: true,
        depthWrite: false,
      }),
    []
  )
  const [useFallback, setUseFallback] = React.useState(false)

  React.useEffect(() => {
    return () => {
      try {
        fallbackPoints.dispose()
      } catch {
        /* noop */
      }
    }
  }, [fallbackPoints])

  const { positions, uvs, depths, colors, gridW, gridH, kept } = React.useMemo(() => {
    return buildAttributes(colorImage, depth16, stride, pointBudget)
  }, [colorImage, depth16, stride, pointBudget])

  React.useEffect(() => {
    if (onInstancesReady) onInstancesReady(kept)
  }, [kept, onInstancesReady])

  const planePositions = React.useMemo(() => {
    const n = uvs.length / 2
    const out = new Float32Array(n * 3)
    const heightUnits = 1000
    const widthUnits = heightUnits * (gridW / Math.max(1, gridH))
    for (let i = 0; i < n; i++) {
      const u = uvs[i * 2]
      const v = uvs[i * 2 + 1]
      out[i * 3 + 0] = (u - 0.5) * widthUnits
      out[i * 3 + 1] = -(v - 0.5) * heightUnits
      out[i * 3 + 2] = 0
    }
    return out
  }, [uvs, gridW, gridH])

  React.useEffect(() => {
    materialRef.current = material
    materialValidRef.current = false
    programWaitLoggedRef.current = false
    compileWatchdogLoggedRef.current = false
    setUseFallback(false)
    return () => {
      materialValidRef.current = false
    }
  }, [material])

  React.useEffect(() => {
    const g = geomRef.current
    if (!g) return
    if (typeof g.computeBoundingSphere === 'function') g.computeBoundingSphere()
  }, [positions, colors])
  const loggedAttrsRef = React.useRef(false)
  React.useEffect(() => {
    if (loggedAttrsRef.current) return
    const g = geomRef.current
    if (!g) return
    const stat = (name: string) => {
      const a = g.getAttribute(name) as THREE.BufferAttribute | undefined
      return a ? { itemSize: a.itemSize, count: a.count } : null
    }
    console.log('[PC] attrs', {
      aUv: stat('aUv'),
      uv: stat('uv'),
      position: stat('position'),
      color: stat('color'),
    })
    loggedAttrsRef.current = true
  }, [])

  React.useEffect(() => {
    if (!onMaterialValid || useFallback) return
    let raf = 0
    const check = () => {
      const m = materialRef.current as unknown as { program?: { glProgram?: unknown } }
      if (m && m.program && m.program.glProgram) {
        if (!materialValidRef.current) {
          materialValidRef.current = true
          onMaterialValid()
        }
        return
      }
      if (!materialValidRef.current && !programWaitLoggedRef.current) {
        // Guard log to surface shader-compile stalls early during bring-up
        try {
          console.warn('[PC] material program not ready yet; waiting…')
        } catch {
          /* noop */
        }
        programWaitLoggedRef.current = true
      }
      raf = requestAnimationFrame(check)
    }
    raf = requestAnimationFrame(check)
    return () => cancelAnimationFrame(raf)
  }, [onMaterialValid, useFallback])

  React.useEffect(() => {
    if (useFallback) {
      return
    }

    let raf = 0
    let frames = 0
    let active = true
    const MAX_FRAMES = 180

    const stop = () => {
      if (!active) return
      active = false
      if (raf) {
        cancelAnimationFrame(raf)
        raf = 0
      }
    }

    const step = () => {
      if (!active) {
        return
      }

      const m = materialRef.current as unknown as { program?: { glProgram?: unknown } }
      if (m && m.program && m.program.glProgram) {
        stop()
        return
      }

      frames += 1
      if (frames >= MAX_FRAMES) {
        if (!compileWatchdogLoggedRef.current) {
          compileWatchdogLoggedRef.current = true
          try {
            console.log('[Dreamdust] compile timeout — falling back to PointsMaterial')
          } catch {
            /* noop */
          }
        }
        setUseFallback(true)
        stop()
        return
      }

      raf = requestAnimationFrame(step)
    }

    raf = requestAnimationFrame(step)

    return () => {
      active = false
      if (raf) {
        cancelAnimationFrame(raf)
        raf = 0
      }
    }
  }, [useFallback])

  const capturedRef = React.useRef(false)
  const captureDelayRef = React.useRef(2)

  React.useEffect(() => {
    capturedRef.current = false
    captureDelayRef.current = 2
    if (uniforms.uHasCapture) {
      uniforms.uHasCapture.value = 0
    }
  }, [uniforms, positions])

  useFrame(({ camera }) => {
    if (capturedRef.current) return
    if (captureDelayRef.current > 0) {
      captureDelayRef.current -= 1
      return
    }
    const pvUniform = uniforms.uPVInvCapture
    const hasCaptureUniform = uniforms.uHasCapture
    if (!pvUniform || !hasCaptureUniform) return
    const pvInv = new THREE.Matrix4()
      .copy((camera as THREE.PerspectiveCamera).matrixWorld)
      .multiply((camera as THREE.PerspectiveCamera).projectionMatrixInverse)
    pvUniform.value.copy(pvInv)
    hasCaptureUniform.value = 1
    capturedRef.current = true
    console.log('[PC] captured PV^-1 (delayed)')
  })

  return (
    <points frustumCulled={false} renderOrder={1}>
      <bufferGeometry ref={geomRef}>
        {/* position attribute (CPU baseline plane) */}
        <bufferAttribute attach="attributes-position" args={[planePositions, 3]} />
        {/* uv and depth attributes for shader unprojection */}
        {/** @ts-expect-error attachObject is supported at runtime */}
        <bufferAttribute attachObject={['attributes', 'aUv']} args={[uvs, 2]} />
        {/* also bind built-in uv for isolation tests */}
        <bufferAttribute attach="attributes-uv" args={[uvs, 2]} />
        {/* custom float attribute for normalized depth */}
        {/** @ts-expect-error attachObject is supported at runtime */}
        <bufferAttribute attachObject={['attributes', 'aDepth']} args={[depths, 1]} />
        {/* color attribute */}
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <primitive object={useFallback ? fallbackPoints : material} attach="material" />
    </points>
  )
}

function BloomPass({
  strength = 0.18,
  radius = 0.12,
  threshold = 0.65,
}: {
  strength?: number
  radius?: number
  threshold?: number
}) {
  const { gl, scene, camera, size } = useThree()
  const composerRef = React.useRef<EffectComposer | null>(null)
  React.useEffect(() => {
    const comp = new EffectComposer(gl)
    const rp = new RenderPass(scene, camera)
    const bloom = new UnrealBloomPass(undefined, strength, radius, threshold)
    comp.addPass(rp)
    comp.addPass(bloom)
    // ensure the last pass renders to screen when enabled
    ;(bloom as unknown as { renderToScreen?: boolean }).renderToScreen = true
    composerRef.current = comp
    return () => {
      try {
        comp.dispose()
      } catch {
        /* noop */
      }
      composerRef.current = null
    }
  }, [gl, scene, camera, strength, radius, threshold])
  React.useEffect(() => {
    const comp = composerRef.current
    if (!comp) return
    const rendererDpr =
      typeof gl.getPixelRatio === 'function'
        ? gl.getPixelRatio()
        : typeof window !== 'undefined' && typeof window.devicePixelRatio === 'number'
          ? window.devicePixelRatio
          : 1
    const scale = rendererDpr > 1.6 ? 0.75 : 1
    comp.setSize(size.width * scale, size.height * scale)
  }, [gl, size.width, size.height])
  useFrame(() => {
    if (composerRef.current) composerRef.current.render()
  }, 1)
  return null
}

function DreamdustTicker({ tick }: { tick?: (state: unknown, delta: number) => void }) {
  const tickRef = React.useRef<typeof tick>()
  React.useEffect(() => {
    tickRef.current = tick
  }, [tick])

  useFrame((state, delta) => {
    const fn = tickRef.current
    if (typeof fn === 'function') {
      fn(state, delta)
    }
  })

  return null
}

function SimDriver({
  simRef,
  active,
  uniforms,
  material,
}: {
  simRef: React.MutableRefObject<ParticleSim | null>
  active: boolean
  uniforms: DreamdustStageUniforms
  material: THREE.ShaderMaterial | null
}) {
  useFrame((_, delta) => {
    const sim = simRef.current
    if (!active || !sim) return
    sim.update(delta)
    const posTex = sim.getPositionTexture()
    const colorTex = sim.getColorTexture()
    if (uniforms.uSimPositionTex && uniforms.uSimPositionTex.value !== posTex) {
      uniforms.uSimPositionTex.value = posTex
    }
    if (uniforms.uSimColorTex && uniforms.uSimColorTex.value !== colorTex) {
      uniforms.uSimColorTex.value = colorTex
    }
    if (material) {
      const matUniforms = material.uniforms as Record<string, { value: unknown }>
      if (matUniforms.uSimPositionTex && matUniforms.uSimPositionTex.value !== posTex) {
        matUniforms.uSimPositionTex.value = posTex
      }
      if (matUniforms.uSimColorTex && matUniforms.uSimColorTex.value !== colorTex) {
        matUniforms.uSimColorTex.value = colorTex
      }
    }
  })
  return null
}

function SceneControls({ radius, drawing = false }: { radius?: number; drawing?: boolean }) {
  const controlsRef = React.useRef(null)
  const { gl } = useThree()
  React.useEffect(() => {
    console.log('[PC] attach controls to', gl.domElement)
  }, [gl])
  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableRotate={!drawing}
      enableZoom={!drawing}
      enablePan={!drawing}
      enableDamping
      dampingFactor={0.1}
      minDistance={Math.max(0.1, radius ? radius * 0.02 : 100)}
      maxDistance={radius ? Math.max(500, radius * 10) : 5000}
      target={[0, 0, 0]}
      rotateSpeed={0.8}
      zoomSpeed={0.6}
      mouseButtons={{
        LEFT: (THREE as any).MOUSE.ROTATE,
        MIDDLE: (THREE as any).MOUSE.DOLLY,
        RIGHT: (THREE as any).MOUSE.PAN,
      }}
      onStart={() => console.log('[PC] controls start')}
    />
  )
}

/* function FitOrtho({
  contentWidth,
  contentHeight,
  margin = 0.98,
}: {
  contentWidth: number
  contentHeight: number
  margin?: number
}) {
  const { camera, size } = useThree()
  React.useEffect(() => {
    const ortho = camera as {
      isOrthographicCamera?: boolean
      zoom?: number
      updateProjectionMatrix?: () => void
      position?: { set?: (x: number, y: number, z: number) => void }
    }
    if (!ortho || !ortho.isOrthographicCamera) return
    const zx = size.width / contentWidth
    const zy = size.height / contentHeight
    const zoom = Math.min(zx, zy) * margin
    if (typeof ortho.zoom === 'number') ortho.zoom = zoom
    if (typeof ortho.updateProjectionMatrix === 'function') ortho.updateProjectionMatrix()
    if (ortho.position && typeof ortho.position.set === 'function') ortho.position.set(0, 0, 1000)
  }, [camera, size.width, size.height, contentWidth, contentHeight, margin])
  return null
} */

export default function PointCloudStage(props: PointCloudStageProps) {
  const {
    sceneId,
    colorUrl: colorUrlProp,
    depthUrl: depthUrlProp,
    depthRgUrl,
    pointSize = DEFAULT_POINT_SIZING.baseSize,
    stride = 1,
    // omit perspective in baseline
  } = props
  const [bloomEnabled, setBloomEnabled] = React.useState(false)
  const [noBloomOverride] = React.useState(readNoBloomOverride)
  const [forceBloomOverride] = React.useState(readForceBloomOverride)
  const [bloomEligible, setBloomEligible] = React.useState(false)
  const [isMobile, setIsMobile] = React.useState(false)
  const rendererRef = React.useRef<THREE.WebGLRenderer | null>(null)
  const [rendererReadyTick, setRendererReadyTick] = React.useState(0)
  const simRef = React.useRef<ParticleSim | null>(null)
  const [simState, setSimState] = React.useState<StageSimState | null>(null)
  const simFitRequestKeyRef = React.useRef<string | null>(null)
  const simFitLoggedKeyRef = React.useRef<string | null>(null)
  const simInitKeyRef = React.useRef<string | null>(null)
  const debugDepth = React.useMemo(() => readSearchParamSafe('debugDepth') === '1', [])
  React.useEffect(() => {
    const renderer = rendererRef.current
    if (!renderer) {
      return undefined
    }
    if (!simRef.current) {
      simRef.current = new ParticleSim(renderer)
    }
    return () => {
      simRef.current?.dispose()
      simRef.current = null
      simInitKeyRef.current = null
    }
  }, [rendererReadyTick])
  const [bloomGuardReady, setBloomGuardReady] = React.useState(false)
  const [instanceCount, setInstanceCount] = React.useState<number | null>(null)
  const [dprClampValue, setDprClampValue] = React.useState<number | null>(null)
  const [devicePixelRatioRaw, setDevicePixelRatioRaw] = React.useState<number | null>(null)
  const [lowPowerGuard, setLowPowerGuard] = React.useState(false)
  const [drawing, setDrawing] = React.useState(false)
  const inkUpdateLoggedRef = React.useRef(false)
  const base = sceneId ? `/assets/pointclouds/${sceneId}` : null
  const colorUrl = colorUrlProp ?? (base ? `${base}/color.png` : null)
  const depthUrl = depthUrlProp ?? (base ? `${base}/depth16.png` : null)
  const depthRg = depthRgUrl ?? (base ? `${base}/depth_rg.png` : null)
  const [prebaked, setPrebaked] = React.useState<{
    positions: Float32Array
    count: number
    colors?: Uint8Array
  } | null>(null)
  const [prebakedStatus, setPrebakedStatus] = React.useState<
    'idle' | 'loading' | 'present' | 'absent'
  >(sceneId ? 'idle' : 'absent')
  const [prebakedTransform, setPrebakedTransform] = React.useState<{
    center: [number, number, number]
    scale: number
    radius: number
    rotationQuat?: THREE.Quaternion
  } | null>(null)

  const fallbackGate = React.useMemo(() => {
    if (!sceneId) return true
    return prebakedStatus === 'absent'
  }, [prebakedStatus, sceneId])

  const shouldFetchColor = fallbackGate && !!colorUrl
  const shouldFetchDepthRg = fallbackGate && !!depthRg

  const color = useImageData(shouldFetchColor ? colorUrl : null)
  const packed = usePackedDepth(shouldFetchDepthRg ? depthRg : null)

  const [allowDepth16, setAllowDepth16] = React.useState(false)
  React.useEffect(() => {
    if (!fallbackGate) {
      setAllowDepth16(false)
      return
    }
    if (!shouldFetchDepthRg) {
      setAllowDepth16(!!depthUrl)
      return
    }
    if (packed.status === 'error') {
      setAllowDepth16(!!depthUrl)
    } else if (packed.status === 'ready') {
      setAllowDepth16(false)
    }
  }, [fallbackGate, shouldFetchDepthRg, packed.status, depthUrl])

  const depthImage = useImageData(fallbackGate && allowDepth16 && depthUrl ? depthUrl : null)

  const depth16From8 = React.useMemo(() => {
    if (depthImage.status !== 'ready' || !depthImage.data) return null
    const w = depthImage.width
    const h = depthImage.height
    const src = depthImage.data.data
    const out = new Uint16Array(w * h)
    for (let i = 0, p = 0; p < out.length; i += 4, p++) out[p] = src[i] * 257
    return { data16: out, width: w, height: h }
  }, [depthImage.data, depthImage.height, depthImage.status, depthImage.width])

  const colorReady = color.status === 'ready' && !!color.data && color.width > 0 && color.height > 0
  const readyPacked =
    fallbackGate &&
    colorReady &&
    packed.status === 'ready' &&
    !!packed.data16 &&
    packed.width > 0 &&
    packed.height > 0
  const readyFallback = fallbackGate && colorReady && !!depth16From8
  const pointBudget = React.useMemo(() => pointCap({ mobile: 75_000, desktop: 95_000 }), [])
  const [runtimeCaps, setRuntimeCaps] = React.useState<Readonly<DreamdustRuntimeCaps> | null>(null)

  const dreamdustUniformApi = useDreamdustUniforms()
  const {
    uniforms: baseUniforms,
    setUniform,
    updateInkTexture,
    simUniforms,
    presetAiryActive,
    simEngineActive,
  } = dreamdustUniformApi
  const simEnabled = simEngineActive
  const fovOverride = React.useMemo(readFovOverride, [])
  const tick = (
    dreamdustUniformApi as {
      tick?: (state: unknown, delta: number) => void
    }
  ).tick
  const startReveal = (dreamdustUniformApi as { startReveal?: () => void }).startReveal
  const uniforms = React.useMemo<DreamdustStageUniforms>(() => {
    const u = baseUniforms as DreamdustStageUniforms
    if (!u.uBaseSize) u.uBaseSize = { value: pointSize }
    if (!u.uDepthMin) u.uDepthMin = { value: 0.05 }
    else u.uDepthMin.value = 0.05
    if (!u.uDepthMax) u.uDepthMax = { value: 0.95 }
    else u.uDepthMax.value = 0.95
    if (!u.uInvertDepth) u.uInvertDepth = { value: 0 }
    if (!u.uPVInvCapture) u.uPVInvCapture = { value: new THREE.Matrix4() }
    if (!u.uHasCapture) u.uHasCapture = { value: 0 }
    if (!u.uZNearNdc) u.uZNearNdc = { value: -0.85 }
    if (!u.uZFarNdc) u.uZFarNdc = { value: 0.15 }
    if (!u.uInkOffsetGain) u.uInkOffsetGain = u.uOffsetGain as typeof u.uOffsetGain
    if (!u.uInkSizeGain) u.uInkSizeGain = u.uSizeGain as typeof u.uSizeGain
    if (!u.uInkTintGain) u.uInkTintGain = u.uTintGain as typeof u.uTintGain
    return u
  }, [baseUniforms, pointSize])

  const tunablesRef = React.useRef<DreamdustTunables>(getDreamdustTunables())

  React.useEffect(() => {
    const { curlFreq, curlAmp } = tunablesRef.current
    setUniform('uGamma', 0.82)
    setUniform('uFocal', 1600)
    setUniform('uPointBaseSize', DEFAULT_POINT_SIZING.baseSize)
    setUniform('uMinSize', DEFAULT_POINT_SIZING.minSize)
    setUniform('uMaxSize', DEFAULT_POINT_SIZING.maxSize)
    setUniform('uDepthBias', 0.14)
    setUniform('uNoiseScale', curlFreq)
    setUniform('uNoiseSpeed', 0.24)
    // Stronger contrast on first draw: halve base drift, boost ink gains
    setUniform('uDriftAmp', curlAmp)
    setUniform('uSizeGain', DEFAULT_POINT_SIZING.sizeGain)
    setUniform('uOffsetGain', Math.max(DEFAULT_POINT_SIZING.offsetGain, 5.0))
    setUniform('uTintGain', 0.2)
  }, [setUniform])

  React.useEffect(() => {
    return subscribeDreamdustTunables((next) => {
      tunablesRef.current = next
      setUniform('uNoiseScale', next.curlFreq)
      setUniform('uDriftAmp', next.curlAmp)
    })
  }, [setUniform])

  React.useEffect(() => {
    uniforms.uDepthMin.value = 0.05
    uniforms.uDepthMax.value = 0.95
    uniforms.uZNearNdc.value = -0.85
    uniforms.uZFarNdc.value = 0.15
    uniforms.uInvertDepth.value = 0
  }, [uniforms])

  const dreamdustCtx = useOptionalDreamdustCtx()
  const startCascade = dreamdustCtx?.startCascade
  const inkTex = dreamdustCtx?.inkTex ?? null
  const inkIntensity = dreamdustCtx?.inkIntensity ?? 1
  const vertexInkOk = dreamdustCtx?.vertexInkOk ?? runtimeCaps?.vertexInkOk ?? false
  const debugFlags = React.useMemo(() => getDebugFlags(), [])
  const { simSnapshot, inkSnapshot } = useDebugControls(debugFlags)
  const debugInkProbe = debugFlags.inkProbe
  const debugSimProbe = debugFlags.simProbe
  const uniformsWithReveal = uniforms as DreamdustStageUniformsWithReveal
  const hasRevealUniform = !!uniformsWithReveal.uReveal
  const timelineSupported = hasRevealUniform && typeof startReveal === 'function'

  React.useEffect(() => {
    updateInkTexture(inkTex)
  }, [inkTex, updateInkTexture])

  // One-time debug of ink mapping and caps at first stroke
  const loggedInkInfoRef = React.useRef(false)
  React.useEffect(() => {
    if (loggedInkInfoRef.current) return
    if (inkIntensity > 0.0) {
      try {
        const vtx = uniforms.uVertexInkOk?.value ?? 0
        const vp = uniforms.uViewport?.value ?? [0, 0]
        console.log('[PC] ink debug', {
          vertexInkOk: vtx > 0.5,
          uViewport: vp,
          inkIntensity,
        })
      } catch {
        /* noop */
      }
      loggedInkInfoRef.current = true
    }
  }, [inkIntensity, uniforms])

  React.useEffect(() => {
    // TEMP: force non-zero ink intensity to validate visibility regression.
    setUniform('uInkIntensity', 0.75)
  }, [setUniform])

  React.useEffect(() => {
    setUniform('uVertexInkOk', vertexInkOk ? 1 : 0)
  }, [setUniform, vertexInkOk])

  const fallbackMaterial = React.useMemo(() => {
    if (!runtimeCaps) return null
    const material = createDreamdustMaterial(uniforms, {
      unproject: true,
      vertexInkOk: runtimeCaps.vertexInkOk ?? false,
      debugInkProbe,
      debugSimProbe,
    })
    const defines = material.defines ?? {}
    const vertexInkDefine = runtimeCaps.vertexInkOk ? 1 : 0
    defines.VERTEX_INK_OK = vertexInkDefine
    if (vertexInkDefine) {
      defines.USE_VERTEX_INK = 1
    } else {
      delete defines.USE_VERTEX_INK
    }
    material.defines = defines
    material.needsUpdate = true
    return material
  }, [debugInkProbe, debugSimProbe, runtimeCaps, uniforms])
  const prebakedMaterial = React.useMemo(() => {
    if (!runtimeCaps) return null
    const material = createDreamdustMaterial(uniforms, {
      unproject: false,
      vertexInkOk: runtimeCaps.vertexInkOk ?? false,
      debugInkProbe,
      debugSimProbe,
    })
    const defines = material.defines ?? {}
    const vertexInkDefine = runtimeCaps.vertexInkOk ? 1 : 0
    defines.VERTEX_INK_OK = vertexInkDefine
    if (vertexInkDefine) {
      defines.USE_VERTEX_INK = 1
    } else {
      delete defines.USE_VERTEX_INK
    }
    material.defines = defines
    material.needsUpdate = true
    return material
  }, [debugInkProbe, debugSimProbe, runtimeCaps, uniforms])

  React.useEffect(() => {
    return () => {
      fallbackMaterial?.dispose()
    }
  }, [fallbackMaterial])
  React.useEffect(() => {
    return () => {
      prebakedMaterial?.dispose()
    }
  }, [prebakedMaterial])

  // Prebaked positions path (VGGT exporter). If positions.f32 exists for the scene, prefer it.
  React.useEffect(() => {
    let cancelled = false
    setPrebaked(null)
    setPrebakedTransform(null)
    if (!sceneId) {
      setPrebakedStatus('absent')
      return () => {
        cancelled = true
      }
    }
    setPrebakedStatus('loading')
    const basePath = `/assets/pointclouds/${sceneId}`
    ;(async () => {
      try {
        const res = await fetch(`${basePath}/positions.f32`, { cache: 'force-cache' })
        if (!res.ok) {
          if (!cancelled) setPrebakedStatus('absent')
          return
        }
        const buf = await res.arrayBuffer()
        const f32 = new Float32Array(buf)
        const count = Math.floor(f32.length / 3)
        if (count <= 0) {
          if (!cancelled) setPrebakedStatus('absent')
          return
        }
        let colors: Uint8Array | undefined
        try {
          const cr = await fetch(`${basePath}/colors.u8`, { cache: 'force-cache' })
          if (cr.ok) {
            const cbuf = await cr.arrayBuffer()
            colors = new Uint8Array(cbuf)
          }
        } catch {
          /* noop */
        }
        if (!cancelled) {
          console.log('[PC] prebaked positions', {
            bytes: buf.byteLength,
            count,
            sample: Array.from(f32.slice(0, 6)),
          })
          setPrebaked({ positions: f32, count, colors })
          // Compute AABB and a normalization transform
          let minX = Infinity,
            minY = Infinity,
            minZ = Infinity,
            maxX = -Infinity,
            maxY = -Infinity,
            maxZ = -Infinity
          for (let i = 0; i < count; i++) {
            const x = f32[i * 3 + 0]
            const y = f32[i * 3 + 1]
            const z = f32[i * 3 + 2]
            if (x < minX) minX = x
            if (y < minY) minY = y
            if (z < minZ) minZ = z
            if (x > maxX) maxX = x
            if (y > maxY) maxY = y
            if (z > maxZ) maxZ = z
          }
          const sizeX = Math.max(1e-6, maxX - minX)
          const sizeY = Math.max(1e-6, maxY - minY)
          const sizeZ = Math.max(1e-6, maxZ - minZ)
          const maxExtent = Math.max(sizeX, sizeY, sizeZ)
          const desiredExtent = 1000
          const scale = desiredExtent / maxExtent
          const center: [number, number, number] = [
            (minX + maxX) * 0.5,
            (minY + maxY) * 0.5,
            (minZ + maxZ) * 0.5,
          ]
          const radius = 0.5 * Math.max(sizeX, sizeY, sizeZ) * scale
          console.log('[PC] prebaked AABB', {
            min: [minX, minY, minZ],
            max: [maxX, maxY, maxZ],
            extent: [sizeX, sizeY, sizeZ],
            maxExtent,
            scale,
            radius,
          })
          // PCA orientation: compute covariance of centered points and align axes
          const cx = center[0],
            cy = center[1],
            cz = center[2]
          let sxx = 0,
            sxy = 0,
            sxz = 0,
            syy = 0,
            syz = 0,
            szz = 0
          for (let i = 0; i < count; i++) {
            const x = f32[i * 3 + 0] - cx
            const y = f32[i * 3 + 1] - cy
            const z = f32[i * 3 + 2] - cz
            sxx += x * x
            sxy += x * y
            sxz += x * z
            syy += y * y
            syz += y * z
            szz += z * z
          }
          const invN = 1 / Math.max(1, count - 1)
          sxx *= invN
          sxy *= invN
          sxz *= invN
          syy *= invN
          syz *= invN
          szz *= invN
          // 3x3 covariance matrix M
          const m00 = sxx,
            m01 = sxy,
            m02 = sxz
          const m10 = sxy,
            m11 = syy,
            m12 = syz
          const m20 = sxz,
            m21 = syz,
            m22 = szz
          // Power iteration to get dominant eigenvector (principal axis)
          const powIter = (
            mx: number,
            mxy: number,
            mxz: number,
            myx: number,
            myy: number,
            myz: number,
            mzx: number,
            mzy: number,
            mzz: number
          ) => {
            let vx = 1,
              vy = 0,
              vz = 0
            for (let k = 0; k < 16; k++) {
              const nx = mx * vx + mxy * vy + mxz * vz
              const ny = myx * vx + myy * vy + myz * vz
              const nz = mzx * vx + mzy * vy + mzz * vz
              const len = Math.max(1e-8, Math.hypot(nx, ny, nz))
              vx = nx / len
              vy = ny / len
              vz = nz / len
            }
            return [vx, vy, vz] as [number, number, number]
          }
          const v0 = powIter(m00, m01, m02, m10, m11, m12, m20, m21, m22) // largest eigenvector
          // Deflate matrix to get next axis (simple Gram-Schmidt on a random vector)
          let rx = 0,
            ry = 1,
            rz = 0
          const dot0 = v0[0] * rx + v0[1] * ry + v0[2] * rz
          rx -= dot0 * v0[0]
          ry -= dot0 * v0[1]
          rz -= dot0 * v0[2]
          const rlen = Math.max(1e-8, Math.hypot(rx, ry, rz))
          rx /= rlen
          ry /= rlen
          rz /= rlen
          // Map basis: we want longest in-plane = +X, dominant normal = -Z.
          // Heuristic: treat v0 as longest axis, compute a second axis by multiplying M*r and orthonormalize, then normal = cross.
          const mrX = m00 * rx + m01 * ry + m02 * rz
          const mrY = m10 * rx + m11 * ry + m12 * rz
          const mrZ = m20 * rx + m21 * ry + m22 * rz
          // Orthonormalize against v0
          let v1x = mrX,
            v1y = mrY,
            v1z = mrZ
          const dot01 = v0[0] * v1x + v0[1] * v1y + v0[2] * v1z
          v1x -= dot01 * v0[0]
          v1y -= dot01 * v0[1]
          v1z -= dot01 * v0[2]
          const v1len = Math.max(1e-8, Math.hypot(v1x, v1y, v1z))
          v1x /= v1len
          v1y /= v1len
          v1z /= v1len
          // Normal (Z axis before sign disambiguation)
          let zX = v0[1] * v1z - v0[2] * v1y
          let zY = v0[2] * v1x - v0[0] * v1z
          let zZ = v0[0] * v1y - v0[1] * v1x
          // Normalize
          {
            const len = Math.max(1e-8, Math.hypot(zX, zY, zZ))
            zX /= len
            zY /= len
            zZ /= len
          }
          // Sign disambiguation:
          // 1) Make normal face -Z (z · (0,0,-1) > 0)
          if (zZ < 0) {
            zX = -zX
            zY = -zY
            zZ = -zZ
          }
          // Recompute Y to keep right-handed basis after possible flip
          // y = normalize(cross(z, x))
          {
            const yyX = zY * v0[2] - zZ * v0[1]
            const yyY = zZ * v0[0] - zX * v0[2]
            const yyZ = zX * v0[1] - zY * v0[0]
            const len = Math.max(1e-8, Math.hypot(yyX, yyY, yyZ))
            v1x = yyX / len
            v1y = yyY / len
            v1z = yyZ / len
          }
          // 2) Make up axis point +Y (y · (0,1,0) > 0)
          if (v1y < 0) {
            v1x = -v1x
            v1y = -v1y
            v1z = -v1z
            // Recompute z = normalize(cross(x,y)) to keep orthonormal
            zX = v0[1] * v1z - v0[2] * v1y
            zY = v0[2] * v1x - v0[0] * v1z
            zZ = v0[0] * v1y - v0[1] * v1x
            const len2 = Math.max(1e-8, Math.hypot(zX, zY, zZ))
            zX /= len2
            zY /= len2
            zZ /= len2
          }
          // Debug overrides from UI are applied at runtime via composed quaternion,
          // not baked into the PCA basis here.
          // Build rotation matrix R such that R*[x=v0,y=v1,z] -> [X,Y,-Z]
          const R = new THREE.Matrix4().set(
            v0[0],
            v1x,
            -zX,
            0,
            v0[1],
            v1y,
            -zY,
            0,
            v0[2],
            v1z,
            -zZ,
            0,
            0,
            0,
            0,
            1
          )
          console.log('[PC] prebaked PCA orientation applied')
          // Store transform: scale/center handled via props; rotation via quaternion
          const q = new THREE.Quaternion().setFromRotationMatrix(R)
          const t: {
            center: [number, number, number]
            scale: number
            radius: number
            rotationQuat?: THREE.Quaternion
          } = {
            center,
            scale,
            radius,
            rotationQuat: q,
          }
          setPrebakedTransform(t)
          setPrebakedStatus('present')
        }
      } catch {
        if (!cancelled) setPrebakedStatus('absent')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [sceneId])

  // Reduce console noise when prebaked present
  React.useEffect(() => {
    if (prebakedStatus === 'present') {
      try {
        console.log('[PC] prebaked present; using positions/colors, fallback images not required')
      } catch {
        /* noop */
      }
    }
  }, [prebakedStatus])

  // Debug panel state (optional via ?debug=1)
  const presetFov = presetAiryActive && typeof PresetAiry.fov === 'number' ? PresetAiry.fov : null
  const defaultFovDeg = clampFovDeg(
    typeof fovOverride === 'number' ? fovOverride : (presetFov ?? 20)
  )
  const [debugVisible, setDebugVisible] = React.useState(false)
  // Lightweight array sampler hash (content-aware) to detect data changes even when lengths are identical
  const hashArraySample = React.useCallback((arr: ArrayLike<number> | null | undefined): string => {
    if (!arr) return 'h:0'
    const len = (arr as { length: number }).length || 0
    if (len === 0) return 'h:0'
    let h = 2166136261 >>> 0 // FNV-1a base
    const samples = Math.min(256, len)
    const step = Math.max(1, Math.floor(len / samples))
    for (let i = 0; i < len; i += step) {
      const v = Number((arr as any)[i] ?? 0)
      const q = Math.round(v * 100000) // 1e-5 precision
      h ^= q >>> 0
      h = Math.imul(h, 16777619) >>> 0
    }
    return `h:${h.toString(16)}`
  }, [])
  const [ui, setUi] = React.useState<{
    thickness: number
    pointSizeScale: number
    keepRatio: number
    bloom: boolean
    fovDeg: number
    reveal: number
    flipUp?: boolean
    flipNormal?: boolean
    mirrorLR?: boolean
    mirrorUD?: boolean
    roll180?: boolean
  }>(() => ({
    thickness: 0.38,
    pointSizeScale: 1,
    keepRatio: 1,
    bloom: true,
    fovDeg: defaultFovDeg,
    reveal: 1,
    flipUp: false,
    flipNormal: false,
    mirrorLR: false,
    mirrorUD: true,
    roll180: false,
  }))
  const [fitRequest, setFitRequest] = React.useState(0)
  const { bloom, pointSizeScale, reveal, thickness } = ui
  const bloomActive =
    !simEnabled && bloom && !noBloomOverride && (forceBloomOverride || bloomEligible)
  const thicknessScale = React.useMemo(() => Math.max(0.05, Math.min(1.0, thickness)), [thickness])
  React.useEffect(() => {
    try {
      const p = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null
      if (p && p.get('debug') === '1') setDebugVisible(true)
      const saved = typeof window !== 'undefined' ? window.localStorage.getItem('pcDebug') : null
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<typeof ui>
        setUi((prev) => {
          const next = { ...prev, ...parsed }
          if (noBloomOverride) {
            next.bloom = false
          }
          return next
        })
      } else if (noBloomOverride) {
        setUi((prev) => ({ ...prev, bloom: false }))
      }
      if (typeof fovOverride === 'number') {
        const clamped = clampFovDeg(fovOverride)
        setUi((prev) => (prev.fovDeg === clamped ? prev : { ...prev, fovDeg: clamped }))
      }
    } catch {
      /* noop */
    }
  }, [fovOverride, noBloomOverride])
  React.useEffect(() => {
    try {
      if (typeof window !== 'undefined') window.localStorage.setItem('pcDebug', JSON.stringify(ui))
    } catch {
      /* noop */
    }
  }, [ui])

  // Apply bloom flag; force OFF while sim engine is active for stable tuning
  React.useEffect(() => {
    setBloomEnabled(bloomActive && !simEnabled)
  }, [bloomActive, simEnabled])

  React.useEffect(() => {
    const countOk =
      typeof instanceCount === 'number' &&
      instanceCount >= 60_000 &&
      instanceCount <= Math.min(pointBudget, 110_000)
    const dprOk = typeof devicePixelRatioRaw === 'number' ? devicePixelRatioRaw <= 2.0 : true
    const guardOk = !simEnabled && !lowPowerGuard && !isMobile && countOk && dprOk
    setBloomEligible(guardOk)
  }, [devicePixelRatioRaw, instanceCount, isMobile, lowPowerGuard, pointBudget, simEnabled])

  React.useEffect(() => {
    const ready =
      typeof dprClampValue === 'number' &&
      devicePixelRatioRaw !== null &&
      (typeof instanceCount === 'number' || forceBloomOverride)
    if (ready !== bloomGuardReady) {
      setBloomGuardReady(ready)
    }
  }, [bloomGuardReady, devicePixelRatioRaw, dprClampValue, forceBloomOverride, instanceCount])

  const bloomLogRef = React.useRef(false)
  React.useEffect(() => {
    if (!bloomGuardReady || bloomLogRef.current) return
    const enabled = bloomActive
    try {
      console.info(
        `[dreamdust] bloom { enabled: ${enabled}, strength: ${BLOOM_SETTINGS.strength}, radius: ${BLOOM_SETTINGS.radius}, threshold: ${BLOOM_SETTINGS.threshold} }`
      )
    } catch {
      /* noop */
    }
    bloomLogRef.current = true
  }, [bloomActive, bloomGuardReady])

  React.useEffect(() => {
    uniforms.uBaseSize.value = pointSize * pointSizeScale
  }, [pointSize, pointSizeScale, uniforms, ui])

  React.useEffect(() => {
    if (timelineSupported) return
    const clamped = Math.min(1, Math.max(0, reveal))
    if (hasRevealUniform && uniformsWithReveal.uReveal) {
      uniformsWithReveal.uReveal.value = clamped
      return
    }
    const threshold = 1 - clamped
    if (uniforms.uNoiseThreshold) {
      uniforms.uNoiseThreshold.value = threshold
    } else {
      setUniform('uNoiseThreshold', threshold)
    }
  }, [hasRevealUniform, reveal, setUniform, timelineSupported, uniforms, uniformsWithReveal])

  // Derive reduced, matched buffers for prebaked positions/colors
  const renderBuffers = React.useMemo(() => {
    if (!prebaked) return null
    const srcPos = prebaked.positions
    const srcCount = prebaked.count
    const srcColors =
      prebaked.colors && prebaked.colors.length >= srcCount * 3 ? prebaked.colors : undefined

    const plan = capInstances(srcCount, {
      cap: pointBudget,
      keepRatio: ui.keepRatio,
      minCount: srcCount > 0 ? 1 : 0,
    })

    if (plan.count === 0) {
      return { positions: new Float32Array(0), colors: undefined, keptCount: 0, cap: pointBudget }
    }

    if (plan.count >= srcCount || plan.step <= 1) {
      return { positions: srcPos, colors: srcColors, keptCount: srcCount, cap: pointBudget }
    }

    const positions = decimateInterleaved(srcPos, 3, plan.step, plan.count)
    const colors = srcColors ? decimateInterleaved(srcColors, 3, plan.step, plan.count) : undefined

    return { positions, colors, keptCount: plan.count, cap: pointBudget }
  }, [pointBudget, prebaked, ui.keepRatio])

  const loggedInstancesRef = React.useRef(false)
  const revealStartedRef = React.useRef(false)
  const logInstances = React.useCallback((count: number) => {
    if (!Number.isFinite(count) || count <= 0) {
      setInstanceCount(null)
      return
    }
    const floored = Math.floor(count)
    setInstanceCount(floored)
    if (loggedInstancesRef.current) return
    try {
      console.log('[PC] instances:', floored)
    } catch {
      /* noop */
    }
    loggedInstancesRef.current = true
  }, [])

  React.useEffect(() => {
    loggedInstancesRef.current = false
    revealStartedRef.current = false
    setInstanceCount(null)
  }, [sceneId])

  React.useEffect(() => {
    if (prebakedStatus === 'loading' || prebakedStatus === 'idle') {
      loggedInstancesRef.current = false
      revealStartedRef.current = false
      setInstanceCount(null)
    }
  }, [prebakedStatus])

  React.useEffect(() => {
    if (!sceneId) {
      loggedInstancesRef.current = false
      revealStartedRef.current = false
      setInstanceCount(null)
    }
  }, [sceneId, colorUrl, depthUrl, depthRg])

  React.useEffect(() => {
    if (renderBuffers) {
      logInstances(renderBuffers.keptCount)
    } else if (prebaked && prebakedStatus === 'present') {
      logInstances(prebaked.count)
    }
  }, [logInstances, prebaked, prebakedStatus, renderBuffers])

  const prebakedRenderable = prebakedStatus === 'present' && !!prebaked && !!prebakedMaterial
  const fallbackRenderable =
    prebakedStatus === 'absent' && !!fallbackMaterial && (readyPacked || readyFallback)
  const geometryReady = prebakedRenderable || fallbackRenderable

  React.useEffect(() => {
    if (!geometryReady) {
      revealStartedRef.current = false
    }
  }, [geometryReady])

  React.useEffect(() => {
    if (!geometryReady) return
    if (revealStartedRef.current) return
    if (hasRevealUniform && typeof startReveal === 'function') {
      try {
        startReveal()
      } catch {
        // Ignore reveal start failures for backward compatibility.
      }
    }
    setFitRequest((v) => v + 1)
    revealStartedRef.current = true
  }, [geometryReady, hasRevealUniform, startReveal])

  // Compose world-space debug flips with the PCA quaternion so toggles work live
  const appliedQuaternion = React.useMemo(() => {
    const base = prebakedTransform?.rotationQuat
    if (!base) return undefined
    const flipWorld = new THREE.Quaternion().identity()
    if (ui.flipNormal) {
      // rotate 180° around world Y to swap front/back
      const qY = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI)
      flipWorld.multiply(qY)
    }
    if (ui.flipUp) {
      // rotate 180° around world X to invert up/down
      const qX = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI)
      flipWorld.multiply(qX)
    }
    if (ui.roll180) {
      // optional 180° roll about Z
      const qZ = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI)
      flipWorld.multiply(qZ)
    }
    return flipWorld.multiply(base.clone())
  }, [prebakedTransform?.rotationQuat, ui.flipNormal, ui.flipUp, ui.roll180])

  // Recolor fallback: if colors missing or mismatched, synthesize from source image
  const recolored = React.useMemo(() => {
    if (!renderBuffers) return null
    const pos = renderBuffers.positions
    const count = Math.floor(pos.length / 3)
    const colors = renderBuffers.colors
    const needRecolor = !colors || Math.floor(colors.length / 3) !== count
    if (!needRecolor) return null
    if (!color.data || color.width <= 0 || color.height <= 0) return null

    // Compute AABB in (optionally) PCA-aligned space for XY mapping
    const q = appliedQuaternion
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity
    const tmp = new THREE.Vector3()
    for (let i = 0; i < count; i++) {
      tmp.set(pos[i * 3 + 0], pos[i * 3 + 1], pos[i * 3 + 2])
      if (q) tmp.applyQuaternion(q)
      const x = tmp.x
      const y = tmp.y
      if (x < minX) minX = x
      if (y < minY) minY = y
      if (x > maxX) maxX = x
      if (y > maxY) maxY = y
    }
    const dx = Math.max(1e-6, maxX - minX)
    const dy = Math.max(1e-6, maxY - minY)
    const w = color.width
    const h = color.height
    const src = color.data.data
    const out = new Uint8Array(count * 3)
    for (let i = 0; i < count; i++) {
      tmp.set(pos[i * 3 + 0], pos[i * 3 + 1], pos[i * 3 + 2])
      if (q) tmp.applyQuaternion(q)
      const u = (tmp.x - minX) / dx
      const v = (tmp.y - minY) / dy
      const px = Math.max(0, Math.min(w - 1, Math.round(u * (w - 1))))
      const py = Math.max(0, Math.min(h - 1, Math.round((1.0 - v) * (h - 1))))
      const p = (py * w + px) * 4
      out[i * 3 + 0] = src[p + 0]
      out[i * 3 + 1] = src[p + 1]
      out[i * 3 + 2] = src[p + 2]
    }
    return out
  }, [renderBuffers, color.data, color.width, color.height, appliedQuaternion])

  // (cameraCoverRadius moved below cameraFitRadius)

  // Prebaked UV/depth for shader responsiveness (aUv/aDepth)
  const prebakedUvDepth = React.useMemo(() => {
    if (!prebaked) return null
    const srcPos = (renderBuffers?.positions ?? prebaked.positions) as Float32Array
    const count = Math.floor(srcPos.length / 3)
    if (count <= 0) return null

    const q = appliedQuaternion
    let minX = Infinity,
      minY = Infinity,
      minZ = Infinity,
      maxX = -Infinity,
      maxY = -Infinity,
      maxZ = -Infinity
    const tmp = new THREE.Vector3()
    for (let i = 0; i < count; i++) {
      tmp.set(srcPos[i * 3 + 0], srcPos[i * 3 + 1], srcPos[i * 3 + 2])
      if (q) tmp.applyQuaternion(q)
      if (tmp.x < minX) minX = tmp.x
      if (tmp.y < minY) minY = tmp.y
      if (tmp.z < minZ) minZ = tmp.z
      if (tmp.x > maxX) maxX = tmp.x
      if (tmp.y > maxY) maxY = tmp.y
      if (tmp.z > maxZ) maxZ = tmp.z
    }
    const dx = Math.max(1e-6, maxX - minX)
    const dy = Math.max(1e-6, maxY - minY)
    const dz = Math.max(1e-6, maxZ - minZ)

    const uvs = new Float32Array(count * 2)
    const depths01 = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      tmp.set(srcPos[i * 3 + 0], srcPos[i * 3 + 1], srcPos[i * 3 + 2])
      if (q) tmp.applyQuaternion(q)
      const u = (tmp.x - minX) / dx
      const v = (tmp.y - minY) / dy
      const d01 = (tmp.z - minZ) / dz
      uvs[i * 2 + 0] = u
      uvs[i * 2 + 1] = v
      depths01[i] = d01
    }

    return { uvs, depths01 }
  }, [appliedQuaternion, prebaked, renderBuffers])

  const simSource = React.useMemo(() => {
    if (!simEnabled || !prebaked || !prebakedUvDepth) return null
    const positions = renderBuffers?.positions ?? prebaked.positions
    const depths = prebakedUvDepth.depths01
    const available = Math.min(Math.floor(positions.length / 3), depths.length)
    if (available <= 0) return null
    const requested = simUniforms?.numParticles ?? 0
    const limit =
      requested > 0 && Number.isFinite(requested)
        ? Math.max(0, Math.min(pointBudget, Math.floor(requested)))
        : pointBudget
    const count = Math.min(available, limit)
    if (count <= 0) return null
    const trimmedPositions = positions.slice(0, count * 3) as Float32Array
    const trimmedDepths = depths.slice(0, count) as Float32Array
    const trimmedUvs = prebakedUvDepth.uvs.slice(0, count * 2) as Float32Array
    let colorSource: ArrayLike<number> | null = null
    if (debugDepth) {
      const depthColors = new Float32Array(count * 3)
      for (let i = 0; i < count; i += 1) {
        const d = trimmedDepths[i] ?? 0
        depthColors[i * 3 + 0] = d
        depthColors[i * 3 + 1] = d
        depthColors[i * 3 + 2] = d
      }
      colorSource = depthColors
    } else {
      const baseColors = renderBuffers?.colors ?? recolored ?? null
      if (baseColors && baseColors.length >= count * 3) {
        colorSource = baseColors.slice(0, count * 3)
      }
    }
    return {
      positions: trimmedPositions,
      depths: trimmedDepths,
      colors: colorSource,
      count,
      stageUvs: trimmedUvs,
    }
  }, [
    debugDepth,
    pointBudget,
    prebaked,
    prebakedUvDepth,
    recolored,
    renderBuffers,
    simEnabled,
    simUniforms?.numParticles,
  ])

  const simActive = simEnabled && !!simState
  const simBounds = simState?.bounds ?? null
  const stageUvDepth = React.useMemo(() => {
    if (simActive && simState) {
      return { uvs: simState.stageUvs, depths01: simState.stageDepths }
    }
    return prebakedUvDepth
  }, [prebakedUvDepth, simActive, simState])

  React.useEffect(() => {
    const instance = simRef.current
    if (!instance || !rendererRef.current) {
      return
    }
    if (!simEnabled) {
      return
    }
    if (!simSource || simSource.count <= 0) {
      if (simState) {
        setSimState(null)
      }
      instance.dispose()
      simInitKeyRef.current = null
      simFitRequestKeyRef.current = null
      simFitLoggedKeyRef.current = null
      return
    }
    const gravityY = typeof simUniforms?.gravityY === 'number' ? simUniforms.gravityY : -0.05
    const damping =
      typeof simUniforms?.velocityDamping === 'number' ? simUniforms.velocityDamping : 0.04
    const gravityVec: [number, number, number] = [0, gravityY, 0]
    instance.setDynamics({ gravity: gravityVec, damping })
    const simKey = `${sceneId ?? 'none'}:${simSource.count}:${debugDepth ? 1 : 0}:${hashArraySample(simSource.positions)}:${hashArraySample(simSource.depths)}:${hashArraySample(simSource.colors as any)}`
    const needsInit = simInitKeyRef.current !== simKey
    if (needsInit) {
      instance.createSim(
        {
          count: simSource.count,
          seed: 1,
          gravity: gravityVec,
          damping,
        },
        {
          positions: simSource.positions as Float32Array,
          depths: simSource.depths as Float32Array,
          colors: simSource.colors,
        }
      )
      simInitKeyRef.current = simKey
      simFitRequestKeyRef.current = null
      simFitLoggedKeyRef.current = null
    }
    if (needsInit || !simState || simState.key !== simKey) {
      const bounds = instance.getBounds()
      const texSize = instance.getTexSize()
      const simUvs = instance.getSimUvs()
      setSimState({
        key: simKey,
        count: simSource.count,
        texSize,
        simUvs,
        stageUvs: simSource.stageUvs,
        stageDepths: simSource.depths as Float32Array,
        positions: simSource.positions as Float32Array,
        bounds: { center: bounds.center.clone(), radius: bounds.radius },
      })
    }
  }, [
    rendererReadyTick,
    simEnabled,
    simSource,
    simUniforms?.gravityY,
    simUniforms?.velocityDamping,
    sceneId,
    debugDepth,
    hashArraySample,
    simState,
  ])

  React.useEffect(() => {
    const material = prebakedMaterial
    if (!material) {
      if (uniforms.uSimPositionTex) uniforms.uSimPositionTex.value = null
      if (uniforms.uSimColorTex) uniforms.uSimColorTex.value = null
      return
    }
    const defines = material.defines ?? {}
    const matUniforms = material.uniforms as Record<string, { value: unknown }>
    const instance = simRef.current
    if (simActive && instance && simState) {
      defines.USE_SIM_POS = 1
      const colorTex = instance.getColorTexture()
      if (colorTex) {
        defines.USE_SIM_COLOR = 1
      } else {
        delete defines.USE_SIM_COLOR
      }
      const posTex = instance.getPositionTexture()
      if (matUniforms.uSimPositionTex) matUniforms.uSimPositionTex.value = posTex
      if (matUniforms.uSimColorTex) matUniforms.uSimColorTex.value = colorTex
      if (uniforms.uSimPositionTex) uniforms.uSimPositionTex.value = posTex
      if (uniforms.uSimColorTex) uniforms.uSimColorTex.value = colorTex
    } else {
      delete defines.USE_SIM_POS
      delete defines.USE_SIM_COLOR
      if (matUniforms.uSimPositionTex) matUniforms.uSimPositionTex.value = null
      if (matUniforms.uSimColorTex) matUniforms.uSimColorTex.value = null
      if (uniforms.uSimPositionTex) uniforms.uSimPositionTex.value = null
      if (uniforms.uSimColorTex) uniforms.uSimColorTex.value = null
    }
    material.defines = defines
    ;(material as THREE.ShaderMaterial & { uniformsNeedUpdate?: boolean }).uniformsNeedUpdate = true
    material.needsUpdate = true
  }, [prebakedMaterial, simActive, simState, uniforms])

  // Mirror scale (local reflection) for left/right and up/down
  const mirrorScale = React.useMemo(() => {
    return [ui.mirrorLR ? -1 : 1, ui.mirrorUD ? -1 : 1, 1] as [number, number, number]
  }, [ui.mirrorLR, ui.mirrorUD])

  React.useEffect(() => {
    if (!dreamdustCtx) return
    dreamdustCtx.setMirrorFlags(!!ui.mirrorLR, !!ui.mirrorUD)
  }, [dreamdustCtx, ui.mirrorLR, ui.mirrorUD])

  const cameraFitTarget = React.useMemo<[number, number, number]>(() => {
    if (simActive && simBounds) {
      const center = simBounds.center.clone()
      center.multiply(new THREE.Vector3(1, 1, thicknessScale))
      center.multiply(new THREE.Vector3(mirrorScale[0], mirrorScale[1], mirrorScale[2]))
      const scale = prebakedTransform?.scale ?? 1
      center.multiplyScalar(scale)
      if (appliedQuaternion) center.applyQuaternion(appliedQuaternion)
      if (prebakedTransform) {
        center.add(
          new THREE.Vector3(
            -prebakedTransform.center[0] * scale,
            -prebakedTransform.center[1] * scale,
            -prebakedTransform.center[2] * scale
          )
        )
      }
      return [center.x, center.y, center.z]
    }
    return [0, 0, 0]
  }, [appliedQuaternion, mirrorScale, prebakedTransform, simActive, simBounds, thicknessScale])
  const cameraFitRadius = React.useMemo(() => {
    if (simActive && simBounds) {
      const scale = prebakedTransform?.scale ?? 1
      return Math.max(1e-3, simBounds.radius * scale)
    }
    if (prebakedTransform) return prebakedTransform.radius
    if (color.width > 0 && color.height > 0) {
      const heightUnits = 1000
      const aspect = color.width / Math.max(1, color.height)
      const widthUnits = heightUnits * aspect
      return 0.5 * Math.hypot(widthUnits, heightUnits)
    }
    return 600
  }, [color.height, color.width, prebakedTransform, simActive, simBounds])

  // Compute a cover radius from XY extents so the point cloud fills the viewport
  const cameraCoverRadius = React.useMemo(() => {
    if (simActive && simBounds) {
      const scale = prebakedTransform?.scale ?? 1
      return Math.max(1e-3, simBounds.radius * scale)
    }
    const srcPos = renderBuffers?.positions ?? prebaked?.positions ?? null
    if (!srcPos) return cameraFitRadius
    const count = Math.floor(srcPos.length / 3)
    if (count <= 0) return cameraFitRadius
    const q = appliedQuaternion
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity
    const tmp = new THREE.Vector3()
    for (let i = 0; i < count; i++) {
      tmp.set(srcPos[i * 3 + 0], srcPos[i * 3 + 1], srcPos[i * 3 + 2])
      if (q) tmp.applyQuaternion(q)
      if (tmp.x < minX) minX = tmp.x
      if (tmp.y < minY) minY = tmp.y
      if (tmp.x > maxX) maxX = tmp.x
      if (tmp.y > maxY) maxY = tmp.y
    }
    const dx = Math.max(1e-6, maxX - minX)
    const dy = Math.max(1e-6, maxY - minY)
    return 0.5 * Math.hypot(dx, dy)
  }, [
    appliedQuaternion,
    cameraFitRadius,
    prebaked?.positions,
    prebakedTransform,
    renderBuffers,
    simActive,
    simBounds,
  ])

  React.useEffect(() => {
    if (!simActive || !simState || !simBounds) {
      return
    }
    if (simFitRequestKeyRef.current !== simState.key) {
      setFitRequest((v) => v + 1)
      simFitRequestKeyRef.current = simState.key
    }
    if (simFitLoggedKeyRef.current !== simState.key) {
      const centerVec = simBounds.center
      const centerLog = [centerVec.x, centerVec.y, centerVec.z]
        .map((v) => Number(v).toFixed(2))
        .join(',')
      const radiusLog = Number(simBounds.radius).toFixed(3)
      console.log(`[engine] sim fit { radius:${radiusLog}, center:[${centerLog}] }`)
      simFitLoggedKeyRef.current = simState.key
    }
  }, [simActive, simBounds, simState, setFitRequest])

  React.useEffect(() => {
    if (!uniforms.uDepthNormScale) return
    const radius = prebakedTransform?.radius ?? cameraFitRadius
    const depthScale = depthNormScaleFromRadius(radius) * thicknessScale
    uniforms.uDepthNormScale.value = depthScale
  }, [cameraFitRadius, prebakedTransform, thicknessScale, uniforms, fitRequest])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Canvas
        orthographic={false}
        camera={{ position: [0, 0, 1200], fov: ui.fovDeg, near: 0.1, far: 5000 }}
        gl={{ antialias: true, alpha: true }}
        style={{ width: '100%', height: '100%', pointerEvents: 'auto', cursor: 'grab' }}
        onContextMenu={(e) => e.preventDefault()}
        onPointerDown={(e) => {
          // simple signal that canvas receives input

          console.log('[PC] pointer down', e.clientX, e.clientY)
        }}
        onCreated={({ gl }) => {
          rendererRef.current = gl
          setRendererReadyTick((v) => v + 1)
          const mobile = detectMobile()
          setIsMobile(mobile)
          const rawDpr =
            typeof window !== 'undefined' && typeof window.devicePixelRatio === 'number'
              ? window.devicePixelRatio
              : typeof gl.getPixelRatio === 'function'
                ? gl.getPixelRatio()
                : 1
          setDevicePixelRatioRaw(Number.isFinite(rawDpr) ? rawDpr : null)
          const dprLimit = mobile ? 1.6 : 1.8
          const dprClamp = clampDPR(gl, dprLimit)
          setDprClampValue(Number.isFinite(dprClamp) ? dprClamp : null)
          const lowPower = isLowPowerDevice()
          setLowPowerGuard(lowPower)
          const caps = getDreamdustCaps(gl.domElement)
          // Do not freeze typed arrays directly (V8 throws on freezing array buffer views with elements).
          // Instead, clone the range and freeze the container object to maintain immutability semantics.
          const rawCaps = caps
          const frozenCaps = Object.freeze({
            ...rawCaps,
            aliasedPointSizeRange: new Float32Array(rawCaps.aliasedPointSizeRange),
          }) as Readonly<DreamdustRuntimeCaps>
          setRuntimeCaps(frozenCaps)
          if (dreamdustCtx) {
            dreamdustCtx.setCaps(frozenCaps)
          }
          ackDreamdustCapsFanout('stage')
          setUniform('uVertexInkOk', frozenCaps.vertexInkOk ? 1 : 0)
          if (dreamdustCtx) {
            dreamdustCtx.setVertexInkOk(frozenCaps.vertexInkOk)
          }
          logOnce('caps', {
            vertexInkOk: frozenCaps.vertexInkOk,
            floatOk: frozenCaps.floatOk,
            aliasedPointSizeRange: Array.from(frozenCaps.aliasedPointSizeRange),
            dpr: frozenCaps.dpr,
            dprClamp,
            dprLimit,
          })
          // ACES tone mapping for nicer highlights
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          gl.toneMapping = THREE.ACESFilmicToneMapping
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          gl.toneMappingExposure = 1.0
          // Surface shader errors and log point-size limits
          try {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (gl.debug) gl.debug.checkShaderErrors = true
          } catch {
            /* noop */
          }
          // ensure browser gesture handling doesn't block wheel/touch
          gl.domElement.style.touchAction = 'none'
          gl.domElement.style.pointerEvents = 'auto'
        }}
      >
        {/* no FitOrtho in perspective baseline */}
        <InkSurface
          mirrorLR={!!ui.mirrorLR}
          mirrorUD={!!ui.mirrorUD}
          onStart={() => {
            inkUpdateLoggedRef.current = false
            setDrawing(true)
          }}
          onTexture={(tex) => {
            try {
              updateInkTexture(tex)
              if (drawing && !inkUpdateLoggedRef.current) {
                console.log('[PC] ink tex updated')
                inkUpdateLoggedRef.current = true
              }
            } catch {
              // Ignore uniform update failures to keep drawing resilient
            }
          }}
          onEnd={(info) => {
            setDrawing(false)
            inkUpdateLoggedRef.current = false
            if (info.type === 'stroke') {
              try {
                startCascade?.([1, 1, 1])
              } catch {
                // Ignore cascade trigger failures
              }
            }
          }}
        />
        <CameraSync
          fovDeg={ui.fovDeg}
          fitRequest={fitRequest}
          fitRadius={cameraCoverRadius}
          fitMargin={simActive ? 0.9 : 0.78}
          fitTarget={cameraFitTarget}
          fitMode={simActive ? 'fit' : 'cover'}
        />
        <DreamdustTicker tick={tick} />
        <SimDriver
          simRef={simRef}
          active={simActive}
          uniforms={uniforms}
          material={prebakedMaterial}
        />
        <ambientLight intensity={1} />
        <directionalLight position={[2, 3, 4]} intensity={0.6} />
        {/* Prefer prebaked VGGT positions if present; gate fallback until checked */}
        {prebaked && prebakedMaterial ? (
          <group
            position={
              prebakedTransform
                ? [
                    -prebakedTransform.center[0] * prebakedTransform.scale,
                    -prebakedTransform.center[1] * prebakedTransform.scale,
                    -prebakedTransform.center[2] * prebakedTransform.scale,
                  ]
                : [0, 0, 0]
            }
            scale={
              prebakedTransform
                ? [prebakedTransform.scale, prebakedTransform.scale, prebakedTransform.scale]
                : [1, 1, 1]
            }
            quaternion={appliedQuaternion ?? prebakedTransform?.rotationQuat}
            matrixAutoUpdate
          >
            <group scale={mirrorScale}>
              <group scale={[1, 1, thicknessScale]}>
                <points frustumCulled={false} renderOrder={1}>
                  <bufferGeometry>
                    <bufferAttribute
                      attach="attributes-position"
                      args={[
                        simActive && simState
                          ? simState.positions
                          : (renderBuffers?.positions ??
                            prebaked?.positions ??
                            new Float32Array(0)),
                        3,
                      ]}
                    />
                    {stageUvDepth && (
                      <>
                        {/* custom uv for ink/reveal */}
                        {/** @ts-expect-error attachObject is supported at runtime */}
                        <bufferAttribute
                          attachObject={['attributes', 'aUv']}
                          args={[stageUvDepth.uvs, 2]}
                        />
                        {/* also bind built-in uv for fragment-only path parity */}
                        <bufferAttribute attach="attributes-uv" args={[stageUvDepth.uvs, 2]} />
                        {/* normalized depth across AABB */}
                        {/** @ts-expect-error attachObject is supported at runtime */}
                        <bufferAttribute
                          attachObject={['attributes', 'aDepth']}
                          args={[stageUvDepth.depths01, 1]}
                        />
                        {simActive && simState && (
                          // @ts-expect-error aSimUv attribute binding
                          <bufferAttribute
                            attachObject={['attributes', 'aSimUv']}
                            args={[simState.simUvs, 2]}
                          />
                        )}
                      </>
                    )}
                    {(() => {
                      if (simActive && simState) {
                        return (
                          <bufferAttribute
                            attach="attributes-color"
                            args={[simState.positions, 3]}
                          />
                        )
                      }
                      const src = renderBuffers?.colors ?? recolored ?? null
                      const posCount = Math.floor(
                        (renderBuffers?.positions ?? prebaked.positions).length / 3
                      )
                      const ok = src && Math.floor(src.length / 3) === posCount
                      return ok ? (
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore normalized byte colors
                        <bufferAttribute attach="attributes-color" args={[src, 3, true]} />
                      ) : null
                    })()}
                  </bufferGeometry>
                  <primitive object={prebakedMaterial} attach="material" />
                </points>
              </group>
            </group>
          </group>
        ) : prebakedStatus === 'absent' && fallbackMaterial && readyPacked ? (
          <PointsMesh
            colorImage={{ data: color.data!, width: color.width, height: color.height }}
            depth16={{ data16: packed.data16!, width: packed.width, height: packed.height }}
            stride={stride}
            pointBudget={pointBudget}
            material={fallbackMaterial}
            uniforms={uniforms}
            onMaterialValid={() => setBloomEnabled(bloomActive)}
            onInstancesReady={logInstances}
          />
        ) : prebakedStatus === 'absent' && fallbackMaterial ? (
          readyFallback && (
            <PointsMesh
              colorImage={{ data: color.data!, width: color.width, height: color.height }}
              depth16={depth16From8!}
              stride={stride}
              pointBudget={pointBudget}
              material={fallbackMaterial}
              uniforms={uniforms}
              onMaterialValid={() => setBloomEnabled(bloomActive)}
              onInstancesReady={logInstances}
            />
          )
        ) : null}
        <SceneControls
          radius={prebakedTransform ? prebakedTransform.radius : undefined}
          drawing={drawing}
        />
        {bloomEnabled && !simEnabled && (
          <BloomPass
            strength={BLOOM_SETTINGS.strength}
            radius={BLOOM_SETTINGS.radius}
            threshold={BLOOM_SETTINGS.threshold}
          />
        )}
      </Canvas>
      {debugVisible && (
        <div
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            background: 'rgba(0,0,0,0.55)',
            color: '#fff',
            fontSize: 12,
            padding: '10px 12px',
            borderRadius: 8,
            pointerEvents: 'auto',
            // Ensure debug UI renders above InkField overlay and page overlays
            zIndex: 4,
            width: 220,
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 6 }}>PC Debug</div>
          <div style={{ display: 'grid', rowGap: 8 }}>
            <div>
              prebaked:{' '}
              {renderBuffers
                ? `${renderBuffers.keptCount.toLocaleString()} / ${renderBuffers.cap.toLocaleString()}`
                : prebaked
                  ? `${prebaked.count.toLocaleString()} / ${pointBudget.toLocaleString()}`
                  : '—'}
            </div>
            <label>
              thickness: {ui.thickness.toFixed(2)}
              <input
                type="range"
                min={0.05}
                max={1}
                step={0.01}
                value={ui.thickness}
                onChange={(e) => setUi((s) => ({ ...s, thickness: Number(e.target.value) }))}
              />
            </label>
            <label>
              pointSize: {ui.pointSizeScale.toFixed(2)}
              <input
                type="range"
                min={0.8}
                max={3}
                step={0.01}
                value={ui.pointSizeScale}
                onChange={(e) => setUi((s) => ({ ...s, pointSizeScale: Number(e.target.value) }))}
              />
            </label>
            <label>
              keepRatio: {ui.keepRatio.toFixed(2)}
              <input
                type="range"
                min={0.2}
                max={1}
                step={0.01}
                value={ui.keepRatio}
                onChange={(e) => setUi((s) => ({ ...s, keepRatio: Number(e.target.value) }))}
              />
            </label>
            <button
              type="button"
              onClick={() => setFitRequest((n) => n + 1)}
              style={{
                padding: '6px 8px',
                borderRadius: 6,
                border: '1px solid rgba(255,255,255,0.25)',
                background: 'rgba(255,255,255,0.08)',
                color: '#fff',
                fontWeight: 600,
                cursor: 'pointer',
                width: '100%',
              }}
            >
              Fit
            </button>
            <label>
              fov: {Math.round(ui.fovDeg)}°
              <input
                type="range"
                min={10}
                max={100}
                step={1}
                value={ui.fovDeg}
                onChange={(e) => setUi((s) => ({ ...s, fovDeg: Number(e.target.value) }))}
              />
            </label>
            <label>
              reveal: {ui.reveal.toFixed(2)}
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={ui.reveal}
                onChange={(e) => setUi((s) => ({ ...s, reveal: Number(e.target.value) }))}
              />
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="checkbox"
                checked={ui.bloom}
                onChange={(e) => setUi((s) => ({ ...s, bloom: e.target.checked }))}
              />
              bloom
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="checkbox"
                checked={!!ui.flipUp}
                onChange={(e) => setUi((s) => ({ ...s, flipUp: e.target.checked }))}
              />
              flipUp (invert Y)
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="checkbox"
                checked={!!ui.flipNormal}
                onChange={(e) => setUi((s) => ({ ...s, flipNormal: e.target.checked }))}
              />
              flipNormal (front/back)
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="checkbox"
                checked={!!ui.mirrorLR}
                onChange={(e) => setUi((s) => ({ ...s, mirrorLR: e.target.checked }))}
              />
              mirrorLR (left/right)
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="checkbox"
                checked={!!ui.mirrorUD}
                onChange={(e) => setUi((s) => ({ ...s, mirrorUD: e.target.checked }))}
              />
              mirrorUD (up/down)
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="checkbox"
                checked={!!ui.roll180}
                onChange={(e) => setUi((s) => ({ ...s, roll180: e.target.checked }))}
              />
              roll180 (rotate Z)
            </label>
            {process.env.NODE_ENV !== 'production' && (debugFlags.simStats || debugFlags.inkStats) ? (
              <DebugHud
                simEnabled={debugFlags.simStats}
                simSnapshot={simSnapshot}
                inkEnabled={debugFlags.inkStats}
                inkSnapshot={inkSnapshot}
              />
            ) : null}
          </div>
        </div>
      )}
    </div>
  )
}

function CameraSync({
  fovDeg,
  distance,
  fitRequest,
  fitRadius,
  fitMargin = 0.95,
  fitTarget,
  fitMode = 'fit',
}: {
  fovDeg: number
  distance?: number
  fitRequest?: number
  fitRadius?: number
  fitMargin?: number
  fitTarget?: [number, number, number]
  fitMode?: 'fit' | 'cover'
}) {
  const { camera } = useThree()
  React.useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera
    if (cam && typeof cam.fov === 'number') {
      cam.fov = fovDeg
      cam.updateProjectionMatrix()
    }
  }, [camera, fovDeg])
  React.useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera
    if (distance && isFinite(distance)) {
      cam.position.set(0, 0, distance)
      cam.updateProjectionMatrix()
    }
  }, [camera, distance, fitMargin, fitRadius])
  React.useEffect(() => {
    if (!fitTarget) return
    const cam = camera as THREE.PerspectiveCamera
    if (!cam || cam.isPerspectiveCamera !== true) return
    const targetVec = new THREE.Vector3(fitTarget[0], fitTarget[1], fitTarget[2])
    const data = cam.userData as { target?: THREE.Vector3 }
    data.target = targetVec.clone()
  }, [camera, fitTarget])
  React.useEffect(() => {
    if (!fitRequest || !fitRadius || fitRadius <= 0) return
    const cam = camera as THREE.PerspectiveCamera
    if (!cam || cam.isPerspectiveCamera !== true) return
    if (fitTarget) {
      const targetVec = new THREE.Vector3(fitTarget[0], fitTarget[1], fitTarget[2])
      const data = cam.userData as { target?: THREE.Vector3; fitTarget?: THREE.Vector3 }
      data.target = targetVec.clone()
      data.fitTarget = targetVec.clone()
    }
    const margin = typeof fitMargin === 'number' ? fitMargin : undefined
    const distanceResult =
      fitMode === 'cover'
        ? applyPerspectiveCover(cam, fitRadius, margin)
        : applyPerspectiveFit(cam, fitRadius, margin)
    if (process.env.NODE_ENV !== 'production') {
      try {
        console.info('[dreamdust] cover-fit', {
          mode: fitMode,
          radius: Number(fitRadius.toFixed(3)),
          margin: Number((margin ?? 1).toFixed(3)),
          distance: Number((distanceResult ?? 0).toFixed(3)),
          fov: Number(cam.fov.toFixed(3)),
          aspect: Number(cam.aspect.toFixed(3)),
        })
      } catch {
        /* noop */
      }
    }
  }, [camera, fitRequest, fitRadius, fitMargin, fitTarget, fitMode])
  return null
}
