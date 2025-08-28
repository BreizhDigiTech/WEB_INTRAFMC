// Service GraphQL unifié basé sur la documentation de référence
// Contient toutes les requêtes et mutations GraphQL alignées avec l'API

import { GraphQLService } from '@/shared/services/graphql'
import type {
    // Auth types
    AuthPayload,
    Date,
    DeleteResponse,
    JSON,
    LogoutResponse,
    TokenValidation,
    User
} from '@/shared/types'
import {
    SuggestionType,
    TimeGrouping
} from '@/shared/types'

// Import des types spécifiques aux modules
import type {
    CreateProductCBDInput,
    ProductCBD,
    ProductSuggestion,
    UpdateProductCBDInput
} from '@/modules/products/types'

import type {
    Category,
    CategoryList,
    CategoryWithCounts,
    CreateCategoryInput
} from '@/modules/categories/types'

import type {
    AddToCartInput,
    Cart,
    CartSummary
} from '@/modules/ecommerce/types'

import type {
    Order
} from '@/modules/orders/types'

// Service GraphQL unifié basé sur la documentation de référence
// Contient toutes les requêtes et mutations GraphQL alignées avec l'API


// Import des types spécifiques aux modules






export class UnifiedGraphQLService extends GraphQLService {
    
    // ==================== AUTHENTIFICATION ====================
    
    async loginUser(email: string, password: string): Promise<AuthPayload> {
        const mutation = `
            mutation Login($email: String!, $password: String!) {
                login(email: $email, password: $password) {
                    access_token
                    token_type
                    expires_in
                    user {
                        id
                        name
                        email
                        phone
                        address
                        birth_date
                        avatar
                        avatar_original_name
                        avatar_size
                        is_admin
                        is_active
                        email_verified_at
                        created_at
                        updated_at
                    }
                }
            }
        `
        const response = await this.request(mutation, { email, password })
        return response.login
    }
    
    async logoutUser(): Promise<LogoutResponse> {
        const mutation = `
            mutation Logout {
                logout {
                    message
                }
            }
        `
        const response = await this.request(mutation)
        return response.logout
    }
    
    async getCurrentUser(): Promise<User> {
        const query = `
            query Me {
                me {
                    id
                    name
                    email
                    phone
                    address
                    birth_date
                    avatar
                    avatar_original_name
                    avatar_size
                    is_admin
                    is_active
                    email_verified_at
                    created_at
                    updated_at
                }
            }
        `
        const response = await this.request(query)
        return response.me
    }
    
    async validateAuthToken(): Promise<TokenValidation> {
        const query = `
            query ValidateToken {
                validateToken {
                    valid
                    expires_at
                    user {
                        id
                        name
                        email
                        is_admin
                    }
                }
            }
        `
        const response = await this.request(query)
        return response.validateToken
    }
    
    // ==================== PRODUITS ====================
    
    async getAllProducts(first: number = 20, page?: number, name?: string, category_id?: string): Promise<ProductCBD[]> {
        const query = `
            query ProductsCBD($first: Int, $page: Int, $name: String, $category_id: ID) {
                productsCBD(first: $first, page: $page, name: $name, category_id: $category_id) {
                    id
                    name
                    description
                    price
                    stock
                    images
                    analysis_file
                    analysis_image
                    categories {
                        id
                        name
                        description
                        created_at
                    }
                    suppliers {
                        id
                        name
                        email
                        phone
                        address
                        website
                        contact_person
                        description
                    }
                    created_at
                    updated_at
                }
            }
        `
        const response = await this.request(query, { first, page, name, category_id })
        return response.productsCBD
    }
    
    async getProductById(id: string): Promise<ProductCBD> {
        const query = `
            query ProductCBD($id: ID!) {
                productCBD(id: $id) {
                    id
                    name
                    description
                    price
                    stock
                    images
                    analysis_file
                    analysis_image
                    categories {
                        id
                        name
                        description
                        created_at
                    }
                    suppliers {
                        id
                        name
                        email
                        phone
                        address
                        website
                        contact_person
                        description
                    }
                    created_at
                    updated_at
                }
            }
        `
        const response = await this.request(query, { id })
        return response.productCBD
    }
    
    async searchProductsAdvanced(
        query?: string,
        first: number = 20,
        page?: number,
        category_id?: string,
        min_price?: number,
        max_price?: number,
        in_stock?: boolean
    ): Promise<ProductCBD[]> {
        const gqlQuery = `
            query SearchProducts(
                $query: String,
                $first: Int,
                $page: Int,
                $category_id: ID,
                $min_price: Float,
                $max_price: Float,
                $in_stock: Boolean
            ) {
                searchProducts(
                    query: $query,
                    first: $first,
                    page: $page,
                    category_id: $category_id,
                    min_price: $min_price,
                    max_price: $max_price,
                    in_stock: $in_stock
                ) {
                    id
                    name
                    description
                    price
                    stock
                    images
                    analysis_file
                    analysis_image
                    categories {
                        id
                        name
                    }
                    created_at
                    updated_at
                }
            }
        `
        const response = await this.request(gqlQuery, {
            query,
            first,
            page,
            category_id,
            min_price,
            max_price,
            in_stock
        })
        return response.searchProducts
    }
    
    async findProductsByName(name: string, limit: number = 10): Promise<ProductCBD[]> {
        const query = `
            query SearchProductsByName($name: String!, $limit: Int) {
                searchProductsByName(name: $name, limit: $limit) {
                    id
                    name
                    description
                    price
                    stock
                    images
                    categories {
                        id
                        name
                    }
                    created_at
                    updated_at
                }
            }
        `
        const response = await this.request(query, { name, limit })
        return response.searchProductsByName
    }
    
    async createNewProduct(input: CreateProductCBDInput): Promise<ProductCBD> {
        const mutation = `
            mutation CreateProductCBD($input: CreateProductCBDInput!) {
                createProductCBD(input: $input) {
                    id
                    name
                    description
                    price
                    stock
                    images
                    analysis_file
                    analysis_image
                    categories {
                        id
                        name
                    }
                    created_at
                    updated_at
                }
            }
        `
        const response = await this.request(mutation, { input })
        return response.createProductCBD
    }
    
    async updateExistingProduct(id: string, input: UpdateProductCBDInput): Promise<ProductCBD> {
        const mutation = `
            mutation UpdateProductCBD($id: ID!, $input: UpdateProductCBDInput!) {
                updateProductCBD(id: $id, input: $input) {
                    id
                    name
                    description
                    price
                    stock
                    images
                    analysis_file
                    analysis_image
                    categories {
                        id
                        name
                    }
                    updated_at
                }
            }
        `
        const response = await this.request(mutation, { id, input })
        return response.updateProductCBD
    }
    
    async deleteExistingProduct(id: string): Promise<DeleteResponse> {
        const mutation = `
            mutation DeleteProduct($id: ID!) {
                deleteProduct(id: $id) {
                    success
                    message
                }
            }
        `
        const response = await this.request(mutation, { id })
        return response.deleteProduct
    }
    
    // ==================== PANIER ====================
    
    async getUserCart(): Promise<Cart[]> {
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
                        stock
                        images
                        categories {
                            id
                            name
                        }
                    }
                    created_at
                }
            }
        `
        const response = await this.request(query)
        return response.myCart
    }
    
    async getUserCartSummary(): Promise<CartSummary> {
        const query = `
            query CartSummary {
                cartSummary {
                    totalItems
                    totalPrice
                    estimatedShipping
                    totalWithShipping
                    items {
                        id
                        quantity
                        subtotal
                        product {
                            id
                            name
                            price
                            images
                        }
                    }
                }
            }
        `
        const response = await this.request(query)
        return response.cartSummary
    }
    
    async getCartProductSuggestions(limit: number = 5, type: SuggestionType = SuggestionType.ALL): Promise<ProductSuggestion[]> {
        const query = `
            query CartSuggestions($limit: Int, $type: SuggestionType) {
                cartSuggestions(limit: $limit, type: $type) {
                    id
                    name
                    price
                    images
                    reason
                    confidence
                }
            }
        `
        const response = await this.request(query, { limit, type })
        return response.cartSuggestions
    }
    
    async addProductToCart(input: AddToCartInput): Promise<Cart> {
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
                        price
                        images
                    }
                    created_at
                }
            }
        `
        const response = await this.request(mutation, { input })
        return response.addToCart
    }
    
    // ==================== COMMANDES ====================
    
    async processCheckout(): Promise<Order> {
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
                        price
                        images
                        pivot {
                            quantity
                            unit_price
                        }
                    }
                }
            }
        `
        const response = await this.request(mutation)
        return response.checkout
    }
    
    async getAllOrders(): Promise<Order[]> {
        const query = `
            query Orders {
                orders {
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
                        price
                        images
                        pivot {
                            quantity
                            unit_price
                        }
                    }
                }
            }
        `
        const response = await this.request(query)
        return response.orders
    }
    
    async getUserOrders(): Promise<Order[]> {
        const query = `
            query MyOrders {
                myOrders {
                    id
                    user_id
                    total
                    status
                    created_at
                    updated_at
                    products {
                        id
                        name
                        price
                        images
                        pivot {
                            quantity
                            unit_price
                        }
                    }
                }
            }
        `
        const response = await this.request(query)
        return response.myOrders
    }
    
    // ==================== CATÉGORIES ====================
    
    async getAllCategories(): Promise<Category[]> {
        const query = `
            query Categories {
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
        const response = await this.request(query)
        return response.categories
    }
    
    async getCategoryById(id: string): Promise<Category> {
        const query = `
            query Category($id: ID!) {
                category(id: $id) {
                    id
                    name
                    description
                    created_at
                    products {
                        id
                        name
                        price
                        stock
                        images
                    }
                }
            }
        `
        const response = await this.request(query, { id })
        return response.category
    }
    
    async getCategoriesWithProductCounts(): Promise<CategoryWithCounts[]> {
        const query = `
            query CategoriesWithCounts {
                categoriesWithCounts {
                    id
                    name
                    slug
                    description
                    productCount
                    parentId
                    level
                    children {
                        id
                        name
                        productCount
                    }
                    isActive
                    displayOrder
                    imageUrl
                }
            }
        `
        const response = await this.request(query)
        return response.categoriesWithCounts
    }
    
    async getCategoriesListView(): Promise<CategoryList[]> {
        const query = `
            query CategoriesList {
                categoriesList {
                    id
                    name
                    slug
                    description
                    products_count
                }
            }
        `
        const response = await this.request(query)
        return response.categoriesList
    }
    
    async createNewCategory(input: CreateCategoryInput): Promise<Category> {
        const mutation = `
            mutation CreateCategory($input: CreateCategoryInput!) {
                createCategory(input: $input) {
                    id
                    name
                    description
                    created_at
                }
            }
        `
        const response = await this.request(mutation, { input })
        return response.createCategory
    }
}

// Instance exportée
export const unifiedGraphQLService = new UnifiedGraphQLService()
