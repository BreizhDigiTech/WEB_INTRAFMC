// Store du panier

import { defineStore } from 'pinia'
import { graphqlService } from '@/shared/services/graphql'
import type { CartState, CartItem, AddToCartInput } from '@/shared/types/app'

export const useCartStore = defineStore('cart', {
    state: (): CartState => ({
        items: [],
        total: 0,
        itemCount: 0,
        isOpen: false,
        isLoading: false
    }),

    getters: {
        isEmpty: (state) => state.items.length === 0,
        totalFormatted: (state) => `${state.total.toFixed(2)} €`,

        getItemQuantity: (state) => (productId: string) => {
            const item = state.items.find(item => item.product_id === productId)
            return item?.quantity || 0
        }
    },

    actions: {
        // Chargement du panier
        async fetchCart() {
            this.isLoading = true

            try {
                const response: { myCart: CartItem[] } = await graphqlService.getCart()
                this.items = response.myCart || []
                await this.updateTotals()
            } catch (error: any) {
                console.error('Erreur lors du chargement du panier:', error)
                this.items = []
                this.total = 0
                this.itemCount = 0
            } finally {
                this.isLoading = false
            }
        },

        // Mise à jour des totaux
        async updateTotals() {
            try {
                const response: { cartTotal: { total: number; itemCount: number } } =
                    await graphqlService.getCartTotal()

                this.total = response.cartTotal.total
                this.itemCount = response.cartTotal.itemCount
            } catch (error) {
                // Calcul local en cas d'erreur
                this.total = this.items.reduce((sum, item) =>
                    sum + (item.product.price * item.quantity), 0)
                this.itemCount = this.items.reduce((sum, item) => sum + item.quantity, 0)
            }
        },

        // Ajout au panier
        async addToCart(input: AddToCartInput) {
            this.isLoading = true

            try {
                const response: { addToCart: CartItem } = await graphqlService.addToCart(
                    input.product_id,
                    input.quantity
                )

                // Vérifier si le produit existe déjà dans le panier
                const existingItemIndex = this.items.findIndex(
                    item => item.product_id === input.product_id
                )

                if (existingItemIndex >= 0) {
                    // Mettre à jour la quantité
                    this.items[existingItemIndex] = response.addToCart
                } else {
                    // Ajouter le nouvel item
                    this.items.push(response.addToCart)
                }

                await this.updateTotals()

                return { success: true }
            } catch (error: any) {
                console.error('Erreur lors de l\'ajout au panier:', error)
                return { success: false, error: error.message }
            } finally {
                this.isLoading = false
            }
        },

        // Suppression d'un item du panier
        async removeFromCart(itemId: string) {
            this.isLoading = true

            try {
                // TODO: Implémenter la mutation removeFromCart
                // await graphqlService.removeFromCart(itemId)

                // Pour l'instant, suppression locale
                this.items = this.items.filter(item => item.id !== itemId)
                await this.updateTotals()

                return { success: true }
            } catch (error: any) {
                console.error('Erreur lors de la suppression:', error)
                return { success: false, error: error.message }
            } finally {
                this.isLoading = false
            }
        },

        // Mise à jour de la quantité
        async updateQuantity(itemId: string, quantity: number) {
            if (quantity <= 0) {
                return this.removeFromCart(itemId)
            }

            this.isLoading = true

            try {
                // TODO: Implémenter la mutation updateCartQuantity
                // await graphqlService.updateCartQuantity(itemId, quantity)

                // Pour l'instant, mise à jour locale
                const item = this.items.find(item => item.id === itemId)
                if (item) {
                    item.quantity = quantity
                    await this.updateTotals()
                }

                return { success: true }
            } catch (error: any) {
                console.error('Erreur lors de la mise à jour:', error)
                return { success: false, error: error.message }
            } finally {
                this.isLoading = false
            }
        },

        // Vider le panier
        async clearCart() {
            this.isLoading = true

            try {
                // TODO: Implémenter la mutation clearCart
                // await graphqlService.clearCart()

                this.items = []
                this.total = 0
                this.itemCount = 0

                return { success: true }
            } catch (error: any) {
                console.error('Erreur lors du vidage du panier:', error)
                return { success: false, error: error.message }
            } finally {
                this.isLoading = false
            }
        },

        // Finaliser la commande
        async checkout() {
            this.isLoading = true

            try {
                const response = await graphqlService.checkout()

                // Vider le panier après commande réussie
                this.items = []
                this.total = 0
                this.itemCount = 0

                return { success: true, order: response.checkout }
            } catch (error: any) {
                console.error('Erreur lors de la commande:', error)
                return { success: false, error: error.message }
            } finally {
                this.isLoading = false
            }
        },

        // Contrôle de l'affichage du panier
        openCart() {
            this.isOpen = true
        },

        closeCart() {
            this.isOpen = false
        },

        toggleCart() {
            this.isOpen = !this.isOpen
        }
    }
})
