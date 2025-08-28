<template>
  <div class="container mx-auto px-4 py-8">
    <!-- En-tête -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-white mb-4">Mon Panier</h1>
      <div class="breadcrumbs text-sm">
        <ul>
          <li>
            <router-link to="/ecommerce" class="link link-hover text-primary">
              Catalogue
            </router-link>
          </li>
          <li class="text-gray-100">Panier</li>
        </ul>
      </div>
    </div>

    <!-- État de chargement -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="loading loading-spinner loading-lg"></div>
    </div>

    <!-- Erreur -->
    <div v-else-if="error" class="alert alert-error mb-6">
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{{ error }}</span>
      <button @click="clearError" class="btn btn-sm btn-ghost">Réessayer</button>
    </div>

    <!-- Panier vide -->
    <div v-else-if="isEmpty" class="text-center py-12">
      <div class="text-6xl mb-4">🛒</div>
      <h2 class="text-2xl font-semibold text-gray-100 mb-4">Votre panier est vide</h2>
      <p class="text-gray-200 mb-6">Découvrez nos produits et ajoutez-les à votre panier</p>
      <router-link to="/ecommerce" class="btn btn-primary">
        Voir le catalogue
      </router-link>
    </div>

    <!-- Contenu du panier -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Liste des articles -->
      <div class="lg:col-span-2 space-y-4">
        <div
          v-for="item in cartItems"
          :key="item.id"
          class="card bg-base-200 border border-base-300 shadow-md"
        >
          <div class="card-body p-4">
            <div class="flex flex-col sm:flex-row gap-4">
              <!-- Image du produit -->
              <div class="flex-shrink-0">
                <img
                  :src="(item.product.image_urls && item.product.image_urls[0]) || item.product.images?.[0] || '/images/placeholder-product.svg'"
                  :alt="item.product.name"
                  class="w-24 h-24 object-cover rounded-lg"
                />
              </div>

              <!-- Informations du produit -->
              <div class="flex-grow">
                <h3 class="font-semibold text-lg mb-2 text-white">
                  <router-link
                    :to="`/ecommerce/products/${item.product.id}`"
                    class="link link-hover text-primary"
                  >
                    {{ item.product.name }}
                  </router-link>
                </h3>
                
                <p class="text-sm text-gray-100 mb-2">
                  {{ item.product.description?.substring(0, 100) }}
                  <span v-if="item.product.description && item.product.description.length > 100">...</span>
                </p>

                <div class="flex flex-wrap gap-1 mb-2">
                  <span
                    v-for="category in item.product.categories"
                    :key="category.id"
                    class="badge badge-primary badge-sm"
                  >
                    {{ category.name }}
                  </span>
                </div>

                <div class="flex items-center justify-between">
                  <span class="text-lg font-bold text-primary">
                    {{ formatPrice(item.product.price) }}
                  </span>
                  <span class="text-sm text-gray-100">
                    Stock: {{ item.product.stock }}
                  </span>
                </div>
              </div>

              <!-- Contrôles de quantité et suppression -->
              <div class="flex flex-col justify-between items-end space-y-2">
                <!-- Prix total pour cet article -->
                <div class="text-right">
                  <div class="text-sm text-gray-200">Total</div>
                  <div class="text-xl font-bold text-white">
                    {{ formatPrice(item.product.price * item.quantity) }}
                  </div>
                </div>

                <!-- Contrôles de quantité -->
                <div class="flex items-center space-x-2">
                  <button
                    @click="decreaseItemQuantity(item.id)"
                    :disabled="!canDecreaseQuantity(item.id)"
                    class="btn btn-outline btn-sm btn-square"
                  >
                    -
                  </button>
                  
                  <input
                    :value="item.quantity"
                    @change="updateItemQuantity(item.id, Number(($event.target as HTMLInputElement).value))"
                    type="number"
                    min="1"
                    :max="item.product.stock"
                    class="input input-bordered input-sm w-16 text-center"
                  />
                  
                  <button
                    @click="increaseItemQuantity(item.id)"
                    :disabled="!canIncreaseQuantity(item.id)"
                    class="btn btn-outline btn-sm btn-square"
                  >
                    +
                  </button>
                </div>

                <!-- Bouton de suppression -->
                <button
                  @click="removeItemFromCart(item.id)"
                  :disabled="removingItems.has(item.id)"
                  class="btn btn-error btn-sm"
                  title="Supprimer du panier"
                >
                  <span v-if="removingItems.has(item.id)" class="loading loading-spinner loading-xs"></span>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions du panier -->
        <div class="flex justify-between items-center pt-4 border-t">
          <button
            @click="clearEntireCart"
            class="btn btn-outline btn-error"
          >
            Vider le panier
          </button>
          
          <router-link to="/ecommerce" class="btn btn-outline">
            Continuer mes achats
          </router-link>
        </div>
      </div>

      <!-- Résumé du panier -->
      <div class="lg:col-span-1">
        <div class="card bg-base-100 shadow-lg sticky top-4">
          <div class="card-body">
            <h2 class="card-title text-xl mb-4 text-base-content font-bold">Résumé du panier</h2>
            
            <!-- Détail des prix -->
            <div class="space-y-2 mb-4">
              <div class="flex justify-between text-base-content">
                <span>Articles ({{ totalItems }} produit{{ totalItems > 1 ? 's' : '' }})</span>
                <span>{{ formatTotalPrice }}</span>
              </div>
              
              <div class="flex justify-between text-sm text-gray-300">
                <span>Livraison</span>
                <span class="text-success font-medium">Gratuite</span>
              </div>
            </div>

            <div class="divider"></div>

            <!-- Total -->
            <div class="flex justify-between text-xl font-bold mb-6 text-base-content">
              <span>Total HT</span>
              <span class="text-primary">{{ formatTotalPrice }}</span>
            </div>

            <!-- Boutons d'action -->
            <div class="space-y-3">
              <button
                @click="createOrder"
                class="btn btn-primary w-full"
                :disabled="isEmpty"
              >
                Passer commande
              </button>
              
              <button
                @click="clearCartAction"
                class="btn btn-outline w-full"
                :disabled="isEmpty"
              >
                Vider le panier
              </button>
            </div>

            <!-- Informations supplémentaires -->
            <div class="mt-6 text-sm text-gray-300">
              <div class="flex items-center space-x-2 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <span>Livraison gratuite</span>
              </div>
              
              <div class="flex items-center space-x-2 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>Tarifs professionnels HT</span>
              </div>
              
              <div class="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Stock réservé 24h</span>
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
import { useRouter } from 'vue-router'
import { useCart } from '../composables/useCart'

const _router = useRouter()

// État local
const removingItems = ref<Set<string>>(new Set())

// Composable
const {
  cartItems,
  totalItems,
  totalPrice: _totalPrice,
  isEmpty,
  loading,
  error,
  formatTotalPrice,
  formatPrice,
  fetchCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  checkout,
  clearError,
  canIncreaseQuantity,
  canDecreaseQuantity,
  increaseQuantity,
  decreaseQuantity
} = useCart()

// Méthodes
const updateItemQuantity = async (itemId: string, newQuantity: number) => {
  if (newQuantity > 0) {
    try {
      await updateCartItem(itemId, newQuantity)
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error)
    }
  }
}

const increaseItemQuantity = async (itemId: string) => {
  await increaseQuantity(itemId)
}

const decreaseItemQuantity = async (itemId: string) => {
  await decreaseQuantity(itemId)
}

const removeItemFromCart = async (itemId: string) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cet article du panier ?')) {
    removingItems.value.add(itemId)
    try {
      await removeFromCart(itemId)
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      alert('Erreur lors de la suppression de l\'article. Veuillez réessayer.')
    } finally {
      removingItems.value.delete(itemId)
    }
  }
}

const clearEntireCart = async () => {
  if (confirm('Êtes-vous sûr de vouloir vider entièrement votre panier ?')) {
    try {
      await clearCart()
    } catch (error) {
      console.error('Erreur lors de la suppression du panier:', error)
    }
  }
}

const clearCartAction = async () => {
  if (confirm('Êtes-vous sûr de vouloir vider complètement votre panier ?')) {
    try {
      await clearCart()
    } catch (error) {
      console.error('Erreur lors de la suppression du panier:', error)
    }
  }
}

const createOrder = async () => {
  if (confirm('Êtes-vous sûr de vouloir passer cette commande ?')) {
    try {
      const order = await checkout()
      alert('Commande créée avec succès !')
      console.log('Commande créée:', order)
      // Optionnel: rediriger vers la page de confirmation de commande
      // await router.push(`/orders/${order.id}`)
    } catch (error) {
      console.error('Erreur lors de la création de la commande:', error)
      alert('Erreur lors de la création de la commande. Veuillez réessayer.')
    }
  }
}

const _saveForLater = () => {
  // TODO: Implémenter la sauvegarde du panier
  console.log('Sauvegarde du panier non encore implémentée')
}

// Cycle de vie
onMounted(async () => {
  await fetchCart()
})
</script>
