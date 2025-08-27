/**
 * Utilitaires de performance et monitoring
 */

interface PerformanceMetrics {
  responseTime: number
  memoryUsage?: number
  cacheHitRate?: number
  errorRate?: number
}

export class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetrics[]> = new Map()
  private maxMetrics = 100

  /**
   * Mesure le temps d'exécution d'une fonction
   */
  async measureAsync<T>(
    key: string, 
    fn: () => Promise<T>
  ): Promise<T> {
    const start = performance.now()
    
    try {
      const result = await fn()
      this.recordMetric(key, {
        responseTime: performance.now() - start
      })
      return result
    } catch (error) {
      this.recordMetric(key, {
        responseTime: performance.now() - start
      })
      throw error
    }
  }

  /**
   * Enregistre une métrique
   */
  recordMetric(key: string, metric: PerformanceMetrics): void {
    if (!this.metrics.has(key)) {
      this.metrics.set(key, [])
    }
    
    const keyMetrics = this.metrics.get(key)!
    keyMetrics.push({
      ...metric,
      memoryUsage: this.getMemoryUsage()
    })
    
    // Garde seulement les N dernières métriques
    if (keyMetrics.length > this.maxMetrics) {
      keyMetrics.splice(0, keyMetrics.length - this.maxMetrics)
    }
  }

  /**
   * Obtient les statistiques pour une clé
   */
  getStats(key: string) {
    const keyMetrics = this.metrics.get(key) || []
    
    if (keyMetrics.length === 0) {
      return null
    }
    
    const responseTimes = keyMetrics.map(m => m.responseTime)
    const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
    const minResponseTime = Math.min(...responseTimes)
    const maxResponseTime = Math.max(...responseTimes)
    
    return {
      count: keyMetrics.length,
      avgResponseTime: Math.round(avgResponseTime * 100) / 100,
      minResponseTime: Math.round(minResponseTime * 100) / 100,
      maxResponseTime: Math.round(maxResponseTime * 100) / 100,
      p95ResponseTime: this.getPercentile(responseTimes, 0.95)
    }
  }

  /**
   * Obtient toutes les statistiques
   */
  getAllStats() {
    const stats: Record<string, any> = {}
    
    for (const key of this.metrics.keys()) {
      stats[key] = this.getStats(key)
    }
    
    return stats
  }

  /**
   * Calcule un percentile
   */
  private getPercentile(values: number[], percentile: number): number {
    const sorted = [...values].sort((a, b) => a - b)
    const index = Math.ceil(sorted.length * percentile) - 1
    return Math.round(sorted[index] * 100) / 100
  }

  /**
   * Obtient l'utilisation mémoire actuelle
   */
  private getMemoryUsage(): number | undefined {
    if ('memory' in performance) {
      return (performance as any).memory.usedJSHeapSize
    }
    return undefined
  }

  /**
   * Remet à zéro toutes les métriques
   */
  reset(): void {
    this.metrics.clear()
  }
}

// Instance singleton
export const performanceMonitor = new PerformanceMonitor()

/**
 * Décorateur pour mesurer automatiquement les performances
 */
export function measurePerformance(key: string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value

    descriptor.value = async function (...args: any[]) {
      return performanceMonitor.measureAsync(
        `${target.constructor.name}.${propertyName}`,
        () => method.apply(this, args)
      )
    }
  }
}

/**
 * Hook Vue pour mesurer les performances
 */
export function usePerformanceTracking() {
  const trackOperation = async <T>(
    operationName: string,
    operation: () => Promise<T>
  ): Promise<T> => {
    return performanceMonitor.measureAsync(operationName, operation)
  }

  const getOperationStats = (operationName: string) => {
    return performanceMonitor.getStats(operationName)
  }

  const getAllStats = () => {
    return performanceMonitor.getAllStats()
  }

  return {
    trackOperation,
    getOperationStats,
    getAllStats
  }
}
