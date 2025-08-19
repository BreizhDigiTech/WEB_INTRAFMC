<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
    <!-- Header avec breadcrumb -->
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
          <RouterLink to="/orders" class="hover:text-white transition-colors">Commandes</RouterLink>
          <span>/</span>
          <span class="text-white font-medium">
            {{ order ? `#${order.id}` : 'Détail' }}
          </span>
        </nav>

        <!-- Header principal -->
        <div class="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
          <div class="flex items-center space-x-4">
            <button 
              @click="goBack"
              class="p-2 hover:bg-gray-800 rounded-xl transition-colors"
            >
              <svg class="w-6 h-6 text-gray-400 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            
            <div class="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            
            <div>
              <h1 class="text-3xl font-bold text-white">
                {{ order ? `Commande #${order.id}` : 'Détail de la commande' }}
              </h1>
              <p class="text-gray-400">
                {{ order ? `Créée le ${formatDate(order.created_at)}` : 'Chargement...' }}
              </p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-wrap gap-3">
            <button 
              @click="refreshOrder"
              :disabled="loading"
              class="btn bg-gray-800 border-gray-600 text-white hover:bg-gray-700 min-w-fit"
            >
              <span v-if="loading" class="loading loading-spinner loading-sm"></span>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span class="hidden sm:inline ml-2">{{ loading ? 'Chargement...' : 'Actualiser' }}</span>
            </button>

            <!-- Actions de statut -->
            <template v-if="order && order.status === 'pending'">
              <button 
                @click="validateOrder"
                :disabled="actionLoading"
                class="btn bg-green-600 hover:bg-green-700 text-white border-none min-w-fit"
              >
                <span v-if="actionLoading" class="loading loading-spinner loading-sm"></span>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="hidden sm:inline ml-2">Valider</span>
              </button>
              
              <button 
                @click="cancelOrder"
                :disabled="actionLoading"
                class="btn bg-red-600 hover:bg-red-700 text-white border-none min-w-fit"
              >
                <span v-if="actionLoading" class="loading loading-spinner loading-sm"></span>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span class="hidden sm:inline ml-2">Annuler</span>
              </button>
            </template>

            <!-- Génération de facture pour les commandes livrées/expédiées -->
            <template v-if="order && (order.status === 'delivered' || order.status === 'shipped')">
              <button 
                @click="generateInvoice"
                :disabled="invoiceLoading"
                class="btn bg-purple-600 hover:bg-purple-700 text-white border-none min-w-fit"
              >
                <span v-if="invoiceLoading" class="loading loading-spinner loading-sm"></span>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span class="hidden sm:inline ml-2">{{ invoiceLoading ? 'Génération...' : 'Générer facture' }}</span>
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <!-- Message de succès -->
      <div v-if="successMessage" class="mb-6">
        <div class="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
          <div class="flex items-center space-x-3">
            <div class="p-2 bg-green-500/20 rounded-lg">
              <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h4 class="text-green-400 font-medium">Succès</h4>
              <p class="text-green-300 text-sm">{{ successMessage }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- États de chargement et d'erreur -->
      <div v-if="loading && !order" class="flex flex-col items-center justify-center py-20">
        <div class="w-16 h-16 relative mb-4">
          <div class="animate-spin rounded-full h-16 w-16 border-4 border-gray-600 border-t-blue-500"></div>
        </div>
        <h3 class="text-xl font-medium text-gray-300 mb-2">Chargement de la commande</h3>
        <p class="text-gray-500">Veuillez patienter...</p>
      </div>

      <div v-else-if="error" class="max-w-md mx-auto">
        <div class="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center">
          <div class="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-xl font-medium text-red-400 mb-2">Erreur de chargement</h3>
          <p class="text-red-300 mb-4">{{ error }}</p>
          <button 
            @click="refreshOrder"
            class="btn bg-red-600/20 hover:bg-red-600/40 text-red-400 border-red-600/30"
          >
            Réessayer
          </button>
        </div>
      </div>

      <!-- Contenu principal -->
      <div v-else-if="order" class="space-y-8">
        <!-- Résumé de la commande -->
        <div class="bg-gradient-to-r from-gray-800/50 to-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <!-- Statut -->
            <div class="text-center lg:text-left">
              <label class="text-sm font-medium text-gray-400 uppercase tracking-wide block mb-2">Statut</label>
              <div class="flex justify-center lg:justify-start items-center space-x-2">
                <span 
                  :class="getStatusBadgeClass(order.status)"
                  class="badge badge-lg font-medium px-4 py-2"
                >
                  <div class="w-2 h-2 rounded-full mr-2" :class="getStatusDotClass(order.status)"></div>
                  {{ getStatusLabel(order.status) }}
                </span>
                <!-- Icône facture disponible pour les commandes livrées/expédiées -->
                <div v-if="order.status === 'delivered' || order.status === 'shipped'" class="tooltip tooltip-top" data-tip="Facture disponible">
                  <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Total -->
            <div class="text-center lg:text-left">
              <label class="text-sm font-medium text-gray-400 uppercase tracking-wide block mb-2">Total</label>
              <p class="text-3xl font-bold text-white">{{ formatCurrency(order.total) }}</p>
            </div>

            <!-- Client -->
            <div class="text-center lg:text-left">
              <label class="text-sm font-medium text-gray-400 uppercase tracking-wide block mb-2">Client</label>
              <div class="flex items-center justify-center lg:justify-start space-x-3">
                <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p class="text-white font-medium">{{ order.user?.name || 'Client inconnu' }}</p>
                  <p class="text-gray-400 text-sm">{{ order.user?.email || order.user?.id || 'N/A' }}</p>
                </div>
              </div>
            </div>

            <!-- Date -->
            <div class="text-center lg:text-left">
              <label class="text-sm font-medium text-gray-400 uppercase tracking-wide block mb-2">Créée le</label>
              <p class="text-white font-medium">{{ formatDate(order.created_at) }}</p>
              <p class="text-gray-400 text-sm">{{ formatRelativeTime(order.created_at) }}</p>
            </div>
          </div>
        </div>

        <!-- Liste des produits -->
        <div v-if="order.products && order.products.length > 0" class="space-y-6">
          <h2 class="text-2xl font-bold text-white mb-6">
            Produits commandés
            <span class="text-lg text-gray-400 font-normal ml-2">
              ({{ order.products.length }} {{ order.products.length > 1 ? 'articles' : 'article' }})
            </span>
          </h2>

          <div class="grid gap-6">
            <div 
              v-for="product in order.products" 
              :key="product.id"
              class="bg-gradient-to-r from-gray-800/50 to-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-gray-600/50 transition-all duration-300"
            >
              <div class="flex items-center space-x-6">
                <!-- Image du produit -->
                <div class="relative flex-shrink-0">
                  <img 
                    :src="getProductImage(product)" 
                    :alt="product.name"
                    class="w-20 h-20 rounded-xl object-cover bg-gray-700 border border-gray-600"
                    @error="handleImageError"
                  />
                  <div class="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                    {{ product.pivot.quantity }}
                  </div>
                </div>

                <!-- Informations du produit -->
                <div class="flex-1 min-w-0">
                  <h3 class="text-xl font-semibold text-white truncate mb-2">{{ product.name }}</h3>
                  
                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label class="text-xs font-medium text-gray-400 uppercase tracking-wide block mb-1">Prix unitaire</label>
                      <p class="text-lg font-semibold text-blue-400">{{ formatCurrency(product.pivot.unit_price) }}</p>
                    </div>
                    
                    <div>
                      <label class="text-xs font-medium text-gray-400 uppercase tracking-wide block mb-1">Quantité</label>
                      <p class="text-lg font-semibold text-white">{{ product.pivot.quantity }}</p>
                    </div>
                    
                    <div>
                      <label class="text-xs font-medium text-gray-400 uppercase tracking-wide block mb-1">Sous-total</label>
                      <p class="text-lg font-bold text-green-400">{{ formatCurrency(product.pivot.quantity * product.pivot.unit_price) }}</p>
                    </div>
                  </div>
                </div>

                <!-- Actions produit -->
                <div class="flex-shrink-0">
                  <div class="dropdown dropdown-end">
                    <div tabindex="0" role="button" class="btn btn-sm btn-ghost text-gray-400 hover:text-white">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zM12 13a1 1 0 110-2 1 1 0 010 2zM12 20a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </div>
                    <ul tabindex="0" class="dropdown-content menu p-2 shadow-xl bg-gray-800 rounded-xl w-48 border border-gray-700">
                      <li>
                        <a class="text-gray-400 hover:bg-gray-700/50">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Voir produit
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Résumé total -->
          <div class="bg-gradient-to-r from-gray-800/80 to-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 mt-8">
            <div class="flex justify-between items-center">
              <div>
                <h3 class="text-xl font-semibold text-white">Total de la commande</h3>
                <p class="text-gray-400">{{ order.products.reduce((sum, p) => sum + p.pivot.quantity, 0) }} articles</p>
              </div>
              <div class="text-right">
                <p class="text-3xl font-bold text-green-400">{{ formatCurrency(order.total) }}</p>
                <p class="text-sm text-gray-400">TTC</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Message si pas de produits -->
        <div v-else class="text-center py-16">
          <div class="w-24 h-24 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
            <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8L9 5m0 0v4m0-4l4 4" />
            </svg>
          </div>
          <h3 class="text-xl font-medium text-gray-300 mb-2">Aucun produit</h3>
          <p class="text-gray-500">Aucun produit n'est associé à cette commande.</p>
        </div>
      </div>
    </div>

    <!-- Modal d'aperçu de facture -->
    <InvoicePreviewModal 
      :is-open="showInvoicePreview"
      :order="order"
      @close="showInvoicePreview = false"
      @download="handleInvoiceDownload"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import InvoicePreviewModal from '../components/InvoicePreviewModal.vue'
import { orderService } from '../services/orderService'
import { useOrderStore } from '../stores/orderStore'
import type { Order, OrderStatus } from '../types'
import {
    formatCurrency,
    formatDate,
    getProductImage,
    getStatusBadgeClass,
    getStatusLabel,
    handleImageError
} from '../utils/formatters'

// Composables
const route = useRoute()
const router = useRouter()
const orderStore = useOrderStore()

// État local
const order = ref<Order | null>(null)
const loading = ref(false)
const actionLoading = ref(false)
const invoiceLoading = ref(false)
const showInvoicePreview = ref(false)
const error = ref<string | null>(null)

// Actions
async function refreshOrder() {
  const orderId = route.params.id as string
  if (!orderId) return

  loading.value = true
  error.value = null
  
  try {
    const fetchedOrder = await orderStore.fetchOrderById(orderId)
    order.value = fetchedOrder
  } catch (err: any) {
    error.value = err.message || 'Erreur lors du chargement de la commande'
    console.error('Erreur refreshOrder:', err)
  } finally {
    loading.value = false
  }
}

async function validateOrder() {
  if (!order.value) return

  actionLoading.value = true
  
  try {
    await orderStore.updateOrderStatus(order.value.id, 'validated')
    // Rafraîchir la commande pour mettre à jour le statut
    await refreshOrder()
  } catch (err: any) {
    error.value = err.message || 'Erreur lors de la validation'
    console.error('Erreur validateOrder:', err)
  } finally {
    actionLoading.value = false
  }
}

async function cancelOrder() {
  if (!order.value) return

  actionLoading.value = true
  
  try {
    await orderStore.cancelOrder(order.value.id)
    // Rafraîchir la commande pour mettre à jour le statut
    await refreshOrder()
  } catch (err: any) {
    error.value = err.message || 'Erreur lors de l\'annulation'
    console.error('Erreur cancelOrder:', err)
  } finally {
    actionLoading.value = false
  }
}

function goBack() {
  router.back()
}

async function generateInvoice() {
  if (!order.value) return
  // Ouvrir le modal d'aperçu de facture
  showInvoicePreview.value = true
}

async function handleInvoiceDownload(orderId: string) {
  invoiceLoading.value = true
  error.value = null
  
  try {
    const result = await orderService.generateInvoice(orderId)
    
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
    
    // Message de succès temporaire
    showSuccessMessage('Facture téléchargée avec succès !')
    
  } catch (err: any) {
    error.value = err.message || 'Erreur lors de la génération de la facture'
    console.error('Erreur generateInvoice:', err)
  } finally {
    invoiceLoading.value = false
  }
}

// État pour les messages de succès
const successMessage = ref<string | null>(null)

function showSuccessMessage(message: string) {
  successMessage.value = message
  // Effacer le message après 3 secondes
  setTimeout(() => {
    successMessage.value = null
  }, 3000)
}

function getStatusDotClass(status: OrderStatus): string {
  const classes: Record<string, string> = {
    pending: 'bg-yellow-400',
    validated: 'bg-green-400',
    cancelled: 'bg-red-400',
    processing: 'bg-blue-400',
    shipped: 'bg-purple-400',
    delivered: 'bg-green-500',
    refunded: 'bg-gray-400'
  }
  return classes[status] || 'bg-gray-500'
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) {
    return 'Il y a quelques secondes'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`
  } else {
    const days = Math.floor(diffInSeconds / 86400)
    return `Il y a ${days} jour${days > 1 ? 's' : ''}`
  }
}

// Charger la commande au montage du composant
onMounted(() => {
  refreshOrder()
})
</script>
