// Utilitaires de formatage avancés pour le module orders

import type { OrderStatus, PaymentMethod } from '../types'

/**
 * Formate un montant en devise
 */
export function formatCurrency(amount: number, currency = 'EUR'): string {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount)
}

/**
 * Formate une date en français
 */
export function formatDate(dateString: string): string {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date)
}

/**
 * Formate une date avec l'heure
 */
export function formatDateTime(dateString: string): string {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('fr-FR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
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
 * Vérifie si une transition de statut est autorisée
 */
export function isStatusTransitionAllowed(currentStatus: OrderStatus, newStatus: OrderStatus): boolean {
    const transitions: Record<OrderStatus, OrderStatus[]> = {
        pending: ['validated', 'cancelled'],
        validated: [],
        cancelled: []
    }
    
    return transitions[currentStatus]?.includes(newStatus) || false
}

/**
 * Retourne les statuts suivants autorisés pour une commande
 */
export function getNextAllowedStatuses(currentStatus: OrderStatus): OrderStatus[] {
    const transitions: Record<OrderStatus, OrderStatus[]> = {
        pending: ['validated', 'cancelled'],
        validated: [],
        cancelled: []
    }
    
    return transitions[currentStatus] || []
}

/**
 * Gère les erreurs d'images de produits
 */
export function handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement
    if (img) {
        img.src = '/images/placeholder-product.svg'
    }
}

/**
 * Formate un numéro de téléphone
 */
export function formatPhoneNumber(phone: string): string {
    const cleaned = phone.replace(/\D/g, '')
    
    if (cleaned.length === 10 && cleaned.startsWith('0')) {
        return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5')
    }
    
    return phone
}

/**
 * Formate le nom d'un fichier pour le téléchargement
 */
export function formatFilename(basename: string, extension: string, orderId?: string): string {
    const timestamp = new Date().toISOString().split('T')[0]
    const orderPart = orderId ? `_${orderId}` : ''
    return `${basename}${orderPart}_${timestamp}.${extension}`
}

/**
 * Calcule le pourcentage avec gestion des erreurs
 */
export function calculatePercentage(value: number, total: number): number {
    if (total === 0) return 0
    return Math.round((value / total) * 100)
}

/**
 * Formate un pourcentage pour l'affichage
 */
export function formatPercentage(percentage: number): string {
    return `${percentage}%`
}

/**
 * Retourne le label pour une méthode de paiement
 */
export function getPaymentMethodLabel(method: PaymentMethod): string {
    const labels: Record<PaymentMethod, string> = {
        credit_card: 'Carte de crédit',
        debit_card: 'Carte de débit',
        bank_transfer: 'Virement bancaire',
        cash: 'Espèces',
        check: 'Chèque',
        paypal: 'PayPal',
        stripe: 'Stripe'
    }
    return labels[method] || method
}

/**
 * Retourne l'icône pour une méthode de paiement
 */
export function getPaymentMethodIcon(method: PaymentMethod): string {
    const icons: Record<PaymentMethod, string> = {
        credit_card: '💳',
        debit_card: '💳',
        bank_transfer: '🏦',
        cash: '💵',
        check: '📝',
        paypal: '🅿️',
        stripe: '💎'
    }
    return icons[method] || '💰'
}

/**
 * Valide un email simple
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

/**
 * Tronque un texte avec des ellipses
 */
export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
}

/**
 * Formate la durée depuis une date
 */
export function getTimeAgo(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'Il y a moins d\'une minute'
    if (diffInSeconds < 3600) return `Il y a ${Math.floor(diffInSeconds / 60)} minute(s)`
    if (diffInSeconds < 86400) return `Il y a ${Math.floor(diffInSeconds / 3600)} heure(s)`
    if (diffInSeconds < 2592000) return `Il y a ${Math.floor(diffInSeconds / 86400)} jour(s)`
    if (diffInSeconds < 31536000) return `Il y a ${Math.floor(diffInSeconds / 2592000)} mois`
    return `Il y a ${Math.floor(diffInSeconds / 31536000)} an(s)`
}

/**
 * Génère un ID de commande lisible
 */
export function generateOrderDisplayId(id: string): string {
    return `CMD-${id.substring(0, 8).toUpperCase()}`
}

/**
 * Convertit les bytes en format lisible
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}
