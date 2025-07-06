import { useEffect, useRef, useState } from 'react'
import { Canvas as ThreeCanvas } from '@react-three/fiber'
import { Stats, OrbitControls } from '@react-three/drei'
import { NodeSprite } from './components'
import type { IdeaNode } from '@refinery/schema'

// Extend Performance interface to include memory property
declare global {
  interface Performance {
    memory?: {
      usedJSHeapSize: number
      totalJSHeapSize: number
      jsHeapSizeLimit: number
    }
  }
}

// Generate 2k test nodes
function generateTestNodes(count: number): IdeaNode[] {
  const nodes: IdeaNode[] = []
  const gridSize = Math.ceil(Math.sqrt(count))
  const spacing = 3
  
  for (let i = 0; i < count; i++) {
    const x = (i % gridSize) * spacing - (gridSize * spacing) / 2
    const z = Math.floor(i / gridSize) * spacing - (gridSize * spacing) / 2
    const y = Math.random() * 2 - 1
    
    nodes.push({
      id: `node-${i}`,
      label: `Node ${i}`,
      position: { x, y, z },
      color: `hsl(${(i / count) * 360}, 70%, 50%)`,
    })
  }
  
  return nodes
}

// Performance measurement component
function PerfMonitor({ nodeCount }: { nodeCount: number }) {
  const frameCount = useRef(0)
  const lastTime = useRef(performance.now())
  const [fps, setFps] = useState(0)
  const [heapMB, setHeapMB] = useState(0)
  
  useEffect(() => {
    const interval = setInterval(() => {
      const now = performance.now()
      const delta = now - lastTime.current
      const currentFps = Math.round((frameCount.current * 1000) / delta)
      
      setFps(currentFps)
      frameCount.current = 0
      lastTime.current = now
      
      // Measure heap if available
      if (performance.memory) {
        setHeapMB(Math.round(performance.memory.usedJSHeapSize / 1024 / 1024))
      }
    }, 1000)
    
    return () => clearInterval(interval)
  }, [])
  
  // Count frames
  useEffect(() => {
    const animate = () => {
      frameCount.current++
      requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [])
  
  return (
    <div style={{
      position: 'absolute',
      top: 10,
      left: 10,
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      fontFamily: 'monospace',
      fontSize: '14px',
      borderRadius: '4px',
      zIndex: 1000
    }}>
      <div>Nodes: {nodeCount}</div>
      <div>FPS: {fps}</div>
      <div>Heap: {heapMB} MB</div>
    </div>
  )
}

// Test scene with nodes and sprites
function TestScene({ nodes }: { nodes: IdeaNode[] }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      
      {nodes.map(node => (
        <group key={node.id} position={[node.position!.x, node.position!.y, node.position!.z]}>
          {/* Node mesh */}
          <mesh>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial color={node.color || '#2196F3'} />
          </mesh>
          
          {/* Node sprite */}
          <NodeSprite
            text={node.label}
            position={[0, 0.8, 0]}
            scale={1.5}
            color="#ffffff"
            backgroundColor="#000000"
            backgroundOpacity={0.7}
            fontSize={24}
            padding={4}
          />
        </group>
      ))}
    </>
  )
}

// Main performance probe component
export function PerfProbe() {
  const [nodeCount, setNodeCount] = useState(2000)
  const [nodes, setNodes] = useState<IdeaNode[]>([])
  
  useEffect(() => {
    console.log(`Generating ${nodeCount} nodes...`)
    const start = performance.now()
    const newNodes = generateTestNodes(nodeCount)
    const elapsed = performance.now() - start
    console.log(`Generated ${nodeCount} nodes in ${elapsed.toFixed(2)}ms`)
    setNodes(newNodes)
    
    // Force garbage collection if available
    if (global.gc) {
      global.gc()
    }
  }, [nodeCount])
  
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <PerfMonitor nodeCount={nodeCount} />
      
      <div style={{
        position: 'absolute',
        bottom: 10,
        left: 10,
        zIndex: 1000
      }}>
        <button onClick={() => setNodeCount(500)}>500 nodes</button>
        <button onClick={() => setNodeCount(1000)}>1k nodes</button>
        <button onClick={() => setNodeCount(2000)}>2k nodes</button>
        <button onClick={() => setNodeCount(5000)}>5k nodes</button>
      </div>
      
      <ThreeCanvas
        camera={{ position: [0, 50, 100], fov: 60 }}
        onCreated={(state) => {
          console.log('Three.js renderer info:', state.gl.info)
        }}
      >
        <OrbitControls />
        <Stats showPanel={0} />
        
        <TestScene nodes={nodes} />
      </ThreeCanvas>
    </div>
  )
}