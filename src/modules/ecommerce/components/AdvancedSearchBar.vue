<template>
  <div class="relative">
    <!-- Barre de recherche principale -->
    <div class="relative">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Rechercher un produit..."
        class="input input-bordered w-full pr-12 bg-base-200 text-white placeholder-gray-400"
        @input="handleInputChange"
        @focus="showSuggestions = true"
        @blur="handleBlur"
        @keydown="handleKeydown"
      />
      
      <!-- Icône de recherche -->
      <div class="absolute inset-y-0 right-0 flex items-center pr-3">
        <svg
          v-if="!loading.suggestions"
          class="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <div v-else class="loading loading-spinner loading-sm"></div>
      </div>
    </div>

    <!-- Suggestions d'autocomplétion -->
    <div
      v-if="showSuggestions && suggestions.length > 0"
      class="absolute z-50 w-full mt-1 bg-base-300 border border-base-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
    >
      <div
        v-for="(suggestion, index) in suggestions"
        :key="index"
        :class="[
          'px-4 py-2 cursor-pointer transition-colors',
          index === selectedSuggestionIndex ? 'bg-primary text-white' : 'hover:bg-base-200'
        ]"
        @click="selectSuggestion(suggestion)"
      >
        {{ suggestion }}
      </div>
    </div>

    <!-- Filtres avancés (optionnel) -->
    <div v-if="showAdvancedFilters" class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Filtre par catégorie -->
      <div>
        <label class="block text-sm font-medium text-gray-200 mb-2">
          Catégorie
        </label>
        <select
          v-model="filters.categoryId"
          class="select select-bordered w-full bg-base-200 text-white"
          @change="handleFilterChange"
        >
          <option value="">Toutes les catégories</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
      </div>

      <!-- Filtre par prix -->
      <div>
        <label class="block text-sm font-medium text-gray-200 mb-2">
          Prix minimum
        </label>
        <input
          v-model.number="filters.minPrice"
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          class="input input-bordered w-full bg-base-200 text-white placeholder-gray-400"
          @input="handleFilterChange"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-200 mb-2">
          Prix maximum
        </label>
        <input
          v-model.number="filters.maxPrice"
          type="number"
          min="0"
          step="0.01"
          placeholder="100.00"
          class="input input-bordered w-full bg-base-200 text-white placeholder-gray-400"
          @input="handleFilterChange"
        />
      </div>

      <!-- Filtre stock uniquement -->
      <div class="md:col-span-3">
        <label class="flex items-center space-x-2 cursor-pointer">
          <input
            v-model="filters.inStock"
            type="checkbox"
            class="checkbox checkbox-primary"
            @change="handleFilterChange"
          />
          <span class="text-gray-200">Produits en stock uniquement</span>
        </label>
      </div>
    </div>

    <!-- Bouton pour toggle les filtres avancés -->
    <div class="mt-4 flex justify-between items-center">
      <button
        @click="showAdvancedFilters = !showAdvancedFilters"
        class="btn btn-ghost btn-sm"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
        </svg>
        {{ showAdvancedFilters ? 'Masquer' : 'Afficher' }} les filtres avancés
      </button>

      <button
        v-if="hasActiveFilters"
        @click="clearAllFilters"
        class="btn btn-ghost btn-sm text-red-400 hover:text-red-300"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
        Effacer les filtres
      </button>
    </div>

    <!-- Résultats de recherche rapide -->
    <div v-if="quickResults.length > 0" class="mt-6">
      <h3 class="text-lg font-semibold text-white mb-4">Résultats de recherche</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="product in quickResults"
          :key="product.id"
          class="card bg-base-200 border border-base-300 hover:border-primary/50 transition-all duration-300"
        >
          <figure class="px-4 pt-4">
            <img
              :src="product.image_urls[0] || '/images/placeholder-product.svg'"
              :alt="product.name"
              class="rounded-lg w-full h-32 object-cover"
            />
          </figure>
          <div class="card-body p-4">
            <h4 class="card-title text-sm text-white">{{ product.name }}</h4>
            <p class="text-lg font-bold text-primary">{{ formatPrice(product.price) }}</p>
            <div class="flex flex-wrap gap-1 mt-2">
              <span
                v-for="category in product.categories"
                :key="category.id"
                class="badge badge-outline badge-xs"
              >
                {{ category.name }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useProducts } from '../composables/useProducts'
import type { Product } from '../types'

interface Props {
  placeholder?: string
  showQuickResults?: boolean
  autoFocus?: boolean
}

interface Emits {
  (e: 'search', query: string): void
  (e: 'filter-change', filters: any): void
  (e: 'select-product', product: Product): void
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Rechercher un produit...',
  showQuickResults: true,
  autoFocus: false
})

const emit = defineEmits<Emits>()

const {
  categories,
  suggestions,
  loading,
  getSearchSuggestions,
  quickSearchByName,
  advancedSearch,
  clearSearchResults
} = useProducts()

// État local
const searchQuery = ref('')
const showSuggestions = ref(false)
const showAdvancedFilters = ref(false)
const selectedSuggestionIndex = ref(-1)
const quickResults = ref<Product[]>([])

const filters = ref({
  categoryId: '',
  minPrice: undefined as number | undefined,
  maxPrice: undefined as number | undefined,
  inStock: false
})

// Computed
const hasActiveFilters = computed(() => {
  return filters.value.categoryId ||
         filters.value.minPrice !== undefined ||
         filters.value.maxPrice !== undefined ||
         filters.value.inStock
})

// Watchers
watch(searchQuery, async (newQuery) => {
  if (newQuery.length >= 2) {
    await getSearchSuggestions(newQuery)
    
    if (props.showQuickResults) {
      const results = await quickSearchByName(newQuery, 6)
      quickResults.value = results
    }
  } else {
    clearSearchResults()
    quickResults.value = []
  }
})

// Méthodes
const handleInputChange = async () => {
  selectedSuggestionIndex.value = -1
  emit('search', searchQuery.value)
}

const handleFilterChange = async () => {
  emit('filter-change', { ...filters.value })
  
  // Effectuer une recherche avancée si il y a des filtres actifs
  if (hasActiveFilters.value || searchQuery.value) {
    const results = await advancedSearch({
      query: searchQuery.value || undefined,
      categoryId: filters.value.categoryId || undefined,
      minPrice: filters.value.minPrice,
      maxPrice: filters.value.maxPrice,
      inStock: filters.value.inStock || undefined
    })
    
    if (props.showQuickResults) {
      quickResults.value = results
    }
  }
}

const selectSuggestion = (suggestion: string) => {
  searchQuery.value = suggestion
  showSuggestions.value = false
  selectedSuggestionIndex.value = -1
  emit('search', suggestion)
}

const handleKeydown = (event: KeyboardEvent) => {
  if (!showSuggestions.value || suggestions.value.length === 0) return

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      selectedSuggestionIndex.value = Math.min(
        selectedSuggestionIndex.value + 1,
        suggestions.value.length - 1
      )
      break

    case 'ArrowUp':
      event.preventDefault()
      selectedSuggestionIndex.value = Math.max(selectedSuggestionIndex.value - 1, -1)
      break

    case 'Enter':
      event.preventDefault()
      if (selectedSuggestionIndex.value >= 0) {
        selectSuggestion(suggestions.value[selectedSuggestionIndex.value])
      } else {
        emit('search', searchQuery.value)
        showSuggestions.value = false
      }
      break

    case 'Escape':
      showSuggestions.value = false
      selectedSuggestionIndex.value = -1
      break
  }
}

const handleBlur = async () => {
  // Attendre un peu pour permettre le clic sur une suggestion
  await nextTick()
  setTimeout(() => {
    showSuggestions.value = false
    selectedSuggestionIndex.value = -1
  }, 150)
}

const clearAllFilters = () => {
  searchQuery.value = ''
  filters.value = {
    categoryId: '',
    minPrice: undefined,
    maxPrice: undefined,
    inStock: false
  }
  quickResults.value = []
  clearSearchResults()
  emit('search', '')
  emit('filter-change', { ...filters.value })
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price)
}

// Exposer les méthodes publiques
defineExpose({
  focus: () => {
    // Focus sur l'input
  },
  clear: clearAllFilters,
  search: (query: string) => {
    searchQuery.value = query
    emit('search', query)
  }
})
</script>

<style scoped>
/* Animation pour les suggestions */
.suggestion-enter-active,
.suggestion-leave-active {
  transition: all 0.2s ease;
}

.suggestion-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.suggestion-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Scroll personnalisé pour les suggestions */
.suggestion-list::-webkit-scrollbar {
  width: 4px;
}

.suggestion-list::-webkit-scrollbar-track {
  background: transparent;
}

.suggestion-list::-webkit-scrollbar-thumb {
  background: rgb(156, 163, 175);
  border-radius: 2px;
}

.suggestion-list::-webkit-scrollbar-thumb:hover {
  background: rgb(107, 114, 128);
}
</style>
