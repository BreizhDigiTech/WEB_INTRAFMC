/**
 * Module Stats - Statistiques et analytics
 */

// Types
export type {
    BasicOrderStatsResponse,
    CustomerGrowth,
    CustomerGrowthPeriod,
    CustomerGrowthSummary,
    CustomerGrowthTimelineResponse,
    CustomerGrowthTrends,
    DailyStats,
    MonthlyRevenueResponse,
    MonthlyStats,
    OrderStats,
    PeriodStats,
    PopularProduct,
    ProductStats,
    StatsError,
    StatsFilters
} from './types'

// Services
export { StatsService, hybridStatsService } from './services'

// Stores
export { useStatsStore } from './stores/statsStore'

// Composables
export { useStats } from './composables/useStats'
export { useStatsProduction } from './composables/useStatsProduction'

// Views
export { default as StatsView } from './views/StatsView.vue'

