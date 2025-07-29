# Module Orders - Documentation

## Structure du module

```
src/modules/orders/
├── components/
│   └── InvoicePreviewModal.vue     # Modal d'aperçu des factures
├── constants/
│   └── index.ts                    # Constantes du module
├── services/
│   └── orderService.ts             # Service GraphQL pour les commandes
├── stores/
│   └── orderStore.ts               # Store Pinia pour l'état global
├── types/
│   └── index.ts                    # Types TypeScript
├── utils/
│   └── formatters.ts               # Utilitaires de formatage
└── views/
    ├── OrderDetailView.vue         # Vue détaillée d'une commande
    └── SimpleOrdersView.vue        # Liste des commandes avec filtres
```

## Fonctionnalités

### 📋 Gestion des commandes
- ✅ Liste des commandes avec pagination (max 50 par API)
- ✅ Recherche globale dans toutes les commandes
- ✅ Filtres par statut, montant, date
- ✅ Validation/Annulation des commandes
- ✅ Vue détaillée avec informations complètes

### 📊 Statistiques et métriques
- ✅ Statistiques en temps réel par statut
- ✅ Calcul automatique des pourcentages
- ✅ Chiffre d'affaires total
- ✅ Indicateurs visuels avec graphiques

### 🧾 Génération de factures
- ✅ Génération PDF avec jsPDF
- ✅ Factures professionnelles avec en-tête
- ✅ Disponible uniquement pour les commandes validées
- ✅ Téléchargement automatique
- ✅ Aperçu avant téléchargement

### 🎨 Interface utilisateur
- ✅ Design moderne avec DaisyUI + Tailwind
- ✅ Interface responsive (mobile-first)
- ✅ Animations et transitions fluides
- ✅ Thème sombre professionnel

## API et contraintes

### Limitations GraphQL
- **Pagination maximale**: 50 éléments par requête
- **Recherche**: Implémentée côté client pour contourner les limitations
- **Filtres**: Combinaison API + client-side selon les capacités

### Champs disponibles
```typescript
interface Order {
  id: string
  total: number
  status: 'pending' | 'validated' | 'cancelled'
  created_at: string
  updated_at: string
  user?: {
    id: string
    name: string
    email: string
  }
  products?: OrderProduct[]
}
```

## Utilisation

### Importer les utilitaires
```typescript
import { formatCurrency, formatDate, getStatusLabel } from '../utils/formatters'
import { STATUS_OPTIONS, PAGINATION_CONFIG } from '../constants'
```

### Utiliser le store
```typescript
import { useOrderStore } from '../stores/orderStore'

const orderStore = useOrderStore()

// Charger les commandes avec filtres
await orderStore.fetchOrders(page, limit, filters)

// Valider une commande
await orderStore.validateOrder(orderId)

// Générer une facture
const invoice = await orderStore.generateInvoice(orderId)
```

### Générer une facture
```typescript
import { orderService } from '../services/orderService'

const result = await orderService.generateInvoice(orderId)
// { url: 'blob:...', filename: 'facture_xxx.pdf' }
```

## Performances

### Optimisations implémentées
- 🚀 **Recherche avec debounce**: 300ms de délai
- 🚀 **Pagination intelligente**: Charge seulement les données nécessaires
- 🚀 **Cache des statistiques**: Évite les requêtes répétées
- 🚀 **Filtrage côté client**: Pour la recherche globale
- 🚀 **Images lazy-loading**: Avec placeholder automatique

### Limites de sécurité
- **Maximum 20 pages** pour la recherche globale (1000 commandes)
- **Timeout de 30s** pour les requêtes longues
- **Validation des permissions** avant actions sensibles

## Dépendances

### Production
- `jspdf` - Génération de PDF côté client
- `vue` - Framework réactif
- `pinia` - Gestion d'état
- `vue-router` - Navigation

### Développement
- `@types/jspdf` - Types TypeScript pour jsPDF
- `tailwindcss` - Framework CSS
- `daisyui` - Composants UI

## Maintenance

### Code quality
- ✅ Code TypeScript avec types stricts
- ✅ Composants réutilisables et modulaires
- ✅ Utilitaires partagés pour éviter la duplication
- ✅ Constantes centralisées
- ✅ Gestion d'erreur cohérente

### Tests recommandés
- [ ] Tests unitaires pour les utilitaires
- [ ] Tests d'intégration pour le service
- [ ] Tests E2E pour les workflows complets
- [ ] Tests de performance pour la recherche globale

## Améliorations futures

### Fonctionnalités
- [ ] Export Excel/CSV des commandes
- [ ] Notifications temps réel (WebSocket)
- [ ] Historique des modifications
- [ ] Commentaires sur les commandes
- [ ] Intégration email pour les factures

### Technique
- [ ] Mise en cache Redis pour les statistiques
- [ ] Compression des images de produits
- [ ] Optimisation de la recherche avec Elasticsearch
- [ ] Pagination infinie
- [ ] Mode hors-ligne avec Service Worker
