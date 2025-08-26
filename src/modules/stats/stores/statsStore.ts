import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { statsService } from '../services'
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
  
  const loading = ref({
    orderStats: false,
    periodStats: false,
    monthlyStats: false,
    dailyStats: false,
    customerGrowth: false,
    topProducts: false,
    export: false
  })
  
  const error = ref({
    orderStats: null as string | null,
    periodStats: null as string | null,
    monthlyStats: null as string | null,
    dailyStats: null as string | null,
    customerGrowth: null as string | null,
    topProducts: null as string | null,
    export: null as string | null
  })

  const currentFilters = ref<StatsFilters>({})
  const currentDateRange = ref<DateRange>({
    start_date: '',
    end_date: ''
  })

  // Getters
  const totalRevenue = computed(() => {
    return orderStats.value.reduce((sum, stat) => {
      const amount = (stat as any).totalAmount || stat.total_amount || 0
      return sum + amount
    }, 0)
  })

  const totalOrders = computed(() => {
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
      .slice(0, 10)
  })

  const activeCustomers = computed(() => {
    return orderStats.value.filter(stat => {
      const orders = (stat as any).totalOrders || stat.total_orders || 0
      return orders > 0
    }).length
  })

  // Actions
  async function fetchOrderStatsByUser(filters: StatsFilters = {}) {
    loading.value.orderStats = true
    error.value.orderStats = null
    currentFilters.value = { ...filters }

    try {
      const stats = await statsService.getOrderStatsByUser(filters)
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
      const stats = await statsService.getRevenueTimeline({
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
      const stats = await statsService.getMonthlyStats(year)
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
      const stats = await statsService.getRevenueTimeline({
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
      const growth = await statsService.getCustomerGrowth(months)
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
      const products = await statsService.getTopProducts(filters)
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
      const blob = await statsService.exportStats(filters)
      
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
