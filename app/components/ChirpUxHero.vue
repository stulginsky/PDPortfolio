<script setup lang="ts">
import { vMediaReady } from './media-readiness'
import { vLayeredScene } from './layered-scene-readiness'
import LayeredSceneFallback from './LayeredSceneFallback.vue'
import { useHeroMotion } from './hero-motion'
import { computed, inject, nextTick, onMounted, onUnmounted, ref } from 'vue'
import DsRoleFocus from './DsRoleFocus.vue'
import DsBadge from './DsBadge.vue'
import TypoText from './TypoText.vue'
import caseContent from '../../content/cases/chirp-ux.json'
import { heroRasterAssets } from './chirp-ux-hero.raster-assets'
import { createHeroDraft, getHeroBreakpoint, heroBreakpoints, heroReferences, heroSceneEditorKey, type HeroBreakpoint, type HeroLayer } from './chirp-ux-hero.scene-context'

const props = withDefaults(defineProps<{ title?: string; badge?: string; role?: string; focus?: string; breakpoint?: HeroBreakpoint }>(), {
  title: caseContent.hero.title, badge: caseContent.hero.badge, role: caseContent.hero.role, focus: caseContent.hero.focus,
})
const editor = inject(heroSceneEditorKey, undefined)
const root = ref<HTMLElement>()
const ready = ref(false)
const viewport = ref(320)
const containerWidth = ref(320)
const breakpoint = computed(() => props.breakpoint ?? getHeroBreakpoint(viewport.value))
const reference = computed(() => heroReferences[breakpoint.value])
const defaults = createHeroDraft()
const layers = computed(() => (editor?.draft ?? defaults)[breakpoint.value])
const ratio = computed(() => containerWidth.value / reference.value.width)
const roleContentHeight = ref<number>()
const heroHeight = computed(() => breakpoint.value === 'base' && roleContentHeight.value !== undefined
  ? layers.value[3]!.y * ratio.value + roleContentHeight.value
  : reference.value.height * ratio.value)
const assets = '/cases/chirp-ux/hero-layers/'
// Figma CaseTitle text slot and absoluteRenderBounds offset; export includes its shadow.
const titleSlots: Record<HeroBreakpoint, { width: number; height: number; x: number; y: number }> = {
  base: { width: 196.78700256347656, height: 24, x: 45.7705078125, y: 2.05078125 },
  'min-768': { width: 386.81903076171875, height: 47, x: 108.0224609375, y: 2.92919921875 },
  'min-1024': { width: 299, height: 52, x: -4.552734375, y: 3.8408203125 },
  'min-1280': { width: 351, height: 62, x: -5.5166015625, y: 5.0908203125 },
  'min-1440': { width: 351, height: 62, x: -5.5166015625, y: 5.0908203125 },
  'min-1920': { width: 428, height: 77, x: -7.07470703125, y: 6.64599609375 },
}
// Use the accepted scene profiles for the first server-rendered paint as well.
const initialProfiles = [...heroBreakpoints].reverse().map(profile => ({ profile, media: `(min-width: ${profile === 'base' ? 0 : heroReferences[profile].width}px)` }))
function initialValues(profile: HeroBreakpoint) {
  const r = heroReferences[profile], scene = defaults[profile], slot = titleSlots[profile]
  const length = (n: number) => `${n / r.width * 100}cqw`
  const values: Record<string, string> = {
    scale: `calc(100cqw / ${r.width}px)`, aspect: profile === 'base' ? 'auto' : `${r.width} / ${r.height}`,
    'role-position': profile === 'base' ? 'relative' : 'absolute', 'role-top': profile === 'base' ? '0px' : length(scene[3]!.y), 'role-height': profile === 'base' ? 'auto' : length(scene[3]!.height),
    'base-padding': profile === 'base' ? `${scene[3]!.y / r.width * 100}%` : '0px',
    'name-height': length(r.nameHeight), 'wordmark-width': length(r.nameWidth), 'name-y': length(r.nameY),
    'copy-width': length(r.copyWidth), 'copy-left': r.copyPaddingLeft, 'copy-right': r.copyPaddingRight,
    'title-size': length(r.fontSize), 'title-gap': r.titleGap, 'logo-x': length(r.logoX), 'logo-y': length(r.logoY),
    'slot-width': length(slot.width), 'slot-height': length(slot.height), 'slot-x': length(slot.x), 'slot-y': length(slot.y),
    'green-offset': length(-r.greenOffset), blur: length(r.backgroundBlur),
    'title-align': r.width < 1024 ? 'flex-end' : 'flex-start',
    'base-display': profile === 'base' ? 'block' : 'none', 'web-display': profile === 'base' ? 'none' : 'block',
    'inner-position': r.inner ? 'absolute' : 'static',
  }
  scene.forEach((layer, i) => Object.entries({ x: layer.x, y: layer.y, w: layer.width, h: layer.height }).forEach(([key, value]) => { values[`${key}${i}`] = length(value) }))
  heroRasterAssets[profile].forEach((asset, i) => Object.entries({ x: asset.x, y: asset.y, w: asset.width, h: asset.height }).forEach(([key, value]) => { values[`raster-${key}${i}`] = length(value) }))
  Object.entries(r.inner || { x: 0, y: 0, width: r.width, height: r.height, blur: 0 }).forEach(([key, value]) => { values[`inner-${key}`] = length(value) })
  if (!r.inner) { values['inner-width'] = '100%'; values['inner-height'] = '100%' }
  return values
}
const initialStyle = computed(() => {
  const variables: Record<string, string> = { height: heroHeight.value + 'px' }
  heroBreakpoints.forEach(profile => Object.entries(initialValues(profile)).forEach(([key, value]) => { variables[`--${profile}-${key}`] = value }))
  if (props.breakpoint) Object.entries(initialValues(props.breakpoint)).forEach(([key, value]) => { variables[`--initial-${key}`] = value })
  return variables
})
const normalizeTitle = (value: string) => value.replace(/\s+/g, ' ').trim()
const outlinedTitle = computed(() => normalizeTitle(props.title) === normalizeTitle(caseContent.hero.title))
const titleSlotStyle = computed(() => ({ width: titleSlots[breakpoint.value].width * ratio.value + 'px', height: titleSlots[breakpoint.value].height * ratio.value + 'px' }))
const titleAssetStyle = computed(() => ({ left: titleSlots[breakpoint.value].x * ratio.value + 'px', top: titleSlots[breakpoint.value].y * ratio.value + 'px' }))
const layerElements: HTMLElement[] = []
let latestOffsets:number[]=[]
let resizeObserver:ResizeObserver|undefined
let roleContentObserver:ResizeObserver|undefined
function geometryStyle(layer: HeroLayer) {
  return { left: layer.x * ratio.value + 'px', top: layer.y * ratio.value + 'px', width: layer.width * ratio.value + 'px', height: layer.height * ratio.value + 'px' }
}
const mobileComposition = computed(() => reference.value.width < 1024)
const titleStyle = computed(() => ({
  '--name-height': reference.value.nameHeight * ratio.value + 'px',
  '--wordmark-width': reference.value.nameWidth * ratio.value + 'px',
  '--title-gap': reference.value.titleGap,
  '--copy-padding-left': reference.value.copyPaddingLeft,
  '--copy-padding-right': reference.value.copyPaddingRight,
  '--name-y': reference.value.nameY * ratio.value + 'px',
  '--copy-width': reference.value.copyWidth * ratio.value + 'px',
  '--title-size': reference.value.fontSize * ratio.value + 'px',
  '--svg-scale': String(ratio.value),
  '--logo-x': reference.value.logoX * ratio.value + 'px',
  '--logo-y': reference.value.logoY * ratio.value + 'px',
}))
function rasterSource(profile: HeroBreakpoint, index: number) { return assets + profile + '/' + heroRasterAssets[profile][index]!.file }
function rasterStyle(index: number) {
  const asset = heroRasterAssets[breakpoint.value][index]!
  return { left: asset.x * ratio.value + 'px', top: asset.y * ratio.value + 'px', width: asset.width * ratio.value + 'px', height: asset.height * ratio.value + 'px' }
}
function setLayer(element: unknown, index: number) {
  if (element instanceof HTMLElement) layerElements[index] = element
}
function renderOffsets(values:number[]=latestOffsets){
 latestOffsets=values
 values.forEach((value,index)=>layerElements[index]?.style.setProperty('--parallax-x',value + 'px'))
}
const {resetMotion,replayIntro,maybeIntro,pointerDown,release}=useHeroMotion({
 root,layers:()=>layers.value,breakpoint:()=>breakpoint.value,mode:()=>editor?.mode.value,
 width:()=>containerWidth.value,viewport:()=>viewport.value,render:renderOffsets,scope:'viewport'
})
function sync() {
  viewport.value = window.innerWidth
  containerWidth.value = root.value?.clientWidth || viewport.value
  nextTick(renderOffsets)
}
function measureRoleContent() {
  const content = layerElements[3]?.querySelector('.ds-role-focus')
  if (content instanceof HTMLElement) roleContentHeight.value = content.getBoundingClientRect().height
}
onMounted(async()=>{sync();resizeObserver=new ResizeObserver(sync);resizeObserver.observe(root.value!);await nextTick();if(!root.value)return;ready.value=true;await nextTick();const content=layerElements[3]?.firstElementChild
 if(content){roleContentObserver=new ResizeObserver(measureRoleContent);roleContentObserver.observe(content)}
 measureRoleContent();window.addEventListener('resize',sync)})
onUnmounted(()=>{resizeObserver?.disconnect();roleContentObserver?.disconnect();window.removeEventListener('resize',sync)})
defineExpose({ replayIntro, resetMotion })
</script>


<template>
  <section v-media-ready v-layered-scene ref="root" class="chirp-ux-hero" :class="{ 'chirp-ux-hero--mobile': mobileComposition }" :data-breakpoint="breakpoint" :data-ready="ready" data-motion="neutral"
    :style="initialStyle" :aria-label="caseContent.pageTitle" @scene-ready="maybeIntro" @pointerdown="pointerDown">
  <LayeredSceneFallback name="chirp-ux-hero" />
    <div v-for="(layer, index) in layers" :key="index" :ref="element => setLayer(element, index)"
      class="chirp-ux-hero__layer" :class="{ 'chirp-ux-hero__title': index === 4, 'chirp-ux-hero__background': index === 0, 'chirp-ux-hero__role': index === 3 }"
      :data-layer="layer.name" :data-animation-enabled="layer.animationEnabled"
      :style="[geometryStyle(layer), index === 4 ? titleStyle : {}]">
      <picture v-if="index < 2">
        <template v-if="!ready && !props.breakpoint"><source v-for="profile in initialProfiles" :key="profile.profile" :media="profile.media" :srcset="rasterSource(profile.profile, index)" /></template>
        <img :src="rasterSource(breakpoint, index)" alt="" draggable="false" @load="maybeIntro" class="chirp-ux-hero__baked-background" :style="rasterStyle(index)" />
      </picture>
      <img v-else-if="index === 2" :src="assets + 'phones-ux.png'" alt="" draggable="false" @load="maybeIntro" class="chirp-ux-hero__raster" />
      <template v-else-if="index === 3">
        <DsRoleFocus v-if="ready" :role="role" :focus="focus" :breakpoint="breakpoint === 'base' ? 'base' : 'min-425'" />
        <template v-else>
          <div class="chirp-ux-hero__initial-role-base"><DsRoleFocus :role="role" :focus="focus" breakpoint="base" /></div>
          <div class="chirp-ux-hero__initial-role-web"><DsRoleFocus :role="role" :focus="focus" breakpoint="min-425" /></div>
        </template>
      </template>
      <template v-else>
        <div class="chirp-ux-hero__wordmark" aria-hidden="true">
          <picture v-for="kind in (['name', 'logo'] as const)" :key="kind">
            <template v-if="!ready && !props.breakpoint"><source v-for="profile in initialProfiles" :key="profile.profile" :media="profile.media" :srcset="assets + profile.profile + '/' + kind + '.svg'" /></template>
            <img :src="assets + breakpoint + '/' + kind + '.svg'" alt="" draggable="false" @load="maybeIntro" :class="'chirp-ux-hero__' + kind" />
          </picture>
        </div>
        <div class="chirp-ux-hero__copy">
          <h1 class="chirp-ux-hero__heading" :class="{ 'chirp-ux-hero__heading--sr-only': outlinedTitle }"><TypoText :content="title" /></h1>
          <div v-if="outlinedTitle" class="chirp-ux-hero__case-title" :style="titleSlotStyle" aria-hidden="true">
            <picture>
              <template v-if="!ready && !props.breakpoint"><source v-for="profile in initialProfiles" :key="profile.profile" :media="profile.media" :srcset="assets + profile.profile + '/case-title.svg'" /></template>
              <img :src="assets + breakpoint + '/case-title.svg'" alt="" draggable="false" @load="maybeIntro" class="chirp-ux-hero__case-title-svg" :style="titleAssetStyle" />
            </picture>
          </div>
          <DsBadge type="HeroChirp" :label="badge" />
        </div>
      </template>
    </div>
  </section>
</template>

<style scoped>
.chirp-ux-hero { position: relative; width: 100%; overflow: clip; background: var(--surface-default); touch-action: pan-y; }
.chirp-ux-hero__layer { position: absolute; transform: translate3d(var(--parallax-x, 0px), 0, 0); will-change: transform; }
.chirp-ux-hero__raster { display: block; width: 100%; height: 100%; object-fit: cover; pointer-events: none; user-select: none; }
.chirp-ux-hero__baked-background { position: absolute; display: block; max-width: none; pointer-events: none; user-select: none; }
.chirp-ux-hero__title { display: flex; flex-direction: column; align-items: flex-start; gap: var(--title-gap); }
.chirp-ux-hero--mobile .chirp-ux-hero__title { align-items: flex-end; }
.chirp-ux-hero__wordmark { position: relative; width: var(--wordmark-width); height: var(--name-height); flex: none; }
.chirp-ux-hero__name, .chirp-ux-hero__logo { position: absolute; display: block; max-width: none; transform: scale(var(--svg-scale)); transform-origin: top left; user-select: none; pointer-events: none; }
.chirp-ux-hero__name { left: 0; top: var(--name-y); }
.chirp-ux-hero__logo { left: var(--logo-x); top: var(--logo-y); }
.chirp-ux-hero__copy { display: flex; flex-direction: column; align-items: flex-end; gap: var(--space-3); box-sizing: border-box; width: var(--copy-width); padding-left: var(--copy-padding-left); padding-right: var(--copy-padding-right); }
.chirp-ux-hero__heading { margin: 0; width: 100%; color: var(--accent-aubergine); font-family: var(--text-font-sans); font-size: var(--title-size); font-weight: 500; line-height: 1.25; letter-spacing: .01em; white-space: nowrap; text-shadow: 2.276px 4.552px 15.054px rgb(44 31 57 / .1); font-variation-settings: "wght" 500, "GRAD" 0, "XOPQ" 96, "XTRA" 468, "YOPQ" 25, "YTAS" 750, "YTDE" -203, "YTFI" 738, "YTLC" 514, "YTUC" 712, "wdth" 100; }
.chirp-ux-hero--mobile .chirp-ux-hero__heading { text-align: right; }
.chirp-ux-hero__heading--sr-only { position: absolute; width: 1px; height: 1px; padding: 0; overflow: hidden; clip-path: inset(50%); border: 0; }
.chirp-ux-hero__case-title { position: relative; flex: none; }
.chirp-ux-hero__case-title-svg { position: absolute; display: block; max-width: none; transform: scale(var(--svg-scale)); transform-origin: top left; pointer-events: none; user-select: none; }
@media (prefers-reduced-motion: reduce) { .chirp-ux-hero__layer { will-change: auto; } }
/* First paint uses CSS viewport selection; hydration keeps the same geometry. */
.chirp-ux-hero { container-type: inline-size; }
.chirp-ux-hero { --initial-scale: var(--base-scale); --initial-raster-x0: var(--base-raster-x0); --initial-raster-y0: var(--base-raster-y0); --initial-raster-w0: var(--base-raster-w0); --initial-raster-h0: var(--base-raster-h0); --initial-raster-x1: var(--base-raster-x1); --initial-raster-y1: var(--base-raster-y1); --initial-raster-w1: var(--base-raster-w1); --initial-raster-h1: var(--base-raster-h1); --initial-aspect: var(--base-aspect); --initial-base-padding: var(--base-base-padding); --initial-role-position: var(--base-role-position); --initial-role-top: var(--base-role-top); --initial-role-height: var(--base-role-height); --initial-name-height: var(--base-name-height); --initial-wordmark-width: var(--base-wordmark-width); --initial-name-y: var(--base-name-y); --initial-copy-width: var(--base-copy-width); --initial-copy-left: var(--base-copy-left); --initial-copy-right: var(--base-copy-right); --initial-title-size: var(--base-title-size); --initial-title-gap: var(--base-title-gap); --initial-logo-x: var(--base-logo-x); --initial-logo-y: var(--base-logo-y); --initial-slot-width: var(--base-slot-width); --initial-slot-height: var(--base-slot-height); --initial-slot-x: var(--base-slot-x); --initial-slot-y: var(--base-slot-y); --initial-green-offset: var(--base-green-offset); --initial-blur: var(--base-blur); --initial-title-align: var(--base-title-align); --initial-base-display: var(--base-base-display); --initial-web-display: var(--base-web-display); --initial-inner-position: var(--base-inner-position); --initial-x0: var(--base-x0); --initial-y0: var(--base-y0); --initial-w0: var(--base-w0); --initial-h0: var(--base-h0); --initial-x1: var(--base-x1); --initial-y1: var(--base-y1); --initial-w1: var(--base-w1); --initial-h1: var(--base-h1); --initial-x2: var(--base-x2); --initial-y2: var(--base-y2); --initial-w2: var(--base-w2); --initial-h2: var(--base-h2); --initial-x3: var(--base-x3); --initial-y3: var(--base-y3); --initial-w3: var(--base-w3); --initial-h3: var(--base-h3); --initial-x4: var(--base-x4); --initial-y4: var(--base-y4); --initial-w4: var(--base-w4); --initial-h4: var(--base-h4); --initial-inner-x: var(--base-inner-x); --initial-inner-y: var(--base-inner-y); --initial-inner-width: var(--base-inner-width); --initial-inner-height: var(--base-inner-height); --initial-inner-blur: var(--base-inner-blur); }
@media (min-width: 768px) { .chirp-ux-hero { --initial-scale: var(--min-768-scale); --initial-raster-x0: var(--min-768-raster-x0); --initial-raster-y0: var(--min-768-raster-y0); --initial-raster-w0: var(--min-768-raster-w0); --initial-raster-h0: var(--min-768-raster-h0); --initial-raster-x1: var(--min-768-raster-x1); --initial-raster-y1: var(--min-768-raster-y1); --initial-raster-w1: var(--min-768-raster-w1); --initial-raster-h1: var(--min-768-raster-h1); --initial-aspect: var(--min-768-aspect); --initial-base-padding: var(--min-768-base-padding); --initial-role-position: var(--min-768-role-position); --initial-role-top: var(--min-768-role-top); --initial-role-height: var(--min-768-role-height); --initial-name-height: var(--min-768-name-height); --initial-wordmark-width: var(--min-768-wordmark-width); --initial-name-y: var(--min-768-name-y); --initial-copy-width: var(--min-768-copy-width); --initial-copy-left: var(--min-768-copy-left); --initial-copy-right: var(--min-768-copy-right); --initial-title-size: var(--min-768-title-size); --initial-title-gap: var(--min-768-title-gap); --initial-logo-x: var(--min-768-logo-x); --initial-logo-y: var(--min-768-logo-y); --initial-slot-width: var(--min-768-slot-width); --initial-slot-height: var(--min-768-slot-height); --initial-slot-x: var(--min-768-slot-x); --initial-slot-y: var(--min-768-slot-y); --initial-green-offset: var(--min-768-green-offset); --initial-blur: var(--min-768-blur); --initial-title-align: var(--min-768-title-align); --initial-base-display: var(--min-768-base-display); --initial-web-display: var(--min-768-web-display); --initial-inner-position: var(--min-768-inner-position); --initial-x0: var(--min-768-x0); --initial-y0: var(--min-768-y0); --initial-w0: var(--min-768-w0); --initial-h0: var(--min-768-h0); --initial-x1: var(--min-768-x1); --initial-y1: var(--min-768-y1); --initial-w1: var(--min-768-w1); --initial-h1: var(--min-768-h1); --initial-x2: var(--min-768-x2); --initial-y2: var(--min-768-y2); --initial-w2: var(--min-768-w2); --initial-h2: var(--min-768-h2); --initial-x3: var(--min-768-x3); --initial-y3: var(--min-768-y3); --initial-w3: var(--min-768-w3); --initial-h3: var(--min-768-h3); --initial-x4: var(--min-768-x4); --initial-y4: var(--min-768-y4); --initial-w4: var(--min-768-w4); --initial-h4: var(--min-768-h4); --initial-inner-x: var(--min-768-inner-x); --initial-inner-y: var(--min-768-inner-y); --initial-inner-width: var(--min-768-inner-width); --initial-inner-height: var(--min-768-inner-height); --initial-inner-blur: var(--min-768-inner-blur); }
 }
@media (min-width: 1024px) { .chirp-ux-hero { --initial-scale: var(--min-1024-scale); --initial-raster-x0: var(--min-1024-raster-x0); --initial-raster-y0: var(--min-1024-raster-y0); --initial-raster-w0: var(--min-1024-raster-w0); --initial-raster-h0: var(--min-1024-raster-h0); --initial-raster-x1: var(--min-1024-raster-x1); --initial-raster-y1: var(--min-1024-raster-y1); --initial-raster-w1: var(--min-1024-raster-w1); --initial-raster-h1: var(--min-1024-raster-h1); --initial-aspect: var(--min-1024-aspect); --initial-base-padding: var(--min-1024-base-padding); --initial-role-position: var(--min-1024-role-position); --initial-role-top: var(--min-1024-role-top); --initial-role-height: var(--min-1024-role-height); --initial-name-height: var(--min-1024-name-height); --initial-wordmark-width: var(--min-1024-wordmark-width); --initial-name-y: var(--min-1024-name-y); --initial-copy-width: var(--min-1024-copy-width); --initial-copy-left: var(--min-1024-copy-left); --initial-copy-right: var(--min-1024-copy-right); --initial-title-size: var(--min-1024-title-size); --initial-title-gap: var(--min-1024-title-gap); --initial-logo-x: var(--min-1024-logo-x); --initial-logo-y: var(--min-1024-logo-y); --initial-slot-width: var(--min-1024-slot-width); --initial-slot-height: var(--min-1024-slot-height); --initial-slot-x: var(--min-1024-slot-x); --initial-slot-y: var(--min-1024-slot-y); --initial-green-offset: var(--min-1024-green-offset); --initial-blur: var(--min-1024-blur); --initial-title-align: var(--min-1024-title-align); --initial-base-display: var(--min-1024-base-display); --initial-web-display: var(--min-1024-web-display); --initial-inner-position: var(--min-1024-inner-position); --initial-x0: var(--min-1024-x0); --initial-y0: var(--min-1024-y0); --initial-w0: var(--min-1024-w0); --initial-h0: var(--min-1024-h0); --initial-x1: var(--min-1024-x1); --initial-y1: var(--min-1024-y1); --initial-w1: var(--min-1024-w1); --initial-h1: var(--min-1024-h1); --initial-x2: var(--min-1024-x2); --initial-y2: var(--min-1024-y2); --initial-w2: var(--min-1024-w2); --initial-h2: var(--min-1024-h2); --initial-x3: var(--min-1024-x3); --initial-y3: var(--min-1024-y3); --initial-w3: var(--min-1024-w3); --initial-h3: var(--min-1024-h3); --initial-x4: var(--min-1024-x4); --initial-y4: var(--min-1024-y4); --initial-w4: var(--min-1024-w4); --initial-h4: var(--min-1024-h4); --initial-inner-x: var(--min-1024-inner-x); --initial-inner-y: var(--min-1024-inner-y); --initial-inner-width: var(--min-1024-inner-width); --initial-inner-height: var(--min-1024-inner-height); --initial-inner-blur: var(--min-1024-inner-blur); }
 }
@media (min-width: 1280px) { .chirp-ux-hero { --initial-scale: var(--min-1280-scale); --initial-raster-x0: var(--min-1280-raster-x0); --initial-raster-y0: var(--min-1280-raster-y0); --initial-raster-w0: var(--min-1280-raster-w0); --initial-raster-h0: var(--min-1280-raster-h0); --initial-raster-x1: var(--min-1280-raster-x1); --initial-raster-y1: var(--min-1280-raster-y1); --initial-raster-w1: var(--min-1280-raster-w1); --initial-raster-h1: var(--min-1280-raster-h1); --initial-aspect: var(--min-1280-aspect); --initial-base-padding: var(--min-1280-base-padding); --initial-role-position: var(--min-1280-role-position); --initial-role-top: var(--min-1280-role-top); --initial-role-height: var(--min-1280-role-height); --initial-name-height: var(--min-1280-name-height); --initial-wordmark-width: var(--min-1280-wordmark-width); --initial-name-y: var(--min-1280-name-y); --initial-copy-width: var(--min-1280-copy-width); --initial-copy-left: var(--min-1280-copy-left); --initial-copy-right: var(--min-1280-copy-right); --initial-title-size: var(--min-1280-title-size); --initial-title-gap: var(--min-1280-title-gap); --initial-logo-x: var(--min-1280-logo-x); --initial-logo-y: var(--min-1280-logo-y); --initial-slot-width: var(--min-1280-slot-width); --initial-slot-height: var(--min-1280-slot-height); --initial-slot-x: var(--min-1280-slot-x); --initial-slot-y: var(--min-1280-slot-y); --initial-green-offset: var(--min-1280-green-offset); --initial-blur: var(--min-1280-blur); --initial-title-align: var(--min-1280-title-align); --initial-base-display: var(--min-1280-base-display); --initial-web-display: var(--min-1280-web-display); --initial-inner-position: var(--min-1280-inner-position); --initial-x0: var(--min-1280-x0); --initial-y0: var(--min-1280-y0); --initial-w0: var(--min-1280-w0); --initial-h0: var(--min-1280-h0); --initial-x1: var(--min-1280-x1); --initial-y1: var(--min-1280-y1); --initial-w1: var(--min-1280-w1); --initial-h1: var(--min-1280-h1); --initial-x2: var(--min-1280-x2); --initial-y2: var(--min-1280-y2); --initial-w2: var(--min-1280-w2); --initial-h2: var(--min-1280-h2); --initial-x3: var(--min-1280-x3); --initial-y3: var(--min-1280-y3); --initial-w3: var(--min-1280-w3); --initial-h3: var(--min-1280-h3); --initial-x4: var(--min-1280-x4); --initial-y4: var(--min-1280-y4); --initial-w4: var(--min-1280-w4); --initial-h4: var(--min-1280-h4); --initial-inner-x: var(--min-1280-inner-x); --initial-inner-y: var(--min-1280-inner-y); --initial-inner-width: var(--min-1280-inner-width); --initial-inner-height: var(--min-1280-inner-height); --initial-inner-blur: var(--min-1280-inner-blur); }
 }
@media (min-width: 1440px) { .chirp-ux-hero { --initial-scale: var(--min-1440-scale); --initial-raster-x0: var(--min-1440-raster-x0); --initial-raster-y0: var(--min-1440-raster-y0); --initial-raster-w0: var(--min-1440-raster-w0); --initial-raster-h0: var(--min-1440-raster-h0); --initial-raster-x1: var(--min-1440-raster-x1); --initial-raster-y1: var(--min-1440-raster-y1); --initial-raster-w1: var(--min-1440-raster-w1); --initial-raster-h1: var(--min-1440-raster-h1); --initial-aspect: var(--min-1440-aspect); --initial-base-padding: var(--min-1440-base-padding); --initial-role-position: var(--min-1440-role-position); --initial-role-top: var(--min-1440-role-top); --initial-role-height: var(--min-1440-role-height); --initial-name-height: var(--min-1440-name-height); --initial-wordmark-width: var(--min-1440-wordmark-width); --initial-name-y: var(--min-1440-name-y); --initial-copy-width: var(--min-1440-copy-width); --initial-copy-left: var(--min-1440-copy-left); --initial-copy-right: var(--min-1440-copy-right); --initial-title-size: var(--min-1440-title-size); --initial-title-gap: var(--min-1440-title-gap); --initial-logo-x: var(--min-1440-logo-x); --initial-logo-y: var(--min-1440-logo-y); --initial-slot-width: var(--min-1440-slot-width); --initial-slot-height: var(--min-1440-slot-height); --initial-slot-x: var(--min-1440-slot-x); --initial-slot-y: var(--min-1440-slot-y); --initial-green-offset: var(--min-1440-green-offset); --initial-blur: var(--min-1440-blur); --initial-title-align: var(--min-1440-title-align); --initial-base-display: var(--min-1440-base-display); --initial-web-display: var(--min-1440-web-display); --initial-inner-position: var(--min-1440-inner-position); --initial-x0: var(--min-1440-x0); --initial-y0: var(--min-1440-y0); --initial-w0: var(--min-1440-w0); --initial-h0: var(--min-1440-h0); --initial-x1: var(--min-1440-x1); --initial-y1: var(--min-1440-y1); --initial-w1: var(--min-1440-w1); --initial-h1: var(--min-1440-h1); --initial-x2: var(--min-1440-x2); --initial-y2: var(--min-1440-y2); --initial-w2: var(--min-1440-w2); --initial-h2: var(--min-1440-h2); --initial-x3: var(--min-1440-x3); --initial-y3: var(--min-1440-y3); --initial-w3: var(--min-1440-w3); --initial-h3: var(--min-1440-h3); --initial-x4: var(--min-1440-x4); --initial-y4: var(--min-1440-y4); --initial-w4: var(--min-1440-w4); --initial-h4: var(--min-1440-h4); --initial-inner-x: var(--min-1440-inner-x); --initial-inner-y: var(--min-1440-inner-y); --initial-inner-width: var(--min-1440-inner-width); --initial-inner-height: var(--min-1440-inner-height); --initial-inner-blur: var(--min-1440-inner-blur); }
 }
@media (min-width: 1920px) { .chirp-ux-hero { --initial-scale: var(--min-1920-scale); --initial-raster-x0: var(--min-1920-raster-x0); --initial-raster-y0: var(--min-1920-raster-y0); --initial-raster-w0: var(--min-1920-raster-w0); --initial-raster-h0: var(--min-1920-raster-h0); --initial-raster-x1: var(--min-1920-raster-x1); --initial-raster-y1: var(--min-1920-raster-y1); --initial-raster-w1: var(--min-1920-raster-w1); --initial-raster-h1: var(--min-1920-raster-h1); --initial-aspect: var(--min-1920-aspect); --initial-base-padding: var(--min-1920-base-padding); --initial-role-position: var(--min-1920-role-position); --initial-role-top: var(--min-1920-role-top); --initial-role-height: var(--min-1920-role-height); --initial-name-height: var(--min-1920-name-height); --initial-wordmark-width: var(--min-1920-wordmark-width); --initial-name-y: var(--min-1920-name-y); --initial-copy-width: var(--min-1920-copy-width); --initial-copy-left: var(--min-1920-copy-left); --initial-copy-right: var(--min-1920-copy-right); --initial-title-size: var(--min-1920-title-size); --initial-title-gap: var(--min-1920-title-gap); --initial-logo-x: var(--min-1920-logo-x); --initial-logo-y: var(--min-1920-logo-y); --initial-slot-width: var(--min-1920-slot-width); --initial-slot-height: var(--min-1920-slot-height); --initial-slot-x: var(--min-1920-slot-x); --initial-slot-y: var(--min-1920-slot-y); --initial-green-offset: var(--min-1920-green-offset); --initial-blur: var(--min-1920-blur); --initial-title-align: var(--min-1920-title-align); --initial-base-display: var(--min-1920-base-display); --initial-web-display: var(--min-1920-web-display); --initial-inner-position: var(--min-1920-inner-position); --initial-x0: var(--min-1920-x0); --initial-y0: var(--min-1920-y0); --initial-w0: var(--min-1920-w0); --initial-h0: var(--min-1920-h0); --initial-x1: var(--min-1920-x1); --initial-y1: var(--min-1920-y1); --initial-w1: var(--min-1920-w1); --initial-h1: var(--min-1920-h1); --initial-x2: var(--min-1920-x2); --initial-y2: var(--min-1920-y2); --initial-w2: var(--min-1920-w2); --initial-h2: var(--min-1920-h2); --initial-x3: var(--min-1920-x3); --initial-y3: var(--min-1920-y3); --initial-w3: var(--min-1920-w3); --initial-h3: var(--min-1920-h3); --initial-x4: var(--min-1920-x4); --initial-y4: var(--min-1920-y4); --initial-w4: var(--min-1920-w4); --initial-h4: var(--min-1920-h4); --initial-inner-x: var(--min-1920-inner-x); --initial-inner-y: var(--min-1920-inner-y); --initial-inner-width: var(--min-1920-inner-width); --initial-inner-height: var(--min-1920-inner-height); --initial-inner-blur: var(--min-1920-inner-blur); }
 }

.chirp-ux-hero[data-ready="false"] { height: auto !important; aspect-ratio: var(--initial-aspect); padding-top: var(--initial-base-padding); box-sizing: border-box; }
.chirp-ux-hero[data-ready="false"] .chirp-ux-hero__layer:nth-child(1) { left: var(--initial-x0) !important; top: var(--initial-y0) !important; width: var(--initial-w0) !important; height: var(--initial-h0) !important; }
.chirp-ux-hero[data-ready="false"] .chirp-ux-hero__layer:nth-child(2) { left: var(--initial-x1) !important; top: var(--initial-y1) !important; width: var(--initial-w1) !important; height: var(--initial-h1) !important; }
.chirp-ux-hero[data-ready="false"] .chirp-ux-hero__layer:nth-child(3) { left: var(--initial-x2) !important; top: var(--initial-y2) !important; width: var(--initial-w2) !important; height: var(--initial-h2) !important; }
.chirp-ux-hero[data-ready="false"] .chirp-ux-hero__layer:nth-child(4) { left: var(--initial-x3) !important; top: var(--initial-y3) !important; width: var(--initial-w3) !important; height: var(--initial-h3) !important; }
.chirp-ux-hero[data-ready="false"] .chirp-ux-hero__layer:nth-child(5) { left: var(--initial-x4) !important; top: var(--initial-y4) !important; width: var(--initial-w4) !important; height: var(--initial-h4) !important; }

.chirp-ux-hero[data-ready="false"] .chirp-ux-hero__layer.chirp-ux-hero__role { position: var(--initial-role-position); top: var(--initial-role-top) !important; height: var(--initial-role-height) !important; }
.chirp-ux-hero__initial-role-base { display: var(--initial-base-display); }
.chirp-ux-hero__initial-role-web { display: var(--initial-web-display); }
.chirp-ux-hero[data-ready="false"] .chirp-ux-hero__title { align-items: var(--initial-title-align); --svg-scale: var(--initial-scale) !important; --name-height: var(--initial-name-height) !important; --wordmark-width: var(--initial-wordmark-width) !important; --name-y: var(--initial-name-y) !important; --copy-width: var(--initial-copy-width) !important; --copy-padding-left: var(--initial-copy-left) !important; --copy-padding-right: var(--initial-copy-right) !important; --title-size: var(--initial-title-size) !important; --title-gap: var(--initial-title-gap) !important; --logo-x: var(--initial-logo-x) !important; --logo-y: var(--initial-logo-y) !important; }
.chirp-ux-hero[data-ready="false"] .chirp-ux-hero__case-title { width: var(--initial-slot-width) !important; height: var(--initial-slot-height) !important; }
.chirp-ux-hero[data-ready="false"] .chirp-ux-hero__case-title-svg { left: var(--initial-slot-x) !important; top: var(--initial-slot-y) !important; }
.chirp-ux-hero[data-ready="false"] .chirp-ux-hero__layer:nth-child(1) .chirp-ux-hero__baked-background { left: var(--initial-raster-x0) !important; top: var(--initial-raster-y0) !important; width: var(--initial-raster-w0) !important; height: var(--initial-raster-h0) !important; }
.chirp-ux-hero[data-ready="false"] .chirp-ux-hero__layer:nth-child(2) .chirp-ux-hero__baked-background { left: var(--initial-raster-x1) !important; top: var(--initial-raster-y1) !important; width: var(--initial-raster-w1) !important; height: var(--initial-raster-h1) !important; }
</style>
