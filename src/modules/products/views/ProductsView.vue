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
          <button @click="$router.push('/products/create')"
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
              <input v-model="searchQuery" type="text" placeholder="Rechercher par nom de produit..."
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
      <div v-else-if="filteredProducts.length > 0">
        <!-- Indicateur de recherche/filtrage -->
        <div v-if="searchQuery || selectedCategory" class="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
          <div class="flex items-center gap-2 text-blue-400">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span class="text-sm font-medium">
              {{ filteredProducts.length }} résultat(s) trouvé(s)
              <span v-if="searchQuery"> pour "{{ searchQuery }}"</span>
              <span v-if="selectedCategory && categoryStore.categories.length"> dans la catégorie "{{ categoryStore.categories.find(c => c.id.toString() === selectedCategory)?.name }}"</span>
            </span>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          <div v-for="product in filteredProducts" :key="product.id"
            @click="navigateToProductDetail(product)"
            class="bg-black/20 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-gray-600/50 transition-all duration-300 group hover:scale-105 cursor-pointer">
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
              <h3 class="font-semibold text-white text-lg group-hover:text-blue-400 transition-colors">
                {{ product.name }}
              </h3>
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

              <!-- Catégories et fournisseurs -->
              <div v-if="product.categories && product.categories.length > 0" class="flex flex-wrap gap-1">
                <span v-for="category in product.categories" :key="category.id"
                  class="badge badge-outline badge-sm text-blue-400 border-blue-400">
                  {{ category.name }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Infinite scroll trigger -->
        <div 
          v-if="productStore.hasMorePages && !searchQuery && !selectedCategory" 
          ref="scrollTrigger"
          class="flex justify-center items-center py-8"
        >
          <div v-if="productStore.loading" class="loading loading-spinner loading-lg text-primary"></div>
          <button 
            v-else 
            @click="loadMoreProducts" 
            class="btn btn-outline btn-primary"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            Charger plus ({{ (productStore.paginatorInfo?.total || 0) - productStore.products.length }} restants)
          </button>
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
            {{ emptyStateMessage }}
          </p>
          <button @click="$router.push('/products/create')" class="btn btn-primary">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Ajouter un produit
          </button>
        </div>
      </div>
    </div>

    <!-- Bouton retour en haut fixe -->
    <button 
      v-show="showScrollToTop"
      @click="scrollToTop"
      class="fixed bottom-6 right-6 z-50 btn btn-circle btn-primary btn-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
      title="Retour en haut"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCategoryStore } from '../../categories/stores/categoryStore'
import { useProductStore } from '../stores/productStore'
import type { Product } from '../types'

// Router
const router = useRouter()

// Stores
const productStore = useProductStore()
const categoryStore = useCategoryStore()

// État local
const searchQuery = ref('')
const selectedCategory = ref('')
const scrollTrigger = ref<HTMLElement | null>(null)
const showScrollToTop = ref(false)
const searchTimeout = ref<NodeJS.Timeout | null>(null)

// Computed
const emptyStateMessage = computed(() => {
  return searchQuery.value
    ? 'Aucun produit ne correspond à votre recherche.'
    : 'Commencez par ajouter votre premier produit.'
})

const filteredProducts = computed(() => {
  // Maintenant on utilise directement les produits du store
  // car la recherche et le filtrage sont gérés côté serveur
  return productStore.products
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
  // Annuler la recherche précédente si elle existe
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  
  // Programmer une nouvelle recherche après 500ms
  searchTimeout.value = setTimeout(() => {
    performSearch()
  }, 500)
}

function onCategoryChange() {
  // Le changement de catégorie se fait immédiatement
  performSearch()
}

function clearFilters() {
  searchQuery.value = ''
  selectedCategory.value = ''
  // Revenir à la liste normale sans filtre
  fetchProducts()
}

async function refreshProducts() {
  if (searchQuery.value || selectedCategory.value) {
    await performSearch()
  } else {
    await fetchProducts()
  }
}

async function fetchProducts() {
  await productStore.fetchProducts(1, 20, false)
}

async function performSearch() {
  const query = searchQuery.value.trim() || undefined
  const categoryId = selectedCategory.value || undefined
  await productStore.searchProducts(query, categoryId, 1, 20, false)
}

async function loadMoreProducts() {
  if (searchQuery.value || selectedCategory.value) {
    // Charger plus de résultats de recherche
    const query = searchQuery.value.trim() || undefined
    const categoryId = selectedCategory.value || undefined
    await productStore.loadMoreSearchResults(query, categoryId)
  } else {
    // Charger plus de produits normaux
    await productStore.loadMoreProducts()
  }
}

// Navigation vers la page de détail du produit
function navigateToProductDetail(product: Product) {
  router.push(`/products/${product.id}`)
}

// Fonction pour revenir en haut
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

// Fonction pour gérer l'affichage du bouton retour en haut
function handleScroll() {
  showScrollToTop.value = window.scrollY > 300
}

// Intersection Observer pour l'infinite scroll
function setupInfiniteScroll(): IntersectionObserver | null {
  if (!scrollTrigger.value) return null

  const observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0]
      if (entry.isIntersecting && productStore.hasMorePages && !productStore.loading && !searchQuery.value && !selectedCategory.value) {
        loadMoreProducts()
      }
    },
    {
      threshold: 0.1,
      rootMargin: '100px'
    }
  )

  observer.observe(scrollTrigger.value)
  
  return observer
}

// Variables pour l'infinite scroll
let observer: IntersectionObserver | null = null

// Watchers
watch(selectedCategory, () => {
  // Seul le changement de catégorie déclenche une recherche immédiate
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  performSearch()
})

watch(scrollTrigger, (newTrigger) => {
  if (observer) {
    observer.disconnect()
  }
  if (newTrigger) {
    observer = setupInfiniteScroll()
  }
})

// Lifecycle
onMounted(async () => {
  await Promise.all([
    productStore.fetchProducts(1, 20, false),
    categoryStore.fetchCategories()
  ])
  
  // Setup infinite scroll après que le DOM soit mis à jour
  await nextTick()
  observer = setupInfiniteScroll()
  
  // Ajouter l'event listener pour le scroll (bouton retour en haut)
  window.addEventListener('scroll', handleScroll)
  // Vérifier la position initiale
  handleScroll()
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
  // Nettoyer l'event listener du scroll
  window.removeEventListener('scroll', handleScroll)
  // Nettoyer le timeout de recherche
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
})
</script>
