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

            <!-- Créer un arrivage - Désactivé car API backend non disponible -->
            <button 
              disabled
              class="btn btn-disabled min-w-fit"
              title="Nécessite l'implémentation de l'API backend"
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

      <!-- Liste des arrivages -->
      <div class="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden">
        <!-- En-tête de liste -->
        <div class="bg-gray-800/80 px-6 py-4 border-b border-gray-700">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold text-white">
              Liste des arrivages
              <span v-if="filteredArrivals.length > 0" class="text-sm font-normal text-gray-400 ml-2">
                ({{ filteredArrivals.length }} {{ filteredArrivals.length > 1 ? 'arrivages' : 'arrivage' }})
              </span>
            </h2>
            
            <!-- Actions de liste -->
            <div class="flex gap-2">
              <button 
                @click="refreshArrivals"
                :disabled="arrivalStore.loading"
                class="btn btn-sm bg-gray-700 hover:bg-gray-600 border-gray-600 text-white"
              >
                <span v-if="arrivalStore.loading" class="loading loading-spinner loading-xs"></span>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>
          
          <!-- Filtres actifs -->
          <div v-if="activeFiltersCount > 0 || searchQuery.trim()" class="mt-3 flex flex-wrap gap-2">
            <span class="text-xs text-gray-400">Filtres actifs:</span>
            
            <!-- Filtre de recherche -->
            <span v-if="searchQuery.trim()" class="badge badge-sm bg-blue-600/20 text-blue-400 border-blue-600/30">
              Recherche: "{{ searchQuery }}"
            </span>
            
            <!-- Filtres de statut -->
            <span v-if="appliedFilters.status && appliedFilters.status.length > 0" 
                  class="badge badge-sm bg-green-600/20 text-green-400 border-green-600/30">
              Statut: {{ appliedFilters.status.join(', ') }}
            </span>
            
            <!-- Filtre de montant -->
            <span v-if="appliedFilters.min_amount && appliedFilters.min_amount > 0" 
                  class="badge badge-sm bg-yellow-600/20 text-yellow-400 border-yellow-600/30">
              Montant ≥ {{ formatCurrency(appliedFilters.min_amount) }}
            </span>
            
            <!-- Bouton pour réinitialiser -->
            <button @click="resetFilters" class="badge badge-sm bg-red-600/20 text-red-400 border-red-600/30 hover:bg-red-600/30 cursor-pointer transition-colors">
              ✕ Effacer tout
            </button>
          </div>
        </div>

        <!-- Contenu de la liste -->
        <div class="min-h-[400px]">
          <!-- État de chargement -->
          <div v-if="arrivalStore.loading && arrivalStore.arrivals.length === 0" class="flex items-center justify-center py-20">
            <div class="text-center">
              <div class="loading loading-spinner loading-lg text-blue-500 mb-4"></div>
              <p class="text-gray-400">Chargement des arrivages...</p>
            </div>
          </div>

          <!-- État vide -->
          <div v-else-if="!arrivalStore.loading && filteredArrivals.length === 0 && arrivalStore.arrivals.length > 0" class="flex items-center justify-center py-20">
            <div class="text-center max-w-md">
              <div class="p-4 bg-blue-500/20 rounded-2xl mb-4 inline-block">
                <svg class="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-white mb-2">Aucun résultat</h3>
              <p class="text-gray-400 mb-6">
                Aucun arrivage ne correspond aux critères de recherche sélectionnés.
              </p>
              <button 
                @click="resetFilters"
                class="btn bg-blue-600 hover:bg-blue-700 text-white border-none"
              >
                Réinitialiser les filtres
              </button>
            </div>
          </div>

          <div v-else-if="!arrivalStore.loading && arrivalStore.arrivals.length === 0" class="flex items-center justify-center py-20">
            <div class="text-center max-w-md">
              <div class="p-4 bg-gray-700/50 rounded-2xl mb-4 inline-block">
                <svg class="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-white mb-2">Module en développement</h3>
              <p class="text-gray-400 mb-6">
                Le module des arrivages nécessite une implémentation backend.
                <br>L'API GraphQL doit inclure les endpoints suivants :
                <br>• <code class="text-blue-400">arrivals(first: Int, page: Int)</code>
                <br>• <code class="text-blue-400">arrival(id: ID!)</code>
                <br>• <code class="text-blue-400">createArrival</code>, <code class="text-blue-400">updateArrival</code>, <code class="text-blue-400">validateArrival</code>
              </p>
              <div class="flex gap-3 justify-center">
                <div class="text-center">
                  <p class="text-sm text-gray-500 mb-2">Backend API required</p>
                  <button 
                    disabled
                    class="btn btn-disabled"
                    title="Nécessite l'implémentation de l'API backend"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Créer un arrivage
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Liste des arrivages -->
          <div v-else class="overflow-x-auto">
            <table class="table table-zebra w-full">
              <thead>
                <tr class="border-gray-700">
                  <th class="text-gray-300 bg-gray-800/50">ID</th>
                  <th class="text-gray-300 bg-gray-800/50">Date</th>
                  <th class="text-gray-300 bg-gray-800/50">Statut</th>
                  <th class="text-gray-300 bg-gray-800/50">Montant</th>
                  <th class="text-gray-300 bg-gray-800/50">Produits</th>
                  <th class="text-gray-300 bg-gray-800/50">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="arrival in filteredArrivals" 
                  :key="arrival.id"
                  class="hover:bg-gray-700/30 cursor-pointer transition-colors"
                  @click="viewArrivalDetail(arrival.id)"
                >
                  <!-- ID -->
                  <td class="font-medium text-white">
                    #{{ arrival.id }}
                  </td>
                  
                  <!-- Date -->
                  <td class="text-gray-300">
                    {{ formatDate(arrival.created_at || '') }}
                  </td>
                  
                  <!-- Statut -->
                  <td>
                    <span :class="getStatusBadgeClass(arrival.status)" class="badge badge-sm font-medium">
                      {{ getStatusLabel(arrival.status) }}
                    </span>
                  </td>
                  
                  <!-- Montant -->
                  <td class="font-semibold text-green-400">
                    {{ formatCurrency(arrival.amount) }}
                  </td>
                  
                  <!-- Produits -->
                  <td>
                    <div class="flex items-center gap-2">
                      <div v-if="arrival.products && arrival.products.length > 0" class="flex -space-x-2">
                        <div 
                          v-for="(product, index) in arrival.products.slice(0, 3)" 
                          :key="product.id"
                          class="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-700 bg-gray-600 flex items-center justify-center"
                        >
                          <img 
                            v-if="product.product && getProductImage(product.product)"
                            :src="getProductImage(product.product)"
                            :alt="product.product.name"
                            class="w-full h-full object-cover"
                            @error="handleImageError"
                          >
                          <svg v-else class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        </div>
                      </div>
                      <span class="text-sm text-gray-400">
                        {{ arrival.products?.length || 0 }} produit{{ (arrival.products?.length || 0) > 1 ? 's' : '' }}
                        <span v-if="arrival.products && arrival.products.length > 3" class="text-xs">
                          (+{{ arrival.products.length - 3 }})
                        </span>
                      </span>
                    </div>
                  </td>
                  
                  <!-- Actions -->
                  <td @click.stop>
                    <div class="dropdown dropdown-end">
                      <div tabindex="0" role="button" class="btn btn-ghost btn-sm text-gray-400 hover:text-white">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </div>
                      <ul tabindex="0" class="dropdown-content menu p-2 shadow-xl bg-gray-800 rounded-box w-52 border border-gray-700">
                        <li>
                          <a @click="viewArrivalDetail(arrival.id)" class="text-blue-400 hover:bg-blue-600/20">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            Voir détails
                          </a>
                        </li>
                        <li v-if="arrival.status === 'pending'">
                          <a @click="validateArrival(arrival.id)" class="text-green-400 hover:bg-green-600/20">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                            </svg>
                            Valider
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
      </div>

      <!-- Pagination -->
      <ArrivalPagination 
        v-if="arrivalStore.arrivals.length > 0"
        :current-page="arrivalStore.currentPage"
        :total-pages="Math.max(1, Math.ceil(arrivalStore.totalArrivals / arrivalStore.perPage))"
        :total="arrivalStore.totalArrivals"
        :per-page="arrivalStore.perPage"
        :from="arrivalStore.totalArrivals > 0 ? ((arrivalStore.currentPage - 1) * arrivalStore.perPage) + 1 : 0"
        :to="Math.min(arrivalStore.currentPage * arrivalStore.perPage, arrivalStore.totalArrivals)"
        :filtered="Object.keys(appliedFilters).length > 0 || searchQuery.trim() !== ''"
        @go-to-page="goToPage"
        @next="goToPage(arrivalStore.currentPage + 1)"
        @prev="goToPage(arrivalStore.currentPage - 1)"
        @per-page-change="changePerPage"
      />
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
import ArrivalPagination from '../components/ArrivalPagination.vue'

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

// Arrivages filtrés côté client
const filteredArrivals = computed(() => {
  let result = [...arrivalStore.arrivals]
  
  // Filtrage par recherche textuelle
  if (searchQuery.value.trim()) {
    const searchTerm = searchQuery.value.toLowerCase()
    result = result.filter(arrival => 
      arrival.id.toLowerCase().includes(searchTerm) ||
      arrival.status.toLowerCase().includes(searchTerm) ||
      arrival.amount.toString().includes(searchTerm)
    )
  }
  
  // Filtrage par statut
  if (appliedFilters.value.status && appliedFilters.value.status.length > 0) {
    result = result.filter(arrival => 
      appliedFilters.value.status!.includes(arrival.status)
    )
  }
  
  // Filtrage par montant minimum
  if (appliedFilters.value.min_amount !== undefined && appliedFilters.value.min_amount > 0) {
    result = result.filter(arrival => 
      arrival.amount >= appliedFilters.value.min_amount!
    )
  }
  
  return result
})

const displayStats = computed(() => {
  if (Object.keys(appliedFilters.value).length > 0 || searchQuery.value.trim()) {
    // Statistiques sur les résultats filtrés
    return {
      pending: filteredArrivals.value.filter(a => a.status === 'pending').length,
      validated: filteredArrivals.value.filter(a => a.status === 'validated').length,
      total: filteredArrivals.value.length,
      totalValue: filteredArrivals.value.reduce((sum, a) => sum + a.amount, 0)
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
  
  // Sauvegarder les filtres appliqués pour le côté client
  appliedFilters.value = { ...filterParams }
  
  console.log('Filtres appliqués:', appliedFilters.value)
}

function resetFilters() {
  searchQuery.value = ''
  filters.value.status = []
  filters.value.min_amount = undefined
  appliedFilters.value = {}
  console.log('Filtres réinitialisés')
}

async function refreshArrivals() {
  try {
    await arrivalStore.fetchArrivals(arrivalStore.currentPage, arrivalStore.perPage)
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

// Navigation vers les détails d'un arrivage
function viewArrivalDetail(arrivalId: string) {
  router.push(`/arrivals/${arrivalId}`)
}

// Validation d'un arrivage
async function validateArrival(arrivalId: string) {
  // Confirmation avant validation
  const confirmValidation = confirm(`Êtes-vous sûr de vouloir valider l'arrivage ${arrivalId} ?`)
  if (!confirmValidation) return

  try {
    await arrivalStore.validateArrival(arrivalId)
    alert('Arrivage validé avec succès !')
    console.log('Arrivage validé:', arrivalId)
  } catch (error) {
    console.error('Erreur lors de la validation:', error)
    alert('Erreur lors de la validation de l\'arrivage')
  }
}

// Navigation entre les pages
async function goToPage(page: number) {
  try {
    await arrivalStore.fetchArrivals(page, arrivalStore.perPage)
  } catch (error) {
    console.error('Erreur lors du changement de page:', error)
  }
}

// Changer le nombre d'éléments par page
async function changePerPage(newPerPage: number) {
  try {
    await arrivalStore.fetchArrivals(1, newPerPage)
  } catch (error) {
    console.error('Erreur lors du changement du nombre par page:', error)
  }
}

// Cycle de vie
onMounted(async () => {
  await arrivalStore.fetchArrivals()
})
</script>
