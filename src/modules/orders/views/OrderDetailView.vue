<template>
  <div class="container mx-auto px-4 py-8">
    <!-- En-tête avec bouton retour -->
    <div class="flex items-center gap-4 mb-6">
      <button 
        @click="goBack"
        class="btn btn-ghost btn-sm text-gray-400 hover:text-white"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Retour
      </button>
      <h1 class="text-3xl font-bold text-white">Détail de la commande</h1>
      <button 
        @click="refreshOrder"
        :disabled="loading"
        class="btn bg-blue-600 hover:bg-blue-700 text-white border-none ml-auto"
      >
        <span v-if="loading" class="loading loading-spinner loading-sm mr-2"></span>
        {{ loading ? 'Chargement...' : 'Actualiser' }}
      </button>
    </div>

    <!-- Chargement -->
    <div v-if="loading && !order" class="flex justify-center items-center py-20">
      <span class="loading loading-spinner loading-lg text-blue-400"></span>
      <p class="text-gray-400 ml-4">Chargement de la commande...</p>
    </div>

    <!-- Erreur -->
    <div v-else-if="error" class="alert alert-error">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{{ error }}</span>
    </div>

    <!-- Détails de la commande -->
    <div v-else-if="order" class="space-y-6">
      <!-- Informations principales -->
      <div class="bg-gray-800 rounded-lg shadow-lg p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label class="text-gray-400 text-sm">ID de la commande</label>
            <p class="text-white font-mono text-lg">{{ order.id }}</p>
          </div>
          <div>
            <label class="text-gray-400 text-sm">Total</label>
            <p class="text-white text-lg font-semibold">{{ formatCurrency(order.total) }}</p>
          </div>
          <div>
            <label class="text-gray-400 text-sm">Statut</label>
            <span 
              :class="getStatusBadgeClass(order.status)"
              class="badge badge-lg font-medium"
            >
              {{ getStatusLabel(order.status) }}
            </span>
          </div>
          <div>
            <label class="text-gray-400 text-sm">Date de création</label>
            <p class="text-white">{{ formatDate(order.created_at) }}</p>
          </div>
        </div>
      </div>

      <!-- Informations client -->
      <div v-if="order.user" class="bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 class="text-xl font-semibold text-white mb-4">Informations client</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label class="text-gray-400 text-sm">ID Client</label>
            <p class="text-white font-mono">{{ order.user.id }}</p>
          </div>
          <div>
            <label class="text-gray-400 text-sm">Nom</label>
            <p class="text-white">{{ order.user.name }}</p>
          </div>
          <div>
            <label class="text-gray-400 text-sm">Email</label>
            <p class="text-white">{{ order.user.email }}</p>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 class="text-xl font-semibold text-white mb-4">Actions</h2>
        <div class="flex gap-3">
          <button 
            v-if="order.status === 'pending'"
            @click="validateOrder"
            :disabled="actionLoading"
            class="btn bg-green-600 hover:bg-green-700 text-white border-none"
          >
            <span v-if="actionLoading" class="loading loading-spinner loading-sm mr-2"></span>
            <svg v-else class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Valider la commande
          </button>
          
          <button 
            v-if="order.status === 'pending'"
            @click="cancelOrder"
            :disabled="actionLoading"
            class="btn bg-red-600 hover:bg-red-700 text-white border-none"
          >
            <span v-if="actionLoading" class="loading loading-spinner loading-sm mr-2"></span>
            <svg v-else class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Annuler la commande
          </button>

          <div v-if="order.status !== 'pending'" class="text-gray-400 italic">
            Aucune action disponible pour une commande {{ getStatusLabel(order.status).toLowerCase() }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOrderStore } from '../stores/orderStore'
import type { Order, OrderStatus } from '../types'

// Router
const route = useRoute()
const router = useRouter()

// Store
const orderStore = useOrderStore()

// État local
const order = ref<Order | null>(null)
const loading = ref(false)
const actionLoading = ref(false)
const error = ref<string | null>(null)

// ID de la commande depuis la route
const orderId = route.params.id as string

// Charger la commande au montage
onMounted(async () => {
  await refreshOrder()
})

// Actions
async function refreshOrder() {
  if (!orderId) {
    error.value = 'ID de commande manquant'
    return
  }

  loading.value = true
  error.value = null
  
  try {
    order.value = await orderStore.fetchOrderById(orderId)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Erreur lors du chargement de la commande'
    console.error('Erreur refreshOrder:', err)
  } finally {
    loading.value = false
  }
}

async function validateOrder() {
  if (!order.value) return
  
  actionLoading.value = true
  try {
    const updatedOrder = await orderStore.validateOrder(order.value.id)
    order.value = updatedOrder
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Erreur lors de la validation'
    console.error('Erreur validateOrder:', err)
  } finally {
    actionLoading.value = false
  }
}

async function cancelOrder() {
  if (!order.value) return
  
  actionLoading.value = true
  try {
    const updatedOrder = await orderStore.cancelOrder(order.value.id)
    order.value = updatedOrder
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Erreur lors de l\'annulation'
    console.error('Erreur cancelOrder:', err)
  } finally {
    actionLoading.value = false
  }
}

function goBack() {
  router.push('/orders')
}

// Utilitaires d'affichage
function getStatusLabel(status: OrderStatus): string {
  const labels = {
    pending: 'En attente',
    validated: 'Validée',
    cancelled: 'Annulée'
  }
  return labels[status] || status
}

function getStatusBadgeClass(status: OrderStatus): string {
  const classes = {
    pending: 'badge-warning',
    validated: 'badge-success',
    cancelled: 'badge-error'
  }
  return classes[status] || 'badge-neutral'
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateString))
}
</script>
