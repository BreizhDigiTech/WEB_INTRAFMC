# Module Orders - Documentation

## Structure du module

```
src/modules/orders/
├── components/
│   └── InvoicePreviewModal.vue     # Modal d'aperçu des factures
├── constants/
│   └── index.ts                    # Constantes et statuts du module
├── services/
│   ├── orderService.ts             # Service GraphQL pour les commandes
│   └── checkoutService.ts          # Service GraphQL pour le checkout
├── stores/
│   └── orderStore.ts               # Store Pinia pour l'état global
├── types/
│   └── index.ts                    # Types TypeScript
├── utils/
│   └── formatters.ts               # Utilitaires de formatage
└── views/
    ├── OrderDetailView.vue         # Vue détaillée d'une commande
    ├── OrderDetailView_new.vue     # Nouvelle vue détaillée
    ├── SimpleOrdersView.vue        # Liste des commandes avec filtres
    └── AdvancedOrdersView.vue      # Vue avancée des commandes
```

## Nouveautés - Mise à jour API GraphQL

### 🔄 Nouveaux statuts de commandes
Selon la documentation API, les statuts disponibles sont maintenant :
- **`pending`** - En attente
- **`processing`** - En cours de traitement  
- **`shipped`** - Expédiée
- **`delivered`** - Livrée
- **`cancelled`** - Annulée
- **`refunded`** - Remboursée

### 🎯 Transitions de statut autorisées
Les transitions sont strictement définies :
- `pending` → `processing`, `cancelled`
- `processing` → `shipped`, `cancelled`  
- `shipped` → `delivered`
- `delivered` → `refunded`
- `cancelled` → (aucune transition)
- `refunded` → (aucune transition)

### 📊 Nouvelles queries et mutations

#### Queries disponibles
```graphql
# Commandes utilisateur (pagination automatique)
query MyOrders($first: Int = 10, $page: Int = 1)

# Toutes les commandes (Admin uniquement)
query AllOrders($first: Int = 15, $page: Int = 1)

# Détails complets d'une commande
query GetOrderDetails($id: ID!)

# Statistiques d'une commande
query GetOrderStats($id: ID!)
```

#### Mutations disponibles
```graphql
# Finaliser le panier en commande
mutation Checkout

# Annuler une commande
mutation CancelOrder($id: ID!)

# Modifier le statut (Admin uniquement)
mutation UpdateOrderStatus($input: UpdateOrderStatusInput!)
```

## Fonctionnalités

### 📋 Gestion des commandes
- ✅ Liste des commandes avec pagination (max 50 par API)
- ✅ Recherche globale dans toutes les commandes
- ✅ Filtres par statut, montant, date
- ✅ Gestion des transitions de statut
- ✅ Vue détaillée avec informations complètes
- ✅ Support des nouveaux statuts API

### � Workflow de commandes  
- ✅ Transitions de statut respectant l'API
- ✅ Validation des changements de statut
- ✅ Interface admin pour gestion des statuts
- ✅ Historique des changements

### �📊 Statistiques et métriques
- ✅ Statistiques en temps réel par statut
- ✅ Calcul automatique des pourcentages
- ✅ Chiffre d'affaires basé sur commandes livrées/expédiées
- ✅ Indicateurs visuels avec graphiques

### 🧾 Génération de factures
- ✅ Génération PDF avec jsPDF
- ✅ Factures professionnelles avec en-tête
- ✅ Disponible pour commandes livrées/expédiées
- ✅ Téléchargement automatique
- ✅ Aperçu avant téléchargement

### 🎨 Interface utilisateur
- ✅ Design moderne avec DaisyUI + Tailwind
- ✅ Interface responsive (mobile-first)
- ✅ Animations et transitions fluides
- ✅ Thème sombre professionnel
- ✅ Badges de statut colorés

## API et contraintes

### Limitations GraphQL
- **Pagination maximale**: 50 éléments par requête
- **Recherche**: Implémentée côté client pour contourner les limitations
- **Filtres**: Combinaison API + client-side selon les capacités

### Champs disponibles
```typescript
interface Order {
  id: string
  user_id: string  
  total: number
  status: OrderStatus
  formatted_status?: string
  created_at: string
  updated_at: string
  user?: OrderUser
  products?: OrderProduct[]
}

interface OrderStats {
  order_id: string
  total_items: number
  product_count: number
  total_amount: number
  average_item_price: number
  created_at: string
  status: string
}
```

## Utilisation

### Importer les utilitaires
```typescript
import { 
  formatCurrency, 
  formatDate, 
  getStatusLabel,
  isStatusTransitionAllowed,
  getNextAllowedStatuses
} from '../utils/formatters'
import { STATUS_OPTIONS, STATUS_TRANSITIONS } from '../constants'
```

### Utiliser le store
```typescript
import { useOrderStore } from '../stores/orderStore'

const orderStore = useOrderStore()

// Charger les commandes avec filtres
await orderStore.fetchOrders(page, limit, filters)

// Changer le statut d'une commande
await orderStore.updateOrderStatus(orderId, newStatus)

// Annuler une commande
await orderStore.cancelOrder(orderId)

// Générer une facture
const invoice = await orderStore.generateInvoice(orderId)
```

### Gérer les transitions de statut
```typescript
import { isStatusTransitionAllowed, getNextAllowedStatuses } from '../utils/formatters'

// Vérifier si une transition est possible
if (isStatusTransitionAllowed('pending', 'processing')) {
  // Transition autorisée
}

// Obtenir les statuts suivants possibles
const nextStatuses = getNextAllowedStatuses('pending')
// ['processing', 'cancelled']
```

### Utiliser les services GraphQL
```typescript
import { orderService, checkoutService } from '../services'

// Finaliser une commande
const order = await checkoutService.checkout()

// Récupérer les détails complets
const orderDetails = await orderService.getOrderDetails(orderId)

// Obtenir les statistiques
const stats = await orderService.getOrderStats(orderId)
```

## Migration depuis l'ancienne version

### Changements de statuts
```typescript
// Ancien
'validated' → 'delivered' ou 'shipped'

// Mapping recommandé
const statusMigration = {
  'validated': 'delivered',  // Commandes livrées
  'pending': 'pending',      // Reste identique  
  'cancelled': 'cancelled'   // Reste identique
}
```

### Nouvelles méthodes
```typescript
// Remplace validateOrder()
orderStore.updateOrderStatus(orderId, 'delivered')

// Remplace getOrder()  
orderService.getOrderDetails(orderId)
```

### Nouvelles constantes
```typescript
// Nouveau : transitions de statut
import { STATUS_TRANSITIONS } from '../constants'

// Nouveau : vérification des transitions
import { isStatusTransitionAllowed } from '../utils/formatters'
```
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
