import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Guards d'authentification
const requireAuth = async (to: any, from: any, next: any) => {
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

const requireGuest = (to: any, from: any, next: any) => {
    const authStore = useAuthStore()

    if (authStore.isAuthenticated) {
        // Redirection vers le dashboard pour tous les utilisateurs connectés
        next('/dashboard')
        return
    }

    next()
}



const requireAdmin = (to: any, from: any, next: any) => {
    const authStore = useAuthStore()

    if (!authStore.isAuthenticated) {
        next('/login')
        return
    }

    if (!authStore.isAdmin) {
        next('/dashboard') // Redirection vers dashboard pour les non-admin
        return
    }

    next()
}

const routes: RouteRecordRaw[] = [
    // Redirection racine vers dashboard
    {
        path: '/',
        redirect: '/dashboard'
    },

    // Page de connexion
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/LoginView.vue'),
        beforeEnter: requireGuest,
        meta: {
            title: 'Connexion - WEB IntraFMC'
        }
    },

    // Layout principal avec authentification
    {
        path: '/',
        component: () => import('@/components/AppLayout.vue'),
        beforeEnter: requireAuth,
        children: [
            // Dashboard
            {
                path: '/dashboard',
                name: 'Dashboard',
                component: () => import('@/modules/dashboard/views/DashboardView.vue'),
                meta: {
                    title: 'Dashboard - WEB IntraFMC'
                }
            }
        ]
    },

    // Route 404
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/views/NotFoundView.vue'),
        meta: {
            title: 'Page non trouvée - WEB IntraFMC'
        }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { top: 0 }
        }
    }
})

// Mise à jour du titre de la page
router.afterEach((to) => {
    document.title = to.meta?.title as string || 'WEB IntraFMC'
})

export default router
