import { setupVueQuery } from '@/shared/cache/vueQuery'
import { setupSentry } from '@/shared/monitoring/sentry'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import './assets/styles/main.css'
import router from './router'

// Services globaux
import { errorHandler } from '@/shared/errors/errorHandler'
import { performanceMonitor } from '@/shared/monitoring/performance'

// Stores
import { useAuthStore } from '@/stores/auth'

async function bootstrap() {
  const app = createApp(App)
  const pinia = createPinia()

  // Configuration du store Pinia
  app.use(pinia)

  // Configuration du router
  app.use(router)

  // Configuration globale des erreurs
  app.config.errorHandler = (error, instance, info) => {
    errorHandler.handleError(error as Error, {
      vueComponent: instance?.$options.name || 'Unknown',
      vueInfo: info
    })
  }

  // Configuration de Vue Query pour le cache
  setupVueQuery(app)

  // Configuration de Sentry pour le monitoring
  setupSentry(app)

  // Configuration de la gestion d'erreurs globale
  app.config.errorHandler = (error, instance, info) => {
    console.error('Erreur Vue non gérée:', error, info)
    
    // Importer le store d'erreurs de manière lazy
    import('@/shared/errors/errorStore').then(({ useErrorStore }) => {
      const errorStore = useErrorStore()
      errorStore.handleError(error, 'Erreur inattendue de l\'application')
    })
  }

  // Configuration du reporting d'erreurs (si endpoint configuré)
  if (import.meta.env.VITE_ERROR_REPORTING_ENDPOINT) {
    errorHandler.setReportingEndpoint(import.meta.env.VITE_ERROR_REPORTING_ENDPOINT)
  }

  // Enregistrement du Service Worker en production
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration)
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError)
        })
    })
  }

  // Configuration des warnings Vue en développement
  if (import.meta.env.DEV) {
    app.config.warnHandler = (msg, instance, trace) => {
      console.warn(`Vue warning: ${msg}`, trace)
    }

    // Monitoring des performances en développement
    setInterval(() => {
      const stats = performanceMonitor.getAllStats()
      if (Object.keys(stats).length > 0) {
        console.group('📊 Performance Stats')
        console.table(stats)
        console.groupEnd()
      }
    }, 30000)
  }

  // Initialisation de l'authentification
  const authStore = useAuthStore()
  await authStore.initialize()

  // Montage de l'application
  app.mount('#app')



  
  // Helper JWT disponible en développement (pour tests manuels uniquement)
  // Pour utiliser un token de test, appelez updateWorkingJWTToken() dans la console
  if (import.meta.env.MODE === 'development') {
    import('@/modules/stats/utils/jwtTokenHelper')
    console.log('💡 Helper JWT disponible: updateWorkingJWTToken(), verifyCurrentToken(), diagnoseJWTToken()')
  }
}

// Démarrage de l'application avec gestion d'erreur
bootstrap().catch(error => {
  console.error('❌ Erreur lors du démarrage de l\'application:', error)
  
  // Enregistrer l'erreur de démarrage
  errorHandler.handleError(error, {
    context: 'application-bootstrap',
    timestamp: new Date().toISOString()
  })
  
  // Affichage d'un message d'erreur basique si l'app ne peut pas démarrer
  document.body.innerHTML = `
    <div style="padding: 20px; text-align: center; font-family: system-ui;">
      <h1 style="color: #ef4444;">Erreur de démarrage</h1>
      <p>L'application n'a pas pu se charger correctement.</p>
      <p style="font-size: 0.9em; color: #666;">Veuillez rafraîchir la page ou contacter le support.</p>
      <button onclick="location.reload()" style="margin-top: 10px; padding: 8px 16px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer;">
        Rafraîchir
      </button>
    </div>
  `
})
