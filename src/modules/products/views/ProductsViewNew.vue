<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
    <!-- Header avec stats et actions -->
    <div class="max-w-7xl mx-auto mb-8">
      <!-- Titre et actions principales -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-4xl font-bold text-white mb-2">Produits</h1>
          <p class="text-gray-300">Gérez votre catalogue de produits</p>
        </div>
        <div class="flex items-center gap-4">
          <button @click="showCreateModal = true"
            class="btn btn-primary btn-lg gap-2 hover:scale-105 transition-transform">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Nouveau produit
          </button>
          <button @click="refreshProducts" class="btn btn-ghost btn-lg" :class="{ 'loading': productStore.loading }">
            <svg v-if="!productStore.loading" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Cartes de statistiques -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Total produits -->
        <div
          class="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-6 hover:border-blue-500/40 transition-all duration-300">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-blue-500/20 rounded-xl">
              <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div v-if="productStore.loading" class="loading loading-spinner loading-md text-blue-400"></div>
          </div>
          <div class="space-y-1">
            <h3 class="text-sm font-medium text-gray-400 uppercase tracking-wide">Total produits</h3>
            <p class="text-3xl font-bold text-blue-400">{{ productStore.totalProducts }}</p>
          </div>
        </div>

        <!-- Produits en stock -->
        <div
          class="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm border border-green-500/20 rounded-2xl p-6 hover:border-green-500/40 transition-all duration-300">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-green-500/20 rounded-xl">
              <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div class="space-y-1">
            <h3 class="text-sm font-medium text-gray-400 uppercase tracking-wide">En stock</h3>
            <p class="text-3xl font-bold text-green-400">{{ productStore.inStockProducts.length }}</p>
          </div>
        </div>

        <!-- Produits rupture -->
        <div
          class="bg-gradient-to-br from-red-500/10 to-pink-500/10 backdrop-blur-sm border border-red-500/20 rounded-2xl p-6 hover:border-red-500/40 transition-all duration-300">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-red-500/20 rounded-xl">
              <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
          <div class="space-y-1">
            <h3 class="text-sm font-medium text-gray-400 uppercase tracking-wide">Rupture de stock</h3>
            <p class="text-3xl font-bold text-red-400">{{ productStore.outOfStockProducts.length }}</p>
          </div>
        </div>

        <!-- Valeur totale -->
        <div
          class="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 hover:border-purple-500/40 transition-all duration-300">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-purple-500/20 rounded-xl">
              <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
          <div class="space-y-1">
            <h3 class="text-sm font-medium text-gray-400 uppercase tracking-wide">Valeur totale</h3>
            <p class="text-3xl font-bold text-purple-400">{{ formatPrice(totalStockValue) }}</p>
          </div>
        </div>
      </div>

      <!-- Barre de recherche et filtres -->
      <div class="bg-black/20 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 mb-8">
        <div class="flex flex-col lg:flex-row gap-4">
          <!-- Recherche -->
          <div class="flex-1">
            <div class="relative">
              <input v-model="searchQuery" type="text" placeholder="Rechercher un produit..."
                class="input input-bordered w-full bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 pr-10"
                @input="onSearchInput">
              <svg class="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none"
                stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <!-- Filtres par catégorie -->
          <div class="w-full lg:w-64">
            <select v-model="selectedCategory"
              class="select select-bordered w-full bg-gray-800/50 border-gray-600 text-white"
              @change="onCategoryChange">
              <option value="">Toutes les catégories</option>
              <option v-for="category in categoryStore.categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>

          <!-- Bouton effacer filtres -->
          <button v-if="searchQuery || selectedCategory" @click="clearFilters" class="btn btn-ghost btn-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Effacer
          </button>
        </div>
      </div>
    </div>

    <!-- Contenu principal -->
    <div class="max-w-7xl mx-auto">
      <!-- Loading -->
      <div v-if="productStore.loading && !productStore.products.length" class="flex justify-center items-center py-16">
        <div class="loading loading-spinner loading-lg text-primary"></div>
      </div>

      <!-- Grille de produits -->
      <div v-else-if="filteredProducts.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div v-for="product in filteredProducts" :key="product.id"
          class="bg-black/20 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-gray-600/50 transition-all duration-300 group hover:scale-105">
          <!-- Image produit -->
          <div class="aspect-square bg-gray-800/50 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
            <img v-if="product.images && product.images.length > 0" :src="product.images[0]" :alt="product.name"
              class="w-full h-full object-cover">
            <div v-else class="text-gray-500">
              <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          <!-- Infos produit -->
          <div class="space-y-2">
            <h3 class="font-semibold text-white text-lg">{{ product.name }}</h3>
            <p v-if="product.description" class="text-gray-400 text-sm line-clamp-2">{{ product.description }}</p>
            <div class="flex items-center justify-between">
              <span class="text-2xl font-bold text-primary">{{ formatPrice(product.price) }}</span>
              <div class="flex items-center gap-1">
                <span class="text-sm text-gray-400">Stock:</span>
                <span class="text-sm font-medium" :class="product.stock > 0 ? 'text-green-400' : 'text-red-400'">
                  {{ product.stock }}
                </span>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-2 mt-4">
            <button @click="editProduct(product)" class="btn btn-sm btn-ghost flex-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Modifier
            </button>
            <button @click="deleteProduct(product.id)" class="btn btn-sm btn-error">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- État vide -->
      <div v-else class="text-center py-16">
        <div class="bg-black/20 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-12 max-w-md mx-auto">
          <svg class="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <h3 class="text-xl font-semibold text-white mb-2">Aucun produit trouvé</h3>
          <p class="text-gray-400 mb-6">
            {{ searchQuery ? 'Aucun produit ne correspond à votre recherche.' : 'Commencez par ajouter votre premier
            produit.' }}
          </p>
          <button @click="showCreateModal = true" class="btn btn-primary">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Ajouter un produit
          </button>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="max-w-7xl mx-auto mt-8">
      <UIPagination v-if="productStore.products.length > 0" :current-page="productStore.currentPage"
        :total-pages="Math.max(1, Math.ceil((productStore.paginatorInfo?.total || productStore.products.length) / productStore.perPage))"
        :total="productStore.paginatorInfo?.total || productStore.products.length" :per-page="productStore.perPage"
        :from="(productStore.paginatorInfo?.total || 0) > 0 ? ((productStore.currentPage - 1) * productStore.perPage) + 1 : 0"
        :to="Math.min(productStore.currentPage * productStore.perPage, productStore.paginatorInfo?.total || productStore.products.length)"
        label-plural="produits" @go-to-page="goToPage" @next="goToPage(productStore.currentPage + 1)"
        @prev="goToPage(productStore.currentPage - 1)" @per-page-change="changePerPage" />
    </div>
  </div>
</template>

<script setup lang="ts">
import UIPagination from '@/shared/components/UIPagination.vue'
import { computed, onMounted, ref } from 'vue'
import { useCategoryStore } from '../../categories/stores/categoryStore'
import { useProductStore } from '../stores/productStore'
import type { Product } from '../types'

// Stores
const productStore = useProductStore()
const categoryStore = useCategoryStore()

// État local
const showCreateModal = ref(false)
const showEditModal = ref(false)
const selectedProduct = ref<Product | null>(null)
const searchQuery = ref('')
const selectedCategory = ref('')

// Computed
const filteredProducts = computed(() => {
  let products = productStore.products

  // Filtrage par recherche
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    products = products.filter(product =>
      product.name.toLowerCase().includes(query) ||
      product.description?.toLowerCase().includes(query)
    )
  }

  // Filtrage par catégorie
  if (selectedCategory.value) {
    products = products.filter(product =>
      product.category_id?.toString() === selectedCategory.value
    )
  }

  return products
})

const totalStockValue = computed(() => {
  return productStore.products.reduce((total, product) => {
    return total + (product.price * product.stock)
  }, 0)
})

// Méthodes
function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price)
}

function onSearchInput() {
  // La recherche est réactive via le computed
}

function onCategoryChange() {
  // Le filtrage est réactif via le computed
}

function clearFilters() {
  searchQuery.value = ''
  selectedCategory.value = ''
}

async function refreshProducts() {
  await productStore.fetchProducts()
}

function editProduct(product: Product) {
  selectedProduct.value = product
  showEditModal.value = true
}

async function deleteProduct(id: string) {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
    try {
      await productStore.deleteProduct(id)
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    }
  }
}

function onProductCreated() {
  showCreateModal.value = false
  refreshProducts()
}

function onProductUpdated() {
  showEditModal.value = false
  selectedProduct.value = null
}

// Pagination
async function goToPage(page: number) {
  try {
    await productStore.fetchProducts(page, productStore.perPage)
  } catch (error) {
    console.error('Erreur lors du changement de page produits:', error)
  }
}

async function changePerPage(newPerPage: number) {
  try {
    await productStore.fetchProducts(1, newPerPage)
  } catch (error) {
    console.error('Erreur lors du changement du nombre par page produits:', error)
  }
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    productStore.fetchProducts(),
    categoryStore.fetchCategories()
  ])
})
</script>
