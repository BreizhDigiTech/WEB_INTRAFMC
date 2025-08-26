import { usePermissions } from '@/shared/composables/usePermissions'
import { useAuthStore } from '@/stores/auth'
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

/**
 * Guards de route avancés avec gestion des permissions
 */

export const requireAuth = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const authStore = useAuthStore()

  if (!authStore.isAuthenticated) {
    // Vérification du token stocké
    const isAuthenticated = await authStore.checkAuth()

    if (!isAuthenticated) {
      next('/login')
      return
    }
  }

  next()
}

export const requireGuest = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const authStore = useAuthStore()

  if (authStore.isAuthenticated) {
    // Redirection vers le dashboard pour tous les utilisateurs connectés
    next('/dashboard')
    return
  }

  next()
}

export const requireAdmin = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const authStore = useAuthStore()

  if (!authStore.isAuthenticated) {
    next('/login')
    return
  }

  if (!authStore.isAdmin) {
    // Redirection avec message d'erreur
    next({
      path: '/dashboard',
      query: { error: 'access_denied', message: 'Accès réservé aux administrateurs' }
    })
    return
  }

  next()
}

export const requireNonAdmin = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const authStore = useAuthStore()

  if (!authStore.isAuthenticated) {
    next('/login')
    return
  }

  if (authStore.isAdmin) {
    // Redirection avec message d'information
    next({
      path: '/dashboard',
      query: { info: 'admin_redirect', message: 'Interface d\'administration disponible' }
    })
    return
  }

  next()
}

export const requirePermission = (permission: string) => {
  return (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => {
    const authStore = useAuthStore()
    const { hasPermission } = usePermissions()

    if (!authStore.isAuthenticated) {
      next('/login')
      return
    }

    if (!hasPermission(permission)) {
      next({
        path: '/dashboard',
        query: { 
          error: 'permission_denied', 
          message: `Permission requise: ${permission}` 
        }
      })
      return
    }

    next()
  }
}

export const requireRole = (role: 'admin' | 'user') => {
  return (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => {
    const authStore = useAuthStore()

    if (!authStore.isAuthenticated) {
      next('/login')
      return
    }

    const hasRole = role === 'admin' ? authStore.isAdmin : !authStore.isAdmin

    if (!hasRole) {
      next({
        path: '/dashboard',
        query: { 
          error: 'role_required', 
          message: `Rôle requis: ${role}` 
        }
      })
      return
    }

    next()
  }
}

/**
 * Guard intelligent qui détermine automatiquement les permissions
 * basées sur le chemin de la route
 */
export const smartPermissionGuard = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const authStore = useAuthStore()
  const { canAccessRoute } = usePermissions()

  if (!authStore.isAuthenticated) {
    next('/login')
    return
  }

  if (!canAccessRoute(to.path)) {
    const isAdmin = authStore.isAdmin
    const suggestion = isAdmin 
      ? 'Utilisez les modules d\'administration'
      : 'Accédez à la boutique pour parcourir les produits'

    next({
      path: '/dashboard',
      query: { 
        error: 'route_access_denied', 
        message: `Accès non autorisé à cette page. ${suggestion}` 
      }
    })
    return
  }

  next()
}
