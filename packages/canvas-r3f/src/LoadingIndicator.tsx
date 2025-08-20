import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export interface LoadingIndicatorProps {
  /** Position of the loading indicator */
  position?: [number, number, number]
  /** Scale of the loading indicator */
  scale?: number
  /** Color of the loading indicator */
  color?: string
  /** Whether the indicator is visible */
  visible?: boolean
  /** Loading message */
  message?: string
}

/**
 * 3D Loading indicator with animated rotating ring
 */
export function LoadingIndicator({
  position = [0, 0, 0],
  scale = 1,
  color = '#00aaff',
  visible = true
}: LoadingIndicatorProps) {
  const ringRef = useRef<THREE.Mesh>(null)
  const particlesRef = useRef<THREE.Points>(null)
  
  // Animate the loading ring
  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.02
      ringRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2
    }
    
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.01
    }
  })
  
  // Create particles for the loading effect
  const particleCount = 50
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)
  
  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3
    const radius = 10 + Math.random() * 5
    const theta = (i / particleCount) * Math.PI * 2
    
    positions[i3] = Math.cos(theta) * radius
    positions[i3 + 1] = (Math.random() - 0.5) * 5
    positions[i3 + 2] = Math.sin(theta) * radius
    
    const colorObj = new THREE.Color(color)
    colors[i3] = colorObj.r
    colors[i3 + 1] = colorObj.g
    colors[i3 + 2] = colorObj.b
  }
  
  if (!visible) return null
  
  return (
    <group position={position} scale={scale}>
      {/* Main loading ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[12, 1, 8, 32]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.8} />
      </mesh>
      
      {/* Particle cloud */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
            count={particleCount}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
            count={particleCount}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.5}
          transparent
          opacity={0.6}
          vertexColors
          sizeAttenuation
        />
      </points>
      
      {/* Inner pulsing sphere */}
      <mesh>
        <sphereGeometry args={[3, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.3}
          wireframe
        />
      </mesh>
    </group>
  )
}

/**
 * Simple text-based loading indicator for 2D overlay
 */
export function LoadingText({
  message = 'Loading brain mesh...',
  className = ''
}: {
  message?: string
  className?: string
}) {
  return (
    <div className={`loading-text ${className}`}>
      <div className="flex items-center justify-center space-x-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
        <span className="text-blue-500 font-medium">{message}</span>
      </div>
    </div>
  )
}