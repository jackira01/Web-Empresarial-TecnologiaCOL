<script setup>
import { ref, computed } from 'vue'
import { useScrollRevealList } from '../composables/useScrollReveal.js'
import { useLanguage } from '../composables/useLanguage.js'
import { translations } from '../data/translations.js'

const gridRef = ref(null)
useScrollRevealList(gridRef, { stagger: 120, threshold: 0.06 })

const { lang, t } = useLanguage()
const webTypeItems = computed(() => translations[lang.value].webTypes.items)

// Mantener las imágenes y spans estáticos (no traducibles)
const webTypesMeta = [
  { accent: 'from-primary/70 to-secondary/60', span: 'md:col-span-7' },
  { accent: 'from-tertiary/70 to-primary/50', span: 'md:col-span-5' },
  { accent: 'from-secondary/70 to-tertiary/50', span: 'md:col-span-5' },
  { accent: 'from-primary/80 to-tertiary/60', span: 'md:col-span-7' },
  { accent: 'from-tertiary/70 to-secondary/60', span: 'md:col-span-6' },
  { accent: 'from-primary/60 to-secondary/70', span: 'md:col-span-6' },
]
const webTypeImages = [
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=900&q=80&fit=crop',
  'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=700&q=80&fit=crop',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=700&q=80&fit=crop',
  'https://images.unsplash.com/photo-1545665277-5937489579f2?w=900&q=80&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=700&q=80&fit=crop',
  'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=700&q=80&fit=crop',
]
</script>

<template>
  <section id="tipos-web" class="py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-end mb-10 sm:mb-16 gap-6">
      <div class="max-w-2xl">
        <p class="text-primary font-semibold text-sm uppercase tracking-widest mb-3">
          {{ t('webTypes.headerTag') }}
        </p>
        <h2 class="font-headline text-3xl sm:text-4xl md:text-5xl font-extrabold text-on-surface mb-4">
          {{ t('webTypes.title') }}
        </h2>
        <p class="text-on-surface-variant text-base sm:text-lg">
          {{ t('webTypes.sub') }}
        </p>
      </div>
      <div class="h-px flex-grow bg-outline-variant/20 mx-8 hidden md:block"></div>
    </div>

    <!-- Bento Grid -->
    <div ref="gridRef" class="grid grid-cols-1 md:grid-cols-12 gap-5">
      <div
        v-for="(item, idx) in webTypeItems"
        :key="item.id"
        :class="[webTypesMeta[idx].span, 'web-type-card group reveal']"
      >
        <!-- Background image -->
        <img
          :src="webTypeImages[idx]"
          :alt="item.title"
          class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />

        <!-- Gradient overlay base -->
        <div
          :class="[
            'absolute inset-0 bg-gradient-to-t',
            webTypesMeta[idx].accent,
            'opacity-60 group-hover:opacity-40 transition-opacity duration-500',
          ]"
        ></div>

        <!-- Dark scrim bottom -->
        <div
          class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"
        ></div>

        <!-- Tag -->
        <span
          class="absolute top-4 left-4 glass text-on-surface/90 text-xs font-semibold px-3 py-1 rounded-full border border-outline-variant/20 select-none"
        >
          {{ item.tag }}
        </span>

        <!-- Content bottom -->
        <div class="absolute bottom-0 left-0 right-0 p-6">
          <p class="text-on-surface/60 text-xs font-semibold uppercase tracking-widest mb-1 select-none">
            {{ item.subtitle }}
          </p>
          <h3 class="text-on-surface text-2xl font-extrabold font-headline mb-0 leading-tight">
            {{ item.title }}
          </h3>

          <!-- Description: hidden by default, slides up on hover -->
          <div
            class="overflow-hidden max-h-0 group-hover:max-h-40 transition-all duration-500 ease-in-out"
          >
            <p class="text-on-surface/75 text-sm leading-relaxed mt-3">
              {{ item.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.web-type-card {
  @apply relative overflow-hidden rounded-2xl cursor-default;
  min-height: 280px;
  background: theme('colors.surface-container-low');
}

@media (min-width: 768px) {
  .web-type-card:nth-child(1) { min-height: 360px; }
  .web-type-card:nth-child(2) { min-height: 360px; }
  .web-type-card:nth-child(3) { min-height: 300px; }
  .web-type-card:nth-child(4) { min-height: 300px; }
  .web-type-card:nth-child(5) { min-height: 340px; }
  .web-type-card:nth-child(6) { min-height: 340px; }
}
</style>
