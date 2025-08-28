/**
 * 🚀 Optimisations de performance pour la production
 * Améliorations globales pour WEB_INTRAFMC
 */

import { nextTick } from 'vue';

// 📊 Cache intelligent pour les données
class IntelligentCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>()
  private maxSize = 100

  set(key: string, data: any, ttl = 300000) { // TTL par défaut : 5 minutes
    // Nettoyage automatique si la cache est pleine
    if (this.cache.size >= this.maxSize) {
      this.cleanup()
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  get(key: string) {
    const entry = this.cache.get(key)
    if (!entry) return null

    const isExpired = Date.now() - entry.timestamp > entry.ttl
    if (isExpired) {
      this.cache.delete(key)
      return null
    }

    return entry.data
  }

  clear() {
    this.cache.clear()
  }

  private cleanup() {
    const now = Date.now()
    const expiredKeys = []

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        expiredKeys.push(key)
      }
    }

    expiredKeys.forEach(key => this.cache.delete(key))

    // Si encore trop d'entrées, supprimer les plus anciennes
    if (this.cache.size >= this.maxSize) {
      const entries = Array.from(this.cache.entries())
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp)
      
      const toRemove = entries.slice(0, this.maxSize / 4) // Supprimer 25% des plus anciennes
      toRemove.forEach(([key]) => this.cache.delete(key))
    }
  }

  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      usage: (this.cache.size / this.maxSize) * 100
    }
  }
}

// 🔄 Gestionnaire de requêtes avec retry et debounce
class RequestManager {
  private pendingRequests = new Map<string, Promise<any>>()
  private retryConfig = { maxAttempts: 3, delay: 1000 }

  async executeWithRetry<T>(
    key: string,
    operation: () => Promise<T>,
    options?: { maxAttempts?: number; delay?: number }
  ): Promise<T> {
    const config = { ...this.retryConfig, ...options }
    
    // Éviter les requêtes dupliquées
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key)!
    }

    const promise = this.retry(operation, config)
    this.pendingRequests.set(key, promise)

    try {
      const result = await promise
      return result
    } finally {
      this.pendingRequests.delete(key)
    }
  }

  private async retry<T>(
    operation: () => Promise<T>,
    config: { maxAttempts: number; delay: number }
  ): Promise<T> {
    let lastError: Error

    for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
      try {
        return await operation()
      } catch (error) {
        lastError = error as Error
        
        if (attempt === config.maxAttempts) {
          throw lastError
        }

        // Délai exponentiel
        const delay = config.delay * Math.pow(2, attempt - 1)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }

    throw lastError!
  }
}

// 📈 Monitoring des performances
class PerformanceMonitor {
  private metrics = new Map<string, number[]>()

  startMeasure(_key: string) {
    return performance.now()
  }

  endMeasure(key: string, startTime: number) {
    const duration = performance.now() - startTime
    
    if (!this.metrics.has(key)) {
      this.metrics.set(key, [])
    }
    
    this.metrics.get(key)!.push(duration)
    
    // Garder seulement les 100 dernières mesures
    const measurements = this.metrics.get(key)!
    if (measurements.length > 100) {
      measurements.shift()
    }

    return duration
  }

  getStats(key: string) {
    const measurements = this.metrics.get(key) || []
    if (measurements.length === 0) return null

    const sum = measurements.reduce((a, b) => a + b, 0)
    const avg = sum / measurements.length
    const min = Math.min(...measurements)
    const max = Math.max(...measurements)

    return { avg, min, max, count: measurements.length }
  }

  getAllStats() {
    const stats: Record<string, any> = {}
    for (const [key, _measurements] of this.metrics.entries()) {
      stats[key] = this.getStats(key)
    }
    return stats
  }
}

// 🚀 Utilitaires d'optimisation
export const optimizationUtils = {
  // Debounce pour les recherches
  debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null
    
    return (...args: Parameters<T>) => {
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait)
    }
  },

  // Throttle pour les événements fréquents
  throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle = false
    
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  },

  // Lazy loading pour les composants
  async lazyLoad<T>(importFunc: () => Promise<T>): Promise<T> {
    await nextTick()
    return importFunc()
  },

  // Batch processing pour les opérations multiples
  async batchProcess<T, R>(
    items: T[],
    processor: (batch: T[]) => Promise<R[]>,
    batchSize = 10
  ): Promise<R[]> {
    const results: R[] = []
    
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize)
      const batchResults = await processor(batch)
      results.push(...batchResults)
    }
    
    return results
  }
}

// 🎯 Instances globales
export const globalCache = new IntelligentCache()
export const requestManager = new RequestManager()
export const performanceMonitor = new PerformanceMonitor()

// 🔧 Configuration pour la production
export const productionOptimizations = {
  cache: globalCache,
  requests: requestManager,
  performance: performanceMonitor,
  utils: optimizationUtils
}

export default productionOptimizations
