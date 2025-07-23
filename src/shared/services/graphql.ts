// Service GraphQL centralisé pour WEB_INTRAFMC

import type { ApiError } from '@/shared/types/app'

export class GraphQLService {
    private endpoint = 'http://localhost:8000/graphql'
    private token: string | null = null

    setToken(token: string | null) {
        this.token = token
        if (token) {
            localStorage.setItem('auth_token', token)
        } else {
            localStorage.removeItem('auth_token')
        }
    }

    getToken(): string | null {
        if (!this.token) {
            this.token = localStorage.getItem('auth_token')
        }
        return this.token
    }

    private getHeaders(): Record<string, string> {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }

        const token = this.getToken()
        if (token) {
            headers['Authorization'] = `Bearer ${token}`
        }

        return headers
    }

    async request<T = any>(query: string, variables?: any): Promise<T> {
        try {
            const response = await fetch(this.endpoint, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({
                    query,
                    variables
                })
            })

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status} ${response.statusText}`)
            }

            const result = await response.json()

            if (result.errors) {
                const error = result.errors[0]
                throw new GraphQLError(error.message, error.extensions)
            }

            return result.data
        } catch (error) {
            if (error instanceof GraphQLError) {
                throw error
            }
            throw new GraphQLError(
                error instanceof Error ? error.message : 'Une erreur inconnue est survenue'
            )
        }
    }

    // Méthodes pour l'authentification
    async login(email: string, password: string) {
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
            avatar
            is_admin
            is_active
            email_verified_at
          }
        }
      }
    `
        return this.request(query, { email, password })
    }

    async logout() {
        const query = `
      mutation Logout {
        logout {
          message
        }
      }
    `
        return this.request(query)
    }

    async getMe() {
        const query = `
      query Me {
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

    // Méthodes pour les produits
    async getProducts(page = 1, perPage = 10) {
        const query = `
      query Products($page: Int, $per_page: Int) {
        products(page: $page, per_page: $per_page) {
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
          }
          pagination {
            total
            per_page
            current_page
            last_page
            from
            to
          }
        }
      }
    `
        return this.request(query, { page, per_page: perPage })
    }

    async getProduct(id: string) {
        const query = `
      query Product($id: ID!) {
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

    // Méthodes pour le panier
    async getCart() {
        const query = `
      query MyCart {
        myCart {
          id
          user_id
          product_id
          quantity
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
          created_at
          updated_at
        }
      }
    `
        return this.request(query)
    }

    async getCartTotal() {
        const query = `
      query CartTotal {
        cartTotal {
          total
          itemCount
        }
      }
    `
        return this.request(query)
    }

    async addToCart(productId: string, quantity: number) {
        const query = `
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
            stock
          }
          created_at
          updated_at
        }
      }
    `
        return this.request(query, {
            input: {
                product_id: productId,
                quantity
            }
        })
    }

    // Méthodes pour les commandes
    async getOrders() {
        const query = `
      query Orders {
        orders {
          id
          user {
            id
            name
            email
          }
          total
          status
          products {
            id
            name
            price
            pivot {
              quantity
              unit_price
            }
          }
          created_at
          updated_at
        }
      }
    `
        return this.request(query)
    }

    async checkout() {
        const query = `
      mutation Checkout {
        checkout {
          id
          user {
            id
            name
            email
          }
          total
          status
          products {
            id
            name
            price
            pivot {
              quantity
              unit_price
            }
          }
          created_at
          updated_at
        }
      }
    `
        return this.request(query)
    }

    // Méthodes pour les catégories
    async getCategories() {
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
        return this.request(query)
    }

    // Méthodes pour les arrivages (admin)
    async getArrivals() {
        const query = `
      query Arrivals {
        arrivals {
          id
          amount
          status
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
          created_at
          updated_at
        }
      }
    `
        return this.request(query)
    }

    async createArrival(input: any) {
        const query = `
      mutation CreateArrival($input: CreateArrivalInput!) {
        createArrival(input: $input) {
          id
          amount
          status
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
          created_at
          updated_at
        }
      }
    `
        return this.request(query, { input })
    }
}

export class GraphQLError extends Error {
    public extensions?: any

    constructor(message: string, extensions?: any) {
        super(message)
        this.name = 'GraphQLError'
        this.extensions = extensions
    }
}

// Instance singleton
export const graphqlService = new GraphQLService()
