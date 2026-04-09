<script setup>
import { onMounted, onUnmounted } from 'vue'
import Lenis from 'lenis'
import NavBar from './components/NavBar.vue'
import HeroSection from './components/HeroSection.vue'
import ServicesSection from './components/ServicesSection.vue'
import WebTypesSection from './components/WebTypesSection.vue'
import WhyUsSection from './components/WhyUsSection.vue'
import PortfolioSection from './components/PortfolioSection.vue'
import FaqSection from './components/FaqSection.vue'
import ContactSection from './components/ContactSection.vue'
import FooterSection from './components/FooterSection.vue'

let lenis = null
let rafId = null

onMounted(() => {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  })

  function raf(time) {
    lenis.raf(time)
    rafId = requestAnimationFrame(raf)
  }
  rafId = requestAnimationFrame(raf)

  // Intercepta clicks en anchors y usa Lenis para scroll animado
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]')
    if (!anchor) return
    const href = anchor.getAttribute('href')
    const target = document.querySelector(href)
    if (!target) return
    e.preventDefault()
    lenis.scrollTo(target, { offset: -80 })
  })
})

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId)
  if (lenis) lenis.destroy()
})
</script>

<template>
  <div class="bg-surface text-on-surface">
    <NavBar />
    <main>
      <HeroSection />
      <ServicesSection />
      <WebTypesSection />
      <WhyUsSection />
      <PortfolioSection />
      <FaqSection />
      <ContactSection />
    </main>
    <FooterSection />
  </div>
</template>
