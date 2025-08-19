<template>
  <div class="group bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden hover:border-gray-600/50 hover:bg-gray-800/50 transition-all duration-300 hover:scale-[1.02]">
    <!-- Image du produit -->
    <div class="relative aspect-square overflow-hidden bg-gray-700/30">
      <img
        :src="getProductImage(product)"
        :alt="product.name"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        @error="handleImageError"
      >
      
      <!-- Badges overlay -->
      <div class="absolute top-3 left-3 flex flex-col gap-2">
        <!-- Badge statut -->
        <div
          class="badge border px-2 py-1 text-xs font-medium"
          :class="getStatusBadgeClass(getProductStatus(product))"
        >
          {{ getStatusLabel(getProductStatus(product)) }}
        </div>
        
        <!-- Badge nouveau -->
        <div
          v-if="isNewProduct(product)"
          class="badge bg-purple-600/20 text-purple-400 border-purple-600/30 px-2 py-1 text-xs font-medium"
        >
          Nouveau
        </div>
        
        <!-- Badge promotion -->
        <div
          v-if="isOnSale(product)"
          class="badge bg-red-600/20 text-red-400 border-red-600/30 px-2 py-1 text-xs font-medium"
        >
          Promo
        </div>
      </div>

      <!-- Actions rapides -->
      <div class="absolute top-3 right-3">
        <div class="flex flex-col gap-2">
          <button
            @click="$emit('edit', product)"
            class="btn btn-sm bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg px-3 py-1 flex items-center gap-2 border-0 transition-all duration-200"
            style="box-shadow: 0 2px 8px 0 rgba(37,99,235,0.25);"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span class="hidden md:inline">Modifier</span>
          </button>
          <!-- Bouton favori supprimé -->
        </div>
      </div>

      <!-- Indicateur de stock -->
      <div class="absolute bottom-3 left-3 right-3">
        <div class="bg-gray-900/80 backdrop-blur-sm rounded-lg p-2">
          <div class="flex items-center justify-between text-xs">
            <span class="text-gray-300">Stock:</span>
            <span :class="getStockColorClass(product)">{{ formatNumber(product.stock) }}</span>
          </div>
          <div class="w-full bg-gray-700 rounded-full h-1.5 mt-1">
            <div
              class="h-1.5 rounded-full transition-all duration-300"
              :class="getStockBarClass(product)"
              :style="{ width: getStockPercentage(product) + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenu de la carte -->
    <div class="p-4">
      <!-- Nom et catégorie -->
      <div class="mb-3">
        <h3 class="font-semibold text-white text-lg line-clamp-2 group-hover:text-blue-400 transition-colors">
          {{ product.name }}
        </h3>
  <!-- Catégorie (non présent dans le type Product fourni) -->
  <p v-if="false" class="text-sm text-gray-400 mt-1"></p>
      </div>

      <!-- Prix et SKU -->
      <div class="flex items-center justify-between mb-4">
        <div class="text-2xl font-bold text-green-400">
          {{ formatPrice(product.price) }}
        </div>
  <!-- SKU non présent dans le type Product -->
  <div v-if="false" class="text-xs text-gray-500 font-mono"></div>
      </div>

      <!-- Description -->
      <p v-if="product.description" class="text-sm text-gray-400 line-clamp-2 mb-4">
        {{ product.description }}
      </p>

      <!-- Tags -->
  <!-- Tags non présents dans le type Product -->
  <div v-if="false" class="flex flex-wrap gap-1 mb-4"></div>

      <!-- Actions -->
      <div class="flex gap-2">
        <button
          @click="openStockModal"
          class="btn btn-sm flex-1 btn-outline border-gray-600 text-gray-300 hover:bg-blue-600 hover:border-blue-600"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v1a1 1 0 01-1 1v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7a1 1 0 01-1-1V5a1 1 0 011-1h4zM9 4h6V3H9v1zm-2 3v9h10V7H7z" />
          </svg>
          Stock
        </button>
        <!-- Dropdown actions supprimé -->
      </div>
    </div>

    <!-- Modal de mise à jour du stock -->
    <dialog v-if="showStockModal" class="modal modal-open">
      <div class="modal-box bg-gray-800 border border-gray-700 max-w-md">
        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-bold text-lg text-white">Mettre à jour le stock</h3>
          <button
            @click="showStockModal = false"
            class="btn btn-sm btn-circle btn-ghost text-gray-400 hover:text-white"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <!-- Contenu -->
        <div class="space-y-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text text-gray-300">{{ product.name }}</span>
              <span class="label-text-alt text-gray-400">Stock actuel: {{ formatNumber(product.stock) }}</span>
            </label>
            <input
              v-model.number="newStock"
              type="number"
              class="input input-bordered bg-gray-700 border-gray-600 text-white"
              :placeholder="product.stock.toString()"
              min="0"
              autofocus
            >
          </div>
        </div>
        
        <!-- Actions -->
        <div class="modal-action mt-6">
          <button 
            @click="updateStockValue" 
            class="btn btn-primary" 
            :disabled="newStock === product.stock || newStock === null || newStock === undefined"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Mettre à jour
          </button>
          <button @click="showStockModal = false" class="btn btn-ghost">
            Annuler
          </button>
        </div>
      </div>
      
      <!-- Backdrop pour fermer la modal -->
      <form method="dialog" class="modal-backdrop">
        <button @click="showStockModal = false">Fermer</button>
      </form>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Product } from '../types';
import {
  formatNumber,
  formatPrice,
  getProductImage,
  getProductStatus,
  getStatusBadgeClass,
  getStatusLabel,
  handleImageError,
  isNewProduct,
  isOnSale
} from '../utils/formatters';

// Props
const props = defineProps<{
  product: Product
}>()

// Emits
const emit = defineEmits<{
  edit: [product: Product]
  delete: [product: Product]
  updateStock: [product: Product, stock: number]
}>()

// État local
const showStockModal = ref(false)
const newStock = ref(props.product.stock)

// Fonctions utilitaires
function getStockColorClass(product: Product): string {
  const status = getProductStatus(product)
  if (status === 'out_of_stock') return 'text-red-400'
  if (status === 'low_stock') return 'text-yellow-400'
  return 'text-green-400'
}

function getStockBarClass(product: Product): string {
  const status = getProductStatus(product)
  if (status === 'out_of_stock') return 'bg-red-500'
  if (status === 'low_stock') return 'bg-yellow-500'
  return 'bg-green-500'
}

function getStockPercentage(product: Product): number {
  const threshold = 10
  const maxStock = Math.max(product.stock, threshold * 2)
  return Math.min((product.stock / maxStock) * 100, 100)
}

// Fonctions supplémentaires (favoris/duplication) retirées pour le moment

function updateStockValue() {
  // Validation
  if (newStock.value === null || newStock.value === undefined || newStock.value < 0) {
    return
  }
  
  // Ne pas émettre si la valeur n'a pas changé
  if (newStock.value !== props.product.stock) {
    emit('updateStock', props.product, newStock.value)
  }
  
  // Fermer la modal
  showStockModal.value = false
}

// Réinitialiser le stock quand la modal s'ouvre
function openStockModal() {
  newStock.value = props.product.stock
  showStockModal.value = true
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Assurer que la modal ne créé pas de scroll */
.modal-box {
  max-height: 90vh;
  overflow-y: auto;
}

/* Améliorer l'apparence des input dans la modal */
.modal-box .input:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}
</style>
