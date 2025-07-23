// Types globaux de l'application

export interface BaseEntity {
    id: number
    createdAt: Date
    updatedAt: Date
}

export interface ApiResponse<T> {
    data: T
    success: boolean
    message?: string
    errors?: string[]
}

export interface PaginationParams {
    page: number
    limit: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
    data: T[]
    pagination: {
        total: number
        page: number
        limit: number
        totalPages: number
    }
}

export type Status = 'active' | 'inactive' | 'pending'

export interface User {
    id: number
    name: string
    email: string
    role: string
    avatar?: string
}

// Types pour la navigation
export interface NavigationItem {
    label: string
    path: string
    icon?: string
    children?: NavigationItem[]
}

// Types pour les modules
export interface ModuleConfig {
    name: string
    version: string
    description: string
    routes: any[]
    dependencies?: string[]
}
