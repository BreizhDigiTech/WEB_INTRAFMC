// Types globaux pour l'application WEB_INTRAFMC

// ==================== SCALAIRES GRAPHQL ====================
export type DateTime = string // Format: Y-m-d H:i:s (ex: 2024-08-28 14:30:00)
export type Date = string     // Format: Y-m-d (ex: 2024-08-28)
export type Upload = File     // Fichier multipart/form-data
export type JSON = any       // Données JSON arbitraires

// ==================== AUTHENTIFICATION ====================
export interface User {
    id: string
    name: string
    email: string
    phone?: string
    address?: string
    birth_date?: Date
    avatar?: string
    avatar_original_name?: string
    avatar_size?: number
    is_admin: boolean
    is_active: boolean
    email_verified_at?: DateTime
    created_at?: DateTime
    updated_at?: DateTime
}

export interface UserProfile {
    id: string
    name: string
    email: string
    phone?: string
    address?: string
    birth_date?: string
    avatar?: string
    created_at: DateTime
    updated_at: DateTime
    email_verified_at?: DateTime
    last_login?: DateTime
    orders_count: number
    total_spent: number
    preferences: UserPreferences
}

// Type pour créer un UserProfile depuis un User
export type CreateUserProfile = Omit<UserProfile, 'created_at' | 'updated_at'> & {
    created_at?: DateTime
    updated_at?: DateTime
}

export interface UserPreferences {
    theme: string
    language: string
    notifications: boolean
}

export interface TokenValidation {
    valid: boolean
    expires_at?: DateTime
    user?: TokenUser
}

export interface TokenUser {
    id: string
    name: string
    email: string
    is_admin: boolean
}

export interface LoginCredentials {
    email: string
    password: string
    remember?: boolean
}

export interface AuthPayload {
    access_token: string
    token_type: string
    expires_in?: number
    user: User
}

export interface LogoutResponse {
    message: string
}

// Alias pour compatibilité
export interface AuthResponse extends AuthPayload {}

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

// ==================== RÉPONSES GRAPHQL ====================
export interface DeleteResponse {
    success?: boolean
    message?: string
}

export interface SuccessResponse {
    success: boolean
    message: string
}

export interface FileUploadResponse {
    success: boolean
    message: string
    url?: string
    path?: string
}

export interface ChangePasswordResponse {
    success?: boolean
    message?: string
}

export interface StatisticsResponse {
    success: boolean
    message?: string
    data?: JSON
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

// ==================== ENUMS GRAPHQL ====================
export enum TrendDirection {
    UP = 'UP',
    DOWN = 'DOWN',
    STABLE = 'STABLE'
}

export enum TimeGrouping {
    DAY = 'DAY',
    WEEK = 'WEEK',
    MONTH = 'MONTH',
    QUARTER = 'QUARTER',
    YEAR = 'YEAR'
}

export enum TrendGrouping {
    DAY = 'DAY',
    WEEK = 'WEEK',
    MONTH = 'MONTH',
    QUARTER = 'QUARTER',
    YEAR = 'YEAR'
}

export enum PopularityPeriod {
    WEEK = 'WEEK',
    MONTH = 'MONTH',
    QUARTER = 'QUARTER',
    YEAR = 'YEAR'
}

export enum SuggestionType {
    ALL = 'ALL',
    FREQUENTLY_BOUGHT_TOGETHER = 'FREQUENTLY_BOUGHT_TOGETHER',
    SIMILAR_PRODUCTS = 'SIMILAR_PRODUCTS',
    RECOMMENDATIONS = 'RECOMMENDATIONS',
    RECENTLY_VIEWED = 'RECENTLY_VIEWED'
}

// ==================== FILTRES D'ENTRÉE ====================
export interface UserFilterInput {
    is_active?: boolean
    is_admin?: boolean
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
