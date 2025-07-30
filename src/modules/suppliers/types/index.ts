import type { Product } from '../../products/types'

export interface Supplier {
    id: string
    name: string
    contact_email: string
    phone?: string
    address?: string
    created_at?: string
    updated_at?: string
    products?: Product[]
}

export interface CreateSupplierInput {
    name: string
    contact_email: string
    phone?: string
    address?: string
}

export interface UpdateSupplierInput {
    name?: string
    contact_email?: string
    phone?: string
    address?: string
}

export interface SupplierDeleteResponse {
    success: boolean
    message: string
}

export interface SupplierFilters {
    search?: string
    has_products?: boolean
}

export interface SupplierStats {
    total: number
    active: number
    with_products: number
    without_products: number
}
