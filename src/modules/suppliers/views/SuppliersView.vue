<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
    <!-- Header avec stats et actions -->
    <div class="max-w-7xl mx-auto mb-8">
      <!-- Titre et actions principales -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-4xl font-bold text-white mb-2">Fournisseurs</h1>
          <p class="text-gray-300">Gérez vos fournisseurs et leurs produits</p>
        </div>
        <div class="flex items-center gap-4">
          <button
            @click="showCreateModal = true"
            class="btn btn-primary btn-lg gap-2 hover:scale-105 transition-transform"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Nouveau fournisseur
          </button>
          <button
            @click="refreshSuppliers"
            class="btn btn-ghost btn-lg"
            :class="{ 'loading': supplierStore.loading }"
          >
            <svg v-if="!supplierStore.loading" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Cartes de statistiques -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Total fournisseurs -->
        <div class="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-6 hover:border-blue-500/40 transition-all duration-300">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-blue-500/20 rounded-xl">
              <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m4 0v-4a1 1 0 011-1h1a1 1 0 011 1v4M7 7h10M7 11h4" />
              </svg>
            </div>
            <div v-if="supplierStore.loading" class="loading loading-spinner loading-md text-blue-400"></div>
          </div>
          <div class="space-y-1">
            <h3 class="text-sm font-medium text-gray-400 uppercase tracking-wide">Total fournisseurs</h3>
            <p class="text-3xl font-bold text-blue-400">{{ supplierStore.stats.total }}</p>
            <p class="text-sm text-gray-500">{{ supplierStore.stats.active }} actifs</p>
          </div>
        </div>

        <!-- Avec produits -->
        <div class="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm border border-green-500/20 rounded-2xl p-6 hover:border-green-500/40 transition-all duration-300">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-green-500/20 rounded-xl">
              <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 9h6" />
              </svg>
            </div>
          </div>
          <div class="space-y-1">
            <h3 class="text-sm font-medium text-gray-400 uppercase tracking-wide">Avec produits</h3>
            <p class="text-3xl font-bold text-green-400">{{ supplierStore.stats.with_products }}</p>
            <p class="text-sm text-gray-500">Fournisseurs actifs</p>
          </div>
        </div>

        <!-- Sans produits -->
        <div class="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-sm border border-yellow-500/20 rounded-2xl p-6 hover:border-yellow-500/40 transition-all duration-300">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-yellow-500/20 rounded-xl">
              <svg class="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
          <div class="space-y-1">
            <h3 class="text-sm font-medium text-gray-400 uppercase tracking-wide">Sans produits</h3>
            <p class="text-3xl font-bold text-yellow-400">{{ supplierStore.stats.without_products }}</p>
            <p class="text-sm text-gray-500">À configurer</p>
          </div>
        </div>

        <!-- Ratio moyen -->
        <div class="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 hover:border-purple-500/40 transition-all duration-300">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-purple-500/20 rounded-xl">
              <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <div class="space-y-1">
            <h3 class="text-sm font-medium text-gray-400 uppercase tracking-wide">Taux d'activité</h3>
            <p class="text-3xl font-bold text-purple-400">{{ Math.round((supplierStore.stats.with_products / Math.max(supplierStore.stats.total, 1)) * 100) }}%</p>
            <p class="text-sm text-gray-500">Fournisseurs avec produits</p>
          </div>
        </div>
      </div>

      <!-- Barre de recherche et filtres -->
      <div class="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 mb-8">
        <div class="flex flex-col lg:flex-row gap-4">
          <!-- Recherche -->
          <div class="flex-1">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Rechercher un fournisseur..."
                class="input input-lg w-full bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 pr-12"
              >
              <button
                v-if="searchQuery"
                @click="clearSearch"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Filtres -->
          <div class="flex items-center gap-4">
            <select
              v-model="filters.has_products"
              class="select select-bordered bg-gray-700 border-gray-600 text-white"
            >
              <option :value="undefined">Tous les fournisseurs</option>
              <option :value="true">Avec produits</option>
              <option :value="false">Sans produits</option>
            </select>
            
            <button
              v-if="hasActiveFilters"
              @click="clearFilters"
              class="btn btn-ghost btn-sm"
            >
              Effacer les filtres
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Liste des fournisseurs -->
    <div class="max-w-7xl mx-auto">
      <div v-if="supplierStore.loading && !supplierStore.hasSuppliers" class="text-center py-12">
        <div class="loading loading-spinner loading-lg text-primary"></div>
        <p class="text-gray-400 mt-4">Chargement des fournisseurs...</p>
      </div>

      <div v-else-if="!supplierStore.hasSuppliers" class="text-center py-12">
        <svg class="w-24 h-24 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m4 0v-4a1 1 0 011-1h1a1 1 0 011 1v4M7 7h10M7 11h4" />
        </svg>
        <h3 class="text-xl font-semibold text-gray-400 mb-2">Aucun fournisseur</h3>
        <p class="text-gray-500 mb-6">Commencez par ajouter votre premier fournisseur</p>
        <button @click="showCreateModal = true" class="btn btn-primary">
          Créer un fournisseur
        </button>
      </div>

      <div v-else-if="filteredSuppliers.length === 0" class="text-center py-12">
        <svg class="w-24 h-24 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <h3 class="text-xl font-semibold text-gray-400 mb-2">Aucun résultat</h3>
        <p class="text-gray-500">Aucun fournisseur ne correspond à vos critères de recherche</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="supplier in filteredSuppliers"
          :key="supplier.id"
          class="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-gray-600/50 hover:bg-gray-800/50 transition-all duration-300"
        >
          <!-- Header de la carte -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-white mb-1">{{ supplier.name }}</h3>
              <p class="text-sm text-gray-400">{{ supplier.contact_email }}</p>
            </div>
            <div class="dropdown dropdown-end">
              <button tabindex="0" class="btn btn-ghost btn-sm btn-circle">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01" />
                </svg>
              </button>
              <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-gray-700 rounded-box w-52">
                <li>
                  <a @click="editSupplier(supplier)" class="text-sm">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Modifier
                  </a>
                </li>
                <li>
                  <a @click="deleteSupplier(supplier)" class="text-sm text-red-400">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Supprimer
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <!-- Informations du fournisseur -->
          <div class="space-y-3 mb-4">
            <div v-if="supplier.phone" class="flex items-center gap-2 text-sm text-gray-300">
              <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {{ supplier.phone }}
            </div>
            <div v-if="supplier.address" class="flex items-start gap-2 text-sm text-gray-300">
              <svg class="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span class="break-words">{{ supplier.address }}</span>
            </div>
          </div>

          <!-- Badge produits -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div
                class="badge badge-sm"
                :class="supplier.products && supplier.products.length > 0 ? 'badge-success' : 'badge-warning'"
              >
                {{ supplier.products?.length || 0 }} produit{{ (supplier.products?.length || 0) !== 1 ? 's' : '' }}
              </div>
            </div>
            <div class="text-xs text-gray-500">
              {{ supplier.created_at ? new Date(supplier.created_at).toLocaleDateString('fr-FR') : '' }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <SupplierModal
      v-if="showCreateModal || showEditModal"
      :supplier="selectedSupplier"
      @close="closeModal"
      @saved="handleSupplierSaved"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useSupplierStore } from '../stores/supplierStore'
import SupplierModal from '../components/SupplierModal.vue'
import type { Supplier } from '../types'

// Store
const supplierStore = useSupplierStore()

// États locaux
const showCreateModal = ref(false)
const showEditModal = ref(false)
const selectedSupplier = ref<Supplier | null>(null)
const searchQuery = ref('')
const filters = ref<{ has_products?: boolean }>({})

// Computed
const filteredSuppliers = computed(() => {
  let result = supplierStore.suppliers

  if (searchQuery.value) {
    const search = searchQuery.value.toLowerCase()
    result = result.filter(supplier => 
      supplier.name.toLowerCase().includes(search) ||
      supplier.contact_email.toLowerCase().includes(search) ||
      supplier.phone?.toLowerCase().includes(search) ||
      supplier.address?.toLowerCase().includes(search)
    )
  }

  if (filters.value.has_products !== undefined) {
    result = result.filter(supplier => {
      const hasProducts = supplier.products && supplier.products.length > 0
      return filters.value.has_products ? hasProducts : !hasProducts
    })
  }

  return result
})

const hasActiveFilters = computed(() => {
  return searchQuery.value.trim().length > 0 || filters.value.has_products !== undefined
})

// Watchers
let searchTimeout: number
watch(searchQuery, () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    // La recherche est gérée par le computed filteredSuppliers
  }, 300)
})

// Actions
async function refreshSuppliers() {
  await supplierStore.fetchSuppliers()
}

function clearSearch() {
  searchQuery.value = ''
}

function clearFilters() {
  searchQuery.value = ''
  filters.value = {}
}

function editSupplier(supplier: Supplier) {
  selectedSupplier.value = supplier
  showEditModal.value = true
}

async function deleteSupplier(supplier: Supplier) {
  if (confirm(`Êtes-vous sûr de vouloir supprimer le fournisseur "${supplier.name}" ?`)) {
    try {
      await supplierStore.deleteSupplier(supplier.id)
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    }
  }
}

function closeModal() {
  showCreateModal.value = false
  showEditModal.value = false
  selectedSupplier.value = null
}

function handleSupplierSaved() {
  closeModal()
  refreshSuppliers()
}

// Cycle de vie
onMounted(async () => {
  await refreshSuppliers()
})
</script>
