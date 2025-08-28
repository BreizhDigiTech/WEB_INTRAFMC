export interface OrderStats {
  id: string
  total: number
  date: string
  status: string
  customer: string
  amount: number
  // Propriétés alternatives possibles
  totalAmount?: number
  total_amount?: number
  totalOrders?: number
  total_orders?: number
  // Propriétés utilisateur étendues
  user_id?: string
  user?: {
    id: string
    name: string
    email: string
    avatar_url?: string
    is_admin?: boolean
    is_active?: boolean
  }
  // Propriétés commerciales
  customer_segment?: string
  customerSegment?: string // Alias pour compatibility
  average_order_value?: number
  first_order_date?: string
  last_order_date?: string
  // Propriétés d'intelligence
  loyalty_score?: number
  loyaltyScore?: number // Alias pour compatibility
  risk_level?: string
  riskLevel?: string // Alias pour compatibility
  churn_probability?: number
  churnProbability?: number // Alias pour compatibility
  days_since_last_order?: number
  daysSinceLastOrder?: number // Alias pour compatibility
  recommended_products?: any[]
  recommendedProducts?: any[] // Alias pour compatibility
  orders_recap?: any[]
  orders_summary?: any
}

export interface PeriodStats {
  period: string
  revenue: number
  orders: number
  averageOrderValue: number
  growth: number
}

export interface MonthlyStats {
  month: string
  year: number
  revenue: number
  orders: number
  customers: number
  growth: number
}

export interface DailyStats {
  date: string
  revenue: number
  orders: number
  visitors: number
  conversionRate: number
}

export interface CustomerGrowth {
  period: string
  newCustomers: number
  returningCustomers: number
  totalCustomers: number
  growthRate: number
}

export interface ProductStats {
  id: string
  name: string
  sales: number
  revenue: number
  quantity: number
  category: string
}

export interface StatsFilters {
  start_date?: string
  end_date?: string
  user_id?: string
  status?: string
  category?: string
  search?: string
  min_amount?: number
  max_amount?: number
  limit?: number
}

export interface DateRange {
  start_date: string
  end_date: string
}

export interface GlobalStats {
  totalRevenue: number
  totalOrders: number
  averageOrderValue: number
}

export interface LoadingState {
  orderStats: boolean
  periodStats: boolean
  monthlyStats: boolean
  dailyStats: boolean
  customerGrowth: boolean
  topProducts: boolean
  globalStats: boolean
  export: boolean
}

export interface ErrorState {
  orderStats: string | null
  periodStats: string | null
  monthlyStats: string | null
  dailyStats: string | null
  customerGrowth: string | null
  topProducts: string | null
  globalStats: string | null
  export: string | null
}

// Types supplémentaires pour les services
export interface DashboardStats {
  orders: OrderStatistics
  revenue: RevenueTimeline
  users: UsersSummary
  products: any
}

export interface OrderStatistics {
  totalRevenue: number
  totalOrders: number
  averageOrderValue: number
  growth?: number
}

export interface RevenueTimeline {
  periods: MonthlyRevenue[]
  total: number
  growth: number
}

export interface MonthlyRevenue {
  month: string
  year: number
  revenue: number
  orders: number
}

export interface UsersSummary {
  totalUsers: number
  activeUsers: number
  newUsersThisMonth: number
  growth: number
}

export interface EcommerceSummary {
  totalProducts: number
  totalCategories: number
  lowStockProducts: number
  outOfStockProducts: number
  totalValue: number
  averagePrice: number
}

export interface OrdersSummary {
  totalOrders: number
  totalRevenue: number
  averageOrderValue: number
  ordersByStatus: Record<string, number>
}

export interface BasicOrderStatsResponse {
  data: OrderStats[]
  total: number
}

export interface CustomerGrowthPeriod {
  period: string
  newCustomers: number
  returningCustomers: number
}

export interface CustomerGrowthSummary {
  periods: CustomerGrowthPeriod[]
  totalGrowth: number
}

export interface CustomerGrowthTimelineResponse {
  data: CustomerGrowthSummary
}

export interface CustomerGrowthTrends {
  trends: CustomerGrowth[]
  summary: CustomerGrowthSummary
}

export interface MonthlyRevenueResponse {
  data: MonthlyRevenue[]
  total: number
}

export interface PopularProduct {
  id: string
  name: string
  sales: number
  revenue: number
}

export interface StatsError {
  message: string
  code?: string
  details?: any
}
