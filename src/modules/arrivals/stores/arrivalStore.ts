import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { arrivalService } from '../services/arrivalService'
import type {
    Arrival,
    ArrivalsResponse,
    CreateArrivalInput,
    UpdateArrivalInput,
    ArrivalFilters
} from '../types'

export const useArrivalStore = defineStore('arrivals', () => {
    // État
    const arrivals = ref<Arrival[]>([])
    const currentArrival = ref<Arrival | null>(null)
    const loading = ref(false)
    const actionLoading = ref(false)
    const error = ref<string | null>(null)

    // Pagination
    const currentPage = ref(1)
    const perPage = ref(15)
    const totalArrivals = ref(0)
    const hasMorePages = ref(false)

    // Statistiques
    const stats = ref({
        pending: 0,
        validated: 0,
        total: 0,
        totalValue: 0
    })

    // Getters
    const hasArrivals = computed(() => arrivals.value.length > 0)
    const hasPrevPage = computed(() => currentPage.value > 1)
    const hasNextPage = computed(() => hasMorePages.value)

    // Actions
    async function fetchArrivals(page = 1, limit = 15) {
        loading.value = true
        error.value = null

        try {
            const response: ArrivalsResponse = await arrivalService.getArrivals(limit, page)

            arrivals.value = response.data
            currentPage.value = response.paginatorInfo.currentPage
            perPage.value = response.paginatorInfo.perPage
            totalArrivals.value = response.paginatorInfo.total
            hasMorePages.value = response.paginatorInfo.hasMorePages

            // Calculer les statistiques
            calculateStats()
        } catch (err: any) {
            error.value = err.message || 'Erreur lors du chargement des arrivages'
            console.error('Erreur lors du chargement des arrivages:', err)
        } finally {
            loading.value = false
        }
    }

    async function createArrival(arrivalData: CreateArrivalInput): Promise<Arrival> {
        actionLoading.value = true
        error.value = null

        try {
            const newArrival = await arrivalService.createArrival(arrivalData)

            // Ajouter le nouvel arrivage en tête de liste
            arrivals.value.unshift(newArrival)
            totalArrivals.value++

            // Recalculer les statistiques
            calculateStats()

            return newArrival
        } catch (err: any) {
            error.value = err.message || 'Erreur lors de la création de l\'arrivage'
            throw err
        } finally {
            actionLoading.value = false
        }
    }

    async function validateArrival(arrivalId: string): Promise<void> {
        actionLoading.value = true
        error.value = null

        try {
            const updatedArrival = await arrivalService.validateArrival(arrivalId)

            // Mettre à jour l'arrivage dans la liste
            const index = arrivals.value.findIndex(a => a.id === arrivalId)
            if (index !== -1) {
                arrivals.value[index] = { ...arrivals.value[index], ...updatedArrival }
            }

            // Mettre à jour l'arrivage courant s'il correspond
            if (currentArrival.value?.id === arrivalId) {
                currentArrival.value = { ...currentArrival.value, ...updatedArrival }
            }

            // Recalculer les statistiques
            calculateStats()
        } catch (err: any) {
            error.value = err.message || 'Erreur lors de la validation de l\'arrivage'
            throw err
        } finally {
            actionLoading.value = false
        }
    }

    async function updateArrival(arrivalId: string, updateData: UpdateArrivalInput): Promise<void> {
        actionLoading.value = true
        error.value = null

        try {
            const updatedArrival = await arrivalService.updateArrival(arrivalId, updateData)

            // Mettre à jour l'arrivage dans la liste
            const index = arrivals.value.findIndex(a => a.id === arrivalId)
            if (index !== -1) {
                arrivals.value[index] = updatedArrival
            }

            // Mettre à jour l'arrivage courant s'il correspond
            if (currentArrival.value?.id === arrivalId) {
                currentArrival.value = updatedArrival
            }

            // Recalculer les statistiques
            calculateStats()
        } catch (err: any) {
            error.value = err.message || 'Erreur lors de la mise à jour de l\'arrivage'
            throw err
        } finally {
            actionLoading.value = false
        }
    }

    async function deleteArrival(arrivalId: string): Promise<void> {
        actionLoading.value = true
        error.value = null

        try {
            await arrivalService.deleteArrival(arrivalId)

            // Supprimer l'arrivage de la liste
            arrivals.value = arrivals.value.filter(a => a.id !== arrivalId)
            totalArrivals.value--

            // Clear current arrival si c'est celui supprimé
            if (currentArrival.value?.id === arrivalId) {
                currentArrival.value = null
            }

            // Recalculer les statistiques
            calculateStats()
        } catch (err: any) {
            error.value = err.message || 'Erreur lors de la suppression de l\'arrivage'
            throw err
        } finally {
            actionLoading.value = false
        }
    }

    function setCurrentArrival(arrival: Arrival | null) {
        currentArrival.value = arrival
    }

    function clearError() {
        error.value = null
    }

    function calculateStats() {
        const pending = arrivals.value.filter(a => a.status === 'pending').length
        const validated = arrivals.value.filter(a => a.status === 'validated').length
        const totalValue = arrivals.value.reduce((sum, a) => sum + a.amount, 0)

        stats.value = {
            pending,
            validated,
            total: arrivals.value.length,
            totalValue
        }
    }

    // Filtrage côté client pour les recherches simples
    function filterArrivals(filters: ArrivalFilters) {
        let filtered = [...arrivals.value]

        if (filters.status && filters.status.length > 0) {
            filtered = filtered.filter(arrival => filters.status!.includes(arrival.status))
        }

        if (filters.min_amount) {
            filtered = filtered.filter(arrival => arrival.amount >= filters.min_amount!)
        }

        if (filters.max_amount) {
            filtered = filtered.filter(arrival => arrival.amount <= filters.max_amount!)
        }

        if (filters.date_from) {
            const fromDate = new Date(filters.date_from)
            filtered = filtered.filter(arrival => new Date(arrival.created_at!) >= fromDate)
        }

        if (filters.date_to) {
            const toDate = new Date(filters.date_to)
            filtered = filtered.filter(arrival => new Date(arrival.created_at!) <= toDate)
        }

        return filtered
    }

    async function nextPage() {
        if (hasNextPage.value) {
            await fetchArrivals(currentPage.value + 1, perPage.value)
        }
    }

    async function prevPage() {
        if (hasPrevPage.value) {
            await fetchArrivals(currentPage.value - 1, perPage.value)
        }
    }

    async function goToPage(page: number) {
        if (page >= 1) {
            await fetchArrivals(page, perPage.value)
        }
    }

    function resetStore() {
        arrivals.value = []
        currentArrival.value = null
        currentPage.value = 1
        totalArrivals.value = 0
        hasMorePages.value = false
        error.value = null
        stats.value = {
            pending: 0,
            validated: 0,
            total: 0,
            totalValue: 0
        }
    }

    return {
        // État
        arrivals,
        currentArrival,
        loading,
        actionLoading,
        error,
        currentPage,
        perPage,
        totalArrivals,
        hasMorePages,
        stats,

        // Getters
        hasArrivals,
        hasPrevPage,
        hasNextPage,

        // Actions
        fetchArrivals,
        createArrival,
        validateArrival,
        updateArrival,
        deleteArrival,
        setCurrentArrival,
        clearError,
        filterArrivals,
        nextPage,
        prevPage,
        goToPage,
        resetStore
    }
})
