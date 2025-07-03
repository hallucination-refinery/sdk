import { describe, it, expect } from 'vitest'
import { Vector3Schema, Vector2Schema, VectorUtils } from '../vectors'

describe('Vector Schemas', () => {
  describe('Vector3Schema', () => {
    it('should validate valid 3D vectors', () => {
      const valid = { x: 1, y: 2, z: 3 }
      expect(Vector3Schema.safeParse(valid).success).toBe(true)
    })

    it('should reject invalid 3D vectors', () => {
      expect(Vector3Schema.safeParse({ x: 1, y: 2 }).success).toBe(false)
      expect(Vector3Schema.safeParse({ x: '1', y: 2, z: 3 }).success).toBe(false)
      expect(Vector3Schema.safeParse(null).success).toBe(false)
    })

    it('should handle zero vectors', () => {
      const zero = { x: 0, y: 0, z: 0 }
      expect(Vector3Schema.safeParse(zero).success).toBe(true)
    })

    it('should handle negative values', () => {
      const negative = { x: -1, y: -2, z: -3 }
      expect(Vector3Schema.safeParse(negative).success).toBe(true)
    })
  })

  describe('Vector2Schema', () => {
    it('should validate valid 2D vectors', () => {
      const valid = { x: 1, y: 2 }
      expect(Vector2Schema.safeParse(valid).success).toBe(true)
    })

    it('should reject invalid 2D vectors', () => {
      expect(Vector2Schema.safeParse({ x: 1 }).success).toBe(false)
      expect(Vector2Schema.safeParse({ x: 1, y: '2' }).success).toBe(false)
    })
  })
})

describe('VectorUtils', () => {
  describe('zero vectors', () => {
    it('should create zero 3D vector', () => {
      expect(VectorUtils.zero3()).toEqual({ x: 0, y: 0, z: 0 })
    })

    it('should create zero 2D vector', () => {
      expect(VectorUtils.zero2()).toEqual({ x: 0, y: 0 })
    })
  })

  describe('distance calculations', () => {
    it('should calculate 3D distance correctly', () => {
      const a = { x: 0, y: 0, z: 0 }
      const b = { x: 3, y: 4, z: 0 }
      expect(VectorUtils.distance3(a, b)).toBe(5)
    })

    it('should calculate 2D distance correctly', () => {
      const a = { x: 0, y: 0 }
      const b = { x: 3, y: 4 }
      expect(VectorUtils.distance2(a, b)).toBe(5)
    })

    it('should handle zero distance', () => {
      const a = { x: 1, y: 2, z: 3 }
      expect(VectorUtils.distance3(a, a)).toBe(0)
    })
  })

  describe('vector operations', () => {
    it('should add 3D vectors', () => {
      const a = { x: 1, y: 2, z: 3 }
      const b = { x: 4, y: 5, z: 6 }
      expect(VectorUtils.add3(a, b)).toEqual({ x: 5, y: 7, z: 9 })
    })

    it('should subtract 3D vectors', () => {
      const a = { x: 5, y: 7, z: 9 }
      const b = { x: 1, y: 2, z: 3 }
      expect(VectorUtils.subtract3(a, b)).toEqual({ x: 4, y: 5, z: 6 })
    })

    it('should scale 3D vectors', () => {
      const v = { x: 1, y: 2, z: 3 }
      expect(VectorUtils.scale3(v, 2)).toEqual({ x: 2, y: 4, z: 6 })
      expect(VectorUtils.scale3(v, 0)).toEqual({ x: 0, y: 0, z: 0 })
      expect(VectorUtils.scale3(v, -1)).toEqual({ x: -1, y: -2, z: -3 })
    })
  })

  describe('normalize', () => {
    it('should normalize unit vectors to themselves', () => {
      const v = { x: 1, y: 0, z: 0 }
      expect(VectorUtils.normalize3(v)).toEqual(v)
    })

    it('should normalize non-unit vectors', () => {
      const v = { x: 3, y: 4, z: 0 }
      const normalized = VectorUtils.normalize3(v)
      expect(normalized.x).toBeCloseTo(0.6)
      expect(normalized.y).toBeCloseTo(0.8)
      expect(normalized.z).toBe(0)
    })

    it('should handle zero vector normalization', () => {
      const zero = { x: 0, y: 0, z: 0 }
      expect(VectorUtils.normalize3(zero)).toEqual(zero)
    })
  })

  describe('dot product', () => {
    it('should calculate dot product correctly', () => {
      const a = { x: 1, y: 2, z: 3 }
      const b = { x: 4, y: 5, z: 6 }
      expect(VectorUtils.dot3(a, b)).toBe(32) // 1*4 + 2*5 + 3*6
    })

    it('should handle orthogonal vectors', () => {
      const a = { x: 1, y: 0, z: 0 }
      const b = { x: 0, y: 1, z: 0 }
      expect(VectorUtils.dot3(a, b)).toBe(0)
    })
  })

  describe('cross product', () => {
    it('should calculate cross product correctly', () => {
      const a = { x: 1, y: 0, z: 0 }
      const b = { x: 0, y: 1, z: 0 }
      expect(VectorUtils.cross3(a, b)).toEqual({ x: 0, y: 0, z: 1 })
    })

    it('should handle parallel vectors', () => {
      const a = { x: 1, y: 2, z: 3 }
      const b = { x: 2, y: 4, z: 6 }
      const cross = VectorUtils.cross3(a, b)
      expect(cross).toEqual({ x: 0, y: 0, z: 0 })
    })
  })
})