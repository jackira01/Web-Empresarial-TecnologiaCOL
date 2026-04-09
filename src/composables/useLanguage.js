import { ref } from 'vue'
import { translations } from '../data/translations.js'

// Singleton reactivo compartido entre todos los componentes
const lang = ref('es')

export function useLanguage() {
  function t(key) {
    const keys = key.split('.')
    let val = translations[lang.value]
    for (const k of keys) {
      if (val == null) return key
      val = val[k]
    }
    return val ?? key
  }

  function setLang(l) {
    lang.value = l
  }

  function toggleLang() {
    lang.value = lang.value === 'es' ? 'en' : 'es'
  }

  return { lang, t, setLang, toggleLang }
}
