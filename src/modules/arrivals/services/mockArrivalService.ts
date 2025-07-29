// Service mock pour les arrivages - données temporaires pour les tests
import type {
    Arrival,
    ArrivalsResponse,
    CreateArrivalInput,
    UpdateArrivalInput,
    ArrivalFilters
} from '../types'

// Données mock
const mockArrivals: Arrival[] = [
    {
        id: '1',
        amount: 1250.00,
        status: 'pending',
        created_at: '2025-07-25T10:30:00Z',
        updated_at: '2025-07-25T10:30:00Z',
        products: [
            {
                id: '1',
                arrival_id: '1',
                product_id: 'PROD001',
                quantity: 10,
                unit_price: 125.00,
                product: {
                    id: 'PROD001',
                    name: 'Ordinateur portable Dell',
                    stock: 25
                }
            }
        ]
    },
    {
        id: '2',
        amount: 850.00,
        status: 'validated',
        created_at: '2025-07-24T14:15:00Z',
        updated_at: '2025-07-24T16:20:00Z',
        products: [
            {
                id: '2',
                arrival_id: '2',
                product_id: 'PROD002',
                quantity: 5,
                unit_price: 170.00,
                product: {
                    id: 'PROD002',
                    name: 'Écran Samsung 24"',
                    stock: 15
                }
            }
        ]
    },
    {
        id: '3',
        amount: 2400.00,
        status: 'pending',
        created_at: '2025-07-23T09:00:00Z',
        updated_at: '2025-07-23T09:00:00Z',
        products: [
            {
                id: '3',
                arrival_id: '3',
                product_id: 'PROD003',
                quantity: 20,
                unit_price: 120.00,
                product: {
                    id: 'PROD003',
                    name: 'Clavier mécanique',
                    stock: 50
                }
            }
        ]
    }
]

class MockArrivalService {
    private delay(ms: number = 500): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    async getArrivals(limit: number = 15, page: number = 1): Promise<ArrivalsResponse> {
        await this.delay()

        // Simulation de pagination
        const startIndex = (page - 1) * limit
        const endIndex = startIndex + limit
        const paginatedArrivals = mockArrivals.slice(startIndex, endIndex)

        return {
            data: paginatedArrivals,
            paginatorInfo: {
                currentPage: page,
                perPage: limit,
                total: mockArrivals.length,
                hasMorePages: endIndex < mockArrivals.length
            }
        }
    }

    async getArrival(id: string): Promise<Arrival> {
        await this.delay()

        const arrival = mockArrivals.find(a => a.id === id)
        if (!arrival) {
            throw new Error(`Arrivage avec l'ID ${id} non trouvé`)
        }

        return arrival
    }

    async createArrival(input: CreateArrivalInput): Promise<Arrival> {
        await this.delay()

        const newArrival: Arrival = {
            id: (mockArrivals.length + 1).toString(),
            amount: input.amount,
            status: 'pending',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            products: input.products?.map((product, index) => ({
                id: `${mockArrivals.length + 1}_${index + 1}`,
                arrival_id: (mockArrivals.length + 1).toString(),
                product_id: product.product_id || 'unknown',
                quantity: product.quantity || 0,
                unit_price: product.unit_price || 0,
                product: {
                    id: product.product_id || 'unknown',
                    name: `Produit ${product.product_id || 'inconnu'}`,
                    stock: 10
                }
            })) || []
        }

        mockArrivals.push(newArrival)
        return newArrival
    }

    async updateArrival(id: string, input: UpdateArrivalInput): Promise<Arrival> {
        await this.delay()

        const arrivalIndex = mockArrivals.findIndex(a => a.id === id)
        if (arrivalIndex === -1) {
            throw new Error(`Arrivage avec l'ID ${id} non trouvé`)
        }

        const currentArrival = mockArrivals[arrivalIndex]
        const updatedArrival: Arrival = {
            ...currentArrival,
            amount: input.amount ?? currentArrival.amount,
            status: input.status ?? currentArrival.status,
            updated_at: new Date().toISOString()
        }

        // Si on met à jour les produits, on conserve la structure complète
        if (input.products) {
            updatedArrival.products = input.products.map((product, index) => ({
                id: `${id}_${index + 1}`,
                arrival_id: id,
                product_id: product.product_id || 'unknown',
                quantity: product.quantity || 0,
                unit_price: product.unit_price || 0,
                product: {
                    id: product.product_id || 'unknown',
                    name: `Produit ${product.product_id || 'inconnu'}`,
                    stock: 10
                }
            }))
        }

        mockArrivals[arrivalIndex] = updatedArrival
        return updatedArrival
    }

    async validateArrival(id: string): Promise<Arrival> {
        await this.delay()

        const arrivalIndex = mockArrivals.findIndex(a => a.id === id)
        if (arrivalIndex === -1) {
            throw new Error(`Arrivage avec l'ID ${id} non trouvé`)
        }

        mockArrivals[arrivalIndex].status = 'validated'
        mockArrivals[arrivalIndex].updated_at = new Date().toISOString()

        return mockArrivals[arrivalIndex]
    }

    async deleteArrival(id: string): Promise<boolean> {
        await this.delay()

        const arrivalIndex = mockArrivals.findIndex(a => a.id === id)
        if (arrivalIndex === -1) {
            throw new Error(`Arrivage avec l'ID ${id} non trouvé`)
        }

        mockArrivals.splice(arrivalIndex, 1)
        return true
    }
}

export const mockArrivalService = new MockArrivalService()
