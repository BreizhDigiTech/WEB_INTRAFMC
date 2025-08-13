import { vi } from 'vitest'

// Mock fetch pour les tests
global.fetch = vi.fn()

// Mock console pour éviter les logs pendant les tests
global.console = {
  ...console,
  warn: vi.fn(),
  error: vi.fn(),
  log: vi.fn()
}

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn()
}
Object.defineProperty(global, 'localStorage', { value: localStorageMock })

// Mock import.meta.env
Object.defineProperty(global, 'import.meta', {
  value: {
    env: {
      VITE_GRAPHQL_ENDPOINT: 'http://localhost:8000/graphql',
      VITE_GRAPHQL_MULTIPART: 'true'
    }
  }
})
