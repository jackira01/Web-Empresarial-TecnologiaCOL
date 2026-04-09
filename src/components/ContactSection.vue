<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useScrollReveal } from '../composables/useScrollReveal.js'
import { contact } from '../data/siteData.js'
import { colombiaDepartamentos } from '../data/colombiaData.js'
import { useLanguage } from '../composables/useLanguage.js'

const sectionRef = ref(null)
useScrollReveal([sectionRef], { threshold: 0.1 })

const { t } = useLanguage()

// ── Cooldown ──────────────────────────────────────────────────
const COOLDOWN_SHORT_MS = 5 * 60 * 1000      // 5 minutos
const COOLDOWN_LONG_MS  = 24 * 60 * 60 * 1000 // 24 horas
const MAX_SENDS = 3
const LS_COUNT = 'contact_submit_count'
const LS_UNTIL = 'contact_cooldown_until'

const submitCount   = ref(0)
const cooldownUntil = ref(0) // timestamp ms
const timeLeft      = ref(0) // segundos restantes
let timerInterval   = null

function formatTime(seconds) {
  if (seconds <= 0) return ''
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) {
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function clearCooldownStorage() {
  localStorage.removeItem(LS_COUNT)
  localStorage.removeItem(LS_UNTIL)
}

function saveCooldown() {
  localStorage.setItem(LS_COUNT, String(submitCount.value))
  localStorage.setItem(LS_UNTIL, String(cooldownUntil.value))
}

function startTimer() {
  if (timerInterval) clearInterval(timerInterval)
  timerInterval = setInterval(() => {
    const remaining = Math.ceil((cooldownUntil.value - Date.now()) / 1000)
    if (remaining <= 0) {
      timeLeft.value = 0
      clearInterval(timerInterval)
      timerInterval = null
      // Si era el cooldown largo, resetear el contador
      if (submitCount.value >= MAX_SENDS) {
        submitCount.value = 0
        cooldownUntil.value = 0
        clearCooldownStorage()
      }
    } else {
      timeLeft.value = remaining
    }
  }, 1000)
}

function loadCooldown() {
  const count = parseInt(localStorage.getItem(LS_COUNT) || '0', 10)
  const until = parseInt(localStorage.getItem(LS_UNTIL) || '0', 10)
  const now = Date.now()

  if (until > 0 && now >= until) {
    // Cooldown ya expiró: limpiar
    submitCount.value = 0
    cooldownUntil.value = 0
    timeLeft.value = 0
    clearCooldownStorage()
  } else {
    submitCount.value = count
    cooldownUntil.value = until
    timeLeft.value = until > 0 ? Math.ceil((until - now) / 1000) : 0
    if (timeLeft.value > 0) startTimer()
  }
}

function handleCooldown() {
  const newCount = submitCount.value + 1
  submitCount.value = newCount
  const now = Date.now()

  cooldownUntil.value = newCount >= MAX_SENDS
    ? now + COOLDOWN_LONG_MS
    : now + COOLDOWN_SHORT_MS

  timeLeft.value = Math.ceil((cooldownUntil.value - now) / 1000)
  saveCooldown()
  startTimer()
}

const isCooldown = computed(() => timeLeft.value > 0)
const isLongCooldown = computed(() => submitCount.value >= MAX_SENDS && timeLeft.value > 0)

const cooldownMessage = computed(() => {
  if (!isCooldown.value) return ''
  const time = formatTime(timeLeft.value)
  const key = isLongCooldown.value ? 'contact.form.cooldown24h' : 'contact.form.cooldown'
  return t(key).replace('{time}', time)
})

onMounted(loadCooldown)
onUnmounted(() => { if (timerInterval) clearInterval(timerInterval) })
// ─────────────────────────────────────────────────────────────

const form = ref({
  nombre: '',
  apellido: '',
  ubicacion: 'colombia',
  departamento: '',
  ciudad: '',
  ubicacionExterior: '',
  prefijo: '',
  whatsapp: '',
  telefono: '',
  email: '',
  mensaje: '',
})

const touched = ref(false)
const submitted = ref(false)
const submittedName = ref('')
const loading = ref(false)
const submitError = ref('')

watch(() => form.value.departamento, () => {
  form.value.ciudad = ''
})

watch(() => form.value.ubicacion, () => {
  form.value.departamento = ''
  form.value.ciudad = ''
  form.value.ubicacionExterior = ''
  form.value.prefijo = ''
})

const ciudades = computed(() => {
  if (!form.value.departamento) return []
  return colombiaDepartamentos.find(d => d.nombre === form.value.departamento)?.ciudades ?? []
})

// Prefijo activo: +57 para Colombia, el que escriba para exterior
const prefijoActivo = computed(() =>
  form.value.ubicacion === 'colombia' ? '+57' : form.value.prefijo.trim()
)

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const hasContacto = computed(() =>
  !!form.value.whatsapp.trim() || !!form.value.telefono.trim() || !!form.value.email.trim()
)

const ubicacionOk = computed(() => {
  if (form.value.ubicacion === 'colombia') {
    // Si eligió departamento, debe elegir ciudad
    return !(form.value.departamento && !form.value.ciudad)
  }
  // Exterior: si escribió algo debe tener al menos 5 caracteres
  const ext = form.value.ubicacionExterior.trim()
  return !(ext.length > 0 && ext.length < 5)
})

const errors = computed(() => ({
  nombre: touched.value && !form.value.nombre.trim(),
  apellido: touched.value && !form.value.apellido.trim(),
  ciudad:
    touched.value &&
    form.value.ubicacion === 'colombia' &&
    !!form.value.departamento &&
    !form.value.ciudad,
  exterior:
    touched.value &&
    form.value.ubicacion === 'exterior' &&
    form.value.ubicacionExterior.trim().length > 0 &&
    form.value.ubicacionExterior.trim().length < 5,
  prefijo:
    touched.value &&
    form.value.ubicacion === 'exterior' &&
    !form.value.prefijo.trim(),
  contacto: touched.value && !hasContacto.value,
  emailInvalido:
    touched.value &&
    !!form.value.email.trim() &&
    !EMAIL_RE.test(form.value.email.trim()),
}))

const whatsappUrl = computed(() =>
  `https://wa.me/${contact.phone.raw.replace('+', '')}`
)

async function submit() {
  touched.value = true
  if (!form.value.nombre.trim() || !form.value.apellido.trim() || !hasContacto.value || !ubicacionOk.value) return
  if (form.value.ubicacion === 'exterior' && !form.value.prefijo.trim()) return
  if (form.value.email.trim() && !EMAIL_RE.test(form.value.email.trim())) return
  if (isCooldown.value) return

  loading.value = true
  submitError.value = ''

  const payload = {
    nombre: form.value.nombre.trim(),
    apellido: form.value.apellido.trim(),
    ubicacion:
      form.value.ubicacion === 'colombia'
        ? [
            form.value.departamento,
            form.value.ciudad,
          ]
            .filter(Boolean)
            .join(', ') || 'Colombia'
        : form.value.ubicacionExterior.trim() || 'Exterior',
    whatsapp: form.value.whatsapp.trim()
      ? `${prefijoActivo.value} ${form.value.whatsapp.trim()}`
      : '',
    telefono: form.value.telefono.trim()
      ? `${prefijoActivo.value} ${form.value.telefono.trim()}`
      : '',
    email: form.value.email.trim(),
    mensaje: form.value.mensaje.trim(),
  }

  try {
    const res = await fetch(
      import.meta.env.VITE_N8N_WEBHOOK_URL,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
    )
    if (!res.ok) throw new Error(`Error ${res.status}`)
    submittedName.value = form.value.nombre
    submitted.value = true
    handleCooldown()
  } catch {
    submitError.value = t('contact.form.sendError')
  } finally {
    loading.value = false
  }
}

function reset() {
  Object.assign(form.value, {
    nombre: '', apellido: '', ubicacion: 'colombia',
    departamento: '', ciudad: '', ubicacionExterior: '',
      prefijo: '', whatsapp: '', telefono: '', email: '', mensaje: '',
  })
  touched.value = false
  submitted.value = false
  submittedName.value = ''
}
</script>

<template>
  <section id="contacto" class="py-24 px-6">
    <div ref="sectionRef" class="reveal max-w-7xl mx-auto">

      <!-- Section header -->
      <div class="text-center mb-14">
        <h2 class="font-headline text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4">
          {{ t('contact.title') }}
          <span class="text-primary italic"> {{ t('contact.titleHighlight') }}</span>
        </h2>
        <p class="text-on-surface-variant text-lg max-w-2xl mx-auto">
          {{ t('contact.sub') }}
        </p>
      </div>

      <!-- Two-column layout -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

        <!-- ─── LEFT: Form (2/3) ─────────────────────────────── -->
        <div
          class="lg:col-span-2 glass-monolith rounded-[2rem] border border-outline-variant/10 overflow-hidden p-8 md:p-12"
          style="box-shadow: 0 24px 80px -12px rgba(0,0,0,0.5);"
        >

          <!-- Success state -->
          <div v-if="submitted" class="flex flex-col items-center justify-center py-16 text-center">
            <div
              class="w-20 h-20 rounded-full bg-primary-container flex items-center justify-center mb-6"
              style="box-shadow: 0 0 40px rgba(187,195,255,0.25);"
            >
              <span class="material-symbols-outlined text-on-primary-container text-4xl">check_circle</span>
            </div>
            <h3 class="font-headline text-2xl font-bold mb-2">{{ t('contact.form.successTitle') }}</h3>
            <p class="text-on-surface-variant mb-8 max-w-sm">
              {{ t('contact.form.successText') }} <strong class="text-on-surface">{{ submittedName }}</strong>,
              {{ t('contact.form.successText2') }}
              <strong class="text-on-surface">{{ contact.responseTime }}</strong>.
            </p>
            <button @click="reset" class="btn-glass px-8 py-3">
              {{ t('contact.form.successBtn') }}
            </button>
          </div>

          <!-- Form -->
          <form v-else @submit.prevent="submit" novalidate class="space-y-8">

            <div>
              <h3 class="font-headline text-xl font-bold mb-1">{{ t('contact.form.heading') }}</h3>
              <p class="text-sm text-on-surface-variant">{{ t('contact.form.headingSub') }}</p>
            </div>

            <!-- Nombre + Apellido -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="field-label">{{ t('contact.form.firstName') }} <span class="text-primary">*</span></label>
                <input
                  v-model="form.nombre"
                  type="text"
                  :placeholder="t('contact.form.firstNamePlaceholder')"
                  :class="['input-contact', errors.nombre && 'input-contact--error']"
                />
                <p v-if="errors.nombre" class="field-error">{{ t('contact.form.firstNameError') }}</p>
              </div>
              <div>
                <label class="field-label">{{ t('contact.form.lastName') }} <span class="text-primary">*</span></label>
                <input
                  v-model="form.apellido"
                  type="text"
                  :placeholder="t('contact.form.lastNamePlaceholder')"
                  :class="['input-contact', errors.apellido && 'input-contact--error']"
                />
                <p v-if="errors.apellido" class="field-error">{{ t('contact.form.lastNameError') }}</p>
              </div>
            </div>

            <!-- Ubicación -->
            <div class="space-y-3">
              <label class="field-label">{{ t('contact.form.location') }}</label>

              <!-- Toggle Colombia / Exterior -->
              <div class="flex gap-2 p-1 bg-surface-container rounded-xl">
                <button
                  type="button"
                  @click="form.ubicacion = 'colombia'"
                  :class="[
                    'flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                    form.ubicacion === 'colombia'
                      ? 'bg-primary-container text-on-primary-container shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface',
                  ]"
                >
                  <span class="material-symbols-outlined text-[18px]">location_on</span>
                  {{ t('contact.form.colombia') }}
                </button>
                <button
                  type="button"
                  @click="form.ubicacion = 'exterior'"
                  :class="[
                    'flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                    form.ubicacion === 'exterior'
                      ? 'bg-primary-container text-on-primary-container shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface',
                  ]"
                >
                  <span class="material-symbols-outlined text-[18px]">language</span>
                  {{ t('contact.form.outside') }}
                </button>
              </div>

              <!-- Colombia: Departamento + Ciudad -->
              <div v-if="form.ubicacion === 'colombia'" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="field-label-sm">{{ t('contact.form.department') }}</label>
                  <div class="relative">
                    <select v-model="form.departamento" class="input-contact appearance-none pr-10 cursor-pointer">
                      <option value="" disabled>{{ t('contact.form.selectPlaceholder') }}</option>
                      <option
                        v-for="dep in colombiaDepartamentos"
                        :key="dep.nombre"
                        :value="dep.nombre"
                      >{{ dep.nombre }}</option>
                    </select>
                    <span class="material-symbols-outlined select-chevron">expand_more</span>
                  </div>
                </div>
                <div>
                  <label class="field-label-sm">{{ t('contact.form.city') }}</label>
                  <div class="relative">
                    <select
                      v-model="form.ciudad"
                      :disabled="!form.departamento"
                      :class="[
                        'input-contact appearance-none pr-10 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed',
                        errors.ciudad && 'input-contact--error',
                      ]"
                    >
                      <option value="" disabled>
                        {{ form.departamento ? t('contact.form.selectPlaceholder') : t('contact.form.selectDepartmentFirst') }}
                      </option>
                      <option v-for="ciudad in ciudades" :key="ciudad" :value="ciudad">
                        {{ ciudad }}
                      </option>
                    </select>
                    <span class="material-symbols-outlined select-chevron">expand_more</span>
                  </div>
                  <p v-if="errors.ciudad" class="field-error">{{ t('contact.form.cityError') }}</p>
                </div>
              </div>

              <!-- Exterior: Input libre -->
              <div v-else>
                <label class="field-label-sm">{{ t('contact.form.countryCity') }}</label>
                <input
                  v-model="form.ubicacionExterior"
                  type="text"
                  :placeholder="t('contact.form.countryCityPlaceholder')"
                  :class="['input-contact', errors.exterior && 'input-contact--error']"
                />
                <p v-if="errors.exterior" class="field-error">{{ t('contact.form.exteriorError') }}</p>
              </div>
            </div>

            <!-- Datos de contacto -->
            <div class="space-y-4">
              <div>
                <p class="field-label">
                  {{ t('contact.form.contactInfo') }} <span class="text-primary">*</span>
                </p>
                <p class="text-xs text-on-surface-variant/60 mt-0.5">
                  {{ t('contact.form.contactInfoSub') }}
                </p>
              </div>

              <!-- Prefijo exterior (solo si es fuera del país) -->
              <div v-if="form.ubicacion === 'exterior'" class="space-y-1">
                <label class="field-label-sm">
                  {{ t('contact.form.prefix') }} <span class="text-primary">*</span>
                </label>
                <div :class="['input-icon-wrap', errors.prefijo && 'input-icon-wrap--error']">
                  <span class="material-symbols-outlined input-icon-symbol">pin</span>
                  <input
                    v-model="form.prefijo"
                    type="text"
                    :placeholder="t('contact.form.prefixPlaceholder')"
                    class="input-inner"
                  />
                </div>
                <p v-if="errors.prefijo" class="field-error">{{ t('contact.form.prefixError') }}</p>
              </div>

              <!-- WhatsApp + Teléfono -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="field-label-sm">{{ t('contact.form.whatsapp') }}</label>
                  <div :class="['input-icon-wrap', errors.contacto && 'input-icon-wrap--error']">
                    <span class="material-symbols-outlined input-icon-symbol">chat</span>
                    <span class="phone-prefix">{{ form.ubicacion === 'colombia' ? '+57' : (form.prefijo.trim() || '+…') }}</span>
                    <input
                      v-model="form.whatsapp"
                      type="tel"
                      placeholder="300 000 0000"
                      class="input-inner"
                    />
                  </div>
                </div>
                <div>
                  <label class="field-label-sm">{{ t('contact.form.phone') }}</label>
                  <div :class="['input-icon-wrap', errors.contacto && 'input-icon-wrap--error']">
                    <span class="material-symbols-outlined input-icon-symbol">call</span>
                    <span class="phone-prefix">{{ form.ubicacion === 'colombia' ? '+57' : (form.prefijo.trim() || '+…') }}</span>
                    <input
                      v-model="form.telefono"
                      type="tel"
                      placeholder="300 000 0000"
                      class="input-inner"
                    />
                  </div>
                </div>
              </div>

              <!-- Email -->
              <div>
                <label class="field-label-sm">{{ t('contact.form.email') }}</label>
                <div :class="['input-icon-wrap', (errors.contacto || errors.emailInvalido) && 'input-icon-wrap--error']">
                  <span class="material-symbols-outlined input-icon-symbol">mail</span>
                  <input
                    v-model="form.email"
                    type="email"
                    :placeholder="t('contact.form.emailPlaceholder')"
                    class="input-inner"
                  />
                </div>
                <p v-if="errors.emailInvalido" class="field-error">{{ t('contact.form.emailError') }}</p>
              </div>

              <p v-if="errors.contacto" class="field-error flex items-center gap-1">
                <span class="material-symbols-outlined text-[14px]">error</span>
                {{ t('contact.form.contactRequired') }}
              </p>
            </div>

            <!-- Mensaje adicional -->
            <div>
              <label class="field-label">
                {{ t('contact.form.message') }}
                <span class="text-on-surface-variant/40 font-normal text-xs">{{ t('contact.form.optional') }}</span>
              </label>
              <textarea
                v-model="form.mensaje"
                rows="4"
                :placeholder="t('contact.form.messagePlaceholder')"
                class="input-contact resize-none"
              />
            </div>

            <!-- Submit -->
            <div class="pt-2 space-y-3">
              <button
                type="submit"
                :disabled="loading || isCooldown"
                class="btn-primary w-full sm:w-auto px-12 py-4 text-base flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span
                  v-if="loading"
                  class="w-4 h-4 border-2 border-on-primary-container/40 border-t-on-primary-container rounded-full animate-spin"
                />
                <span v-else-if="isCooldown" class="material-symbols-outlined text-[18px]">schedule</span>
                <span>{{ loading ? t('contact.form.sending') : isCooldown ? formatTime(timeLeft) : t('contact.form.send') }}</span>
              </button>
              <p v-if="isCooldown" class="field-error flex items-center gap-1 text-sm">
                <span class="material-symbols-outlined text-[16px]">timer</span>
                {{ cooldownMessage }}
              </p>
              <p v-if="submitError" class="field-error flex items-center gap-1 text-sm">
                <span class="material-symbols-outlined text-[16px]">error</span>
                {{ submitError }}
              </p>
            </div>

          </form>
        </div>

        <!-- ─── RIGHT: Direct contact info (1/3) ──────────────── -->
        <div class="flex flex-col gap-4">

          <!-- Contact cards -->
          <div
            class="glass-monolith rounded-[2rem] border border-outline-variant/10 p-8"
            style="box-shadow: 0 24px 80px -12px rgba(0,0,0,0.4);"
          >
            <h3 class="font-headline text-xl font-bold mb-1">{{ t('contact.direct.title') }}</h3>
            <p class="text-sm text-on-surface-variant mb-8">{{ t('contact.direct.sub') }}</p>

            <div class="flex flex-col gap-6">

              <!-- Email -->
              <a
                :href="'mailto:' + contact.email"
                class="group flex items-center gap-4 transition-transform duration-300 hover:-translate-y-1"
              >
                <div class="contact-icon-wrap text-tertiary group-hover:shadow-[0_0_20px_rgba(0,218,243,0.3)]">
                  <span class="material-symbols-outlined">mail</span>
                </div>
                <div class="min-w-0">
                  <p class="contact-label">{{ t('contact.direct.email') }}</p>
                  <p class="contact-value truncate">{{ contact.email }}</p>
                </div>
              </a>

              <!-- Teléfono -->
              <a
                :href="'tel:' + contact.phone.raw"
                class="group flex items-center gap-4 transition-transform duration-300 hover:-translate-y-1"
              >
                <div class="contact-icon-wrap text-primary group-hover:shadow-[0_0_20px_rgba(187,195,255,0.3)]">
                  <span class="material-symbols-outlined">call</span>
                </div>
                <div>
                  <p class="contact-label">{{ t('contact.direct.phone') }}</p>
                  <p class="contact-value">{{ contact.phone.display }}</p>
                </div>
              </a>

              <!-- WhatsApp -->
              <a
                :href="whatsappUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="group flex items-center gap-4 transition-transform duration-300 hover:-translate-y-1"
              >
                <div class="contact-icon-wrap text-[#25D366] group-hover:shadow-[0_0_20px_rgba(37,211,102,0.3)]">
                  <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </div>
                <div>
                  <p class="contact-label">{{ t('contact.direct.whatsapp') }}</p>
                  <p class="contact-value">{{ t('contact.direct.sendMessage') }}</p>
                </div>
              </a>

            </div>
          </div>

          <!-- Response time -->
          <div
            class="glass-monolith rounded-2xl border border-outline-variant/10 p-6 flex items-center gap-4"
          >
            <div class="flex-shrink-0 w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-tertiary">
              <span class="material-symbols-outlined">schedule</span>
            </div>
            <div>
              <p class="text-xs text-on-surface-variant font-medium">{{ t('contact.direct.responseTime') }}</p>
              <p class="font-bold">{{ t('contact.direct.responseLess') }} {{ contact.responseTime }}</p>
            </div>
          </div>

        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
.input-contact {
  @apply w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-3
         text-on-surface placeholder:text-on-surface-variant/40
         focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20
         transition-colors duration-200;
}
.input-contact--error {
  @apply border-red-500/50 focus:border-red-500/60 focus:ring-red-500/20;
}
.field-label {
  @apply block text-sm font-medium text-on-surface-variant mb-1.5;
}
.field-label-sm {
  @apply block text-xs text-on-surface-variant/70 mb-1.5;
}
.field-error {
  @apply mt-1 text-xs text-red-400;
}
/* Flex wrapper para inputs con ícono — evita solapamiento con el label */
.input-icon-wrap {
  @apply flex items-center w-full bg-surface-container border border-outline-variant/30 rounded-xl
         transition-colors duration-200;
}
.input-icon-wrap:focus-within {
  @apply border-primary/50 ring-1 ring-primary/20;
}
.input-icon-wrap--error {
  @apply border-red-500/50;
}
.input-icon-wrap--error:focus-within {
  @apply border-red-500/60 ring-red-500/20;
}
.input-icon-symbol {
  @apply pl-3 flex-shrink-0 text-on-surface-variant/50 pointer-events-none;
  font-size: 18px;
}
.input-inner {
  @apply flex-1 bg-transparent px-3 py-3 text-on-surface
         placeholder:text-on-surface-variant/40 focus:outline-none;
}
.phone-prefix {
  @apply px-2 text-sm font-semibold text-on-surface-variant border-r border-outline-variant/30 flex-shrink-0 select-none;
  line-height: 1;
}
.contact-icon-wrap {
  @apply flex-shrink-0 w-12 h-12 rounded-full bg-surface-container-high
         flex items-center justify-center
         transition-all duration-300 group-hover:scale-110;
}
.contact-label {
  @apply text-xs text-on-surface-variant font-medium;
}
.contact-value {
  @apply font-semibold text-sm;
}
</style>
