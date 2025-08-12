// Types pour le module de gestion des arrivages (basé sur les schémas GraphQL backend)

// Type principal CbdArrival selon la spécification
export interface CbdArrival {
    id: string
    amount: number           // Montant total de l'arrivage
    status: 'pending' | 'validated'  // Statut de l'arrivage
    created_at: string
    updated_at: string
    products: ArrivalProductCbd[]
}

// Alias pour compatibilité
export interface Arrival extends CbdArrival {}

// Type ArrivalProductCbd selon la spécification
export interface ArrivalProductCbd {
    id: string
    product_id: string
    quantity: number         // Quantité du produit dans l'arrivage
    unit_price: number      // Prix unitaire du produit dans l'arrivage
    product: {              // Référence au produit avec détails complets
        id: string
        name: string
        price: number
        stock: number
        // Autres propriétés du produit disponibles
        description?: string
        images?: string[]
        category?: {
            id: string
            name: string
        }
        suppliers?: {
            id: string
            name: string
        }[]
    }
}

// Alias pour compatibilité
export interface ArrivalProduct extends ArrivalProductCbd {}

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
    suppliers?: {
        id: string
        name: string
    }[]
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
    data: CbdArrival[]
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
