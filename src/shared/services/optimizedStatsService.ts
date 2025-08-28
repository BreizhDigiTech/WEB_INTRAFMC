// Service GraphQL optimisé pour toutes les statistiques
import { GraphQLService } from '@/shared/services/graphql'

export interface DashboardStats {
    orders: {
        total: number
        thisMonth: number
        lastMonth: number
        growth: number
    }
    revenue: {
        total: number
        thisMonth: number
        lastMonth: number
        growth: number
    }
    users: {
        total: number
        active: number
        newThisMonth: number
    }
    products: {
        total: number
        lowStock: number
        outOfStock: number
    }
}

export interface OrdersSummary {
    totalOrders: number
    pendingOrders: number
    validatedOrders: number
    cancelledOrders: number
    totalRevenue: number
}

export interface UsersSummary {
    totalUsers: number
    activeUsers: number
    inactiveUsers: number
    adminUsers: number
    recentRegistrations: number
}

export interface EcommerceSummary {
    totalProducts: number
    totalCategories: number
    lowStockProducts: number
    outOfStockProducts: number
    totalValue: number
    averagePrice: number
}

export class OptimizedStatsService extends GraphQLService {
    /**
     * 🚀 Dashboard complet optimisé - Toutes les stats en une requête
     */
    async getDashboardStats(): Promise<DashboardStats> {
        const query = `
            query DashboardOptimized {
                dashboardStatsOptimized {
                    orders {
                        total
                        thisMonth
                        lastMonth
                        growth
                    }
                    revenue {
                        total
                        thisMonth
                        lastMonth
                        growth
                    }
                    users {
                        total
                        active
                        newThisMonth
                    }
                    products {
                        total
                        lowStock
                        outOfStock
                    }
                }
            }
        `
        
        try {
            const response = await this.request(query)
            return response.dashboardStatsOptimized
        } catch (error) {
            throw error
        }
    }

    /**
     * 📊 Statistiques commandes rapides
     */
    async getOrdersSummary(): Promise<OrdersSummary> {
        console.log('📊 Récupération ordersSummary...')
        
        const query = `
            query OrdersSummary {
                ordersSummary {
                    totalOrders
                    pendingOrders
                    validatedOrders
                    cancelledOrders
                    totalRevenue
                }
            }
        `
        
        try {
            const response = await this.request(query)
            console.log('✅ Orders summary:', response.ordersSummary)
            return response.ordersSummary
        } catch (error) {
            console.error('❌ Erreur orders summary:', error)
            throw error
        }
    }

    /**
     * 👥 Statistiques utilisateurs rapides
     */
    async getUsersSummary(): Promise<UsersSummary> {
        console.log('👥 Récupération usersSummary...')
        
        const query = `
            query UsersSummary {
                usersSummary {
                    totalUsers
                    activeUsers
                    inactiveUsers
                    adminUsers
                    recentRegistrations
                }
            }
        `
        
        try {
            const response = await this.request(query)
            console.log('✅ Users summary:', response.usersSummary)
            return response.usersSummary
        } catch (error) {
            console.error('❌ Erreur users summary:', error)
            throw error
        }
    }

    /**
     * 🛒 Statistiques e-commerce rapides
     */
    async getEcommerceSummary(): Promise<EcommerceSummary> {
        console.log('🛒 Récupération ecommerceSummary...')
        
        const query = `
            query EcommerceSummary {
                ecommerceSummary {
                    totalProducts
                    totalCategories
                    lowStockProducts
                    outOfStockProducts
                    totalValue
                    averagePrice
                }
            }
        `
        
        try {
            const response = await this.request(query)
            console.log('✅ Ecommerce summary:', response.ecommerceSummary)
            return response.ecommerceSummary
        } catch (error) {
            console.error('❌ Erreur ecommerce summary:', error)
            throw error
        }
    }

    /**
     * 🎯 Toutes les statistiques en une seule requête (pour les dashboards)
     */
    async getAllSummaries(): Promise<{
        orders: OrdersSummary
        users: UsersSummary
        ecommerce: EcommerceSummary
    }> {
        console.log('🎯 Chargement de toutes les statistiques...')
        
        const query = `
            query AllSummaries {
                ordersSummary {
                    totalOrders
                    pendingOrders
                    validatedOrders
                    cancelledOrders
                    totalRevenue
                }
                usersSummary {
                    totalUsers
                    activeUsers
                    inactiveUsers
                    adminUsers
                    recentRegistrations
                }
                ecommerceSummary {
                    totalProducts
                    totalCategories
                    lowStockProducts
                    outOfStockProducts
                    totalValue
                    averagePrice
                }
            }
        `
        
        try {
            const response = await this.request(query)
            console.log('✅ Toutes les stats reçues:', {
                orders: response.ordersSummary,
                users: response.usersSummary,
                ecommerce: response.ecommerceSummary
            })
            
            return {
                orders: response.ordersSummary,
                users: response.usersSummary,
                ecommerce: response.ecommerceSummary
            }
        } catch (error) {
            console.error('❌ Erreur chargement complet:', error)
            throw error
        }
    }
}

// Export d'une instance du service
export const optimizedStatsService = new OptimizedStatsService()
