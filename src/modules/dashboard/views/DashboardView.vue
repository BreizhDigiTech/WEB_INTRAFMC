<template>
  <div class="flex items-center justify-center min-h-[calc(100vh-200px)]">
    <div class="text-center max-w-2xl mx-auto p-8">
      <!-- Logo/Icône principal -->
      <div class="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl flex items-center justify-center shadow-2xl">
        <div class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center">
          <div class="w-8 h-8 bg-black rounded-lg"></div>
        </div>
      </div>

      <!-- Message principal -->
      <h1 class="text-4xl font-light text-white mb-6">
        FMC Intranet
      </h1>
      
      <div class="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 mb-8">
        <div class="flex items-center justify-center mb-6">
          <div class="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center">
            <svg class="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
        </div>

        <h2 class="text-2xl font-medium text-white mb-4">
          Fonctionnalités en développement
        </h2>
        
        <p class="text-gray-300 text-lg leading-relaxed mb-6">
          L'interface de gestion est actuellement en cours de développement. 
          Les modules suivants seront bientôt disponibles :
        </p>

        <!-- Liste des fonctionnalités disponibles -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div class="flex items-center space-x-3 p-3 bg-gray-800/30 rounded-xl">
            <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span class="text-gray-300">Gestion des utilisateurs</span>
          </div>
          <div class="flex items-center space-x-3 p-3 bg-gray-800/30 rounded-xl">
            <div class="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-100"></div>
            <span class="text-gray-300">Monitoring système</span>
          </div>
          <div class="flex items-center space-x-3 p-3 bg-gray-800/30 rounded-xl">
            <div class="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-200"></div>
            <span class="text-gray-300">Rapports et analytics</span>
          </div>
          <div class="flex items-center space-x-3 p-3 bg-gray-800/30 rounded-xl">
            <div class="w-2 h-2 bg-yellow-400 rounded-full animate-pulse delay-300"></div>
            <span class="text-gray-300">Configuration système</span>
          </div>
        </div>

        <div class="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <div class="flex items-center justify-center space-x-2 text-gray-400">
            <svg class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span class="text-sm">Système opérationnel</span>
          </div>
        </div>
      </div>

      <!-- Actions disponibles -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button 
          @click="navigateTo('/dashboard')"
          class="flex flex-col items-center p-6 bg-gray-900/30 hover:bg-gray-800/50 rounded-2xl border border-gray-800 hover:border-gray-700 transition-all duration-300 group"
        >
          <div class="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-3 group-hover:bg-green-500/30 transition-colors">
            <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <span class="text-white font-medium">Dashboard</span>
          <span class="text-gray-400 text-sm">Vue d'ensemble</span>
        </button>

        <button 
          @click="navigateTo('/profile')"
          class="flex flex-col items-center p-6 bg-gray-900/30 hover:bg-gray-800/50 rounded-2xl border border-gray-800 hover:border-gray-700 transition-all duration-300 group"
        >
          <div class="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-3 group-hover:bg-blue-500/30 transition-colors">
            <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <span class="text-white font-medium">Profil</span>
          <span class="text-gray-400 text-sm">Paramètres utilisateur</span>
        </button>

        <button 
          @click="logout"
          class="flex flex-col items-center p-6 bg-gray-900/30 hover:bg-red-500/10 rounded-2xl border border-gray-800 hover:border-red-500/30 transition-all duration-300 group"
        >
          <div class="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center mb-3 group-hover:bg-red-500/30 transition-colors">
            <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </div>
          <span class="text-white font-medium">Déconnexion</span>
          <span class="text-gray-400 text-sm">Se déconnecter</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const navigateTo = (path: string) => {
  router.push(path)
}

const logout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
/* Animation fade-in pour le contenu */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.flex.items-center.justify-center {
  animation: fadeInUp 0.8s ease-out;
}

/* Animations pour les éléments */
.grid > * {
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
}

.grid > *:nth-child(1) { animation-delay: 0.1s; }
.grid > *:nth-child(2) { animation-delay: 0.2s; }
.grid > *:nth-child(3) { animation-delay: 0.3s; }
.grid > *:nth-child(4) { animation-delay: 0.4s; }

/* Effet hover pour les cartes */
button:hover {
  transform: translateY(-2px);
}
</style>
