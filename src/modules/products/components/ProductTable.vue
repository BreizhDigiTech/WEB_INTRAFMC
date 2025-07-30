<template>
  <div class="overflow-x-auto">
    <table class="table table-zebra w-full">
      <thead>
        <tr class="border-gray-700">
          <th class="bg-gray-800/50 text-gray-300">
            <label>
              <input type="checkbox" class="checkbox checkbox-sm" />
            </label>
          </th>
          <th class="bg-gray-800/50 text-gray-300">Produit</th>
          <th class="bg-gray-800/50 text-gray-300">Catégorie</th>
          <th class="bg-gray-800/50 text-gray-300">Prix</th>
          <th class="bg-gray-800/50 text-gray-300">Stock</th>
          <th class="bg-gray-800/50 text-gray-300">Statut</th>
          <th class="bg-gray-800/50 text-gray-300">Fournisseur</th>
          <th class="bg-gray-800/50 text-gray-300">Modifié</th>
          <th class="bg-gray-800/50 text-gray-300">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="product in products"
          :key="product.id"
          class="hover:bg-gray-800/30 border-gray-700/50"
        >
          <!-- Checkbox -->
          <td>
            <label>
              <input type="checkbox" class="checkbox checkbox-sm" />
            </label>
          </td>

          <!-- Produit -->
          <td>
            <div class="flex items-center gap-3">
              <div class="avatar">
                <div class="mask mask-squircle w-12 h-12">
                  <img
                    :src="getProductImage(product)"
                    :alt="product.name"
                    @error="handleImageError"
                  />
                </div>
              </div>
              <div>
                <div class="font-bold text-white">{{ product.name }}</div>
                <div class="text-sm text-gray-400">
                  {{ product.sku || 'Pas de SKU' }}
                </div>
              </div>
            </div>
          </td>

          <!-- Catégorie -->
          <td>
            <div v-if="product.category" class="text-gray-300">
              {{ product.category.name }}
            </div>
            <div v-else class="text-gray-500 italic">
              Aucune catégorie
            </div>
          </td>

          <!-- Prix -->
          <td>
            <div class="font-semibold text-green-400">
              {{ formatPrice(product.price) }}
            </div>
            <div class="text-sm text-gray-400">
              Valeur: {{ formatPrice(calculateStockValue(product)) }}
            </div>
          </td>

          <!-- Stock -->
          <td>
            <div class="flex items-center gap-2">
              <div
                class="font-semibold"
                :class="getStockColorClass(product)"
              >
                {{ formatNumber(product.stock) }}
              </div>
              <button
                @click="openStockModal(product)"
                class="btn btn-xs btn-ghost text-gray-400 hover:text-white"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            </div>
            <div class="w-full bg-gray-700 rounded-full h-1 mt-1">
              <div
                class="h-1 rounded-full transition-all duration-300"
                :class="getStockBarClass(product)"
                :style="{ width: getStockPercentage(product) + '%' }"
              ></div>
            </div>
          </td>

          <!-- Statut -->
          <td>
            <div
              class="badge border px-2 py-1"
              :class="getStatusBadgeClass(getProductStatus(product))"
            >
              {{ getStatusLabel(getProductStatus(product)) }}
            </div>
          </td>

          <!-- Fournisseur -->
          <td>
            <div v-if="product.supplier" class="text-gray-300">
              {{ product.supplier.name }}
            </div>
            <div v-else class="text-gray-500 italic">
              Aucun fournisseur
            </div>
          </td>

          <!-- Date de modification -->
          <td>
            <div v-if="product.updated_at" class="text-sm text-gray-400">
              {{ formatShortDate(product.updated_at) }}
            </div>
            <div v-else class="text-gray-500 italic">
              -
            </div>
          </td>

          <!-- Actions -->
          <td>
            <div class="flex items-center gap-1">
              <button
                @click="$emit('edit', product)"
                class="btn btn-xs btn-ghost text-blue-400 hover:bg-blue-600/20"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              
              <div class="dropdown dropdown-end">
                <div tabindex="0" role="button" class="btn btn-xs btn-ghost">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </div>
                <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-gray-800 border border-gray-700 rounded-box w-48">
                  <li>
                    <button @click="duplicateProduct(product)" class="text-gray-300 hover:bg-gray-700">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Dupliquer
                    </button>
                  </li>
                  <li>
                    <button 
                      @click="toggleActive(product)"
                      class="text-gray-300 hover:bg-gray-700"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {{ product.is_active ? 'Désactiver' : 'Activer' }}
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
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal de mise à jour du stock -->
    <dialog v-if="showStockModal && selectedProduct" class="modal modal-open">
      <div class="modal-box bg-gray-800 border border-gray-700">
        <h3 class="font-bold text-lg text-white mb-4">Mettre à jour le stock</h3>
        <div class="form-control mb-4">
          <label class="label">
            <span class="label-text text-gray-300">{{ selectedProduct.name }}</span>
            <span class="label-text-alt text-gray-400">Stock actuel: {{ selectedProduct.stock }}</span>
          </label>
          <input
            v-model.number="newStock"
            type="number"
            class="input input-bordered bg-gray-700 border-gray-600 text-white"
            :placeholder="selectedProduct.stock.toString()"
            min="0"
          >
        </div>
        <div class="modal-action">
          <button @click="updateStockValue" class="btn btn-primary" :disabled="newStock === selectedProduct.stock">
            Mettre à jour
          </button>
          <button @click="closeStockModal" class="btn btn-ghost">
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
  formatShortDate,
  getProductStatus,
  getStatusBadgeClass,
  getStatusLabel,
  getProductImage,
  handleImageError,
  calculateStockValue
} from '../utils/formatters'

// Props
const props = defineProps<{
  products: Product[]
}>()

// Emits
const emit = defineEmits<{
  edit: [product: Product]
  delete: [product: Product]
  updateStock: [product: Product, stock: number]
}>()

// État local
const showStockModal = ref(false)
const selectedProduct = ref<Product | null>(null)
const newStock = ref(0)

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
  const threshold = product.low_stock_threshold || 10
  const maxStock = Math.max(product.stock, threshold * 2)
  return Math.min((product.stock / maxStock) * 100, 100)
}

function openStockModal(product: Product) {
  selectedProduct.value = product
  newStock.value = product.stock
  showStockModal.value = true
}

function closeStockModal() {
  showStockModal.value = false
  selectedProduct.value = null
  newStock.value = 0
}

function updateStockValue() {
  if (selectedProduct.value && newStock.value !== selectedProduct.value.stock) {
    emit('updateStock', selectedProduct.value, newStock.value)
  }
  closeStockModal()
}

function duplicateProduct(product: Product) {
  // TODO: Implémenter la duplication de produit
  console.log('Duplicate product:', product.name)
}

function toggleActive(product: Product) {
  // TODO: Implémenter le toggle actif/inactif
  console.log('Toggle active for:', product.name)
}
</script>
