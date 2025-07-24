<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- Header simple -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <div class="w-4 h-4 bg-white rounded-sm"></div>
            </div>
            <h1 class="text-xl font-semibold text-gray-900">FMC Boutique</h1>
          </div>
          
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-600">Bienvenue {{ authStore.userName }}</span>
            <button
              @click="handleLogout"
              class="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Contenu principal -->
    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="text-center">
        <!-- Icône boutique -->
        <div class="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-8">
          <svg class="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>

        <!-- Titre et description -->
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          Boutique en ligne FMC
        </h1>
        <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Votre espace e-commerce personnel est en cours de développement. 
          Bientôt, vous pourrez commander vos produits directement depuis cette interface.
        </p>

        <!-- État de développement -->
        <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8">
          <div class="flex items-center justify-center space-x-3 mb-6">
            <div class="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
            <span class="text-lg font-medium text-gray-900">Développement en cours</span>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div class="p-4">
              <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 class="font-medium text-gray-900 mb-2">Catalogue produits</h3>
              <p class="text-sm text-gray-600">Navigation et recherche</p>
            </div>

            <div class="p-4">
              <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 class="font-medium text-gray-900 mb-2">Panier d'achat</h3>
              <p class="text-sm text-gray-600">Gestion des commandes</p>
            </div>

            <div class="p-4">
              <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 class="font-medium text-gray-900 mb-2">Paiement sécurisé</h3>
              <p class="text-sm text-gray-600">Interface de commande</p>
            </div>
          </div>
        </div>

        <!-- Actions temporaires -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            @click="goToProfile"
            class="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Mon profil
          </button>
          
          <button
            @click="contactSupport"
            class="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Contacter le support
          </button>
        </div>

        <!-- Informations utilisateur -->
        <div class="mt-12 bg-gray-50 rounded-lg p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Informations de votre compte</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div>
              <span class="text-sm font-medium text-gray-500">Nom d'utilisateur :</span>
              <p class="text-gray-900">{{ authStore.userName }}</p>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-500">Email :</span>
              <p class="text-gray-900">{{ authStore.userEmail }}</p>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-500">Statut :</span>
              <p class="text-gray-900">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Utilisateur actif
                </span>
              </p>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-500">Type de compte :</span>
              <p class="text-gray-900">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Client
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="text-center text-gray-500 text-sm">
          <p>&copy; 2025 FMC. Tous droits réservés.</p>
          <p class="mt-2">Interface e-commerce en développement</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notifications'

const router = useRouter()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

const handleLogout = async () => {
  await authStore.logout()
  notificationStore.add({
    type: 'success',
    title: 'Déconnexion',
    message: 'À bientôt !',
    duration: 2000
  })
  router.push('/login')
}

const goToProfile = () => {
  router.push('/profile')
}

const contactSupport = () => {
  notificationStore.add({
    type: 'info',
    title: 'Support',
    message: 'Fonctionnalité en développement',
    duration: 3000
  })
}
</script>
