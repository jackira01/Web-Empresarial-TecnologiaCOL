<script setup>
import { ref, computed } from 'vue'
import { useScrollRevealList } from '../composables/useScrollReveal.js'
import { useLanguage } from '../composables/useLanguage.js'
import { translations } from '../data/translations.js'

const gridRef = ref(null)
useScrollRevealList(gridRef, { stagger: 100, threshold: 0.08 })

const { lang, t } = useLanguage()
const serviceItems = computed(() => translations[lang.value].services.items)
</script>

<template>
  <section id="servicios" class="py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-end mb-10 sm:mb-16 gap-6">
      <div class="max-w-2xl">
        <h2 class="font-headline text-3xl sm:text-4xl md:text-5xl font-extrabold text-on-surface mb-4">
          {{ t('services.title') }}
        </h2>
        <p class="text-on-surface-variant text-base sm:text-lg">
          {{ t('services.sub') }}
        </p>
      </div>
      <div class="h-px flex-grow bg-outline-variant/20 mx-8 hidden md:block"></div>
    </div>

    <!-- Bento Grid — children get staggered reveal via useScrollRevealList -->
    <div ref="gridRef" class="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">

      <!-- Card 1 — col 7 — Automatización de Flujos -->
      <div
        class="md:col-span-7 service-card group p-6 sm:p-8 reveal bg-cover bg-center"
        style="background-image: url('https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&auto=format&fit=crop')"
        data-delay="0"
      >
        <!-- Overlay -->
        <div class="absolute inset-0 bg-surface-container-low/85 group-hover:bg-surface-container/80 transition-colors duration-500 rounded-xl"></div>

        <!-- Decorative icon -->
        <div
          class="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none select-none z-10"
        >
          <span class="material-symbols-outlined text-8xl">bolt</span>
        </div>

        <!-- Content -->
        <div class="relative z-10">
          <div
            class="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-6 text-primary transition-transform duration-300 group-hover:scale-110"
          >
            <span class="material-symbols-outlined icon-rotate">auto_mode</span>
          </div>
          <h3 class="text-xl sm:text-2xl font-bold mb-3">{{ serviceItems[0].title }}</h3>
          <p class="text-on-surface-variant leading-relaxed max-w-md text-sm sm:text-base">
            {{ serviceItems[0].desc }}
          </p>
        </div>
      </div>

      <!-- Card 2 — col 5 — Agentes de IA -->
      <div
        class="md:col-span-5 service-card group p-6 sm:p-8 reveal bg-cover bg-center"
        style="background-image: url('https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=700&auto=format&fit=crop')"
        data-delay="100"
      >
        <!-- Overlay -->
        <div class="absolute inset-0 bg-surface-container-low/85 group-hover:bg-surface-container/80 transition-colors duration-500 rounded-xl"></div>

        <!-- Content -->
        <div class="relative z-10">
          <div
            class="w-12 h-12 bg-tertiary/20 rounded-xl flex items-center justify-center mb-6 text-tertiary transition-transform duration-300 group-hover:scale-110"
          >
            <span class="material-symbols-outlined">smart_toy</span>
          </div>
          <h3 class="text-xl sm:text-2xl font-bold mb-3">{{ serviceItems[1].title }}</h3>
          <p class="text-on-surface-variant leading-relaxed text-sm sm:text-base">
            {{ serviceItems[1].desc }}
          </p>
        </div>
      </div>

      <!-- Card 3 — col 5 — Desarrollo Web -->
      <div
        class="md:col-span-5 service-card group p-6 sm:p-8 reveal bg-cover bg-center"
        style="background-image: url('https://images.unsplash.com/photo-1547658719-da2b51169166?w=700&auto=format&fit=crop')"
        data-delay="200"
      >
        <!-- Overlay -->
        <div class="absolute inset-0 bg-surface-container-low/85 group-hover:bg-surface-container/80 transition-colors duration-500 rounded-xl"></div>

        <!-- Content -->
        <div class="relative z-10">
          <div
            class="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center mb-6 text-secondary transition-transform duration-300 group-hover:scale-110"
          >
            <span class="material-symbols-outlined">web_asset</span>
          </div>
          <h3 class="text-xl sm:text-2xl font-bold mb-3">{{ serviceItems[2].title }}</h3>
          <p class="text-on-surface-variant leading-relaxed text-sm sm:text-base">
            {{ serviceItems[2].desc }}
          </p>
        </div>
      </div>

      <!-- Card 4 — col 7 — Infraestructura -->
      <div
        class="md:col-span-7 service-card group p-6 sm:p-8 reveal bg-cover bg-center"
        style="background-image: url('https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=900&auto=format&fit=crop')"
        data-delay="300"
      >
        <!-- Overlay -->
        <div class="absolute inset-0 bg-surface-container-low/85 group-hover:bg-surface-container/80 transition-colors duration-500 rounded-xl"></div>

        <!-- Decorative icon -->
        <div
          class="absolute bottom-0 right-0 p-8 opacity-5 pointer-events-none select-none z-10"
        >
          <span class="material-symbols-outlined text-9xl">database</span>
        </div>

        <!-- Content -->
        <div class="relative z-10">
          <div
            class="w-12 h-12 bg-on-secondary-container/20 rounded-xl flex items-center justify-center mb-6 text-on-secondary-container transition-transform duration-300 group-hover:scale-110"
          >
            <span class="material-symbols-outlined">dns</span>
          </div>
          <h3 class="text-xl sm:text-2xl font-bold mb-3">{{ serviceItems[3].title }}</h3>
          <p class="text-on-surface-variant leading-relaxed max-w-md text-sm sm:text-base">
            {{ serviceItems[3].desc }}
          </p>
        </div>
      </div>

    </div>
  </section>
</template>
