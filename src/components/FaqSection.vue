<script setup>
import { ref, computed } from 'vue'
import { useScrollReveal, useScrollRevealList } from '../composables/useScrollReveal.js'
import { useLanguage } from '../composables/useLanguage.js'
import { translations } from '../data/translations.js'

const headerRef = ref(null)
const listRef = ref(null)
useScrollReveal([headerRef], { threshold: 0.15 })
useScrollRevealList(listRef, { stagger: 80, threshold: 0.06 })

const { lang, t } = useLanguage()
const faqs = computed(() => translations[lang.value].faq.items)

const activeIndex = ref(null)

function toggle(i) {
  activeIndex.value = activeIndex.value === i ? null : i
}
</script>

<template>
  <section id="faq" class="py-16 sm:py-24 px-4 sm:px-6 max-w-5xl mx-auto">
    <!-- Header -->
    <div ref="headerRef" class="reveal mb-16">
      <div class="flex flex-col md:flex-row justify-between items-end gap-6">
        <div class="max-w-2xl">
          <p class="text-primary font-semibold uppercase tracking-widest text-sm mb-3">{{ t('faq.tag') }}</p>
          <h2 class="font-headline text-3xl sm:text-4xl md:text-5xl font-extrabold text-on-surface mb-4">
            {{ t('faq.title') }}
          </h2>
          <p class="text-on-surface-variant text-lg leading-relaxed">
            {{ t('faq.sub') }}
          </p>
        </div>
        <div class="h-px flex-grow bg-outline-variant/20 mx-8 hidden md:block"></div>
      </div>
    </div>

    <!-- Accordion -->
    <div ref="listRef" class="flex flex-col gap-3">
      <div
        v-for="(faq, i) in faqs"
        :key="i"
        class="reveal"
        :data-delay="i * 60"
      >
        <button
          class="w-full text-left flex items-center justify-between gap-4 px-6 py-5 rounded-2xl glass-monolith border border-outline-variant/20 transition-all duration-300 hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          :class="{ 'border-primary/40 bg-primary/5': activeIndex === i }"
          @click="toggle(i)"
          :aria-expanded="activeIndex === i"
        >
          <span class="font-semibold text-base md:text-lg leading-snug">{{ faq.question }}</span>
          <span
            class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 text-primary"
            :class="activeIndex === i ? 'bg-primary/20 rotate-45' : 'bg-surface-container-high'"
          >
            <span class="material-symbols-outlined text-xl leading-none">add</span>
          </span>
        </button>

        <!-- Answer panel -->
        <div
          class="overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.165,0.84,0.44,1)]"
          :style="activeIndex === i ? 'max-height: 400px; opacity: 1;' : 'max-height: 0; opacity: 0;'"
        >
          <p class="px-6 pb-5 pt-3 text-on-surface-variant leading-relaxed">
            {{ faq.answer }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
