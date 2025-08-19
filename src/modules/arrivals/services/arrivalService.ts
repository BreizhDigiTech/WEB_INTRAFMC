// Service GraphQL pour la gestion des arrivages
import { graphqlService } from '../../../shared/services/graphql'
import type {
    Arrival,
    ArrivalDetailQueryVariables,
    ArrivalsQueryVariables,
    ArrivalsResponse,
    CreateArrivalInput,
    UpdateArrivalInput,
    ValidateArrivalVariables
} from '../types'

export const arrivalService = {
    /**
     * Récupère la liste des arrivages avec pagination
     */
    async getArrivals(variables: ArrivalsQueryVariables = {}): Promise<ArrivalsResponse> {
        const { first = 15, page = 1 } = variables
        
        const query = `
            query GetArrivals($first: Int, $page: Int) {
                arrivals(first: $first, page: $page) {
                    paginatorInfo {
                        currentPage
                        hasMorePages
                        total
                        perPage
                    }
                    data {
                        id
                        amount
                        status
                        created_at
                        updated_at
                        products {
                            id
                            product_id
                            quantity
                            unit_price
                            product {
                                id
                                name
                                price
                                stock
                                images
                                description
                                category {
                                    id
                                    name
                                }
                            }
                        }
                    }
                }
            }
        `

        const response = await graphqlService.request(query, { first, page })
        return response.arrivals
    },

    /**
     * Récupère un arrivage spécifique
     */
    async getArrival(variables: ArrivalDetailQueryVariables): Promise<Arrival> {
        const query = `
            query GetArrivalDetail($arrivalId: ID!) {
                arrival(arrival_id: $arrivalId) {
                    id
                    amount
                    status
                    created_at
                    updated_at
                    products {
                        id
                        product_id
                        quantity
                        unit_price
                        product {
                            id
                            name
                            price
                            stock
                        }
                    }
                }
            }
        `

        const response = await graphqlService.request(query, { arrivalId: variables.id })
        return response.arrival
    },

    /**
     * Crée un nouvel arrivage
     */
    async createArrival(input: CreateArrivalInput): Promise<Arrival> {
        const mutation = `
            mutation CreateArrival($input: CreateArrivalInput!) {
                createArrival(input: $input) {
                    id
                    amount
                    status
                    created_at
                    updated_at
                    products {
                        id
                        product_id
                        quantity
                        unit_price
                        product {
                            id
                            name
                            price
                            stock
                            images
                        }
                    }
                }
            }
        `

        const response = await graphqlService.request(mutation, { input })
        return response.createArrival
    },

    /**
     * Met à jour un arrivage
     */
    async updateArrival(id: string, input: UpdateArrivalInput): Promise<Arrival> {
        const mutation = `
            mutation UpdateArrival($id: ID!, $input: UpdateArrivalInput!) {
                updateArrival(id: $id, input: $input) {
                    id
                    amount
                    status
                    created_at
                    updated_at
                    products {
                        id
                        product_id
                        quantity
                        unit_price
                        product {
                            id
                            name
                            price
                            stock
                            images
                        }
                    }
                }
            }
        `

        const response = await graphqlService.request(mutation, { id, input })
        return response.updateArrival
    },

    /**
     * Supprime un arrivage
     */
    async deleteArrival(id: string): Promise<void> {
        const mutation = `
            mutation DeleteArrival($id: ID!) {
                deleteArrival(id: $id) {
                    success
                    message
                }
            }
        `

        await graphqlService.request(mutation, { id })
    },

    /**
     * Valide un arrivage (met à jour automatiquement les stocks)
     */
    async validateArrival(variables: ValidateArrivalVariables): Promise<Arrival> {
        const mutation = `
            mutation ValidateArrival($arrivalId: ID!) {
                validateArrival(arrival_id: $arrivalId) {
                    id
                    amount
                    status
                    created_at
                    updated_at
                    products {
                        id
                        product_id
                        quantity
                        unit_price
                        product {
                            id
                            name
                            price
                            stock
                        }
                    }
                }
            }
        `

        const response = await graphqlService.request(mutation, { arrivalId: variables.id })
        return response.validateArrival
    },

    /**
     * Récupère la liste des produits pour la sélection
     */
    async getProducts(first = 50, page = 1) {
        const query = `
            query GetProducts($first: Int, $page: Int) {
                products(first: $first, page: $page) {
                    data {
                        id
                        name
                        description
                        price
                        stock
                        categories {
                            id
                            name
                        }
                    }
                }
            }
        `

        const response = await graphqlService.request(query, { first, page })
        return response.products.data
    }

    // Suppression de getSuppliers() selon consigne d'ignorer les suppliers
}