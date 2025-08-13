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
                <h1
                  class="text-4xl font-bold mb-2 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  {{ product.name }}
                </h1>
                <p class="text-gray-300 text-lg">
                  Détails du produit CBD
                </p>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center space-x-3">
              <button @click="editProduct" class="btn btn-ghost gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Modifier
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
                <h2 class="text-2xl font-bold text-white mb-6">Images du produit</h2>

                <div v-if="product.images && product.images.length > 0" class="space-y-4">
                  <!-- Image principale -->
                  <div class="aspect-w-16 aspect-h-9 bg-gray-700 rounded-xl overflow-hidden">
                    <img :src="selectedImage || product.images[0]" :alt="product.name"
                      class="w-full h-80 object-cover" />
                  </div>

                  <!-- Miniatures -->
                  <div v-if="product.images.length > 1" class="grid grid-cols-4 gap-2">
                    <button v-for="(image, index) in product.images" :key="index" @click="selectedImage = image"
                      class="aspect-square bg-gray-700 rounded-lg overflow-hidden border-2 transition-colors"
                      :class="{ 'border-green-500': selectedImage === image || (!selectedImage && index === 0), 'border-gray-600': selectedImage !== image && (selectedImage || index !== 0) }">
                      <img :src="image" :alt="`${product.name} ${index + 1}`" class="w-full h-full object-cover" />
                    </button>
                  </div>
                </div>

                <div v-else class="text-center py-12">
                  <div class="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p class="text-gray-400">Aucune image disponible</p>
                </div>
              </div>

              <!-- Description -->
              <div v-if="product.description" class="bg-gray-800 rounded-2xl p-6 border border-gray-700 mt-6">
                <h2 class="text-2xl font-bold text-white mb-4">Description</h2>
                <p class="text-gray-300 leading-relaxed">{{ product.description }}</p>
              </div>
            </div>

            <!-- Colonne droite - Informations -->
            <div class="space-y-6">

              <!-- Informations principales -->
              <div class="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                <h2 class="text-2xl font-bold text-white mb-6">Informations</h2>

                <div class="space-y-4">
                  <!-- Prix -->
                  <div class="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                    <span class="text-gray-300">Prix</span>
                    <span class="text-2xl font-bold text-green-400">{{ formatPrice(product.price) }}€</span>
                  </div>

                  <!-- Stock -->
                  <div class="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                    <span class="text-gray-300">Stock</span>
                    <span class="font-bold" :class="getStockColorClass(product.stock)">
                      {{ product.stock }} unités
                    </span>
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
                    <span class="text-gray-400">{{ formatDate(product.created_at) }}</span>
                  </div>

                  <div class="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                    <span class="text-gray-300">Modifié le</span>
                    <span class="text-gray-400">{{ formatDate(product.updated_at) }}</span>
                  </div>
                </div>
              </div>

              <!-- Certificat d'analyse -->
              <div v-if="product.analysis_file_url" class="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                <h2 class="text-2xl font-bold text-white mb-4">Certificat d'analyse</h2>
                <a :href="product.analysis_file_url" target="_blank"
                  class="flex items-center space-x-3 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg hover:bg-purple-500/20 transition-colors">
                  <div class="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-white font-medium">Voir le certificat</p>
                    <p class="text-sm text-gray-400">Ouvrir dans un nouvel onglet</p>
                  </div>
                  <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>

              <!-- Actions rapides -->
              <div class="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                <h2 class="text-2xl font-bold text-white mb-4">Actions rapides</h2>
                <div class="space-y-3">
                  <button class="w-full btn btn-success gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Ajouter au stock
                  </button>
                  <button class="w-full btn btn-warning gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Modifier le produit
                  </button>
                  <button class="w-full btn btn-info gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Dupliquer le produit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '../stores/productStore'
import type { Product } from '../types'

// Router et stores
const route = useRoute()
const router = useRouter()
const productStore = useProductStore()

// État local
const loading = ref(true)
const error = ref('')
const product = ref<Product | null>(null)
const selectedImage = ref('')

// Méthodes utilitaires
const formatPrice = (price: number): string => {
  return price.toFixed(2)
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getStockColorClass = (stock: number): string => {
  if (stock === 0) return 'text-red-400'
  if (stock < 10) return 'text-yellow-400'
  return 'text-green-400'
}

// Actions
const editProduct = () => {
  // TODO: Naviguer vers la page d'édition
  console.log('Éditer le produit:', product.value?.id)
}

const deleteProduct = () => {
  if (product.value && confirm(`Êtes-vous sûr de vouloir supprimer le produit "${product.value.name}" ?`)) {
    // TODO: Implémenter la suppression
    console.log('Supprimer le produit:', product.value.id)
  }
}

// Chargement des données
const loadProduct = async () => {
  try {
    loading.value = true
    error.value = ''

    const productId = route.params.id as string
    product.value = await productStore.fetchProductById(productId)

    if (product.value?.images && product.value.images.length > 0) {
      selectedImage.value = product.value.images[0]
    }
  } catch (err: any) {
    error.value = err.message || 'Erreur lors du chargement du produit'
    console.error('Erreur lors du chargement du produit:', err)
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadProduct()
})
</script>
