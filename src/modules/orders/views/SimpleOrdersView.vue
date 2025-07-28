<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-white">Gestion des commandes</h1>
      <div class="flex gap-3">
        <button 
          @click="refreshOrders"
          :disabled="orderStore.loading"
          class="btn bg-blue-600 hover:bg-blue-700 text-white border-none"
        >
          <span v-if="orderStore.loading" class="loading loading-spinner loading-sm mr-2"></span>
          <svg v-else class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {{ orderStore.loading ? 'Chargement...' : 'Actualiser' }}
        </button>
      </div>
    </div>

    <!-- Statistiques globales -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="stats shadow bg-gray-800">
        <div class="stat">
          <div class="stat-title text-gray-400">En attente</div>
          <div class="stat-value text-yellow-400">
            <span v-if="orderStore.statsLoading" class="loading loading-spinner loading-md"></span>
            <span v-else>{{ displayStats.pending }}</span>
          </div>
          <div class="stat-desc text-gray-500">
            {{ displayStats.total > 0 ? ((displayStats.pending / displayStats.total) * 100).toFixed(1) + '% du total' : '' }}
          </div>
        </div>
      </div>
      <div class="stats shadow bg-gray-800">
        <div class="stat">
          <div class="stat-title text-gray-400">Validées</div>
          <div class="stat-value text-green-400">
            <span v-if="orderStore.statsLoading" class="loading loading-spinner loading-md"></span>
            <span v-else>{{ displayStats.validated }}</span>
          </div>
          <div class="stat-desc text-gray-500">
            {{ displayStats.total > 0 ? ((displayStats.validated / displayStats.total) * 100).toFixed(1) + '% du total' : '' }}
          </div>
        </div>
      </div>
      <div class="stats shadow bg-gray-800">
        <div class="stat">
          <div class="stat-title text-gray-400">Annulées</div>
          <div class="stat-value text-red-400">
            <span v-if="orderStore.statsLoading" class="loading loading-spinner loading-md"></span>
            <span v-else>{{ displayStats.cancelled }}</span>
          </div>
          <div class="stat-desc text-gray-500">
            {{ displayStats.total > 0 ? ((displayStats.cancelled / displayStats.total) * 100).toFixed(1) + '% du total' : '' }}
          </div>
        </div>
      </div>
      <div class="stats shadow bg-gray-800">
        <div class="stat">
          <div class="stat-title text-gray-400">Total</div>
          <div class="stat-value text-blue-400">
            <span v-if="orderStore.statsLoading" class="loading loading-spinner loading-md"></span>
            <span v-else>{{ displayStats.total }}</span>
          </div>
          <div class="stat-desc text-gray-500">
            <span v-if="!orderStore.statsLoading">
              {{ statsType }}
              <span v-if="orderStore.globalStats.totalRevenue > 0" class="block">
                CA: {{ formatCurrency(orderStore.globalStats.totalRevenue) }}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Informations de pagination -->
    <div class="flex justify-between items-center mb-4">
      <div class="text-gray-400 text-sm">
        Affichage de {{ ((orderStore.currentPage - 1) * orderStore.perPage) + 1 }} à 
        {{ Math.min(orderStore.currentPage * orderStore.perPage, orderStore.totalOrders) }} 
        sur {{ orderStore.totalOrders }} commandes
      </div>
      <div class="text-gray-400 text-sm">
        Page {{ orderStore.currentPage }} sur {{ orderStore.totalPages }}
      </div>
    </div>

    <!-- Liste des commandes -->
    <div class="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="table w-full">
          <thead class="bg-gray-700">
            <tr>
              <th class="text-gray-300">ID</th>
              <th class="text-gray-300">Client</th>
              <th class="text-gray-300">Total</th>
              <th class="text-gray-300">Statut</th>
              <th class="text-gray-300">Date de création</th>
              <th class="text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="orderStore.loading" class="border-gray-700">
              <td colspan="6" class="text-center py-8">
                <span class="loading loading-spinner loading-lg text-blue-400"></span>
                <p class="text-gray-400 mt-2">Chargement des commandes...</p>
              </td>
            </tr>
            <tr v-else-if="orderStore.orders.length === 0" class="border-gray-700">
              <td colspan="6" class="text-center py-8 text-gray-400">
                Aucune commande trouvée
              </td>
            </tr>
            <tr 
              v-else
              v-for="order in orderStore.orders" 
              :key="order.id"
              @click="viewOrderDetail(order.id)"
              class="border-gray-700 hover:bg-gray-700/50 cursor-pointer transition-colors"
            >
              <td class="text-white font-mono">{{ order.id }}</td>
              <td class="text-white">{{ order.user?.name || order.user?.id || 'N/A' }}</td>
              <td class="text-white">{{ formatCurrency(order.total) }}</td>
              <td>
                <span 
                  :class="getStatusBadgeClass(order.status)"
                  class="badge badge-sm font-medium"
                >
                  {{ getStatusLabel(order.status) }}
                </span>
              </td>
              <td class="text-gray-300">{{ formatDate(order.created_at) }}</td>
              <td @click.stop>
                <div class="dropdown dropdown-end">
                  <div tabindex="0" role="button" class="btn btn-ghost btn-sm">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zM12 13a1 1 0 110-2 1 1 0 010 2zM12 20a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </div>
                  <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-gray-700 rounded-box w-52 z-10">
                    <li>
                      <a @click="viewOrderDetail(order.id)" class="text-blue-400 hover:bg-blue-600/20">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Voir détails
                      </a>
                    </li>
                    <li v-if="order.status === 'pending'">
                      <a @click="validateOrder(order.id)" class="text-green-400 hover:bg-green-600/20">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Valider
                      </a>
                    </li>
                    <li v-if="order.status === 'pending'">
                      <a @click="cancelOrder(order.id)" class="text-red-400 hover:bg-red-600/20">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Annuler
                      </a>
                    </li>
                  </ul>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex justify-center mt-6">
      <div class="join">
        <button 
          @click="goToPage(1)" 
          :disabled="orderStore.currentPage === 1 || orderStore.loading"
          class="join-item btn btn-sm"
        >
          &laquo;
        </button>
        <button 
          @click="goToPage(orderStore.currentPage - 1)" 
          :disabled="orderStore.currentPage === 1 || orderStore.loading"
          class="join-item btn btn-sm"
        >
          &lsaquo;
        </button>
        
        <!-- Pages visibles -->
        <template v-for="page in visiblePages" :key="page">
          <button 
            v-if="page !== '...'"
            @click="goToPage(Number(page))" 
            :class="{ 'btn-active': orderStore.currentPage === page }"
            :disabled="orderStore.loading"
            class="join-item btn btn-sm"
          >
            {{ page }}
          </button>
          <span v-else class="join-item btn btn-sm btn-disabled">...</span>
        </template>
        
        <button 
          @click="goToPage(orderStore.currentPage + 1)" 
          :disabled="orderStore.currentPage === orderStore.totalPages || orderStore.loading"
          class="join-item btn btn-sm"
        >
          &rsaquo;
        </button>
        <button 
          @click="goToPage(orderStore.totalPages)" 
          :disabled="orderStore.currentPage === orderStore.totalPages || orderStore.loading"
          class="join-item btn btn-sm"
        >
          &raquo;
        </button>
      </div>
    </div>

    <!-- Message d'erreur -->
    <div v-if="orderStore.error" class="alert alert-error mt-4">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{{ orderStore.error }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useOrderStore } from '../stores/orderStore'
import type { OrderStatus } from '../types'

// Composables
const router = useRouter()
const orderStore = useOrderStore()

// Statistiques à afficher (globales ou page actuelle)
const displayStats = computed(() => {
  if (orderStore.globalStats.total > 0) {
    return orderStore.globalStats
  } else {
    // Fallback sur les stats de la page actuelle
    return {
      total: orderStore.orders.length,
      pending: orderStore.pendingOrders.length,
      validated: orderStore.validatedOrders.length,
      cancelled: orderStore.cancelledOrders.length,
      totalRevenue: 0
    }
  }
})

const statsType = computed(() => {
  return orderStore.globalStats.total > 0 ? 'Stats globales' : 'Page actuelle'
})

// Pages visibles pour la pagination
const visiblePages = computed(() => {
  const current = orderStore.currentPage
  const total = orderStore.totalPages
  const pages: (number | string)[] = []
  
  if (total <= 7) {
    // Afficher toutes les pages si il y en a 7 ou moins
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // Logique complexe pour afficher les pages avec des ellipses
    if (current <= 4) {
      // Début: 1 2 3 4 5 ... total
      for (let i = 1; i <= 5; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      // Fin: 1 ... total-4 total-3 total-2 total-1 total
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) pages.push(i)
    } else {
      // Milieu: 1 ... current-1 current current+1 ... total
      pages.push(1)
      pages.push('...')
      pages.push(current - 1)
      pages.push(current)
      pages.push(current + 1)
      pages.push('...')
      pages.push(total)
    }
  }
  
  return pages
})

// Charger les commandes et les statistiques globales au montage du composant
onMounted(async () => {
  await Promise.all([
    refreshOrders(),
    loadGlobalStats()
  ])
})

// Actions
async function refreshOrders() {
  try {
    await Promise.all([
      orderStore.fetchOrders(orderStore.currentPage),
      orderStore.fetchGlobalStats()
    ])
  } catch (error) {
    console.error('Erreur lors du chargement des commandes:', error)
  }
}

async function goToPage(page: number) {
  if (page >= 1 && page <= orderStore.totalPages && page !== orderStore.currentPage) {
    try {
      await orderStore.fetchOrders(page)
    } catch (error) {
      console.error('Erreur lors du changement de page:', error)
    }
  }
}

async function loadGlobalStats() {
  try {
    await orderStore.fetchGlobalStats()
  } catch (error) {
    console.error('Erreur lors du chargement des statistiques globales:', error)
  }
}

function viewOrderDetail(orderId: string) {
  router.push(`/orders/${orderId}`)
}

async function validateOrder(orderId: string) {
  try {
    await orderStore.validateOrder(orderId)
  } catch (error) {
    console.error('Erreur lors de la validation:', error)
  }
}

async function cancelOrder(orderId: string) {
  try {
    await orderStore.cancelOrder(orderId)
  } catch (error) {
    console.error('Erreur lors de l\'annulation:', error)
  }
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
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateString))
}
</script>
