<template>
  <!-- Indicateur de panier pour la navbar -->
  <router-link 
    v-if="!authStore.isAdmin" 
    to="/ecommerce/cart"
    class="btn btn-ghost p-2 text-white hover:text-emerald-400 hover:bg-emerald-900/30 transition-all duration-200 relative shadow-lg hover:shadow-emerald-500/20"
  >
    <svg class="w-[32px] h-[32px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z" />
    </svg>
    <!-- Badge avec nombre de produits différents -->
    <div 
      v-if="numberOfProducts > 0" 
      class="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-white text-xs rounded-full flex items-center justify-center font-bold border-2 border-gray-900 shadow-lg animate-pulse"
    >
      {{ numberOfProducts > 99 ? '99+' : numberOfProducts }}
    </div>
  </router-link>
</template>

<script setup lang="ts">
import { useCart } from '@/modules/ecommerce/composables/useCart'
import { useAuthStore } from '@/stores/auth'
import { computed, onMounted } from 'vue'

const authStore = useAuthStore()
const { totalItems, cartItems, fetchCart } = useCart()

// Calculer le nombre de produits différents (pas la quantité totale)
const numberOfProducts = computed(() => cartItems.value.length)

// Charger le panier au montage du composant pour les utilisateurs non-admin
onMounted(async () => {
  if (!authStore.isAdmin) {
    try {
      await fetchCart()
    } catch (error) {
      // Erreur silencieuse, le panier peut ne pas exister encore
      console.debug('Panier non trouvé ou vide')
    }
  }
})
</script>
