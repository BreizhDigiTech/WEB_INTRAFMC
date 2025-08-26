// Module E-commerce - Point d'entrée principal
// Ce module fournit une interface de commerce électronique pour les utilisateurs non-admin

// Types
export * from './types'

// Services
export { CartService } from './services/cartService'
export { ProductService } from './services/productService'

// Stores
export { useCartStore } from './stores/cartStore'
export { useProductStore } from './stores/productStore'

// Composables
export { useCart } from './composables/useCart'
export { useIntelligenceRecommendations } from './composables/useIntelligenceRecommendations'
export { useProductIntelligence } from './composables/useProductIntelligence'
export { useProducts } from './composables/useProducts'

// Views
export { default as CartView } from './views/CartView.vue'
export { default as ProductCatalogView } from './views/ProductCatalogView.vue'
export { default as ProductDetailView } from './views/ProductDetailView.vue'

// Components (à créer)
// export { default as ProductCard } from './components/ProductCard.vue'
// export { default as ProductFilters } from './components/ProductFilters.vue'
// export { default as CartItem } from './components/CartItem.vue'
// export { default as CartSummary } from './components/CartSummary.vue'

// Views supplémentaires (à créer)
// export { default as CheckoutView } from './views/CheckoutView.vue'
