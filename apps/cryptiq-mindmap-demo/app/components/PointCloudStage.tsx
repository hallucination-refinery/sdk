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
import { applyPerspectiveFit, depthNormScaleFromRadius } from './anim/camera'
import { createDreamdustMaterial } from './dreamdust/DreamdustMaterial'
import { detectVertexTextureSupport } from './dreamdust/capabilities'
import { useDreamdustCtx } from './dreamdust/context'
import { useDreamdustUniforms } from './dreamdust/useDreamdustUniforms'
import { applyDprClamp, pointCap } from './pointcloud/budget'

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
}

function useOptionalDreamdustCtx() {
  try {
    return useDreamdustCtx()
  } catch {
    return null
  }
}

function useImageData(url: string | null): {
  data: ImageData | null
  width: number
  height: number
} {
  const [state, setState] = React.useState<{
    data: ImageData | null
    width: number
    height: number
  }>({
    data: null,
    width: 0,
    height: 0,
  })

  React.useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (!url) return
      try {
        const res = await fetch(url, { cache: 'force-cache' })
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
        setState({ data: imageData, width: img.width, height: img.height })
      } catch {
        // noop
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
} {
  const [state, setState] = React.useState<{
    data16: Uint16Array | null
    width: number
    height: number
  }>({ data16: null, width: 0, height: 0 })

  React.useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (!url) return
      try {
        const res = await fetch(url, { cache: 'force-cache' })
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
        const src = imageData.data
        const out = new Uint16Array(img.width * img.height)
        for (let i = 0, p = 0; p < out.length; i += 4, p++) {
          const hi = src[i]
          const lo = src[i + 1]
          out[p] = (hi << 8) | lo
        }
        setState({ data16: out, width: img.width, height: img.height })
      } catch {
        // noop
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

  const totalCandidates = Math.ceil((w / stride) * (h / stride))
  const maxPoints = cap
  const keepRatio = Math.min(1, maxPoints / Math.max(1, totalCandidates))

  let kept = 0
  for (let y = 0; y < h; y += stride) {
    for (let x = 0; x < w; x += stride) {
      // map sample to each source's native grid to avoid misindexing
      const xC = Math.round((x / Math.max(1, w - 1)) * Math.max(0, cw - 1))
      const yC = Math.round((y / Math.max(1, h - 1)) * Math.max(0, ch - 1))
      const pColor = yC * cw + xC

      const xD = Math.round((x / Math.max(1, w - 1)) * Math.max(0, dw - 1))
      const yD = Math.round((y / Math.max(1, h - 1)) * Math.max(0, dh - 1))
      const pDepth = yD * dw + xD

      const d01 = dep16[pDepth] / 65535.0
      if (d01 < minDepth01) minDepth01 = d01
      if (d01 > maxDepth01) maxDepth01 = d01

      const r = col[pColor * 4] / 255.0
      const g = col[pColor * 4 + 1] / 255.0
      const b = col[pColor * 4 + 2] / 255.0
      const luma = 0.299 * r + 0.587 * g + 0.114 * b

      const near = 1.0 - d01
      const keep = (0.45 + 0.35 * near + 0.2 * (1.0 - luma)) * keepRatio
      if (hash(x, y) > keep) continue

      us.push(x / Math.max(1, w - 1), y / Math.max(1, h - 1))
      ds.push(d01)
      xs.push(0, 0, 0)
      cs.push(r, g, b)
      kept++
    }
  }

  if (kept < 100 && keepRatio < 1) {
    // rerun with keep forced to 1 (no stochastic drop) to avoid "dot" during bring-up
    xs.length = 0
    us.length = 0
    ds.length = 0
    cs.length = 0
    kept = 0
    for (let y = 0; y < h; y += stride) {
      for (let x = 0; x < w; x += stride) {
        const xC = Math.round((x / Math.max(1, w - 1)) * Math.max(0, cw - 1))
        const yC = Math.round((y / Math.max(1, h - 1)) * Math.max(0, ch - 1))
        const pColor = yC * cw + xC
        const xD = Math.round((x / Math.max(1, w - 1)) * Math.max(0, dw - 1))
        const yD = Math.round((y / Math.max(1, h - 1)) * Math.max(0, dh - 1))
        const pDepth = yD * dw + xD
        const d01 = dep16[pDepth] / 65535.0
        if (d01 < minDepth01) minDepth01 = d01
        if (d01 > maxDepth01) maxDepth01 = d01
        const r = col[pColor * 4] / 255.0
        const g = col[pColor * 4 + 1] / 255.0
        const b = col[pColor * 4 + 2] / 255.0
        us.push(x / Math.max(1, w - 1), y / Math.max(1, h - 1))
        ds.push(d01)
        xs.push(0, 0, 0)
        cs.push(r, g, b)
        kept++
      }
    }
  }

  console.log(
    `[PC] build: color ${cw}x${ch} depth ${dw}x${dh} → grid ${w}x${h} stride=${stride} candidates=${totalCandidates} kept=${kept} | uvs=${us.length / 2} depths=${ds.length} colors=${cs.length / 3} | depth01[min,max]=[${minDepth01.toFixed(4)},${maxDepth01.toFixed(4)}]`
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
}: {
  colorImage: { data: ImageData; width: number; height: number }
  depth16: { data16: Uint16Array; width: number; height: number }
  stride?: number
  pointBudget: number
  material: THREE.ShaderMaterial
  uniforms: DreamdustStageUniforms
  onMaterialValid?: () => void
}) {
  const geomRef = React.useRef<THREE.BufferGeometry | null>(null)
  const materialRef = React.useRef<THREE.ShaderMaterial | null>(material)
  const materialValidRef = React.useRef(false)

  const { positions, uvs, depths, colors, gridW, gridH } = React.useMemo(() => {
    return buildAttributes(colorImage, depth16, stride, pointBudget)
  }, [colorImage, depth16, stride, pointBudget])

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
    if (!onMaterialValid) return
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
      if (!materialValidRef.current) {
        // Guard log to surface shader-compile stalls early during bring-up
        try {
          console.warn('[PC] material program not ready yet; waiting…')
        } catch {}
      }
      raf = requestAnimationFrame(check)
    }
    raf = requestAnimationFrame(check)
    return () => cancelAnimationFrame(raf)
  }, [onMaterialValid])

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
      <primitive object={material} attach="material" />
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
      } catch {}
      composerRef.current = null
    }
  }, [gl, scene, camera, strength, radius, threshold])
  React.useEffect(() => {
    if (composerRef.current) composerRef.current.setSize(size.width, size.height)
  }, [size.width, size.height])
  useFrame(() => {
    if (composerRef.current) composerRef.current.render()
  }, 1)
  return null
}

function SceneControls({ radius }: { radius?: number }) {
  const controlsRef = React.useRef(null)
  const { gl } = useThree()
  React.useEffect(() => {
    console.log('[PC] attach controls to', gl.domElement)
  }, [gl])
  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableRotate
      enableZoom
      enablePan={true}
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
    pointSize = 2.0,
    stride = 1,
    // omit perspective in baseline
  } = props
  const [bloomEnabled, setBloomEnabled] = React.useState(false)
  const base = sceneId ? `/assets/pointclouds/${sceneId}` : null
  const colorUrl = colorUrlProp ?? (base ? `${base}/color.png` : null)
  const depthUrl = depthUrlProp ?? (base ? `${base}/depth16.png` : null)
  const depthRg = depthRgUrl ?? (base ? `${base}/depth_rg.png` : null)

  const color = useImageData(colorUrl)
  const packed = usePackedDepth(depthRg)
  const depth = useImageData(depthUrl)

  const depth16From8 = React.useMemo(() => {
    if (!depth.data) return null
    const w = depth.width
    const h = depth.height
    const src = depth.data.data
    const out = new Uint16Array(w * h)
    for (let i = 0, p = 0; p < out.length; i += 4, p++) out[p] = src[i] * 257
    return { data16: out, width: w, height: h }
  }, [depth.data, depth.width, depth.height])

  const readyPacked = !!color.data && !!packed.data16 && color.width > 0 && packed.width > 0
  const readyFallback = !!color.data && !!depth16From8
  const pointBudget = React.useMemo(() => pointCap(), [])

  const { uniforms: baseUniforms, setUniform, updateInkTexture } = useDreamdustUniforms()
  const uniforms = React.useMemo<DreamdustStageUniforms>(() => {
    const u = baseUniforms as DreamdustStageUniforms
    if (!u.uBaseSize) u.uBaseSize = { value: pointSize }
    if (!u.uDepthMin) u.uDepthMin = { value: 0.05 }
    if (!u.uDepthMax) u.uDepthMax = { value: 0.95 }
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

  React.useEffect(() => {
    setUniform('uGamma', 0.82)
    setUniform('uFocal', 1600)
    setUniform('uMinSize', 0.75)
    setUniform('uMaxSize', 9.5)
    setUniform('uDepthBias', 0.14)
    setUniform('uNoiseScale', 0.0025)
    setUniform('uNoiseSpeed', 0.24)
    setUniform('uDriftAmp', 16)
    // Ink gains tuned for quick, readable reactions
    setUniform('uSizeGain', 0.35)
    setUniform('uOffsetGain', 1)
    setUniform('uTintGain', 0.08)
  }, [setUniform])

  React.useEffect(() => {
    uniforms.uDepthMin.value = 0.05
    uniforms.uDepthMax.value = 0.95
    uniforms.uZNearNdc.value = -0.85
    uniforms.uZFarNdc.value = 0.15
    uniforms.uInvertDepth.value = 0
  }, [uniforms])

  const dreamdustCtx = useOptionalDreamdustCtx()
  const inkTex = dreamdustCtx?.inkTex ?? null
  const inkIntensity = dreamdustCtx?.inkIntensity ?? 1
  const vertexInkOk = dreamdustCtx?.vertexInkOk ?? false

  React.useEffect(() => {
    updateInkTexture(inkTex)
  }, [inkTex, updateInkTexture])

  React.useEffect(() => {
    setUniform('uInkIntensity', inkIntensity)
  }, [inkIntensity, setUniform])

  React.useEffect(() => {
    setUniform('uVertexInkOk', vertexInkOk ? 1 : 0)
  }, [setUniform, vertexInkOk])

  const fallbackMaterial = React.useMemo(
    () => createDreamdustMaterial(uniforms, { unproject: true }),
    [uniforms]
  )
  const prebakedMaterial = React.useMemo(
    () => createDreamdustMaterial(uniforms, { unproject: false }),
    [uniforms]
  )

  React.useEffect(() => () => fallbackMaterial.dispose(), [fallbackMaterial])
  React.useEffect(() => () => prebakedMaterial.dispose(), [prebakedMaterial])

  // Prebaked positions path (VGGT exporter). If positions.f32 exists for the scene, prefer it.
  const [prebaked, setPrebaked] = React.useState<{
    positions: Float32Array
    count: number
    colors?: Uint8Array
  } | null>(null)
  const [prebakedStatus, setPrebakedStatus] = React.useState<
    'idle' | 'loading' | 'present' | 'absent'
  >('idle')
  const [prebakedTransform, setPrebakedTransform] = React.useState<{
    center: [number, number, number]
    scale: number
    radius: number
    rotationQuat?: THREE.Quaternion
  } | null>(null)
  React.useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (!sceneId) return
      setPrebakedStatus('loading')
      try {
        const base = `/assets/pointclouds/${sceneId}`
        const res = await fetch(`${base}/positions.f32`, { cache: 'force-cache' })
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
          const cr = await fetch(`${base}/colors.u8`, { cache: 'force-cache' })
          if (cr.ok) {
            const cbuf = await cr.arrayBuffer()
            colors = new Uint8Array(cbuf)
          }
        } catch {}
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

  // Debug panel state (optional via ?debug=1)
  const [debugVisible, setDebugVisible] = React.useState(false)
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
  }>({
    thickness: 0.4,
    pointSizeScale: 1.1,
    keepRatio: 1,
    bloom: false,
    fovDeg: 20,
    reveal: 1,
    flipUp: false,
    flipNormal: false,
    mirrorLR: false,
    mirrorUD: true,
    roll180: false,
  })
  const [fitRequest, setFitRequest] = React.useState(0)
  const { bloom, pointSizeScale, reveal, thickness } = ui
  const thicknessScale = React.useMemo(
    () => Math.max(0.05, Math.min(1.0, thickness)),
    [thickness],
  )
  React.useEffect(() => {
    try {
      const p = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null
      if (p && p.get('debug') === '1') setDebugVisible(true)
      const saved = typeof window !== 'undefined' ? window.localStorage.getItem('pcDebug') : null
      if (saved) setUi({ ...ui, ...JSON.parse(saved) })
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  React.useEffect(() => {
    try {
      if (typeof window !== 'undefined') window.localStorage.setItem('pcDebug', JSON.stringify(ui))
    } catch {}
  }, [
    ui.thickness,
    ui.pointSizeScale,
    ui.keepRatio,
    ui.bloom,
    ui.fovDeg,
    ui.reveal,
    ui.flipUp,
    ui.flipNormal,
    ui.mirrorLR,
    ui.mirrorUD,
    ui.roll180,
  ])

  // Apply bloom flag from debug panel (pure React)
  React.useEffect(() => {
    setBloomEnabled(bloom)
  }, [bloom])

  React.useEffect(() => {
    uniforms.uBaseSize.value = pointSize * pointSizeScale
  }, [pointSize, pointSizeScale, uniforms, ui])

  React.useEffect(() => {
    const clamped = Math.min(1, Math.max(0, reveal))
    const threshold = 1 - clamped
    if (uniforms.uNoiseThreshold) uniforms.uNoiseThreshold.value = threshold
    else setUniform('uNoiseThreshold', threshold)
  }, [reveal, setUniform, uniforms])

  // Derive reduced, matched buffers for prebaked positions/colors
  const renderBuffers = React.useMemo(() => {
    if (!prebaked) return null
    const srcPos = prebaked.positions
    const srcCount = prebaked.count
    const srcColors =
      prebaked.colors && prebaked.colors.length >= srcCount * 3 ? prebaked.colors : undefined

    const cap = pointBudget
    const keep = Math.min(ui.keepRatio, cap / Math.max(1, srcCount))
    const step = Math.max(1, Math.floor(1 / Math.max(1e-6, keep)))
    const outCount = keep >= 0.999 ? srcCount : Math.max(1, Math.floor(srcCount / step))

    // Fast-path: no decimation and colors already match
    if (outCount === srcCount) {
      return { positions: srcPos, colors: srcColors, keptCount: srcCount, cap }
    }

    const outPos = new Float32Array(outCount * 3)
    const outCol: Uint8Array | undefined = srcColors ? new Uint8Array(outCount * 3) : undefined

    for (let i = 0, j = 0; i < srcCount && j < outCount; i += step, j++) {
      outPos[j * 3 + 0] = srcPos[i * 3 + 0]
      outPos[j * 3 + 1] = srcPos[i * 3 + 1]
      outPos[j * 3 + 2] = srcPos[i * 3 + 2]
      if (outCol && srcColors) {
        outCol[j * 3 + 0] = srcColors[i * 3 + 0]
        outCol[j * 3 + 1] = srcColors[i * 3 + 1]
        outCol[j * 3 + 2] = srcColors[i * 3 + 2]
      }
    }

    return { positions: outPos, colors: outCol, keptCount: outCount, cap }
  }, [pointBudget, prebaked, ui.keepRatio])

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

  // Mirror scale (local reflection) for left/right and up/down
  const mirrorScale = React.useMemo(() => {
    return [ui.mirrorLR ? -1 : 1, ui.mirrorUD ? -1 : 1, 1] as [number, number, number]
  }, [ui.mirrorLR, ui.mirrorUD])

  const cameraFitTarget = React.useMemo(() => [0, 0, 0] as [number, number, number], [])
  const cameraFitRadius = React.useMemo(() => {
    if (prebakedTransform) return prebakedTransform.radius
    if (color.width > 0 && color.height > 0) {
      const heightUnits = 1000
      const aspect = color.width / Math.max(1, color.height)
      const widthUnits = heightUnits * aspect
      return 0.5 * Math.hypot(widthUnits, heightUnits)
    }
    return 600
  }, [prebakedTransform, color.width, color.height])

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
          const clampedDpr = applyDprClamp(gl, 2)
          console.log('[PC] DPR clamp applied', clampedDpr.toFixed(2))
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
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const ctx = gl.getContext && gl.getContext()
            if (ctx) {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              const range = ctx.getParameter(ctx.ALIASED_POINT_SIZE_RANGE)
              console.log('[PC] ALIASED_POINT_SIZE_RANGE', range)
              const vertexInk = detectVertexTextureSupport(ctx)
              setUniform('uVertexInkOk', vertexInk ? 1 : 0)
              if (dreamdustCtx) dreamdustCtx.setVertexInkOk(vertexInk)
            }
          } catch {}
          // ensure browser gesture handling doesn't block wheel/touch
          gl.domElement.style.touchAction = 'none'
          gl.domElement.style.pointerEvents = 'auto'
        }}
      >
        {/* no FitOrtho in perspective baseline */}
        <CameraSync
          fovDeg={ui.fovDeg}
          distance={prebakedTransform ? 2 * prebakedTransform.radius : undefined}
          fitRequest={fitRequest}
          fitRadius={cameraFitRadius}
          fitTarget={cameraFitTarget}
        />
        <ambientLight intensity={1} />
        <directionalLight position={[2, 3, 4]} intensity={0.6} />
        {/* Prefer prebaked VGGT positions if present; gate fallback until checked */}
        {prebaked ? (
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
                      args={[renderBuffers?.positions ?? prebaked.positions, 3]}
                    />
                    {(() => {
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
        ) : prebakedStatus === 'absent' && readyPacked ? (
          <PointsMesh
            colorImage={{ data: color.data!, width: color.width, height: color.height }}
            depth16={{ data16: packed.data16!, width: packed.width, height: packed.height }}
            stride={stride}
            pointBudget={pointBudget}
            material={fallbackMaterial}
            uniforms={uniforms}
            onMaterialValid={() => setBloomEnabled(true)}
          />
        ) : prebakedStatus === 'absent' ? (
          readyFallback && (
            <PointsMesh
              colorImage={{ data: color.data!, width: color.width, height: color.height }}
              depth16={depth16From8!}
              stride={stride}
              pointBudget={pointBudget}
              material={fallbackMaterial}
              uniforms={uniforms}
              onMaterialValid={() => setBloomEnabled(true)}
            />
          )
        ) : null}
        <SceneControls radius={prebakedTransform ? prebakedTransform.radius : undefined} />
        {bloomEnabled && <BloomPass strength={0.12} radius={0.1} threshold={0.7} />}
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
                max={2}
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
  fitMargin = 1.1,
  fitTarget,
}: {
  fovDeg: number
  distance?: number
  fitRequest?: number
  fitRadius?: number
  fitMargin?: number
  fitTarget?: [number, number, number]
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
    if (distance && isFinite(distance)) {
      const cam = camera as THREE.PerspectiveCamera
      cam.position.set(0, 0, distance)
      cam.updateProjectionMatrix()
    }
  }, [camera, distance])
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
    applyPerspectiveFit(cam, fitRadius, fitMargin)
  }, [camera, fitRequest, fitRadius, fitMargin, fitTarget])
  return null
}
