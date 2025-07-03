import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  serializeState,
  serializeToJSON,
  deserializeState,
  deserializeFromJSON,
  toGraphFormat,
  fromGraphFormat,
  saveToLocalStorage,
  loadFromLocalStorage,
  clearLocalStorage,
  exportToFile,
  importFromFile,
  validateSerializedState
} from './persistence'
import type { RefineryStore } from './store'
import type { IdeaNode, Edge } from '@refinery/schema'
import type { SerializedState } from './persistence'

// Mock store
const createMockStore = (): RefineryStore => ({
  nodes: new Map([
    ['node-1', { id: 'node-1', label: 'Node 1', metadata: { type: 'test' } }],
    ['node-2', { id: 'node-2', label: 'Node 2', metadata: {} }]
  ]),
  edges: new Map([
    ['edge-1', { id: 'edge-1', source: 'node-1', target: 'node-2' }]
  ]),
  nodeIdCounter: 2,
  edgeIdCounter: 1,
  selectedNodeIds: new Set(['node-1']),
  selectedEdgeIds: new Set(['edge-1']),
  hoveredNodeId: null,
  hoveredEdgeId: null,
  camera: { position: { x: 10, y: 20, z: 100 }, zoom: 1.5 },
  layout: { type: 'force', isPaused: false },
  theme: { mode: 'dark', customTheme: { primaryColor: '#ff0000' } },
  highlights: {
    nodes: new Map([['node-1', { color: '#ffeb3b', intensity: 0.8 }]]),
    edges: new Map()
  },
  // Add other required fields (these won't be serialized)
  jobs: new Map(),
  isLoading: false,
  error: null,
  // ... other action methods
} as any)

describe('Persistence', () => {
  beforeEach(() => {
    // Clear localStorage data
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('Serialization', () => {
    it('should serialize state without UI', () => {
      const store = createMockStore()
      const serialized = serializeState(store)

      expect(serialized.version).toBe('1.0.0')
      expect(serialized.timestamp).toBeDefined()
      expect(serialized.graph.nodes).toHaveLength(2)
      expect(serialized.graph.edges).toHaveLength(1)
      expect(serialized.graph.nodeIdCounter).toBe(2)
      expect(serialized.graph.edgeIdCounter).toBe(1)
      expect(serialized.ui).toBeUndefined()
    })

    it('should serialize state with UI', () => {
      const store = createMockStore()
      const serialized = serializeState(store, true)

      expect(serialized.ui).toBeDefined()
      expect(serialized.ui?.selectedNodeIds).toEqual(['node-1'])
      expect(serialized.ui?.selectedEdgeIds).toEqual(['edge-1'])
      expect(serialized.ui?.camera).toEqual({ position: { x: 10, y: 20, z: 100 }, zoom: 1.5 })
      expect(serialized.ui?.theme.mode).toBe('dark')
    })

    it('should serialize to JSON', () => {
      const store = createMockStore()
      const json = serializeToJSON(store)

      expect(typeof json).toBe('string')
      const parsed = JSON.parse(json)
      expect(parsed.version).toBe('1.0.0')
      expect(parsed.graph.nodes).toHaveLength(2)
    })
  })

  describe('Deserialization', () => {
    it('should deserialize state', () => {
      const serialized: SerializedState = {
        version: '1.0.0',
        timestamp: Date.now(),
        graph: {
          nodes: [
            { id: 'node-1', label: 'Node 1', metadata: {} },
            { id: 'node-2', label: 'Node 2', metadata: {} }
          ],
          edges: [
            { id: 'edge-1', source: 'node-1', target: 'node-2' }
          ],
          nodeIdCounter: 2,
          edgeIdCounter: 1
        }
      }

      const deserialized = deserializeState(serialized)

      expect(deserialized.graph.nodes?.size).toBe(2)
      expect(deserialized.graph.nodes?.get('node-1')).toEqual(serialized.graph.nodes[0])
      expect(deserialized.graph.edges?.size).toBe(1)
      expect(deserialized.graph.nodeIdCounter).toBe(2)
    })

    it('should deserialize state with UI', () => {
      const serialized: SerializedState = {
        version: '1.0.0',
        timestamp: Date.now(),
        graph: {
          nodes: [],
          edges: [],
          nodeIdCounter: 0,
          edgeIdCounter: 0
        },
        ui: {
          selectedNodeIds: ['node-1'],
          selectedEdgeIds: ['edge-1'],
          camera: { position: { x: 0, y: 0, z: 100 }, zoom: 1 },
          layout: { type: 'radial', isPaused: true },
          theme: { mode: 'light' }
        }
      }

      const deserialized = deserializeState(serialized)

      expect(deserialized.ui?.selectedNodeIds?.size).toBe(1)
      expect(deserialized.ui?.selectedNodeIds?.has('node-1')).toBe(true)
      expect(deserialized.ui?.layout?.type).toBe('radial')
      expect(deserialized.ui?.hoveredNodeId).toBeNull()
      expect(deserialized.ui?.highlights?.nodes.size).toBe(0)
    })

    it('should deserialize from JSON', () => {
      const json = JSON.stringify({
        version: '1.0.0',
        timestamp: Date.now(),
        graph: {
          nodes: [{ id: 'node-1', label: 'Test', metadata: {} }],
          edges: [],
          nodeIdCounter: 1,
          edgeIdCounter: 0
        }
      })

      const deserialized = deserializeFromJSON(json)
      expect(deserialized.graph.nodes?.get('node-1')?.label).toBe('Test')
    })
  })

  describe('Graph format conversion', () => {
    it('should convert to graph format', () => {
      const store = createMockStore()
      const graph = toGraphFormat(store)

      expect(graph.nodes).toHaveLength(2)
      expect(graph.edges).toHaveLength(1)
      expect(graph.nodes[0]).toHaveProperty('id')
      expect(graph.edges[0]).toHaveProperty('source')
    })

    it('should convert from graph format', () => {
      const graph = {
        nodes: [
          { id: 'node-1', label: 'Node 1', metadata: {} },
          { id: 'node-2', label: 'Node 2', metadata: {} }
        ],
        edges: [
          { id: 'edge-1', source: 'node-1', target: 'node-2' }
        ]
      }

      const result = fromGraphFormat(graph)

      expect(result.nodes.size).toBe(2)
      expect(result.nodes.get('node-1')?.label).toBe('Node 1')
      expect(result.edges.size).toBe(1)
    })
  })

  describe('LocalStorage helpers', () => {
    it('should save to localStorage', () => {
      const store = createMockStore()
      saveToLocalStorage(store)

      const saved = localStorage.getItem('refinery-store-state')
      expect(saved).toBeDefined()
      
      const parsed = JSON.parse(saved!)
      expect(parsed.version).toBe('1.0.0')
      expect(parsed.graph.nodes).toHaveLength(2)
    })

    it('should load from localStorage', () => {
      const data: SerializedState = {
        version: '1.0.0',
        timestamp: Date.now(),
        graph: {
          nodes: [{ id: 'node-1', label: 'Test', metadata: {} }],
          edges: [],
          nodeIdCounter: 1,
          edgeIdCounter: 0
        }
      }
      localStorage.setItem('refinery-store-state', JSON.stringify(data))

      const loaded = loadFromLocalStorage()
      expect(loaded).toBeDefined()
      expect(loaded?.graph.nodes?.get('node-1')?.label).toBe('Test')
    })

    it('should return null when no data in localStorage', () => {
      const loaded = loadFromLocalStorage()
      expect(loaded).toBeNull()
    })

    it('should handle corrupted localStorage data', () => {
      localStorage.setItem('refinery-store-state', 'invalid json')
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const loaded = loadFromLocalStorage()
      expect(loaded).toBeNull()
      expect(consoleSpy).toHaveBeenCalled()

      consoleSpy.mockRestore()
    })

    it('should clear localStorage', () => {
      localStorage.setItem('refinery-store-state', 'test')
      clearLocalStorage()
      expect(localStorage.getItem('refinery-store-state')).toBeNull()
    })
  })

  describe('File export/import', () => {
    it('should export to file', () => {
      const store = createMockStore()
      const createElementSpy = vi.spyOn(document, 'createElement')
      const appendChildSpy = vi.spyOn(document.body, 'appendChild')
      const removeChildSpy = vi.spyOn(document.body, 'removeChild')
      const clickSpy = vi.fn()
      
      // Mock link element
      const mockLink = {
        href: '',
        download: '',
        click: clickSpy
      } as any
      createElementSpy.mockReturnValue(mockLink)
      
      // Mock URL methods
      const mockUrl = 'blob://test'
      vi.spyOn(URL, 'createObjectURL').mockReturnValue(mockUrl)
      const revokeUrlSpy = vi.spyOn(URL, 'revokeObjectURL')

      exportToFile(store, 'test-export.json')

      expect(createElementSpy).toHaveBeenCalledWith('a')
      expect(mockLink.href).toBe(mockUrl)
      expect(mockLink.download).toBe('test-export.json')
      expect(clickSpy).toHaveBeenCalled()
      expect(revokeUrlSpy).toHaveBeenCalledWith(mockUrl)

      createElementSpy.mockRestore()
      appendChildSpy.mockRestore()
      removeChildSpy.mockRestore()
    })

    it('should import from file', async () => {
      const fileContent = JSON.stringify({
        version: '1.0.0',
        timestamp: Date.now(),
        graph: {
          nodes: [{ id: 'node-1', label: 'Imported', metadata: {} }],
          edges: [],
          nodeIdCounter: 1,
          edgeIdCounter: 0
        }
      })

      const file = new File([fileContent], 'test.json', { type: 'application/json' })
      
      // Small delay for FileReader
      const result = await new Promise<any>((resolve) => {
        setTimeout(async () => {
          const res = await importFromFile(file)
          resolve(res)
        }, 10)
      })

      expect(result.graph.nodes?.get('node-1')?.label).toBe('Imported')
    })

    it('should handle file read errors', async () => {
      const file = new File(['invalid json'], 'test.json', { type: 'application/json' })
      
      await expect(importFromFile(file)).rejects.toThrow('Failed to parse file')
    })
  })

  describe('Validation', () => {
    it('should validate correct serialized state', () => {
      const state: SerializedState = {
        version: '1.0.0',
        timestamp: Date.now(),
        graph: {
          nodes: [{ id: 'node-1', label: 'Test', metadata: {} }],
          edges: [{ id: 'edge-1', source: 'node-1', target: 'node-2' }],
          nodeIdCounter: 1,
          edgeIdCounter: 1
        }
      }

      expect(validateSerializedState(state)).toBe(true)
    })

    it('should reject invalid state - missing version', () => {
      const state = {
        timestamp: Date.now(),
        graph: { nodes: [], edges: [] }
      }

      expect(validateSerializedState(state)).toBe(false)
    })

    it('should reject invalid state - invalid node', () => {
      const state = {
        version: '1.0.0',
        timestamp: Date.now(),
        graph: {
          nodes: [{ label: 'Missing ID' }], // Missing id
          edges: [],
          nodeIdCounter: 0,
          edgeIdCounter: 0
        }
      }

      expect(validateSerializedState(state)).toBe(false)
    })

    it('should reject invalid state - invalid edge', () => {
      const state = {
        version: '1.0.0',
        timestamp: Date.now(),
        graph: {
          nodes: [],
          edges: [{ id: 'edge-1', source: 'node-1' }], // Missing target
          nodeIdCounter: 0,
          edgeIdCounter: 0
        }
      }

      expect(validateSerializedState(state)).toBe(false)
    })

    it('should reject non-object input', () => {
      expect(validateSerializedState(null)).toBe(false)
      expect(validateSerializedState('string')).toBe(false)
      expect(validateSerializedState(123)).toBe(false)
    })
  })
})