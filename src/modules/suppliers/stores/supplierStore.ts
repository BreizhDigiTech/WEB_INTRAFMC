import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supplierService } from '../services/supplierService'
import type {
    Supplier,
    CreateSupplierInput,
    UpdateSupplierInput,
    SupplierFilters,
    SupplierStats
} from '../types'

export const useSupplierStore = defineStore('suppliers', () => {
    // État
    const suppliers = ref<Supplier[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)
    const selectedSupplier = ref<Supplier | null>(null)
    const filters = ref<SupplierFilters>({})

    // Computed
    const filteredSuppliers = computed(() => {
        let result = suppliers.value

        if (filters.value.search) {
            const search = filters.value.search.toLowerCase()
            result = result.filter(supplier =>
                supplier.name.toLowerCase().includes(search) ||
                supplier.contact_email.toLowerCase().includes(search) ||
                supplier.phone?.toLowerCase().includes(search) ||
                supplier.address?.toLowerCase().includes(search)
            )
        }

        if (filters.value.has_products !== undefined) {
            result = result.filter(supplier => {
                const hasProducts = supplier.products && supplier.products.length > 0
                return filters.value.has_products ? hasProducts : !hasProducts
            })
        }

        return result
    })

    const stats = computed((): SupplierStats => {
        const total = suppliers.value.length
        const withProducts = suppliers.value.filter(s => s.products && s.products.length > 0).length

        return {
            total,
            active: total, // Tous sont considérés comme actifs pour l'instant
            with_products: withProducts,
            without_products: total - withProducts
        }
    })

    const hasSuppliers = computed(() => suppliers.value.length > 0)

    // Actions
    async function fetchSuppliers() {
        loading.value = true
        error.value = null

        try {
            suppliers.value = await supplierService.getSuppliers()
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Erreur lors du chargement des fournisseurs'
            console.error('Erreur fetchSuppliers:', err)
        } finally {
            loading.value = false
        }
    }

    async function fetchSupplier(id: string) {
        loading.value = true
        error.value = null

        try {
            selectedSupplier.value = await supplierService.getSupplier(id)
            return selectedSupplier.value
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Erreur lors du chargement du fournisseur'
            console.error('Erreur fetchSupplier:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    async function createSupplier(input: CreateSupplierInput) {
        loading.value = true
        error.value = null

        try {
            const newSupplier = await supplierService.createSupplier(input)
            suppliers.value.push(newSupplier)
            return newSupplier
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Erreur lors de la création du fournisseur'
            console.error('Erreur createSupplier:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    async function updateSupplier(id: string, input: UpdateSupplierInput) {
        loading.value = true
        error.value = null

        try {
            const updatedSupplier = await supplierService.updateSupplier(id, input)
            const index = suppliers.value.findIndex(s => s.id === id)
            if (index !== -1) {
                suppliers.value[index] = updatedSupplier
            }

            // Mettre à jour le fournisseur sélectionné si c'est le même
            if (selectedSupplier.value?.id === id) {
                selectedSupplier.value = updatedSupplier
            }

            return updatedSupplier
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Erreur lors de la mise à jour du fournisseur'
            console.error('Erreur updateSupplier:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    async function deleteSupplier(id: string) {
        loading.value = true
        error.value = null

        try {
            const response = await supplierService.deleteSupplier(id)
            if (response.success) {
                suppliers.value = suppliers.value.filter(s => s.id !== id)

                // Nettoyer le fournisseur sélectionné si c'est celui supprimé
                if (selectedSupplier.value?.id === id) {
                    selectedSupplier.value = null
                }
            }
            return response
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Erreur lors de la suppression du fournisseur'
            console.error('Erreur deleteSupplier:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    async function attachSupplierToProduct(supplierId: string, productId: string) {
        loading.value = true
        error.value = null

        try {
            const updatedSupplier = await supplierService.attachSupplierToProduct(supplierId, productId)
            const index = suppliers.value.findIndex(s => s.id === supplierId)
            if (index !== -1) {
                suppliers.value[index] = updatedSupplier
            }
            return updatedSupplier
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Erreur lors de l\'association du produit'
            console.error('Erreur attachSupplierToProduct:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    async function detachSupplierFromProduct(supplierId: string, productId: string) {
        loading.value = true
        error.value = null

        try {
            const updatedSupplier = await supplierService.detachSupplierFromProduct(supplierId, productId)
            const index = suppliers.value.findIndex(s => s.id === supplierId)
            if (index !== -1) {
                suppliers.value[index] = updatedSupplier
            }
            return updatedSupplier
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Erreur lors de la désassociation du produit'
            console.error('Erreur detachSupplierFromProduct:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    function setFilters(newFilters: SupplierFilters) {
        filters.value = { ...filters.value, ...newFilters }
    }

    function clearFilters() {
        filters.value = {}
    }

    function clearError() {
        error.value = null
    }

    function clearSelectedSupplier() {
        selectedSupplier.value = null
    }

    return {
        // État
        suppliers,
        loading,
        error,
        selectedSupplier,
        filters,

        // Computed
        filteredSuppliers,
        stats,
        hasSuppliers,

        // Actions
        fetchSuppliers,
        fetchSupplier,
        createSupplier,
        updateSupplier,
        deleteSupplier,
        attachSupplierToProduct,
        detachSupplierFromProduct,
        setFilters,
        clearFilters,
        clearError,
        clearSelectedSupplier
    }
})
