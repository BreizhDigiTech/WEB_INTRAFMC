// Types pour le module arrivées

import type { ProductCBD } from '@/modules/products/types'
import type { DateTime } from '@/shared/types'

export interface CbdArrival {
    id: string
    reference: string
    supplier_id: string
    amount: number
    status: 'pending' | 'validated' | 'cancelled'
    expected_date?: string | DateTime
    notes?: string
    created_at: DateTime
    updated_at?: DateTime
    products: ArrivalProductCbd[]
}

export interface ArrivalProductCbd {
    id: string
    arrival_id: string
    product_id: string
    quantity: number
    unit_price: number
    total_price: number
    product: ProductCBD
}

export interface CreateArrivalInput {
    supplier_id: string
    reference?: string
    expected_date?: string
    amount?: number
    notes?: string
    status?: string
    products: CreateArrivalProductData[]
}

export interface CreateArrivalProductData {
    product_id: string
    quantity: number
    unit_price: number
    product?: ProductCBD // Pour afficher les infos du produit
}

export interface CreateArrivalData {
    supplier_id: string
    reference?: string
    expected_date?: string
    notes?: string
    products: CreateArrivalProductData[]
}

export interface UpdateArrivalInput {
    id: string
    supplier_id?: string
    reference?: string
    expected_date?: string
    amount?: number
    notes?: string
    status?: string
    products?: CreateArrivalProductData[]
}

export interface ArrivalFilters {
    supplier_id?: string
    status?: string | string[]
    start_date?: string
    end_date?: string
    date_from?: string
    date_to?: string
    search?: string
    min_amount?: number
    max_amount?: number
}

export interface ArrivalsQueryVariables {
    limit?: number
    offset?: number
    first?: number // Pour pagination GraphQL
    page?: number  // Pour pagination simple
    supplier_id?: string
    status?: string
    start_date?: string
    end_date?: string
    search?: string
}

export interface ArrivalDetailQueryVariables {
    id: string
}

export interface ValidateArrivalVariables {
    id: string
    validated_quantities?: {
        product_id: string
        quantity: number
    }[]
}

export interface ArrivalsResponse {
    data: CbdArrival[]
    pagination?: {
        current_page: number
        total_pages: number
        total_items: number
        per_page: number
    }
    paginatorInfo?: { // Alias pour GraphQL
        currentPage: number
        perPage: number
        total: number
        hasMorePages: boolean
    }
}

// Alias pour compatibilité
export type Arrival = CbdArrival
