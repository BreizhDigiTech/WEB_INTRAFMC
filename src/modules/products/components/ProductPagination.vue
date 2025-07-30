<template>
  <div class="flex items-center justify-between bg-gray-800 px-4 py-3 sm:px-6 border-t border-gray-700">
    <!-- Mobile -->
    <div class="flex flex-1 justify-between sm:hidden">
      <button
        @click="$emit('prev')"
        :disabled="!hasPrevious"
        class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Précédent
      </button>
      <button
        @click="$emit('next')"
        :disabled="!hasNext"
        class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Suivant
      </button>
    </div>

    <!-- Desktop -->
    <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
      <div>
        <p class="text-sm text-gray-200">
          Affichage de 
          <span class="font-medium text-white">{{ from }}</span>
          à 
          <span class="font-medium text-white">{{ to }}</span>
          sur 
          <span class="font-medium text-white">{{ total }}</span>
          résultats
        </p>
      </div>

      <div class="flex items-center space-x-2">
        <!-- Sélecteur nombre par page -->
        <div class="flex items-center space-x-2">
          <label for="perPage" class="text-sm text-gray-400">Par page:</label>
          <select
            id="perPage"
            :value="perPage"
            @change="$emit('perPageChange', parseInt(($event.target as HTMLSelectElement).value))"
            class="select select-sm bg-gray-800 border-gray-600 text-white focus:border-blue-500"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50 (max)</option>
          </select>
          <div class="tooltip tooltip-top" data-tip="L'API GraphQL limite à 50 éléments maximum par page">
            <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex items-center space-x-1" aria-label="Pagination">
          <!-- Première page -->
          <button
            @click="$emit('goToPage', 1)"
            :disabled="currentPage === 1"
            class="px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            title="Première page"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>

          <!-- Page précédente -->
          <button
            @click="$emit('prev')"
            :disabled="currentPage === 1"
            class="px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            title="Page précédente"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <!-- Pages numériques -->
          <div class="flex items-center space-x-1">
            <template v-for="page in visiblePages" :key="page">
              <button
                v-if="page !== '...'"
                @click="$emit('goToPage', Number(page))"
                :class="[
                  'px-3 py-2 text-sm rounded-lg transition-all',
                  currentPage === page
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                ]"
              >
                {{ page }}
              </button>
              <span v-else class="px-2 py-2 text-sm text-gray-400">...</span>
            </template>
          </div>

          <!-- Page suivante -->
          <button
            @click="$emit('next')"
            :disabled="currentPage === totalPages"
            class="px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            title="Page suivante"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <!-- Dernière page -->
          <button
            @click="$emit('goToPage', totalPages)"
            :disabled="currentPage === totalPages"
            class="px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            title="Dernière page"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  currentPage: number
  totalPages: number
  total: number
  perPage: number
  from: number
  to: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  goToPage: [page: number]
  next: []
  prev: []
  perPageChange: [perPage: number]
}>()

const hasPrevious = computed(() => props.currentPage > 1)
const hasNext = computed(() => props.currentPage < props.totalPages)

// Calcul des pages visibles avec ellipses
const visiblePages = computed(() => {
  const pages: (number | string)[] = []
  const total = props.totalPages
  const current = props.currentPage
  
  if (total <= 7) {
    // Afficher toutes les pages si <= 7
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // Logique complexe avec ellipses
    if (current <= 4) {
      // Début : 1 2 3 4 5 ... total
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      // Fin : 1 ... total-4 total-3 total-2 total-1 total
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      // Milieu : 1 ... current-1 current current+1 ... total
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
</script>
