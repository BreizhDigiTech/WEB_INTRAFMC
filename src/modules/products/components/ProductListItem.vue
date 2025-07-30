<template>
  <div class="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 hover:border-gray-600/50 hover:bg-gray-800/50 transition-all duration-300">
    <div class="flex items-center gap-4">
      <!-- Image du produit -->
      <div class="relative w-16 h-16 flex-shrink-0">
        <img
          :src="getProductImage(product)"
          :alt="product.name"
          class="w-full h-full object-cover rounded-lg"
          @error="handleImageError"
        >
        <!-- Badge statut -->
        <div
          class="absolute -top-1 -right-1 badge border px-1 py-0.5 text-xs"
          :class="getStatusBadgeClass(getProductStatus(product))"
        >
          {{ getStatusLabel(getProductStatus(product)).charAt(0) }}
        </div>
      </div>

      <!-- Informations principales -->
      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between">
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold text-white text-lg truncate">
              {{ product.name }}
            </h3>
            <div class="flex items-center gap-4 mt-1">
              <p v-if="product.category" class="text-sm text-gray-400">
                {{ product.category.name }}
              </p>
              <p v-if="product.sku" class="text-xs text-gray-500 font-mono">
                SKU: {{ product.sku }}
              </p>
            </div>
          </div>
          
          <!-- Prix -->
          <div class="text-right flex-shrink-0 ml-4">
            <div class="text-xl font-bold text-green-400">
              {{ formatPrice(product.price) }}
            </div>
            <div class="text-sm text-gray-400">
              Valeur stock: {{ formatPrice(calculateStockValue(product)) }}
            </div>
          </div>
        </div>

        <!-- Description -->
        <p v-if="product.description" class="text-sm text-gray-400 mt-2 line-clamp-1">
          {{ product.description }}
        </p>

        <!-- Informations détaillées -->
        <div class="flex items-center justify-between mt-3">
          <div class="flex items-center gap-6">
            <!-- Stock -->
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4" :class="getStockColorClass(product)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v1a1 1 0 01-1 1v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7a1 1 0 01-1-1V5a1 1 0 011-1h4zM9 4h6V3H9v1zm-2 3v9h10V7H7z" />
              </svg>
              <span class="text-sm" :class="getStockColorClass(product)">
                {{ formatNumber(product.stock) }} en stock
              </span>
            </div>

            <!-- Fournisseur -->
            <div v-if="product.supplier" class="flex items-center gap-2">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span class="text-sm text-gray-400">{{ product.supplier.name }}</span>
            </div>

            <!-- Poids et dimensions -->
            <div v-if="product.weight || product.dimensions" class="flex items-center gap-2">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              </svg>
              <span class="text-sm text-gray-400">
                <span v-if="product.weight">{{ formatWeight(product.weight) }}</span>
                <span v-if="product.weight && product.dimensions"> • </span>
                <span v-if="product.dimensions">{{ formatDimensions(product.dimensions) }}</span>
              </span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2">
            <!-- Stock rapide -->
            <button
              @click="showStockModal = true"
              class="btn btn-sm btn-outline border-gray-600 text-gray-300 hover:bg-blue-600 hover:border-blue-600"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v1a1 1 0 01-1 1v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7a1 1 0 01-1-1V5a1 1 0 011-1h4zM9 4h6V3H9v1zm-2 3v9h10V7H7z" />
              </svg>
              Stock
            </button>

            <!-- Modifier -->
            <button
              @click="$emit('edit', product)"
              class="btn btn-sm btn-ghost text-gray-300 hover:bg-blue-600"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>

            <!-- Menu actions -->
            <div class="dropdown dropdown-end">
              <div tabindex="0" role="button" class="btn btn-sm btn-ghost btn-circle">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </div>
              <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-gray-800 border border-gray-700 rounded-box w-52">
                <li>
                  <button @click="duplicateProduct" class="text-gray-300 hover:bg-gray-700">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Dupliquer
                  </button>
                </li>
                <li>
                  <button @click="$emit('delete', product)" class="text-red-400 hover:bg-red-900/30">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Supprimer
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Tags -->
        <div v-if="product.tags && product.tags.length > 0" class="flex flex-wrap gap-1 mt-3">
          <span
            v-for="tag in product.tags"
            :key="tag"
            class="badge badge-sm bg-gray-700/50 text-gray-300 border-gray-600"
          >
            {{ tag }}
          </span>
        </div>
      </div>
    </div>

    <!-- Modal de mise à jour du stock -->
    <dialog v-if="showStockModal" class="modal modal-open">
      <div class="modal-box bg-gray-800 border border-gray-700">
        <h3 class="font-bold text-lg text-white mb-4">Mettre à jour le stock</h3>
        <div class="form-control mb-4">
          <label class="label">
            <span class="label-text text-gray-300">{{ product.name }}</span>
            <span class="label-text-alt text-gray-400">Stock actuel: {{ product.stock }}</span>
          </label>
          <input
            v-model.number="newStock"
            type="number"
            class="input input-bordered bg-gray-700 border-gray-600 text-white"
            :placeholder="product.stock.toString()"
            min="0"
          >
        </div>
        <div class="modal-action">
          <button @click="updateStockValue" class="btn btn-primary" :disabled="newStock === product.stock">
            Mettre à jour
          </button>
          <button @click="showStockModal = false" class="btn btn-ghost">
            Annuler
          </button>
        </div>
      </div>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Product } from '../types'
import {
  formatPrice,
  formatNumber,
  formatWeight,
  formatDimensions,
  getProductStatus,
  getStatusBadgeClass,
  getStatusLabel,
  getProductImage,
  handleImageError,
  calculateStockValue
} from '../utils/formatters'

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

function duplicateProduct() {
  // TODO: Implémenter la duplication de produit
  console.log('Duplicate product:', props.product.name)
}

function updateStockValue() {
  if (newStock.value !== props.product.stock) {
    emit('updateStock', props.product, newStock.value)
  }
  showStockModal.value = false
}
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
