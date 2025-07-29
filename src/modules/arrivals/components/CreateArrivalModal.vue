<template>
  <div 
    v-if="isOpen" 
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    @click="closeModal"
  >
    <div 
      class="bg-gray-800 rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
      @click.stop
    >
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-700">
        <div class="flex items-center space-x-3">
          <div class="p-2 bg-green-600/20 rounded-lg">
            <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <h3 class="text-xl font-semibold text-white">Créer un nouvel arrivage</h3>
            <p class="text-gray-400 text-sm">Ajoutez un nouvel arrivage de produits</p>
          </div>
        </div>
        <button 
          @click="closeModal"
          class="p-2 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="p-6 overflow-y-auto max-h-[70vh]">
        <form @submit.prevent="createArrival" class="space-y-6">
          <!-- Informations générales -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Référence -->
            <div class="form-control">
              <label class="label">
                <span class="label-text text-gray-300">Référence *</span>
              </label>
              <input 
                v-model="formData.reference"
                type="text"
                class="input input-bordered bg-gray-700 border-gray-600 text-white focus:border-green-500"
                :class="{ 'input-error': errors.reference }"
                placeholder="ARR240729-1234"
                required
              >
              <label v-if="errors.reference" class="label">
                <span class="label-text-alt text-error">{{ errors.reference }}</span>
              </label>
            </div>

            <!-- Fournisseur -->
            <div class="form-control">
              <label class="label">
                <span class="label-text text-gray-300">Fournisseur *</span>
              </label>
              <select 
                v-model="formData.supplier_id"
                class="select select-bordered bg-gray-700 border-gray-600 text-white focus:border-green-500"
                :class="{ 'select-error': errors.supplier_id }"
                required
              >
                <option value="">Sélectionner un fournisseur</option>
                <option v-for="supplier in suppliers" :key="supplier.id" :value="supplier.id">
                  {{ supplier.name }}
                </option>
              </select>
              <label v-if="errors.supplier_id" class="label">
                <span class="label-text-alt text-error">{{ errors.supplier_id }}</span>
              </label>
            </div>

            <!-- Date d'arrivée prévue -->
            <div class="form-control">
              <label class="label">
                <span class="label-text text-gray-300">Date d'arrivée prévue *</span>
              </label>
              <input 
                v-model="formData.expected_date"
                type="date"
                class="input input-bordered bg-gray-700 border-gray-600 text-white focus:border-green-500"
                :class="{ 'input-error': errors.expected_date }"
                required
              >
              <label v-if="errors.expected_date" class="label">
                <span class="label-text-alt text-error">{{ errors.expected_date }}</span>
              </label>
            </div>

            <!-- Bouton pour générer une référence -->
            <div class="form-control">
              <label class="label">
                <span class="label-text text-gray-300">Actions</span>
              </label>
              <button 
                type="button"
                @click="generateReference"
                class="btn bg-blue-600 hover:bg-blue-700 text-white border-none"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Générer référence
              </button>
            </div>
          </div>

          <!-- Notes -->
          <div class="form-control">
            <label class="label">
              <span class="label-text text-gray-300">Notes</span>
            </label>
            <textarea 
              v-model="formData.notes"
              class="textarea textarea-bordered bg-gray-700 border-gray-600 text-white focus:border-green-500"
              rows="3"
              placeholder="Notes additionnelles sur cet arrivage..."
            ></textarea>
          </div>

          <!-- Produits -->
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h4 class="text-lg font-semibold text-white">Produits *</h4>
              <button 
                type="button"
                @click="addProduct"
                class="btn btn-sm bg-green-600 hover:bg-green-700 text-white border-none"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Ajouter produit
              </button>
            </div>

            <div v-if="formData.products.length === 0" class="text-center py-8 text-gray-400">
              Aucun produit ajouté. Cliquez sur "Ajouter produit" pour commencer.
            </div>

            <div v-else class="space-y-4">
              <div 
                v-for="(product, index) in formData.products" 
                :key="index"
                class="bg-gray-700/50 rounded-xl p-4 border border-gray-600"
              >
                <div class="flex items-start justify-between mb-4">
                  <h5 class="font-medium text-white">Produit {{ index + 1 }}</h5>
                  <button 
                    type="button"
                    @click="removeProduct(index)"
                    class="btn btn-sm btn-circle bg-red-600/20 hover:bg-red-600/40 text-red-400 border-red-600/30"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <!-- Produit -->
                  <div class="form-control">
                    <label class="label">
                      <span class="label-text text-gray-300">Produit *</span>
                    </label>
                    <select 
                      v-model="product.product_id"
                      class="select select-bordered select-sm bg-gray-600 border-gray-500 text-white focus:border-green-500"
                      required
                    >
                      <option value="">Sélectionner</option>
                      <option v-for="prod in products" :key="prod.id" :value="prod.id">
                        {{ prod.name }} ({{ prod.sku }})
                      </option>
                    </select>
                  </div>

                  <!-- Quantité -->
                  <div class="form-control">
                    <label class="label">
                      <span class="label-text text-gray-300">Quantité *</span>
                    </label>
                    <input 
                      v-model.number="product.expected_quantity"
                      type="number"
                      min="1"
                      class="input input-bordered input-sm bg-gray-600 border-gray-500 text-white focus:border-green-500"
                      required
                    >
                  </div>

                  <!-- Coût unitaire -->
                  <div class="form-control">
                    <label class="label">
                      <span class="label-text text-gray-300">Coût unitaire (€) *</span>
                    </label>
                    <input 
                      v-model.number="product.unit_cost"
                      type="number"
                      step="0.01"
                      min="0"
                      class="input input-bordered input-sm bg-gray-600 border-gray-500 text-white focus:border-green-500"
                      required
                    >
                  </div>

                  <!-- Coût total (calculé) -->
                  <div class="form-control">
                    <label class="label">
                      <span class="label-text text-gray-300">Coût total</span>
                    </label>
                    <input 
                      :value="formatCurrency((product.expected_quantity || 0) * (product.unit_cost || 0))"
                      type="text"
                      class="input input-bordered input-sm bg-gray-600 border-gray-500 text-gray-400"
                      readonly
                    >
                  </div>

                  <!-- Date d'expiration (optionnel) -->
                  <div class="form-control">
                    <label class="label">
                      <span class="label-text text-gray-300">Date d'expiration</span>
                    </label>
                    <input 
                      v-model="product.expiry_date"
                      type="date"
                      class="input input-bordered input-sm bg-gray-600 border-gray-500 text-white focus:border-green-500"
                    >
                  </div>

                  <!-- Numéro de lot (optionnel) -->
                  <div class="form-control">
                    <label class="label">
                      <span class="label-text text-gray-300">N° de lot</span>
                    </label>
                    <input 
                      v-model="product.batch_number"
                      type="text"
                      class="input input-bordered input-sm bg-gray-600 border-gray-500 text-white focus:border-green-500"
                      placeholder="LOT123"
                    >
                  </div>
                </div>
              </div>
            </div>

            <!-- Résumé total -->
            <div v-if="formData.products.length > 0" class="bg-gray-700/30 rounded-xl p-4 border border-gray-600">
              <div class="flex justify-between items-center">
                <span class="text-gray-300">Coût total de l'arrivage:</span>
                <span class="text-xl font-bold text-green-400">{{ formatCurrency(totalCost) }}</span>
              </div>
            </div>
          </div>

          <!-- Messages d'erreur globaux -->
          <div v-if="globalError" class="alert alert-error">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.99-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span>{{ globalError }}</span>
          </div>
        </form>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-end gap-3 p-6 border-t border-gray-700">
        <button 
          type="button"
          @click="closeModal"
          class="btn bg-gray-600 hover:bg-gray-700 text-white border-none"
        >
          Annuler
        </button>
        <button 
          @click="createArrival"
          :disabled="loading || !isFormValid"
          class="btn bg-green-600 hover:bg-green-700 text-white border-none"
        >
          <span v-if="loading" class="loading loading-spinner loading-sm"></span>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          {{ loading ? 'Création...' : 'Créer l\'arrivage' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useArrivalStore } from '../stores/arrivalStore'
import { arrivalService } from '../services/arrivalService'
import type { CreateArrivalData, CreateArrivalProductData } from '../types'
import { formatCurrency, generateArrivalReference } from '../utils/formatters'
import { UI_MESSAGES } from '../constants'

// Props & Emits
interface Props {
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'created', arrival: any): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Composables
const arrivalStore = useArrivalStore()

// États locaux
const loading = ref(false)
const suppliers = ref<any[]>([])
const products = ref<any[]>([])
const globalError = ref<string | null>(null)

// Données du formulaire
const formData = ref<CreateArrivalData>({
  supplier_id: '',
  reference: '',
  expected_date: '',
  notes: '',
  products: []
})

// Erreurs de validation
const errors = ref<Record<string, string>>({})

// Computed
const totalCost = computed(() => {
  return formData.value.products.reduce((sum, product) => {
    return sum + ((product.expected_quantity || 0) * (product.unit_cost || 0))
  }, 0)
})

const isFormValid = computed(() => {
  return formData.value.supplier_id &&
         formData.value.reference &&
         formData.value.expected_date &&
         formData.value.products.length > 0 &&
         formData.value.products.every(p => p.product_id && p.expected_quantity > 0 && p.unit_cost > 0)
})

// Actions
function closeModal() {
  emit('close')
}

function generateReference() {
  formData.value.reference = generateArrivalReference()
}

function addProduct() {
  formData.value.products.push({
    product_id: '',
    expected_quantity: 1,
    unit_cost: 0,
    expiry_date: '',
    batch_number: ''
  })
}

function removeProduct(index: number) {
  formData.value.products.splice(index, 1)
}

function validateForm(): boolean {
  errors.value = {}
  globalError.value = null

  // Validation de la référence
  if (!formData.value.reference) {
    errors.value.reference = 'La référence est obligatoire'
  }

  // Validation du fournisseur
  if (!formData.value.supplier_id) {
    errors.value.supplier_id = 'Le fournisseur est obligatoire'
  }

  // Validation de la date
  if (!formData.value.expected_date) {
    errors.value.expected_date = 'La date d\'arrivée est obligatoire'
  }

  // Validation des produits
  if (formData.value.products.length === 0) {
    globalError.value = 'Au moins un produit doit être ajouté'
    return false
  }

  // Validation de chaque produit
  const hasInvalidProducts = formData.value.products.some(product => {
    return !product.product_id || !product.expected_quantity || product.expected_quantity <= 0 || 
           !product.unit_cost || product.unit_cost <= 0
  })

  if (hasInvalidProducts) {
    globalError.value = 'Tous les produits doivent avoir un nom, une quantité et un coût valides'
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
    const newArrival = await arrivalStore.createArrival(formData.value)
    emit('created', newArrival)
    
    // Réinitialiser le formulaire
    formData.value = {
      supplier_id: '',
      reference: '',
      expected_date: '',
      notes: '',
      products: []
    }
  } catch (error: any) {
    globalError.value = error.message || UI_MESSAGES.ERROR.CREATE_ARRIVAL
    console.error('Erreur lors de la création:', error)
  } finally {
    loading.value = false
  }
}

async function loadSuppliers() {
  try {
    suppliers.value = await arrivalService.getSuppliers()
  } catch (error) {
    console.error('Erreur lors du chargement des fournisseurs:', error)
  }
}

async function loadProducts() {
  try {
    products.value = await arrivalService.getProducts()
  } catch (error) {
    console.error('Erreur lors du chargement des produits:', error)
  }
}

// Cycle de vie
onMounted(async () => {
  // Générer une référence par défaut
  generateReference()
  
  // Charger les données
  await Promise.all([
    loadSuppliers(),
    loadProducts()
  ])
})
</script>
