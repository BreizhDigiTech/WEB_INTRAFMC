import { computed } from 'vue'
import { useProductStore } from '../stores/productStore'
import type { ProductFilters } from '../types'

/**
 * Composable pour la gestion des produits
 * Facilite l'utilisation du store produits dans les composants
 */
export function useProducts() {
  const productStore = useProductStore()

  // État réactif
  const products = computed(() => productStore.products)
  const categories = computed(() => productStore.categories)
  const currentProduct = computed(() => productStore.currentProduct)
  const searchResults = computed(() => productStore.searchResults)
  const suggestions = computed(() => productStore.suggestions)
  const pagination = computed(() => productStore.pagination)
  const filters = computed(() => productStore.filters)
  const loading = computed(() => productStore.loading)
  const error = computed(() => productStore.error)

  // Getters calculés
  const availableProducts = computed(() => productStore.availableProducts)
  const hasNextPage = computed(() => productStore.hasNextPage)
  const hasPrevPage = computed(() => productStore.hasPrevPage)

  // Actions
  const fetchProducts = async (page = 1, newFilters?: ProductFilters) => {
    await productStore.fetchProducts(page, newFilters)
  }

  const fetchCategories = async () => {
    await productStore.fetchCategories()
  }

  const fetchProduct = async (id: string) => {
    await productStore.fetchProduct(id)
  }

  const searchProducts = async (searchTerm: string) => {
    await productStore.searchProducts(searchTerm)
  }

  const quickSearchByName = async (name: string, limit = 10) => {
    return await productStore.quickSearchByName(name, limit)
  }

  const getSearchSuggestions = async (query: string) => {
    return await productStore.getSearchSuggestions(query)
  }

  const advancedSearch = async (searchFilters: {
    query?: string,
    categoryId?: string,
    minPrice?: number,
    maxPrice?: number,
    inStock?: boolean
  }) => {
    return await productStore.advancedSearch(searchFilters)
  }

  const clearSearchResults = () => {
    productStore.clearSearchResults()
  }

  const filterByCategory = async (categoryId: string) => {
    await productStore.filterByCategory(categoryId)
  }

  const filterByPrice = async (minPrice?: number, maxPrice?: number) => {
    await productStore.filterByPrice(minPrice, maxPrice)
  }

  const loadMoreProducts = async () => {
    await productStore.loadMoreProducts()
  }

  const clearFilters = () => {
    productStore.clearFilters()
  }

  const clearErrors = () => {
    productStore.clearErrors()
  }

  // Utilitaires
  const getProductsByCategory = (categoryId: string) => {
    return productStore.productsByCategory(categoryId)
  }

  const isProductInStock = (productId: string) => {
    const product = products.value.find(p => p.id === productId)
    return product ? product.stock > 0 : false
  }

  const getProductStock = (productId: string) => {
    const product = products.value.find(p => p.id === productId)
    return product?.stock || 0
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price)
  }

  return {
    // État
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
    clearErrors,
    
    // Utilitaires
    getProductsByCategory,
    isProductInStock,
    getProductStock,
    formatPrice
  }
}
