<script setup lang="ts">
import { computed, inject, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import DsBadge from './DsBadge.vue'
import TypoText from './TypoText.vue'
import caseContent from '../../content/cases/chirp-product.json'
import { createHeroDraft, getHeroBreakpoint, heroAmplitudes, heroPointerDirections, heroReferences, heroSceneEditorKey, type HeroBreakpoint, type HeroLayer } from './chirp-pr-hero.scene-context'

const props = withDefaults(defineProps<{ title?: string; badge?: string; breakpoint?: HeroBreakpoint }>(), {
  title: caseContent.hero.title, badge: caseContent.hero.badge,
})
const editor = inject(heroSceneEditorKey, undefined)
const root = ref<HTMLElement>()
const viewport = ref(320)
const containerWidth = ref(320)
const breakpoint = computed(() => props.breakpoint ?? getHeroBreakpoint(viewport.value))
const reference = computed(() => heroReferences[breakpoint.value])
const defaults = createHeroDraft()
const layers = computed(() => (editor?.draft ?? defaults)[breakpoint.value])
const ratio = computed(() => containerWidth.value / reference.value.width)
const assets = '/cases/chirp-product/hero-layers/'
const layerElements: HTMLElement[] = []
const offsets = [0, 0, 0, 0]
let frame = 0
let lastTime = 0
let target = 0
let introStart: number | undefined
let introUsed = false
let primaryPointer: number | undefined
let pointerStart = 0
let pointerNeutral = 0
let visible = false
let reduced: MediaQueryList | undefined
let resizeObserver: ResizeObserver | undefined
let visibilityObserver: IntersectionObserver | undefined
const neutral = () => reduced?.matches || editor?.mode.value === 'Neutral'

function geometryStyle(layer: HeroLayer) {
  return { left: layer.x * ratio.value + 'px', top: layer.y * ratio.value + 'px', width: layer.width * ratio.value + 'px', height: layer.height * ratio.value + 'px' }
}
const titleStyle = computed(() => ({
  '--name-height': reference.value.nameHeight * ratio.value + 'px',
  '--copy-width': reference.value.copyWidth * ratio.value + 'px',
  '--title-size': reference.value.fontSize * ratio.value + 'px',
  '--svg-scale': String(ratio.value),
  '--logo-x': reference.value.logoX * ratio.value + 'px',
  '--logo-y': reference.value.logoY * ratio.value + 'px',
}))
function backgroundImage(index: number) {
  return assets + (index === 0 ? layers.value[0]!.name.toLowerCase() : index === 1 ? 'laptop-p01-w' : 'phones-p01-w') + '.png'
}
function setLayer(element: unknown, index: number) {
  if (element instanceof HTMLElement) layerElements[index] = element
}
function renderOffsets() {
  offsets.forEach((value, index) => {
    layerElements[index]?.style.setProperty('--parallax-x', value + 'px')
  })
}
function resetMotion() {
  introStart = undefined
  target = 0
  offsets.fill(0)
  cancelAnimationFrame(frame)
  frame = 0
  lastTime = 0
  renderOffsets()
  if (root.value) root.value.dataset.motion = 'neutral'
}
function schedule() {
  if (!frame && !neutral()) frame = requestAnimationFrame(tick)
}
function smooth(t: number) { return t * t * (3 - 2 * t) }
function tick(time: number) {
  frame = 0
  if (neutral()) { resetMotion(); return }
  const delta = lastTime ? Math.min(time - lastTime, 64) : 16.67
  lastTime = time
  let ongoing = false
  const elapsed = introStart === undefined ? undefined : time - introStart - 300
  layers.value.forEach((layer, index) => {
    if (!layer.animationEnabled) { offsets[index] = 0; return }
    if (elapsed !== undefined) {
      const progress = Math.max(0, elapsed) * layer.speed
      const scalar = progress < 300 ? smooth(progress / 300) : progress < 900 ? 1 - smooth((progress - 300) / 600) : 0
      offsets[index] = scalar * layer.introDirection * heroAmplitudes[index]! * 0.25
      if (progress < 900) ongoing = true
    } else {
      const destination = target * heroPointerDirections[index]! * heroAmplitudes[index]!
      offsets[index] = offsets[index]! + (destination - offsets[index]!) * (1 - Math.exp(-delta * layer.speed / 100))
      if (Math.abs(destination - offsets[index]!) > 0.01) ongoing = true
      else offsets[index] = destination
    }
  })
  renderOffsets()
  if (root.value) root.value.dataset.motion = elapsed === undefined ? (ongoing ? 'pointer' : 'neutral') : elapsed < 0 ? 'delay' : ongoing ? 'intro' : 'neutral'
  if (elapsed !== undefined && !ongoing) introStart = undefined
  if (ongoing) schedule()
  else lastTime = 0
}
function mediaReady() {
  return [...(root.value?.querySelectorAll('img') ?? [])].every(image => image.complete && image.naturalWidth > 0)
}
function replayIntro() {
  if (neutral() || !mediaReady()) return
  resetMotion()
  introUsed = true
  introStart = performance.now()
  schedule()
}
function maybeIntro() {
  if (!introUsed && visible && !document.hidden && mediaReady() && (viewport.value < 1024 || window.matchMedia('(pointer: coarse)').matches) && !neutral()) replayIntro()
}
function cancelIntro() {
  introUsed = true
  introStart = undefined
}
function pointerMove(event: PointerEvent) {
  if (neutral()) return
  if (event.pointerType === 'touch' || event.pointerType === 'pen') {
    if (primaryPointer !== event.pointerId) return
    cancelIntro()
    target = Math.max(-1, Math.min(1, pointerNeutral + (event.clientX - pointerStart) / Math.max(1, root.value!.clientWidth / 2)))
  } else if (window.matchMedia('(hover: hover)').matches) {
    // A mobile intro is not cancelled by incidental mouse movement in a narrow desktop preview.
    if (introStart !== undefined) return
    target = Math.max(-1, Math.min(1, event.clientX / window.innerWidth * 2 - 1))
  } else return
  schedule()
}
function pointerDown(event: PointerEvent) {
  if (!event.isPrimary || primaryPointer !== undefined) return
  const current = offsets.findIndex((_, index) => layers.value[index]!.animationEnabled)
  const scalar = current < 0 ? 0 : offsets[current]! / (heroAmplitudes[current]! * heroPointerDirections[current]!)
  cancelIntro()
  target = event.pointerType === 'mouse' ? Math.max(-1, Math.min(1, event.clientX / window.innerWidth * 2 - 1)) : scalar
  if (event.pointerType !== 'mouse') {
    primaryPointer = event.pointerId
    pointerStart = event.clientX
    pointerNeutral = scalar
  }
  schedule()
}
function release(event?: PointerEvent) {
  if (event && event.pointerType === 'mouse') return
  if (event && primaryPointer !== event.pointerId) return
  primaryPointer = undefined
  introStart = undefined
  target = 0
  schedule()
}
function viewportLeave(event: PointerEvent) { if (event.relatedTarget === null) release() }
function blurReset() { release() }
function visibilityChange() { if (document.hidden) release(); else maybeIntro() }
function reducedChange() { if (reduced?.matches) { introUsed = true; resetMotion() } }
function sync() {
  viewport.value = window.innerWidth
  containerWidth.value = root.value?.clientWidth || viewport.value
  nextTick(renderOffsets)
}
watch([breakpoint, () => editor?.mode.value], () => { if (root.value) resetMotion() })
watch(() => layers.value.map(layer => layer.animationEnabled), () => {
  offsets.forEach((_, index) => { if (!layers.value[index]!.animationEnabled) offsets[index] = 0 })
  renderOffsets()
})
onMounted(() => {
  sync()
  reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
  reduced.addEventListener('change', reducedChange)
  resizeObserver = new ResizeObserver(sync)
  resizeObserver.observe(root.value!)
  visibilityObserver = new IntersectionObserver(entries => {
    visible = entries[0]?.isIntersecting ?? false
    maybeIntro()
  })
  visibilityObserver.observe(root.value!)
  window.addEventListener('resize', sync)
  window.addEventListener('pointermove', pointerMove, { passive: true })
  window.addEventListener('pointerup', release, { passive: true })
  window.addEventListener('pointercancel', release, { passive: true })
  window.addEventListener('pointerout', viewportLeave, { passive: true })
  window.addEventListener('blur', blurReset)
  document.addEventListener('visibilitychange', visibilityChange)
  maybeIntro()
})
onUnmounted(() => {
  cancelAnimationFrame(frame)
  resizeObserver?.disconnect()
  visibilityObserver?.disconnect()
  reduced?.removeEventListener('change', reducedChange)
  window.removeEventListener('resize', sync)
  window.removeEventListener('pointermove', pointerMove)
  window.removeEventListener('pointerup', release)
  window.removeEventListener('pointercancel', release)
  window.removeEventListener('pointerout', viewportLeave)
  window.removeEventListener('blur', blurReset)
  document.removeEventListener('visibilitychange', visibilityChange)
})
defineExpose({ replayIntro, resetMotion })
</script>

<template>
  <section ref="root" class="chirp-pr-hero" :data-breakpoint="breakpoint" data-motion="neutral"
    :style="{ height: reference.height * ratio + 'px' }" :aria-label="caseContent.pageTitle" @pointerdown="pointerDown">
    <div v-for="(layer, index) in layers" :key="index" :ref="element => setLayer(element, index)"
      class="chirp-pr-hero__layer" :class="{ 'chirp-pr-hero__title': index === 3, 'chirp-pr-hero__crop': index === 0 }"
      :data-layer="layer.name" :data-animation-enabled="layer.animationEnabled"
      :style="[geometryStyle(layer), index === 3 ? titleStyle : {}]">
      <img v-if="index < 3" :src="backgroundImage(index)" alt="" draggable="false" @load="maybeIntro"
        class="chirp-pr-hero__raster" :class="{ 'chirp-pr-hero__background-crop': index === 0 && breakpoint === 'min-1280' }" />
      <template v-else>
        <div class="chirp-pr-hero__wordmark" aria-hidden="true">
          <img :src="assets + reference.assetProfile + '/name.svg'" alt="" draggable="false" @load="maybeIntro" class="chirp-pr-hero__name" />
          <img :src="assets + reference.assetProfile + '/logo.svg'" alt="" draggable="false" @load="maybeIntro" class="chirp-pr-hero__logo" />
        </div>
        <div class="chirp-pr-hero__copy">
          <h1 class="chirp-pr-hero__heading"><TypoText :content="title" /></h1>
          <DsBadge type="HeroChirp" :label="badge" />
        </div>
      </template>
    </div>
  </section>
</template>

<style scoped>
.chirp-pr-hero { position: relative; width: 100%; overflow: clip; background: var(--surface-default); touch-action: pan-y; }
.chirp-pr-hero__layer { position: absolute; transform: translate3d(var(--parallax-x, 0px), 0, 0); will-change: transform; }
.chirp-pr-hero__raster { display: block; width: 100%; height: 100%; object-fit: cover; pointer-events: none; user-select: none; }
.chirp-pr-hero__crop { overflow: hidden; }
.chirp-pr-hero__background-crop { width: 105%; height: 102.93%; max-width: none; margin-left: -2.5%; }
.chirp-pr-hero__title { display: flex; flex-direction: column; align-items: flex-end; gap: 1px; }
.chirp-pr-hero__wordmark { position: relative; width: 100%; height: var(--name-height); flex: none; }
.chirp-pr-hero__name, .chirp-pr-hero__logo { position: absolute; display: block; max-width: none; transform: scale(var(--svg-scale)); transform-origin: top left; user-select: none; pointer-events: none; }
.chirp-pr-hero__name { left: 0; top: 0; }
.chirp-pr-hero__logo { left: var(--logo-x); top: var(--logo-y); }
.chirp-pr-hero__copy { display: flex; flex-direction: column; align-items: flex-start; gap: var(--space-3); width: var(--copy-width); }
.chirp-pr-hero__heading { margin: 0; width: 100%; color: var(--accent-aubergine); font-family: var(--text-font-sans); font-size: var(--title-size); font-weight: 500; line-height: 1.25; letter-spacing: .01em; text-align: right; white-space: nowrap; text-shadow: 2.276px 4.552px 15.054px rgb(44 31 57 / .1); font-variation-settings: "wght" 500, "GRAD" 0, "XOPQ" 96, "XTRA" 468, "YOPQ" 25, "YTAS" 750, "YTDE" -203, "YTFI" 738, "YTLC" 514, "YTUC" 712, "wdth" 100; }
@media (prefers-reduced-motion: reduce) { .chirp-pr-hero__layer { will-change: auto; } }
</style>
