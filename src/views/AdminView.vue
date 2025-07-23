<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Administration</h1>
      <p class="text-gray-600">Gestion des utilisateurs et paramètres système</p>
    </div>

    <!-- Onglets -->
    <div class="mb-8">
      <nav class="flex space-x-8">
        <button
          @click="activeTab = 'users'"
          :class="[
            'py-2 px-1 border-b-2 font-medium text-sm',
            activeTab === 'users'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          Utilisateurs
        </button>
        <button
          @click="activeTab = 'settings'"
          :class="[
            'py-2 px-1 border-b-2 font-medium text-sm',
            activeTab === 'settings'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          Paramètres
        </button>
      </nav>
    </div>

    <!-- Onglet Utilisateurs -->
    <div v-if="activeTab === 'users'">
      <!-- En-tête avec bouton d'ajout -->
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-semibold text-gray-900">Gestion des utilisateurs</h2>
        <button
          @click="showCreateUserModal = true"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors"
        >
          Ajouter un utilisateur
        </button>
      </div>

      <!-- Filtres -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Recherche</label>
            <input
              v-model="userSearch"
              type="text"
              placeholder="Nom, email..."
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Rôle</label>
            <select v-model="selectedRole" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Tous les rôles</option>
              <option value="admin">Administrateur</option>
              <option value="user">Utilisateur</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Statut</label>
            <select v-model="selectedStatus" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Tous</option>
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Liste des utilisateurs -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Utilisateurs ({{ filteredUsers.length }})</h3>
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dernière connexion</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="user in filteredUsers" :key="user.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span class="text-sm font-medium text-gray-600">{{ user.name.charAt(0) }}</span>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ user.email }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="user.is_admin ? 'px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full' : 'px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full'">
                    {{ user.is_admin ? 'Administrateur' : 'Utilisateur' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="user.is_active ? 'px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full' : 'px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full'">
                    {{ user.is_active ? 'Actif' : 'Inactif' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ user.lastLogin || 'Jamais' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <button
                      @click="editUser(user)"
                      class="text-blue-600 hover:text-blue-500"
                    >
                      Modifier
                    </button>
                    <button
                      @click="toggleUserStatus(user)"
                      :class="user.is_active ? 'text-red-600 hover:text-red-500' : 'text-green-600 hover:text-green-500'"
                    >
                      {{ user.is_active ? 'Désactiver' : 'Activer' }}
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Onglet Paramètres -->
    <div v-if="activeTab === 'settings'">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Paramètres généraux -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-6">Paramètres généraux</h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Nom de l'application</label>
              <input
                v-model="settings.appName"
                type="text"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email administrateur</label>
              <input
                v-model="settings.adminEmail"
                type="email"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>
            <div>
              <label class="flex items-center">
                <input
                  v-model="settings.allowRegistration"
                  type="checkbox"
                  class="form-checkbox h-4 w-4 text-blue-600"
                >
                <span class="ml-2 text-sm text-gray-700">Autoriser l'inscription</span>
              </label>
            </div>
          </div>
          
          <div class="mt-6">
            <button
              @click="saveSettings"
              class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors"
            >
              Enregistrer
            </button>
          </div>
        </div>

        <!-- Paramètres de sécurité -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-6">Sécurité</h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Durée de session (minutes)</label>
              <input
                v-model.number="settings.sessionDuration"
                type="number"
                min="30"
                max="1440"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>
            <div>
              <label class="flex items-center">
                <input
                  v-model="settings.require2FA"
                  type="checkbox"
                  class="form-checkbox h-4 w-4 text-blue-600"
                >
                <span class="ml-2 text-sm text-gray-700">Authentification à deux facteurs obligatoire</span>
              </label>
            </div>
            <div>
              <label class="flex items-center">
                <input
                  v-model="settings.logUserActions"
                  type="checkbox"
                  class="form-checkbox h-4 w-4 text-blue-600"
                >
                <span class="ml-2 text-sm text-gray-700">Journaliser les actions utilisateurs</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de création d'utilisateur -->
    <div v-if="showCreateUserModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Nouvel utilisateur</h3>
        
        <form @submit.prevent="createUser">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
              <input
                v-model="userForm.name"
                type="text"
                required
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                v-model="userForm.email"
                type="email"
                required
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
              <input
                v-model="userForm.password"
                type="password"
                required
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>
            <div>
              <label class="flex items-center">
                <input
                  v-model="userForm.is_admin"
                  type="checkbox"
                  class="form-checkbox h-4 w-4 text-blue-600"
                >
                <span class="ml-2 text-sm text-gray-700">Administrateur</span>
              </label>
            </div>
          </div>
          
          <div class="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              @click="closeUserModal"
              class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
            >
              Créer
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface AdminUser {
  id: string
  name: string
  email: string
  is_admin: boolean
  is_active: boolean
  lastLogin?: string
}

// États
const activeTab = ref('users')
const showCreateUserModal = ref(false)
const userSearch = ref('')
const selectedRole = ref('')
const selectedStatus = ref('')

// Données temporaires des utilisateurs
const users = ref<AdminUser[]>([
  {
    id: '1',
    name: 'Admin Système',
    email: 'admin@intrafmc.com',
    is_admin: true,
    is_active: true,
    lastLogin: '2024-01-18 14:30'
  },
  {
    id: '2',
    name: 'Jean Dupont',
    email: 'jean.dupont@intrafmc.com',
    is_admin: false,
    is_active: true,
    lastLogin: '2024-01-17 09:15'
  },
  {
    id: '3',
    name: 'Marie Martin',
    email: 'marie.martin@intrafmc.com',
    is_admin: false,
    is_active: false,
    lastLogin: '2024-01-10 16:45'
  }
])

// Formulaire utilisateur
const userForm = ref({
  name: '',
  email: '',
  password: '',
  is_admin: false
})

// Paramètres système
const settings = ref({
  appName: 'WEB IntraFMC',
  adminEmail: 'admin@intrafmc.com',
  allowRegistration: false,
  sessionDuration: 480,
  require2FA: false,
  logUserActions: true
})

// Utilisateurs filtrés
const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(userSearch.value.toLowerCase()) ||
                         user.email.toLowerCase().includes(userSearch.value.toLowerCase())
    const matchesRole = !selectedRole.value || 
                       (selectedRole.value === 'admin' && user.is_admin) ||
                       (selectedRole.value === 'user' && !user.is_admin)
    const matchesStatus = !selectedStatus.value ||
                         (selectedStatus.value === 'active' && user.is_active) ||
                         (selectedStatus.value === 'inactive' && !user.is_active)
    
    return matchesSearch && matchesRole && matchesStatus
  })
})

// Méthodes
const editUser = (user: AdminUser) => {
  alert(`Modification de l'utilisateur ${user.name}`)
}

const toggleUserStatus = (user: AdminUser) => {
  const action = user.is_active ? 'désactiver' : 'activer'
  if (confirm(`Êtes-vous sûr de vouloir ${action} l'utilisateur ${user.name} ?`)) {
    user.is_active = !user.is_active
  }
}

const createUser = () => {
  const newUser: AdminUser = {
    id: Date.now().toString(),
    name: userForm.value.name,
    email: userForm.value.email,
    is_admin: userForm.value.is_admin,
    is_active: true
  }
  
  users.value.push(newUser)
  closeUserModal()
  alert('Utilisateur créé avec succès !')
}

const closeUserModal = () => {
  showCreateUserModal.value = false
  userForm.value = {
    name: '',
    email: '',
    password: '',
    is_admin: false
  }
}

const saveSettings = () => {
  // TODO: Sauvegarder les paramètres
  alert('Paramètres sauvegardés avec succès !')
}
</script>
