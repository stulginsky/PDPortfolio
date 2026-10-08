<script setup lang="ts">
import { computed, inject, onMounted, onUnmounted, ref } from 'vue'
import DsBadge from './DsBadge.vue'
import { useChirpCardPresentation } from './chirp-card-presentation'
import TypoText from './TypoText.vue'
import cards from '../../content/home-cards.json'
import ChirpAiDesignSystemScene from './ChirpAiDesignSystemScene.vue'
import { designSystemGeometry } from './chirp-ai-design-system.geometry'
import { createDesignSystemSceneDraft, getDesignSystemSceneProfile, designSystemSceneEditorKey, designSystemLayerNames, designSystemLayerXShift } from './chirp-ai-design-system.scene-context'

const props = withDefaults(defineProps<{
  title?: string
  subtitle?: string
  badges?: string[]
  href?: string
}>(), {
  title: cards[3]!.title,
  subtitle: cards[3]!.subtitle,
  badges: () => cards[3]!.badges.split(',').map(x => x.trim()),
  href: cards[3]!.href,
})
const root = ref<HTMLElement>()
const copy = ref<HTMLElement>()
const presentation = useChirpCardPresentation('ChirpAiDesignSystem')
const breakpoint = ref<'base' | 'min-768'>('base')
const width = ref(264)
const viewportWidth = ref(320)
const copyHeight = ref(0)
const hovered = ref(false)
const pressed = ref(false)
const keyboardPressed = ref(false)
const sceneEditor = inject(designSystemSceneEditorKey, undefined)
const defaultScenes = createDesignSystemSceneDraft()
const state = computed(() => sceneEditor && sceneEditor.mode.value !== 'Interaction' ? sceneEditor.mode.value : pressed.value || keyboardPressed.value ? 'ActivePressed' : hovered.value ? 'Hover' : 'Default')
const referenceWidth = computed(() => breakpoint.value === 'base' ? 264 : 430)
const scale = computed(() => 1)
const geometry = computed(() => designSystemGeometry[breakpoint.value][state.value])
// Artwork-only cover for wide base cards; copy and editor coordinates stay unscaled.
const pressedSourceLeft = designSystemGeometry.base.ActivePressed.layers.find(layer => layer.name === 'ColorBrand')!.x
const pressedSourceRightLayer = designSystemGeometry.base.ActivePressed.layers.find(layer => layer.name === 'Button')!
const pressedSourceRight = pressedSourceRightLayer.x + pressedSourceRightLayer.width
const artLayout = computed(() => {
  const wideBase = breakpoint.value === 'base' && width.value > designSystemGeometry.base.Default.pict.width
  const fillScale = breakpoint.value === 'base' ? Math.max(1, width.value / designSystemGeometry.base.Default.pict.width) : 1
  const fillLeft = geometry.value.pict.x + (width.value - referenceWidth.value) / 2 - geometry.value.pict.width * (fillScale - 1) / 2
  if (!wideBase || state.value !== 'ActivePressed') return { scale: fillScale, left: fillLeft }
  const leftGap = fillLeft + pressedSourceLeft * fillScale
  const rightGap = width.value - (fillLeft + pressedSourceRight * fillScale)
  const scale = (width.value - (leftGap + rightGap) / 3) / (pressedSourceRight - pressedSourceLeft)
  return { scale, left: leftGap / 3 - pressedSourceLeft * scale }
})
const artScale = computed(() => artLayout.value.scale)
const height = computed(() => presentation.context?.height.value ?? (viewportWidth.value >= 462 ? 532 : 500))
const positionedLayers = computed(() => geometry.value.layers.map(layer => {
  const index = designSystemLayerNames.indexOf(layer.name)
  const draft = (sceneEditor?.draft ?? defaultScenes)[getDesignSystemSceneProfile(viewportWidth.value)][state.value][index]
  const position = draft ? {
    ...draft,
    x: draft.x + designSystemLayerXShift(layer.name, width.value) - geometry.value.pict.x - (width.value - referenceWidth.value) / 2,
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
const artLeft = computed(() => artLayout.value.left)
const artTransform = computed(() => `rotate(${-geometry.value.pict.rotation}deg) scale(${artScale.value})`)
const pictStyle = computed(() => ({ ...rectStyle(geometry.value.pict), left: artLeft.value + 'px', transform: artTransform.value }))
const credStyle = computed(() => ({ ...rectStyle(geometry.value.cred), width: width.value + 'px', top: height.value - geometry.value.cred.height * scale.value + 'px' }))
const blurSceneStyle = computed(() => ({ ...rectStyle(geometry.value.pict), left: artLeft.value - geometry.value.blur.x + 'px', top: (geometry.value.pict.y - (height.value - geometry.value.cred.height * scale.value) / scale.value - geometry.value.blur.y) * scale.value + 'px', transform: artTransform.value }))
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
  <a ref="root" class="chirp-ds-card" :href="props.href" :style="rootStyle" :data-state="state" :data-breakpoint="breakpoint" :data-presentation="presentation.context ? 'related-cases' : undefined"
    @pointerenter="enter" @pointerleave="leave" @pointerdown="down" @pointerup="release" @pointercancel="release"
    @keydown.enter="keyboardPressed = true" @keyup.enter="release" @blur="release" @dragstart.prevent>
    <div class="chirp-ds-card__pict" :style="pictStyle" aria-hidden="true">
      <ChirpAiDesignSystemScene :layers="positionedLayers" :breakpoint="breakpoint" :state="state" />
    </div>
    <div class="chirp-ds-card__cred" :style="credStyle">
      <div class="chirp-ds-card__blur" :style="{ ...rectStyle(geometry.blur), width: width + 'px' }" aria-hidden="true">
        <div class="chirp-ds-card__blur-scene" :style="blurSceneStyle">
          <ChirpAiDesignSystemScene :layers="positionedLayers" :breakpoint="breakpoint" :state="state" />
        </div>
      </div>
      <div class="chirp-ds-card__gradient chirp-ds-card__gradient--default" />
      <div class="chirp-ds-card__gradient chirp-ds-card__gradient--emphasis" />
      <div ref="copy" class="chirp-ds-card__copy">
        <div class="chirp-ds-card__title-block">
          <TypoText tag="h2" class="chirp-ds-card__title" :content="props.title" />
          <TypoText tag="p" class="chirp-ds-card__subtitle" :content="props.subtitle" />
        </div>
        <ul class="chirp-ds-card__badges" aria-label="Специализации">
          <li v-for="badge in props.badges" :key="badge"><DsBadge :label="badge" :type="!presentation.context && viewportWidth < 410 ? 'CardCompact' : 'Card'" /></li>
        </ul>
      </div>
    </div>
  </a>
</template>

<style scoped>
.chirp-ds-card { position: relative; display: block; isolation: isolate; overflow: hidden; width: 100%; max-width: 430px; border-radius: 20px; background: var(--decorative-showcase-chirp-ai-design-system-background-underlay); color: var(--text-inverse); font-family: var(--text-font-sans); text-decoration: none; }
.chirp-ds-card__pict, .chirp-ds-card__cred, .chirp-ds-card__blur, .chirp-ds-card__blur-scene { position: absolute; transform-origin: 0 0; transition: left var(--card-duration) ease-out, top var(--card-duration) ease-out, width var(--card-duration) ease-out, height var(--card-duration) ease-out, transform var(--card-duration) ease-out; }
.chirp-ds-card__pict { z-index: 1; pointer-events: none; overflow: visible; }
.chirp-ds-card__cred { z-index: 2; pointer-events: none; }
.chirp-ds-card__gradient { position: absolute; inset: 0; transition: opacity var(--card-duration) ease-out; }
.chirp-ds-card__gradient--default { background: linear-gradient(180deg, transparent 19.2307696%, rgb(0 0 0 / 60%) 75%, rgb(0 0 0 / 65%) 100%); }
.chirp-ds-card__gradient--emphasis { opacity: 0; background: linear-gradient(180deg, transparent 19.2307696%, rgb(0 0 0 / 60%) 75%, rgb(0 0 0 / 65%) 100%); }
.chirp-ds-card:not([data-state='Default']) .chirp-ds-card__gradient--default { opacity: 0; }
.chirp-ds-card:not([data-state='Default']) .chirp-ds-card__gradient--emphasis { opacity: 1; }
.chirp-ds-card__blur { overflow: hidden; mask-image: linear-gradient(to bottom, transparent, black); }
.chirp-ds-card__blur-scene { filter: blur(calc(25px * var(--card-scale))); overflow: visible; }
.chirp-ds-card__copy { position: absolute; bottom: max(13.333px, calc(13.333px * var(--card-scale))); left: max(13.333px, calc(13.333px * var(--card-scale))); right: max(13.333px, calc(13.333px * var(--card-scale))); display: flex; flex-direction: column; gap: max(10px, calc(10px * var(--card-scale))); }
.chirp-ds-card__title-block { display: flex; flex-direction: column; gap: max(3.333px, calc(3.333px * var(--card-scale))); }
.chirp-ds-card__title, .chirp-ds-card__subtitle { margin: 0; font-weight: var(--text-weight-semibold); font-variation-settings: var(--font-variation-heading-md); }
.chirp-ds-card__title { font-size: max(var(--text-size-card-title-min), calc(18.333333px * var(--card-scale))); line-height: 1.3; letter-spacing: .03em; }
.chirp-ds-card__subtitle { font-size: max(var(--text-size-card-description-min), calc(13.333333px * var(--card-scale))); line-height: 1.5; white-space: pre-line; }
.chirp-ds-card__badges { display: flex; flex-wrap: wrap; gap: 6.667px; margin: 0; padding: 0; list-style: none; width: 100%; max-width: 100%; }
.chirp-ds-card__badges li { display: flex; }
.chirp-ds-card:focus-visible { outline: 2px solid var(--border-focus); outline-offset: 3px; }
@media (min-width: 410px) {
  .chirp-ds-card__title { font-size: 22px; }
}
@media (min-width: 768px) {
  .chirp-ds-card__pict, .chirp-ds-card__blur-scene { overflow: hidden; }
  .chirp-ds-card { max-width: 430px; border-radius: var(--radius-xlg); }
  .chirp-ds-card__blur-scene { filter: blur(calc(30px * var(--card-scale))); }
  .chirp-ds-card__copy { bottom: max(13.333px, calc(16px * var(--card-scale))); left: max(13.333px, calc(16px * var(--card-scale))); right: max(13.333px, calc(16px * var(--card-scale))); gap: max(10px, calc(12px * var(--card-scale))); }
  .chirp-ds-card__title-block { gap: max(3.333px, calc(4px * var(--card-scale))); }
  .chirp-ds-card__title { font-size: max(var(--text-size-card-title-min), calc(22px * var(--card-scale))); }
  .chirp-ds-card__subtitle { font-size: max(var(--text-size-card-description-min), calc(16px * var(--card-scale))); }
  .chirp-ds-card__badges { gap: 8px; }
}
.chirp-ds-card[data-breakpoint='min-768']:not([data-state='Default']) { background: linear-gradient(var(--decorative-showcase-chirp-ai-design-system-background-underlay), var(--decorative-showcase-chirp-ai-design-system-background-underlay)), var(--decorative-showcase-chirp-ai-design-system-background); }
@media (prefers-reduced-motion: reduce) { .chirp-ds-card * { transition: none; } }
</style>
