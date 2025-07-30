// Utilitaires de formatage pour le module orders

import type { OrderStatus } from '../types'

/**
 * Formate un montant en devise
 */
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
    }).format(amount)
}

/**
 * Formate une date en format français
 */
export function formatDate(dateString: string): string {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date)
}

/**
 * Retourne le label d'affichage pour un statut
 */
export function getStatusLabel(status: OrderStatus): string {
    const labels = {
        pending: 'En attente',
        validated: 'Validée',
        cancelled: 'Annulée'
    }
    return labels[status] || status
}

/**
 * Retourne les classes CSS pour le badge de statut
 */
export function getStatusBadgeClass(status: OrderStatus): string {
    const classes = {
        pending: 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30',
        validated: 'bg-green-600/20 text-green-400 border-green-600/30',
        cancelled: 'bg-red-600/20 text-red-400 border-red-600/30'
    }
    return classes[status] || 'bg-gray-600/20 text-gray-400 border-gray-600/30'
}

/**
 * Gère les erreurs d'images de produits
 */
export function handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement
    if (img) {
        // Génération d'un SVG de fallback
        const fallbackSvg = `
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
                <rect width="40" height="40" fill="#6B7280" rx="4"/>
                <path d="M12 14l7 7-7 7M20 14l7 7-7 7" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `
        img.src = `data:image/svg+xml;base64,${btoa(fallbackSvg)}`
    }
}

/**
 * Retourne l'URL de l'image d'un produit avec fallback
 */
export function getProductImage(product: any): string {
    if (product.images && product.images.length > 0) {
        return product.images[0]
    }

    if (product.image) {
        return product.image
    }

    // Génération d'une image placeholder basée sur le nom du produit
    const colors = [
        '#3B82F6', '#10B981', '#8B5CF6', '#EC4899',
        '#F59E0B', '#EF4444', '#6366F1', '#14B8A6'
    ]

    const hash = product.name.split('').reduce((a: number, b: string) => {
        a = ((a << 5) - a) + b.charCodeAt(0)
        return a & a
    }, 0)

    const colorIndex = Math.abs(hash) % colors.length
    const backgroundColor = colors[colorIndex]
    const initials = product.name.split(' ').map((word: string) => word[0]).join('').substring(0, 2).toUpperCase()

    // Génération d'un SVG placeholder local
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
            <rect width="40" height="40" fill="${backgroundColor}" rx="4"/>
            <text x="20" y="24" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="white" text-anchor="middle">${initials}</text>
        </svg>
    `

    return `data:image/svg+xml;base64,${btoa(svg)}`
}
