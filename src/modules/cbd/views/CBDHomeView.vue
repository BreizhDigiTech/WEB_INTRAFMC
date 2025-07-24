<template>
    <div class="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <!-- Header avec animation -->
        <div class="relative overflow-hidden bg-gradient-to-r from-green-600 to-blue-600 shadow-2xl">
            <div class="absolute inset-0 bg-black opacity-20"></div>
            <div class="relative container mx-auto px-6 py-16">
                <div class="text-center">
                    <h1 class="text-5xl font-extrabold text-white mb-4 animate-pulse">
                        🧪 Interface de Test API GraphQL Complète
                    </h1>
                    <p class="text-xl text-green-100 mb-8">
                        Tests exhaustifs de toutes les fonctionnalités de l'API Intra FMC
                    </p>
                    
                    <!-- Boutons d'action principaux -->
                    <div class="flex flex-wrap justify-center gap-4 mb-8">
                        <button 
                            @click="testStore.runAllTests()" 
                            class="btn btn-primary btn-lg bg-gradient-to-r from-green-500 to-green-600 border-0 hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-300"
                            :disabled="testStore.isRunning"
                        >
                            <span v-if="!testStore.isRunning">🚀 Lancer tous les tests</span>
                            <span v-else class="loading loading-spinner"></span>
                        </button>
                        
                        <button 
                            @click="testStore.clearResults()" 
                            class="btn btn-warning btn-lg border-0 transform hover:scale-105 transition-all duration-300"
                            :disabled="testStore.isRunning"
                        >
                            🗑️ Effacer résultats
                        </button>
                    </div>

                    <!-- Indicateur test en cours -->
                    <div v-if="testStore.currentTest" class="text-center mb-4">
                        <div class="loading loading-dots loading-lg text-white"></div>
                        <p class="text-white text-lg">Test en cours: {{ testStore.currentTest }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Section principale avec les tests -->
        <div class="container mx-auto px-6 py-12">
            
            <!-- Stats globales des tests -->
            <div v-if="testStore.testSuites.length > 0" class="mb-12">
                <div class="card bg-base-100 shadow-xl">
                    <div class="card-body">
                        <h2 class="card-title text-2xl mb-4">📊 Résumé des tests</h2>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div class="stat">
                                <div class="stat-title">Suites</div>
                                <div class="stat-value text-primary">{{ testStore.testSuites.length }}</div>
                            </div>
                            <div class="stat">
                                <div class="stat-title">Tests totaux</div>
                                <div class="stat-value text-secondary">{{ totalTests }}</div>
                            </div>
                            <div class="stat">
                                <div class="stat-title">Succès</div>
                                <div class="stat-value text-success">{{ totalSuccess }}</div>
                            </div>
                            <div class="stat">
                                <div class="stat-title">Erreurs</div>
                                <div class="stat-value text-error">{{ totalErrors }}</div>
                            </div>
                        </div>
                        <div class="mt-4">
                            <div class="flex justify-between text-sm">
                                <span>Taux de réussite</span>
                                <span>{{ successRate }}%</span>
                            </div>
                            <progress class="progress progress-success w-full" :value="successRate" max="100"></progress>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Suites de tests individuelles -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
                <!-- Carte pour chaque module de test -->
                <div class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
                    <div class="card-body">
                        <h3 class="card-title text-xl">🔐 Authentification</h3>
                        <p class="text-sm opacity-70">Tests de connexion, profil utilisateur, tokens JWT</p>
                        <div class="card-actions justify-end">
                            <button 
                                @click="testStore.runTestSuite('🔐 Authentification')"
                                class="btn btn-primary btn-sm"
                                :disabled="testStore.isRunning"
                            >
                                Tester
                            </button>
                        </div>
                    </div>
                </div>

                <div class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
                    <div class="card-body">
                        <h3 class="card-title text-xl">👥 Utilisateurs</h3>
                        <p class="text-sm opacity-70">Tests CRUD utilisateurs, pagination, permissions admin</p>
                        <div class="card-actions justify-end">
                            <button 
                                @click="testStore.runTestSuite('👥 Utilisateurs')"
                                class="btn btn-primary btn-sm"
                                :disabled="testStore.isRunning"
                            >
                                Tester
                            </button>
                        </div>
                    </div>
                </div>

                <div class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
                    <div class="card-body">
                        <h3 class="card-title text-xl">🌿 Produits CBD</h3>
                        <p class="text-sm opacity-70">Tests CRUD produits, pagination, relations catégories/fournisseurs</p>
                        <div class="card-actions justify-end">
                            <button 
                                @click="testStore.runTestSuite('🌿 Produits CBD')"
                                class="btn btn-primary btn-sm"
                                :disabled="testStore.isRunning"
                            >
                                Tester
                            </button>
                        </div>
                    </div>
                </div>

                <div class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
                    <div class="card-body">
                        <h3 class="card-title text-xl">📂 Catégories</h3>
                        <p class="text-sm opacity-70">Tests CRUD catégories, associations produits</p>
                        <div class="card-actions justify-end">
                            <button 
                                @click="testStore.runTestSuite('📂 Catégories')"
                                class="btn btn-primary btn-sm"
                                :disabled="testStore.isRunning"
                            >
                                Tester
                            </button>
                        </div>
                    </div>
                </div>

                <div class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
                    <div class="card-body">
                        <h3 class="card-title text-xl">🏭 Fournisseurs</h3>
                        <p class="text-sm opacity-70">Tests CRUD fournisseurs, associations produits</p>
                        <div class="card-actions justify-end">
                            <button 
                                @click="testStore.runTestSuite('🏭 Fournisseurs')"
                                class="btn btn-primary btn-sm"
                                :disabled="testStore.isRunning"
                            >
                                Tester
                            </button>
                        </div>
                    </div>
                </div>

                <div class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
                    <div class="card-body">
                        <h3 class="card-title text-xl">🛒 Panier</h3>
                        <p class="text-sm opacity-70">Tests gestion panier, ajout/suppression, calculs totaux</p>
                        <div class="card-actions justify-end">
                            <button 
                                @click="testStore.runTestSuite('🛒 Panier')"
                                class="btn btn-primary btn-sm"
                                :disabled="testStore.isRunning"
                            >
                                Tester
                            </button>
                        </div>
                    </div>
                </div>

                <div class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
                    <div class="card-body">
                        <h3 class="card-title text-xl">📦 Commandes</h3>
                        <p class="text-sm opacity-70">Tests CRUD commandes, pagination, relations produits, checkout</p>
                        <div class="card-actions justify-end">
                            <button 
                                @click="testStore.runTestSuite('📦 Commandes')"
                                class="btn btn-primary btn-sm"
                                :disabled="testStore.isRunning"
                            >
                                Tester
                            </button>
                        </div>
                    </div>
                </div>

                <div class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
                    <div class="card-body">
                        <h3 class="card-title text-xl">📋 Arrivages</h3>
                        <p class="text-sm opacity-70">Tests CRUD arrivages, pagination, validation stock</p>
                        <div class="card-actions justify-end">
                            <button 
                                @click="testStore.runTestSuite('📋 Arrivages')"
                                class="btn btn-primary btn-sm"
                                :disabled="testStore.isRunning"
                            >
                                Tester
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Résultats détaillés des tests -->
            <div v-if="testStore.testSuites.length > 0" class="space-y-6">
                <h2 class="text-3xl font-bold text-center mb-8">📋 Résultats des tests</h2>
                
                <div v-for="suite in testStore.testSuites" :key="suite.name" class="card bg-base-100 shadow-xl">
                    <div class="card-body">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="card-title text-xl">{{ suite.name }}</h3>
                            <div class="flex gap-2 items-center">
                                <div class="badge badge-success">{{ suite.successCount }} ✓</div>
                                <div class="badge badge-error">{{ suite.errorCount }} ✗</div>
                                <div class="badge badge-neutral">{{ suite.duration }}ms</div>
                                <div v-if="suite.status === 'running'" class="loading loading-spinner loading-sm"></div>
                                <div v-else-if="suite.status === 'completed'" class="text-success">✅</div>
                            </div>
                        </div>

                        <!-- Tests individuels -->
                        <div class="space-y-2">
                            <div v-for="test in suite.tests" :key="test.id" class="flex items-center justify-between p-3 rounded-lg bg-base-200">
                                <div class="flex items-center gap-3">
                                    <div v-if="test.status === 'success'" class="text-success text-xl">✅</div>
                                    <div v-else-if="test.status === 'error'" class="text-error text-xl">❌</div>
                                    <div v-else class="loading loading-spinner loading-sm"></div>
                                    
                                    <div>
                                        <div class="font-medium">{{ test.testName }}</div>
                                        <div v-if="test.error" class="text-error text-sm">{{ test.error }}</div>
                                    </div>
                                </div>
                                
                                <div class="flex gap-2 items-center">
                                    <div class="badge badge-neutral badge-sm">{{ test.duration }}ms</div>
                                    <button 
                                        v-if="test.data" 
                                        @click="toggleTestData(test.id)"
                                        class="btn btn-ghost btn-xs"
                                    >
                                        {{ expandedTests.has(test.id) ? '🔼' : '🔽' }}
                                    </button>
                                </div>
                            </div>

                            <!-- Données détaillées des tests -->
                            <div v-for="test in suite.tests" :key="`data-${test.id}`">
                                <div v-if="expandedTests.has(test.id) && test.data" class="mt-2 p-4 bg-base-300 rounded-lg">
                                    <h5 class="font-bold mb-2">Données retournées:</h5>
                                    <pre class="text-xs overflow-auto max-h-64 bg-base-100 p-3 rounded">{{ JSON.stringify(test.data, null, 2) }}</pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Message initial -->
            <div v-if="testStore.testSuites.length === 0 && !testStore.isRunning" class="text-center py-16">
                <div class="text-6xl mb-4">🧪</div>
                <h3 class="text-2xl font-bold mb-2">Prêt pour les tests</h3>
                <p class="text-lg opacity-70">Cliquez sur "Lancer tous les tests" pour commencer l'évaluation complète de votre API GraphQL</p>
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useCBDTestStore } from '../stores/testStore'

const testStore = useCBDTestStore()
const expandedTests = ref(new Set<string>())

// Computed pour les stats globales
const totalTests = computed(() => 
    testStore.testSuites.reduce((sum, suite) => sum + suite.totalTests, 0)
)

const totalSuccess = computed(() => 
    testStore.testSuites.reduce((sum, suite) => sum + suite.successCount, 0)
)

const totalErrors = computed(() => 
    testStore.testSuites.reduce((sum, suite) => sum + suite.errorCount, 0)
)

const successRate = computed(() => {
    if (totalTests.value === 0) return 0
    return Math.round((totalSuccess.value / totalTests.value) * 100)
})

// Fonctions utilitaires
const toggleTestData = (testId: string) => {
    if (expandedTests.value.has(testId)) {
        expandedTests.value.delete(testId)
    } else {
        expandedTests.value.add(testId)
    }
}

onMounted(() => {
    console.log('🧪 Interface de test API GraphQL initialisée')
    console.log('📡 Prêt à tester toutes les fonctionnalités de votre API')
})
</script>
