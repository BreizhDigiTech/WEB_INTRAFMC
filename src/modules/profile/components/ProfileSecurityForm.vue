<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h3 class="text-xl font-semibold text-white">Sécurité du compte</h3>
      <div class="flex items-center gap-2 text-green-400 text-sm">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Connexion sécurisée
      </div>
    </div>

    <!-- Informations de sécurité -->
    <div class="bg-gray-700/50 rounded-xl p-4 border border-gray-600">
      <h4 class="text-lg font-medium text-white mb-4">Informations de sécurité</h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <span class="text-gray-400">Dernière connexion :</span>
          <span class="text-white ml-2">Aujourd'hui</span>
        </div>
        <div>
          <span class="text-gray-400">Appareil :</span>
          <span class="text-white ml-2">{{ getBrowserInfo() }}</span>
        </div>
        <div>
          <span class="text-gray-400">Adresse IP :</span>
          <span class="text-white ml-2">127.0.0.1</span>
        </div>
        <div>
          <span class="text-gray-400">Authentification :</span>
          <span class="text-green-400 ml-2">JWT Token</span>
        </div>
      </div>
    </div>

    <!-- Alerte d'erreur -->
    <div v-if="error" class="alert alert-error">
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{{ error }}</span>
      <button @click="$emit('clear-error')" class="btn btn-sm btn-ghost">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Alerte de succès -->
    <div v-if="showSuccessMessage" class="alert alert-success">
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>Mot de passe changé avec succès !</span>
    </div>

    <!-- Formulaire de changement de mot de passe -->
    <div class="bg-gray-700/30 rounded-xl p-6 border border-gray-600">
      <h4 class="text-lg font-medium text-white mb-4 flex items-center gap-2">
        <svg class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        Changer le mot de passe
      </h4>
      
      <p class="text-gray-400 text-sm mb-6">
        Pour votre sécurité, utilisez un mot de passe fort contenant au moins 8 caractères avec des lettres, chiffres et symboles.
      </p>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Mot de passe actuel -->
        <div class="form-control">
          <label class="label">
            <span class="label-text text-white">Mot de passe actuel *</span>
          </label>
          <div class="relative">
            <input 
              v-model="form.current_password"
              :type="showCurrentPassword ? 'text' : 'password'"
              placeholder="Votre mot de passe actuel"
              class="input input-bordered w-full bg-gray-700 text-white border-gray-600 focus:border-blue-500 pr-12"
              :class="{ 'input-error': validationErrors.current_password }"
              required
            />
            <button 
              type="button"
              @click="showCurrentPassword = !showCurrentPassword"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <svg v-if="showCurrentPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>
          <label v-if="validationErrors.current_password" class="label">
            <span class="label-text-alt text-error">{{ validationErrors.current_password }}</span>
          </label>
        </div>

        <!-- Nouveau mot de passe -->
        <div class="form-control">
          <label class="label">
            <span class="label-text text-white">Nouveau mot de passe *</span>
          </label>
          <div class="relative">
            <input 
              v-model="form.new_password"
              :type="showNewPassword ? 'text' : 'password'"
              placeholder="Votre nouveau mot de passe"
              class="input input-bordered w-full bg-gray-700 text-white border-gray-600 focus:border-blue-500 pr-12"
              :class="{ 'input-error': validationErrors.new_password }"
              required
              @input="checkPasswordStrength"
            />
            <button 
              type="button"
              @click="showNewPassword = !showNewPassword"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <svg v-if="showNewPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>
          <label v-if="validationErrors.new_password" class="label">
            <span class="label-text-alt text-error">{{ validationErrors.new_password }}</span>
          </label>
          
          <!-- Indicateur de force du mot de passe -->
          <div v-if="form.new_password" class="mt-2">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-sm text-gray-400">Force du mot de passe :</span>
              <span :class="passwordStrengthColor" class="text-sm font-medium">{{ passwordStrengthText }}</span>
            </div>
            <div class="w-full bg-gray-600 rounded-full h-2">
              <div 
                :class="passwordStrengthColor.replace('text-', 'bg-')"
                class="h-2 rounded-full transition-all duration-300"
                :style="{ width: passwordStrengthWidth }"
              ></div>
            </div>
          </div>
        </div>

        <!-- Confirmation du nouveau mot de passe -->
        <div class="form-control">
          <label class="label">
            <span class="label-text text-white">Confirmer le nouveau mot de passe *</span>
          </label>
          <div class="relative">
            <input 
              v-model="form.confirm_password"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="Confirmez votre nouveau mot de passe"
              class="input input-bordered w-full bg-gray-700 text-white border-gray-600 focus:border-blue-500 pr-12"
              :class="{ 'input-error': validationErrors.confirm_password }"
              required
            />
            <button 
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <svg v-if="showConfirmPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>
          <label v-if="validationErrors.confirm_password" class="label">
            <span class="label-text-alt text-error">{{ validationErrors.confirm_password }}</span>
          </label>
        </div>

        <!-- Boutons d'action -->
        <div class="flex justify-between items-center pt-6 border-t border-gray-600">
          <button 
            type="button"
            @click="resetForm"
            class="btn btn-outline text-white border-gray-600 hover:bg-gray-700"
            :disabled="loading"
          >
            Annuler
          </button>

          <button 
            type="submit"
            :disabled="loading || !isFormValid"
            class="btn btn-primary"
            :class="{ 'loading': loading }"
          >
            {{ loading ? 'Changement...' : 'Changer le mot de passe' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Conseils de sécurité -->
    <div class="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
      <h4 class="text-blue-400 font-medium mb-2 flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Conseils de sécurité
      </h4>
      <ul class="text-sm text-blue-300 space-y-1">
        <li>• Utilisez un mot de passe unique pour ce compte</li>
        <li>• Combinez lettres majuscules, minuscules, chiffres et symboles</li>
        <li>• Évitez les informations personnelles évidentes</li>
        <li>• Changez votre mot de passe régulièrement</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { PasswordFormData } from '../types';

// Props
const _props = defineProps<{
  loading: boolean
  error: string | null
}>()

// Émissions
const emit = defineEmits<{
  'change-password': [formData: PasswordFormData]
  'clear-error': []
}>()

// État local
const form = ref<PasswordFormData>({
  current_password: '',
  new_password: '',
  confirm_password: ''
})

const validationErrors = ref({
  current_password: '',
  new_password: '',
  confirm_password: ''
})

const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const showSuccessMessage = ref(false)
const passwordStrength = ref(0)

// Computed
const isFormValid = computed(() => {
  return form.value.current_password && 
         form.value.new_password && 
         form.value.confirm_password &&
         form.value.new_password === form.value.confirm_password &&
         form.value.new_password.length >= 8
})

const passwordStrengthText = computed(() => {
  if (passwordStrength.value < 30) return 'Faible'
  if (passwordStrength.value < 60) return 'Moyen'
  if (passwordStrength.value < 80) return 'Fort'
  return 'Très fort'
})

const passwordStrengthColor = computed(() => {
  if (passwordStrength.value < 30) return 'text-red-400'
  if (passwordStrength.value < 60) return 'text-yellow-400'
  if (passwordStrength.value < 80) return 'text-blue-400'
  return 'text-green-400'
})

const passwordStrengthWidth = computed(() => {
  return `${passwordStrength.value}%`
})

// Méthodes
const checkPasswordStrength = () => {
  const password = form.value.new_password
  let strength = 0

  // Longueur
  if (password.length >= 8) strength += 20
  if (password.length >= 12) strength += 10

  // Caractères
  if (/[a-z]/.test(password)) strength += 15
  if (/[A-Z]/.test(password)) strength += 15
  if (/[0-9]/.test(password)) strength += 15
  if (/[^A-Za-z0-9]/.test(password)) strength += 15

  // Complexité
  if (password.length >= 16) strength += 10

  passwordStrength.value = Math.min(strength, 100)
}

const validateForm = (): boolean => {
  validationErrors.value = {
    current_password: '',
    new_password: '',
    confirm_password: ''
  }

  let isValid = true

  // Validation du mot de passe actuel
  if (!form.value.current_password) {
    validationErrors.value.current_password = 'Le mot de passe actuel est requis'
    isValid = false
  }

  // Validation du nouveau mot de passe
  if (!form.value.new_password) {
    validationErrors.value.new_password = 'Le nouveau mot de passe est requis'
    isValid = false
  } else if (form.value.new_password.length < 8) {
    validationErrors.value.new_password = 'Le mot de passe doit contenir au moins 8 caractères'
    isValid = false
  }

  // Validation de la confirmation
  if (!form.value.confirm_password) {
    validationErrors.value.confirm_password = 'La confirmation est requise'
    isValid = false
  } else if (form.value.new_password !== form.value.confirm_password) {
    validationErrors.value.confirm_password = 'Les mots de passe ne correspondent pas'
    isValid = false
  }

  // Vérifier que le nouveau mot de passe est différent de l'ancien
  if (form.value.current_password === form.value.new_password) {
    validationErrors.value.new_password = 'Le nouveau mot de passe doit être différent de l\'ancien'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (validateForm()) {
    try {
      emit('change-password', form.value)
      
      // Si pas d'erreur, afficher le message de succès et réinitialiser le formulaire
      showSuccessMessage.value = true
      resetForm()
      
      // Masquer le message de succès après 3 secondes
      setTimeout(() => {
        showSuccessMessage.value = false
      }, 3000)
    } catch (error) {
      // L'erreur sera gérée par le composant parent
    }
  }
}

const resetForm = () => {
  form.value = {
    current_password: '',
    new_password: '',
    confirm_password: ''
  }
  
  validationErrors.value = {
    current_password: '',
    new_password: '',
    confirm_password: ''
  }
  
  passwordStrength.value = 0
  showCurrentPassword.value = false
  showNewPassword.value = false
  showConfirmPassword.value = false
}

const getBrowserInfo = () => {
  const userAgent = navigator.userAgent
  if (userAgent.includes('Chrome')) return 'Chrome'
  if (userAgent.includes('Firefox')) return 'Firefox'
  if (userAgent.includes('Safari')) return 'Safari'
  if (userAgent.includes('Edge')) return 'Edge'
  return 'Navigateur inconnu'
}
</script>

<style scoped>
.input-error {
  @apply border-red-500 focus:border-red-500;
}

/* Animation pour les champs en erreur */
.input-error {
  animation: shake 0.3s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

/* Style pour les boutons de visibilité du mot de passe */
.password-toggle {
  transition: color 0.2s ease;
}

.password-toggle:hover {
  color: #3b82f6;
}
</style>
