<template>
  <div class="home-view">
    <section class="hero">
      <h1>Bienvenue dans WEB IntraFMC</h1>
      <p class="hero-subtitle">Application Vue.js avec architecture modulaire</p>
    </section>

    <section class="features">
      <h2>Fonctionnalités</h2>
      <div class="features-grid">
        <div class="feature-card">
          <h3>Architecture Modulaire</h3>
          <p>Chaque fonctionnalité est organisée en module indépendant pour une meilleure maintenabilité.</p>
        </div>
        <div class="feature-card">
          <h3>TypeScript</h3>
          <p>Développement avec TypeScript pour une meilleure sécurité de type et productivité.</p>
        </div>
        <div class="feature-card">
          <h3>Vue 3 + Vite</h3>
          <p>Utilisation des dernières technologies Vue.js avec Vite pour un développement rapide.</p>
        </div>
        <div class="feature-card">
          <h3>Scalable</h3>
          <p>Structure conçue pour évoluer facilement avec l'ajout de nouveaux modules.</p>
        </div>
      </div>
    </section>

    <section class="modules">
      <h2>Modules Disponibles</h2>
      <div class="modules-list">
        <div class="module-placeholder">
          <div class="module-card placeholder">
            <h3>🚀 Prêt pour le développement</h3>
            <p>L'application est configurée et prête à recevoir de nouveaux modules.</p>
            <p class="tech-stack">Vue 3 • TypeScript • Vite • Tailwind CSS</p>
          </div>
        </div>
        
        <!-- TODO: Ajouter ici les nouveaux modules -->
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Page d'accueil de l'application
</script>

<style scoped>
.home-view {
  max-width: 1200px;
  margin: 0 auto;
}

.hero {
  text-align: center;
  padding: 3rem 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
  margin-bottom: 3rem;
}

.hero h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.hero-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
}

.features, .modules {
  margin-bottom: 3rem;
}

.features h2, .modules h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: #2c3e50;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.feature-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
}

.feature-card h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.modules-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.module-link {
  text-decoration: none;
  color: inherit;
}

.module-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
  transition: transform 0.3s, box-shadow 0.3s;
}

.module-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.module-card h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.module-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  grid-column: 1 / -1;
}

.module-card.placeholder {
  text-align: center;
  background: linear-gradient(135deg, #f6f9fc 0%, #e9ecef 100%);
  border: 2px dashed #6c757d;
  max-width: 500px;
}

.tech-stack {
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #6c757d;
  font-weight: 500;
}
</style>
