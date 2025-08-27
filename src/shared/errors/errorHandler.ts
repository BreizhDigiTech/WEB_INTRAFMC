/**
 * Gestionnaire d'erreurs global standardisé
 */

import { ref } from 'vue'

export interface AppError {
  id: string
  type: 'validation' | 'network' | 'authentication' | 'authorization' | 'server' | 'unknown'
  title: string
  message: string
  details?: any
  timestamp: Date
  stack?: string
  context?: Record<string, any>
}

export interface ErrorReport {
  error: AppError
  userAgent: string
  url: string
  userId?: string
  sessionId?: string
}

class ErrorHandler {
  private errors = ref<AppError[]>([])
  private maxErrors = 50
  private reportingEndpoint?: string

  constructor() {
    // Capturer les erreurs globales
    this.setupGlobalErrorHandlers()
  }

  /**
   * Configure les gestionnaires d'erreurs globaux
   */
  private setupGlobalErrorHandlers(): void {
    // Erreurs JavaScript non capturées
    window.addEventListener('error', (event) => {
      this.handleGlobalError({
        type: 'unknown',
        title: 'Erreur JavaScript',
        message: event.message || 'Une erreur inattendue est survenue',
        details: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        },
        stack: event.error?.stack
      })
    })

    // Promesses rejetées non capturées
    window.addEventListener('unhandledrejection', (event) => {
      this.handleGlobalError({
        type: 'unknown',
        title: 'Promesse rejetée',
        message: event.reason?.message || 'Une promesse a été rejetée',
        details: event.reason,
        stack: event.reason?.stack
      })
    })

    // Erreurs de réseau (images, scripts, etc.)
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        this.handleGlobalError({
          type: 'network',
          title: 'Erreur de ressource',
          message: `Impossible de charger la ressource: ${(event.target as any)?.src || 'inconnue'}`,
          details: {
            target: event.target,
            type: (event.target as any)?.tagName
          }
        })
      }
    }, true)
  }

  /**
   * Gère une erreur globale
   */
  private handleGlobalError(errorData: Omit<AppError, 'id' | 'timestamp'>): void {
    const error = this.createError(errorData)
    this.addError(error)
    
    // Reporter l'erreur si l'endpoint est configuré
    if (this.reportingEndpoint) {
      this.reportError(error).catch(() => {
        // Échec silencieux du reporting
      })
    }
  }

  /**
   * Crée une nouvelle erreur
   */
  createError(errorData: Omit<AppError, 'id' | 'timestamp'>): AppError {
    return {
      id: this.generateErrorId(),
      timestamp: new Date(),
      ...errorData
    }
  }

  /**
   * Ajoute une erreur à la liste
   */
  addError(error: AppError): void {
    this.errors.value.unshift(error)
    
    // Limiter le nombre d'erreurs stockées
    if (this.errors.value.length > this.maxErrors) {
      this.errors.value = this.errors.value.slice(0, this.maxErrors)
    }
  }

  /**
   * Gère une erreur avec contexte
   */
  handleError(
    error: Error | string | AppError,
    context?: Record<string, any>
  ): AppError {
    let appError: AppError

    if (typeof error === 'string') {
      appError = this.createError({
        type: 'unknown',
        title: 'Erreur',
        message: error,
        context
      })
    } else if (error instanceof Error) {
      appError = this.createError({
        type: this.categorizeError(error),
        title: error.name || 'Erreur',
        message: error.message,
        stack: error.stack,
        context
      })
    } else {
      appError = { ...error, context: { ...error.context, ...context } }
    }

    this.addError(appError)
    return appError
  }

  /**
   * Catégorise automatiquement une erreur
   */
  private categorizeError(error: Error): AppError['type'] {
    const message = error.message.toLowerCase()
    const name = error.name.toLowerCase()

    if (name.includes('network') || message.includes('fetch') || message.includes('network')) {
      return 'network'
    }
    
    if (name.includes('validation') || message.includes('validation')) {
      return 'validation'
    }
    
    if (message.includes('unauthorized') || message.includes('401')) {
      return 'authentication'
    }
    
    if (message.includes('forbidden') || message.includes('403')) {
      return 'authorization'
    }
    
    if (message.includes('server') || message.includes('500') || message.includes('internal')) {
      return 'server'
    }

    return 'unknown'
  }

  /**
   * Supprime une erreur
   */
  removeError(errorId: string): void {
    const index = this.errors.value.findIndex(e => e.id === errorId)
    if (index > -1) {
      this.errors.value.splice(index, 1)
    }
  }

  /**
   * Supprime toutes les erreurs
   */
  clearErrors(): void {
    this.errors.value = []
  }

  /**
   * Obtient toutes les erreurs
   */
  getErrors(): AppError[] {
    return this.errors.value
  }

  /**
   * Obtient les erreurs par type
   */
  getErrorsByType(type: AppError['type']): AppError[] {
    return this.errors.value.filter(error => error.type === type)
  }

  /**
   * Configure l'endpoint de reporting
   */
  setReportingEndpoint(endpoint: string): void {
    this.reportingEndpoint = endpoint
  }

  /**
   * Reporte une erreur au serveur
   */
  private async reportError(error: AppError): Promise<void> {
    if (!this.reportingEndpoint) return

    const report: ErrorReport = {
      error,
      userAgent: navigator.userAgent,
      url: window.location.href,
      // Ajouter userId et sessionId depuis le store auth si disponible
    }

    try {
      await fetch(this.reportingEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(report)
      })
    } catch (reportingError) {
      console.error('Échec du reporting d\'erreur:', reportingError)
    }
  }

  /**
   * Génère un ID unique pour l'erreur
   */
  private generateErrorId(): string {
    return `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Obtient les statistiques des erreurs
   */
  getErrorStats() {
    const errorsByType = this.errors.value.reduce((acc, error) => {
      acc[error.type] = (acc[error.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const recentErrors = this.errors.value.filter(
      error => Date.now() - error.timestamp.getTime() < 24 * 60 * 60 * 1000
    )

    return {
      total: this.errors.value.length,
      byType: errorsByType,
      recent24h: recentErrors.length,
      oldest: this.errors.value[this.errors.value.length - 1]?.timestamp,
      newest: this.errors.value[0]?.timestamp
    }
  }
}

// Instance singleton
export const errorHandler = new ErrorHandler()

// Hook Vue pour utiliser le gestionnaire d'erreurs
export function useErrorHandler() {
  return {
    handleError: errorHandler.handleError.bind(errorHandler),
    removeError: errorHandler.removeError.bind(errorHandler),
    clearErrors: errorHandler.clearErrors.bind(errorHandler),
    errors: errorHandler.getErrors(),
    errorStats: errorHandler.getErrorStats()
  }
}
