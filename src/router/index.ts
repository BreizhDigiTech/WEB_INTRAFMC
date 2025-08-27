import { requireAdmin, requireAuth, requireGuest, requireNonAdmin } from '@/shared/guards/routeGuards'
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

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

            // Gestion des commandes - Accessible à tous les utilisateurs
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

            // Gestion avancée des commandes - Admin uniquement
            {
                path: '/orders/advanced',
                name: 'AdvancedOrders',
                component: () => import('@/modules/orders/views/AdvancedOrdersView.vue'),
                beforeEnter: requireAdmin,
                meta: {
                    title: 'Gestion Avancée des Commandes - WEB IntraFMC'
                }
            },

            // Gestion des arrivages - Admin uniquement
            {
                path: '/arrivals',
                name: 'Arrivals',
                component: () => import('@/modules/arrivals/views/ArrivalsListView.vue'),
                beforeEnter: requireAdmin,
                meta: {
                    title: 'Arrivages - WEB IntraFMC'
                }
            },
            {
                path: '/arrivals/create',
                name: 'CreateArrival',
                component: () => import('@/modules/arrivals/views/CreateArrivalView.vue'),
                beforeEnter: requireAdmin,
                meta: {
                    title: 'Créer un arrivage - WEB IntraFMC'
                }
            },
            {
                path: '/arrivals/:id',
                name: 'ArrivalDetail',
                component: () => import('@/modules/arrivals/views/ArrivalDetailView.vue'),
                beforeEnter: requireAdmin,
                meta: {
                    title: 'Détail arrivage - WEB IntraFMC'
                }
            },

            // Gestion des produits - Admin uniquement
            {
                path: '/products',
                name: 'Products',
                component: () => import('@/modules/products/views/ProductsView.vue'),
                beforeEnter: requireAdmin,
                meta: {
                    title: 'Produits - WEB IntraFMC'
                }
            },
            {
                path: '/products/create',
                name: 'CreateProduct',
                component: () => import('@/modules/products/views/CreateProductView.vue'),
                beforeEnter: requireAdmin,
                meta: {
                    title: 'Nouveau Produit - WEB IntraFMC'
                }
            },
            {
                path: '/products/:id',
                name: 'ProductDetail',
                component: () => import('@/modules/products/views/ProductDetailView.vue'),
                beforeEnter: requireAdmin,
                meta: {
                    title: 'Détail Produit - WEB IntraFMC'
                }
            },

            // Gestion des catégories - Admin uniquement
            {
                path: '/categories',
                name: 'Categories',
                component: () => import('@/modules/categories/views/CategoriesView.vue'),
                beforeEnter: requireAdmin,
                meta: {
                    title: 'Catégories - WEB IntraFMC'
                }
            },

            // Statistiques avancées - Admin uniquement
            {
                path: '/stats',
                name: 'Stats',
                component: () => import('@/modules/stats/views/StatsView.vue'),
                beforeEnter: requireAdmin,
                meta: {
                    title: 'Statistiques Avancées - WEB IntraFMC'
                }
            },

            // Gestion des utilisateurs - Admin uniquement
            {
                path: '/admin/users',
                name: 'Users',
                component: () => import('@/modules/users/views/UsersListView.vue'),
                beforeEnter: requireAdmin,
                meta: {
                    title: 'Gestion des Utilisateurs - WEB IntraFMC'
                }
            },

            // Profil utilisateur - Accessible à tous les utilisateurs connectés
            {
                path: '/profile',
                name: 'Profile',
                component: () => import('@/modules/profile/views/ProfileView.vue'),
                meta: {
                    title: 'Mon Profil - WEB IntraFMC'
                }
            },

            // Module E-commerce - Utilisateurs non-admin
            {
                path: '/ecommerce',
                name: 'EcommerceCatalog',
                component: () => import('@/modules/ecommerce/views/ProductCatalogView.vue'),
                beforeEnter: requireNonAdmin,
                meta: {
                    title: 'Boutique - WEB IntraFMC',
                    requireNonAdmin: true
                }
            },
            {
                path: '/ecommerce/products/:id',
                name: 'EcommerceProductDetail',
                component: () => import('@/modules/ecommerce/views/ProductDetailView.vue'),
                beforeEnter: requireNonAdmin,
                meta: {
                    title: 'Produit - WEB IntraFMC',
                    requireNonAdmin: true
                }
            },
            {
                path: '/ecommerce/cart',
                name: 'EcommerceCart',
                component: () => import('@/modules/ecommerce/views/CartView.vue'),
                beforeEnter: requireNonAdmin,
                meta: {
                    title: 'Panier - WEB IntraFMC',
                    requireNonAdmin: true
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
