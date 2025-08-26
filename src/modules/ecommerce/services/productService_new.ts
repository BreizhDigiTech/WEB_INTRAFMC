import { GraphQLService } from '@/shared/services/graphql'
import type {
    Category,
    PaginatedProducts,
    Product,
    ProductFilters
} from '../types'

export class ProductService extends GraphQLService {
  /**
   * Récupère la liste des produits avec pagination et filtres (utilise l'API de recherche)
   */
  async getProducts(page = 1, first = 12, filters: ProductFilters = {}): Promise<PaginatedProducts> {
    // Si des filtres sont appliqués, utiliser l'API de recherche
    if (filters.search || filters.categoryId || filters.minPrice || filters.maxPrice || filters.inStock !== undefined) {
      return this.searchProducts(filters, page, first)
    }

    // Sinon, utiliser l'API standard
    const query = `
      query GetProducts($first: Int = 12, $page: Int = 1) {
        productsCBD(first: $first, page: $page) {
          paginatorInfo {
            currentPage
            lastPage
            total
            perPage
          }
          data {
            id
            name
            description
            price
            stock
            image_urls
            categories {
              id
              name
              description
            }
          }
        }
      }
    `

    const variables = { first, page }
    const response = await this.request(query, variables)
    
    return {
      data: response.productsCBD.data,
      pagination: response.productsCBD.paginatorInfo
    }
  }

  /**
   * Recherche avancée de produits avec tous les filtres
   */
  async searchProducts(filters: ProductFilters, page = 1, first = 12): Promise<PaginatedProducts> {
    const query = `
      query SearchProducts(
        $query: String,
        $first: Int = 20,
        $page: Int = 1,
        $categoryId: ID,
        $minPrice: Float,
        $maxPrice: Float,
        $inStock: Boolean
      ) {
        searchProducts(
          query: $query,
          first: $first,
          page: $page,
          category_id: $categoryId,
          min_price: $minPrice,
          max_price: $maxPrice,
          in_stock: $inStock
        ) {
          id
          name
          description
          price
          stock
          image_urls
          categories { 
            id 
            name 
          }
        }
      }
    `

    const variables = {
      query: filters.search,
      first,
      page,
      categoryId: filters.categoryId,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      inStock: filters.inStock
    }

    const response = await this.request(query, variables)
    
    // Note: L'API searchProducts ne retourne pas de pagination pour l'instant
    // On simule la pagination
    const products = response.searchProducts || []
    
    return {
      data: products,
      pagination: {
        currentPage: page,
        lastPage: Math.ceil(products.length / first),
        total: products.length,
        perPage: first
      }
    }
  }

  /**
   * Recherche rapide par nom avec limitation
   */
  async searchProductsByName(name: string, limit = 10): Promise<Product[]> {
    const query = `
      query SearchByName($name: String!, $limit: Int = 10) {
        searchProductsByName(name: $name, limit: $limit) {
          id
          name
          price
          stock
          image_urls
          categories { 
            id 
            name 
          }
        }
      }
    `

    const variables = { name, limit }
    const response = await this.request(query, variables)
    
    return response.searchProductsByName || []
  }

  /**
   * Autocomplétion pour suggestions de recherche
   */
  async getProductSuggestions(query: string): Promise<string[]> {
    const suggestionQuery = `
      query ProductSuggestions($query: String!) {
        productSuggestions(query: $query)
      }
    `

    const variables = { query }
    const response = await this.request(suggestionQuery, variables)
    
    return response.productSuggestions || []
  }

  /**
   * Récupère le détail d'un produit
   */
  async getProduct(id: string): Promise<Product> {
    const query = `
      query GetProduct($id: ID!) {
        productCBD(id: $id) {
          id
          name
          description
          price
          stock
          image_urls
          image_metadata
          analysis_file_url
          categories {
            id
            name
            description
          }
        }
      }
    `

    const variables = { id }
    const response = await this.request(query, variables)
    return response.productCBD
  }

  /**
   * Recherche avancée d'un ensemble spécifique de filtres (méthode legacy conservée)
   */
  async advancedSearch(filters: {
    query?: string,
    categoryId?: string,
    minPrice?: number,
    maxPrice?: number,
    inStock?: boolean,
    first?: number,
    page?: number
  } = {}): Promise<Product[]> {
    const result = await this.searchProducts({
      search: filters.query,
      categoryId: filters.categoryId,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      inStock: filters.inStock
    }, filters.page || 1, filters.first || 20)
    
    return result.data
  }

  /**
   * Recherche rapide par nom (alias pour compatibilité)
   */
  async quickSearchByName(name: string, limit = 10): Promise<Product[]> {
    return this.searchProductsByName(name, limit)
  }

  /**
   * Récupère toutes les catégories
   */
  async getCategories(): Promise<Category[]> {
    const query = `
      query GetCategories {
        categories {
          id
          name
          description
        }
      }
    `

    const response = await this.request(query)
    return response.categories
  }

  /**
   * Récupère les catégories enrichies avec compteurs
   */
  async getCategoriesWithCounts(): Promise<any[]> {
    const query = `
      query CategoriesWithCounts {
        categoriesWithCounts {
          id
          name
          slug
          description
          productCount
          parentId
          level
          children {
            id
            name
            productCount
            children {
              id
              name
              productCount
            }
          }
          isActive
          displayOrder
          imageUrl
        }
      }
    `

    const response = await this.request(query)
    return response.categoriesWithCounts
  }

  /**
   * Récupère les produits populaires par catégorie
   */
  async getPopularProductsByCategory(categoryId: string, limit = 5, period = 'MONTH'): Promise<Product[]> {
    const query = `
      query PopularProductsByCategory($categoryId: ID!, $limit: Int, $period: PopularityPeriod) {
        popularProductsByCategory(
          categoryId: $categoryId
          limit: $limit
          period: $period
        ) {
          id
          name
          price
          stock
          orderCount
          revenue
        }
      }
    `

    const variables = { categoryId, limit, period }
    const response = await this.request(query, variables)
    return response.popularProductsByCategory
  }

  /**
   * Récupère les produits d'une catégorie
   */
  async getProductsByCategory(categoryId: string, page = 1, first = 12): Promise<PaginatedProducts> {
    return this.getProducts(page, first, { categoryId })
  }

  /**
   * Récupère les produits en promotion ou recommandés
   */
  async getFeaturedProducts(limit = 8): Promise<Product[]> {
    const response = await this.getProducts(1, limit)
    return response.data
  }

  /**
   * Vérifie la disponibilité d'un produit
   */
  async checkProductAvailability(productId: string, quantity: number): Promise<{ available: boolean; maxQuantity: number }> {
    const product = await this.getProduct(productId)
    
    return {
      available: product.stock >= quantity,
      maxQuantity: product.stock
    }
  }
}
