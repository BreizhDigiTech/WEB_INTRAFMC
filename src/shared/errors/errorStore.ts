import { defineStore } from 'pinia'
import { ref } from 'vue'
import { AppError } from './types'

export interface ErrorState {
  id: string
  message: string
  type: 'error' | 'warning' | 'info' | 'success'
  code?: string
  timestamp: number
  autoHide?: boolean
  duration?: number
}

export const useErrorStore = defineStore('errors', () => {
  const errors = ref<ErrorState[]>([])
  const maxErrors = 5

  const addError = (
    message: string, 
    type: ErrorState['type'] = 'error',
    options: Partial<Pick<ErrorState, 'code' | 'autoHide' | 'duration'>> = {}
  ) => {
    const error: ErrorState = {
      id: Date.now().toString(),
      message,
      type,
      timestamp: Date.now(),
      autoHide: options.autoHide ?? true,
      duration: options.duration ?? 5000,
      ...options
    }

    errors.value.unshift(error)

    // Limiter le nombre d'erreurs
    if (errors.value.length > maxErrors) {
      errors.value = errors.value.slice(0, maxErrors)
    }

    // Auto-hide
    if (error.autoHide) {
      setTimeout(() => {
        removeError(error.id)
      }, error.duration)
    }

    return error.id
  }

  const removeError = (id: string) => {
    const index = errors.value.findIndex(e => e.id === id)
    if (index !== -1) {
      errors.value.splice(index, 1)
    }
  }

  const clearAll = () => {
    errors.value = []
  }

  const handleError = (error: unknown, fallbackMessage = 'Une erreur est survenue') => {
    let message = fallbackMessage
    let code = 'UNKNOWN_ERROR'
    let type: ErrorState['type'] = 'error'

    if (error instanceof AppError) {
      message = error.message
      code = error.code
      
      // Adapter le type selon le code d'erreur
      if (error.code === 'VALIDATION_ERROR') {
        type = 'warning'
      } else if (error.code === 'AUTH_ERROR') {
        type = 'error'
        // Rediriger vers login si nécessaire
      }
    } else if (error instanceof Error) {
      message = error.message
    } else if (typeof error === 'string') {
      message = error
    }

    console.error('Error handled:', { error, message, code, type })
    
    return addError(message, type, { code })
  }

  const addSuccess = (message: string, duration = 3000) => {
    return addError(message, 'success', { duration })
  }

  const addWarning = (message: string, duration = 4000) => {
    return addError(message, 'warning', { duration })
  }

  const addInfo = (message: string, duration = 3000) => {
    return addError(message, 'info', { duration })
  }

  return {
    errors,
    addError,
    removeError,
    clearAll,
    handleError,
    addSuccess,
    addWarning,
    addInfo
  }
})
