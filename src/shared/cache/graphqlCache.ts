/**
 * Service de mise en cache pour optimiser les requêtes GraphQL
 */

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

export class GraphQLCache {
  private cache = new Map<string, CacheEntry<any>>()
  private defaultTTL = 5 * 60 * 1000 // 5 minutes par défaut

  /**
   * Génère une clé de cache basée sur la requête et les variables
   */
  private generateKey(query: string, variables?: any): string {
    const variablesStr = variables ? JSON.stringify(variables) : ''
    return btoa(`${query}${variablesStr}`).slice(0, 32)
  }

  /**
   * Vérifie si une entrée du cache est encore valide
   */
  private isValid<T>(entry: CacheEntry<T>): boolean {
    return Date.now() - entry.timestamp < entry.ttl
  }

  /**
   * Récupère des données du cache si elles sont valides
   */
  get<T>(query: string, variables?: any): T | null {
    const key = this.generateKey(query, variables)
    const entry = this.cache.get(key)
    
    if (!entry) return null
    
    if (!this.isValid(entry)) {
      this.cache.delete(key)
      return null
    }
    
    return entry.data
  }

  /**
   * Stocke des données dans le cache
   */
  set<T>(query: string, data: T, variables?: any, ttl = this.defaultTTL): void {
    const key = this.generateKey(query, variables)
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  /**
   * Supprime une entrée spécifique du cache
   */
  delete(query: string, variables?: any): void {
    const key = this.generateKey(query, variables)
    this.cache.delete(key)
  }

  /**
   * Supprime toutes les entrées expirées
   */
  cleanup(): void {
    for (const [key, entry] of this.cache.entries()) {
      if (!this.isValid(entry)) {
        this.cache.delete(key)
      }
    }
  }

  /**
   * Vide complètement le cache
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * Invalide le cache pour un type d'entité spécifique
   */
  invalidateByPattern(pattern: string): void {
    for (const [key] of this.cache.entries()) {
      if (key.includes(pattern)) {
        this.cache.delete(key)
      }
    }
  }

  /**
   * Obtient les statistiques du cache
   */
  getStats() {
    const total = this.cache.size
    let valid = 0
    let expired = 0
    
    for (const entry of this.cache.values()) {
      if (this.isValid(entry)) {
        valid++
      } else {
        expired++
      }
    }
    
    return { total, valid, expired }
  }
}

// Instance singleton du cache
export const graphqlCache = new GraphQLCache()

// Nettoie automatiquement le cache toutes les 10 minutes
setInterval(() => {
  graphqlCache.cleanup()
}, 10 * 60 * 1000)
