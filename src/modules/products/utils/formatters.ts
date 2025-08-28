




// Utilitaires de formatage pour le module produits

import type { Product, ProductStatus } from '../types'

/**
 * Formate un prix en devise avec mise en cache
 */
const priceFormatter = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
})

export function formatPrice(price: number): string {
    return priceFormatter.format(price)
}

/**
 * Formate un nombre (stock, quantité) avec mise en cache
 */
const numberFormatter = new Intl.NumberFormat('fr-FR')

export function formatNumber(number: number): string {
    return numberFormatter.format(number)
}

/**
 * Formate une date avec mise en cache
 */
const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
})

export function formatDate(dateString: string): string {
    const date = new Date(dateString)
    return dateFormatter.format(date)
}

/**
 * Formate une date courte (sans heure) avec mise en cache
 */
const shortDateFormatter = new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
})

export function formatShortDate(dateString: string): string {
    const date = new Date(dateString)
    return shortDateFormatter.format(date)
}

/**
 * Détermine le statut d'un produit avec optimisation
 */
export function getProductStatus(product: Product): ProductStatus {
    // Suppression des propriétés non existantes dans le type Product
    if (product.stock === 0) {
        return 'out_of_stock'
    }

    const threshold = 10 // LOW_STOCK_THRESHOLD par défaut
    if (product.stock <= threshold) {
        return 'low_stock'
    }

    return 'active'
}

/**
 * Retourne la couleur CSS pour un statut de produit
 */
export function getStatusColor(status: ProductStatus): string {
    const colors: Record<ProductStatus, string> = {
        active: 'text-green-400',
        inactive: 'text-gray-400',
        low_stock: 'text-yellow-400',
        out_of_stock: 'text-red-400'
    }
    return colors[status]
}

/**
 * Retourne les classes CSS pour le badge de statut
 */
export function getStatusBadgeClass(status: ProductStatus): string {
    const classes: Record<ProductStatus, string> = {
        active: 'bg-green-600/20 text-green-400 border-green-600/30',
        inactive: 'bg-gray-600/20 text-gray-400 border-gray-600/30',
        low_stock: 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30',
        out_of_stock: 'bg-red-600/20 text-red-400 border-red-600/30'
    }
    return classes[status]
}

/**
 * Retourne le label d'affichage pour un statut
 */
export function getStatusLabel(status: ProductStatus): string {
    const labels: Record<ProductStatus, string> = {
        active: 'Actif',
        inactive: 'Inactif',
        low_stock: 'Stock faible',
        out_of_stock: 'Rupture de stock'
    }
    return labels[status]
}

/**
 * Gère les erreurs d'images de produits
 */
export function handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement
    if (img) {
        // Génération d'un SVG de fallback basé sur le nom du produit
        const productName = img.alt || 'Produit'
        const colors = [
            '#3B82F6', '#10B981', '#8B5CF6', '#EC4899',
            '#F59E0B', '#EF4444', '#6366F1', '#14B8A6'
        ]

        const hash = productName.split('').reduce((a: number, b: string) => {
            a = ((a << 5) - a) + b.charCodeAt(0)
            return a & a
        }, 0)

        const colorIndex = Math.abs(hash) % colors.length
        const backgroundColor = colors[colorIndex]
        const initials = productName.split(' ').map((word: string) => word[0]).join('').substring(0, 2).toUpperCase()

        const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
        <rect width="200" height="200" fill="${backgroundColor}" rx="8"/>
        <text x="100" y="110" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="white" text-anchor="middle">${initials}</text>
      </svg>
    `

        img.src = `data:image/svg+xml;base64,${btoa(svg)}`
    }
}

/**
 * Génère un SKU automatique
 */
export function generateSKU(productName: string, categoryName?: string): string {
    const cleanName = productName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
    const namePrefix = cleanName.substring(0, 3)

    const categoryPrefix = categoryName
        ? categoryName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().substring(0, 2)
        : 'GN'

    const timestamp = Date.now().toString().slice(-4)

    return `${categoryPrefix}${namePrefix}${timestamp}`
}

/**
 * Valide un code-barres (format EAN-13)
 */
export function validateBarcode(barcode: string): boolean {
    if (!/^\d{13}$/.test(barcode)) {
        return false
    }

    // Validation du checksum EAN-13
    const digits = barcode.split('').map(Number)
    const checksum = digits.pop()!

    let sum = 0
    for (let i = 0; i < digits.length; i++) {
        sum += digits[i] * (i % 2 === 0 ? 1 : 3)
    }

    const calculatedChecksum = (10 - (sum % 10)) % 10

    return calculatedChecksum === checksum
}

/**
 * Calcule la valeur totale du stock d'un produit
 */
export function calculateStockValue(product: Product): number {
    return product.stock * product.price
}

/**
 * Formate les dimensions d'un produit
 */
export function formatDimensions(dimensions: string): string {
    if (!dimensions) return ''

    // Suppose le format "LxlxH" ou "L x l x H"
    const cleaned = dimensions.replace(/\s/g, '')
    const parts = cleaned.split('x')

    if (parts.length === 3) {
        return `${parts[0]} × ${parts[1]} × ${parts[2]} cm`
    }

    return dimensions
}

/**
 * Formate le poids d'un produit
 */
export function formatWeight(weight: number): string {
    if (weight < 1) {
        return `${(weight * 1000).toFixed(0)} g`
    }
    return `${weight.toFixed(2)} kg`
}

/**
 * Récupère la première image d'un produit ou une image par défaut
 */
export function getProductImage(product: Product): string {
    // Première image du tableau
    if (product.image_urls && product.image_urls.length > 0) {
        return product.image_urls[0]
    }

    // Image par défaut
    return '/images/placeholder-product.svg'
}

/**
 * Récupère toutes les images d'un produit
 */
export function getProductImages(product: Product): string[] {
    const images: string[] = []

    // Ajouter les images du tableau
    if (product.image_urls && product.image_urls.length > 0) {
        // Éviter les doublons
        product.image_urls.forEach((img: string) => {
            if (!images.includes(img)) {
                images.push(img)
            }
        })
    }

    // Au moins une image par défaut si aucune
    if (images.length === 0) {
        images.push('/images/placeholder-product.svg')
    }

    return images
}

/**
 * Détermine si un produit est en promotion (prix réduit)
 */
export function isOnSale(_product: Product): boolean {
    // Suppression des tags non existants dans le type Product
    return false
}

/**
 * Détermine si un produit est nouveau
 */
export function isNewProduct(product: Product): boolean {
    // Suppression des tags non existants dans le type Product
    const createdAt = new Date(product.created_at || '')
    const now = new Date()
    const daysSinceCreation = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)

    return daysSinceCreation <= 30 // Nouveau si créé dans les 30 derniers jours
}

/**
 * Formate la taille d'un fichier
 */
export function formatFileSize(bytes: number | undefined | null): string {
    if (!bytes) return 'N/A'

    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))

    if (i === 0) return `${bytes} ${sizes[i]}`

    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
}

/**
 * Détermine si un produit a un fichier d'analyse
 */
export function hasAnalysisFile(product: Product): boolean {
    return !!(product.analysis_file || product.analysis_file_url)
}

/**
 * Récupère le nom d'affichage du fichier d'analyse
 */
export function getAnalysisFileName(_product: Product): string {
    return 'Fichier d\'analyse'
}

/**
 * Récupère les métadonnées d'image formatées
 */
export function getImageMetadata(_product: Product): any {
    // Suppression des métadonnées image non existantes dans le type Product
    return null
}
