import { enableMapSet } from 'immer'
import { vi } from 'vitest'

// Enable Immer MapSet plugin for Map and Set support
enableMapSet()

// Mock localStorage for jsdom environment
const localStorageData = new Map<string, string>()

Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn((key) => localStorageData.get(key) || null),
    setItem: vi.fn((key, value) => localStorageData.set(key, value)),
    removeItem: vi.fn((key) => localStorageData.delete(key)),
    clear: vi.fn(() => localStorageData.clear()),
    key: vi.fn((index) => Array.from(localStorageData.keys())[index] || null),
    get length() {
      return localStorageData.size
    }
  },
  writable: true
})

// Mock URL for file operations
global.URL = {
  createObjectURL: vi.fn(() => 'blob://mock'),
  revokeObjectURL: vi.fn()
} as any

// Mock FileReader
global.FileReader = class FileReader {
  result: string | ArrayBuffer | null = null
  error: any = null
  onload: ((event: any) => void) | null = null
  onerror: (() => void) | null = null
  
  readAsText(file: File) {
    // Simulate async read
    setTimeout(() => {
      // @ts-expect-error - accessing file content for test
      const content = file._content || file
      if (typeof content === 'string') {
        this.result = content
        if (this.onload) {
          this.onload({ target: { result: this.result } })
        }
      } else {
        this.error = new Error('Failed to read file')
        if (this.onerror) {
          this.onerror()
        }
      }
    }, 0)
  }
} as any