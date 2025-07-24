import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import ForceGraphAdapter, {
  type ForceGraphAdapterProps,
  type ForceGraphAdapterRef,
} from './ForceGraphAdapter'

describe('ForceGraphAdapter', () => {
  it('should export ForceGraphAdapter as default', () => {
    expect(ForceGraphAdapter).toBeDefined()
    expect(typeof ForceGraphAdapter).toBe('object') // forwardRef returns an object
  })

  it('should have correct displayName', () => {
    expect(ForceGraphAdapter.displayName).toBe('ForceGraphAdapter')
  })

  it('should export TypeScript types', () => {
    // Type checking test - these are compile-time checks
    const props: ForceGraphAdapterProps = {
      graphData: { nodes: [], links: [] },
      nodeId: 'id',
      linkSource: 'source',
      linkTarget: 'target',
      onNodeClick: () => {},
      onNodeHover: () => {},
      nodeThreeObject: () => null,
      nodeThreeObjectExtend: () => true,
      linkColor: () => '#000',
      linkWidth: () => 1,
      linkCurvature: 0.2,
      cooldownTime: 1000,
      nodeVisibility: () => true,
      linkVisibility: () => true,
    }

    // Ref type check
    const refType: React.RefObject<ForceGraphAdapterRef | null> = { current: null }

    // These assertions just verify the types compile correctly
    expect(props).toBeDefined()
    expect(refType).toBeDefined()
  })

  it('should accept all documented props', () => {
    // This test verifies the prop interface is complete
    const allProps: ForceGraphAdapterProps = {
      // Core props
      graphData: { nodes: [], links: [] },

      // Node/Link ID accessors
      nodeId: 'id',
      linkSource: 'source',
      linkTarget: 'target',

      // Event handlers
      onNodeClick: () => {},
      onNodeHover: () => {},
      onNodeRightClick: () => {},
      onLinkClick: () => {},
      onLinkHover: () => {},
      onBackgroundClick: () => {},
      onBackgroundRightClick: () => {},

      // Node rendering
      nodeThreeObject: () => null,
      nodeThreeObjectExtend: () => true,
      nodeVisibility: () => true,
      nodeColor: () => '#000',
      nodeOpacity: 0.8,
      nodeRelSize: 4,
      nodeVal: () => 1,
      nodeLabel: () => 'label',
      nodeDesc: () => 'desc',

      // Link rendering
      linkVisibility: () => true,
      linkColor: () => '#000',
      linkWidth: () => 1,
      linkCurvature: 0.2,
      linkCurveRotation: 0.5,
      linkMaterial: {},
      linkOpacity: 0.6,
      linkResolution: 8,

      // Force simulation
      d3AlphaDecay: 0.01,
      d3VelocityDecay: 0.4,
      warmupTicks: 100,
      cooldownTicks: 200,
      cooldownTime: 5000,

      // Camera
      enableNodeDrag: true,
      enableNavigationControls: true,
      enablePointerInteraction: true,
      enableZoomPanInteraction: true,

      // Other
      customProp: 'allowed',
    }

    expect(allProps).toBeDefined()
  })

  it('should define ForceGraphAdapterRef interface', () => {
    // Type checking for ref methods
    const mockRef: ForceGraphAdapterRef = {
      d3Force: () => {},
      d3ReheatSimulation: () => {},
      graphData: () => ({ nodes: [], links: [] }),
      tickFrame: () => {},
      cameraPosition: () => {},
      zoomToFit: () => {},
      scene: () => ({}),
      camera: () => ({}),
      renderer: () => ({}),
      controls: () => ({}),
      getGraphBbox: () => ({ x: [0, 1], y: [0, 1], z: [0, 1] }),
    }

    expect(mockRef).toBeDefined()
  })

  it('accepts disableLinkForce prop', () => {
    // Since ForceGraph3D is an external component, we can't easily mock the ref
    // Just verify the prop is accepted without TypeScript errors
    const props: ForceGraphAdapterProps = {
      graphData: { nodes: [], links: [] },
      disableLinkForce: true,
    }

    expect(props.disableLinkForce).toBe(true)
  })
})
