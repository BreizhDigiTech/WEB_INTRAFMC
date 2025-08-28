import { computed, onMounted, ref } from 'vue'
import { HybridStatsService } from '../services/hybridStatsService'
import type { OrderStats, StatsFilters } from '../types'

const hybridStatsService = new HybridStatsService()

export function useStats() {
  // État réactif
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const orderStats = ref<OrderStats[]>([])
  const lastUpdate = ref<Date | null>(null)

  // Filtres par défaut
  const filters = ref<StatsFilters>({
    start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0],
    user_id: undefined,
    min_amount: undefined,
    max_amount: undefined,
    limit: 100
  })

  // Computed properties
  const totalCustomers = computed(() => orderStats.value.length)
  
  const totalRevenue = computed(() => 
    orderStats.value.reduce((sum, stat) => sum + (stat.total_amount || 0), 0)
  )
  
  const averageOrderValue = computed(() => {
    const totalOrders = orderStats.value.reduce((sum, stat) => sum + (stat.total_orders || 0), 0)
    return totalOrders > 0 ? totalRevenue.value / totalOrders : 0
  })

  const topCustomers = computed(() => 
    orderStats.value
      .sort((a, b) => (b.total_amount || 0) - (a.total_amount || 0))
      .slice(0, 10)
  )

  const customerSegments = computed(() => {
    const segments = {
      VIP: 0,
      STANDARD: 0,
      NEW: 0
    }
    
    orderStats.value.forEach(stat => {
      if (stat.customer_segment && stat.customer_segment in segments) {
        segments[stat.customer_segment as keyof typeof segments]++
      }
    })
    
    return segments
  })

  // Méthodes
  const loadStats = async (customFilters?: Partial<StatsFilters>) => {
    try {
      isLoading.value = true
      error.value = null
      
      const currentFilters = customFilters 
        ? { ...filters.value, ...customFilters }
        : filters.value

      console.log('📊 Chargement des statistiques avec filtres:', currentFilters)
      
      const stats = await hybridStatsService.getOrderStatistics(currentFilters)
      orderStats.value = stats
      lastUpdate.value = new Date()
      
      console.log(`✅ ${stats.length} statistiques chargées`)
      
    } catch (err) {
      console.error('❌ Erreur lors du chargement des stats:', err)
      error.value = err instanceof Error ? err.message : 'Erreur inconnue'
    } finally {
      isLoading.value = false
    }
  }

  const refreshStats = () => loadStats()

  const updateFilters = (newFilters: Partial<StatsFilters>) => {
    filters.value = { ...filters.value, ...newFilters }
    loadStats()
  }

  const resetFilters = () => {
    filters.value = {
      start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      end_date: new Date().toISOString().split('T')[0],
      user_id: undefined,
      min_amount: undefined,
      max_amount: undefined,
      limit: 100
    }
    loadStats()
  }

  const getCustomersBySegment = (segment: 'VIP' | 'STANDARD' | 'NEW') => {
    return orderStats.value.filter(stat => stat.customer_segment === segment)
  }

  // Chargement initial automatique
  onMounted(() => {
    loadStats()
  })

  return {
    // État
    isLoading,
    error,
    orderStats,
    lastUpdate,
    filters,
    
    // Computed
    totalCustomers,
    totalRevenue,
    averageOrderValue,
    topCustomers,
    customerSegments,
    
    // Méthodes
    loadStats,
    refreshStats,
    updateFilters,
    resetFilters,
    getCustomersBySegment
  }
}
