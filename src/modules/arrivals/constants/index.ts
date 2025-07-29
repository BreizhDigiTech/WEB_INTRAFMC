// Constantes pour le module arrivals (basé sur l'API backend)

/**
 * Options de statut pour les arrivages
 */
export const STATUS_OPTIONS = [
    { value: 'pending', label: 'En attente', color: 'text-yellow-400' },
    { value: 'validated', label: 'Validé', color: 'text-green-400' }
] as const

/**
 * Configurations pour la pagination
 */
export const PAGINATION_CONFIG = {
    DEFAULT_PER_PAGE: 15,
    MAX_PER_PAGE: 50,
    PER_PAGE_OPTIONS: [10, 15, 25, 50]
} as const

/**
 * Configuration pour les images de produits
 */
export const PRODUCT_IMAGE_CONFIG = {
    PLACEHOLDER_COLORS: [
        '#3B82F6', '#10B981', '#8B5CF6', '#EC4899',
        '#F59E0B', '#EF4444', '#6366F1', '#14B8A6'
    ],
    DEFAULT_SIZE: 40
} as const

/**
 * Messages d'interface utilisateur
 */
export const UI_MESSAGES = {
    LOADING: {
        ARRIVALS: 'Chargement des arrivages...',
        CREATING: 'Création de l\'arrivage...',
        VALIDATING: 'Validation en cours...',
        UPDATING: 'Mise à jour...'
    },
    SUCCESS: {
        ARRIVAL_CREATED: 'Arrivage créé avec succès',
        ARRIVAL_VALIDATED: 'Arrivage validé avec succès',
        ARRIVAL_UPDATED: 'Arrivage mis à jour avec succès'
    },
    ERROR: {
        LOAD_ARRIVALS: 'Erreur lors du chargement des arrivages',
        CREATE_ARRIVAL: 'Erreur lors de la création de l\'arrivage',
        VALIDATE_ARRIVAL: 'Erreur lors de la validation',
        UPDATE_ARRIVAL: 'Erreur lors de la mise à jour',
        INVALID_DATA: 'Données invalides',
        REQUIRED_FIELDS: 'Veuillez remplir tous les champs obligatoires'
    },
    EMPTY: {
        NO_ARRIVALS: 'Aucun arrivage trouvé',
        NO_PRODUCTS: 'Aucun produit dans cet arrivage'
    }
} as const

/**
 * Configuration des formulaires
 */
export const FORM_CONFIG = {
    VALIDATION: {
        MIN_QUANTITY: 1,
        MAX_QUANTITY: 10000,
        MIN_PRICE: 0.01,
        MAX_PRICE: 999999.99,
        MIN_AMOUNT: 0.01,
        MAX_AMOUNT: 999999.99
    }
} as const
