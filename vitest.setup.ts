import { enableMapSet } from 'immer'
import { vi } from 'vitest'
import '@testing-library/jest-dom'

// ---------------------------------------------------------------------------
// React 18+ createRoot shim
// In jsdom test runs some components mount with `createRoot(null)` which React
// rightfully disallows in production. For unit tests we fall back to a dummy
// div so the provider tree can render without throwing. This patch is ONLY
// applied in the Vitest environment.
// ---------------------------------------------------------------------------
try {
  // Dynamically import react-dom/client then react-dom
  const ReactDOMClient = require('react-dom/client')
  if (ReactDOMClient?.createRoot) {
    const realCreateRoot = ReactDOMClient.createRoot
    ReactDOMClient.createRoot = (container: Element | null) => {
      const safe = container ?? (globalThis.document?.createElement?.('div') || undefined)
      return realCreateRoot.call(ReactDOMClient, safe)
    }
  }
  const ReactDOMCompat = require('react-dom')
  if (ReactDOMCompat?.createRoot) {
    const realCompatRoot = ReactDOMCompat.createRoot
    ReactDOMCompat.createRoot = (container: Element | null) => {
      const safe = container ?? (globalThis.document?.createElement?.('div') || undefined)
      return realCompatRoot.call(ReactDOMCompat, safe)
    }
  }
} catch {
  /* react-dom/client not available – ignore */
}

// Enable Immer MapSet plugin for Map and Set support
enableMapSet()

// Mock localStorage for jsdom environment
const localStorageData = new Map<string, string>()

global.localStorage = {
  getItem: vi.fn((key) => localStorageData.get(key) || null),
  setItem: vi.fn((key, value) => localStorageData.set(key, value)),
  removeItem: vi.fn((key) => localStorageData.delete(key)),
  clear: vi.fn(() => localStorageData.clear()),
  key: vi.fn((index) => Array.from(localStorageData.keys())[index] || null),
  get length() {
    return localStorageData.size
  },
} as any

// Ensure window.localStorage is the same as global.localStorage in jsdom
if (typeof window !== 'undefined' && !window.localStorage) {
  ;(window as any).localStorage = global.localStorage
}

// Mock HTMLCanvasElement.getContext for canvas operations
HTMLCanvasElement.prototype.getContext = vi.fn(function (contextType: string) {
  if (contextType === '2d') {
    return {
      font: '',
      fillStyle: '',
      textAlign: 'left',
      textBaseline: 'top',
      measureText: vi.fn((text: string) => ({
        width: text.length * 10, // Mock width calculation
        actualBoundingBoxLeft: 0,
        actualBoundingBoxRight: text.length * 10,
        actualBoundingBoxAscent: 10,
        actualBoundingBoxDescent: 2,
        fontBoundingBoxAscent: 12,
        fontBoundingBoxDescent: 3,
      })),
      fillText: vi.fn(),
      fillRect: vi.fn(),
      clearRect: vi.fn(),
      strokeText: vi.fn(),
      drawImage: vi.fn(),
      getImageData: vi.fn(() => ({
        data: new Uint8ClampedArray(4),
        width: 1,
        height: 1,
      })),
      putImageData: vi.fn(),
      createImageData: vi.fn(),
      save: vi.fn(),
      restore: vi.fn(),
      scale: vi.fn(),
      rotate: vi.fn(),
      translate: vi.fn(),
      transform: vi.fn(),
      resetTransform: vi.fn(),
    } as any
  }
  return null
}) as any

// No need to override document.createElement globally; individual tests can mock as needed.

// Mock URL for blob operations
global.URL = {
  ...global.URL,
  createObjectURL: vi.fn(() => 'blob://mock-url'),
  revokeObjectURL: vi.fn(),
} as any

// Mock FileReader for file operations
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

// Mock File constructor
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

// Provide no-op implementations for document.body appendChild/removeChild for tests using mocked elements
if (typeof document !== 'undefined') {
  ;(document.body as any).appendChild = () => {}
  ;(document.body as any).removeChild = () => {}
}

// Stub DOM mutation helpers globally to avoid jsdom type checks in tests
if (typeof Node !== 'undefined') {
  // Override once; subsequent calls will use no-op implementation
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  Node.prototype.appendChild = function () {
    /* no-op */
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  Node.prototype.removeChild = function () {
    /* no-op */
  }
}
