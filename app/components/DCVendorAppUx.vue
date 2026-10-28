<script setup lang="ts">
import { computed, inject, onActivated, onDeactivated, onMounted, onUnmounted, ref } from 'vue'
import { vMediaReady } from './media-readiness'
import { vLayeredScene } from './layered-scene-readiness'
import LayeredSceneFallback from './LayeredSceneFallback.vue'
import { cardInitialStyle } from './chirp-card-initial'
import DsBadge from './DsBadge.vue'
import TypoText from './TypoText.vue'
import content from '../../content/cases/dc-vendor-app-ux.json'
import DCVendorAppUxScene from './DCVendorAppUxScene.vue'
import { vendorUxGeometry } from './dc-vendor-app-ux.geometry'
import { createVendorUxSceneDraft, getVendorUxSceneProfile, vendorUxSceneEditorKey, vendorUxLayerNames, vendorUxLayerXShift } from './dc-vendor-app-ux.scene-context'

const props = withDefaults(defineProps<{
  title?: string
  subtitle?: string
  badges?: string[]
  href?: string
}>(), {
  title: content.card.title,
  subtitle: content.card.subtitle,
  href: '#',
})
const root = ref<HTMLElement>()
const copy = ref<HTMLElement>()
function setCopy(el: unknown) { copy.value = (el as HTMLElement | null) ?? undefined }
const breakpoint = ref<'base' | 'min-768'>('base')
const width = ref(264)
const viewportWidth = ref(320)
const ready = ref(false)
let readyFrame = 0
const copyHeight = ref(0)
const hovered = ref(false)
const pressed = ref(false)
const keyboardPressed = ref(false)
const sceneEditor = inject(vendorUxSceneEditorKey, undefined)
const defaultScenes = createVendorUxSceneDraft()
const state = computed(() => sceneEditor && sceneEditor.mode.value !== 'Interaction' ? sceneEditor.mode.value : pressed.value || keyboardPressed.value ? 'ActivePressed' : hovered.value ? 'Hover' : 'Default')
const referenceWidth = computed(() => breakpoint.value === 'base' ? 264 : 430)
const scale = computed(() => 1)
const geometry = computed(() => vendorUxGeometry[breakpoint.value][state.value])
const height = computed(() => viewportWidth.value >= 462 ? 532 : 500)
const positionedLayers = computed(() => vendorUxGeometry[getVendorUxSceneProfile(viewportWidth.value)][state.value].layers.map(layer => {
  const index = vendorUxLayerNames.indexOf(layer.name)
  const draft = (sceneEditor?.draft ?? defaultScenes)[getVendorUxSceneProfile(viewportWidth.value)][state.value][index]
  const position = draft ? {
    ...draft,
    x: draft.x + vendorUxLayerXShift(layer.name, width.value) - geometry.value.pict.x - (width.value - referenceWidth.value) / 2,
    y: draft.y - geometry.value.pict.y,
  } : layer
  return { ...layer, position }
}))

const initialStyle = cardInitialStyle({base:vendorUxGeometry.base.Default,wide:vendorUxGeometry.base.Default,web:vendorUxGeometry['min-768'].Default})
const initialProfiles=['base','min-768'] as const
function initialLayers(profile:typeof initialProfiles[number], artworkProfile=profile){
 const geometry=vendorUxGeometry[profile].Default,reference=profile==='base'?264:430
 return vendorUxGeometry[artworkProfile].Default.layers.map(layer=>{
  const draft=defaultScenes[artworkProfile].Default[vendorUxLayerNames.indexOf(layer.name)]!
  return {...layer,position:{...draft,x:draft.x+vendorUxLayerXShift(layer.name,reference)-geometry.pict.x,y:draft.y-geometry.pict.y}}
 })
}


function rectStyle(rect: { x: number; y: number; width: number; height: number; rotation: number }) {
  return { left: rect.x * scale.value + 'px', top: rect.y * scale.value + 'px', width: rect.width * scale.value + 'px', height: rect.height * scale.value + 'px', transform: `rotate(${-rect.rotation}deg)` }
}
const rootStyle = computed(() => ({
  height: height.value + 'px',
  '--card-scale': scale.value,
  '--card-duration': state.value === 'ActivePressed' ? '150ms' : '300ms',
}))
const pictStyle = computed(() => ({ ...rectStyle(geometry.value.pict), left: geometry.value.pict.x + (width.value - referenceWidth.value) / 2 + 'px' }))
const credStyle = computed(() => ({ ...rectStyle(geometry.value.cred), width: '100%', top: height.value - geometry.value.cred.height * scale.value + 'px' }))
const blurSceneStyle = computed(() => ({ ...rectStyle(geometry.value.pict), left: geometry.value.pict.x - geometry.value.blur.x + (width.value - referenceWidth.value) / 2 + 'px', top: (geometry.value.pict.y - (height.value - geometry.value.cred.height * scale.value) / scale.value - geometry.value.blur.y) * scale.value + 'px' }))
function canHover(e: PointerEvent) { return e.pointerType === 'mouse' && window.matchMedia('(hover: hover)').matches }
function enter(e: PointerEvent) { if (canHover(e)) hovered.value = true }
function leave() { hovered.value = false; release() }
function down(e: PointerEvent) { if (e.button === 0) pressed.value = true }
function release() { pressed.value = false; keyboardPressed.value = false }
function cancel() { hovered.value = false; release() }
let observer: ResizeObserver | undefined
let frame = 0
function scheduleSync() {
  cancelAnimationFrame(frame)
  frame = requestAnimationFrame(sync)
}
function sync() {
  if (!root.value?.isConnected) return
  viewportWidth.value = window.innerWidth
  breakpoint.value = window.innerWidth >= 768 ? 'min-768' : 'base'
  width.value = root.value?.clientWidth || referenceWidth.value
  copyHeight.value = copy.value?.getBoundingClientRect().height || 0
}
onActivated(sync)
onDeactivated(() => { leave(); release() })
onMounted(() => {
  sync()
  // First settle measured geometry without animating from initial reference values.
  readyFrame = requestAnimationFrame(() => {
    readyFrame = requestAnimationFrame(() => { ready.value = true })
  })
  observer = new ResizeObserver(scheduleSync)
  if (root.value) observer.observe(root.value)
  if (copy.value) observer.observe(copy.value)
  window.addEventListener('resize', sync)
  window.addEventListener('pointerup', release)
  window.addEventListener('pointercancel', cancel)
  window.addEventListener('blur', leave)
})
onUnmounted(() => {
  cancelAnimationFrame(readyFrame)
  observer?.disconnect()
  cancelAnimationFrame(frame)
  window.removeEventListener('resize', sync)
  window.removeEventListener('pointerup', release)
  window.removeEventListener('pointercancel', cancel)
  window.removeEventListener('blur', leave)
})
</script>

<template>
  <a v-media-ready v-layered-scene ref="root" class="dc-vendor-app-ux chirp-card showcase-card" :href="props.href" :style="[initialStyle,rootStyle]" :data-ready="ready" :data-state="state" :data-breakpoint="breakpoint"
    @pointerenter="enter" @pointerleave="leave" @pointerdown="down" @pointerup="release" @pointercancel="cancel"
    @keydown.enter="keyboardPressed = true" @keyup.enter="release" @blur="release" @scene-ready="hovered=false;pressed=false;keyboardPressed=false" @dragstart.prevent>
    <LayeredSceneFallback name="dc-vendor-app-ux" />
    <template v-for="part in (breakpoint === 'base' ? ['pict', 'cred'] : ['cred', 'pict'])" :key="part">
    <div v-if="part === 'pict'" class="dc-vendor-app-ux__pict" :style="pictStyle" aria-hidden="true">
      <DCVendorAppUxScene v-if="ready" :layers="positionedLayers" />
      <template v-else><div v-for="profile in initialProfiles" :key="profile" :class="profile==='base'?'dc-vendor-app-ux__initial-base':'chirp-card__initial-web'"><DCVendorAppUxScene :layers="initialLayers(profile)" /></div><div class="dc-vendor-app-ux__initial-tablet-art"><DCVendorAppUxScene :layers="initialLayers('base', 'min-768')" /></div></template>
    </div>
    <div v-else class="dc-vendor-app-ux__cred" :style="credStyle">
      <div class="dc-vendor-app-ux__blur" :style="{ ...rectStyle(geometry.blur), width: '100%' }" aria-hidden="true">
        <div class="dc-vendor-app-ux__blur-scene" :style="blurSceneStyle">
          <DCVendorAppUxScene v-if="ready" :layers="positionedLayers" />
      <template v-else><div v-for="profile in initialProfiles" :key="profile" :class="profile==='base'?'dc-vendor-app-ux__initial-base':'chirp-card__initial-web'"><DCVendorAppUxScene :layers="initialLayers(profile)" /></div><div class="dc-vendor-app-ux__initial-tablet-art"><DCVendorAppUxScene :layers="initialLayers('base', 'min-768')" /></div></template>
        </div>
      </div>
      <div class="dc-vendor-app-ux__gradient dc-vendor-app-ux__gradient--default" />
      <div class="dc-vendor-app-ux__gradient dc-vendor-app-ux__gradient--emphasis" />
      <div :ref="setCopy" class="dc-vendor-app-ux__copy">
        <div class="dc-vendor-app-ux__title-block">
          <TypoText tag="h2" class="dc-vendor-app-ux__title" :content="props.title" />
          <TypoText tag="p" class="dc-vendor-app-ux__subtitle" :content="props.subtitle" />
        </div>
        <ul v-for="profile in (ready ? [breakpoint] : initialProfiles)" :key="profile" class="dc-vendor-app-ux__badges" :class="!ready ? (profile === 'base' ? 'dc-vendor-app-ux__badges--base' : 'dc-vendor-app-ux__badges--web') : undefined" aria-label="Специализации">
          <li v-for="badge in (props.badges ?? content.card.badges[profile])" :key="badge"><DsBadge v-if="ready" :label="badge" :type="viewportWidth < 410 ? 'CardCompact' : 'Card'" /><template v-else><span class="chirp-card__badge-small"><DsBadge :label="badge" type="CardCompact" /></span><span class="chirp-card__badge-large"><DsBadge :label="badge" type="Card" /></span></template></li>
        </ul>
      </div>
    </div>
    </template>
  </a>
</template>

<style scoped>
.dc-vendor-app-ux[data-ready='false'] * { transition: none !important; }
.dc-vendor-app-ux { position: relative; display: block; isolation: isolate; overflow: hidden; width: 100%; max-width: 430px; border-radius: 20px; background: var(--decorative-showcase-dc-background-brown); color: var(--text-inverse); font-family: var(--text-font-sans); text-decoration: none; }
.dc-vendor-app-ux__pict, .dc-vendor-app-ux__cred, .dc-vendor-app-ux__blur, .dc-vendor-app-ux__blur-scene { position: absolute; transform-origin: 0 0; transition: left var(--card-duration) ease-out, top var(--card-duration) ease-out, width var(--card-duration) ease-out, height var(--card-duration) ease-out, transform var(--card-duration) ease-out; }
.dc-vendor-app-ux__pict { z-index: 1; pointer-events: none; overflow: visible; }
.dc-vendor-app-ux__cred { z-index: 2; pointer-events: none; }
.dc-vendor-app-ux__gradient { position: absolute; inset: 0; transition: opacity var(--card-duration) ease-out; }
.dc-vendor-app-ux__gradient--default { background: linear-gradient(180deg, transparent 19.2307696%, rgb(0 0 0 / 75%) 75%, rgb(0 0 0 / 80%) 100%); }
.dc-vendor-app-ux__gradient--emphasis { opacity: 0; background: linear-gradient(180deg, transparent 19.2307696%, rgb(0 0 0 / 75%) 75%, rgb(0 0 0 / 80%) 100%); }
.dc-vendor-app-ux:not([data-state='Default']) .dc-vendor-app-ux__gradient--default { opacity: 0; }
.dc-vendor-app-ux:not([data-state='Default']) .dc-vendor-app-ux__gradient--emphasis { opacity: 1; }
.dc-vendor-app-ux__blur { overflow: hidden; mask-image: linear-gradient(to bottom, transparent, black); }
.dc-vendor-app-ux__blur-scene { filter: blur(calc(25px * var(--card-scale))); overflow: visible; }
.dc-vendor-app-ux__copy { position: absolute; bottom: max(13.333px, calc(13.333px * var(--card-scale))); left: max(13.333px, calc(13.333px * var(--card-scale))); right: max(13.333px, calc(13.333px * var(--card-scale))); display: flex; flex-direction: column; gap: max(10px, calc(10px * var(--card-scale))); }
.dc-vendor-app-ux__title-block { display: flex; flex-direction: column; gap: max(3.333px, calc(3.333px * var(--card-scale))); }
.dc-vendor-app-ux__title, .dc-vendor-app-ux__subtitle { margin: 0; font-weight: var(--text-weight-semibold); font-variation-settings: var(--font-variation-heading-md); }
.dc-vendor-app-ux__title { font-size: calc(18.333333px * var(--showcase-copy-scale)); line-height: 1.3; letter-spacing: .03em; }
.dc-vendor-app-ux__subtitle { font-size: calc(13.333333px * var(--showcase-copy-scale)); line-height: 1.5; white-space: pre-line; }
.dc-vendor-app-ux__badges { display: flex; flex-wrap: wrap; gap: 6.667px; margin: 0; padding: 0; list-style: none; width: 100%; max-width: 100%; }
.dc-vendor-app-ux__badges li { display: flex; }
.dc-vendor-app-ux:focus-visible { outline: 2px solid var(--border-focus); outline-offset: 3px; }
@media (min-width: 410px) {
  .dc-vendor-app-ux__title { font-size: calc(22px * var(--showcase-copy-scale)); }
}
@media (min-width: 768px) {
  .dc-vendor-app-ux__gradient--default, .dc-vendor-app-ux__gradient--emphasis { background: linear-gradient(180deg, transparent 19.2307696%, rgb(0 0 0 / 60%) 75%, rgb(0 0 0 / 65%) 100%); }
  .dc-vendor-app-ux__pict, .dc-vendor-app-ux__blur-scene { overflow: hidden; }
  .dc-vendor-app-ux { max-width: 430px; border-radius: var(--radius-xlg); }
  .dc-vendor-app-ux__blur-scene { filter: blur(calc(30px * var(--card-scale))); }
  .dc-vendor-app-ux__copy { bottom: max(13.333px, calc(16px * var(--card-scale))); left: max(13.333px, calc(16px * var(--card-scale))); right: max(13.333px, calc(16px * var(--card-scale))); gap: max(10px, calc(12px * var(--card-scale))); }
  .dc-vendor-app-ux__title-block { gap: max(3.333px, calc(4px * var(--card-scale))); }
  .dc-vendor-app-ux__title { font-size: calc(22px * var(--showcase-copy-scale)); }
  .dc-vendor-app-ux__subtitle { font-size: calc(16px * var(--showcase-copy-scale)); }
  .dc-vendor-app-ux__badges { gap: 8px; }
}
@media (prefers-reduced-motion: reduce) { .dc-vendor-app-ux * { transition: none; } }
.dc-vendor-app-ux__badges--web { display: none; }
@media (min-width: 768px) { .dc-vendor-app-ux__badges--base { display: none; } .dc-vendor-app-ux__badges--web { display: flex; } }
.dc-vendor-app-ux__initial-base { display: contents; }
.dc-vendor-app-ux__initial-tablet-art { display: none; }
@media (min-width: 534px) { .dc-vendor-app-ux__initial-base { display: none; } }
@media (534px <= width < 768px) { .dc-vendor-app-ux__initial-tablet-art { display: contents; } }
</style>
