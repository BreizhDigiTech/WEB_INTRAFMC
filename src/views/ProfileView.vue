<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Mon profil</h1>
      <p class="text-gray-600">Gérez vos informations personnelles et préférences</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Photo de profil -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="text-center">
          <div class="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span class="text-4xl font-bold text-gray-600">{{ user?.name?.charAt(0) }}</span>
          </div>
          <h3 class="text-lg font-semibold text-gray-900">{{ user?.name }}</h3>
          <p class="text-gray-600">{{ user?.email }}</p>
          <p class="text-sm text-gray-500 mt-2">{{ user?.is_admin ? 'Administrateur' : 'Utilisateur' }}</p>
          <button class="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-500 transition-colors">
            Changer la photo
          </button>
        </div>
      </div>

      <!-- Informations personnelles -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Informations personnelles</h2>
          
          <form @submit.prevent="updateProfile">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
                <input
                  v-model="form.name"
                  type="text"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  v-model="form.email"
                  type="email"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                <input
                  v-model="form.phone"
                  type="tel"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Département</label>
                <input
                  v-model="form.department"
                  type="text"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
              </div>
            </div>
            
            <div class="flex justify-end mt-6">
              <button
                type="submit"
                class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-500 transition-colors"
              >
                Enregistrer les modifications
              </button>
            </div>
          </form>
        </div>

        <!-- Changement de mot de passe -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Changer le mot de passe</h2>
          
          <form @submit.prevent="changePassword">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Mot de passe actuel</label>
                <input
                  v-model="passwordForm.currentPassword"
                  type="password"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Nouveau mot de passe</label>
                <input
                  v-model="passwordForm.newPassword"
                  type="password"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Confirmer le nouveau mot de passe</label>
                <input
                  v-model="passwordForm.confirmPassword"
                  type="password"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
              </div>
            </div>
            
            <div class="flex justify-end mt-6">
              <button
                type="submit"
                class="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-500 transition-colors"
              >
                Changer le mot de passe
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const user = authStore.user

// Formulaire profil
const form = ref({
  name: '',
  email: '',
  phone: '',
  department: ''
})

// Formulaire mot de passe
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

onMounted(() => {
  if (user) {
    form.value = {
      name: user.name || '',
      email: user.email || '',
      phone: '', // TODO: Ajouter le champ phone dans l'interface User
      department: '' // TODO: Ajouter le champ department dans l'interface User
    }
  }
})

const updateProfile = () => {
  // TODO: Implémentation de la mise à jour du profil
  alert('Profil mis à jour avec succès !')
}

const changePassword = () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    alert('Les mots de passe ne correspondent pas')
    return
  }
  
  // TODO: Implémentation du changement de mot de passe
  alert('Mot de passe changé avec succès !')
  
  // Reset du formulaire
  passwordForm.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
}
</script>
