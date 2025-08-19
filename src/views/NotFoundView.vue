<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center relative overflow-hidden">
    <!-- Fond animé avec particules -->
    <div class="absolute inset-0">
      <!-- Grille de points lumineux -->
      <div class="absolute inset-0" style="background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0); background-size: 80px 80px;"></div>
      
      <!-- Effets lumineux flottants -->
      <div class="absolute top-1/4 left-1/6 w-64 h-64 bg-red-500/10 rounded-full blur-3xl animate-bounce-slow"></div>
      <div class="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-spin-slow"></div>
    </div>

    <!-- Contenu principal -->
    <div class="relative z-10 text-center px-6 max-w-4xl mx-auto">
      <!-- Animation du 404 géant -->
      <div class="mb-8">
        <div class="relative inline-block">
          <!-- Texte 404 avec effet glitch -->
          <h1 class="text-9xl md:text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-purple-500 to-blue-500 animate-gradient leading-none tracking-tighter">
            404
          </h1>
          
          <!-- Effet glitch overlay -->
          <div class="absolute inset-0 text-9xl md:text-[12rem] font-black text-red-500 opacity-20 animate-glitch leading-none tracking-tighter">
            404
          </div>
          <div class="absolute inset-0 text-9xl md:text-[12rem] font-black text-blue-500 opacity-20 animate-glitch-reverse leading-none tracking-tighter">
            404
          </div>
        </div>
      </div>

      <!-- Messages d'humour rotatifs -->
      <div class="mb-8 h-20 flex items-center justify-center">
        <h2 class="text-2xl md:text-3xl font-light text-white mb-4 animate-fade-in-out" :key="currentMessage">
          {{ messages[currentMessageIndex] }}
        </h2>
      </div>

      <!-- Sous-titre avec emoji animé -->
      <p class="text-gray-300 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
        Il semblerait que cette page ait pris la poudre d'escampette... 
        <span class="inline-block animate-bounce">🏃‍♂️💨</span>
      </p>

      <!-- Robot cassé animé -->
      <div class="mb-12 flex justify-center">
        <div class="relative">
          <!-- Corps du robot -->
          <div class="w-24 h-32 bg-gray-700 rounded-lg border-2 border-gray-500 relative animate-wobble">
            <!-- Tête -->
            <div class="w-16 h-16 bg-gray-600 rounded-lg absolute -top-8 left-4 border-2 border-gray-500">
              <!-- Yeux -->
              <div class="flex justify-between pt-3 px-3">
                <div class="w-3 h-3 bg-red-400 rounded-full animate-blink"></div>
                <div class="w-3 h-3 bg-red-400 rounded-full animate-blink delay-200"></div>
              </div>
              <!-- Bouche -->
              <div class="w-6 h-1 bg-gray-400 mx-auto mt-2 rounded animate-pulse"></div>
            </div>
            
            <!-- Bras -->
            <div class="absolute -left-6 top-4 w-4 h-12 bg-gray-600 rounded rotate-12 animate-wave"></div>
            <div class="absolute -right-6 top-4 w-4 h-12 bg-gray-600 rounded -rotate-12 animate-wave-reverse"></div>
            
            <!-- Corps détails -->
            <div class="pt-6 px-4">
              <div class="w-4 h-4 bg-blue-500 rounded mx-auto mb-2 animate-pulse"></div>
              <div class="w-full h-1 bg-gray-500 mb-1"></div>
              <div class="w-3/4 h-1 bg-gray-500 mx-auto"></div>
            </div>
          </div>
          
          <!-- Jambes -->
          <div class="flex justify-center space-x-2 mt-2">
            <div class="w-3 h-8 bg-gray-600 rounded animate-bounce"></div>
            <div class="w-3 h-8 bg-gray-600 rounded animate-bounce delay-100"></div>
          </div>
          
          <!-- Étincelles de dysfonctionnement -->
          <div class="absolute -top-2 -right-2">
            <div class="w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
          </div>
          <div class="absolute top-6 -left-3">
            <div class="w-1 h-1 bg-orange-400 rounded-full animate-ping delay-300"></div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <router-link
          to="/"
          class="group bg-white text-black px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
        >
          <span class="flex items-center space-x-2">
            <svg class="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Retour à l'accueil</span>
          </span>
        </router-link>

        <button
          @click="reportBug"
          class="group bg-gray-800 text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 border border-gray-600 hover:border-gray-500"
        >
          <span class="flex items-center space-x-2">
            <svg class="w-5 h-5 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span>Signaler un bug</span>
          </span>
        </button>
      </div>

      <!-- Easter egg -->
      <div class="mt-12 text-gray-500 text-sm">
        <p>Code d'erreur: <span class="font-mono text-red-400">OOPS_SPAGHETTI_CODE_{{ Math.floor(Math.random() * 9999) }}</span></p>
        <p class="mt-2">💡 Conseil du jour : Ctrl+Z ne fonctionne pas dans la vraie vie</p>
      </div>
    </div>

    <!-- Particules flottantes -->
    <div v-for="i in 20" :key="i" 
         class="absolute w-2 h-2 bg-white rounded-full opacity-20 animate-float"
         :style="{
           left: Math.random() * 100 + '%',
           top: Math.random() * 100 + '%',
           animationDelay: Math.random() * 10 + 's',
           animationDuration: (Math.random() * 10 + 10) + 's'
         }">
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

// Messages d'humour rotatifs
const messages = ref([
  "Oups ! Cette page a fait un stage de disparition avec Houdini 🎩",
  "404 - Page introuvable, mais votre humour est intact ! 😄",
  "Houston, nous avons un problème... de navigation 🚀",
  "Cette page est partie chercher des cigarettes... 🚬",
  "Erreur 404 : Page en vacances aux Bahamas 🏝️",
  "Plot twist : La page était un mirage ! 🌅",
  "Cette URL mène vers le triangle des Bermudes 🔺",
  "Page.exe a cessé de fonctionner 💻",
])

const currentMessageIndex = ref(0)
const currentMessage = ref(messages.value[0])
let messageInterval: ReturnType<typeof setInterval>

// Rotation des messages
const rotateMessages = () => {
  currentMessageIndex.value = (currentMessageIndex.value + 1) % messages.value.length
  currentMessage.value = messages.value[currentMessageIndex.value]
}

// Signaler un bug avec humour
const reportBug = () => {
  const funnyMessages = [
    "Bug signalé ! Notre équipe de singes-développeurs va s'en occuper 🐵",
    "Merci ! Nous avons ajouté ce bug à notre collection 🐛",
    "Bug reçu ! Il rejoint ses 99 petits camarades dans la pile 📚",
    "Signalement enregistré ! Récompense : un cookie virtuel 🍪",
  ]
  
  const randomMessage = funnyMessages[Math.floor(Math.random() * funnyMessages.length)]
  alert(randomMessage)
}

onMounted(() => {
  messageInterval = setInterval(rotateMessages, 3000)
})

onUnmounted(() => {
  if (messageInterval) {
    clearInterval(messageInterval)
  }
})
</script>

<style scoped>
/* Animations personnalisées */
@keyframes gradient {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

@keyframes glitch {
  0%, 100% {
    transform: translate(0);
  }
  20% {
    transform: translate(-2px, 2px);
  }
  40% {
    transform: translate(-2px, -2px);
  }
  60% {
    transform: translate(2px, 2px);
  }
  80% {
    transform: translate(2px, -2px);
  }
}

@keyframes glitch-reverse {
  0%, 100% {
    transform: translate(0);
  }
  20% {
    transform: translate(2px, -2px);
  }
  40% {
    transform: translate(2px, 2px);
  }
  60% {
    transform: translate(-2px, -2px);
  }
  80% {
    transform: translate(-2px, 2px);
  }
}

@keyframes wobble {
  0%, 100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(1deg);
  }
  75% {
    transform: rotate(-1deg);
  }
}

@keyframes wave {
  0%, 100% {
    transform: rotate(12deg);
  }
  50% {
    transform: rotate(25deg);
  }
}

@keyframes wave-reverse {
  0%, 100% {
    transform: rotate(-12deg);
  }
  50% {
    transform: rotate(-25deg);
  }
}

@keyframes blink {
  0%, 90%, 100% {
    opacity: 1;
  }
  95% {
    opacity: 0.3;
  }
}

@keyframes bounce-slow {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes pulse-slow {
  0%, 100% {
    opacity: 0.1;
  }
  50% {
    opacity: 0.2;
  }
}

@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes fade-in-out {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  20%, 80% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-10px);
  }
}

/* Classes d'animation */
.animate-gradient {
  background-size: 400% 400%;
  animation: gradient 8s ease infinite;
}

.animate-glitch {
  animation: glitch 2s infinite;
}

.animate-glitch-reverse {
  animation: glitch-reverse 2s infinite;
}

.animate-wobble {
  animation: wobble 4s ease-in-out infinite;
}

.animate-wave {
  animation: wave 2s ease-in-out infinite;
}

.animate-wave-reverse {
  animation: wave-reverse 2s ease-in-out infinite;
}

.animate-blink {
  animation: blink 3s infinite;
}

.animate-bounce-slow {
  animation: bounce-slow 6s ease-in-out infinite;
}

.animate-pulse-slow {
  animation: pulse-slow 4s ease-in-out infinite;
}

.animate-spin-slow {
  animation: spin-slow 20s linear infinite;
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-fade-in-out {
  animation: fade-in-out 3s ease-in-out infinite;
}

/* Responsive fixes */
@media (max-width: 768px) {
  h1 {
    font-size: 6rem !important;
  }
  
  .robot {
    transform: scale(0.8);
  }
}
</style>
