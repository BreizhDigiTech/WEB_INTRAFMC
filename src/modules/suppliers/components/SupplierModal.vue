<template>
  <dialog class="modal modal-open">
    <div class="modal-box max-w-md bg-gray-800 border border-gray-700">
      <form @submit.prevent="handleSubmit">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h3 class="font-bold text-xl text-white">
            {{ isEditing ? 'Modifier le fournisseur' : 'Nouveau fournisseur' }}
          </h3>
          <button
            type="button"
            @click="$emit('close')"
            class="btn btn-sm btn-circle btn-ghost text-gray-400 hover:text-white"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Form Content -->
        <div class="space-y-4">
          <!-- Nom -->
          <div class="form-control">
            <label class="label">
              <span class="label-text text-gray-300">Nom du fournisseur *</span>
            </label>
            <input
              v-model="form.name"
              type="text"
              placeholder="Nom du fournisseur"
              class="input input-bordered bg-gray-700 border-gray-600 text-white"
              :class="{ 'input-error': errors.name }"
              required
              autofocus
            >
            <label v-if="errors.name" class="label">
              <span class="label-text-alt text-error">{{ errors.name }}</span>
            </label>
          </div>

          <!-- Email de contact -->
          <div class="form-control">
            <label class="label">
              <span class="label-text text-gray-300">Email de contact *</span>
            </label>
            <input
              v-model="form.contact_email"
              type="email"
              placeholder="contact@exemple.com"
              class="input input-bordered bg-gray-700 border-gray-600 text-white"
              :class="{ 'input-error': errors.contact_email }"
              required
            >
            <label v-if="errors.contact_email" class="label">
              <span class="label-text-alt text-error">{{ errors.contact_email }}</span>
            </label>
          </div>

          <!-- Téléphone -->
          <div class="form-control">
            <label class="label">
              <span class="label-text text-gray-300">Téléphone</span>
            </label>
            <input
              v-model="form.phone"
              type="tel"
              placeholder="+33 1 23 45 67 89"
              class="input input-bordered bg-gray-700 border-gray-600 text-white"
              :class="{ 'input-error': errors.phone }"
            >
            <label v-if="errors.phone" class="label">
              <span class="label-text-alt text-error">{{ errors.phone }}</span>
            </label>
          </div>

          <!-- Adresse -->
          <div class="form-control">
            <label class="label">
              <span class="label-text text-gray-300">Adresse</span>
            </label>
            <textarea
              v-model="form.address"
              placeholder="Adresse complète du fournisseur"
              class="textarea textarea-bordered bg-gray-700 border-gray-600 text-white resize-none h-20"
              :class="{ 'textarea-error': errors.address }"
            ></textarea>
            <label v-if="errors.address" class="label">
              <span class="label-text-alt text-error">{{ errors.address }}</span>
            </label>
          </div>

          <!-- Erreur générale -->
          <div v-if="errors.general" class="alert alert-error">
            <svg class="stroke-current shrink-0 w-6 h-6" fill="none" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ errors.general }}</span>
          </div>
        </div>

        <!-- Actions -->
        <div class="modal-action mt-6">
          <button
            type="button"
            @click="$emit('close')"
            class="btn btn-ghost"
          >
            Annuler
          </button>
          <button
            type="submit"
            class="btn btn-primary"
            :class="{ 'loading': loading }"
            :disabled="loading || !isFormValid"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            {{ isEditing ? 'Mettre à jour' : 'Créer' }}
          </button>
        </div>
      </form>
    </div>
    
    <!-- Backdrop pour fermer la modal -->
    <form method="dialog" class="modal-backdrop">
      <button @click="$emit('close')">Fermer</button>
    </form>
  </dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useSupplierStore } from '../stores/supplierStore'
import type { Supplier, CreateSupplierInput, UpdateSupplierInput } from '../types'

// Props
const props = defineProps<{
  supplier?: Supplier | null
}>()

// Emits
const emit = defineEmits<{
  close: []
  saved: []
}>()

// Store
const supplierStore = useSupplierStore()

// État local
const loading = ref(false)
const form = reactive<CreateSupplierInput & UpdateSupplierInput>({
  name: '',
  contact_email: '',
  phone: '',
  address: ''
})

// Validation des erreurs
const errors = reactive<Record<string, string>>({})

// Computed
const isEditing = computed(() => !!props.supplier)

const isFormValid = computed(() => {
  return form.name.trim() && 
         form.contact_email.trim() && 
         /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contact_email)
})

// Fonctions
function validateForm(): boolean {
  Object.keys(errors).forEach(key => delete errors[key])
  
  if (!form.name?.trim()) {
    errors.name = 'Le nom est requis'
  }
  
  if (!form.contact_email?.trim()) {
    errors.contact_email = 'L\'email de contact est requis'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contact_email)) {
    errors.contact_email = 'L\'email n\'est pas valide'
  }
  
  if (form.phone && form.phone.trim() && !/^[\+]?[\d\s\-\(\)\.]{10,}$/.test(form.phone.trim())) {
    errors.phone = 'Le numéro de téléphone n\'est pas valide'
  }
  
  return Object.keys(errors).length === 0
}

async function handleSubmit() {
  if (!validateForm()) return
  
  loading.value = true
  
  try {
    if (isEditing.value && props.supplier) {
      await supplierStore.updateSupplier(props.supplier.id, form)
    } else {
      await supplierStore.createSupplier(form)
    }
    emit('saved')
  } catch (error: any) {
    errors.general = error.message || 'Erreur lors de l\'enregistrement du fournisseur'
  } finally {
    loading.value = false
  }
}

// Initialisation
onMounted(() => {
  if (props.supplier) {
    form.name = props.supplier.name
    form.contact_email = props.supplier.contact_email
    form.phone = props.supplier.phone || ''
    form.address = props.supplier.address || ''
  }
})
</script>

<style scoped>
/* Améliorer l'apparence des inputs */
.input:focus, .textarea:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

/* Style pour les alertes d'erreur */
.alert {
  border-radius: 0.75rem;
}
</style>
