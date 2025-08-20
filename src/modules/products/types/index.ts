// Types pour le module produits - Alignés avec API GraphQL

export interface Product {
    id: string  // L'API renvoie des ID en string dans GraphQL
    name: string
    description?: string
    price: number
    image_urls?: string[]
    stock: number
    analysis_file?: string
    analysis_file_url?: string
    category_id?: number
    created_at?: string
    updated_at?: string

    // Relations de l'API
    categories?: ProductCategory[]

    // Champs facultatifs utilisés par les vues (UI-only)
    sku?: string
    barcode?: string
    weight?: number
    dimensions?: string
    low_stock_threshold?: number
    tags?: string[]
    is_active?: boolean
    supplier?: { name: string }
    category?: { id: string; name: string }
    image_url?: string
}

export interface ProductCategory {
    id: string
    name: string
    description?: string
    created_at?: string
}

// Types pour la pagination automatique de l'API
export interface PaginatorInfo {
    currentPage: number
    hasMorePages: boolean
    total: number
    perPage: number
    lastPage: number
}

export interface ProductsResponse {
    data: Product[]
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

export interface CreateProductInput {
    name: string
    description?: string
    price: number
    image_urls?: string[]
    stock: number
    analysis_file_url?: string
    category_id?: number

    // Champs optionnels côté formulaire
    sku?: string
    barcode?: string
    weight?: number
    dimensions?: string
    low_stock_threshold?: number
    tags?: string[]
    is_active?: boolean
    image_url?: string
}

export interface UpdateProductInput {
    name?: string
    description?: string
    price?: number
    image_urls?: string[]
    stock?: number
    analysis_file_url?: string | null
    category_id?: number
}

export interface DeleteResponse {
    success: boolean
    message: string
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
