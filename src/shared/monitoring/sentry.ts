import * as Sentry from '@sentry/vue'
import type { App } from 'vue'

export function setupSentry(app: App) {
  // Ne configurer Sentry qu'en production
  if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
    Sentry.init({
      app,
      dsn: import.meta.env.VITE_SENTRY_DSN,
      environment: import.meta.env.MODE,
      integrations: [
        // Suppression de BrowserTracing (non disponible dans cette version)
        // new Sentry.BrowserTracing({
        //   routingInstrumentation: Sentry.vueRouterInstrumentation(),
        // }),
      ],
      tracesSampleRate: import.meta.env.DEV ? 1.0 : 0.1,
      beforeSend(event) {
        // Filtrer les erreurs sensibles en production
        if (import.meta.env.PROD) {
          // Ne pas envoyer les erreurs contenant des tokens
          const errorMessage = event.message || event.exception?.values?.[0]?.value || ''
          if (errorMessage.includes('token') || errorMessage.includes('password')) {
            return null
          }
        }
        return event
      },
      // Capturer automatiquement les erreurs de console en dev
      beforeBreadcrumb(breadcrumb) {
        if (import.meta.env.DEV && breadcrumb.category === 'console') {
          return breadcrumb
        }
        return breadcrumb
      }
    })


  } else {
    console.log('⚠️ Sentry désactivé (dev mode ou DSN manquant)')
  }
}

// Helper pour capturer des erreurs personnalisées
export function captureError(error: Error, context?: Record<string, any>) {
  if (import.meta.env.DEV) {
    console.error('Error captured:', error, context)
  }
  
  if (import.meta.env.PROD) {
    Sentry.captureException(error, { extra: context })
  }
}

// Helper pour ajouter du contexte utilisateur
export function setUserContext(user: { id: string; email?: string; [key: string]: any }) {
  Sentry.setUser({
    email: user.email,
    ...user
  })
}
