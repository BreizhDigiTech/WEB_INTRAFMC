import { graphqlService } from '../../../shared/services/graphql'
import type { CreateProductInput, Product, ProductsResponse, UpdateProductInput } from '../types'

export const productService = {
    async uploadProductImages(productId: string, files: File[]): Promise<string[]> {
        const mutation = `
            mutation UploadProductImages($productId: ID!, $images: [Upload!]!) {
                uploadProductImages(productId: $productId, images: $images) {
                    success
                    message
                }
            }
        `
        
        const variables = { productId, images: files.map(() => null) }
        const filesMap: Record<string, File> = {}
        files.forEach((file, index) => {
            filesMap[`variables.images.${index}`] = file
        })
        
        try {
            const _result = await graphqlService.requestMultipart(mutation, variables, filesMap)
            
            // Recharger le produit pour obtenir les nouvelles URLs d'images
            const getProductQuery = `
                query GetProduct($id: ID!) {
                    productCBD(id: $id) {
                        image_urls
                    }
                }
            `
            const updatedProduct = await graphqlService.request(getProductQuery, { id: productId })
            return updatedProduct.productCBD.image_urls || []
        } catch (error) {
            // Tentative 2 : Essayons avec la signature de la documentation
            const mutation2 = `
                mutation UploadProductImages($productId: ID!, $files: [Upload!]!) {
                    uploadProductImages(product_id: $productId, files: $files) {
                        success
                        message
                    }
                }
            `
            
            const variables2 = { productId, files: files.map(() => null) }
            const filesMap2: Record<string, File> = {}
            files.forEach((file, index) => {
                filesMap2[`variables.files.${index}`] = file
            })
            
            const _result2 = await graphqlService.requestMultipart(mutation2, variables2, filesMap2)
            
            // Recharger le produit pour obtenir les nouvelles URLs d'images
            const getProductQuery = `
                query GetProduct($id: ID!) {
                    productCBD(id: $id) {
                        image_urls
                    }
                }
            `
            const updatedProduct = await graphqlService.request(getProductQuery, { id: productId })
            return updatedProduct.productCBD.image_urls || []
        }
    },
    
    async uploadSingleProductImage(file: File): Promise<string> {
        const mutation = `
            mutation UploadSingleImage($file: Upload!) {
                uploadSingleImage(file: $file)
            }
        `
        
        const variables = { file: null }
        const filesMap = { 'variables.file': file }
        
        const result = await graphqlService.requestMultipart(mutation, variables, filesMap)
        return result.uploadSingleImage
    },

    async uploadAnalysisFile(productId: string, file: File): Promise<string> {
        const mutation = `
            mutation UploadProductAnalysisFile($product_id: ID!, $file: Upload!) {
                uploadProductAnalysisFile(product_id: $product_id, file: $file) {
                    id
                    analysis_file_url
                }
            }
        `
        
        const variables = { product_id: productId, file: null }
        const filesMap = { 'variables.file': file }
        
        const result = await graphqlService.requestMultipart(mutation, variables, filesMap)
        return result.uploadProductAnalysisFile.analysis_file_url || ''
    },
    async createProductWithFiles(input: Omit<CreateProductInput, 'images' | 'analysis_image'> & { images?: File[]; analysis_file?: File | null }): Promise<Product> {
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
                analysis_image: input.analysis_file ? null : undefined
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
            filesMap['variables.input.analysis_image'] = input.analysis_file
        }

        const data = await graphqlService.requestMultipart<{ createProduct: Product }>(
            mutation,
            variables,
            filesMap
        )
        return (data as any).createProduct
    },
  async getProducts(_first: number = 10, _page: number = 1): Promise<ProductsResponse> {
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
                        image_urls
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

    const response = await graphqlService.request(query, { first: _first, page: _page })
    return response.productsCBD
  },

  async searchProducts(searchQuery: string, categoryId?: string, _first: number = 20, _page: number = 1): Promise<ProductsResponse> {
    // Pour la recherche côté client, nous devons récupérer tous les produits
    // Commençons par récupérer une grande quantité de produits
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
                        image_urls
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

    // Pour une recherche complète, récupérons le maximum de produits possible
    // Si vous avez plus de 1000 produits, il faudrait implémenter une pagination
    const response = await graphqlService.request(query, { 
      first: 1000, // Ajustez cette valeur selon vos besoins
      page: 1
    })
    
    return response.productsCBD
  },

  async getAllProductsForSearch(): Promise<ProductsResponse> {
    // Méthode spéciale pour récupérer tous les produits pour la recherche
    // On récupère d'abord une petite quantité pour connaître le total
    const firstQuery = `
            query GetProductsCount {
                productsCBD(first: 1, page: 1) {
                    paginatorInfo {
                        total
                    }
                }
            }
        `
    
    const countResponse = await graphqlService.request(firstQuery, {})
    const totalProducts = countResponse.productsCBD.paginatorInfo.total
    
    // Maintenant on récupère tous les produits
    const query = `
            query GetAllProducts($first: Int) {
                productsCBD(first: $first, page: 1) {
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
                        image_urls
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
    
    const response = await graphqlService.request(query, { 
      first: totalProducts // Récupérer exactement le nombre total de produits
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
                    image_urls
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
    console.log('Données envoyées à createProduct:', input)
    
    const mutation = `
            mutation CreateProduct($input: CreateProductInput!) {
                createProduct(input: $input) {
                    id
                    name
                    description
                    price
                    image_urls
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
            mutation UpdateProduct($id: ID!, $input: UpdateProductCBDInput!) {
                updateProductCBD(id: $id, input: $input) {
                    id
                    name
                    description
                    price
                    image_urls
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
    return response.updateProductCBD
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
  },

  async deleteProductImage(productId: string, imageUrl: string): Promise<string[]> {
    // Extraire le chemin relatif de l'URL complète
    // Exemple: http://localhost/API_INTRAFMC/public/products/huile-10.jpg -> products/huile-10.jpg
    let imagePath = imageUrl
    if (imageUrl.includes('/public/')) {
      imagePath = imageUrl.split('/public/')[1]
    }
    
    const mutation = `
      mutation RemoveProductImages($productId: ID!, $imagePaths: [String!]!) {
        removeProductImages(product_id: $productId, image_paths: $imagePaths) {
          id
          name
          images
          image_urls
        }
      }
    `

    const result = await graphqlService.request(mutation, { 
      productId, 
      imagePaths: [imagePath] 
    })
    
    return result.removeProductImages.image_urls || []
  }
}
