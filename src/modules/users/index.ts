/**
 * Module de gestion des utilisateurs (Admin)
 * 
 * Ce module permet aux administrateurs de :
 * - Lister tous les utilisateurs
 * - Créer de nouveaux utilisateurs
 * - Modifier les utilisateurs existants
 * - Supprimer des utilisateurs
 * - Filtrer et rechercher dans la liste
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

// Routes du module
export const usersRoutes = [
  {
    path: '/admin/users',
    name: 'AdminUsers',
    component: () => import('./views/UsersListView.vue'),
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
      title: 'Gestion des Utilisateurs'
    }
  }
]
