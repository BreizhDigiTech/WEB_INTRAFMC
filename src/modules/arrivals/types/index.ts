// Types pour le module de gestion des arrivages (basé sur les schémas GraphQL backend)

// Type principal CbdArrival selon la spécification

export interface Arrival {
    id: string
    amount: number           // Montant total de l'arrivage
    status: 'pending' | 'validated'  // Statut de l'arrivage
    created_at: string
    updated_at: string
    products: ArrivalProduct[]
}

export interface ArrivalProduct {
    id: string
    product_id: string
    quantity: number         // Quantité du produit dans l'arrivage
    unit_price: number      // Prix unitaire du produit dans l'arrivage
    product: {
        id: string
        name: string
        price: number
        stock: number
        description?: string
        images?: string[]
        category?: {
            id: string
            name: string
        }
    }
}

export interface ProductDetail {
    id: string
    name: string
    description?: string
    price: number
    stock: number
    category?: {
        id: string
        name: string
    }
    // Suppression des suppliers selon consigne
}

// Interface pour compatibilité avec les autres modules
export interface ProductCBD {
    id: string
    name: string
    images?: string[]       // Images du produit (nouvelle API)
    stock?: number          // Stock actuel du produit
}

export type ArrivalStatus = 'pending' | 'validated'

// Interface pour la pagination Lighthouse
export interface PaginatorInfo {
    currentPage: number
    hasMorePages: boolean
    total: number
    perPage: number
}

export interface ArrivalsResponse {
    paginatorInfo: PaginatorInfo
    data: Arrival[]
}

// Interface pour les filtres
export interface ArrivalFilters {
    status?: ArrivalStatus[]
    date_from?: string
    date_to?: string
    min_amount?: number
    max_amount?: number
}

// Interfaces pour créer un arrivage (selon GraphQL mutations)
export interface CreateArrivalInput {
    amount: number           // Obligatoire selon l'API GraphQL
    status: ArrivalStatus    // Obligatoire selon l'API GraphQL
    products: CreateArrivalProductInput[]
}

export interface CreateArrivalProductInput {
    product_id: string
    quantity: number
    unit_price: number
}

// Interfaces pour mettre à jour un arrivage
export interface UpdateArrivalInput {
    amount?: number
    status?: ArrivalStatus
    products?: UpdateArrivalProductInput[]
}

export interface UpdateArrivalProductInput {
    product_id?: string
    quantity?: number
    unit_price?: number
}

// Variables pour les queries GraphQL
export interface ArrivalsQueryVariables {
    first?: number
    page?: number
    filters?: ArrivalFilters
}

export interface ArrivalDetailQueryVariables {
    id: string
}

export interface ValidateArrivalVariables {
    id: string
}

// Interfaces pour le modal de création (formulaire)
export interface CreateArrivalData {
    supplier_id: string
    reference: string
    expected_date: string
    notes?: string
    products: CreateArrivalProductData[]
}

export interface CreateArrivalProductData {
    product_id: string
    quantity: number
    unit_price: number
    product?: {
        id: string
        name: string
        price: number
        stock: number
    }
}
