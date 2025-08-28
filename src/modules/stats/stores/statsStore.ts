import { optimizedStatsService } from '@/shared/services/optimizedStatsService'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { hybridStatsService } from '../services'
import type {
    CustomerGrowth,
    DailyStats,
    DateRange,
    MonthlyStats,
    OrderStats,
    PeriodStats,
    ProductStats,
    StatsFilters
} from '../types'

export const useStatsStore = defineStore('stats', () => {
  // State
  const orderStats = ref<OrderStats[]>([])
  const periodStats = ref<PeriodStats | null>(null)
  const monthlyStats = ref<MonthlyStats[]>([])
  const dailyStats = ref<DailyStats[]>([])
  const customerGrowth = ref<CustomerGrowth[]>([])
  const topProducts = ref<ProductStats[]>([])
  
  // 🆕 État pour les statistiques globales (vraies totaux)
  const globalStats = ref({
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0
  })
  
  const loading = ref({
    orderStats: false,
    periodStats: false,
    monthlyStats: false,
    dailyStats: false,
    customerGrowth: false,
    topProducts: false,
    globalStats: false,
    export: false
  })
  
  const error = ref({
    orderStats: null as string | null,
    periodStats: null as string | null,
    monthlyStats: null as string | null,
    dailyStats: null as string | null,
    customerGrowth: null as string | null,
    topProducts: null as string | null,
    globalStats: null as string | null,
    export: null as string | null
  })

  const currentFilters = ref<StatsFilters>({})
  const currentDateRange = ref<DateRange>({
    start_date: '',
    end_date: ''
  })

  // Getters
  // 🔄 Getters conditionnels : utilise globalStats si pas de filtre, sinon orderStats
  const totalRevenue = computed(() => {
    // Si on n'a pas de filtres actifs, utilise les stats globales
    if (!currentFilters.value.start_date && !currentFilters.value.end_date && !currentFilters.value.user_id) {
      return globalStats.value.totalRevenue
    }
    
    // Sinon, calcule depuis orderStats (pour les filtres)
    return orderStats.value.reduce((sum, stat) => {
      const amount = (stat as any).totalAmount || stat.total_amount || 0
      return sum + amount
    }, 0)
  })

  const totalOrders = computed(() => {
    // Si on n'a pas de filtres actifs, utilise les stats globales
    if (!currentFilters.value.start_date && !currentFilters.value.end_date && !currentFilters.value.user_id) {
      return globalStats.value.totalOrders
    }
    
    // Sinon, calcule depuis orderStats (pour les filtres)
    return orderStats.value.reduce((sum, stat) => {
      const orders = (stat as any).totalOrders || stat.total_orders || 0
      return sum + orders
    }, 0)
  })

  const averageOrderValue = computed(() => {
    const total = totalRevenue.value
    const orders = totalOrders.value
    return orders > 0 ? total / orders : 0
  })

  const topCustomers = computed(() => {
    return [...orderStats.value]
      .sort((a, b) => {
        const amountA = (a as any).totalAmount || a.total_amount || 0
        const amountB = (b as any).totalAmount || b.total_amount || 0
        return amountB - amountA
      })
      // 🆕 TOUS les utilisateurs, pas de filtre, pas de limite
  })

  const activeCustomers = computed(() => {
    return orderStats.value.filter(stat => {
      const orders = (stat as any).totalOrders || stat.total_orders || 0
      return orders > 0
    }).length
  })

  // Actions
  // 🚀 Fonction optimisée pour charger les vraies stats globales
  async function fetchGlobalStats() {
    loading.value.globalStats = true
    error.value.globalStats = null

    try {
      console.log('🚀 Chargement des statistiques globales optimisées...')
      
      // Essayer d'abord les nouvelles APIs optimisées
      try {
        const dashboardStats = await optimizedStatsService.getDashboardStats()
        
        globalStats.value = {
          totalRevenue: dashboardStats.revenue.total || 0,
          totalOrders: dashboardStats.orders.total || 0,
          averageOrderValue: dashboardStats.orders.total > 0 ? 
            dashboardStats.revenue.total / dashboardStats.orders.total : 0
        }
        
        console.log('✅ Stats globales optimisées chargées:', globalStats.value)
        return
        
      } catch (optimizedError) {
        console.warn('⚠️ API optimisée indisponible, fallback vers ordersSummary:', optimizedError)
        
        // Fallback vers ordersSummary
        try {
          const ordersSummary = await optimizedStatsService.getOrdersSummary()
          
          globalStats.value = {
            totalRevenue: ordersSummary.totalRevenue || 0,
            totalOrders: ordersSummary.totalOrders || 0,
            averageOrderValue: ordersSummary.totalOrders > 0 ? 
              ordersSummary.totalRevenue / ordersSummary.totalOrders : 0
          }
          
          console.log('✅ Stats via ordersSummary chargées:', globalStats.value)
          return
          
        } catch (summaryError) {
          console.warn('⚠️ ordersSummary indisponible, fallback vers ancienne méthode:', summaryError)
        }
      }
      
      // Fallback final vers l'ancienne méthode
      const startDate = '2020-01-01'
      const endDate = new Date().toISOString().split('T')[0]
      
      const stats = await hybridStatsService.getBasicOrderStats(startDate, endDate)
      
      globalStats.value = {
        totalRevenue: stats.totalRevenue || 0,
        totalOrders: stats.totalOrders || 0,
        averageOrderValue: stats.averageOrderValue || 0
      }
      
      console.log('✅ Stats globales via fallback chargées:', globalStats.value)
      
    } catch (err) {
      error.value.globalStats = err instanceof Error ? err.message : 'Erreur lors du chargement des statistiques globales'
      console.error('❌ Erreur fetchGlobalStats:', err)
      
      // Fallback : remettre à zéro
      globalStats.value = {
        totalRevenue: 0,
        totalOrders: 0,
        averageOrderValue: 0
      }
    } finally {
      loading.value.globalStats = false
    }
  }

  // 🚀 Nouvelle fonction pour charger toutes les statistiques optimisées
  async function fetchAllStatsOptimized() {
    console.log('🚀 Chargement de toutes les statistiques optimisées...')
    
    try {
      // Charger toutes les statistiques en une seule requête
      const allStats = await optimizedStatsService.getAllSummaries()
      
      // Mettre à jour les stats globales depuis les commandes
      globalStats.value = {
        totalRevenue: allStats.orders.totalRevenue || 0,
        totalOrders: allStats.orders.totalOrders || 0,
        averageOrderValue: allStats.orders.totalOrders > 0 ? 
          allStats.orders.totalRevenue / allStats.orders.totalOrders : 0
      }
      
      console.log('✅ Toutes les statistiques optimisées chargées:', {
        orders: allStats.orders,
        users: allStats.users,
        ecommerce: allStats.ecommerce,
        globalStats: globalStats.value
      })
      
      return allStats
      
    } catch (error) {
      console.warn('⚠️ Chargement optimisé échoué, fallback vers méthodes individuelles:', error)
      
      // Fallback vers les méthodes individuelles
      await fetchGlobalStats()
      throw error
    }
  }

  async function fetchOrderStatsByUser(filters: StatsFilters = {}) {
    loading.value.orderStats = true
    error.value.orderStats = null
    currentFilters.value = { ...filters }

    try {
      const stats = await hybridStatsService.getOrderStatsByUser(filters)
      orderStats.value = stats
    } catch (err) {
      error.value.orderStats = err instanceof Error ? err.message : 'Erreur lors du chargement des statistiques'
      console.error('Erreur fetchOrderStatsByUser:', err)
    } finally {
      loading.value.orderStats = false
    }
  }

  async function fetchPeriodStats(dateRange: DateRange) {
    loading.value.periodStats = true
    error.value.periodStats = null
    currentDateRange.value = { ...dateRange }

    try {
      const stats = await hybridStatsService.getRevenueTimeline({
        start_date: dateRange.start_date,
        end_date: dateRange.end_date,
        groupBy: 'MONTH' // Par défaut pour les stats de période
      })
      periodStats.value = stats
    } catch (err) {
      error.value.periodStats = err instanceof Error ? err.message : 'Erreur lors du chargement des statistiques de période'
      console.error('Erreur fetchPeriodStats:', err)
    } finally {
      loading.value.periodStats = false
    }
  }

  async function fetchMonthlyStats(year?: number) {
    loading.value.monthlyStats = true
    error.value.monthlyStats = null

    try {
      const stats = await hybridStatsService.getMonthlyStats(year)
      monthlyStats.value = stats
    } catch (err) {
      error.value.monthlyStats = err instanceof Error ? err.message : 'Erreur lors du chargement des statistiques mensuelles'
      console.error('Erreur fetchMonthlyStats:', err)
    } finally {
      loading.value.monthlyStats = false
    }
  }

  async function fetchDailyStats(dateRange: DateRange) {
    loading.value.dailyStats = true
    error.value.dailyStats = null

    try {
      const stats = await hybridStatsService.getRevenueTimeline({
        start_date: dateRange.start_date,
        end_date: dateRange.end_date,
        groupBy: 'DAY' // Groupement par jour pour les stats journalières
      })
      dailyStats.value = stats
    } catch (err) {
      error.value.dailyStats = err instanceof Error ? err.message : 'Erreur lors du chargement des statistiques journalières'
      console.error('Erreur fetchDailyStats:', err)
    } finally {
      loading.value.dailyStats = false
    }
  }

  async function fetchCustomerGrowth(months = 12) {
    loading.value.customerGrowth = true
    error.value.customerGrowth = null

    try {
      const growth = await hybridStatsService.getCustomerGrowth(months)
      // Extraire les périodes si on a la nouvelle structure
      customerGrowth.value = growth.periods || growth
    } catch (err) {
      error.value.customerGrowth = err instanceof Error ? err.message : 'Erreur lors du chargement de la croissance client'
      console.error('Erreur fetchCustomerGrowth:', err)
    } finally {
      loading.value.customerGrowth = false
    }
  }

  async function fetchTopProducts(filters: { start_date?: string, end_date?: string, limit?: number } = {}) {
    loading.value.topProducts = true
    error.value.topProducts = null

    try {
      const products = await hybridStatsService.getTopProducts(filters)
      topProducts.value = products
    } catch (err) {
      error.value.topProducts = err instanceof Error ? err.message : 'Erreur lors du chargement des produits les plus vendus'
      console.error('Erreur fetchTopProducts:', err)
    } finally {
      loading.value.topProducts = false
    }
  }

  async function exportStats(filters: StatsFilters): Promise<void> {
    loading.value.export = true
    error.value.export = null

    try {
      console.log('StatsStore: exportStats called with filters:', filters)
      const blob = await hybridStatsService.exportStats(filters)
      
      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `statistiques_${filters.start_date || 'all'}_${filters.end_date || 'all'}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      console.log('StatsStore: export completed successfully')
    } catch (err) {
      error.value.export = err instanceof Error ? err.message : 'Erreur lors de l\'export des statistiques'
      console.error('Erreur exportStats:', err)
    } finally {
      loading.value.export = false
    }
  }

  function clearStats() {
    orderStats.value = []
    periodStats.value = null
    monthlyStats.value = []
    dailyStats.value = []
    customerGrowth.value = []
    topProducts.value = []
  }

  function clearErrors() {
    Object.keys(error.value).forEach(key => {
      error.value[key as keyof typeof error.value] = null
    })
  }

  function setDateRange(startDate: string, endDate: string) {
    currentDateRange.value = {
      start_date: startDate,
      end_date: endDate
    }
  }

  function getQuickDateRange(period: 'week' | 'month' | 'quarter' | 'year'): DateRange {
    const now = new Date()
    const start = new Date()

    switch (period) {
      case 'week':
        start.setDate(now.getDate() - 7)
        break
      case 'month':
        start.setMonth(now.getMonth() - 1)
        break
      case 'quarter':
        start.setMonth(now.getMonth() - 3)
        break
      case 'year':
        start.setFullYear(now.getFullYear() - 1)
        break
    }

    return {
      start_date: start.toISOString().split('T')[0],
      end_date: now.toISOString().split('T')[0]
    }
  }

  return {
    // State
    orderStats,
    periodStats,
    monthlyStats,
    dailyStats,
    customerGrowth,
    topProducts,
    globalStats,
    loading,
    error,
    currentFilters,
    currentDateRange,

    // Getters
    totalRevenue,
    totalOrders,
    averageOrderValue,
    topCustomers,
    activeCustomers,

    // Actions
    fetchGlobalStats,
    fetchAllStatsOptimized,
    fetchOrderStatsByUser,
    fetchPeriodStats,
    fetchMonthlyStats,
    fetchDailyStats,
    fetchCustomerGrowth,
    fetchTopProducts,
    exportStats,
    clearStats,
    clearErrors,
    setDateRange,
    getQuickDateRange
  }
})
