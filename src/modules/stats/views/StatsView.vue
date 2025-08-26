<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <!-- En-tête avec gradient -->
    <div class="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900">
      <div class="container mx-auto px-4 py-8">
        <div class="flex items-center justify-between">
          <!-- Navigation retour -->
          <div class="flex items-center space-x-4">
            <button @click="$router.back()" class="btn btn-ghost btn-circle text-white hover:bg-white/10">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 class="text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Statistiques Avancées
              </h1>
              <p class="text-gray-300 text-lg">
                Analyse des commandes et performance des ventes
              </p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center space-x-3">
            <button 
              @click="refreshAllStats" 
              :disabled="isLoading"
              class="btn btn-outline btn-primary gap-2"
              :class="{ 'loading': isLoading }"
            >
              <svg v-if="!isLoading" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Actualiser
            </button>
            <button 
              @click="exportCurrentStats"
              :disabled="loading.export"
              class="btn btn-success gap-2"
              :class="{ 'loading': loading.export }"
            >
              <svg v-if="!loading.export" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Exporter CSV
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenu principal -->
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-7xl mx-auto space-y-8">

        <!-- Filtres de période -->
        <div class="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <h2 class="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <svg class="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Sélection de période
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <!-- Période rapide -->
            <div class="md:col-span-1">
              <label class="block text-sm font-medium text-gray-200 mb-2">Période rapide</label>
              <select 
                v-model="selectedQuickPeriod" 
                @change="applyQuickPeriod"
                class="select select-bordered w-full bg-base-200 text-white"
              >
                <option value="">Personnalisée</option>
                <option value="week">7 derniers jours</option>
                <option value="month">30 derniers jours</option>
                <option value="quarter">3 derniers mois</option>
                <option value="year">12 derniers mois</option>
              </select>
            </div>

            <!-- Date de début -->
            <div>
              <label class="block text-sm font-medium text-gray-200 mb-2">Date de début</label>
              <input
                v-model="filters.start_date"
                type="date"
                class="input input-bordered w-full bg-base-200 text-white"
                @change="onDateChange"
              />
            </div>

            <!-- Date de fin -->
            <div>
              <label class="block text-sm font-medium text-gray-200 mb-2">Date de fin</label>
              <input
                v-model="filters.end_date"
                type="date"
                class="input input-bordered w-full bg-base-200 text-white"
                @change="onDateChange"
              />
            </div>

            <!-- Bouton d'application -->
            <div class="flex items-end">
              <button 
                @click="applyFilters" 
                :disabled="!filters.start_date || !filters.end_date"
                class="btn btn-primary w-full"
              >
                Appliquer
              </button>
            </div>
          </div>
        </div>

        <!-- Cartes de statistiques globales -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Chiffre d'affaires -->
          <div class="bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-2xl p-6 border border-green-500/30">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-green-400 text-sm font-medium">Chiffre d'affaires</p>
                <p class="text-3xl font-bold text-white">{{ formatCurrency(totalRevenue) }}</p>
                <div class="flex items-center mt-2">
                  <svg :class="getPerformanceColor(revenueTrend.trend)" class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="revenueTrend.isPositive ? 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' : 'M13 17h8m0 0V9m0 8l-8-8-4 4-6-6'" />
                  </svg>
                  <span :class="getPerformanceColor(revenueTrend.trend)" class="text-sm font-medium">
                    {{ Math.abs(revenueTrend.trend).toFixed(1) }}%
                  </span>
                </div>
              </div>
              <div class="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Nombre de commandes -->
          <div class="bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-2xl p-6 border border-blue-500/30">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-blue-400 text-sm font-medium">Commandes</p>
                <p class="text-3xl font-bold text-white">{{ totalOrders }}</p>
                <div class="flex items-center mt-2">
                  <svg :class="getPerformanceColor(ordersTrend.trend)" class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="ordersTrend.isPositive ? 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' : 'M13 17h8m0 0V9m0 8l-8-8-4 4-6-6'" />
                  </svg>
                  <span :class="getPerformanceColor(ordersTrend.trend)" class="text-sm font-medium">
                    {{ Math.abs(ordersTrend.trend).toFixed(1) }}%
                  </span>
                </div>
              </div>
              <div class="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Valeur moyenne des commandes -->
          <div class="bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-2xl p-6 border border-purple-500/30">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-purple-400 text-sm font-medium">Panier moyen</p>
                <p class="text-3xl font-bold text-white">{{ formatCurrency(averageOrderValue) }}</p>
                <p class="text-sm text-gray-400 mt-2">Par commande</p>
              </div>
              <div class="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Clients actifs -->
          <div class="bg-gradient-to-br from-orange-500/20 to-red-600/20 rounded-2xl p-6 border border-orange-500/30">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-orange-400 text-sm font-medium">Clients actifs</p>
                <p class="text-3xl font-bold text-white">{{ activeCustomers }}</p>
                <div class="flex items-center mt-2">
                  <svg :class="getPerformanceColor(customersTrend.trend)" class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="customersTrend.isPositive ? 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' : 'M13 17h8m0 0V9m0 8l-8-8-4 4-6-6'" />
                  </svg>
                  <span :class="getPerformanceColor(customersTrend.trend)" class="text-sm font-medium">
                    {{ Math.abs(customersTrend.trend).toFixed(1) }}%
                  </span>
                </div>
              </div>
              <div class="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- État de chargement -->
        <div v-if="isLoading" class="flex justify-center items-center py-12">
          <div class="loading loading-spinner loading-lg"></div>
          <span class="ml-4 text-gray-300">Chargement des statistiques...</span>
        </div>

        <!-- Erreur -->
        <div v-if="hasErrors" class="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Erreur lors du chargement des statistiques</span>
          <button @click="clearErrors" class="btn btn-sm btn-ghost">Réessayer</button>
        </div>

        <!-- Tableau des statistiques par utilisateur -->
        <div v-if="orderStats.length > 0" class="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <h2 class="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <svg class="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            Statistiques par client
          </h2>

          <div class="overflow-x-auto">
            <table class="table table-zebra w-full">
              <thead>
                <tr class="border-gray-600">
                  <th class="bg-gray-700 text-gray-200">Rang</th>
                  <th class="bg-gray-700 text-gray-200">Client</th>
                  <th class="bg-gray-700 text-gray-200">Segment</th>
                  <th class="bg-gray-700 text-gray-200">Commandes</th>
                  <th class="bg-gray-700 text-gray-200">Montant total</th>
                  <th class="bg-gray-700 text-gray-200">Panier moyen</th>
                  <th class="bg-gray-700 text-gray-200">Première commande</th>
                  <th class="bg-gray-700 text-gray-200">Dernière commande</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(stat, index) in topCustomers" :key="(stat as any).userId || stat.user_id || index" class="hover:bg-gray-700/50">
                  <td>
                    <div class="flex items-center">
                      <span class="font-bold text-lg">{{ index + 1 }}</span>
                      <svg v-if="index < 3" class="w-5 h-5 ml-2" :class="index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-300' : 'text-amber-600'" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    </div>
                  </td>
                  <td>
                    <div>
                      <div class="font-semibold text-white">
                        {{ (stat as any).userName || stat.user?.name || 'Utilisateur inconnu' }}
                      </div>
                      <div class="text-sm text-gray-400">
                        {{ (stat as any).email || stat.user?.email || 'Email non disponible' }}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="badge badge-outline" :class="getCustomerSegment((stat as any).totalAmount || stat.total_amount || 0).color">
                      {{ getCustomerSegment((stat as any).totalAmount || stat.total_amount || 0).label }}
                    </span>
                  </td>
                  <td class="text-center font-medium">{{ (stat as any).totalOrders || stat.total_orders || 0 }}</td>
                  <td class="font-bold text-green-400">{{ formatCurrency((stat as any).totalAmount || stat.total_amount) }}</td>
                  <td class="text-blue-400">{{ formatCurrency((stat as any).averageOrderValue || stat.average_order_value) }}</td>
                  <td class="text-gray-300">{{ formatDate((stat as any).memberSince || stat.first_order_date) }}</td>
                  <td class="text-gray-300">{{ formatDate((stat as any).lastOrderDate || stat.last_order_date) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Aucune donnée -->
        <div v-if="!isLoading && orderStats.length === 0 && !hasErrors" class="text-center py-12">
          <div class="text-6xl mb-4">📊</div>
          <h3 class="text-xl font-semibold text-gray-200 mb-2">Aucune donnée disponible</h3>
          <p class="text-gray-400 mb-4">Sélectionnez une période pour voir les statistiques</p>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStats } from '../composables/useStats'
import type { StatsFilters } from '../types'

const router = useRouter()

// Composable
const {
  orderStats,
  loading,
  error,
  totalRevenue,
  totalOrders,
  averageOrderValue,
  topCustomers,
  activeCustomers,
  fetchOrderStatsByUser,
  fetchMonthlyStats,
  fetchCustomerGrowth,
  exportStats,
  clearErrors,
  getQuickDateRange,
  formatCurrency,
  formatDate,
  getPerformanceColor,
  getCustomerSegment,
  getRevenueTrend,
  getOrdersTrend,
  getCustomersTrend
} = useStats()

// État local
const filters = ref<StatsFilters>({
  start_date: '',
  end_date: ''
})

const selectedQuickPeriod = ref('')

// Computed
const isLoading = computed(() => {
  return loading.value.orderStats || loading.value.monthlyStats || loading.value.customerGrowth
})

const hasErrors = computed(() => {
  return Object.values(error.value).some(err => err !== null)
})

const revenueTrend = computed(() => getRevenueTrend())
const ordersTrend = computed(() => getOrdersTrend())
const customersTrend = computed(() => getCustomersTrend())

// Méthodes
const applyQuickPeriod = () => {
  if (selectedQuickPeriod.value) {
    const dateRange = getQuickDateRange(selectedQuickPeriod.value as 'week' | 'month' | 'quarter' | 'year')
    filters.value.start_date = dateRange.start_date
    filters.value.end_date = dateRange.end_date
    applyFilters()
  }
}

const onDateChange = () => {
  selectedQuickPeriod.value = ''
}

const applyFilters = async () => {
  if (filters.value.start_date && filters.value.end_date) {
    await Promise.all([
      fetchOrderStatsByUser(filters.value),
      fetchMonthlyStats(),
      fetchCustomerGrowth()
    ])
  }
}

const refreshAllStats = async () => {
  if (filters.value.start_date && filters.value.end_date) {
    await applyFilters()
  }
}

const exportCurrentStats = async () => {
  if (filters.value.start_date && filters.value.end_date) {
    await exportStats(filters.value)
  }
}

// Initialisation
onMounted(() => {
  // Charger les données du mois dernier par défaut
  const defaultRange = getQuickDateRange('month')
  filters.value.start_date = defaultRange.start_date
  filters.value.end_date = defaultRange.end_date
  selectedQuickPeriod.value = 'month'
  applyFilters()
})
</script>

<style scoped>
/* Animations pour les cartes de stats */
.stat-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

/* Animation pour le tableau */
.table tbody tr {
  transition: background-color 0.2s ease;
}

/* Animation pour les badges */
.badge {
  transition: all 0.2s ease;
}

.badge:hover {
  transform: scale(1.05);
}
</style>
