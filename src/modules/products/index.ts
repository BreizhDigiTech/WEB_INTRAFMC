/**
 * Module Products - Gestion des produits
 */

// Types
export * from './types'

// Constants
export * from './constants'

// Services
export { productService } from './services/productService'

// Stores
export { useProductStore } from './stores/productStore'

// Utils
export * from './utils/formatters'

// Components
export { default as CreateProductModal } from './components/CreateProductModal.vue'
export { default as EditProductModal } from './components/EditProductModal.vue'
export { default as ProductCard } from './components/ProductCard.vue'
export { default as ProductListItem } from './components/ProductListItem.vue'
export { default as ProductTable } from './components/ProductTable.vue'

// Views
export { default as ProductsView } from './views/ProductsView.vue'
