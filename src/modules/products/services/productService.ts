import { graphqlService } from '../../../shared/services/graphql'
import type { CreateProductInput, Product, ProductsResponse, UpdateProductInput } from '../types'

export const productService = {
    async uploadProductImages(productId: string, files: File[]): Promise<string[]> {
        console.log('Upload des images - Produit ID:', productId, 'Nombre de fichiers:', files.length)
        
        // Essayons différentes signatures basées sur les erreurs GraphQL
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
            console.log(`Fichier ${index}:`, file.name, file.size, 'bytes, type:', file.type)
            filesMap[`variables.images.${index}`] = file
        })
        
        console.log('Variables GraphQL (tentative 1):', variables)
        console.log('Files map:', Object.keys(filesMap))
        
        try {
            const result = await graphqlService.requestMultipart(mutation, variables, filesMap)
            console.log('✅ Upload réussi:', result)
            
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
            console.error('❌ Tentative 1 échouée, erreur:', error)
            
            // Tentative 2 : Essayons avec la signature de la documentation
            console.log('🔄 Tentative 2 avec signature documentée...')
            
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
            
            console.log('Variables GraphQL (tentative 2):', variables2)
            
            try {
                const result2 = await graphqlService.requestMultipart(mutation2, variables2, filesMap2)
                console.log('✅ Upload réussi (tentative 2):', result2)
                
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
            } catch (error2) {
                console.error('❌ Tentative 2 aussi échouée:', error2)
                throw error2
            }
        }
    },
    
    async uploadSingleProductImage(file: File): Promise<string> {
        // Pour un seul fichier, utilisons une approche plus simple
        const mutation = `
            mutation UploadSingleImage($file: Upload!) {
                uploadSingleImage(file: $file)
            }
        `
        
        const variables = { file: null }
        const filesMap = { 'variables.file': file }
        
        try {
            const result = await graphqlService.requestMultipart(mutation, variables, filesMap)
            return result.uploadSingleImage
        } catch (error) {
            console.warn('Mutation uploadSingleImage non disponible, tentative avec createProductWithFiles')
            throw error
        }
    },

    async uploadAnalysisFile(productId: string, file: File): Promise<string> {
        console.log('Upload du fichier d\'analyse - Produit ID:', productId, 'Fichier:', file.name)
        
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
        
        try {
            const result = await graphqlService.requestMultipart(mutation, variables, filesMap)
            console.log('✅ Upload du fichier d\'analyse réussi:', result)
            
            // Retourner directement l'URL du fichier d'analyse
            return result.uploadProductAnalysisFile.analysis_file_url || ''
        } catch (error) {
            console.error('❌ Erreur lors de l\'upload du fichier d\'analyse:', error)
            throw error
        }
    },
    async createProductWithFiles(input: Omit<CreateProductInput, 'images' | 'analysis_image'> & { images?: File[]; analysis_file?: File | null }): Promise<Product> {
        console.log('=== CRÉATION PRODUIT AVEC FICHIERS ===')
        console.log('Input reçu:', input)
        console.log('Nombre d\'images:', input.images?.length || 0)
        console.log('Fichier d\'analyse:', input.analysis_file?.name || 'Aucun')
        
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
                analysis_image: input.analysis_file ? null : undefined  // Corrigé selon l'erreur GraphQL
            }
        }

        console.log('Variables GraphQL préparées:', variables)

        // map fichiers -> chemins GraphQL
        const filesMap: Record<string, File> = {}
        if (input.images && input.images.length) {
            input.images.forEach((file, idx) => {
                console.log(`Mapping image ${idx}:`, file.name, `(${file.size} bytes)`)
                filesMap[`variables.input.images.${idx}`] = file
            })
        }
        if (input.analysis_file) {
            console.log('Mapping fichier analyse:', input.analysis_file.name, `(${input.analysis_file.size} bytes)`)
            filesMap['variables.input.analysis_image'] = input.analysis_file  // Corrigé selon l'erreur GraphQL
        }

        console.log('Files map préparée:', Object.keys(filesMap))

        try {
            const data = await graphqlService.requestMultipart<{ createProduct: Product }>(
                mutation,
                variables,
                filesMap
            )
            console.log('✅ Produit créé avec succès:', (data as any).createProduct)
            return (data as any).createProduct
        } catch (error) {
            console.error('❌ Erreur lors de la création du produit avec fichiers:', error)
            console.error('Variables envoyées:', variables)
            console.error('Fichiers mappés:', Object.keys(filesMap))
            throw error
        }
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

    const response = await graphqlService.request(query, { first, page })
    return response.productsCBD
  },

  async searchProducts(searchQuery: string, categoryId?: string, first: number = 20, page: number = 1): Promise<ProductsResponse> {
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
            mutation UpdateProduct($id: ID!, $input: UpdateProductInput!) {
                updateProduct(id: $id, input: $input) {
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
