<script setup>
import { useLanguage } from '../composables/useLanguage.js'
const { t } = useLanguage()
</script>

<template>
  <section
    class="relative min-h-screen flex flex-col items-center justify-center pt-36 pb-20 px-6 overflow-hidden"
  >
    <!-- Background image -->
    <div class="absolute inset-0 bg-[url('/hero-bg.png')] bg-cover bg-center bg-no-repeat"></div>

    <!-- Dark overlay para legibilidad del texto -->
    <div class="absolute inset-0 bg-surface/80"></div>

    <!-- Ambient glow blob -->
    <div
      class="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-[700px] h-[220px] md:h-[350px] bg-primary/10 blur-[120px] rounded-full pointer-events-none"
    ></div>

    <!-- Main content -->
    <div class="max-w-4xl w-full text-center relative z-10 px-2">

      <!-- Badge — stagger 0 -->
      <span
        class="inline-block px-4 py-1.5 rounded-full bg-surface-container-high text-primary font-bold text-xs tracking-widest uppercase mb-6 border border-outline-variant/15 animate-heroFadeUp"
        style="animation-delay: 0ms;"
      >
        {{ t('hero.badge') }}
      </span>

      <!-- Headline — stagger 1 -->
      <h1
        class="font-headline text-4xl sm:text-5xl md:text-7xl font-extrabold text-on-surface leading-[1.1] tracking-tight mb-6 sm:mb-8 text-glow animate-heroFadeUp"
        style="animation-delay: 150ms;"
      >
        {{ t('hero.headline') }}
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-tertiary">
          {{ t('hero.headlineHighlight') }}
        </span>.
      </h1>

      <!-- Sub-text — stagger 2 -->
      <p
        class="text-base sm:text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed font-medium animate-heroFadeUp"
        style="animation-delay: 300ms;"
      >
        {{ t('hero.sub') }}
      </p>

      <!-- CTA buttons — stagger 3 -->
      <div
        class="flex flex-col sm:flex-row gap-4 justify-center animate-heroFadeUp"
        style="animation-delay: 450ms;"
      >
        <a href="#contacto" class="w-full sm:w-auto">
          <button class="btn-primary text-base sm:text-lg px-8 sm:px-10 py-3 sm:py-4 w-full sm:w-auto">
            {{ t('hero.cta') }}
          </button>
        </a>
        <a href="#servicios" class="w-full sm:w-auto">
          <button class="btn-glass text-base sm:text-lg px-8 sm:px-10 py-3 sm:py-4 w-full sm:w-auto">
            {{ t('hero.vision') }}
          </button>
        </a>
      </div>
    </div>
  </section>
</template>
