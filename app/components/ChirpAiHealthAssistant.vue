<script setup lang="ts">
import { computed, inject, onMounted, onUnmounted, ref } from 'vue'
import DsBadge from './DsBadge.vue'
import { useChirpCardPresentation } from './chirp-card-presentation'
import TypoText from './TypoText.vue'
import cards from '../../content/home-cards.json'
import { getHealthGeometry } from './chirp-ai-health-assistant.geometry'
import { getHealthSceneProfile, healthSceneEditorKey } from './chirp-ai-health-assistant.scene-context'

const props = withDefaults(defineProps<{
  title?: string
  subtitle?: string
  badges?: string[]
  href?: string
}>(), {
  title: cards[0]!.title,
  subtitle: cards[0]!.subtitle,
  badges: () => cards[0]!.badges.split(',').map(x => x.trim()),
  href: cards[0]!.href,
})
const root = ref<HTMLElement>()
const copy = ref<HTMLElement>()
const presentation = useChirpCardPresentation('ChirpAiHealthAssistant')
const breakpoint = ref<'base' | 'min-768'>('base')
const width = ref(264)
const viewportWidth = ref(320)
const copyHeight = ref(0)
const hovered = ref(false)
const pressed = ref(false)
const keyboardPressed = ref(false)
const sceneEditor = inject(healthSceneEditorKey, undefined)
const state = computed(() => sceneEditor && sceneEditor.mode.value !== 'Interaction' ? sceneEditor.mode.value : pressed.value || keyboardPressed.value ? 'ActivePressed' : hovered.value ? 'Hover' : 'Default')
const referenceWidth = computed(() => breakpoint.value === 'base' ? 264 : 430)
const scale = computed(() => 1)
const geometry = computed(() => getHealthGeometry(breakpoint.value, state.value, viewportWidth.value))
function phoneStyle(index: number) {
  const draft = sceneEditor?.draft[getHealthSceneProfile(viewportWidth.value)][state.value][index]
  if (!draft) return rectStyle(geometry.value.phones[index]!)
  return rectStyle({ ...draft, x: draft.x + (width.value - 430) / 2 - geometry.value.pict.x - (width.value - referenceWidth.value) / 2, y: draft.y - geometry.value.pict.y })
}
const height = computed(() => presentation.context?.height.value ?? (viewportWidth.value >= 462 ? 532 : 500))
const sources = [
  '/cases/chirp-ai-health-assistant/layers/phone-profile@2x.png',
  '/cases/chirp-ai-health-assistant/layers/phone-diagnosis@2x.png',
  '/cases/chirp-ai-health-assistant/layers/phone-treatment@2x.png',
]
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
  <a ref="root" class="chirp-health" :href="props.href" :style="rootStyle" :data-state="state" :data-breakpoint="breakpoint" :data-presentation="presentation.context ? 'related-cases' : undefined"
    @pointerenter="enter" @pointerleave="leave" @pointerdown="down" @pointerup="release" @pointercancel="release"
    @keydown.enter="keyboardPressed = true" @keyup.enter="release" @blur="release" @dragstart.prevent>
    <div class="chirp-health__pict" :style="pictStyle" aria-hidden="true">
      <img v-for="(src, i) in sources" :key="src" class="chirp-health__phone" :src="src" :style="phoneStyle(i)" alt="" draggable="false" />
    </div>
    <div class="chirp-health__cred" :style="credStyle">
      <div class="chirp-health__blur" :style="{ ...rectStyle(geometry.blur), width: width + 'px' }" aria-hidden="true">
        <div class="chirp-health__blur-scene" :style="blurSceneStyle">
          <img v-for="(src, i) in sources" :key="src" class="chirp-health__phone" :src="src" :style="phoneStyle(i)" alt="" draggable="false" />
        </div>
      </div>
      <div class="chirp-health__gradient chirp-health__gradient--default" />
      <div class="chirp-health__gradient chirp-health__gradient--emphasis" />
      <div ref="copy" class="chirp-health__copy">
        <div class="chirp-health__title-block">
          <TypoText tag="h2" class="chirp-health__title" :content="props.title" />
          <TypoText tag="p" class="chirp-health__subtitle" :content="props.subtitle" />
        </div>
        <ul class="chirp-health__badges" aria-label="Специализации">
          <li v-for="badge in props.badges" :key="badge"><DsBadge :label="badge" :type="!presentation.context && viewportWidth < 410 ? 'CardCompact' : 'Card'" /></li>
        </ul>
      </div>
    </div>
  </a>
</template>

<style scoped>
.chirp-health { position: relative; display: block; isolation: isolate; overflow: hidden; width: 100%; max-width: 430px; border-radius: 20px; background: var(--decorative-showcase-chirp-ai-health-assistant-background); color: var(--text-inverse); font-family: var(--text-font-sans); text-decoration: none; }
.chirp-health__pict, .chirp-health__phone, .chirp-health__cred, .chirp-health__blur, .chirp-health__blur-scene { position: absolute; transform-origin: 0 0; transition: left var(--card-duration) ease-out, top var(--card-duration) ease-out, width var(--card-duration) ease-out, height var(--card-duration) ease-out, transform var(--card-duration) ease-out; }
.chirp-health__pict { z-index: 1; pointer-events: none; }
.chirp-health__phone { max-width: none; object-fit: cover; user-select: none; }
.chirp-health__cred { z-index: 2; pointer-events: none; }
.chirp-health__gradient { position: absolute; inset: 0; transition: opacity var(--card-duration) ease-out; }
.chirp-health__gradient--default { background: linear-gradient(180deg, transparent 19.2307696%, rgb(0 0 0 / 60%) 75%, rgb(0 0 0 / 65%) 100%); }
.chirp-health__gradient--emphasis { opacity: 0; background: linear-gradient(180deg, transparent 19.2307696%, rgb(0 0 0 / 75%) 75%, rgb(0 0 0 / 80%) 100%); }
.chirp-health:not([data-state='Default']) .chirp-health__gradient--default { opacity: 0; }
.chirp-health:not([data-state='Default']) .chirp-health__gradient--emphasis { opacity: 1; }
.chirp-health__blur { overflow: hidden; mask-image: linear-gradient(to bottom, transparent, black); }
.chirp-health__blur-scene { filter: blur(calc(25px * var(--card-scale))); }
.chirp-health__copy { position: absolute; bottom: max(13.333px, calc(13.333px * var(--card-scale))); left: max(13.333px, calc(13.333px * var(--card-scale))); right: max(13.333px, calc(13.333px * var(--card-scale))); display: flex; flex-direction: column; gap: max(10px, calc(10px * var(--card-scale))); }
.chirp-health__title-block { display: flex; flex-direction: column; gap: max(3.333px, calc(3.333px * var(--card-scale))); }
.chirp-health__title, .chirp-health__subtitle { margin: 0; font-weight: var(--text-weight-semibold); font-variation-settings: var(--font-variation-heading-md); }
.chirp-health__title { font-size: max(var(--text-size-card-title-min), calc(18.333333px * var(--card-scale))); line-height: 1.3; letter-spacing: .03em; }
.chirp-health__subtitle { font-size: max(var(--text-size-card-description-min), calc(13.333333px * var(--card-scale))); line-height: 1.5; white-space: pre-line; }
.chirp-health__badges { display: flex; flex-wrap: wrap; gap: 6.667px; margin: 0; padding: 0; list-style: none; width: 100%; max-width: 100%; }
.chirp-health__badges li { display: flex; }
.chirp-health:focus-visible { outline: 2px solid var(--border-focus); outline-offset: 3px; }
@media (min-width: 410px) {
  .chirp-health__title { font-size: 22px; }
}
@media (min-width: 768px) {
  .chirp-health { max-width: 430px; border-radius: var(--radius-xlg); }
  .chirp-health__blur-scene { filter: blur(calc(30px * var(--card-scale))); }
  .chirp-health__copy { bottom: max(13.333px, calc(16px * var(--card-scale))); left: max(13.333px, calc(16px * var(--card-scale))); right: max(13.333px, calc(16px * var(--card-scale))); gap: max(10px, calc(12px * var(--card-scale))); }
  .chirp-health__title-block { gap: max(3.333px, calc(4px * var(--card-scale))); }
  .chirp-health__title { font-size: max(var(--text-size-card-title-min), calc(22px * var(--card-scale))); }
  .chirp-health__subtitle { font-size: max(var(--text-size-card-description-min), calc(16px * var(--card-scale))); }
  .chirp-health__badges { gap: 8px; }
}
@media (prefers-reduced-motion: reduce) { .chirp-health * { transition: none; } }
</style>
