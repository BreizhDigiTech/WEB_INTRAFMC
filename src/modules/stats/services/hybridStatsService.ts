import type { OrderStats, StatsFilters } from '../types'
import { StatsService } from './statsService'

/**
 * Service qui utilise uniquement les vraies APIs
 * Retourne des erreurs claires quand les APIs ne sont pas disponibles
 */
export class HybridStatsService extends StatsService {

  /**
   * Exécute l'API réelle avec le nouveau token JWT fonctionnel
   */
  private async executeRealApi<T>(
    realApiCall: () => Promise<T>,
    apiName: string
  ): Promise<T> {
    try {
      // Diagnostic du token avant l'appel API
      const token = localStorage.getItem('auth_token')
      console.log(`🔐 Token présent pour ${apiName}:`, token ? 'OUI ✅' : 'NON ❌')
      if (token) {
        console.log('🔍 Token preview:', token.substring(0, 20) + '...')
      }
      
      return await realApiCall()
    } catch (error: any) {
      // Logs détaillés pour debug si nécessaire
      console.error(`❌ Erreur API ${apiName}:`, error.message)
      
      // Créer un message d'erreur détaillé
      const originalMessage = error.message || 'Erreur inconnue'
      const errorCode = error.extensions?.code || 'API_ERROR'
      const detailedMessage = `API ${apiName} - ${originalMessage} (Code: ${errorCode})`
      
      // Logger pour le debug
      console.error('Détails de l\'erreur:', { 
        api: apiName, 
        message: originalMessage, 
        code: errorCode,
        stack: error.stack 
      })
      
      throw new Error(detailedMessage)
    }
  }

  /**
   * Vérifie la disponibilité des APIs
   */
  async checkApiAvailability(): Promise<{
    orderStatistics: boolean
    userOrderStatistics: boolean
    revenueTimeline: boolean
    customerGrowth: boolean
    basicOrderStats: boolean
    monthlyRevenue: boolean
  }> {
    const results = {
      orderStatistics: false,
      userOrderStatistics: false,
      revenueTimeline: false,
      customerGrowth: false,
      basicOrderStats: false,
      monthlyRevenue: false
    }

    // Test orderStatistics
    try {
      await super.getOrderStatistics({ start_date: '2025-01-01', end_date: '2025-01-02' })
      results.orderStatistics = true
    } catch (e) {
      console.log('❌ orderStatistics non disponible')
    }

    // Test userOrderStatistics
    try {
      await super.getUserOrderStatistics({ start_date: '2025-01-01', end_date: '2025-01-02' })
      results.userOrderStatistics = true
    } catch (e) {
      console.log('❌ userOrderStatistics non disponible')
    }

    // Test revenueTimeline
    try {
      await super.getRevenueTimeline({ start_date: '2025-01-01', end_date: '2025-01-02' })
      results.revenueTimeline = true
    } catch (e) {
      console.log('❌ revenueTimeline non disponible')
    }

    // Test customerGrowth
    try {
      await super.getCustomerGrowth(3)
      results.customerGrowth = true
    } catch (e) {
      console.log('❌ customerGrowth non disponible')
    }

    // Test basicOrderStats
    try {
      await super.getBasicOrderStats('2025-01-01', '2025-01-02')
      results.basicOrderStats = true
    } catch (e) {
      console.log('❌ basicOrderStats non disponible')
    }

    // Test monthlyRevenue
    try {
      await super.getMonthlyRevenue(3)
      results.monthlyRevenue = true
    } catch (e) {
      console.log('❌ monthlyRevenue non disponible')
    }

    return results
  }

  // Override des méthodes sans fallback - erreurs claires uniquement

  async getOrderStatistics(filters: StatsFilters & { compareWithPrevious?: boolean }): Promise<any> {
    return this.executeRealApi(
      () => super.getOrderStatistics(filters),
      'getOrderStatistics'
    )
  }

  async getUserOrderStatistics(filters: StatsFilters & { 
    userId?: string,
    page?: number,
    limit?: number,
    sortBy?: string,
    sortOrder?: string,
    segmentFilter?: string,
    searchUser?: string
  }): Promise<{ data: OrderStats[], pagination: any, summary: any }> {
    return this.executeRealApi(
      () => super.getUserOrderStatistics(filters),
      'getUserOrderStatistics'
    )
  }

  async getRevenueTimeline(filters: StatsFilters & { groupBy?: string, includeComparison?: boolean }): Promise<any> {
    return this.executeRealApi(
      () => super.getRevenueTimeline(filters),
      'getRevenueTimeline'
    )
  }

  async getCustomerGrowth(months = 12): Promise<any> {
    return this.executeRealApi(
      () => super.getCustomerGrowth(months),
      'getCustomerGrowth'
    )
  }

  async getBasicOrderStats(startDate: string, endDate: string): Promise<any> {
    return this.executeRealApi(
      () => super.getBasicOrderStats(startDate, endDate),
      'getBasicOrderStats'
    )
  }

  async getMonthlyRevenue(months: number = 12): Promise<any[]> {
    return this.executeRealApi(
      () => super.getMonthlyRevenue(months),
      'getMonthlyRevenue'
    )
  }

  async getOrderStatsByUser(filters: StatsFilters = {}): Promise<OrderStats[]> {
    try {
      console.log('🔍 Tentative de récupération des statistiques utilisateur avec APIs réelles...')
      
      // Préparer les dates par défaut si non fournies
      const startDate = filters.start_date || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      const endDate = filters.end_date || new Date().toISOString().split('T')[0]
      
      // Essayer l'API userOrderStatistics qui semble plus spécialisée
      try {
        console.log('🔍 Tentative avec userOrderStatistics...')
        const userStatsResult = await this.getUserOrderStatistics({
          ...filters,
          start_date: startDate,
          end_date: endDate
        })
        
        if (userStatsResult && userStatsResult.data && userStatsResult.data.length > 0) {
          console.log('✅ userOrderStatistics disponible')
          return userStatsResult.data
        }
      } catch (error) {
        console.log('⚠️ userOrderStatistics échoué:', error)
      }
      
      // Si aucune API ne fonctionne, lever une erreur claire
      throw new Error('Aucune API de statistiques utilisateur disponible. Les APIs orderStatistics, basicOrderStats et userOrderStatistics sont toutes indisponibles.')

    } catch (error) {
      console.error('❌ Erreur lors de la récupération des statistiques utilisateur:', error)
      throw error
    }
  }

  async getMonthlyStats(year?: number): Promise<any[]> {
    const currentYear = year || new Date().getFullYear()
    const startDate = `${currentYear}-01-01`
    const endDate = `${currentYear}-12-31`

    try {
      const timeline = await this.getRevenueTimeline({
        start_date: startDate,
        end_date: endDate,
        groupBy: 'MONTH'
      })

      return timeline.periods || []
    } catch (error) {
      console.error('❌ getMonthlyStats via getRevenueTimeline a échoué:', error)
      throw error
    }
  }

  async diagnoseSyncIssues(): Promise<string> {
    const token = localStorage.getItem('auth_token')
    
    if (!token) {
      return 'AUTH_MISSING'
    }
    
    try {
      await this.getUserOrderStatistics({})
      return 'USER_API_OK'
    } catch (error) {
      return 'USER_API_FAILED'
    }
  }
}

// Instance singleton du service hybride
export const hybridStatsService = new HybridStatsService()

// Export par défaut pour compatibilité
export const statsService = hybridStatsService

// Export par défaut
export default hybridStatsService
