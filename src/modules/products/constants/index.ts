// Constantes pour le module produits

export const PRODUCT_STATUSES = [
    { value: 'active', label: 'Actif', color: 'success' },
    { value: 'inactive', label: 'Inactif', color: 'error' },
    { value: 'low_stock', label: 'Stock faible', color: 'warning' },
    { value: 'out_of_stock', label: 'Rupture de stock', color: 'error' }
] as const

export const SORT_OPTIONS = [
    { value: 'name', label: 'Nom' },
    { value: 'price', label: 'Prix' },
    { value: 'stock', label: 'Stock' },
    { value: 'created_at', label: 'Date de création' },
    { value: 'updated_at', label: 'Dernière modification' }
] as const

export const VIEW_MODES = [
    { value: 'grid', label: 'Grille', icon: 'grid' },
    { value: 'list', label: 'Liste', icon: 'list' },
    { value: 'table', label: 'Tableau', icon: 'table' }
] as const

export const DEFAULT_PRODUCT_IMAGE = '/images/placeholder-product.svg'

export const ITEMS_PER_PAGE_OPTIONS = [12, 24, 48, 96] as const

export const LOW_STOCK_THRESHOLD = 10

export const PRODUCT_TAGS = [
    'Nouveauté',
    'Promotion',
    'Populaire',
    'Écologique',
    'Premium',
    'Saisonnier',
    'Limité',
    'Bio'
] as const
