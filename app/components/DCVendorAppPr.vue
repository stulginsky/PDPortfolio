<script setup lang="ts">
import { computed, inject, onActivated, onDeactivated, onMounted, onUnmounted, ref } from 'vue'
import { vMediaReady } from './media-readiness'
import { vLayeredScene } from './layered-scene-readiness'
import LayeredSceneFallback from './LayeredSceneFallback.vue'
import { cardInitialStyle } from './chirp-card-initial'
import DsBadge from './DsBadge.vue'
import TypoText from './TypoText.vue'
import content from '../../content/cases/dc-vendor-app-pr.json'
import DCVendorAppPrScene from './DCVendorAppPrScene.vue'
import { vendorPrGeometry } from './dc-vendor-app-pr.geometry'
import { createVendorPrSceneDraft, getVendorPrSceneProfile, vendorPrSceneEditorKey, vendorPrLayerNames, vendorPrLayerXShift, vendorPrLayerYShift } from './dc-vendor-app-pr.scene-context'

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
const sceneEditor = inject(vendorPrSceneEditorKey, undefined)
const defaultScenes = createVendorPrSceneDraft()
const state = computed(() => sceneEditor && sceneEditor.mode.value !== 'Interaction' ? sceneEditor.mode.value : pressed.value || keyboardPressed.value ? 'ActivePressed' : hovered.value ? 'Hover' : 'Default')
const referenceWidth = computed(() => breakpoint.value === 'base' ? 264 : 430)
const scale = computed(() => 1)
const geometry = computed(() => vendorPrGeometry[breakpoint.value][state.value])
const height = computed(() => viewportWidth.value >= 462 ? 532 : 500)
const positionedLayers = computed(() => vendorPrGeometry[breakpoint.value][state.value].layers.map(layer => {
  const index = vendorPrLayerNames.indexOf(layer.name)
  const draft = (sceneEditor?.draft ?? defaultScenes)[getVendorPrSceneProfile(viewportWidth.value)][state.value][index]
  const position = draft ? {
    ...draft,
    x: draft.x + vendorPrLayerXShift(layer.name, width.value) - geometry.value.pict.x - (width.value - referenceWidth.value) / 2,
    y: draft.y - geometry.value.pict.y + vendorPrLayerYShift(layer.name, viewportWidth.value),
  } : layer
  return { ...layer, file: layer.name === '04-water' ? (viewportWidth.value >= 320 && viewportWidth.value <= 768 ? '04-water.svg' : getVendorPrSceneProfile(viewportWidth.value) === '1024-1920' ? '1024-1920/04-water.svg' : layer.file) : layer.file, position }
}))

const initialStyle = cardInitialStyle({base:vendorPrGeometry.base.Default,wide:vendorPrGeometry.base.Default,web:vendorPrGeometry['min-768'].Default})
const initialProfiles=['base','min-768'] as const
function initialLayers(profile:typeof initialProfiles[number], artworkProfile:'base'|'534-720'|'min-768'|'1024-1920'=profile,replaceWater=false){
 const geometry=vendorPrGeometry[profile].Default,reference=profile==='base'?264:430
 return vendorPrGeometry[profile].Default.layers.map(layer=>{
  const draft=defaultScenes[artworkProfile].Default[vendorPrLayerNames.indexOf(layer.name)]!
  return {...layer,file:layer.name==='04-water'?(replaceWater?'04-water.svg':artworkProfile==='1024-1920'?'1024-1920/04-water.svg':layer.file):layer.file,position:{...draft,x:draft.x+vendorPrLayerXShift(layer.name,reference)-geometry.pict.x,y:draft.y-geometry.pict.y}}
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
  breakpoint.value = getVendorPrSceneProfile(window.innerWidth) === 'base' ? 'base' : 'min-768'
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
  <a v-media-ready v-layered-scene ref="root" class="dc-vendor-app-pr chirp-card showcase-card" :href="props.href" :style="[initialStyle,rootStyle]" :data-ready="ready" :data-state="state" :data-breakpoint="breakpoint"
    @pointerenter="enter" @pointerleave="leave" @pointerdown="down" @pointerup="release" @pointercancel="cancel"
    @keydown.enter="keyboardPressed = true" @keyup.enter="release" @blur="release" @scene-ready="hovered=false;pressed=false;keyboardPressed=false" @dragstart.prevent>
    <LayeredSceneFallback name="dc-vendor-app-pr" />
    <template v-for="part in ['cred', 'pict']" :key="part">
    <div v-if="part === 'pict'" class="dc-vendor-app-pr__pict" :style="pictStyle" aria-hidden="true">
      <DCVendorAppPrScene v-if="ready" :layers="positionedLayers" :breakpoint="breakpoint" :state="state" />
      <template v-else><div class="dc-vendor-app-pr__initial-original"><div v-for="profile in initialProfiles" :key="profile" :class="profile==='base'?'dc-vendor-app-pr__initial-base':'chirp-card__initial-web'"><DCVendorAppPrScene :layers="initialLayers(profile)" :breakpoint="profile" state="Default" /></div><div class="dc-vendor-app-pr__initial-mid"><DCVendorAppPrScene :layers="initialLayers('min-768','534-720')" breakpoint="min-768" state="Default" /></div><div class="dc-vendor-app-pr__initial-large"><DCVendorAppPrScene :layers="initialLayers('min-768','1024-1920')" breakpoint="min-768" state="Default" /></div></div><div class="dc-vendor-app-pr__initial-replacement"><div v-for="profile in initialProfiles" :key="profile" :class="profile==='base'?'dc-vendor-app-pr__initial-base':'chirp-card__initial-web'"><DCVendorAppPrScene :layers="initialLayers(profile,profile,true)" :breakpoint="profile" state="Default" /></div><div class="dc-vendor-app-pr__initial-mid"><DCVendorAppPrScene :layers="initialLayers('min-768','534-720',true)" breakpoint="min-768" state="Default" /></div><div class="dc-vendor-app-pr__initial-large"><DCVendorAppPrScene :layers="initialLayers('min-768','1024-1920',true)" breakpoint="min-768" state="Default" /></div></div></template>
    </div>
    <div v-else class="dc-vendor-app-pr__cred" :style="credStyle">
      <div class="dc-vendor-app-pr__blur" :style="{ ...rectStyle(geometry.blur), width: '100%' }" aria-hidden="true">
        <div class="dc-vendor-app-pr__blur-scene" :style="blurSceneStyle">
          <DCVendorAppPrScene v-if="ready" :layers="positionedLayers" :breakpoint="breakpoint" :state="state" />
      <template v-else><div class="dc-vendor-app-pr__initial-original"><div v-for="profile in initialProfiles" :key="profile" :class="profile==='base'?'dc-vendor-app-pr__initial-base':'chirp-card__initial-web'"><DCVendorAppPrScene :layers="initialLayers(profile)" :breakpoint="profile" state="Default" /></div><div class="dc-vendor-app-pr__initial-mid"><DCVendorAppPrScene :layers="initialLayers('min-768','534-720')" breakpoint="min-768" state="Default" /></div><div class="dc-vendor-app-pr__initial-large"><DCVendorAppPrScene :layers="initialLayers('min-768','1024-1920')" breakpoint="min-768" state="Default" /></div></div><div class="dc-vendor-app-pr__initial-replacement"><div v-for="profile in initialProfiles" :key="profile" :class="profile==='base'?'dc-vendor-app-pr__initial-base':'chirp-card__initial-web'"><DCVendorAppPrScene :layers="initialLayers(profile,profile,true)" :breakpoint="profile" state="Default" /></div><div class="dc-vendor-app-pr__initial-mid"><DCVendorAppPrScene :layers="initialLayers('min-768','534-720',true)" breakpoint="min-768" state="Default" /></div><div class="dc-vendor-app-pr__initial-large"><DCVendorAppPrScene :layers="initialLayers('min-768','1024-1920',true)" breakpoint="min-768" state="Default" /></div></div></template>
        </div>
      </div>
      <div class="dc-vendor-app-pr__gradient dc-vendor-app-pr__gradient--default" />
      <div class="dc-vendor-app-pr__gradient dc-vendor-app-pr__gradient--emphasis" />
      <div :ref="setCopy" class="dc-vendor-app-pr__copy">
        <div class="dc-vendor-app-pr__title-block">
          <TypoText tag="h2" class="dc-vendor-app-pr__title" :content="props.title" />
          <TypoText tag="p" class="dc-vendor-app-pr__subtitle" :content="props.subtitle" />
        </div>
        <ul v-for="profile in (ready ? [breakpoint] : initialProfiles)" :key="profile" class="dc-vendor-app-pr__badges" :class="!ready ? (profile === 'base' ? 'dc-vendor-app-pr__badges--base' : 'dc-vendor-app-pr__badges--web') : undefined" aria-label="Специализации">
          <li v-for="badge in (props.badges ?? content.card.badges[profile])" :key="badge"><DsBadge v-if="ready" :label="badge" :type="viewportWidth < 410 ? 'CardCompact' : 'Card'" /><template v-else><span class="chirp-card__badge-small"><DsBadge :label="badge" type="CardCompact" /></span><span class="chirp-card__badge-large"><DsBadge :label="badge" type="Card" /></span></template></li>
        </ul>
      </div>
    </div>
    </template>
  </a>
</template>

<style scoped>
.dc-vendor-app-pr[data-ready='false'] * { transition: none !important; }
.dc-vendor-app-pr[data-ready='false'] :deep([data-layer='09-ostrich']) { left: calc((var(--initial-reference) - 100cqw) / 2); }
.dc-vendor-app-pr { position: relative; display: block; isolation: isolate; overflow: hidden; width: 100%; max-width: 430px; border-radius: 20px; background: var(--decorative-showcase-dc-background-blue); color: var(--text-inverse); font-family: var(--text-font-sans); text-decoration: none; }
.dc-vendor-app-pr__pict, .dc-vendor-app-pr__cred, .dc-vendor-app-pr__blur, .dc-vendor-app-pr__blur-scene { position: absolute; transform-origin: 0 0; transition: left var(--card-duration) ease-out, top var(--card-duration) ease-out, width var(--card-duration) ease-out, height var(--card-duration) ease-out, transform var(--card-duration) ease-out; }
.dc-vendor-app-pr__pict { z-index: 1; pointer-events: none; overflow: visible; }
.dc-vendor-app-pr__cred { z-index: 2; pointer-events: none; }
.dc-vendor-app-pr__gradient { position: absolute; inset: 0; transition: opacity var(--card-duration) ease-out; }
.dc-vendor-app-pr__gradient--default { background: linear-gradient(180deg, transparent 19.2307696%, rgb(0 0 0 / 75%) 75%, rgb(0 0 0 / 80%) 100%); }
.dc-vendor-app-pr__gradient--emphasis { opacity: 0; background: linear-gradient(180deg, transparent 19.2307696%, rgb(0 0 0 / 75%) 75%, rgb(0 0 0 / 80%) 100%); }
.dc-vendor-app-pr:not([data-state='Default']) .dc-vendor-app-pr__gradient--default { opacity: 0; }
.dc-vendor-app-pr:not([data-state='Default']) .dc-vendor-app-pr__gradient--emphasis { opacity: 1; }
.dc-vendor-app-pr__blur { overflow: hidden; mask-image: linear-gradient(to bottom, transparent, black); }
.dc-vendor-app-pr__blur-scene { filter: blur(calc(25px * var(--card-scale))); overflow: visible; }
.dc-vendor-app-pr__copy { position: absolute; bottom: max(13.333px, calc(13.333px * var(--card-scale))); left: max(13.333px, calc(13.333px * var(--card-scale))); right: max(13.333px, calc(13.333px * var(--card-scale))); display: flex; flex-direction: column; gap: max(10px, calc(10px * var(--card-scale))); }
.dc-vendor-app-pr__title-block { display: flex; flex-direction: column; gap: max(3.333px, calc(3.333px * var(--card-scale))); }
.dc-vendor-app-pr__title, .dc-vendor-app-pr__subtitle { margin: 0; font-weight: var(--text-weight-semibold); font-variation-settings: var(--font-variation-heading-md); }
.dc-vendor-app-pr__title { font-size: calc(18.333333px * var(--showcase-copy-scale)); line-height: 1.3; letter-spacing: .03em; }
.dc-vendor-app-pr__subtitle { font-size: calc(13.333333px * var(--showcase-copy-scale)); line-height: 1.5; white-space: pre-line; }
.dc-vendor-app-pr__badges { display: flex; flex-wrap: wrap; gap: 6.667px; margin: 0; padding: 0; list-style: none; width: 100%; max-width: 100%; }
.dc-vendor-app-pr__badges li { display: flex; }
.dc-vendor-app-pr:focus-visible { outline: 2px solid var(--border-focus); outline-offset: 3px; }
@media (min-width: 410px) {
  .dc-vendor-app-pr__title { font-size: calc(22px * var(--showcase-copy-scale)); }
}
@media (min-width: 768px), (min-width:534px) and (max-width:720px) {
  .dc-vendor-app-pr__gradient--default, .dc-vendor-app-pr__gradient--emphasis { background: linear-gradient(180deg, transparent 19.2307696%, rgb(0 0 0 / 60%) 75%, rgb(0 0 0 / 65%) 100%); }
  .dc-vendor-app-pr__pict, .dc-vendor-app-pr__blur-scene { overflow: hidden; }
  .dc-vendor-app-pr { max-width: 430px; border-radius: var(--radius-xlg); }
  .dc-vendor-app-pr__blur-scene { filter: blur(calc(30px * var(--card-scale))); }
  .dc-vendor-app-pr__copy { bottom: max(13.333px, calc(16px * var(--card-scale))); left: max(13.333px, calc(16px * var(--card-scale))); right: max(13.333px, calc(16px * var(--card-scale))); gap: max(10px, calc(12px * var(--card-scale))); }
  .dc-vendor-app-pr__title-block { gap: max(3.333px, calc(4px * var(--card-scale))); }
  .dc-vendor-app-pr__title { font-size: calc(22px * var(--showcase-copy-scale)); }
  .dc-vendor-app-pr__subtitle { font-size: calc(16px * var(--showcase-copy-scale)); }
  .dc-vendor-app-pr__badges { gap: 8px; }
}
@media (prefers-reduced-motion: reduce) { .dc-vendor-app-pr * { transition: none; } }
.dc-vendor-app-pr__badges--web { display: none; }
@media (min-width: 768px), (min-width:534px) and (max-width:720px) { .dc-vendor-app-pr__badges--base { display: none; } .dc-vendor-app-pr__badges--web { display: flex; } }
.dc-vendor-app-pr__initial-base { display: contents; }
@media (min-width:768px) { .dc-vendor-app-pr__initial-base {display:none} }
.dc-vendor-app-pr__initial-mid { display: none; }
@media (min-width:534px) and (max-width:720px) {
 .dc-vendor-app-pr__initial-base { display:none; }
 .dc-vendor-app-pr__initial-mid { display:contents; }
}
@media (min-width:534px) and (max-width:720px) {
 .dc-vendor-app-pr {
 --initial-px:var(--web-px);--initial-py:var(--web-py);--initial-pw:var(--web-pw);--initial-ph:var(--web-ph);
 --initial-rotation:var(--web-rotation);--initial-reference:var(--web-reference);--initial-ch:var(--web-ch);
 --initial-bx:var(--web-bx);--initial-by:var(--web-by);--initial-bw:var(--web-bw);--initial-bh:var(--web-bh);--initial-cover:var(--web-cover);
 }
}
.dc-vendor-app-pr__initial-large { display:none; }
@media (min-width:1024px) and (max-width:1920px) {
 .dc-vendor-app-pr .chirp-card__initial-web { display:none; }
 .dc-vendor-app-pr__initial-large { display:contents; }
}
.dc-vendor-app-pr__initial-original {display:contents}
.dc-vendor-app-pr__initial-replacement {display:none}
@media(min-width:320px) and (max-width:768px) {
 .dc-vendor-app-pr__initial-original {display:none}
 .dc-vendor-app-pr__initial-replacement {display:contents}
}
@media (min-width:320px) and (max-width:424px) {
 .dc-vendor-app-pr[data-ready='false'] :deep([data-layer]:not([data-layer='09-ostrich']):not([data-layer='08-dimmer'])) { top:-50px; }
}
@media (min-width:320px) and (max-width:410px) {
 .dc-vendor-app-pr[data-ready='false'] :deep([data-layer='05-landform_city-1st']),
 .dc-vendor-app-pr[data-ready='false'] :deep([data-layer='06-landform_city-2nd']),
 .dc-vendor-app-pr[data-ready='false'] :deep([data-layer='04-water']),
 .dc-vendor-app-pr[data-ready='false'] :deep([data-layer='07-tussock 1']) { top:-20px !important; }
}
</style>
