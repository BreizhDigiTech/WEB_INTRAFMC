<template>
  <div class="modal modal-open">
    <div class="modal-box max-w-4xl bg-gray-900 border border-gray-700">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-2xl font-bold text-white">Modifier la commande {{ order.order_number }}</h3>
        <button 
          @click="emit('close')"
          class="btn btn-sm btn-circle bg-gray-700 hover:bg-gray-600 text-white border-none"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form @submit.prevent="updateOrder">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Left column - Customer info -->
          <div class="space-y-4">
            <h4 class="text-lg font-semibold text-white mb-4">Informations client</h4>
            
            <div class="form-control">
              <label class="label">
                <span class="label-text text-gray-300">Nom complet *</span>
              </label>
              <input
                v-model="form.customer_name"
                type="text"
                required
                class="input input-bordered bg-gray-800 border-gray-600 text-white focus:border-blue-500"
                placeholder="Nom du client"
              />
            </div>

            <div class="form-control">
              <label class="label">
                <span class="label-text text-gray-300">Email *</span>
              </label>
              <input
                v-model="form.customer_email"
                type="email"
                required
                class="input input-bordered bg-gray-800 border-gray-600 text-white focus:border-blue-500"
                placeholder="email@exemple.com"
              />
            </div>

            <div class="form-control">
              <label class="label">
                <span class="label-text text-gray-300">Téléphone</span>
              </label>
              <input
                v-model="form.customer_phone"
                type="tel"
                class="input input-bordered bg-gray-800 border-gray-600 text-white focus:border-blue-500"
                placeholder="+33 1 23 45 67 89"
              />
            </div>

            <div class="form-control">
              <label class="label">
                <span class="label-text text-gray-300">Adresse de livraison *</span>
              </label>
              <textarea
                v-model="form.customer_address"
                required
                rows="3"
                class="textarea textarea-bordered bg-gray-800 border-gray-600 text-white focus:border-blue-500 resize-none"
                placeholder="Adresse complète de livraison"
              ></textarea>
            </div>

            <div class="form-control">
              <label class="label">
                <span class="label-text text-gray-300">Notes de commande</span>
              </label>
              <textarea
                v-model="form.notes"
                rows="2"
                class="textarea textarea-bordered bg-gray-800 border-gray-600 text-white focus:border-blue-500 resize-none"
                placeholder="Instructions spéciales, commentaires..."
              ></textarea>
            </div>
          </div>

          <!-- Right column - Order status & payment -->
          <div class="space-y-4">
            <h4 class="text-lg font-semibold text-white mb-4">Statut et paiement</h4>
            
            <!-- Order status -->
            <div class="form-control">
              <label class="label">
                <span class="label-text text-gray-300">Statut de la commande</span>
              </label>
              <select 
                v-model="form.status"
                class="select select-bordered bg-gray-800 border-gray-600 text-white focus:border-blue-500"
                :disabled="!canChangeStatus"
              >
                <option value="pending">En attente</option>
                <option value="confirmed">Confirmée</option>
                <option value="processing">En préparation</option>
                <option value="shipped">Expédiée</option>
                <option value="delivered">Livrée</option>
                <option value="cancelled">Annulée</option>
                <option value="returned">Retournée</option>
              </select>
              <label v-if="!canChangeStatus" class="label">
                <span class="label-text-alt text-gray-500">
                  Le statut ne peut plus être modifié
                </span>
              </label>
            </div>

            <!-- Payment status -->
            <div class="form-control">
              <label class="label">
                <span class="label-text text-gray-300">Statut de paiement</span>
              </label>
              <select 
                v-model="form.payment_status"
                class="select select-bordered bg-gray-800 border-gray-600 text-white focus:border-blue-500"
              >
                <option value="pending">En attente</option>
                <option value="paid">Payé</option>
                <option value="failed">Échoué</option>
                <option value="refunded">Remboursé</option>
                <option value="partial">Partiel</option>
              </select>
            </div>

            <!-- Payment method -->
            <div class="form-control">
              <label class="label">
                <span class="label-text text-gray-300">Méthode de paiement</span>
              </label>
              <select 
                v-model="form.payment_method"
                class="select select-bordered bg-gray-800 border-gray-600 text-white focus:border-blue-500"
              >
                <option value="">Sélectionner</option>
                <option value="credit_card">Carte de crédit</option>
                <option value="debit_card">Carte de débit</option>
                <option value="paypal">PayPal</option>
                <option value="bank_transfer">Virement bancaire</option>
                <option value="check">Chèque</option>
                <option value="cash">Espèces</option>
                <option value="store_credit">Crédit magasin</option>
              </select>
            </div>

            <!-- Tracking information -->
            <div v-if="form.status === 'shipped'" class="space-y-3">
              <div class="form-control">
                <label class="label">
                  <span class="label-text text-gray-300">Numéro de suivi</span>
                </label>
                <input
                  v-model="form.tracking_number"
                  type="text"
                  class="input input-bordered bg-gray-800 border-gray-600 text-white focus:border-blue-500"
                  placeholder="Numéro de suivi du colis"
                />
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text text-gray-300">Date de livraison estimée</span>
                </label>
                <input
                  v-model="form.estimated_delivery"
                  type="date"
                  :min="today"
                  class="input input-bordered bg-gray-800 border-gray-600 text-white focus:border-blue-500"
                />
              </div>
            </div>

            <!-- Order amounts -->
            <div class="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <h5 class="font-medium text-white mb-3">Montants</h5>
              <div class="space-y-3">
                <div class="form-control">
                  <label class="label">
                    <span class="label-text text-gray-300">Livraison</span>
                  </label>
                  <div class="relative">
                    <input
                      v-model.number="form.shipping_amount"
                      type="number"
                      step="0.01"
                      min="0"
                      class="input input-bordered bg-gray-700 border-gray-600 text-white focus:border-blue-500 pr-12"
                    />
                    <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">€</span>
                  </div>
                </div>

                <div class="form-control">
                  <label class="label">
                    <span class="label-text text-gray-300">TVA</span>
                  </label>
                  <div class="relative">
                    <input
                      v-model.number="form.tax_amount"
                      type="number"
                      step="0.01"
                      min="0"
                      class="input input-bordered bg-gray-700 border-gray-600 text-white focus:border-blue-500 pr-12"
                    />
                    <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">€</span>
                  </div>
                </div>

                <div class="flex justify-between items-center pt-3 border-t border-gray-600">
                  <span class="text-gray-400">Total calculé:</span>
                  <span class="text-white font-semibold">{{ formatCurrency(calculatedTotal) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Order items -->
        <div class="mt-8">
          <div class="flex items-center justify-between mb-4">
            <h4 class="text-lg font-semibold text-white">Articles de la commande</h4>
            <button
              type="button"
              @click="addOrderItem"
              class="btn btn-sm bg-blue-600 hover:bg-blue-700 text-white border-none"
              :disabled="!canEditItems"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Ajouter un article
            </button>
          </div>

          <div class="bg-gray-800 rounded-lg border border-gray-700">
            <div class="divide-y divide-gray-700">
              <div 
                v-for="(item, index) in form.items"
                :key="item.id || index"
                class="p-4"
              >
                <div class="flex items-start gap-4">
                  <div class="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
                    <!-- Product name -->
                    <div class="md:col-span-2">
                      <label class="label">
                        <span class="label-text text-gray-300">Produit</span>
                      </label>
                      <input
                        v-model="item.product_name"
                        type="text"
                        required
                        class="input input-sm input-bordered bg-gray-700 border-gray-600 text-white focus:border-blue-500 w-full"
                        :disabled="!canEditItems"
                      />
                    </div>

                    <!-- Quantity -->
                    <div>
                      <label class="label">
                        <span class="label-text text-gray-300">Quantité</span>
                      </label>
                      <input
                        v-model.number="item.quantity"
                        @input="updateItemTotal(index)"
                        type="number"
                        min="1"
                        required
                        class="input input-sm input-bordered bg-gray-700 border-gray-600 text-white focus:border-blue-500 w-full"
                        :disabled="!canEditItems"
                      />
                    </div>

                    <!-- Unit price -->
                    <div>
                      <label class="label">
                        <span class="label-text text-gray-300">Prix unitaire</span>
                      </label>
                      <div class="relative">
                        <input
                          v-model.number="item.unit_price"
                          @input="updateItemTotal(index)"
                          type="number"
                          step="0.01"
                          min="0"
                          required
                          class="input input-sm input-bordered bg-gray-700 border-gray-600 text-white focus:border-blue-500 w-full pr-8"
                          :disabled="!canEditItems"
                        />
                        <span class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs">€</span>
                      </div>
                    </div>
                  </div>

                  <!-- Total and actions -->
                  <div class="flex flex-col items-end gap-2">
                    <div class="text-right">
                      <div class="text-xs text-gray-400">Total</div>
                      <div class="text-white font-medium">
                        {{ formatCurrency(item.total_price || 0) }}
                      </div>
                    </div>
                    
                    <button
                      v-if="canEditItems && form.items.length > 1"
                      type="button"
                      @click="removeOrderItem(index)"
                      class="btn btn-xs btn-circle bg-red-600 hover:bg-red-700 text-white border-none"
                    >
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="!canEditItems" class="text-sm text-gray-500 mt-2">
            Les articles ne peuvent plus être modifiés après expédition
          </div>
        </div>

        <!-- Action buttons -->
        <div class="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-700">
          <button 
            type="button"
            @click="emit('close')"
            class="btn bg-gray-600 hover:bg-gray-700 text-white border-none"
          >
            Annuler
          </button>
          <button 
            type="submit"
            :disabled="!canSubmit || isUpdating"
            class="btn bg-blue-600 hover:bg-blue-700 text-white border-none"
          >
            <span v-if="isUpdating" class="loading loading-spinner loading-sm mr-2"></span>
            {{ isUpdating ? 'Mise à jour...' : 'Enregistrer les modifications' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useOrderStore } from '../stores/orderStore'
import type { Order, OrderStatus, PaymentStatus, OrderItem } from '../types'

// Props & Emits
interface Props {
  order: Order
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  updated: [order: Order]
}>()

// Composables
const orderStore = useOrderStore()

// État local
const isUpdating = ref(false)

// Date d'aujourd'hui pour la validation
const today = new Date().toISOString().split('T')[0]

// Formulaire réactif initialisé avec les données de la commande
const form = reactive({
  customer_name: props.order.customer_name,
  customer_email: props.order.customer_email,
  customer_phone: props.order.customer_phone || '',
  customer_address: props.order.customer_address,
  notes: props.order.notes || '',
  status: props.order.status,
  payment_status: props.order.payment_status,
  payment_method: props.order.payment_method || '',
  tracking_number: props.order.tracking_number || '',
  estimated_delivery: props.order.estimated_delivery ? 
    new Date(props.order.estimated_delivery).toISOString().split('T')[0] : '',
  shipping_amount: props.order.shipping_amount,
  tax_amount: props.order.tax_amount,
  items: [...props.order.items] // Copie des articles
})

// Computed
const canSubmit = computed(() => {
  return form.customer_name.trim() !== '' &&
         form.customer_email.trim() !== '' &&
         form.customer_address.trim() !== '' &&
         form.items.length > 0 &&
         form.items.every(item => 
           item.product_name.trim() !== '' &&
           item.quantity > 0 &&
           item.unit_price > 0
         )
})

const canChangeStatus = computed(() => {
  // Ne peut pas changer le statut si la commande est livrée, annulée ou retournée
  return !['delivered', 'cancelled', 'returned'].includes(props.order.status)
})

const canEditItems = computed(() => {
  // Ne peut pas modifier les articles après expédition
  return !['shipped', 'delivered', 'cancelled', 'returned'].includes(form.status)
})

const itemsSubtotal = computed(() => {
  return form.items.reduce((sum, item) => sum + (item.total_price || 0), 0)
})

const calculatedTotal = computed(() => {
  return itemsSubtotal.value + form.shipping_amount + form.tax_amount
})

// Méthodes
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

function updateItemTotal(index: number) {
  const item = form.items[index]
  item.total_price = item.quantity * item.unit_price
}

function addOrderItem() {
  if (!canEditItems.value) return
  
  form.items.push({
    id: `temp-${Date.now()}`,
    order_id: props.order.id,
    product_name: '',
    product_sku: '',
    quantity: 1,
    unit_price: 0,
    total_price: 0,
    product_image: ''
  })
}

function removeOrderItem(index: number) {
  if (!canEditItems.value || form.items.length <= 1) return
  form.items.splice(index, 1)
}

async function updateOrder() {
  if (!canSubmit.value) return

  isUpdating.value = true

  try {
    const updateData = {
      customer_name: form.customer_name,
      customer_email: form.customer_email,
      customer_phone: form.customer_phone || undefined,
      customer_address: form.customer_address,
      notes: form.notes || undefined,
      status: form.status,
      payment_status: form.payment_status,
      payment_method: form.payment_method || undefined,
      tracking_number: form.tracking_number || undefined,
      estimated_delivery: form.estimated_delivery || undefined,
      shipping_amount: form.shipping_amount,
      tax_amount: form.tax_amount,
      total_amount: calculatedTotal.value,
      items: canEditItems.value ? form.items.map(item => ({
        id: item.id?.startsWith('temp-') ? undefined : item.id,
        product_name: item.product_name,
        product_sku: item.product_sku,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price,
        product_image: item.product_image
      })) : undefined
    }

    // Nettoyer les champs undefined
    Object.keys(updateData).forEach(key => {
      if (updateData[key as keyof typeof updateData] === undefined) {
        delete updateData[key as keyof typeof updateData]
      }
    })

    const updatedOrder = await orderStore.updateOrder(props.order.id, updateData)
    emit('updated', updatedOrder)
    emit('close')
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la commande:', error)
  } finally {
    isUpdating.value = false
  }
}

// Mettre à jour les totaux initiaux
form.items.forEach((_, index) => updateItemTotal(index))
</script>
