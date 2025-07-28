<template>
  <div class="modal modal-open">
    <div class="modal-box max-w-2xl bg-gray-900 border border-gray-700">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-2xl font-bold text-white">Expédier la commande</h3>
        <button 
          @click="emit('close')"
          class="btn btn-sm btn-circle bg-gray-700 hover:bg-gray-600 text-white border-none"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
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
          <div class="col-span-2">
            <span class="text-gray-400">Adresse de livraison:</span>
            <div class="text-white whitespace-pre-line">{{ order.customer_address }}</div>
          </div>
        </div>
      </div>

      <form @submit.prevent="shipOrder">
        <!-- Carrier selection -->
        <div class="form-control mb-4">
          <label class="label">
            <span class="label-text text-gray-300">Transporteur *</span>
          </label>
          <select 
            v-model="form.carrier"
            required
            class="select select-bordered bg-gray-800 border-gray-600 text-white focus:border-blue-500"
          >
            <option value="" disabled>Choisir un transporteur</option>
            <option value="colissimo">Colissimo</option>
            <option value="chronopost">Chronopost</option>
            <option value="ups">UPS</option>
            <option value="dhl">DHL</option>
            <option value="fedex">FedEx</option>
            <option value="gls">GLS</option>
            <option value="dpd">DPD</option>
            <option value="mondial-relay">Mondial Relay</option>
            <option value="other">Autre</option>
          </select>
        </div>

        <!-- Custom carrier name -->
        <div v-if="form.carrier === 'other'" class="form-control mb-4">
          <label class="label">
            <span class="label-text text-gray-300">Nom du transporteur *</span>
          </label>
          <input
            v-model="form.custom_carrier"
            type="text"
            required
            class="input input-bordered bg-gray-800 border-gray-600 text-white focus:border-blue-500"
            placeholder="Nom du transporteur personnalisé"
          />
        </div>

        <!-- Tracking number -->
        <div class="form-control mb-4">
          <label class="label">
            <span class="label-text text-gray-300">Numéro de suivi *</span>
          </label>
          <input
            v-model="form.tracking_number"
            type="text"
            required
            class="input input-bordered bg-gray-800 border-gray-600 text-white focus:border-blue-500"
            placeholder="Numéro de suivi du colis"
          />
          <label class="label">
            <span class="label-text-alt text-gray-500">Ce numéro permettra au client de suivre sa commande</span>
          </label>
        </div>

        <!-- Tracking URL -->
        <div class="form-control mb-4">
          <label class="label">
            <span class="label-text text-gray-300">URL de suivi</span>
          </label>
          <input
            v-model="form.tracking_url"
            type="url"
            class="input input-bordered bg-gray-800 border-gray-600 text-white focus:border-blue-500"
            placeholder="https://..."
          />
          <label class="label">
            <span class="label-text-alt text-gray-500">Lien direct vers le suivi du transporteur (optionnel)</span>
          </label>
        </div>

        <!-- Estimated delivery date -->
        <div class="form-control mb-4">
          <label class="label">
            <span class="label-text text-gray-300">Date de livraison estimée</span>
          </label>
          <input
            v-model="form.estimated_delivery"
            type="date"
            :min="today"
            class="input input-bordered bg-gray-800 border-gray-600 text-white focus:border-blue-500"
          />
          <label class="label">
            <span class="label-text-alt text-gray-500">Date estimée d'arrivée chez le client</span>
          </label>
        </div>

        <!-- Shipping method -->
        <div class="form-control mb-4">
          <label class="label">
            <span class="label-text text-gray-300">Mode d'expédition</span>
          </label>
          <select 
            v-model="form.shipping_method"
            class="select select-bordered bg-gray-800 border-gray-600 text-white focus:border-blue-500"
          >
            <option value="">Sélectionner un mode</option>
            <option value="standard">Standard</option>
            <option value="express">Express</option>
            <option value="priority">Prioritaire</option>
            <option value="same-day">Jour même</option>
            <option value="pickup">Retrait en point relais</option>
          </select>
        </div>

        <!-- Shipping notes -->
        <div class="form-control mb-6">
          <label class="label">
            <span class="label-text text-gray-300">Notes d'expédition</span>
          </label>
          <textarea
            v-model="form.shipping_notes"
            rows="3"
            class="textarea textarea-bordered bg-gray-800 border-gray-600 text-white focus:border-blue-500 resize-none"
            placeholder="Instructions spéciales, commentaires sur l'expédition..."
          ></textarea>
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
                Envoyer automatiquement un email avec les informations de suivi
              </div>
            </div>
          </label>
        </div>

        <!-- Carrier information based on selection -->
        <div v-if="carrierInfo" class="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
          <div class="flex items-start gap-3">
            <svg class="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h5 class="text-blue-400 font-medium mb-1">{{ carrierInfo.name }}</h5>
              <p class="text-gray-300 text-sm">{{ carrierInfo.description }}</p>
              <div v-if="carrierInfo.trackingInfo" class="mt-2 text-xs text-gray-400">
                <p>{{ carrierInfo.trackingInfo }}</p>
              </div>
            </div>
          </div>
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
            :disabled="!canSubmit || isShipping"
            class="btn bg-orange-600 hover:bg-orange-700 text-white border-none"
          >
            <span v-if="isShipping" class="loading loading-spinner loading-sm mr-2"></span>
            {{ isShipping ? 'Expédition...' : 'Confirmer l\'expédition' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useOrderStore } from '../stores/orderStore'
import type { Order, OrderStatus } from '../types'

// Props & Emits
interface Props {
  order: Order
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  shipped: [order: Order]
}>()

// Composables
const orderStore = useOrderStore()

// État local
const isShipping = ref(false)

// Date d'aujourd'hui pour la validation
const today = new Date().toISOString().split('T')[0]

// Formulaire réactif
const form = reactive({
  carrier: '',
  custom_carrier: '',
  tracking_number: '',
  tracking_url: '',
  estimated_delivery: '',
  shipping_method: '',
  shipping_notes: '',
  notify_customer: true
})

// Computed
const canSubmit = computed(() => {
  const hasCarrier = form.carrier !== '' && (form.carrier !== 'other' || form.custom_carrier.trim() !== '')
  const hasTrackingNumber = form.tracking_number.trim() !== ''
  return hasCarrier && hasTrackingNumber
})

const carrierInfo = computed(() => {
  const carriers: Record<string, { name: string; description: string; trackingInfo?: string }> = {
    colissimo: {
      name: 'Colissimo',
      description: 'Service postal français pour les colis et courriers.',
      trackingInfo: 'Le numéro de suivi commence généralement par 2 lettres suivies de chiffres (ex: 3S12345678912)'
    },
    chronopost: {
      name: 'Chronopost',
      description: 'Service express de La Poste pour les livraisons rapides.',
      trackingInfo: 'Format: 2 lettres + 9 chiffres + 2 lettres (ex: EV123456789FR)'
    },
    ups: {
      name: 'UPS',
      description: 'United Parcel Service - Transporteur international.',
      trackingInfo: 'Format: 1Z + 6 caractères + 2 chiffres + 6 chiffres'
    },
    dhl: {
      name: 'DHL',
      description: 'Deutsche Post DHL Group - Express international.',
      trackingInfo: 'Format: 10 ou 11 chiffres'
    },
    fedex: {
      name: 'FedEx',
      description: 'Federal Express - Service de livraison express.',
      trackingInfo: 'Format: 12-14 chiffres'
    },
    gls: {
      name: 'GLS',
      description: 'General Logistics Systems - Transporteur européen.',
      trackingInfo: 'Format variable selon le pays'
    },
    dpd: {
      name: 'DPD',
      description: 'Dynamic Parcel Distribution - Livraison de colis.',
      trackingInfo: 'Format: 14 chiffres'
    },
    'mondial-relay': {
      name: 'Mondial Relay',
      description: 'Réseau de points relais pour la livraison de colis.',
      trackingInfo: 'Format: 8 chiffres'
    }
  }

  return form.carrier ? carriers[form.carrier] : null
})

// Méthodes
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
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

async function shipOrder() {
  if (!canSubmit.value) return

  isShipping.value = true

  try {
    const shippingData = {
      status: 'shipped' as OrderStatus,
      tracking_number: form.tracking_number,
      tracking_url: form.tracking_url || undefined,
      estimated_delivery: form.estimated_delivery || undefined,
      shipping_notes: form.shipping_notes || undefined,
      carrier: form.carrier === 'other' ? form.custom_carrier : form.carrier,
      shipping_method: form.shipping_method || undefined,
      shipped_at: new Date().toISOString()
    }

    const updatedOrder = await orderStore.updateOrder(props.order.id, shippingData)

    // Optionnel : envoyer notification email au client
    if (form.notify_customer) {
      try {
        await orderStore.sendShippingNotification(props.order.id, {
          tracking_number: form.tracking_number,
          carrier: shippingData.carrier,
          tracking_url: form.tracking_url,
          estimated_delivery: form.estimated_delivery
        })
      } catch (emailError) {
        console.warn('Erreur lors de l\'envoi de l\'email de notification:', emailError)
        // Ne pas faire échouer l'expédition si l'email échoue
      }
    }

    emit('shipped', updatedOrder)
  } catch (error) {
    console.error('Erreur lors de l\'expédition de la commande:', error)
  } finally {
    isShipping.value = false
  }
}
</script>
