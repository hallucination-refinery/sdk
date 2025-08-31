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

// Toggle between shader path and baseline PointsMaterial
const USE_SHADER = true

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
  // zScale retained for future shader path; unused in baseline
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  zScale = 0.5,
  pointSize = 1.5,
  onMaterialValid,
}: {
  colorImage: { data: ImageData; width: number; height: number }
  depth16: { data16: Uint16Array; width: number; height: number }
  stride?: number
  zScale?: number
  pointSize?: number
  onMaterialValid?: () => void
}) {
  const geomRef = React.useRef<unknown>(null)
  const matRef = React.useRef<THREE.ShaderMaterial | null>(null)
  const materialValidRef = React.useRef(false)
  // no-op: camera accessed via useFrame
  const {
    /* camera */
  } = useThree()

  // Build attributes (uv, depth01, color); position computed in shader via unprojection
  const { positions, uvs, depths, colors, gridW, gridH } = React.useMemo(() => {
    return buildAttributes(colorImage, depth16, stride, 150_000)
  }, [colorImage, depth16, stride])

  // CPU baseline plane positions (centered at origin, z=0) sized to preserve aspect
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
    const g = geomRef.current as { computeBoundingSphere?: () => void } | null
    if (!g) return
    if (typeof g.computeBoundingSphere === 'function') g.computeBoundingSphere()
  }, [positions, colors])
  // Log geometry attribute inventory once to verify bindings
  const loggedAttrsRef = React.useRef(false)
  React.useEffect(() => {
    if (loggedAttrsRef.current) return
    const g = geomRef.current as unknown as THREE.BufferGeometry | null
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

  // Poll once until the material compiles, then notify parent to enable bloom
  React.useEffect(() => {
    if (!USE_SHADER) return
    let raf = 0
    const check = () => {
      const m = matRef.current as unknown as { program?: { glProgram?: unknown } }
      if (m && m.program && m.program.glProgram) {
        materialValidRef.current = true
        if (onMaterialValid) onMaterialValid()
        return
      }
      raf = requestAnimationFrame(check)
    }
    raf = requestAnimationFrame(check)
    return () => cancelAnimationFrame(raf)
  }, [onMaterialValid])

  // Animate time and capture PV^-1 once for world-space reconstruction
  const capturedRef = React.useRef(false)
  const captureDelayRef = React.useRef(2)
  useFrame(({ camera }, dt) => {
    const mat = matRef.current
    if (!mat) return
    const u = mat.uniforms as {
      uTime?: { value: number }
      uPVInvCapture?: { value: THREE.Matrix4 }
      uHasCapture?: { value: number }
    }
    if (u.uTime) u.uTime.value += dt
    if (!capturedRef.current && u.uPVInvCapture) {
      if (captureDelayRef.current > 0) {
        captureDelayRef.current -= 1
        return
      }
      const pvInv = new THREE.Matrix4()
        .copy((camera as THREE.PerspectiveCamera).matrixWorld)
        .multiply((camera as THREE.PerspectiveCamera).projectionMatrixInverse)
      u.uPVInvCapture.value.copy(pvInv)
      if (u.uHasCapture) u.uHasCapture.value = 1.0
      capturedRef.current = true
      console.log('[PC] captured PV^-1 (delayed)')
    }
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
      {/* Rendering path */}
      {USE_SHADER ? (
        <shaderMaterial
          ref={matRef as React.MutableRefObject<THREE.ShaderMaterial | null>}
          args={[
            {
              uniforms: {
                uBaseSize: { value: pointSize },
                uPVInvCapture: { value: new THREE.Matrix4() },
                uHasCapture: { value: 0 },
                uZNearNdc: { value: -0.85 },
                uZFarNdc: { value: 0.15 },
                uGamma: { value: 0.8 },
                uFocal: { value: 1600.0 },
                uMinSize: { value: 0.75 },
                uMaxSize: { value: 10.0 },
                uDepthMin: { value: 0.05 },
                uDepthMax: { value: 0.95 },
                uInvertDepth: { value: 0.0 },
              },
              vertexShader: `
              precision highp float;
              uniform float uBaseSize;
              uniform mat4 uPVInvCapture;
              uniform float uHasCapture;
              uniform float uZNearNdc;
              uniform float uZFarNdc;
              uniform float uGamma;
              uniform float uFocal;
              uniform float uMinSize;
              uniform float uMaxSize;
              uniform float uDepthMin;
              uniform float uDepthMax;
              uniform float uInvertDepth;
              attribute float aDepth;
              attribute vec3 color;
              varying vec3 vColor;
              void main(){
                vColor = color;
                vec4 posMV;
                if (uHasCapture > 0.5) {
                  vec2 ndc = uv * 2.0 - 1.0;
                  // Unproject to two planes in world space
                  vec4 wNear = uPVInvCapture * vec4(ndc.x, ndc.y, uZNearNdc, 1.0);
                  wNear.xyz /= wNear.w; wNear.w = 1.0;
                  vec4 wFar = uPVInvCapture * vec4(ndc.x, ndc.y, uZFarNdc, 1.0);
                  wFar.xyz /= wFar.w; wFar.w = 1.0;
                  float t01 = clamp((aDepth - uDepthMin) / max(1e-5, (uDepthMax - uDepthMin)), 0.0, 1.0);
                  t01 = pow(t01, uGamma);
                  if (uInvertDepth > 0.5) t01 = 1.0 - t01;
                  float t = t01;
                  vec4 world = mix(wNear, wFar, t);
                  posMV = viewMatrix * world;
                } else {
                  posMV = modelViewMatrix * vec4(position, 1.0);
                }
                gl_Position = projectionMatrix * posMV;
                float dist = max(1e-3, -posMV.z);
                float atten = clamp(uFocal / dist, uMinSize, uMaxSize);
                gl_PointSize = uBaseSize * atten;
              }
            `,
              fragmentShader: `
              precision highp float;
              varying vec3 vColor;
              void main(){ gl_FragColor = vec4(vColor, 1.0); }
            `,
              transparent: false,
              depthWrite: false,
              depthTest: true,
              blending: THREE.NormalBlending,
              fog: false,
              lights: false,
              dithering: false,
              toneMapped: false,
            },
          ]}
        />
      ) : (
        <pointsMaterial size={pointSize} sizeAttenuation vertexColors />
      )}
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
      enablePan={false}
      enableDamping
      dampingFactor={0.1}
      minDistance={Math.max(0.1, radius ? radius * 0.02 : 100)}
      maxDistance={radius ? Math.max(500, radius * 10) : 5000}
      target={[0, 0, 0]}
      rotateSpeed={0.8}
      zoomSpeed={0.6}
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
    zScale = 2.5,
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
    flipUp?: boolean
    flipNormal?: boolean
    mirrorLR?: boolean
    mirrorUD?: boolean
    roll180?: boolean
  }>({
    thickness: 0.2,
    pointSizeScale: 1.1,
    keepRatio: 1,
    bloom: false,
    fovDeg: 80,
    flipUp: false,
    flipNormal: false,
    mirrorLR: false,
    mirrorUD: false,
    roll180: false,
  })
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
  }, [ui.thickness, ui.pointSizeScale, ui.keepRatio, ui.bloom, ui.fovDeg, ui.flipUp, ui.flipNormal, ui.mirrorLR, ui.mirrorUD, ui.roll180])

  // Apply bloom flag from debug panel (pure React)
  React.useEffect(() => {
    setBloomEnabled(ui.bloom)
  }, [ui.bloom])

  // Derive reduced positions for perf / density control when using prebaked
  const renderPositions = React.useMemo(() => {
    if (!prebaked) return null
    const arr = prebaked.positions
    const count = prebaked.count
    const cap = 150_000
    const effectiveKeep = Math.min(ui.keepRatio, cap / Math.max(1, count))
    if (effectiveKeep >= 0.999) return arr
    const step = Math.max(1, Math.floor(1 / Math.max(1e-6, effectiveKeep)))
    const target = Math.max(1, Math.floor(count / step))
    const out = new Float32Array(target * 3)
    let j = 0
    for (let i = 0; i < count && j < target; i += step) {
      out[j * 3 + 0] = arr[i * 3 + 0]
      out[j * 3 + 1] = arr[i * 3 + 1]
      out[j * 3 + 2] = arr[i * 3 + 2]
      j++
    }
    return out
  }, [prebaked, ui.keepRatio])

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

  // Mirror scale (local reflection) for left/right and up/down
  const mirrorScale = React.useMemo(() => {
    return [ui.mirrorLR ? -1 : 1, ui.mirrorUD ? -1 : 1, 1] as [number, number, number]
  }, [ui.mirrorLR, ui.mirrorUD])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Canvas
        orthographic={false}
        camera={{ position: [0, 0, 1200], fov: ui.fovDeg, near: 0.1, far: 5000 }}
        gl={{ antialias: true, alpha: true }}
        style={{ width: '100%', height: '100%', pointerEvents: 'auto', cursor: 'grab' }}
        onPointerDown={(e) => {
          // simple signal that canvas receives input

          console.log('[PC] pointer down', e.clientX, e.clientY)
        }}
        onCreated={({ gl }) => {
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
              <group scale={[1, 1, Math.max(0.05, Math.min(1.0, ui.thickness))]}>
              <points frustumCulled={false} renderOrder={1}>
                <bufferGeometry>
                  <bufferAttribute
                    attach="attributes-position"
                    args={[renderPositions ?? prebaked.positions, 3]}
                  />
                  {prebaked.colors && (
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore normalized byte colors
                    <bufferAttribute attach="attributes-color" args={[prebaked.colors, 3, true]} />
                  )}
                </bufferGeometry>
                <pointsMaterial
                  size={pointSize * ui.pointSizeScale}
                  sizeAttenuation
                  vertexColors={!!prebaked.colors}
                />
              </points>
              </group>
            </group>
          </group>
        ) : prebakedStatus === 'absent' && readyPacked ? (
          <PointsMesh
            colorImage={{ data: color.data!, width: color.width, height: color.height }}
            depth16={{ data16: packed.data16!, width: packed.width, height: packed.height }}
            stride={stride}
            zScale={zScale}
            pointSize={pointSize}
            onMaterialValid={() => setBloomEnabled(true)}
          />
        ) : prebakedStatus === 'absent' ? (
          readyFallback && (
            <PointsMesh
              colorImage={{ data: color.data!, width: color.width, height: color.height }}
              depth16={depth16From8!}
              stride={stride}
              zScale={zScale}
              pointSize={pointSize}
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
            width: 220,
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 6 }}>PC Debug</div>
          <div style={{ display: 'grid', rowGap: 8 }}>
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
                max={1.5}
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
            <label>
              fov: {Math.round(ui.fovDeg)}°
              <input
                type="range"
                min={50}
                max={100}
                step={1}
                value={ui.fovDeg}
                onChange={(e) => setUi((s) => ({ ...s, fovDeg: Number(e.target.value) }))}
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

function CameraSync({ fovDeg, distance }: { fovDeg: number; distance?: number }) {
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
  return null
}
