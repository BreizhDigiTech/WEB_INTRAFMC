<template>
  <dialog class="modal modal-open">
    <div class="modal-box max-w-2xl bg-gray-800 border border-gray-700 max-h-[90vh] overflow-y-auto">
      <form @submit.prevent="handleSubmit">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h3 class="font-bold text-2xl text-white">Nouveau produit</h3>
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
              placeholder="Ex: CBD Oil 10%"
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
              placeholder="Description du produit..."
              class="textarea textarea-bordered bg-gray-700 border-gray-600 text-white h-20 resize-none"
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
                <span class="label-text text-gray-300">Stock initial *</span>
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

          <!-- Catégorie -->
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

          <!-- Images -->
          <div class="form-control">
            <label class="label">
              <span class="label-text text-gray-300">Images (URLs)</span>
            </label>
            <div class="space-y-2">
              <input
                v-for="(image, index) in (form.images || [])"
                :key="index"
                v-model="form.images![index]"
                type="url"
                :placeholder="`URL de l'image ${index + 1}`"
                class="input input-bordered bg-gray-700 border-gray-600 text-white"
              >
              <button
                type="button"
                @click="addImageField"
                class="btn btn-sm btn-outline btn-primary"
              >
                + Ajouter une image
              </button>
            </div>
          </div>

          <!-- Fichier d'analyse -->
          <div class="form-control">
            <label class="label">
              <span class="label-text text-gray-300">Fichier d'analyse</span>
            </label>
            <input
              v-model="form.analysis_file"
              type="text"
              placeholder="Nom ou chemin du fichier d'analyse"
              class="input input-bordered bg-gray-700 border-gray-600 text-white"
            >
            <label class="label">
              <span class="label-text-alt text-gray-500">
                Fichier PDF d'analyse du produit (optionnel)
              </span>
            </label>
          </div>

          <!-- Erreur générale -->
          <div v-if="errors.general" class="alert alert-error">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
            Créer le produit
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
import type { CreateProductInput } from '../types'

// Props & Emits
const emit = defineEmits<{
  close: []
  created: [product: any]
}>()

// Stores
const productStore = useProductStore()
const categoryStore = useCategoryStore()

// État local
const loading = ref(false)
const errors = reactive<Record<string, string>>({})

// Formulaire
const form = reactive<CreateProductInput>({
  name: '',
  description: '',
  price: 0,
  stock: 0,
  images: [''],
  analysis_file: '',
  category_id: undefined
})

// Charger les catégories
onMounted(async () => {
  try {
    await categoryStore.fetchCategories()
  } catch (error) {
    console.error('Erreur lors du chargement des catégories:', error)
  }
})

// Validation du formulaire
function validateForm(): boolean {
  // Réinitialiser les erreurs
  Object.keys(errors).forEach(key => delete errors[key])

  let isValid = true

  // Validation du nom
  if (!form.name.trim()) {
    errors.name = 'Le nom est requis'
    isValid = false
  } else if (form.name.length < 2) {
    errors.name = 'Le nom doit contenir au moins 2 caractères'
    isValid = false
  }

  // Validation du prix
  if (form.price <= 0) {
    errors.price = 'Le prix doit être supérieur à 0'
    isValid = false
  }

  // Validation du stock
  if (form.stock < 0) {
    errors.stock = 'Le stock ne peut pas être négatif'
    isValid = false
  }

  return isValid
}

// Ajouter un champ image
function addImageField() {
  if (!form.images) form.images = []
  form.images.push('')
}

// Soumission du formulaire
async function handleSubmit() {
  if (!validateForm()) {
    return
  }

  loading.value = true

  try {
    // Nettoyer les images vides
    const cleanedImages = form.images?.filter(img => img.trim() !== '') || []
    
    const productData = {
      ...form,
      images: cleanedImages.length > 0 ? cleanedImages : undefined,
      analysis_file: form.analysis_file?.trim() || undefined
    }

    const product = await productStore.createProduct(productData)
    emit('created', product)
    emit('close')
  } catch (error: any) {
    console.error('Erreur lors de la création:', error)
    errors.general = error.message || 'Erreur lors de la création du produit'
  } finally {
    loading.value = false
  }
}
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
