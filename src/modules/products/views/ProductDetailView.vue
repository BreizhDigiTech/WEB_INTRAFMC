<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <!-- Chargement -->
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="loading loading-spinner loading-lg text-blue-500 mb-4"></div>
        <p class="text-gray-400">Chargement du produit...</p>
      </div>
    </div>

    <!-- Erreur -->
    <div v-else-if="error" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-red-400 mb-2">Erreur</h3>
        <p class="text-gray-400 mb-4">{{ error }}</p>
        <button @click="$router.push('/products')" class="btn btn-primary">
          Retour aux produits
        </button>
      </div>
    </div>

    <!-- Contenu principal -->
    <div v-else-if="product">
      <!-- En-tête -->
      <div class="bg-gradient-to-r from-green-900 via-emerald-900 to-teal-900">
        <div class="container mx-auto px-4 py-8">
          <div class="flex items-center justify-between">
            <!-- Navigation retour et titre -->
            <div class="flex items-center space-x-4">
              <button @click="$router.push('/products')" class="btn btn-ghost btn-circle text-white hover:bg-white/10">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 v-if="!editingField.name" 
                    @dblclick="startEditing('name')"
                    class="text-4xl font-bold mb-2 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent cursor-pointer hover:bg-white/5 p-2 rounded">
                  {{ product.name }}
                </h1>
                <div v-else class="mb-2">
                  <input v-model="editingValue.name" 
                    @keydown.enter="saveField('name')"
                    @keydown.escape="cancelEdit('name')"
                    @blur="saveField('name')"
                    ref="nameInput"
                    class="text-4xl font-bold bg-transparent text-white border-b-2 border-white/50 focus:border-green-400 outline-none" />
                </div>
                <p class="text-gray-300 text-lg">
                  Détails du produit CBD - Double-cliquez pour modifier
                </p>
              </div>
            </div>

            <!-- Actions rapides -->
            <div class="flex items-center space-x-3">
              <button @click="duplicateProduct" class="btn btn-ghost gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Dupliquer
              </button>
              <button @click="deleteProduct" class="btn btn-error gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Contenu -->
      <div class="container mx-auto px-4 py-8">
        <div class="max-w-6xl mx-auto">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

            <!-- Colonne gauche - Images -->
            <div class="lg:col-span-2">
              <div class="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                <div class="flex items-center justify-between mb-6">
                  <h2 class="text-2xl font-bold text-white">Images du produit</h2>
                  <button 
                    @click="triggerImageUpload"
                    :disabled="uploadingImages"
                    class="btn btn-sm btn-primary">
                    <svg v-if="!uploadingImages" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    <div v-else class="loading loading-spinner loading-xs mr-2"></div>
                    {{ uploadingImages ? 'Upload...' : 'Ajouter des images' }}
                  </button>
                </div>

                <div v-if="product.image_urls && product.image_urls.length > 0" class="space-y-4">
                  <!-- Image principale -->
                  <div 
                    class="aspect-w-16 aspect-h-9 bg-gray-700 rounded-xl overflow-hidden cursor-pointer hover:bg-gray-600 transition-colors relative group"
                    @dblclick="triggerImageUpload"
                    title="Double-cliquez pour ajouter des images">
                    <img :src="selectedImage || getImageUrl(product.image_urls[0])" :alt="product.name"
                      :data-original-path="product.image_urls[0]"
                      class="w-full h-80 object-cover" 
                      @error="onImageError($event)" />
                    <!-- Overlay avec instruction -->
                    <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div class="text-center text-white">
                        <svg class="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                        <p class="text-sm">Double-cliquez pour ajouter des images</p>
                      </div>
                    </div>
                  </div>

                  <!-- Miniatures -->
                  <div v-if="product.image_urls.length > 1" class="grid grid-cols-4 gap-2">
                    <button v-for="(image, index) in product.image_urls" :key="index" @click="selectedImage = getImageUrl(image)"
                      class="aspect-square bg-gray-700 rounded-lg overflow-hidden border-2 transition-colors"
                      :class="{ 'border-green-500': selectedImage === getImageUrl(image) || (!selectedImage && index === 0), 'border-gray-600': selectedImage !== getImageUrl(image) && (selectedImage || index !== 0) }">
                      <img :src="getImageUrl(image)" :alt="`${product.name} ${index + 1}`" 
                        :data-original-path="image"
                        class="w-full h-full object-cover" 
                        @error="onImageError($event)" />
                    </button>
                  </div>
                </div>

                <div v-else 
                  class="text-center py-12 cursor-pointer hover:bg-gray-700/50 rounded-xl transition-colors"
                  @dblclick="triggerImageUpload"
                  title="Double-cliquez pour ajouter des images">
                  <div class="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p class="text-gray-400 mb-2">Aucune image disponible</p>
                  <p class="text-sm text-gray-500">Double-cliquez pour ajouter des images</p>
                </div>

                <!-- Input file caché -->
                <input 
                  ref="imageInput"
                  type="file" 
                  multiple 
                  accept="image/*"
                  @change="handleImageUpload"
                  class="hidden" />
              </div>

              <!-- Description éditable -->
              <div class="bg-gray-800 rounded-2xl p-6 border border-gray-700 mt-6">
                <h2 class="text-2xl font-bold text-white mb-4">Description</h2>
                <div v-if="!editingField.description" 
                  @dblclick="startEditing('description')"
                  class="text-gray-300 leading-relaxed cursor-pointer hover:bg-gray-700/50 p-3 rounded min-h-[100px]">
                  <p v-if="product.description">{{ product.description }}</p>
                  <p v-else class="text-gray-500 italic">Aucune description disponible - Double-cliquez pour ajouter</p>
                </div>
                <div v-else class="space-y-3">
                  <textarea v-model="editingValue.description" 
                    @keydown.enter.ctrl="saveField('description')"
                    @keydown.escape="cancelEdit('description')"
                    @blur="saveField('description')"
                    ref="descriptionInput"
                    class="w-full min-h-[100px] p-3 bg-gray-700 border border-gray-600 rounded text-white focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    placeholder="Saisissez une description..."></textarea>
                  <div class="flex items-center space-x-2 text-sm text-gray-400">
                    <span>Ctrl+Entrée pour sauvegarder, Échap pour annuler</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Colonne droite - Informations -->
            <div class="space-y-6">

              <!-- Informations principales -->
              <div class="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                <h2 class="text-2xl font-bold text-white mb-6">Informations</h2>

                <div class="space-y-4">
                  <!-- Prix éditable -->
                  <div class="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                    <span class="text-gray-300">Prix</span>
                    <div v-if="!editingField.price" 
                      @dblclick="startEditing('price')"
                      class="text-2xl font-bold text-green-400 cursor-pointer hover:bg-gray-600/50 p-1 rounded">
                      {{ formatPrice(product.price) }}€
                    </div>
                    <div v-else>
                      <input v-model="editingValue.price" 
                        type="number" 
                        step="0.01"
                        @keydown.enter="saveField('price')"
                        @keydown.escape="cancelEdit('price')"
                        @blur="saveField('price')"
                        ref="priceInput"
                        class="text-right text-2xl font-bold bg-gray-600 text-green-400 border border-gray-500 rounded px-2 py-1 w-24" />
                    </div>
                  </div>

                  <!-- Stock éditable -->
                  <div class="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                    <span class="text-gray-300">Stock</span>
                    <div v-if="!editingField.stock" 
                      @dblclick="startEditing('stock')"
                      class="font-bold cursor-pointer hover:bg-gray-600/50 p-1 rounded flex items-center space-x-2"
                      :class="getStockColorClass(product.stock)">
                      <span>{{ product.stock }} unités</span>
                      <button @click="quickAddStock" class="btn btn-xs btn-success ml-2">+10</button>
                    </div>
                    <div v-else>
                      <input v-model="editingValue.stock" 
                        type="number" 
                        min="0"
                        @keydown.enter="saveField('stock')"
                        @keydown.escape="cancelEdit('stock')"
                        @blur="saveField('stock')"
                        ref="stockInput"
                        class="text-right font-bold bg-gray-600 border border-gray-500 rounded px-2 py-1 w-20" />
                    </div>
                  </div>

                  <!-- Catégorie -->
                  <div v-if="product.categories && product.categories.length > 0"
                    class="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                    <span class="text-gray-300">Catégorie</span>
                    <span class="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
                      {{ product.categories[0].name }}
                    </span>
                  </div>

                  <!-- ID Produit -->
                  <div class="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                    <span class="text-gray-300">ID Produit</span>
                    <span class="text-gray-400 font-mono">#{{ product.id }}</span>
                  </div>

                  <!-- Dates -->
                  <div class="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                    <span class="text-gray-300">Créé le</span>
                    <span class="text-gray-400">{{ formatDate(product.created_at || '') }}</span>
                  </div>

                  <div class="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                    <span class="text-gray-300">Modifié le</span>
                    <span class="text-gray-400">{{ formatDate(product.updated_at || '') }}</span>
                  </div>
                </div>
              </div>

              <!-- Certificat d'analyse -->
              <div class="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                <div class="flex items-center justify-between mb-4">
                  <h2 class="text-2xl font-bold text-white">Certificat d'analyse</h2>
                  <button 
                    v-if="!product.analysis_file_url"
                    @click="triggerAnalysisUpload"
                    :disabled="uploadingAnalysis"
                    class="btn btn-sm btn-purple">
                    <svg v-if="!uploadingAnalysis" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    <div v-else class="loading loading-spinner loading-xs mr-2"></div>
                    {{ uploadingAnalysis ? 'Upload...' : 'Ajouter un certificat' }}
                  </button>
                </div>

                <!-- Si un fichier existe -->
                <div v-if="product.analysis_file_url" class="space-y-3">
                  <a :href="product.analysis_file_url" target="_blank"
                    class="flex items-center space-x-3 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg hover:bg-purple-500/20 transition-colors">
                    <div class="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div class="flex-1">
                      <p class="text-white font-medium">Voir le certificat</p>
                      <p class="text-sm text-gray-400">Ouvrir dans un nouvel onglet</p>
                    </div>
                    <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                  
                  <!-- Actions sur le fichier existant -->
                  <div class="flex items-center space-x-2">
                    <button 
                      @click="triggerAnalysisUpload"
                      :disabled="uploadingAnalysis"
                      class="btn btn-sm btn-ghost text-purple-400 hover:bg-purple-500/20">
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      Remplacer
                    </button>
                    <button 
                      @click="removeAnalysisFile"
                      class="btn btn-sm btn-ghost text-red-400 hover:bg-red-500/20">
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Supprimer
                    </button>
                  </div>
                </div>

                <!-- Si aucun fichier -->
                <div v-else 
                  class="text-center py-8 cursor-pointer hover:bg-gray-700/50 rounded-xl transition-colors"
                  @click="triggerAnalysisUpload"
                  title="Cliquez pour ajouter un certificat d'analyse">
                  <div class="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p class="text-gray-400 mb-2">Aucun certificat d'analyse</p>
                  <p class="text-sm text-gray-500">Cliquez pour ajouter un fichier PDF</p>
                </div>

                <!-- Input file caché pour le certificat -->
                <input 
                  ref="analysisInput"
                  type="file" 
                  accept=".pdf,.doc,.docx"
                  @change="handleAnalysisUpload"
                  class="hidden" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useErrorStore } from '@/shared/errors/errorStore'
import { nextTick, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '../stores/productStore'
import type { Product } from '../types'

// Router et stores
const route = useRoute()
const router = useRouter()
const productStore = useProductStore()
const errorStore = useErrorStore()

// État local
const loading = ref(true)
const error = ref('')
const product = ref<Product | null>(null)
const selectedImage = ref('')

// État pour l'upload d'images
const uploadingImages = ref(false)
const imageInput = ref<HTMLInputElement>()

// État pour l'upload de fichier d'analyse
const uploadingAnalysis = ref(false)
const analysisInput = ref<HTMLInputElement>()

// État d'édition inline
const editingField = ref<Record<string, boolean>>({
  name: false,
  description: false,
  price: false,
  stock: false
})

const editingValue = ref<Record<string, any>>({
  name: '',
  description: '',
  price: 0,
  stock: 0
})

// Refs pour les inputs
const nameInput = ref<HTMLInputElement>()
const descriptionInput = ref<HTMLTextAreaElement>()
const priceInput = ref<HTMLInputElement>()
const stockInput = ref<HTMLInputElement>()

// Méthodes utilitaires pour le formatage
const formatPrice = (price: number): string => {
  return price.toFixed(2)
}

const formatDate = (dateString: string): string => {
  if (!dateString) return 'Non défini'
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Méthodes utilitaires pour le stock
const getStockColorClass = (stock: number): string => {
  if (stock === 0) return 'text-red-400'
  if (stock < 10) return 'text-yellow-400'
  return 'text-green-400'
}

// Méthodes d'édition inline
const startEditing = async (field: string) => {
  if (!product.value) return
  
  // Mettre la valeur actuelle dans editingValue
  editingValue.value[field] = product.value[field as keyof Product]
  
  // Activer le mode édition
  editingField.value[field] = true
  
  // Focus sur l'input après le prochain tick
  await nextTick()
  const inputRef = getInputRef(field)
  if (inputRef) {
    inputRef.focus()
    if (inputRef instanceof HTMLInputElement || inputRef instanceof HTMLTextAreaElement) {
      inputRef.select()
    }
  }
}

const getInputRef = (field: string) => {
  switch (field) {
    case 'name': return nameInput.value
    case 'description': return descriptionInput.value
    case 'price': return priceInput.value
    case 'stock': return stockInput.value
    default: return null
  }
}

const saveField = async (field: string) => {
  if (!product.value || !editingField.value[field]) return
  
  try {
    const newValue = editingValue.value[field]
    
    // Validation simple
    if (field === 'name' && (!newValue || newValue.trim() === '')) {
      errorStore.addError('Le nom du produit ne peut pas être vide')
      return
    }
    
    if ((field === 'price' || field === 'stock') && (isNaN(newValue) || newValue < 0)) {
      errorStore.addError(`La valeur de ${field === 'price' ? 'prix' : 'stock'} doit être un nombre positif`)
      return
    }
    
    // Préparer les données de mise à jour
    const updateData: any = {}
    
    if (field === 'price') {
      updateData[field] = parseFloat(newValue)
    } else if (field === 'stock') {
      updateData[field] = parseInt(newValue)
    } else {
      updateData[field] = newValue
    }
    
    // Appeler l'API de mise à jour
    await productStore.updateProduct(product.value.id, updateData)
    
    // Mettre à jour la valeur locale
    ;(product.value as any)[field] = updateData[field]
    
    // Désactiver le mode édition
    editingField.value[field] = false
    
    // Afficher un message de succès
    errorStore.addSuccess(`${field === 'name' ? 'Nom' : field === 'description' ? 'Description' : field === 'price' ? 'Prix' : 'Stock'} mis à jour avec succès`)
    
  } catch (err: any) {
    errorStore.addError(`Erreur lors de la mise à jour: ${err.message || 'Erreur inconnue'}`)
  }
}

const cancelEdit = (field: string) => {
  editingField.value[field] = false
  editingValue.value[field] = ''
}

// Actions rapides
const quickAddStock = async () => {
  if (!product.value) return
  
  try {
    const newStock = product.value.stock + 10
    await productStore.updateProduct(product.value.id, { stock: newStock })
    product.value.stock = newStock
    errorStore.addSuccess('10 unités ajoutées au stock')
  } catch (err: any) {
    errorStore.addError(`Erreur lors de l'ajout du stock: ${err.message}`)
  }
}

const duplicateProduct = async () => {
  if (!product.value) return
  
  try {
    const duplicateData = {
      name: `${product.value.name} (copie)`,
      description: product.value.description,
      price: product.value.price,
      stock: 0, // Nouveau produit avec stock à 0
      category_id: product.value.category_id,
      image_urls: product.value.image_urls
    }
    
    const newProduct = await productStore.createProduct(duplicateData)
    errorStore.addSuccess('Produit dupliqué avec succès')
    router.push(`/products/${newProduct.id}`)
  } catch (err: any) {
    errorStore.addError(`Erreur lors de la duplication: ${err.message}`)
  }
}

const deleteProduct = async () => {
  if (!product.value) return
  
  const confirmed = confirm(`Êtes-vous sûr de vouloir supprimer le produit "${product.value.name}" ?\n\nCette action est irréversible.`)
  if (!confirmed) return
  
  try {
    await productStore.deleteProduct(product.value.id)
    errorStore.addSuccess('Produit supprimé avec succès')
    router.push('/products')
  } catch (err: any) {
    errorStore.addError(`Erreur lors de la suppression: ${err.message}`)
  }
}

// Fonction pour corriger les URLs d'images
const getImageUrl = (imageUrl: string): string => {
  if (!imageUrl) return ''
  
  console.log('🔍 Traitement URL:', imageUrl)
  
  // Si l'URL est complète et suit le format de l'API
  if (imageUrl.startsWith('http://localhost/API_INTRAFMC/public/')) {
    // Extraire le chemin après /public/
    const pathAfterPublic = imageUrl.replace('http://localhost/API_INTRAFMC/public/', '')
    
    // Si le chemin est juste {ID}/{filename}, ajouter le préfixe product_images/
    if (pathAfterPublic.match(/^\d+\//)) {
      const correctedUrl = `http://localhost/API_INTRAFMC/public/product_images/${pathAfterPublic}`
      console.log('🔧 URL corrigée:', correctedUrl)
      return correctedUrl
    }
    
    // Sinon retourner l'URL originale
    console.log('✅ URL déjà correcte:', imageUrl)
    return imageUrl
  }
  
  // Si l'URL est complète avec un autre format, la retourner telle quelle
  if (imageUrl.startsWith('http')) {
    console.log('✅ URL complète reçue:', imageUrl)
    return imageUrl
  }
  
  // Si l'URL commence par /, l'ajouter au domaine du serveur
  if (imageUrl.startsWith('/')) {
    return `${import.meta.env.VITE_IMAGE_BASE_URL}${imageUrl}`
  }
  
  // Pour les chemins relatifs, utiliser la base URL configurée
  console.log('🔍 Construction URL pour:', imageUrl)
  const defaultUrl = `${import.meta.env.VITE_IMAGE_BASE_URL}/${imageUrl}`
  console.log('📁 URL construite:', defaultUrl)
  return defaultUrl
}

// Gestion des erreurs d'images - Version simplifiée pour debug
const onImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  console.error('❌ Erreur de chargement image:', img.src)
  
  // Si c'est déjà un placeholder, ne rien faire
  if (img.src.includes('placeholder')) {
    return
  }
  
  // Remplacer par le placeholder
  console.log('🔄 Image remplacée par placeholder')
  img.src = '/images/placeholder-product.svg'
}

// Chargement des données
const loadProduct = async () => {
  try {
    loading.value = true
    error.value = ''

    const productId = route.params.id as string
    if (!productId) {
      throw new Error('ID du produit manquant')
    }

    product.value = await productStore.fetchProductById(productId)

    // Debug des images
    console.log('=== PRODUIT CHARGÉ ===')
    console.log('Produit complet:', product.value)
    console.log('Images brutes:', product.value?.image_urls)
    
    if (product.value?.image_urls && product.value.image_urls.length > 0) {
      console.log('Images trouvées:')
      product.value.image_urls.forEach((img: string, index: number) => {
        console.log(`  Image ${index}: "${img}"`)
        console.log(`  URL corrigée: "${getImageUrl(img)}"`)
      })
      
      selectedImage.value = getImageUrl(product.value.image_urls[0])
    } else {
      console.log('❌ Aucune image trouvée pour ce produit')
    }
  } catch (err: any) {
    error.value = err.message || 'Erreur lors du chargement du produit'
    errorStore.addError(error.value)
  } finally {
    loading.value = false
  }
}

// Méthodes pour l'upload d'images
const triggerImageUpload = () => {
  if (imageInput.value) {
    imageInput.value.click()
  }
}

const handleImageUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  
  if (!files || files.length === 0 || !product.value) {
    return
  }
  
  try {
    uploadingImages.value = true
    
    console.log('Upload de nouvelles images pour le produit:', product.value.id)
    console.log('Fichiers sélectionnés:', Array.from(files).map(f => f.name))
    
    // Importer le service produit
    const { productService } = await import('../services/productService')
    
    // Upload des images
    const newImageUrls = await productService.uploadProductImages(
      product.value.id, 
      Array.from(files)
    )
    
    console.log('Nouvelles images uploadées:', newImageUrls)
    
    // Recharger le produit pour avoir toutes les images
    await loadProduct()
    
    errorStore.addSuccess(`${files.length} image(s) ajoutée(s) avec succès`)
    
    // Réinitialiser l'input
    target.value = ''
    
  } catch (err: any) {
    console.error('Erreur lors de l\'upload:', err)
    errorStore.addError(`Erreur lors de l'upload des images: ${err.message || 'Erreur inconnue'}`)
  } finally {
    uploadingImages.value = false
  }
}

// Méthodes pour l'upload de fichier d'analyse
const triggerAnalysisUpload = () => {
  if (analysisInput.value) {
    analysisInput.value.click()
  }
}

const handleAnalysisUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  
  if (!files || files.length === 0 || !product.value) {
    return
  }
  
  const file = files[0] // Un seul fichier d'analyse
  
  try {
    uploadingAnalysis.value = true
    
    console.log('Upload du fichier d\'analyse pour le produit:', product.value.id)
    console.log('Fichier sélectionné:', file.name)
    
    // Importer le service produit
    const { productService } = await import('../services/productService')
    
    // Upload du fichier d'analyse
    const analysisUrl = await productService.uploadAnalysisFile(
      product.value.id, 
      file
    )
    
    console.log('Fichier d\'analyse uploadé:', analysisUrl)
    
    // Mettre à jour le produit localement
    if (product.value) {
      product.value.analysis_file_url = analysisUrl
    }
    
    errorStore.addSuccess('Fichier d\'analyse ajouté avec succès')
    
    // Réinitialiser l'input
    target.value = ''
    
  } catch (err: any) {
    console.error('Erreur lors de l\'upload du fichier d\'analyse:', err)
    errorStore.addError(`Erreur lors de l'upload du fichier d'analyse: ${err.message || 'Erreur inconnue'}`)
  } finally {
    uploadingAnalysis.value = false
  }
}

const removeAnalysisFile = async () => {
  if (!product.value || !product.value.analysis_file_url) return
  
  const confirmed = confirm('Êtes-vous sûr de vouloir supprimer le fichier d\'analyse ?')
  if (!confirmed) return
  
  try {
    // Mettre à jour le produit pour supprimer le fichier d'analyse
    await productStore.updateProduct(product.value.id, { analysis_file_url: null })
    
    // Mettre à jour localement
    product.value.analysis_file_url = undefined
    
    errorStore.addSuccess('Fichier d\'analyse supprimé avec succès')
  } catch (err: any) {
    errorStore.addError(`Erreur lors de la suppression: ${err.message}`)
  }
}

// Lifecycle
onMounted(() => {
  loadProduct()
})
</script>
