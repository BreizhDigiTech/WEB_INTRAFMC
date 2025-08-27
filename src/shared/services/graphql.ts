// Service GraphQL centralisé pour WEB_INTRAFMC

import { graphqlCache } from '@/shared/cache/graphqlCache'

export class GraphQLService {
  private endpoint: string
  private token: string | null = null
  private useCache: boolean = true

  constructor() {
    this.endpoint = this.getEndpoint()
  }

  private getEndpoint(): string {
    const envEndpoint = (import.meta as any).env?.VITE_GRAPHQL_ENDPOINT as string
    
    if (!envEndpoint) {
      console.warn('VITE_GRAPHQL_ENDPOINT non défini, utilisation de la valeur par défaut')
      return 'http://localhost/graphql'
    }
    
    // Validation de l'URL
    try {
      new URL(envEndpoint)
      return envEndpoint
    } catch (error) {
      console.error('VITE_GRAPHQL_ENDPOINT invalide:', envEndpoint)
      throw new Error('Configuration GraphQL endpoint invalide')
    }
  }

  setToken(token: string | null) {
    this.token = token
    if (token) {
      localStorage.setItem('auth_token', token)
    } else {
      localStorage.removeItem('auth_token')
    }
  }

  // Upload d'un fichier via une mutation GraphQL dédiée (ex: testUpload(file: Upload!): String)
  async uploadGraphqlSingle(file: File, mutationName: string = 'testUpload'): Promise<string> {
    const query = `mutation($file: Upload!) { ${mutationName}(file: $file) }`
    const variables = { file: null }
    const filesMap: Record<string, File> = { 'variables.file': file }
    const data = await this.requestMultipart<{ [key: string]: string }>(query, variables, filesMap)
    const key = mutationName
    const value = (data as any)?.[key]
    if (!value || typeof value !== 'string') {
      throw new GraphQLError(`Upload mutation "${mutationName}" did not return a string path`)
    }
    return value
  }
  // Upload de fichier via FormData vers une route REST dédiée
  // Hypothèse: endpoint REST d'upload disponible à /api/upload (même host que GraphQL)
  // Configurable via VITE_UPLOAD_PATH (ex: "/api/upload" ou "/upload").
  async uploadFile(file: File, folder: string = 'products'): Promise<string> {
    // 1) URL absolue prioritaire
    const envUploadUrl = (import.meta as any).env?.VITE_UPLOAD_URL as string | undefined
    // 2) Sinon construit depuis la base de l'endpoint GraphQL + PATH
    const base = this.endpoint.replace(/\/?graphql$/, '')
    const uploadPath = (import.meta as any).env?.VITE_UPLOAD_PATH || '/upload'
    const url = envUploadUrl || (base + uploadPath)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', folder)

    const headers: Record<string, string> = { 'Accept': 'application/json' }
    const token = this.getToken()
    if (token) headers['Authorization'] = `Bearer ${token}`

    const resp = await fetch(url, {
      method: 'POST',
      headers,
      body: formData
    })

    if (!resp.ok) {
      throw new GraphQLError(`Upload failed: ${resp.status} ${resp.statusText}`)
    }

  const data = await resp.json().catch(() => ({}))

  // Tente plusieurs clés possibles renvoyées par l'API
  const value = data?.url || data?.path || data?.filename || data?.file || data?.data?.url || data?.data?.path || ''
    if (!value) {
      throw new GraphQLError('Upload succeeded but no file path/url returned')
    }
    return value as string
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

  async request<T = any>(query: string, variables?: any, options?: { useCache?: boolean, cacheTTL?: number }): Promise<T> {
    const shouldUseCache = options?.useCache !== false && this.useCache && this.isQueryCacheable(query)
    
    // Vérifier le cache d'abord (seulement pour les queries, pas les mutations)
    if (shouldUseCache) {
      const cached = graphqlCache.get<T>(query, variables)
      if (cached) {
        return cached
      }
    }

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30s timeout

      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          query,
          variables
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        if (response.status === 401) {
          // Token expiré, nettoyer le stockage
          this.setToken(null)
          throw new GraphQLError('Session expirée, veuillez vous reconnecter')
        }
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()

      if (result.errors) {
        const error = result.errors[0]
        // Log détaillé pour debug en développement
        if (import.meta.env.DEV) {
          console.error('GraphQL Error:', error)
        }
        throw new GraphQLError(error.message, error.extensions)
      }

      // Mettre en cache le résultat si applicable
      if (shouldUseCache && result.data) {
        graphqlCache.set(query, result.data, variables, options?.cacheTTL)
      }

      return result.data
    } catch (error) {
      if (error instanceof GraphQLError) {
        throw error
      }
      if (error instanceof Error && error.name === 'AbortError') {
        throw new GraphQLError('Requête timeout - veuillez réessayer')
      }
      throw new GraphQLError(
        error instanceof Error ? error.message : 'Une erreur inconnue est survenue'
      )
    }
  }

  /**
   * Détermine si une requête peut être mise en cache
   */
  private isQueryCacheable(query: string): boolean {
    const trimmedQuery = query.trim().toLowerCase()
    return trimmedQuery.startsWith('query') || (!trimmedQuery.startsWith('mutation') && !trimmedQuery.startsWith('subscription'))
  }

  /**
   * Invalide le cache pour un type d'entité
   */
  invalidateCache(entityType: string): void {
    graphqlCache.invalidateByPattern(entityType.toLowerCase())
  }

  // Requête GraphQL en multipart/form-data (spec GraphQL multipart request)
  async requestMultipart<T = any>(
    query: string,
    variables: any,
    filesMap: Record<string, File>
  ): Promise<T> {
    console.log('=== REQUÊTE MULTIPART GRAPHQL ===')
    console.log('Endpoint:', this.endpoint)
    console.log('Query:', query)
    console.log('Variables:', variables)
    console.log('Files map:', Object.keys(filesMap))
    
    try {
      const form = new FormData()

      // operations
      const operations = { query, variables }
      console.log('Operations à envoyer:', operations)
      form.append('operations', JSON.stringify(operations))

      // map: { "0": ["variables.input.images.0"], ... }
      const map: Record<string, string[]> = {}
      const entries = Object.entries(filesMap)
      entries.forEach(([path], idx) => {
        map[String(idx)] = [path]
      })
      console.log('Map à envoyer:', map)
      form.append('map', JSON.stringify(map))

      // fichiers indexés
      entries.forEach(([path, file], idx) => {
        console.log(`Fichier ${idx} (${path}):`, file.name, `${file.size} bytes, type: ${file.type}`)
        form.append(String(idx), file)
      })

      const headers: Record<string, string> = { 'Accept': 'application/json' }
      const token = this.getToken()
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
        console.log('Token inclus dans la requête')
      }

      console.log('Envoi de la requête multipart...')
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers, // ne pas définir Content-Type pour laisser le boundary
        body: form
      })

      console.log('Réponse reçue - Status:', response.status, response.statusText)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Erreur HTTP - Body:', errorText)
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()
      console.log('Résultat parsé:', result)

      if (result.errors) {
        console.error('❌ Erreurs GraphQL détaillées:', result.errors)
        result.errors.forEach((err: any, index: number) => {
          console.error(`Erreur ${index + 1}:`, {
            message: err.message,
            locations: err.locations,
            path: err.path,
            extensions: err.extensions
          })
        })
        const error = result.errors[0]
        throw new GraphQLError(error.message, error.extensions)
      }

      console.log('✅ Requête multipart réussie')
      return result.data
    } catch (error) {
      console.error('❌ Erreur dans requestMultipart:', error)
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
          // suppliers supprimés selon consigne
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
