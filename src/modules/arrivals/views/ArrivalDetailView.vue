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
          <RouterLink to="/arrivals" class="hover:text-white transition-colors">Arrivages</RouterLink>
          <span>/</span>
          <span class="text-white font-medium">
            {{ arrival ? `#${arrival.id}` : 'Détail' }}
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
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            
            <div>
              <h1 class="text-3xl font-bold text-white">
                {{ arrival ? `Arrivage #${arrival.id}` : 'Détail de l\'arrivage' }}
              </h1>
              <p class="text-gray-400">
                {{ arrival ? `Créé le ${formatDate(arrival.created_at || '')}` : 'Chargement...' }}
              </p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-wrap gap-3">
            <button 
              @click="refreshArrival"
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
            <template v-if="arrival && arrival.status === 'pending'">
              <button 
                @click="validateArrival"
                :disabled="actionLoading"
                class="btn bg-green-600 hover:bg-green-700 text-white border-none min-w-fit"
              >
                <span v-if="actionLoading" class="loading loading-spinner loading-sm"></span>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="hidden sm:inline ml-2">Valider l'arrivage</span>
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <!-- État de chargement -->
      <div v-if="loading && !arrival" class="flex items-center justify-center py-20">
        <div class="text-center">
          <div class="loading loading-spinner loading-lg text-blue-500 mb-4"></div>
          <p class="text-gray-400">Chargement des détails de l'arrivage...</p>
        </div>
      </div>

      <!-- Arrivage non trouvé ou API non disponible -->
      <div v-else-if="!loading && !arrival" class="flex items-center justify-center py-20">
        <div class="text-center max-w-md">
          <div class="p-4 bg-yellow-500/20 rounded-2xl mb-4 inline-block">
            <svg class="w-12 h-12 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.502 0L4.312 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-white mb-2">Fonctionnalité en développement</h3>
          <p class="text-gray-400 mb-6">
            La consultation des détails d'arrivage n'est pas encore disponible. 
            L'API backend doit implémenter l'endpoint GraphQL "arrival(id: ID!)".
          </p>
          <button 
            @click="goBack"
            class="btn bg-blue-600 hover:bg-blue-700 text-white border-none"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour à la liste
          </button>
        </div>
      </div>

      <!-- Détails de l'arrivage -->
      <div v-else class="space-y-8">
        <!-- Informations générales -->
        <div class="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden">
          <div class="bg-gray-800/80 px-6 py-4 border-b border-gray-700">
            <h2 class="text-xl font-semibold text-white">Informations générales</h2>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <!-- Statut -->
              <div>
                <label class="block text-sm font-medium text-gray-400 mb-2">Statut</label>
                <span v-if="arrival" :class="getStatusBadgeClass(arrival.status)" class="badge badge-lg font-medium">
                  {{ getStatusLabel(arrival.status) }}
                </span>
              </div>
              
              <!-- Montant total -->
              <div>
                <label class="block text-sm font-medium text-gray-400 mb-2">Montant total</label>
                <p v-if="arrival" class="text-2xl font-bold text-green-400">{{ formatCurrency(arrival.amount) }}</p>
              </div>
              
              <!-- Date de création -->
              <div>
                <label class="block text-sm font-medium text-gray-400 mb-2">Date de création</label>
                <p v-if="arrival" class="text-white">{{ formatDate(arrival.created_at || '') }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Liste des produits -->
        <div class="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden">
          <div class="bg-gray-800/80 px-6 py-4 border-b border-gray-700">
            <h2 class="text-xl font-semibold text-white">
              Produits de l'arrivage
              <span v-if="arrival && arrival.products" class="text-sm font-normal text-gray-400 ml-2">
                ({{ arrival.products.length }} {{ arrival.products.length > 1 ? 'produits' : 'produit' }})
              </span>
            </h2>
          </div>
          <div class="overflow-x-auto">
            <table class="table table-zebra w-full">
              <thead>
                <tr class="border-gray-700">
                  <th class="text-gray-300 bg-gray-800/50">Produit</th>
                  <th class="text-gray-300 bg-gray-800/50">Quantité</th>
                  <th class="text-gray-300 bg-gray-800/50">Prix unitaire</th>
                  <th class="text-gray-300 bg-gray-800/50">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="arrivalProduct in arrival?.products || []" 
                  :key="arrivalProduct.id"
                  class="hover:bg-gray-700/30"
                >
                  <!-- Produit -->
                  <td>
                    <div class="flex items-center gap-3">
                      <div class="w-12 h-12 rounded-lg overflow-hidden bg-gray-600 flex items-center justify-center">
                        <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <div>
                        <p class="text-white font-medium">
                          {{ arrivalProduct.product?.name || 'Produit inconnu' }}
                        </p>
                        <p class="text-sm text-gray-400">
                          ID: {{ arrivalProduct.product?.id }}
                          <span v-if="arrivalProduct.product?.category" class="ml-2">
                            • {{ arrivalProduct.product.category.name }}
                          </span>
                          <span v-if="arrivalProduct.product?.suppliers && arrivalProduct.product.suppliers.length > 0" class="ml-2">
                            • {{ arrivalProduct.product.suppliers[0].name }}
                          </span>
                        </p>
                      </div>
                    </div>
                  </td>
                  
                  <!-- Quantité -->
                  <td class="text-white font-medium">
                    {{ arrivalProduct.quantity }}
                  </td>
                  
                  <!-- Prix unitaire -->
                  <td class="text-white">
                    {{ arrivalProduct.unit_price ? formatCurrency(arrivalProduct.unit_price) : 
                       (arrivalProduct.product?.price ? formatCurrency(arrivalProduct.product.price) : '-') }}
                  </td>
                  
                  <!-- Total -->
                  <td class="text-green-400 font-semibold">
                    {{ arrivalProduct.unit_price ? formatCurrency(arrivalProduct.quantity * arrivalProduct.unit_price) : 
                       (arrivalProduct.product?.price ? formatCurrency(arrivalProduct.quantity * arrivalProduct.product.price) : '-') }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { arrivalService } from '../services/arrivalService'
import type { Arrival } from '../types'

const route = useRoute()
const router = useRouter()

const arrival = ref<Arrival | null>(null)
const isLoading = ref(true)
const loading = ref(false)
const actionLoading = ref(false)
const error = ref<string | null>(null)

const arrivalId = computed(() => route.params.id as string)

const loadArrival = async () => {
  try {
    isLoading.value = true
    loading.value = true
    error.value = null
    arrival.value = await arrivalService.getArrival(arrivalId.value)
  } catch (err) {
    error.value = 'Erreur lors du chargement de l\'arrivage'
    console.error('Error loading arrival:', err)
  } finally {
    isLoading.value = false
    loading.value = false
  }
}

const refreshArrival = loadArrival

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusLabel = (status: string): string => {
  const statusLabels: Record<string, string> = {
    'pending': 'En attente',
    'validated': 'Validé',
    'in_progress': 'En cours',
    'completed': 'Terminé',
    'cancelled': 'Annulé'
  }
  return statusLabels[status] || status
}

const getStatusBadgeClass = (status: string): string => {
  const statusClasses: Record<string, string> = {
    'pending': 'badge-warning',
    'validated': 'badge-success',
    'in_progress': 'badge-info',
    'completed': 'badge-success',
    'cancelled': 'badge-error'
  }
  return statusClasses[status] || 'badge-neutral'
}

const validateArrival = async () => {
  if (!arrival.value) return
  
  // Confirmation avant validation
  const confirmValidation = confirm(`Êtes-vous sûr de vouloir valider l'arrivage ${arrival.value.id} ?`)
  if (!confirmValidation) return
  
  try {
    actionLoading.value = true
    
    // Appel à l'API pour valider l'arrivage
    const updatedArrival = await arrivalService.validateArrival(arrival.value.id)
    
    // Mettre à jour l'arrivage local avec les nouvelles données
    arrival.value = { ...arrival.value, ...updatedArrival }
    
    alert('Arrivage validé avec succès !')
    console.log('Arrivage validé avec succès:', updatedArrival.id)
    
  } catch (err) {
    console.error('Erreur lors de la validation:', err)
    error.value = 'Erreur lors de la validation de l\'arrivage'
    alert('Erreur lors de la validation de l\'arrivage')
  } finally {
    actionLoading.value = false
  }
}

const goBack = () => {
  router.push('/arrivals')
}

onMounted(loadArrival)
</script>
