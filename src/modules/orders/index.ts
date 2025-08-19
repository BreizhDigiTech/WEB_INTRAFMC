// Export principal du module orders
export * from './constants'
export { checkoutService } from './services/checkoutService'
export { orderService } from './services/orderService'
export { useOrderStore } from './stores/orderStore'
export * from './types'
export * from './utils/formatters'

// Composants
export { default as InvoicePreviewModal } from './components/InvoicePreviewModal.vue'

// Vues
export { default as OrderDetailView } from './views/OrderDetailView.vue'
export { default as SimpleOrdersView } from './views/SimpleOrdersView.vue'

