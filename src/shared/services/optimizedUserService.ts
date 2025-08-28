// Service GraphQL optimisé pour les utilisateurs
import { GraphQLService } from '@/shared/services/graphql'
import type { PaginatedResponse } from '@/shared/types'

export interface User {
    id: string
    name: string
    email: string
    is_admin: boolean
    is_active: boolean
    created_at: string
    phone?: string
    address?: string
    birth_date?: string
    avatar?: string
    updated_at?: string
    email_verified_at?: string
    last_login?: string
    orders_count?: number
    total_spent?: number
}

export interface UserFilters {
    search?: string
    role?: string
    status?: string
}

export interface UserProfile {
    id: string
    name: string
    email: string
    phone?: string
    address?: string
    birth_date?: string
    avatar?: string
    created_at: string
    updated_at: string
    email_verified_at?: string
    last_login?: string
    orders_count: number
    total_spent: number
    preferences?: {
        theme?: string
        language?: string
        notifications?: boolean
    }
}

export class OptimizedUserService extends GraphQLService {
    /**
     * 🚀 Recherche utilisateurs optimisée avec filtres côté serveur
     */
    async searchUsers(filters: UserFilters = {}, page = 1, limit = 20): Promise<PaginatedResponse<User>> {
        
        const query = `
            query UsersSearch($search: String, $role: String, $status: String, $first: Int, $page: Int) {
                usersSearch(search: $search, role: $role, status: $status, first: $first, page: $page) {
                    data {
                        id
                        name
                        email
                        is_admin
                        is_active
                        created_at
                        phone
                        address
                        orders_count
                        total_spent
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
                role: filters.role || null,
                status: filters.status || null,
                first: limit,
                page: page
            }
            
            const response = await this.request(query, variables)
            const usersData = response.usersSearch
            
            
            return {
                data: usersData.data,
                pagination: {
                    total: usersData.paginatorInfo.total,
                    per_page: usersData.paginatorInfo.perPage,
                    current_page: usersData.paginatorInfo.currentPage,
                    last_page: usersData.paginatorInfo.lastPage,
                    from: ((usersData.paginatorInfo.currentPage - 1) * usersData.paginatorInfo.perPage) + 1,
                    to: Math.min(usersData.paginatorInfo.currentPage * usersData.paginatorInfo.perPage, usersData.paginatorInfo.total)
                }
            }
        } catch (error) {
            throw error
        }
    }

    /**
     * 👤 Profil utilisateur complet
     */
    async getMyProfile(): Promise<UserProfile> {
        
        const query = `
            query MyProfileComplete {
                myProfileComplete {
                    id
                    name
                    email
                    phone
                    address
                    birth_date
                    avatar
                    created_at
                    updated_at
                    email_verified_at
                    last_login
                    orders_count
                    total_spent
                    preferences {
                        theme
                        language
                        notifications
                    }
                }
            }
        `
        
        try {
            const response = await this.request(query)
            return response.myProfileComplete
        } catch (error) {
            throw error
        }
    }

    /**
     * 🔐 Validation token JWT
     */
    async validateToken(): Promise<{
        valid: boolean
        expires_at?: string
        user?: {
            id: string
            name: string
            email: string
            is_admin: boolean
        }
    }> {
        
        const query = `
            query ValidateToken {
                validateToken {
                    valid
                    expires_at
                    user {
                        id
                        name
                        email
                        is_admin
                    }
                }
            }
        `
        
        try {
            const response = await this.request(query)
            return response.validateToken
        } catch (error) {
            return { valid: false }
        }
    }
}

// Export d'une instance du service
export const optimizedUserService = new OptimizedUserService()
