// Service GraphQL optimisé pour l'e-commerce
import { GraphQLService } from '@/shared/services/graphql'
import type { PaginatedResponse } from '@/shared/types'

export interface Category {
    id: string
    name: string
    slug: string
    description?: string
    products_count: number
}

export interface Product {
    id: string
    name: string
    price: number
    stock: number
    categories: Category[]
    description?: string
    image?: string
}

export interface ProductFilters {
    search?: string
    category?: string
    minPrice?: number
    maxPrice?: number
    inStock?: boolean
}

export class OptimizedEcommerceService extends GraphQLService {
    /**
     * 🛒 Liste simplifiée des catégories avec nombre de produits
     */
    async getCategoriesList(): Promise<Category[]> {
        const query = `
            query CategoriesList {
                categoriesList {
                    id
                    name
                    slug
                    description
                    products_count
                }
            }
        `
        
        try {
            const response = await this.request(query)
            return response.categoriesList
        } catch (error) {
            throw error
        }
    }

    /**
     * 🔍 Recherche produits avancée avec filtres côté serveur
     */
    async searchProducts(filters: ProductFilters = {}, page = 1, limit = 20): Promise<PaginatedResponse<Product>> {
        const query = `
            query ProductsSearch(
                $search: String
                $category: ID
                $minPrice: Float
                $maxPrice: Float
                $inStock: Boolean
                $first: Int
                $page: Int
            ) {
                productsSearch(
                    search: $search
                    category: $category
                    minPrice: $minPrice
                    maxPrice: $maxPrice
                    inStock: $inStock
                    first: $first
                    page: $page
                ) {
                    data {
                        id
                        name
                        price
                        stock
                        description
                        image
                        categories {
                            id
                            name
                            slug
                        }
                    }
                    paginatorInfo {
                        total
                        currentPage
                        lastPage
                        hasMorePages
                        perPage
                    }
                }
            }
        `
        
        try {
            const variables = {
                search: filters.search || null,
                category: filters.category || null,
                minPrice: filters.minPrice || null,
                maxPrice: filters.maxPrice || null,
                inStock: filters.inStock || null,
                first: limit,
                page: page
            }
            
            const response = await this.request(query, variables)
            const productsData = response.productsSearch
            
            return {
                data: productsData.data,
                pagination: {
                    total: productsData.paginatorInfo.total,
                    per_page: productsData.paginatorInfo.perPage,
                    current_page: productsData.paginatorInfo.currentPage,
                    last_page: productsData.paginatorInfo.lastPage,
                    from: ((productsData.paginatorInfo.currentPage - 1) * productsData.paginatorInfo.perPage) + 1,
                    to: Math.min(productsData.paginatorInfo.currentPage * productsData.paginatorInfo.perPage, productsData.paginatorInfo.total)
                }
            }
        } catch (error) {
            throw error
        }
    }

    /**
     * 📊 Page e-commerce complète (catégories + produits + stats)
     */
    async getEcommercePage(productFilters: ProductFilters = {}, productPage = 1, productLimit = 20): Promise<{
        categories: Category[]
        products: PaginatedResponse<Product>
        summary: {
            totalProducts: number
            totalCategories: number
            lowStockProducts: number
            outOfStockProducts: number
            totalValue: number
            averagePrice: number
        }
    }> {
        const query = `
            query EcommercePage(
                $search: String
                $category: ID
                $minPrice: Float
                $maxPrice: Float
                $inStock: Boolean
                $first: Int
                $page: Int
            ) {
                ecommerceSummary {
                    totalProducts
                    totalCategories
                    lowStockProducts
                    outOfStockProducts
                    totalValue
                    averagePrice
                }
                categoriesList {
                    id
                    name
                    slug
                    description
                    products_count
                }
                productsSearch(
                    search: $search
                    category: $category
                    minPrice: $minPrice
                    maxPrice: $maxPrice
                    inStock: $inStock
                    first: $first
                    page: $page
                ) {
                    data {
                        id
                        name
                        price
                        stock
                        description
                        image
                        categories {
                            id
                            name
                            slug
                        }
                    }
                    paginatorInfo {
                        total
                        currentPage
                        lastPage
                        hasMorePages
                        perPage
                    }
                }
            }
        `
        
        try {
            const variables = {
                search: productFilters.search || null,
                category: productFilters.category || null,
                minPrice: productFilters.minPrice || null,
                maxPrice: productFilters.maxPrice || null,
                inStock: productFilters.inStock || null,
                first: productLimit,
                page: productPage
            }
            
            const response = await this.request(query, variables)
            const productsData = response.productsSearch
            
            return {
                categories: response.categoriesList,
                products: {
                    data: productsData.data,
                    pagination: {
                        total: productsData.paginatorInfo.total,
                        per_page: productsData.paginatorInfo.perPage,
                        current_page: productsData.paginatorInfo.currentPage,
                        last_page: productsData.paginatorInfo.lastPage,
                        from: ((productsData.paginatorInfo.currentPage - 1) * productsData.paginatorInfo.perPage) + 1,
                        to: Math.min(productsData.paginatorInfo.currentPage * productsData.paginatorInfo.perPage, productsData.paginatorInfo.total)
                    }
                },
                summary: response.ecommerceSummary
            }
        } catch (error) {
            throw error
        }
    }
}

// Export d'une instance du service
export const optimizedEcommerceService = new OptimizedEcommerceService()
