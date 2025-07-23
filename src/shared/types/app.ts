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

// ==================== PRODUITS CBD ====================
export interface ProductCBD {
    id: string
    name: string
    description: string
    price: number
    images: string[]
    stock: number
    analysis_file?: string
    analysis_file_url?: string
    category_id?: number
    created_at: string
    updated_at: string
    category?: Category
    categories: Category[]
    suppliers: Supplier[]
}

export interface Category {
    id: string
    name: string
    description?: string
    created_at: string
    products: ProductCBD[]
}

export interface Supplier {
    id: string
    name: string
    email?: string
    phone?: string
    products: ProductCBD[]
}

// ==================== COMMANDES ====================
export interface Order {
    id: string
    user: User
    total: number
    status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
    products: OrderProduct[]
    created_at: string
    updated_at: string
}

export interface OrderProduct {
    id: string
    name: string
    price: number
    pivot: {
        quantity: number
        unit_price: number
    }
}

// ==================== PANIER ====================
export interface CartItem {
    id: string
    user_id: string
    product_id: string
    quantity: number
    user: User
    product: ProductCBD
    created_at: string
    updated_at: string
}

export interface CartState {
    items: CartItem[]
    total: number
    itemCount: number
    isOpen: boolean
    isLoading: boolean
}

export interface AddToCartInput {
    product_id: string
    quantity: number
}

// ==================== ARRIVAGES ====================
export interface Arrival {
    id: string
    amount: number
    status: 'pending' | 'received' | 'processed'
    products: ArrivalProduct[]
    created_at: string
    updated_at: string
}

export interface ArrivalProduct {
    id: string
    arrival_id: string
    product_id: string
    quantity: number
    unit_price: number
    product: ProductCBD
}

export interface CreateArrivalInput {
    amount: number
    status: string
    products: {
        product_id: string
        quantity: number
        unit_price: number
    }[]
}

// ==================== DASHBOARD ====================
export interface DashboardStats {
    totalProducts: number
    totalOrders: number
    totalRevenue: number
    lowStockProducts: number
    recentOrders: Order[]
    topProducts: ProductCBD[]
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

export interface ApiResponse<T> {
    data: T
    success: boolean
    message?: string
    errors?: string[]
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

// ==================== UTILITAIRES ====================
export type Status = 'active' | 'inactive' | 'pending'

export interface PaginationParams {
    page: number
    limit: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}
