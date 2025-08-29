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
  useBaseline?: boolean
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

function PointsMesh({
  colorImage,
  depth16,
  stride = 2,
  zScale = 0.5,
  pointSize = 1.5,
  onMaterialValid,
  useBaseline = false,
}: {
  colorImage: { data: ImageData; width: number; height: number }
  depth16: { data16: Uint16Array; width: number; height: number }
  stride?: number
  zScale?: number
  pointSize?: number
  onMaterialValid?: () => void
  useBaseline?: boolean
}) {
  const geomRef = React.useRef<unknown>(null)
  const matRef = React.useRef<THREE.ShaderMaterial | null>(null)
  const materialValidRef = React.useRef(false)
  const loggedOnceRef = React.useRef(false)
  // no-op: camera accessed via useFrame
  const {
    /* camera */
  } = useThree()

  // Log once when component mounts with initial data
  React.useEffect(() => {
    if (!loggedOnceRef.current) {
      console.info('[PointCloud Debug] PointsMesh component initialized with stride:', stride, 'zScale:', zScale, 'pointSize:', pointSize)
      loggedOnceRef.current = true
    }
  }, [])

  // Build attributes (uv, depth01, color); position computed in shader or CPU depending on mode
  const { positions, uvs, depths, colors } = React.useMemo(() => {
    const cw = colorImage.width
    const ch = colorImage.height
    const dw = depth16.width
    const dh = depth16.height
    const w = Math.min(cw, dw)
    const h = Math.min(ch, dh)
    const col = colorImage.data.data
    const dep16 = depth16.data16

    console.info('[PointCloud Debug] Mode:', useBaseline ? 'BASELINE' : 'SHADER', '- Image dimensions - color:', `${cw}x${ch}`, 'depth:', `${dw}x${dh}`, 'effective:', `${w}x${h}`)

    const xs: number[] = []
    const us: number[] = []
    const ds: number[] = []
    const cs: number[] = []

    const hash = (x: number, y: number) => {
      const s = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453
      return s - Math.floor(s)
    }

    const maxPoints = 250_000
    const totalCandidates = Math.ceil((w / stride) * (h / stride))
    const keepRatio = Math.min(1, maxPoints / Math.max(1, totalCandidates))
    
    console.info('[PointCloud Debug] Total candidate points:', totalCandidates, 'keep ratio:', keepRatio.toFixed(4))
    
    for (let y = 0; y < h; y += stride) {
      for (let x = 0; x < w; x += stride) {
        const p = y * w + x
        const d01 = dep16[p] / 65535.0

        // Luma for sparsity
        const ci = p * 4
        const r = col[ci] / 255.0
        const g = col[ci + 1] / 255.0
        const b = col[ci + 2] / 255.0
        const luma = 0.299 * r + 0.587 * g + 0.114 * b

        // Stochastic keep to introduce airy gaps (more sparse in bright/far)
        const near = 1.0 - d01
        const keep = (0.45 + 0.35 * near + 0.2 * (1.0 - luma)) * keepRatio
        if (hash(x, y) > keep) continue

        // attributes
        us.push(x / (w - 1), y / (h - 1))
        ds.push(d01)
        
        if (useBaseline) {
          // CPU-computed positions: flat sheet at mid-depth using NDC->world
          // Convert UV to NDC (-1 to 1)
          const ndcX = (x / (w - 1)) * 2.0 - 1.0
          const ndcY = (y / (h - 1)) * 2.0 - 1.0
          // Place at fixed depth for baseline (flat sheet)
          const worldX = ndcX * 400  // Scale to reasonable world units
          const worldY = -ndcY * 300 // Flip Y and scale
          const worldZ = -800        // Fixed depth
          xs.push(worldX, worldY, worldZ)
        } else {
          xs.push(0, 0, 0) // dummy; shader computes true position
        }
        
        cs.push(r, g, b)
      }
    }
    
    const finalPointCount = us.length / 2 // uvs has 2 components per point
    console.info('[PointCloud Debug] Points kept after filtering:', finalPointCount)
    
    if (finalPointCount < 100) {
      console.warn('[PointCloud Debug] WARNING: Very few points kept (<100)! This may cause empty/black screen.')
    }
    
    const positions = new Float32Array(xs)
    const uvs = new Float32Array(us)
    const depths = new Float32Array(ds)
    const colors = new Float32Array(cs)
    
    console.info('[PointCloud Debug] Buffer lengths - positions:', positions.length, 'uvs:', uvs.length, 'depths:', depths.length, 'colors:', colors.length)
    
    // Log first few values to verify data integrity
    if (finalPointCount > 0) {
      console.info('[PointCloud Debug] First few UVs:', uvs.slice(0, 6))
      console.info('[PointCloud Debug] First few depths:', depths.slice(0, 3))
      console.info('[PointCloud Debug] First few colors:', colors.slice(0, 9))
      console.info('[PointCloud Debug] Depth range - min:', Math.min(...depths), 'max:', Math.max(...depths))
    }
    
    return { positions, uvs, depths, colors }
  }, [colorImage, depth16, stride, useBaseline])

  React.useEffect(() => {
    const g = geomRef.current as { computeBoundingSphere?: () => void } | null
    if (!g) return
    if (typeof g.computeBoundingSphere === 'function') g.computeBoundingSphere()
  }, [positions, colors])

  // Poll once until the material compiles, then notify parent to enable bloom
  React.useEffect(() => {
    if (useBaseline) {
      // For baseline mode, no shader compilation needed - immediately enable bloom
      console.info('[PointCloud Debug] Baseline mode - immediately ready')
      if (onMaterialValid) onMaterialValid()
      return
    }
    
    let raf = 0
    const check = () => {
      const m = matRef.current as unknown as { program?: { glProgram?: unknown } }
      if (m && m.program && m.program.glProgram) {
        materialValidRef.current = true
        console.info('[PointCloud Debug] Shader material compiled and ready')
        if (onMaterialValid) onMaterialValid()
        return
      }
      raf = requestAnimationFrame(check)
    }
    raf = requestAnimationFrame(check)
    return () => cancelAnimationFrame(raf)
  }, [onMaterialValid, useBaseline])

  // Animate time and capture PV^-1 once for world-space reconstruction
  const capturedRef = React.useRef(false)
  const captureDelayRef = React.useRef(2)
  useFrame(({ camera }, dt) => {
    const mat = matRef.current
    if (!mat) return
    const u = mat.uniforms as {
      uTime?: { value: number }
      uPVInvCapture?: { value: THREE.Matrix4 }
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
      capturedRef.current = true
      console.log('[PC] captured PV^-1 (delayed)')
    }
  })

  return (
    <points frustumCulled={false} renderOrder={1}>
      <bufferGeometry ref={geomRef}>
        {/* position attribute */}
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        {!useBaseline && (
          <>
            {/* uv and depth attributes for shader unprojection */}
            {/** @ts-expect-error attachObject is supported at runtime */}
            <bufferAttribute attachObject={['attributes', 'aUv']} args={[uvs, 2]} />
            {/* custom float attribute for normalized depth */}
            {/** @ts-expect-error attachObject is supported at runtime */}
            <bufferAttribute attachObject={['attributes', 'aDepth']} args={[depths, 1]} />
          </>
        )}
        {/* color attribute */}
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      
      {useBaseline ? (
        /* Baseline: Standard points material with fixed size */
        <pointsMaterial size={2} sizeAttenuation={false} vertexColors transparent />
      ) : (
        /* Custom shader for particle size/alpha and gentle drift; additive blending */
        <shaderMaterial
          // Casting for R3F ref type compatibility
          ref={matRef as React.MutableRefObject<THREE.ShaderMaterial | null>}
          args={[
            {
              uniforms: {
                uTime: { value: 0 },
                uZScale: { value: zScale },
                uBaseSize: { value: pointSize },
                uGamma: { value: 1.0 },
                // capture of initial inverse view-projection
                uPVInvCapture: { value: new THREE.Matrix4() },
              },
              vertexShader: `
              uniform float uTime; uniform float uZScale; uniform float uBaseSize; uniform float uGamma; uniform mat4 uPVInvCapture;
              attribute vec2 aUv; attribute float aDepth; attribute vec3 color; varying vec3 vColor; varying float vNear;
              float hash12(vec2 p){ vec3 p3=fract(vec3(p.xyx)*0.1031); p3+=dot(p3,p3.yzx+33.33); return fract((p3.x+p3.y)*p3.z); }
              void main(){
                vColor=color;
                // Build near/far WORLD points from the *captured* PV^-1
                vec2 ndc = aUv * 2.0 - 1.0;
                // Debug path: draw in clip space using NDC directly (bypass PV^-1)
                gl_Position = vec4(ndc, 0.0, 1.0);
                vNear = 1.0;
                float luma = dot(vColor, vec3(0.299,0.587,0.114));
                float size = uBaseSize * mix(0.7,1.6,luma) * 1.0;
                gl_PointSize = size;
              }
            `,
              fragmentShader: `
              precision highp float; varying vec3 vColor; varying float vNear;
              void main(){ vec2 p=gl_PointCoord-0.5; float r=length(p); float alpha=smoothstep(0.6,0.15,r)*clamp(vNear*0.6,0.2,1.0); gl_FragColor=vec4(vColor, alpha); }
            `,
              transparent: true,
              depthWrite: false,
              blending: THREE.AdditiveBlending,
            },
          ]}
        />
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
      minDistance={200}
      maxDistance={3000}
      target={[0, 0, -800]}
      rotateSpeed={0.8}
      zoomSpeed={0.6}
      onStart={() => console.log('[PC] controls start')}
    />
  )
}

function FitOrtho({
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
}

export default function PointCloudStage(props: PointCloudStageProps) {
  const {
    sceneId,
    colorUrl: colorUrlProp,
    depthUrl: depthUrlProp,
    depthRgUrl,
    zScale = 2.5,
    pointSize = 2.0,
    stride = 1,
    perspective = false,
    useBaseline = true, // Default to baseline mode initially
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
      orthographic={!perspective}
      camera={
        perspective
          ? { position: [0, 0, 1200], fov: 80, near: 0.1, far: 5000 }
          : { position: [0, 0, 1000], near: -10000, far: 10000, zoom: 1 }
      }
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
        // ensure browser gesture handling doesn't block wheel/touch
        gl.domElement.style.touchAction = 'none'
        gl.domElement.style.pointerEvents = 'auto'
      }}
    >
      {!perspective && (readyPacked || readyFallback) && (
        <FitOrtho contentWidth={color.width} contentHeight={color.height} />
      )}
      <ambientLight intensity={1} />
      <directionalLight position={[2, 3, 4]} intensity={0.6} />
      {readyPacked ? (
        <PointsMesh
          colorImage={{ data: color.data!, width: color.width, height: color.height }}
          depth16={{ data16: packed.data16!, width: packed.width, height: packed.height }}
          stride={stride}
          zScale={zScale}
          pointSize={pointSize}
          useBaseline={useBaseline}
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
            useBaseline={useBaseline}
            onMaterialValid={() => setBloomEnabled(true)}
          />
        )
      )}
      <SceneControls />
      {bloomEnabled && <BloomPass strength={0.12} radius={0.1} threshold={0.7} />}
    </Canvas>
  )
}
