<script setup>
import { ref, computed } from 'vue'
import { useScrollRevealList } from '../composables/useScrollReveal.js'
import { useLanguage } from '../composables/useLanguage.js'
import { translations } from '../data/translations.js'

const listRef = ref(null)
useScrollRevealList(listRef, { stagger: 120, threshold: 0.1 })

const { lang } = useLanguage()
const items = computed(() => translations[lang.value].whyUs.items)
</script>

<template>
  <section class="py-16 sm:py-24 bg-surface-container-lowest">
    <div class="max-w-7xl mx-auto px-4 sm:px-6">
      <div ref="listRef" class="grid grid-cols-1 lg:grid-cols-3 gap-12">

        <!-- Item 1 -->
        <div class="flex items-start space-x-6 reveal">
          <div
            class="flex-shrink-0 w-16 h-16 rounded-full glass-monolith flex items-center justify-center text-tertiary reveal-pop is-visible"
          >
            <span class="material-symbols-outlined text-3xl">speed</span>
          </div>
          <div>
            <h4 class="text-xl font-bold mb-2">{{ items[0].title }}</h4>
            <p class="text-on-surface-variant leading-relaxed">{{ items[0].desc }}</p>
          </div>
        </div>

        <!-- Item 2 -->
        <div class="flex items-start space-x-6 reveal">
          <div
            class="flex-shrink-0 w-16 h-16 rounded-full glass-monolith flex items-center justify-center text-primary reveal-pop is-visible"
          >
            <span class="material-symbols-outlined text-3xl">payments</span>
          </div>
          <div>
            <h4 class="text-xl font-bold mb-2">{{ items[1].title }}</h4>
            <p class="text-on-surface-variant leading-relaxed">{{ items[1].desc }}</p>
          </div>
        </div>

        <!-- Item 3 -->
        <div class="flex items-start space-x-6 reveal">
          <div
            class="flex-shrink-0 w-16 h-16 rounded-full glass-monolith flex items-center justify-center text-secondary reveal-pop is-visible"
          >
            <span class="material-symbols-outlined text-3xl">architecture</span>
          </div>
          <div>
            <h4 class="text-xl font-bold mb-2">{{ items[2].title }}</h4>
            <p class="text-on-surface-variant leading-relaxed">{{ items[2].desc }}</p>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>
