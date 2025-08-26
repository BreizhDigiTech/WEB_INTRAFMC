import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'

/**
 * Composable pour gérer les permissions utilisateur
 * Centralise la logique d'accès selon les rôles
 */
export function usePermissions() {
  const authStore = useAuthStore()

  // Permissions basées sur le rôle
  const isAdmin = computed(() => authStore.isAdmin)
  const isUser = computed(() => authStore.isAuthenticated && !authStore.isAdmin)
  const isAuthenticated = computed(() => authStore.isAuthenticated)

  // Permissions spécifiques aux modules
  const canAccessOrders = computed(() => isAuthenticated.value) // Accessible à tous
  const canAccessArrivals = computed(() => isAdmin.value)
  const canAccessProducts = computed(() => isAdmin.value)
  const canAccessCategories = computed(() => isAdmin.value)
  const canAccessEcommerce = computed(() => isUser.value)

  // Actions autorisées
  const canCreateOrder = computed(() => isAdmin.value) // Seuls les admins peuvent créer
  const canEditOrder = computed(() => isAdmin.value)   // Seuls les admins peuvent modifier
  const canDeleteOrder = computed(() => isAdmin.value) // Seuls les admins peuvent supprimer
  const canViewOrder = computed(() => isAuthenticated.value) // Tous peuvent voir
  
  const canCreateArrival = computed(() => isAdmin.value)
  const canEditArrival = computed(() => isAdmin.value)
  const canDeleteArrival = computed(() => isAdmin.value)
  
  const canCreateProduct = computed(() => isAdmin.value)
  const canEditProduct = computed(() => isAdmin.value)
  const canDeleteProduct = computed(() => isAdmin.value)
  
  const canCreateCategory = computed(() => isAdmin.value)
  const canEditCategory = computed(() => isAdmin.value)
  const canDeleteCategory = computed(() => isAdmin.value)

  const canAddToCart = computed(() => isUser.value)
  const canCheckout = computed(() => isUser.value)

  // Utilitaires pour les vues
  const getAccessibleRoutes = computed(() => {
    const routes = ['/dashboard', '/orders'] // Commandes accessibles à tous
    
    if (isAdmin.value) {
      routes.push('/arrivals', '/products', '/categories')
    }
    
    if (isUser.value) {
      routes.push('/ecommerce', '/ecommerce/cart')
    }
    
    return routes
  })

  const getDefaultRoute = computed(() => {
    return '/dashboard'
  })

  // Méthodes de vérification
  const hasPermission = (permission: string): boolean => {
    switch (permission) {
      case 'admin':
        return isAdmin.value
      case 'user':
        return isUser.value
      case 'orders:read':
        return isAuthenticated.value // Lecture accessible à tous
      case 'orders:create':
      case 'orders:update':
      case 'orders:delete':
        return isAdmin.value // Actions de modification réservées aux admins
      case 'arrivals:read':
      case 'arrivals:create':
      case 'arrivals:update':
      case 'arrivals:delete':
        return isAdmin.value
      case 'products:read':
      case 'products:create':
      case 'products:update':
      case 'products:delete':
        return isAdmin.value
      case 'categories:read':
      case 'categories:create':
      case 'categories:update':
      case 'categories:delete':
        return isAdmin.value
      case 'ecommerce:access':
      case 'cart:manage':
      case 'checkout:access':
        return isUser.value
      default:
        return false
    }
  }

  const canAccessRoute = (routePath: string): boolean => {
    // Routes publiques (pour tous les utilisateurs authentifiés)
    const publicRoutes = ['/dashboard', '/profile', '/settings', '/orders']
    if (publicRoutes.some(route => routePath.startsWith(route))) {
      return isAuthenticated.value
    }

    // Routes admin uniquement
    const adminRoutes = ['/arrivals', '/products', '/categories']
    if (adminRoutes.some(route => routePath.startsWith(route))) {
      return isAdmin.value
    }

    // Routes utilisateur non-admin uniquement
    const userRoutes = ['/ecommerce']
    if (userRoutes.some(route => routePath.startsWith(route))) {
      return isUser.value
    }

    return false
  }

  return {
    // États
    isAdmin,
    isUser,
    isAuthenticated,
    
    // Permissions modules
    canAccessOrders,
    canAccessArrivals,
    canAccessProducts,
    canAccessCategories,
    canAccessEcommerce,
    
    // Actions
    canCreateOrder,
    canEditOrder,
    canDeleteOrder,
    canViewOrder,
    canCreateArrival,
    canEditArrival,
    canDeleteArrival,
    canCreateProduct,
    canEditProduct,
    canDeleteProduct,
    canCreateCategory,
    canEditCategory,
    canDeleteCategory,
    canAddToCart,
    canCheckout,
    
    // Utilitaires
    getAccessibleRoutes,
    getDefaultRoute,
    hasPermission,
    canAccessRoute
  }
}
