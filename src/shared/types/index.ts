// Types globaux pour l'application WEB_INTRAFMC

// ==================== AUTHENTIFICATION ====================
export interface User {
    id: string
    name: string
    email: string
    avatar?: string
    is_admin: boolean
    is_active: boolean
    email_verified_at?: string
    created_at: string
    updated_at: string
}

export interface LoginCredentials {
    email: string
    password: string
    remember?: boolean
}

export interface AuthResponse {
    access_token: string
    token_type: string
    expires_in: number
    user: User
}

export interface AuthState {
    user: User | null
    token: string | null
    isAuthenticated: boolean
    isLoading: boolean
    error: string | null
}

// ==================== DASHBOARD ====================
export interface DashboardStats {
    totalUsers: number
    totalSessions: number
    activeUsers: number
    systemStatus: 'operational' | 'maintenance' | 'error'
}

// ==================== NAVIGATION ====================
export interface NavigationItem {
    id: string
    label: string
    icon: string
    path: string
    requiresAdmin?: boolean
    children?: NavigationItem[]
}

// ==================== API RESPONSES ====================
export interface PaginatedResponse<T> {
    data: T[]
    pagination: {
        total: number
        per_page: number
        current_page: number
        last_page: number
        from: number
        to: number
    }
}

export interface ApiError {
    message: string
    errors?: Record<string, string[]>
}

// ==================== MODALS ====================
export interface ModalState {
    isOpen: boolean
    title: string
    component: string | null
    props?: any
}

// ==================== NOTIFICATIONS ====================
export interface Notification {
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    message: string
    duration?: number
    actions?: NotificationAction[]
}

export interface NotificationAction {
    label: string
    action: () => void
    style?: 'primary' | 'secondary'
}

// ==================== BASE TYPES ====================
export interface BaseEntity {
    id: string
    created_at: string
    updated_at: string
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

export type Status = 'active' | 'inactive' | 'pending'

// ==================== MODULE TYPES ====================
export interface ModuleConfig {
    name: string
    version: string
    description: string
    routes: any[]
    dependencies?: string[]
}
