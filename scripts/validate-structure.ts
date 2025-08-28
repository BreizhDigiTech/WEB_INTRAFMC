/**
 * Script de validation de la cohérence du projet
 * Usage: npm run validate:structure
 */

import { promises as fs } from 'fs'
import path from 'path'

interface ModuleStructure {
  name: string
  hasIndex: boolean
  hasTypes: boolean
  hasServices: boolean
  hasStores: boolean
  hasViews: boolean
  hasComponents: boolean
  missingFiles: string[]
}

const REQUIRED_MODULE_FILES = [
  'index.ts',
  'types/index.ts',
]

const OPTIONAL_MODULE_FILES = [
  'services',
  'stores', 
  'views',
  'components',
  'composables',
  'utils',
  'constants'
]

async function validateModuleStructure(): Promise<void> {
  const modulesDir = path.join(process.cwd(), 'src/modules')
  
  try {
    const modules = await fs.readdir(modulesDir)
    const results: ModuleStructure[] = []
    
    for (const moduleName of modules) {
      const modulePath = path.join(modulesDir, moduleName)
      const stat = await fs.stat(modulePath)
      
      if (!stat.isDirectory()) continue
      
      const moduleAnalysis: ModuleStructure = {
        name: moduleName,
        hasIndex: false,
        hasTypes: false,
        hasServices: false,
        hasStores: false,
        hasViews: false,
        hasComponents: false,
        missingFiles: []
      }
      
      // Vérifier les fichiers requis
      for (const requiredFile of REQUIRED_MODULE_FILES) {
        const filePath = path.join(modulePath, requiredFile)
        try {
          await fs.access(filePath)
          if (requiredFile === 'index.ts') moduleAnalysis.hasIndex = true
          if (requiredFile === 'types/index.ts') moduleAnalysis.hasTypes = true
        } catch {
          moduleAnalysis.missingFiles.push(requiredFile)
        }
      }
      
      // Vérifier les dossiers optionnels
      for (const optionalDir of OPTIONAL_MODULE_FILES) {
        const dirPath = path.join(modulePath, optionalDir)
        try {
          const stat = await fs.stat(dirPath)
          if (stat.isDirectory()) {
            switch (optionalDir) {
              case 'services': moduleAnalysis.hasServices = true; break
              case 'stores': moduleAnalysis.hasStores = true; break
              case 'views': moduleAnalysis.hasViews = true; break
              case 'components': moduleAnalysis.hasComponents = true; break
            }
          }
        } catch {
          // Dossier optionnel manquant, ce n'est pas grave
        }
      }
      
      results.push(moduleAnalysis)
    }
    
    // Rapport de validation
    console.log('\n🔍 RAPPORT DE VALIDATION DE STRUCTURE\n')
    
    const validModules = results.filter(m => m.missingFiles.length === 0)
    const invalidModules = results.filter(m => m.missingFiles.length > 0)
    
    console.log(`✅ Modules valides: ${validModules.length}/${results.length}`)
    console.log(`❌ Modules avec problèmes: ${invalidModules.length}/${results.length}`)
    
    if (invalidModules.length > 0) {
      console.log('\n❌ MODULES AVEC PROBLÈMES:\n')
      invalidModules.forEach(module => {
        console.log(`  📁 ${module.name}:`)
        module.missingFiles.forEach(file => {
          console.log(`    ❌ Manque: ${file}`)
        })
        console.log()
      })
    }
    
    if (validModules.length > 0) {
      console.log('\n✅ MODULES CONFORMES:\n')
      validModules.forEach(module => {
        const features: string[] = []
        if (module.hasServices) features.push('Services')
        if (module.hasStores) features.push('Stores')
        if (module.hasViews) features.push('Views')
        if (module.hasComponents) features.push('Components')
        
        console.log(`  📁 ${module.name}: ${features.join(', ') || 'Structure de base'}`)
      })
    }
    
    console.log('\n📊 RÉSUMÉ:')
    console.log(`  - Index files: ${results.filter(m => m.hasIndex).length}/${results.length}`)
    console.log(`  - Types: ${results.filter(m => m.hasTypes).length}/${results.length}`)
    console.log(`  - Services: ${results.filter(m => m.hasServices).length}/${results.length}`)
    console.log(`  - Stores: ${results.filter(m => m.hasStores).length}/${results.length}`)
    console.log(`  - Views: ${results.filter(m => m.hasViews).length}/${results.length}`)
    console.log(`  - Components: ${results.filter(m => m.hasComponents).length}/${results.length}`)
    
    if (invalidModules.length === 0) {
      console.log('\n🎉 Tous les modules respectent la structure standard!')
      process.exit(0)
    } else {
      console.log('\n⚠️ Des modules nécessitent des corrections.')
      process.exit(1)
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la validation:', error)
    process.exit(1)
  }
}

// Exécution du script
validateModuleStructure()
