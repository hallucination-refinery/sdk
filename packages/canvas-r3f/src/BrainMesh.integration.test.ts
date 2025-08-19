import { describe, it, expect } from 'vitest'
import { BrainMesh, BrainMeshWithFallback } from './BrainMesh'
import type { BrainMeshProps } from './BrainMesh'

// Import from components index
import { BrainMesh as BrainMeshFromComponents, BrainMeshWithFallback as BrainMeshWithFallbackFromComponents } from './components'
import type { BrainMeshProps as BrainMeshPropsFromComponents } from './components'

// Import from main index
import { BrainMesh as BrainMeshFromIndex, BrainMeshWithFallback as BrainMeshWithFallbackFromIndex } from './index'
import type { BrainMeshProps as BrainMeshPropsFromIndex } from './index'

describe('BrainMesh Integration', () => {
  it('exports BrainMesh component', () => {
    expect(BrainMesh).toBeDefined()
    expect(typeof BrainMesh).toBe('function')
  })

  it('exports BrainMeshWithFallback component', () => {
    expect(BrainMeshWithFallback).toBeDefined()
    expect(typeof BrainMeshWithFallback).toBe('function')
  })

  it('exports from components index match direct imports', () => {
    expect(BrainMeshFromComponents).toBe(BrainMesh)
    expect(BrainMeshWithFallbackFromComponents).toBe(BrainMeshWithFallback)
  })

  it('exports from main index match direct imports', () => {
    expect(BrainMeshFromIndex).toBe(BrainMesh)
    expect(BrainMeshWithFallbackFromIndex).toBe(BrainMeshWithFallback)
  })

  it('type exports work correctly', () => {
    const props: BrainMeshProps = {
      position: [0, 0, 0],
      scale: 1,
      wireframeColor: '#00ffff'
    }
    expect(props).toBeDefined()

    const propsFromComponents: BrainMeshPropsFromComponents = props
    expect(propsFromComponents).toBe(props)

    const propsFromIndex: BrainMeshPropsFromIndex = props
    expect(propsFromIndex).toBe(props)
  })
})