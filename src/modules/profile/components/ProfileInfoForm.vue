<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h3 class="text-xl font-semibold text-white">Informations personnelles</h3>
      <button 
        @click="handleSubmit"
        :disabled="loading || !hasChanges"
        class="btn btn-primary"
        :class="{ 'loading': loading }"
      >
        {{ loading ? 'Mise à jour...' : 'Sauvegarder' }}
      </button>
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

    <!-- Formulaire -->
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Nom complet -->
        <div class="form-control">
          <label class="label">
            <span class="label-text text-white">Nom complet *</span>
          </label>
          <input 
            v-model="form.name"
            type="text" 
            placeholder="Votre nom complet"
            class="input input-bordered w-full bg-gray-700 text-white border-gray-600 focus:border-blue-500"
            :class="{ 'input-error': validationErrors.name }"
            required
          />
          <label v-if="validationErrors.name" class="label">
            <span class="label-text-alt text-error">{{ validationErrors.name }}</span>
          </label>
        </div>

        <!-- Email -->
        <div class="form-control">
          <label class="label">
            <span class="label-text text-white">Adresse email *</span>
          </label>
          <input 
            v-model="form.email"
            type="email" 
            placeholder="votre@email.com"
            class="input input-bordered w-full bg-gray-700 text-white border-gray-600 focus:border-blue-500"
            :class="{ 'input-error': validationErrors.email }"
            required
          />
          <label v-if="validationErrors.email" class="label">
            <span class="label-text-alt text-error">{{ validationErrors.email }}</span>
          </label>
        </div>

        <!-- Téléphone -->
        <div class="form-control">
          <label class="label">
            <span class="label-text text-white">Téléphone</span>
          </label>
          <input 
            v-model="form.phone"
            type="tel" 
            placeholder="01 23 45 67 89"
            class="input input-bordered w-full bg-gray-700 text-white border-gray-600 focus:border-blue-500"
            :class="{ 'input-error': validationErrors.phone }"
          />
          <label v-if="validationErrors.phone" class="label">
            <span class="label-text-alt text-error">{{ validationErrors.phone }}</span>
          </label>
        </div>

        <!-- Date de naissance -->
        <div class="form-control">
          <label class="label">
            <span class="label-text text-white">Date de naissance</span>
          </label>
          <input 
            v-model="form.birth_date"
            type="date" 
            class="input input-bordered w-full bg-gray-700 text-white border-gray-600 focus:border-blue-500"
          />
        </div>
      </div>

      <!-- Adresse -->
      <div class="form-control">
        <label class="label">
          <span class="label-text text-white">Adresse</span>
        </label>
        <textarea 
          v-model="form.address"
          placeholder="Saisissez votre adresse"
          class="textarea textarea-bordered w-full bg-gray-700 text-white border-gray-600 focus:border-blue-500 h-24"
        ></textarea>
      </div>

      <!-- Informations de compte (lecture seule) -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="form-control">
          <label class="label">
            <span class="label-text text-white">Type de compte</span>
          </label>
          <input 
            :value="profile?.is_admin ? 'Administrateur' : 'Utilisateur'"
            type="text" 
            class="input input-bordered w-full bg-gray-600 text-gray-300 border-gray-600"
            readonly
          />
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text text-white">Statut du compte</span>
          </label>
          <input 
            :value="profile?.is_active ? 'Actif' : 'Inactif'"
            type="text" 
            class="input input-bordered w-full bg-gray-600 text-gray-300 border-gray-600"
            readonly
          />
        </div>
      </div>

      <!-- Boutons d'action -->
      <div class="flex justify-between items-center pt-6 border-t border-gray-700">
        <button 
          type="button"
          @click="resetForm"
          class="btn btn-outline text-white border-gray-600 hover:bg-gray-700"
          :disabled="loading"
        >
          Annuler les modifications
        </button>

        <button 
          type="submit"
          :disabled="loading || !hasChanges"
          class="btn btn-primary"
          :class="{ 'loading': loading }"
        >
          {{ loading ? 'Mise à jour...' : 'Sauvegarder les modifications' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { ProfileFormData, UserProfile } from '../types';

// Props
const props = defineProps<{
  profile: UserProfile | null
  loading: boolean
  error: string | null
}>()

// Émissions
const emit = defineEmits<{
  update: [formData: ProfileFormData]
  'clear-error': []
}>()

// État local
const form = ref<ProfileFormData>({
  name: '',
  email: '',
  phone: '',
  address: '',
  birth_date: ''
})

const originalForm = ref<ProfileFormData>({
  name: '',
  email: '',
  phone: '',
  address: '',
  birth_date: ''
})

const validationErrors = ref({
  name: '',
  email: '',
  phone: ''
})

// Computed
const hasChanges = computed(() => {
  return JSON.stringify(form.value) !== JSON.stringify(originalForm.value)
})

// Méthodes (déclarées avant les watchers)
const resetForm = () => {
  if (props.profile) {
    const formData = {
      name: props.profile.name || '',
      email: props.profile.email || '',
      phone: props.profile.phone || '',
      address: props.profile.address || '',
      birth_date: props.profile.birth_date ? props.profile.birth_date.split('T')[0] : ''
    }
    
    form.value = { ...formData }
    originalForm.value = { ...formData }
  }
  
  // Clear validation errors
  validationErrors.value = {
    name: '',
    email: '',
    phone: ''
  }
}

const validateForm = (): boolean => {
  validationErrors.value = {
    name: '',
    email: '',
    phone: ''
  }

  let isValid = true

  // Validation du nom
  if (!form.value.name.trim()) {
    validationErrors.value.name = 'Le nom est requis'
    isValid = false
  } else if (form.value.name.trim().length < 2) {
    validationErrors.value.name = 'Le nom doit contenir au moins 2 caractères'
    isValid = false
  }

  // Validation de l'email
  if (!form.value.email.trim()) {
    validationErrors.value.email = 'L\'email est requis'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    validationErrors.value.email = 'L\'adresse email n\'est pas valide'
    isValid = false
  }

  // Validation du téléphone (optionnel mais doit être valide si renseigné)
  if (form.value.phone.trim() && !/^(?:(?:\+33|0)[1-9](?:[0-9]{8}))$/.test(form.value.phone.replace(/[\s.-]/g, ''))) {
    validationErrors.value.phone = 'Le numéro de téléphone n\'est pas valide'
    isValid = false
  }

  return isValid
}

const handleSubmit = () => {
  if (validateForm()) {
    emit('update', form.value)
  }
}

// Watchers (après les méthodes)
watch(() => props.profile, (newProfile) => {
  if (newProfile) {
    resetForm()
  }
}, { immediate: true })
</script>

<style scoped>
.input-error {
  @apply border-red-500 focus:border-red-500;
}

.form-control {
  @apply mb-4;
}

.label-text {
  @apply font-medium;
}

.label-text-alt {
  @apply text-sm;
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
</style>
