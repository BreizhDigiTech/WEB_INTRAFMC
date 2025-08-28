/**
 * Script pour corriger automatiquement les variables non utilisées avec le préfixe _
 */

import { readFile, writeFile } from 'fs/promises'

const filesToFix = [
    'src/components/CartIndicator.vue',
    'src/modules/arrivals/views/ArrivalsListView.vue',
    'src/modules/ecommerce/views/CartView.vue',
    'src/modules/ecommerce/views/ProductCatalogView.vue',
    'src/modules/ecommerce/views/ProductDetailView.vue',
    'src/modules/orders/components/OrderFiltersPanel.vue',
    'src/modules/orders/services/orderService.ts',
    'src/modules/products/components/ProductPagination.vue',
    'src/modules/products/components/ProductTable.vue',
    'src/modules/products/services/productService.ts',
    'src/modules/products/stores/productStore.ts',
    'src/modules/products/utils/formatters.ts',
    'src/modules/products/views/CreateProductView.vue',
    'src/modules/products/views/ProductDetailView.vue',
    'src/modules/products/views/ProductsView.vue',
    'src/modules/profile/components/ProfileSecurityForm.vue',
    'src/modules/profile/services/profileService.ts',
    'src/modules/profile/views/ProfileView.vue',
    'src/modules/stats/services/hybridStatsService.improved.ts',
    'src/modules/stats/services/statsService.ts',
    'src/modules/users/services/userService.ts',
    'src/shared/monitoring/performance.ts',
    'src/shared/performance/productionOptimizations.ts',
    'src/shared/standards/codingStandards.ts'
]

const replacements = [
    // Variables communes
    { from: 'const totalItems =', to: 'const _totalItems =' },
    { from: 'const statsType =', to: 'const _statsType =' },
    { from: 'newQuery', to: '_newQuery' },
    { from: 'const loadGlobalStats =', to: 'const _loadGlobalStats =' },
    { from: 'const router =', to: 'const _router =' },
    { from: 'const totalPrice =', to: 'const _totalPrice =' },
    { from: 'const saveForLater =', to: 'const _saveForLater =' },
    { from: 'const hasActiveFilters =', to: 'const _hasActiveFilters =' },
    { from: 'const handleCategoryFilter =', to: 'const _handleCategoryFilter =' },
    { from: 'const handleStockFilter =', to: 'const _handleStockFilter =' },
    { from: '(newValue)', to: '(_newValue)' },
    { from: 'const getProductsByCategory =', to: 'const _getProductsByCategory =' },
    { from: 'const props =', to: 'const _props =' },
    { from: 'filters)', to: '_filters)' },
    { from: 'const emit =', to: 'const _emit =' },
    { from: 'first,', to: '_first,' },
    { from: 'page)', to: '_page)' },
    { from: 'searchQuery,', to: '_searchQuery,' },
    { from: 'categoryId)', to: '_categoryId)' },
    { from: '(product)', to: '(_product)' },
    { from: 'const productStore =', to: 'const _productStore =' },
    { from: 'const baseInput =', to: 'const _baseInput =' },
    { from: 'const addCategoryToProduct =', to: 'const _addCategoryToProduct =' },
    { from: 'const newImageUrls =', to: 'const _newImageUrls =' },
    { from: 'const totalStockValue =', to: 'const _totalStockValue =' },
    { from: 'reject)', to: '_reject)' },
    { from: 'const formatDate =', to: 'const _formatDate =' },
    { from: 'const getMembershipDuration =', to: 'const _getMembershipDuration =' },
    { from: 'const ordersSummary =', to: 'const _ordersSummary =' },
    { from: 'const avatar =', to: 'const _avatar =' },
    { from: '(key)', to: '(_key)' },
    { from: 'const measurements =', to: 'const _measurements =' },
    { from: 'modulePath)', to: '_modulePath)' },
    { from: 'filePath)', to: '_filePath)' }
]

async function fixUnusedVars() {
    console.log('🔧 Correction des variables non utilisées...\n')
    
    for (const fileName of filesToFix) {
        try {
            const content = await readFile(fileName, 'utf-8')
            let newContent = content
            
            for (const replacement of replacements) {
                if (newContent.includes(replacement.from)) {
                    newContent = newContent.replace(new RegExp(replacement.from, 'g'), replacement.to)
                    console.log(`✅ ${fileName}: ${replacement.from} → ${replacement.to}`)
                }
            }
            
            if (newContent !== content) {
                await writeFile(fileName, newContent)
                console.log(`💾 ${fileName} mis à jour\n`)
            }
        } catch (error) {
            console.log(`❌ Erreur avec ${fileName}:`, error.message)
        }
    }
    
    console.log('✨ Correction terminée!')
}

fixUnusedVars()
