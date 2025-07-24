// Store d'authentification global

import { defineStore } from 'pinia'
import { graphqlService } from '@/shared/services/graphql'
import type { User, AuthState, LoginCredentials, AuthResponse } from '@/shared/types/app'

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
    }),

    getters: {
        isAdmin: (state) => state.user?.is_admin ?? false,
        userName: (state) => state.user?.name ?? '',
        userEmail: (state) => state.user?.email ?? '',
        userAvatar: (state) => state.user?.avatar,
        isReady: (state) => !state.isLoading && !state.error
    },

    actions: {
        // Initialisation du store
        async initialize() {
            const token = localStorage.getItem('auth_token')
            if (token) {
                graphqlService.setToken(token)
                this.token = token
                try {
                    await this.fetchUser()
                } catch (error) {
                    // Token invalide, on nettoie
                    this.logout()
                }
            }
        },

        // Connexion
        async login(credentials: LoginCredentials) {
            this.isLoading = true
            this.error = null

            try {
                const response: { login: AuthResponse } = await graphqlService.login(
                    credentials.email,
                    credentials.password
                )

                const { access_token, user } = response.login

                // Stockage du token et de l'utilisateur
                this.token = access_token
                this.user = user
                this.isAuthenticated = true

                // Configuration du service GraphQL
                graphqlService.setToken(access_token)

                return { success: true, user, isAdmin: user.is_admin }
            } catch (error: any) {
                this.error = error.message
                return { success: false, error: error.message }
            } finally {
                this.isLoading = false
            }
        },

        // Déconnexion
        async logout() {
            this.isLoading = true

            try {
                if (this.isAuthenticated) {
                    await graphqlService.logout()
                }
            } catch (error) {
                // On ignore les erreurs de déconnexion
                console.warn('Erreur lors de la déconnexion:', error)
            } finally {
                // Nettoyage local
                this.user = null
                this.token = null
                this.isAuthenticated = false
                this.error = null
                this.isLoading = false

                // Nettoyage du service et du stockage
                graphqlService.setToken(null)
                localStorage.removeItem('auth_token')
            }
        },

        // Récupération des données utilisateur
        async fetchUser() {
            if (!this.token) {
                throw new Error('Aucun token disponible')
            }

            try {
                const response: { me: User } = await graphqlService.getMe()
                this.user = response.me
                this.isAuthenticated = true
            } catch (error: any) {
                this.error = error.message
                throw error
            }
        },

        // Mise à jour du profil utilisateur
        async updateProfile(userData: Partial<User>) {
            this.isLoading = true
            this.error = null

            try {
                // TODO: Implémenter la mutation updateProfile
                // const response = await graphqlService.updateProfile(userData)
                // this.user = { ...this.user, ...response.updateProfile }

                // Pour l'instant, mise à jour locale
                if (this.user) {
                    this.user = { ...this.user, ...userData }
                }

                return { success: true }
            } catch (error: any) {
                this.error = error.message
                return { success: false, error: error.message }
            } finally {
                this.isLoading = false
            }
        },

        // Vérification du token
        async checkAuth() {
            const token = this.token || localStorage.getItem('auth_token')

            if (!token) {
                return false
            }

            try {
                await this.fetchUser()
                return true
            } catch (error) {
                this.logout()
                return false
            }
        },

        // Nettoyage des erreurs
        clearError() {
            this.error = null
        }
    }
})
