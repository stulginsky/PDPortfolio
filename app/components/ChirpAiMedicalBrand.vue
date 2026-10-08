<script setup lang="ts">
import { computed, inject, onMounted, onUnmounted, ref } from 'vue'
import DsBadge from './DsBadge.vue'
import { useChirpCardPresentation } from './chirp-card-presentation'
import TypoText from './TypoText.vue'
import cards from '../../content/home-cards.json'
import ChirpAiMedicalBrandScene from './ChirpAiMedicalBrandScene.vue'
import { brandGeometry } from './chirp-ai-medical-brand.geometry'
import { createBrandSceneDraft, getBrandSceneProfile, brandSceneEditorKey, brandLayerNames, brandLayerXShift } from './chirp-ai-medical-brand.scene-context'

const props = withDefaults(defineProps<{
  title?: string
  subtitle?: string
  badges?: string[]
  href?: string
}>(), {
  title: cards[2]!.title,
  subtitle: cards[2]!.subtitle,
  badges: () => cards[2]!.badges.split(',').map(x => x.trim()),
  href: cards[2]!.href,
})
const root = ref<HTMLElement>()
const copy = ref<HTMLElement>()
const presentation = useChirpCardPresentation('ChirpAiMedicalBrand')
const breakpoint = ref<'base' | 'min-768'>('base')
const width = ref(264)
const viewportWidth = ref(320)
const copyHeight = ref(0)
const hovered = ref(false)
const pressed = ref(false)
const keyboardPressed = ref(false)
const sceneEditor = inject(brandSceneEditorKey, undefined)
const defaultScenes = createBrandSceneDraft()
const state = computed(() => sceneEditor && sceneEditor.mode.value !== 'Interaction' ? sceneEditor.mode.value : pressed.value || keyboardPressed.value ? 'ActivePressed' : hovered.value ? 'Hover' : 'Default')
const referenceWidth = computed(() => breakpoint.value === 'base' ? 264 : 430)
const scale = computed(() => 1)
const geometry = computed(() => brandGeometry[breakpoint.value][state.value])
const height = computed(() => presentation.context?.height.value ?? (viewportWidth.value >= 462 ? 532 : 500))
const positionedLayers = computed(() => geometry.value.layers.map(layer => {
  const index = brandLayerNames.indexOf(layer.name)
  const draft = (sceneEditor?.draft ?? defaultScenes)[getBrandSceneProfile(viewportWidth.value)][state.value][index]
  const position = draft ? {
    ...draft,
    x: draft.x + brandLayerXShift(layer.name, width.value) - geometry.value.pict.x - (width.value - referenceWidth.value) / 2,
    y: draft.y - geometry.value.pict.y,
  } : layer
  return { ...layer, position }
}))
function rectStyle(rect: { x: number; y: number; width: number; height: number; rotation: number }) {
  return { left: rect.x * scale.value + 'px', top: rect.y * scale.value + 'px', width: rect.width * scale.value + 'px', height: rect.height * scale.value + 'px', transform: `rotate(${-rect.rotation}deg)` }
}
const rootStyle = computed(() => ({
  height: height.value + 'px',
  '--card-scale': scale.value,
  '--chirp-copy-zoom': presentation.copyZoom.value,
  '--card-duration': state.value === 'ActivePressed' ? '150ms' : '300ms',
}))
const pictStyle = computed(() => ({ ...rectStyle(geometry.value.pict), left: geometry.value.pict.x + (width.value - referenceWidth.value) / 2 + 'px' }))
const credStyle = computed(() => ({ ...rectStyle(geometry.value.cred), width: width.value + 'px', top: height.value - geometry.value.cred.height * scale.value + 'px' }))
const blurSceneStyle = computed(() => ({ ...rectStyle(geometry.value.pict), left: geometry.value.pict.x - geometry.value.blur.x + (width.value - referenceWidth.value) / 2 + 'px', top: (geometry.value.pict.y - (height.value - geometry.value.cred.height * scale.value) / scale.value - geometry.value.blur.y) * scale.value + 'px' }))
function canHover(e: PointerEvent) { return e.pointerType === 'mouse' && window.matchMedia('(hover: hover)').matches }
function enter(e: PointerEvent) { if (canHover(e)) hovered.value = true }
function leave() { hovered.value = false; pressed.value = false }
function down(e: PointerEvent) { if (e.button === 0) pressed.value = true }
function release() { pressed.value = false; keyboardPressed.value = false }
let observer: ResizeObserver | undefined
let frame = 0
function scheduleSync() {
  cancelAnimationFrame(frame)
  frame = requestAnimationFrame(sync)
}
function sync() {
  viewportWidth.value = window.innerWidth
  breakpoint.value = window.innerWidth >= 768 ? 'min-768' : 'base'
  width.value = root.value?.clientWidth || referenceWidth.value
  copyHeight.value = copy.value?.getBoundingClientRect().height || 0
  presentation.reportCopyHeight(copyHeight.value)
}
onMounted(() => {
  sync()
  observer = new ResizeObserver(scheduleSync)
  if (root.value) observer.observe(root.value)
  if (copy.value) observer.observe(copy.value)
  window.addEventListener('resize', sync)
  window.addEventListener('pointerup', release)
  window.addEventListener('pointercancel', release)
  window.addEventListener('blur', leave)
})
onUnmounted(() => {
  observer?.disconnect()
  cancelAnimationFrame(frame)
  window.removeEventListener('resize', sync)
  window.removeEventListener('pointerup', release)
  window.removeEventListener('pointercancel', release)
  window.removeEventListener('blur', leave)
})
</script>

<template>
  <a ref="root" class="chirp-brand" :href="props.href" :style="rootStyle" :data-state="state" :data-breakpoint="breakpoint" :data-presentation="presentation.context ? 'related-cases' : undefined"
    @pointerenter="enter" @pointerleave="leave" @pointerdown="down" @pointerup="release" @pointercancel="release"
    @keydown.enter="keyboardPressed = true" @keyup.enter="release" @blur="release" @dragstart.prevent>
    <div class="chirp-brand__pict" :style="pictStyle" aria-hidden="true">
      <ChirpAiMedicalBrandScene :layers="positionedLayers" :breakpoint="breakpoint" :state="state" />
    </div>
    <div class="chirp-brand__cred" :style="credStyle">
      <div class="chirp-brand__blur" :style="{ ...rectStyle(geometry.blur), width: width + 'px' }" aria-hidden="true">
        <div class="chirp-brand__blur-scene" :style="blurSceneStyle">
          <ChirpAiMedicalBrandScene :layers="positionedLayers" :breakpoint="breakpoint" :state="state" />
        </div>
      </div>
      <div class="chirp-brand__gradient chirp-brand__gradient--default" />
      <div class="chirp-brand__gradient chirp-brand__gradient--emphasis" />
      <div ref="copy" class="chirp-brand__copy">
        <div class="chirp-brand__title-block">
          <TypoText tag="h2" class="chirp-brand__title" :content="props.title" />
          <TypoText tag="p" class="chirp-brand__subtitle" :content="props.subtitle" />
        </div>
        <ul class="chirp-brand__badges" aria-label="Специализации">
          <li v-for="badge in props.badges" :key="badge"><DsBadge :label="badge" :type="!presentation.context && viewportWidth < 410 ? 'CardCompact' : 'Card'" /></li>
        </ul>
      </div>
    </div>
  </a>
</template>

<style scoped>
.chirp-brand { position: relative; display: block; isolation: isolate; overflow: hidden; width: 100%; max-width: 430px; border-radius: 20px; background: var(--decorative-showcase-chirp-ai-medical-brand-background); color: var(--text-inverse); font-family: var(--text-font-sans); text-decoration: none; }
.chirp-brand__pict, .chirp-brand__cred, .chirp-brand__blur, .chirp-brand__blur-scene { position: absolute; transform-origin: 0 0; transition: left var(--card-duration) ease-out, top var(--card-duration) ease-out, width var(--card-duration) ease-out, height var(--card-duration) ease-out, transform var(--card-duration) ease-out; }
.chirp-brand__pict { z-index: 1; pointer-events: none; overflow: visible; }
.chirp-brand__cred { z-index: 2; pointer-events: none; }
.chirp-brand__gradient { position: absolute; inset: 0; transition: opacity var(--card-duration) ease-out; }
.chirp-brand__gradient--default { background: linear-gradient(180deg, transparent 19.2307696%, rgb(0 0 0 / 60%) 75%, rgb(0 0 0 / 65%) 100%); }
.chirp-brand__gradient--emphasis { opacity: 0; background: linear-gradient(180deg, transparent 19.2307696%, rgb(0 0 0 / 75%) 75%, rgb(0 0 0 / 80%) 100%); }
.chirp-brand:not([data-state='Default']) .chirp-brand__gradient--default { opacity: 0; }
.chirp-brand:not([data-state='Default']) .chirp-brand__gradient--emphasis { opacity: 1; }
.chirp-brand__blur { overflow: hidden; mask-image: linear-gradient(to bottom, transparent, black); }
.chirp-brand__blur-scene { filter: blur(calc(25px * var(--card-scale))); overflow: visible; }
.chirp-brand__copy { position: absolute; bottom: max(13.333px, calc(13.333px * var(--card-scale))); left: max(13.333px, calc(13.333px * var(--card-scale))); right: max(13.333px, calc(13.333px * var(--card-scale))); display: flex; flex-direction: column; gap: max(10px, calc(10px * var(--card-scale))); }
.chirp-brand__title-block { display: flex; flex-direction: column; gap: max(3.333px, calc(3.333px * var(--card-scale))); }
.chirp-brand__title, .chirp-brand__subtitle { margin: 0; font-weight: var(--text-weight-semibold); font-variation-settings: var(--font-variation-heading-md); }
.chirp-brand__title { font-size: max(var(--text-size-card-title-min), calc(18.333333px * var(--card-scale))); line-height: 1.3; letter-spacing: .03em; }
.chirp-brand__subtitle { font-size: max(var(--text-size-card-description-min), calc(13.333333px * var(--card-scale))); line-height: 1.5; white-space: pre-line; }
.chirp-brand__badges { display: flex; flex-wrap: wrap; gap: 6.667px; margin: 0; padding: 0; list-style: none; width: 100%; max-width: 100%; }
.chirp-brand__badges li { display: flex; }
.chirp-brand:focus-visible { outline: 2px solid var(--border-focus); outline-offset: 3px; }
@media (min-width: 410px) {
  .chirp-brand__title { font-size: 22px; }
}
@media (min-width: 768px) {
  .chirp-brand__pict, .chirp-brand__blur-scene { overflow: hidden; }
  .chirp-brand { max-width: 430px; border-radius: var(--radius-xlg); }
  .chirp-brand__blur-scene { filter: blur(calc(30px * var(--card-scale))); }
  .chirp-brand__copy { bottom: max(13.333px, calc(16px * var(--card-scale))); left: max(13.333px, calc(16px * var(--card-scale))); right: max(13.333px, calc(16px * var(--card-scale))); gap: max(10px, calc(12px * var(--card-scale))); }
  .chirp-brand__title-block { gap: max(3.333px, calc(4px * var(--card-scale))); }
  .chirp-brand__title { font-size: max(var(--text-size-card-title-min), calc(22px * var(--card-scale))); }
  .chirp-brand__subtitle { font-size: max(var(--text-size-card-description-min), calc(16px * var(--card-scale))); }
  .chirp-brand__badges { gap: 8px; }
}
@media (prefers-reduced-motion: reduce) { .chirp-brand * { transition: none; } }
</style>
