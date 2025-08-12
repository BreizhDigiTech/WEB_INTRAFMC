import { useAuthStore } from '@/stores/auth'
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

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
            },

            // Gestion des commandes
            {
                path: '/orders',
                name: 'Orders',
                component: () => import('@/modules/orders/views/SimpleOrdersView.vue'),
                meta: {
                    title: 'Commandes - WEB IntraFMC'
                }
            },
            {
                path: '/orders/:id',
                name: 'OrderDetail',
                component: () => import('@/modules/orders/views/OrderDetailView.vue'),
                meta: {
                    title: 'Détail commande - WEB IntraFMC'
                }
            },

            // Gestion des arrivages
            {
                path: '/arrivals',
                name: 'Arrivals',
                component: () => import('@/modules/arrivals/views/ArrivalsListView.vue'),
                meta: {
                    title: 'Arrivages - WEB IntraFMC'
                }
            },
            {
                path: '/arrivals/create',
                name: 'CreateArrival',
                component: () => import('@/modules/arrivals/views/CreateArrivalView.vue'),
                meta: {
                    title: 'Créer un arrivage - WEB IntraFMC'
                }
            },
            {
                path: '/arrivals/:id',
                name: 'ArrivalDetail',
                component: () => import('@/modules/arrivals/views/ArrivalDetailView.vue'),
                meta: {
                    title: 'Détail arrivage - WEB IntraFMC'
                }
            },

            // Gestion des produits
            {
                path: '/products',
                name: 'Products',
                component: () => import('@/modules/products/views/ProductsView.vue'),
                meta: {
                    title: 'Produits - WEB IntraFMC'
                }
            },

            // Gestion des catégories
            {
                path: '/categories',
                name: 'Categories',
                component: () => import('@/modules/categories/views/CategoriesView.vue'),
                meta: {
                    title: 'Catégories - WEB IntraFMC'
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
