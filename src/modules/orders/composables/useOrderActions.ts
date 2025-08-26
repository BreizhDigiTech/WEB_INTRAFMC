import { ref } from 'vue'
import { checkoutService } from '../services/checkoutService'
import { OrderService } from '../services/orderService'
import type { OrderStatus } from '../types'

/**
 * Composable pour les actions sur les commandes
 * Centralise la logique des actions et gère les états de chargement
 */
export function useOrderActions() {
  const orderService = new OrderService()
  
  // États de chargement
  const updateLoading = ref(false)
  const cancelLoading = ref(false)
  const invoiceLoading = ref(false)
  const statsLoading = ref(false)

  // Notifications
  const successMessage = ref('')
  const errorMessage = ref('')

  // Méthodes utilitaires pour les notifications
  function showSuccess(message: string) {
    successMessage.value = message
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  }

  function showError(message: string) {
    errorMessage.value = message
    setTimeout(() => {
      errorMessage.value = ''
    }, 5000)
  }

  // Actions sur les commandes
  async function updateOrderStatus(orderId: string, status: OrderStatus) {
    updateLoading.value = true
    try {
      await orderService.updateOrderStatus({ id: orderId, status })
      showSuccess(`Commande mise à jour vers "${status}"`)
      return true
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Erreur lors de la mise à jour')
      return false
    } finally {
      updateLoading.value = false
    }
  }

  async function validateOrder(orderId: string) {
    return updateOrderStatus(orderId, 'validated')
  }

  async function cancelOrder(orderId: string) {
    cancelLoading.value = true
    try {
      await checkoutService.cancelOrder(orderId)
      showSuccess('Commande annulée avec succès')
      return true
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Erreur lors de l\'annulation')
      return false
    } finally {
      cancelLoading.value = false
    }
  }

  async function generateInvoice(orderId: string) {
    invoiceLoading.value = true
    try {
      const result = await orderService.generateInvoice(orderId)
      showSuccess('Facture générée avec succès')
      return result
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Erreur lors de la génération de la facture')
      return null
    } finally {
      invoiceLoading.value = false
    }
  }

  async function getOrderStats(orderId: string) {
    statsLoading.value = true
    try {
      const stats = await checkoutService.getOrderStats(orderId)
      return stats
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Erreur lors du chargement des statistiques')
      return null
    } finally {
      statsLoading.value = false
    }
  }

  // Actions en lot (à implémenter si nécessaire)
  async function bulkUpdateStatus(orderIds: string[], status: OrderStatus) {
    updateLoading.value = true
    const results: { success: string[], failed: string[] } = { success: [], failed: [] }
    
    try {
      for (const orderId of orderIds) {
        try {
          await orderService.updateOrderStatus({ id: orderId, status })
          results.success.push(orderId)
        } catch (error) {
          results.failed.push(orderId)
        }
      }
      
      if (results.success.length > 0) {
        showSuccess(`${results.success.length} commande(s) mise(s) à jour`)
      }
      if (results.failed.length > 0) {
        showError(`${results.failed.length} commande(s) n'ont pas pu être mises à jour`)
      }
      
      return results
    } finally {
      updateLoading.value = false
    }
  }

  return {
    // États de chargement
    updateLoading,
    cancelLoading,
    invoiceLoading,
    statsLoading,

    // Messages
    successMessage,
    errorMessage,

    // Actions individuelles
    updateOrderStatus,
    validateOrder,
    cancelOrder,
    generateInvoice,
    getOrderStats,

    // Actions en lot
    bulkUpdateStatus,

    // Utilitaires
    showSuccess,
    showError
  }
}
