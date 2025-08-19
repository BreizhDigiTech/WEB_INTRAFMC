// Service GraphQL pour la gestion du panier
import { GraphQLService } from '@/shared/services/graphql'

export interface CartItem {
    id: string
    user_id: string
    product_id: string
    quantity: number
    product: {
        id: string
        name: string
        description: string
        price: number
        images?: string[]
        image_urls?: string[]
        image_metadata?: any
        stock: number
        analysis_file?: string
        analysis_file_url?: string
        analysis_file_original_name?: string
        analysis_file_size?: number
        analysis_file_mime_type?: string
        thc?: number
        cbd?: number
        categories?: Array<{
            id: string
            name: string
        }>
    }
    created_at: string
    updated_at: string
}

export interface CartSummary {
    total: number
    itemCount: number
}

export interface AddToCartInput {
    product_id: string
    quantity: number
}

export interface UpdateCartItemInput {
    quantity: number
}

export class CartService extends GraphQLService {
    /**
     * Ajouter un produit au panier
     */
    async addProductToCart(input: AddToCartInput): Promise<CartItem> {
        const mutation = `
            mutation AddToCart($input: AddToCartInput!) {
                addToCart(input: $input) {
                    id
                    user_id
                    product_id
                    quantity
                    product {
                        id
                        name
                        description
                        price
                        images
                        image_urls
                        image_metadata
                        stock
                        analysis_file
                        analysis_file_url
                        analysis_file_original_name
                        analysis_file_size
                        analysis_file_mime_type
                        categories {
                            id
                            name
                        }
                    }
                    created_at
                    updated_at
                }
            }
        `

        const response = await this.request(mutation, { input })
        return response.addToCart
    }

    /**
     * Récupérer le contenu du panier
     */
    async getMyCart(): Promise<CartItem[]> {
        const query = `
            query MyCart {
                myCart {
                    id
                    user_id
                    product_id
                    quantity
                    product {
                        id
                        name
                        description
                        price
                        images
                        image_urls
                        image_metadata
                        stock
                        analysis_file
                        analysis_file_url
                        analysis_file_original_name
                        analysis_file_size
                        analysis_file_mime_type
                        thc
                        cbd
                        categories {
                            id
                            name
                        }
                    }
                    created_at
                    updated_at
                }
            }
        `

        const response = await this.request(query, {})
        return response.myCart
    }

    /**
     * Récupérer le total du panier
     */
    async getCartTotal(): Promise<CartSummary> {
        const query = `
            query CartTotal {
                cartTotal {
                    total
                    itemCount
                }
            }
        `

        const response = await this.request(query, {})
        return response.cartTotal
    }

    /**
     * Modifier la quantité d'un article du panier
     */
    async updateCartItem(id: string, input: UpdateCartItemInput): Promise<CartItem> {
        const mutation = `
            mutation UpdateCartItem($id: ID!, $input: UpdateCartItemInput!) {
                updateCartItem(id: $id, input: $input) {
                    id
                    quantity
                    product {
                        id
                        name
                        price
                    }
                    updated_at
                }
            }
        `

        const response = await this.request(mutation, { id, input })
        return response.updateCartItem
    }

    /**
     * Supprimer un article du panier
     */
    async removeFromCart(id: string): Promise<{ success: boolean; message: string }> {
        const mutation = `
            mutation RemoveFromCart($id: ID!) {
                removeFromCart(id: $id) {
                    success
                    message
                }
            }
        `

        const response = await this.request(mutation, { id })
        return response.removeFromCart
    }

    /**
     * Vider complètement le panier
     */
    async clearCart(): Promise<{ success: boolean; message: string }> {
        const mutation = `
            mutation ClearCart {
                clearCart {
                    success
                    message
                }
            }
        `

        const response = await this.request(mutation, {})
        return response.clearCart
    }
}

// Instance singleton
export const cartService = new CartService()
