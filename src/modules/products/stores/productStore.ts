import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { productService } from '../services/productService'
import type {
    CreateProductInput,
    PaginatorInfo,
    Product,
    UpdateProductInput
} from '../types'

export const useProductStore = defineStore('products', () => {
    // État
    const products = ref<Product[]>([])
    const currentProduct = ref<Product | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    // Pagination
    const paginatorInfo = ref<PaginatorInfo | null>(null)
    const currentPage = ref(1)
    const perPage = ref(10)

    // Computed
    const totalProducts = computed(() => paginatorInfo.value?.total || products.value.length)
    const inStockProducts = computed(() => products.value.filter(p => p.stock > 0))
    const outOfStockProducts = computed(() => products.value.filter(p => p.stock === 0))
    const hasMorePages = computed(() => paginatorInfo.value?.hasMorePages || false)

    // Actions
    async function fetchProducts(page: number = 1, first: number = 10, append: boolean = false) {
        loading.value = true
        error.value = null

        try {
            const response = await productService.getProducts(first, page)
            
            // Trier les produits par date de création (plus récent en premier)
            const sortedProducts = response.data.sort((a, b) => {
                const dateA = new Date(a.created_at || '').getTime()
                const dateB = new Date(b.created_at || '').getTime()
                return dateB - dateA // DESC (plus récent en premier)
            })

            if (append) {
                products.value.push(...sortedProducts)
            } else {
                products.value = sortedProducts
            }

            paginatorInfo.value = response.paginatorInfo
            currentPage.value = page
            perPage.value = first
        } catch (err: any) {
            error.value = err.message || 'Erreur lors du chargement des produits'
            console.error('Erreur fetchProducts:', err)
        } finally {
            loading.value = false
        }
    }

    async function loadMoreProducts() {
        if (hasMorePages.value && !loading.value) {
            await fetchProducts(currentPage.value + 1, perPage.value, true)
        }
    }

    async function searchProducts(searchQuery?: string, categoryId?: string, page: number = 1, first: number = 20, append: boolean = false) {
        loading.value = true
        error.value = null

        try {
            // Pour la recherche, récupérer TOUS les produits pour un filtrage côté client efficace
            const response = await productService.getAllProductsForSearch()
            
            let filteredData = response.data

            // Filtrage côté client par recherche (seulement dans le nom/titre)
            if (searchQuery && searchQuery.trim()) {
                const query = searchQuery.toLowerCase().trim()
                filteredData = filteredData.filter(product =>
                    product.name.toLowerCase().includes(query)
                )
            }

            // Filtrage côté client par catégorie
            if (categoryId) {
                filteredData = filteredData.filter(product =>
                    product.category_id?.toString() === categoryId
                )
            }
            
            // Trier les résultats par date de création (plus récent en premier)
            filteredData = filteredData.sort((a, b) => {
                const dateA = new Date(a.created_at || '').getTime()
                const dateB = new Date(b.created_at || '').getTime()
                return dateB - dateA // DESC (plus récent en premier)
            })

            if (append) {
                products.value.push(...filteredData)
            } else {
                products.value = filteredData
            }

            // Mettre à jour les infos de pagination en fonction des résultats filtrés
            paginatorInfo.value = {
                ...response.paginatorInfo,
                total: filteredData.length,
                hasMorePages: false // Pas de pagination avec le filtrage côté client
            }
            currentPage.value = page
            perPage.value = first
        } catch (err: any) {
            error.value = err.message || 'Erreur lors de la recherche de produits'
            console.error('Erreur searchProducts:', err)
        } finally {
            loading.value = false
        }
    }

    async function loadMoreSearchResults(searchQuery?: string, categoryId?: string) {
        // Avec le filtrage côté client, il n'y a pas de "plus de résultats" à charger
        // Tous les résultats sont déjà affichés après la recherche initiale
        return
    }

    async function fetchProductById(id: string) {
        loading.value = true
        error.value = null

        try {
            const product = await productService.getProductById(id)
            currentProduct.value = product
            return product
        } catch (err: any) {
            error.value = err.message || 'Erreur lors du chargement du produit'
            console.error('Erreur fetchProductById:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    async function createProduct(input: CreateProductInput) {
        loading.value = true
        error.value = null

        try {
            const newProduct = await productService.createProduct(input)
            products.value.unshift(newProduct)

            // Mettre à jour le total si on a les infos de pagination
            if (paginatorInfo.value) {
                paginatorInfo.value.total += 1
            }

            return newProduct
        } catch (err: any) {
            error.value = err.message || 'Erreur lors de la création du produit'
            console.error('Erreur createProduct:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    async function updateProduct(id: string, input: UpdateProductInput) {
        loading.value = true
        error.value = null

        try {
            const updatedProduct = await productService.updateProduct(id, input)

            const index = products.value.findIndex(p => p.id === id)
            if (index !== -1) {
                products.value[index] = updatedProduct
            }

            if (currentProduct.value?.id === id) {
                currentProduct.value = updatedProduct
            }

            return updatedProduct
        } catch (err: any) {
            error.value = err.message || 'Erreur lors de la mise à jour du produit'
            console.error('Erreur updateProduct:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    async function deleteProduct(id: string) {
        loading.value = true
        error.value = null

        try {
            await productService.deleteProduct(id)

            products.value = products.value.filter(p => p.id !== id)

            // Mettre à jour le total si on a les infos de pagination
            if (paginatorInfo.value) {
                paginatorInfo.value.total = Math.max(0, paginatorInfo.value.total - 1)
            }

            if (currentProduct.value?.id === id) {
                currentProduct.value = null
            }
        } catch (err: any) {
            error.value = err.message || 'Erreur lors de la suppression du produit'
            console.error('Erreur deleteProduct:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    function clearError() {
        error.value = null
    }

    function clearCurrentProduct() {
        currentProduct.value = null
    }

    function resetPagination() {
        currentPage.value = 1
        paginatorInfo.value = null
        products.value = []
    }

    return {
        // State
        products,
        currentProduct,
        loading,
        error,
        paginatorInfo,
        currentPage,
        perPage,

        // Computed
        totalProducts,
        inStockProducts,
        outOfStockProducts,
        hasMorePages,

        // Actions
        fetchProducts,
        loadMoreProducts,
        searchProducts,
        loadMoreSearchResults,
        fetchProductById,
        createProduct,
        updateProduct,
        deleteProduct,
        clearError,
        clearCurrentProduct,
        resetPagination
    }
})
