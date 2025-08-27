<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <!-- En-tête avec gradient -->
    <div class="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900">
      <div class="container mx-auto px-4 py-8">
        <div class="flex items-center justify-between">
          <!-- Navigation retour -->
          <div class="flex items-center space-x-4">
            <button @click="$router.back()" class="btn btn-ghost btn-circle text-white hover:bg-white/10">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 class="text-3xl font-bold text-white">Mon Profil</h1>
              <p class="text-white/70">Gérez vos informations personnelles</p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center space-x-3">
            <button 
              @click="refreshProfile"
              :disabled="isLoading"
              class="btn btn-outline btn-sm text-white border-white/30 hover:bg-white/10"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Actualiser
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenu principal -->
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto space-y-8">

        <!-- Alerte d'erreur globale -->
        <div v-if="hasErrors" class="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Une erreur est survenue. Veuillez réessayer.</span>
          <button @click="clearErrors" class="btn btn-sm btn-ghost">Fermer</button>
        </div>

        <!-- Alerte de succès -->
        <div v-if="showSuccessMessage" class="alert alert-success">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ successMessage }}</span>
        </div>

        <!-- Carte de profil principal -->
        <div class="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
          <!-- Header avec avatar -->
          <div class="bg-gradient-to-r from-blue-500/20 to-purple-600/20 p-6 border-b border-gray-700">
            <div class="flex items-center gap-6">
              <!-- Avatar -->
              <div class="relative">
                <div class="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
                  <img 
                    v-if="profile?.avatar" 
                    :src="getAvatarUrl(profile)"
                    :alt="profile.name"
                    class="w-full h-full object-cover"
                    @error="handleImageError"
                  />
                  <span v-else>{{ getInitials(profile?.name) }}</span>
                </div>
                
                <!-- Bouton upload avatar -->
                <button 
                  @click="triggerAvatarUpload"
                  class="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center text-white transition-colors"
                  :disabled="state.loading.uploadAvatar"
                >
                  <svg v-if="!state.loading.uploadAvatar" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div v-else class="loading loading-spinner loading-xs"></div>
                </button>
                
                <!-- Input caché pour upload -->
                <input 
                  ref="avatarInput" 
                  type="file" 
                  accept="image/*" 
                  @change="handleAvatarUpload" 
                  class="hidden"
                />
              </div>

              <!-- Informations utilisateur -->
              <div class="flex-1">
                <h2 class="text-2xl font-bold text-white">{{ profile?.name || 'Nom non renseigné' }}</h2>
                <p class="text-gray-300">{{ profile?.email || 'Email non renseigné' }}</p>
                <div class="flex items-center gap-4 mt-2">
                  <span :class="profile?.is_admin ? 'badge-warning' : 'badge-info'" class="badge">
                    {{ profile?.is_admin ? 'Administrateur' : 'Utilisateur' }}
                  </span>
                  <span :class="profile?.is_active ? 'badge-success' : 'badge-error'" class="badge">
                    {{ profile?.is_active ? 'Actif' : 'Inactif' }}
                  </span>
                  <span class="text-sm text-gray-400">
                    Membre depuis {{ getMembershipDuration(profile?.created_at) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Tabs de navigation -->
          <div class="tabs tabs-boxed bg-transparent p-4 border-b border-gray-700">
            <button 
              @click="activeTab = 'info'"
              :class="{ 'tab-active': activeTab === 'info' }"
              class="tab text-white"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Informations personnelles
            </button>
            <button 
              @click="activeTab = 'security'"
              :class="{ 'tab-active': activeTab === 'security' }"
              class="tab text-white"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Sécurité
            </button>
          </div>

          <!-- Contenu des tabs -->
          <div class="p-6">
            <!-- Tab Informations personnelles -->
            <div v-show="activeTab === 'info'">
              <ProfileInfoForm 
                :profile="profile"
                :loading="state.loading.updateProfile"
                :error="state.error.updateProfile"
                @update="handleUpdateProfile"
                @clear-error="clearError('updateProfile')"
              />
            </div>

            <!-- Tab Sécurité -->
            <div v-show="activeTab === 'security'">
              <ProfileSecurityForm 
                :loading="state.loading.changePassword"
                :error="state.error.changePassword"
                @change-password="handleChangePassword"
                @clear-error="clearError('changePassword')"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import ProfileInfoForm from '../components/ProfileInfoForm.vue'
import ProfileSecurityForm from '../components/ProfileSecurityForm.vue'
import { useProfile } from '../composables/useProfile'
import type { PasswordFormData, ProfileFormData } from '../types'

const router = useRouter()

// Composable
const {
  state,
  profile,
  isLoading,
  hasErrors,
  fetchProfile,
  updateProfile,
  changePassword,
  uploadAvatar,
  clearErrors,
  clearError,
  formatDate,
  getInitials,
  getAvatarUrl,
  getMembershipDuration
} = useProfile()

// État local
const activeTab = ref<'info' | 'security'>('info')
const avatarInput = ref<HTMLInputElement>()
const showSuccessMessage = ref(false)
const successMessage = ref('')

// Méthodes
const refreshProfile = async () => {
  try {
    await fetchProfile()
  } catch (error) {
    console.error('Erreur lors du rafraîchissement du profil:', error)
  }
}

const handleUpdateProfile = async (formData: ProfileFormData) => {
  try {
    await updateProfile(formData)
    // Afficher une notification de succès
    showSuccessAlert('Profil mis à jour avec succès')
    console.log('Profil mis à jour avec succès')
  } catch (error: any) {
    console.error('Erreur lors de la mise à jour du profil:', error.message)
  }
}

const handleChangePassword = async (formData: PasswordFormData) => {
  try {
    await changePassword(formData)
    // Afficher une notification de succès
    showSuccessAlert('Mot de passe changé avec succès')
    console.log('Mot de passe changé avec succès')
  } catch (error: any) {
    console.error('Erreur lors du changement de mot de passe:', error.message)
  }
}

const showSuccessAlert = (message: string) => {
  successMessage.value = message
  showSuccessMessage.value = true
  
  // Masquer le message après 3 secondes
  setTimeout(() => {
    showSuccessMessage.value = false
  }, 3000)
}

const triggerAvatarUpload = () => {
  avatarInput.value?.click()
}

const handleAvatarUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    try {
      await uploadAvatar(file)
      showSuccessAlert('Avatar uploadé avec succès')
      console.log('Avatar uploadé avec succès')
    } catch (error: any) {
      console.error('Erreur lors de l\'upload de l\'avatar:', error.message)
    }
  }
}

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.style.display = 'none'
}

// Initialisation
onMounted(() => {
  if (!profile.value) {
    refreshProfile()
  }
})
</script>

<style scoped>
.tab-active {
  @apply bg-blue-500 text-white;
}

.tab:not(.tab-active) {
  @apply hover:bg-gray-700/50;
}

/* Animation pour les transitions de tabs */
.tab {
  transition: all 0.2s ease;
}

/* Style pour l'upload d'avatar */
.avatar-upload {
  position: relative;
  cursor: pointer;
}

.avatar-upload:hover .upload-overlay {
  opacity: 1;
}

.upload-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
  border-radius: 50%;
}
</style>
