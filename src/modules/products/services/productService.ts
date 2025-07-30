import { graphqlService } from '../../../shared/services/graphql'
import type { Product, CreateProductInput, UpdateProductInput, ProductsResponse, PaginatorInfo } from '../types'

export const productService = {
  async getProducts(first: number = 10, page: number = 1): Promise<ProductsResponse> {
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
                        created_at
                        updated_at
                    }
                }
            }
        `

    const response = await graphqlService.request(query, { first, page })
    return response.products
  },

  async getProductById(id: string): Promise<Product> {
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
                    created_at
                    updated_at
                }
            }
        `

    const response = await graphqlService.request(query, { id })
    return response.product
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
                    analysis_file
                    analysis_file_url
                    category_id
                    categories {
                        id
                        name
                    }
                    suppliers {
                        id
                        name
                        email
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
                    analysis_file
                    analysis_file_url
                    category_id
                    categories {
                        id
                        name
                    }
                    suppliers {
                        id
                        name
                        email
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
