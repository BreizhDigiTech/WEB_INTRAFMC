import { computed } from 'vue'
import { useStatsStore } from '../stores/statsStore'
import type { DateRange, StatsFilters } from '../types'

/**
 * Composable pour la gestion des statistiques
 * Facilite l'utilisation du store stats dans les composants
 */
export function useStats() {
  const statsStore = useStatsStore()

  // État réactif
  const orderStats = computed(() => statsStore.orderStats)
  const periodStats = computed(() => statsStore.periodStats)
  const monthlyStats = computed(() => statsStore.monthlyStats)
  const dailyStats = computed(() => statsStore.dailyStats)
  const customerGrowth = computed(() => statsStore.customerGrowth)
  const topProducts = computed(() => statsStore.topProducts)
  const loading = computed(() => statsStore.loading)
  const error = computed(() => statsStore.error)
  const currentFilters = computed(() => statsStore.currentFilters)
  const currentDateRange = computed(() => statsStore.currentDateRange)

  // Getters calculés
  const totalRevenue = computed(() => statsStore.totalRevenue)
  const totalOrders = computed(() => statsStore.totalOrders)
  const averageOrderValue = computed(() => statsStore.averageOrderValue)
  const topCustomers = computed(() => statsStore.topCustomers)
  const activeCustomers = computed(() => statsStore.activeCustomers)

  // Actions
  const fetchOrderStatsByUser = async (filters: StatsFilters = {}) => {
    await statsStore.fetchOrderStatsByUser(filters)
  }

  const fetchPeriodStats = async (dateRange: DateRange) => {
    await statsStore.fetchPeriodStats(dateRange)
  }

  const fetchMonthlyStats = async (year?: number) => {
    await statsStore.fetchMonthlyStats(year)
  }

  const fetchDailyStats = async (dateRange: DateRange) => {
    await statsStore.fetchDailyStats(dateRange)
  }

  const fetchCustomerGrowth = async (months = 12) => {
    await statsStore.fetchCustomerGrowth(months)
  }

  const fetchTopProducts = async (filters: { start_date?: string, end_date?: string, limit?: number } = {}) => {
    await statsStore.fetchTopProducts(filters)
  }

  const exportStats = async (filters: StatsFilters) => {
    await statsStore.exportStats(filters)
  }

  const clearStats = () => {
    statsStore.clearStats()
  }

  const clearErrors = () => {
    statsStore.clearErrors()
  }

  const setDateRange = (startDate: string, endDate: string) => {
    statsStore.setDateRange(startDate, endDate)
  }

  const getQuickDateRange = (period: 'week' | 'month' | 'quarter' | 'year') => {
    return statsStore.getQuickDateRange(period)
  }

  // Utilitaires
  const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined || isNaN(amount)) return '0,00 €'
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Non disponible'
    try {
      return new Date(dateString).toLocaleDateString('fr-FR')
    } catch {
      return 'Date invalide'
    }
  }

  const formatDateTime = (dateString: string | null | undefined) => {
    if (!dateString) return 'Non disponible'
    try {
      return new Date(dateString).toLocaleString('fr-FR')
    } catch {
      return 'Date invalide'
    }
  }

  const calculateGrowthPercentage = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0
    return ((current - previous) / previous) * 100
  }

  const getPerformanceColor = (percentage: number) => {
    if (percentage > 10) return 'text-green-500'
    if (percentage > 0) return 'text-blue-500'
    if (percentage > -10) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getCustomerRank = (userId: string) => {
    const sorted = [...orderStats.value].sort((a, b) => b.total_amount - a.total_amount)
    return sorted.findIndex(stat => stat.user_id === userId) + 1
  }

  const getCustomerSegment = (totalAmount: number) => {
    if (totalAmount > 1000) return { label: 'VIP', color: 'bg-purple-500' }
    if (totalAmount > 500) return { label: 'Fidèle', color: 'bg-blue-500' }
    if (totalAmount > 100) return { label: 'Régulier', color: 'bg-green-500' }
    return { label: 'Nouveau', color: 'bg-gray-500' }
  }

  const getRevenueTrend = () => {
    if (monthlyStats.value.length < 2) return { trend: 0, isPositive: false }
    
    const current = monthlyStats.value[monthlyStats.value.length - 1]
    const previous = monthlyStats.value[monthlyStats.value.length - 2]
    
    const trend = calculateGrowthPercentage(current.total_revenue, previous.total_revenue)
    return { trend, isPositive: trend > 0 }
  }

  const getOrdersTrend = () => {
    if (monthlyStats.value.length < 2) return { trend: 0, isPositive: false }
    
    const current = monthlyStats.value[monthlyStats.value.length - 1]
    const previous = monthlyStats.value[monthlyStats.value.length - 2]
    
    const trend = calculateGrowthPercentage(current.total_orders, previous.total_orders)
    return { trend, isPositive: trend > 0 }
  }

  const getCustomersTrend = () => {
    if (customerGrowth.value.length < 2) return { trend: 0, isPositive: false }
    
    const current = customerGrowth.value[customerGrowth.value.length - 1]
    const previous = customerGrowth.value[customerGrowth.value.length - 2]
    
    const trend = calculateGrowthPercentage(current.total_customers, previous.total_customers)
    return { trend, isPositive: trend > 0 }
  }

  return {
    // État
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
    getQuickDateRange,

    // Utilitaires
    formatCurrency,
    formatDate,
    formatDateTime,
    calculateGrowthPercentage,
    getPerformanceColor,
    getCustomerRank,
    getCustomerSegment,
    getRevenueTrend,
    getOrdersTrend,
    getCustomersTrend
  }
}
