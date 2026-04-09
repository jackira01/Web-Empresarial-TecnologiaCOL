<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useLanguage } from '../composables/useLanguage.js'

const { lang, t, toggleLang } = useLanguage()

const navRef = ref(null)
const scrolled = ref(false)
const activeSection = ref('servicios')
const menuOpen = ref(false)

const sections = ['servicios', 'portafolio', 'contacto']
let observer = null

function onScroll() {
  scrolled.value = window.scrollY > 20
}

function smoothScrollTo(event) {
  const href = event.currentTarget.getAttribute('href')
  if (!href || !href.startsWith('#')) return
  menuOpen.value = false
  // Lenis intercepta el click desde App.vue; solo cerramos el menú móvil aquí
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activeSection.value = entry.target.id
        }
      })
    },
    { threshold: 0.3 }
  )

  sections.forEach((id) => {
    const el = document.getElementById(id)
    if (el) observer.observe(el)
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  if (observer) observer.disconnect()
})
</script>

<template>
  <!-- Wrapper fijo que contiene la pill nav + menú móvil -->
  <div class="fixed top-0 left-0 right-0 z-50 flex flex-col items-center mt-4 px-4 pointer-events-none">

    <!-- Nav pill -->
    <nav
      ref="navRef"
      :class="[
        'pointer-events-auto flex justify-between items-center w-full max-w-5xl',
        'px-4 sm:px-6 py-3',
        'glass rounded-full font-headline tracking-tight',
        'animate-navEnter',
        scrolled ? 'nav-scrolled' : '',
      ]"
    >
      <!-- Logo -->
      <div class="select-none">
        <img src="/logo.png" alt="Tecnología COL" class="h-8 sm:h-10 w-auto" />
      </div>

      <!-- Nav links (desktop) -->
      <div class="hidden md:flex items-center space-x-8">
        <a
          href="#servicios"
          @click="smoothScrollTo"
          :class="activeSection === 'servicios'
            ? 'text-primary font-bold border-b-2 border-primary-container pb-0.5 transition-colors duration-300'
            : 'text-on-surface/70 hover:text-primary transition-colors duration-300'"
        >{{ t('nav.services') }}</a>
        <a
          href="#portafolio"
          @click="smoothScrollTo"
          :class="activeSection === 'portafolio'
            ? 'text-primary font-bold border-b-2 border-primary-container pb-0.5 transition-colors duration-300'
            : 'text-on-surface/70 hover:text-primary transition-colors duration-300'"
        >{{ t('nav.projects') }}</a>
        <a
          href="#contacto"
          @click="smoothScrollTo"
          :class="activeSection === 'contacto'
            ? 'text-primary font-bold border-b-2 border-primary-container pb-0.5 transition-colors duration-300'
            : 'text-on-surface/70 hover:text-primary transition-colors duration-300'"
        >{{ t('nav.contact') }}</a>
      </div>

      <!-- CTA + Language toggle (desktop) -->
      <div class="hidden md:flex items-center gap-3">
        <!-- Language toggle -->
        <button
          @click="toggleLang"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-outline-variant/30 bg-surface-container-high/60 text-on-surface/70 hover:text-primary hover:border-primary/40 transition-all duration-200 text-xs font-semibold select-none"
          :aria-label="lang === 'es' ? 'Switch to English' : 'Cambiar a Español'"
        >
          <span class="material-symbols-outlined text-base leading-none">translate</span>
          <span>{{ lang === 'es' ? 'EN' : 'ES' }}</span>
        </button>
        <a href="#contacto" @click="smoothScrollTo">
          <button class="btn-primary px-6 py-2 text-sm">
            {{ t('nav.cta') }}
          </button>
        </a>
      </div>

      <!-- Móvil: lang toggle + CTA compacto + hamburger -->
      <div class="flex items-center gap-2 md:hidden">
        <!-- Language toggle móvil -->
        <button
          @click="toggleLang"
          class="flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-outline-variant/30 bg-surface-container-high/60 text-on-surface/70 hover:text-primary hover:border-primary/40 transition-all duration-200 text-xs font-semibold select-none"
          :aria-label="lang === 'es' ? 'Switch to English' : 'Cambiar a Español'"
        >
          <span class="material-symbols-outlined text-sm leading-none">translate</span>
          <span>{{ lang === 'es' ? 'EN' : 'ES' }}</span>
        </button>
        <a href="#contacto" @click="smoothScrollTo">
          <button class="btn-primary px-4 py-1.5 text-xs">
            {{ t('nav.ctaMobile') }}
          </button>
        </a>
        <button
          class="w-9 h-9 flex items-center justify-center rounded-full bg-surface-container-high/70 text-on-surface"
          @click="menuOpen = !menuOpen"
          :aria-expanded="menuOpen"
          :aria-label="t('nav.openMenu')"
        >
          <span class="material-symbols-outlined text-xl leading-none">
            {{ menuOpen ? 'close' : 'menu' }}
          </span>
        </button>
      </div>
    </nav>

    <!-- Menú móvil desplegable -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="menuOpen"
        class="pointer-events-auto md:hidden mt-2 w-full max-w-5xl glass rounded-2xl px-6 py-4 flex flex-col gap-1"
      >
        <a
          href="#servicios"
          @click="smoothScrollTo"
          class="py-3 px-2 font-semibold text-on-surface/80 hover:text-primary border-b border-outline-variant/15 transition-colors duration-200"
        >{{ t('nav.services') }}</a>
        <a
          href="#portafolio"
          @click="smoothScrollTo"
          class="py-3 px-2 font-semibold text-on-surface/80 hover:text-primary border-b border-outline-variant/15 transition-colors duration-200"
        >{{ t('nav.projects') }}</a>
        <a
          href="#contacto"
          @click="smoothScrollTo"
          class="py-3 px-2 font-semibold text-on-surface/80 hover:text-primary transition-colors duration-200"
        >{{ t('nav.contact') }}</a>
      </div>
    </Transition>

  </div>
</template>
