/**
 * Module Profile - Gestion du profil utilisateur
 */

// Types
export type {
    ApiResponse,
    ChangePasswordInput,
    PasswordFormData,
    ProfileFormData,
    ProfileState,
    UpdateProfileInput,
    UserProfile
} from './types'

// Services
export { profileService } from './services/profileService'

// Composables
export { useProfile } from './composables/useProfile'

// Components
export { default as ProfileInfoForm } from './components/ProfileInfoForm.vue'
export { default as ProfileSecurityForm } from './components/ProfileSecurityForm.vue'

// Views
export { default as ProfileView } from './views/ProfileView.vue'

