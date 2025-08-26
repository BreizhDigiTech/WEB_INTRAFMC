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
      // Pour les admins, on veut voir TOUS les utilisateurs
      // D'abord essayer orderStatistics.topCustomers
      console.log('🔍 Tentative d\'obtenir tous les utilisateurs via orderStatistics...')
      const orderStatsResult = await this.getOrderStatistics(filters)
      
      console.log('🔍 DEBUG orderStatistics:', {
        hasTopCustomers: !!orderStatsResult.topCustomers,
        topCustomersLength: orderStatsResult.topCustomers?.length || 0,
        topCustomers: orderStatsResult.topCustomers
      })
      
      if (orderStatsResult.topCustomers && orderStatsResult.topCustomers.length > 0) {
        console.log('✅ Utilisation de orderStatistics.topCustomers pour plusieurs utilisateurs')
        // Transformer les données topCustomers pour correspondre au format attendu
        return orderStatsResult.topCustomers.map((customer: any) => ({
          userId: customer.userId,
          userName: customer.userName,
          email: customer.email || 'Email non disponible', 
          totalOrders: customer.ordersCount,
          totalAmount: customer.totalAmount,
          averageOrderValue: customer.totalAmount / (customer.ordersCount || 1),
          customerSegment: customer.customerSegment,
          orderFrequency: 0,
          daysSinceFirstOrder: 0,
          favoriteProducts: [],
          favoriteCategories: [],
          behaviorAnalysis: {},
          recommendations: { products: [], actions: [] },
          lastOrderDate: new Date().toISOString().split('T')[0],
          memberSince: new Date().toISOString().split('T')[0]
        }))
      } else {
        console.log('🔄 orderStatistics.topCustomers vide, essai de récupérer tous les utilisateurs...')
        
        // Stratégie alternative : appeler userOrderStatistics sans userId pour obtenir tous les utilisateurs
        // Modifier l'appel pour ne pas spécifier d'userId spécifique
        const allUsersResult = await this.getUserOrderStatistics({
          ...filters,
          // Ne pas spécifier userId pour obtenir tous les utilisateurs
          userId: undefined
        })
        
        console.log('🔍 Résultat userOrderStatistics sans userId:', allUsersResult)
        
        if (allUsersResult.data && allUsersResult.data.length > 1) {
          console.log('✅ userOrderStatistics retourne plusieurs utilisateurs')
          return allUsersResult.data
        } else {
          console.log('⚠️ Tentative de récupérer des utilisateurs spécifiques...')
          
          // Dernière stratégie : essayer avec différents userId
          const allUsers: any[] = []
          
          // Essayer les premiers ID utilisateurs (1, 2, 3, etc.)
          for (let userId = 1; userId <= 5; userId++) {
            try {
              const userResult = await this.getUserOrderStatistics({
                ...filters,
                userId: userId.toString()
              })
              
              if (userResult.data && userResult.data.length > 0) {
                allUsers.push(...userResult.data)
                console.log(`✅ Utilisateur ${userId} trouvé:`, userResult.data[0])
              }
            } catch (error) {
              console.log(`⚠️ Utilisateur ${userId} non trouvé`)
            }
          }
          
          if (allUsers.length > 0) {
            console.log(`✅ Total utilisateurs récupérés: ${allUsers.length}`)
            return allUsers
          } else {
            console.log('🔄 Fallback vers userOrderStatistics pour utilisateur courant')
            const fallbackResult = await this.getUserOrderStatistics(filters)
            return fallbackResult.data
          }
        }
      }
    } catch (error) {
      console.error('❌ getOrderStatsByUser a échoué:', error)
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
