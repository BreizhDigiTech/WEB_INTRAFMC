<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Gestion des arrivages</h1>
          <p class="text-gray-600">Gérez la réception et l'inventaire de vos produits</p>
        </div>
        <button
          @click="showCreateModal = true"
          class="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-500 transition-colors"
        >
          Nouvel arrivage
        </button>
      </div>
    </div>

    <!-- Statistiques rapides -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total arrivages</p>
            <p class="text-2xl font-bold text-gray-900">{{ arrivals.length }}</p>
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
            <p class="text-2xl font-bold text-gray-900">{{ arrivalsStats.pending }}</p>
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
            <p class="text-sm font-medium text-gray-600">Reçus</p>
            <p class="text-2xl font-bold text-gray-900">{{ arrivalsStats.received }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Articles totaux</p>
            <p class="text-2xl font-bold text-gray-900">{{ arrivalsStats.totalItems }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtres -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Recherche</label>
          <input
            v-model="search"
            type="text"
            placeholder="Référence, fournisseur..."
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Statut</label>
          <select v-model="selectedStatus" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="received">Reçu</option>
            <option value="partial">Partiel</option>
            <option value="cancelled">Annulé</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Fournisseur</label>
          <select v-model="selectedSupplier" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Tous les fournisseurs</option>
            <option value="supplier1">Green Valley CBD</option>
            <option value="supplier2">Natural Hemp Co</option>
            <option value="supplier3">CBD Premium</option>
          </select>
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

    <!-- Liste des arrivages -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900">Arrivages ({{ filteredArrivals.length }})</h2>
      </div>
      
      <div v-if="filteredArrivals.length === 0" class="p-12 text-center">
        <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
        <p class="text-gray-500 mb-4">Aucun arrivage trouvé</p>
        <button
          @click="showCreateModal = true"
          class="text-blue-600 hover:text-blue-500"
        >
          Créer un nouvel arrivage
        </button>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Référence</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fournisseur</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date prévue</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Articles</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="arrival in filteredArrivals" :key="arrival.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ arrival.reference }}</div>
                <div class="text-sm text-gray-500">{{ arrival.trackingNumber || 'N/A' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ arrival.supplierName }}</div>
                <div class="text-sm text-gray-500">{{ arrival.supplierContact }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ new Date(arrival.expectedDate).toLocaleDateString('fr-FR') }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ arrival.itemsCount }} article(s)
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(arrival.status)">
                  {{ getStatusText(arrival.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <button
                    @click="viewArrival(arrival)"
                    class="text-blue-600 hover:text-blue-500"
                  >
                    Voir
                  </button>
                  <button
                    v-if="arrival.status === 'pending'"
                    @click="receiveArrival(arrival)"
                    class="text-green-600 hover:text-green-500"
                  >
                    Réceptionner
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
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Nouvel arrivage</h3>
        <form @submit.prevent="saveArrival">
          <div class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Référence</label>
                <input
                  v-model="form.reference"
                  type="text"
                  required
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Numéro de suivi</label>
                <input
                  v-model="form.trackingNumber"
                  type="text"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Fournisseur</label>
                <select
                  v-model="form.supplier"
                  required
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionner un fournisseur</option>
                  <option value="supplier1">Green Valley CBD</option>
                  <option value="supplier2">Natural Hemp Co</option>
                  <option value="supplier3">CBD Premium</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Date prévue</label>
                <input
                  v-model="form.expectedDate"
                  type="date"
                  required
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nombre d'articles</label>
              <input
                v-model.number="form.itemsCount"
                type="number"
                min="1"
                required
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                v-model="form.notes"
                rows="3"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
          </div>
          <div class="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
            >
              Créer
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Arrival {
  id: string
  reference: string
  trackingNumber?: string
  supplierName: string
  supplierContact: string
  expectedDate: string
  itemsCount: number
  status: 'pending' | 'received' | 'partial' | 'cancelled'
  notes?: string
}

// États
const showCreateModal = ref(false)
const search = ref('')
const selectedStatus = ref('')
const selectedSupplier = ref('')

// Données temporaires
const arrivals = ref<Arrival[]>([
  {
    id: '1',
    reference: 'ARR001',
    trackingNumber: 'TRK123456',
    supplierName: 'Green Valley CBD',
    supplierContact: 'contact@greenvalley.com',
    expectedDate: '2024-01-20',
    itemsCount: 15,
    status: 'pending'
  },
  {
    id: '2',
    reference: 'ARR002',
    trackingNumber: 'TRK789012',
    supplierName: 'Natural Hemp Co',
    supplierContact: 'orders@naturalhemp.com',
    expectedDate: '2024-01-18',
    itemsCount: 8,
    status: 'received'
  },
  {
    id: '3',
    reference: 'ARR003',
    supplierName: 'CBD Premium',
    supplierContact: 'support@cbdpremium.com',
    expectedDate: '2024-01-22',
    itemsCount: 12,
    status: 'partial'
  }
])

// Formulaire
const form = ref({
  reference: '',
  trackingNumber: '',
  supplier: '',
  expectedDate: '',
  itemsCount: 1,
  notes: ''
})

// Statistiques calculées
const arrivalsStats = computed(() => {
  const stats = {
    pending: 0,
    received: 0,
    totalItems: 0
  }
  
  arrivals.value.forEach(arrival => {
    if (arrival.status === 'pending') stats.pending++
    if (arrival.status === 'received') stats.received++
    stats.totalItems += arrival.itemsCount
  })
  
  return stats
})

// Arrivages filtrés
const filteredArrivals = computed(() => {
  return arrivals.value.filter(arrival => {
    const matchesSearch = arrival.reference.toLowerCase().includes(search.value.toLowerCase()) ||
                         arrival.supplierName.toLowerCase().includes(search.value.toLowerCase())
    const matchesStatus = !selectedStatus.value || arrival.status === selectedStatus.value
    const matchesSupplier = !selectedSupplier.value || 
                           arrival.supplierName.toLowerCase().includes(selectedSupplier.value.toLowerCase())
    
    return matchesSearch && matchesStatus && matchesSupplier
  })
})

// Méthodes
const getStatusClass = (status: string) => {
  const classes = {
    pending: 'px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full',
    received: 'px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full',
    partial: 'px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full',
    cancelled: 'px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full'
  }
  return classes[status as keyof typeof classes] || classes.pending
}

const getStatusText = (status: string) => {
  const texts = {
    pending: 'En attente',
    received: 'Reçu',
    partial: 'Partiel',
    cancelled: 'Annulé'
  }
  return texts[status as keyof typeof texts] || 'Inconnu'
}

const viewArrival = (arrival: Arrival) => {
  alert(`Affichage des détails de l'arrivage ${arrival.reference}`)
}

const receiveArrival = (arrival: Arrival) => {
  if (confirm(`Confirmer la réception de l'arrivage ${arrival.reference} ?`)) {
    arrival.status = 'received'
  }
}

const saveArrival = () => {
  const suppliers = {
    supplier1: { name: 'Green Valley CBD', contact: 'contact@greenvalley.com' },
    supplier2: { name: 'Natural Hemp Co', contact: 'orders@naturalhemp.com' },
    supplier3: { name: 'CBD Premium', contact: 'support@cbdpremium.com' }
  }
  
  const supplier = suppliers[form.value.supplier as keyof typeof suppliers]
  
  const newArrival: Arrival = {
    id: Date.now().toString(),
    reference: form.value.reference,
    trackingNumber: form.value.trackingNumber,
    supplierName: supplier.name,
    supplierContact: supplier.contact,
    expectedDate: form.value.expectedDate,
    itemsCount: form.value.itemsCount,
    status: 'pending',
    notes: form.value.notes
  }
  
  arrivals.value.push(newArrival)
  closeModal()
}

const closeModal = () => {
  showCreateModal.value = false
  form.value = {
    reference: '',
    trackingNumber: '',
    supplier: '',
    expectedDate: '',
    itemsCount: 1,
    notes: ''
  }
}

const resetFilters = () => {
  search.value = ''
  selectedStatus.value = ''
  selectedSupplier.value = ''
}
</script>
