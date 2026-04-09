<script setup>
import { useLanguage } from '../composables/useLanguage.js'
const { t } = useLanguage()
</script>

<template>
  <footer class="w-full py-12 px-8 border-t border-outline-variant/15 bg-surface-container-lowest">
    <div class="flex flex-col md:flex-row justify-between items-center w-full max-w-7xl mx-auto gap-8 md:gap-0">
      <!-- Brand -->
      <div class="flex flex-col items-center md:items-start gap-2">
        <div class="text-lg font-bold text-on-surface font-headline">TecnologiaCOL</div>
        <p class="text-on-surface/50 font-body text-sm">
          {{ t('footer.rights') }}
        </p>
      </div>

      <!-- Links -->
      <div class="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2">
        <a href="https://www.linkedin.com/in/jhoan-nicolas-beru-alvarez-a30a61210/" target="_blank" rel="noopener noreferrer" class="text-on-surface/50 hover:text-on-surface transition-colors duration-300 text-sm">LinkedIn</a>
        <a href="https://github.com/jackira01" target="_blank" rel="noopener noreferrer" class="text-on-surface/50 hover:text-on-surface transition-colors duration-300 text-sm">GitHub</a>
      </div>
    </div>
  </footer>
</template>
