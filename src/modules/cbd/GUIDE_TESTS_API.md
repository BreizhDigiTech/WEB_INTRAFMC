# 🧪 Guide d'utilisation - Tests API GraphQL Complets

## 🎯 Vue d'ensemble

Ce module de test permet de valider **TOUTES** les fonctionnalités de votre API GraphQL Laravel de manière exhaustive. Il couvre tous les endpoints documentés dans votre API Intra FMC.

## 🚀 Démarrage rapide

1. **Accéder à l'interface** : Allez sur `/cbd` dans votre application
2. **Lancer tous les tests** : Cliquez sur "🚀 Lancer tous les tests"
3. **Voir les résultats** : Les résultats s'affichent en temps réel

## 📋 Modules de tests disponibles

### 🔐 Authentification
- **login** - Test de connexion avec les credentials admin
- **me** - Récupération du profil utilisateur connecté
- **login (échec)** - Test avec de mauvais credentials

### 👥 Utilisateurs (Admin uniquement)
- **users** - Liste paginée des utilisateurs (différentes tailles de page)
- **user** - Récupération d'un utilisateur spécifique
- **user (inexistant)** - Test avec un ID inexistant

### 🌿 Produits CBD
- **products** - Liste paginée avec différentes configurations
- **product** - Produit spécifique avec relations
- **createProduct** - Création d'un nouveau produit (Admin)
- **product (inexistant)** - Test avec ID invalide

### 📂 Catégories
- **categories** - Liste complète des catégories
- **category** - Catégorie spécifique avec produits associés
- **createCategory** - Création d'une nouvelle catégorie
- **category (inexistant)** - Test avec ID invalide

### 🏭 Fournisseurs
- **suppliers** - Liste des fournisseurs
- **supplier** - Fournisseur spécifique
- **createSupplier** - Création d'un nouveau fournisseur

### 🛒 Panier
- **myCart** - Contenu du panier utilisateur
- **cartTotal** - Calcul du total du panier
- **addToCart** - Ajout d'un produit au panier

### 📦 Commandes
- **orders** - Liste paginée des commandes
- **order** - Commande spécifique avec détails
- **checkout** - Finalisation d'une commande

### 📋 Arrivages (Admin uniquement)
- **arrivals** - Liste paginée des arrivages
- **arrival** - Arrivage spécifique
- **createArrival** - Création d'un nouvel arrivage

## 🎛️ Fonctionnalités avancées

### Tests de pagination
- Tests avec différentes tailles de page (5, 10, 15, 20)
- Tests de navigation entre pages
- Validation des métadonnées de pagination

### Tests CRUD complets
- **Create** : Création de nouvelles entités
- **Read** : Lecture d'entités individuelles et listes
- **Update** : Modification d'entités existantes
- **Delete** : Suppression d'entités

### Tests de relations
- Relations Many-to-Many (produits ↔ catégories)
- Relations Many-to-Many (produits ↔ fournisseurs)
- Relations pivot avec données additionnelles (commandes ↔ produits)

### Tests d'erreurs
- IDs inexistants
- Données invalides
- Permissions insuffisantes
- Erreurs de validation

## 📊 Interprétation des résultats

### Codes de statut
- ✅ **Succès** : Test réussi, API répond correctement
- ❌ **Erreur** : Test échoué, voir détails de l'erreur
- ⏳ **En cours** : Test en cours d'exécution

### Métriques
- **Durée** : Temps de réponse en millisecondes
- **Données** : Nombre d'éléments retournés
- **Taux de réussite** : Pourcentage global de succès

### Détails des réponses
- Cliquez sur 🔽 pour voir les données brutes retournées
- Structure JSON complète de la réponse API
- Métadonnées de pagination

## 🔧 Configuration des tests

### Données de test par défaut

```typescript
// Connexion admin
const loginCredentials = {
    email: "admin@admin.com",
    password: "L15fddef!"
}

// Produit de test
const testProduct = {
    name: "Produit Test CBD",
    description: "Produit créé par les tests automatiques",
    price: 29.99,
    stock: 50,
    category_id: 1
}

// Arrivage de test
const testArrival = {
    amount: 1500.00,
    status: "pending",
    products: [
        {
            product_id: "1",
            quantity: 50,
            unit_price: 15.00
        }
    ]
}
```

## 🐛 Débogage

### Erreurs communes

#### "Unauthorized" ou 401
- Vérifiez que vous êtes connecté
- Token JWT peut-être expiré
- Relancez le test d'authentification

#### "Unknown argument" ou erreurs GraphQL
- Schema GraphQL peut avoir changé
- Vérifiez la correspondance avec votre API backend

#### Timeouts ou erreurs réseau
- Vérifiez que le serveur Laravel est démarré
- API disponible sur `localhost:8000/graphql`

### Console de développement
Tous les tests loggent dans la console :
```javascript
// Ouvrez la console (F12) pour voir :
console.log('✅ Test produits réussi:', response)
console.error('❌ Erreur test commandes:', error)
```

## 📈 Métriques de performance

### Benchmarks attendus
- **Authentification** : < 200ms
- **Listes paginées** : < 500ms
- **Entités individuelles** : < 100ms
- **Créations/Modifications** : < 300ms

### Optimisations
- Utilisez la pagination pour de gros datasets
- Relations avec `with()` pour éviter N+1
- Cache des résultats fréquents

## 🔒 Sécurité

### Tests de permissions
- Tests avec utilisateur normal vs admin
- Vérification des autorisations CRUD
- Tests des Guards Laravel

### Données sensibles
- Mots de passe hashés
- Tokens JWT sécurisés
- Validation des inputs

## 🚀 Utilisation en production

### Avant déploiement
1. Lancez tous les tests
2. Vérifiez 100% de succès
3. Contrôlez les temps de réponse
4. Validez les données créées

### Monitoring continu
- Utilisez ces tests pour la surveillance
- Intégrez dans votre pipeline CI/CD
- Alerts automatiques en cas d'échec

## 📞 Support

En cas de problème :
1. Vérifiez la console de développement
2. Contrôlez les logs Laravel
3. Validez la configuration de l'API GraphQL
4. Testez manuellement avec GraphiQL/Playground

---

*Interface de test générée automatiquement pour l'API Intra FMC* 🧪
