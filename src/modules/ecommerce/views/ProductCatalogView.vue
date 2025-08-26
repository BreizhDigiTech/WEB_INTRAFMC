<template>
  <div class="container mx-auto px-4 py-8">
    <!-- En-tête -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-white mb-4">Catalogue Produits</h1>
      <p class="text-gray-300">Découvrez notre sélection de produits CBD de qualité</p>
    </div>

    <!-- Recherche avancée -->
    <div class="mb-8">
      <AdvancedSearchBar
        @search="handleSearch"
        @filter-change="handleAdvancedFilters"
        :show-quick-results="false"
      />
    </div>

    <!-- Résultats -->
    <div class="mb-4 flex justify-between items-center">
      <p class="text-sm text-gray-300">
        {{ pagination.total }} produit(s) trouvé(s)
      </p>
    </div>

    <!-- État de chargement -->
    <div v-if="loading.products" class="flex justify-center items-center py-12">
      <div class="loading loading-spinner loading-lg"></div>
    </div>

    <!-- Erreur -->
    <div v-else-if="error.products" class="alert alert-error mb-6">
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{{ error.products }}</span>
      <button @click="clearErrors" class="btn btn-sm btn-ghost">Réessayer</button>
    </div>

    <!-- Grille de produits -->
    <div v-else-if="products.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        <div
          v-for="product in products"
          :key="product.id"
          class="card bg-base-200 border border-base-300 hover:border-primary/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
        >
        <!-- Image du produit -->
        <figure class="px-4 pt-4">
          <img
            :src="product.image_urls[0] || '/images/placeholder-product.svg'"
            :alt="product.name"
            class="rounded-lg w-full h-48 object-cover"
          />
        </figure>

        <!-- Contenu de la carte -->
        <div class="card-body">
          <h3 class="card-title text-lg text-white">{{ product.name }}</h3>
          <p class="text-sm text-gray-300 line-clamp-2">{{ product.description }}</p>
          
          <!-- Catégories -->
          <div class="flex flex-wrap gap-1 mt-2">
            <span
              v-for="category in product.categories"
              :key="category.id"
              class="badge badge-primary badge-sm"
            >
              {{ category.name }}
            </span>
          </div>

          <!-- Prix et stock -->
          <div class="flex justify-between items-center mt-4">
            <span class="text-xl font-bold text-primary">{{ formatPrice(product.price) }}</span>
            <span
              :class="[
                'badge',
                product.stock > 0 ? 'badge-success' : 'badge-error'
              ]"
            >
              {{ product.stock > 0 ? `${product.stock} en stock` : 'Rupture de stock' }}
            </span>
          </div>

          <!-- Actions -->
          <div class="card-actions flex-col mt-4 gap-3">
            <!-- Sélecteur de quantité (seulement si pas dans le panier) -->
            <div v-if="!isProductInCart(product.id)" class="flex items-center justify-between w-full">
              <label class="text-sm text-gray-300 font-medium">Quantité :</label>
              <div class="flex items-center space-x-1">
                <button
                  @click="decreaseQuantity(product.id)"
                  :disabled="getProductQuantity(product.id) <= 1"
                  class="btn btn-outline btn-xs btn-square border-primary/50 text-primary hover:bg-primary hover:text-white"
                >
                  -
                </button>
                <input
                  :value="getProductQuantity(product.id)"
                  @input="updateProductQuantity(product.id, Number(($event.target as HTMLInputElement).value))"
                  type="number"
                  min="1"
                  :max="product.stock"
                  class="input input-bordered input-xs w-14 text-center bg-base-300 text-white border-primary/30 focus:border-primary"
                />
                <button
                  @click="increaseQuantity(product.id)"
                  :disabled="getProductQuantity(product.id) >= product.stock"
                  class="btn btn-outline btn-xs btn-square border-primary/50 text-primary hover:bg-primary hover:text-white"
                >
                  +
                </button>
              </div>
            </div>
            
            <!-- Statut si déjà dans le panier -->
            <div v-else class="flex items-center justify-center w-full p-2 bg-primary/10 rounded-lg border border-primary/30">
              <span class="text-sm text-primary font-medium">
                ✅ Dans le panier ({{ getItemQuantity(product.id) }})
              </span>
            </div>
            
            <!-- Boutons d'action -->
            <div class="flex gap-2 w-full">
              <button
                @click="viewProduct(product.id)"
                class="btn btn-ghost btn-sm flex-1 text-gray-300 hover:text-white hover:bg-base-300 transition-all duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Détails
              </button>
              <button
                v-if="!isProductInCart(product.id)"
                @click="addProductToCart(product.id)"
                :disabled="product.stock === 0 || addingToCart"
                :class="[
                  'btn btn-sm flex-1 cart-button',
                  addingToCart ? 'loading-cart' : ''
                ]"
              >
                <span v-if="addingToCart" class="loading loading-spinner loading-xs"></span>
                <span v-else class="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                  </svg>
                  Ajouter
                </span>
              </button>
              <button
                v-else
                @click="router.push('/ecommerce/cart')"
                class="btn btn-sm flex-1 bg-gradient-to-r from-success to-success-focus text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Ajouté
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Aucun produit trouvé -->
    <div v-else class="text-center py-12">
      <div class="text-6xl mb-4">🔍</div>
      <h3 class="text-xl font-semibold text-gray-200 mb-2">Aucun produit trouvé</h3>
      <p class="text-gray-400 mb-4">Essayez de modifier vos critères de recherche</p>
      <button @click="resetFilters" class="btn btn-primary">
        Voir tous les produits
      </button>
    </div>

    <!-- Pagination -->
    <div v-if="pagination.lastPage > 1" class="flex justify-center mt-8">
      <div class="join shadow-lg">
        <button
          @click="goToPage(pagination.currentPage - 1)"
          :disabled="!hasPrevPage"
          class="join-item btn btn-outline hover:btn-primary"
          :class="{ 'btn-disabled': !hasPrevPage }"
        >
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Précédent
        </button>
        
        <template v-for="page in visiblePages" :key="page">
          <button
            v-if="page === '...'"
            class="join-item btn btn-disabled bg-base-300"
          >
            ...
          </button>
          <button
            v-else
            @click="goToPage(page as number)"
            :class="[
              'join-item btn font-semibold',
              page === pagination.currentPage 
                ? 'btn-primary text-white bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg border-2 border-emerald-400' 
                : 'btn-outline hover:btn-primary hover:text-white'
            ]"
          >
            {{ page }}
          </button>
        </template>

        <button
          @click="goToPage(pagination.currentPage + 1)"
          :disabled="!hasNextPage"
          class="join-item btn btn-outline hover:btn-primary"
          :class="{ 'btn-disabled': !hasNextPage }"
        >
          Suivant
          <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
    
    <!-- Informations de pagination améliorées -->
    <div v-if="pagination.lastPage > 1" class="flex justify-center mt-4">
      <div class="bg-base-200 rounded-lg px-4 py-2 text-center">
        <span class="text-sm text-gray-300">
          Page 
          <span class="font-bold text-emerald-400 text-lg mx-1">{{ pagination.currentPage }}</span>
          sur 
          <span class="font-semibold text-white">{{ pagination.lastPage }}</span>
          •
          <span class="text-emerald-400 font-medium">{{ pagination.total }}</span>
          produit(s) au total
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import AdvancedSearchBar from '../components/AdvancedSearchBar.vue'
import { useCart } from '../composables/useCart'
import { useProducts } from '../composables/useProducts'

const router = useRouter()

// Composables
const {
  products,
  categories,
  pagination,
  loading,
  error,
  hasNextPage,
  hasPrevPage,
  fetchProducts,
  fetchCategories,
  searchProducts,
  filterByCategory,
  clearFilters,
  clearErrors,
  formatPrice
} = useProducts()

const {
  addToCart,
  isProductInCart,
  getItemQuantity,
  fetchCart
} = useCart()

// État local pour les filtres
const searchTerm = ref('')
const selectedCategory = ref('')
const inStockOnly = ref(false)
const addingToCart = ref(false)

// État local pour les quantités des produits
const productQuantities = ref<Record<string, number>>({})

// Getters calculés
const hasActiveFilters = computed(() => {
  return searchTerm.value !== '' || selectedCategory.value !== '' || inStockOnly.value
})

const visiblePages = computed(() => {
  const current = pagination.value.currentPage
  const last = pagination.value.lastPage
  const delta = 2
  const pages: (number | string)[] = []

  if (last <= 7) {
    // Si moins de 7 pages, on les affiche toutes
    for (let i = 1; i <= last; i++) {
      pages.push(i)
    }
  } else {
    // Logique de pagination avec ellipses
    if (current <= delta + 1) {
      for (let i = 1; i <= delta + 3; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(last)
    } else if (current >= last - delta) {
      pages.push(1)
      pages.push('...')
      for (let i = last - delta - 2; i <= last; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - delta; i <= current + delta; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(last)
    }
  }

  return pages
})

// Méthodes
const handleSearch = (query?: string) => {
  const searchQuery = query !== undefined ? query : searchTerm.value
  if (searchQuery.length >= 3 || searchQuery === '') {
    searchProducts(searchQuery)
  }
}

const handleAdvancedFilters = (filters: any) => {
  // Utiliser les nouveaux filtres de la barre de recherche avancée
  fetchProducts(1, {
    search: filters.query || undefined,
    categoryId: filters.categoryId || undefined,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    inStock: filters.inStock || undefined
  })
}

const handleCategoryFilter = () => {
  if (selectedCategory.value) {
    filterByCategory(selectedCategory.value)
  } else {
    fetchProducts(1, { search: searchTerm.value, inStock: inStockOnly.value })
  }
}

const handleStockFilter = () => {
  fetchProducts(1, {
    search: searchTerm.value,
    categoryId: selectedCategory.value || undefined,
    inStock: inStockOnly.value
  })
}

const resetFilters = () => {
  searchTerm.value = ''
  selectedCategory.value = ''
  inStockOnly.value = false
  clearFilters()
}

const goToPage = (page: number) => {
  fetchProducts(page)
}

const viewProduct = (productId: string) => {
  router.push(`/ecommerce/products/${productId}`)
}

const addProductToCart = async (productId: string) => {
  addingToCart.value = true
  try {
    const quantity = getProductQuantity(productId)
    await addToCart(productId, quantity)
    
    // Feedback visuel - petit toast/notification
    const productName = products.value.find(p => p.id === productId)?.name || 'Produit'
    console.log(`✅ ${quantity} x ${productName} ajouté(s) au panier !`)
    
    // Réinitialiser la quantité après ajout réussi
    productQuantities.value[productId] = 1
  } catch (error) {
    console.error('Erreur lors de l\'ajout au panier:', error)
    alert('Erreur lors de l\'ajout au panier. Veuillez réessayer.')
  } finally {
    addingToCart.value = false
  }
}

// Méthodes pour gérer les quantités
const getProductQuantity = (productId: string): number => {
  return productQuantities.value[productId] || 1
}

const updateProductQuantity = (productId: string, quantity: number) => {
  if (quantity >= 1) {
    productQuantities.value[productId] = quantity
  }
}

const increaseQuantity = (productId: string) => {
  const currentQuantity = getProductQuantity(productId)
  const product = products.value.find(p => p.id === productId)
  if (product && currentQuantity < product.stock) {
    productQuantities.value[productId] = currentQuantity + 1
  }
}

const decreaseQuantity = (productId: string) => {
  const currentQuantity = getProductQuantity(productId)
  if (currentQuantity > 1) {
    productQuantities.value[productId] = currentQuantity - 1
  }
}

// Cycle de vie
onMounted(async () => {
  console.log('ProductCatalogView: onMounted called')
  await Promise.all([
    fetchProducts(),
    fetchCategories(),
    fetchCart()
  ])
  console.log('ProductCatalogView: categories after fetch:', categories.value)
  console.log('ProductCatalogView: products after fetch:', products.value.length)
})

// Watcher pour initialiser les quantités quand les produits sont chargés
watch(products, (newProducts) => {
  newProducts.forEach(product => {
    if (!productQuantities.value[product.id]) {
      productQuantities.value[product.id] = 1
    }
  })
}, { immediate: true })

// Watchers pour un debounce sur la recherche
let searchTimeout: NodeJS.Timeout | null = null
watch(searchTerm, (newValue) => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  
  searchTimeout = setTimeout(() => {
    handleSearch()
  }, 500)
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Bouton personnalisé avec effet glow */
.cart-button {
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.cart-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4);
}

.cart-button:active {
  transform: translateY(0);
}

.cart-button:disabled {
  opacity: 0.6;
  transform: none;
  box-shadow: none;
}

/* Effet ripple pour les boutons */
.cart-button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transition: width 0.6s, height 0.6s;
  transform: translate(-50%, -50%);
  z-index: 0;
}

.cart-button:active::before {
  width: 300px;
  height: 300px;
}

.cart-button span {
  position: relative;
  z-index: 1;
}

/* Style spécial pour les cartes produits */
.card {
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* Animation pulse pour les boutons en loading */
@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 5px rgba(102, 126, 234, 0.5);
  }
  50% {
    box-shadow: 0 0 20px rgba(102, 126, 234, 0.8);
  }
}

.loading-cart {
  animation: pulse-glow 1.5s infinite;
}

/* Transitions pour la pagination */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Effet de survol amélioré pour les boutons de pagination */
.join-item.btn:hover:not(.btn-disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

/* Animation pour le bouton de page active */
.btn-primary.join-item {
  animation: pulse-active 2s infinite;
}

@keyframes pulse-active {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(16, 185, 129, 0);
  }
}
</style>
