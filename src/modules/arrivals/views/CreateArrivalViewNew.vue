<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <!-- En-tête avec gradient -->
    <div class="bg-gradient-to-r from-green-900 via-emerald-900 to-teal-900">
      <div class="container mx-auto px-4 py-8">
        <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <!-- Titre et description -->
          <div class="flex-1">
            <div class="flex items-center gap-4 mb-2">
              <button @click="$router.back()" class="btn btn-ghost btn-circle text-white hover:bg-white/10">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1
                class="text-4xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Créer un nouvel arrivage
              </h1>
            </div>
            <p class="text-gray-300 text-lg">
              Enregistrez l'arrivée de nouveaux produits dans votre inventaire
            </p>
          </div>

          <!-- Actions rapides -->
          <div class="flex gap-3">
            <button @click="resetForm" class="btn bg-gray-700 hover:bg-gray-600 text-white border-none">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Réinitialiser
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <!-- Messages d'erreur globaux -->
      <div v-if="globalError" class="alert alert-error mb-6">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.99-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <span>{{ globalError }}</span>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <!-- Formulaire principal -->
        <div class="xl:col-span-2 space-y-8">
          <!-- Section produits -->
          <div class="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-xl font-semibold text-white flex items-center gap-3">
                <div class="w-8 h-8 bg-green-600/20 rounded-lg flex items-center justify-center">
                  <svg class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 9h6" />
                  </svg>
                </div>
                Produits ({{ formData.products.length }})
              </h2>
            </div>

            <!-- Barre de recherche produits -->
            <div class="mb-6">
              <div class="relative">
                <input v-model="productSearch" @input="searchProducts" type="text"
                  placeholder="Rechercher un produit par nom..."
                  class="input input-bordered w-full bg-gray-700 border-gray-600 text-white focus:border-green-500 pl-10">
                <svg class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none"
                  stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <!-- Résultats de recherche -->
              <div v-if="productSearch && filteredProducts.length > 0"
                class="mt-4 bg-gray-700/50 rounded-xl border border-gray-600 max-h-60 overflow-y-auto">
                <div class="p-2 text-sm text-gray-400 border-b border-gray-600">
                  {{ filteredProducts.length }} produit(s) trouvé(s)
                </div>
                <div v-for="product in filteredProducts" :key="product.id" @click="addProductToList(product)"
                  class="flex items-center justify-between p-3 hover:bg-gray-600/50 cursor-pointer border-b border-gray-600/50 last:border-0">
                  <div class="flex-1">
                    <div class="font-medium text-white">{{ product.name }}</div>
                    <div class="text-sm text-gray-400">
                      Prix: {{ formatCurrency(product.price) }} • Stock: {{ product.stock }} unités
                    </div>
                  </div>
                  <button class="btn btn-ghost btn-sm text-green-400">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Message si aucun résultat -->
              <div v-if="productSearch && filteredProducts.length === 0"
                class="mt-4 p-4 bg-gray-700/30 rounded-xl text-center text-gray-400">
                Aucun produit trouvé pour "{{ productSearch }}"
              </div>
            </div>

            <!-- Liste des produits ajoutés -->
            <div v-if="formData.products.length === 0" class="text-center py-12 text-gray-400">
              <svg class="w-16 h-16 mx-auto mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 9h6" />
              </svg>
              <p class="text-lg">Aucun produit ajouté</p>
              <p class="text-sm">Utilisez la barre de recherche ci-dessus pour ajouter des produits</p>
            </div>

            <div v-else class="space-y-4">
              <div v-for="(product, index) in formData.products" :key="index"
                class="bg-gray-700/30 border border-gray-600/50 rounded-xl p-4">
                <div class="flex items-center justify-between mb-4">
                  <div class="flex-1">
                    <h4 class="font-medium text-white">{{ product.product?.name || 'Produit inconnu' }}</h4>
                    <p class="text-sm text-gray-400">
                      Prix catalogue: {{ product.product ? formatCurrency(product.product.price) : 'N/A' }}
                      • Stock disponible: {{ product.product?.stock || 0 }} unités
                    </p>
                  </div>
                  <button @click="removeProduct(index)" class="btn btn-ghost btn-sm text-red-400 hover:bg-red-500/20">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <!-- Quantité -->
                  <div class="form-control">
                    <label class="label">
                      <span class="label-text text-gray-300">Quantité *</span>
                    </label>
                    <input v-model.number="product.quantity" type="number" min="1"
                      class="input input-bordered input-sm bg-gray-600 border-gray-500 text-white focus:border-green-500"
                      required>
                  </div>

                  <!-- Prix unitaire -->
                  <div class="form-control">
                    <label class="label">
                      <span class="label-text text-gray-300">Prix unitaire (€) *</span>
                    </label>
                    <input v-model.number="product.unit_price" type="number" step="0.01" min="0"
                      class="input input-bordered input-sm bg-gray-600 border-gray-500 text-white focus:border-green-500"
                      required>
                  </div>

                  <!-- Total -->
                  <div class="form-control">
                    <label class="label">
                      <span class="label-text text-gray-300">Total</span>
                    </label>
                    <input :value="formatCurrency((product.quantity || 0) * (product.unit_price || 0))" type="text"
                      class="input input-bordered input-sm bg-gray-600 border-gray-500 text-gray-400" readonly>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Résumé et actions -->
        <div class="space-y-6">
          <!-- Résumé -->
          <div class="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 sticky top-4">
            <h3 class="text-lg font-semibold text-white mb-4 flex items-center gap-3">
              <div class="w-6 h-6 bg-purple-600/20 rounded-lg flex items-center justify-center">
                <svg class="w-3 h-3 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              Résumé
            </h3>

            <div class="space-y-4">
              <div class="flex justify-between text-sm">
                <span class="text-gray-400">Produits:</span>
                <span class="text-white font-medium">{{ formData.products.length }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-400">Quantité totale:</span>
                <span class="text-white font-medium">{{ totalQuantity }} unités</span>
              </div>
              <div class="border-t border-gray-600 pt-4">
                <div class="flex justify-between">
                  <span class="text-gray-300">Montant total:</span>
                  <span class="text-xl font-bold text-green-400">{{ formatCurrency(totalAmount) }}</span>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="mt-6 space-y-3">
              <button @click="createArrival" :disabled="loading || !isFormValid"
                class="btn bg-green-600 hover:bg-green-700 text-white border-none w-full">
                <span v-if="loading" class="loading loading-spinner loading-sm"></span>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                {{ loading ? 'Création...' : 'Créer l\'arrivage' }}
              </button>

              <button @click="$router.push('/arrivals')"
                class="btn bg-gray-600 hover:bg-gray-700 text-white border-none w-full">
                Annuler
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { UI_MESSAGES } from '../constants'
import { arrivalService } from '../services/arrivalService'
import { useArrivalStore } from '../stores/arrivalStore'
import type { CreateArrivalInput } from '../types'
import { formatCurrency } from '../utils/formatters'

// Router
const router = useRouter()

// Store
const arrivalStore = useArrivalStore()

// États locaux
const loading = ref(false)
const products = ref<any[]>([])
const globalError = ref<string | null>(null)
const productSearch = ref('')
const filteredProducts = ref<any[]>([])

// Erreurs de validation
const errors = ref<Record<string, string>>({})

// Interface simplifiée pour le formulaire
interface FormProductData {
  product_id: string
  quantity: number
  unit_price: number
  product?: {
    id: string
    name: string
    price: number
    stock: number
  }
}

interface FormData {
  products: FormProductData[]
}

// Données du formulaire - simplifiées selon la nouvelle API
const formData = ref<FormData>({
  products: []
})

// Computed
const totalQuantity = computed(() => {
  return formData.value.products.reduce((sum, product) => sum + (product.quantity || 0), 0)
})

const totalAmount = computed(() => {
  return formData.value.products.reduce((sum, product) => {
    return sum + ((product.quantity || 0) * (product.unit_price || 0))
  }, 0)
})

const isFormValid = computed(() => {
  return formData.value.products.length > 0 &&
    formData.value.products.every(p => p.product_id && p.quantity > 0 && p.unit_price > 0)
})

// Fonctions
function resetForm() {
  formData.value = {
    products: []
  }
  errors.value = {}
  globalError.value = null
  productSearch.value = ''
  filteredProducts.value = []
}

function searchProducts() {
  if (!productSearch.value.trim()) {
    filteredProducts.value = []
    return
  }

  const search = productSearch.value.toLowerCase()
  filteredProducts.value = products.value.filter(product =>
    product.name.toLowerCase().includes(search) &&
    !formData.value.products.some(p => p.product_id === product.id)
  )
}

function addProductToList(product: any) {
  const newProduct: FormProductData = {
    product_id: product.id,
    quantity: 1,
    unit_price: product.price,
    product: {
      id: product.id,
      name: product.name,
      price: product.price,
      stock: product.stock
    }
  }

  formData.value.products.push(newProduct)
  productSearch.value = ''
  filteredProducts.value = []
}

function removeProduct(index: number) {
  formData.value.products.splice(index, 1)
}

function validateForm(): boolean {
  errors.value = {}
  globalError.value = null

  // Validation des produits
  if (formData.value.products.length === 0) {
    globalError.value = 'Au moins un produit doit être ajouté'
    return false
  }

  // Validation de chaque produit avec messages spécifiques
  const productErrors: string[] = []
  formData.value.products.forEach((product, index) => {
    if (!product.product_id) {
      productErrors.push(`Ligne ${index + 1}: Produit non sélectionné`)
    }
    if (!product.quantity || product.quantity <= 0) {
      productErrors.push(`Ligne ${index + 1}: Quantité invalide`)
    }
    if (!product.unit_price || product.unit_price <= 0) {
      productErrors.push(`Ligne ${index + 1}: Prix unitaire invalide`)
    }
    if (product.quantity && product.quantity > 10000) {
      productErrors.push(`Ligne ${index + 1}: Quantité trop élevée`)
    }
    if (product.unit_price && product.unit_price > 999999) {
      productErrors.push(`Ligne ${index + 1}: Prix unitaire trop élevé`)
    }
  })

  if (productErrors.length > 0) {
    globalError.value = productErrors.join('; ')
    return false
  }

  // Validation du montant total
  if (totalAmount.value <= 0) {
    globalError.value = 'Le montant total de l\'arrivage doit être supérieur à 0€'
    return false
  }

  return Object.keys(errors.value).length === 0 && !globalError.value
}

async function createArrival() {
  if (!validateForm()) {
    return
  }

  loading.value = true
  globalError.value = null

  try {
    // Transformer les données du formulaire vers le format API
    const createArrivalInput: CreateArrivalInput = {
      // Le montant sera recalculé côté serveur selon la documentation
      products: formData.value.products.map(product => ({
        product_id: product.product_id,
        quantity: product.quantity,
        unit_price: product.unit_price
      }))
    }

    const newArrival = await arrivalStore.createArrival(createArrivalInput)

    // Afficher un message de succès
    const notification = document.createElement('div')
    notification.className = 'fixed top-4 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg'
    notification.textContent = `Arrivage ${newArrival.id || 'nouveau'} créé avec succès !`
    document.body.appendChild(notification)

    setTimeout(() => {
      document.body.removeChild(notification)
    }, 3000)

    // Rediriger vers la liste des arrivages
    router.push('/arrivals')

  } catch (error: any) {
    globalError.value = error.message || UI_MESSAGES.ERROR.CREATE_ARRIVAL
    console.error('Erreur lors de la création:', error)
  } finally {
    loading.value = false
  }
}

async function loadProducts() {
  try {
    products.value = await arrivalService.getProducts(100) // Plus de produits pour la recherche
  } catch (error) {
    console.error('Erreur lors du chargement des produits:', error)
  }
}

// Cycle de vie
onMounted(async () => {
  await loadProducts()
})

// Watchers
watch(productSearch, (newValue) => {
  if (!newValue.trim()) {
    filteredProducts.value = []
  }
})
</script>
