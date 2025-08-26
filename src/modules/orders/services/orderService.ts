// Service GraphQL pour la gestion des commandes
import { GraphQLService } from '@/shared/services/graphql'
import type { PaginatedResponse } from '@/shared/types'
import { useAuthStore } from '@/stores/auth'
import jsPDF from 'jspdf'
import type {
    Order,
    OrderFilters
} from '../types'

export class OrderService extends GraphQLService {
    /**
     * Récupère la liste des commandes avec pagination et filtres
     * Limite maximale de 50 éléments par page (contrainte GraphQL)
     * Utilise la query admin si l'utilisateur est admin (avec détails des produits)
     * Applique les filtres côté client si l'API GraphQL ne les supporte pas
     */
    async getOrders(filters: OrderFilters = {}, page = 1, limit = 20): Promise<PaginatedResponse<Order>> {
        // Vérifier la limite maximale autorisée par l'API GraphQL
        if (limit > 50) {
            console.warn(`Limite de ${limit} éléments réduite à 50 (limite maximale de l'API GraphQL)`)
            limit = 50
        }

        const authStore = useAuthStore()
        const isAdmin = authStore.isAdmin

        // Variables GraphQL
        const variables: any = { first: limit, page }

        // Query pour les administrateurs avec détails des produits (tous les commandes)
        const adminQuery = `
            query AllOrders($first: Int = 15, $page: Int = 1) {
                orders(first: $first, page: $page) {
                    paginatorInfo {
                        currentPage
                        hasMorePages
                        total
                        perPage
                        lastPage
                    }
                    data {
                        id
                        total
                        status
                        formatted_status
                        created_at
                        updated_at
                        user {
                            id
                            name
                            email
                        }
                    }
                }
            }
        `

        // Query pour les utilisateurs normaux (leurs commandes uniquement)
        const userQuery = `
            query MyOrders($first: Int = 10, $page: Int = 1) {
                myOrders(first: $first, page: $page) {
                    paginatorInfo {
                        currentPage
                        hasMorePages
                        total
                        perPage
                        lastPage
                    }
                    data {
                        id
                        total
                        status
                        formatted_status
                        created_at
                        updated_at
                        user {
                            id
                            name
                            email
                        }
                    }
                }
            }
        `

        const query = isAdmin ? adminQuery : userQuery

        return this.request(query, variables)
            .then((response: any) => {
                // Adapter selon la query utilisée (orders pour admin, myOrders pour user)
                const ordersData = isAdmin ? response.orders : response.myOrders
                return {
                    data: ordersData.data,
                    pagination: {
                        total: ordersData.paginatorInfo.total,
                        per_page: ordersData.paginatorInfo.perPage,
                        current_page: ordersData.paginatorInfo.currentPage,
                        last_page: ordersData.paginatorInfo.lastPage,
                        from: ((ordersData.paginatorInfo.currentPage - 1) * ordersData.paginatorInfo.perPage) + 1,
                        to: Math.min(ordersData.paginatorInfo.currentPage * ordersData.paginatorInfo.perPage, ordersData.paginatorInfo.total)
                    }
                }
            })
    }

    /**
     * Récupère les commandes avec filtres - charge toutes les pages nécessaires pour filtrer correctement
     */
    async getOrdersWithFilters(filters: OrderFilters, targetPage = 1, targetLimit = 20): Promise<PaginatedResponse<Order>> {
        const authStore = useAuthStore()
        const isAdmin = authStore.isAdmin

        // Limiter à 50 maximum par requête
        const maxPerRequest = 50

        // Query pour charger les données
        const query = isAdmin ? `
            query GetAllOrders($first: Int, $page: Int) {
                orders(first: $first, page: $page) {
                    paginatorInfo {
                        currentPage
                        hasMorePages
                        total
                        perPage
                        lastPage
                    }
                    data {
                        id
                        total
                        status
                        created_at
                        user {
                            id
                            name
                            email
                        }
                    }
                }
            }
        ` : `
            query GetMyOrders($first: Int, $page: Int) {
                myOrders(first: $first, page: $page) {
                    paginatorInfo {
                        currentPage
                        hasMorePages
                        total
                        perPage
                        lastPage
                    }
                    data {
                        id
                        total
                        status
                        created_at
                        updated_at
                        user {
                            id
                            name
                            email
                        }
                    }
                }
            }
        `

        // Charger toutes les commandes par chunks pour pouvoir filtrer
        let allOrders: Order[] = []
        let currentPage = 1
        let hasMorePages = true

        while (hasMorePages && currentPage <= 20) { // Limite de sécurité à 20 pages (1000 commandes)
            const response: any = await this.request(query, { first: maxPerRequest, page: currentPage })
            const orders = isAdmin ? response.orders : response.myOrders

            allOrders.push(...orders.data)
            hasMorePages = orders.paginatorInfo.hasMorePages
            currentPage++
        }

        // Appliquer les filtres
        const filteredOrders = this.applyClientSideFilters(allOrders, filters)

        // Calculer la pagination sur les données filtrées
        const totalFiltered = filteredOrders.length
        const maxItemsPerPage = Math.min(targetLimit, 50)
        const totalPages = Math.ceil(totalFiltered / maxItemsPerPage)
        const startIndex = (targetPage - 1) * maxItemsPerPage
        const endIndex = startIndex + maxItemsPerPage
        const pageData = filteredOrders.slice(startIndex, endIndex)

        return {
            data: pageData,
            pagination: {
                total: totalFiltered,
                per_page: maxItemsPerPage,
                current_page: targetPage,
                last_page: totalPages,
                from: startIndex + 1,
                to: Math.min(endIndex, totalFiltered)
            }
        }
    }

    /**
     * Applique les filtres côté client
     */
    private applyClientSideFilters(orders: Order[], filters: OrderFilters): Order[] {
        return orders.filter(order => {
            // Filtre par statut
            if (filters.status && filters.status.length > 0) {
                if (!filters.status.includes(order.status)) {
                    return false
                }
            }

            // Filtre par montant minimum
            if (filters.min_amount !== undefined && order.total < filters.min_amount) {
                return false
            }

            // Filtre par montant maximum
            if (filters.max_amount !== undefined && order.total > filters.max_amount) {
                return false
            }

            // Filtre par recherche utilisateur
            if (filters.user_search && filters.user_search.trim()) {
                const searchTerm = filters.user_search.toLowerCase()
                const userMatch = order.user?.name?.toLowerCase().includes(searchTerm) ||
                    order.user?.email?.toLowerCase().includes(searchTerm) ||
                    order.user?.id?.toLowerCase().includes(searchTerm) ||
                    order.id.toLowerCase().includes(searchTerm)

                if (!userMatch) {
                    return false
                }
            }

            // Filtre par date (si nécessaire)
            if (filters.date_from) {
                const orderDate = new Date(order.created_at)
                const fromDate = new Date(filters.date_from)
                if (orderDate < fromDate) {
                    return false
                }
            }

            if (filters.date_to) {
                const orderDate = new Date(order.created_at)
                const toDate = new Date(filters.date_to)
                if (orderDate > toDate) {
                    return false
                }
            }

            return true
        })
    }

    /**
     * Récupère une commande par son ID avec tous les détails
     * Utilise la query orderDetails de la documentation
     */
    async getOrderDetails(id: string): Promise<Order> {
        const query = `
            query GetOrderDetails($id: ID!) {
                orderDetails(id: $id) {
                    id
                    total
                    status
                    formatted_status
                    created_at
                    updated_at
                    products {
                        id
                        name
                        price
                        pivot {
                            quantity
                            unit_price
                        }
                    }
                    user {
                        id
                        name
                        email
                    }
                }
            }
        `

        return this.request(query, { id })
            .then((response: any) => response.orderDetails)
    }

    /**
     * Récupère les statistiques d'une commande
     */
    async getOrderStats(id: string): Promise<any> {
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

        return this.request(query, { id })
            .then((response: any) => response.orderStats)
    }

    /**
     * Annule une commande en utilisant la mutation CancelOrder de la doc
     */
    async cancelOrder(id: string): Promise<boolean> {
        const mutation = `
            mutation CancelOrder($id: ID!) {
                cancelOrder(id: $id)
            }
        `

        return this.request(mutation, { id })
            .then((response: any) => response.cancelOrder)
    }

    /**
     * Met à jour le statut d'une commande (Admin uniquement)
     * Utilise UpdateOrderStatusInput selon la documentation
     */
    async updateOrderStatus(input: { id: string; status: string }): Promise<Order> {
        const mutation = `
            mutation UpdateOrderStatus($input: UpdateOrderStatusInput!) {
                updateOrderStatus(input: $input) {
                    id
                    total
                    status
                    formatted_status
                    created_at
                    updated_at
                    products {
                        id
                        name
                        price
                        pivot {
                            quantity
                            unit_price
                        }
                    }
                    user {
                        id
                        name
                        email
                    }
                }
            }
        `

        return this.request(mutation, { input })
            .then((response: any) => response.updateOrderStatus)
    }

    /**
     * Recherche de commandes par utilisateur ou ID
     */
    async searchOrders(query: string): Promise<Order[]> {
        const searchQuery = `
            query SearchOrders($query: String!) {
                searchOrders(query: $query) {
                    id
                    total
                    status
                    formatted_status
                    created_at
                    updated_at
                    user {
                        id
                        name
                        email
                    }
                }
            }
        `

        return this.request(searchQuery, { query })
            .then((response: any) => response.searchOrders)
    }

    /**
     * Génère une facture pour une commande validée
     */
    async generateInvoice(orderId: string): Promise<{ url: string; filename: string }> {
        const mutation = `
            mutation GenerateInvoice($orderId: ID!) {
                generateInvoice(orderId: $orderId) {
                    url
                    filename
                    success
                    message
                }
            }
        `

        try {
            const response = await this.request(mutation, { orderId })

            if (response.generateInvoice.success) {
                return {
                    url: response.generateInvoice.url,
                    filename: response.generateInvoice.filename
                }
            } else {
                throw new Error(response.generateInvoice.message || 'Erreur lors de la génération de la facture')
            }
        } catch (error) {
            // Si l'API GraphQL ne supporte pas cette mutation, on peut simuler ou utiliser une autre approche
            console.warn('Génération de facture via GraphQL non disponible, utilisation de l\'approche alternative')

            // Approche alternative : générer une facture côté client ou appeler une API REST
            return this.generateInvoiceAlternative(orderId)
        }
    }

    /**
     * Génération de facture alternative (méthode de fallback)
     */
    private async generateInvoiceAlternative(orderId: string): Promise<{ url: string; filename: string }> {
        // Récupérer les détails de la commande
        const order = await this.getOrderDetails(orderId)

        if (order.status !== 'validated') {
            throw new Error('Seules les commandes validées peuvent générer une facture')
        }

        // Créer un nouveau document PDF
        const doc = new jsPDF()
        const filename = `facture_${orderId}_${new Date().toISOString().split('T')[0]}.pdf`

        // Configuration de base
        const pageWidth = doc.internal.pageSize.width
        const margin = 20
        let yPosition = 30

        // En-tête de la facture
        doc.setFontSize(24)
        doc.setFont('helvetica', 'bold')
        doc.text('FACTURE', pageWidth / 2, yPosition, { align: 'center' })
        yPosition += 20

        // Informations de l'entreprise (côté gauche)
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.text('SARL FMC', margin, yPosition)
        yPosition += 7
        doc.setFont('helvetica', 'normal')
        doc.text('5 B TERRE ROUGE, ', margin, yPosition)
        yPosition += 5
        doc.text('35270 BONNEMAIN, France', margin, yPosition)
        yPosition += 5
        doc.text('Tél:  02.23.18.32.94', margin, yPosition)
        yPosition += 5
        doc.text('Email: contact.sarl.fmc@gmail.com', margin, yPosition)

        // Informations de facturation (côté droit)
        const rightStart = pageWidth - margin - 80
        yPosition = 50
        doc.setFont('helvetica', 'bold')
        doc.text('Facturé à:', rightStart, yPosition)
        yPosition += 7
        doc.setFont('helvetica', 'normal')
        doc.text(order.user?.name || 'Client', rightStart, yPosition)
        yPosition += 5
        doc.text(order.user?.email || '', rightStart, yPosition)

        yPosition += 20

        // Détails de la facture
        doc.setFont('helvetica', 'bold')
        doc.text(`Numéro de facture: INV-${orderId}`, margin, yPosition)
        yPosition += 7
        doc.text(`Date de commande: ${new Date(order.created_at).toLocaleDateString('fr-FR')}`, margin, yPosition)
        yPosition += 7
        doc.text(`Date de facture: ${new Date().toLocaleDateString('fr-FR')}`, margin, yPosition)
        yPosition += 7
        doc.text(`Statut: ${(order.status as string).toUpperCase()}`, margin, yPosition)

        yPosition += 20

        // Tableau des produits
        doc.setFont('helvetica', 'bold')
        doc.text('DÉTAIL DES PRODUITS', margin, yPosition)
        yPosition += 10

        // En-têtes du tableau
        const tableHeaders = ['Produit', 'Quantité', 'Prix unitaire', 'Total']
        const colWidths = [80, 30, 40, 40]
        let xPosition = margin

        doc.setFontSize(10)
        doc.setFont('helvetica', 'bold')

        // Dessiner les en-têtes
        tableHeaders.forEach((header, index) => {
            doc.text(header, xPosition, yPosition)
            xPosition += colWidths[index]
        })

        // Ligne de séparation
        yPosition += 5
        doc.line(margin, yPosition, pageWidth - margin, yPosition)
        yPosition += 10

        // Lignes de produits
        doc.setFont('helvetica', 'normal')
        let totalAmount = 0

        if (order.products && order.products.length > 0) {
            order.products.forEach((product: any) => {
                xPosition = margin
                const quantity = product.pivot?.quantity || 1
                const unitPrice = product.pivot?.unit_price || product.price || 0
                const lineTotal = quantity * unitPrice
                totalAmount += lineTotal

                // Nom du produit (avec gestion du texte long)
                const productName = product.name.length > 25 ?
                    product.name.substring(0, 25) + '...' :
                    product.name
                doc.text(productName, xPosition, yPosition)
                xPosition += colWidths[0]

                // Quantité
                doc.text(quantity.toString(), xPosition, yPosition)
                xPosition += colWidths[1]

                // Prix unitaire
                doc.text(`${unitPrice.toFixed(2)} €`, xPosition, yPosition)
                xPosition += colWidths[2]

                // Total ligne
                doc.text(`${lineTotal.toFixed(2)} €`, xPosition, yPosition)

                yPosition += 8
            })
        } else {
            // Si pas de détails de produits, afficher juste le total
            xPosition = margin
            doc.text('Commande complète', xPosition, yPosition)
            xPosition += colWidths[0] + colWidths[1] + colWidths[2]
            doc.text(`${order.total.toFixed(2)} €`, xPosition, yPosition)
            totalAmount = order.total
            yPosition += 8
        }

        // Ligne de séparation avant le total
        yPosition += 5
        doc.line(margin, yPosition, pageWidth - margin, yPosition)
        yPosition += 10

        // Total final
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(14)
        const totalText = `TOTAL: ${(totalAmount || order.total).toFixed(2)} €`
        doc.text(totalText, pageWidth - margin - 50, yPosition, { align: 'right' })

        yPosition += 20

        // Mentions légales
        doc.setFontSize(8)
        doc.setFont('helvetica', 'normal')
        doc.text('TVA non applicable - Article 293B du CGI', margin, yPosition)

        // Générer le PDF en tant que blob
        const pdfBlob = doc.output('blob')

        // Créer une URL pour le blob
        const url = URL.createObjectURL(pdfBlob)

        // Simuler un délai de génération
        await new Promise(resolve => setTimeout(resolve, 500))

        return {
            url: url,
            filename: filename
        }
    }
}

// Export d'une instance du service
export const orderService = new OrderService()
