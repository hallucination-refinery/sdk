import { useEffect, useRef, useState, useMemo } from 'react'
import { Canvas as ThreeCanvas, useThree, useFrame } from '@react-three/fiber'
import { Stats, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { BrainMesh } from './BrainMesh'
import { ConceptParticles } from './ConceptParticles'
import type { Node } from '@refinery/schema'

// Extend Performance interface for memory monitoring
declare global {
  interface Performance {
    memory?: {
      usedJSHeapSize: number
      totalJSHeapSize: number
      jsHeapSizeLimit: number
    }
  }
}

interface PerformanceMetrics {
  fps: number
  frameTime: number
  memoryMB: number
  drawCalls: number
  concepts: number
  vertices: number
  renderTime: number
  timestamp: number
}

interface BenchmarkResult {
  conceptCount: number
  averageFps: number
  minFps: number
  maxFps: number
  averageFrameTime: number
  memoryUsageMB: number
  drawCalls: number
  duration: number
  bottlenecks: string[]
}

// Performance marks for key operations
class PerformanceMarker {
  private marks: Map<string, number> = new Map()
  
  mark(name: string): void {
    performance.mark(name)
    this.marks.set(name, performance.now())
  }
  
  measure(name: string, startMark: string, endMark?: string): number {
    if (endMark) {
      performance.measure(name, startMark, endMark)
    } else {
      const start = this.marks.get(startMark)
      if (start) {
        const duration = performance.now() - start
        performance.measure(name, startMark)
        return duration
      }
    }
    
    const entries = performance.getEntriesByName(name, 'measure')
    return entries.length > 0 ? entries[entries.length - 1].duration : 0
  }
  
  clear(): void {
    performance.clearMarks()
    performance.clearMeasures()
    this.marks.clear()
  }
}

// Real-time performance monitor component
function PerformanceMonitor({ 
  onMetrics, 
  conceptCount, 
  enabled = true 
}: { 
  onMetrics: (metrics: PerformanceMetrics) => void
  conceptCount: number
  enabled: boolean
}) {
  const frameCount = useRef(0)
  const lastTime = useRef(performance.now())
  const frameTimes = useRef<number[]>([])
  const { gl } = useThree()
  
  useFrame(() => {
    if (!enabled) return
    
    const now = performance.now()
    const frameTime = now - lastTime.current
    frameTimes.current.push(frameTime)
    
    // Keep only last 60 frames for averaging
    if (frameTimes.current.length > 60) {
      frameTimes.current.shift()
    }
    
    frameCount.current++
    lastTime.current = now
  })
  
  useEffect(() => {
    if (!enabled) return
    
    const interval = setInterval(() => {
      const now = performance.now()
      const deltaTime = now - lastTime.current
      const fps = frameCount.current > 0 ? Math.round((frameCount.current * 1000) / deltaTime) : 0
      
      // Calculate average frame time
      const avgFrameTime = frameTimes.current.length > 0 
        ? frameTimes.current.reduce((a, b) => a + b, 0) / frameTimes.current.length 
        : 0
      
      // Get memory usage
      const memoryMB = performance.memory 
        ? Math.round(performance.memory.usedJSHeapSize / 1024 / 1024)
        : 0
      
      // Get draw calls (if available)
      const drawCalls = gl.info?.render?.calls || 0
      
      // Get vertex count (estimated)
      const vertices = 39410 // Brain mesh vertex count
      
      onMetrics({
        fps,
        frameTime: avgFrameTime,
        memoryMB,
        drawCalls,
        concepts: conceptCount,
        vertices,
        renderTime: avgFrameTime,
        timestamp: now
      })
      
      // Reset counters
      frameCount.current = 0
      frameTimes.current = []
    }, 1000)
    
    return () => clearInterval(interval)
  }, [enabled, conceptCount, gl, onMetrics])
  
  return null
}

// Performance overlay UI
function PerformanceOverlay({ 
  metrics, 
  benchmarkResult,
  conceptCount,
  onConceptCountChange,
  onStartBenchmark,
  isRunning
}: {
  metrics: PerformanceMetrics | null
  benchmarkResult: BenchmarkResult | null
  conceptCount: number
  onConceptCountChange: (count: number) => void
  onStartBenchmark: () => void
  isRunning: boolean
}) {
  const fpsColor = metrics 
    ? metrics.fps >= 50 ? '#4CAF50' : metrics.fps >= 30 ? '#FF9800' : '#F44336'
    : '#666'
  
  return (
    <div style={{
      position: 'absolute',
      top: 10,
      left: 10,
      background: 'rgba(0,0,0,0.9)',
      color: 'white',
      padding: '15px',
      fontFamily: 'Consolas, monospace',
      fontSize: '13px',
      borderRadius: '8px',
      zIndex: 1000,
      minWidth: '300px',
      backdropFilter: 'blur(10px)'
    }}>
      <div style={{ 
        fontSize: '16px', 
        fontWeight: 'bold', 
        marginBottom: '10px',
        borderBottom: '1px solid #333',
        paddingBottom: '8px'
      }}>
        🧠 Brain Performance Baseline
      </div>
      
      {/* Real-time metrics */}
      <div style={{ marginBottom: '15px' }}>
        <div>Concepts: <span style={{ color: '#2196F3' }}>{conceptCount}</span></div>
        <div>FPS: <span style={{ color: fpsColor, fontWeight: 'bold' }}>
          {metrics?.fps || 0}
        </span></div>
        <div>Frame Time: <span style={{ color: '#FF9800' }}>
          {metrics?.frameTime.toFixed(2) || 0}ms
        </span></div>
        <div>Memory: <span style={{ color: '#9C27B0' }}>
          {metrics?.memoryMB || 0}MB
        </span></div>
        <div>Draw Calls: <span style={{ color: '#00BCD4' }}>
          {metrics?.drawCalls || 0}
        </span></div>
        <div>Vertices: <span style={{ color: '#4CAF50' }}>
          {metrics?.vertices.toLocaleString() || 0}
        </span></div>
      </div>
      
      {/* Benchmark results */}
      {benchmarkResult && (
        <div style={{ 
          marginBottom: '15px', 
          padding: '10px', 
          background: 'rgba(76, 175, 80, 0.1)',
          borderRadius: '4px',
          border: '1px solid rgba(76, 175, 80, 0.3)'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
            📊 Benchmark Results ({benchmarkResult.conceptCount} concepts)
          </div>
          <div>Avg FPS: <span style={{ color: '#4CAF50' }}>
            {benchmarkResult.averageFps.toFixed(1)}
          </span></div>
          <div>Min/Max: <span style={{ color: '#FF9800' }}>
            {benchmarkResult.minFps.toFixed(1)} / {benchmarkResult.maxFps.toFixed(1)}
          </span></div>
          <div>Frame Time: <span style={{ color: '#2196F3' }}>
            {benchmarkResult.averageFrameTime.toFixed(2)}ms
          </span></div>
          <div>Memory: <span style={{ color: '#9C27B0' }}>
            {benchmarkResult.memoryUsageMB}MB
          </span></div>
          {benchmarkResult.bottlenecks.length > 0 && (
            <div style={{ marginTop: '5px', color: '#F44336' }}>
              ⚠️ {benchmarkResult.bottlenecks.join(', ')}
            </div>
          )}
        </div>
      )}
      
      {/* Controls */}
      <div style={{ borderTop: '1px solid #333', paddingTop: '10px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Test Concepts:</label>
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
            {[100, 500, 1000, 2000].map(count => (
              <button
                key={count}
                onClick={() => onConceptCountChange(count)}
                style={{
                  padding: '4px 8px',
                  border: conceptCount === count ? '2px solid #2196F3' : '1px solid #555',
                  background: conceptCount === count ? '#2196F3' : '#333',
                  color: 'white',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '11px'
                }}
              >
                {count}
              </button>
            ))}
          </div>
        </div>
        
        <button
          onClick={onStartBenchmark}
          disabled={isRunning}
          style={{
            padding: '8px 16px',
            background: isRunning ? '#666' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isRunning ? 'not-allowed' : 'pointer',
            fontSize: '12px',
            fontWeight: 'bold'
          }}
        >
          {isRunning ? '⏱️ Running...' : '🚀 Run Benchmark'}
        </button>
      </div>
    </div>
  )
}

// Main brain performance baseline component
export function BrainPerformanceBaseline() {
  const [conceptCount, setConceptCount] = useState(100)
  const [concepts, setConcepts] = useState<Node[]>([])
  const [vertices, setVertices] = useState<THREE.Vector3[]>([])
  const [currentMetrics, setCurrentMetrics] = useState<PerformanceMetrics | null>(null)
  const [benchmarkResult, setBenchmarkResult] = useState<BenchmarkResult | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const performanceMarker = useMemo(() => new PerformanceMarker(), [])
  const metricsHistory = useRef<PerformanceMetrics[]>([])
  
  // Load concept fixtures
  const loadConcepts = async (count: number) => {
    setIsLoading(true)
    performanceMarker.mark('concept-load-start')
    
    try {
      let response: Response
      
      // Determine which fixture file to use
      if (count <= 100) {
        response = await fetch('/fixtures/concepts-100.json')
      } else if (count <= 200) {
        response = await fetch('/fixtures/concepts-200.json')
      } else {
        response = await fetch('/fixtures/concepts-15k.json')
      }
      
      const data = await response.json()
      const loadedConcepts = data.concepts.slice(0, count)
      
      performanceMarker.mark('concept-load-end')
      const loadTime = performanceMarker.measure('concept-load', 'concept-load-start', 'concept-load-end')
      
      console.log(`📥 Loaded ${loadedConcepts.length} concepts in ${loadTime.toFixed(2)}ms`)
      setConcepts(loadedConcepts)
      
    } catch (error) {
      console.error('Failed to load concepts:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  // Handle concept count change
  const handleConceptCountChange = (count: number) => {
    setConceptCount(count)
    setBenchmarkResult(null)
    metricsHistory.current = []
  }
  
  // Load concepts when count changes
  useEffect(() => {
    loadConcepts(conceptCount)
  }, [conceptCount])
  
  // Handle brain vertices loaded
  const handleVerticesLoaded = (loadedVertices: THREE.Vector3[]) => {
    performanceMarker.mark('vertices-loaded')
    console.log(`🧠 Brain mesh loaded: ${loadedVertices.length} vertices`)
    setVertices(loadedVertices)
  }
  
  // Handle performance metrics
  const handleMetrics = (metrics: PerformanceMetrics) => {
    setCurrentMetrics(metrics)
    metricsHistory.current.push(metrics)
    
    // Keep only last 60 seconds of metrics
    const now = performance.now()
    metricsHistory.current = metricsHistory.current.filter(m => now - m.timestamp < 60000)
  }
  
  // Run benchmark
  const runBenchmark = async () => {
    if (isRunning || concepts.length === 0) return
    
    setIsRunning(true)
    setBenchmarkResult(null)
    metricsHistory.current = []
    
    console.log(`🏁 Starting benchmark with ${conceptCount} concepts...`)
    performanceMarker.mark('benchmark-start')
    
    // Wait for scene to stabilize (3 seconds)
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Collect metrics for 10 seconds
    const benchmarkDuration = 10000
    const startTime = performance.now()
    
    await new Promise(resolve => setTimeout(resolve, benchmarkDuration))
    
    performanceMarker.mark('benchmark-end')
    const totalDuration = performanceMarker.measure('benchmark', 'benchmark-start', 'benchmark-end')
    
    // Analyze collected metrics
    const relevantMetrics = metricsHistory.current.filter(m => 
      m.timestamp >= startTime && m.timestamp <= startTime + benchmarkDuration
    )
    
    if (relevantMetrics.length === 0) {
      console.warn('⚠️ No metrics collected during benchmark')
      setIsRunning(false)
      return
    }
    
    const fps = relevantMetrics.map(m => m.fps)
    const frameTimes = relevantMetrics.map(m => m.frameTime)
    const memoryUsage = relevantMetrics[relevantMetrics.length - 1]?.memoryMB || 0
    const drawCalls = relevantMetrics[relevantMetrics.length - 1]?.drawCalls || 0
    
    // Identify bottlenecks
    const bottlenecks: string[] = []
    const avgFps = fps.reduce((a, b) => a + b, 0) / fps.length
    const minFps = Math.min(...fps)
    const avgFrameTime = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length
    
    if (avgFps < 30) bottlenecks.push('Low FPS')
    if (avgFrameTime > 33) bottlenecks.push('High frame time')
    if (memoryUsage > 1000) bottlenecks.push('High memory usage')
    if (drawCalls > 100) bottlenecks.push('High draw calls')
    
    const result: BenchmarkResult = {
      conceptCount,
      averageFps: avgFps,
      minFps,
      maxFps: Math.max(...fps),
      averageFrameTime: avgFrameTime,
      memoryUsageMB: memoryUsage,
      drawCalls,
      duration: totalDuration,
      bottlenecks
    }
    
    setBenchmarkResult(result)
    setIsRunning(false)
    
    // Log results
    console.log('📊 Benchmark Results:', result)
    console.log(`✅ ${conceptCount} concepts: ${avgFps.toFixed(1)} avg FPS, ${avgFrameTime.toFixed(2)}ms frame time`)
    
    if (bottlenecks.length > 0) {
      console.warn('⚠️ Bottlenecks identified:', bottlenecks.join(', '))
    }
  }
  
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <PerformanceOverlay
        metrics={currentMetrics}
        benchmarkResult={benchmarkResult}
        conceptCount={conceptCount}
        onConceptCountChange={handleConceptCountChange}
        onStartBenchmark={runBenchmark}
        isRunning={isRunning}
      />
      
      {isLoading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '20px',
          borderRadius: '8px',
          zIndex: 2000
        }}>
          Loading {conceptCount} concepts...
        </div>
      )}
      
      <ThreeCanvas
        camera={{ position: [0, 0, 30], fov: 60 }}
        onCreated={(state) => {
          console.log('🎮 Three.js renderer initialized:', {
            renderer: state.gl.info?.render,
            memory: state.gl.info?.memory
          })
        }}
      >
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={50}
          minPolarAngle={Math.PI * 0.1}
          maxPolarAngle={Math.PI * 0.9}
          enableDamping={true}
          dampingFactor={0.05}
        />
        
        <Stats showPanel={0} />
        
        <PerformanceMonitor
          onMetrics={handleMetrics}
          conceptCount={concepts.length}
          enabled={true}
        />
        
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />
        
        {/* Brain mesh */}
        <BrainMesh
          modelPath={process.env.NEXT_PUBLIC_BRAIN_MESH_URL || "/models/brain.obj"}
          onVerticesLoaded={handleVerticesLoaded}
          wireframeColor="#00aaff"
          opacity={0.3}
        />
        
        {/* Concept particles */}
        {vertices.length > 0 && concepts.length > 0 && (
          <ConceptParticles
            concepts={concepts}
            vertices={vertices}
            particleSize={3}
            visible={true}
            onHover={(concept, index) => {
              if (concept) {
                console.log(`🎯 Hovered: ${concept.label} (${index})`)
              }
            }}
            onClick={(concept, index) => {
              console.log(`🖱️ Clicked: ${concept.label} (${index})`)
            }}
          />
        )}
      </ThreeCanvas>
    </div>
  )
}

export default BrainPerformanceBaseline