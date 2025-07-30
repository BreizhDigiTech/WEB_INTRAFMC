import { graphqlService } from '@/shared/services/graphql'
import type {
    Supplier,
    CreateSupplierInput,
    UpdateSupplierInput,
    SupplierDeleteResponse
} from '../types'

// Queries GraphQL
const GET_SUPPLIERS = `
  query GetSuppliers {
    suppliers {
      id
      name
      contact_email
      phone
      address
      created_at
      updated_at
      products {
        id
        name
        price
        stock
      }
    }
  }
`

const GET_SUPPLIER = `
  query GetSupplier($id: ID!) {
    supplier(id: $id) {
      id
      name
      contact_email
      phone
      address
      created_at
      updated_at
      products {
        id
        name
        description
        price
        stock
        categories {
          id
          name
        }
      }
    }
  }
`

const CREATE_SUPPLIER = `
  mutation CreateSupplier($input: CreateSupplierInput!) {
    createSupplier(input: $input) {
      id
      name
      contact_email
      phone
      address
      created_at
      updated_at
    }
  }
`

const UPDATE_SUPPLIER = `
  mutation UpdateSupplier($id: ID!, $input: UpdateSupplierInput!) {
    updateSupplier(id: $id, input: $input) {
      id
      name
      contact_email
      phone
      address
      updated_at
    }
  }
`

const DELETE_SUPPLIER = `
  mutation DeleteSupplier($id: ID!) {
    deleteSupplier(id: $id) {
      success
      message
    }
  }
`

const ATTACH_SUPPLIER_TO_PRODUCT = `
  mutation AttachSupplierToProduct($supplier_id: ID!, $product_id: ID!) {
    attachSupplierToProduct(supplier_id: $supplier_id, product_id: $product_id) {
      id
      name
      contact_email
      products {
        id
        name
        price
      }
    }
  }
`

const DETACH_SUPPLIER_FROM_PRODUCT = `
  mutation DetachSupplierFromProduct($supplier_id: ID!, $product_id: ID!) {
    detachSupplierFromProduct(supplier_id: $supplier_id, product_id: $product_id) {
      id
      name
      products {
        id
        name
      }
    }
  }
`

export const supplierService = {
    async getSuppliers(): Promise<Supplier[]> {
        try {
            console.log('🔍 Récupération des fournisseurs...')
            const response = await graphqlService.request(GET_SUPPLIERS)
            console.log('✅ Fournisseurs récupérés:', response)
            return response?.suppliers || []
        } catch (error) {
            console.error('❌ Erreur lors de la récupération des fournisseurs:', error)
            throw error
        }
    },

    async getSupplier(id: string): Promise<Supplier | null> {
        try {
            const response = await graphqlService.request(GET_SUPPLIER, { id })
            return response?.supplier || null
        } catch (error) {
            console.error('Erreur lors de la récupération du fournisseur:', error)
            throw error
        }
    },

    async createSupplier(input: CreateSupplierInput): Promise<Supplier> {
        try {
            console.log('🔨 Création du fournisseur avec input:', input)
            const response = await graphqlService.request(CREATE_SUPPLIER, { input })
            console.log('✅ Fournisseur créé:', response)
            return response.createSupplier
        } catch (error) {
            console.error('❌ Erreur lors de la création du fournisseur:', error)
            throw error
        }
    },

    async updateSupplier(id: string, input: UpdateSupplierInput): Promise<Supplier> {
        try {
            const response = await graphqlService.request(UPDATE_SUPPLIER, { id, input })
            return response.updateSupplier
        } catch (error) {
            console.error('Erreur lors de la mise à jour du fournisseur:', error)
            throw error
        }
    },

    async deleteSupplier(id: string): Promise<SupplierDeleteResponse> {
        try {
            const response = await graphqlService.request(DELETE_SUPPLIER, { id })
            return response.deleteSupplier
        } catch (error) {
            console.error('Erreur lors de la suppression du fournisseur:', error)
            throw error
        }
    },

    async attachSupplierToProduct(supplierId: string, productId: string): Promise<Supplier> {
        try {
            const response = await graphqlService.request(ATTACH_SUPPLIER_TO_PRODUCT, {
                supplier_id: supplierId,
                product_id: productId
            })
            return response.attachSupplierToProduct
        } catch (error) {
            console.error('Erreur lors de l\'association du fournisseur au produit:', error)
            throw error
        }
    },

    async detachSupplierFromProduct(supplierId: string, productId: string): Promise<Supplier> {
        try {
            const response = await graphqlService.request(DETACH_SUPPLIER_FROM_PRODUCT, {
                supplier_id: supplierId,
                product_id: productId
            })
            return response.detachSupplierFromProduct
        } catch (error) {
            console.error('Erreur lors de la désassociation du fournisseur du produit:', error)
            throw error
        }
    }
}
