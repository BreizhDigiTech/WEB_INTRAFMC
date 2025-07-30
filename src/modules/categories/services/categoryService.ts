import { graphqlService } from '../../../shared/services/graphql'
import type { Category, CreateCategoryInput, UpdateCategoryInput } from '../types'

export const categoryService = {
  async getCategories(first: number = 50, page: number = 1): Promise<Category[]> {
    const query = `
            query GetCategories($first: Int, $page: Int) {
                categories(first: $first, page: $page) {
                    data {
                        id
                        name
                        description
                        created_at
                    }
                }
            }
        `
    const response = await graphqlService.request(query, { first, page })
    return response.categories.data
  },

  async getCategory(id: string): Promise<Category> {
    const query = `
            query GetCategory($id: ID!) {
                category(id: $id) {
                    id
                    name
                    description
                    created_at
                }
            }
        `
    const response = await graphqlService.request(query, { id })
    return response.category
  },

  async createCategory(input: CreateCategoryInput): Promise<Category> {
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
    const response = await graphqlService.request(mutation, { input })
    return response.createCategory
  },

  async updateCategory(id: string, input: UpdateCategoryInput): Promise<Category> {
    const mutation = `
            mutation UpdateCategory($id: ID!, $input: UpdateCategoryInput!) {
                updateCategory(id: $id, input: $input) {
                    id
                    name
                    description
                    created_at
                }
            }
        `
    const response = await graphqlService.request(mutation, { id, input })
    return response.updateCategory
  },

  async deleteCategory(id: string): Promise<void> {
    const mutation = `
            mutation DeleteCategory($id: ID!) {
                deleteCategory(id: $id) {
                    success
                    message
                }
            }
        `
    await graphqlService.request(mutation, { id })
  }
}
