import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { ProductService } from '../services/productService'
import type { Category, PaginatedProducts, Product, ProductFilters } from '../types'

export const useProductStore = defineStore('products', () => {
  // State
  const products = ref<Product[]>([])
  const categories = ref<Category[]>([])
  const currentProduct = ref<Product | null>(null)
  const searchResults = ref<Product[]>([])
  const suggestions = ref<string[]>([])
  const pagination = ref({
    currentPage: 1,
    lastPage: 1,
    total: 0,
    perPage: 12
  })
  const filters = ref<ProductFilters>({})
  const loading = ref({
    products: false,
    categories: false,
    currentProduct: false,
    search: false,
    suggestions: false
  })
  const error = ref({
    products: null as string | null,
    categories: null as string | null,
    currentProduct: null as string | null,
    search: null as string | null,
    suggestions: null as string | null
  })

  // Services
  const productService = new ProductService()

  // Getters
  const availableProducts = computed(() => 
    products.value.filter((product: Product) => product.stock > 0)
  )
  
  const productsByCategory = computed(() => {
    return (categoryId: string) => 
      products.value.filter((product: Product) => 
        product.categories.some((cat: Category) => cat.id === categoryId)
      )
  })

  const hasNextPage = computed(() => pagination.value.currentPage < pagination.value.lastPage)
  const hasPrevPage = computed(() => pagination.value.currentPage > 1)

  // Actions
  async function fetchProducts(page = 1, newFilters?: ProductFilters) {
    loading.value.products = true
    error.value.products = null

    try {
      if (newFilters) {
        filters.value = { ...filters.value, ...newFilters }
      }

      // Utiliser la nouvelle API de recherche si des filtres sont appliqués
      const hasFilters = filters.value.search || 
                        filters.value.categoryId || 
                        filters.value.minPrice !== undefined || 
                        filters.value.maxPrice !== undefined || 
                        filters.value.inStock

      if (hasFilters) {
        // Utiliser la recherche avancée
        const response = await productService.searchProducts(
          filters.value,
          page,
          pagination.value.perPage
        )

        products.value = response.data
        pagination.value = response.pagination
      } else {
        // Utiliser l'API classique sans filtres
        const response: PaginatedProducts = await productService.getProducts(
          page,
          pagination.value.perPage,
          {}
        )

        products.value = response.data
        pagination.value = response.pagination
      }
    } catch (err) {
      error.value.products = err instanceof Error ? err.message : 'Erreur lors du chargement des produits'
      console.error('Erreur fetchProducts:', err)
    } finally {
      loading.value.products = false
    }
  }

  async function fetchCategories() {
    loading.value.categories = true
    error.value.categories = null

    try {
      console.log('ProductStore: fetchCategories called')
      categories.value = await productService.getCategories()
      console.log('ProductStore: categories fetched:', categories.value)
    } catch (err) {
      error.value.categories = err instanceof Error ? err.message : 'Erreur lors du chargement des catégories'
      console.error('Erreur fetchCategories:', err)
    } finally {
      loading.value.categories = false
    }
  }

  async function fetchProduct(id: string) {
    loading.value.currentProduct = true
    error.value.currentProduct = null

    try {
      currentProduct.value = await productService.getProduct(id)
    } catch (err) {
      error.value.currentProduct = err instanceof Error ? err.message : 'Erreur lors du chargement du produit'
      console.error('Erreur fetchProduct:', err)
    } finally {
      loading.value.currentProduct = false
    }
  }

  async function searchProducts(searchTerm: string) {
    await fetchProducts(1, { search: searchTerm })
  }

  async function quickSearchByName(name: string, limit = 10) {
    loading.value.search = true
    error.value.search = null

    try {
      const results = await productService.searchProductsByName(name, limit)
      searchResults.value = results
      return results
    } catch (err) {
      error.value.search = err instanceof Error ? err.message : 'Erreur lors de la recherche'
      console.error('Erreur quickSearchByName:', err)
      return []
    } finally {
      loading.value.search = false
    }
  }

  async function getSearchSuggestions(query: string) {
    if (query.length < 2) {
      suggestions.value = []
      return []
    }

    loading.value.suggestions = true
    error.value.suggestions = null

    try {
      const results = await productService.getProductSuggestions(query)
      suggestions.value = results
      return results
    } catch (err) {
      error.value.suggestions = err instanceof Error ? err.message : 'Erreur lors du chargement des suggestions'
      console.error('Erreur getSearchSuggestions:', err)
      suggestions.value = []
      return []
    } finally {
      loading.value.suggestions = false
    }
  }

  async function advancedSearch(searchFilters: {
    query?: string,
    categoryId?: string,
    minPrice?: number,
    maxPrice?: number,
    inStock?: boolean
  }) {
    loading.value.search = true
    error.value.search = null

    try {
      const results = await productService.searchProducts({
        ...searchFilters,
        limit: 50 // Limite plus élevée pour la recherche avancée
      })
      searchResults.value = results.data || []
      return results.data || []
    } catch (err) {
      error.value.search = err instanceof Error ? err.message : 'Erreur lors de la recherche avancée'
      console.error('Erreur advancedSearch:', err)
      return []
    } finally {
      loading.value.search = false
    }
  }

  function clearSearchResults() {
    searchResults.value = []
    suggestions.value = []
    error.value.search = null
    error.value.suggestions = null
  }

  async function filterByCategory(categoryId: string) {
    await fetchProducts(1, { categoryId })
  }

  async function filterByPrice(minPrice?: number, maxPrice?: number) {
    await fetchProducts(1, { minPrice, maxPrice })
  }

  async function loadMoreProducts() {
    if (hasNextPage.value && !loading.value.products) {
      const nextPage = pagination.value.currentPage + 1
      loading.value.products = true

      try {
        const response: PaginatedProducts = await productService.getProducts(
          nextPage,
          pagination.value.perPage,
          filters.value
        )

        // Ajouter les nouveaux produits à la liste existante
        products.value.push(...response.data)
        pagination.value.currentPage = nextPage
      } catch (err) {
        error.value.products = err instanceof Error ? err.message : 'Erreur lors du chargement'
        console.error('Erreur loadMoreProducts:', err)
      } finally {
        loading.value.products = false
      }
    }
  }

  function clearFilters() {
    filters.value = {}
    fetchProducts(1)
  }

  function clearErrors() {
    error.value.products = null
    error.value.categories = null
    error.value.currentProduct = null
  }

  return {
    // State
    products,
    categories,
    currentProduct,
    searchResults,
    suggestions,
    pagination,
    filters,
    loading,
    error,
    
    // Getters
    availableProducts,
    productsByCategory,
    hasNextPage,
    hasPrevPage,
    
    // Actions
    fetchProducts,
    fetchCategories,
    fetchProduct,
    searchProducts,
    quickSearchByName,
    getSearchSuggestions,
    advancedSearch,
    clearSearchResults,
    filterByCategory,
    filterByPrice,
    loadMoreProducts,
    clearFilters,
    clearErrors
  }
})
