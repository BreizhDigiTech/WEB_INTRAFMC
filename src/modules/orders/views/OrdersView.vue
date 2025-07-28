<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
    <!-- Notification d'information -->
    <div v-if="!hideInfoBanner" class="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-6 max-w-6xl mx-auto">
      <div class="flex items-start gap-3">
        <svg class="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <h4 class="text-blue-400 font-medium mb-1">Commandes automatiques</h4>
          <p class="text-gray-300 text-sm">
            Les commandes apparaissent automatiquement ici lorsque les clients valident leurs paniers. 
            Vous pouvez les suivre, les traiter et gérer leur expédition depuis cette interface.
          </p>
        </div>
        <button 
          @click="hideInfoBanner = true"
          class="text-gray-400 hover:text-white transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Header -->
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-white mb-2">Gestion des Commandes</h1>
        <p class="text-gray-400">Suivi et gestion de toutes les commandes clients</p>
      </div>
      
      <!-- Actions principales -->
      <div class="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0">        
        <button 
          @click="refreshOrders"
          class="btn bg-gray-700 hover:bg-gray-600 text-white border-none flex items-center gap-2"
          :disabled="orderStore.isLoading"
        >
          <svg class="w-5 h-5" :class="{ 'animate-spin': orderStore.isLoading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Actualiser
        </button>
        
        <div class="dropdown dropdown-end">
          <div tabindex="0" role="button" class="btn bg-purple-600 hover:bg-purple-700 text-white border-none flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Exporter
          </div>
          <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow-2xl bg-gray-900 border border-gray-700 rounded-xl w-52">
            <li>
              <a @click="exportToExcel" class="text-gray-300 hover:text-white hover:bg-gray-800">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export Excel
              </a>
            </li>
            <li>
              <a @click="exportToPDF" class="text-gray-300 hover:text-white hover:bg-gray-800">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Export PDF
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Statistiques -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div class="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-400 text-sm">Total commandes</p>
            <p class="text-2xl font-bold text-white">
              {{ orderStore.orderStats?.total_orders || orders.length }}
            </p>
          </div>
          <div class="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-400 text-sm">Chiffre d'affaires</p>
            <p class="text-2xl font-bold text-white">
              {{ formatCurrency(orderStore.orderStats?.total_revenue || orderStore.totalRevenue) }}
            </p>
          </div>
          <div class="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-400 text-sm">En attente</p>
            <p class="text-2xl font-bold text-white">
              {{ orderStore.pendingOrders.length }}
            </p>
          </div>
          <div class="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-400 text-sm">En traitement</p>
            <p class="text-2xl font-bold text-white">
              {{ orderStore.processingOrders.length }}
            </p>
          </div>
          <div class="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtres et recherche -->
    <div class="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700 mb-6">
      <div class="flex flex-col lg:flex-row gap-4">
        <!-- Recherche -->
        <div class="flex-1">
          <div class="relative">
            <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              v-model="searchQuery"
              @input="debouncedSearch"
              type="text"
              placeholder="Rechercher par numéro, client, email..."
              class="input w-full pl-10 bg-gray-900/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
            />
          </div>
        </div>

        <!-- Filtres statut -->
        <div class="flex flex-wrap gap-2">
          <select 
            v-model="statusFilter"
            @change="applyFilters"
            class="select bg-gray-900/50 border-gray-600 text-white focus:border-blue-500"
          >
            <option value="">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="confirmed">Confirmée</option>
            <option value="processing">En préparation</option>
            <option value="shipped">Expédiée</option>
            <option value="delivered">Livrée</option>
            <option value="cancelled">Annulée</option>
            <option value="returned">Retournée</option>
          </select>

          <select 
            v-model="paymentStatusFilter"
            @change="applyFilters"
            class="select bg-gray-900/50 border-gray-600 text-white focus:border-blue-500"
          >
            <option value="">Tous les paiements</option>
            <option value="pending">En attente</option>
            <option value="paid">Payée</option>
            <option value="failed">Échec</option>
            <option value="refunded">Remboursée</option>
            <option value="partial">Partiel</option>
          </select>

          <button 
            @click="clearFilters"
            class="btn btn-outline text-gray-400 border-gray-600 hover:bg-gray-700"
          >
            Effacer filtres
          </button>
        </div>
      </div>
    </div>

    <!-- Table des commandes -->
    <div class="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700 overflow-hidden">
      <!-- Loading state -->
      <div v-if="orderStore.isLoading" class="flex items-center justify-center p-12">
        <div class="flex items-center gap-3 text-gray-400">
          <svg class="w-6 h-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Chargement des commandes...
        </div>
      </div>

      <!-- Error state -->
      <div v-else-if="orderStore.error" class="p-6">
        <div class="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
          <div class="flex items-center gap-3">
            <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 class="font-medium text-white">Erreur de chargement</h3>
              <p class="text-sm text-gray-400">{{ orderStore.error }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div v-else-if="orders.length > 0" class="overflow-x-auto">
        <table class="table w-full">
          <thead>
            <tr class="border-gray-700">
              <th class="text-gray-300 font-medium">ID Commande</th>
              <th class="text-gray-300 font-medium">Client</th>
              <th class="text-gray-300 font-medium">Montant</th>
              <th class="text-gray-300 font-medium">Statut</th>
              <th class="text-gray-300 font-medium">Paiement</th>
              <th class="text-gray-300 font-medium">Date</th>
              <th class="text-gray-300 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="order in orders" 
              :key="order.id"
              class="border-gray-700 hover:bg-gray-700/30 transition-colors cursor-pointer"
              @click="viewOrder(order)"
            >
              <td>
                <div class="font-medium text-white">{{ order.id }}</div>
                <div class="text-sm text-gray-400">{{ formatDate(order.created_at) }}</div>
              </td>
              <td>
                <div class="font-medium text-white">{{ order.user?.name || 'N/A' }}</div>
                <div class="text-sm text-gray-400">{{ order.user?.email || 'N/A' }}</div>
              </td>
              <td>
                <div class="font-medium text-white">{{ formatCurrency(order.total) }}</div>
                <div class="text-sm text-gray-400">{{ order.products?.length || 0 }} produit(s)</div>
              </td>
              <td>
                <span 
                  class="badge px-3 py-1 rounded-full text-xs font-medium"
                  :class="getStatusBadgeClass(order.status)"
                >
                  {{ orderStore.getStatusLabel(order.status) }}
                </span>
              </td>
              <td>
                <span 
                  class="badge px-3 py-1 rounded-full text-xs font-medium"
                  :class="getPaymentStatusBadgeClass(order.payment_status || 'pending')"
                >
                  {{ orderStore.getPaymentStatusLabel(order.payment_status || 'pending') }}
                </span>
              </td>
              <td>
                <div class="text-white">{{ formatDate(order.created_at) }}</div>
                <div class="text-sm text-gray-400">{{ formatTime(order.created_at) }}</div>
              </td>
              <td>
                <div class="flex gap-2" @click.stop>
                  <button 
                    @click="viewOrder(order)"
                    class="btn btn-sm bg-blue-600 hover:bg-blue-700 text-white border-none"
                    title="Voir les détails"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>

                  <div class="dropdown dropdown-end">
                    <div tabindex="0" role="button" class="btn btn-sm bg-gray-600 hover:bg-gray-700 text-white border-none">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </div>
                    <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow-2xl bg-gray-900 border border-gray-700 rounded-xl w-48">
                      <li v-if="order.status === 'confirmed'">
                        <a @click="updateOrderStatus(order.id, 'processing')" class="text-gray-300 hover:text-white hover:bg-gray-800">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          Mettre en préparation
                        </a>
                      </li>
                      <li v-if="order.status === 'processing'">
                        <a @click="showShipModal(order)" class="text-gray-300 hover:text-white hover:bg-gray-800">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                          </svg>
                          Expédier
                        </a>
                      </li>
                      <li v-if="order.status === 'shipped'">
                        <a @click="updateOrderStatus(order.id, 'delivered')" class="text-gray-300 hover:text-white hover:bg-gray-800">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                          </svg>
                          Marquer comme livrée
                        </a>
                      </li>
                      <li v-if="['pending', 'confirmed'].includes(order.status)">
                        <a @click="showCancelModal(order)" class="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Annuler
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty state -->
      <div v-else class="p-12 text-center">
        <svg class="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="text-xl font-medium text-white mb-2">Aucune commande trouvée</h3>
        <p class="text-gray-400 mb-6">Les commandes apparaîtront ici une fois que les clients auront validé leurs paniers</p>
        <button 
          @click="refreshOrders"
          class="btn bg-gray-600 hover:bg-gray-700 text-white border-none"
        >
          Actualiser la liste
        </button>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="orders.length > 0 && orderStore.pagination.last_page > 1" class="flex justify-center mt-6">
      <div class="join">
        <button 
          class="join-item btn"
          :class="{ 'btn-disabled': orderStore.pagination.current_page === 1 }"
          @click="changePage(orderStore.pagination.current_page - 1)"
        >
          «
        </button>
        
        <button 
          v-for="page in visiblePages" 
          :key="page"
          class="join-item btn"
          :class="{ 'btn-active': page === orderStore.pagination.current_page }"
          @click="changePage(page)"
        >
          {{ page }}
        </button>
        
        <button 
          class="join-item btn"
          :class="{ 'btn-disabled': orderStore.pagination.current_page === orderStore.pagination.last_page }"
          @click="changePage(orderStore.pagination.current_page + 1)"
        >
          »
        </button>
      </div>
    </div>

    <!-- Modals -->
    <ShipOrderModal 
      v-if="showShipOrderModal" 
      :order="selectedOrder"
      @close="showShipOrderModal = false"
      @shipped="onOrderShipped"
    />

    <CancelOrderModal 
      v-if="showCancelOrderModal" 
      :order="selectedOrder"
      @close="showCancelOrderModal = false"
      @cancelled="onOrderCancelled"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useOrderStore } from '../stores/orderStore'
import type { Order, OrderStatus } from '../types'
// import ShipOrderModal from '../components/ShipOrderModal.vue'
import CancelOrderModal from '../components/CancelOrderModal.vue'

// Composables
const router = useRouter()
const orderStore = useOrderStore()

// État local
const searchQuery = ref('')
const statusFilter = ref('')
const paymentStatusFilter = ref('')
const showShipOrderModal = ref(false)
const showCancelOrderModal = ref(false)
const selectedOrder = ref<Order | null>(null)
const hideInfoBanner = ref(false)

// Getters
const orders = computed(() => orderStore.filteredOrders)

const visiblePages = computed(() => {
  const current = orderStore.pagination.current_page
  const total = orderStore.pagination.last_page
  const pages = []
  
  const start = Math.max(1, current - 2)
  const end = Math.min(total, current + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// Méthodes
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('fr-FR')
}

function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

function getStatusBadgeClass(status: OrderStatus): string {
  const classes = {
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    confirmed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    processing: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    shipped: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    delivered: 'bg-green-500/20 text-green-400 border-green-500/30',
    cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
    returned: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
  }
  return classes[status] || ''
}

function getPaymentStatusBadgeClass(status: PaymentStatus): string {
  const classes = {
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    paid: 'bg-green-500/20 text-green-400 border-green-500/30',
    failed: 'bg-red-500/20 text-red-400 border-red-500/30',
    refunded: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    partial: 'bg-orange-500/20 text-orange-400 border-orange-500/30'
  }
  return classes[status] || ''
}

async function refreshOrders() {
  await orderStore.fetchOrders()
  await orderStore.fetchOrderStats() // Maintenant safe - calcule côté client
}

function applyFilters() {
  const filters: any = {}
  
  if (statusFilter.value) {
    filters.status = [statusFilter.value]
  }
  
  if (paymentStatusFilter.value) {
    filters.payment_status = [paymentStatusFilter.value]
  }
  
  orderStore.updateFilters(filters)
  orderStore.fetchOrders()
}

function clearFilters() {
  statusFilter.value = ''
  paymentStatusFilter.value = ''
  searchQuery.value = ''
  orderStore.clearFilters()
  orderStore.fetchOrders()
}

// Debounced search
let searchTimeout: ReturnType<typeof setTimeout>
function debouncedSearch() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    if (searchQuery.value.trim()) {
      orderStore.searchOrders(searchQuery.value)
    } else {
      orderStore.fetchOrders()
    }
  }, 300)
}

function viewOrder(order: Order) {
  router.push(`/orders/${order.id}`)
}

async function updateOrderStatus(orderId: string, status: OrderStatus) {
  try {
    await orderStore.updateOrder(orderId, { status })
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error)
  }
}

function showShipModal(order: Order) {
  selectedOrder.value = order
  showShipOrderModal.value = true
}

function showCancelModal(order: Order) {
  selectedOrder.value = order
  showCancelOrderModal.value = true
}

function changePage(page: number) {
  if (page >= 1 && page <= orderStore.pagination.last_page) {
    orderStore.fetchOrders(page)
  }
}

// Event handlers
function onOrderShipped(order: Order) {
  showShipOrderModal.value = false
  selectedOrder.value = null
}

function onOrderCancelled(order: Order) {
  showCancelOrderModal.value = false
  selectedOrder.value = null
}

// Fonctions d'export
function exportToExcel() {
  // Préparer les données pour l'export
  const exportData = orders.value.map(order => ({
    'ID': order.id,
    'Client': order.user?.name || 'N/A',
    'Email': order.user?.email || 'N/A',
    'Total': order.total + '€',
    'Statut': orderStore.getStatusLabel(order.status),
    'Paiement': orderStore.getPaymentStatusLabel(order.payment_status || 'pending'),
    'Date création': new Date(order.created_at).toLocaleDateString('fr-FR'),
    'Date mise à jour': new Date(order.updated_at).toLocaleDateString('fr-FR'),
    'Produits': order.products?.length || 0
  }))

  // Convertir en CSV
  const headers = Object.keys(exportData[0] || {})
  const csvContent = [
    headers.join(','),
    ...exportData.map(row => headers.map(header => `"${row[header as keyof typeof row]}"`).join(','))
  ].join('\n')

  // Télécharger le fichier
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `commandes_${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function exportToPDF() {
  // Ouvrir une nouvelle fenêtre avec un rapport PDF des commandes
  const printWindow = window.open('', '_blank')
  if (!printWindow) return

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Rapport des Commandes</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; font-weight: bold; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .summary { background: #e3f2fd; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
      </style>
    </head>
    <body>
      <h1>Rapport des Commandes - ${new Date().toLocaleDateString('fr-FR')}</h1>
      
      <div class="summary">
        <h3>Résumé</h3>
        <p><strong>Total des commandes:</strong> ${orders.value.length}</p>
        <p><strong>En attente:</strong> ${orderStore.pendingOrders.length}</p>
        <p><strong>En préparation:</strong> ${orderStore.processingOrders.length}</p>
        <p><strong>Expédiées:</strong> ${orderStore.shippedOrders.length}</p>
        <p><strong>Chiffre d'affaires total:</strong> ${formatCurrency(orderStore.totalRevenue)}</p>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Client</th>
            <th>Total</th>
            <th>Statut</th>
            <th>Paiement</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          ${orders.value.map(order => `
            <tr>
              <td>${order.id}</td>
              <td>${order.user?.name || 'N/A'}</td>
              <td>${formatCurrency(order.total)}</td>
              <td>${orderStore.getStatusLabel(order.status)}</td>
              <td>${orderStore.getPaymentStatusLabel(order.payment_status || 'pending')}</td>
              <td>${new Date(order.created_at).toLocaleDateString('fr-FR')}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </body>
    </html>
  `

  printWindow.document.write(htmlContent)
  printWindow.document.close()
  printWindow.print()
}

// Lifecycle
onMounted(() => {
  refreshOrders()
})

// Watchers
watch(searchQuery, () => {
  orderStore.searchQuery = searchQuery.value
})
</script>
