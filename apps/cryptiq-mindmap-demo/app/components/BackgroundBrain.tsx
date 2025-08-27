'use client'

import { Suspense, useMemo, useState, useEffect, useRef, useCallback } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { BrainMesh } from '@refinery/canvas-r3f'
import { ConceptParticles } from '@refinery/canvas-r3f'
import { useMindmapStore } from '@refinery/store'
import type { Node } from '@refinery/schema'

// Postprocessing imports (preflight for Session 2)
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { RenderPixelatedPass } from 'three/examples/jsm/postprocessing/RenderPixelatedPass.js'

// Debug HUD for dev mode
function DebugHUD({
  pixelateEnabled,
  onTogglePixelate,
  pixelSize,
  onPixelSizeChange,
}: {
  pixelateEnabled: boolean
  onTogglePixelate: () => void
  pixelSize: number
  onPixelSizeChange: (size: number) => void
}) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 10,
        right: 10,
        zIndex: 1000,
        background: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '4px',
        fontSize: '12px',
        fontFamily: 'monospace',
        pointerEvents: 'auto',
      }}
    >
      <div style={{ marginBottom: '4px' }}>
        <label>
          <input
            type="checkbox"
            checked={pixelateEnabled}
            onChange={onTogglePixelate}
            style={{ marginRight: '6px' }}
          />
          Pixelation
        </label>
      </div>
      <div>
        <label>
          Pixel Size:
          <select
            value={pixelSize}
            onChange={(e) => onPixelSizeChange(parseInt(e.target.value, 10))}
            style={{
              marginLeft: '6px',
              background: '#333',
              color: 'white',
              border: '1px solid #555',
              fontSize: '11px',
            }}
          >
            <option value={2}>2px</option>
            <option value={4}>4px</option>
            <option value={6}>6px</option>
            <option value={8}>8px</option>
            <option value={12}>12px</option>
            <option value={16}>16px</option>
          </select>
        </label>
      </div>
    </div>
  )
}

// PostProcessing component to handle EffectComposer
function PostProcessing({ 
  pixelateEnabled, 
  pixelSize 
}: { 
  pixelateEnabled: boolean
  pixelSize: number 
}) {
  const { gl, scene, camera, size } = useThree()
  const composerRef = useRef<EffectComposer | null>(null)
  const pixelPassRef = useRef<RenderPixelatedPass | null>(null)

  // Initialize EffectComposer on mount
  useEffect(() => {
    if (!gl || !scene || !camera) return

    const composer = new EffectComposer(gl)
    
    // Pass order: RenderPass → (other passes if any) → PixelShader (last)
    // Add render pass first - renders the scene to a buffer
    const renderPass = new RenderPass(scene, camera)
    composer.addPass(renderPass)
    
    // Add pixelation pass last - ensures it affects the entire frame including glow/particles
    const pixelPass = new RenderPixelatedPass(pixelSize, scene, camera)
    composer.addPass(pixelPass)
    
    composerRef.current = composer
    pixelPassRef.current = pixelPass
    
    return () => {
      composer.dispose()
    }
  }, [gl, scene, camera])

  // Update composer size and handle DPR when canvas resizes
  useEffect(() => {
    if (composerRef.current && pixelPassRef.current) {
      // Update composer size
      composerRef.current.setSize(size.width, size.height)
      
      // Set pixel ratio to 1 for consistent pixelation across different DPR
      composerRef.current.setPixelRatio(1)
      
      // Update pixel pass size (RenderPixelatedPass needs to know the new size)
      pixelPassRef.current.setSize(size.width, size.height)
      
      // Scale pixel size by DPR for visual consistency
      const dpr = gl.getPixelRatio()
      const scaledPixelSize = Math.max(1, Math.round(pixelSize * dpr))
      pixelPassRef.current.setPixelSize(scaledPixelSize)
    }
  }, [size.width, size.height, gl, pixelSize])

  // Update pixel size when it changes
  useEffect(() => {
    if (pixelPassRef.current) {
      // Scale by DPR for consistent appearance
      const dpr = gl.getPixelRatio()
      const scaledPixelSize = Math.max(1, Math.round(pixelSize * dpr))
      pixelPassRef.current.setPixelSize(scaledPixelSize)
    }
  }, [pixelSize, gl])

  // Handle rendering in useFrame - guard against double render
  useFrame(({ gl }) => {
    if (pixelateEnabled && composerRef.current) {
      // Use composer for pixelated rendering (composer OR default, never both)
      composerRef.current.render()
      // Prevent default R3F render by marking as already rendered
      gl.autoClear = false
      gl.setRenderTarget(null)
    }
    // When pixelation is off, R3F handles rendering automatically
  }, 1) // Priority 1 to render after scene updates

  return null
}

export default function BackgroundBrain() {
  const [vertices, setVertices] = useState<THREE.Vector3[]>([])
  const [introStart, setIntroStart] = useState<number | null>(null)
  const [anchorPool, setAnchorPool] = useState<number[] | null>(null)
  const workerRef = useRef<Worker | null>(null)
  
  // Pixelation state management
  const [pixelateEnabled, setPixelateEnabled] = useState(false)
  const [pixelSize, setPixelSize] = useState(6)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [showDebugHUD, setShowDebugHUD] = useState(false)
  
  const concepts = useMindmapStore().getVisibleConcepts()
  const liveConcepts = useMemo(() => (concepts as Node[]) || [], [concepts])
  const ambientConcepts = useMemo<Node[]>(() => {
    // Fallback: 500 ambient nodes so intro animation always plays
    const cats = ['values', 'traits', 'emotions', 'coping', 'goals']
    return Array.from(
      { length: 500 },
      (_, i) =>
        ({
          id: `ambient-${i + 1}`,
          label: `Ambient ${i + 1}`,
          size: 1,
          metadata: { category: cats[i % cats.length] } as Record<string, unknown>,
        }) as Node
    )
  }, [])
  const conceptArray = liveConcepts.length > 0 ? liveConcepts : ambientConcepts

  // Initialize pixelation settings from query params and environment
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const urlParams = new URLSearchParams(window.location.search)
    const hasPixelateQuery = urlParams.has('pixelate')
    const pixelateValue = urlParams.get('pixelate')
    const hasDebugQuery = urlParams.has('debug')
    const envPixelate = process.env.NEXT_PUBLIC_PIXELATE === '1'
    
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }
    
    mediaQuery.addEventListener('change', handleMotionChange)
    
    // Show debug HUD if ?debug is present
    setShowDebugHUD(hasDebugQuery)
    
    // Compute pixelateEnabled:
    // - ?pixelate=force overrides reduced motion
    // - ?pixelate (without value) or NEXT_PUBLIC_PIXELATE=1 enables it
    // - Default OFF if prefers-reduced-motion, unless force
    let shouldEnable = false
    
    if (pixelateValue === 'force') {
      shouldEnable = true
    } else if (hasPixelateQuery || envPixelate) {
      // Respect reduced motion preference unless forced
      shouldEnable = !mediaQuery.matches
    }
    
    setPixelateEnabled(shouldEnable)
    
    return () => {
      mediaQuery.removeEventListener('change', handleMotionChange)
    }
  }, [])
  
  // Update pixelation when reduced motion preference changes
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const urlParams = new URLSearchParams(window.location.search)
    const pixelateValue = urlParams.get('pixelate')
    const hasPixelateQuery = urlParams.has('pixelate')
    const envPixelate = process.env.NEXT_PUBLIC_PIXELATE === '1'
    
    // Don't change if forced
    if (pixelateValue === 'force') return
    
    // Update based on reduced motion if pixelation was requested
    if (hasPixelateQuery || envPixelate) {
      setPixelateEnabled(!prefersReducedMotion)
    }
  }, [prefersReducedMotion])
  
  // Debug HUD handlers
  const handleTogglePixelate = useCallback(() => {
    setPixelateEnabled(prev => !prev)
  }, [])
  
  const handlePixelSizeChange = useCallback((size: number) => {
    setPixelSize(size)
  }, [])

  // Load canonical farthest-point anchors once (cached). If unavailable, set to empty array.
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/models/brain-anchors-500.json', { cache: 'force-cache' })
        if (!res.ok) throw new Error('anchors missing')
        const json = await res.json()
        const arr: number[] = Array.isArray(json) ? json : json.indices
        if (!cancelled && Array.isArray(arr)) setAnchorPool(arr)
      } catch {
        // No shipped anchors: compute in a worker once vertices are available
        if (!cancelled) setAnchorPool([])
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  // If no static anchors, compute an anchor pool off-thread once we have vertices
  useEffect(() => {
    if (anchorPool === null) return // still trying static
    if (anchorPool.length > 0) return // already have static
    if (vertices.length === 0) return // need vertices
    if (workerRef.current) return // already computing
    try {
      const w = new Worker(new URL('./brainAnchors.worker.ts', import.meta.url), {
        type: 'module',
      })
      workerRef.current = w
      w.onmessage = (e: MessageEvent<{ anchors?: number[]; error?: string }>) => {
        if (e.data?.anchors && Array.isArray(e.data.anchors)) {
          setAnchorPool(e.data.anchors)
        }
        w.terminate()
        workerRef.current = null
      }
      const verts = vertices.slice(0, vertices.length).map((v) => ({ x: v.x, y: v.y, z: v.z }))
      w.postMessage({ vertices: verts, count: Math.min(500, conceptArray.length) })
    } catch {
      // If worker fails, leave anchorPool as [] so we still render with hash fallback
    }
  }, [anchorPool, vertices, conceptArray.length])

  // Build mappedIndices exactly how /brain does it: concept index → anchorPool[i % L].
  const mappedIndices = useMemo(() => {
    if (!anchorPool || anchorPool.length === 0) return null
    if (vertices.length === 0 || conceptArray.length === 0) return null
    const pool = anchorPool.filter((i) => i >= 0 && i < vertices.length)
    if (pool.length === 0) return null
    const n = Math.min(500, conceptArray.length)
    const out = new Array<number>(n)
    for (let i = 0; i < n; i++) out[i] = pool[i % pool.length]
    return out
  }, [anchorPool, vertices, conceptArray])

  // Brain shell fade-in (opacity only) after particles finish
  useEffect(() => {
    if (vertices.length === 0 || introStart != null) return
    // Wait for anchorPool fetch to resolve (null => still loading, [] => missing OK)
    if (conceptArray.length > 0 && anchorPool === null) return
    // Delay shell fade until particles finish: 1200ms + 300ms = 1500ms
    const PARTICLES_MS = 1200
    const PARTICLES_STAGGER_MS = 300
    const SHELL_DELAY_MS = PARTICLES_MS + PARTICLES_STAGGER_MS
    const start = performance.now() + SHELL_DELAY_MS
    setIntroStart(start)
    const INTRO_MS = 1200
    const EXTRA_DELAY = 400
    let raf = 0
    const tick = () => {
      const now = performance.now()
      if (now < start) {
        raf = requestAnimationFrame(tick)
        return
      }
      const t = Math.min(1, (now - start) / (INTRO_MS + EXTRA_DELAY))
      if (t < 1) {
        raf = requestAnimationFrame(tick)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [vertices, conceptArray.length, anchorPool, introStart])

  function CameraFitter({ target = 0.72 }: { target?: number }) {
    const { camera } = useThree()
    useMemo(() => {
      if (vertices.length === 0) return
      const c = vertices
        .reduce((acc, v) => acc.add(v), new THREE.Vector3())
        .multiplyScalar(1 / vertices.length)
      let r = 0
      for (const v of vertices) r = Math.max(r, v.distanceTo(c))
      if ((camera as THREE.Camera) && (camera as THREE.PerspectiveCamera).isPerspectiveCamera) {
        const fov = ((camera as THREE.PerspectiveCamera).fov * Math.PI) / 180
        const z = r / Math.max(0.1, target * Math.tan(fov / 2))
        camera.position.set(0, 80, -z)
        camera.lookAt(0, 0, 0)
        ;(camera as THREE.PerspectiveCamera).updateProjectionMatrix()
      }
    }, [camera, vertices, target])
    return null
  }

  const enableControls = useMemo(() => {
    if (typeof window === 'undefined') return false
    return (
      window.location.search.includes('controls') || process.env.NEXT_PUBLIC_ENABLE_CONTROLS === '1'
    )
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1,
        pointerEvents: enableControls ? 'auto' : 'none',
      }}
      aria-hidden={!enableControls}
    >
      <Canvas
        camera={{ position: [0, 80, 220], fov: 45 }}
        gl={{ antialias: true, alpha: false }}
        style={{ background: '#010C2A' }}
      >
        <CameraFitter target={0.75} />
        {/* Lights */}
        <ambientLight intensity={1} />
        <directionalLight position={[10, 10, 5]} intensity={0.6} />
        <directionalLight position={[-8, 6, -4]} intensity={0.3} color={0x3eb4ff} />

        {/* Brain Mesh */}
        <Suspense fallback={null}>
          <BrainMesh
            modelPath="/models/brain.obj"
            wireframeColor={'#003375'}
            opacity={0.08}
            scale={1}
            wireframe={true}
            depthWrite={false}
            usePhysical={true}
            physicalTransmission={0.2}
            physicalThickness={0.25}
            emissiveIntensity={0.35}
            onVerticesLoaded={setVertices}
            visible={true}
          />
        </Suspense>

        {/* Concept Orbs */}
        {vertices.length > 0 && conceptArray.length > 0 && (
          <ConceptParticles
            concepts={conceptArray}
            vertices={vertices}
            mappedIndices={mappedIndices ?? undefined}
            particleSize={4}
            visible={true}
            activeLens="affinity"
            surfaceOffset={0.1}
            renderMode={'spheres'}
            intro={true}
            introDurationMs={2000}
          />
        )}

        {enableControls && <OrbitControls enableDamping dampingFactor={0.12} />}
        
        {/* PostProcessing for pixelation */}
        <PostProcessing 
          pixelateEnabled={pixelateEnabled} 
          pixelSize={pixelSize} 
        />
      </Canvas>
      
      {/* Debug HUD for development */}
      {showDebugHUD && (
        <DebugHUD
          pixelateEnabled={pixelateEnabled}
          onTogglePixelate={handleTogglePixelate}
          pixelSize={pixelSize}
          onPixelSizeChange={handlePixelSizeChange}
        />
      )}
    </div>
  )
}
