import { StatsService } from '@/modules/stats/services/statsService'
import type { OrderStats, StatsFilters } from '@/modules/stats/types'
import { computed, ref } from 'vue'

/**
 * Composable pour les fonctionnalités avancées et intelligentes des commandes
 * Utilise les nouvelles APIs backend avec capacités ML et analytics
 */
export function useOrderIntelligence() {
  const statsService = new StatsService()
  
  // État
  const loading = ref({
    orderStatistics: false,
    userStatistics: false,
    revenueTimeline: false
  })
  
  const error = ref<string | null>(null)
  const orderStatistics = ref<any>(null)
  const userStatistics = ref<{ data: OrderStats[], pagination: any, summary: any } | null>(null)
  const revenueTimeline = ref<any>(null)

  // Getters calculés
  const revenueGrowth = computed(() => {
    return orderStatistics.value?.comparison?.revenueGrowth || null
  })

  const ordersGrowth = computed(() => {
    return orderStatistics.value?.comparison?.ordersGrowth || null
  })

  const customersGrowth = computed(() => {
    return orderStatistics.value?.comparison?.customersGrowth || null
  })

  const topProducts = computed(() => {
    return orderStatistics.value?.topProducts || []
  })

  const topCustomers = computed(() => {
    return orderStatistics.value?.topCustomers || []
  })

  const metrics = computed(() => {
    return orderStatistics.value?.metrics || {}
  })

  const customerSegmentation = computed(() => {
    if (!userStatistics.value?.summary) return null
    
    const segments = userStatistics.value.summary.segmentDistribution
    const total = segments.vip + segments.premium + segments.standard + segments.new + segments.inactive
    
    return {
      total,
      distribution: segments,
      percentages: {
        vip: total > 0 ? (segments.vip / total * 100).toFixed(1) : '0',
        premium: total > 0 ? (segments.premium / total * 100).toFixed(1) : '0',
        standard: total > 0 ? (segments.standard / total * 100).toFixed(1) : '0',
        new: total > 0 ? (segments.new / total * 100).toFixed(1) : '0',
        inactive: total > 0 ? (segments.inactive / total * 100).toFixed(1) : '0'
      }
    }
  })

  // Actions
  const getOrderStatistics = async (filters: StatsFilters & { compareWithPrevious?: boolean } = {}) => {
    loading.value.orderStatistics = true
    error.value = null

    try {
      const result = await statsService.getOrderStatistics({
        ...filters,
        compareWithPrevious: filters.compareWithPrevious ?? true
      })
      orderStatistics.value = result
      return result
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors du chargement des statistiques'
      console.error('Erreur getOrderStatistics:', err)
      throw err
    } finally {
      loading.value.orderStatistics = false
    }
  }

  const getUserOrderStatistics = async (filters: StatsFilters & {
    userId?: string,
    page?: number,
    limit?: number,
    sortBy?: string,
    sortOrder?: string,
    segmentFilter?: string,
    searchUser?: string
  } = {}) => {
    loading.value.userStatistics = true
    error.value = null

    try {
      const result = await statsService.getUserOrderStatistics(filters)
      userStatistics.value = result
      return result
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors du chargement des statistiques utilisateur'
      console.error('Erreur getUserOrderStatistics:', err)
      throw err
    } finally {
      loading.value.userStatistics = false
    }
  }

  const getRevenueTimeline = async (filters: StatsFilters & {
    groupBy?: string,
    includeComparison?: boolean
  } = {}) => {
    loading.value.revenueTimeline = true
    error.value = null

    try {
      const result = await statsService.getRevenueTimeline({
        ...filters,
        groupBy: filters.groupBy || 'DAY'
      })
      revenueTimeline.value = result
      return result
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors du chargement de la timeline'
      console.error('Erreur getRevenueTimeline:', err)
      throw err
    } finally {
      loading.value.revenueTimeline = false
    }
  }

  // Utilitaires d'analyse
  const analyzeCustomerBehavior = (customer: OrderStats) => {
    const behavior = {
      segment: customer.customerSegment,
      loyaltyScore: customer.loyaltyScore,
      riskLevel: customer.riskLevel,
      churnProbability: customer.churnProbability,
      isVip: customer.customerSegment === 'VIP',
      isPremium: customer.customerSegment === 'PREMIUM',
      isAtRisk: customer.riskLevel === 'HIGH' || (customer.churnProbability && customer.churnProbability > 0.7),
      needsAttention: (customer.daysSinceLastOrder && customer.daysSinceLastOrder > 30) && customer.total_orders > 1,
      isNewCustomer: customer.customerSegment === 'NEW',
      isInactive: customer.customerSegment === 'INACTIVE'
    }

    return behavior
  }

  const getCustomerRecommendations = (customer: OrderStats) => {
    const behavior = analyzeCustomerBehavior(customer)
    const recommendations = []

    if (behavior.isVip) {
      recommendations.push({
        type: 'vip_treatment',
        message: 'Client VIP - Offrir un service premium',
        priority: 'high'
      })
    }

    if (behavior.isAtRisk) {
      recommendations.push({
        type: 'retention',
        message: 'Client à risque - Campagne de rétention recommandée',
        priority: 'urgent'
      })
    }

    if (behavior.needsAttention) {
      recommendations.push({
        type: 'reactivation',
        message: `Inactif depuis ${customer.daysSinceLastOrder} jours - Relance suggérée`,
        priority: 'medium'
      })
    }

    if (behavior.isNewCustomer) {
      recommendations.push({
        type: 'onboarding',
        message: 'Nouveau client - Programme d\'accueil recommandé',
        priority: 'medium'
      })
    }

    if (customer.recommendedProducts?.length && customer.recommendedProducts.length > 0) {
      recommendations.push({
        type: 'cross_sell',
        message: `${customer.recommendedProducts.length} produits recommandés par IA`,
        priority: 'low',
        products: customer.recommendedProducts
      })
    }

    return recommendations
  }

  const formatMetrics = (value: number, type: 'currency' | 'percentage' | 'number' = 'number') => {
    if (type === 'currency') {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
      }).format(value)
    }
    
    if (type === 'percentage') {
      return `${value.toFixed(1)}%`
    }
    
    return new Intl.NumberFormat('fr-FR').format(value)
  }

  const getTrendDirection = (growth: any) => {
    if (!growth || growth.percentage === 0) return 'stable'
    return growth.percentage > 0 ? 'up' : 'down'
  }

  const getTrendColor = (growth: any) => {
    const direction = getTrendDirection(growth)
    if (direction === 'up') return 'text-green-500'
    if (direction === 'down') return 'text-red-500'
    return 'text-gray-500'
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // État
    loading,
    error,
    orderStatistics,
    userStatistics,
    revenueTimeline,

    // Getters
    revenueGrowth,
    ordersGrowth,
    customersGrowth,
    topProducts,
    topCustomers,
    metrics,
    customerSegmentation,

    // Actions
    getOrderStatistics,
    getUserOrderStatistics,
    getRevenueTimeline,

    // Utilitaires
    analyzeCustomerBehavior,
    getCustomerRecommendations,
    formatMetrics,
    getTrendDirection,
    getTrendColor,
    clearError
  }
}
