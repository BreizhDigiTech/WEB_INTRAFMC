import { graphqlService } from '../../../shared/services/graphql'
import type { CreateProductInput, Product, ProductsResponse, UpdateProductInput } from '../types'

export const productService = {
    async uploadProductImage(file: File): Promise<string> {
        return graphqlService.uploadFile(file, 'products')
    },
    async uploadAnalysisFile(file: File): Promise<string> {
        return graphqlService.uploadFile(file, 'products/analysis')
    },
        async uploadImageViaGraphql(file: File): Promise<string> {
            return graphqlService.uploadGraphqlSingle(file, (import.meta as any).env?.VITE_GRAPHQL_UPLOAD_MUTATION || 'testUpload')
        },
        async uploadPdfViaGraphql(file: File): Promise<string> {
            return graphqlService.uploadGraphqlSingle(file, (import.meta as any).env?.VITE_GRAPHQL_UPLOAD_MUTATION || 'testUpload')
        },
    async createProductWithFiles(input: Omit<CreateProductInput, 'images' | 'analysis_file'> & { images?: File[]; analysis_file?: File | null }): Promise<Product> {
        const mutation = `
            mutation CreateProduct($input: CreateProductInput!) {
                createProduct(input: $input) {
                    id
                    name
                    description
                    price
                    images
                    stock
                    analysis_file_url
                    categories { id name }
                    created_at
                    updated_at
                }
            }
        `

        // Variables: insérer des nulls aux emplacements des fichiers
        const variables: any = {
            input: {
                name: input.name,
                description: input.description,
                price: input.price,
                stock: input.stock,
                category_id: input.category_id,
                images: input.images && input.images.length ? new Array(input.images.length).fill(null) : undefined,
                analysis_file: input.analysis_file ? null : undefined
            }
        }

        // map fichiers -> chemins GraphQL
        const filesMap: Record<string, File> = {}
        if (input.images && input.images.length) {
            input.images.forEach((file, idx) => {
                filesMap[`variables.input.images.${idx}`] = file
            })
        }
        if (input.analysis_file) {
            filesMap['variables.input.analysis_file'] = input.analysis_file
        }

        const data = await graphqlService.requestMultipart<{ createProduct: Product }>(
            mutation,
            variables,
            filesMap
        )
        return (data as any).createProduct
    },
  async getProducts(first: number = 10, page: number = 1): Promise<ProductsResponse> {
    const query = `
            query GetProducts($first: Int, $page: Int) {
                productsCBD(first: $first, page: $page) {
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
                        analysis_file_url
                        category_id
                        categories {
                            id
                            name
                        }
                        created_at
                        updated_at
                    }
                }
            }
        `

    const response = await graphqlService.request(query, { first, page })
    return response.productsCBD
  },

  async searchProducts(searchQuery: string, categoryId?: string, first: number = 20, page: number = 1): Promise<ProductsResponse> {
    // Pour l'instant, utilisons la requête normale car les paramètres search et category_id ne sont pas supportés
    // Nous chargerons plus de produits pour avoir une meilleure recherche côté client
    const query = `
            query GetProducts($first: Int, $page: Int) {
                productsCBD(first: $first, page: $page) {
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
                        analysis_file_url
                        category_id
                        categories {
                            id
                            name
                        }
                        created_at
                        updated_at
                    }
                }
            }
        `

    // Pour une meilleure recherche, chargeons plus de produits
    const response = await graphqlService.request(query, { 
      first: Math.max(first, 100), // Minimum 100 produits pour une recherche efficace
      page: 1 // Toujours commencer à la page 1 pour la recherche
    })
    return response.productsCBD
  },

  async getProductById(id: string): Promise<Product> {
    const query = `
            query GetProduct($id: ID!) {
                productCBD(id: $id) {
                    id
                    name
                    description
                    price
                    images
                    stock
                    analysis_file_url
                    categories {
                        id
                        name
                        description
                    }
                    created_at
                    updated_at
                }
            }
        `

    const response = await graphqlService.request(query, { id })
    return response.productCBD
  },

  async createProduct(input: CreateProductInput): Promise<Product> {
    const mutation = `
            mutation CreateProduct($input: CreateProductInput!) {
                createProduct(input: $input) {
                    id
                    name
                    description
                    price
                    images
                    stock
                    analysis_file_url
                    categories {
                        id
                        name
                    }
                    created_at
                    updated_at
                }
            }
        `

    const response = await graphqlService.request(mutation, { input })
    return response.createProduct
  },

  async updateProduct(id: string, input: UpdateProductInput): Promise<Product> {
    const mutation = `
            mutation UpdateProduct($id: ID!, $input: UpdateProductInput!) {
                updateProduct(id: $id, input: $input) {
                    id
                    name
                    description
                    price
                    images
                    stock
                    analysis_file_url
                    categories {
                        id
                        name
                    }
                    created_at
                    updated_at
                }
            }
        `

    const response = await graphqlService.request(mutation, { id, input })
    return response.updateProduct
  },

  async deleteProduct(id: string): Promise<void> {
    const mutation = `
            mutation DeleteProduct($id: ID!) {
                deleteProduct(id: $id) {
                    success
                    message
                }
            }
        `

    await graphqlService.request(mutation, { id })
  }
}
