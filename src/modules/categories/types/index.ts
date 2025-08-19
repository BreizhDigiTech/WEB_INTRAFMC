export interface Category {
    id: string;
    name: string;
    description?: string;
}

export interface CreateCategoryInput {
    name: string;
    description?: string;
}

export interface UpdateCategoryInput {
    name?: string;
    description?: string;
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
