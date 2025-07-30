import { enableMapSet } from 'immer'
import { vi } from 'vitest'

// Enable Immer MapSet plugin for Map and Set support
enableMapSet()

// Mock localStorage for Node environment
const localStorageData = new Map<string, string>()

global.localStorage = {
  getItem: vi.fn((key) => localStorageData.get(key) || null),
  setItem: vi.fn((key, value) => localStorageData.set(key, value)),
  removeItem: vi.fn((key) => localStorageData.delete(key)),
  clear: vi.fn(() => localStorageData.clear()),
  key: vi.fn((index) => Array.from(localStorageData.keys())[index] || null),
  get length() {
    return localStorageData.size
  }
} as any

// Mock document for file export tests
global.document = {
  createElement: vi.fn(() => ({
    click: vi.fn(),
    href: '',
    download: ''
  })),
  body: {
    appendChild: vi.fn(),
    removeChild: vi.fn()
  }
} as any

// Mock URL for file export tests
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
      const content = (file as any)._content || file
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

// Mock File constructor to support test content
global.File = class File extends Blob {
  name: string
  lastModified: number
  _content?: string
  
  constructor(bits: BlobPart[], name: string, options?: FilePropertyBag) {
    super(bits, options)
    this.name = name
    this.lastModified = Date.now()
    // Store content for test access
    if (bits.length > 0 && typeof bits[0] === 'string') {
      this._content = bits[0]
    }
  }
} as any