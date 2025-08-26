import { computed } from 'vue'
import { useCartStore } from '../stores/cartStore'
import type { AddToCartInput, CartItem, UpdateCartItemRequest } from '../types'

/**
 * Composable pour la gestion du panier
 * Facilite l'utilisation du store panier dans les composants
 */
export function useCart() {
  const cartStore = useCartStore()

  // État réactif
  const cartItems = computed(() => cartStore.cartItems)
  const loading = computed(() => cartStore.loading)
  const error = computed(() => cartStore.error)

  // Getters calculés
  const totalItems = computed(() => cartStore.totalItems)
  const totalPrice = computed(() => cartStore.totalPrice)
  const isEmpty = computed(() => cartStore.isEmpty)

  // Actions
  const fetchCart = async () => {
    await cartStore.fetchCart()
  }

  const addToCart = async (productId: string, quantity = 1) => {
    const input: AddToCartInput = {
      product_id: productId,
      quantity
    }
    await cartStore.addToCart(input)
  }

  const updateCartItem = async (itemId: string, quantity: number) => {
    console.log('useCart updateCartItem called with:', { itemId, quantity })
    console.log('typeof itemId:', typeof itemId)
    console.log('itemId value:', itemId)
    
    const input: UpdateCartItemRequest = {
      id: itemId,
      quantity
    }
    
    console.log('useCart updateCartItem input:', input)
    console.log('input.id:', input.id)
    console.log('typeof input.id:', typeof input.id)
    await cartStore.updateCartItem(input)
  }

  const removeFromCart = async (itemId: string) => {
    await cartStore.removeFromCart(itemId)
  }

  const clearCart = async () => {
    await cartStore.clearCart()
  }

  const checkout = async () => {
    return await cartStore.checkout()
  }

  const clearError = () => {
    cartStore.clearError()
  }

  // Utilitaires
  const getItemQuantity = (productId: string) => {
    const item = cartItems.value.find((item: CartItem) => item.product.id === productId)
    return item?.quantity || 0
  }

  const isProductInCart = (productId: string) => {
    return cartItems.value.some((item: CartItem) => item.product.id === productId)
  }

  const getCartItemById = (itemId: string) => {
    return cartItems.value.find((item: CartItem) => item.id === itemId)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price)
  }

  const formatTotalPrice = computed(() => {
    return formatPrice(totalPrice.value)
  })

  // Validation des quantités
  const canIncreaseQuantity = (itemId: string, maxStock?: number) => {
    const item = getCartItemById(itemId)
    if (!item) return false
    
    if (maxStock) {
      return item.quantity < maxStock
    }
    
    return item.product.stock > item.quantity
  }

  const canDecreaseQuantity = (itemId: string) => {
    const item = getCartItemById(itemId)
    return item ? item.quantity > 1 : false
  }

  // Actions rapides
  const increaseQuantity = async (itemId: string) => {
    const item = getCartItemById(itemId)
    if (item && canIncreaseQuantity(itemId)) {
      await updateCartItem(itemId, item.quantity + 1)
    }
  }

  const decreaseQuantity = async (itemId: string) => {
    const item = getCartItemById(itemId)
    if (item && canDecreaseQuantity(itemId)) {
      await updateCartItem(itemId, item.quantity - 1)
    }
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
    formatTotalPrice,
    
    // Actions
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    checkout,
    clearError,
    
    // Utilitaires
    getItemQuantity,
    isProductInCart,
    getCartItemById,
    formatPrice,
    canIncreaseQuantity,
    canDecreaseQuantity,
    increaseQuantity,
    decreaseQuantity
  }
}
