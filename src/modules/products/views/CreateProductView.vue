<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <!-- En-tête avec gradient -->
    <div class="bg-gradient-to-r from-green-900 via-emerald-900 to-teal-900">
      <div class="container mx-auto px-4 py-8">
        <div class="flex items-center justify-between">
          <!-- Navigation retour -->
          <div class="flex items-center space-x-4">
            <button @click="$router.back()" class="btn btn-ghost btn-circle text-white hover:bg-white/10">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1
                class="text-4xl font-bold mb-2 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Nouveau Produit CBD
              </h1>
              <p class="text-gray-300 text-lg">
                Ajoutez un nouveau produit à votre catalogue
              </p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center space-x-3">
            <button @click="$router.push('/products')" class="btn btn-ghost">
              Annuler
            </button>
            <button @click="saveProduct" :disabled="loading || !isFormValid" class="btn btn-success gap-2"
              :class="{ 'loading': loading }">
              <svg v-if="!loading" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              {{ loading ? 'Création...' : 'Créer le produit' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenu principal -->
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-6xl mx-auto">
        <form @submit.prevent="saveProduct" class="space-y-8">

          <!-- Section Informations de base -->
          <div class="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <h2 class="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <div class="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              Informations de base
            </h2>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Nom du produit -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text text-gray-300 font-medium">Nom du produit *</span>
                </label>
                <input v-model="form.name" type="text" placeholder="Ex: Huile CBD Premium 10%"
                  class="input input-bordered bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                  required />
                <label v-if="errors.name" class="label">
                  <span class="label-text-alt text-error">{{ errors.name }}</span>
                </label>
              </div>

              <!-- Prix -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text text-gray-300 font-medium">Prix (€) *</span>
                </label>
                <input v-model.number="form.price" type="number" step="0.01" min="0" placeholder="29.99"
                  class="input input-bordered bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                  required />
                <label v-if="errors.price" class="label">
                  <span class="label-text-alt text-error">{{ errors.price }}</span>
                </label>
              </div>

              <!-- Stock -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text text-gray-300 font-medium">Stock initial *</span>
                </label>
                <input v-model.number="form.stock" type="number" min="0" placeholder="100"
                  class="input input-bordered bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                  required />
                <label v-if="errors.stock" class="label">
                  <span class="label-text-alt text-error">{{ errors.stock }}</span>
                </label>
              </div>

              <!-- Catégorie -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text text-gray-300 font-medium">Catégorie</span>
                </label>
                <select v-model.number="form.category_id"
                  class="select select-bordered bg-gray-700 border-gray-600 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500">
                  <option value="">Choisir une catégorie</option>
                  <option v-for="category in categoryStore.categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Description -->
            <div class="form-control mt-6">
              <label class="label">
                <span class="label-text text-gray-300 font-medium">Description</span>
              </label>
              <textarea v-model="form.description" placeholder="Description détaillée du produit..."
                class="textarea textarea-bordered bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500 min-h-24"
                rows="4"></textarea>
            </div>
          </div>

          <!-- Section Images -->
          <div class="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <h2 class="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <div class="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              Images du produit
            </h2>

            <!-- Zone de téléchargement d'images -->
            <div class="space-y-4">
              <div @drop="handleDrop" @dragover.prevent @dragenter.prevent
                class="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
                :class="{ 'border-blue-500 bg-blue-500/5': isDragging }">
                <input ref="fileInput" type="file" multiple accept="image/*" @change="handleFileSelect"
                  class="hidden" />
                <div class="space-y-3">
                  <div class="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mx-auto">
                    <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-gray-300 font-medium">Glissez vos images ici ou</p>
                    <button type="button" @click="(fileInput as unknown as HTMLInputElement).click()"
                      class="text-blue-400 hover:text-blue-300 font-medium">
                      cliquez pour parcourir
                    </button>
                  </div>
                  <p class="text-sm text-gray-500">PNG, JPG, WEBP jusqu'à 5MB chacune</p>
                </div>
              </div>

              <!-- Prévisualisation des images -->
              <div v-if="selectedImages.length" class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div v-for="(image, index) in selectedImages" :key="index" class="relative group">
                  <img :src="image.preview" :alt="`Image ${index + 1}`"
                    class="w-full h-32 object-cover rounded-lg border border-gray-600" />
                  <button type="button" @click="removeImage(index)"
                    class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Section Fichier d'analyse -->
          <div class="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <h2 class="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <div class="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              Certificat d'analyse (optionnel)
            </h2>

            <div @drop="handleAnalysisFileDrop" @dragover.prevent @dragenter.prevent
              class="border-2 border-dashed border-gray-600 rounded-xl p-6 text-center hover:border-purple-500 transition-colors cursor-pointer">
              <input ref="analysisFileInput" type="file" accept=".pdf" @change="handleAnalysisFileSelect"
                class="hidden" />
              <div v-if="!analysisFile" class="space-y-3">
                <div class="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mx-auto">
                  <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div>
                  <p class="text-gray-300 font-medium">Glissez le certificat d'analyse ou</p>
                  <button type="button" @click="(analysisFileInput as unknown as HTMLInputElement).click()"
                    class="text-purple-400 hover:text-purple-300 font-medium">
                    cliquez pour parcourir
                  </button>
                </div>
                <p class="text-sm text-gray-500">PDF jusqu'à 10MB</p>
              </div>

              <div v-else class="flex items-center justify-between bg-gray-700 rounded-lg p-4">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-white font-medium">{{ analysisFile.name }}</p>
                    <p class="text-sm text-gray-400">{{ formatFileSize(analysisFile.size) }}</p>
                  </div>
                </div>
                <button type="button" @click="removeAnalysisFile"
                  class="w-8 h-8 bg-red-500/20 hover:bg-red-500/30 rounded-lg flex items-center justify-center">
                  <svg class="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Actions finales -->
          <div class="flex justify-end space-x-4 pt-6 border-t border-gray-700">
            <button type="button" @click="$router.push('/products')" class="btn btn-ghost">
              Annuler
            </button>
            <button type="submit" :disabled="loading || !isFormValid" class="btn btn-success btn-lg gap-2"
              :class="{ 'loading': loading }">
              <svg v-if="!loading" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              {{ loading ? 'Création...' : 'Créer le produit' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCategoryStore } from '../../categories/stores/categoryStore'
import { productService } from '../services/productService'
import { useProductStore } from '../stores/productStore'
import type { CreateProductInput } from '../types'

// Router et stores
const router = useRouter()
const categoryStore = useCategoryStore()
const productStore = useProductStore()

// État local
const loading = ref(false)
const isDragging = ref(false)
const selectedImages = ref<Array<{ file: File; preview: string }>>([])
const analysisFile = ref<File | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const analysisFileInput = ref<HTMLInputElement | null>(null)

// Formulaire
const form = reactive<CreateProductInput>({
  name: '',
  description: '',
  price: 0,
  stock: 0,
  image_urls: [],
  category_id: undefined,
  analysis_file_url: ''  // Corrigé selon l'erreur GraphQL
})

// Erreurs de validation
const errors = reactive({
  name: '',
  price: '',
  stock: ''
})

// Validation du formulaire
const isFormValid = computed(() => {
  return form.name.trim() !== '' &&
    form.price > 0 &&
    form.stock >= 0 &&
    Object.values(errors).every(error => error === '')
})

// Gestion des images
const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    addImages(Array.from(target.files))
  }
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragging.value = false

  if (event.dataTransfer?.files) {
    addImages(Array.from(event.dataTransfer.files))
  }
}

const addImages = (files: File[]) => {
  files.forEach(file => {
    if (file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024) {
      const reader = new FileReader()
      reader.onload = (e) => {
        selectedImages.value.push({
          file,
          preview: e.target?.result as string
        })
      }
      reader.readAsDataURL(file)
    } else {
      console.warn('Image ignorée (type ou taille invalide)')
    }
  })
}

const removeImage = (index: number) => {
  selectedImages.value.splice(index, 1)
}

// Gestion du fichier d'analyse
const handleAnalysisFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    if (file.type === 'application/pdf' && file.size <= 10 * 1024 * 1024) {
      analysisFile.value = file
    } else {
      console.warn('Certificat ignoré (doit être PDF ≤ 10MB)')
    }
  }
}

const handleAnalysisFileDrop = (event: DragEvent) => {
  event.preventDefault()

  if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
    const file = event.dataTransfer.files[0]
    if (file.type === 'application/pdf' && file.size <= 10 * 1024 * 1024) {
      analysisFile.value = file
    } else {
      console.warn('Certificat ignoré (doit être PDF ≤ 10MB)')
    }
  }
}

const removeAnalysisFile = () => {
  analysisFile.value = null
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Validation
const validateForm = () => {
  errors.name = form.name.trim() === '' ? 'Le nom est requis' : ''
  errors.price = form.price <= 0 ? 'Le prix doit être supérieur à 0' : ''
  errors.stock = form.stock < 0 ? 'Le stock ne peut pas être négatif' : ''
}

// Sauvegarde du produit
const saveProduct = async () => {
  validateForm()

  if (!isFormValid.value) {
    return
  }

  loading.value = true

  try {
    // Préparer les données
    const baseInput = {
      name: form.name,
      description: form.description,
      price: form.price,
      stock: form.stock,
      category_id:
        (form as any).category_id !== undefined && (form as any).category_id !== null && (form as any).category_id !== ''
          ? Number((form as any).category_id)
          : undefined
    }

    let newProduct

    // Préparer les fichiers si présents
    const imageFiles = selectedImages.value.map(img => img.file)
    const analysisFileValue = analysisFile.value

    try {
      console.log('=== DÉBUT CRÉATION PRODUIT (2 ÉTAPES) ===')
      console.log('Form:', form)
      console.log('Images sélectionnées:', imageFiles.length, imageFiles.map(f => f.name))
      console.log('Fichier analyse:', analysisFileValue?.name || 'Aucun')
      
      // ÉTAPE 1: Créer le produit de base (sans fichiers)
      const productInput: CreateProductInput = {
        name: form.name,
        description: form.description || '',
        price: Number(form.price),
        stock: Number(form.stock)
      }
      
      // Ajouter category_id seulement s'il est défini
      if ((form as any).category_id !== undefined && (form as any).category_id !== null && (form as any).category_id !== '') {
        (productInput as any).category_id = Number((form as any).category_id)
      }
      
      console.log('ÉTAPE 1 - Données produit de base:', productInput)
      newProduct = await productService.createProduct(productInput)
      console.log('✅ ÉTAPE 1 - Produit créé avec succès (ID:', newProduct.id, '):', newProduct)
      
      // ÉTAPE 2: Upload des images si présentes
      if (imageFiles.length > 0) {
        try {
          console.log('ÉTAPE 2 - Upload des images pour le produit', newProduct.id)
          const imageUrls = await productService.uploadProductImages(newProduct.id, imageFiles)
          console.log('✅ ÉTAPE 2 - Images uploadées avec succès:', imageUrls)
          
          // Recharger le produit pour avoir les URLs des images
          const updatedProduct = await productService.getProductById(newProduct.id)
          console.log('Produit mis à jour avec images:', updatedProduct)
          newProduct = updatedProduct
        } catch (uploadError: any) {
          console.warn('⚠️ ÉTAPE 2 - Erreur lors de l\'upload des images (produit créé sans images):', uploadError)
          // Le produit est créé mais sans images, ce n'est pas grave
        }
      }
      
      // ÉTAPE 3: Upload du fichier d'analyse si présent (TODO: à implémenter)
      if (analysisFileValue) {
        console.log('ÉTAPE 3 - Fichier d\'analyse détecté mais upload pas encore implémenté')
        // TODO: Implémenter l'upload du fichier d'analyse
      }
      
    } catch (createError: any) {
      console.error('❌ Erreur lors de la création du produit:', createError)
      
      // Si on a des détails sur l'erreur GraphQL
      if (createError.response?.errors) {
        console.error('Erreurs GraphQL détaillées:', createError.response.errors)
      }
      
      throw createError
    }

    // Rediriger vers la liste des produits
    router.push('/products')

  } catch (error) {
    console.error('Erreur lors de la création du produit:', error)
    // Gérer l'erreur (notification, etc.)
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(async () => {
  await categoryStore.fetchCategories()
})
</script>
