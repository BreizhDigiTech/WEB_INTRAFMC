// Service GraphQL pour la gestion des commandes
import { GraphQLService } from '@/shared/services/graphql'
import type {
    Order,
    OrderFilters,
    OrderStats,
    CreateOrderData,
    UpdateOrderData
} from '../types'
import type { PaginatedResponse } from '@/shared/types'
import { useAuthStore } from '@/stores/auth'

export class OrderService extends GraphQLService {
    /**
     * Récupère la liste des commandes avec pagination et filtres
     * Limite maximale de 50 éléments par page (contrainte GraphQL)
     * Utilise la query admin si l'utilisateur est admin (avec détails des produits)
     */
    async getOrders(filters: OrderFilters = {}, page = 1, limit = 20): Promise<PaginatedResponse<Order>> {
        // Vérifier la limite maximale autorisée par l'API GraphQL
        if (limit > 50) {
            console.warn(`Limite de ${limit} éléments réduite à 50 (limite maximale de l'API GraphQL)`)
            limit = 50
        }

        const authStore = useAuthStore()
        const isAdmin = authStore.isAdmin

        // Query pour les administrateurs avec détails des produits
        const adminQuery = `
            query GetAllOrders($first: Int, $page: Int) {
                orders(first: $first, page: $page) {
                    paginatorInfo {
                        currentPage
                        hasMorePages
                        total
                        perPage
                        lastPage
                    }
                    data {
                        id
                        total
                        status
                        created_at
                        updated_at
                        products {
                            id
                            name
                            price
                            pivot {
                                quantity
                                unit_price
                            }
                        }
                        user {
                            id
                            name
                            email
                        }
                    }
                }
            }
        `

        // Query pour les utilisateurs normaux (sans détails des produits)
        const userQuery = `
            query GetOrders($first: Int, $page: Int) {
                orders(first: $first, page: $page) {
                    paginatorInfo {
                        currentPage
                        hasMorePages
                        total
                        perPage
                        lastPage
                    }
                    data {
                        id
                        total
                        status
                        created_at
                        updated_at
                        user {
                            id
                            name
                            email
                        }
                    }
                }
            }
        `

        const query = isAdmin ? adminQuery : userQuery

        return this.request(query, { first: limit, page })
            .then((response: any) => {
                const orders = response.orders
                return {
                    data: orders.data,
                    pagination: {
                        total: orders.paginatorInfo.total,
                        per_page: orders.paginatorInfo.perPage,
                        current_page: orders.paginatorInfo.currentPage,
                        last_page: orders.paginatorInfo.lastPage,
                        from: ((orders.paginatorInfo.currentPage - 1) * orders.paginatorInfo.perPage) + 1,
                        to: Math.min(orders.paginatorInfo.currentPage * orders.paginatorInfo.perPage, orders.paginatorInfo.total)
                    }
                }
            })
    }

    /**
     * Récupère une commande par son ID
     * Inclut les détails des produits si l'utilisateur est admin
     */
    async getOrder(id: string): Promise<Order> {
        const authStore = useAuthStore()
        const isAdmin = authStore.isAdmin

        // Query pour les administrateurs avec détails des produits
        const adminQuery = `
            query GetOrder($id: ID!) {
                order(id: $id) {
                    id
                    total
                    status
                    created_at
                    updated_at
                    products {
                        id
                        name
                        price
                        pivot {
                            quantity
                            unit_price
                        }
                    }
                    user {
                        id
                        name
                        email
                    }
                }
            }
        `

        // Query pour les utilisateurs normaux (sans détails des produits)
        const userQuery = `
            query GetOrder($id: ID!) {
                order(id: $id) {
                    id
                    total
                    status
                    created_at
                    updated_at
                    user {
                        id
                        name
                        email
                    }
                }
            }
        `

        const query = isAdmin ? adminQuery : userQuery

        return this.request(query, { id })
            .then((response: any) => response.order)
    }

    /**
     * Crée une nouvelle commande
     */
    async createOrder(data: CreateOrderData): Promise<Order> {
        const mutation = `
            mutation CreateOrder($data: CreateOrderInput!) {
                createOrder(data: $data) {
                    id
                    total
                    status
                    created_at
                    updated_at
                    user {
                        id
                        name
                        email
                    }
                }
            }
        `

        return this.request(mutation, { data })
            .then((response: any) => response.createOrder)
    }

    /**
     * Met à jour une commande
     */
    async updateOrder(id: string, data: UpdateOrderData): Promise<Order> {
        const mutation = `
            mutation UpdateOrder($id: ID!, $data: UpdateOrderInput!) {
                updateOrder(id: $id, data: $data) {
                    id
                    total
                    status
                    created_at
                    updated_at
                    user {
                        id
                        name
                        email
                    }
                }
            }
        `

        return this.request(mutation, { id, data })
            .then((response: any) => response.updateOrder)
    }

    /**
     * Supprime une commande
     */
    async deleteOrder(id: string): Promise<boolean> {
        const mutation = `
      mutation DeleteOrder($id: ID!) {
        deleteOrder(id: $id)
      }
    `

        return this.request(mutation, { id })
            .then((response: any) => response.deleteOrder)
    }

    /**
     * Récupère les statistiques des commandes
     * NOTE: Cette méthode n'est actuellement pas utilisée car la requête orderStats
     * n'est pas implémentée sur le backend. Les statistiques sont calculées côté client.
     */
    async getOrderStats(): Promise<OrderStats> {
        const query = `
      query GetOrderStats {
        orderStats {
          total_orders
          total_revenue
          orders_today
          orders_this_week
          orders_this_month
          pending_orders
          processing_orders
          shipped_orders
          cancelled_orders
          average_order_value
        }
      }
    `

        return this.request(query)
            .then((response: any) => response.orderStats)
    }

    /**
     * Annule une commande (mise à jour du statut)
     */
    async cancelOrder(id: string): Promise<Order> {
        return this.updateOrder(id, { status: 'cancelled' })
    }

    /**
     * Valide une commande (mise à jour du statut)
     */
    async validateOrder(id: string): Promise<Order> {
        return this.updateOrder(id, { status: 'validated' })
    }

    /**
     * Recherche de commandes par utilisateur ou ID
     */
    async searchOrders(query: string): Promise<Order[]> {
        const searchQuery = `
            query SearchOrders($query: String!) {
                searchOrders(query: $query) {
                    id
                    total
                    status
                    created_at
                    updated_at
                    user {
                        id
                        name
                        email
                    }
                }
            }
        `

        return this.request(searchQuery, { query })
            .then((response: any) => response.searchOrders)
    }
}

// Export d'une instance du service
export const orderService = new OrderService()
