import { computed } from 'vue'
import { ProductService } from '../services/productService'
import { useProductStore } from '../stores/productStore'
import type { Product, ProductFilters } from '../types'

/**
 * Composable pour les fonctionnalités avancées de produits
 * Utilise les nouvelles APIs backend pour les recommandations et analyses
 */
export function useProductIntelligence() {
  const productStore = useProductStore()
  const productService = new ProductService()

  // État réactif
  const products = computed(() => productStore.products)
  const categories = computed(() => productStore.categories)
  const loading = computed(() => productStore.loading)
  const error = computed(() => productStore.error)
  const suggestions = computed(() => productStore.suggestions)

  /**
   * Récupère les suggestions d'autocomplétion pour la recherche
   */
  const getProductSuggestions = async (query: string): Promise<string[]> => {
    try {
      const suggestions = await productService.getProductSuggestions(query)
      return suggestions
    } catch (error) {
      console.error('Erreur lors de la récupération des suggestions:', error)
      return []
    }
  }

  /**
   * Récupère les catégories avec compteurs de produits
   */
  const getCategoriesWithCounts = async (): Promise<any[]> => {
    try {
      const categoriesWithCounts = await productService.getCategoriesWithCounts()
      return categoriesWithCounts
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories enrichies:', error)
      return []
    }
  }

  /**
   * Récupère les produits populaires par catégorie
   */
  const getPopularProductsByCategory = async (
    categoryId: string, 
    limit = 5, 
    period = 'MONTH'
  ): Promise<Product[]> => {
    try {
      const popularProducts = await productService.getPopularProductsByCategory(categoryId, limit, period)
      return popularProducts
    } catch (error) {
      console.error('Erreur lors de la récupération des produits populaires:', error)
      return []
    }
  }

  /**
   * Recherche avancée avec tous les filtres
   */
  const searchProductsAdvanced = async (
    filters: ProductFilters,
    page = 1,
    first = 12
  ) => {
    return await productService.searchProducts(filters, page, first)
  }

  /**
   * Recherche rapide par nom
   */
  const quickSearchProducts = async (name: string, limit = 10): Promise<Product[]> => {
    try {
      const results = await productService.searchProductsByName(name, limit)
      return results
    } catch (error) {
      console.error('Erreur lors de la recherche rapide:', error)
      return []
    }
  }

  /**
   * Vérifie la disponibilité d'un produit en temps réel
   */
  const checkProductAvailability = async (
    productId: string, 
    quantity: number
  ): Promise<{ available: boolean; maxQuantity: number }> => {
    try {
      const availability = await productService.checkProductAvailability(productId, quantity)
      return availability
    } catch (error) {
      console.error('Erreur lors de la vérification de disponibilité:', error)
      return { available: false, maxQuantity: 0 }
    }
  }

  /**
   * Formatage du prix
   */
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price)
  }

  /**
   * Formate le stock avec indicateur de niveau
   */
  const formatStock = (stock: number): { text: string; color: string; level: string } => {
    if (stock === 0) {
      return { text: 'Rupture de stock', color: 'text-red-500', level: 'out' }
    } else if (stock < 10) {
      return { text: `${stock} en stock`, color: 'text-orange-500', level: 'low' }
    } else if (stock < 50) {
      return { text: `${stock} disponibles`, color: 'text-yellow-500', level: 'medium' }
    } else {
      return { text: `${stock} en stock`, color: 'text-green-500', level: 'high' }
    }
  }

  /**
   * Filtre les produits par disponibilité
   */
  const getAvailableProducts = (): Product[] => {
    return products.value.filter(product => product.stock > 0)
  }

  /**
   * Récupère les produits recommandés (basé sur les plus vendus)
   */
  const getRecommendedProducts = (categoryId?: string, limit = 8): Product[] => {
    let filteredProducts = products.value

    if (categoryId) {
      filteredProducts = products.value.filter(product => 
        product.categories.some(cat => cat.id === categoryId)
      )
    }

    // Simule une recommandation basée sur le prix et le stock
    return filteredProducts
      .filter(product => product.stock > 0)
      .sort((a, b) => {
        // Privilégier les produits avec un bon rapport qualité/prix et stock
        const scoreA = (a.stock > 10 ? 1 : 0.5) * (a.price < 100 ? 1.2 : 1)
        const scoreB = (b.stock > 10 ? 1 : 0.5) * (b.price < 100 ? 1.2 : 1)
        return scoreB - scoreA
      })
      .slice(0, limit)
  }

  /**
   * Analyse de performance d'un produit
   */
  const getProductPerformanceScore = (product: Product): { score: number; badge: string; color: string } => {
    let score = 50 // Score de base

    // Facteurs positifs
    if (product.stock > 20) score += 20
    else if (product.stock > 10) score += 10
    
    if (product.price < 50) score += 15 // Produits abordables
    else if (product.price < 100) score += 10

    if (product.categories.length > 1) score += 10 // Multi-catégories

    // Facteurs négatifs
    if (product.stock === 0) score -= 30
    else if (product.stock < 5) score -= 15

    if (product.price > 200) score -= 10 // Produits chers

    // Normaliser le score entre 0 et 100
    score = Math.max(0, Math.min(100, score))

    let badge = 'Correct'
    let color = 'text-yellow-500'

    if (score >= 80) {
      badge = 'Excellent'
      color = 'text-green-500'
    } else if (score >= 60) {
      badge = 'Bon'
      color = 'text-blue-500'
    } else if (score >= 40) {
      badge = 'Moyen'
      color = 'text-orange-500'
    } else {
      badge = 'Faible'
      color = 'text-red-500'
    }

    return { score, badge, color }
  }

  return {
    // État
    products,
    categories,
    loading,
    error,
    suggestions,

    // Actions principales
    getProductSuggestions,
    getCategoriesWithCounts,
    getPopularProductsByCategory,
    searchProductsAdvanced,
    quickSearchProducts,
    checkProductAvailability,

    // Utilitaires
    formatPrice,
    formatStock,
    getAvailableProducts,
    getRecommendedProducts,
    getProductPerformanceScore
  }
}
