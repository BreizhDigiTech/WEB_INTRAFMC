import { setupVueQuery } from '@/shared/cache/vueQuery'
import { setupSentry } from '@/shared/monitoring/sentry'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import './assets/styles/main.css'
import router from './router'

// Stores
import { useAuthStore } from '@/stores/auth'

async function bootstrap() {
  const app = createApp(App)
  const pinia = createPinia()

  // Configuration du store Pinia
  app.use(pinia)

  // Configuration du router
  app.use(router)

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

  // Configuration des warnings Vue en développement
  if (import.meta.env.DEV) {
    app.config.warnHandler = (msg, instance, trace) => {
      console.warn(`Vue warning: ${msg}`, trace)
    }
  }

  // Initialisation de l'authentification
  const authStore = useAuthStore()
  await authStore.initialize()

  // Montage de l'application
  app.mount('#app')

  console.log('🚀 Application WEB_INTRAFMC démarrée')
  console.log(`📊 Mode: ${import.meta.env.MODE}`)
  
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
