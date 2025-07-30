<template>
  <dialog class="modal modal-open">
    <div class="modal-box max-w-2xl bg-gray-800 border border-gray-700 max-h-[90vh] overflow-y-auto">
      <form @submit.prevent="handleSubmit">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h3 class="font-bold text-2xl text-white">Modifier le produit</h3>
          <button
            type="button"
            @click="$emit('close')"
            class="btn btn-sm btn-circle btn-ghost text-gray-400 hover:text-white"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Form Content -->
        <div class="space-y-4">
          <!-- Nom -->
          <div class="form-control">
            <label class="label">
              <span class="label-text text-gray-300">Nom du produit *</span>
            </label>
            <input
              v-model="form.name"
              type="text"
              placeholder="Nom du produit"
              class="input input-bordered bg-gray-700 border-gray-600 text-white"
              :class="{ 'input-error': errors.name }"
              required
            >
            <label v-if="errors.name" class="label">
              <span class="label-text-alt text-error">{{ errors.name }}</span>
            </label>
          </div>

          <!-- Description -->
          <div class="form-control">
            <label class="label">
              <span class="label-text text-gray-300">Description</span>
            </label>
            <textarea
              v-model="form.description"
              placeholder="Description du produit"
              class="textarea textarea-bordered h-20 bg-gray-700 border-gray-600 text-white resize-none"
            ></textarea>
          </div>

          <!-- Prix et Stock -->
          <div class="grid grid-cols-2 gap-4">
            <div class="form-control">
              <label class="label">
                <span class="label-text text-gray-300">Prix (€) *</span>
              </label>
              <input
                v-model.number="form.price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                class="input input-bordered bg-gray-700 border-gray-600 text-white"
                :class="{ 'input-error': errors.price }"
                required
              >
              <label v-if="errors.price" class="label">
                <span class="label-text-alt text-error">{{ errors.price }}</span>
              </label>
            </div>

            <div class="form-control">
              <label class="label">
                <span class="label-text text-gray-300">Stock</span>
              </label>
              <input
                v-model.number="form.stock"
                type="number"
                min="0"
                placeholder="0"
                class="input input-bordered bg-gray-700 border-gray-600 text-white"
                :class="{ 'input-error': errors.stock }"
                required
              >
              <label v-if="errors.stock" class="label">
                <span class="label-text-alt text-error">{{ errors.stock }}</span>
              </label>
            </div>
          </div>

          <!-- Catégorie et Champs supplémentaires -->
          <div class="grid grid-cols-2 gap-4">
            <div class="form-control">
              <label class="label">
                <span class="label-text text-gray-300">Catégorie</span>
              </label>
              <select
                v-model.number="form.category_id"
                class="select select-bordered bg-gray-700 border-gray-600 text-white"
              >
                <option :value="undefined">Choisir une catégorie</option>
                <option
                  v-for="category in categoryStore.categories"
                  :key="category.id"
                  :value="parseInt(category.id)"
                >
                  {{ category.name }}
                </option>
              </select>
            </div>

            <div class="form-control">
              <label class="label">
                <span class="label-text text-gray-300">Fichier d'analyse</span>
              </label>
              <input
                v-model="form.analysis_file"
                type="text"
                placeholder="Nom du fichier d'analyse"
                class="input input-bordered bg-gray-700 border-gray-600 text-white"
              >
            </div>
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
        <div class="modal-action mt-6 pt-4 border-t border-gray-700">
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
            :disabled="loading"
          >
            Mettre à jour
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
import { ref, reactive, onMounted } from 'vue'
import { useProductStore } from '../stores/productStore'
import { useCategoryStore } from '../../categories/stores/categoryStore'
import type { Product, UpdateProductInput } from '../types'

// Props
const props = defineProps<{
  product: Product
}>()

// Stores
const productStore = useProductStore()
const categoryStore = useCategoryStore()

// Emits
const emit = defineEmits<{
  close: []
  updated: []
}>()

// État local
const loading = ref(false)

// Form data
const form = reactive<UpdateProductInput>({
  name: '',
  description: '',
  price: 0,
  stock: 0,
  category_id: undefined,
  images: [],
  analysis_file: ''
})

// Validation des erreurs
const errors = reactive<Record<string, string>>({})

// Fonctions
function validateForm(): boolean {
  Object.keys(errors).forEach(key => delete errors[key])
  
  if (!form.name?.trim()) {
    errors.name = 'Le nom est requis'
  }
  
  if (form.price !== undefined && form.price <= 0) {
    errors.price = 'Le prix doit être supérieur à 0'
  }
  
  if (form.stock !== undefined && form.stock < 0) {
    errors.stock = 'Le stock ne peut pas être négatif'
  }
  
  return Object.keys(errors).length === 0
}

async function handleSubmit() {
  if (!validateForm()) return
  
  loading.value = true
  
  try {
    await productStore.updateProduct(props.product.id, form)
    emit('updated')
  } catch (error: any) {
    errors.general = error.message || 'Erreur lors de la mise à jour du produit'
  } finally {
    loading.value = false
  }
}

// Initialisation
onMounted(async () => {
  // Charger les catégories
  await categoryStore.fetchCategories()
  
  // Remplir le formulaire avec les données existantes
  form.name = props.product.name
  form.description = props.product.description || ''
  form.price = props.product.price
  form.stock = props.product.stock
  form.category_id = props.product.category_id
  form.images = props.product.images || []
  form.analysis_file = props.product.analysis_file || ''
})
</script>

<style scoped>
/* Contrôle du défilement de la modal */
.modal-box {
  max-height: 90vh;
  overflow-y: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE et Edge */
}

/* Masquer la scrollbar dans WebKit */
.modal-box::-webkit-scrollbar {
  display: none;
}

/* Améliorer l'apparence des inputs */
.input:focus, .select:focus, .textarea:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

/* Contrôler la hauteur du textarea */
.textarea {
  resize: none;
  min-height: 80px;
  max-height: 120px;
}

/* Améliorer l'espacement dans les grilles */
.grid {
  gap: 1rem;
}

/* Style pour les alertes d'erreur */
.alert {
  border-radius: 0.75rem;
}
</style>
