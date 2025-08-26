// Types pour customerGrowthTimeline conforme à la documentation
export interface CustomerGrowthTimelineResponse {
  periods: CustomerGrowthPeriod[]
  summary: CustomerGrowthSummary
  trends: CustomerGrowthTrends
}

export interface CustomerGrowthPeriod {
  period: string
  newCustomers: number
  returningCustomers: number
  totalCustomers: number
  growthRate: number
}

export interface CustomerGrowthSummary {
  totalNewCustomers: number
  averageGrowthRate: number
  peakGrowthPeriod: string
  projectedNextPeriod: number
}

export interface CustomerGrowthTrends {
  isGrowing: boolean
  trend: string
  momentum: string
  seasonality: string
}

// Nouveaux types pour les APIs GraphQL corrigées

export interface UserOrderStatisticsResponse {
  userId: string
  userName: string
  email: string
  totalOrders: number
  totalAmount: number
  averageOrderValue: number
  orderFrequency: number
  daysSinceFirstOrder: number
  customerSegment: 'VIP' | 'PREMIUM' | 'STANDARD' | 'NEW' | 'PROSPECT' | 'AT_RISK'
  favoriteProducts: FavoriteProduct[]
  favoriteCategories: FavoriteCategory[]
  behaviorAnalysis: BehaviorAnalysis
  recommendations: UserRecommendations
  lastOrderDate: string
  memberSince: string
}

export interface FavoriteProduct {
  productId: string
  productName: string
  price: number
  totalQuantity: number
  orderCount: number
  totalSpent: number
}

export interface FavoriteCategory {
  categoryId: string
  categoryName: string
  totalQuantity: number
  orderCount: number
  totalSpent: number
}

export interface BehaviorAnalysis {
  preferredTimeOfDay: string
  preferredDayOfWeek: string
  seasonality: string
  spendingPattern: string
  loyaltyScore: number
}

export interface UserRecommendations {
  products: Array<{
    productId: string
    productName: string
    price: number
    reason: string
  }>
  actions: Array<{
    type: string
    message: string
    priority: string
  }>
}

export interface RevenueTimelineResponse {
  periods: TimelinePeriod[]
  totals: TimelineTotals
  insights: TimelineInsights
}

export interface TimelinePeriod {
  period: string
  date: string
  revenue: number
  orders: number
  uniqueCustomers: number
  averageOrderValue: number
  cancelledOrders: number
  categoryBreakdown: CategoryBreakdown[]
}

export interface CategoryBreakdown {
  categoryId: string
  categoryName: string
  revenue: number
  orders: number
}

export interface TimelineTotals {
  totalRevenue: number
  totalOrders: number
  averageOrderValue: number
  peakPeriod: PeakPeriod
  lowestPeriod: PeakPeriod
}

export interface PeakPeriod {
  date: string
  revenue: number
  orders: number
}

export interface TimelineInsights {
  trend: string
  seasonality: string
  volatility: number
  forecast: string
  anomalies: Anomaly[]
}

export interface Anomaly {
  date: string
  type: string
  severity: string
  description: string
}

// Enums disponibles
export type TimeGrouping = 'HOUR' | 'DAY' | 'WEEK' | 'MONTH' | 'QUARTER' | 'YEAR'
export type TrendDirection = 'UP' | 'DOWN' | 'STABLE'
export type CustomerSegment = 'VIP' | 'PREMIUM' | 'STANDARD' | 'NEW' | 'PROSPECT' | 'AT_RISK'

// Types existants (pour compatibilité)
export interface User {
  id: string
  name: string
  email: string
  is_admin: boolean
  is_active: boolean
}

export interface OrderStats {
  user_id: string
  user: User
  total_orders: number
  total_amount: number
  average_order_value: number
  first_order_date: string
  last_order_date: string
  
  // Nouvelles propriétés des APIs avancées
  userId?: string
  userName?: string
  userEmail?: string
  userPhone?: string
  registrationDate?: string
  lastOrderDate?: string
  daysSinceLastOrder?: number
  orderFrequency?: number
  customerSegment?: 'VIP' | 'PREMIUM' | 'STANDARD' | 'NEW' | 'INACTIVE'
  loyaltyScore?: number
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH'
  churnProbability?: number
  
  // Analyse comportementale
  favoriteCategory?: {
    id: string
    name: string
    ordersCount: number
    totalSpent: number
  }
  totalProductsBought?: number
  averageProductsPerOrder?: number
  repeatOrdersCount?: number
  seasonality?: string
  
  // Analyse financière
  monthlySpending?: Array<{
    month: string
    amount: number
    orders: number
  }>
  growthTrend?: string
  
  // Prédictions ML
  predictedNextOrder?: string
  recommendedProducts?: Array<{
    id: string
    name: string
    confidence: number
  }>
}

export interface PeriodStats {
  start_date: string
  end_date: string
  total_users: number
  total_orders: number
  total_revenue: number
  average_order_value: number
  top_customers: OrderStats[]
}

export interface DateRange {
  start_date: string
  end_date: string
}

export interface StatsFilters {
  start_date?: string
  end_date?: string
  user_id?: string
  min_amount?: number
  max_amount?: number
  limit?: number
}

export interface MonthlyStats {
  month: string
  year: number
  total_orders: number
  total_revenue: number
  unique_customers: number
}

export interface DailyStats {
  date: string
  total_orders: number
  total_revenue: number
  unique_customers: number
}

export interface CustomerGrowth {
  month: string
  new_customers: number
  returning_customers: number
  total_customers: number
}

export interface ProductStats {
  product_id: string
  product_name: string
  total_quantity_sold: number
  total_revenue: number
  unique_customers: number
}

export interface StatsError {
  code: string
  message: string
  field?: string
}

export interface StatsResponse<T> {
  success: boolean
  data?: T
  error?: StatsError
}

// 🆕 NOUVEAUX TYPES - APIs publiques alternatives

export interface BasicOrderStatsResponse {
  totalOrders: number
  totalRevenue: number
  averageOrderValue: number
  popularProducts: PopularProduct[]
}

export interface PopularProduct {
  id: string
  name: string
  orderCount: number
  revenue: number
}

export interface MonthlyRevenueResponse {
  month: string
  revenue: number
  orderCount: number
}
