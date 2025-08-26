import { computed, ref } from 'vue'
import { StatsService } from '../../stats/services/statsService'
import type { StatsFilters } from '../../stats/types'

/**
 * Composable pour les fonctionnalités avancées d'intelligence artificielle et de recommandations
 * Utilise les nouvelles APIs backend pour les insights ML et les suggestions intelligentes
 */
export function useIntelligenceRecommendations() {
  const statsService = new StatsService()
  
  // État local
  const loading = ref({
    cartSuggestions: false,
    productInsights: false,
    userAnalytics: false
  })
  
  const error = ref({
    cartSuggestions: null as string | null,
    productInsights: null as string | null,
    userAnalytics: null as string | null
  })

  const cartSuggestions = ref<any>(null)
  const productInsights = ref<any>(null)
  const userAnalytics = ref<any>(null)

  /**
   * Récupère les suggestions de panier intelligentes
   */
  const getCartSuggestions = async (userId?: string) => {
    loading.value.cartSuggestions = true
    error.value.cartSuggestions = null

    try {
      const suggestions = await statsService.getCartSuggestions(userId)
      cartSuggestions.value = suggestions
      return suggestions
    } catch (err) {
      error.value.cartSuggestions = err instanceof Error ? err.message : 'Erreur lors du chargement des suggestions'
      console.error('Erreur getCartSuggestions:', err)
      return null
    } finally {
      loading.value.cartSuggestions = false
    }
  }

  /**
   * Récupère les insights de performance des produits
   */
  const getProductPerformanceInsights = async (filters: {
    productId?: string,
    startDate?: string,
    endDate?: string
  } = {}) => {
    loading.value.productInsights = true
    error.value.productInsights = null

    try {
      const insights = await statsService.getProductPerformanceInsights(filters)
      productInsights.value = insights
      return insights
    } catch (err) {
      error.value.productInsights = err instanceof Error ? err.message : 'Erreur lors du chargement des insights'
      console.error('Erreur getProductPerformanceInsights:', err)
      return null
    } finally {
      loading.value.productInsights = false
    }
  }

  /**
   * Récupère les statistiques utilisateurs détaillées avec ML
   */
  const getUserOrderStatistics = async (filters: StatsFilters & {
    userId?: string,
    page?: number,
    limit?: number,
    sortBy?: string,
    sortOrder?: string,
    segmentFilter?: string,
    searchUser?: string
  }) => {
    loading.value.userAnalytics = true
    error.value.userAnalytics = null

    try {
      const analytics = await statsService.getUserOrderStatistics(filters)
      userAnalytics.value = analytics
      return analytics
    } catch (err) {
      error.value.userAnalytics = err instanceof Error ? err.message : 'Erreur lors du chargement des analytics utilisateur'
      console.error('Erreur getUserOrderStatistics:', err)
      return null
    } finally {
      loading.value.userAnalytics = false
    }
  }

  /**
   * Suggestions de produits pour un utilisateur spécifique
   */
  const getPersonalizedRecommendations = computed(() => {
    return cartSuggestions.value?.personalizedSuggestions || []
  })

  /**
   * Produits fréquemment achetés ensemble
   */
  const getFrequentlyBoughtTogether = computed(() => {
    return cartSuggestions.value?.frequentlyBoughtTogether || []
  })

  /**
   * Paniers sauvegardés de l'utilisateur
   */
  const getSavedCarts = computed(() => {
    return cartSuggestions.value?.savedCarts || []
  })

  /**
   * Top performers des produits
   */
  const getTopPerformers = computed(() => {
    return productInsights.value?.topPerformers || []
  })

  /**
   * Produits en déclin nécessitant attention
   */
  const getDecliningProducts = computed(() => {
    return productInsights.value?.decliningProducts || []
  })

  /**
   * Opportunités commerciales détectées par l'IA
   */
  const getBusinessOpportunities = computed(() => {
    return productInsights.value?.opportunities || []
  })

  /**
   * Score de santé global du catalogue
   */
  const getOverallHealthScore = computed(() => {
    return productInsights.value?.summary?.overallHealthScore || 0
  })

  /**
   * Insights clés générés automatiquement
   */
  const getKeyInsights = computed(() => {
    return productInsights.value?.summary?.keyInsights || []
  })

  /**
   * Filtre les recommandations par score de confiance
   */
  const getHighConfidenceRecommendations = (minConfidence = 0.7) => {
    return getPersonalizedRecommendations.value.filter(
      (rec: any) => rec.score >= minConfidence
    )
  }

  /**
   * Analyse des tendances saisonnières
   */
  const getSeasonalTrends = computed(() => {
    return productInsights.value?.globalInsights?.seasonalTrends || []
  })

  /**
   * Recommandations marketing automatiques
   */
  const getMarketingRecommendations = computed(() => {
    return productInsights.value?.globalInsights?.marketingRecommendations || []
  })

  /**
   * Segmentation automatique des clients
   */
  const getCustomerSegmentation = computed(() => {
    return userAnalytics.value?.summary?.segmentDistribution || {}
  })

  /**
   * Détection des clients à risque de départ (churn)
   */
  const getChurnRiskCustomers = computed(() => {
    if (!userAnalytics.value?.data) return []
    
    return userAnalytics.value.data.filter((user: any) => 
      user.churnProbability > 0.5
    )
  })

  /**
   * Clients VIP identifiés automatiquement
   */
  const getVIPCustomers = computed(() => {
    if (!userAnalytics.value?.data) return []
    
    return userAnalytics.value.data.filter((user: any) => 
      user.customerSegment === 'VIP'
    )
  })

  /**
   * Formate un score de confiance en pourcentage
   */
  const formatConfidence = (confidence: number): string => {
    return `${Math.round(confidence * 100)}%`
  }

  /**
   * Obtient la couleur d'un trend
   */
  const getTrendColor = (trend: string): string => {
    switch (trend) {
      case 'GROWING': return 'text-green-500'
      case 'DECLINING': return 'text-red-500'
      case 'STABLE': return 'text-blue-500'
      default: return 'text-gray-500'
    }
  }

  /**
   * Formate un segment client avec couleur
   */
  const formatCustomerSegment = (segment: string): { label: string; color: string } => {
    switch (segment) {
      case 'VIP':
        return { label: 'VIP', color: 'bg-purple-500 text-white' }
      case 'PREMIUM':
        return { label: 'Premium', color: 'bg-gold-500 text-white' }
      case 'STANDARD':
        return { label: 'Standard', color: 'bg-blue-500 text-white' }
      case 'NEW':
        return { label: 'Nouveau', color: 'bg-green-500 text-white' }
      case 'INACTIVE':
        return { label: 'Inactif', color: 'bg-gray-500 text-white' }
      case 'AT_RISK':
        return { label: 'À Risque', color: 'bg-red-500 text-white' }
      default:
        return { label: 'Non défini', color: 'bg-gray-400 text-white' }
    }
  }

  /**
   * Calcule le ROI potentiel d'une opportunité
   */
  const calculatePotentialROI = (opportunity: any): string => {
    if (!opportunity.potentialRevenue) return 'N/A'
    
    const currentRevenue = opportunity.currentRevenue || 0
    const potential = opportunity.potentialRevenue
    const roi = currentRevenue > 0 ? ((potential - currentRevenue) / currentRevenue) * 100 : 0
    
    return `+${Math.round(roi)}%`
  }

  /**
   * Nettoie toutes les données en cache
   */
  const clearAllData = () => {
    cartSuggestions.value = null
    productInsights.value = null
    userAnalytics.value = null
    
    Object.keys(error.value).forEach(key => {
      error.value[key as keyof typeof error.value] = null
    })
  }

  return {
    // État
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    cartSuggestions: computed(() => cartSuggestions.value),
    productInsights: computed(() => productInsights.value),
    userAnalytics: computed(() => userAnalytics.value),

    // Actions principales
    getCartSuggestions,
    getProductPerformanceInsights,
    getUserOrderStatistics,

    // Getters spécialisés
    getPersonalizedRecommendations,
    getFrequentlyBoughtTogether,
    getSavedCarts,
    getTopPerformers,
    getDecliningProducts,
    getBusinessOpportunities,
    getOverallHealthScore,
    getKeyInsights,
    getHighConfidenceRecommendations,
    getSeasonalTrends,
    getMarketingRecommendations,
    getCustomerSegmentation,
    getChurnRiskCustomers,
    getVIPCustomers,

    // Utilitaires
    formatConfidence,
    getTrendColor,
    formatCustomerSegment,
    calculatePotentialROI,
    clearAllData
  }
}
