// Export principal du module categories
export { categoryService } from './services/categoryService'
export { useCategoryStore } from './stores/categoryStore'
export * from './types'

// Composants
export { default as CategoryTable } from './components/CategoryTable.vue'
export { default as CreateCategoryModal } from './components/CreateCategoryModal.vue'
export { default as EditCategoryModal } from './components/EditCategoryModal.vue'

// Vues
export { default as CategoriesView } from './views/CategoriesView.vue'

