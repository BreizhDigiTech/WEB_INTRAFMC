// Types pour le module catégories - Alignés avec API GraphQL


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

// ==================== TYPES D'ENTRÉE (INPUT) ====================
export interface CreateCategoryInput {
    name: string
    description?: string
}

export interface UpdateCategoryInput {
    name?: string
    description?: string
}

// ==================== TYPES PRODUITS ====================
export interface ProductCBD {
    id: string
    name: string
    description?: string
    price: number
    stock: number
    images: string[]
    analysis_file?: string
    analysis_image?: string
    categories?: Category[]
    suppliers?: Supplier[]
    created_at?: string
    updated_at?: string
}

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

export interface CategoryFilters {
    search?: string;
    hasDescription?: boolean | null;
    sortBy?: 'name' | 'description' | 'created_at';
    sortOrder?: 'asc' | 'desc';
}

export interface CategoryPaginatorInfo {
    currentPage: number;
    lastPage: number;
    total: number;
    perPage: number;
    hasMorePages: boolean;
}

export interface CategoriesPaginatedResponse {
    data: Category[];
    paginatorInfo: CategoryPaginatorInfo;
}

export interface CategoryStats {
    total: number;
    withDescription: number;
    withoutDescription: number;
}

// Types d'erreurs pour les catégories
export interface CategoryError {
    code: string;
    message: string;
    field?: string;
}

export interface CategoryValidationError extends CategoryError {
    code: 'VALIDATION_ERROR';
    field: string;
}

export interface CategoryDuplicateError extends CategoryError {
    code: 'DUPLICATE_NAME';
    existingCategoryId: string;
}

export interface CategoryNotFoundError extends CategoryError {
    code: 'NOT_FOUND';
    categoryId: string;
}

export interface CategoryServerError extends CategoryError {
    code: 'SERVER_ERROR';
    statusCode?: number;
}

export type CategoryErrorType = CategoryValidationError | CategoryDuplicateError | CategoryNotFoundError | CategoryServerError;

// Résultats avec gestion d'erreurs
export interface CategoryResult<T> {
    success: boolean;
    data?: T;
    error?: CategoryErrorType;
}

export interface CategoryOperationResult {
    success: boolean;
    message: string;
    error?: CategoryErrorType;
}
