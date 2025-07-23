<template>
  <div class="not-found">
    <h1>404 - Page non trouvée</h1>
    <p>Désolé, la page que vous cherchez n'existe pas.</p>
    <router-link to="/" class="back-home">Retour à l'accueil</router-link>
  </div>
</template>

<script setup lang="ts">
// Page 404
</script>

<style scoped>
.not-found {
  text-align: center;
  padding: 4rem 0;
}

.not-found h1 {
  color: #e74c3c;
  margin-bottom: 1rem;
}

.back-home {
  display: inline-block;
  background-color: #3498db;
  color: white;
  padding: 0.75rem 1.5rem;
  text-decoration: none;
  border-radius: 4px;
  margin-top: 1rem;
  transition: background-color 0.3s;
}

.back-home:hover {
  background-color: #2980b9;
}
</style>
