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
  baselineMode?: boolean
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
  baselineMode = false,
  onPerformanceMetrics,
}: {
  colorImage: { data: ImageData; width: number; height: number }
  depth16: { data16: Uint16Array; width: number; height: number }
  stride?: number
  zScale?: number
  pointSize?: number
  onMaterialValid?: () => void
  baselineMode?: boolean
  onPerformanceMetrics?: (metrics: {pointCount: number; ready: boolean}) => void
}) {
  const geomRef = React.useRef<unknown>(null)
  const matRef = React.useRef<THREE.ShaderMaterial | null>(null)
  const materialValidRef = React.useRef(false)
  // no-op: camera accessed via useFrame
  const {
    /* camera */
  } = useThree()

  // Build attributes (uv, depth01, color); position computed in shader via unprojection
  const { positions, uvs, depths, colors } = React.useMemo(() => {
    const cw = colorImage.width
    const ch = colorImage.height
    const dw = depth16.width
    const dh = depth16.height
    const w = Math.min(cw, dw)
    const h = Math.min(ch, dh)
    const col = colorImage.data.data
    const dep16 = depth16.data16

    // Log basic dimensions
    console.log('[Buffer Verification] Image dimensions:', { cw, ch, dw, dh, w, h })

    const xs: number[] = []
    const us: number[] = []
    const ds: number[] = []
    const cs: number[] = []

    const hash = (x: number, y: number) => {
      const s = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453
      return s - Math.floor(s)
    }

    // Performance safeguard: Cap points at 150k for stable performance on consumer laptops
    const maxPoints = 150_000
    const totalCandidates = Math.ceil((w / stride) * (h / stride))
    let keepRatio = Math.min(1, maxPoints / Math.max(1, totalCandidates))
    
    console.log('[Buffer Verification] Candidate calculation:', {
      stride,
      maxPoints,
      totalCandidates,
      initialKeepRatio: keepRatio
    })
    
    // Performance logging: Track actual point generation metrics
    const performanceStart = performance.now()

    // Track points as we iterate
    let candidateCount = 0
    let keptCount = 0

    for (let y = 0; y < h; y += stride) {
      for (let x = 0; x < w; x += stride) {
        candidateCount++
        
        // Handle dimension mismatch: compute separate indices for color and depth
        const dp = y * dw + x  // depth index
        const cp = (y * cw + x) * 4  // color index
        
        // Ensure we don't read beyond array bounds
        if (dp >= dep16.length || cp >= col.length) continue
        
        const d01 = dep16[dp] / 65535.0

        // Luma for sparsity
        const r = col[cp] / 255.0
        const g = col[cp + 1] / 255.0
        const b = col[cp + 2] / 255.0
        const luma = 0.299 * r + 0.587 * g + 0.114 * b

        // Enhanced stochastic keep for natural density variations
        const near = 1.0 - d01
        const darkBoost = Math.pow(1.0 - luma, 1.3) // stronger bias for darker regions
        const depthCurve = Math.pow(near, 0.8) // nonlinear depth emphasis
        const edgeDetection = Math.abs(luma - 0.5) * 0.15 // preserve edges
        const keep = (0.35 + 0.45 * depthCurve + 0.25 * darkBoost + edgeDetection) * keepRatio
        if (hash(x, y) > keep) continue

        keptCount++
        
        // attributes
        us.push(x / (w - 1), y / (h - 1))
        ds.push(d01)
        
        if (baselineMode) {
          // CPU-computed positions for baseline mode: flat sheet at mid-depth
          const ndcX = (x / (w - 1)) * 2.0 - 1.0
          const ndcY = -((y / (h - 1)) * 2.0 - 1.0) // flip Y for screen coords
          const worldX = ndcX * 800 // spread across ~1600 units
          const worldY = ndcY * 600 // spread across ~1200 units
          const worldZ = -800 // fixed depth
          xs.push(worldX, worldY, worldZ)
        } else {
          xs.push(0, 0, 0) // dummy; shader computes true position
        }
        
        cs.push(r, g, b)
      }
    }
    
    // Check if we need to disable stochastic keep due to low point count
    if (keptCount < 100) {
      console.log('[Buffer Verification] Low point count detected, disabling stochastic keep:', keptCount)
      
      // Clear arrays and rebuild with keepRatio=1
      xs.length = 0
      us.length = 0
      ds.length = 0
      cs.length = 0
      
      keepRatio = 1.0
      keptCount = 0
      
      for (let y = 0; y < h; y += stride) {
        for (let x = 0; x < w; x += stride) {
          // Handle dimension mismatch: compute separate indices for color and depth
          const dp = y * dw + x  // depth index
          const cp = (y * cw + x) * 4  // color index
          
          // Ensure we don't read beyond array bounds
          if (dp >= dep16.length || cp >= col.length) continue
          
          const d01 = dep16[dp] / 65535.0

          // Luma for sparsity
          const r = col[cp] / 255.0
          const g = col[cp + 1] / 255.0
          const b = col[cp + 2] / 255.0

          keptCount++
          
          // attributes
          us.push(x / (w - 1), y / (h - 1))
          ds.push(d01)
          
          if (baselineMode) {
            // CPU-computed positions for baseline mode: flat sheet at mid-depth
            const ndcX = (x / (w - 1)) * 2.0 - 1.0
            const ndcY = -((y / (h - 1)) * 2.0 - 1.0) // flip Y for screen coords
            const worldX = ndcX * 800 // spread across ~1600 units
            const worldY = ndcY * 600 // spread across ~1200 units
            const worldZ = -800 // fixed depth
            xs.push(worldX, worldY, worldZ)
          } else {
            xs.push(0, 0, 0) // dummy; shader computes true position
          }
          
          cs.push(r, g, b)
        }
      }
    }
    
    const positions = new Float32Array(xs)
    const uvs = new Float32Array(us)
    const depths = new Float32Array(ds)
    const colors = new Float32Array(cs)
    
    const performanceEnd = performance.now()
    const generationTimeMs = performanceEnd - performanceStart
    
    // Log final buffer sizes and sample data with performance metrics
    console.log('[Buffer Verification] Final counts:', {
      candidateCount,
      keptCount,
      finalKeepRatio: keepRatio,
      positionsLength: positions.length,
      uvsLength: uvs.length,
      depthsLength: depths.length,
      colorsLength: colors.length
    })
    
    // Performance logging: Report generation time and point density
    console.log('[Performance] Point generation metrics:', {
      actualPointCount: keptCount,
      maxPointsCap: maxPoints,
      utilizationPercent: ((keptCount / maxPoints) * 100).toFixed(1),
      generationTimeMs: generationTimeMs.toFixed(2),
      pointsPerMs: (keptCount / Math.max(generationTimeMs, 0.1)).toFixed(0),
      memoryEstimateMB: ((positions.length + uvs.length + depths.length + colors.length) * 4 / (1024 * 1024)).toFixed(2)
    })
    
    // Log first few samples for verification
    console.log('[Buffer Verification] Sample data:', {
      firstUv: uvs.length >= 2 ? [uvs[0], uvs[1]] : 'none',
      firstDepth: depths.length >= 1 ? depths[0] : 'none',
      firstColor: colors.length >= 3 ? [colors[0], colors[1], colors[2]] : 'none'
    })
    
    // Update parent component with performance metrics
    React.useEffect(() => {
      if (onPerformanceMetrics) {
        onPerformanceMetrics({ pointCount: keptCount, ready: true })
      }
    }, [keptCount, onPerformanceMetrics])
    
    return { positions, uvs, depths, colors }
  }, [colorImage, depth16, stride, baselineMode])

  React.useEffect(() => {
    const g = geomRef.current as { computeBoundingSphere?: () => void } | null
    if (!g) return
    if (typeof g.computeBoundingSphere === 'function') g.computeBoundingSphere()
  }, [positions, colors])

  // Poll once until the material compiles, then notify parent to enable bloom
  React.useEffect(() => {
    if (baselineMode) {
      // In baseline mode, pointsMaterial is ready immediately
      if (onMaterialValid) onMaterialValid()
      return
    }
    
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
  }, [onMaterialValid, baselineMode])

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
        {/* uv and depth attributes for shader unprojection */}
        {/** @ts-expect-error attachObject is supported at runtime */}
        <bufferAttribute attachObject={['attributes', 'aUv']} args={[uvs, 2]} />
        {/* custom float attribute for normalized depth */}
        {/** @ts-expect-error attachObject is supported at runtime */}
        <bufferAttribute attachObject={['attributes', 'aDepth']} args={[depths, 1]} />
        {/* color attribute */}
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      {/* Toggle between baseline pointsMaterial and custom shader */}
      {baselineMode ? (
        <pointsMaterial
          size={pointSize}
          sizeAttenuation
          vertexColors
          transparent
          opacity={0.8}
        />
      ) : (
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
                uDriftStrength: { value: 0.12 },
                uDriftSpeed: { value: 0.25 },
                // capture of initial inverse view-projection
                uPVInvCapture: { value: new THREE.Matrix4() },
              },
              vertexShader: `
              uniform float uTime; uniform float uZScale; uniform float uBaseSize; uniform float uGamma; uniform float uDriftStrength; uniform float uDriftSpeed; uniform mat4 uPVInvCapture;
              attribute vec2 aUv; attribute float aDepth; attribute vec3 color; varying vec3 vColor; varying float vNear;
              float hash12(vec2 p){ vec3 p3=fract(vec3(p.xyx)*0.1031); p3+=dot(p3,p3.yzx+33.33); return fract((p3.x+p3.y)*p3.z); }
              void main(){
                vColor=color;
                
                // Apply gamma correction to depth for band mapping
                float depthGamma = pow(aDepth, uGamma);
                
                // Build near/far WORLD points from the *captured* PV^-1
                vec2 ndc = aUv * 2.0 - 1.0;
                vec4 nearWorld = uPVInvCapture * vec4(ndc, -1.0, 1.0);
                vec4 farWorld = uPVInvCapture * vec4(ndc, 1.0, 1.0);
                nearWorld /= nearWorld.w;
                farWorld /= farWorld.w;
                
                // Interpolate based on gamma-corrected depth
                vec3 worldPos = mix(nearWorld.xyz, farWorld.xyz, depthGamma);
                
                // Enhanced atmospheric drift with more natural movement
                float hashVal = hash12(aUv * 100.0);
                float driftPhase = hashVal * 6.28;
                vec3 driftOffset = vec3(
                  sin(uTime * uDriftSpeed + driftPhase) * uDriftStrength,
                  cos(uTime * uDriftSpeed * 0.7 + driftPhase * 1.3) * uDriftStrength * 0.8,
                  sin(uTime * uDriftSpeed * 0.5 + driftPhase * 0.8) * uDriftStrength * 0.6
                ) * mix(0.3, 1.0, 1.0 - depthGamma); // stronger drift for distant points
                worldPos += driftOffset;
                
                // Apply Z scaling
                worldPos.z *= uZScale;
                
                // Apply current projection and view matrices for proper orbiting
                gl_Position = projectionMatrix * modelViewMatrix * vec4(worldPos, 1.0);
                
                // Near factor for alpha falloff (closer = more opaque)
                vNear = 1.0 - depthGamma;
                
                // Enhanced size variation with better luma and depth response
                float luma = dot(vColor, vec3(0.299,0.587,0.114));
                float lumaBoost = smoothstep(0.1, 0.9, luma); // smoother transitions
                float depthSize = mix(0.7, 1.5, 1.0 - depthGamma); // closer points larger
                float sizeVariation = mix(0.6, 1.8, lumaBoost); // wider size range for better hierarchy
                float perPointNoise = mix(0.85, 1.15, hash12(aUv * 1000.0)); // subtle per-point variation
                float size = uBaseSize * sizeVariation * depthSize * perPointNoise;
                gl_PointSize = size;
              }
            `,
              fragmentShader: `
              precision highp float; varying vec3 vColor; varying float vNear;
              void main(){ 
                vec2 p = gl_PointCoord - 0.5; 
                float r = length(p); 
                // Enhanced airy falloff with softer edges
                float core = smoothstep(0.5, 0.1, r); 
                float glow = smoothstep(0.8, 0.25, r) * 0.4; 
                float alpha = (core + glow) * clamp(vNear * 0.45, 0.12, 0.82); 
                // Subtle color temperature variation for depth atmosphere
                vec3 coolTint = vColor * vec3(0.95, 0.98, 1.05);
                vec3 warmTint = vColor * vec3(1.08, 1.02, 0.94);
                vec3 finalColor = mix(coolTint, warmTint, clamp(vNear * 0.8, 0.0, 1.0));
                gl_FragColor = vec4(finalColor, alpha); 
              }
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
      enablePan={true}
      enableDamping
      dampingFactor={0.05}
      minDistance={100}
      maxDistance={5000}
      target={[0, 0, 0]}
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
    stride = 2, // Performance safeguard: Minimum stride of 2 during bring-up
    perspective = false,
    baselineMode = false,
  } = props
  // Performance safeguard: Start with bloom disabled, enable conditionally based on performance
  const [bloomEnabled, setBloomEnabled] = React.useState(false)
  const [performanceMetrics, setPerformanceMetrics] = React.useState<{pointCount: number; ready: boolean}>({pointCount: 0, ready: false})
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
        gl.toneMappingExposure = 1.2
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
          baselineMode={baselineMode}
          onPerformanceMetrics={setPerformanceMetrics}
          onMaterialValid={() => {
            // Performance safeguard: Only enable bloom if geometry is verified and point count is reasonable
            const shouldEnableBloom = performanceMetrics.pointCount > 0 && performanceMetrics.pointCount < 100_000
            console.log('[Performance] Material valid, bloom decision:', {
              pointCount: performanceMetrics.pointCount,
              shouldEnableBloom,
              reason: shouldEnableBloom ? 'Point count within safe range' : 'Point count too high or zero'
            })
            if (shouldEnableBloom) {
              setBloomEnabled(true)
            }
          }}
        />
      ) : (
        readyFallback && (
          <PointsMesh
            colorImage={{ data: color.data!, width: color.width, height: color.height }}
            depth16={depth16From8!}
            stride={stride}
            zScale={zScale}
            pointSize={pointSize}
            baselineMode={baselineMode}
            onPerformanceMetrics={setPerformanceMetrics}
            onMaterialValid={() => {
              // Performance safeguard: Only enable bloom if geometry is verified and point count is reasonable
              const shouldEnableBloom = performanceMetrics.pointCount > 0 && performanceMetrics.pointCount < 100_000
              console.log('[Performance] Material valid, bloom decision:', {
                pointCount: performanceMetrics.pointCount,
                shouldEnableBloom,
                reason: shouldEnableBloom ? 'Point count within safe range' : 'Point count too high or zero'
              })
              if (shouldEnableBloom) {
                setBloomEnabled(true)
              }
            }}
          />
        )
      )}
      <SceneControls />
      {/* Performance safeguard: Bloom conditionally enabled with reduced settings during bring-up */}
      {bloomEnabled && <BloomPass strength={0.18} radius={0.12} threshold={0.6} />}
    </Canvas>
  )
}
