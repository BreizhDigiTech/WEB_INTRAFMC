<template>
  <div class="order-filters-panel bg-gray-800 rounded-lg p-6 space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-white">Filtres de recherche</h3>
      <div class="flex items-center gap-2">
        <span class="badge badge-sm" v-if="activeFiltersCount > 0">
          {{ activeFiltersCount }} filtre(s)
        </span>
        <button
          @click="clearAllFilters"
          v-if="hasActiveFilters"
          class="btn btn-xs btn-ghost text-gray-400 hover:text-white"
        >
          Effacer tout
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <!-- Filtre par statut -->
      <div class="form-control">
        <label class="label">
          <span class="label-text">Statut</span>
        </label>
        <select v-model="statusFilter" class="select select-bordered select-sm">
          <option value="">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="validated">Validées</option>
          <option value="cancelled">Annulées</option>
        </select>
      </div>

      <!-- Recherche utilisateur -->
      <div class="form-control">
        <label class="label">
          <span class="label-text">Recherche client</span>
        </label>
        <input
          v-model="userSearchFilter"
          type="text"
          placeholder="Nom, email..."
          class="input input-bordered input-sm"
        />
      </div>

      <!-- Date de début -->
      <div class="form-control">
        <label class="label">
          <span class="label-text">Date de début</span>
        </label>
        <input
          v-model="dateFromFilter"
          type="date"
          class="input input-bordered input-sm"
        />
      </div>

      <!-- Date de fin -->
      <div class="form-control">
        <label class="label">
          <span class="label-text">Date de fin</span>
        </label>
        <input
          v-model="dateToFilter"
          type="date"
          class="input input-bordered input-sm"
        />
      </div>

      <!-- Montant minimum -->
      <div class="form-control">
        <label class="label">
          <span class="label-text">Montant min.</span>
        </label>
        <input
          v-model.number="minAmountFilter"
          type="number"
          step="0.01"
          placeholder="0.00"
          class="input input-bordered input-sm"
        />
      </div>

      <!-- Montant maximum -->
      <div class="form-control">
        <label class="label">
          <span class="label-text">Montant max.</span>
        </label>
        <input
          v-model.number="maxAmountFilter"
          type="number"
          step="0.01"
          placeholder="999.99"
          class="input input-bordered input-sm"
        />
      </div>
    </div>

    <!-- Filtres rapides -->
    <div class="flex flex-wrap gap-2 pt-2">
      <span class="text-sm text-gray-400">Filtres rapides:</span>
      <button
        @click="applyTodayFilter"
        class="btn btn-xs btn-outline"
      >
        Aujourd'hui
      </button>
      <button
        @click="applyThisWeekFilter"
        class="btn btn-xs btn-outline"
      >
        Cette semaine
      </button>
      <button
        @click="applyThisMonthFilter"
        class="btn btn-xs btn-outline"
      >
        Ce mois
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useOrderFilters } from '../composables/useOrderFilters';

// Props
interface Props {
  modelValue?: any
}

const _props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  'update:modelValue': [filters: any]
  'filtersChanged': [filters: any]
}>()

// Utilisation du composable
const {
  statusFilter,
  userSearchFilter,
  dateFromFilter,
  dateToFilter,
  minAmountFilter,
  maxAmountFilter,
  activeFiltersCount,
  filtersObject,
  hasActiveFilters,
  clearAllFilters,
  applyTodayFilter,
  applyThisWeekFilter,
  applyThisMonthFilter
} = useOrderFilters()

// Watcher pour émettre les changements
watch(filtersObject, (newFilters: any) => {
  emit('update:modelValue', newFilters)
  emit('filtersChanged', newFilters)
}, { deep: true })
</script>
