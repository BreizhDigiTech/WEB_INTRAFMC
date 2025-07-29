<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <!-- En-tête avec gradient -->
    <div class="bg-gradient-to-r from-blue-900 via-purple-900 to-pink-900">
      <div class="container mx-auto px-4 py-8">
        <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <!-- Titre et description -->
          <div class="flex-1">
            <h1 class="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Gestion des Arrivages
            </h1>
            <p class="text-gray-300 text-lg">
              Gérez vos arrivages de produits et suivez les réceptions
            </p>
          </div>

          <!-- Actions -->
          <div class="flex flex-wrap gap-3">
            <!-- Recherche rapide -->
            <div class="relative">
              <input 
                v-model="searchQuery"
                type="text"
                placeholder="Rechercher référence, fournisseur..."
                class="input input-bordered bg-gray-800 border-gray-600 text-white placeholder-gray-400 w-64 pr-10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
              <svg class="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <!-- Filtres -->
            <div class="dropdown dropdown-end">
              <div tabindex="0" role="button" class="btn bg-gray-800 border-gray-600 text-white hover:bg-gray-700">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                </svg>
                Filtres
                <span v-if="activeFiltersCount > 0" class="badge badge-sm bg-blue-600 text-white ml-2">
                  {{ activeFiltersCount }}
                </span>
              </div>
              <div tabindex="0" class="dropdown-content menu p-4 shadow-xl bg-gray-800 rounded-xl w-80 border border-gray-700">
                <h3 class="font-semibold text-white mb-3">Filtrer les arrivages</h3>
                
                <!-- Filtre par statut -->
                <div class="form-control mb-4">
                  <label class="label">
                    <span class="label-text text-gray-300">Statut</span>
                  </label>
                  <div class="flex flex-wrap gap-2">
                    <label v-for="status in statusOptions" :key="status.value" class="label cursor-pointer">
                      <input 
                        v-model="filters.status" 
                        :value="status.value"
                        type="checkbox" 
                        class="checkbox checkbox-sm checkbox-primary"
                      >
                      <span class="label-text ml-2" :class="status.color">{{ status.label }}</span>
                    </label>
                  </div>
                </div>

                <!-- Filtre par montant -->
                <div class="form-control mb-4">
                  <label class="label">
                    <span class="label-text text-gray-300">Montant minimum</span>
                  </label>
                  <input 
                    v-model.number="filters.min_amount"
                    type="number"
                    placeholder="0"
                    class="input input-sm input-bordered bg-gray-700 border-gray-600 text-white"
                  >
                </div>

                <div class="flex gap-2">
                  <button @click="applyFilters" class="btn btn-primary btn-sm flex-1">
                    Appliquer
                  </button>
                  <button @click="resetFilters" class="btn btn-ghost btn-sm">
                    Reset
                  </button>
                </div>
              </div>
            </div>

            <!-- Créer un arrivage -->
            <button 
              @click="showCreateModal = true"
              class="btn bg-green-600 hover:bg-green-700 text-white border-none min-w-fit"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              <span class="hidden sm:inline ml-2">Nouvel Arrivage</span>
            </button>

            <!-- Actualiser -->
            <button 
              @click="refreshArrivals"
              :disabled="arrivalStore.loading"
              class="btn bg-blue-600 hover:bg-blue-700 text-white border-none min-w-fit"
            >
              <span v-if="arrivalStore.loading" class="loading loading-spinner loading-sm"></span>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span class="hidden sm:inline ml-2">
                {{ arrivalStore.loading ? (Object.keys(appliedFilters).length > 0 ? 'Filtrage...' : 'Chargement...') : 'Actualiser' }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <!-- Statistiques améliorées -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <!-- En attente -->
        <div class="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-sm border border-yellow-500/20 rounded-2xl p-6 hover:border-yellow-500/40 transition-all duration-300">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-yellow-500/20 rounded-xl">
              <svg class="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div v-if="arrivalStore.loading" class="loading loading-spinner loading-md text-yellow-400"></div>
          </div>
          <div class="space-y-1">
            <h3 class="text-sm font-medium text-gray-400 uppercase tracking-wide">En attente</h3>
            <p class="text-3xl font-bold text-yellow-400">{{ displayStats.pending }}</p>
            <p class="text-sm text-gray-500">
              {{ displayStats.total > 0 ? ((displayStats.pending / displayStats.total) * 100).toFixed(1) + '% du total' : '0% du total' }}
            </p>
          </div>
        </div>

        <!-- Validés -->
        <div class="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm border border-green-500/20 rounded-2xl p-6 hover:border-green-500/40 transition-all duration-300">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-green-500/20 rounded-xl">
              <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div v-if="arrivalStore.loading" class="loading loading-spinner loading-md text-green-400"></div>
          </div>
          <div class="space-y-1">
            <h3 class="text-sm font-medium text-gray-400 uppercase tracking-wide">Validés</h3>
            <p class="text-3xl font-bold text-green-400">{{ displayStats.validated }}</p>
            <p class="text-sm text-gray-500">
              {{ displayStats.total > 0 ? ((displayStats.validated / displayStats.total) * 100).toFixed(1) + '% du total' : '0% du total' }}
            </p>
          </div>
        </div>

        <!-- Total avec valeur -->
        <div class="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 hover:border-purple-500/40 transition-all duration-300">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-purple-500/20 rounded-xl">
              <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div v-if="arrivalStore.loading" class="loading loading-spinner loading-md text-purple-400"></div>
          </div>
          <div class="space-y-1">
            <h3 class="text-sm font-medium text-gray-400 uppercase tracking-wide">Total</h3>
            <p class="text-3xl font-bold text-purple-400">{{ displayStats.total }}</p>
            <p class="text-sm text-gray-500">
              <span v-if="!arrivalStore.loading && displayStats.totalValue">
                <span class="block font-medium text-green-400">
                  Valeur: {{ formatCurrency(displayStats.totalValue) }}
                </span>
              </span>
            </p>
          </div>
        </div>
      </div>

      <!-- Reste du template à continuer... -->
    </div>

    <!-- Modal de création d'arrivage -->
    <CreateArrivalModal 
      v-if="showCreateModal"
      :is-open="showCreateModal"
      @close="showCreateModal = false"
      @created="handleArrivalCreated"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useArrivalStore } from '../stores/arrivalStore'
import type { ArrivalStatus, ArrivalFilters } from '../types'
import { 
  formatCurrency, 
  formatDate, 
  getStatusLabel, 
  getStatusBadgeClass,
  getProductImage,
  handleImageError
} from '../utils/formatters'
import { STATUS_OPTIONS } from '../constants'
import CreateArrivalModal from '../components/CreateArrivalModal.vue'

// Composables
const router = useRouter()
const arrivalStore = useArrivalStore()

// États locaux
const searchQuery = ref('')
const showCreateModal = ref(false)
const filters = ref<ArrivalFilters>({
  status: [],
  min_amount: undefined
})

// Filtres appliqués actuellement
const appliedFilters = ref<ArrivalFilters>({})

// Options pour les filtres
const statusOptions = STATUS_OPTIONS

// Computed
const activeFiltersCount = computed(() => {
  let count = 0
  if (filters.value.status && filters.value.status.length > 0) count++
  if (filters.value.min_amount !== undefined && filters.value.min_amount > 0) count++
  if (searchQuery.value.trim()) count++
  return count
})

const displayStats = computed(() => {
  if (Object.keys(appliedFilters.value).length > 0) {
    // Statistiques sur les résultats filtrés
    const filteredArrivals = arrivalStore.arrivals
    return {
      pending: filteredArrivals.filter(a => a.status === 'pending').length,
      validated: filteredArrivals.filter(a => a.status === 'validated').length,
      total: filteredArrivals.length,
      totalValue: filteredArrivals.reduce((sum, a) => sum + a.amount, 0)
    }
  }
  return arrivalStore.stats
})

const statsType = computed(() => {
  return Object.keys(appliedFilters.value).length > 0 ? 'résultats filtrés' : 'arrivages'
})

// Watchers pour la recherche avec debounce
let searchTimeout: number
watch(searchQuery, (newQuery) => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    applyFilters()
  }, 300)
})

// Actions
function applyFilters() {
  const filterParams: ArrivalFilters = {}
  
  // Ajouter le filtre de statut
  if (filters.value.status && filters.value.status.length > 0) {
    filterParams.status = filters.value.status
  }
  
  // Ajouter le filtre de montant minimum
  if (filters.value.min_amount !== undefined && filters.value.min_amount > 0) {
    filterParams.min_amount = filters.value.min_amount
  }
  
  // Sauvegarder les filtres appliqués
  appliedFilters.value = { ...filterParams }
  
  // Revenir à la page 1 et appliquer les filtres
  arrivalStore.fetchArrivals()
}

function resetFilters() {
  searchQuery.value = ''
  filters.value.status = []
  filters.value.min_amount = undefined
  appliedFilters.value = {}
  arrivalStore.fetchArrivals()
}

async function refreshArrivals() {
  try {
    await arrivalStore.fetchArrivals()
  } catch (error) {
    console.error('Erreur lors du chargement des arrivages:', error)
  }
}

async function loadGlobalStats() {
  // Les statistiques sont calculées automatiquement lors du fetchArrivals
  console.log('Stats loaded:', arrivalStore.stats)
}

function handleArrivalCreated() {
  showCreateModal.value = false
  refreshArrivals()
}

// Cycle de vie
onMounted(async () => {
  await arrivalStore.fetchArrivals()
})
</script>
