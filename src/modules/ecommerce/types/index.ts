// Types pour le module e-commerce basés sur l'API GraphQL

import type { DateTime } from '@/shared/types'

// ==================== TYPES PRODUITS ====================
export interface Product {
  id: string
  name: string
  description?: string
  price: number
  stock: number
  images: string[]
  image_urls?: string[] // Alias for GraphQL compatibility
  analysis_file?: string
  analysis_image?: string
  categories: Category[]
  suppliers?: Supplier[]
  created_at?: DateTime
  updated_at?: DateTime
}

export interface Category {
  id: string
  name: string
  description?: string
}

export interface Supplier {
  id: string
  name: string
  email?: string
  phone?: string
  address?: string
  website?: string
  contact_person?: string
  description?: string
  products?: Product[]
}

// ==================== TYPES PANIER ====================
export interface Cart {
  id: string
  user_id: string
  product_id: string
  quantity: number
  product: Product
  created_at?: DateTime
}

export interface CartSummary {
  totalItems: number
  totalPrice: number
  totalAmount?: number // Alias pour compatibility
  itemCount?: number // Alias pour compatibility
  estimatedShipping?: number
  totalWithShipping: number
  items: CartItem[]
}

export interface CartItem {
  id: string
  quantity: number
  subtotal: number
  product: Product
}

export interface ProductSuggestion {
  id: string
  name: string
  price: number
  images: string[]
  reason: string
  confidence: number
}

// ==================== TYPES D'ENTRÉE (INPUT) ====================
export interface AddToCartInput {
  product_id: string
  quantity: number
}

export interface UpdateCartItemInput {
  quantity: number
}

// Interface interne pour le frontend (avec l'ID)
export interface UpdateCartItemRequest {
  id: string
  quantity: number
}

// ==================== RÉPONSES ET PAGINATION ====================
export interface ProductFilters {
  search?: string
  categoryId?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  limit?: number
  page?: number
}

export interface ProductPagination {
  currentPage: number
  lastPage: number
  total: number
  perPage: number
}

export interface ApiResponse<T> {
  data: T
  errors?: Array<{ message: string }>
}

export interface PaginatedProducts {
  pagination: ProductPagination
  data: Product[]
}

// Types pour les actions du panier
export interface CartActionResponse {
  success: boolean
  message?: string
}

// Types pour le checkout
export interface CheckoutResponse {
  id: string
  total: number
  status: string
  created_at: string
}

// Interface pour les états de chargement
export interface LoadingStates {
  products: boolean
  categories: boolean
  cart: boolean
  addingToCart: boolean
  removingFromCart: boolean
  checkout: boolean
}

// Interface pour les erreurs
export interface ErrorStates {
  products: string | null
  categories: string | null
  cart: string | null
  checkout: string | null
}
