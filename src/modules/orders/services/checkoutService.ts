// Service GraphQL pour les mutations de commandes (checkout, annulation, etc.)
import type { Order } from '@/modules/orders/types'
import { GraphQLService } from '@/shared/services/graphql'

export interface CheckoutOrder {
    id: string
    user_id: string
    total: number
    status: string
    created_at: string
    updated_at: string
    
    user: {
        id: string
        name: string
        email: string
    }
    
    products: Array<{
        id: string
        name: string
        description: string
        price: number
        images?: string[]
        image_urls?: string[]
        image_metadata?: any
        analysis_file?: string
        analysis_file_url?: string
        analysis_file_original_name?: string
        analysis_file_size?: number
        analysis_file_mime_type?: string
        stock: number
        
        categories?: Array<{
            id: string
            name: string
        }>
        
        pivot: {
            quantity: number
            unit_price: number
            created_at: string
            updated_at: string
        }
    }>
    
    total_items: number
    product_count: number
    formatted_status: string
}

export interface UpdateOrderStatusInput {
    id: string
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
}

export interface OrderStats {
    order_id: string
    total_items: number
    product_count: number
    total_amount: number
    average_item_price: number
    created_at: string
    status: string
}

export class CheckoutService extends GraphQLService {
    /**
     * Finaliser la commande (convertir le panier en commande)
     */
    async checkout(): Promise<CheckoutOrder> {
        const mutation = `
            mutation Checkout {
                checkout {
                    id
                    user_id
                    total
                    status
                    created_at
                    updated_at
                    
                    user {
                        id
                        name
                        email
                    }
                    
                    products {
                        id
                        name
                        description
                        price
                        images
                        image_urls
                        image_metadata
                        analysis_file
                        analysis_file_url
                        analysis_file_original_name
                        analysis_file_size
                        analysis_file_mime_type
                        stock
                        
                        categories {
                            id
                            name
                        }
                        
                        pivot {
                            quantity
                            unit_price
                            created_at
                            updated_at
                        }
                    }
                    
                    total_items
                    product_count
                    formatted_status
                }
            }
        `

        const response = await this.request(mutation, {})
        return response.checkout
    }

    /**
     * Annuler une commande
     */
    async cancelOrder(orderId: string): Promise<boolean> {
        const mutation = `
            mutation CancelOrder($id: ID!) {
                cancelOrder(id: $id)
            }
        `

        const response = await this.request(mutation, { id: orderId })
        return response.cancelOrder
    }

    /**
     * Modifier le statut d'une commande (Admin uniquement)
     */
    async updateOrderStatus(input: UpdateOrderStatusInput): Promise<Order> {
        const mutation = `
            mutation UpdateOrderStatus($input: UpdateOrderStatusInput!) {
                updateOrderStatus(input: $input) {
                    id
                    user_id
                    total
                    status
                    created_at
                    updated_at
                    
                    user {
                        name
                        email
                    }
                    
                    products {
                        name
                        pivot {
                            quantity
                            unit_price
                        }
                    }
                    
                    total_items
                    product_count
                    formatted_status
                }
            }
        `

        const response = await this.request(mutation, { input })
        return response.updateOrderStatus
    }

    /**
     * Récupérer les statistiques d'une commande
     */
    async getOrderStats(orderId: string): Promise<OrderStats> {
        const query = `
            query GetOrderStats($id: ID!) {
                orderStats(id: $id) {
                    order_id
                    total_items
                    product_count
                    total_amount
                    average_item_price
                    created_at
                    status
                }
            }
        `

        const response = await this.request(query, { id: orderId })
        return response.orderStats
    }

    /**
     * Calculer le total d'une commande côté client
     */
    calculateOrderTotal(products: CheckoutOrder['products']): number {
        return products.reduce((total, product) => {
            return total + (product.pivot.quantity * product.pivot.unit_price)
        }, 0)
    }

    /**
     * Calculer le nombre total d'articles
     */
    calculateTotalItems(products: CheckoutOrder['products']): number {
        return products.reduce((total, product) => {
            return total + product.pivot.quantity
        }, 0)
    }

    /**
     * Formater le prix en euros
     */
    formatPrice(amount: number): string {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR'
        }).format(amount)
    }

    /**
     * Formater la date
     */
    formatDate(dateString: string): string {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    /**
     * Obtenir le libellé du statut en français
     */
    getStatusLabel(status: string): string {
        const statusLabels: Record<string, string> = {
            'pending': 'En attente',
            'validated': 'Validée',
            'cancelled': 'Annulée'
        }
        return statusLabels[status] || status
    }

    /**
     * Obtenir la couleur CSS pour un statut
     */
    getStatusColor(status: string): string {
        const statusColors: Record<string, string> = {
            'pending': 'text-yellow-600',
            'validated': 'text-green-600',
            'cancelled': 'text-red-600'
        }
        return statusColors[status] || 'text-gray-600'
    }
}

// Instance singleton
export const checkoutService = new CheckoutService()
