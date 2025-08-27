/**
 * Utilitaire pour mettre à jour le token JWT avec le token backend fonctionnel
 */

// Token JWT généré par le backend Laravel maintenant opérationnel
const WORKING_JWT_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0IiwiaWF0IjoxNzU2MjA2ODUzLCJleHAiOjE3NTYyMTA0NTMsIm5iZiI6MTc1NjIwNjg1MywianRpIjoicU5zMFJJSkRCRkhDOUY3MiIsInN1YiI6IjEiLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3In0.iRz0UsolIU0TPr1B8Cf2L_2N09_b4M_TSuaUIpahgHg'

/**
 * Met à jour le token JWT dans le localStorage
 */
export function updateWorkingJWTToken(): void {
  localStorage.setItem('auth_token', WORKING_JWT_TOKEN)
  console.log('✅ Token JWT mis à jour avec le token backend fonctionnel')
  console.log('🔑 Token valide jusqu\'au:', new Date(1756210453 * 1000).toLocaleString())
}

/**
 * Vérifie si le token actuel est le bon
 */
export function verifyCurrentToken(): boolean {
  const currentToken = localStorage.getItem('auth_token')
  const isCorrect = currentToken === WORKING_JWT_TOKEN
  
  console.log('🔍 Vérification du token:')
  console.log('- Token présent:', !!currentToken)
  console.log('- Token correct:', isCorrect)
  
  if (!isCorrect && currentToken) {
    console.log('⚠️ Token incorrect détecté. Utilisez updateWorkingJWTToken() pour corriger.')
  }
  
  return isCorrect
}

/**
 * Diagnostic complet du token
 */
export function diagnoseJWTToken(): void {
  console.log('🔐 DIAGNOSTIC JWT TOKEN')
  console.log('='.repeat(50))
  
  const currentToken = localStorage.getItem('auth_token')
  const isCorrect = currentToken === WORKING_JWT_TOKEN
  
  console.log('📊 État actuel:')
  console.log('- Token présent:', !!currentToken)
  console.log('- Token correct:', isCorrect)
  
  if (currentToken && !isCorrect) {
    console.log('❌ Token incorrect.')
    console.log('💡 Solution: updateWorkingJWTToken()')
  } else if (isCorrect) {
    console.log('✅ Token correct et fonctionnel')
    console.log('🚀 Toutes les APIs GraphQL devraient fonctionner')
  } else {
    console.log('❌ Aucun token présent')
    console.log('💡 Solution: updateWorkingJWTToken()')
  }
}

// Export des fonctions pour la console
if (typeof window !== 'undefined') {
  (window as any).updateWorkingJWTToken = updateWorkingJWTToken;
  (window as any).verifyCurrentToken = verifyCurrentToken;
  (window as any).diagnoseJWTToken = diagnoseJWTToken;
}

// ATTENTION: Auto-update désactivé pour respecter le cycle d'authentification normal
// Pour tester les APIs, utilisez manuellement updateWorkingJWTToken() dans la console
// ou décommentez les lignes suivantes TEMPORAIREMENT pour les tests

/*
// Auto-update du token au chargement si pas présent ou incorrect
const currentToken = localStorage.getItem('auth_token')
if (!currentToken || currentToken !== WORKING_JWT_TOKEN) {
  console.log('🔄 Mise à jour automatique du token JWT...')
  updateWorkingJWTToken()
}
*/
