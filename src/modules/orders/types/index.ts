// Types pour le module de gestion des commandes

export interface Order {
    id: string
    user_id: string
    total: number
    status: OrderStatus
    created_at: string
    updated_at: string
    // Relations (si chargées par GraphQL)
    user?: OrderUser
    products?: OrderProduct[]
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

export interface OrderUser {
    id: string
    name: string
    email: string
}

export type OrderStatus =
    | 'pending'     // En attente
    | 'validated'   // Validée
    | 'cancelled'   // Annulée

// Maintenu pour compatibilité avec l'interface existante
export type PaymentStatus = 'pending'

export interface OrderFilters {
    status?: OrderStatus[]
    date_from?: string
    date_to?: string
    user_search?: string
    min_amount?: number
    max_amount?: number
}

export interface OrderStats {
    total_orders: number
    total_revenue: number
    orders_today: number
    orders_this_week: number
    orders_this_month: number
    pending_orders: number
    validated_orders: number
    cancelled_orders: number
    average_order_value: number
}

export interface CreateOrderData {
    user_id: string
    total: number
    status?: OrderStatus
    products?: {
        product_id: string
        quantity: number
        unit_price: number
    }[]
}

export interface UpdateOrderData {
    status?: OrderStatus
    total?: number
}

// Types pour l'interface utilisateur
export interface OrderTableColumn {
    key: keyof Order | 'actions'
    label: string
    sortable?: boolean
    width?: string
}

export interface OrderStatusBadge {
    status: OrderStatus
    label: string
    color: string
    bgColor: string
    icon: string
}
