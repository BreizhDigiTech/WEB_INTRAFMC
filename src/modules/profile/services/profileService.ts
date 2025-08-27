import { GraphQLService } from '@/shared/services/graphql'
import type {
  ApiResponse,
  ChangePasswordInput,
  UpdateProfileInput,
  UserProfile
} from '../types'

/**
 * Service pour la gestion du profil utilisateur
 * Implémente les APIs GraphQL documentées pour le profil
 */
export class ProfileService extends GraphQLService {

  /**
   * Récupère le profil de l'utilisateur connecté
   */
  async getProfile(): Promise<UserProfile> {
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
          is_admin
          is_active
        }
      }
    `

    try {
      const response = await this.request(query)
      return response.me
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error)
      throw new Error('Impossible de récupérer le profil utilisateur')
    }
  }

  /**
   * Met à jour le profil utilisateur avec tous les champs supportés
   */
  async updateProfile(input: UpdateProfileInput): Promise<UserProfile> {
    const mutation = `
      mutation UpdateProfile(
        $id: ID!
        $name: String
        $email: String
        $phone: String
        $address: String
        $birth_date: Date
        $avatar: String
      ) {
        updateProfile(
          id: $id
          name: $name
          email: $email
          phone: $phone
          address: $address
          birth_date: $birth_date
          avatar: $avatar
        ) {
          id
          name
          email
          phone
          address
          birth_date
          avatar
          updated_at
        }
      }
    `

    const variables = {
      id: input.id,
      name: input.name,
      email: input.email,
      phone: input.phone,
      address: input.address,
      birth_date: input.birth_date,
      avatar: input.avatar
    }

    try {
      const response = await this.request(mutation, variables)
      return response.updateProfile
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour du profil:', error)
      throw new Error(error.message || 'Impossible de mettre à jour le profil')
    }
  }

  /**
   * Change le mot de passe utilisateur
   */
  async changePassword(input: ChangePasswordInput): Promise<ApiResponse> {
    const mutation = `
      mutation ChangePassword($current_password: String!, $new_password: String!) {
        changePassword(
          current_password: $current_password
          new_password: $new_password
        ) {
          success
          message
        }
      }
    `

    const variables = {
      current_password: input.current_password,
      new_password: input.new_password
    }

    try {
      const response = await this.request(mutation, variables)
      return response.changePassword
    } catch (error: any) {
      console.error('Erreur lors du changement de mot de passe:', error)
      throw new Error(error.message || 'Impossible de changer le mot de passe')
    }
  }

  /**
   * Upload d'avatar (à implémenter côté backend si nécessaire)
   */
  async uploadAvatar(file: File): Promise<{ avatar_url: string }> {
    // Pour l'instant, on simule un upload
    // TODO: Implémenter l'upload réel quand l'API sera disponible
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulation d'un upload réussi
        const avatarUrl = URL.createObjectURL(file)
        resolve({ avatar_url: avatarUrl })
      }, 1500)
    })
  }

  /**
   * Supprime l'avatar utilisateur
   */
  async removeAvatar(): Promise<ApiResponse> {
    // TODO: Implémenter quand l'API sera disponible
    return {
      success: true,
      message: 'Avatar supprimé avec succès'
    }
  }

  /**
   * Récupère les détails d'un utilisateur spécifique (Admin uniquement)
   */
  async getUserDetails(userId: string): Promise<UserProfile> {
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
          is_admin
          is_active
          email_verified_at
          created_at
          updated_at
        }
      }
    `

    try {
      const response = await this.request(query, { id: userId })
      return response.user
    } catch (error) {
      console.error('Erreur lors de la récupération des détails utilisateur:', error)
      throw new Error('Impossible de récupérer les détails de l\'utilisateur')
    }
  }

  /**
   * Validation des données du profil
   */
  validateProfileData(data: Partial<UpdateProfileInput>): string[] {
    const errors: string[] = []

    if (data.name && data.name.trim().length < 2) {
      errors.push('Le nom doit contenir au moins 2 caractères')
    }

    if (data.email && !this.isValidEmail(data.email)) {
      errors.push('L\'adresse email n\'est pas valide')
    }

    if (data.phone && data.phone.trim() && !this.isValidPhone(data.phone)) {
      errors.push('Le numéro de téléphone n\'est pas valide')
    }

    return errors
  }

  /**
   * Validation des données de changement de mot de passe
   */
  validatePasswordData(data: ChangePasswordInput): string[] {
    const errors: string[] = []

    if (!data.current_password) {
      errors.push('Le mot de passe actuel est requis')
    }

    if (!data.new_password) {
      errors.push('Le nouveau mot de passe est requis')
    } else if (data.new_password.length < 8) {
      errors.push('Le nouveau mot de passe doit contenir au moins 8 caractères')
    }

    if (data.new_password !== data.confirm_password) {
      errors.push('La confirmation du mot de passe ne correspond pas')
    }

    if (data.current_password === data.new_password) {
      errors.push('Le nouveau mot de passe doit être différent de l\'ancien')
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
    // Accepte différents formats de téléphone français
    const phoneRegex = /^(?:(?:\+33|0)[1-9](?:[0-9]{8}))$/
    return phoneRegex.test(phone.replace(/[\s.-]/g, ''))
  }
}

// Instance singleton du service
export const profileService = new ProfileService()
