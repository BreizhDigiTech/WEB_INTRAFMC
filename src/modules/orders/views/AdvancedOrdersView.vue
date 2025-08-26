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
          <span class="text-white font-medium">Commandes Avancées</span>
        </nav>

        <!-- Header principal -->
        <div class="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
          <div class="flex items-center space-x-4">
            <div class="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>

            <div>
              <h1 class="text-3xl font-bold text-white">Gestion Avancée des Commandes</h1>
              <p class="text-gray-400">Tableau de bord complet pour la gestion des commandes</p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-wrap gap-3">
            <button
              @click="refresh"
              :disabled="loading"
              class="btn bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
            >
              <span v-if="loading" class="loading loading-spinner loading-sm"></span>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span class="hidden sm:inline ml-2">Actualiser</span>
            </button>

            <button
              @click="performCheckout"
              :disabled="checkoutLoading || !hasCartItems"
              class="btn bg-green-600 hover:bg-green-700 text-white border-none"
            >
              <span v-if="checkoutLoading" class="loading loading-spinner loading-sm"></span>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0L17 13m-10 0h10" />
              </svg>
              <span class="hidden sm:inline ml-2">
                {{ hasCartItems ? 'Finaliser Panier' : 'Panier Vide' }}
              </span>
            </button>

            <button
              @click="showStatsModal = true"
              class="btn bg-purple-600 hover:bg-purple-700 text-white border-none"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span class="hidden sm:inline ml-2">Statistiques</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenu principal -->
    <div class="container mx-auto px-4 py-8">
      <!-- Statistiques -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="stats-card bg-blue-600/20 border-blue-500/30">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-blue-200 text-sm font-medium">Total Commandes</p>
              <p class="text-2xl font-bold text-white">{{ pagination?.total || 0 }}</p>
            </div>
            <div class="p-3 bg-blue-500/30 rounded-lg">
              <svg class="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="stats-card bg-yellow-600/20 border-yellow-500/30">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-yellow-200 text-sm font-medium">En Attente</p>
              <p class="text-2xl font-bold text-white">{{ pendingOrders.length }}</p>
            </div>
            <div class="p-3 bg-yellow-500/30 rounded-lg">
              <svg class="w-6 h-6 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="stats-card bg-green-600/20 border-green-500/30">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-green-200 text-sm font-medium">Validées</p>
              <p class="text-2xl font-bold text-white">{{ validatedOrders.length }}</p>
            </div>
            <div class="p-3 bg-green-500/30 rounded-lg">
              <svg class="w-6 h-6 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>

        <div class="stats-card bg-purple-600/20 border-purple-500/30">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-purple-200 text-sm font-medium">Chiffre d'Affaires</p>
              <p class="text-2xl font-bold text-white">{{ totalRevenue }}</p>
            </div>
            <div class="p-3 bg-purple-500/30 rounded-lg">
              <svg class="w-6 h-6 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Alerte de permissions -->
      <PermissionAlert 
        v-if="!canManageOrderStatus"
        type="warning"
        title="Permissions limitées"
        message="Vous n'avez pas les permissions nécessaires pour modifier le statut des commandes. Seuls les administrateurs peuvent valider ou annuler des commandes."
        class="mb-6"
      />

      <!-- Panier actuel -->
      <div v-if="cartItems.length > 0" class="card mb-8">
        <div class="card-body">
          <h3 class="text-xl font-bold text-white mb-4">
            Panier Actuel ({{ cartSummary?.itemCount || 0 }} article(s))
          </h3>

          <div class="overflow-x-auto">
            <table class="table table-zebra w-full">
              <thead>
                <tr>
                  <th class="text-gray-300">Produit</th>
                  <th class="text-gray-300">Prix unitaire</th>
                  <th class="text-gray-300">Quantité</th>
                  <th class="text-gray-300">Sous-total</th>
                  <th class="text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in cartItems" :key="item.id">
                  <td>
                    <div class="flex items-center space-x-3">
                      <div v-if="item.product.image_urls && item.product.image_urls.length > 0" class="avatar">
                        <div class="mask mask-squircle w-12 h-12">
                          <img :src="item.product.image_urls[0]" :alt="item.product.name" />
                        </div>
                      </div>
                      <div>
                        <div class="font-bold text-white">{{ item.product.name }}</div>
                        <div class="text-sm text-gray-400">{{ item.product.description }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="font-semibold">{{ formatPrice(item.product.price) }}</td>
                  <td>
                    <div class="flex items-center space-x-2">
                      <button
                        @click="updateCartQuantity(item.id, item.quantity - 1)"
                        :disabled="item.quantity <= 1"
                        class="btn btn-xs btn-circle"
                      >
                        -
                      </button>
                      <span class="font-semibold">{{ item.quantity }}</span>
                      <button
                        @click="updateCartQuantity(item.id, item.quantity + 1)"
                        class="btn btn-xs btn-circle"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td class="font-semibold">{{ formatPrice(item.product.price * item.quantity) }}</td>
                  <td>
                    <button
                      @click="removeFromCart(item.id)"
                      class="btn btn-sm btn-error"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="flex justify-between items-center mt-4 pt-4 border-t border-gray-700">
            <div class="text-lg font-semibold text-white">
              Total: {{ formatPrice(cartSummary?.total || 0) }}
            </div>
            <div class="flex space-x-4">
              <button
                @click="clearCart"
                class="btn btn-outline btn-error"
              >
                Vider le panier
              </button>
              <button
                @click="performCheckout"
                :disabled="checkoutLoading"
                class="btn btn-success"
              >
                <span v-if="checkoutLoading" class="loading loading-spinner loading-sm"></span>
                Finaliser la commande
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Filtres -->
      <div class="card p-6 mb-8">
        <div class="flex flex-col lg:flex-row gap-4">
          <div class="form-control flex-1">
            <label class="label">
              <span class="label-text">Statut</span>
            </label>
            <select v-model="statusFilter" class="select select-bordered">
              <option value="">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="validated">Validée</option>
              <option value="cancelled">Annulée</option>
            </select>
          </div>

          <div class="form-control flex-1">
            <label class="label">
              <span class="label-text">Recherche utilisateur</span>
            </label>
            <input
              v-model="userSearchFilter"
              type="text"
              placeholder="Nom, email ou ID..."
              class="input input-bordered"
            />
          </div>

          <div class="form-control flex-1">
            <label class="label">
              <span class="label-text">Date de début</span>
            </label>
            <input
              v-model="dateFromFilter"
              type="date"
              class="input input-bordered"
            />
          </div>

          <div class="form-control flex-1">
            <label class="label">
              <span class="label-text">Date de fin</span>
            </label>
            <input
              v-model="dateToFilter"
              type="date"
              class="input input-bordered"
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">&nbsp;</span>
            </label>
            <button
              @click="clearFilters"
              class="btn btn-outline"
            >
              Effacer
            </button>
          </div>
        </div>
      </div>

      <!-- Liste des commandes -->
      <div class="card">
        <div class="card-body p-0">
          <!-- Loading state -->
          <div v-if="loading" class="p-8 text-center">
            <span class="loading loading-spinner loading-lg"></span>
            <p class="text-gray-400 mt-4">Chargement des commandes...</p>
          </div>

          <!-- Empty state -->
          <div v-else-if="orders.length === 0" class="p-8 text-center">
            <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 class="text-xl font-semibold text-gray-300 mb-2">Aucune commande trouvée</h3>
            <p class="text-gray-400 mb-4">Créez votre première commande en ajoutant des produits au panier.</p>
          </div>

          <!-- Table des commandes -->
          <div v-else class="overflow-x-auto">
            <table class="table table-zebra w-full">
              <thead>
                <tr class="border-gray-700">
                  <th class="text-gray-300">ID</th>
                  <th class="text-gray-300">Client</th>
                  <th class="text-gray-300">Montant</th>
                  <th class="text-gray-300">Articles</th>
                  <th class="text-gray-300">Statut</th>
                  <th class="text-gray-300">Date</th>
                  <th class="text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="order in filteredOrders"
                  :key="order.id"
                  class="hover:bg-gray-800/50"
                >
                  <td class="font-mono text-sm">{{ order.id }}</td>
                  <td>
                    <div class="font-medium text-white">{{ order.user?.name || 'N/A' }}</div>
                    <div class="text-sm text-gray-400">{{ order.user?.email || 'N/A' }}</div>
                  </td>
                  <td class="font-semibold">{{ formatPrice(order.total) }}</td>
                  <td>
                    <span class="badge badge-outline">{{ (order.products?.reduce((s, p) => s + (p.pivot.quantity || 0), 0)) || 0 }} articles</span>
                    <span class="text-xs text-gray-400 block">{{ order.products?.length || 0 }} produits</span>
                  </td>
                  <td>
                    <div class="badge" :class="getStatusBadgeClass(order.status)">
                      {{ order.formatted_status || getStatusLabel(order.status) }}
                    </div>
                  </td>
                  <td class="text-gray-400">{{ formatDate(order.created_at) }}</td>
                  <td>
                    <div class="flex space-x-2">
                      <button
                        @click="viewOrder(order.id)"
                        class="btn btn-sm btn-ghost"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>

                      <div class="dropdown dropdown-end" v-if="canManageOrderStatus">
                        <label tabindex="0" class="btn btn-sm btn-ghost">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </label>
                        <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-gray-800 rounded-box w-52">
                          <li v-if="order.status === 'pending'">
                            <a @click="onValidate(order.id)">
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                              </svg>
                              Valider
                            </a>
                          </li>
                          <li v-if="order.status === 'pending'">
                            <a @click="onCancel(order.id)">
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              Annuler
                            </a>
                          </li>
                          <li>
                            <a @click="getOrderStats(order.id)">
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                              </svg>
                              Statistiques
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div v-if="pagination && pagination.last_page > 1" class="p-4 border-t border-gray-700">
            <div class="flex justify-between items-center">
              <div class="text-sm text-gray-400">
                Affichage de {{ pagination.from }} à {{ pagination.to }} sur {{ pagination.total }} commandes
              </div>

              <div class="join">
                <button
                  @click="currentPage = currentPage - 1; loadOrders()"
                  :disabled="currentPage <= 1"
                  class="join-item btn btn-sm"
                >
                  Précédent
                </button>

                <button
                  v-for="page in visiblePages"
                  :key="page"
                  @click="currentPage = Number(page); loadOrders()"
                  class="join-item btn btn-sm"
                  :class="{ 'btn-active': page === currentPage }"
                >
                  {{ page }}
                </button>

                <button
                  @click="currentPage = currentPage + 1; loadOrders()"
                  :disabled="currentPage >= pagination.last_page"
                  class="join-item btn btn-sm"
                >
                  Suivant
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de statistiques -->
    <div v-if="showStatsModal" class="modal modal-open">
      <div class="modal-box max-w-4xl bg-gray-800 border border-gray-700">
        <h3 class="font-bold text-lg text-white mb-6">Statistiques des Commandes</h3>

        <div v-if="selectedOrderStats" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div class="stat bg-gray-700/50 rounded-lg p-4">
              <div class="stat-title text-gray-400">Total des articles</div>
              <div class="stat-value text-white">{{ selectedOrderStats.total_items }}</div>
            </div>

            <div class="stat bg-gray-700/50 rounded-lg p-4">
              <div class="stat-title text-gray-400">Nombre de produits</div>
              <div class="stat-value text-white">{{ selectedOrderStats.product_count }}</div>
            </div>

            <div class="stat bg-gray-700/50 rounded-lg p-4">
              <div class="stat-title text-gray-400">Montant total</div>
              <div class="stat-value text-white">{{ formatPrice(selectedOrderStats.total_amount) }}</div>
            </div>

            <div class="stat bg-gray-700/50 rounded-lg p-4">
              <div class="stat-title text-gray-400">Prix moyen par article</div>
              <div class="stat-value text-white">{{ formatPrice(selectedOrderStats.average_item_price) }}</div>
            </div>

            <div class="stat bg-gray-700/50 rounded-lg p-4">
              <div class="stat-title text-gray-400">Date de création</div>
              <div class="stat-value text-sm text-white">{{ formatDate(selectedOrderStats.created_at) }}</div>
            </div>

            <div class="stat bg-gray-700/50 rounded-lg p-4">
              <div class="stat-title text-gray-400">Statut</div>
              <div class="badge" :class="getStatusBadgeClass(selectedOrderStats.status as unknown as OrderStatus)">
                {{ getStatusLabel(selectedOrderStats.status as unknown as OrderStatus) }}
              </div>
            </div>
          </div>
        </div>

        <div class="modal-action">
          <button
            @click="closeStatsModal"
            class="btn btn-ghost"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { checkoutService, type OrderStats } from '@/modules/orders/services/checkoutService'
import { OrderService } from '@/modules/orders/services/orderService'
import type { Order, OrderFilters, OrderStatus } from '@/modules/orders/types'
import { getStatusBadgeClass, getStatusLabel } from '@/modules/orders/utils/formatters'
import PermissionAlert from '@/shared/components/PermissionAlert.vue'
import { usePermissions } from '@/shared/composables/usePermissions'
import { cartService, type CartItem, type CartSummary } from '@/shared/services/cartService'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

// Router
const router = useRouter()

// Services
const api = new OrderService()

// Permissions
const { hasPermission } = usePermissions()
const canManageOrderStatus = computed(() => hasPermission('orders:update'))

// État réactif
const orders = ref<Order[]>([])
const cartItems = ref<CartItem[]>([])
const cartSummary = ref<CartSummary | null>(null)
const selectedOrderStats = ref<OrderStats | null>(null)
const loading = ref(false)
const checkoutLoading = ref(false)
const actionLoading = ref(false)
const currentPage = ref(1)
const pagination = ref<any>(null)

// Modals
const showStatsModal = ref(false)

// Filtres
const statusFilter = ref('')
const userSearchFilter = ref('')
const dateFromFilter = ref('')
const dateToFilter = ref('')

// Computed
const filteredOrders = computed(() => {
  let filtered = orders.value

  if (statusFilter.value) {
    filtered = filtered.filter(order => order.status === statusFilter.value)
  }

  if (userSearchFilter.value) {
    const searchTerm = userSearchFilter.value.toLowerCase()
    filtered = filtered.filter(order =>
      order.user?.name?.toLowerCase().includes(searchTerm) ||
      order.user?.email?.toLowerCase().includes(searchTerm) ||
      order.id.toLowerCase().includes(searchTerm)
    )
  }

  if (dateFromFilter.value) {
    const fromDate = new Date(dateFromFilter.value)
    filtered = filtered.filter(order => new Date(order.created_at) >= fromDate)
  }

  if (dateToFilter.value) {
    const toDate = new Date(dateToFilter.value)
    filtered = filtered.filter(order => new Date(order.created_at) <= toDate)
  }

  return filtered
})

const pendingOrders = computed(() => orders.value.filter(o => o.status === 'pending'))
const validatedOrders = computed(() => orders.value.filter(o => o.status === 'validated'))

const totalRevenue = computed(() => {
  const total = validatedOrders.value.reduce((sum, order) => sum + order.total, 0)
  return checkoutService.formatPrice(total)
})

const hasCartItems = computed(() => cartItems.value.length > 0)

const visiblePages = computed(() => {
  if (!pagination.value) return [] as any[]

  const current = currentPage.value
  const last = pagination.value.last_page || pagination.value.lastPage || 1
  const delta = 2
  const range: Array<number | string> = []

  for (let i = Math.max(2, current - delta); i <= Math.min(last - 1, current + delta); i++) {
    range.push(i)
  }

  if (current - delta > 2) range.unshift('...')
  if (current + delta < last - 1) range.push('...')

  range.unshift(1)
  if (last !== 1) range.push(last)

  return range
})

// Méthodes
async function loadOrders() {
  loading.value = true
  try {
    const filters: OrderFilters = {}
    if (statusFilter.value) filters.status = [statusFilter.value as OrderStatus]
    if (userSearchFilter.value) filters.user_search = userSearchFilter.value
    if (dateFromFilter.value) filters.date_from = dateFromFilter.value
    if (dateToFilter.value) filters.date_to = dateToFilter.value

    const response = await api.getOrders(filters, currentPage.value, 20)
    orders.value = response.data || []
    pagination.value = response.pagination
  } catch (error) {
    orders.value = []
  } finally {
    loading.value = false
  }
}

async function loadCart() {
  try {
    const [items, summary] = await Promise.all([
      cartService.getMyCart(),
      cartService.getCartTotal()
    ])
    cartItems.value = items
    cartSummary.value = summary
  } catch (error) {
    // noop
  }
}

function refresh() {
  loadOrders()
  loadCart()
}

function clearFilters() {
  statusFilter.value = ''
  userSearchFilter.value = ''
  dateFromFilter.value = ''
  dateToFilter.value = ''
  loadOrders()
}

function viewOrder(orderId: string) {
  router.push(`/orders/${orderId}`)
}

async function performCheckout() {
  if (!hasCartItems.value) return
  checkoutLoading.value = true
  try {
    const newOrder = await checkoutService.checkout()
    // Rafraîchir et naviguer vers la commande
    await loadOrders()
    router.push(`/orders/${newOrder.id}`)
  } catch (error) {
    // noop
  } finally {
    checkoutLoading.value = false
  }
}

async function onValidate(orderId: string) {
  // Vérification des permissions
  if (!canManageOrderStatus.value) {
    alert('Vous n\'avez pas les permissions nécessaires pour modifier le statut des commandes.')
    return
  }

  actionLoading.value = true
  try {
    await api.updateOrderStatus({ id: orderId, status: 'validated' })
    await loadOrders()
  } catch (error) {
    console.error('Erreur lors de la validation:', error)
    alert('Erreur lors de la validation de la commande. Veuillez réessayer.')
  } finally {
    actionLoading.value = false
  }
}

async function onCancel(orderId: string) {
  // Vérification des permissions
  if (!canManageOrderStatus.value) {
    alert('Vous n\'avez pas les permissions nécessaires pour modifier le statut des commandes.')
    return
  }

  actionLoading.value = true
  try {
    await checkoutService.cancelOrder(orderId)
    await loadOrders()
  } catch (error) {
    console.error('Erreur lors de l\'annulation:', error)
    alert('Erreur lors de l\'annulation de la commande. Veuillez réessayer.')
  } finally {
    actionLoading.value = false
  }
}

async function getOrderStats(orderId: string) {
  selectedOrderStats.value = await checkoutService.getOrderStats(orderId)
  showStatsModal.value = true
}

function closeStatsModal() {
  showStatsModal.value = false
  selectedOrderStats.value = null
}

function formatPrice(amount: number) {
  return checkoutService.formatPrice(amount)
}

function formatDate(date: string) {
  return checkoutService.formatDate(date)
}

onMounted(() => {
  loadOrders()
  loadCart()
})

// Gestion du panier
async function updateCartQuantity(cartItemId: string, newQty: number) {
  if (newQty < 1) return
  try {
    await cartService.updateCartItem(cartItemId, { quantity: newQty })
    await loadCart()
  } catch {
    // noop
  }
}

async function removeFromCart(cartItemId: string) {
  try {
    await cartService.removeFromCart(cartItemId)
    await loadCart()
  } catch {
    // noop
  }
}

async function clearCart() {
  try {
    await cartService.clearCart()
    await loadCart()
  } catch {
    // noop
  }
}
</script>

<style scoped>
.stats-card {
  @apply bg-gray-800/60 border border-gray-700 rounded-xl p-6 backdrop-blur-sm;
}

.card {
  @apply bg-gray-800/60 border border-gray-700 rounded-xl backdrop-blur-sm;
}

.table {
  @apply bg-transparent;
}

.table th {
  @apply bg-gray-800/50 border-gray-700;
}

.table tbody tr:hover {
  @apply bg-gray-700/30;
}

.dropdown-content {
  @apply bg-gray-800 border border-gray-700;
}
</style>
