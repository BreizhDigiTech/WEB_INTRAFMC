<template>
  <div class="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
    <!-- Fond animé avec points lumineux -->
    <div class="absolute inset-0">
      <!-- Grille de points lumineux -->
      <div class="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div class="absolute inset-0" style="background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0); background-size: 50px 50px;"></div>
      </div>
      
      <!-- Effets lumineux -->
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
    </div>

    <!-- Conteneur principal -->
    <div class="relative z-10 w-full max-w-sm mx-auto p-6">
      <!-- Logo et titre minimalistes -->
      <div class="text-center mb-12">
        <div class="w-12 h-12 mx-auto mb-6 bg-white rounded-lg flex items-center justify-center">
          <div class="w-6 h-6 bg-black rounded-sm"></div>
        </div>
        <h1 class="text-2xl font-light text-white mb-2">FMC</h1>
        <p class="text-gray-400 text-sm">Connexion sécurisée</p>
      </div>

      <!-- Formulaire ultra-moderne -->
      <div class="space-y-6">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Email -->
          <div>
            <input 
              v-model="credentials.email"
              type="email" 
              placeholder="Email"
              class="w-full px-0 py-4 bg-transparent border-0 border-b border-gray-600 text-white placeholder-gray-300 focus:border-white focus:outline-none transition-colors duration-300"
              :class="{ 'border-red-400': hasError }"
              required
            />
          </div>

          <!-- Mot de passe -->
          <div class="relative">
            <input 
              v-model="credentials.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Mot de passe"
              class="w-full px-0 py-4 bg-transparent border-0 border-b border-gray-600 text-white placeholder-gray-300 focus:border-white focus:outline-none transition-colors duration-300 pr-10"
              :class="{ 'border-red-400': hasError }"
              required
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-0 top-4 text-gray-300 hover:text-white transition-colors"
            >
              <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>

          <!-- Options -->
          <div class="flex items-center justify-between pt-2">
            <label class="flex items-center text-sm text-gray-300 cursor-pointer">
              <input 
                v-model="credentials.remember" 
                type="checkbox" 
                class="w-4 h-4 mr-2 bg-transparent border border-gray-600 rounded focus:ring-0 focus:ring-offset-0 text-white"
              />
              Se souvenir
            </label>
            <a href="#" class="text-sm text-gray-300 hover:text-white transition-colors">
              Mot de passe oublié ?
            </a>
          </div>

          <!-- Message d'erreur minimaliste -->
          <div v-if="hasError" class="text-red-300 text-sm text-center py-2">
            Identifiants incorrects
          </div>

          <!-- Bouton de connexion minimaliste -->
          <button 
            type="submit" 
            class="w-full py-4 mt-8 bg-white text-black font-medium rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
            :disabled="isLoading"
          >
            <span v-if="!isLoading">Se connecter</span>
            <span v-else class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Connexion...
            </span>
          </button>
        </form>

        <!-- Footer minimaliste -->
        <div class="text-center pt-8">
          <p class="text-gray-400 text-xs">© 2025 FMC Intranet</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notifications'
import type { LoginCredentials } from '@/shared/types/app'

const router = useRouter()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

const credentials = ref<LoginCredentials>({
  email: '',
  password: '',
  remember: false
})

const showPassword = ref(false)
const isLoading = ref(false)

const hasError = computed(() => {
  return authStore.error !== null
})

const handleLogin = async () => {
  if (isLoading.value) return
  
  isLoading.value = true
  
  try {
    const result = await authStore.login(credentials.value)
    
    if (authStore.isAuthenticated && result.success) {
      notificationStore.add({
        type: 'success',
        title: 'Connexion réussie',
        message: `Bienvenue ${authStore.userName} !`,
        duration: 2000
      })
      
      // Redirection conditionnelle selon le rôle
      if (authStore.isAdmin) {
        // Admin -> Dashboard intranet
        router.push('/dashboard')
      } else {
        // Utilisateur standard -> Site e-commerce (pour l'instant page temporaire)
        router.push('/boutique')
      }
    }
  } catch (error) {
    console.error('Erreur lors de la connexion:', error)
    notificationStore.add({
      type: 'error',
      title: 'Erreur',
      message: 'Connexion impossible',
      duration: 3000
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* Animation pour le bouton */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
}

/* Style pour les checkboxes personnalisées */
input[type="checkbox"]:checked {
  background-color: white;
  border-color: white;
}

input[type="checkbox"]:checked::before {
  content: "✓";
  color: black;
  font-size: 12px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

/* Suppression des styles par défaut du navigateur pour les checkboxes */
input[type="checkbox"] {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}
</style>
