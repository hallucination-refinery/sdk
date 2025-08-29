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

// Runtime flags to toggle between rendering modes
const USE_BASELINE_RENDER = false
const USE_UV_ONLY_SHADER = false  // Session 3a: UV-only mode for debugging UV attributes
const USE_PV_INVERSE_SHADER = true  // Session 3b: PV^-1 world-space with constant depth

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

  // Build attributes (uv, depth01, color); position computed in shader OR CPU for baseline
  const { positions, uvs, depths, colors } = React.useMemo(() => {
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

    const hash = (x: number, y: number) => {
      const s = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453
      return s - Math.floor(s)
    }

    const maxPoints = 150_000  // Session 5: Performance safeguard - cap to 150k during debugging
    const totalCandidates = Math.ceil((w / stride) * (h / stride))
    const keepRatio = Math.min(1, maxPoints / Math.max(1, totalCandidates))
    
    // Log buffer verification data once
    console.log(`[PC-BUFFER] Dimensions: color=${cw}x${ch}, depth=${dw}x${dh}, effective=${w}x${h}`)
    console.log(`[PC-BUFFER] Candidates: ${totalCandidates}, keepRatio: ${keepRatio.toFixed(4)}`)
    console.log(`[PC-BUFFER] Render mode: ${USE_BASELINE_RENDER ? 'BASELINE' : USE_UV_ONLY_SHADER ? 'UV_ONLY_SHADER' : USE_PV_INVERSE_SHADER ? 'PV_INVERSE_SHADER' : 'SHADER'}`)
    
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
        const keep = (0.38 + 0.42 * near + 0.25 * (1.0 - luma)) * keepRatio
        if (hash(x, y) > keep) continue

        // attributes
        us.push(x / (w - 1), y / (h - 1))
        ds.push(d01)
        
        if (USE_BASELINE_RENDER) {
          // CPU-compute positions as a flat sheet at fixed depth
          const worldX = (x / (w - 1) - 0.5) * 800  // span 800 units
          const worldY = (0.5 - y / (h - 1)) * 600  // span 600 units, flip Y
          const worldZ = -800                        // fixed depth at -800 units
          xs.push(worldX, worldY, worldZ)
        } else {
          xs.push(0, 0, 0) // dummy; shader computes true position
        }
        
        cs.push(r, g, b)
      }
    }
    
    const keptPoints = xs.length / 3
    let finalKeepRatio = keepRatio
    let finalKeep = 1.0
    
    // If kept points < 100, disable stochastic keep (keepRatio=1, keep=1)
    if (keptPoints < 100) {
      console.log(`[PC-BUFFER] Low point count (${keptPoints}), recalculating with keepRatio=1`)
      xs.length = 0
      us.length = 0
      ds.length = 0
      cs.length = 0
      
      finalKeepRatio = 1.0
      finalKeep = 0.95  // Still introduce slight sparsity even with low points
      
      for (let y = 0; y < h; y += stride) {
        for (let x = 0; x < w; x += stride) {
          const p = y * w + x
          const d01 = dep16[p] / 65535.0

          const ci = p * 4
          const r = col[ci] / 255.0
          const g = col[ci + 1] / 255.0
          const b = col[ci + 2] / 255.0

          us.push(x / (w - 1), y / (h - 1))
          ds.push(d01)
          
          if (USE_BASELINE_RENDER) {
            // CPU-compute positions as a flat sheet at fixed depth
            const worldX = (x / (w - 1) - 0.5) * 800  // span 800 units
            const worldY = (0.5 - y / (h - 1)) * 600  // span 600 units, flip Y
            const worldZ = -800                        // fixed depth at -800 units
            xs.push(worldX, worldY, worldZ)
          } else {
            xs.push(0, 0, 0)
          }
          
          cs.push(r, g, b)
        }
      }
    }
    
    const positions = new Float32Array(xs)
    const uvs = new Float32Array(us)
    const depths = new Float32Array(ds)
    const colors = new Float32Array(cs)
    
    const finalKeptPoints = positions.length / 3
    
    // Log final counts and array lengths
    console.log(`[PC-BUFFER] Final counts: kept=${finalKeptPoints}, candidates=${totalCandidates}`)
    console.log(`[PC-BUFFER] Array lengths: positions=${positions.length}, uvs=${uvs.length}, depths=${depths.length}, colors=${colors.length}`)
    console.log(`[PC-BUFFER] Final keep settings: keepRatio=${finalKeepRatio.toFixed(4)}, keep=${finalKeep.toFixed(4)}`)
    
    // Log first few samples for debugging
    if (finalKeptPoints > 0) {
      console.log(`[PC-BUFFER] Sample uvs[0-3]: ${Array.from(uvs.slice(0, 4)).map(v => v.toFixed(3)).join(', ')}`)
      console.log(`[PC-BUFFER] Sample depths[0-1]: ${Array.from(depths.slice(0, 2)).map(v => v.toFixed(3)).join(', ')}`)
      console.log(`[PC-BUFFER] Sample colors[0-5]: ${Array.from(colors.slice(0, 6)).map(v => v.toFixed(3)).join(', ')}`)
    }
    
    return { positions, uvs, depths, colors }
  }, [colorImage, depth16, stride])

  React.useEffect(() => {
    const g = geomRef.current as { computeBoundingSphere?: () => void } | null
    if (!g) return
    if (typeof g.computeBoundingSphere === 'function') g.computeBoundingSphere()
  }, [positions, colors])

  // Poll once until the material compiles, then notify parent to enable bloom
  React.useEffect(() => {
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
        {!USE_BASELINE_RENDER && (
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
      
      {USE_BASELINE_RENDER ? (
        /* Simple baseline material for debugging */
        <pointsMaterial 
          size={pointSize} 
          sizeAttenuation={true}
          vertexColors={true}
          transparent={true}
          opacity={0.8}
        />
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
                uGamma: { value: 0.85 },  // Slight gamma adjustment for depth perception
                // capture of initial inverse view-projection
                uPVInvCapture: { value: new THREE.Matrix4() },
              },
              vertexShader: USE_UV_ONLY_SHADER ? `
              // Session 3a: UV-only shader for debugging UV attribute correctness
              uniform float uBaseSize;
              attribute vec2 aUv;
              attribute vec3 color;
              varying vec3 vColor;
              varying float vNear;
              
              void main(){
                vColor = color;
                // Map UV (0,0)-(1,1) directly to NDC (-1,-1)-(1,1) in clip space
                vec2 ndc = aUv * 2.0 - 1.0;
                gl_Position = vec4(ndc, 0.0, 1.0);  // Flat sheet at z=0 in clip space
                vNear = 1.0;
                
                // Simple uniform point size for debugging
                gl_PointSize = uBaseSize * 2.0;
              }
              ` : USE_PV_INVERSE_SHADER ? `
              // Session 3b: PV^-1 world-space with constant depth - test unprojection matrix
              uniform float uBaseSize;
              uniform mat4 uPVInvCapture;
              attribute vec2 aUv;
              attribute vec3 color;
              varying vec3 vColor;
              varying float vNear;
              
              void main(){
                vColor = color;
                // Map UV (0,0)-(1,1) to NDC (-1,-1)-(1,1)
                vec2 ndc = aUv * 2.0 - 1.0;
                
                // Use constant depth for flat sheet (NDC z = 0.0)
                vec4 ndcPos = vec4(ndc, 0.0, 1.0);
                
                // Unproject to world space using captured PV^-1 matrix
                vec4 worldPos = uPVInvCapture * ndcPos;
                worldPos.xyz /= worldPos.w;  // Perspective divide
                
                // Transform back to clip space using current camera matrices
                gl_Position = projectionMatrix * modelViewMatrix * vec4(worldPos.xyz, 1.0);
                vNear = 1.0;
                
                // Simple uniform point size for debugging
                gl_PointSize = uBaseSize * 2.0;
              }
              ` : `
              // Session 3c: Full shader with depth band mapping and drift
              uniform float uTime; uniform float uZScale; uniform float uBaseSize; uniform float uGamma; uniform mat4 uPVInvCapture;
              attribute vec2 aUv; attribute float aDepth; attribute vec3 color; varying vec3 vColor; varying float vNear;
              
              float hash12(vec2 p){ vec3 p3=fract(vec3(p.xyx)*0.1031); p3+=dot(p3,p3.yzx+33.33); return fract((p3.x+p3.y)*p3.z); }
              
              void main(){
                vColor=color;
                
                // Map UV (0,0)-(1,1) to NDC (-1,-1)-(1,1)
                vec2 ndc = aUv * 2.0 - 1.0;
                
                // Use aDepth for depth band mapping in world space
                // Map depth01 to world Z: near points closer to camera, far points deeper
                // Tighter depth band for better depth feel
                float worldZ = mix(-180.0, -1800.0, pow(aDepth, 0.85)) * uZScale;
                
                // Build world position using captured PV^-1 matrix
                vec4 nearWorld = uPVInvCapture * vec4(ndc, 0.0, 1.0);
                vec4 farWorld = uPVInvCapture * vec4(ndc, 1.0, 1.0);
                nearWorld.xyz /= nearWorld.w;
                farWorld.xyz /= farWorld.w;
                
                // Interpolate between near and far using depth
                vec3 worldPos = mix(nearWorld.xyz, farWorld.xyz, aDepth);
                
                // Override Z with depth band mapping for proper 3D positioning
                worldPos.z = worldZ;
                
                // Add subtle drift for "airy" effect
                float drift = uTime * 0.25;
                float hashVal = hash12(aUv * 100.0);
                // Slightly stronger drift for more organic movement
                vec2 driftOffset = vec2(
                  sin(drift + hashVal * 6.28) * 18.0,
                  cos(drift * 0.6 + hashVal * 4.2) * 12.0
                );
                worldPos.xy += driftOffset;
                
                // Transform to clip space
                gl_Position = projectionMatrix * modelViewMatrix * vec4(worldPos, 1.0);
                
                // Calculate nearness for alpha and size
                vNear = 1.0 - aDepth;  // near=1, far=0
                
                // Depth-based point sizing: closer points larger
                float luma = dot(vColor, vec3(0.299,0.587,0.114));
                float depthSize = mix(0.4, 1.8, vNear);  // Greater size variation by depth
                float lumaSize = mix(0.6, 1.8, luma);    // More dramatic luma-based sizing
                gl_PointSize = uBaseSize * depthSize * lumaSize;
              }
            `,
              fragmentShader: `
              precision highp float; varying vec3 vColor; varying float vNear;
              void main(){ 
                vec2 p=gl_PointCoord-0.5; 
                float r=length(p); 
                // Softer edge falloff and enhanced alpha for better bloom
                float alpha=smoothstep(0.65,0.1,r)*clamp(vNear*0.7+0.15,0.15,0.95); 
                gl_FragColor=vec4(vColor, alpha); 
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
    stride = 2,  // Session 5: Performance safeguard - default stride=2 for debugging
    perspective = false,
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
      {/* Session 6: Bloom re-enabled with tuned parameters for aesthetic */}
      {bloomEnabled && <BloomPass strength={0.12} radius={0.15} threshold={0.6} />}
    </Canvas>
  )
}
