<script setup>
import { ref, computed } from 'vue'
import { useScrollReveal } from '../composables/useScrollReveal.js'
import { useLanguage } from '../composables/useLanguage.js'
import { translations } from '../data/translations.js'
import { projects } from '../data/siteData.js'

const sectionRef = ref(null)
useScrollReveal([sectionRef], { threshold: 0.05 })

const { lang, t } = useLanguage()

const activeProjects = computed(() => projects.filter((p) => p.active))

// Descripciones traducidas por índice
const projectDescriptions = computed(() => translations[lang.value].portfolio.projectDescriptions)

// Duplicamos el array para el bucle infinito
const loopedProjects = computed(() =>
  [...activeProjects.value, ...activeProjects.value].map((p, i) => ({
    ...p,
    translatedDesc: projectDescriptions.value[p.id] ?? p.description,
  }))
)
</script>

<template>
  <section id="portafolio" ref="sectionRef" class="py-16 sm:py-24 overflow-hidden reveal">
    <!-- Header -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 mb-10 sm:mb-12">
      <h2 class="font-headline text-3xl md:text-4xl font-extrabold text-on-surface">
        {{ t('portfolio.title') }}
      </h2>
      <p class="text-on-surface-variant mt-2">{{ t('portfolio.sub') }}</p>
    </div>

    <!-- Infinite Auto-scroll Carousel -->
    <div class="relative w-full overflow-hidden">
      <!-- Fade edges -->
      <div class="absolute inset-y-0 left-0 w-24 z-10 pointer-events-none bg-gradient-to-r from-surface to-transparent"></div>
      <div class="absolute inset-y-0 right-0 w-24 z-10 pointer-events-none bg-gradient-to-l from-surface to-transparent"></div>

      <div class="carousel-track flex gap-6 w-max">
        <div
          v-for="(project, i) in loopedProjects"
          :key="i"
          class="group cursor-pointer flex-shrink-0 w-72 md:w-80"
        >
          <div class="relative rounded-2xl overflow-hidden mb-4 aspect-[4/3] shadow-lg">
            <img
              :src="project.images[0]"
              :alt="project.title"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <!-- Overlay -->
            <div
              class="absolute inset-0 bg-gradient-to-t from-surface/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            ></div>
            <div class="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
              <a
                :href="project.url"
                target="_blank"
                rel="noopener noreferrer"
                class="bg-white/10 backdrop-blur-xl text-white rounded-full px-4 py-2 flex items-center space-x-2 border border-white/20 hover:bg-white/25 transition-colors duration-200"
              >
                <span class="material-symbols-outlined text-base leading-none">link</span>
                <span class="font-bold text-sm">{{ t('portfolio.visit') }}</span>
              </a>
            </div>
          </div>
          <h4 class="text-lg font-bold text-on-surface leading-snug">{{ project.title }}</h4>
          <p class="text-sm text-on-surface-variant mt-1 line-clamp-2">{{ project.translatedDesc }}</p>
          <div class="flex flex-wrap gap-1 mt-2">
            <span
              v-for="tag in project.tags"
              :key="tag"
              class="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium"
            >{{ tag }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.carousel-track {
  animation: marquee 28s linear infinite;
}

.carousel-track:hover {
  animation-play-state: paused;
}

@keyframes marquee {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
</style>

