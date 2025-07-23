<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Gestion des commandes</h1>
          <p class="text-gray-600">Suivez et traitez toutes vos commandes</p>
        </div>
        <button
          @click="showCreateModal = true"
          class="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-500 transition-colors"
        >
          Nouvelle commande
        </button>
      </div>
    </div>

    <!-- Statistiques rapides -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total commandes</p>
            <p class="text-2xl font-bold text-gray-900">{{ orders.length }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">En attente</p>
            <p class="text-2xl font-bold text-gray-900">{{ ordersStats.pending }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Livrées</p>
            <p class="text-2xl font-bold text-gray-900">{{ ordersStats.delivered }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">CA du mois</p>
            <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(ordersStats.revenue) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtres -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Recherche</label>
          <input
            v-model="search"
            type="text"
            placeholder="N° commande, client..."
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Statut</label>
          <select v-model="selectedStatus" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="processing">En cours</option>
            <option value="shipped">Expédiée</option>
            <option value="delivered">Livrée</option>
            <option value="cancelled">Annulée</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Date début</label>
          <input
            v-model="dateFrom"
            type="date"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Date fin</label>
          <input
            v-model="dateTo"
            type="date"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
        </div>
        <div class="flex items-end">
          <button
            @click="resetFilters"
            class="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Réinitialiser
          </button>
        </div>
      </div>
    </div>

    <!-- Liste des commandes -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900">Commandes ({{ filteredOrders.length }})</h2>
      </div>
      
      <div v-if="filteredOrders.length === 0" class="p-12 text-center">
        <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p class="text-gray-500 mb-4">Aucune commande trouvée</p>
        <button
          @click="showCreateModal = true"
          class="text-blue-600 hover:text-blue-500"
        >
          Créer une nouvelle commande
        </button>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commande</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="order in filteredOrders" :key="order.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">#{{ order.number }}</div>
                <div class="text-sm text-gray-500">{{ order.itemsCount }} article(s)</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ order.customerName }}</div>
                <div class="text-sm text-gray-500">{{ order.customerEmail }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ new Date(order.createdAt).toLocaleDateString('fr-FR') }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatCurrency(order.total) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(order.status)">
                  {{ getStatusText(order.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <button
                    @click="viewOrder(order)"
                    class="text-blue-600 hover:text-blue-500"
                  >
                    Voir
                  </button>
                  <button
                    @click="updateStatus(order)"
                    class="text-green-600 hover:text-green-500"
                  >
                    Statut
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de création -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-full max-w-2xl">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Nouvelle commande</h3>
        <p class="text-gray-600 mb-6">Cette fonctionnalité sera implémentée prochainement.</p>
        <div class="flex justify-end">
          <button
            @click="showCreateModal = false"
            class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { formatCurrency, formatDate } from '@/shared/utils'

interface Order {
  id: string
  number: string
  customerName: string
  customerEmail: string
  createdAt: string
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  itemsCount: number
}

// États
const showCreateModal = ref(false)
const search = ref('')
const selectedStatus = ref('')
const dateFrom = ref('')
const dateTo = ref('')

// Données temporaires
const orders = ref<Order[]>([
  {
    id: '1',
    number: 'CMD001',
    customerName: 'Jean Dupont',
    customerEmail: 'jean.dupont@email.com',
    createdAt: '2024-01-15',
    total: 74.98,
    status: 'delivered',
    itemsCount: 2
  },
  {
    id: '2',
    number: 'CMD002',
    customerName: 'Marie Martin',
    customerEmail: 'marie.martin@email.com',
    createdAt: '2024-01-16',
    total: 149.99,
    status: 'processing',
    itemsCount: 3
  },
  {
    id: '3',
    number: 'CMD003',
    customerName: 'Pierre Durand',
    customerEmail: 'pierre.durand@email.com',
    createdAt: '2024-01-17',
    total: 24.99,
    status: 'pending',
    itemsCount: 1
  }
])

// Statistiques calculées
const ordersStats = computed(() => {
  const stats = {
    pending: 0,
    delivered: 0,
    revenue: 0
  }
  
  orders.value.forEach(order => {
    if (order.status === 'pending') stats.pending++
    if (order.status === 'delivered') stats.delivered++
    if (order.status === 'delivered') stats.revenue += order.total
  })
  
  return stats
})

// Commandes filtrées
const filteredOrders = computed(() => {
  return orders.value.filter(order => {
    const matchesSearch = order.number.toLowerCase().includes(search.value.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(search.value.toLowerCase()) ||
                         order.customerEmail.toLowerCase().includes(search.value.toLowerCase())
    const matchesStatus = !selectedStatus.value || order.status === selectedStatus.value
    const matchesDateFrom = !dateFrom.value || order.createdAt >= dateFrom.value
    const matchesDateTo = !dateTo.value || order.createdAt <= dateTo.value
    
    return matchesSearch && matchesStatus && matchesDateFrom && matchesDateTo
  })
})

// Méthodes
const getStatusClass = (status: string) => {
  const classes = {
    pending: 'px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full',
    processing: 'px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full',
    shipped: 'px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full',
    delivered: 'px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full',
    cancelled: 'px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full'
  }
  return classes[status as keyof typeof classes] || classes.pending
}

const getStatusText = (status: string) => {
  const texts = {
    pending: 'En attente',
    processing: 'En cours',
    shipped: 'Expédiée',
    delivered: 'Livrée',
    cancelled: 'Annulée'
  }
  return texts[status as keyof typeof texts] || 'Inconnu'
}

const viewOrder = (order: Order) => {
  alert(`Affichage des détails de la commande ${order.number}`)
}

const updateStatus = (order: Order) => {
  const statuses = ['pending', 'processing', 'shipped', 'delivered']
  const currentIndex = statuses.indexOf(order.status)
  if (currentIndex < statuses.length - 1) {
    order.status = statuses[currentIndex + 1] as any
  }
}

const resetFilters = () => {
  search.value = ''
  selectedStatus.value = ''
  dateFrom.value = ''
  dateTo.value = ''
}
</script>
