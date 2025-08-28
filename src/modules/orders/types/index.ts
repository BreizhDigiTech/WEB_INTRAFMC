// Types pour le module de gestion des commandes

import type { ProductCBD as BaseProductCBD } from '@/modules/products/types'
import type { DateTime, User } from '@/shared/types'

// ==================== TYPES COMMANDES ====================
export interface Order {
    id: string
    user_id: string
    user: User
    total: number
    status: OrderStatus // pending, validated, shipped, delivered, cancelled
    created_at: DateTime // Requis car utilisé pour le formatage
    updated_at?: DateTime
    products: OrderProductItem[]
    formatted_status?: string // Pour l'affichage formaté
}

export interface OrderProductPivot {
    quantity: number
    unit_price: number
}

// Type spécialisé pour les produits dans les commandes
export interface OrderProductItem extends BaseProductCBD {
    pivot: OrderProductPivot
}

export interface OrderProduct {
    id: string
    name: string
    price: number
    stock: number
    images: string[]
    pivot: OrderProductPivot // Requis car utilisé partout
}

export interface OrderStats {
    order_id: string
    total_items: number
    product_count: number
    total_amount: number
    average_item_price: number
    created_at: DateTime
    status: string
    formatted_status: string
}

export interface OrderSummary {
    id: string
    total: number
    status: string
    user_name: string
    product_count: number
    total_items: number
    created_at: DateTime
}

// ==================== TYPES D'ENTRÉE (INPUT) ====================
export interface UpdateOrderStatusInput {
    id: string
    status: string
}

// ==================== ENUMS ET CONSTANTES ====================
export type OrderStatus =
    | 'pending'     // En attente
    | 'validated'   // Validée
    | 'shipped'     // Expédiée
    | 'delivered'   // Livrée
    | 'cancelled'   // Annulée

// ==================== LEGACY TYPES ====================
export interface OrderUser {
    id: string
    name: string
    email: string
    phone?: string
    company?: string
}

export interface ProductCategory {
    id: string
    name: string
    description?: string
}

export interface ProductCBD {
    id: string
    name: string
    description?: string
    price: number
    stock: number
    images: string[]
    analysis_file?: string
    analysis_image?: string
    categories?: ProductCategory[]
    suppliers?: any[]
    created_at?: DateTime
    updated_at?: DateTime
    pivot?: OrderProductPivot
}

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

// ==================== TYPES INTELLIGENCE ====================
export interface OrderIntelligence {
    id: string
    total_items: number
    product_count: number
    total_amount: number
    average_item_price: number
    created_at: DateTime
    status: string
    formatted_status: string
    priority_score?: number
    risk_level?: string
    customer_segment?: string
    predicted_completion?: DateTime
    fulfillment_complexity?: number
}
