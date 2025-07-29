// Export principal du module orders
export { orderService } from './services/orderService'
export { useOrderStore } from './stores/orderStore'
export * from './types'
export * from './utils/formatters'
export * from './constants'

// Composants
export { default as InvoicePreviewModal } from './components/InvoicePreviewModal.vue'

// Vues
export { default as SimpleOrdersView } from './views/SimpleOrdersView.vue'
export { default as OrderDetailView } from './views/OrderDetailView.vue'
