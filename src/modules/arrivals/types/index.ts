// Types pour le module de gestion des arrivages (basé sur les schémas GraphQL backend)

export interface Arrival {
    id: string
    amount: number           // Montant total de l'arrivage
    status: string          // Statut de l'arrivage
    created_at?: string
    updated_at?: string
    products?: ArrivalProduct[]
}

export interface ArrivalProduct {
    id: string
    arrival_id: string
    product_id: string
    quantity: number         // Quantité du produit dans l'arrivage
    unit_price: number       // Prix unitaire
    product?: ProductCBD     // Référence au produit (optionnel si chargé)
}

export interface ProductCBD {
    id: string
    name: string
    stock?: number          // Stock actuel du produit
    // Autres propriétés du produit selon le schéma backend
}

export type ArrivalStatus =
    | 'pending'     // En attente de validation
    | 'validated'   // Validé

// Interface pour la pagination (basée sur l'API fournie)
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
    status?: string[]
    date_from?: string
    date_to?: string
    min_amount?: number
    max_amount?: number
}

// Interfaces pour créer un arrivage (basées sur CreateArrivalInput)
export interface CreateArrivalInput {
    amount: number
    status: string
    products: CreateArrivalProductInput[]
}

export interface CreateArrivalProductInput {
    product_id: string
    quantity: number
    unit_price: number
}

// Interfaces pour mettre à jour un arrivage (basées sur UpdateArrivalInput)
export interface UpdateArrivalInput {
    amount?: number
    status?: string
    products?: UpdateArrivalProductInput[]
}

export interface UpdateArrivalProductInput {
    product_id?: string
    quantity?: number
    unit_price?: number
}
