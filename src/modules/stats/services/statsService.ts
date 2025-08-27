import { GraphQLService } from '@/shared/services/graphql'
import type {
  OrderStats,
  StatsFilters
} from '../types'

export class StatsService extends GraphQLService {
  /**
   * Récupère les statistiques de commandes selon la nouvelle documentation
   */
  async getOrderStatistics(filters: StatsFilters & { compareWithPrevious?: boolean }): Promise<any> {
    const query = `
      query OrderStatistics($startDate: Date!, $endDate: Date!, $compareWithPrevious: Boolean) {
        orderStatistics(
          startDate: $startDate
          endDate: $endDate
          compareWithPrevious: $compareWithPrevious
        ) {
          totalRevenue
          totalOrders
          averageOrderValue
          uniqueCustomers
          topProducts
          topCustomers
        }
      }
    `

    const variables = {
      startDate: filters.start_date,
      endDate: filters.end_date,
      compareWithPrevious: filters.compareWithPrevious ?? false
    }

    try {
      const response = await this.request(query, variables)
      return response.orderStatistics
    } catch (error) {
      console.error('❌ API orderStatistics non disponible:', error)
      throw new Error('API orderStatistics indisponible - Veuillez vous référer au backend pour implémenter cette API')
    }
  }

  /**
   * Récupère les statistiques détaillées par utilisateur
   */
  async getUserOrderStatistics(filters: StatsFilters & { 
    userId?: string,
    page?: number,
    limit?: number,
    sortBy?: string,
    sortOrder?: string,
    segmentFilter?: string,
    searchUser?: string
  }): Promise<{ data: OrderStats[], pagination: any, summary: any }> {
    // Validation des dates
    if (!filters.start_date || !filters.end_date) {
      console.warn('Dates manquantes pour getUserOrderStatistics, utilisation de dates par défaut')
      const endDate = new Date()
      const startDate = new Date()
      startDate.setMonth(startDate.getMonth() - 1)
      
      filters = {
        ...filters,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0]
      }
    }

    const query = `
      query UserOrderStatistics($userId: ID, $startDate: Date, $endDate: Date) {
        userOrderStatistics(userId: $userId, startDate: $startDate, endDate: $endDate) {
          userId
          userName
          email
          totalOrders
          totalAmount
          averageOrderValue
          orderFrequency
          daysSinceFirstOrder
          customerSegment
          favoriteProducts
          favoriteCategories
          behaviorAnalysis
          recommendations
          lastOrderDate
          memberSince
        }
      }
    `

    const variables = {
      userId: filters.userId,
      startDate: filters.start_date,
      endDate: filters.end_date
    }

    try {
      const response = await this.request(query, variables)
      // Adapter la réponse pour maintenir la compatibilité avec l'ancien format
      return {
        data: [response.userOrderStatistics], // Wrap dans un array pour compatibilité
        pagination: { currentPage: 1, totalPages: 1, totalItems: 1 },
        summary: {
          totalUsers: 1,
          averageOrderValue: response.userOrderStatistics?.averageOrderValue || 0,
          totalRevenue: response.userOrderStatistics?.totalAmount || 0
        }
      }
    } catch (error) {
      // ✅ Pas de log d'erreur - c'est utilisé comme fallback
      throw new Error('API userOrderStatistics indisponible')
    }
  }

  /**
   * Récupère la timeline des revenus pour graphiques
   */
  async getRevenueTimeline(filters: StatsFilters & { 
    groupBy?: string
  }): Promise<any> {
    const query = `
      query RevenueTimeline($startDate: Date!, $endDate: Date!, $groupBy: TimeGrouping) {
        revenueTimeline(
          startDate: $startDate
          endDate: $endDate
          groupBy: $groupBy
        ) {
          periods
        }
      }
    `

    const variables = {
      startDate: filters.start_date,
      endDate: filters.end_date,
      groupBy: filters.groupBy || 'DAY'
    }

    try {
      const response = await this.request(query, variables)
      return response.revenueTimeline
    } catch (error) {
      console.error('API revenueTimeline error:', error)
      throw new Error('API revenueTimeline indisponible')
    }
  }

  /**
   * Récupère les suggestions de panier intelligentes
   */
  async getCartSuggestions(userId?: string): Promise<any> {
    const query = `
      query CartSuggestions($userId: ID) {
        cartSuggestions(userId: $userId) {
          suggestions {
            productId
            productName
            reason
            confidence
            suggestionType
          }
          
          savedCarts {
            id
            name
            note
            savedAt
            items {
              product {
                id
                name
                price
              }
              quantity
            }
            totalAmount
            isStillValid
          }
          
          frequentlyBoughtTogether {
            product {
              id
              name
              price
              mainImageUrl
            }
            confidence
            basedOnProducts
          }
          
          personalizedSuggestions {
            product {
              id
              name
              price
              description
            }
            reason
            algorithm
            score
          }
        }
      }
    `

    const variables = { userId }
    const response = await this.request(query, variables)
    return response.cartSuggestions
  }

  /**
   * Récupère les insights de performance des produits
   */
  async getProductPerformanceInsights(filters: { 
    productId?: string,
    startDate?: string,
    endDate?: string 
  } = {}): Promise<any> {
    const query = `
      query ProductPerformanceInsights($productId: ID, $startDate: Date, $endDate: Date) {
        productPerformanceInsights(
          productId: $productId
          startDate: $startDate
          endDate: $endDate
        ) {
          productId
          productName
          
          topPerformers {
            productId
            productName
            revenue
            salesCount
            growthRate
            trendDirection
            seasonalityScore
          }
          
          decliningProducts {
            productId
            productName
            revenue
            declineRate
            recommendations
          }
          
          opportunities {
            productId
            productName
            opportunityType
            potentialRevenue
            actionRecommended
            confidence
          }
          
          globalInsights
          
          summary {
            topPerformersCount
            decliningProductsCount
            opportunitiesIdentified
            overallHealthScore
            keyInsights
          }
        }
      }
    `

    const variables = {
      productId: filters.productId,
      startDate: filters.startDate,
      endDate: filters.endDate
    }

    const response = await this.request(query, variables)
    return response.productPerformanceInsights
  }

  /**
   * Export des statistiques (génération côté client en attendant l'API backend)
   */
  async exportStats(filters: StatsFilters, format: string = 'csv'): Promise<Blob> {
    const data = await this.getUserOrderStatistics(filters)
    
    if (format === 'csv') {
      return this.generateCSV(data.data)
    }
    
    throw new Error(`Format d'export non supporté: ${format}`)
  }

  /**
   * Génère un CSV à partir des données de statistiques
   */
  private generateCSV(data: any[]): Blob {
    if (!data || data.length === 0) {
      return new Blob(['Aucune donnée à exporter'], { type: 'text/csv' })
    }

    const headers = [
      'ID Utilisateur',
      'Nom',
      'Email',
      'Nombre de commandes',
      'Montant total',
      'Panier moyen',
      'Première commande',
      'Dernière commande',
      'Segment client'
    ]

    const csvContent = [
      headers.join(','),
      ...data.map(item => [
        item.userId,
        `"${item.userName || ''}"`,
        `"${item.userEmail || ''}"`,
        item.totalOrders,
        item.totalAmount,
        item.averageOrderValue,
        item.firstOrderDate,
        item.lastOrderDate,
        item.customerSegment
      ].join(','))
    ].join('\n')

    return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  }

  /**
   * Récupère les statistiques par utilisateur (méthode legacy pour compatibilité)
   */
  async getOrderStatsByUser(filters: StatsFilters = {}): Promise<OrderStats[]> {
    try {
      // Essayer d'abord la nouvelle API
      const result = await this.getUserOrderStatistics({
        ...filters,
        limit: 100 // Limite par défaut pour la compatibilité
      })
      return result.data
    } catch (error) {
      console.error('❌ API getUserOrderStatistics non disponible:', error)
      throw new Error('API getUserOrderStatistics indisponible - Veuillez vous référer au backend pour implémenter cette API')
    }
  }

  /**
   * Récupère les statistiques mensuelles
   */
  async getMonthlyStats(year?: number): Promise<any[]> {
    const currentYear = year || new Date().getFullYear()
    const startDate = `${currentYear}-01-01`
    const endDate = `${currentYear}-12-31`

    try {
      // Essayer d'abord la nouvelle API
      const timeline = await this.getRevenueTimeline({
        start_date: startDate,
        end_date: endDate,
        groupBy: 'MONTH'
      })

      return timeline.periods || []
    } catch (error) {
      console.error('❌ API revenueTimeline (mensuelle) non disponible:', error)
      throw new Error('API revenueTimeline indisponible - Veuillez vous référer au backend pour implémenter cette API')
    }
  }

  /**
   * Récupère les données de croissance client
   */
  async getCustomerGrowth(months = 12): Promise<any> {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setMonth(startDate.getMonth() - months)

    const query = `
      query CustomerGrowthTimeline($startDate: Date, $endDate: Date, $groupBy: TimeGrouping) {
        customerGrowthTimeline(
          startDate: $startDate
          endDate: $endDate
          groupBy: $groupBy
        ) {
          periods
          summary
          trends
        }
      }
    `

    const variables = {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      groupBy: 'MONTH'
    }

    try {
      const response = await this.request(query, variables)
      
      // Format conforme à la documentation
      return {
        periods: response.customerGrowthTimeline.periods.map((period: any) => ({
          month: period.period,
          newCustomers: period.newCustomers,
          returningCustomers: period.returningCustomers,
          totalCustomers: period.totalCustomers,
          growthRate: period.growthRate
        })),
        summary: response.customerGrowthTimeline.summary,
        trends: response.customerGrowthTimeline.trends
      }
    } catch (error) {
      console.error('API customerGrowthTimeline error:', error)
      throw new Error('API customerGrowthTimeline indisponible')
    }
  }

  /**
   * Récupère les produits les plus vendus
   */
  async getTopProducts(filters: { start_date?: string, end_date?: string, limit?: number } = {}): Promise<any[]> {
    try {
      // Essayer d'abord la nouvelle API
      const orderStats = await this.getOrderStatistics({
        start_date: filters.start_date || '',
        end_date: filters.end_date || ''
      })

      return orderStats.topProducts || []
    } catch (error) {
      console.error('API topProducts error:', error)
      throw new Error('API topProducts indisponible')
    }
  }

  /**
   * API PUBLIQUE - Statistiques de base des commandes
   */
  async getBasicOrderStats(startDate: string, endDate: string): Promise<any> {
    const query = `
      query BasicOrderStats($startDate: Date!, $endDate: Date!) {
        basicOrderStats(startDate: $startDate, endDate: $endDate) {
          totalOrders
          totalRevenue
          averageOrderValue
          popularProducts
        }
      }
    `;

    try {
      const result = await this.request(query, { startDate, endDate });
      return result.basicOrderStats;
    } catch (error) {
      console.error('API basicOrderStats error:', error);
      throw new Error('API basicOrderStats indisponible');
    }
  }

  /**
   * API PUBLIQUE - Revenus mensuels
   */
  async getMonthlyRevenue(months: number = 12): Promise<any[]> {
    const query = `
      query MonthlyRevenue($months: Int) {
        monthlyRevenue(months: $months) {
          month
          revenue
          orderCount
        }
      }
    `;

    try {
      const result = await this.request(query, { months });
      return result.monthlyRevenue;
    } catch (error) {
      console.error('API monthlyRevenue error:', error);
      throw new Error('API monthlyRevenue indisponible');
    }
  }

  /**
   * Diagnostic automatique des problèmes d'API conforme à la documentation
   */
  async diagnoseSyncIssues(): Promise<string> {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      return 'AUTH_MISSING';
    }
    
    try {
      await this.getUserOrderStatistics({});
      return 'USER_API_OK';
    } catch (error) {
      return 'USER_API_FAILED';
    }
  }

  /**
   * Méthode avec fallback automatique conforme à la documentation
   */
  async safeApiCall(apiMethod: (...args: any[]) => Promise<any>, ...args: any[]): Promise<any> {
    try {
      return await apiMethod.call(this, ...args);
    } catch (error: any) {
      if (error.extensions?.code === 'UNAUTHORIZED') {
        // Fallback vers API publique si disponible
        console.warn('Permissions admin requises. Utilisation de l\'API publique...');
        
        // Déterminer quelle API publique utiliser
        if (apiMethod === this.getOrderStatistics) {
          return await this.getBasicOrderStats(args[0].start_date, args[0].end_date);
        }
        if (apiMethod === this.getRevenueTimeline) {
          return await this.getMonthlyRevenue(12);
        }
      }
      
      console.error('Erreur API:', error);
      throw new Error(`Erreur lors de l'appel API: ${error.message}`);
    }
  }

}

// Instance singleton du service
export const statsService = new StatsService()
