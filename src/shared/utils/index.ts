// Utilitaires partagés pour l'application

/**
 * Formate une date selon le format français
 */
export const formatDate = (date: Date, options?: Intl.DateTimeFormatOptions): string => {
    const defaultOptions: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }

    return new Intl.DateTimeFormat('fr-FR', { ...defaultOptions, ...options }).format(date)
}

/**
 * Formate une date avec l'heure
 */
export const formatDateTime = (date: Date): string => {
    return formatDate(date, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

/**
 * Génère un ID unique
 */
export const generateId = (): number => {
    return Date.now() + Math.floor(Math.random() * 1000)
}

/**
 * Délai d'attente (promesse)
 */
export const sleep = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Debounce une fonction
 */
export const debounce = <T extends (...args: any[]) => any>(
    func: T,
    wait: number
): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout | null = null

    return (...args: Parameters<T>) => {
        if (timeout) clearTimeout(timeout)
        timeout = setTimeout(() => func(...args), wait)
    }
}

/**
 * Valide une adresse email
 */
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

/**
 * Capitalise la première lettre d'une chaîne
 */
export const capitalize = (str: string): string => {
    if (!str) return ''
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Tronque un texte avec ellipses
 */
export const truncate = (text: string, length: number): string => {
    if (text.length <= length) return text
    return text.substring(0, length) + '...'
}

/**
 * Convertit un statut en label français
 */
export const getStatusLabel = (status: string): string => {
    const labels: Record<string, string> = {
        active: 'Actif',
        inactive: 'Inactif',
        pending: 'En attente',
        completed: 'Terminé',
        cancelled: 'Annulé'
    }
    return labels[status] || status
}

/**
 * Vérifie si un objet est vide
 */
export const isEmpty = (obj: any): boolean => {
    return Object.keys(obj).length === 0
}

/**
 * Clone profond d'un objet
 */
export const deepClone = <T>(obj: T): T => {
    return JSON.parse(JSON.stringify(obj))
}
