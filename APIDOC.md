# Guide Frontend – API GraphQL (INTRAFMC)

Ce document explique comment le frontend consomme l’API GraphQL (authentification, requêtes/mutations clés, uploads, pagination, erreurs) pour un développement fluide.

## TL;DR
- Endpoint GraphQL (dev): http://localhost/graphql
- Authentification: JWT via header `Authorization: Bearer <token>`
- Schéma: Lighthouse + scalars DateTime, Date, Upload, JSON
- Fichiers: upload via spécification GraphQL multipart (Upload)
- Images produits: utiliser `image_urls` pour l’affichage public
- Statuts de commande: `pending`, `validated`, `cancelled`
 - Statuts de commande (API): `pending`, `validated`, `cancelled`
 - Couche UI (Front): le front peut représenter des étapes intermédiaires (`processing`, `shipped`, `delivered`, `refunded`) pour l’affichage et les filtres. Ces étapes sont mappées côté client vers les 3 statuts API afin de rester compatibles.

## Authentification

### S’enregistrer
```graphql
mutation Register($name: String!, $email: String!, $password: String!, $password_confirmation: String!) {
  register(name: $name, email: $email, password: $password, password_confirmation: $password_confirmation) {
    access_token
    user { id name email }
  }
}
```

### Se connecter
```graphql
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    access_token
    user { id name email }
  }
}
```

- Conservez `access_token` côté frontend et envoyez-le dans `Authorization: Bearer <token>`.
- `logout` et `refreshToken` sont disponibles.

### Profil utilisateur
```graphql
query Me {
  me { id name email is_admin is_active }
}
```

## Produits (ProductCBD)

### Liste paginée
```graphql
query Products($first: Int = 10, $page: Int = 1) {
  productsCBD(first: $first, page: $page) {
    paginatorInfo { currentPage lastPage total }
    data {
      id
      name
      description
      price
      image_urls    # URLs publiques (préférer ceci à images)
      stock
      categories { id name }
    }
  }
}
```

### Détail
```graphql
query Product($id: ID!) {
  productCBD(id: $id) {
    id name description price stock
    images            # chemins internes (pour back)
    image_urls        # URLs publiques (pour front)
    image_metadata    # JSON (ex: alt)
    analysis_file_url # URL du fichier d’analyse si présent
    categories { id name }
  }
}
```

## Panier

### Requêtes
```graphql
query MyCart {
  myCart {
    id
    quantity
    product { id name price image_urls }
  }
}

query CartTotal { cartTotal }
```

### Mutations
```graphql
mutation AddToCart($input: AddToCartInput!) {
  addToCart(input: $input) { id quantity product { id name } }
}
# input: { product_id: ID!, quantity: Int! }

mutation UpdateCart($input: UpdateCartItemInput!) {
  updateCartItem(input: $input) { id quantity }
}

mutation RemoveFromCart($productId: ID!) {
  removeFromCart(product_id: $productId) { success message }
}

mutation ClearCart { clearCart { success message } }
```

## Commandes

### Créer une commande depuis le panier
```graphql
mutation Checkout { checkout { id total status created_at } }
```

### Mes commandes / Détail
```graphql
query MyOrders($page: Int = 1, $first: Int = 10) {
  myOrders(page: $page, first: $first) {
    paginatorInfo { currentPage lastPage total }
    data { id total status created_at }
  }
}

query OrderDetails($id: ID!) {
  orderDetails(id: $id) {
    id user_id total status formatted_status created_at
    user { id name email }
    products {
      id name price image_urls categories { id name }
      pivot { quantity unit_price created_at }
    }
    orderProducts { id quantity unit_price product { id name } }
    total_items
    product_count
  }
}
```

### Annuler une commande
```graphql
mutation Cancel($id: ID!) { cancelOrder(id: $id) { id status } }
```

- Statuts possibles: `pending`, `validated`, `cancelled`.
- Transition typique: `pending -> validated` ou `pending -> cancelled`.

 Note Front (UI avancée):
 - Certaines vues exposent des statuts intermédiaires pour un suivi plus fin:
   - `processing` et `shipped` sont considérés comme des commandes en cours d’avancement (affichées comme « validées » côté KPIs).
   - `delivered` est traité comme une commande « validée » livrée (éligible à la facture côté front).
   - `refunded` représente une post-étape d’après-vente.
 - Ces statuts UI restent purement front et n’affectent pas les mutations documentées ci-dessus. Pour changer l’état métier côté API, continuez d’utiliser `updateOrderStatus` avec les valeurs `pending`/`validated`/`cancelled` selon le schéma en vigueur.

## Upload de fichiers (images produits, analyse)

Mutation typique d’upload d’images produit (exemple):
```graphql
mutation UploadProductImages($productId: ID!, $files: [Upload!]!) {
  uploadProductImages(product_id: $productId, files: $files) {
    success
    message
    image_urls
  }
}
```

Comment envoyer côté frontend:
- Utiliser la spécification GraphQL multipart (ex: Apollo Upload, FormData).
- Chaque fichier dans FormData sous une clé mappée à la variable `files`.
- En cas de doute, tester via Insomnia/GraphiQL avec upload multipart.

Notes:
- `image_urls` retourne des URLs publiques servies depuis `/storage/...`.
- Le champ `images` contient les chemins internes (à réserver au back).

## Catégories et Fournisseurs

### Catégories
```graphql
query Categories {
  categories {
    id name description
  }
}
```

### Fournisseurs (lecture de base)
```graphql
query Suppliers {
  suppliers { id name email phone }
}
```

Des mutations d’administration (create/update/delete) existent mais requièrent des droits admin.

## Pagination
- Basée sur Lighthouse `@paginate`.
- Utiliser `first` et `page` et lire `paginatorInfo`.

## Erreurs
- Les erreurs GraphQL apparaissent dans `errors[]`.
- Exemple:
```json
{
  "errors": [
    { "message": "Stock insuffisant", "extensions": { "category": "user" } }
  ],
  "data": { "checkout": null }
}
```

## Environnements
- Dev: `http://localhost/graphql`
- Prod: utiliser l’URL déployée (HTTPS recommandé), même chemin `/graphql`.

## Bonnes pratiques Front
- Envoyer systématiquement `Authorization: Bearer <token>` après login.
- Préférer `image_urls` pour affichage.
- Gérer les nombres monétaires comme des nombres (Float côté GraphQL). Les décimaux sont stockés en BDD avec 2 décimales.
- Anticiper les états de commandes limités (3 statuts) dans l’UI.

---
MàJ: 2025-08-19 – Aligné avec le schéma actuel et la suite de tests verte.
