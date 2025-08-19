<template>
  <dialog class="modal modal-open">
    <div class="modal-box max-w-4xl bg-gray-800 border border-gray-700">
      <form @submit.prevent="handleSubmit">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h3 class="font-bold text-2xl text-white">Créer un nouveau produit</h3>
          <button type="button" @click="$emit('close')"
            class="btn btn-sm btn-circle btn-ghost text-gray-400 hover:text-white">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Form Content -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Colonne gauche - Informations de base -->
          <div class="space-y-4">
            <h4 class="text-lg font-semibold text-white border-b border-gray-700 pb-2">
              Informations de base
            </h4>

            <!-- Nom -->
            <div class="form-control">
              <label class="label">
                <span class="label-text text-gray-300">Nom du produit *</span>
              </label>
              <input v-model="form.name" type="text" placeholder="Nom du produit"
                class="input input-bordered bg-gray-700 border-gray-600 text-white"
                :class="{ 'input-error': errors.name }" required>
              <label v-if="errors.name" class="label">
                <span class="label-text-alt text-error">{{ errors.name }}</span>
              </label>
            </div>

            <!-- Description -->
            <div class="form-control">
              <label class="label">
                <span class="label-text text-gray-300">Description</span>
              </label>
              <textarea v-model="form.description" placeholder="Description du produit"
                class="textarea textarea-bordered h-24 bg-gray-700 border-gray-600 text-white"
                :class="{ 'textarea-error': errors.description }"></textarea>
              <label v-if="errors.description" class="label">
                <span class="label-text-alt text-error">{{ errors.description }}</span>
              </label>
            </div>

            <!-- Prix et Stock -->
            <div class="grid grid-cols-2 gap-4">
              <div class="form-control">
                <label class="label">
                  <span class="label-text text-gray-300">Prix (€) *</span>
                </label>
                <input v-model.number="form.price" type="number" step="0.01" min="0" placeholder="0.00"
                  class="input input-bordered bg-gray-700 border-gray-600 text-white"
                  :class="{ 'input-error': errors.price }" required>
                <label v-if="errors.price" class="label">
                  <span class="label-text-alt text-error">{{ errors.price }}</span>
                </label>
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text text-gray-300">Stock initial *</span>
                </label>
                <input v-model.number="form.stock" type="number" min="0" placeholder="0"
                  class="input input-bordered bg-gray-700 border-gray-600 text-white"
                  :class="{ 'input-error': errors.stock }" required>
                <label v-if="errors.stock" class="label">
                  <span class="label-text-alt text-error">{{ errors.stock }}</span>
                </label>
              </div>
            </div>

            <!-- Catégorie -->
            <div class="grid grid-cols-2 gap-4">
              <div class="form-control">
                <label class="label">
                  <span class="label-text text-gray-300">Catégorie</span>
                </label>
                <select v-model.number="form.category_id"
                  class="select select-bordered bg-gray-700 border-gray-600 text-white">
                  <option :value="undefined">Choisir une catégorie</option>
                  <option v-for="category in categoryStore.categories" :key="category.id"
                    :value="parseInt(category.id)">
                    {{ category.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <!-- Colonne droite - Détails et image -->
          <div class="space-y-4">
            <h4 class="text-lg font-semibold text-white border-b border-gray-700 pb-2">
              Détails et image
            </h4>

            <!-- Upload d'image -->
            <div class="form-control">
              <label class="label">
                <span class="label-text text-gray-300">Image du produit</span>
              </label>
              <div class="flex items-center gap-4">
                <!-- Aperçu de l'image -->
                <div
                  class="w-24 h-24 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center overflow-hidden">
                  <img v-if="imagePreview" :src="imagePreview" alt="Aperçu" class="w-full h-full object-cover">
                  <div v-else class="text-gray-500 text-center">
                    <svg class="w-8 h-8 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span class="text-xs">Image</span>
                  </div>
                </div>

                <!-- Upload -->
                <div class="flex-1">
                  <input ref="fileInput" type="file" accept="image/*" @change="handleImageUpload"
                    class="file-input file-input-bordered file-input-sm bg-gray-700 border-gray-600 text-white w-full">
                  <p class="text-xs text-gray-400 mt-1">
                    Formats acceptés: JPG, PNG, WebP (max 5MB)
                  </p>
                </div>
              </div>
            </div>

            <!-- SKU et Code-barres -->
            <div class="grid grid-cols-2 gap-4">
              <div class="form-control">
                <label class="label">
                  <span class="label-text text-gray-300">SKU</span>
                  <button type="button" @click="generateAutoSKU"
                    class="label-text-alt text-blue-400 hover:text-blue-300">
                    Générer auto
                  </button>
                </label>
                <input v-model="form.sku" type="text" placeholder="SKU-123"
                  class="input input-bordered input-sm bg-gray-700 border-gray-600 text-white">
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text text-gray-300">Code-barres</span>
                </label>
                <input v-model="form.barcode" type="text" placeholder="1234567890123"
                  class="input input-bordered input-sm bg-gray-700 border-gray-600 text-white"
                  :class="{ 'input-error': errors.barcode }">
                <label v-if="errors.barcode" class="label">
                  <span class="label-text-alt text-error">{{ errors.barcode }}</span>
                </label>
              </div>
            </div>

            <!-- Poids et Dimensions -->
            <div class="grid grid-cols-2 gap-4">
              <div class="form-control">
                <label class="label">
                  <span class="label-text text-gray-300">Poids (kg)</span>
                </label>
                <input v-model.number="form.weight" type="number" step="0.001" min="0" placeholder="0.000"
                  class="input input-bordered input-sm bg-gray-700 border-gray-600 text-white">
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text text-gray-300">Dimensions (LxlxH)</span>
                </label>
                <input v-model="form.dimensions" type="text" placeholder="10x5x2"
                  class="input input-bordered input-sm bg-gray-700 border-gray-600 text-white">
              </div>
            </div>

            <!-- Seuil de stock faible -->
            <div class="form-control">
              <label class="label">
                <span class="label-text text-gray-300">Seuil de stock faible</span>
                <span class="label-text-alt text-gray-400">Défaut: 10</span>
              </label>
              <input v-model.number="form.low_stock_threshold" type="number" min="0" placeholder="10"
                class="input input-bordered input-sm bg-gray-700 border-gray-600 text-white">
            </div>

            <!-- Tags -->
            <div class="form-control">
              <label class="label">
                <span class="label-text text-gray-300">Tags</span>
              </label>
              <div class="flex flex-wrap gap-2 mb-2">
                <span v-for="tag in form.tags" :key="tag" class="badge badge-primary gap-2">
                  {{ tag }}
                  <button type="button" @click="removeTag(tag)" class="btn btn-xs btn-circle btn-ghost">
                    ×
                  </button>
                </span>
              </div>
              <div class="flex gap-2">
                <input v-model="newTag" type="text" placeholder="Ajouter un tag"
                  class="input input-bordered input-sm bg-gray-700 border-gray-600 text-white flex-1"
                  @keydown.enter.prevent="addTag">
                <button type="button" @click="addTag" class="btn btn-sm btn-primary">
                  Ajouter
                </button>
              </div>
            </div>

            <!-- Statut actif -->
            <div class="form-control">
              <label class="label cursor-pointer">
                <span class="label-text text-gray-300">Produit actif</span>
                <input v-model="form.is_active" type="checkbox" class="toggle toggle-primary">
              </label>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="modal-action mt-8 pt-6 border-t border-gray-700">
          <button type="button" @click="$emit('close')" class="btn btn-ghost">
            Annuler
          </button>
          <button type="submit" class="btn btn-primary" :class="{ 'loading': loading }" :disabled="loading">
            Créer le produit
          </button>
        </div>
      </form>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useCategoryStore } from '../../categories/stores/categoryStore'
import { productService } from '../services/productService'
import { useProductStore } from '../stores/productStore'
import type { CreateProductInput } from '../types'
import { generateSKU, validateBarcode } from '../utils/formatters'

// Stores
const categoryStore = useCategoryStore()
const productStore = useProductStore()

// Emits
const emit = defineEmits<{
  close: []
  created: []
}>()

// État local
const loading = ref(false)
const fileInput = ref<HTMLInputElement>()
const imageFile = ref<File | null>(null)
const imagePreview = ref<string>('')
const newTag = ref('')

// Form data
const form = reactive<CreateProductInput>({
  name: '',
  description: '',
  price: 0,
  stock: 0,
  images: [''],
  analysis_file: '',
  category_id: undefined
})

// Validation des erreurs
const errors = reactive<Record<string, string>>({})

// Fonctions

function validateForm() {
  // Réinitialise les erreurs
  Object.keys(errors).forEach(key => delete errors[key])

  if (!form.name.trim()) {
    errors.name = 'Le nom est requis'
  }
  if (form.price <= 0) {
    errors.price = 'Le prix doit être supérieur à 0'
  }
  if (form.stock < 0) {
    errors.stock = 'Le stock ne peut pas être négatif'
  }
  if (form.barcode && !validateBarcode(form.barcode)) {
    errors.barcode = 'Code-barres invalide (format EAN-13 requis)'
  }
  // Ajoutez d'autres validations si besoin
  return Object.keys(errors).length === 0
}
function handleImageUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file) {
    // Validation de la taille (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      errors.image = 'Le fichier est trop volumineux (max 5MB)'
      return
    }

    // Validation du type
    if (!file.type.startsWith('image/')) {
      errors.image = 'Le fichier doit être une image'
      return
    }

    imageFile.value = file

    // Aperçu
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)

    delete errors.image
  }
}


function addTag() {
  const tag = newTag.value.trim()
  if (tag && !form.tags?.includes(tag)) {
    if (!form.tags) form.tags = []
    form.tags.push(tag)
    newTag.value = ''
  }
}

function removeTag(tag: string) {
  if (form.tags) {
    form.tags = form.tags.filter(t => t !== tag)
  }
}

function generateAutoSKU() {
  const categoryName = categoryStore.categories.find(c => Number(c.id) === (form.category_id ?? NaN))?.name
  form.sku = generateSKU(form.name, categoryName)
  if (!form.name.trim()) {
    errors.name = 'Le nom est requis'
  }

  if (form.price <= 0) {
    errors.price = 'Le prix doit être supérieur à 0'
  }

  if (form.stock < 0) {
    errors.stock = 'Le stock ne peut pas être négatif'
  }

  if (form.barcode && !validateBarcode(form.barcode)) {
    errors.barcode = 'Code-barres invalide (format EAN-13 requis)'
  }

  return Object.keys(errors).length === 0
}

async function handleSubmit() {
  if (!validateForm()) return

  loading.value = true

  try {
    // Upload de l'image si présente
    if (imageFile.value) {
      try {
        form.image_url = await productService.uploadProductImage(imageFile.value)
      } catch (error) {
        console.warn('Erreur lors de l\'upload de l\'image:', error)
        // Continue sans image
      }
    }

    // Création du produit
    await productStore.createProduct(form)
    emit('created')
  } catch (error: any) {
    errors.general = error.message || 'Erreur lors de la création du produit'
  } finally {
    loading.value = false
  }
}

// Initialisation
onMounted(async () => {
  await categoryStore.fetchCategories()
})
</script>
