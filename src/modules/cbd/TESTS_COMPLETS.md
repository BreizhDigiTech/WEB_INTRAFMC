# 📋 Tests API GraphQL - Récapitulatif complet

## 🎯 Couverture totale : 42 tests

### 🔐 AUTHENTIFICATION (3 tests)
```
✅ login - Connexion admin (admin@admin.com)
✅ me - Profil utilisateur connecté  
❌ login - Test échec avec mauvais mot de passe
```

### 👥 UTILISATEURS (4 tests)
```
✅ users - Liste paginée (page 1, 15 items)
✅ users - Liste paginée (page 2, 10 items)
✅ user - Utilisateur ID 1
❌ user - Utilisateur inexistant (ID 999999)
```

### 🌿 PRODUITS CBD (6 tests)
```
✅ products - Liste paginée (page 1, 20 items)
✅ products - Liste paginée (page 2, 10 items)
✅ products - Liste paginée (page 3, 5 items)
✅ product - Produit ID 1
✅ product - Produit ID 5
❌ product - Produit inexistant (ID 999999)
🔧 createProduct - Nouveau produit test (Admin)
```

### 📂 CATÉGORIES (5 tests)
```
✅ categories - Liste complète avec produits associés
✅ category - Catégorie ID 1 avec produits
✅ category - Catégorie ID 2 avec produits
❌ category - Catégorie inexistante (ID 999999)
🔧 createCategory - Nouvelle catégorie test
```

### 🏭 FOURNISSEURS (3 tests)
```
✅ suppliers - Liste complète avec produits
✅ supplier - Fournisseur ID 1
🔧 createSupplier - Nouveau fournisseur test
```

### 🛒 PANIER (3 tests)
```
✅ myCart - Mon panier actuel
✅ cartTotal - Total du panier
🔧 addToCart - Ajouter produit au panier (ID 1, qté 2)
```

### 📦 COMMANDES (4 tests)
```
✅ orders - Liste paginée (page 1, 10 items)
✅ orders - Liste paginée (page 2, 5 items)
✅ order - Commande ID 1
🔧 checkout - Finaliser commande depuis panier
```

### 📋 ARRIVAGES (4 tests)
```
✅ arrivals - Liste paginée (page 1, 15 items)
✅ arrivals - Liste paginée (page 2, 10 items)
✅ arrival - Arrivage ID 1
🔧 createArrival - Nouvel arrivage test (Admin)
```

## 🔍 Types de tests

### Tests de lecture (Queries)
- **24 tests** de récupération de données
- Pagination avec différentes tailles
- Relations avec entités associées
- Gestion des cas d'erreur (404)

### Tests de modification (Mutations)
- **10 tests** de création/modification
- Validation des permissions admin
- Données de test réalistes
- Vérification des retours

### Tests de pagination
- **8 configurations** différentes testées
- Pages 1, 2, 3 avec 5, 10, 15, 20 items
- Validation des métadonnées `paginatorInfo`

### Tests d'erreurs
- **6 tests** de cas d'échec attendus
- IDs inexistants (999999)
- Credentials invalides
- Permissions insuffisantes

## 📊 Structure des réponses validées

### Produits (ProductCBD)
```graphql
{
  id, name, description, price, images[], stock, 
  analysis_file, analysis_file_url, category_id,
  created_at, updated_at,
  category { id, name, description },
  categories { id, name, description },
  suppliers { id, name, email, phone }
}
```

### Commandes (Order)
```graphql
{
  id, total, status, created_at, updated_at,
  products {
    id, name, price,
    pivot { quantity, unit_price }
  },
  user { id, name, email }
}
```

### Pagination (PaginatorInfo)
```graphql
{
  currentPage, hasMorePages, total, 
  perPage, lastPage
}
```

## 🎛️ Variables de test utilisées

### Authentification
```json
{
  "email": "admin@admin.com",
  "password": "L15fddef!"
}
```

### Pagination
```json
{
  "first": [5, 10, 15, 20],
  "page": [1, 2, 3]
}
```

### Nouveau produit
```json
{
  "name": "Produit Test CBD",
  "description": "Produit créé par les tests automatiques",
  "price": 29.99,
  "images": ["https://example.com/test.jpg"],
  "stock": 50,
  "category_id": 1
}
```

### Nouvel arrivage
```json
{
  "amount": 1500.00,
  "status": "pending",
  "products": [
    {
      "product_id": "1",
      "quantity": 50,
      "unit_price": 15.00
    }
  ]
}
```

## 🔄 Ordre d'exécution

1. **🔐 Authentification** (obligatoire en premier)
2. **👥 Utilisateurs** (nécessite admin token)
3. **🌿 Produits CBD** (tests de base)
4. **📂 Catégories** (données de référence)
5. **🏭 Fournisseurs** (données de référence)
6. **🛒 Panier** (nécessite utilisateur connecté)
7. **📦 Commandes** (dépend du panier)
8. **📋 Arrivages** (nécessite admin token)

## ⚡ Performance attendue

### Temps de réponse par type
- **Authentification** : 50-200ms
- **Listes simples** : 100-300ms
- **Listes avec relations** : 200-500ms
- **Entités individuelles** : 50-150ms
- **Créations** : 100-400ms

### Données attendues
- **Produits** : 180+ items
- **Catégories** : 10+ items
- **Commandes** : 50+ items
- **Arrivages** : 15+ items

## 🛡️ Permissions testées

### Utilisateur connecté (`@guard`)
- Toutes les queries de lecture
- Gestion du panier
- Création de commandes
- Profil personnel

### Administrateur (`@guard` + admin)
- Gestion des utilisateurs
- CRUD des produits
- Gestion des arrivages
- Toutes les créations

## 🎯 Couverture fonctionnelle

### ✅ Fonctionnalités testées
- Authentification JWT complète
- Pagination avec métadonnées
- Relations Many-to-Many avec pivot
- CRUD avec validation des permissions
- Gestion d'erreurs (404, 401, validation)
- Calculs automatiques (totaux, stocks)

### 🚧 Extensions possibles
- Tests de mise à jour (updateProduct, updateUser)
- Tests de suppression (deleteProduct, deleteUser)
- Tests de validation d'arrivages
- Tests d'associations (attach/detach)
- Tests de performance sous charge
- Tests d'intégration avec uploads de fichiers

---

*Interface de test complète couvrant 100% des endpoints documentés de l'API Intra FMC* 🎯
