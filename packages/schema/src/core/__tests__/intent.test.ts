import { describe, it, expect } from 'vitest'
import {
  IntentEnum,
  GestureInputSchema,
  VoiceInputSchema,
  MultimodalInputSchema,
  IntentContextSchema,
  type Intent,
  type GestureInput,
  type VoiceInput,
  type IntentContext,
} from '../intent'

describe('IntentEnum', () => {
  it('should validate valid intent values', () => {
    const validIntents: Intent[] = [
      'CREATE_NODE',
      'DELETE_NODE',
      'SELECT_NODE',
      'MOVE_NODE',
      'CREATE_EDGE',
      'DELETE_EDGE',
      'PAN_CAMERA',
      'ZOOM_IN',
      'ZOOM_OUT',
      'FIT_VIEW',
      'SELECT_ALL',
      'CLEAR_SELECTION',
      'TOGGLE_LAYOUT',
      'RESET_LAYOUT',
    ]

    validIntents.forEach(intent => {
      const result = IntentEnum.safeParse(intent)
      expect(result.success).toBe(true)
    })
  })

  it('should reject invalid intent values', () => {
    const invalidIntents = ['INVALID_INTENT', 'create_node', '', null, undefined, 123]

    invalidIntents.forEach(intent => {
      const result = IntentEnum.safeParse(intent)
      expect(result.success).toBe(false)
    })
  })
})

describe('GestureInputSchema', () => {
  it('should validate minimal gesture input', () => {
    const input: GestureInput = {
      type: 'gesture',
      gesture: 'pinch',
      confidence: 0.85,
    }
    const result = GestureInputSchema.safeParse(input)
    expect(result.success).toBe(true)
  })

  it('should validate gesture input with landmarks', () => {
    const input: GestureInput = {
      type: 'gesture',
      gesture: 'point',
      confidence: 0.95,
      landmarks: [
        { x: 0.5, y: 0.5, z: 0.1 },
        { x: 0.6, y: 0.6, z: 0.2 },
      ],
    }
    const result = GestureInputSchema.safeParse(input)
    expect(result.success).toBe(true)
  })

  it('should reject invalid gesture inputs', () => {
    expect(GestureInputSchema.safeParse({ type: 'voice' }).success).toBe(false)
    expect(GestureInputSchema.safeParse({ type: 'gesture' }).success).toBe(false) // missing fields
    expect(GestureInputSchema.safeParse({
      type: 'gesture',
      gesture: 'pinch',
      confidence: 'high', // wrong type
    }).success).toBe(false)
  })
})

describe('VoiceInputSchema', () => {
  it('should validate minimal voice input', () => {
    const input: VoiceInput = {
      type: 'voice',
      command: 'create node',
      confidence: 0.9,
    }
    const result = VoiceInputSchema.safeParse(input)
    expect(result.success).toBe(true)
  })

  it('should validate voice input with transcript', () => {
    const input: VoiceInput = {
      type: 'voice',
      command: 'zoom in',
      confidence: 0.88,
      transcript: 'Please zoom in on the graph',
    }
    const result = VoiceInputSchema.safeParse(input)
    expect(result.success).toBe(true)
  })

  it('should reject invalid voice inputs', () => {
    expect(VoiceInputSchema.safeParse({ type: 'gesture' }).success).toBe(false)
    expect(VoiceInputSchema.safeParse({ type: 'voice' }).success).toBe(false) // missing fields
    expect(VoiceInputSchema.safeParse({
      type: 'voice',
      command: 123, // wrong type
      confidence: 0.9,
    }).success).toBe(false)
  })
})

describe('MultimodalInputSchema', () => {
  it('should accept valid gesture inputs', () => {
    const input: GestureInput = {
      type: 'gesture',
      gesture: 'swipe',
      confidence: 0.78,
    }
    const result = MultimodalInputSchema.safeParse(input)
    expect(result.success).toBe(true)
  })

  it('should accept valid voice inputs', () => {
    const input: VoiceInput = {
      type: 'voice',
      command: 'select all',
      confidence: 0.92,
    }
    const result = MultimodalInputSchema.safeParse(input)
    expect(result.success).toBe(true)
  })

  it('should reject invalid input types', () => {
    expect(MultimodalInputSchema.safeParse({ type: 'keyboard' }).success).toBe(false)
    expect(MultimodalInputSchema.safeParse({ type: 'mouse' }).success).toBe(false)
  })
})

describe('IntentContextSchema', () => {
  it('should validate minimal intent context', () => {
    const context: IntentContext = {
      intent: 'CREATE_NODE',
      input: {
        type: 'voice',
        command: 'create new node',
        confidence: 0.85,
      },
    }
    const result = IntentContextSchema.safeParse(context)
    expect(result.success).toBe(true)
  })

  it('should validate intent context with parameters', () => {
    const context: IntentContext = {
      intent: 'MOVE_NODE',
      input: {
        type: 'gesture',
        gesture: 'drag',
        confidence: 0.9,
        landmarks: [{ x: 0.5, y: 0.5, z: 0.1 }],
      },
      parameters: {
        nodeId: 'node-123',
        position: { x: 100, y: 200, z: 0 },
        velocity: { x: 0.1, y: 0.2, z: 0 },
      },
    }
    const result = IntentContextSchema.safeParse(context)
    expect(result.success).toBe(true)
  })

  it('should reject invalid intent contexts', () => {
    expect(IntentContextSchema.safeParse({}).success).toBe(false) // missing fields
    expect(IntentContextSchema.safeParse({
      intent: 'INVALID_INTENT',
      input: { type: 'voice', command: 'test', confidence: 0.8 },
    }).success).toBe(false) // invalid intent
    expect(IntentContextSchema.safeParse({
      intent: 'CREATE_NODE',
      input: { type: 'invalid' },
    }).success).toBe(false) // invalid input
  })
})