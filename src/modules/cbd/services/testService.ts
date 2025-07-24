// Service de test complet pour l'API GraphQL CBD

import { GraphQLService } from '@/shared/services/graphql'

export class CBDTestService extends GraphQLService {

    // ========================================
    // 🔐 AUTHENTIFICATION TESTS
    // ========================================

    async testLogin(email: string = "admin@admin.com", password: string = "L15fddef!") {
        const query = `
            mutation Login($email: String!, $password: String!) {
                login(email: $email, password: $password) {
                    access_token
                    token_type
                    expires_in
                    user {
                        id
                        name
                        email
                        is_admin
                        is_active
                    }
                }
            }
        `
        return this.request(query, { email, password })
    }

    async testMe() {
        const query = `
            query GetCurrentUser {
                me {
                    id
                    name
                    email
                    avatar
                    is_admin
                    is_active
                    email_verified_at
                }
            }
        `
        return this.request(query)
    }

    async testLogout() {
        const query = `
            mutation Logout {
                logout {
                    message
                }
            }
        `
        return this.request(query)
    }

    // ========================================
    // 👥 UTILISATEURS TESTS
    // ========================================

    async testUsers(first: number = 15, page: number = 1) {
        const query = `
            query GetUsers($first: Int, $page: Int) {
                users(first: $first, page: $page) {
                    paginatorInfo {
                        currentPage
                        hasMorePages
                        total
                        perPage
                        lastPage
                    }
                    data {
                        id
                        name
                        email
                        avatar
                        is_admin
                        is_active
                        email_verified_at
                    }
                }
            }
        `
        return this.request(query, { first, page })
    }

    async testUser(id: string) {
        const query = `
            query GetUser($id: ID!) {
                user(id: $id) {
                    id
                    name
                    email
                    avatar
                    is_admin
                    is_active
                    email_verified_at
                }
            }
        `
        return this.request(query, { id })
    }

    // ========================================
    // 🌿 PRODUITS CBD TESTS
    // ========================================

    async testProducts(first: number = 20, page: number = 1) {
        const query = `
            query GetProducts($first: Int, $page: Int) {
                products(first: $first, page: $page) {
                    paginatorInfo {
                        currentPage
                        hasMorePages
                        total
                        perPage
                        lastPage
                    }
                    data {
                        id
                        name
                        description
                        price
                        images
                        stock
                        analysis_file
                        analysis_file_url
                        category_id
                        created_at
                        updated_at
                        category {
                            id
                            name
                            description
                        }
                        categories {
                            id
                            name
                            description
                        }
                        suppliers {
                            id
                            name
                            email
                            phone
                        }
                    }
                }
            }
        `
        return this.request(query, { first, page })
    }

    async testProduct(id: string) {
        const query = `
            query GetProduct($id: ID!) {
                product(id: $id) {
                    id
                    name
                    description
                    price
                    images
                    stock
                    analysis_file
                    analysis_file_url
                    category_id
                    created_at
                    updated_at
                    category {
                        id
                        name
                        description
                    }
                    categories {
                        id
                        name
                        description
                    }
                    suppliers {
                        id
                        name
                        email
                        phone
                    }
                }
            }
        `
        return this.request(query, { id })
    }

    async testCreateProduct(input: any) {
        const query = `
            mutation CreateProduct($input: CreateProductInput!) {
                createProduct(input: $input) {
                    id
                    name
                    description
                    price
                    images
                    stock
                    analysis_file
                    category_id
                    created_at
                    updated_at
                }
            }
        `
        return this.request(query, { input })
    }

    async testUpdateProduct(id: string, input: any) {
        const query = `
            mutation UpdateProduct($id: ID!, $input: UpdateProductInput!) {
                updateProduct(id: $id, input: $input) {
                    id
                    name
                    description
                    price
                    stock
                    updated_at
                }
            }
        `
        return this.request(query, { id, input })
    }

    async testDeleteProduct(id: string) {
        const query = `
            mutation DeleteProduct($id: ID!) {
                deleteProduct(id: $id) {
                    success
                    message
                }
            }
        `
        return this.request(query, { id })
    }

    // ========================================
    // 📂 CATÉGORIES TESTS
    // ========================================

    async testCategories() {
        const query = `
            query GetCategories {
                categories {
                    id
                    name
                    description
                    created_at
                    products {
                        id
                        name
                        price
                        stock
                    }
                }
            }
        `
        return this.request(query)
    }

    async testCategory(id: string) {
        const query = `
            query GetCategory($id: ID!) {
                category(id: $id) {
                    id
                    name
                    description
                    created_at
                    products {
                        id
                        name
                        description
                        price
                        stock
                        images
                    }
                }
            }
        `
        return this.request(query, { id })
    }

    async testCreateCategory(input: any) {
        const query = `
            mutation CreateCategory($input: CreateCategoryInput!) {
                createCategory(input: $input) {
                    id
                    name
                    description
                    created_at
                }
            }
        `
        return this.request(query, { input })
    }

    // ========================================
    // 🏭 FOURNISSEURS TESTS
    // ========================================

    async testSuppliers() {
        const query = `
            query GetSuppliers {
                suppliers {
                    id
                    name
                    email
                    phone
                    products {
                        id
                        name
                        price
                        stock
                    }
                }
            }
        `
        return this.request(query)
    }

    async testSupplier(id: string) {
        const query = `
            query GetSupplier($id: ID!) {
                supplier(id: $id) {
                    id
                    name
                    email
                    phone
                    products {
                        id
                        name
                        description
                        price
                        stock
                    }
                }
            }
        `
        return this.request(query, { id })
    }

    async testCreateSupplier(name: string, email?: string, phone?: string) {
        const query = `
            mutation CreateSupplier($name: String!, $email: String, $phone: String) {
                createSupplier(name: $name, email: $email, phone: $phone) {
                    id
                    name
                    email
                    phone
                }
            }
        `
        return this.request(query, { name, email, phone })
    }

    // ========================================
    // 🛒 PANIER TESTS
    // ========================================

    async testMyCart() {
        const query = `
            query GetMyCart {
                myCart {
                    id
                    user_id
                    product_id
                    quantity
                    created_at
                    updated_at
                    user {
                        id
                        name
                        email
                    }
                    product {
                        id
                        name
                        description
                        price
                        images
                        stock
                    }
                }
            }
        `
        return this.request(query)
    }

    async testCartTotal() {
        const query = `
            query GetCartTotal {
                cartTotal {
                    total
                    itemCount
                }
            }
        `
        return this.request(query)
    }

    async testAddToCart(input: any) {
        const query = `
            mutation AddToCart($input: AddToCartInput!) {
                addToCart(input: $input) {
                    id
                    user_id
                    product_id
                    quantity
                    created_at
                    updated_at
                    product {
                        id
                        name
                        price
                        stock
                    }
                }
            }
        `
        return this.request(query, { input })
    }

    // ========================================
    // 📦 COMMANDES TESTS
    // ========================================

    async testOrders(first: number = 10, page: number = 1) {
        const query = `
            query GetOrders($first: Int, $page: Int) {
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
            }
        `
        return this.request(query, { first, page })
    }

    async testOrder(id: string) {
        const query = `
            query GetOrder($id: ID!) {
                order(id: $id) {
                    id
                    total
                    status
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
    }

    async testCheckout() {
        const query = `
            mutation Checkout {
                checkout {
                    id
                    total
                    status
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
        return this.request(query)
    }

    // ========================================
    // 📋 ARRIVAGES TESTS
    // ========================================

    async testArrivals(first: number = 15, page: number = 1) {
        const query = `
            query GetArrivals($first: Int, $page: Int) {
                arrivals(first: $first, page: $page) {
                    paginatorInfo {
                        currentPage
                        hasMorePages
                        total
                        perPage
                        lastPage
                    }
                    data {
                        id
                        amount
                        status
                        created_at
                        updated_at
                        products {
                            id
                            arrival_id
                            product_id
                            quantity
                            unit_price
                            product {
                                id
                                name
                                description
                                price
                                stock
                            }
                        }
                    }
                }
            }
        `
        return this.request(query, { first, page })
    }

    async testArrival(arrivalId: string) {
        const query = `
            query GetArrival($arrivalId: ID!) {
                arrival(arrival_id: $arrivalId) {
                    id
                    amount
                    status
                    created_at
                    updated_at
                    products {
                        id
                        arrival_id
                        product_id
                        quantity
                        unit_price
                        product {
                            id
                            name
                            description
                            price
                            stock
                        }
                    }
                }
            }
        `
        return this.request(query, { arrivalId })
    }

    async testCreateArrival(input: any) {
        const query = `
            mutation CreateArrival($input: CreateArrivalInput!) {
                createArrival(input: $input) {
                    id
                    amount
                    status
                    created_at
                    products {
                        id
                        product_id
                        quantity
                        unit_price
                        product {
                            id
                            name
                            stock
                        }
                    }
                }
            }
        `
        return this.request(query, { input })
    }

    async testValidateArrival(arrivalId: string) {
        const query = `
            mutation ValidateArrival($arrivalId: ID!) {
                validateArrival(arrival_id: $arrivalId) {
                    id
                    amount
                    status
                    updated_at
                    products {
                        id
                        product_id
                        quantity
                        unit_price
                        product {
                            id
                            name
                            stock
                        }
                    }
                }
            }
        `
        return this.request(query, { arrivalId })
    }
}

// Instance singleton
export const cbdTestService = new CBDTestService()
