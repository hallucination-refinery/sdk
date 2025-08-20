import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { useBrainVertices } from './hooks/useBrainVertices'
import { getRegionVertices, getRegionColor } from './VertexMapper'

export interface BrainRegionDebugProps {
  modelPath?: string
  showRegions?: boolean
  showWireframe?: boolean
  regionOpacity?: number
  position?: [number, number, number]
  scale?: [number, number, number] | number
  rotation?: [number, number, number]
}

export function BrainRegionDebug({
  modelPath = '/models/brain.obj',
  showRegions = true,
  showWireframe = true,
  regionOpacity = 0.6,
  position = [0, 0, 0],
  scale = 1,
  rotation = [0, 0, 0]
}: BrainRegionDebugProps) {
  const groupRef = useRef<THREE.Group>(null)
  const { vertices, boundaries, validation, loading, error } = useBrainVertices(modelPath)
  
  const meshScale: [number, number, number] = Array.isArray(scale)
    ? [scale[0], scale[1], scale[2] ?? scale[1]]
    : [scale, scale, scale]
  
  const regionGeometries = useMemo(() => {
    if (vertices.length === 0) return []
    
    const geometries: { region: number; geometry: THREE.BufferGeometry; color: string }[] = []
    
    for (let regionIndex = 0; regionIndex < 4; regionIndex++) {
      const indices = getRegionVertices(vertices, regionIndex, boundaries)
      
      if (indices.length > 0) {
        const points = indices.map(i => vertices[i])
        const geometry = new THREE.BufferGeometry().setFromPoints(points)
        
        geometries.push({
          region: regionIndex,
          geometry,
          color: getRegionColor(regionIndex)
        })
      }
    }
    
    return geometries
  }, [vertices, boundaries])
  
  if (loading) {
    return (
      <group ref={groupRef} position={position} scale={meshScale} rotation={rotation}>
        <mesh>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshBasicMaterial color="#666666" />
        </mesh>
      </group>
    )
  }
  
  if (error) {
    console.error('BrainRegionDebug error:', error)
    return null
  }
  
  return (
    <group ref={groupRef} position={position} scale={meshScale} rotation={rotation}>
      {showRegions && regionGeometries.map(({ region, geometry, color }) => (
        <points key={`region-${region}`} geometry={geometry as any}>
          <pointsMaterial
            color={color}
            size={3}
            transparent
            opacity={regionOpacity}
            sizeAttenuation={false}
          />
        </points>
      ))}
      
      {showWireframe && vertices.length > 0 && (
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[new Float32Array(vertices.flatMap(v => [v.x, v.y, v.z])), 3]}
              count={vertices.length}
              array={new Float32Array(vertices.flatMap(v => [v.x, v.y, v.z]))}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            color="#00ffff"
            size={1}
            transparent
            opacity={0.3}
            sizeAttenuation={false}
          />
        </points>
      )}
      
      {validation && !validation.valid && (
        <group position={[0, 2, 0]}>
          {validation.errors.map((_, i) => (
            <mesh key={i} position={[0, -i * 0.3, 0]}>
              <planeGeometry args={[3, 0.2]} />
              <meshBasicMaterial color="#ff0000" />
            </mesh>
          ))}
        </group>
      )}
    </group>
  )
}

export function BrainRegionStats({ modelPath = '/models/brain.obj' }: { modelPath?: string }) {
  const { analysis, validation, loading } = useBrainVertices(modelPath)
  
  if (loading) return <div>Loading brain vertices...</div>
  
  return (
    <div style={{ 
      position: 'absolute', 
      top: 10, 
      left: 10, 
      background: 'rgba(0,0,0,0.8)', 
      color: 'white',
      padding: '10px',
      fontFamily: 'monospace',
      fontSize: '12px',
      borderRadius: '4px'
    }}>
      <h3 style={{ margin: '0 0 10px 0' }}>Brain Region Analysis</h3>
      <div>Total Vertices: {analysis.count}</div>
      <div>Y Range: [{analysis.yMin.toFixed(2)}, {analysis.yMax.toFixed(2)}]</div>
      <div>Validation: {validation.valid ? '✅ PASS' : '❌ FAIL'}</div>
      <h4 style={{ margin: '10px 0 5px 0' }}>Distribution:</h4>
      {Object.entries(validation.actual).map(([region, value]) => (
        <div key={region} style={{ color: getRegionColor(['frontal', 'parietal', 'temporal', 'occipital'].indexOf(region)) }}>
          {region}: {(value * 100).toFixed(1)}% 
          (target: {(validation.target[region as keyof typeof validation.target] * 100).toFixed(0)}%)
        </div>
      ))}
      {validation.errors.length > 0 && (
        <>
          <h4 style={{ margin: '10px 0 5px 0', color: '#ff6666' }}>Errors:</h4>
          {validation.errors.map((err, i) => (
            <div key={i} style={{ color: '#ff6666', fontSize: '11px' }}>{err}</div>
          ))}
        </>
      )}
    </div>
  )
}