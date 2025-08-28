/**
 * Module Users - Gestion des utilisateurs (Admin)
 */

// Types
export type * from './types'

// Services
export { UserService } from './services/userService'

// Composables
export { useUsers } from './composables/useUsers'

// Components
export { default as ConfirmDeleteModal } from './components/ConfirmDeleteModal.vue'
export { default as UserModal } from './components/UserModal.vue'

// Views
export { default as UsersListView } from './views/UsersListView.vue'
