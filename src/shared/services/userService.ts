// Service GraphQL pour la gestion des utilisateurs
import { GraphQLService } from '@/shared/services/graphql'

export interface User {
    id: string
    name: string
    email: string
    avatar?: string
    is_admin: boolean
    is_active: boolean
    email_verified_at?: string
    created_at?: string
    updated_at?: string
}

export interface UsersResponse {
    data: User[]
    paginatorInfo: {
        currentPage: number
        hasMorePages: boolean
        total: number
        perPage: number
        lastPage: number
        count: number
    }
}

export interface UpdateProfileInput {
    id: string
    name?: string
    email?: string
    avatar?: string
}

export interface UpdateUserInput {
    id: string
    name?: string
    email?: string
    is_active?: boolean
    is_admin?: boolean
    password?: string
    password_confirmation?: string
}

export interface ChangePasswordInput {
    current_password: string
    new_password: string
}

export interface ChangePasswordResponse {
    success: boolean
    message: string
}

export class UserService extends GraphQLService {
    /**
     * Récupérer la liste des utilisateurs (Admin uniquement)
     */
    async getUsers(first: number = 10, page: number = 1): Promise<UsersResponse> {
        const query = `
            query GetUsers($first: Int, $page: Int) {
                users(first: $first, page: $page) {
                    paginatorInfo {
                        currentPage
                        hasMorePages
                        total
                        perPage
                        lastPage
                        count
                    }
                    data {
                        id
                        name
                        email
                        avatar
                        is_admin
                        is_active
                        email_verified_at
                        created_at
                        updated_at
                    }
                }
            }
        `

        return this.request(query, { first, page })
    }

    /**
     * Récupérer un utilisateur spécifique (Admin uniquement)
     */
    async getUser(id: string): Promise<User> {
        const query = `
            query GetUser($id: ID!) {
                user(id: $id) {
                    id
                    name
                    email
                    avatar
                    is_admin
                    is_active
                    email_verified_at
                    created_at
                    updated_at
                }
            }
        `

        const response = await this.request(query, { id })
        return response.user
    }

    /**
     * Modifier son propre profil
     */
    async updateProfile(input: UpdateProfileInput): Promise<User> {
        const mutation = `
            mutation UpdateProfile(
                $id: ID!
                $name: String
                $email: String
                $avatar: String
            ) {
                updateProfile(
                    id: $id
                    name: $name
                    email: $email
                    avatar: $avatar
                ) {
                    id
                    name
                    email
                    avatar
                    updated_at
                }
            }
        `

        const response = await this.request(mutation, input)
        return response.updateProfile
    }

    /**
     * Modifier un utilisateur (Admin uniquement)
     */
    async updateUser(input: UpdateUserInput): Promise<User> {
        const mutation = `
            mutation UpdateUser(
                $id: ID!
                $name: String
                $email: String
                $is_active: Boolean
                $is_admin: Boolean
                $password: String
                $password_confirmation: String
            ) {
                updateUser(
                    id: $id
                    name: $name
                    email: $email
                    is_active: $is_active
                    is_admin: $is_admin
                    password: $password
                    password_confirmation: $password_confirmation
                ) {
                    id
                    name
                    email
                    is_admin
                    is_active
                    updated_at
                }
            }
        `

        const response = await this.request(mutation, input)
        return response.updateUser
    }

    /**
     * Supprimer un utilisateur (Admin uniquement)
     */
    async deleteUser(id: string): Promise<{ success: boolean; message: string }> {
        const mutation = `
            mutation DeleteUser($id: ID!) {
                deleteUser(id: $id) {
                    success
                    message
                }
            }
        `

        const response = await this.request(mutation, { id })
        return response.deleteUser
    }

    /**
     * Changer son mot de passe
     */
    async changePassword(input: ChangePasswordInput): Promise<ChangePasswordResponse> {
        const mutation = `
            mutation ChangePassword($current_password: String!, $new_password: String!) {
                changePassword(current_password: $current_password, new_password: $new_password) {
                    success
                    message
                }
            }
        `

        const response = await this.request(mutation, input)
        return response.changePassword
    }

    /**
     * Formater la date d'inscription
     */
    formatDate(dateString?: string): string {
        if (!dateString) return 'Non défini'
        
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    /**
     * Obtenir le libellé du statut d'un utilisateur
     */
    getStatusLabel(user: User): string {
        if (!user.is_active) return 'Inactif'
        if (user.is_admin) return 'Administrateur'
        return 'Utilisateur'
    }

    /**
     * Obtenir la couleur CSS pour le statut
     */
    getStatusColor(user: User): string {
        if (!user.is_active) return 'text-red-600'
        if (user.is_admin) return 'text-purple-600'
        return 'text-green-600'
    }

    /**
     * Vérifier si un email est valide
     */
    isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    /**
     * Vérifier la force d'un mot de passe
     */
    checkPasswordStrength(password: string): {
        score: number
        feedback: string[]
    } {
        const feedback: string[] = []
        let score = 0

        if (password.length >= 8) {
            score += 1
        } else {
            feedback.push('Le mot de passe doit contenir au moins 8 caractères')
        }

        if (/[A-Z]/.test(password)) {
            score += 1
        } else {
            feedback.push('Ajoutez au moins une lettre majuscule')
        }

        if (/[a-z]/.test(password)) {
            score += 1
        } else {
            feedback.push('Ajoutez au moins une lettre minuscule')
        }

        if (/\d/.test(password)) {
            score += 1
        } else {
            feedback.push('Ajoutez au moins un chiffre')
        }

        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            score += 1
        } else {
            feedback.push('Ajoutez au moins un caractère spécial')
        }

        return { score, feedback }
    }
}

// Instance singleton
export const userService = new UserService()
