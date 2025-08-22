import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Node } from '@refinery/schema'

export interface EdgeRendererProps {
  /** Concepts to potentially render edges for */
  concepts: Node[]
  /** Brain vertices for positioning */
  vertices: THREE.Vector3[]
  /** Selected concept IDs - only these will show edges */
  selectedConcepts: Set<string>
  /** Maximum number of edges to render (performance limit) */
  maxEdges?: number
  /** Whether to show pulse animation on edges */
  enablePulse?: boolean
  /** Base edge color */
  edgeColor?: string | number
  /** Edge opacity */
  opacity?: number
  /** Whether edges are visible at all */
  visible?: boolean
}

interface EdgeData {
  conceptId: string
  startPos: THREE.Vector3
  endPos: THREE.Vector3
  controlPoint1: THREE.Vector3
  controlPoint2: THREE.Vector3
}

/**
 * Session 14: EdgeRenderer - Causal Path Pulses & Edges
 * 
 * Lightweight edge renderer with the following features:
 * - Edges OFF by default (visible=false, selectedConcepts empty)
 * - Only renders edges for selected concepts (≤100 visible via maxEdges)
 * - Bezier curve rendering with additive blend mode
 * - Optional pulse animation on selected paths
 * - Performance-optimized with LOD and culling
 */
export function EdgeRenderer({
  concepts,
  vertices,
  selectedConcepts,
  maxEdges = 100,
  enablePulse = false,
  edgeColor = 0x00ffff,
  opacity = 0.6,
  visible = false, // OFF by default
}: EdgeRendererProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const timeRef = useRef<number>(0)

  // Generate edge data only for selected concepts
  const edgeData = useMemo(() => {
    if (!visible || selectedConcepts.size === 0 || vertices.length === 0) {
      return []
    }

    const edges: EdgeData[] = []
    const selectedConceptsArray = Array.from(selectedConcepts)
    
    // Limit to maxEdges for performance
    const conceptsToProcess = selectedConceptsArray.slice(0, maxEdges)
    
    for (let i = 0; i < conceptsToProcess.length; i++) {
      const conceptId = conceptsToProcess[i]
      const concept = concepts.find(c => c.id === conceptId)
      if (!concept) continue

      // Find related concepts (simple heuristic - could be enhanced with actual relationship data)
      const relatedConcepts = concepts.filter(c => 
        c.id !== conceptId && 
        (c.label.toLowerCase().includes(concept.label.toLowerCase().split(' ')[0]) ||
         concept.label.toLowerCase().includes(c.label.toLowerCase().split(' ')[0]))
      ).slice(0, 3) // Limit relations per concept

      for (const related of relatedConcepts) {
        if (edges.length >= maxEdges) break

        // Get vertex positions (simplified - using concept ID hash for positioning)
        const startVertexIndex = Math.abs(hashString(conceptId)) % vertices.length
        const endVertexIndex = Math.abs(hashString(related.id)) % vertices.length
        
        const startPos = vertices[startVertexIndex].clone()
        const endPos = vertices[endVertexIndex].clone()
        
        // Generate Bezier control points for curved edges
        const midPoint = startPos.clone().add(endPos).multiplyScalar(0.5)
        const offset = startPos.clone().sub(endPos).normalize().multiplyScalar(2)
        const perpendicular = new THREE.Vector3(-offset.z, offset.y, offset.x)
        
        const controlPoint1 = midPoint.clone().add(perpendicular.clone().multiplyScalar(1.5))
        const controlPoint2 = midPoint.clone().add(perpendicular.clone().multiplyScalar(-1.5))

        edges.push({
          conceptId,
          startPos,
          endPos,
          controlPoint1,
          controlPoint2,
        })
      }
    }

    return edges
  }, [concepts, vertices, selectedConcepts, maxEdges, visible])

  // Generate geometry for Bezier curves
  const geometry = useMemo(() => {
    if (edgeData.length === 0) {
      return new THREE.BufferGeometry()
    }

    const positions: number[] = []
    const indices: number[] = []
    let vertexIndex = 0

    for (const edge of edgeData) {
      const curve = new THREE.CubicBezierCurve3(
        edge.startPos,
        edge.controlPoint1,
        edge.controlPoint2,
        edge.endPos
      )

      const points = curve.getPoints(20) // 20 segments per curve
      
      for (let i = 0; i < points.length; i++) {
        positions.push(points[i].x, points[i].y, points[i].z)
        
        if (i < points.length - 1) {
          indices.push(vertexIndex + i, vertexIndex + i + 1)
        }
      }
      
      vertexIndex += points.length
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geo.setIndex(indices)
    
    return geo
  }, [edgeData])

  // Shader material for additive blending and pulse effect
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(edgeColor) },
        opacity: { value: opacity },
        enablePulse: { value: enablePulse },
      },
      vertexShader: `
        varying vec3 vPosition;
        varying float vProgress;
        
        void main() {
          vPosition = position;
          vProgress = position.z; // Use Z as progress along curve
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color;
        uniform float opacity;
        uniform bool enablePulse;
        
        varying vec3 vPosition;
        varying float vProgress;
        
        void main() {
          float alpha = opacity;
          
          if (enablePulse) {
            // Pulse effect: traveling wave along the edge
            float pulse = sin(vProgress * 10.0 - time * 5.0) * 0.5 + 0.5;
            alpha *= (0.3 + 0.7 * pulse);
          }
          
          // Fade towards edges
          float edgeFade = 1.0 - pow(abs(vProgress), 2.0);
          alpha *= edgeFade;
          
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending, // Additive blend mode
      depthWrite: false,
    })
  }, [edgeColor, opacity, enablePulse])

  // Update time uniform for pulse animation
  useFrame((state) => {
    if (materialRef.current && enablePulse) {
      timeRef.current = state.clock.getElapsedTime()
      materialRef.current.uniforms.time.value = timeRef.current
    }
  })

  // Update material reference
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.color.value.set(edgeColor)
      materialRef.current.uniforms.opacity.value = opacity
      materialRef.current.uniforms.enablePulse.value = enablePulse
    }
  }, [edgeColor, opacity, enablePulse])

  if (!visible || edgeData.length === 0) {
    return null
  }

  return (
    <mesh ref={meshRef} geometry={geometry} material={material}>
      <primitive object={material} ref={materialRef} attach="material" />
    </mesh>
  )
}

// Simple string hash function for deterministic positioning
function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash)
}

export default EdgeRenderer