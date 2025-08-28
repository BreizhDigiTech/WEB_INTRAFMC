import { GraphQLService } from '@/shared/services/graphql'
import type {
    AddToCartInput,
    CartActionResponse,
    CartItem,
    CartSummary,
    CheckoutResponse,
    UpdateCartItemRequest
} from '../types'

export class CartService extends GraphQLService {
  /**
   * Récupère le contenu du panier
   */
  async getCart(): Promise<CartItem[]> {
    const query = `
      query GetMyCart {
        myCart {
          id
          quantity
          product {
            id
            name
            description
            price
            stock
            image_urls
            categories {
              id
              name
            }
          }
        }
      }
    `

    const response = await this.request(query)
    return response.myCart || []
  }

  /**
   * Récupère le total du panier
   */
  async getCartTotal(): Promise<number> {
    const query = `
      query GetCartTotal {
        cartTotal
      }
    `

    const response = await this.request(query)
    return response.cartTotal || 0
  }

  /**
   * Récupère le résumé complet du panier
   */
  async getCartSummary(): Promise<CartSummary> {
    const [items, total] = await Promise.all([
      this.getCart(),
      this.getCartTotal()
    ])

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

    return {
      items,
      totalItems: itemCount,
      totalPrice: total,
      totalAmount: total,
      totalWithShipping: total, // Pour l'instant sans frais de port
      itemCount
    }
  }

  /**
   * Ajoute un produit au panier
   */
  async addProductToCart(input: AddToCartInput): Promise<CartItem> {
    const mutation = `
      mutation AddToCart($input: AddToCartInput!) {
        addToCart(input: $input) {
          id
          quantity
          product {
            id
            name
            description
            price
            stock
            image_urls
            categories {
              id
              name
            }
          }
        }
      }
    `

    const variables = { input }
    const response = await this.request(mutation, variables)
    return response.addToCart
  }

  /**
   * Met à jour la quantité d'un article du panier
   */
  async updateCartItem(input: UpdateCartItemRequest): Promise<CartItem> {
    console.log('CartService updateCartItem input:', input)
    console.log('input.id:', input.id)
    console.log('typeof input.id:', typeof input.id)
    console.log('input.quantity:', input.quantity)
    
    const mutation = `
      mutation UpdateCartItem($id: ID!, $input: UpdateCartItemInput!) {
        updateCartItem(id: $id, input: $input) {
          id
          quantity
          product {
            id
            name
            price
            image_urls
          }
        }
      }
    `

    const variables = { 
      id: input.id,
      input: {
        quantity: input.quantity
      }
    }
    
    console.log('CartService updateCartItem variables:', variables)
    console.log('variables.id:', variables.id)
    console.log('typeof variables.id:', typeof variables.id)
    
    const response = await this.request(mutation, variables)
    return response.updateCartItem
  }

  /**
   * Supprime un produit du panier
   */
  async removeFromCart(productId: string): Promise<CartActionResponse> {
    const mutation = `
      mutation RemoveFromCart($id: ID!) {
        removeFromCart(id: $id) {
          success
          message
        }
      }
    `

    const variables = { id: productId }
    const response = await this.request(mutation, variables)
    return response.removeFromCart
  }

  /**
   * Vide complètement le panier
   */
  async clearCart(): Promise<CartActionResponse> {
    const mutation = `
      mutation ClearCart {
        clearCart {
          success
          message
        }
      }
    `

    const response = await this.request(mutation)
    return response.clearCart
  }

  /**
   * Finalise la commande (checkout)
   */
  async checkout(): Promise<CheckoutResponse> {
    const mutation = `
      mutation Checkout {
        checkout {
          id
          total
          status
          created_at
        }
      }
    `

    const response = await this.request(mutation)
    return response.checkout
  }

  /**
   * Méthodes utilitaires pour le formatage
   */
  formatPrice(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

  /**
   * Calcule le sous-total d'un article
   */
  calculateItemSubtotal(item: CartItem): number {
    return item.quantity * item.product.price
  }

  /**
   * Calcule le total du panier côté client
   */
  calculateCartTotal(items: CartItem[]): number {
    return items.reduce((total, item) => total + this.calculateItemSubtotal(item), 0)
  }

  /**
   * Vérifie si le panier est vide
   */
  isCartEmpty(items: CartItem[]): boolean {
    return items.length === 0
  }

  /**
   * Compte le nombre total d'articles
   */
  getTotalItemCount(items: CartItem[]): number {
    return items.reduce((count, item) => count + item.quantity, 0)
  }

  /**
   * Vérifie si un produit est déjà dans le panier
   */
  isProductInCart(items: CartItem[], productId: string): boolean {
    return items.some(item => item.product.id === productId)
  }

  /**
   * Récupère la quantité d'un produit dans le panier
   */
  getProductQuantityInCart(items: CartItem[], productId: string): number {
    const item = items.find(item => item.product.id === productId)
    return item ? item.quantity : 0
  }
}

// Instance exportée
export const cartService = new CartService()
