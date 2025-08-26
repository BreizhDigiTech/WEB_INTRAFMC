// Export principal du module de statistiques
export { useStats } from './composables/useStats'

// Services - APIs réelles uniquement
export { hybridStatsService, statsService, StatsService } from './services'

export { useStatsStore } from './stores/statsStore'
export { default as StatsView } from './views/StatsView.vue'

// Types exports
export type {
  BasicOrderStatsResponse, CustomerGrowth, CustomerGrowthPeriod, CustomerGrowthSummary, CustomerGrowthTimelineResponse, CustomerGrowthTrends,
  DailyStats, MonthlyRevenueResponse, MonthlyStats, OrderStats, PeriodStats, PopularProduct, ProductStats, StatsError, StatsFilters
} from './types'

