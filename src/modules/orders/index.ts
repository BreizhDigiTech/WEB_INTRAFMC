/**
 * Module Orders - Gestion des commandes
 */

// Types
export * from './types'

// Constants
export * from './constants'

// Services
export { checkoutService } from './services/checkoutService'
export { orderService } from './services/orderService'

// Stores
export { useOrderStore } from './stores/orderStore'

// Utils
export * from './utils/formatters'

// Components
export { default as InvoicePreviewModal } from './components/InvoicePreviewModal.vue'

// Views
export { default as AdvancedOrdersView } from './views/AdvancedOrdersView.vue'
export { default as OrderDetailView } from './views/OrderDetailView.vue'
export { default as SimpleOrdersView } from './views/SimpleOrdersView.vue'

