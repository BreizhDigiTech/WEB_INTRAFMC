# Modules Directory

Ce dossier est destiné à contenir tous les modules de l'application WEB_INTRAFMC.

## 🚀 Comment ajouter un nouveau module

### 1. Créer la structure

```bash
mkdir src/modules/{nom-module}
mkdir src/modules/{nom-module}/{components,views,stores,services,types}
```

### 2. Structure type d'un module

```
src/modules/{nom-module}/
├── components/          # Composants spécifiques au module
│   ├── {Module}Layout.vue
│   ├── {Module}Dashboard.vue
│   └── autres composants...
├── views/              # Vues principales du module
│   ├── {Module}DashboardView.vue
│   ├── {Module}ListView.vue
│   └── autres vues...
├── stores/             # Stores Pinia du module
│   └── {module}Store.ts
├── services/           # Services et logique API
│   ├── {module}Service.ts
│   └── testCases.ts (optionnel)
├── types/              # Types TypeScript du module
│   └── index.ts
└── routes.ts           # Configuration des routes
```

### 3. Fichiers essentiels

#### routes.ts
```typescript
import type { RouteRecordRaw } from 'vue-router'

export const {module}Routes: RouteRecordRaw[] = [
  {
    path: '/{module}',
    name: '{Module}',
    component: () => import('./components/{Module}Layout.vue'),
    children: [
      {
        path: 'dashboard',
        name: '{Module}Dashboard',
        component: () => import('./views/{Module}DashboardView.vue')
      }
    ]
  }
]
```

#### stores/{module}Store.ts
```typescript
import { defineStore } from 'pinia'

export interface {Module}State {
  items: any[]
  isLoading: boolean
  error: string | null
}

export const use{Module}Store = defineStore('{module}', {
  state: (): {Module}State => ({
    items: [],
    isLoading: false,
    error: null
  }),

  getters: {
    itemCount: (state) => state.items.length
  },

  actions: {
    async fetchItems() {
      this.isLoading = true
      try {
        // Logique de récupération des données
      } catch (error) {
        this.error = error.message
      } finally {
        this.isLoading = false
      }
    }
  }
})
```

### 4. Intégration

#### Dans src/router/index.ts
```typescript
import { {module}Routes } from '@/modules/{module}/routes'

const routes: RouteRecordRaw[] = [
  // ... autres routes
  ...{module}Routes,
]
```

#### Dans src/App.vue
```vue
<nav class="main-nav">
  <router-link to="/" class="nav-link">Accueil</router-link>
  <router-link to="/{module}" class="nav-link">{Module}</router-link>
</nav>
```

### 5. Bonnes pratiques

- **Nommage** : Utilisez kebab-case pour les dossiers et PascalCase pour les composants
- **Types** : Définissez toujours des interfaces TypeScript pour vos données
- **Store** : Un store Pinia par module pour la gestion d'état
- **Services** : Séparez la logique API dans des services dédiés
- **Tests** : Ajoutez des tests unitaires si nécessaire

### 6. Utilitaires disponibles

L'application fournit des utilitaires partagés dans `src/shared/utils/` :
- `formatDate()` : Formatage des dates en français
- `formatDateTime()` : Formatage date + heure
- `debounce()` : Fonction de debounce
- `isValidEmail()` : Validation email
- Et plus...

### 7. Documentation

Consultez les fichiers de documentation à la racine :
- `DOCUMENTATION_TECHNIQUE.md` : Architecture et patterns
- `GUIDE_DEVELOPPEMENT.md` : Guide de développement
- `EXEMPLES_MODULES.md` : Exemples concrets

## 🎯 Modules suggérés

Voici quelques idées de modules à développer :

- **Dashboard Admin** : Interface d'administration
- **Gestion Utilisateurs** : CRUD utilisateurs
- **Inventaire** : Gestion des stocks
- **Commandes** : Suivi des commandes
- **Rapports** : Génération de rapports
- **Notifications** : Système de notifications
- **Analytics** : Statistiques et métriques

Bon développement ! 🚀
