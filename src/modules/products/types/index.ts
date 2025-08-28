// Types pour le module produits - Alignés avec API GraphQL

import type { DateTime, JSON } from '@/shared/types'

// ==================== TYPES PRODUITS ====================
export interface ProductCBD {
    id: string
    name: string
    description?: string
    price: number
    stock: number
    images: string[]
    image_urls?: string[] // Alias pour compatibilité
    analysis_file?: string
    analysis_file_url?: string // Alias pour compatibilité
    analysis_image?: string
    categories: Category[]
    category?: Category // Pour un seul élément
    category_id?: string
    suppliers: Supplier[]
    supplier?: Supplier // Pour un seul élément
    sku?: string
    barcode?: string
    weight?: number
    dimensions?: string
    tags?: string[]
    is_active?: boolean
    low_stock_threshold?: number
    created_at?: DateTime
    updated_at?: DateTime
}

// Alias pour compatibilité
export type Product = ProductCBD

export interface ProductInsights {
    productId?: string
    productName?: string
    currentPrice?: number
    currentStock?: number
    baseMetrics?: ProductBaseMetrics
    timelinePerformance?: ProductTimelinePerformance
    competitiveAnalysis?: ProductCompetitiveAnalysis
    predictions?: ProductPredictions
    recommendations?: ProductRecommendation[]
    lastUpdated?: DateTime
}

export interface ProductBaseMetrics {
    totalSales: number
    totalRevenue: number
    averageRating?: number
    conversionRate?: number
    returnRate?: number
    viewCount?: number
    wishlistCount?: number
}

export interface ProductTimelinePerformance {
    salesTrend?: JSON
    revenueTrend?: JSON
    stockMovements?: JSON
    priceHistory?: JSON
    seasonalPatterns?: JSON
}

export interface ProductCompetitiveAnalysis {
    // À définir selon les besoins métier
}

export interface ProductPredictions {
    // À définir selon les besoins métier
}

export interface ProductRecommendation {
    type: string
    priority: string
    description: string
    estimatedImpact?: number
    actionItems?: string[]
}

export interface ProductSuggestion {
    id: string
    name: string
    price: number
    images: string[]
    reason: string
    confidence: number
}

// ==================== TYPES CATÉGORIES ====================
export interface Category {
    id: string
    name: string
    description?: string
    created_at?: string
    products?: ProductCBD[]
}

export interface CategoryWithCounts {
    id: string
    name: string
    slug: string
    description?: string
    productCount: number
    parentId?: string
    level: number
    children: CategoryWithCounts[]
    isActive: boolean
    displayOrder: number
    imageUrl?: string
}

export interface CategoryList {
    id: string
    name: string
    slug?: string
    description?: string
    products_count: number
}

export interface PopularProduct {
    id: string
    name: string
    price: number
    stock: number
    orderCount: number
    revenue: number
}

export interface CategoryTrend {
    categoryId: string
    categoryName: string
    period: string
    salesGrowth: number
    revenueGrowth: number
    productCount: number
    topProducts: ProductCBD[]
}

// ==================== TYPES FOURNISSEURS ====================
export interface Supplier {
    id: string
    name: string
    email?: string
    phone?: string
    address?: string
    website?: string
    contact_person?: string
    description?: string
    products?: ProductCBD[]
}

export interface ProductCategory extends Category {}

// ==================== TYPES D'ENTRÉE (INPUT) ====================
export interface CreateProductCBDInput {
    name: string
    description?: string
    price: number
    stock?: number
    category_id?: string
    category_ids?: string[]
    images?: File[]
    image_urls?: string[]
    analysis_file?: File
    analysis_file_url?: string // Pour compatibility
    sku?: string
    barcode?: string
    weight?: number
    dimensions?: string
    tags?: string[]
    is_active?: boolean
    low_stock_threshold?: number
}

export interface UpdateProductCBDInput {
    name?: string
    description?: string
    price?: number
    stock?: number
    category_id?: string | null
    category_ids?: string[]
    images?: File[]
    image_urls?: string[]
    analysis_file?: File
    analysis_file_url?: string | null
    sku?: string
    barcode?: string
    weight?: number
    dimensions?: string
    tags?: string[]
    is_active?: boolean
    low_stock_threshold?: number
}

// Alias pour compatibilité
export type CreateProductInput = CreateProductCBDInput
export type UpdateProductInput = UpdateProductCBDInput

export interface CreateCategoryInput {
    name: string
    description?: string
}

export interface UpdateCategoryInput {
    name?: string
    description?: string
}

export interface UpdateSupplierInput {
    name?: string
    email?: string
    phone?: string
    address?: string
    website?: string
    contact_person?: string
    description?: string
}

// ==================== LEGACY ALIASES ====================
// Les types sont maintenant définis plus haut comme alias

// Types pour la pagination automatique de l'API
export interface PaginatorInfo {
    currentPage: number
    hasMorePages: boolean
    total: number
    perPage: number
    lastPage: number
}

export interface ProductsResponse {
    data: ProductCBD[]
    paginatorInfo: PaginatorInfo
}

export interface ProductFilters {
    search?: string
    category_id?: string
    supplier_id?: string
    min_price?: number
    max_price?: number
    min_stock?: number
    max_stock?: number
    is_active?: boolean
    low_stock?: boolean
    tags?: string[]
    sort_by?: 'name' | 'price' | 'stock' | 'created_at' | 'updated_at'
    sort_direction?: 'asc' | 'desc'
}

export interface DeleteResponse {
    success?: boolean
    message?: string
}

export interface ProductStats {
    total: number
    totalValue: number
    avgPrice: number
    lowStock: number
    outOfStock: number
    byCategory: Array<{
        category: string
        count: number
        value: number
    }>
}

export type ProductViewMode = 'grid' | 'list' | 'table'
export type ProductStatus = 'active' | 'inactive' | 'low_stock' | 'out_of_stock'
