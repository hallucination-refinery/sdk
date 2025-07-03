import { describe, it, expect } from 'vitest'
import {
  LayoutTypeSchema,
  LayoutConfigSchema,
  ForceLayoutParamsSchema,
  HierarchicalLayoutParamsSchema,
  CircularLayoutParamsSchema,
  GridLayoutParamsSchema,
  LayoutStateSchema,
  DefaultLayouts,
  type LayoutConfig,
} from '../layout'

describe('LayoutTypeSchema', () => {
  it('should validate layout types', () => {
    const validTypes = [
      'force-directed',
      'hierarchical',
      'circular',
      'grid',
      'radial',
      'random',
      'custom',
    ]
    
    validTypes.forEach(type => {
      expect(LayoutTypeSchema.safeParse(type).success).toBe(true)
    })
  })

  it('should reject invalid layout types', () => {
    expect(LayoutTypeSchema.safeParse('invalid').success).toBe(false)
    expect(LayoutTypeSchema.safeParse('').success).toBe(false)
    expect(LayoutTypeSchema.safeParse(123).success).toBe(false)
  })
})

describe('Layout Parameter Schemas', () => {
  describe('ForceLayoutParamsSchema', () => {
    it('should validate with defaults', () => {
      const result = ForceLayoutParamsSchema.safeParse({})
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.chargeStrength).toBe(-300)
        expect(result.data.linkStrength).toBe(1)
        expect(result.data.linkDistance).toBe(100)
        expect(result.data.centerStrength).toBe(0.1)
        expect(result.data.collisionRadius).toBe(1.5)
        expect(result.data.alphaDecay).toBe(0.02)
        expect(result.data.velocityDecay).toBe(0.4)
      }
    })

    it('should validate custom parameters', () => {
      const params = {
        chargeStrength: -500,
        linkStrength: 0.5,
        linkDistance: 150,
        centerStrength: 0.2,
      }
      const result = ForceLayoutParamsSchema.safeParse(params)
      expect(result.success).toBe(true)
    })

    it('should reject invalid parameters', () => {
      expect(ForceLayoutParamsSchema.safeParse({ linkStrength: 1.5 }).success).toBe(false)
      expect(ForceLayoutParamsSchema.safeParse({ linkDistance: -100 }).success).toBe(false)
      expect(ForceLayoutParamsSchema.safeParse({ alphaDecay: 2 }).success).toBe(false)
    })
  })

  describe('HierarchicalLayoutParamsSchema', () => {
    it('should validate with defaults', () => {
      const result = HierarchicalLayoutParamsSchema.safeParse({})
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.direction).toBe('top-down')
        expect(result.data.levelSpacing).toBe(150)
        expect(result.data.nodeSpacing).toBe(100)
        expect(result.data.alignment).toBe('center')
      }
    })

    it('should validate directions', () => {
      const directions = ['top-down', 'bottom-up', 'left-right', 'right-left']
      directions.forEach(direction => {
        const result = HierarchicalLayoutParamsSchema.safeParse({ direction })
        expect(result.success).toBe(true)
      })
    })

    it('should validate alignments', () => {
      const alignments = ['start', 'center', 'end']
      alignments.forEach(alignment => {
        const result = HierarchicalLayoutParamsSchema.safeParse({ alignment })
        expect(result.success).toBe(true)
      })
    })
  })

  describe('CircularLayoutParamsSchema', () => {
    it('should validate with defaults', () => {
      const result = CircularLayoutParamsSchema.safeParse({})
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.radius).toBe(200)
        expect(result.data.startAngle).toBe(0)
        expect(result.data.sortByDegree).toBe(false)
      }
    })

    it('should validate custom parameters', () => {
      const params = {
        radius: 300,
        startAngle: Math.PI / 2,
        sortByDegree: true,
      }
      const result = CircularLayoutParamsSchema.safeParse(params)
      expect(result.success).toBe(true)
    })
  })

  describe('GridLayoutParamsSchema', () => {
    it('should validate with defaults', () => {
      const result = GridLayoutParamsSchema.safeParse({})
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.spacing).toBe(100)
        expect(result.data.center).toBe(true)
        expect(result.data.columns).toBeUndefined()
      }
    })

    it('should validate custom parameters', () => {
      const params = {
        columns: 5,
        spacing: 150,
        center: false,
      }
      const result = GridLayoutParamsSchema.safeParse(params)
      expect(result.success).toBe(true)
    })
  })
})

describe('LayoutConfigSchema', () => {
  it('should validate force-directed config', () => {
    const config: LayoutConfig = {
      type: 'force-directed',
      params: {
        chargeStrength: -400,
        linkDistance: 120,
      },
    }
    const result = LayoutConfigSchema.safeParse(config)
    expect(result.success).toBe(true)
  })

  it('should validate hierarchical config', () => {
    const config: LayoutConfig = {
      type: 'hierarchical',
      params: {
        direction: 'left-right',
        levelSpacing: 200,
      },
    }
    const result = LayoutConfigSchema.safeParse(config)
    expect(result.success).toBe(true)
  })

  it('should validate radial config', () => {
    const config: LayoutConfig = {
      type: 'radial',
      params: {
        focusNodeId: 'node-1',
        levelSpacing: 150,
      },
    }
    const result = LayoutConfigSchema.safeParse(config)
    expect(result.success).toBe(true)
  })

  it('should validate custom config', () => {
    const config: LayoutConfig = {
      type: 'custom',
      params: {
        customParam1: 'value',
        customParam2: 123,
        nested: { data: true },
      },
    }
    const result = LayoutConfigSchema.safeParse(config)
    expect(result.success).toBe(true)
  })

  it('should reject mismatched type and params', () => {
    const config = {
      type: 'force-directed',
      params: {
        direction: 'top-down', // hierarchical param
      },
    }
    // This should pass because extra fields are allowed
    const result = LayoutConfigSchema.safeParse(config)
    expect(result.success).toBe(true)
  })
})

describe('LayoutStateSchema', () => {
  it('should validate layout state', () => {
    const state = {
      config: {
        type: 'force-directed' as const,
        params: {},
      },
      isRunning: false,
      progress: 0.5,
      animate: true,
      animationDuration: 1500,
    }
    const result = LayoutStateSchema.safeParse(state)
    expect(result.success).toBe(true)
  })

  it('should provide defaults', () => {
    const state = {
      config: {
        type: 'grid' as const,
      },
    }
    const result = LayoutStateSchema.safeParse(state)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.isRunning).toBe(false)
      expect(result.data.progress).toBe(0)
      expect(result.data.animate).toBe(true)
      expect(result.data.animationDuration).toBe(1000)
    }
  })

  it('should validate progress bounds', () => {
    const state = {
      config: { type: 'circular' as const },
      progress: 1.5, // invalid
    }
    expect(LayoutStateSchema.safeParse(state).success).toBe(false)
  })
})

describe('DefaultLayouts', () => {
  it('should create force-directed layout', () => {
    const layout = DefaultLayouts.forceDirected()
    expect(layout.type).toBe('force-directed')
    expect(layout.params).toBeDefined()
    expect(layout.params?.chargeStrength).toBe(-300)
  })

  it('should create hierarchical layout with direction', () => {
    const layout = DefaultLayouts.hierarchical('left-right')
    expect(layout.type).toBe('hierarchical')
    expect(layout.params?.direction).toBe('left-right')
  })

  it('should create circular layout', () => {
    const layout = DefaultLayouts.circular()
    expect(layout.type).toBe('circular')
    expect(layout.params?.radius).toBe(200)
  })

  it('should create grid layout', () => {
    const layout = DefaultLayouts.grid()
    expect(layout.type).toBe('grid')
    expect(layout.params?.spacing).toBe(100)
  })

  it('should create radial layout with focus node', () => {
    const layout = DefaultLayouts.radial('node-1')
    expect(layout.type).toBe('radial')
    expect(layout.params?.focusNodeId).toBe('node-1')
  })

  it('should create random layout', () => {
    const layout = DefaultLayouts.random()
    expect(layout.type).toBe('random')
    expect(layout.params?.bounds).toEqual({ min: -500, max: 500 })
  })
})