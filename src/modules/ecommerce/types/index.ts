// Types pour le module e-commerce basés sur l'API GraphQL

export interface Product {
  id: string
  name: string
  description?: string
  price: number
  stock: number
  image_urls: string[]  // URLs publiques pour l'affichage
  images?: string[]     // Chemins internes (backend)
  image_metadata?: any  // Métadonnées JSON
  analysis_file_url?: string
  categories: Category[]
}

export interface Category {
  id: string
  name: string
  description?: string
}

export interface CartItem {
  id: string
  quantity: number
  product: Product
}

export interface Cart {
  id: string
  items: CartItem[]
  created_at: string
  updated_at: string
}

export interface CartSummary {
  itemCount: number
  totalAmount: number
  items: CartItem[]
}

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
