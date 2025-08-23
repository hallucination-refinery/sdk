import { render } from '@testing-library/react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { ConceptParticles } from './ConceptParticles'
import { worldUnitsPerPixel, worldRadiusForPixelSize, clampInstanceScale } from './cameraUtils'
import { Node } from '@refinery/schema'

describe('ConceptParticles Size Stability', () => {
  const mockVertices = [
    new THREE.Vector3(10, 10, 10),
    new THREE.Vector3(-10, 10, 10),
    new THREE.Vector3(10, -10, 10),
    new THREE.Vector3(-10, -10, 10),
  ]

  const mockConcepts: Node[] = [
    { id: 'test1', label: 'Test Concept 1' },
    { id: 'test2', label: 'Test Concept 2' },
  ]

  describe('worldUnitsPerPixel helper', () => {
    it('should calculate consistent units per pixel for perspective camera', () => {
      const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
      const targetDepth = 50
      
      const unitsPerPixel1 = worldUnitsPerPixel(camera, targetDepth, 1000)
      const unitsPerPixel2 = worldUnitsPerPixel(camera, targetDepth, 1000)
      
      expect(unitsPerPixel1).toBe(unitsPerPixel2)
      expect(unitsPerPixel1).toBeGreaterThan(0)
    })

    it('should handle orthographic camera', () => {
      const camera = new THREE.OrthographicCamera(-100, 100, 100, -100, 0.1, 1000)
      const unitsPerPixel = worldUnitsPerPixel(camera, 50, 1000)
      
      expect(unitsPerPixel).toBe(0.2) // (100 - (-100)) / 1000
    })
  })

  describe('worldRadiusForPixelSize helper', () => {
    it('should calculate consistent world radius for target pixel size', () => {
      const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
      const targetPixelSize = 15
      const targetDepth = 50
      
      const radius1 = worldRadiusForPixelSize(camera, targetPixelSize, targetDepth)
      const radius2 = worldRadiusForPixelSize(camera, targetPixelSize, targetDepth)
      
      expect(radius1).toBe(radius2)
      expect(radius1).toBeGreaterThan(0)
    })
  })

  describe('clampInstanceScale helper', () => {
    it('should clamp scale within ±10% variance by default', () => {
      const baseScale = 10
      const maxVariance = 0.1 // 10%
      
      // Test within range (should remain unchanged)
      expect(clampInstanceScale(9.5, baseScale, maxVariance)).toBe(9.5)
      expect(clampInstanceScale(10.5, baseScale, maxVariance)).toBe(10.5)
      
      // Test outside range (should be clamped)
      expect(clampInstanceScale(8.5, baseScale, maxVariance)).toBe(9.0) // 10% below base
      expect(clampInstanceScale(12.0, baseScale, maxVariance)).toBe(11.0) // 10% above base
    })

    it('should handle custom variance limits', () => {
      const baseScale = 5
      const maxVariance = 0.2 // 20%
      
      // 20% range: 4.0 to 6.0
      expect(clampInstanceScale(3.5, baseScale, maxVariance)).toBe(4.0)
      expect(clampInstanceScale(6.5, baseScale, maxVariance)).toBe(6.0)
      expect(clampInstanceScale(5.5, baseScale, maxVariance)).toBe(5.5)
    })
  })

  describe('Size stability integration', () => {
    it('should render with stable sizing helper', () => {
      const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
      
      render(
        <Canvas camera={camera}>
          <ConceptParticles
            concepts={mockConcepts}
            vertices={mockVertices}
            particleSize={15}
            renderMode="spheres"
            camera={camera}
            visible={true}
          />
        </Canvas>
      )
      
      // Component should render without errors
      // Size stability is validated through the camera utils helpers
    })
  })

  describe('Zoom perturbation analysis', () => {
    it('should maintain size variance < ±10% on small zoom changes', () => {
      const baseFov = 75
      const camera1 = new THREE.PerspectiveCamera(baseFov, 1, 0.1, 1000)
      const camera2 = new THREE.PerspectiveCamera(baseFov * 1.05, 1, 0.1, 1000) // 5% zoom change
      
      const targetDepth = 50
      const targetPixelSize = 15
      
      const radius1 = worldRadiusForPixelSize(camera1, targetPixelSize, targetDepth)
      const radius2 = worldRadiusForPixelSize(camera2, targetPixelSize, targetDepth)
      
      // Calculate variance
      const variance = Math.abs(radius2 - radius1) / radius1
      
      // Size stability requirement: variance < ±10% on small zoom perturbation
      expect(variance).toBeLessThan(0.1)
    })
  })
})