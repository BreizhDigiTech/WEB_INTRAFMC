import { computed, ref, watch } from 'vue'
import type { OrderFilters, OrderStatus } from '../types'

/**
 * Composable pour la gestion des filtres des commandes
 * Centralise la logique de filtrage et fournit des utilitaires réutilisables
 */
export function useOrderFilters() {
  // État des filtres
  const statusFilter = ref<OrderStatus | ''>('')
  const userSearchFilter = ref('')
  const dateFromFilter = ref('')
  const dateToFilter = ref('')
  const minAmountFilter = ref<number | undefined>()
  const maxAmountFilter = ref<number | undefined>()

  // Debounce pour la recherche
  const searchTimeout = ref<NodeJS.Timeout | null>(null)
  const debouncedSearch = ref('')

  // Watcher pour debounce de la recherche utilisateur
  watch(userSearchFilter, (newValue) => {
    if (searchTimeout.value) {
      clearTimeout(searchTimeout.value)
    }
    
    searchTimeout.value = setTimeout(() => {
      debouncedSearch.value = newValue
    }, 300)
  }, { immediate: true })

  // Computed pour les filtres actifs
  const activeFiltersCount = computed(() => {
    let count = 0
    if (statusFilter.value) count++
    if (debouncedSearch.value.trim()) count++
    if (dateFromFilter.value) count++
    if (dateToFilter.value) count++
    if (minAmountFilter.value && minAmountFilter.value > 0) count++
    if (maxAmountFilter.value && maxAmountFilter.value > 0) count++
    return count
  })

  // Computed pour l'objet de filtres
  const filtersObject = computed<OrderFilters>(() => ({
    status: statusFilter.value ? [statusFilter.value] : undefined,
    user_search: debouncedSearch.value.trim() || undefined,
    date_from: dateFromFilter.value || undefined,
    date_to: dateToFilter.value || undefined,
    min_amount: minAmountFilter.value,
    max_amount: maxAmountFilter.value
  }))

  // Computed pour vérifier si des filtres sont appliqués
  const hasActiveFilters = computed(() => activeFiltersCount.value > 0)

  // Méthodes utilitaires
  function clearAllFilters() {
    statusFilter.value = ''
    userSearchFilter.value = ''
    dateFromFilter.value = ''
    dateToFilter.value = ''
    minAmountFilter.value = undefined
    maxAmountFilter.value = undefined
  }

  function setDateRange(from: string, to: string) {
    dateFromFilter.value = from
    dateToFilter.value = to
  }

  function setAmountRange(min?: number, max?: number) {
    minAmountFilter.value = min
    maxAmountFilter.value = max
  }

  // Présets de filtres rapides
  function applyTodayFilter() {
    const today = new Date().toISOString().split('T')[0]
    setDateRange(today, today)
  }

  function applyThisWeekFilter() {
    const today = new Date()
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()))
    const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6))
    
    setDateRange(
      startOfWeek.toISOString().split('T')[0],
      endOfWeek.toISOString().split('T')[0]
    )
  }

  function applyThisMonthFilter() {
    const today = new Date()
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    
    setDateRange(
      startOfMonth.toISOString().split('T')[0],
      endOfMonth.toISOString().split('T')[0]
    )
  }

  return {
    // État
    statusFilter,
    userSearchFilter,
    dateFromFilter,
    dateToFilter,
    minAmountFilter,
    maxAmountFilter,
    debouncedSearch,

    // Computed
    activeFiltersCount,
    filtersObject,
    hasActiveFilters,

    // Méthodes
    clearAllFilters,
    setDateRange,
    setAmountRange,
    applyTodayFilter,
    applyThisWeekFilter,
    applyThisMonthFilter
  }
}
