import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useErrorStore } from '../../../shared/errors/errorStore'
import { categoryService } from '../services/categoryService'
import type {
    Category,
    CategoryErrorType,
    CategoryFilters,
    CategoryOperationResult,
    CategoryPaginatorInfo,
    CategoryStats,
    CreateCategoryInput,
    UpdateCategoryInput
} from '../types'

export const useCategoryStore = defineStore('category', () => {
    const categories = ref<Category[]>([])
    const allCategories = ref<Category[]>([]) // Toutes les catégories pour le filtrage
    const loading = ref(false)
    const error = ref<CategoryErrorType | null>(null)
    const lastOperationResult = ref<CategoryOperationResult | null>(null)
    const currentCategory = ref<Category | null>(null)
    const paginatorInfo = ref<CategoryPaginatorInfo | null>(null)
    const stats = ref<CategoryStats | null>(null)
    
    const errorStore = useErrorStore()

    // Fonction utilitaire pour réinitialiser l'état d'erreur
    function clearError() {
        error.value = null
        lastOperationResult.value = null
    }

    async function fetchCategories(page: number = 1, first: number = 20, filters?: CategoryFilters) {
        loading.value = true
        clearError()
        try {
            if (filters && (filters.search || filters.hasDescription !== null || filters.sortBy !== 'name' || filters.sortOrder !== 'asc')) {
                // Si des filtres sont appliqués, récupérer toutes les catégories et filtrer côté client
                if (allCategories.value.length === 0) {
                    const result = await categoryService.getAllCategories()
                    if (!result.success) {
                        error.value = result.error || null
                        return false
                    }
                    allCategories.value = result.data || []
                }
                
                // Appliquer les filtres côté client
                let filtered = [...allCategories.value]
                
                // Filtre par recherche
                if (filters.search) {
                    const searchLower = filters.search.toLowerCase()
                    filtered = filtered.filter(c => 
                        c.name.toLowerCase().includes(searchLower) ||
                        (c.description && c.description.toLowerCase().includes(searchLower))
                    )
                }
                
                // Filtre par description
                if (filters.hasDescription !== null) {
                    filtered = filtered.filter(c => {
                        const hasDesc = c.description && c.description.trim().length > 0
                        return filters.hasDescription ? hasDesc : !hasDesc
                    })
                }
                
                // Tri
                filtered.sort((a, b) => {
                    let aVal = ''
                    let bVal = ''
                    
                    if (filters.sortBy === 'name') {
                        aVal = a.name || ''
                        bVal = b.name || ''
                    } else if (filters.sortBy === 'description') {
                        aVal = a.description || ''
                        bVal = b.description || ''
                    }
                    
                    const comparison = aVal.localeCompare(bVal)
                    return filters.sortOrder === 'asc' ? comparison : -comparison
                })
                
                // Simulation de la pagination
                const total = filtered.length
                const startIndex = (page - 1) * first
                const endIndex = startIndex + first
                categories.value = filtered.slice(startIndex, endIndex)
                
                // Mise à jour des informations de pagination
                paginatorInfo.value = {
                    currentPage: page,
                    lastPage: Math.ceil(total / first),
                    total,
                    perPage: first,
                    hasMorePages: page < Math.ceil(total / first)
                }
            } else {
                // Pas de filtres, utiliser la pagination côté serveur
                const result = await categoryService.getCategories(first, page)
                if (!result.success) {
                    error.value = result.error || null
                    return false
                }
                categories.value = result.data?.data || []
                paginatorInfo.value = result.data?.paginatorInfo || null
            }
            return true
        } catch (err: any) {
            error.value = {
                code: 'SERVER_ERROR',
                message: err.message || 'Erreur lors du chargement des catégories'
            }
            return false
        } finally {
            loading.value = false
        }
    }

    async function fetchCategoryStats() {
        try {
            const result = await categoryService.getCategoryStats()
            if (result.success) {
                stats.value = result.data || null
            } else {
                console.error('Erreur lors du chargement des statistiques:', result.error)
                error.value = result.error || null
            }
        } catch (err: any) {
            error.value = {
                code: 'SERVER_ERROR',
                message: err.message || 'Erreur lors du chargement des statistiques'
            }
        }
    }

    async function fetchCategory(id: string) {
        loading.value = true
        clearError()
        try {
            const result = await categoryService.getCategory(id)
            if (result.success) {
                currentCategory.value = result.data || null
                return true
            } else {
                error.value = result.error || null
                return false
            }
        } catch (err: any) {
            error.value = {
                code: 'SERVER_ERROR',
                message: err.message || 'Erreur lors du chargement de la catégorie'
            }
            return false
        } finally {
            loading.value = false
        }
    }

    async function createCategory(input: CreateCategoryInput) {
        loading.value = true
        clearError()
        try {
            const result = await categoryService.createCategory(input)
            if (result.success && result.data) {
                categories.value.push(result.data)
                // Réinitialiser allCategories pour forcer le rechargement lors du prochain filtrage
                allCategories.value = []
                lastOperationResult.value = {
                    success: true,
                    message: 'Catégorie créée avec succès'
                }
                errorStore.addSuccess(`La catégorie "${result.data.name}" a été créée avec succès`)
                return result.data
            } else {
                error.value = result.error || null
                lastOperationResult.value = {
                    success: false,
                    message: result.error?.message || 'Erreur lors de la création',
                    error: result.error
                }
                if (result.error) {
                    errorStore.addError(result.error.message)
                }
                return null
            }
        } catch (err: any) {
            const errorData: CategoryErrorType = {
                code: 'SERVER_ERROR',
                message: err.message || 'Erreur lors de la création de la catégorie'
            }
            error.value = errorData
            lastOperationResult.value = {
                success: false,
                message: errorData.message,
                error: errorData
            }
            return null
        } finally {
            loading.value = false
        }
    }

    async function updateCategory(id: string, input: UpdateCategoryInput) {
        loading.value = true
        clearError()
        try {
            const result = await categoryService.updateCategory(id, input)
            if (result.success && result.data) {
                const idx = categories.value.findIndex(c => c.id === id)
                if (idx !== -1) {
                    categories.value[idx] = result.data
                }
                // Réinitialiser allCategories pour forcer le rechargement lors du prochain filtrage
                allCategories.value = []
                lastOperationResult.value = {
                    success: true,
                    message: 'Catégorie modifiée avec succès'
                }
                errorStore.addSuccess(`La catégorie "${result.data.name}" a été modifiée avec succès`)
                return result.data
            } else {
                error.value = result.error || null
                lastOperationResult.value = {
                    success: false,
                    message: result.error?.message || 'Erreur lors de la modification',
                    error: result.error
                }
                if (result.error) {
                    errorStore.addError(result.error.message)
                }
                return null
            }
        } catch (err: any) {
            const errorData: CategoryErrorType = {
                code: 'SERVER_ERROR',
                message: err.message || 'Erreur lors de la modification de la catégorie'
            }
            error.value = errorData
            lastOperationResult.value = {
                success: false,
                message: errorData.message,
                error: errorData
            }
            return null
        } finally {
            loading.value = false
        }
    }

    async function deleteCategory(id: string) {
        loading.value = true
        clearError()
        try {
            const result = await categoryService.deleteCategory(id)
            if (result.success) {
                categories.value = categories.value.filter(c => c.id !== id)
                // Réinitialiser allCategories pour forcer le rechargement lors du prochain filtrage
                allCategories.value = []
                lastOperationResult.value = {
                    success: true,
                    message: result.message || 'Catégorie supprimée avec succès'
                }
                errorStore.addSuccess('La catégorie a été supprimée avec succès')
                return true
            } else {
                error.value = result.error || null
                lastOperationResult.value = {
                    success: false,
                    message: result.message,
                    error: result.error
                }
                if (result.error) {
                    errorStore.addError(result.error.message)
                }
                return false
            }
        } catch (err: any) {
            const errorData: CategoryErrorType = {
                code: 'SERVER_ERROR',
                message: err.message || 'Erreur lors de la suppression de la catégorie'
            }
            error.value = errorData
            lastOperationResult.value = {
                success: false,
                message: errorData.message,
                error: errorData
            }
            return false
        } finally {
            loading.value = false
        }
    }

    return {
        categories,
        allCategories,
        loading,
        error,
        lastOperationResult,
        currentCategory,
        paginatorInfo,
        stats,
        clearError,
        fetchCategories,
        fetchCategoryStats,
        fetchCategory,
        createCategory,
        updateCategory,
        deleteCategory
    }
})
