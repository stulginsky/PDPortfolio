<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, provide, reactive, ref } from 'vue'
import { chirpCardPresentationKey } from './chirp-card-presentation'
import DsBtnNav from './DsBtnNav.vue'
import ChirpAiHealthAssistant from './ChirpAiHealthAssistant.vue'
import ChirpExplainableAiUx from './ChirpExplainableAiUx.vue'
import ChirpAiMedicalBrand from './ChirpAiMedicalBrand.vue'
import ChirpAiDesignSystem from './ChirpAiDesignSystem.vue'

const props = withDefaults(defineProps<{
  ariaLabel?: string
  previousLabel?: string
  nextLabel?: string
}>(), {
  ariaLabel: 'Другие кейсы',
  previousLabel: 'Предыдущие кейсы',
  nextLabel: 'Следующие кейсы',
})
type Position = 'Start' | 'Middle' | 'End'
const emit = defineEmits<{
  positionChange: [value: { position: Position; index: number; offset: number }]
}>()
const cards = [
  { name: 'ChirpAiHealthAssistant', component: ChirpAiHealthAssistant },
  { name: 'ChirpExplainableAiUx', component: ChirpExplainableAiUx },
  { name: 'ChirpAiMedicalBrand', component: ChirpAiMedicalBrand },
  { name: 'ChirpAiDesignSystem', component: ChirpAiDesignSystem },
]
const root = ref<HTMLElement>()
const rail = ref<HTMLElement>()
const viewportWidth = ref(320)
const railWidth = ref(288)
const offset = ref(0)
const breakpoint = computed(() => viewportWidth.value >= 768 ? 'min-768' : 'base')
const referenceCardWidth = 430 * 16 / 21
const cardWidth = computed(() => breakpoint.value === 'min-768'
  ? referenceCardWidth * Math.min(1, railWidth.value / 924)
  : Math.min(referenceCardWidth, Math.max(1, railWidth.value - 24)))
const scale = computed(() => cardWidth.value / 430)
const copyHeights = reactive<Record<string, number>>({})
const stageHeight = computed(() => Math.max(532, ...Object.values(copyHeights).map(height => height * 3)))
const cardHeight = computed(() => stageHeight.value * scale.value)
provide(chirpCardPresentationKey, {
  scale, height: stageHeight,
  reportCopyHeight: (name, height) => { if (Number.isFinite(height) && Math.abs((copyHeights[name] ?? 0) - height) > .05) copyHeights[name] = height },
})
const step = computed(() => cardWidth.value + 8)
const maxOffset = computed(() => Math.max(0, cards.length * cardWidth.value + (cards.length - 1) * 8 - railWidth.value))
const position = computed<Position>(() => offset.value <= 0.5 ? 'Start' : offset.value >= maxOffset.value - 0.5 ? 'End' : 'Middle')
const index = computed(() => Math.min(cards.length - 1, Math.round(offset.value / step.value)))
const layoutStyle = computed(() => ({
  '--related-card-width': `${cardWidth.value}px`,
  '--related-card-height': `${cardHeight.value}px`,
  '--related-stage-width': '430px',
  '--related-scale': scale.value,
}))
let observer: ResizeObserver | undefined
let animation = 0
let previousBreakpoint = 'base'
let focusDirection: -1 | 1 | undefined
function cancelMotion() { cancelAnimationFrame(animation); animation = 0 }
function readScroll() {
  offset.value = Math.max(0, Math.min(maxOffset.value, rail.value?.scrollLeft ?? 0))
  emit('positionChange', { position: position.value, index: index.value, offset: offset.value })
  if (focusDirection && root.value) {
    const active = document.activeElement
    const disappearing = root.value.querySelector<HTMLElement>(focusDirection === 1 ? '.related-cases__next' : '.related-cases__previous')
    const edge = focusDirection === 1 ? position.value === 'End' : position.value === 'Start'
    if (edge && (active === disappearing || active === document.body)) {
      const selector = focusDirection === 1 ? '.related-cases__previous' : '.related-cases__next'
      // Start → End reveals the opposite button in the same render: wait until
      // visibility/tabindex are applied before trying to focus it.
      nextTick(() => root.value?.querySelector<HTMLElement>(selector)?.focus({ preventScroll: true }))
      focusDirection = undefined
    }
  }
}
// CSS ease-out cubic-bezier(0, 0, .58, 1), applied to native scrollLeft.
function easeOut(progress: number) {
  let low = 0, high = 1
  for (let i = 0; i < 16; i++) {
    const t = (low + high) / 2
    const x = 3 * (1 - t) * t * t * .58 + t * t * t
    if (x < progress) low = t; else high = t
  }
  const t = (low + high) / 2
  return 3 * (1 - t) * t * t + t * t * t
}
function scrollToOffset(target: number) {
  cancelMotion()
  const element = rail.value
  if (!element) return
  const end = Math.max(0, Math.min(maxOffset.value, target))
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    element.scrollLeft = end
    readScroll()
    return
  }
  const start = element.scrollLeft
  const started = performance.now()
  function tick(now: number) {
    const progress = Math.min(1, (now - started) / 300)
    element!.scrollLeft = progress === 1 ? end : start + (end - start) * easeOut(progress)
    readScroll()
    if (progress < 1) animation = requestAnimationFrame(tick); else animation = 0
  }
  animation = requestAnimationFrame(tick)
}
function move(direction: -1 | 1, fromButton = false) {
  if (fromButton) {
    focusDirection = direction
    root.value?.querySelector<HTMLElement>(direction === 1 ? '.related-cases__next' : '.related-cases__previous')?.focus({ preventScroll: true })
  }
  if (fromButton && railWidth.value >= 924) {
    scrollToOffset(direction === 1 ? maxOffset.value : 0)
    return
  }
  const current = rail.value?.scrollLeft ?? 0
  // End can be a partial step. Back from End goes to the preceding snap.
  const target = direction === 1
    ? (Math.floor((current + .5) / step.value) + 1) * step.value
    : (Math.ceil((current - .5) / step.value) - 1) * step.value
  scrollToOffset(target)
}
function keyboard(event: KeyboardEvent) {
  if (event.altKey || event.ctrlKey || event.metaKey) return
  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
    event.preventDefault()
    move(event.key === 'ArrowRight' ? 1 : -1)
  } else if (event.key === 'Home' || event.key === 'End') {
    event.preventDefault()
    scrollToOffset(event.key === 'Home' ? 0 : maxOffset.value)
  }
}
async function sync() {
  // Copy reflow changes rail height, not navigation geometry. Do not interrupt
  // a running arrow transition when ResizeObserver reports only that height.
  const newViewportWidth = window.innerWidth
  const newRailWidth = rail.value?.clientWidth || 288
  if (newViewportWidth === viewportWidth.value && newRailWidth === railWidth.value) return
  cancelMotion()
  const oldStep = step.value
  const oldOffset = rail.value?.scrollLeft ?? 0
  const atEnd = oldOffset > .5 && oldOffset >= maxOffset.value - .5
  viewportWidth.value = newViewportWidth
  railWidth.value = newRailWidth
  await nextTick()
  if (!rail.value) return
  rail.value.scrollLeft = previousBreakpoint !== breakpoint.value ? 0 : atEnd ? maxOffset.value : Math.min(maxOffset.value, oldOffset / oldStep * step.value)
  previousBreakpoint = breakpoint.value
  readScroll()
}
function reveal(event: FocusEvent) {
  const target = event.target as HTMLElement
  const item = target.closest<HTMLElement>('.related-cases__card')
  if (!item || !rail.value) return
  const left = item.offsetLeft
  const right = left + cardWidth.value
  if (left < rail.value.scrollLeft - .5) scrollToOffset(left)
  else if (right > rail.value.scrollLeft + railWidth.value + .5) scrollToOffset(right - railWidth.value)
}
onMounted(() => {
  sync().then(readScroll)
  observer = new ResizeObserver(sync)
  if (rail.value) observer.observe(rail.value)
  window.addEventListener('resize', sync)
})
onUnmounted(() => {
  cancelMotion()
  observer?.disconnect()
  window.removeEventListener('resize', sync)
})
</script>

<template>
  <section ref="root" class="related-cases" :style="layoutStyle" :aria-label="props.ariaLabel"
    :data-breakpoint="breakpoint" :data-position="position" :data-scale="scale" @keydown="keyboard">
    <div ref="rail" class="related-cases__rail" @scroll.passive="readScroll" @wheel.passive="cancelMotion"
      @pointerdown="cancelMotion" @focusin="reveal">
      <ul class="related-cases__track">
        <li v-for="card in cards" :key="card.name" class="related-cases__card">
          <div class="related-cases__stage"><component :is="card.component" /></div>
        </li>
      </ul>
    </div>
    <template v-if="breakpoint === 'min-768'">
      <DsBtnNav class="related-cases__nav related-cases__previous" direction="Left" :aria-label="props.previousLabel"
        :aria-hidden="position === 'Start'" :tabindex="position === 'Start' ? -1 : 0"
        :style="{ visibility: position === 'Start' ? 'hidden' : 'visible' }" @click="move(-1, true)" />
      <DsBtnNav class="related-cases__nav related-cases__next" direction="Right" :aria-label="props.nextLabel"
        :aria-hidden="position === 'End'" :tabindex="position === 'End' ? -1 : 0"
        :style="{ visibility: position === 'End' ? 'hidden' : 'visible' }" @click="move(1, true)" />
    </template>
    <span class="related-cases__status" aria-live="polite" aria-atomic="true">Карточка {{ index + 1 }} из {{ cards.length }}</span>
  </section>
</template>

<style scoped>
.related-cases { position: relative; width: 100%; box-sizing: border-box; padding-inline: var(--space-4); }
.related-cases__rail { position: relative; width: 100%; overflow-x: auto; overflow-y: hidden; scrollbar-width: none; scroll-snap-type: x proximity; }
.related-cases__rail::-webkit-scrollbar { display: none; }
.related-cases__track { display: flex; gap: var(--space-2); width: max-content; padding: 0; margin: 0; list-style: none; }
.related-cases__card { position: relative; flex: 0 0 var(--related-card-width); width: var(--related-card-width); height: var(--related-card-height); overflow: hidden; border-radius: 20px; scroll-snap-align: start; }
.related-cases__card:has(a:focus-visible)::after { content: ''; position: absolute; inset: 0; z-index: 4; border: 2px solid var(--border-focus); border-radius: inherit; pointer-events: none; }
.related-cases__stage { width: var(--related-stage-width); transform: scale(var(--related-scale)); transform-origin: top left; }
.related-cases__nav { position: absolute; top: calc(var(--related-card-height) / 2 - 25px); z-index: 3; }
.related-cases__previous { left: -25px; }
.related-cases__next { right: -23px; }
.related-cases__status { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
@media (min-width: 768px) {
  .related-cases { max-width: 924px; margin-inline: auto; padding-inline: 0; }
  .related-cases__rail { scroll-snap-type: none; }
  .related-cases__card { border-radius: calc(var(--radius-xlg) * var(--related-scale)); }
}
</style>
