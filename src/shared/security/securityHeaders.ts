/**
 * Configuration des en-têtes de sécurité pour l'application
 */

export interface SecurityHeaders {
  'X-Content-Type-Options': string
  'X-Frame-Options': string
  'X-XSS-Protection': string
  'Referrer-Policy': string
  'Permissions-Policy': string
}

/**
 * En-têtes de sécurité recommandés
 */
export const SECURITY_HEADERS: SecurityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
}

/**
 * Applique les en-têtes de sécurité aux requêtes fetch
 */
export function applySecurityHeaders(headers: Record<string, string> = {}): Record<string, string> {
  return {
    ...headers,
    ...SECURITY_HEADERS
  }
}

/**
 * Valide et nettoie les données d'entrée pour prévenir les attaques XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim()
}

/**
 * Valide une URL pour s'assurer qu'elle est sûre
 */
export function validateUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url)
    const allowedProtocols = ['http:', 'https:']
    return allowedProtocols.includes(parsedUrl.protocol)
  } catch {
    return false
  }
}

/**
 * Génère un nonce sécurisé pour CSP
 */
export function generateNonce(): string {
  const array = new Uint8Array(16)
  crypto.getRandomValues(array)
  return btoa(String.fromCharCode(...array))
}
