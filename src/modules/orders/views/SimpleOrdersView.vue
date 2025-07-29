<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
    <!-- Header avec breadcrumb et actions -->
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
          <span class="text-white font-medium">Gestion des commandes</span>
        </nav>

        <!-- Header principal -->
        <div class="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
          <div class="flex items-center space-x-4">
            <div class="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div>
              <h1 class="text-3xl font-bold text-white">Commandes</h1>
              <p class="text-gray-400">Gérez et suivez toutes les commandes</p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-wrap gap-3">
            <!-- Recherche rapide -->
            <div class="relative">
              <input 
                v-model="searchQuery"
                type="text"
                placeholder="Rechercher commande, client..."
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
                <h3 class="font-semibold text-white mb-3">Filtrer les commandes</h3>
                
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

            <!-- Actualiser -->
            <button 
              @click="refreshOrders"
              :disabled="orderStore.loading"
              class="btn bg-blue-600 hover:bg-blue-700 text-white border-none min-w-fit"
            >
              <span v-if="orderStore.loading" class="loading loading-spinner loading-sm"></span>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span class="hidden sm:inline ml-2">
                {{ orderStore.loading ? (Object.keys(appliedFilters).length > 0 ? 'Filtrage...' : 'Chargement...') : 'Actualiser' }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <!-- Statistiques améliorées -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- En attente -->
        <div class="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-sm border border-yellow-500/20 rounded-2xl p-6 hover:border-yellow-500/40 transition-all duration-300">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-yellow-500/20 rounded-xl">
              <svg class="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div v-if="orderStore.statsLoading" class="loading loading-spinner loading-md text-yellow-400"></div>
          </div>
          <div class="space-y-1">
            <h3 class="text-sm font-medium text-gray-400 uppercase tracking-wide">En attente</h3>
            <p class="text-3xl font-bold text-yellow-400">{{ displayStats.pending }}</p>
            <p class="text-sm text-gray-500">
              {{ displayStats.total > 0 ? ((displayStats.pending / displayStats.total) * 100).toFixed(1) + '% du total' : '0% du total' }}
            </p>
          </div>
        </div>

        <!-- Validées -->
        <div class="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm border border-green-500/20 rounded-2xl p-6 hover:border-green-500/40 transition-all duration-300">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-green-500/20 rounded-xl">
              <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div v-if="orderStore.statsLoading" class="loading loading-spinner loading-md text-green-400"></div>
          </div>
          <div class="space-y-1">
            <h3 class="text-sm font-medium text-gray-400 uppercase tracking-wide">Validées</h3>
            <p class="text-3xl font-bold text-green-400">{{ displayStats.validated }}</p>
            <p class="text-sm text-gray-500">
              {{ displayStats.total > 0 ? ((displayStats.validated / displayStats.total) * 100).toFixed(1) + '% du total' : '0% du total' }}
            </p>
          </div>
        </div>

        <!-- Annulées -->
        <div class="bg-gradient-to-br from-red-500/10 to-rose-500/10 backdrop-blur-sm border border-red-500/20 rounded-2xl p-6 hover:border-red-500/40 transition-all duration-300">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-red-500/20 rounded-xl">
              <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div v-if="orderStore.statsLoading" class="loading loading-spinner loading-md text-red-400"></div>
          </div>
          <div class="space-y-1">
            <h3 class="text-sm font-medium text-gray-400 uppercase tracking-wide">Annulées</h3>
            <p class="text-3xl font-bold text-red-400">{{ displayStats.cancelled }}</p>
            <p class="text-sm text-gray-500">
              {{ displayStats.total > 0 ? ((displayStats.cancelled / displayStats.total) * 100).toFixed(1) + '% du total' : '0% du total' }}
            </p>
          </div>
        </div>

        <!-- Total avec CA -->
        <div class="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-6 hover:border-blue-500/40 transition-all duration-300">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-blue-500/20 rounded-xl">
              <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div v-if="orderStore.statsLoading" class="loading loading-spinner loading-md text-blue-400"></div>
          </div>
          <div class="space-y-1">
            <h3 class="text-sm font-medium text-gray-400 uppercase tracking-wide">Total</h3>
            <p class="text-3xl font-bold text-blue-400">{{ displayStats.total }}</p>
            <p class="text-sm text-gray-500">
              <span v-if="!orderStore.statsLoading">
                {{ statsType }}
                <span v-if="orderStore.globalStats.totalRevenue > 0" class="block font-medium text-green-400">
                  CA: {{ formatCurrency(orderStore.globalStats.totalRevenue) }}
                </span>
              </span>
            </p>
          </div>
        </div>
      </div>

    <!-- Informations de pagination et filtres actifs -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
      <div class="text-gray-400 text-sm">
        Affichage de {{ ((orderStore.currentPage - 1) * orderStore.perPage) + 1 }} à 
        {{ Math.min(orderStore.currentPage * orderStore.perPage, orderStore.totalOrders) }} 
        sur {{ orderStore.totalOrders }} commandes
        
        <!-- Indicateur de filtres actifs -->
        <div v-if="Object.keys(appliedFilters).length > 0" class="flex flex-wrap gap-2 mt-2">
          <span class="text-xs text-blue-400 font-medium">Filtres actifs (recherche dans toutes les commandes):</span>
          <template v-if="appliedFilters.user_search">
            <span class="badge badge-sm bg-blue-600/20 text-blue-400 border-blue-600/30">
              Recherche: "{{ appliedFilters.user_search }}"
            </span>
          </template>
          <template v-if="appliedFilters.status && appliedFilters.status.length > 0">
            <span class="badge badge-sm bg-purple-600/20 text-purple-400 border-purple-600/30">
              Statut: {{ appliedFilters.status.map(s => getStatusLabel(s)).join(', ') }}
            </span>
          </template>
          <template v-if="appliedFilters.min_amount">
            <span class="badge badge-sm bg-green-600/20 text-green-400 border-green-600/30">
              Min: {{ formatCurrency(appliedFilters.min_amount) }}
            </span>
          </template>
          <button 
            @click="resetFilters"
            class="badge badge-sm bg-red-600/20 text-red-400 border-red-600/30 hover:bg-red-600/40 cursor-pointer"
            title="Supprimer tous les filtres"
          >
            ✕ Effacer
          </button>
        </div>

        <!-- Information sur les limitations -->
        <div v-if="Object.keys(appliedFilters).length === 0" class="text-xs text-gray-500 mt-1">
          💡 Utilisez les filtres pour rechercher dans toutes les commandes
        </div>
      </div>
      <div class="text-gray-400 text-sm">
        Page {{ orderStore.currentPage }} sur {{ orderStore.totalPages }}
      </div>
    </div>

    <!-- Liste des commandes -->
    <div class="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="table w-full">
          <thead class="bg-gray-700">
            <tr>
              <th class="text-gray-300">ID</th>
              <th class="text-gray-300">Produits</th>
              <th class="text-gray-300">Client</th>
              <th class="text-gray-300">Total</th>
              <th class="text-gray-300">Statut</th>
              <th class="text-gray-300">Date de création</th>
              <th class="text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="orderStore.loading" class="border-gray-700">
              <td colspan="7" class="text-center py-8">
                <span class="loading loading-spinner loading-lg text-blue-400"></span>
                <p class="text-gray-400 mt-2">
                  {{ Object.keys(appliedFilters).length > 0 ? 
                    'Recherche dans toutes les commandes...' : 
                    'Chargement des commandes...' 
                  }}
                </p>
                <p v-if="Object.keys(appliedFilters).length > 0" class="text-gray-500 text-sm mt-1">
                  Cela peut prendre quelques secondes
                </p>
              </td>
            </tr>
            <tr v-else-if="orderStore.orders.length === 0" class="border-gray-700">
              <td colspan="7" class="text-center py-8 text-gray-400">
                Aucune commande trouvée
              </td>
            </tr>
            <tr 
              v-else
              v-for="order in orderStore.orders" 
              :key="order.id"
              @click="viewOrderDetail(order.id)"
              class="border-gray-700 hover:bg-gray-700/50 cursor-pointer transition-colors"
            >
              <td class="text-white font-mono">{{ order.id }}</td>
              <td class="py-2">
                <div class="flex -space-x-2 overflow-hidden">
                  <template v-if="order.products && order.products.length > 0">
                    <template v-for="(product, index) in order.products.slice(0, 3)" :key="product.id">
                      <div class="relative">
                        <img 
                          :src="getProductImage(product)" 
                          :alt="product.name"
                          :title="product.name"
                          class="w-10 h-10 rounded-full border-2 border-gray-600 object-cover bg-gray-700"
                          @error="handleImageError"
                        />
                      </div>
                    </template>
                    <div 
                      v-if="order.products.length > 3" 
                      class="w-10 h-10 rounded-full border-2 border-gray-600 bg-gray-600 flex items-center justify-center text-xs text-white font-medium"
                    >
                      +{{ order.products.length - 3 }}
                    </div>
                  </template>
                  <div v-else class="w-10 h-10 rounded-full border-2 border-gray-600 bg-gray-700 flex items-center justify-center">
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8L9 5m0 0v4m0-4l4 4" />
                    </svg>
                  </div>
                </div>
              </td>
              <td class="text-white">{{ order.user?.name || order.user?.id || 'N/A' }}</td>
              <td class="text-white">{{ formatCurrency(order.total) }}</td>
              <td>
                <div class="flex items-center space-x-2">
                  <span 
                    :class="getStatusBadgeClass(order.status)"
                    class="badge badge-sm font-medium"
                  >
                    {{ getStatusLabel(order.status) }}
                  </span>
                  <!-- Icône facture disponible pour les commandes validées -->
                  <div v-if="order.status === 'validated'" class="tooltip tooltip-top" data-tip="Facture disponible">
                    <svg class="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
              </td>
              <td class="text-gray-300">{{ formatDate(order.created_at) }}</td>
              <td @click.stop>
                <div class="dropdown dropdown-end">
                  <div tabindex="0" role="button" class="btn btn-ghost btn-sm">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zM12 13a1 1 0 110-2 1 1 0 010 2zM12 20a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </div>
                  <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-gray-700 rounded-box w-52 z-10">
                    <li>
                      <a @click="viewOrderDetail(order.id)" class="text-blue-400 hover:bg-blue-600/20">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Voir détails
                      </a>
                    </li>
                    <li v-if="order.status === 'validated'">
                      <a @click="generateInvoiceFromList(order.id)" class="text-purple-400 hover:bg-purple-600/20">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Générer facture
                      </a>
                    </li>
                    <li v-if="order.status === 'pending'">
                      <a @click="validateOrder(order.id)" class="text-green-400 hover:bg-green-600/20">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Valider
                      </a>
                    </li>
                    <li v-if="order.status === 'pending'">
                      <a @click="cancelOrder(order.id)" class="text-red-400 hover:bg-red-600/20">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Annuler
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

      <!-- Pagination améliorée -->
      <div class="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
        <!-- Informations de pagination -->
        <div class="text-sm text-gray-400">
          Affichage de <span class="font-medium text-white">{{ ((orderStore.currentPage - 1) * orderStore.perPage) + 1 }}</span> à 
          <span class="font-medium text-white">{{ Math.min(orderStore.currentPage * orderStore.perPage, orderStore.totalOrders) }}</span> 
          sur <span class="font-medium text-white">{{ orderStore.totalOrders }}</span> commandes
        </div>

        <!-- Contrôles de pagination -->
        <div class="flex items-center space-x-1">
          <!-- Première page -->
          <button 
            @click="goToPage(1)" 
            :disabled="orderStore.currentPage === 1 || orderStore.loading"
            class="px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            title="Première page"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>

          <!-- Page précédente -->
          <button 
            @click="goToPage(orderStore.currentPage - 1)" 
            :disabled="orderStore.currentPage === 1 || orderStore.loading"
            class="px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            title="Page précédente"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <!-- Pages visibles -->
          <div class="flex items-center space-x-1">
            <template v-for="page in visiblePages" :key="page">
              <button 
                v-if="page !== '...'"
                @click="goToPage(Number(page))" 
                :class="[
                  'px-3 py-2 text-sm rounded-lg transition-all',
                  orderStore.currentPage === page 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                ]"
                :disabled="orderStore.loading"
              >
                {{ page }}
              </button>
              <span v-else class="px-2 py-2 text-sm text-gray-400">...</span>
            </template>
          </div>

          <!-- Page suivante -->
          <button 
            @click="goToPage(orderStore.currentPage + 1)" 
            :disabled="orderStore.currentPage === orderStore.totalPages || orderStore.loading"
            class="px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            title="Page suivante"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <!-- Dernière page -->
          <button 
            @click="goToPage(orderStore.totalPages)" 
            :disabled="orderStore.currentPage === orderStore.totalPages || orderStore.loading"
            class="px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            title="Dernière page"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <!-- Sélecteur de taille de page -->
        <div class="flex items-center space-x-2">
          <label class="text-sm text-gray-400">Par page:</label>
          <select 
            :value="orderStore.perPage"
            @change="changePerPage"
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
      </div>

      <!-- Message d'erreur amélioré -->
      <div v-if="orderStore.error" class="mt-6">
        <div class="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
          <div class="flex items-center space-x-3">
            <div class="p-2 bg-red-500/20 rounded-lg">
              <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 class="text-red-400 font-medium">Erreur de chargement</h4>
              <p class="text-red-300 text-sm">{{ orderStore.error }}</p>
            </div>
            <button 
              @click="refreshOrders"
              class="ml-auto btn btn-sm bg-red-600/20 hover:bg-red-600/40 text-red-400 border-red-600/30"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useOrderStore } from '../stores/orderStore'
import type { OrderStatus, OrderFilters } from '../types'
import { 
  formatCurrency, 
  formatDate, 
  getStatusLabel, 
  getStatusBadgeClass,
  getProductImage,
  handleImageError
} from '../utils/formatters'

// Composables
const router = useRouter()
const orderStore = useOrderStore()

// Recherche et filtres
const searchQuery = ref('')
const filters = ref<OrderFilters>({
  status: [],
  min_amount: undefined
})

// Filtres appliqués actuellement
const appliedFilters = ref<OrderFilters>({})

// Options pour les filtres
const statusOptions = [
  { value: 'pending' as OrderStatus, label: 'En attente', color: 'text-yellow-400' },
  { value: 'validated' as OrderStatus, label: 'Validées', color: 'text-green-400' },
  { value: 'cancelled' as OrderStatus, label: 'Annulées', color: 'text-red-400' }
]

// Computed pour le nombre de filtres actifs
const activeFiltersCount = computed(() => {
  let count = 0
  if (filters.value.status && filters.value.status.length > 0) count++
  if (filters.value.min_amount !== undefined && filters.value.min_amount > 0) count++
  if (searchQuery.value.trim() !== '') count++
  return count
})

// Debounce pour la recherche
let searchTimeout: ReturnType<typeof setTimeout> | null = null

// Watcher pour la recherche avec debounce
watch(searchQuery, (newValue) => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  
  searchTimeout = setTimeout(() => {
    if (newValue.trim() !== '') {
      applyFilters()
    } else if (Object.keys(appliedFilters.value).length > 0) {
      // Si on efface la recherche mais qu'il y a d'autres filtres, les réappliquer
      applyFilters()
    }
  }, 500) // 500ms de délai
})

// Statistiques à afficher (globales ou page actuelle)
const displayStats = computed(() => {
  if (orderStore.globalStats.total > 0) {
    return orderStore.globalStats
  } else {
    // Fallback sur les stats de la page actuelle
    return {
      total: orderStore.orders.length,
      pending: orderStore.pendingOrders.length,
      validated: orderStore.validatedOrders.length,
      cancelled: orderStore.cancelledOrders.length,
      totalRevenue: 0
    }
  }
})

const statsType = computed(() => {
  return orderStore.globalStats.total > 0 ? 'Stats globales' : 'Page actuelle'
})

// Pages visibles pour la pagination
const visiblePages = computed(() => {
  const current = orderStore.currentPage
  const total = orderStore.totalPages
  const pages: (number | string)[] = []
  
  if (total <= 7) {
    // Afficher toutes les pages si il y en a 7 ou moins
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // Logique complexe pour afficher les pages avec des ellipses
    if (current <= 4) {
      // Début: 1 2 3 4 5 ... total
      for (let i = 1; i <= 5; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      // Fin: 1 ... total-4 total-3 total-2 total-1 total
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) pages.push(i)
    } else {
      // Milieu: 1 ... current-1 current current+1 ... total
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

// Actions de recherche et filtres
function applyFilters() {
  // Construire l'objet de filtres avec la recherche
  const filterParams: OrderFilters = {}
  
  // Ajouter la recherche si elle existe
  if (searchQuery.value.trim()) {
    filterParams.user_search = searchQuery.value.trim()
  }
  
  // Ajouter les filtres de statut
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
  orderStore.fetchOrders(1, undefined, filterParams)
}

function resetFilters() {
  searchQuery.value = ''
  filters.value.status = []
  filters.value.min_amount = undefined
  appliedFilters.value = {}
  orderStore.fetchOrders(1)
}

// Charger les commandes et les statistiques globales au montage du composant
onMounted(async () => {
  await Promise.all([
    refreshOrders(),
    loadGlobalStats()
  ])
})

// Actions
async function refreshOrders() {
  try {
    await Promise.all([
      orderStore.fetchOrders(orderStore.currentPage, undefined, appliedFilters.value),
      orderStore.fetchGlobalStats()
    ])
  } catch (error) {
    console.error('Erreur lors du chargement des commandes:', error)
  }
}

async function goToPage(page: number) {
  if (page >= 1 && page <= orderStore.totalPages && page !== orderStore.currentPage) {
    try {
      await orderStore.fetchOrders(page, undefined, appliedFilters.value)
    } catch (error) {
      console.error('Erreur lors du changement de page:', error)
    }
  }
}

async function changePerPage(event: Event) {
  const target = event.target as HTMLSelectElement
  const newPerPage = parseInt(target.value)
  
  if (newPerPage !== orderStore.perPage) {
    try {
      await orderStore.updatePerPage(newPerPage)
      // Réappliquer les filtres sur la nouvelle taille de page
      if (Object.keys(appliedFilters.value).length > 0) {
        await orderStore.fetchOrders(1, newPerPage, appliedFilters.value)
      }
    } catch (error) {
      console.error('Erreur lors du changement du nombre d\'éléments par page:', error)
    }
  }
}

async function loadGlobalStats() {
  try {
    await orderStore.fetchGlobalStats()
  } catch (error) {
    console.error('Erreur lors du chargement des statistiques globales:', error)
  }
}

function viewOrderDetail(orderId: string) {
  router.push(`/orders/${orderId}`)
}

async function validateOrder(orderId: string) {
  try {
    await orderStore.validateOrder(orderId)
  } catch (error) {
    console.error('Erreur lors de la validation:', error)
  }
}

async function cancelOrder(orderId: string) {
  try {
    await orderStore.cancelOrder(orderId)
  } catch (error) {
    console.error('Erreur lors de l\'annulation:', error)
  }
}

async function generateInvoiceFromList(orderId: string) {
  try {
    const result = await orderStore.generateInvoice(orderId)
    
    // Utiliser l'URL du PDF réel généré par le service
    const link = document.createElement('a')
    link.href = result.url
    link.download = result.filename
    link.style.display = 'none'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    // Nettoyer l'URL après téléchargement (pour les blobs)
    setTimeout(() => {
      URL.revokeObjectURL(result.url)
    }, 1000)
    
  } catch (error) {
    console.error('Erreur lors de la génération de la facture:', error)
  }
}
</script>
