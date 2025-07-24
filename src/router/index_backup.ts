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
        // Redirection selon le rôle utilisateur
        const redirectPath = authStore.isAdmin ? '/dashboard' : '/boutique'
        next(redirectPath)
        return
    }

    next()
}

const requireCustomer = (to: any, from: any, next: any) => {
    const authStore = useAuthStore()

    if (!authStore.isAuthenticated) {
        next('/login')
        return
    }

    // Si c'est un admin qui essaie d'accéder à la boutique, on le redirige vers le dashboard
    if (authStore.isAdmin) {
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
        next('/boutique') // Redirection vers la boutique pour les non-admin
        return
    }

    next()
}

const routes: RouteRecordRaw[] = [
    // Redirection racine selon le rôle
    {
        path: '/',
        redirect: (to) => {
            const authStore = useAuthStore()
            if (authStore.isAuthenticated) {
                return authStore.isAdmin ? '/dashboard' : '/boutique'
            }
            return '/login'
        }
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

    // Page boutique (utilisateurs non-admin)
    {
        path: '/boutique',
        name: 'Boutique',
        component: () => import('@/views/BoutiqueView.vue'),
        beforeEnter: requireCustomer,
        meta: {
            title: 'Boutique FMC'
        }
    },

    // Layout principal avec authentification
    {
        path: '/',
        component: () => import('@/components/AppLayout.vue'),
        beforeEnter: requireAdmin, // Seuls les admins peuvent accéder aux fonctionnalités de gestion
        children: [
            // Dashboard
            {
                path: '/dashboard',
                name: 'Dashboard',
                component: () => import('@/modules/dashboard/views/DashboardView.vue'),
                meta: {
                    title: 'Dashboard - WEB IntraFMC'
                }
            },

            // Module CBD
            {
                path: '/cbd',
                name: 'CBD',
                component: () => import('@/modules/cbd/views/CBDHomeView.vue'),
                meta: {
                    title: 'CBD - WEB IntraFMC'
                }
            },
            {
                path: '/cbd/products',
                name: 'CBDProducts',
                component: () => import('@/modules/cbd/views/ProductsView.vue'),
                meta: {
                    title: 'Produits CBD - WEB IntraFMC'
                }
            },
            {
                path: '/cbd/orders',
                name: 'CBDOrders',
                component: () => import('@/modules/cbd/views/OrdersView.vue'),
                meta: {
                    title: 'Commandes CBD - WEB IntraFMC'
                }
            },
            {
                path: '/cbd/arrivals',
                name: 'CBDArrivals',
                component: () => import('@/modules/cbd/views/ArrivalsView.vue'),
                meta: {
                    title: 'Arrivages CBD - WEB IntraFMC'
                }
            }
        ]
    },

    // Profil utilisateur (accessible à tous les utilisateurs connectés)
    {
        path: '/profile',
        name: 'Profile',
        component: () => import('@/views/ProfileView.vue'),
        beforeEnter: requireAuth,
        meta: {
            title: 'Mon profil - WEB IntraFMC'
        }
    },

            // Administration (Admin seulement)
            {
                path: '/admin',
                name: 'Admin',
                component: () => import('@/views/AdminView.vue'),
                beforeEnter: (to, from, next) => {
                    const authStore = useAuthStore()
                    if (!authStore.isAuthenticated) {
                        next('/login')
                        return
                    }
                    if (!authStore.isAdmin) {
                        next('/boutique') // Redirection vers la boutique pour les non-admin
                        return
                    }
                    next()
                },
                meta: {
                    title: 'Administration - WEB IntraFMC'
                }
            }
        ]
    },

    // Profil utilisateur (accessible à tous les utilisateurs connectés)
    {
        path: '/profile',
        name: 'Profile',
        component: () => import('@/views/ProfileView.vue'),
        beforeEnter: requireAuth,
        meta: {
            title: 'Mon profil - WEB IntraFMC'
        }
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