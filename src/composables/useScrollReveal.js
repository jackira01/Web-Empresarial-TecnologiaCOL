import { onMounted, onUnmounted } from 'vue'

/**
 * useScrollReveal
 *
 * Observes an array of element refs and adds 'is-visible' when they enter
 * the viewport. Each element can optionally have a data-delay attribute (ms).
 *
 * @param {Ref<HTMLElement | null>[]} targets - array of template refs
 * @param {object} options
 * @param {number} options.threshold - intersection ratio to trigger (default 0.15)
 * @param {boolean} options.once    - unobserve after first trigger (default true)
 */
export function useScrollReveal(targets, { threshold = 0.15, once = true } = {}) {
  let observer = null

  onMounted(() => {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target
            const delay = el.dataset.delay ? parseInt(el.dataset.delay) : 0

            setTimeout(() => {
              el.classList.add('is-visible')
            }, delay)

            if (once) observer.unobserve(el)
          }
        })
      },
      { threshold }
    )

    targets.forEach((ref) => {
      if (ref.value) {
        // Support both single element refs and arrays of elements
        const els = Array.isArray(ref.value) ? ref.value : [ref.value]
        els.forEach((el) => observer.observe(el))
      }
    })
  })

  onUnmounted(() => {
    if (observer) observer.disconnect()
  })
}

/**
 * useScrollRevealList
 *
 * Observes all children of a container ref with cascaded delays.
 *
 * @param {Ref<HTMLElement | null>} containerRef
 * @param {object} options
 * @param {number} options.stagger   - delay increment between items (default 75ms)
 * @param {number} options.threshold
 * @param {boolean} options.once
 */
export function useScrollRevealList(containerRef, { stagger = 75, threshold = 0.1, once = true } = {}) {
  let observer = null

  onMounted(() => {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const children = Array.from(entry.target.children)
            children.forEach((child, idx) => {
              setTimeout(() => {
                child.classList.add('is-visible')
              }, idx * stagger)
            })
            if (once) observer.unobserve(entry.target)
          }
        })
      },
      { threshold }
    )

    if (containerRef.value) observer.observe(containerRef.value)
  })

  onUnmounted(() => {
    if (observer) observer.disconnect()
  })
}
