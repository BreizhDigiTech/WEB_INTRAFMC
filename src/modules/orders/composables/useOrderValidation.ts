import { computed } from 'vue'
import type { Order, OrderStatus } from '../types'
import { getNextAllowedStatuses, isStatusTransitionAllowed } from '../utils/formatters'

/**
 * Composable pour la validation et les règles métier des commandes
 */
export function useOrderValidation() {
  
  // Validation des transitions de statut
  function canTransitionTo(currentStatus: OrderStatus, newStatus: OrderStatus): boolean {
    return isStatusTransitionAllowed(currentStatus, newStatus)
  }

  // Obtenir les statuts suivants possibles
  function getAvailableStatuses(currentStatus: OrderStatus): OrderStatus[] {
    return getNextAllowedStatuses(currentStatus)
  }

  // Validation d'une commande complète
  function validateOrder(order: Order): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    // Vérifications de base
    if (!order.id) {
      errors.push('ID de commande manquant')
    }

    if (!order.user_id) {
      errors.push('Utilisateur manquant')
    }

    if (order.total <= 0) {
      errors.push('Le montant total doit être supérieur à 0')
    }

    if (!order.status) {
      errors.push('Statut manquant')
    }

    // Vérifications avancées
    if (order.products && order.products.length === 0) {
      errors.push('La commande doit contenir au moins un produit')
    }

    // Vérification de la cohérence des prix
    if (order.products && order.products.length > 0) {
      const calculatedTotal = order.products.reduce((sum, product) => {
        return sum + (product.pivot.quantity * product.pivot.unit_price)
      }, 0)

      // Tolérance de 0.01 pour les erreurs d'arrondi
      if (Math.abs(calculatedTotal - order.total) > 0.01) {
        errors.push('Le total calculé ne correspond pas au total de la commande')
      }
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }

  // Validation de la génération de facture
  function canGenerateInvoice(order: Order): { canGenerate: boolean; reason?: string } {
    if (order.status !== 'validated') {
      return {
        canGenerate: false,
        reason: 'Seules les commandes validées peuvent générer une facture'
      }
    }

    if (!order.products || order.products.length === 0) {
      return {
        canGenerate: false,
        reason: 'La commande doit contenir des produits pour générer une facture'
      }
    }

    if (order.total <= 0) {
      return {
        canGenerate: false,
        reason: 'Le montant de la commande doit être supérieur à 0'
      }
    }

    return { canGenerate: true }
  }

  // Validation de l'annulation d'une commande
  function canCancelOrder(order: Order): { canCancel: boolean; reason?: string } {
    if (order.status === 'cancelled') {
      return {
        canCancel: false,
        reason: 'La commande est déjà annulée'
      }
    }

    if (order.status === 'validated') {
      return {
        canCancel: false,
        reason: 'Une commande validée ne peut pas être annulée'
      }
    }

    return { canCancel: true }
  }

  // Validation des filtres
  function validateFilters(filters: any): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    // Validation des dates
    if (filters.date_from && filters.date_to) {
      const fromDate = new Date(filters.date_from)
      const toDate = new Date(filters.date_to)

      if (fromDate > toDate) {
        errors.push('La date de début doit être antérieure à la date de fin')
      }

      // Limite de 1 an pour éviter les requêtes trop lourdes
      const oneYearAgo = new Date()
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)

      if (fromDate < oneYearAgo) {
        errors.push('La recherche ne peut pas remonter à plus d\'un an')
      }
    }

    // Validation des montants
    if (filters.min_amount && filters.max_amount) {
      if (filters.min_amount > filters.max_amount) {
        errors.push('Le montant minimum doit être inférieur au montant maximum')
      }
    }

    if (filters.min_amount && filters.min_amount < 0) {
      errors.push('Le montant minimum ne peut pas être négatif')
    }

    if (filters.max_amount && filters.max_amount < 0) {
      errors.push('Le montant maximum ne peut pas être négatif')
    }

    // Validation de la recherche utilisateur
    if (filters.user_search && filters.user_search.length < 2) {
      errors.push('La recherche utilisateur doit contenir au moins 2 caractères')
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }

  // Computed pour les règles de gestion
  const businessRules = computed(() => ({
    // Montant minimum d'une commande
    minimumOrderAmount: 0.01,
    
    // Nombre maximum de produits par commande
    maxProductsPerOrder: 100,
    
    // Délai maximum pour annuler une commande (en heures)
    cancellationDeadlineHours: 24,
    
    // Statuts qui permettent la modification
    editableStatuses: ['pending'] as OrderStatus[],
    
    // Statuts qui permettent la facturation
    invoiceableStatuses: ['validated'] as OrderStatus[],
    
    // Statuts finaux (non modifiables)
    finalStatuses: ['validated', 'cancelled'] as OrderStatus[]
  }))

  return {
    // Validation des transitions
    canTransitionTo,
    getAvailableStatuses,

    // Validation complète
    validateOrder,
    validateFilters,

    // Validation des actions
    canGenerateInvoice,
    canCancelOrder,

    // Règles métier
    businessRules
  }
}
