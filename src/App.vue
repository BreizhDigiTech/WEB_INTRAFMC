<template>
  <div id="app">
    <header class="app-header">
      <h1>WEB IntraFMC</h1>
      <nav class="main-nav">
        <router-link to="/" class="nav-link">Accueil</router-link>
        <!-- TODO: Ajouter ici les liens vers les nouveaux modules -->
      </nav>
    </header>
    
    <main class="app-main">
      <router-view />
    </main>
    
    <footer class="app-footer">
      <p>&copy; 2025 WEB IntraFMC - Application modulaire Vue.js</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
// Composant racine de l'application
</script>

<style scoped>
.app-header {
  background-color: #2c3e50;
  color: white;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.app-header h1 {
  margin: 0;
  font-size: 1.5rem;
}

.main-nav {
  display: flex;
  gap: 1rem;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.nav-link:hover,
.nav-link.router-link-active {
  background-color: #34495e;
}

.app-main {
  min-height: calc(100vh - 120px);
  padding: 2rem;
}

.app-footer {
  background-color: #ecf0f1;
  text-align: center;
  padding: 1rem;
  margin-top: auto;
}
</style>
