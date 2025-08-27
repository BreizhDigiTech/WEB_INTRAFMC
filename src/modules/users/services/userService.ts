import { GraphQLService } from '@/shared/services/graphql'
import type {
  ApiResponse,
  CreateUserInput,
  PaginatedUsers,
  UpdateUserInput,
  User,
  UserListFilters
} from '../types'

/**
 * Service pour la gestion des utilisateurs (Admin uniquement)
 */
export class UserService extends GraphQLService {

  /**
   * Récupère la liste des utilisateurs avec pagination
   */
  async getUsers(filters: UserListFilters = {}): Promise<PaginatedUsers> {
    const query = `
      query Users($first: Int, $page: Int) {
        users(first: $first, page: $page) {
          data {
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
          paginatorInfo {
            currentPage
            lastPage
            total
            perPage
          }
        }
      }
    `

    const variables = {
      first: filters.first || 10,
      page: filters.page || 1
    }

    try {
      const response = await this.request(query, variables)
      
      if (!response.users || !response.users.data || !response.users.paginatorInfo) {
        throw new Error('Structure de réponse API inattendue')
      }

      let users = response.users.data
      const paginationInfo = {
        current_page: response.users.paginatorInfo.currentPage,
        last_page: response.users.paginatorInfo.lastPage,
        total: response.users.paginatorInfo.total,
        per_page: response.users.paginatorInfo.perPage
      }
      
      // Appliquer les filtres côté client si nécessaire
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        users = users.filter((user: User) => 
          user.name?.toLowerCase().includes(searchTerm) ||
          user.email?.toLowerCase().includes(searchTerm) ||
          user.phone?.toLowerCase().includes(searchTerm)
        )
      }
      
      if (filters.is_admin !== undefined) {
        users = users.filter((user: User) => user.is_admin === filters.is_admin)
      }
      
      if (filters.is_active !== undefined) {
        users = users.filter((user: User) => user.is_active === filters.is_active)
      }

      return {
        data: users,
        current_page: paginationInfo.current_page,
        last_page: paginationInfo.last_page,
        total: paginationInfo.total,
        per_page: paginationInfo.per_page
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error)
      throw new Error('Impossible de récupérer la liste des utilisateurs')
    }
  }

  /**
   * Récupère les détails d'un utilisateur
   */
  async getUser(id: string): Promise<User> {
    const query = `
      query User($id: ID!) {
        user(id: $id) {
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

    try {
      const response = await this.request(query, { id })
      return response.user
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error)
      throw new Error('Impossible de récupérer les détails de l\'utilisateur')
    }
  }

  /**
   * Crée un nouveau utilisateur (utilise register de l'API)
   */
  async createUser(input: CreateUserInput): Promise<User> {
    const mutation = `
      mutation Register(
        $name: String!
        $email: String!
        $password: String!
        $password_confirmation: String!
      ) {
        register(
          name: $name
          email: $email
          password: $password
          password_confirmation: $password_confirmation
        ) {
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

    try {
      const registerData = {
        name: input.name,
        email: input.email,
        password: input.password,
        password_confirmation: input.password_confirmation
      }
      
      const response = await this.request(mutation, registerData)
      
      // Si d'autres champs ont été fournis, on met à jour l'utilisateur
      const createdUser = response.register.user
      if (input.phone || input.address || input.birth_date || input.is_admin !== undefined || input.is_active !== undefined) {
        const updateInput: UpdateUserInput = {
          id: createdUser.id,
          ...(input.phone && { phone: input.phone }),
          ...(input.address && { address: input.address }),
          ...(input.birth_date && { birth_date: input.birth_date }),
          ...(input.is_admin !== undefined && { is_admin: input.is_admin }),
          ...(input.is_active !== undefined && { is_active: input.is_active })
        }
        
        return await this.updateUser(updateInput)
      }
      
      return createdUser
    } catch (error: any) {
      console.error('Erreur lors de la création de l\'utilisateur:', error)
      throw new Error(error.message || 'Impossible de créer l\'utilisateur')
    }
  }

  /**
   * Met à jour un utilisateur
   */
  async updateUser(input: UpdateUserInput): Promise<User> {
    const mutation = `
      mutation UpdateUser(
        $id: ID!
        $name: String
        $email: String
        $phone: String
        $address: String
        $birth_date: Date
        $is_active: Boolean
        $is_admin: Boolean
      ) {
        updateUser(
          id: $id
          name: $name
          email: $email
          phone: $phone
          address: $address
          birth_date: $birth_date
          is_active: $is_active
          is_admin: $is_admin
        ) {
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

    try {
      // Exclure le champ avatar des variables car l'API ne le supporte pas
      const { avatar, ...updateVariables } = input
      const response = await this.request(mutation, updateVariables)
      return response.updateUser
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error)
      throw new Error(error.message || 'Impossible de mettre à jour l\'utilisateur')
    }
  }

  /**
   * Supprime un utilisateur
   */
  async deleteUser(id: string): Promise<ApiResponse> {
    const mutation = `
      mutation DeleteUser($id: ID!) {
        deleteUser(id: $id) {
          success
          message
        }
      }
    `

    try {
      const response = await this.request(mutation, { id })
      return response.deleteUser
    } catch (error: any) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error)
      throw new Error(error.message || 'Impossible de supprimer l\'utilisateur')
    }
  }

  /**
   * Validation des données utilisateur
   */
  validateUserData(data: Partial<CreateUserInput>): string[] {
    const errors: string[] = []

    if (!data.name || data.name.trim().length < 2) {
      errors.push('Le nom doit contenir au moins 2 caractères')
    }

    if (!data.email || !this.isValidEmail(data.email)) {
      errors.push('L\'adresse email est invalide')
    }

    if (!data.password || data.password.length < 8) {
      errors.push('Le mot de passe doit contenir au moins 8 caractères')
    }

    if (data.password !== data.password_confirmation) {
      errors.push('La confirmation du mot de passe ne correspond pas')
    }

    if (data.phone && !this.isValidPhone(data.phone)) {
      errors.push('Le numéro de téléphone est invalide')
    }

    return errors
  }

  /**
   * Validation des données de mise à jour
   */
  validateUpdateData(data: Partial<UpdateUserInput>): string[] {
    const errors: string[] = []

    if (data.name && data.name.trim().length < 2) {
      errors.push('Le nom doit contenir au moins 2 caractères')
    }

    if (data.email && !this.isValidEmail(data.email)) {
      errors.push('L\'adresse email est invalide')
    }

    if (data.phone && data.phone.trim() && !this.isValidPhone(data.phone)) {
      errors.push('Le numéro de téléphone est invalide')
    }

    return errors
  }

  /**
   * Utilitaires de validation
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^(?:(?:\+33|0)[1-9](?:[0-9]{8}))$/
    return phoneRegex.test(phone.replace(/[\s.-]/g, ''))
  }
}
