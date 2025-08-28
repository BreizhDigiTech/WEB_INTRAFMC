<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Breadcrumb -->
    <div class="breadcrumbs text-sm mb-6">
      <ul>
        <li>
          <router-link to="/ecommerce" class="link link-hover">
            Catalogue
          </router-link>
        </li>
        <li v-if="currentProduct">{{ currentProduct.name }}</li>
      </ul>
    </div>

    <!-- État de chargement -->
    <div v-if="loading.currentProduct" class="flex justify-center items-center py-20">
      <div class="loading loading-spinner loading-lg"></div>
    </div>

    <!-- Erreur -->
    <div v-else-if="error.currentProduct" class="alert alert-error">
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{{ error.currentProduct }}</span>
      <button @click="clearErrors" class="btn btn-sm btn-ghost">Réessayer</button>
    </div>

    <!-- Détail du produit -->
    <div v-else-if="currentProduct" class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
      <!-- Images du produit -->
      <div class="space-y-4">
        <!-- Image principale -->
        <div class="bg-base-200 rounded-lg overflow-hidden">
          <img
            :src="selectedImage || currentProduct.image_urls[0] || '/images/placeholder-product.svg'"
            :alt="currentProduct.name"
            class="w-full h-96 object-cover"
          />
        </div>

        <!-- Miniatures -->
        <div v-if="currentProduct.image_urls.length > 1" class="grid grid-cols-4 gap-2">
          <button
            v-for="(image, index) in currentProduct.image_urls"
            :key="index"
            @click="selectedImage = image"
            :class="[
              'border-2 rounded-lg overflow-hidden transition-all',
              selectedImage === image || (!selectedImage && index === 0)
                ? 'border-primary'
                : 'border-base-300 hover:border-base-400'
            ]"
          >
            <img
              :src="image"
              :alt="`${currentProduct.name} - Image ${index + 1}`"
              class="w-full h-20 object-cover"
            />
          </button>
        </div>
      </div>

      <!-- Informations du produit -->
      <div class="space-y-6">
        <!-- Titre et prix -->
        <div>
          <h1 class="text-3xl font-bold text-white mb-2">
            {{ currentProduct.name }}
          </h1>
          <div class="flex items-center space-x-4 mb-4">
            <span class="text-3xl font-bold text-primary">
              {{ formatPrice(currentProduct.price) }}
            </span>
            <div
              :class="[
                'badge badge-lg',
                currentProduct.stock > 0 ? 'badge-success' : 'badge-error'
              ]"
            >
              {{ stockStatus }}
            </div>
          </div>
        </div>

        <!-- Catégories -->
        <div v-if="currentProduct.categories.length > 0">
          <h3 class="text-sm font-medium text-gray-200 mb-2">Catégories</h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="category in currentProduct.categories"
              :key="category.id"
              class="badge badge-primary"
            >
              {{ category.name }}
            </span>
          </div>
        </div>

        <!-- Description -->
        <div v-if="currentProduct.description">
          <h3 class="text-lg font-semibold text-white mb-3">Description</h3>
          <p class="text-gray-300 leading-relaxed">
            {{ currentProduct.description }}
          </p>
        </div>

        <!-- Sélecteur de quantité et ajout au panier -->
        <div class="border-t border-base-300 pt-6">
          <div class="flex items-center space-x-4 mb-4">
            <label for="quantity" class="text-sm font-medium text-gray-200">
              Quantité :
            </label>
            <div class="flex items-center">
              <button
                @click="decreaseQuantity"
                :disabled="quantity <= 1"
                class="btn btn-outline btn-sm"
              >
                -
              </button>
              <input
                id="quantity"
                v-model.number="quantity"
                type="number"
                min="1"
                :max="currentProduct.stock"
                class="input input-bordered input-sm w-20 mx-2 text-center bg-base-200 text-white"
              />
              <button
                @click="increaseQuantity"
                :disabled="quantity >= currentProduct.stock"
                class="btn btn-outline btn-sm"
              >
                +
              </button>
            </div>
            <span class="text-sm text-gray-400">
              Maximum: {{ currentProduct.stock }}
            </span>
          </div>

          <div class="flex space-x-4">
            <button
              @click="addProductToCart"
              :disabled="currentProduct.stock === 0 || isAddingToCart"
              class="btn btn-primary flex-1"
            >
              <span v-if="isAddingToCart" class="loading loading-spinner loading-sm"></span>
              <span v-else-if="isProductInCart(currentProduct.id)">
                Mettre à jour le panier ({{ getItemQuantity(currentProduct.id) }})
              </span>
              <span v-else>
                Ajouter au panier
              </span>
            </button>
            
            <button
              @click="toggleWishlist"
              class="btn btn-outline"
              title="Ajouter aux favoris"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Actions supplémentaires -->
        <div class="border-t border-base-300 pt-6">
          <div class="flex space-x-4">
            <button
              @click="goBack"
              class="btn btn-outline border-primary text-primary hover:bg-primary hover:text-white"
            >
              ← Retour au catalogue
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Produit non trouvé -->
    <div v-else class="text-center py-20">
      <div class="text-6xl mb-4">❌</div>
      <h2 class="text-2xl font-semibold text-gray-200 mb-4">Produit non trouvé</h2>
      <p class="text-gray-400 mb-6">Le produit que vous recherchez n'existe pas ou n'est plus disponible.</p>
      <button @click="goBack" class="btn btn-primary">
        Retour au catalogue
      </button>
    </div>

    <!-- Produits similaires -->
    <div v-if="currentProduct && similarProducts.length > 0" class="border-t border-base-300 pt-12">
      <h2 class="text-2xl font-bold text-white mb-6">Produits similaires</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="product in similarProducts"
          :key="product.id"
          class="card bg-base-200 border border-base-300 hover:border-primary/50 transition-all duration-300 transform hover:scale-105 hover:shadow-xl cursor-pointer"
          @click="viewProduct(product.id)"
        >
          <figure class="px-4 pt-4">
            <img
              :src="product.image_urls[0] || '/images/placeholder-product.svg'"
              :alt="product.name"
              class="rounded-lg w-full h-32 object-cover"
            />
          </figure>
          <div class="card-body p-4">
            <h3 class="card-title text-sm text-white">{{ product.name }}</h3>
            <p class="text-lg font-bold text-primary">{{ formatPrice(product.price) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCart } from '../composables/useCart'
import { useProducts } from '../composables/useProducts'

const route = useRoute()
const router = useRouter()

// Composables
const {
  currentProduct,
  products,
  loading,
  error,
  fetchProduct,
  clearErrors,
  formatPrice,
  getProductsByCategory: _getProductsByCategory
} = useProducts()

const {
  addToCart,
  isProductInCart,
  getItemQuantity,
  fetchCart
} = useCart()

// État local
const selectedImage = ref('')
const quantity = ref(1)
const isAddingToCart = ref(false)

// Getters calculés
const stockStatus = computed(() => {
  if (!currentProduct.value) return ''
  return currentProduct.value.stock > 0 
    ? `${currentProduct.value.stock} en stock`
    : 'Rupture de stock'
})

const similarProducts = computed(() => {
  if (!currentProduct.value || !products.value.length) return []
  
  // Récupérer des produits de la même catégorie (max 4)
  const categoryIds = currentProduct.value.categories.map(cat => cat.id)
  const similar = products.value
    .filter(product => 
      product.id !== currentProduct.value!.id &&
      product.categories.some(cat => categoryIds.includes(cat.id))
    )
    .slice(0, 4)
  
  return similar
})

// Méthodes
const increaseQuantity = () => {
  if (currentProduct.value && quantity.value < currentProduct.value.stock) {
    quantity.value++
  }
}

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const addProductToCart = async () => {
  if (!currentProduct.value) return
  
  isAddingToCart.value = true
  try {
    await addToCart(currentProduct.value.id, quantity.value)
    // Optionnel: afficher une notification de succès
    console.log(`${quantity.value} x ${currentProduct.value.name} ajouté(s) au panier`)
  } catch (error) {
    console.error('Erreur lors de l\'ajout au panier:', error)
    // Optionnel: afficher une notification d'erreur
  } finally {
    isAddingToCart.value = false
  }
}

const toggleWishlist = () => {
  // TODO: Implémenter la logique des favoris
  console.log('Favoris non encore implémentés')
}

const goBack = () => {
  router.back()
}

const viewProduct = (productId: string) => {
  router.push(`/ecommerce/products/${productId}`)
}

// Watchers
watch(() => route.params.id, async (newId) => {
  if (newId && typeof newId === 'string') {
    selectedImage.value = ''
    quantity.value = 1
    await fetchProduct(newId)
  }
})

watch(currentProduct, (newProduct) => {
  if (newProduct && newProduct.image_urls.length > 0) {
    selectedImage.value = newProduct.image_urls[0]
  }
})

// Cycle de vie
onMounted(async () => {
  const productId = route.params.id as string
  if (productId) {
    await Promise.all([
      fetchProduct(productId),
      fetchCart()
    ])
  }
})
</script>
