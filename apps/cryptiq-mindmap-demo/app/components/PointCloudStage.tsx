/* eslint-disable no-console, @typescript-eslint/no-explicit-any */
'use client'

import { Canvas, useFrame, useThree, invalidate } from '@react-three/fiber'
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
// import { getR3FStateOrNull } from './anim/r3fSafe'
import { createDreamdustMaterial } from './dreamdust/DreamdustMaterial'
import { getDebugFlags } from './dreamdust/debug/getDebugFlags'
import { useDebugControls, type DreamdustAestheticPreset } from './dreamdust/debug/useDebugControls'
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
import type { VertexTelemetryCollector } from './dreamdust/telemetry/vertexTelemetry'
import { PresetAiry } from './dreamdust/presets'
import {
  capInstances,
  clampDPR,
  decimateInterleaved,
  detectMobile,
  pointCap,
} from './pointcloud/budget'
import { ParticleSim } from './dreamdust/sim/ParticleSim'
import { FluidSim } from './dreamdust/fluid/FluidSim'
import DebugHud from './dreamdust/ui/DebugHud'
import { createVertexTelemetryCollector } from './dreamdust/telemetry'

const TEMP_FORCE_DECAY = 0.92
const TEMP_FORCE_SCALE = 220
const TEMP_FORCE_CLAMP = 12
const _CANVAS_DEBUG_READBACK = process.env.NEXT_PUBLIC_DEBUG_CANVAS === '1'
const DREAMDUST_DEBUG_ENV = process.env.NEXT_PUBLIC_DREAMDUST_DEBUG === '1'
const DD_DEBUG_QUERY_KEY = 'ddDebug'
const TARGET_TEMP_RADIUS = 0.14
const AFTER_REVEAL_LOG_TAG = '[PC] uniforms after-reveal'
const FLUID_GRID_SIZE = 256
const FLUID_JACOBI_ITERS = 10
const FLUID_BASE_VEL_TO_NDC = 0.028
const FLUID_BASE_INK_BLEND = 0.78
const FLUID_DEBUG_VEL_TO_NDC = 0.045
const FLUID_DEBUG_INK_BLEND = 1.0
const RENDER_CALL_LOG_LIMIT = 6
const SCENE_TRAVERSAL_LOG_LIMIT = 8
const RENDER_LIST_SAMPLE_LIMIT = 12
const FLUID_DRIVER_DISABLED_FOR_DIAGNOSTIC = true
const CAMERA_DIAGNOSTIC_ACTIVE = true

type PointCloudStageProps = {
  sceneId?: string
  colorUrl?: string
  depthUrl?: string
  depthRgUrl?: string
  zScale?: number
  pointSize?: number
  stride?: number
  perspective?: boolean
  controlsOverride?: boolean
  cinematicMode?: boolean
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

type SetUniformFn = ReturnType<typeof useDreamdustUniforms>['setUniform']

type DreamdustStageUniformsWithReveal = DreamdustStageUniforms & {
  uReveal?: { value: number }
}

type TempForceDriverProps = {
  tempForceRef: React.MutableRefObject<[number, number]>
  tempIntensityRef: React.MutableRefObject<number>
  setUniform: SetUniformFn
  frameIndexRef: React.MutableRefObject<number>
}

 
function TempForceDriver({ tempForceRef, tempIntensityRef, setUniform, frameIndexRef }: TempForceDriverProps) {
  useFrame((_, delta) => {
    const current = tempIntensityRef.current
    if (current <= 1e-4) {
      if (current !== 0) {
        tempIntensityRef.current = 0
        setUniform('uTempIntensity', 0)
      }
      return
    }
    const frameDecay = Math.pow(TEMP_FORCE_DECAY, delta * 60)
    const next = current * frameDecay
    if (next <= 1e-4) {
      tempIntensityRef.current = 0
      setUniform('uTempIntensity', 0)
      return
    }
    tempIntensityRef.current = next
    setUniform('uTempForce', tempForceRef.current)
    setUniform('uTempIntensity', next)

    // Motion probe: record first frame index with non-trivial intensity after a pointer start
    try {
       
      const w: any = typeof window !== 'undefined' ? (window as any) : null
      if (w && w.__inkProbe && w.__inkProbe.startFrameIndex != null && w.__inkProbe.firstVisibleFrameIndex == null) {
        if (next > 1e-4) {
          const fi = frameIndexRef.current || 0
          w.__inkProbe.firstVisibleFrameIndex = Math.max(0, fi - (w.__inkProbe.startFrameIndex as number))
        }
      }
    } catch {
      /* noop */
    }
  })

  return null
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

type BloomSettings = {
  strength: number
  radius: number
  threshold: number
}

const DEFAULT_BLOOM_SETTINGS: BloomSettings = {
  strength: 0.2,
  radius: 0.4,
  threshold: 0.8,
}

const BLOOM_PRESET_SETTINGS: Record<DreamdustAestheticPreset, BloomSettings> = {
  current: DEFAULT_BLOOM_SETTINGS,
  A: { ...DEFAULT_BLOOM_SETTINGS },
  B1: { strength: 0.65, radius: 0.4, threshold: 0.6 },
  B2: { strength: 0.65, radius: 0.4, threshold: 0.6 },
  C: { strength: 0.45, radius: 0.5, threshold: 0.7 },
  D1: { strength: 0.35, radius: 0.5, threshold: 0.3 },  // Moderate threshold for selective bloom
  D2: { strength: 0.5, radius: 0.5, threshold: 0.6 },
}

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

function FluidDriver({
  fluidRef,
  uniforms,
  velToNdc,
  inkBlend,
}: {
  fluidRef: React.MutableRefObject<FluidSim | null>
  uniforms: DreamdustStageUniforms
  velToNdc: number
  inkBlend: number
}) {
  const frameloop = useThree((state) => state.frameloop)
  const skipLogRef = React.useRef(false)
  const disableFluidStep = React.useMemo(() => {
    if (FLUID_DRIVER_DISABLED_FOR_DIAGNOSTIC) return true
    if (typeof window === 'undefined') return false
    try {
      const params = new URLSearchParams(window.location.search)
      return params.get('disableFluidStep') === '1'
    } catch {
      return false
    }
  }, [])
  React.useEffect(() => {
    if (frameloop === 'demand') {
      invalidate()
    }
  }, [frameloop])
  useFrame(
    (state, delta) => {
      const sim = fluidRef.current
      if (!sim) return
      if (disableFluidStep) {
        if (!skipLogRef.current) {
          try {
            console.info('[PC] fluid-step skipped', { reason: 'diagnostic-disable' })
          } catch {
            /* noop */
          }
          skipLogRef.current = true
        }
        if (frameloop === 'demand') {
          invalidate()
        }
        return
      }
      sim.step(delta)
      const texture = sim.getTexture()
      if (uniforms?.uVelocity && uniforms.uVelocity.value !== texture) {
        uniforms.uVelocity.value = texture
      }
      const inv = sim.getInvSize()
      if (uniforms?.uVelTexInvSize && Array.isArray(uniforms.uVelTexInvSize.value)) {
        const target = uniforms.uVelTexInvSize.value as [number, number]
        target[0] = inv[0]
        target[1] = inv[1]
      }
      if (uniforms?.uVelToNdc) {
        uniforms.uVelToNdc.value = velToNdc
      }
      if (uniforms?.uInkBlend) {
        uniforms.uInkBlend.value = inkBlend
      }
      if (frameloop === 'demand') {
        invalidate()
      }
    },
    1,
  )
  return null
}

function RenderInfoLogger({
  forceVisible,
  stagePointsRef,
  uniforms,
  debugActive,
  updateDebugState,
}: {
  forceVisible: boolean
  stagePointsRef: React.MutableRefObject<THREE.Points | null>
  uniforms: DreamdustStageUniforms
  debugActive: boolean
  updateDebugState: (patch: Record<string, unknown>) => void
}) {
  const renderer = useThree((state) => state.gl)
  const loggedRef = React.useRef(false)
  const meshLoggedRef = React.useRef(false)
  const frameCountRef = React.useRef(0)
  const MAX_FRAMES = 60
  const stagePointsMissingFramesRef = React.useRef(0)
  const stagePointsMissingLoggedRef = React.useRef(false)
  const buildMeshSnapshot = React.useCallback((points: THREE.Points) => {
    const rawMaterial = (points as { material?: THREE.Material | THREE.Material[] }).material
    const material = Array.isArray(rawMaterial) ? rawMaterial[0] ?? null : rawMaterial ?? null
    const geometry = points.geometry as THREE.BufferGeometry | undefined
    const readAttrCount = (name: string) => {
      const attr = geometry?.getAttribute(name) as { count?: number } | undefined
      return typeof attr?.count === 'number' ? attr.count : 0
    }
    let matrixWorldDet: number | null = null
    if (points.matrixWorld) {
      const matrix3 = new (THREE as any).Matrix3()
      matrix3.setFromMatrix4(points.matrixWorld)
      const det = matrix3.determinant()
      matrixWorldDet = Number.isFinite(det) ? det : null
    }
    return {
      type: points.type,
      visible: points.visible,
      frustumCulled: points.frustumCulled,
      renderOrder: points.renderOrder,
      parentType: points.parent?.type ?? null,
      matrixWorldDet,
      positionCount: readAttrCount('position'),
      colorCount: readAttrCount('color'),
      uvCount: readAttrCount('uv'),
      depthCount: readAttrCount('aDepth'),
      materialUuid: material && typeof (material as any).uuid === 'string' ? (material as any).uuid : null,
    }
  }, [])

  useFrame(() => {
    if (!forceVisible || loggedRef.current) {
      return
    }
    const points = stagePointsRef.current
    if (!renderer || !points) {
      return
    }

    frameCountRef.current += 1

    const info = renderer.info?.render
    const rawMaterial = (points as { material?: THREE.Material | THREE.Material[] }).material
    const material = Array.isArray(rawMaterial) ? rawMaterial[0] ?? null : rawMaterial ?? null
    const programCacheKey =
      material && typeof (material as any).customProgramCacheKey === 'function'
        ? (material as any).customProgramCacheKey()
        : null

    const readUniformValue = (name: keyof DreamdustStageUniforms): unknown => {
      const entry = uniforms[name]
      if (entry && typeof entry === 'object' && 'value' in entry) {
        return (entry as { value: unknown }).value
      }
      return null
    }

    const uniformSnapshot = {
      uPointBaseSize: readUniformValue('uPointBaseSize'),
      uMinSize: readUniformValue('uMinSize'),
      uMaxSize: readUniformValue('uMaxSize'),
      uAlphaFloor: readUniformValue('uAlphaFloor'),
      uVelToNdc: readUniformValue('uVelToNdc'),
      uInkBlend: readUniformValue('uInkBlend'),
      uDepthNormScale: readUniformValue('uDepthNormScale'),
      uDepthBias: readUniformValue('uDepthBias'),
    }

    const calls = info?.calls ?? null
    const memory = renderer.info?.memory ?? null
    const haveDraws = typeof calls === 'number' && calls > 0
    const timedOut = frameCountRef.current >= MAX_FRAMES

    if (haveDraws || timedOut) {
      if (!meshLoggedRef.current) {
        try {
          console.info('[PC] points-mesh', buildMeshSnapshot(points))
        } catch {
          /* noop */
        }
        meshLoggedRef.current = true
      }
      if (!haveDraws && timedOut) {
        try {
          console.info('[PC] render-timeout', {
            framesWaited: frameCountRef.current,
            timestamp: Date.now(),
          })
        } catch {
          /* noop */
        }
      }
      try {
        console.info('[PC] render-info', {
          calls,
          points: info?.points ?? null,
          triangles: info?.triangles ?? null,
          memory,
          mat: material
            ? {
                uuid: (material as any).uuid,
                blending: (material as any).blending ?? null,
                depthTest: (material as any).depthTest ?? null,
                depthWrite: (material as any).depthWrite ?? null,
                programCacheKey,
              }
            : null,
          uniforms: uniformSnapshot,
          timeout: !haveDraws,
          framesWaited: frameCountRef.current,
          timestamp: Date.now(),
        })
      } catch {
        /* noop */
      }
      updateDebugState({
        lastRenderInfo: {
          calls,
          points: info?.points ?? null,
          triangles: info?.triangles ?? null,
          memory,
          timeout: !haveDraws,
          framesWaited: frameCountRef.current,
        },
      })

      loggedRef.current = true
    }
  })

  useFrame(() => {
    if (!debugActive || stagePointsMissingLoggedRef.current) {
      return
    }
    if (stagePointsRef.current) {
      stagePointsMissingLoggedRef.current = true
      return
    }
    stagePointsMissingFramesRef.current += 1
    if (stagePointsMissingFramesRef.current > 2) {
      stagePointsMissingLoggedRef.current = true
      try {
        console.warn('[PC] stage-points-missing', {
          framesElapsed: stagePointsMissingFramesRef.current,
          forceVisible,
        })
      } catch {
        /* noop */
      }
    }
  })

  return null
}

function CameraDiag({
  enabled,
  target,
  radius,
}: {
  enabled: boolean
  target: [number, number, number]
  radius: number
}) {
  const { camera } = useThree()
  const loggedRef = React.useRef(false)
  const tmpMatrixRef = React.useRef(new (THREE as any).Matrix4())
  const tmpFrustumRef = React.useRef(new (THREE as any).Frustum())
  const tmpSphereRef = React.useRef(new (THREE as any).Sphere(new (THREE as any).Vector3(), 1))
  const targetVecRef = React.useRef(new (THREE as any).Vector3())

  useFrame(() => {
    if (!enabled) return
    if (loggedRef.current) return
    const cam: any = camera
    if (!cam) return
    try {
      cam.updateMatrixWorld?.()
    } catch {
      /* noop */
    }
    let positionArray: [number, number, number] | null = null
    if (cam.position && typeof cam.position.toArray === 'function') {
      positionArray = cam.position.toArray(new Array(3)) as [number, number, number]
    } else if (cam.position) {
      positionArray = [cam.position.x ?? 0, cam.position.y ?? 0, cam.position.z ?? 0]
    }
    const near = typeof cam.near === 'number' ? cam.near : null
    const far = typeof cam.far === 'number' ? cam.far : null
    const fov = typeof cam.fov === 'number' ? cam.fov : null
    targetVecRef.current.set(target[0], target[1], target[2])
    const targetArray = [targetVecRef.current.x, targetVecRef.current.y, targetVecRef.current.z]
    let distance: number | null = null
    if (cam.position && typeof cam.position.distanceTo === 'function') {
      distance = cam.position.distanceTo(targetVecRef.current)
    }
    let intersects = false
    try {
      const projScreenMatrix = tmpMatrixRef.current
      const frustum = tmpFrustumRef.current
      const sphere = tmpSphereRef.current
      projScreenMatrix.multiplyMatrices(cam.projectionMatrix, cam.matrixWorldInverse)
      frustum.setFromProjectionMatrix(projScreenMatrix)
      sphere.center.copy(targetVecRef.current)
      sphere.radius = Math.max(radius, 1e-3)
      intersects = frustum.intersectsSphere(sphere)
    } catch {
      intersects = false
    }
    try {
      console.info('[PC] camera-diag', {
        enabled,
        cameraPosition: positionArray,
        target: targetArray,
        radius,
        near,
        far,
        fov,
        distance,
        intersectsFrustum: intersects,
      })
    } catch {
      /* noop */
    }
    loggedRef.current = true
  })
  return null
}

function CameraPositionDebugger({ expectedPosition }: { expectedPosition?: [number, number, number] }) {
  const { camera } = useThree()
  const loggedRef = React.useRef(false)

  React.useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera
    if (!loggedRef.current && expectedPosition) {
      const actual = [cam.position.x, cam.position.y, cam.position.z]
      console.log('[DEBUG] Camera position check:')
      console.log('  Expected:', expectedPosition)
      console.log('  Actual:', actual)
      console.log('  Match:',
        Math.abs(actual[0] - expectedPosition[0]) < 1 &&
        Math.abs(actual[1] - expectedPosition[1]) < 1 &&
        Math.abs(actual[2] - expectedPosition[2]) < 1
      )
      loggedRef.current = true
    }
  }, [camera, expectedPosition])

  return null
}

function CameraUpEnforcer() {
  const { camera } = useThree()

  // Enforce camera up vector to prevent roll and keep horizon level
  useFrame(() => {
    const cam = camera as THREE.PerspectiveCamera
    if (cam.up.x !== 0 || cam.up.y !== 1 || cam.up.z !== 0) {
      cam.up.set(0, 1, 0)
      cam.updateProjectionMatrix()
    }
  })

  return null
}

function CameraPresetApplier({
  position,
  target,
}: {
  position: [number, number, number]
  target: [number, number, number]
}) {
  const { camera, controls } = useThree()
  const appliedRef = React.useRef(false)
  const frameCountRef = React.useRef(0)

  // Apply preset immediately in useEffect
  React.useEffect(() => {
    if (appliedRef.current) return

    const cam = camera as THREE.PerspectiveCamera
    const orbitControls = controls as any

    // Explicitly set camera position
    cam.position.set(position[0], position[1], position[2])

    // Set OrbitControls target if available
    if (orbitControls?.target) {
      orbitControls.target.set(target[0], target[1], target[2])
      orbitControls.update()
    }

    cam.updateProjectionMatrix()

    console.log('[PC] Preset applied (initial):', {
      position,
      target,
      actualPosition: [cam.position.x, cam.position.y, cam.position.z],
      actualTarget: orbitControls?.target ? [orbitControls.target.x, orbitControls.target.y, orbitControls.target.z] : null,
    })

    appliedRef.current = true
  }, [camera, controls, position, target])

  // Monitor camera position for first 60 frames and log if it changes
  useFrame(() => {
    if (frameCountRef.current >= 60) return
    frameCountRef.current++

    const cam = camera as THREE.PerspectiveCamera
    const orbitControls = controls as any
    const actualPos = [cam.position.x, cam.position.y, cam.position.z]
    const actualTgt = orbitControls?.target
      ? [orbitControls.target.x, orbitControls.target.y, orbitControls.target.z]
      : null

    const positionMatch =
      Math.abs(actualPos[0] - position[0]) < 1 &&
      Math.abs(actualPos[1] - position[1]) < 1 &&
      Math.abs(actualPos[2] - position[2]) < 1

    const targetMatch = actualTgt
      ? Math.abs(actualTgt[0] - target[0]) < 1 &&
        Math.abs(actualTgt[1] - target[1]) < 1 &&
        Math.abs(actualTgt[2] - target[2]) < 1
      : false

    if (!positionMatch || !targetMatch) {
      console.warn(`[PC] Preset drifted at frame ${frameCountRef.current}:`, {
        expected: { position, target },
        actual: { position: actualPos, target: actualTgt },
      })

      // Re-apply preset
      cam.position.set(position[0], position[1], position[2])
      if (orbitControls?.target) {
        orbitControls.target.set(target[0], target[1], target[2])
        orbitControls.update()
      }
      cam.updateProjectionMatrix()
    }
  })

  return null
}

function CameraLogger({ trigger, fitTarget }: { trigger: number; fitTarget: [number, number, number] }) {
  const { camera, controls } = useThree()

  React.useEffect(() => {
    if (trigger === 0) return // Skip initial render

    try {
      const cam = camera as THREE.PerspectiveCamera
      const orbitControls = controls as any

      // Get position from camera
      const posArr = [cam.position.x, cam.position.y, cam.position.z]

      // Get target from OrbitControls if available, otherwise from camera userData
      let tgtArr: number[]
      if (orbitControls?.target) {
        tgtArr = [orbitControls.target.x, orbitControls.target.y, orbitControls.target.z]
      } else if (cam.userData?.target) {
        const t = cam.userData.target as THREE.Vector3
        tgtArr = [t.x, t.y, t.z]
      } else {
        tgtArr = [0, 0, 0]
      }

      const fovVal = cam.fov

      const round = (n: number) => Number(n.toFixed(3))
      const P = posArr.map(round) as [number, number, number]
      const T = tgtArr.map(round) as [number, number, number]
      const F = Number(fovVal.toFixed(3))

      const preset = {
        position: P,
        target: T,
        fov: F,
      } as const

      const inline = `{"position":[${P.join(',')}],"target":[${T.join(',')}],"fov":${F}}`

      console.log('[PC] Camera preset', preset)
      console.log('[PC] Camera preset (inline):', inline)
      console.log('[PC] Fit target currently:', fitTarget)
      console.log('[PC] Camera object:', cam)
      console.log('[PC] Controls object:', orbitControls)

      try {
        void navigator.clipboard?.writeText?.(inline)
        console.log('[PC] Copied to clipboard')
      } catch {
        // clipboard may be unavailable; ignore
      }
    } catch (err) {
      console.warn('[PC] Camera logging failed', err)
    }
  }, [trigger, camera, controls, fitTarget])

  return null
}

function SceneControls({
  radius,
  drawing = false,
  target = [0, 0, 0],
  controlsOverride = false,
}: {
  radius?: number
  drawing?: boolean
  target?: [number, number, number]
  controlsOverride?: boolean
}) {
  const controlsRef = React.useRef(null)
  const { gl } = useThree()
  React.useEffect(() => {
    console.log('[PC] attach controls to', gl.domElement)
  }, [gl])
  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableRotate={controlsOverride ? true : !drawing}
      enableZoom={controlsOverride ? true : !drawing}
      enablePan={controlsOverride ? true : !drawing}
      enableDamping
      dampingFactor={0.1}
      minDistance={Math.max(0.1, radius ? radius * 0.02 : 100)}
      maxDistance={radius ? Math.max(500, radius * 10) : 5000}
      target={target}
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
    controlsOverride = false,
    cinematicMode = false,
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
  const fluidRef = React.useRef<FluidSim | null>(null)
  const velToNdcRef = React.useRef(FLUID_BASE_VEL_TO_NDC)
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
  const [fluidBoost, setFluidBoost] = React.useState(process.env.NEXT_PUBLIC_FLUID_DEBUG === '1')
  const [dreamdustDebug, setDreamdustDebug] = React.useState(DREAMDUST_DEBUG_ENV)
  const dreamdustDebugRef = React.useRef(DREAMDUST_DEBUG_ENV)
  const dreamdustDebugLogRef = React.useRef(false)
  const sentinelPoints = React.useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([0, 0, 0]), 3))
    const material = new THREE.PointsMaterial({
      size: 15,
      sizeAttenuation: false,
      color: 0xffffff,
      depthTest: false,
    })
    const points = new THREE.Points(geometry, material)
    points.name = 'debug-sentinel'
    points.frustumCulled = false
    points.renderOrder = -1000
    return points
  }, [])
  const sentinelLoggedRef = React.useRef(false)
  const [forceVisible, setForceVisible] = React.useState(false)
  const forceVisibleRef = React.useRef(false)
  React.useEffect(() => {
    let queryEnabled = false
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      if (params.get('fluidBoost') === '1') {
        setFluidBoost(true)
      } else if (params.get('fluidBoost') === '0') {
        setFluidBoost(false)
      }
      setForceVisible(params.get('forceVisible') === '1')
      queryEnabled = params.get(DD_DEBUG_QUERY_KEY) === '1'
    }
    const effectiveDebug = DREAMDUST_DEBUG_ENV || queryEnabled
    if (dreamdustDebug !== effectiveDebug) {
      setDreamdustDebug(effectiveDebug)
    }
    dreamdustDebugRef.current = effectiveDebug
    if (!dreamdustDebugLogRef.current) {
      try {
        console.info('[PC] ddDebug', {
          env: DREAMDUST_DEBUG_ENV,
          query: queryEnabled,
          effective: effectiveDebug,
          resolvedVertexInkOk: null,
        })
      } catch {
        /* noop */
      }
      dreamdustDebugLogRef.current = true
    }
    if (effectiveDebug) {
      let frame = 0
      let cancelled = false
      const pump = () => {
        if (cancelled) return
        invalidate()
        frame += 1
        if (frame < 2) {
          requestAnimationFrame(pump)
        }
      }
      pump()
      return () => {
        cancelled = true
      }
    }
    return undefined
  }, [dreamdustDebug])

  const debugCamera = useThree((state) => state.camera)
  React.useEffect(() => {
    dreamdustDebugRef.current = dreamdustDebug
  }, [dreamdustDebug])
  React.useEffect(() => {
    if (!dreamdustDebugRef.current || sentinelLoggedRef.current) {
      return
    }
    try {
      console.info('[PC] sentinel-points', { uuid: sentinelPoints.uuid })
    } catch {
      /* noop */
    }
    sentinelLoggedRef.current = true
  }, [dreamdustDebug, sentinelPoints])

  React.useEffect(() => {
    if (!dreamdustDebugRef.current) {
      return
    }
    const cam = debugCamera as THREE.PerspectiveCamera | undefined
    if (!cam) {
      return
    }
    const dir = new THREE.Vector3()
    if (typeof cam.getWorldDirection === 'function') {
      cam.getWorldDirection(dir)
    }
    if (dir.lengthSq() === 0) {
      dir.set(0, 0, -1)
    } else {
      dir.normalize()
    }
    const distance = Math.max(2, cam.position.length() * 0.05 || 5)
    sentinelPoints.position.copy(cam.position).addScaledVector(dir, -distance)
    sentinelPoints.visible = true
    sentinelPoints.frustumCulled = false
  }, [debugCamera, dreamdustDebug, sentinelPoints])
  const resolvedVelToNdc = fluidBoost ? FLUID_DEBUG_VEL_TO_NDC : FLUID_BASE_VEL_TO_NDC
  const resolvedInkBlend = fluidBoost ? FLUID_DEBUG_INK_BLEND : FLUID_BASE_INK_BLEND
  const [drawing, setDrawing] = React.useState(false)
  const [logCameraTrigger, setLogCameraTrigger] = React.useState(0)
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
    // REMOVED: setUniform('uGamma', 0.82) - now using defaults from DreamdustMaterial
    setUniform('uFocal', 1600)
    // REMOVED: setUniform('uPointBaseSize', ...) - now handled by pointSizeScale effect at line 1618
    setUniform('uMinSize', DEFAULT_POINT_SIZING.minSize)
    setUniform('uMaxSize', DEFAULT_POINT_SIZING.maxSize)
    // REMOVED: setUniform('uDepthBias', 0.14) - now using defaults from DreamdustMaterial
    setUniform('uNoiseScale', curlFreq)
    setUniform('uNoiseSpeed', 0.24)
    // Stronger contrast on first draw: halve base drift, boost ink gains
    setUniform('uDriftAmp', curlAmp)
    setUniform('uSizeGain', DEFAULT_POINT_SIZING.sizeGain)
    setUniform('uOffsetGain', Math.max(DEFAULT_POINT_SIZING.offsetGain, 7.0))
    // Make ink tinting clearly visible during validation
    setUniform('uTintGain', 1.0)
    // Increase curl amplitude so ink modulation is obvious
    setUniform('uCurlAmp', 0.6)
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

  // Initialize fluid sim after uniforms/setUniform are ready
  React.useEffect(() => {
    const renderer = rendererRef.current
    if (!renderer) {
      return undefined
    }
    try {
      const sim = new FluidSim(renderer, {
        size: FLUID_GRID_SIZE,
        iterations: FLUID_JACOBI_ITERS,
      })
      fluidRef.current = sim
      velToNdcRef.current = resolvedVelToNdc
      const inv = sim.getInvSize()
      setUniform('uVelocity', sim.getTexture() as any)
      setUniform('uVelTexInvSize', inv as unknown as [number, number])
      setUniform('uVelToNdc', resolvedVelToNdc as unknown as number)
      setUniform('uInkBlend', resolvedInkBlend as unknown as number)
      try {
        console.info('[PC] fluid uniforms prime', {
          invSize: inv,
          velToNdc: resolvedVelToNdc,
          inkBlend: resolvedInkBlend,
        })
      } catch {
        /* noop */
      }
    } catch (error) {
      console.error('[PC] fluid init failed', error)
    }
    return () => {
      const sim = fluidRef.current
      if (sim) {
        sim.dispose()
      }
      fluidRef.current = null
    }
   
  }, [rendererReadyTick, setUniform])
  // Note: fallbackMaterial/prebakedMaterial accessed inside but not in deps to avoid TDZ

  React.useEffect(() => {
    velToNdcRef.current = resolvedVelToNdc
    setUniform('uVelToNdc', resolvedVelToNdc as unknown as number)
    setUniform('uInkBlend', resolvedInkBlend as unknown as number)
  }, [resolvedVelToNdc, resolvedInkBlend, setUniform])

  const dreamdustCtx = useOptionalDreamdustCtx()
  const startCascade = dreamdustCtx?.startCascade
  const inkTex = dreamdustCtx?.inkTex ?? null
  const inkIntensity = dreamdustCtx?.inkIntensity ?? 1
  // Hardware capability for vertex texture fetch
  const vertexInkCaps = dreamdustCtx?.vertexInkOk ?? runtimeCaps?.vertexInkOk ?? false
  // For scene-03, force fragment screen-space ink sampling for alignment with screen-space painter
  const vertexInkEnabled = sceneId === 'scene-03' ? false : vertexInkCaps
  const tempForceRef = React.useRef<[number, number]>([0, 0])
  const tempIntensityRef = React.useRef(0)
  // Dev-only visibility boost for temp force, gated by URL (?inkboost=1 or a number like 1.8)
  const inkBoostRef = React.useRef(1)
  // Reverted: remove temp center/radius for Phase A global offset
  const debugFlagDefaults = React.useMemo(() => getDebugFlags(), [])
  const { flags: debugFlags, simSnapshot, inkSnapshot, aestheticPreset, setAestheticPreset } =
    useDebugControls(debugFlagDefaults)
  const debugInkProbe = debugFlags.inkProbe
  const debugSimProbe = debugFlags.simProbe
  const debugForceAlpha = debugFlags.forceAlpha
  const debugVertexLog = debugFlags.vertexLog
  const telemetryCollectorRef = React.useRef<VertexTelemetryCollector | null>(null)
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

  const falloffRequestedRef = React.useRef(false)
  const falloffLatchAppliedRef = React.useRef(false)
  // Dev flag: enable temp falloff from URL (?falloff=1)
  React.useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const params = new URLSearchParams(window.location.search)
      const falloffRequested = params.get('falloff') === '1'
      falloffRequestedRef.current = falloffRequested
      if (falloffRequested) {
        falloffLatchAppliedRef.current = false
        setUniform('uTempCenter', [0.5, 0.5] as unknown as any)
      }
      const boostParam = params.get('inkboost')
      if (boostParam) {
        const parsed = Number(boostParam)
        if (Number.isFinite(parsed) && parsed > 0) {
          inkBoostRef.current = parsed
        } else {
          // default boost when present but not numeric
          inkBoostRef.current = 1.8
        }
      } else {
        inkBoostRef.current = 1
      }
    } catch {
      /* noop */
    }
  }, [setUniform])

  const applyFalloffFlagIfRequested = React.useCallback(() => {
    if (!falloffRequestedRef.current) return
      try {
      const uniformsAny = uniforms as any
      const flag = uniformsAny?.uTempFalloffOn?.value ?? 0
      if (flag < 0.5) {
        setUniform('uTempFalloffOn', 1)
      }
      setUniform('uTempCenter', uniformsAny?.uTempCenter?.value ?? [0.5, 0.5])
    } catch {
      /* noop */
    }
  }, [setUniform, uniforms])

  React.useEffect(() => {
    setUniform('uTempForce', tempForceRef.current)
    setUniform('uTempIntensity', 0)
    applyFalloffFlagIfRequested()
  }, [setUniform, applyFalloffFlagIfRequested])

  // Debug: expose a lightweight uniform dump helper (window.dreamdust.dumpUniforms())
  React.useEffect(() => {
    if (typeof window === 'undefined') return
    const w = window as any
    w.dreamdust = w.dreamdust || {}
    w.dreamdust.dumpUniforms = () => {
      const u: any = uniforms
      try {
        console.log('[dreamdust uniforms]', {
          uTempForce: u?.uTempForce?.value,
          uTempIntensity: u?.uTempIntensity?.value,
          uTempCenter: u?.uTempCenter?.value,
          uTempRadius: u?.uTempRadius?.value,
          uTempFalloffOn: u?.uTempFalloffOn?.value,
        })
      } catch {
        /* noop */
      }
    }
    w.dreamdust.ensureFalloff = () => {
      const u: any = uniforms
      try {
        if (u?.uTempFalloffOn?.value < 0.5) {
          setUniform('uTempFalloffOn', 1)
        }
        // radius owned by post-reveal effect; avoid early-frame overrides here
        if (!u?.uTempCenter?.value) {
          setUniform('uTempCenter', [0.5, 0.5] as unknown as any)
        }
      } catch {
        /* noop */
      }
    }
  }, [setUniform, uniforms])

  const applyTempForce = React.useCallback(
    (sample: { delta: [number, number]; uv: [number, number] }) => {
      const { delta, uv } = sample
      const [u, v] = uv
      const [dx, dy] = delta
      if (!Number.isFinite(dx) || !Number.isFinite(dy)) {
        return
      }
      const clampForce = (value: number) =>
        Math.max(-TEMP_FORCE_CLAMP, Math.min(TEMP_FORCE_CLAMP, value))
      const scale = TEMP_FORCE_SCALE * (inkBoostRef.current || 1)
      const fx = clampForce(dx * scale)
      const fy = clampForce(-dy * scale)
      const magnitude = Math.hypot(fx, fy)
      try {
        // Diagnostic: force computation snapshot before thresholds/returns
        console.warn('[PC] force compute', {
          dx,
          dy,
          fx,
          fy,
          magnitude,
          intensityCandidate: Math.min(1, magnitude / TEMP_FORCE_CLAMP),
          clamp: TEMP_FORCE_CLAMP,
          scale,
        })
      } catch {
        /* noop */
      }
      if (magnitude <= 1e-6) {
        return
      }
      tempForceRef.current = [fx, fy]
      const intensity = Math.min(1, magnitude / TEMP_FORCE_CLAMP)
      tempIntensityRef.current = Math.max(intensity, tempIntensityRef.current * 0.5)
      setUniform('uTempForce', tempForceRef.current)
      setUniform('uTempIntensity', tempIntensityRef.current)
      setUniform('uTempCenter', [u, v] as unknown as any)
      try {
        const uAny: any = uniforms
        console.warn('[PC] force uniforms write', {
          uTempIntensity: uAny?.uTempIntensity?.value,
          uTempForce: uAny?.uTempForce?.value,
          center: [u, v],
        })
        requestAnimationFrame(() => {
          try {
            const uPost: any = uniforms
            console.warn('[PC] intensity post-rAF', {
              uTempIntensity: uPost?.uTempIntensity?.value,
            })
          } catch {
            /* noop */
          }
        })
      } catch {
        /* noop */
      }
    },
    [setUniform],
  )

  React.useEffect(() => {
    setUniform('uVertexInkOk', vertexInkEnabled ? 1 : 0)
  }, [setUniform, vertexInkEnabled])

  const fallbackMaterial = React.useMemo(() => {
    if (!runtimeCaps) return null
    const material = createDreamdustMaterial(uniforms, {
      unproject: true,
      vertexInkOk: vertexInkEnabled,
      debugInkProbe,
      debugSimProbe,
      debugForceAlpha,
      debugVertexLog,
      aestheticPreset,
    })
    const defines = material.defines ?? {}
    const vertexInkDefine = runtimeCaps.vertexInkOk ? 1 : 0
    defines.VERTEX_INK_OK = vertexInkDefine
    if (vertexInkDefine) {
      defines.USE_VERTEX_INK = 1
    } else {
      delete defines.USE_VERTEX_INK
    }
    const velocityDispDefine = vertexInkEnabled || dreamdustDebug ? 1 : 0
    if (velocityDispDefine) {
      defines.USE_VELOCITY_DISP = 1
    } else {
      delete defines.USE_VELOCITY_DISP
    }
    material.defines = defines
    material.needsUpdate = true
    return material
  }, [
    aestheticPreset,
    debugForceAlpha,
    debugInkProbe,
    debugSimProbe,
    debugVertexLog,
    runtimeCaps,
    uniforms,
  ])

  // (moved after-reveal initialization into the reveal-start effect below)
  const prebakedMaterial = React.useMemo(() => {
    if (!runtimeCaps) return null
    const material = createDreamdustMaterial(uniforms, {
      unproject: false,
      vertexInkOk: vertexInkEnabled,
      debugInkProbe,
      debugSimProbe,
      debugForceAlpha,
      debugVertexLog,
      aestheticPreset,
    })
    const defines = material.defines ?? {}
    const vertexInkDefine = runtimeCaps.vertexInkOk ? 1 : 0
    defines.VERTEX_INK_OK = vertexInkDefine
    if (vertexInkDefine) {
      defines.USE_VERTEX_INK = 1
    } else {
      delete defines.USE_VERTEX_INK
    }
    const velocityDispDefine = vertexInkEnabled || dreamdustDebug ? 1 : 0
  if (velocityDispDefine) {
    defines.USE_VELOCITY_DISP = 1
  } else {
    delete defines.USE_VELOCITY_DISP
  }
    material.defines = defines
    material.needsUpdate = true
    return material
  }, [
    aestheticPreset,
    debugForceAlpha,
    debugInkProbe,
    debugSimProbe,
    debugVertexLog,
    runtimeCaps,
    uniforms,
  ])

  React.useEffect(() => {
    const sim = fluidRef.current
    if (!sim) return
    const texture = sim.getTexture()
    const inv = sim.getInvSize()
    const applyUniforms = (material?: THREE.ShaderMaterial | null) => {
      if (!material) return
      const u = material.uniforms as Record<string, { value: unknown }> | undefined
      if (!u) return
      if (u.uVelocity) {
        u.uVelocity.value = texture
      }
      if (u.uVelTexInvSize) {
        const target = u.uVelTexInvSize.value as [number, number]
        if (Array.isArray(target) && target.length >= 2) {
          target[0] = inv[0]
          target[1] = inv[1]
        } else {
          u.uVelTexInvSize.value = inv
        }
      }
      if (u.uVelToNdc) {
        u.uVelToNdc.value = resolvedVelToNdc
      }
      if (u.uInkBlend) {
        u.uInkBlend.value = resolvedInkBlend
      }
    }
    applyUniforms(fallbackMaterial)
    applyUniforms(prebakedMaterial)
  }, [fallbackMaterial, prebakedMaterial, resolvedVelToNdc, resolvedInkBlend, fluidRef])

  React.useEffect(() => {
    if (!forceVisible) {
      return
    }
    try {
      setUniform('uReveal', 1)
      setUniform('uAlphaFloor', 1)
      setUniform('uPointBaseSize', 8)
      setUniform('uMinSize', 4)
      setUniform('uMaxSize', 14)
      const uAny: any = uniforms
      console.info('[PC] forceVisible uniforms', {
        uReveal: uAny?.uReveal?.value ?? 'TBD',
        uAlphaFloor: uAny?.uAlphaFloor?.value ?? 'TBD',
        uPointBaseSize: uAny?.uPointBaseSize?.value ?? 'TBD',
        uMinSize: uAny?.uMinSize?.value ?? 'TBD',
        uMaxSize: uAny?.uMaxSize?.value ?? 'TBD',
      })
    } catch (error) {
      console.error('[PC] forceVisible uniforms failed', error)
    }
  }, [forceVisible, setUniform, uniforms])

  React.useEffect(() => {
    if (!forceVisible) {
      return
    }
    const mats: (THREE.ShaderMaterial | null | undefined)[] = [fallbackMaterial, prebakedMaterial]
    let applied = false
    for (const mat of mats) {
      if (!mat) continue
      mat.depthTest = false
      mat.depthWrite = false
      mat.blending = (THREE as any).AdditiveBlending
      mat.needsUpdate = true
      applied = true
    }
    try {
      console.info('[PC] forceVisible applied', {
        depthTest: mats[0]?.depthTest ?? 'TBD',
        depthWrite: mats[0]?.depthWrite ?? 'TBD',
        blending: mats[0]?.blending ?? 'TBD',
        applied,
      })
    } catch {
      /* noop */
    }
  }, [forceVisible, fallbackMaterial, prebakedMaterial])

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

  React.useEffect(() => {
    if (typeof window === 'undefined') return
    if (!falloffRequestedRef.current) return
    if (falloffLatchAppliedRef.current) return
    const material = prebakedMaterial
    if (!material) return
    let cancelled = false
    let raf = 0
    const latch = () => {
      if (cancelled || falloffLatchAppliedRef.current) return
      const program = (material as any).program
      if (program && program.glProgram) {
        applyFalloffFlagIfRequested()
        falloffLatchAppliedRef.current = true
        try {
          console.info('[PC] falloff latch (prebaked) applied')
        } catch {
          /* noop */
        }
        return
      }
      raf = requestAnimationFrame(latch)
    }
    raf = requestAnimationFrame(latch)
    return () => {
      cancelled = true
      if (raf) cancelAnimationFrame(raf)
    }
  }, [prebakedMaterial, applyFalloffFlagIfRequested])

  // One-shot recheck a couple of frames after first render to eliminate rare timing races
  React.useEffect(() => {
    if (typeof window === 'undefined') return
    if (!falloffRequestedRef.current) return
    let cancelled = false
    let raf1 = 0
    let raf2 = 0
    const recheck = () => {
      if (cancelled) return
      const u: any = uniforms
      try {
        const flag = u?.uTempFalloffOn?.value ?? 0
        if (flag < 0.5) {
          setUniform('uTempFalloffOn', 1)
          setUniform('uTempCenter', u?.uTempCenter?.value ?? [0.5, 0.5])
          setUniform('uTempRadius', u?.uTempRadius?.value ?? 0.14)
          try {
            console.info('[PC] falloff latch recheck applied')
          } catch {
            /* noop */
          }
        }
      } catch {
        /* noop */
      }
    }
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(recheck)
    })
    return () => {
      cancelled = true
      if (raf1) cancelAnimationFrame(raf1)
      if (raf2) cancelAnimationFrame(raf2)
    }
  }, [setUniform, uniforms])

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
  // const initialPointScale =
  //   Number.isFinite(pointSize) && pointSize > 0 ? pointSize / DEFAULT_POINT_SIZING.baseSize : 1

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
    pointSizeScale: 0.75,
    keepRatio: 1,
    // When controls override is active, bloom OFF by default
    bloom: sceneId === 'scene-03' ? false : (controlsOverride ? false : true),
    // scene-03 uses iteration 6 preset FOV by default
    fovDeg: sceneId === 'scene-03' ? 60 : (controlsOverride ? 60 : defaultFovDeg),
    reveal: 1,
    flipUp: false,
    flipNormal: false,
    // scene-03 uses iteration 6 preset mirrors by default
    mirrorLR: sceneId === 'scene-03' ? true : (controlsOverride ? true : false),
    mirrorUD: true,
    roll180: false,
  }))
  const [fitRequest, setFitRequest] = React.useState(0)
  const { bloom, pointSizeScale, reveal, thickness } = ui
  const bloomActive =
    !simEnabled && bloom && !noBloomOverride && (forceBloomOverride || bloomEligible)
  const thicknessScale = React.useMemo(() => Math.max(0.05, Math.min(1.0, thickness)), [thickness])
  const bloomSettings = React.useMemo(() => {
    const preset = BLOOM_PRESET_SETTINGS[aestheticPreset]
    return preset ?? DEFAULT_BLOOM_SETTINGS
  }, [aestheticPreset])
  const freezeRevealParam = readSearchParamSafe('freezeReveal')
  const captureModeParam = readSearchParamSafe('capture')
  const screenshotMode = process.env.NEXT_PUBLIC_SCREENSHOT_MODE === '1'
  const freezeReveal = screenshotMode || freezeRevealParam === '1' || captureModeParam === '1'
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

  const bloomLogRef = React.useRef<string | null>(null)
  React.useEffect(() => {
    bloomLogRef.current = null
  }, [aestheticPreset])
  React.useEffect(() => {
    if (!bloomGuardReady) return
    const key = `${aestheticPreset}:${bloomSettings.strength}:${bloomSettings.radius}:${bloomSettings.threshold}`
    if (bloomLogRef.current === key) return
    const enabled = bloomActive
    try {
      console.info(
        `[dreamdust] bloom { enabled: ${enabled}, strength: ${bloomSettings.strength}, radius: ${bloomSettings.radius}, threshold: ${bloomSettings.threshold}, preset: '${aestheticPreset}' }`
      )
    } catch {
      /* noop */
    }
    bloomLogRef.current = key
  }, [aestheticPreset, bloomActive, bloomGuardReady, bloomSettings])

  React.useEffect(() => {
    // Respect explicit simParamPointBaseSize URL/env override if present
    try {
      const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null
      const overrideRaw = params ? params.get('simParamPointBaseSize') : null
      const override = overrideRaw != null ? Number(overrideRaw) : Number.NaN
      if (Number.isFinite(override) && override > 0) {
        setUniform('uPointBaseSize', override)
        return
      }
    } catch {
      /* noop */
    }
    setUniform('uPointBaseSize', DEFAULT_POINT_SIZING.baseSize * pointSizeScale)
  }, [pointSizeScale, setUniform])

  React.useEffect(() => {
    const clamped = Math.min(1, Math.max(0, reveal))
    const targetReveal = freezeReveal ? 1 : clamped
    if (hasRevealUniform && uniformsWithReveal.uReveal) {
      uniformsWithReveal.uReveal.value = targetReveal
      if (timelineSupported) {
        return
      }
    } else if (timelineSupported) {
      return
    }
    const threshold = 1 - targetReveal
    if (uniforms.uNoiseThreshold) {
      uniforms.uNoiseThreshold.value = threshold
    } else {
      setUniform('uNoiseThreshold', threshold)
    }
  }, [
    freezeReveal,
    hasRevealUniform,
    reveal,
    setUniform,
    timelineSupported,
    uniforms,
    uniformsWithReveal,
  ])

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
    // Single-source falloff/radius initialization and diagnostic log
    try {
      const u: any = uniforms
      setUniform('uTempFalloffOn', 1)
      setUniform('uTempCenter', u?.uTempCenter?.value ?? [0.5, 0.5])
      setUniform('uTempRadius', TARGET_TEMP_RADIUS as unknown as any)
      try {
        const rs = (u?.uTempRadius?.value ?? TARGET_TEMP_RADIUS) as number
        const fs = TEMP_FORCE_SCALE
        console.info(`${AFTER_REVEAL_LOG_TAG}`, {
          uTempRadius: rs,
          uTempFalloffOn: 1,
          forceScale: fs,
          velToNdc: Number(velToNdcRef.current.toFixed(4)),
          inkBlend: Number(resolvedInkBlend.toFixed(4)),
          fluidSize: FLUID_GRID_SIZE,
          fluidIters: FLUID_JACOBI_ITERS,
        })
      } catch {
        /* noop */
      }
    } catch {
      /* noop */
    }
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

    let result = flipWorld.multiply(base.clone())

    // For scene-03 or when controls override is active, remove roll component to level horizon
    if (sceneId === 'scene-03' || controlsOverride) {
      // Decompose quaternion to euler angles
      const euler = new THREE.Euler().setFromQuaternion(result, 'YXZ')
      // Zero out Z rotation (roll) but keep pitch (X) and yaw (Y)
      euler.z = 0
      // Reconstruct quaternion without roll
      result = new THREE.Quaternion().setFromEuler(euler)
      console.log('[PC] Quaternion roll neutralized for level horizon')
    }

    return result
  }, [prebakedTransform?.rotationQuat, ui.flipNormal, ui.flipUp, ui.roll180, sceneId, controlsOverride])

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

  const hasLoggedSimStageRef = React.useRef(false)
  React.useEffect(() => {
    if (!simActive || !simState || hasLoggedSimStageRef.current) return
    const uvSample = Array.from(simState.stageUvs?.slice(0, 6) ?? [])
    const depthSample = Array.from(simState.stageDepths?.slice(0, 6) ?? [])
    console.info('[vertex] sim stage preview', {
      count: simState.stageDepths?.length ?? 0,
      uvSample,
      depthSample,
    })
    hasLoggedSimStageRef.current = true
  }, [simActive, simState])

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
    // Prebaked path: the geometry group is translated by -center*scale,
    // which places the cloud's center at world origin. Orbit around [0,0,0].
    if (prebakedTransform) {
      return [0, 0, 0]
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
    // For prebaked mode, use the already-computed scaled radius
    if (prebakedTransform?.radius) {
      return prebakedTransform.radius
    }
    const srcPos = renderBuffers?.positions ?? prebaked?.positions ?? null
    if (!srcPos) return cameraFitRadius
    const count = Math.floor(srcPos.length / 3)
    if (count <= 0) return cameraFitRadius
    const scale = prebakedTransform?.scale ?? 1
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
    return 0.5 * Math.hypot(dx, dy) * scale
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

  // Trigger auto-fit for prebaked (static) point clouds
  // Skip auto-fit for scene-03 or when controlsOverride is active (use hardcoded preset instead)
  const prebakedFitRequestKeyRef = React.useRef<string | null>(null)
  React.useEffect(() => {
    if (sceneId === 'scene-03' || controlsOverride) return // Skip auto-fit, use hardcoded preset
    if (simActive) return // Only for prebaked mode, not sim
    if (!prebaked || !prebakedTransform) return

    // Use count as key to detect new point cloud load
    const key = `prebaked-${prebaked.count}-${prebakedTransform.radius}`
    if (prebakedFitRequestKeyRef.current !== key) {
      setFitRequest((v) => v + 1)
      prebakedFitRequestKeyRef.current = key
      console.log('[PC] prebaked fit triggered', {
        count: prebaked.count,
        radius: prebakedTransform.radius,
        center: prebakedTransform.center,
      })
    }
  }, [sceneId, controlsOverride, simActive, prebaked, prebakedTransform, setFitRequest])

  React.useEffect(() => {
    if (!uniforms.uDepthNormScale) return
    const radius = prebakedTransform?.radius ?? cameraFitRadius
    const depthScale = depthNormScaleFromRadius(radius) * thicknessScale
    uniforms.uDepthNormScale.value = depthScale
  }, [cameraFitRadius, prebakedTransform, thicknessScale, uniforms, fitRequest])

  const [stagePointsReadyTick, setStagePointsReadyTick] = React.useState(0)
  const retryRafRef = React.useRef<number | null>(null)
  const stagePointsRef = React.useRef<THREE.Points | null>(null)
  const colorGuardLoggedRef = React.useRef(false)
  const stageTelemetryCleanupRef = React.useRef<() => void>()
  const pointsAfterRenderLoggedRef = React.useRef(false)
  const pointsBeforeRenderLoggedRef = React.useRef(false)
  const pointsHookAttachedRef = React.useRef(false)
  const sceneTraversalLoggedRef = React.useRef(false)
  const renderListLoggedRef = React.useRef(false)
  const firstRenderListLogRef = React.useRef(false)
  const renderListMissingLoggedRef = React.useRef(false)
  const renderListEmptyLoggedRef = React.useRef(false)
  const renderListAccessFailedLoggedRef = React.useRef(false)
  const renderListGuardLoggedRef = React.useRef(false)
  const renderListEmptyFallbackLoggedRef = React.useRef(false)
  const renderCallLogCountRef = React.useRef(0)
  const renderCallSeenPointsRef = React.useRef(false)
  const renderPassLogRef = React.useRef(0)
  const renderListInstrumentationLoggedRef = React.useRef(false)
  const postRenderListLoggedRef = React.useRef(false)
  const rendererCapsLoggedRef = React.useRef(false)
  const programStateLoggedRef = React.useRef(false)
  const sceneTraversalRenderLoggedRef = React.useRef(false)
  const renderSceneUuidRef = React.useRef<string | null>(null)
  const dreamdustRootRef = React.useRef<THREE.Group | null>(null)
  const [dreamdustRoot, setDreamdustRoot] = React.useState<THREE.Group | null>(null)
  const renderSceneRef = React.useRef<THREE.Scene | null>(null)
  const sceneCandidatesLoggedRef = React.useRef(false)

  const summarizeRenderEntries = (entries: any[] | undefined) => {
    return (entries ?? [])
      .slice(0, RENDER_LIST_SAMPLE_LIMIT)
      .map((entry) => ({
        type: entry?.object?.type ?? null,
        id: entry?.object?.id ?? null,
        uuid: entry?.object?.uuid ?? null,
        materialUuid: entry?.material?.uuid ?? null,
      }))
  }

  const updateDebugState = React.useCallback((patch: Record<string, unknown>) => {
    if (!dreamdustDebugRef.current) {
      return
    }
    if (typeof globalThis === 'undefined') {
      return
    }
    try {
      const current = (globalThis as any).__dreamdustRenderState
      const base = current && typeof current === 'object' ? current : {}
      ;(globalThis as any).__dreamdustRenderState = {
        ...base,
        ...patch,
        ts: Date.now(),
      }
    } catch {
      /* noop */
    }
  }, [])

  React.useEffect(() => {
    forceVisibleRef.current = forceVisible
  }, [forceVisible])

  React.useEffect(() => {
    if (!forceVisible) {
      renderCallLogCountRef.current = 0
      renderCallSeenPointsRef.current = false
    }
  }, [forceVisible])


  const stagePositionArray = React.useMemo(() => {
    if (simActive && simState) {
      return simState.positions
    }
    if (renderBuffers?.positions) {
      return renderBuffers.positions
    }
    if (prebaked?.positions) {
      return prebaked.positions
    }
    return new Float32Array(0)
  }, [prebaked?.positions, renderBuffers?.positions, simActive, simState])

  const stageColorArray = React.useMemo(() => {
    if (simActive && simState) {
      return simState.colors
    }
    if (renderBuffers?.colors) {
      return renderBuffers.colors
    }
    if (prebaked?.colors) {
      return prebaked.colors
    }
    return null
  }, [prebaked?.colors, renderBuffers?.colors, simActive, simState])

  const stagePositionVersion = React.useMemo(() => {
    const key = simActive ? (simState?.key ?? 'sim') : 'pre'
    const len = stagePositionArray.length
    const hash = hashArraySample(stagePositionArray)
    return `${key}:pos:${len}:${hash}`
  }, [hashArraySample, simActive, simState?.key, stagePositionArray])

  const stageAttributeVersion = React.useMemo(() => {
    if (!stageUvDepth) {
      return simActive ? `${simState?.key ?? 'sim'}:uv:none` : 'pre:uv:none'
    }
    const key = simActive ? (simState?.key ?? 'sim') : 'pre'
    const uvHash = hashArraySample(stageUvDepth.uvs)
    const depthHash = hashArraySample(stageUvDepth.depths01)
    const uvLen = stageUvDepth.uvs?.length ?? 0
    const depthLen = stageUvDepth.depths01?.length ?? 0
    return `${key}:uv:${uvLen}:${uvHash}:depth:${depthLen}:${depthHash}`
  }, [hashArraySample, simActive, simState?.key, stageUvDepth])

  const simUvVersion = React.useMemo(() => {
    if (!simActive || !simState?.stageUvs) {
      return 'inactive'
    }
    const hash = hashArraySample(simState.stageUvs)
    return `${simState.key}:simUv:${simState.stageUvs.length}:${hash}`
  }, [hashArraySample, simActive, simState])

  const stageDataLogRef = React.useRef<string | null>(null)
  React.useEffect(() => {
    const versionKey = `${stageAttributeVersion}:${simUvVersion}`
    if (stageDataLogRef.current === versionKey) {
      return
    }
    stageDataLogRef.current = versionKey
    console.info('[vertex] stage data snapshot', {
      simActive,
      stageUvDepthCount: stageUvDepth ? (stageUvDepth.depths01?.length ?? 0) : 0,
      stageUvCount: stageUvDepth ? (stageUvDepth.uvs?.length ?? 0) : 0,
      simStageUvCount: simState?.stageUvs?.length ?? 0,
      simKey: simState?.key ?? null,
    })
  }, [
    simActive,
    simState?.key,
    simState?.stageUvs,
    stageAttributeVersion,
    stageUvDepth,
    simUvVersion,
  ])

  const geometryBindLogRef = React.useRef<string | null>(null)
  const stagePoints = stagePointsRef.current
  React.useEffect(() => {
    if (colorGuardLoggedRef.current) {
      return
    }
    const points = stagePoints
    if (!points) {
      return
    }
    const geometry = points.geometry as THREE.BufferGeometry | undefined
    if (!geometry) {
      return
    }
    const positionAttr = geometry.getAttribute('position') as THREE.BufferAttribute | undefined
    if (!positionAttr) {
      return
    }
    const colorAttr = geometry.getAttribute('color') as THREE.BufferAttribute | undefined
    colorGuardLoggedRef.current = true
    if (!colorAttr || colorAttr.count !== positionAttr.count || colorAttr.normalized !== true) {
      try {
        console.warn('[dreamdust] color attribute missing or not normalized', {
          present: !!colorAttr,
          count: colorAttr?.count ?? null,
          normalized: colorAttr?.normalized ?? null,
        })
      } catch {
        /* noop */
      }
    }
  }, [stageAttributeVersion, stagePoints, stagePositionVersion, simUvVersion])
  React.useEffect(() => {
    const points = stagePointsRef.current
    if (!points) {
      pointsAfterRenderLoggedRef.current = false
      sceneTraversalLoggedRef.current = false
      renderListLoggedRef.current = false
      renderListMissingLoggedRef.current = false
      renderListEmptyLoggedRef.current = false
      renderListAccessFailedLoggedRef.current = false
      renderCallLogCountRef.current = 0
      renderCallSeenPointsRef.current = false
      renderPassLogRef.current = 0
      postRenderListLoggedRef.current = false
      sceneTraversalRenderLoggedRef.current = false
      renderSceneUuidRef.current = null
      programStateLoggedRef.current = false
      return
    }
    pointsAfterRenderLoggedRef.current = false
    sceneTraversalLoggedRef.current = false
    renderListLoggedRef.current = false
    renderListMissingLoggedRef.current = false
    renderListEmptyLoggedRef.current = false
    renderListAccessFailedLoggedRef.current = false
    renderCallLogCountRef.current = 0
    renderCallSeenPointsRef.current = false
    renderPassLogRef.current = 0
    postRenderListLoggedRef.current = false
    sceneTraversalRenderLoggedRef.current = false
    programStateLoggedRef.current = false

    const geometry = points.geometry as THREE.BufferGeometry | undefined
    if (!geometry) {
      return
    }

    const setAttribute = (
      name: string,
      array: ArrayLike<number> | null | undefined,
      itemSize: number,
      normalized = false
    ) => {
      if (!array || !('length' in array) || array.length === 0) {
        if (geometry.getAttribute(name)) {
          geometry.deleteAttribute(name)
        }
        return
      }

      const typedArray = Array.isArray(array) ? Float32Array.from(array) : array
      const attribute = new THREE.BufferAttribute(
        typedArray as unknown as ArrayLike<number>,
        itemSize,
        normalized
      )
      attribute.setUsage(THREE.DynamicDrawUsage)
      attribute.needsUpdate = true
      geometry.setAttribute(name, attribute)
    }

    setAttribute('position', stagePositionArray, 3)
    setAttribute('color', stageColorArray, 3, true)

    if (stageUvDepth) {
      setAttribute('aUv', stageUvDepth.uvs, 2)
      setAttribute('uv', stageUvDepth.uvs, 2)
      setAttribute('aDepth', stageUvDepth.depths01, 1)
    } else {
      geometry.deleteAttribute('aUv')
      geometry.deleteAttribute('uv')
      geometry.deleteAttribute('aDepth')
    }

    if (simActive && simState?.stageUvs) {
      setAttribute('aSimUv', simState.stageUvs, 2)
    } else {
      geometry.deleteAttribute('aSimUv')
    }

    const summaryKey = `${stagePositionVersion}:${stageAttributeVersion}:${simUvVersion}`
    if (geometryBindLogRef.current !== summaryKey) {
      geometryBindLogRef.current = summaryKey
      console.info('[vertex] geometry attribute summary', {
        geometryUuid: geometry.uuid,
        position: geometry.getAttribute('position')?.count ?? 0,
        color: geometry.getAttribute('color')?.count ?? 0,
        aUv: geometry.getAttribute('aUv')?.count ?? 0,
        uv: geometry.getAttribute('uv')?.count ?? 0,
        aDepth: geometry.getAttribute('aDepth')?.count ?? 0,
        aSimUv: geometry.getAttribute('aSimUv')?.count ?? 0,
        keys: summaryKey,
      })
    }
  }, [
    simActive,
    simState?.stageUvs,
    stageAttributeVersion,
    stageColorArray,
    stagePointsRef,
    stagePositionArray,
    stagePositionVersion,
    stageUvDepth,
    simUvVersion,
  ])

  React.useEffect(() => {
    return () => {
      const renderer = rendererRef.current
      if (renderer) {
        const renderLists =
          (renderer as any).renderLists ??
          (renderer as any).__webglRenderLists ??
          null
        if (renderLists && (renderLists as any).__originalGet) {
          renderLists.get = (renderLists as any).__originalGet
          delete (renderLists as any).__originalGet
        }
      }
      if (renderer && (renderer as any).__originalRender) {
        renderer.render = (renderer as any).__originalRender
        delete (renderer as any).__originalRender
      }
    }
  }, [])

  React.useEffect(() => {
    const cleanup = stageTelemetryCleanupRef.current
    if (cleanup) {
      cleanup()
      stageTelemetryCleanupRef.current = null
    }

    const points = stagePointsRef.current
    if (!points || !(points.material instanceof THREE.ShaderMaterial)) {
      if (typeof window !== 'undefined') {
        delete (window as any).vertexTelemetry
      }
      telemetryCollectorRef.current = null
      return
    }

    if (!debugVertexLog) {
      if (typeof window !== 'undefined') {
        delete (window as any).vertexTelemetry
      }
      telemetryCollectorRef.current = null
      return
    }

    const collector = createVertexTelemetryCollector()
    telemetryCollectorRef.current = collector
    if (typeof window !== 'undefined') {
      ;(window as any).vertexTelemetry = collector
    }
    const shaderMat = points.material as THREE.ShaderMaterial
    const original = points.onAfterRender?.bind(points)
    const pointsUuid = points.uuid
    points.onAfterRender = function onAfterRenderHook(
      renderer: THREE.WebGLRenderer,
      scene: THREE.Scene,
      camera: THREE.Camera,
      geometry: THREE.BufferGeometry,
      material: THREE.Material,
      group?: THREE.Group
    ) {
      console.info('[vertex] onAfterRender', {
        debugVertexLog: true,
        hasCollector: !!collector,
        geometryUuid: geometry.uuid,
        pointsUuid,
        materialUuid: material.uuid,
      })
      ;(points as any).userData = (points as any).userData ?? {}
      ;(points as any).userData.vertexTelemetry = collector
      console.info('[vertex] capture attribute counts', {
        geometryUuid: geometry.uuid,
        position: geometry.getAttribute('position')?.count ?? 0,
        color: geometry.getAttribute('color')?.count ?? 0,
        aSimUv: geometry.getAttribute('aSimUv')?.count ?? 0,
        aDepth: geometry.getAttribute('aDepth')?.count ?? 0,
        aUv: geometry.getAttribute('aUv')?.count ?? 0,
      })
      // Store capture args globally for harness access via captureFromGlobal
      if (typeof window !== 'undefined') {
        ;(window as any).__vertexCaptureArgs = { renderer, geometry, object: points, material: shaderMat }
      }
      collector.capture({ renderer, geometry, object: points, material: shaderMat })
      if (original) {
        // Pass through the material we received to preserve Three's expectations
        original(renderer, scene, camera, geometry, material, group)
      }
    }
    stageTelemetryCleanupRef.current = () => {
      if (points.onAfterRender === undefined) {
        return
      }
      points.onAfterRender = original ?? undefined
      if ((points as any).userData) {
        delete (points as any).userData.vertexTelemetry
      }
      collector.dispose()
      if (telemetryCollectorRef.current === collector) {
        telemetryCollectorRef.current = null
      }
      if (typeof window !== 'undefined' && (window as any).vertexTelemetry === collector) {
        delete (window as any).vertexTelemetry
      }
    }
    return stageTelemetryCleanupRef.current
  }, [
    debugVertexLog,
    renderBuffers,
    prebaked,
    simEnabled,
    simState,
    recolored,
    stride,
    pointBudget,
    stageUvDepth,
    prebakedTransform,
    thicknessScale,
  ])

  React.useEffect(() => {
    const renderer = rendererRef.current
    const cancelPendingRaf = () => {
      if (retryRafRef.current != null) {
        cancelAnimationFrame(retryRafRef.current)
        retryRafRef.current = null
      }
    }

    if (!renderer) {
      cancelPendingRaf()
      return
    }

    let points: THREE.Points | null = stagePointsRef.current
    if (!points && dreamdustDebugRef.current) {
      points = sentinelPoints
    }
    if (!points) {
      cancelPendingRaf()
      retryRafRef.current = requestAnimationFrame(() => {
        setStagePointsReadyTick((v) => v + 1)
      })
      return () => {
        cancelPendingRaf()
      }
    }

    cancelPendingRaf()
    pointsBeforeRenderLoggedRef.current = false
    pointsAfterRenderLoggedRef.current = false

    const originalBeforeRender =
      typeof points.onBeforeRender === 'function' ? points.onBeforeRender : undefined
    const originalAfterRender =
      typeof points.onAfterRender === 'function' ? points.onAfterRender : undefined

    const primaryMaterial = Array.isArray(points.material)
      ? points.material[0] ?? null
      : (points.material as THREE.Material | null)

    if (!programStateLoggedRef.current && primaryMaterial) {
      try {
        const rendererProps = (renderer as any)?.properties?.get?.(primaryMaterial) ?? null
        const program = rendererProps?.program ?? null
        console.info('[PC] points-program-state', {
          timestamp: Date.now(),
          materialUuid: (primaryMaterial as any)?.uuid ?? null,
          materialNeedsUpdate: (primaryMaterial as { needsUpdate?: boolean })?.needsUpdate ?? null,
          materialVersion: (primaryMaterial as { version?: number })?.version ?? null,
          compiled: !!program,
          programCacheKey: program?.cacheKey ?? null,
        })
      } catch {
        /* noop */
      }
      programStateLoggedRef.current = true
    }

    const beforeProbe = function pointsBeforeRenderProbe(
      this: THREE.Points,
      rendererArg: THREE.WebGLRenderer,
      scene: THREE.Scene,
      camera: THREE.Camera,
      geometry: THREE.BufferGeometry,
      material: THREE.Material,
      group?: THREE.Group,
    ) {
      if (!pointsBeforeRenderLoggedRef.current) {
        const rendererProps = (rendererArg as any)?.properties?.get?.(material) ?? null
        const defines = (material as any)?.defines ?? null
        const layersMask = (this as any)?.layers?.mask ?? null
        try {
          console.info('[PC] points-visibility-state', {
            timestamp: Date.now(),
            renderOrder: this.renderOrder ?? null,
            visible: this.visible,
            frustumCulled: this.frustumCulled,
            layersMask,
          })
        } catch {
          /* noop */
        }
        try {
          console.info('[PC] points-before-render', {
            timestamp: Date.now(),
            useVelocityDisp: !!(defines?.USE_VELOCITY_DISP ?? false),
            vertexInkOkDefine: !!(defines?.VERTEX_INK_OK ?? false),
            programCompiled: !!(rendererProps?.program ?? null),
            renderOrder: this.renderOrder ?? null,
          })
        } catch {
          /* noop */
        }
        pointsBeforeRenderLoggedRef.current = true
      }
      if (originalBeforeRender) {
        originalBeforeRender.call(this, rendererArg, scene, camera, geometry, material, group)
      }
    }

    const afterProbe = function pointsAfterRenderProbe(
      this: THREE.Points,
      rendererArg: THREE.WebGLRenderer,
      scene: THREE.Scene,
      camera: THREE.Camera,
      geometry: THREE.BufferGeometry,
      material: THREE.Material,
      group?: THREE.Group,
    ) {
      if (!pointsAfterRenderLoggedRef.current) {
        const info = rendererArg?.info?.render ?? null
        const resolvedMaterial =
          material ??
          (Array.isArray((this as { material?: THREE.Material | THREE.Material[] }).material)
            ? ((this as { material?: THREE.Material | THREE.Material[] }).material as THREE.Material[])[0] ?? null
            : ((this as { material?: THREE.Material }).material ?? null))
        try {
          const attrCounts = {
            position: geometry.getAttribute('position')?.count ?? 0,
            color: geometry.getAttribute('color')?.count ?? 0,
            aSimUv: geometry.getAttribute('aSimUv')?.count ?? 0,
            aDepth: geometry.getAttribute('aDepth')?.count ?? 0,
            drawRange: geometry.drawRange ?? null,
          }
          if (dreamdustDebugRef.current) {
            updateDebugState({
              lastPointsAttrs: {
                ...attrCounts,
                calls: info?.calls ?? null,
                points: info?.points ?? null,
                triangles: info?.triangles ?? null,
              },
            })
          }
          console.info('[PC] points-after-render', {
            calls: info?.calls ?? null,
            points: info?.points ?? null,
            triangles: info?.triangles ?? null,
            material: resolvedMaterial
              ? {
                  uuid: (resolvedMaterial as any).uuid ?? null,
                  blending: (resolvedMaterial as any).blending ?? null,
                  depthTest: (resolvedMaterial as any).depthTest ?? null,
                  depthWrite: (resolvedMaterial as any).depthWrite ?? null,
                }
              : null,
            attrCounts,
          })
        } catch {
          /* noop */
        }
        pointsAfterRenderLoggedRef.current = true
      }
      if (originalAfterRender) {
        originalAfterRender.call(this, rendererArg, scene, camera, geometry, material, group)
      }
    }

    points.onBeforeRender = beforeProbe
    points.onAfterRender = afterProbe

    if (!pointsHookAttachedRef.current) {
      try {
        console.info('[PC] instrumentation points-hook attached', {
          timestamp: Date.now(),
          pointsUuid: points.uuid,
        })
      } catch {
        /* noop */
      }
      pointsHookAttachedRef.current = true
    }

    return () => {
      cancelPendingRaf()
      if (points.onBeforeRender === beforeProbe) {
        points.onBeforeRender = originalBeforeRender ?? undefined
      }
      if (points.onAfterRender === afterProbe) {
        points.onAfterRender = originalAfterRender ?? undefined
      }
    }
  }, [
    rendererReadyTick,
    stageAttributeVersion,
    stagePositionVersion,
    stageUvDepth,
    simUvVersion,
    debugVertexLog,
    stagePointsReadyTick,
    sentinelPoints,
    dreamdustDebug,
  ])

  function collectSceneSnapshot(root: THREE.Object3D, maxNodes = 64) {
    const queue: { node: THREE.Object3D; path: string }[] = [{ node: root, path: root.type ?? 'Scene' }]
    const nodes: Array<{
      type: string
      name?: string
      visible: boolean
      layers: number
      children: number
      path: string
      isPoints?: boolean
      materialUuid?: string | null
      geometryPositionCount?: number | null
    }> = []
    let pointsFound = false
    while (queue.length && nodes.length < maxNodes) {
      const { node, path } = queue.shift()!
      const type = node.type ?? 'Unknown'
      const entry: (typeof nodes)[number] = {
        type,
        name: node.name || undefined,
        visible: node.visible,
        layers: node.layers?.mask ?? 0,
        children: node.children?.length ?? 0,
        path,
      }
      if (type === 'Points') {
        const pointsNode = node as THREE.Points
        const material = Array.isArray(pointsNode.material)
          ? pointsNode.material[0] ?? null
          : pointsNode.material ?? null
        const geometry = pointsNode.geometry as THREE.BufferGeometry | undefined
        entry.isPoints = true
        entry.materialUuid = material && typeof (material as any).uuid === 'string' ? (material as any).uuid : null
        entry.geometryPositionCount =
          (geometry?.getAttribute('position') as THREE.BufferAttribute | undefined)?.count ?? null
        pointsFound = true
      }
      nodes.push(entry)
      for (const child of node.children ?? []) {
        queue.push({ node: child, path: `${path}/${child.type ?? child.uuid ?? 'Object3D'}` })
      }
    }
    return { nodes, pointsFound }
  }

  function SceneTraversalLogger({
    forceVisible,
    pointsRef,
  }: {
    forceVisible: boolean
    pointsRef: React.MutableRefObject<THREE.Points | null>
  }) {
    const scene = useThree((state) => state.scene)
    useFrame(() => {
      if (!forceVisible || sceneTraversalLoggedRef.current) {
        return
      }
      const points = pointsRef.current
      if (!scene || !points) {
        return
      }
      const snapshot = collectSceneSnapshot(scene)
      try {
        console.info('[PC] scene-traversal', {
          pointsFound: snapshot.pointsFound,
          nodeCount: snapshot.nodes.length,
          nodes: snapshot.nodes,
        })
      } catch {
        /* noop */
      }
      sceneTraversalLoggedRef.current = true
    })
    return null
  }

  function DreamdustSceneBridge() {
    const state = useThree((s) => s)
    React.useEffect(() => {
      if (!sceneCandidatesLoggedRef.current) {
        const candidates = {
          useThreeScene: (state.scene as any)?.uuid ?? null,
          internalScene: (state.internal?.scene as any)?.uuid ?? null,
          internalActiveScene: (state.internal?.active?.scene as any)?.uuid ?? null,
          rendererScene: ((state.gl as any)?.scene as any)?.uuid ?? null,
          capturedRenderScene: renderSceneRef.current ? (renderSceneRef.current as any).uuid ?? null : null,
        }
        try {
          console.info('[PC] scene-candidates', {
            candidates,
            renderCallCount: renderCallLogCountRef.current,
          })
          sceneCandidatesLoggedRef.current = true
        } catch {
          /* noop */
        }
      }

      const renderScene = renderSceneRef.current
      const group = dreamdustRoot
      if (!renderScene || !group) {
        return
      }

      const renderUuid = (renderScene as any)?.uuid ?? null
      renderSceneUuidRef.current = renderUuid

      if (group.parent && group.parent !== renderScene) {
        group.parent.remove(group)
      }
      if (!renderScene.children.includes(group)) {
        renderScene.add(group)
        renderCallLogCountRef.current = 0
        renderCallSeenPointsRef.current = false
        renderListLoggedRef.current = false
      }

      return () => {
        if (group && renderScene.children.includes(group)) {
          renderScene.remove(group)
        }
      }
    }, [state, dreamdustRoot])

    return null
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Canvas
        orthographic={false}
        camera={{
          position: sceneId === 'scene-03'
            ? [-65.737, 103.054, -681.379] // Iteration 6 preset for scene-03
            : controlsOverride
            ? [-65.737, 103.054, -681.379] // Iteration 6 preset (final)
            : [0, 0, 1200],
          fov: ui.fovDeg,
          near: 0.1,
          far: 5000,
        }}
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
        if (!rendererCapsLoggedRef.current) {
          try {
            const rendererInstance = rendererRef.current ?? gl
            const glCaps = (rendererInstance as any)?.capabilities ?? {}
            const ctxAttrs = gl.getContextAttributes?.() ?? null
            console.info('[PC] renderer-capabilities', {
              isWebGL2: !!glCaps.isWebGL2,
              maxVertexTextures: glCaps.maxVertexTextures ?? null,
              maxTextures: glCaps.maxTextures ?? null,
              precision: glCaps.precision ?? null,
              logarithmicDepthBuffer: glCaps.logarithmicDepthBuffer ?? null,
              contextAttributes: ctxAttrs ?? undefined,
            })
          } catch {
            /* noop */
          }
          rendererCapsLoggedRef.current = true
        }
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
          const resolveRenderLists = () => {
            const rendererInstance = rendererRef.current ?? gl
            return (
              (rendererInstance as any)?.renderLists ??
              (rendererInstance as any)?.__webglRenderLists ??
              (gl as any)?.renderLists ??
              null
            )
          }

          const logRenderListDetails = (
            phase: 'pre' | 'post',
            scene: THREE.Scene,
            camera: THREE.Camera,
            { logSnapshot, logEmpty }: { logSnapshot: boolean; logEmpty: boolean }
          ) => {
            let lists: any
            try {
              lists = resolveRenderLists()
            } catch (error) {
              if (!renderListAccessFailedLoggedRef.current) {
                try {
                  console.info('[PC] render-list access failed', {
                    error: (error as Error)?.message ?? 'unknown',
                  })
                } catch {
                  /* noop */
                }
                renderListAccessFailedLoggedRef.current = true
              }
              return 'error'
            }

            if (!lists || typeof lists.get !== 'function') {
              if (!renderListMissingLoggedRef.current) {
                try {
                  console.info('[PC] render-list missing', {
                    timestamp: Date.now(),
                  })
                } catch {
                  /* noop */
                }
                renderListMissingLoggedRef.current = true
              }
              return 'missing'
            }

            let snapshot: any
            try {
              snapshot = lists.get(scene, camera)
            } catch (error) {
              if (!renderListAccessFailedLoggedRef.current) {
                try {
                  console.info('[PC] render-list access failed', {
                    error: (error as Error)?.message ?? 'unknown',
                  })
                } catch {
                  /* noop */
                }
                renderListAccessFailedLoggedRef.current = true
              }
              return 'error'
            }

            const opaque = (snapshot?.opaque ?? []) as any[]
            const transparent = (snapshot?.transparent ?? []) as any[]
            const counts = {
              opaqueCount: opaque.length,
              transparentCount: transparent.length,
            }
            if (dreamdustDebugRef.current) {
              const pointsInOpaque = opaque.some((entry) => entry?.object?.type === 'Points')
              const pointsInTransparent = transparent.some(
                (entry) => entry?.object?.type === 'Points',
              )
              updateDebugState({
                lastRenderList: {
                  phase,
                  opaqueCount: counts.opaqueCount,
                  transparentCount: counts.transparentCount,
                  pointsInOpaque,
                  pointsInTransparent,
                  sample: {
                    opaque: summarizeRenderEntries(opaque),
                    transparent: summarizeRenderEntries(transparent),
                  },
                },
              })
            }
            if (opaque.length === 0 && transparent.length === 0) {
              if (logEmpty && !renderListEmptyLoggedRef.current) {
                try {
                  console.info('[PC] render-list empty', {
                    phase,
                    ...counts,
                  })
                } catch {
                  /* noop */
                }
                renderListEmptyLoggedRef.current = true
              }
              return 'empty'
            }

            if (logSnapshot) {
              try {
                console.info('[PC] render-list snapshot', {
                  phase,
                  pointsInOpaque: opaque.some((entry) => entry?.object?.type === 'Points'),
                  pointsInTransparent: transparent.some((entry) => entry?.object?.type === 'Points'),
                  opaqueSample: summarizeRenderEntries(opaque),
                  transparentSample: summarizeRenderEntries(transparent),
                  ...counts,
                })
              } catch {
                /* noop */
              }
            }
            return 'hasItems'
          }

          const renderLists = resolveRenderLists()
          if (renderLists && typeof renderLists.get === 'function') {
            if (!(renderLists as any).__originalGet) {
              const originalGet = renderLists.get.bind(renderLists)
              ;(renderLists as any).__originalGet = originalGet
              renderLists.get = function patchedRenderListsGet(scene: THREE.Scene, camera: THREE.Camera) {
                const shouldLogFirst = !firstRenderListLogRef.current
                const shouldLogFrame =
                  !renderListLoggedRef.current &&
                  (forceVisibleRef.current || dreamdustDebugRef.current)
                if (dreamdustDebugRef.current && !renderListGuardLoggedRef.current) {
                  try {
                    console.info('[PC] render-list guard-state', {
                      forceVisible: forceVisibleRef.current,
                      shouldLogFirst,
                      shouldLogFrame,
                      renderListLogged: renderListLoggedRef.current,
                      renderPassIndex: renderPassLogRef.current,
                      sceneId,
                    })
                  } catch {
                    /* noop */
                  }
                  renderListGuardLoggedRef.current = true
                }
                if (shouldLogFirst || shouldLogFrame) {
                  logRenderListDetails('pre', scene, camera, {
                    logSnapshot: true,
                    logEmpty: true,
                  })
                  firstRenderListLogRef.current = true
                  renderListLoggedRef.current = true
                }
                return originalGet(scene, camera)
              }
              if (!renderListInstrumentationLoggedRef.current) {
                try {
                  console.info('[PC] instrumentation render-list override active', {
                    timestamp: Date.now(),
                    hasRenderLists: true,
                  })
                } catch {
                  /* noop */
                }
                renderListInstrumentationLoggedRef.current = true
              }
            }
          } else if (!renderListInstrumentationLoggedRef.current) {
            try {
              console.info('[PC] instrumentation render-list missing', {
                timestamp: Date.now(),
              })
            } catch {
              /* noop */
            }
            renderListMissingLoggedRef.current = true
            renderListInstrumentationLoggedRef.current = true
          }
          if (!(gl as any).__originalRender && typeof gl.render === 'function') {
            const originalRender = gl.render.bind(gl)
            ;(gl as any).__originalRender = originalRender
            gl.render = function patchedRender(scene: THREE.Scene, camera: THREE.Camera) {
              if (!renderSceneRef.current) {
                renderSceneRef.current = scene
                renderSceneUuidRef.current = (scene as any)?.uuid ?? null
                try {
                  console.info('[PC] render-scene-captured', {
                    uuid: (scene as any)?.uuid ?? null,
                    childCount: scene?.children?.length ?? null,
                  })
                } catch {
                  /* noop */
                }
              }
              const renderPassIndex = renderPassLogRef.current
              const shouldLogRenderPass =
                renderPassIndex < RENDER_CALL_LOG_LIMIT ||
                (dreamdustDebugRef.current && renderPassIndex < 2)
              if (shouldLogRenderPass) {
                try {
                  console.info('[PC] render-pass begin', {
                    timestamp: Date.now(),
                    renderIndex: renderPassIndex,
                    cameraUuid: (camera as any)?.uuid ?? null,
                  })
                } catch {
                  /* noop */
                }
              }
              if (!sceneTraversalRenderLoggedRef.current) {
                try {
                  const traversal = collectSceneSnapshot(scene, SCENE_TRAVERSAL_LOG_LIMIT)
                  console.info('[PC] scene-traversal@render', {
                    pointsFound: traversal.pointsFound,
                    nodeCount: traversal.nodes.length,
                    nodes: traversal.nodes,
                  })
                } catch {
                  /* noop */
                }
                sceneTraversalRenderLoggedRef.current = true
              }

              const result = originalRender(scene, camera)
              if (forceVisibleRef.current && renderCallLogCountRef.current < RENDER_CALL_LOG_LIMIT) {
                const renderIndex = renderCallLogCountRef.current
                renderCallLogCountRef.current += 1
                try {
                  const lists = resolveRenderLists()
                  let pointsPresent = false
                  if (lists && typeof lists.get === 'function') {
                    const snapshot = lists.get(scene, camera)
                    const opaque = (snapshot?.opaque ?? []) as any[]
                    const transparent = (snapshot?.transparent ?? []) as any[]
                    pointsPresent =
                      opaque.some((entry) => entry?.object?.type === 'Points') ||
                      transparent.some((entry) => entry?.object?.type === 'Points')
                  }
                  const seenPreviously = renderCallSeenPointsRef.current
                  if (pointsPresent) {
                    renderCallSeenPointsRef.current = true
                  }
                  const activeRenderUuid = renderSceneUuidRef.current
                  const cameraLayers = (camera as any)?.layers?.mask ?? null
                  console.info('[PC] renderer-render-pass', {
                    renderIndex,
                    sceneUuid: (scene as any)?.uuid ?? null,
                    sceneChildCount: scene?.children?.length ?? null,
                    matchesRenderScene:
                      typeof activeRenderUuid === 'string'
                        ? ((scene as any)?.uuid ?? null) === activeRenderUuid
                        : null,
                    cameraType: (camera as any)?.type ?? null,
                    cameraLayers,
                    pointsPresent,
                    renderCallSeenPointsPreviously: seenPreviously,
                  })
                } catch {
                  /* noop */
                }
              }
              if (!postRenderListLoggedRef.current) {
                const postStatus = logRenderListDetails('post', scene, camera, {
                  logSnapshot: true,
                  logEmpty: true,
                })
                if (
                  dreamdustDebugRef.current &&
                  !renderListEmptyFallbackLoggedRef.current &&
                  postStatus === 'empty' &&
                  renderPassIndex <= 1
                ) {
                  try {
                    console.info('[PC] render-list empty', {
                      phase: 'post',
                      reason: 'fallback',
                      renderIndex: renderPassIndex,
                    })
                  } catch {
                    /* noop */
                  }
                  renderListEmptyLoggedRef.current = true
                  renderListEmptyFallbackLoggedRef.current = true
                }
                postRenderListLoggedRef.current = true
              }
              if (shouldLogRenderPass) {
                try {
                  console.info('[PC] render-pass end', {
                    timestamp: Date.now(),
                    renderIndex: renderPassIndex,
                    calls: gl.info?.render?.calls ?? null,
                  })
                } catch {
                  /* noop */
                }
              }
              renderPassLogRef.current = renderPassIndex + 1
              return result
            }
          }
          // ensure browser gesture handling doesn't block wheel/touch
          gl.domElement.style.touchAction = 'none'
          gl.domElement.style.pointerEvents = 'auto'
        }}
      >
        {/* no FitOrtho in perspective baseline */}
        {/* InkSurface always enabled for scene-03, disabled only when controls override is active on other scenes */}
        {(sceneId === 'scene-03' || !controlsOverride) && (
          <InkSurface
            mirrorLR={!!ui.mirrorLR}
            mirrorUD={!!ui.mirrorUD}
            onForceSample={applyTempForce}
            onForceSplat={(uv, radius, strength) => {
              console.log('[PC] fluid splat', { uv, radius, strength })
              try {
                fluidRef.current?.addForce(uv, radius, strength)
              } catch (error) {
                console.error('[PC] fluid splat failed', error)
              }
            }}
            onStart={() => {
              // Initialize motion probe frame indices when a stroke begins
              try {
             
            const w: any = typeof window !== 'undefined' ? (window as any) : null
                if (w) {
                  if (!w.__inkProbe) w.__inkProbe = {}
                  w.__inkProbe.startFrameIndex = (frameIndexRef?.current ?? 0)
                  w.__inkProbe.firstVisibleFrameIndex = null
                }
              } catch { /* noop */ }
              inkUpdateLoggedRef.current = false
              setDrawing(true)
              // Ensure vertex ink is enabled on first interaction
              try {
                if (runtimeCaps?.vertexInkOk) setUniform('uVertexInkOk', 1)
              } catch {
                // ignore
              }
              // Provide a simple intensity pulse while drawing (overlay disabled on scene-03)
              try {
                if (dreamdustCtx) dreamdustCtx.setInkIntensity(0.85)
              } catch {
                // ignore
              }
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
              // Decay/reset intensity now that drawing has ended
              try {
                if (dreamdustCtx) dreamdustCtx.setInkIntensity(0)
              } catch {
                // ignore
              }
              if (info.type === 'stroke') {
                try {
                  startCascade?.([1, 1, 1])
                } catch {
                  // Ignore cascade trigger failures
                }
              }
            }}
          />
        )}
        {dreamdustDebugRef.current && <primitive object={sentinelPoints} />}
        <TempForceDriver
          tempForceRef={tempForceRef}
          tempIntensityRef={tempIntensityRef}
          setUniform={setUniform}
        />
        <FluidDriver
          fluidRef={fluidRef}
          uniforms={uniforms}
          velToNdc={resolvedVelToNdc}
          inkBlend={resolvedInkBlend}
        />
        <CameraSync
          fovDeg={ui.fovDeg}
          fitRequest={fitRequest}
          fitRadius={cameraCoverRadius}
          fitMargin={simActive ? 0.9 : 0.78}
          fitTarget={cameraFitTarget}
          fitMode={simActive ? 'fit' : 'cover'}
        />
        <CameraDiag
          enabled={CAMERA_DIAGNOSTIC_ACTIVE}
          target={cameraFitTarget}
          radius={cameraCoverRadius}
        />
        <DreamdustTicker tick={tick} />
        <SimDriver
          simRef={simRef}
          active={simActive}
          uniforms={uniforms}
          material={prebakedMaterial}
        />
        <DreamdustSceneBridge />
        <SceneTraversalLogger forceVisible={forceVisible} pointsRef={stagePointsRef} />
        <RenderInfoLogger
          forceVisible={forceVisible}
          stagePointsRef={stagePointsRef}
          uniforms={uniforms}
          debugActive={dreamdustDebug}
          updateDebugState={updateDebugState}
        />
      <ambientLight intensity={1} />
          <directionalLight position={[2, 3, 4]} intensity={0.6} />
          {/* Prefer prebaked VGGT positions if present; gate fallback until checked */}
          <group
            ref={(node) => {
              dreamdustRootRef.current = node
              setDreamdustRoot(node)
            }}
          >
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
                    <points
                      ref={(node) => {
                        stagePointsRef.current = node
                        if (node) {
                          setStagePointsReadyTick((v) => v + 1)
                        }
                      }}
                      frustumCulled={false}
                      renderOrder={1}
                    >
                      <bufferGeometry
                        key={`${stagePositionVersion}:${stageAttributeVersion}:${simUvVersion}`}
                      >
                        <bufferAttribute
                          key={`pos:${stagePositionVersion}`}
                          attach="attributes-position"
                          args={[stagePositionArray, 3]}
                        />
                        {stageColorArray && (
                          <bufferAttribute
                            key={`color:${stagePositionVersion}`}
                            attach="attributes-color"
                            args={[stageColorArray, 3, true]}
                          />
                        )}
                      </bufferGeometry>
                      <primitive
                        key={`material:${aestheticPreset}`}
                        object={prebakedMaterial}
                        attach="material"
                      />
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
          </group>
        <SceneControls
          radius={prebakedTransform ? prebakedTransform.radius : undefined}
          // For scene-03, disable controls by default; allow opt-in via ?controls=1
          drawing={sceneId === 'scene-03' && !controlsOverride ? true : drawing}
          target={sceneId === 'scene-03'
            ? [-62.924, 103.948, -656.168]
            : (controlsOverride ? [-62.924, 103.948, -656.168] : cameraFitTarget)}
          controlsOverride={controlsOverride}
        />
        <CameraLogger trigger={logCameraTrigger} fitTarget={cameraFitTarget} />
        <CameraPositionDebugger
          expectedPosition={(sceneId === 'scene-03' || controlsOverride) ? [-65.737, 103.054, -681.379] : undefined}
        />
        {(sceneId === 'scene-03' || controlsOverride) && (
          <CameraPresetApplier
            position={[-65.737, 103.054, -681.379]}
            target={[-62.924, 103.948, -656.168]}
          />
        )}
        <CameraUpEnforcer />
        {bloomEnabled && !simEnabled && (
          <BloomPass
            strength={bloomSettings.strength}
            radius={bloomSettings.radius}
            threshold={bloomSettings.threshold}
          />
        )}
      </Canvas>
      {debugVisible && !cinematicMode && (
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            {/* <div style={{ fontWeight: 700 }}>PC Debug</div> */}
            <div />
            <button
              onClick={() => setDebugVisible(false)}
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.3)',
                color: '#fff',
                cursor: 'pointer',
                padding: '2px 8px',
                borderRadius: 4,
                fontSize: 11,
              }}
            >
              Hide
            </button>
          </div>
          {controlsOverride && (
            <div
              style={{
                background: 'rgba(255, 165, 0, 0.25)',
                border: '1px solid rgba(255, 165, 0, 0.6)',
                color: '#ffa500',
                padding: '6px 8px',
                borderRadius: 6,
                marginBottom: 8,
                fontWeight: 600,
                textAlign: 'center',
              }}
            >
              CONTROLS OVERRIDE ACTIVE
            </div>
          )}
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
                min={0.3}
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
            <button
              type="button"
              onClick={() => {
                // Trigger camera logging from inside Canvas (via CameraLogger component)
                setLogCameraTrigger((n) => n + 1)
              }}
              style={{
                padding: '6px 8px',
                borderRadius: 6,
                border: '1px solid rgba(255,255,255,0.25)',
                background: 'rgba(255,255,255,0.08)',
                color: '#fff',
                fontWeight: 600,
                cursor: 'pointer',
                width: '100%',
                marginTop: 4,
              }}
            >
              Log Camera
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
            {process.env.NODE_ENV !== 'production' ? (
              <DebugHud
                simEnabled={debugFlags.simStats}
                simSnapshot={simSnapshot}
                inkEnabled={debugFlags.inkStats}
                inkSnapshot={inkSnapshot}
                aestheticPreset={aestheticPreset}
                onPresetChange={setAestheticPreset}
              />
            ) : null}
          </div>
        </div>
      )}
      {!debugVisible && !cinematicMode && (
        <button
          onClick={() => setDebugVisible(true)}
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            background: 'rgba(0,0,0,0.55)',
            border: '1px solid rgba(255,255,255,0.3)',
            color: '#fff',
            cursor: 'pointer',
            padding: '6px 12px',
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 600,
            pointerEvents: 'auto',
            zIndex: 4,
          }}
        >
          Show Debug
        </button>
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
      // Position camera relative to target for straight-on view
      if (fitTarget) {
        cam.position.set(fitTarget[0], fitTarget[1], fitTarget[2] + distance)
      } else {
        cam.position.set(0, 0, distance)
      }
      cam.updateProjectionMatrix()
    }
  }, [camera, distance, fitMargin, fitRadius, fitTarget])
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
