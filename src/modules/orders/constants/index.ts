// Constantes pour le module orders

import type { OrderStatus } from '../types'

/**
 * Options de statut pour les filtres
 */
export const STATUS_OPTIONS = [
    { value: 'pending' as OrderStatus, label: 'En attente', color: 'text-yellow-400' },
    { value: 'validated' as OrderStatus, label: 'Validées', color: 'text-green-400' },
    { value: 'cancelled' as OrderStatus, label: 'Annulées', color: 'text-red-400' }
] as const

/**
 * Configurations pour la pagination
 */
export const PAGINATION_CONFIG = {
    DEFAULT_PER_PAGE: 20,
    MAX_PER_PAGE: 50,
    PER_PAGE_OPTIONS: [10, 20, 50]
} as const

/**
 * Configuration pour les images de produits
 */
export const PRODUCT_IMAGE_CONFIG = {
    PLACEHOLDER_COLORS: [
        'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500',
        'bg-yellow-500', 'bg-red-500', 'bg-indigo-500', 'bg-teal-500'
    ],
    DEFAULT_SIZE: 40
} as const

/**
 * Messages d'interface utilisateur
 */
export const UI_MESSAGES = {
    LOADING: {
        ORDERS: 'Chargement des commandes...',
        SEARCH: 'Recherche dans toutes les commandes...',
        FILTERING: 'Filtrage...',
        STATS: 'Chargement des statistiques...'
    },
    SUCCESS: {
        ORDER_VALIDATED: 'Commande validée avec succès',
        ORDER_CANCELLED: 'Commande annulée avec succès',
        INVOICE_GENERATED: 'Facture téléchargée avec succès !'
    },
    ERROR: {
        LOAD_ORDERS: 'Erreur lors du chargement des commandes',
        VALIDATE_ORDER: 'Erreur lors de la validation',
        CANCEL_ORDER: 'Erreur lors de l\'annulation',
        GENERATE_INVOICE: 'Erreur lors de la génération de la facture'
    },
    EMPTY: {
        NO_ORDERS: 'Aucune commande trouvée'
    }
} as const
