<template>
  <div 
    v-if="isOpen" 
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    @click="closeModal"
  >
    <div 
      class="bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
      @click.stop
    >
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-700">
        <div class="flex items-center space-x-3">
          <div class="p-2 bg-purple-600/20 rounded-lg">
            <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h3 class="text-xl font-semibold text-white">Aperçu de la facture</h3>
            <p class="text-gray-400 text-sm">Commande #{{ order?.id }}</p>
          </div>
        </div>
        <button 
          @click="closeModal"
          class="p-2 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="p-6 overflow-y-auto max-h-[60vh]">
        <div v-if="order" class="space-y-6">
          <!-- Informations de la facture -->
          <div class="bg-gray-700/50 rounded-xl p-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <h4 class="text-sm font-medium text-gray-400 uppercase tracking-wide mb-2">Facture N°</h4>
                <p class="text-white font-mono">{{ generateInvoiceNumber(order.id) }}</p>
              </div>
              <div>
                <h4 class="text-sm font-medium text-gray-400 uppercase tracking-wide mb-2">Date</h4>
                <p class="text-white">{{ formatInvoiceDate(order.created_at) }}</p>
              </div>
            </div>
          </div>

          <!-- Informations client -->
          <div class="bg-gray-700/50 rounded-xl p-4">
            <h4 class="text-sm font-medium text-gray-400 uppercase tracking-wide mb-3">Client</h4>
            <div class="text-white">
              <p class="font-medium">{{ order.user?.name || 'Client inconnu' }}</p>
              <p class="text-gray-300">{{ order.user?.email || 'Email non disponible' }}</p>
            </div>
          </div>

          <!-- Articles -->
          <div class="bg-gray-700/50 rounded-xl p-4">
            <h4 class="text-sm font-medium text-gray-400 uppercase tracking-wide mb-3">Articles</h4>
            <div class="space-y-2">
              <div 
                v-for="product in order.products" 
                :key="product.id"
                class="flex justify-between items-center py-2 border-b border-gray-600 last:border-b-0"
              >
                <div class="flex-1">
                  <p class="text-white font-medium">{{ product.name }}</p>
                  <p class="text-gray-400 text-sm">{{ product.pivot.quantity }} × {{ formatCurrency(product.pivot.unit_price) }}</p>
                </div>
                <p class="text-white font-semibold">
                  {{ formatCurrency(product.pivot.quantity * product.pivot.unit_price) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Total -->
          <div class="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl p-4 border border-purple-600/30">
            <div class="flex justify-between items-center">
              <span class="text-xl font-semibold text-white">Total HT</span>
              <span class="text-2xl font-bold text-purple-400">{{ formatCurrency(order.total) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex justify-between items-center p-6 border-t border-gray-700">
        <button 
          @click="closeModal"
          class="btn bg-gray-700 hover:bg-gray-600 text-white border-none"
        >
          Annuler
        </button>
        <div class="flex space-x-3">
          <button 
            @click="downloadInvoice"
            :disabled="downloading"
            class="btn bg-purple-600 hover:bg-purple-700 text-white border-none"
          >
            <span v-if="downloading" class="loading loading-spinner loading-sm"></span>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span class="ml-2">{{ downloading ? 'Téléchargement...' : 'Télécharger PDF' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Order } from '../types'

interface Props {
  isOpen: boolean
  order: Order | null
}

interface Emits {
  (e: 'close'): void
  (e: 'download', orderId: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const downloading = ref(false)

function closeModal() {
  emit('close')
}

async function downloadInvoice() {
  if (!props.order) return
  
  downloading.value = true
  try {
    emit('download', props.order.id)
    // Fermer le modal après déclenchement du téléchargement
    setTimeout(() => {
      closeModal()
    }, 500)
  } finally {
    downloading.value = false
  }
}

function generateInvoiceNumber(orderId: string): string {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `INV-${year}${month}-${orderId}`
}

function formatInvoiceDate(dateString: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(dateString))
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}
</script>
