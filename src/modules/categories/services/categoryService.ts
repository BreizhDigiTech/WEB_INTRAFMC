import { graphqlService } from '../../../shared/services/graphql'
import type {
    CategoriesPaginatedResponse,
    Category,
    CategoryErrorType,
    CategoryOperationResult,
    CategoryResult,
    CategoryStats,
    CreateCategoryInput,
    UpdateCategoryInput
} from '../types'

// Classe d'exception personnalisée pour les catégories
export class CategoryServiceError extends Error {
    constructor(
        public code: string,
        message: string,
        public field?: string,
        public statusCode?: number,
        public originalError?: any
    ) {
        super(message)
        this.name = 'CategoryServiceError'
    }
}

// Fonction utilitaire pour valider les données d'entrée
function validateCategoryInput(input: CreateCategoryInput | UpdateCategoryInput, isUpdate = false): CategoryErrorType | null {
    if (!isUpdate && !input.name) {
        return {
            code: 'VALIDATION_ERROR',
            message: 'Le nom de la catégorie est obligatoire',
            field: 'name'
        }
    }
    
    if (input.name && input.name.trim().length === 0) {
        return {
            code: 'VALIDATION_ERROR',
            message: 'Le nom de la catégorie ne peut pas être vide',
            field: 'name'
        }
    }
    
    if (input.name && input.name.length > 100) {
        return {
            code: 'VALIDATION_ERROR',
            message: 'Le nom de la catégorie ne peut pas dépasser 100 caractères',
            field: 'name'
        }
    }
    
    if (input.description && input.description.length > 500) {
        return {
            code: 'VALIDATION_ERROR',
            message: 'La description ne peut pas dépasser 500 caractères',
            field: 'description'
        }
    }
    
    return null
}

// Fonction pour parser les erreurs GraphQL
function parseGraphQLError(error: any): CategoryErrorType {
    const message = error.message || 'Une erreur inattendue s\'est produite'
    
    // Vérifier si c'est une erreur de nom dupliqué
    if (message.includes('duplicate') || message.includes('already exists') || message.includes('UNIQUE constraint failed')) {
        return {
            code: 'DUPLICATE_NAME',
            message: 'Une catégorie avec ce nom existe déjà',
            existingCategoryId: ''
        }
    }
    
    // Vérifier si c'est une erreur de validation
    if (message.includes('validation') || error.extensions?.validation) {
        return {
            code: 'VALIDATION_ERROR',
            message: 'Données invalides',
            field: error.extensions?.validation?.field || 'unknown'
        }
    }
    
    // Vérifier si c'est une erreur de ressource non trouvée
    if (message.includes('not found') || message.includes('does not exist')) {
        return {
            code: 'NOT_FOUND',
            message: 'Catégorie non trouvée',
            categoryId: ''
        }
    }
    
    // Erreur serveur générique
    return {
        code: 'SERVER_ERROR',
        message,
        statusCode: error.extensions?.status || 500
    }
}

export const categoryService = {
    async getCategories(first: number = 20, page: number = 1): Promise<CategoryResult<CategoriesPaginatedResponse>> {
        try {
            const query = `
                query Categories($first: Int, $page: Int) {
                    categories(first: $first, page: $page) {
                        data {
                            id
                            name
                            description
                        }
                        paginatorInfo {
                            currentPage
                            lastPage
                            total
                            perPage
                            hasMorePages
                        }
                    }
                }
            `
            const variables = { first, page }
            const response = await graphqlService.request(query, variables)
            return {
                success: true,
                data: response.categories
            }
        } catch (error) {
            return {
                success: false,
                error: parseGraphQLError(error)
            }
        }
    },

    // Récupère toutes les catégories pour le filtrage côté client
    async getAllCategories(): Promise<CategoryResult<Category[]>> {
        try {
            const allCategories: Category[] = []
            let page = 1
            let hasMore = true
            const perPage = 100 // Limite API

            while (hasMore) {
                const query = `
                    query AllCategories($first: Int, $page: Int) {
                        categories(first: $first, page: $page) {
                            data {
                                id
                                name
                                description
                            }
                            paginatorInfo {
                                hasMorePages
                            }
                        }
                    }
                `
                const response = await graphqlService.request(query, { first: perPage, page })
                allCategories.push(...response.categories.data)
                hasMore = response.categories.paginatorInfo.hasMorePages
                page++
            }

            return {
                success: true,
                data: allCategories
            }
        } catch (error) {
            return {
                success: false,
                error: parseGraphQLError(error)
            }
        }
    },

    async getCategoryStats(): Promise<CategoryResult<CategoryStats>> {
        try {
            // Essayer d'abord l'API dédiée
            const query = `
                query CategoryStats {
                    categoryStats {
                        total
                        withDescription
                        withoutDescription
                    }
                }
            `
            const response = await graphqlService.request(query)
            return {
                success: true,
                data: response.categoryStats
            }
        } catch (error) {
            // Fallback: calculer les stats côté client
            const allCategoriesResult = await this.getAllCategories()
            if (!allCategoriesResult.success || !allCategoriesResult.data) {
                return {
                    success: false,
                    error: allCategoriesResult.error || parseGraphQLError(error)
                }
            }
            
            const allCategories = allCategoriesResult.data
            const withDescription = allCategories.filter(c => c.description && c.description.trim().length > 0).length
            return {
                success: true,
                data: {
                    total: allCategories.length,
                    withDescription,
                    withoutDescription: allCategories.length - withDescription
                }
            }
        }
    },

    async getCategory(id: string): Promise<CategoryResult<Category>> {
        try {
            if (!id || id.trim().length === 0) {
                return {
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'L\'ID de la catégorie est obligatoire',
                        field: 'id'
                    }
                }
            }

            const query = `
                query GetCategory($id: ID!) {
                    category(id: $id) {
                        id
                        name
                        description
                    }
                }
            `
            const response = await graphqlService.request(query, { id })
            return {
                success: true,
                data: response.category
            }
        } catch (error) {
            return {
                success: false,
                error: parseGraphQLError(error)
            }
        }
    },

    async createCategory(input: CreateCategoryInput): Promise<CategoryResult<Category>> {
        try {
            // Validation côté client
            const validationError = validateCategoryInput(input)
            if (validationError) {
                return {
                    success: false,
                    error: validationError
                }
            }

            // Vérifier si une catégorie avec le même nom existe déjà
            const existingCheck = await this.checkCategoryNameExists(input.name)
            if (existingCheck.exists) {
                return {
                    success: false,
                    error: {
                        code: 'DUPLICATE_NAME',
                        message: 'Une catégorie avec ce nom existe déjà',
                        existingCategoryId: existingCheck.categoryId || ''
                    }
                }
            }

            const mutation = `
                mutation CreateCategory($input: CreateCategoryInput!) {
                    createCategory(input: $input) {
                        id
                        name
                        description
                    }
                }
            `
            const response = await graphqlService.request(mutation, { input })
            return {
                success: true,
                data: response.createCategory
            }
        } catch (error) {
            return {
                success: false,
                error: parseGraphQLError(error)
            }
        }
    },

    async updateCategory(id: string, input: UpdateCategoryInput): Promise<CategoryResult<Category>> {
        try {
            // Validation côté client
            if (!id || id.trim().length === 0) {
                return {
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'L\'ID de la catégorie est obligatoire',
                        field: 'id'
                    }
                }
            }

            const validationError = validateCategoryInput(input, true)
            if (validationError) {
                return {
                    success: false,
                    error: validationError
                }
            }

            // Si le nom est modifié, vérifier qu'il n'existe pas déjà
            if (input.name) {
                const existingCheck = await this.checkCategoryNameExists(input.name, id)
                if (existingCheck.exists) {
                    return {
                        success: false,
                        error: {
                            code: 'DUPLICATE_NAME',
                            message: 'Une catégorie avec ce nom existe déjà',
                            existingCategoryId: existingCheck.categoryId || ''
                        }
                    }
                }
            }

            const mutation = `
                mutation UpdateCategory($id: ID!, $input: UpdateCategoryInput!) {
                    updateCategory(id: $id, input: $input) {
                        id
                        name
                        description
                    }
                }
            `
            const response = await graphqlService.request(mutation, { id, input })
            return {
                success: true,
                data: response.updateCategory
            }
        } catch (error) {
            return {
                success: false,
                error: parseGraphQLError(error)
            }
        }
    },

    async deleteCategory(id: string): Promise<CategoryOperationResult> {
        try {
            if (!id || id.trim().length === 0) {
                return {
                    success: false,
                    message: 'L\'ID de la catégorie est obligatoire',
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'L\'ID de la catégorie est obligatoire',
                        field: 'id'
                    }
                }
            }

            const mutation = `
                mutation DeleteCategory($id: ID!) {
                    deleteCategory(id: $id) {
                        success
                        message
                    }
                }
            `
            const response = await graphqlService.request(mutation, { id })
            return {
                success: response.deleteCategory.success,
                message: response.deleteCategory.message || 'Catégorie supprimée avec succès'
            }
        } catch (error) {
            const parsedError = parseGraphQLError(error)
            return {
                success: false,
                message: parsedError.message,
                error: parsedError
            }
        }
    },

    // Méthode utilitaire pour vérifier si un nom de catégorie existe déjà
    async checkCategoryNameExists(name: string, excludeId?: string): Promise<{ exists: boolean; categoryId?: string }> {
        try {
            const allCategoriesResult = await this.getAllCategories()
            if (!allCategoriesResult.success || !allCategoriesResult.data) {
                return { exists: false }
            }

            const existingCategory = allCategoriesResult.data.find(cat => 
                cat.name.toLowerCase().trim() === name.toLowerCase().trim() && 
                cat.id !== excludeId
            )

            return {
                exists: !!existingCategory,
                categoryId: existingCategory?.id
            }
        } catch (error) {
            console.error('Erreur lors de la vérification du nom:', error)
            return { exists: false }
        }
    }
}
