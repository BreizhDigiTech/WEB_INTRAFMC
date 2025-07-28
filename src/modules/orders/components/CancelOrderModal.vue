<template>
  <div class="modal modal-open">
    <div class="modal-box max-w-lg bg-gray-900 border border-gray-700">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-2xl font-bold text-white">Annuler la commande</h3>
        <button 
          @click="emit('close')"
          class="btn btn-sm btn-circle bg-gray-700 hover:bg-gray-600 text-white border-none"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Warning message -->
      <div class="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
        <div class="flex items-start gap-3">
          <svg class="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div>
            <h4 class="text-red-400 font-medium mb-1">Attention</h4>
            <p class="text-gray-300 text-sm">
              Cette action annulera définitivement la commande. 
              {{ order.payment_status === 'paid' ? 'Un remboursement devra être traité séparément.' : '' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Order summary -->
      <div class="bg-gray-800 rounded-lg p-4 mb-6 border border-gray-700">
        <div class="flex items-center justify-between mb-3">
          <h4 class="text-lg font-semibold text-white">Commande {{ order.order_number }}</h4>
          <span 
            class="badge px-3 py-1 rounded-full text-sm font-medium"
            :class="getStatusBadgeClass(order.status)"
          >
            {{ orderStore.getStatusLabel(order.status) }}
          </span>
        </div>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span class="text-gray-400">Client:</span>
            <div class="text-white">{{ order.customer_name }}</div>
          </div>
          <div>
            <span class="text-gray-400">Total:</span>
            <div class="text-white">{{ formatCurrency(order.total_amount) }}</div>
          </div>
          <div>
            <span class="text-gray-400">Statut paiement:</span>
            <div 
              class="text-sm font-medium"
              :class="getPaymentStatusColor(order.payment_status)"
            >
              {{ orderStore.getPaymentStatusLabel(order.payment_status) }}
            </div>
          </div>
          <div>
            <span class="text-gray-400">Date de création:</span>
            <div class="text-white">{{ formatDate(order.created_at) }}</div>
          </div>
        </div>
      </div>

      <form @submit.prevent="cancelOrder">
        <!-- Cancellation reason -->
        <div class="form-control mb-4">
          <label class="label">
            <span class="label-text text-gray-300">Motif d'annulation *</span>
          </label>
          <select 
            v-model="form.reason"
            required
            class="select select-bordered bg-gray-800 border-gray-600 text-white focus:border-red-500"
          >
            <option value="" disabled>Choisir un motif</option>
            <option value="customer-request">Demande du client</option>
            <option value="payment-failed">Échec du paiement</option>
            <option value="out-of-stock">Rupture de stock</option>
            <option value="fraud-suspected">Fraude suspectée</option>
            <option value="shipping-issue">Problème de livraison</option>
            <option value="duplicate-order">Commande en double</option>
            <option value="pricing-error">Erreur de prix</option>
            <option value="customer-unreachable">Client injoignable</option>
            <option value="business-decision">Décision commerciale</option>
            <option value="other">Autre</option>
          </select>
        </div>

        <!-- Custom reason -->
        <div v-if="form.reason === 'other'" class="form-control mb-4">
          <label class="label">
            <span class="label-text text-gray-300">Motif personnalisé *</span>
          </label>
          <input
            v-model="form.custom_reason"
            type="text"
            required
            class="input input-bordered bg-gray-800 border-gray-600 text-white focus:border-red-500"
            placeholder="Précisez le motif d'annulation"
          />
        </div>

        <!-- Additional notes -->
        <div class="form-control mb-4">
          <label class="label">
            <span class="label-text text-gray-300">Notes complémentaires</span>
          </label>
          <textarea
            v-model="form.notes"
            rows="3"
            class="textarea textarea-bordered bg-gray-800 border-gray-600 text-white focus:border-red-500 resize-none"
            placeholder="Détails supplémentaires sur l'annulation..."
          ></textarea>
        </div>

        <!-- Refund section for paid orders -->
        <div v-if="order.payment_status === 'paid'" class="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6">
          <div class="flex items-center gap-3 mb-3">
            <svg class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <h5 class="text-yellow-400 font-medium">Remboursement requis</h5>
          </div>
          <p class="text-gray-300 text-sm mb-3">
            Cette commande a été payée. Un remboursement devra être effectué.
          </p>
          
          <div class="form-control">
            <label class="cursor-pointer label justify-start gap-3">
              <input 
                v-model="form.process_refund"
                type="checkbox" 
                class="checkbox checkbox-warning" 
              />
              <div>
                <span class="label-text text-gray-300">Traiter le remboursement maintenant</span>
                <div class="label-text-alt text-gray-500">
                  Le remboursement de {{ formatCurrency(order.total_amount) }} sera initié automatiquement
                </div>
              </div>
            </label>
          </div>

          <div v-if="form.process_refund" class="mt-3">
            <div class="form-control">
              <label class="label">
                <span class="label-text text-gray-300">Montant à rembourser</span>
              </label>
              <div class="relative">
                <input
                  v-model.number="form.refund_amount"
                  type="number"
                  step="0.01"
                  :max="order.total_amount"
                  min="0"
                  class="input input-bordered bg-gray-800 border-gray-600 text-white focus:border-yellow-500 pr-12"
                />
                <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">€</span>
              </div>
              <label class="label">
                <span class="label-text-alt text-gray-500">
                  Maximum: {{ formatCurrency(order.total_amount) }}
                </span>
              </label>
            </div>
          </div>
        </div>

        <!-- Email notification -->
        <div class="form-control mb-6">
          <label class="cursor-pointer label justify-start gap-3">
            <input 
              v-model="form.notify_customer"
              type="checkbox" 
              class="checkbox checkbox-primary" 
            />
            <div>
              <span class="label-text text-gray-300">Notifier le client par email</span>
              <div class="label-text-alt text-gray-500">
                Envoyer un email d'information sur l'annulation
              </div>
            </div>
          </label>
        </div>

        <!-- Reason preview -->
        <div v-if="reasonText" class="bg-gray-800 rounded-lg p-3 mb-6 border border-gray-700">
          <div class="text-sm text-gray-400 mb-1">Aperçu du motif:</div>
          <div class="text-white">{{ reasonText }}</div>
        </div>

        <!-- Action buttons -->
        <div class="flex justify-end gap-3 pt-6 border-t border-gray-700">
          <button 
            type="button"
            @click="emit('close')"
            class="btn bg-gray-600 hover:bg-gray-700 text-white border-none"
          >
            Annuler
          </button>
          <button 
            type="submit"
            :disabled="!canSubmit || isCancelling"
            class="btn bg-red-600 hover:bg-red-700 text-white border-none"
          >
            <span v-if="isCancelling" class="loading loading-spinner loading-sm mr-2"></span>
            {{ isCancelling ? 'Annulation...' : 'Confirmer l\'annulation' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useOrderStore } from '../stores/orderStore'
import type { Order, OrderStatus, PaymentStatus } from '../types'

// Props & Emits
interface Props {
  order: Order
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  cancelled: [order: Order]
}>()

// Composables
const orderStore = useOrderStore()

// État local
const isCancelling = ref(false)

// Formulaire réactif
const form = reactive({
  reason: '',
  custom_reason: '',
  notes: '',
  process_refund: false,
  refund_amount: props.order.total_amount,
  notify_customer: true
})

// Computed
const canSubmit = computed(() => {
  const hasReason = form.reason !== '' && (form.reason !== 'other' || form.custom_reason.trim() !== '')
  return hasReason
})

const reasonText = computed(() => {
  const reasonLabels: Record<string, string> = {
    'customer-request': 'Demande du client',
    'payment-failed': 'Échec du paiement',
    'out-of-stock': 'Rupture de stock',
    'fraud-suspected': 'Fraude suspectée',
    'shipping-issue': 'Problème de livraison',
    'duplicate-order': 'Commande en double',
    'pricing-error': 'Erreur de prix',
    'customer-unreachable': 'Client injoignable',
    'business-decision': 'Décision commerciale',
    'other': form.custom_reason
  }

  return form.reason ? reasonLabels[form.reason] : ''
})

// Méthodes
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('fr-FR')
}

function getStatusBadgeClass(status: OrderStatus): string {
  const classes = {
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    confirmed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    processing: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    shipped: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    delivered: 'bg-green-500/20 text-green-400 border-green-500/30',
    cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
    returned: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
  }
  return classes[status] || ''
}

function getPaymentStatusColor(status: PaymentStatus): string {
  const colors: Record<PaymentStatus, string> = {
    pending: 'text-yellow-400',
    paid: 'text-green-400',
    failed: 'text-red-400',
    refunded: 'text-blue-400',
    partial: 'text-orange-400'
  }
  return colors[status]
}

async function cancelOrder() {
  if (!canSubmit.value) return

  isCancelling.value = true

  try {
    const cancellationData = {
      status: 'cancelled' as OrderStatus,
      cancellation_reason: form.reason === 'other' ? form.custom_reason : form.reason,
      notes: form.notes ? `${props.order.notes || ''}\n\nAnnulation: ${form.notes}`.trim() : props.order.notes,
      cancelled_at: new Date().toISOString()
    }

    // Traiter l'annulation
    const updatedOrder = await orderStore.updateOrder(props.order.id, cancellationData)

    // Traiter le remboursement si nécessaire
    if (form.process_refund && props.order.payment_status === 'paid') {
      try {
        await processRefund()
      } catch (refundError) {
        console.warn('Erreur lors du remboursement:', refundError)
        // Ne pas faire échouer l'annulation si le remboursement échoue
      }
    }

    // Envoyer notification au client si demandé
    if (form.notify_customer) {
      try {
        await sendCancellationNotification()
      } catch (emailError) {
        console.warn('Erreur lors de l\'envoi de l\'email de notification:', emailError)
        // Ne pas faire échouer l'annulation si l'email échoue
      }
    }

    emit('cancelled', updatedOrder)
  } catch (error) {
    console.error('Erreur lors de l\'annulation de la commande:', error)
  } finally {
    isCancelling.value = false
  }
}

async function processRefund() {
  // Simulation du traitement du remboursement
  // Dans un vrai système, ceci ferait appel à l'API de paiement
  console.log('Traitement du remboursement:', {
    orderId: props.order.id,
    amount: form.refund_amount,
    reason: reasonText.value
  })
  
  // Mettre à jour le statut de paiement
  await orderStore.updateOrder(props.order.id, {
    payment_status: form.refund_amount >= props.order.total_amount ? 'refunded' : 'partial'
  })
}

async function sendCancellationNotification() {
  // Simulation de l'envoi d'email de notification d'annulation
  console.log('Envoi notification d\'annulation:', {
    orderId: props.order.id,
    customerEmail: props.order.customer_email,
    reason: reasonText.value,
    refundAmount: form.process_refund ? form.refund_amount : null
  })
}
</script>
