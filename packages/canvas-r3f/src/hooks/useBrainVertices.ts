import { useState, useEffect } from 'react'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import * as THREE from 'three'
import {
  extractVerticesFromObject,
  analyzeVertexDistribution,
  calculateRegionBoundaries,
  validateRegionDistribution,
  RegionBoundaries,
  RegionDistribution
} from '../VertexMapper'

export interface BrainVerticesState {
  vertices: THREE.Vector3[]
  analysis: {
    yMin: number
    yMax: number
    yRange: number
    count: number
  }
  boundaries: RegionBoundaries
  validation: {
    valid: boolean
    actual: RegionDistribution
    target: RegionDistribution
    errors: string[]
  }
  loading: boolean
  error: string | null
}

export function useBrainVertices(modelPath: string = process.env.NEXT_PUBLIC_BRAIN_MESH_URL || '/models/brain.obj'): BrainVerticesState {
  const [state, setState] = useState<BrainVerticesState>({
    vertices: [],
    analysis: {
      yMin: 0,
      yMax: 0,
      yRange: 0,
      count: 0
    },
    boundaries: {
      frontal: { min: 0, max: 0 },
      parietal: { min: 0, max: 0 },
      temporal: { min: 0, max: 0 },
      occipital: { min: 0, max: 0 }
    },
    validation: {
      valid: false,
      actual: { frontal: 0, parietal: 0, temporal: 0, occipital: 0 },
      target: { frontal: 0.30, parietal: 0.25, temporal: 0.25, occipital: 0.20 },
      errors: []
    },
    loading: true,
    error: null
  })
  
  useEffect(() => {
    const loader = new OBJLoader()
    
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    loader.load(
      modelPath,
      (object) => {
        try {
          const vertices = extractVerticesFromObject(object)
          const analysis = analyzeVertexDistribution(vertices)
          const boundaries = calculateRegionBoundaries(vertices)
          const validation = validateRegionDistribution(vertices, boundaries)
          
          setState({
            vertices,
            analysis: {
              yMin: analysis.yMin,
              yMax: analysis.yMax,
              yRange: analysis.yRange,
              count: analysis.count
            },
            boundaries,
            validation,
            loading: false,
            error: null
          })
          
          console.log('Brain vertices loaded:', {
            count: vertices.length,
            yRange: [analysis.yMin, analysis.yMax],
            distribution: validation.actual,
            valid: validation.valid
          })
        } catch (err) {
          setState(prev => ({
            ...prev,
            loading: false,
            error: err instanceof Error ? err.message : 'Failed to process vertices'
          }))
        }
      },
      (progress) => {
        console.log('Loading brain mesh:', (progress.loaded / progress.total * 100).toFixed(0) + '%')
      },
      (error) => {
        setState(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to load brain mesh'
        }))
      }
    )
  }, [modelPath])
  
  return state
}