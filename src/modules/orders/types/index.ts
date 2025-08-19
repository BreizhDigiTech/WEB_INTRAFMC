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
    formatted_status?: string
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

export interface OrderStats {
    order_id: string
    total_items: number
    product_count: number
    total_amount: number
    average_item_price: number
    created_at: string
    status: string
}

export interface UpdateOrderStatusInput {
    id: string
    status: OrderStatus
}

export type OrderStatus =
    | 'pending'     // En attente
    | 'processing'  // En cours de traitement
    | 'shipped'     // Expédiée
    | 'delivered'   // Livrée
    | 'cancelled'   // Annulée
    | 'refunded'    // Remboursée

export interface OrderFilters {
    status?: OrderStatus[]
    date_from?: string
    date_to?: string
    user_search?: string
    min_amount?: number
    max_amount?: number
}

export interface UpdateOrderData {
    status?: OrderStatus
    total?: number
}
