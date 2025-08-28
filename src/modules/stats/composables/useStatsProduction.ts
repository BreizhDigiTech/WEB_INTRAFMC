import { computed, ref } from 'vue'
import { hybridStatsService, StatsServiceError } from '../services/hybridStatsService.production'
import { useStatsStore } from '../stores/statsStore'
import type { StatsFilters } from '../types'

/**
 * 🚀 Composable avancé pour la gestion des statistiques (Production Ready)
 * Avec gestion d'erreurs robuste, cache et pagination
 */
export function useStatsProduction() {
  const statsStore = useStatsStore()

  // États additionnels pour la version production
  const isLoadingAdvanced = ref(false)
  const currentPage = ref(1)
  const itemsPerPage = ref(20)
  const totalItems = ref(0)
  const hasMoreItems = ref(false)
  const lastError = ref<StatsServiceError | null>(null)
  const cacheStatus = ref<{ size: number; enabled: boolean }>({ size: 0, enabled: true })

  // État réactif du store
  const orderStats = computed(() => statsStore.orderStats)
  const loading = computed(() => statsStore.loading)
  const error = computed(() => statsStore.error)

  // Getters calculés
  const totalRevenue = computed(() => statsStore.totalRevenue)
  const totalOrders = computed(() => statsStore.totalOrders)
  const averageOrderValue = computed(() => statsStore.averageOrderValue)
  const topCustomers = computed(() => statsStore.topCustomers)
  const activeCustomers = computed(() => statsStore.activeCustomers)

  /**
   * 🚀 Récupération avancée des statistiques avec pagination et cache
   */
  const fetchOrderStatsByUserAdvanced = async (
    filters: StatsFilters = {},
    options: {
      page?: number
      limit?: number
      useCache?: boolean
      forceRefresh?: boolean
    } = {}
  ) => {
    isLoadingAdvanced.value = true
    lastError.value = null

    try {
      const {
        page = currentPage.value,
        limit = itemsPerPage.value,
        useCache = cacheStatus.value.enabled,
        forceRefresh = false
      } = options

      const result = await hybridStatsService.getOrderStatsByUserAdvanced(filters, {
        page,
        limit,
        useCache,
        forceRefresh
      })

      // Mise à jour des états
      currentPage.value = page
      totalItems.value = result.total
      hasMoreItems.value = result.hasMore
      
      // Mise à jour du store pour compatibilité
      statsStore.orderStats = result.data

      // Mise à jour du statut du cache
      const cacheStats = hybridStatsService.getCacheStats()
      cacheStatus.value = {
        size: cacheStats.size,
        enabled: useCache
      }

      console.log(`✅ Stats chargées: ${result.data.length}/${result.total} (page ${page}, cache: ${result.cached ? 'HIT' : 'MISS'})`)
      
      return result

    } catch (error: any) {
      lastError.value = error instanceof StatsServiceError ? error : new StatsServiceError(error.message)
      console.error('❌ Erreur fetchOrderStatsByUserAdvanced:', error)
      throw error
    } finally {
      isLoadingAdvanced.value = false
    }
  }

  /**
   * 📊 Récupération simple (compatibilité)
   */
  const fetchOrderStatsByUser = async (filters: StatsFilters = {}) => {
    try {
      const result = await fetchOrderStatsByUserAdvanced(filters, { page: 1, limit: 100 })
      return result.data
    } catch (error) {
      console.error('❌ Erreur fetchOrderStatsByUser:', error)
      return []
    }
  }

  /**
   * 📄 Navigation pagination
   */
  const goToPage = async (page: number, filters: StatsFilters = {}) => {
    if (page < 1) return
    return await fetchOrderStatsByUserAdvanced(filters, { page })
  }

  const nextPage = async (filters: StatsFilters = {}) => {
    if (!hasMoreItems.value) return
    return await goToPage(currentPage.value + 1, filters)
  }

  const previousPage = async (filters: StatsFilters = {}) => {
    if (currentPage.value <= 1) return
    return await goToPage(currentPage.value - 1, filters)
  }

  /**
   * 🔄 Actualisation forcée
   */
  const forceRefresh = async (filters: StatsFilters = {}) => {
    return await fetchOrderStatsByUserAdvanced(filters, { 
      forceRefresh: true,
      page: 1 
    })
  }

  /**
   * 🧪 Test de connectivité
   */
  const testConnections = async () => {
    try {
      const results = await hybridStatsService.testApiConnections()
      console.log('🧪 Résultats tests API:', results)
      return results
    } catch (error) {
      console.error('❌ Erreur test connexions:', error)
      throw error
    }
  }

  /**
   * 🗑️ Gestion du cache
   */
  const clearCache = () => {
    hybridStatsService.clearCache()
    cacheStatus.value.size = 0
    console.log('🗑️ Cache vidé')
  }

  const toggleCache = () => {
    cacheStatus.value.enabled = !cacheStatus.value.enabled
    console.log(`🔄 Cache ${cacheStatus.value.enabled ? 'activé' : 'désactivé'}`)
  }

  /**
   * 📊 Stats mensuelles avec cache
   */
  const fetchMonthlyStats = async (year?: number, useCache: boolean = true) => {
    try {
      return await hybridStatsService.getMonthlyStats(year, useCache)
    } catch (error) {
      console.error('❌ Erreur stats mensuelles:', error)
      throw error
    }
  }

  /**
   * 🔍 Recherche d'utilisateur spécifique
   */
  const fetchUserStats = async (userId: string) => {
    try {
      const result = await fetchOrderStatsByUserAdvanced({ user_id: userId }, { limit: 1 })
      return result.data[0] || null
    } catch (error) {
      console.error(`❌ Erreur stats utilisateur ${userId}:`, error)
      return null
    }
  }

  /**
   * 📈 Calculs dérivés
   */
  const getTopPerformers = computed(() => {
    return [...orderStats.value]
      .sort((a, b) => (b.total_amount || 0) - (a.total_amount || 0))
      .slice(0, 10)
  })

  const getRecentCustomers = computed(() => {
    return orderStats.value.filter(stat => stat.customer_segment === 'NEW')
  })

  const getVIPCustomers = computed(() => {
    return orderStats.value.filter(stat => stat.customer_segment === 'VIP')
  })

  // Getters pour pagination
  const paginationInfo = computed(() => ({
    currentPage: currentPage.value,
    itemsPerPage: itemsPerPage.value,
    totalItems: totalItems.value,
    totalPages: Math.ceil(totalItems.value / itemsPerPage.value),
    hasMore: hasMoreItems.value,
    hasPrevious: currentPage.value > 1
  }))

  // État de l'erreur formaté
  const errorInfo = computed(() => {
    if (!lastError.value) return null
    
    return {
      message: lastError.value.message,
      code: lastError.value.code,
      statusCode: lastError.value.statusCode,
      isClientError: (lastError.value.statusCode || 0) < 500,
      isServerError: (lastError.value.statusCode || 0) >= 500
    }
  })

  return {
    // États
    orderStats,
    loading: computed(() => loading.value || isLoadingAdvanced.value),
    error: computed(() => error.value || lastError.value),
    
    // États avancés
    isLoadingAdvanced,
    lastError,
    cacheStatus,
    errorInfo,
    
    // Pagination
    currentPage: computed(() => currentPage.value),
    totalItems: computed(() => totalItems.value),
    hasMoreItems: computed(() => hasMoreItems.value),
    paginationInfo,
    
    // Getters calculés
    totalRevenue,
    totalOrders,
    averageOrderValue,
    topCustomers,
    activeCustomers,
    getTopPerformers,
    getRecentCustomers,
    getVIPCustomers,
    
    // Actions de base
    fetchOrderStatsByUser,
    fetchMonthlyStats,
    
    // Actions avancées
    fetchOrderStatsByUserAdvanced,
    fetchUserStats,
    forceRefresh,
    
    // Navigation
    goToPage,
    nextPage,
    previousPage,
    
    // Outils
    testConnections,
    clearCache,
    toggleCache
  }
}
