// Store Pinia pour les tests GraphQL

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { cbdTestService } from '../services/testService'

export interface TestResult {
    id: string
    testName: string
    status: 'success' | 'error' | 'pending'
    duration: number
    data: any
    error?: string
    timestamp: Date
}

export interface TestSuite {
    name: string
    tests: TestResult[]
    status: 'running' | 'completed' | 'idle'
    totalTests: number
    successCount: number
    errorCount: number
    duration: number
}

export const useCBDTestStore = defineStore('cbdTest', () => {
    // État réactif
    const testSuites = ref<TestSuite[]>([])
    const currentTest = ref<string | null>(null)
    const isRunning = ref(false)
    const lastTestRun = ref<Date | null>(null)

    // Actions utilitaires
    const generateTestId = () => `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const createTestSuite = (name: string): TestSuite => ({
        name,
        tests: [],
        status: 'idle',
        totalTests: 0,
        successCount: 0,
        errorCount: 0,
        duration: 0
    })

    const runSingleTest = async (
        testName: string,
        testFunction: () => Promise<any>,
        suite: TestSuite
    ): Promise<TestResult> => {
        const testId = generateTestId()
        const startTime = Date.now()

        const testResult: TestResult = {
            id: testId,
            testName,
            status: 'pending',
            duration: 0,
            data: null,
            timestamp: new Date()
        }

        suite.tests.push(testResult)
        currentTest.value = testName

        try {
            const data = await testFunction()
            const duration = Date.now() - startTime

            testResult.status = 'success'
            testResult.duration = duration
            testResult.data = data

            suite.successCount++

            console.log(`✅ ${testName} - ${duration}ms`, data)
            return testResult

        } catch (error) {
            const duration = Date.now() - startTime

            testResult.status = 'error'
            testResult.duration = duration
            testResult.error = error instanceof Error ? error.message : String(error)

            suite.errorCount++

            console.error(`❌ ${testName} - ${duration}ms`, error)
            return testResult
        }
    }

    // ========================================
    // 🔐 TESTS AUTHENTIFICATION
    // ========================================

    const runAuthTests = async () => {
        const suite = createTestSuite('🔐 Authentification')
        suite.status = 'running'
        testSuites.value.push(suite)

        const startTime = Date.now()

        // Test Login
        await runSingleTest(
            'login - Connexion admin',
            () => cbdTestService.testLogin(),
            suite
        )

        // Test Me
        await runSingleTest(
            'me - Profil utilisateur',
            () => cbdTestService.testMe(),
            suite
        )

        // Test Login avec mauvais credentials
        await runSingleTest(
            'login - Mauvais mot de passe',
            () => cbdTestService.testLogin("admin@admin.com", "wrongpassword"),
            suite
        )

        suite.duration = Date.now() - startTime
        suite.status = 'completed'
        suite.totalTests = suite.tests.length
    }

    // ========================================
    // 👥 TESTS UTILISATEURS
    // ========================================

    const runUserTests = async () => {
        const suite = createTestSuite('👥 Utilisateurs')
        suite.status = 'running'
        testSuites.value.push(suite)

        const startTime = Date.now()

        // Test Users pagination
        await runSingleTest(
            'users - Liste paginée (page 1)',
            () => cbdTestService.testUsers(15, 1),
            suite
        )

        await runSingleTest(
            'users - Liste paginée (page 2)',
            () => cbdTestService.testUsers(10, 2),
            suite
        )

        // Test User spécifique
        await runSingleTest(
            'user - Utilisateur ID 1',
            () => cbdTestService.testUser("1"),
            suite
        )

        // Test User inexistant
        await runSingleTest(
            'user - Utilisateur inexistant',
            () => cbdTestService.testUser("999999"),
            suite
        )

        suite.duration = Date.now() - startTime
        suite.status = 'completed'
        suite.totalTests = suite.tests.length
    }

    // ========================================
    // 🌿 TESTS PRODUITS CBD
    // ========================================

    const runProductTests = async () => {
        const suite = createTestSuite('🌿 Produits CBD')
        suite.status = 'running'
        testSuites.value.push(suite)

        const startTime = Date.now()

        // Test Products pagination
        await runSingleTest(
            'products - Liste paginée (page 1)',
            () => cbdTestService.testProducts(20, 1),
            suite
        )

        await runSingleTest(
            'products - Liste paginée (page 2, 10 items)',
            () => cbdTestService.testProducts(10, 2),
            suite
        )

        await runSingleTest(
            'products - Liste paginée (page 3, 5 items)',
            () => cbdTestService.testProducts(5, 3),
            suite
        )

        // Test Product spécifique
        await runSingleTest(
            'product - Produit ID 1',
            () => cbdTestService.testProduct("1"),
            suite
        )

        await runSingleTest(
            'product - Produit ID 5',
            () => cbdTestService.testProduct("5"),
            suite
        )

        // Test Product inexistant
        await runSingleTest(
            'product - Produit inexistant',
            () => cbdTestService.testProduct("999999"),
            suite
        )

        // Test création produit (si admin)
        await runSingleTest(
            'createProduct - Nouveau produit de test',
            () => cbdTestService.testCreateProduct({
                name: "Produit Test CBD",
                description: "Produit créé par les tests automatiques",
                price: 29.99,
                images: ["https://example.com/test.jpg"],
                stock: 50,
                category_id: 1
            }),
            suite
        )

        suite.duration = Date.now() - startTime
        suite.status = 'completed'
        suite.totalTests = suite.tests.length
    }

    // ========================================
    // 📂 TESTS CATÉGORIES
    // ========================================

    const runCategoryTests = async () => {
        const suite = createTestSuite('📂 Catégories')
        suite.status = 'running'
        testSuites.value.push(suite)

        const startTime = Date.now()

        // Test Categories
        await runSingleTest(
            'categories - Liste complète',
            () => cbdTestService.testCategories(),
            suite
        )

        // Test Category spécifique
        await runSingleTest(
            'category - Catégorie ID 1',
            () => cbdTestService.testCategory("1"),
            suite
        )

        await runSingleTest(
            'category - Catégorie ID 2',
            () => cbdTestService.testCategory("2"),
            suite
        )

        // Test Category inexistante
        await runSingleTest(
            'category - Catégorie inexistante',
            () => cbdTestService.testCategory("999999"),
            suite
        )

        // Test création catégorie
        await runSingleTest(
            'createCategory - Nouvelle catégorie test',
            () => cbdTestService.testCreateCategory({
                name: "Catégorie Test",
                description: "Catégorie créée par les tests automatiques"
            }),
            suite
        )

        suite.duration = Date.now() - startTime
        suite.status = 'completed'
        suite.totalTests = suite.tests.length
    }

    // ========================================
    // 🏭 TESTS FOURNISSEURS
    // ========================================

    const runSupplierTests = async () => {
        const suite = createTestSuite('🏭 Fournisseurs')
        suite.status = 'running'
        testSuites.value.push(suite)

        const startTime = Date.now()

        // Test Suppliers
        await runSingleTest(
            'suppliers - Liste complète',
            () => cbdTestService.testSuppliers(),
            suite
        )

        // Test Supplier spécifique
        await runSingleTest(
            'supplier - Fournisseur ID 1',
            () => cbdTestService.testSupplier("1"),
            suite
        )

        // Test création fournisseur
        await runSingleTest(
            'createSupplier - Nouveau fournisseur test',
            () => cbdTestService.testCreateSupplier(
                "Fournisseur Test",
                "test@supplier.com",
                "+33123456789"
            ),
            suite
        )

        suite.duration = Date.now() - startTime
        suite.status = 'completed'
        suite.totalTests = suite.tests.length
    }

    // ========================================
    // 🛒 TESTS PANIER
    // ========================================

    const runCartTests = async () => {
        const suite = createTestSuite('🛒 Panier')
        suite.status = 'running'
        testSuites.value.push(suite)

        const startTime = Date.now()

        // Test MyCart
        await runSingleTest(
            'myCart - Mon panier actuel',
            () => cbdTestService.testMyCart(),
            suite
        )

        // Test CartTotal
        await runSingleTest(
            'cartTotal - Total du panier',
            () => cbdTestService.testCartTotal(),
            suite
        )

        // Test AddToCart
        await runSingleTest(
            'addToCart - Ajouter produit au panier',
            () => cbdTestService.testAddToCart({
                product_id: "1",
                quantity: 2
            }),
            suite
        )

        suite.duration = Date.now() - startTime
        suite.status = 'completed'
        suite.totalTests = suite.tests.length
    }

    // ========================================
    // 📦 TESTS COMMANDES
    // ========================================

    const runOrderTests = async () => {
        const suite = createTestSuite('📦 Commandes')
        suite.status = 'running'
        testSuites.value.push(suite)

        const startTime = Date.now()

        // Test Orders pagination
        await runSingleTest(
            'orders - Liste paginée (page 1)',
            () => cbdTestService.testOrders(10, 1),
            suite
        )

        await runSingleTest(
            'orders - Liste paginée (page 2)',
            () => cbdTestService.testOrders(5, 2),
            suite
        )

        // Test Order spécifique
        await runSingleTest(
            'order - Commande ID 1',
            () => cbdTestService.testOrder("1"),
            suite
        )

        // Test Checkout
        await runSingleTest(
            'checkout - Finaliser commande',
            () => cbdTestService.testCheckout(),
            suite
        )

        suite.duration = Date.now() - startTime
        suite.status = 'completed'
        suite.totalTests = suite.tests.length
    }

    // ========================================
    // 📋 TESTS ARRIVAGES
    // ========================================

    const runArrivalTests = async () => {
        const suite = createTestSuite('📋 Arrivages')
        suite.status = 'running'
        testSuites.value.push(suite)

        const startTime = Date.now()

        // Test Arrivals pagination
        await runSingleTest(
            'arrivals - Liste paginée (page 1)',
            () => cbdTestService.testArrivals(15, 1),
            suite
        )

        await runSingleTest(
            'arrivals - Liste paginée (page 2, 10 items)',
            () => cbdTestService.testArrivals(10, 2),
            suite
        )

        // Test Arrival spécifique
        await runSingleTest(
            'arrival - Arrivage ID 1',
            () => cbdTestService.testArrival("1"),
            suite
        )

        // Test création arrivage
        await runSingleTest(
            'createArrival - Nouvel arrivage test',
            () => cbdTestService.testCreateArrival({
                amount: 1500.00,
                status: "pending",
                products: [
                    {
                        product_id: "1",
                        quantity: 50,
                        unit_price: 15.00
                    }
                ]
            }),
            suite
        )

        suite.duration = Date.now() - startTime
        suite.status = 'completed'
        suite.totalTests = suite.tests.length
    }

    // ========================================
    // 🚀 LANCEUR DE TESTS
    // ========================================

    const runAllTests = async () => {
        if (isRunning.value) return

        isRunning.value = true
        testSuites.value = []
        currentTest.value = null

        console.log('🚀 Démarrage des tests complets de l\'API GraphQL')

        try {
            await runAuthTests()
            await runUserTests()
            await runProductTests()
            await runCategoryTests()
            await runSupplierTests()
            await runCartTests()
            await runOrderTests()
            await runArrivalTests()

            lastTestRun.value = new Date()

            // Résumé final
            const totalTests = testSuites.value.reduce((sum, suite) => sum + suite.totalTests, 0)
            const totalSuccess = testSuites.value.reduce((sum, suite) => sum + suite.successCount, 0)
            const totalErrors = testSuites.value.reduce((sum, suite) => sum + suite.errorCount, 0)
            const totalDuration = testSuites.value.reduce((sum, suite) => sum + suite.duration, 0)

            console.log('🏁 Tests terminés:', {
                suites: testSuites.value.length,
                totalTests,
                success: totalSuccess,
                errors: totalErrors,
                duration: `${totalDuration}ms`,
                successRate: `${Math.round((totalSuccess / totalTests) * 100)}%`
            })

        } catch (error) {
            console.error('❌ Erreur lors de l\'exécution des tests:', error)
        } finally {
            isRunning.value = false
            currentTest.value = null
        }
    }

    const runTestSuite = async (suiteName: string) => {
        if (isRunning.value) return

        isRunning.value = true

        // Supprimer la suite existante si présente
        const existingIndex = testSuites.value.findIndex(s => s.name === suiteName)
        if (existingIndex !== -1) {
            testSuites.value.splice(existingIndex, 1)
        }

        try {
            switch (suiteName) {
                case '🔐 Authentification':
                    await runAuthTests()
                    break
                case '👥 Utilisateurs':
                    await runUserTests()
                    break
                case '🌿 Produits CBD':
                    await runProductTests()
                    break
                case '📂 Catégories':
                    await runCategoryTests()
                    break
                case '🏭 Fournisseurs':
                    await runSupplierTests()
                    break
                case '🛒 Panier':
                    await runCartTests()
                    break
                case '📦 Commandes':
                    await runOrderTests()
                    break
                case '📋 Arrivages':
                    await runArrivalTests()
                    break
            }
        } finally {
            isRunning.value = false
            currentTest.value = null
        }
    }

    const clearResults = () => {
        testSuites.value = []
        lastTestRun.value = null
    }

    return {
        // État
        testSuites,
        currentTest,
        isRunning,
        lastTestRun,

        // Actions
        runAllTests,
        runTestSuite,
        clearResults
    }
})
