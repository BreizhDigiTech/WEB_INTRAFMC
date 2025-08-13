import { GraphQLService } from '@/shared/services/graphql'
import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('GraphQLService', () => {
  let service: GraphQLService
  
  beforeEach(() => {
    service = new GraphQLService()
    vi.clearAllMocks()
  })

  it('should set and get token correctly', () => {
    const token = 'test-jwt-token'
    
    service.setToken(token)
    expect(service.getToken()).toBe(token)
    expect(localStorage.setItem).toHaveBeenCalledWith('auth_token', token)
  })

  it('should remove token when setting null', () => {
    // D'abord on s'assure que localStorage.getItem retourne null pour le test
    vi.mocked(localStorage.getItem).mockReturnValue(null)
    
    service.setToken(null)
    expect(service.getToken()).toBe(null)
    expect(localStorage.removeItem).toHaveBeenCalledWith('auth_token')
  })

  it('should include Authorization header when token is set', async () => {
    const token = 'test-token'
    service.setToken(token)

    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue({ data: { test: 'value' } })
    }
    
    global.fetch = vi.fn().mockResolvedValue(mockResponse)

    await service.request('query { test }')

    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          'Authorization': `Bearer ${token}`
        })
      })
    )
  })

  it('should handle GraphQL errors', async () => {
    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue({ 
        errors: [{ message: 'Test error', extensions: {} }] 
      })
    }
    
    global.fetch = vi.fn().mockResolvedValue(mockResponse)

    await expect(service.request('query { test }')).rejects.toThrow('Test error')
  })

  it('should handle HTTP errors', async () => {
    const mockResponse = {
      ok: false,
      status: 500,
      statusText: 'Internal Server Error'
    }
    
    global.fetch = vi.fn().mockResolvedValue(mockResponse)

    await expect(service.request('query { test }')).rejects.toThrow('HTTP Error: 500 Internal Server Error')
  })
})
