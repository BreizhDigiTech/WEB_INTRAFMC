import { userService } from '../../../shared/services/userService'
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
      return await realApiCall()
    } catch (error: any) {
      const originalMessage = error.message || 'Erreur inconnue'
      const errorCode = error.extensions?.code || 'API_ERROR'
      const detailedMessage = `API ${apiName} - ${originalMessage} (Code: ${errorCode})`
      
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
    }

    // Test userOrderStatistics
    try {
      await super.getUserOrderStatistics({ start_date: '2025-01-01', end_date: '2025-01-02' })
      results.userOrderStatistics = true
    } catch (e) {
    }

    // Test revenueTimeline
    try {
      await super.getRevenueTimeline({ start_date: '2025-01-01', end_date: '2025-01-02' })
      results.revenueTimeline = true
    } catch (e) {
    }

    // Test customerGrowth
    try {
      await super.getCustomerGrowth(3)
      results.customerGrowth = true
    } catch (e) {
    }

    // Test basicOrderStats
    try {
      await super.getBasicOrderStats('2025-01-01', '2025-01-02')
      results.basicOrderStats = true
    } catch (e) {
    }

    // Test monthlyRevenue
    try {
      await super.getMonthlyRevenue(3)
      results.monthlyRevenue = true
    } catch (e) {
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

  async getRevenueTimeline(filters: StatsFilters & { groupBy?: string }): Promise<any> {
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
      // 🆕 Préparer les dates pour TOUTES les données si non fournies
      const startDate = filters.start_date || '2020-01-01' // Depuis 2020 pour avoir TOUTES les données
      const endDate = filters.end_date || new Date().toISOString().split('T')[0]
      
      console.log('📅 Période des stats:', { startDate, endDate })
      
      // 1. Récupérer TOUS les utilisateurs d'abord
      try {
        console.log('🔍 Récupération de tous les utilisateurs...')
        const allUsersResponse = await userService.getUsers(50, 1) // ✅ Respecter la limite API de 50
        console.log('👥 Réponse getUsers:', allUsersResponse)
        
        // Vérifier la structure réelle de la réponse
        const users = allUsersResponse?.data || (allUsersResponse as any)?.users?.data || (allUsersResponse as any)?.users || []
        console.log('👤 Utilisateurs extraits:', users.length, 'utilisateurs')
        
        if (users && Array.isArray(users) && users.length > 0) {
          // 2. Récupérer les données de commandes via orderStatistics
          let orderStatsData = []
          try {
            const orderStatsResult = await this.getOrderStatistics({
              start_date: startDate,
              end_date: endDate,
              compareWithPrevious: false
            })
            orderStatsData = orderStatsResult?.topCustomers || []
          } catch (error) {
          }
          
          // 3. Enrichir chaque utilisateur avec ses données de commandes
          const enrichedUsers = users.map((user: any) => {
            // Chercher les données de commandes pour cet utilisateur
            const userOrderData = orderStatsData.find((order: any) => 
              order.user_id?.toString() === user.id
            )
            
            const orderStats = {
              user_id: user.id,
              user: user,
              total_orders: userOrderData?.order_count || 0,
              total_amount: parseFloat(userOrderData?.total_spent || '0'),
              average_order_value: userOrderData 
                ? parseFloat(userOrderData.total_spent || '0') / Math.max(userOrderData.order_count || 1, 1)
                : 0,
              first_order_date: startDate,
              last_order_date: endDate,
              userId: user.id,
              userName: user.name,
              userEmail: user.email,
              customerSegment: userOrderData 
                ? (parseFloat(userOrderData.total_spent || '0') > 5000 ? 'VIP' : 
                   parseFloat(userOrderData.total_spent || '0') > 1000 ? 'PREMIUM' : 'STANDARD')
                : 'NEW' as const
            } as OrderStats
            
            return orderStats
          })
          
          console.log('✅ Utilisateurs enrichis:', enrichedUsers.length, 'utilisateurs')
          console.log('📊 Premier utilisateur enrichi:', enrichedUsers[0])
          
          return enrichedUsers.sort((a, b) => b.total_amount - a.total_amount) // Trier par montant décroissant
        }
      } catch (error: any) {
        console.error('❌ Erreur lors de la récupération des utilisateurs:', error)
      }
      
      // Fallback: ancien comportement si la nouvelle approche échoue
      
      // 2. Essayer userOrderStatistics sans userId pour obtenir tous les utilisateurs (API principale pour les noms)
      try {
        console.log('🔄 Tentative de fallback avec userOrderStatistics...')
        const userStatsResult = await this.getUserOrderStatistics({
          start_date: startDate,
          end_date: endDate
          // Pas de userId spécifique pour obtenir tous les utilisateurs
        })
        
        if (userStatsResult && userStatsResult.data && userStatsResult.data.length > 0) {
          console.log('✅ Fallback réussi, données récupérées:', userStatsResult.data.length, 'utilisateurs')
          return userStatsResult.data
        }
      } catch (error) {
        console.log('ℹ️ Fallback userOrderStatistics non disponible, passage au fallback suivant')
        // Silent - ne pas logger d'erreur car c'est un fallback
      }
      
      // 1. Fallback: orderStatistics avec les paramètres corrects selon la doc
      try {
        const orderStatsResult = await this.getOrderStatistics({
          start_date: startDate,
          end_date: endDate,
          compareWithPrevious: false
        })
        
        if (orderStatsResult && orderStatsResult.topCustomers && orderStatsResult.topCustomers.length > 0) {
          
          // Enrichir les données avec les noms des clients
          const enrichedCustomers = await Promise.all(
            orderStatsResult.topCustomers.map(async (customer: any) => {
              let clientName = 'Client inconnu'
              let clientEmail = 'Email non disponible'
              
              try {
                if (customer.user_id) {
                  const userInfo = await userService.getUser(customer.user_id.toString())
                  clientName = userInfo.name || 'Client inconnu'
                  clientEmail = userInfo.email || 'Email non disponible'
                }
              } catch (error) {
              }
              
              return {
                user_id: customer.user_id?.toString() || 'unknown',
                user: { 
                  id: customer.user_id?.toString() || 'unknown', 
                  name: clientName,
                  email: clientEmail,
                  is_admin: false,
                  is_active: true
                },
                total_orders: customer.order_count || 0,
                total_amount: parseFloat(customer.total_spent || '0'),
                average_order_value: parseFloat(customer.total_spent || '0') / Math.max(customer.order_count || 1, 1),
                first_order_date: startDate,
                last_order_date: endDate,
                userId: customer.user_id?.toString(),
                userName: clientName,
                userEmail: clientEmail
              } as OrderStats
            })
          )
          
          return enrichedCustomers
        }
      } catch (error) {
      }
      
      // 3. Fallback avec basicOrderStats selon la doc
      try {
        const basicStats = await this.getBasicOrderStats(startDate, endDate)
        
        if (basicStats) {
          
          return [{
            user_id: 'global_basic_stats',
            user: { id: 'global_basic_stats', name: 'Statistiques Globales (BasicOrderStats)' },
            total_orders: basicStats.totalOrders || 0,
            total_amount: basicStats.totalRevenue || 0,
            average_order_value: basicStats.averageOrderValue || 0,
            first_order_date: startDate,
            last_order_date: endDate,
            userId: 'global_basic_stats',
            userName: 'Statistiques Globales (BasicOrderStats)'
          } as OrderStats]
        }
      } catch (error) {
      }
      
      // Si aucune API ne fonctionne, lever une erreur claire
      throw new Error('Aucune API de statistiques utilisateur disponible. Toutes les APIs (orderStatistics, userOrderStatistics, basicOrderStats) sont indisponibles.')

    } catch (error) {
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
