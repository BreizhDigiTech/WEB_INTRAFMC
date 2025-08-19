<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
    <!-- Header -->
    <div class="sticky top-0 z-10 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700">
      <div class="container mx-auto px-4 py-4">
        <!-- Breadcrumb -->
        <nav class="flex items-center space-x-2 text-sm text-gray-400 mb-4">
          <RouterLink to="/dashboard" class="hover:text-white transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </RouterLink>
          <span>/</span>
          <span class="text-white font-medium">Catégories</span>
        </nav>

        <!-- Header principal -->
        <div class="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
          <div class="flex items-center space-x-4">
            <div class="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a1.994 1.994 0 01-1.414.586H7a4 4 0 01-4-4V7a4 4 0 014-4z" />
              </svg>
            </div>

            <div>
              <h1 class="text-3xl font-bold text-white">Gestion des Catégories</h1>
              <p class="text-gray-400">Organisez et gérez vos catégories de produits</p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-wrap gap-3">
            <button
              @click="categoryStore.fetchCategories()"
              :disabled="categoryStore.loading"
              class="btn bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
            >
              <span v-if="categoryStore.loading" class="loading loading-spinner loading-sm"></span>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span class="hidden sm:inline ml-2">Actualiser</span>
            </button>

            <button
              @click="openCreateModal"
              :disabled="categoryStore.loading"
              class="btn bg-green-600 hover:bg-green-700 text-white border-none"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              <span class="hidden sm:inline ml-2">Nouvelle catégorie</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenu principal -->
    <div class="container mx-auto px-4 py-8">

      <!-- Affichage des messages de succès -->
      <div v-if="categoryStore.lastOperationResult?.success" class="alert alert-success mb-4">
        <div class="flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          {{ categoryStore.lastOperationResult.message }}
        </div>
        <button 
          @click="categoryStore.clearError()"
          class="btn btn-ghost btn-sm ml-auto"
        >
          ✕
        </button>
      </div>

      <!-- Statistiques -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="stats-card bg-green-600/20 border-green-500/30">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-green-200 text-sm font-medium">Total Catégories</p>
              <p class="text-2xl font-bold text-white">{{ categoryStore.stats?.total || categoryStore.paginatorInfo?.total || 0 }}</p>
            </div>
            <div class="p-3 bg-green-500/30 rounded-lg">
              <svg class="w-6 h-6 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a1.994 1.994 0 01-1.414.586H7a4 4 0 01-4-4V7a4 4 0 014-4z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="stats-card bg-blue-600/20 border-blue-500/30">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-blue-200 text-sm font-medium">Avec Description</p>
              <p class="text-2xl font-bold text-white">{{ categoryStore.stats?.withDescription || 0 }}</p>
            </div>
            <div class="p-3 bg-blue-500/30 rounded-lg">
              <svg class="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="stats-card bg-purple-600/20 border-purple-500/30">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-purple-200 text-sm font-medium">Résultats Filtrés</p>
              <p class="text-2xl font-bold text-white">{{ categoryStore.categories.length }}</p>
            </div>
            <div class="p-3 bg-purple-500/30 rounded-lg">
              <svg class="w-6 h-6 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Barre de recherche et filtres -->
      <div class="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 mb-8">
        <!-- Ligne de recherche -->
        <div class="flex items-center gap-4 mb-4">
          <div class="flex-1 relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              v-model="filters.search"
              @input="debouncedSearch"
              type="text"
              placeholder="Rechercher par nom ou description..."
              class="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all"
            />
            <button
              v-if="filters.search"
              @click="clearSearch"
              class="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <svg class="h-4 w-4 text-gray-400 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <button
            @click="showFilters = !showFilters"
            class="btn bg-gray-700/50 border-gray-600/50 text-gray-300 hover:bg-gray-600/50"
            :class="{ 'bg-green-600/20 border-green-500/30 text-green-300': hasActiveFilters }"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span class="hidden sm:inline ml-2">Filtres</span>
            <span v-if="hasActiveFilters" class="ml-1 px-1.5 py-0.5 bg-green-500 text-white text-xs rounded-full">{{ activeFiltersCount }}</span>
          </button>
        </div>

        <!-- Panneau de filtres -->
        <div v-if="showFilters" class="border-t border-gray-700/50 pt-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Filtre par description -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <select
                v-model="filters.hasDescription"
                @change="applyFilters"
                class="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white"
              >
                <option :value="null">Toutes</option>
                <option :value="true">Avec description</option>
                <option :value="false">Sans description</option>
              </select>
            </div>

            <!-- Tri -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Trier par</label>
              <select
                v-model="filters.sortBy"
                @change="applyFilters"
                class="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white"
              >
                <option value="name">Nom</option>
                <option value="description">Description</option>
              </select>
            </div>

            <!-- Ordre -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Ordre</label>
              <select
                v-model="filters.sortOrder"
                @change="applyFilters"
                class="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white"
              >
                <option value="asc">Croissant (A-Z)</option>
                <option value="desc">Décroissant (Z-A)</option>
              </select>
            </div>
          </div>

          <!-- Actions filtres -->
          <div class="flex items-center justify-between mt-4">
            <div class="text-sm text-gray-400">
              {{ categoryStore.categories.length }} résultat{{ categoryStore.categories.length > 1 ? 's' : '' }}
              {{ categoryStore.paginatorInfo ? ` sur ${categoryStore.paginatorInfo.total}` : '' }}
            </div>
            <button
              @click="resetFilters"
              class="btn btn-sm bg-gray-700/50 border-gray-600/50 text-gray-300 hover:bg-gray-600/50"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Réinitialiser
            </button>
          </div>
        </div>
      </div>

      <!-- Messages d'état -->
      <div v-if="categoryStore.error" class="alert alert-error mb-6 bg-red-900/50 border-red-700 text-red-200">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ categoryStore.error }}</span>
      </div>

      <!-- Loading -->
      <div v-if="categoryStore.loading" class="flex items-center justify-center py-12">
        <div class="flex items-center gap-3 text-gray-400">
          <span class="loading loading-spinner loading-lg"></span>
          <span>Chargement des catégories...</span>
        </div>
      </div>

      <!-- Contenu principal -->
      <div v-else-if="categoryStore.categories.length === 0" class="text-center py-12">
        <div class="max-w-md mx-auto">
          <div class="p-6 bg-gray-800/30 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <svg class="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a1.994 1.994 0 01-1.414.586H7a4 4 0 01-4-4V7a4 4 0 014-4z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-white mb-2">
            {{ filters.search ? 'Aucun résultat' : 'Aucune catégorie' }}
          </h3>
          <p class="text-gray-400 mb-6">
            {{ filters.search ? 'Essayez avec d\'autres mots-clés' : 'Commencez par créer votre première catégorie' }}
          </p>
          <button
            v-if="!filters.search"
            @click="openCreateModal"
            class="btn bg-green-600 hover:bg-green-700 text-white border-none"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Créer une catégorie
          </button>
        </div>
      </div>

      <!-- Grille des catégories -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="cat in categoryStore.categories"
          :key="cat.id"
          class="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-gray-600/50 transition-all duration-300 group"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="p-3 bg-green-500/20 rounded-lg group-hover:bg-green-500/30 transition-colors">
              <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a1.994 1.994 0 01-1.414.586H7a4 4 0 01-4-4V7a4 4 0 014-4z" />
              </svg>
            </div>
            <div class="flex gap-2">
              <button
                @click="openEditModal(cat)"
                class="btn btn-xs bg-blue-600/20 border-blue-500/30 text-blue-300 hover:bg-blue-600/30"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                @click="deleteCategory(cat.id)"
                :disabled="categoryStore.loading"
                class="btn btn-xs bg-red-600/20 border-red-500/30 text-red-300 hover:bg-red-600/30"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
          
          <div class="space-y-3">
            <h3 class="text-lg font-semibold text-white group-hover:text-green-400 transition-colors">
              {{ cat.name }}
            </h3>
            <p class="text-gray-400 text-sm line-clamp-3" :title="cat.description || 'Aucune description'">
              {{ cat.description || 'Aucune description' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <UIPagination
        v-if="categoryStore.paginatorInfo && categoryStore.paginatorInfo.lastPage > 1"
        :current-page="currentPage"
        :total-pages="categoryStore.paginatorInfo.lastPage"
        :total="categoryStore.paginatorInfo.total"
        :per-page="categoryStore.paginatorInfo.perPage"
        :from="((currentPage - 1) * categoryStore.paginatorInfo.perPage) + 1"
        :to="Math.min(currentPage * categoryStore.paginatorInfo.perPage, categoryStore.paginatorInfo.total)"
        :filtered="hasActiveFilters"
        label-plural="catégories"
        :show-per-page-selector="true"
        :per-page-options="[10, 20, 50, 100]"
        @go-to-page="goToPage"
        @next="nextPage"
        @prev="prevPage"
        @per-page-change="changePerPage"
      />
    </div>

    <!-- Modal -->
    <CategoryModal
      v-if="showModal"
      :category="editingCategory"
      @close="closeModal"
      @saved="onCategorySaved"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import UIPagination from '../../../shared/components/UIPagination.vue'
import CategoryModal from '../components/CategoryModal.vue'
import { useCategoryStore } from '../stores/categoryStore'
import type { Category, CategoryFilters } from '../types'

const categoryStore = useCategoryStore()
const showModal = ref(false)
const editingCategory = ref<Category | null>(null)
const showFilters = ref(false)
const currentPage = ref(1)
const itemsPerPage = ref(20)
const isLoading = ref(false)

// Filtres
const filters = ref<CategoryFilters>({
  search: '',
  hasDescription: null,
  sortBy: 'name',
  sortOrder: 'asc'
})

// Debounced search
let searchTimeout: ReturnType<typeof setTimeout>
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    fetchData()
  }, 300)
}

// Watch pour le search
watch(() => filters.value.search, () => {
  debouncedSearch()
})

// Computed properties
const hasActiveFilters = computed(() => {
  return !!(filters.value.search || 
    filters.value.hasDescription !== null || 
    filters.value.sortBy !== 'name' || 
    filters.value.sortOrder !== 'asc')
})

const activeFiltersCount = computed(() => {
  let count = 0
  if (filters.value.search) count++
  if (filters.value.hasDescription !== null) count++
  if (filters.value.sortBy !== 'name') count++
  if (filters.value.sortOrder !== 'asc') count++
  return count
})

onMounted(() => {
  fetchData()
})

// Fonction pour récupérer les données avec filtres
async function fetchData() {
  isLoading.value = true
  try {
    // Récupérer les catégories avec filtres
    await categoryStore.fetchCategories(currentPage.value, itemsPerPage.value, filters.value)
    // Récupérer les statistiques
    await categoryStore.fetchCategoryStats()
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error)
  } finally {
    isLoading.value = false
  }
}

// Fonctions
function clearSearch() {
  filters.value.search = ''
  currentPage.value = 1
  fetchData()
}

async function applyFilters() {
  currentPage.value = 1
  await fetchData()
}

async function resetFilters() {
  filters.value = {
    search: '',
    hasDescription: null,
    sortBy: 'name',
    sortOrder: 'asc'
  }
  currentPage.value = 1
  await fetchData()
}

// Pagination
async function goToPage(page: number) {
  currentPage.value = page
  await fetchData()
}

async function nextPage() {
  if (categoryStore.paginatorInfo && categoryStore.paginatorInfo.hasMorePages) {
    await goToPage(currentPage.value + 1)
  }
}

async function prevPage() {
  if (currentPage.value > 1) {
    await goToPage(currentPage.value - 1)
  }
}

async function changePerPage(newPerPage: number) {
  itemsPerPage.value = newPerPage
  currentPage.value = 1
  await fetchData()
}

function openCreateModal() {
  editingCategory.value = null
  showModal.value = true
}
function openEditModal(cat: Category) {
  editingCategory.value = cat
  showModal.value = true
}
function closeModal() {
  showModal.value = false
}
async function onCategorySaved() {
  showModal.value = false
  await fetchData()
}
async function deleteCategory(id: string) {
  // Trouver le nom de la catégorie pour la confirmation
  const category = categoryStore.categories.find(c => c.id === id)
  const categoryName = category?.name || 'cette catégorie'
  
  const confirmed = confirm(
    `Êtes-vous sûr de vouloir supprimer "${categoryName}" ?\n\n` +
    'Cette action est irréversible et pourrait affecter les produits associés à cette catégorie.'
  )
  
  if (confirmed) {
    const success = await categoryStore.deleteCategory(id)
    if (success) {
      // Recharger les données pour s'assurer de la cohérence
      await fetchData()
    }
  }
}

// Watch pour synchroniser currentPage avec le store
watch(() => categoryStore.paginatorInfo?.currentPage, (newPage) => {
  if (newPage && newPage !== currentPage.value) {
    currentPage.value = newPage
  }
})
</script>

<style scoped>
.stats-card {
  @apply bg-gray-800/50 backdrop-blur-sm border rounded-xl p-6 hover:border-opacity-60 transition-all duration-300;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
