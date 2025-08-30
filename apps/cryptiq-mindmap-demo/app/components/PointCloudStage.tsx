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

function SceneControls() {
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
      minDistance={100}
      maxDistance={5000}
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

  return (
    <Canvas
      orthographic={false}
      camera={{ position: [0, 0, 1200], fov: 80, near: 0.1, far: 5000 }}
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
      <ambientLight intensity={1} />
      <directionalLight position={[2, 3, 4]} intensity={0.6} />
      {readyPacked ? (
        <PointsMesh
          colorImage={{ data: color.data!, width: color.width, height: color.height }}
          depth16={{ data16: packed.data16!, width: packed.width, height: packed.height }}
          stride={stride}
          zScale={zScale}
          pointSize={pointSize}
          onMaterialValid={() => setBloomEnabled(true)}
        />
      ) : (
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
      )}
      <SceneControls />
      {bloomEnabled && <BloomPass strength={0.12} radius={0.1} threshold={0.7} />}
    </Canvas>
  )
}
