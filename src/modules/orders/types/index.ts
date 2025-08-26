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
    // Nouveaux champs
    notes?: string
    payment_method?: PaymentMethod
    shipping_address?: ShippingAddress
    billing_address?: BillingAddress
    discount_amount?: number
    tax_amount?: number
    shipping_cost?: number
}

export interface OrderProduct {
    id: string
    name: string
    price: number
    description?: string
    image_url?: string
    category?: ProductCategory
    pivot: {
        quantity: number
        unit_price: number
        discount_amount?: number
        tax_rate?: number
    }
}

export interface OrderUser {
    id: string
    name: string
    email: string
    phone?: string
    company?: string
}

export interface OrderStats {
    order_id: string
    total_items: number
    product_count: number
    total_amount: number
    average_item_price: number
    created_at: string
    status: string
    // Statistiques étendues
    discount_percentage?: number
    tax_percentage?: number
    profit_margin?: number
}

export interface UpdateOrderStatusInput {
    id: string
    status: OrderStatus
    notes?: string
    notify_user?: boolean
}

export type OrderStatus =
    | 'pending'     // En attente
    | 'validated'   // Validée
    | 'cancelled'   // Annulée

export interface OrderFilters {
    status?: OrderStatus[]
    date_from?: string
    date_to?: string
    user_search?: string
    min_amount?: number
    max_amount?: number
    payment_method?: PaymentMethod[]
    has_discount?: boolean
    product_search?: string
}

export interface UpdateOrderData {
    status?: OrderStatus
    total?: number
    notes?: string
    payment_method?: PaymentMethod
}

// Nouveaux types ajoutés
export type PaymentMethod = 
    | 'credit_card'
    | 'debit_card' 
    | 'bank_transfer'
    | 'cash'
    | 'check'
    | 'paypal'
    | 'stripe'

export interface ShippingAddress {
    street: string
    city: string
    postal_code: string
    country: string
    state?: string
    additional_info?: string
}

export interface BillingAddress extends ShippingAddress {
    company_name?: string
    tax_number?: string
}

export interface ProductCategory {
    id: string
    name: string
    slug: string
}

// Types pour les actions en lot
export interface BulkOrderAction {
    order_ids: string[]
    action: 'validate' | 'cancel' | 'export'
    options?: Record<string, any>
}

export interface BulkActionResult {
    success: string[]
    failed: Array<{ id: string; error: string }>
    total_processed: number
}

// Types pour l'export et reporting
export interface OrderExportOptions {
    format: 'csv' | 'excel' | 'pdf'
    date_range?: { from: string; to: string }
    include_products?: boolean
    include_users?: boolean
    filters?: OrderFilters
}

export interface OrderAnalytics {
    period: 'day' | 'week' | 'month' | 'year'
    total_orders: number
    total_revenue: number
    average_order_value: number
    top_products: Array<{ product_id: string; name: string; quantity_sold: number }>
    customer_retention_rate?: number
    conversion_rate?: number
}
