<template>
  <div class="min-h-screen bg-black text-white">
    <!-- Sidebar moderne -->
    <div class="drawer lg:drawer-open">
      <input id="drawer-toggle" type="checkbox" class="drawer-toggle" />
      
      <!-- Contenu principal -->
      <div class="drawer-content flex flex-col">
        <!-- Navbar ultra-moderne -->
        <div class="navbar bg-gray-900/50 backdrop-blur-xl border-b border-gray-800">
          <div class="flex-none lg:hidden">
            <label for="drawer-toggle" class="btn btn-ghost btn-circle text-white hover:bg-gray-800">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </label>
          </div>
          
          <div class="flex-1">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <div class="w-4 h-4 bg-black rounded-sm"></div>
              </div>
              <div class="text-xl font-light text-white">FMC</div>
            </div>
          </div>
          
          <div class="flex-none gap-3">
            <!-- Notifications -->
            <div class="dropdown dropdown-end">
              <div tabindex="0" role="button" class="btn btn-ghost btn-circle text-white hover:bg-gray-800 indicator">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-3.5-3.5a9 9 0 10-1.415 1.415L21 15H15v2zM9 12a3 3 0 016 0c0 3-3 9-3 9s-3-6-3-9z" />
                </svg>
                <span v-if="notificationStore.notifications.length" class="badge badge-sm bg-blue-500 border-none text-white">
                  {{ notificationStore.notifications.length }}
                </span>
              </div>
              <div tabindex="0" class="dropdown-content z-[1] menu p-0 shadow-2xl bg-gray-900 border border-gray-800 rounded-2xl w-80">
                <div class="p-4 border-b border-gray-800">
                  <h3 class="font-medium text-white">Notifications</h3>
                </div>
                <div class="max-h-80 overflow-y-auto">
                  <div v-if="notificationStore.notifications.length === 0" class="p-4 text-center text-gray-500">
                    Aucune notification
                  </div>
                  <div v-else>
                    <div
                      v-for="notification in notificationStore.notifications.slice(0, 5)"
                      :key="notification.id"
                      class="p-4 border-b border-gray-800 last:border-b-0 hover:bg-gray-800/50 transition-colors"
                    >
                      <div class="flex items-start space-x-3">
                        <div class="flex-shrink-0">
                          <div class="w-2 h-2 rounded-full" :class="{
                            'bg-green-500': notification.type === 'success',
                            'bg-red-500': notification.type === 'error',
                            'bg-yellow-500': notification.type === 'warning',
                            'bg-blue-500': notification.type === 'info'
                          }"></div>
                        </div>
                        <div class="flex-1">
                          <p class="text-sm font-medium text-white">{{ notification.title }}</p>
                          <p class="text-xs text-gray-400 mt-1">{{ notification.message }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Profil utilisateur -->
            <div class="dropdown dropdown-end">
              <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
                <div class="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <span class="text-white text-sm font-medium">
                    {{ authStore.userName.charAt(0).toUpperCase() || 'U' }}
                  </span>
                </div>
              </div>
              <div tabindex="0" class="dropdown-content z-[1] menu p-0 shadow-2xl bg-gray-900 border border-gray-800 rounded-2xl w-52">
                <div class="p-4 border-b border-gray-800">
                  <div class="text-sm font-medium text-white">{{ authStore.userName || 'Utilisateur' }}</div>
                  <div class="text-xs text-gray-400">{{ authStore.userEmail }}</div>
                </div>
                <ul class="p-2">
                  <li>
                    <router-link to="/profile" class="text-white hover:bg-gray-800 rounded-xl">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profil
                    </router-link>
                  </li>
                  <li>
                    <a @click="authStore.logout" class="text-red-400 hover:bg-red-500/10 rounded-xl cursor-pointer">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Déconnexion
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Contenu de la page -->
        <main class="flex-1 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
          <!-- Grille de points lumineux en arrière-plan -->
          <div class="absolute inset-0" style="background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0); background-size: 50px 50px;"></div>
          
          <!-- Contenu -->
          <div class="relative z-10 p-6">
            <router-view />
          </div>
        </main>
      </div>

      <!-- Sidebar -->
      <div class="drawer-side">
        <label for="drawer-toggle" aria-label="close sidebar" class="drawer-overlay"></label>
        <aside class="min-h-full w-64 bg-gray-900/90 backdrop-blur-xl border-r border-gray-800">
          <!-- Header sidebar -->
          <div class="p-6 border-b border-gray-800">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <div class="w-4 h-4 bg-black rounded-sm"></div>
              </div>
              <div>
                <div class="text-lg font-light text-white">FMC Intranet</div>
                <div class="text-xs text-gray-400">Tableau de bord</div>
              </div>
            </div>
          </div>

          <!-- Navigation -->
          <nav class="p-4">
            <ul class="space-y-2">
              <!-- Dashboard -->
              <li>
                <router-link
                  to="/dashboard"
                  class="flex items-center space-x-3 p-3 rounded-xl text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-200"
                  :class="{ 'bg-blue-500/20 text-blue-400': $route.path.startsWith('/dashboard') }"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  <span class="font-medium">Dashboard</span>
                </router-link>
              </li>

              <!-- CBD -->
              <li>
                <router-link
                  to="/cbd"
                  class="flex items-center space-x-3 p-3 rounded-xl text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-200"
                  :class="{ 'bg-green-500/20 text-green-400': $route.path.startsWith('/cbd') }"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 5l3 3-3 3m4-6l3 3-3 3" />
                  </svg>
                  <span class="font-medium">CBD</span>
                </router-link>
              </li>

              <!-- Produits CBD -->
              <li class="ml-4">
                <router-link
                  to="/cbd/products"
                  class="flex items-center space-x-3 p-3 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800/30 transition-all duration-200 text-sm"
                  :class="{ 'bg-green-500/10 text-green-400': $route.path === '/cbd/products' }"
                >
                  <div class="w-2 h-2 rounded-full bg-gray-600"></div>
                  <span>Produits</span>
                </router-link>
              </li>

              <!-- Commandes -->
              <li class="ml-4">
                <router-link
                  to="/cbd/orders"
                  class="flex items-center space-x-3 p-3 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800/30 transition-all duration-200 text-sm"
                  :class="{ 'bg-green-500/10 text-green-400': $route.path === '/cbd/orders' }"
                >
                  <div class="w-2 h-2 rounded-full bg-gray-600"></div>
                  <span>Commandes</span>
                </router-link>
              </li>

              <!-- Arrivages -->
              <li class="ml-4">
                <router-link
                  to="/cbd/arrivals"
                  class="flex items-center space-x-3 p-3 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800/30 transition-all duration-200 text-sm"
                  :class="{ 'bg-green-500/10 text-green-400': $route.path === '/cbd/arrivals' }"
                >
                  <div class="w-2 h-2 rounded-full bg-gray-600"></div>
                  <span>Arrivages</span>
                </router-link>
              </li>
            </ul>
          </nav>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notifications'

const authStore = useAuthStore()
const notificationStore = useNotificationStore()
</script>

<style scoped>
/* Animations personnalisées */
.router-link-active {
  position: relative;
}

.router-link-active::before {
  content: '';
  position: absolute;
  left: -16px;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 20px;
  background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
  border-radius: 2px;
}

/* Scrollbar personnalisée */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
