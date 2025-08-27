<template>
  <div class="modal modal-open">
    <div class="modal-box bg-gray-800 border border-gray-700">
      <!-- En-tête -->
      <div class="flex items-center mb-6">
        <div class="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mr-4">
          <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <div>
          <h3 class="text-xl font-bold text-white">Confirmer la suppression</h3>
          <p class="text-gray-400">Cette action est irréversible</p>
        </div>
      </div>

      <!-- Informations de l'utilisateur -->
      <div v-if="user" class="bg-gray-700/50 rounded-lg p-4 mb-6">
        <div class="flex items-center space-x-4">
          <div class="avatar placeholder">
            <div class="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center">
              <span class="text-sm font-bold">{{ getInitials(user.name) }}</span>
            </div>
          </div>
          <div>
            <p class="font-semibold text-white">{{ user.name }}</p>
            <p class="text-sm text-gray-400">{{ user.email }}</p>
            <div class="flex space-x-2 mt-1">
              <span class="badge badge-sm" :class="user.is_admin ? 'badge-warning' : 'badge-info'">
                {{ user.is_admin ? 'Admin' : 'Utilisateur' }}
              </span>
              <span class="badge badge-sm" :class="user.is_active ? 'badge-success' : 'badge-error'">
                {{ user.is_active ? 'Actif' : 'Inactif' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Message d'avertissement -->
      <div class="alert alert-warning mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <div>
          <h4 class="font-bold">Attention !</h4>
          <p>Êtes-vous sûr de vouloir supprimer cet utilisateur ?</p>
          <ul class="list-disc list-inside mt-2 text-sm">
            <li>Toutes les données associées seront définitivement perdues</li>
            <li>L'historique des commandes sera conservé mais anonymisé</li>
            <li>Cette action ne peut pas être annulée</li>
          </ul>
        </div>
      </div>

      <!-- Confirmation par saisie -->
      <div class="form-control mb-6">
        <label class="label">
          <span class="label-text text-white">
            Pour confirmer, tapez le nom de l'utilisateur : <strong>{{ user?.name }}</strong>
          </span>
        </label>
        <input 
          v-model="confirmationText"
          type="text" 
          placeholder="Tapez le nom exact ici"
          class="input input-bordered w-full bg-gray-700 text-white border-gray-600 focus:border-red-500"
          :class="{ 'input-error': confirmationText && !isConfirmationValid }"
        />
      </div>

      <!-- Actions -->
      <div class="flex justify-end space-x-4">
        <button 
          @click="$emit('close')"
          class="btn btn-outline text-white border-gray-600 hover:bg-gray-700"
        >
          Annuler
        </button>
        
        <button 
          @click="handleConfirm"
          :disabled="!isConfirmationValid || isDeleting"
          class="btn btn-error"
          :class="{ 'loading': isDeleting }"
        >
          {{ isDeleting ? 'Suppression...' : 'Supprimer définitivement' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { User } from '../types';

// Props et émits
interface Props {
  user: User | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  confirm: []
}>()

// État local
const confirmationText = ref('')
const isDeleting = ref(false)

// Validation de la confirmation
const isConfirmationValid = computed(() => {
  return confirmationText.value === props.user?.name
})

// Actions
const handleConfirm = async () => {
  if (!isConfirmationValid.value) return

  isDeleting.value = true
  try {
    emit('confirm')
  } finally {
    isDeleting.value = false
  }
}

// Utilitaires
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2)
}
</script>

<style scoped>
.input-error {
  @apply border-red-500 focus:border-red-500;
}

.badge {
  @apply text-xs px-2 py-1 rounded-full font-medium;
}

.badge-info {
  @apply bg-blue-500/20 text-blue-400 border border-blue-500/30;
}

.badge-warning {
  @apply bg-yellow-500/20 text-yellow-400 border border-yellow-500/30;
}

.badge-success {
  @apply bg-green-500/20 text-green-400 border border-green-500/30;
}

.badge-error {
  @apply bg-red-500/20 text-red-400 border border-red-500/30;
}
</style>
