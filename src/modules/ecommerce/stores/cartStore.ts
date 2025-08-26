import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { CartService } from '../services/cartService'
import type { AddToCartInput, CartItem, UpdateCartItemRequest } from '../types'

export const useCartStore = defineStore('cart', () => {
  // State
  const cartItems = ref<CartItem[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Services
  const cartService = new CartService()

  // Getters
  const totalItems = computed(() => 
    cartItems.value.reduce((total: number, item: CartItem) => total + item.quantity, 0)
  )
  const totalPrice = computed(() => 
    cartItems.value.reduce((total: number, item: CartItem) => total + (item.product.price * item.quantity), 0)
  )
  const isEmpty = computed(() => cartItems.value.length === 0)

  // Actions
  async function fetchCart() {
    loading.value = true
    error.value = null

    try {
      cartItems.value = await cartService.getCart()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors du chargement du panier'
      console.error('Erreur fetchCart:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function addToCart(input: AddToCartInput) {
    loading.value = true
    error.value = null

    try {
      const newItem = await cartService.addProductToCart(input)
      
      // Vérifier si le produit existe déjà dans le panier
      const existingItemIndex = cartItems.value.findIndex((item: CartItem) => item.product.id === input.product_id)
      
      if (existingItemIndex !== -1) {
        // Mettre à jour l'item existant
        cartItems.value[existingItemIndex] = newItem
      } else {
        // Ajouter le nouvel item
        cartItems.value.push(newItem)
      }
      
      return newItem
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors de l\'ajout au panier'
      console.error('Erreur addToCart:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateCartItem(input: UpdateCartItemRequest) {
    loading.value = true
    error.value = null

    try {
      const updatedItem = await cartService.updateCartItem(input)
      
      // Mettre à jour le panier local
      const itemIndex = cartItems.value.findIndex((item: CartItem) => item.id === input.id)
      if (itemIndex !== -1) {
        cartItems.value[itemIndex] = updatedItem
      }
      
      return updatedItem
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors de la mise à jour'
      console.error('Erreur updateCartItem:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function removeFromCart(itemId: string) {
    loading.value = true
    error.value = null

    try {
      console.log('Tentative de suppression de l\'item:', itemId)
      console.log('Items actuellement dans le panier:', cartItems.value.map(item => ({ id: item.id, productId: item.product.id, productName: item.product.name })))
      
      // Vérifier que l'item existe avant de tenter la suppression
      const item = cartItems.value.find((cartItem: CartItem) => cartItem.id === itemId)
      if (!item) {
        throw new Error(`Item ${itemId} non trouvé dans le panier`)
      }

      await cartService.removeFromCart(itemId)
      
      // Supprimer l'item du panier local
      cartItems.value = cartItems.value.filter((cartItem: CartItem) => cartItem.id !== itemId)
      
      console.log('Item supprimé avec succès. Panier mis à jour:', cartItems.value.length, 'items restants')
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors de la suppression'
      console.error('Erreur removeFromCart:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function clearCart() {
    loading.value = true
    error.value = null

    try {
      await cartService.clearCart()
      cartItems.value = []
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors de la suppression du panier'
      console.error('Erreur clearCart:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function checkout() {
    loading.value = true
    error.value = null

    try {
      const order = await cartService.checkout()
      // Vider le panier après une commande réussie
      cartItems.value = []
      return order
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors de la création de la commande'
      console.error('Erreur checkout:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    // État
    cartItems,
    loading,
    error,
    
    // Getters
    totalItems,
    totalPrice,
    isEmpty,
    
    // Actions
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    checkout,
    clearError
  }
})
