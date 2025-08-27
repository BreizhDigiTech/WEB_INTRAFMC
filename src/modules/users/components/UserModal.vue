<template>
  <div class="modal modal-open">
    <div class="modal-box max-w-2xl bg-gray-800 border border-gray-700">
      <!-- En-tête -->
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-2xl font-bold text-white">
          {{ isEdit ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur' }}
        </h3>
        <button 
          @click="$emit('close')"
          class="btn btn-sm btn-circle btn-ghost text-white hover:bg-gray-700"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Formulaire -->
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Informations de base -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Nom complet -->
          <div class="form-control">
            <label class="label">
              <span class="label-text text-white">Nom complet *</span>
            </label>
            <input 
              v-model="form.name"
              type="text" 
              placeholder="Jean Dupont"
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
              <span class="label-text text-white">Email *</span>
            </label>
            <input 
              v-model="form.email"
              type="email" 
              placeholder="jean@example.com"
              class="input input-bordered w-full bg-gray-700 text-white border-gray-600 focus:border-blue-500"
              :class="{ 'input-error': validationErrors.email }"
              required
            />
            <label v-if="validationErrors.email" class="label">
              <span class="label-text-alt text-error">{{ validationErrors.email }}</span>
            </label>
          </div>
        </div>

        <!-- Mot de passe (uniquement en création) -->
        <div v-if="!isEdit" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="form-control">
            <label class="label">
              <span class="label-text text-white">Mot de passe *</span>
            </label>
            <input 
              v-model="form.password"
              type="password" 
              placeholder="••••••••"
              class="input input-bordered w-full bg-gray-700 text-white border-gray-600 focus:border-blue-500"
              :class="{ 'input-error': validationErrors.password }"
              required
            />
            <label v-if="validationErrors.password" class="label">
              <span class="label-text-alt text-error">{{ validationErrors.password }}</span>
            </label>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text text-white">Confirmer le mot de passe *</span>
            </label>
            <input 
              v-model="form.password_confirmation"
              type="password" 
              placeholder="••••••••"
              class="input input-bordered w-full bg-gray-700 text-white border-gray-600 focus:border-blue-500"
              :class="{ 'input-error': validationErrors.password_confirmation }"
              required
            />
            <label v-if="validationErrors.password_confirmation" class="label">
              <span class="label-text-alt text-error">{{ validationErrors.password_confirmation }}</span>
            </label>
          </div>
        </div>

        <!-- Informations complémentaires -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Téléphone -->
          <div class="form-control">
            <label class="label">
              <span class="label-text text-white">Téléphone</span>
            </label>
            <input 
              v-model="form.phone"
              type="tel" 
              placeholder="+33 6 12 34 56 78"
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
            placeholder="123 Rue de la Paix, 75001 Paris"
            class="textarea textarea-bordered w-full bg-gray-700 text-white border-gray-600 focus:border-blue-500 h-24"
          ></textarea>
        </div>

        <!-- Permissions et statut -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Statut administrateur -->
          <div class="form-control">
            <label class="label cursor-pointer">
              <span class="label-text text-white">Administrateur</span>
              <input 
                v-model="form.is_admin"
                type="checkbox" 
                class="checkbox checkbox-primary"
              />
            </label>
            <div class="text-sm text-gray-400 mt-1">
              Les administrateurs ont accès à toutes les fonctionnalités
            </div>
          </div>

          <!-- Statut actif -->
          <div class="form-control">
            <label class="label cursor-pointer">
              <span class="label-text text-white">Compte actif</span>
              <input 
                v-model="form.is_active"
                type="checkbox" 
                class="checkbox checkbox-primary"
              />
            </label>
            <div class="text-sm text-gray-400 mt-1">
              Les comptes inactifs ne peuvent pas se connecter
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end space-x-4 pt-6 border-t border-gray-700">
          <button 
            type="button"
            @click="$emit('close')"
            class="btn btn-outline text-white border-gray-600 hover:bg-gray-700"
          >
            Annuler
          </button>
          
          <button 
            type="submit"
            :disabled="isSubmitting || !isFormValid"
            class="btn btn-primary"
            :class="{ 'loading': isSubmitting }"
          >
            {{ isSubmitting ? 'Enregistrement...' : (isEdit ? 'Mettre à jour' : 'Créer l\'utilisateur') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import type { User, UserFormData } from '../types';

// Props et émits
interface Props {
  user?: User | null
  isEdit?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  user: null,
  isEdit: false
})

const emit = defineEmits<{
  close: []
  save: [formData: UserFormData]
}>()

// État du formulaire
const form = reactive<UserFormData>({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  phone: '',
  address: '',
  birth_date: '',
  is_admin: false,
  is_active: true
})

const validationErrors = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  phone: ''
})

const isSubmitting = ref(false)

// Validation du formulaire
const isFormValid = computed(() => {
  const hasRequiredFields = form.name.trim() && form.email.trim()
  const hasValidPassword = props.isEdit || (form.password && form.password_confirmation)
  const passwordsMatch = props.isEdit || form.password === form.password_confirmation
  
  return hasRequiredFields && hasValidPassword && passwordsMatch && !hasValidationErrors.value
})

const hasValidationErrors = computed(() => {
  return Object.values(validationErrors).some(error => error !== '')
})

// Validation en temps réel
watch(() => form.name, (newName) => {
  if (newName && newName.trim().length < 2) {
    validationErrors.name = 'Le nom doit contenir au moins 2 caractères'
  } else {
    validationErrors.name = ''
  }
})

watch(() => form.email, (newEmail) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (newEmail && !emailRegex.test(newEmail)) {
    validationErrors.email = 'L\'adresse email est invalide'
  } else {
    validationErrors.email = ''
  }
})

watch(() => form.password, (newPassword) => {
  if (!props.isEdit) {
    if (newPassword && newPassword.length < 8) {
      validationErrors.password = 'Le mot de passe doit contenir au moins 8 caractères'
    } else {
      validationErrors.password = ''
    }
  }
})

watch(() => form.password_confirmation, (newConfirmation) => {
  if (!props.isEdit) {
    if (newConfirmation && newConfirmation !== form.password) {
      validationErrors.password_confirmation = 'Les mots de passe ne correspondent pas'
    } else {
      validationErrors.password_confirmation = ''
    }
  }
})

watch(() => form.phone, (newPhone) => {
  if (newPhone && newPhone.trim()) {
    const phoneRegex = /^(?:(?:\+33|0)[1-9](?:[0-9]{8}))$/
    if (!phoneRegex.test(newPhone.replace(/[\s.-]/g, ''))) {
      validationErrors.phone = 'Le numéro de téléphone est invalide'
    } else {
      validationErrors.phone = ''
    }
  } else {
    validationErrors.phone = ''
  }
})

// Actions
const handleSubmit = async () => {
  if (!isFormValid.value) return

  isSubmitting.value = true
  try {
    emit('save', { ...form })
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  if (props.isEdit && props.user) {
    // Mode édition : pré-remplir avec les données existantes
    form.name = props.user.name
    form.email = props.user.email
    form.phone = props.user.phone || ''
    form.address = props.user.address || ''
    form.birth_date = props.user.birth_date || ''
    form.is_admin = props.user.is_admin
    form.is_active = props.user.is_active
    // Ne pas pré-remplir les mots de passe en mode édition
    form.password = ''
    form.password_confirmation = ''
  } else {
    // Mode création : formulaire vide
    Object.assign(form, {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      phone: '',
      address: '',
      birth_date: '',
      is_admin: false,
      is_active: true
    })
  }

  // Réinitialiser les erreurs
  Object.keys(validationErrors).forEach(key => {
    validationErrors[key as keyof typeof validationErrors] = ''
  })
}

// Lifecycle
onMounted(() => {
  resetForm()
})

// Watch pour réinitialiser le formulaire quand l'utilisateur change
watch(() => props.user, () => {
  resetForm()
}, { immediate: true })
</script>

<style scoped>
.input-error {
  @apply border-red-500 focus:border-red-500;
}

.modal-box {
  max-height: 90vh;
  overflow-y: auto;
}
</style>
