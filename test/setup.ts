import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/ar',
  redirect: vi.fn(),
}))

// Mock Next.js image
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => {
    const img = document.createElement('img')
    img.src = src
    img.alt = alt
    Object.assign(img, props)
    return img
  },
}))

// Mock Supabase client
import { buildSupabaseMock } from './__mocks__/supabaseMock'

vi.mock('@/lib/supabase', () => ({
  createClient: () => buildSupabaseMock(),
}))

// Mock window.matchMedia for responsive tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock WaveSurfer for audio visualization components
vi.mock('wavesurfer.js', () => ({
  default: {
    create: vi.fn(() => ({
      load: vi.fn(),
      play: vi.fn(),
      pause: vi.fn(),
      playPause: vi.fn(),
      stop: vi.fn(),
      destroy: vi.fn(),
      setVolume: vi.fn(),
      getDuration: vi.fn(() => 180),
      getCurrentTime: vi.fn(() => 0),
      seekTo: vi.fn(),
      on: vi.fn(),
      off: vi.fn(),
      isPlaying: vi.fn(() => false),
    })),
  },
}))

// Enhanced HTMLMediaElement mocking for comprehensive audio support
Object.defineProperty(global.HTMLMediaElement.prototype, 'duration', {
  writable: true,
  value: 180,
})

Object.defineProperty(global.HTMLMediaElement.prototype, 'currentTime', {
  writable: true,
  value: 0,
})

Object.defineProperty(global.HTMLMediaElement.prototype, 'paused', {
  writable: true,
  value: true,
})

Object.defineProperty(global.HTMLMediaElement.prototype, 'volume', {
  writable: true,
  value: 1,
})

Object.defineProperty(global.HTMLMediaElement.prototype, 'playbackRate', {
  writable: true,
  value: 1,
})

// Mock HTMLMediaElement methods
global.HTMLMediaElement.prototype.play = vi.fn(() => Promise.resolve())
global.HTMLMediaElement.prototype.pause = vi.fn()
global.HTMLMediaElement.prototype.load = vi.fn()

// Environment-specific polyfills for cross-compatibility
// Handle differences between happy-dom (CI) and jsdom (local)
if (typeof global.structuredClone === 'undefined') {
  global.structuredClone = (obj: any) => JSON.parse(JSON.stringify(obj))
}

// Mock URL.createObjectURL for both environments
if (typeof global.URL.createObjectURL === 'undefined') {
  global.URL.createObjectURL = vi.fn(() => 'mock-object-url')
}

if (typeof global.URL.revokeObjectURL === 'undefined') {
  global.URL.revokeObjectURL = vi.fn()
}

// Mock Blob for both environments
if (typeof global.Blob === 'undefined') {
  global.Blob = vi.fn().mockImplementation(() => ({
    size: 0,
    type: '',
    arrayBuffer: vi.fn(() => Promise.resolve(new ArrayBuffer(0))),
    text: vi.fn(() => Promise.resolve('')),
  })) as any
}

// Mock File for both environments
if (typeof global.File === 'undefined') {
  global.File = vi.fn().mockImplementation(() => ({
    name: 'test-file.mp3',
    size: 1024,
    type: 'audio/mpeg',
    lastModified: Date.now(),
  })) as any
}

// Mock performance.now for consistent timing across environments
if (typeof global.performance === 'undefined') {
  global.performance = {
    now: vi.fn(() => Date.now()),
  } as any
}