import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { orderService } from '../services/orderService'
import type { Order } from '../types'

interface OrderStats {
    total: number
    pending: number
    validated: number
    cancelled: number
    totalRevenue: number
}

export const useOrderStore = defineStore('orders', () => {
    const orders = ref<Order[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    // État de pagination
    const currentPage = ref(1)
    const totalPages = ref(1)
    const totalOrders = ref(0)
    const perPage = ref(20)

    // Statistiques globales
    const globalStats = ref<OrderStats>({
        total: 0,
        pending: 0,
        validated: 0,
        cancelled: 0,
        totalRevenue: 0
    })
    const statsLoading = ref(false)

    // Getters pour filtrer par statut (page actuelle)
    const pendingOrders = computed(() =>
        orders.value.filter(order => order.status === 'pending')
    )

    const validatedOrders = computed(() =>
        orders.value.filter(order => order.status === 'validated')
    )

    const cancelledOrders = computed(() =>
        orders.value.filter(order => order.status === 'cancelled')
    )

    // Actions
    async function fetchOrders(page = 1, limit?: number, filters: any = {}) {
        loading.value = true
        error.value = null
        try {
            // L'API GraphQL limite à 50 éléments maximum
            const actualLimit = Math.min(limit || perPage.value, 50)

            // Si des filtres sont appliqués, on doit charger toutes les données pour filtrer correctement
            const hasFilters = Object.keys(filters).length > 0

            if (hasFilters) {
                // Pour les filtres, on charge tout et on filtre côté client
                const result = await orderService.getOrdersWithFilters(filters, page, actualLimit)
                orders.value = result.data
                currentPage.value = result.pagination.current_page
                totalPages.value = result.pagination.last_page
                totalOrders.value = result.pagination.total
                if (!limit) {
                    perPage.value = Math.min(result.pagination.per_page, 50)
                }
                return result
            } else {
                // Sans filtres, pagination normale
                const result = await orderService.getOrders({}, page, actualLimit)
                orders.value = result.data
                currentPage.value = result.pagination.current_page
                totalPages.value = result.pagination.last_page
                totalOrders.value = result.pagination.total
                if (!limit) {
                    perPage.value = Math.min(result.pagination.per_page, 50)
                }
                return result
            }
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Erreur lors du chargement des commandes'
            console.error('Erreur fetchOrders:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    async function updatePerPage(newPerPage: number) {
        // Limiter à 50 maximum
        const limitedPerPage = Math.min(newPerPage, 50)
        perPage.value = limitedPerPage
        currentPage.value = 1 // Reset à la page 1
        await fetchOrders(1, limitedPerPage)
    }

    async function fetchOrderById(id: string) {
        loading.value = true
        error.value = null
        try {
            return await orderService.getOrder(id)
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Erreur lors du chargement de la commande'
            console.error('Erreur fetchOrderById:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    async function fetchGlobalStats() {
        statsLoading.value = true
        try {
            let allOrders: Order[] = []
            let currentPageNum = 1
            let hasMorePages = true

            // Charger toutes les commandes par chunks de 50 (limite GraphQL)
            while (hasMorePages) {
                const response = await orderService.getOrders({}, currentPageNum, 50)
                allOrders.push(...response.data)

                hasMorePages = response.pagination.current_page < response.pagination.last_page
                currentPageNum++

                // Sécurité pour éviter les boucles infinies
                if (currentPageNum > 1000) break
            }

            // Calculer les statistiques
            globalStats.value = {
                total: allOrders.length,
                pending: allOrders.filter(o => o.status === 'pending').length,
                validated: allOrders.filter(o => o.status === 'validated').length,
                cancelled: allOrders.filter(o => o.status === 'cancelled').length,
                totalRevenue: allOrders
                    .filter(o => o.status === 'validated')
                    .reduce((sum, o) => sum + o.total, 0)
            }

            return globalStats.value
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Erreur lors du calcul des statistiques'
            console.error('Erreur fetchGlobalStats:', err)
            throw err
        } finally {
            statsLoading.value = false
        }
    }

    async function validateOrder(orderId: string) {
        loading.value = true
        error.value = null
        try {
            const updatedOrder = await orderService.validateOrder(orderId)
            // Mettre à jour la commande dans la liste
            const index = orders.value.findIndex(order => order.id === orderId)
            if (index !== -1) {
                orders.value[index] = updatedOrder
            }
            // Mettre à jour les stats globales si elles sont chargées
            if (globalStats.value.total > 0) {
                globalStats.value.pending--
                globalStats.value.validated++
                globalStats.value.totalRevenue += updatedOrder.total
            }
            return updatedOrder
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Erreur lors de la validation de la commande'
            console.error('Erreur validateOrder:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    async function cancelOrder(orderId: string) {
        loading.value = true
        error.value = null
        try {
            const updatedOrder = await orderService.cancelOrder(orderId)
            // Mettre à jour la commande dans la liste
            const index = orders.value.findIndex(order => order.id === orderId)
            if (index !== -1) {
                orders.value[index] = updatedOrder
            }
            // Mettre à jour les stats globales si elles sont chargées
            if (globalStats.value.total > 0) {
                globalStats.value.pending--
                globalStats.value.cancelled++
            }
            return updatedOrder
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Erreur lors de l\'annulation de la commande'
            console.error('Erreur cancelOrder:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    async function generateInvoice(orderId: string) {
        loading.value = true
        error.value = null
        try {
            const result = await orderService.generateInvoice(orderId)
            return result
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Erreur lors de la génération de la facture'
            console.error('Erreur generateInvoice:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    return {
        // State
        orders,
        loading,
        error,

        // Pagination
        currentPage,
        totalPages,
        totalOrders,
        perPage,

        // Statistiques
        globalStats,
        statsLoading,

        // Getters
        pendingOrders,
        validatedOrders,
        cancelledOrders,

        // Actions
        fetchOrders,
        fetchOrderById,
        fetchGlobalStats,
        validateOrder,
        cancelOrder,
        updatePerPage,
        generateInvoice
    }
})