// Index du module produits

export { default as ProductsView } from './views/ProductsView.vue'
export { default as ProductCard } from './components/ProductCard.vue'
export { default as ProductListItem } from './components/ProductListItem.vue'
export { default as ProductTable } from './components/ProductTable.vue'
export { default as CreateProductModal } from './components/CreateProductModal.vue'
export { default as EditProductModal } from './components/EditProductModal.vue'

export { useProductStore } from './stores/productStore'
export { productService } from './services/productService'

export * from './types'
export * from './constants'
export * from './utils/formatters'
