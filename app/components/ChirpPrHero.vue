<script setup lang="ts">
import { vMediaReady } from './media-readiness'
import { vLayeredScene } from './layered-scene-readiness'
import LayeredSceneFallback from './LayeredSceneFallback.vue'
import { useHeroMotion } from './hero-motion'
import { computed, inject, nextTick, onMounted, onUnmounted, ref } from 'vue'
import DsBadge from './DsBadge.vue'
import DsRoleFocus from './DsRoleFocus.vue'
import TypoText from './TypoText.vue'
import caseContent from '../../content/cases/chirp-product.json'
import { createHeroDraft, getHeroBreakpoint, heroBreakpoints, heroReferences, heroSceneEditorKey, type HeroBreakpoint, type HeroLayer } from './chirp-pr-hero.scene-context'

const props = withDefaults(defineProps<{ title?: string; badge?: string; breakpoint?: HeroBreakpoint }>(), {
  title: caseContent.hero.title, badge: caseContent.hero.badge,
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
const copyContentHeight = ref<number>()
const titleVerticalOffset = computed(() => reference.value.width >= 1024 ? 2 : 0)
const titleGap = computed(() => reference.value.width < 1024 ? 8 : 1)
const stageHeight = computed(() => copyContentHeight.value === undefined
  ? (layers.value[3]!.y + layers.value[3]!.height) * ratio.value
  : layers.value[3]!.y * ratio.value + titleVerticalOffset.value + reference.value.nameHeight * ratio.value + titleGap.value + copyContentHeight.value)
const assets = '/cases/chirp-product/hero-layers/'
// Original Figma text slots and shadow-inclusive render-bound offsets.
const titleSlots: Record<HeroBreakpoint, { width: number; height: number; x: number; y: number }> = {
  base: { width: 223, height: 34, x: -4.2275390625, y: 1.705078125 },
  'min-768': { width: 419, height: 69, x: -8.364013671875, y: 5.188720703125 },
  'min-1024': { width: 338, height: 54, x: -7.06591796875, y: 3.92578125 },
  'min-1280': { width: 419, height: 69, x: -8.364013671875, y: 5.18896484375 },
  'min-1440': { width: 419, height: 69, x: -8.364013671875, y: 5.18896484375 },
  'min-1920': { width: 533, height: 90, x: -11.81982421875, y: 7.853515625 },
}
// CSS/picture choose the actual viewport before JavaScript runs. Values come
// from the same accepted profiles as the interactive scene, without a second preset.
const initialProfiles = heroBreakpoints.map(profile => ({
  profile, media: profile === 'base' ? '(min-width: 0px)' : `(min-width: ${heroReferences[profile].width}px)`,
})).reverse()
function initialAsset(profile: HeroBreakpoint, kind: 'background' | 'name' | 'logo' | 'title') {
  if (kind === 'background') return assets + defaults[profile][0]!.name.toLowerCase() + '.png'
  return assets + (kind === 'title' ? profile + '/case-title.svg' : heroReferences[profile].assetProfile + '/' + kind + '.svg')
}
function initialValues(profile: HeroBreakpoint) {
  const reference = heroReferences[profile], scene = defaults[profile], slot = titleSlots[profile]
  const length = (value: number) => `${value / reference.width * 100}cqw`
  const mobile = reference.width < 1024
  const values: Record<string, string> = {
    scale: `calc(100cqw / ${reference.width}px)`,
    'title-top': `calc(${length(scene[3]!.y)} + ${mobile ? 0 : 2}px)`,
    'name-height': length(reference.nameHeight), 'copy-width': length(reference.copyWidth),
    'copy-padding': profile === 'base' || profile === 'min-1024' ? 'var(--space-1)' : 'var(--space-2)',
    'title-size': length(reference.fontSize), 'title-gap': mobile ? '8px' : '1px',
    'logo-x': length(reference.logoX), 'logo-y': length(reference.logoY),
    'slot-width': length(slot.width), 'slot-height': length(slot.height),
    'slot-x': length(slot.x), 'slot-y': length(slot.y),
    'role-padding': ({ base: 'var(--space-6)', 'min-768': 'var(--space-12)', 'min-1024': 'var(--space-8)' } as Record<string, string>)[profile] ?? 'var(--space-16)',
    'role-margin': profile === 'base' ? '26px' : '0px',
    'role-width': mobile ? 'calc(100% - 2 * var(--space-4))' : 'min(924px, calc(100% - 2 * var(--space-4)))',
    'base-display': profile === 'base' ? 'block' : 'none', 'web-display': profile === 'base' ? 'none' : 'block',
    'crop-width': profile === 'min-1280' ? '105%' : '100%', 'crop-height': profile === 'min-1280' ? '102.93%' : '100%', 'crop-left': profile === 'min-1280' ? '-2.5%' : '0px',
  }
  scene.forEach((layer, index) => Object.entries({ x: layer.x, y: layer.y, w: layer.width, h: layer.height }).forEach(([key, value]) => { values[`${key}${index}`] = length(value) }))
  return values
}
const initialStyle = computed(() => {
  const variables: Record<string, string> = {}
  heroBreakpoints.forEach(profile => Object.entries(initialValues(profile)).forEach(([key, value]) => { variables[`--${profile}-${key}`] = value }))
  if (props.breakpoint) Object.entries(initialValues(props.breakpoint)).forEach(([key, value]) => { variables[`--initial-${key}`] = value })
  return variables
})
const normalizeTitle = (value: string) => value.replace(/\s+/g, ' ').trim()
const outlinedTitle = computed(() => normalizeTitle(props.title) === normalizeTitle(caseContent.hero.title))
const titleSlotStyle = computed(() => ({
  width: titleSlots[breakpoint.value].width * ratio.value + 'px',
  height: titleSlots[breakpoint.value].height * ratio.value + 'px',
}))
const titleAssetStyle = computed(() => ({
  left: titleSlots[breakpoint.value].x * ratio.value + 'px',
  top: titleSlots[breakpoint.value].y * ratio.value + 'px',
}))
const layerElements: HTMLElement[] = []
let latestOffsets:number[]=[]
let resizeObserver:ResizeObserver|undefined
let copyObserver:ResizeObserver|undefined
function geometryStyle(layer: HeroLayer, index: number) {
  return { left: layer.x * ratio.value + 'px', top: (layer.y * ratio.value + (index === 3 ? titleVerticalOffset.value : 0)) + 'px', width: layer.width * ratio.value + 'px', height: layer.height * ratio.value + 'px' }
}
const titleStyle = computed(() => ({
  '--name-height': reference.value.nameHeight * ratio.value + 'px',
  '--copy-width': reference.value.copyWidth * ratio.value + 'px',
  '--copy-padding-right': breakpoint.value === 'base' || breakpoint.value === 'min-1024' ? 'var(--space-1)' : 'var(--space-2)',
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
onMounted(async () => {
  sync()
  resizeObserver = new ResizeObserver(sync)
  resizeObserver.observe(root.value!)
  const content = root.value!.querySelector<HTMLElement>('.chirp-pr-hero__copy')!
  const measure = () => { copyContentHeight.value = content.getBoundingClientRect().height }
  copyObserver = new ResizeObserver(measure)
  copyObserver.observe(content)
  await nextTick()
  if (!root.value) return
  measure()
  await nextTick()
  if (!root.value) return
  ready.value = true
  window.addEventListener('resize', sync)
})
onUnmounted(()=>{resizeObserver?.disconnect();copyObserver?.disconnect();window.removeEventListener('resize',sync)})
defineExpose({ replayIntro, resetMotion })
</script>

<template>
  <section v-media-ready v-layered-scene ref="root" class="chirp-pr-hero" :data-breakpoint="breakpoint" :data-ready="ready" :style="initialStyle" data-motion="neutral"
    :aria-label="caseContent.pageTitle" @scene-ready="maybeIntro" @pointerdown="pointerDown">
  <LayeredSceneFallback name="chirp-pr-hero" />
    <div class="chirp-pr-hero__stage" :style="{ height: stageHeight + 'px' }">
    <div v-for="(layer, index) in layers" :key="index" :ref="element => setLayer(element, index)"
      class="chirp-pr-hero__layer" :class="{ 'chirp-pr-hero__title': index === 3, 'chirp-pr-hero__crop': index === 0 }"
      :data-layer="layer.name" :data-animation-enabled="layer.animationEnabled"
      :style="[geometryStyle(layer, index), index === 3 ? titleStyle : {}]">
      <picture v-if="index < 3" class="chirp-pr-hero__picture">
        <template v-if="index === 0 && !ready && !props.breakpoint"><source v-for="profile in initialProfiles" :key="profile.profile" :media="profile.media" :srcset="initialAsset(profile.profile, 'background')" /></template>
        <img :src="backgroundImage(index)" alt="" draggable="false" @load="maybeIntro"
          class="chirp-pr-hero__raster" :class="{ 'chirp-pr-hero__background-crop': index === 0 && breakpoint === 'min-1280' }" />
      </picture>
      <template v-else>
        <div class="chirp-pr-hero__wordmark" aria-hidden="true">
          <picture v-for="kind in (['name', 'logo'] as const)" :key="kind" class="chirp-pr-hero__picture">
            <template v-if="!ready && !props.breakpoint"><source v-for="profile in initialProfiles" :key="profile.profile" :media="profile.media" :srcset="initialAsset(profile.profile, kind)" /></template>
            <img :src="assets + reference.assetProfile + '/' + kind + '.svg'" alt="" draggable="false" @load="maybeIntro" :class="'chirp-pr-hero__' + kind" />
          </picture>
        </div>
        <div class="chirp-pr-hero__copy">
          <h1 class="chirp-pr-hero__heading" :class="{ 'chirp-pr-hero__heading--sr-only': outlinedTitle }"><TypoText :content="title" /></h1>
          <div v-if="outlinedTitle" class="chirp-pr-hero__case-title" :style="titleSlotStyle" aria-hidden="true">
            <picture class="chirp-pr-hero__picture">
              <template v-if="!ready && !props.breakpoint"><source v-for="profile in initialProfiles" :key="profile.profile" :media="profile.media" :srcset="initialAsset(profile.profile, 'title')" /></template>
              <img :src="assets + breakpoint + '/case-title.svg'" alt="" draggable="false" @load="maybeIntro" class="chirp-pr-hero__case-title-svg" :style="titleAssetStyle" />
            </picture>
          </div>
          <DsBadge type="HeroChirp" :label="badge" />
        </div>
      </template>
    </div>
    </div>
    <div class="chirp-pr-hero__role">
      <DsRoleFocus v-if="ready" :role="caseContent.hero.role" :focus="caseContent.hero.focus" :breakpoint="breakpoint === 'base' ? 'base' : 'min-425'" />
      <template v-else>
        <div class="chirp-pr-hero__initial-role-base"><DsRoleFocus :role="caseContent.hero.role" :focus="caseContent.hero.focus" breakpoint="base" /></div>
        <div class="chirp-pr-hero__initial-role-web"><DsRoleFocus :role="caseContent.hero.role" :focus="caseContent.hero.focus" breakpoint="min-425" /></div>
      </template>
    </div>
  </section>
</template>

<style scoped>
.chirp-pr-hero { position: relative; width: 100%; overflow: clip; background: var(--surface-default); touch-action: pan-y; }
.chirp-pr-hero__stage { position: relative; }
.chirp-pr-hero__role { display: flex; justify-content: center; padding: var(--space-16) 0; }
.chirp-pr-hero__role > * { width: min(924px, calc(100% - 2 * var(--space-4))); }
.chirp-pr-hero[data-breakpoint="base"] .chirp-pr-hero__role { margin-top: 26px; padding: var(--space-6) 0; }
.chirp-pr-hero[data-breakpoint="min-768"] .chirp-pr-hero__role { padding: var(--space-12) 0; }
.chirp-pr-hero[data-breakpoint="min-1024"] .chirp-pr-hero__role { padding: var(--space-8) 0; }
.chirp-pr-hero[data-breakpoint="base"] .chirp-pr-hero__role > *, .chirp-pr-hero[data-breakpoint="min-768"] .chirp-pr-hero__role > * { width: calc(100% - 2 * var(--space-4)); }
.chirp-pr-hero__layer { position: absolute; transform: translate3d(var(--parallax-x, 0px), 0, 0); will-change: transform; }
.chirp-pr-hero__raster { display: block; width: 100%; height: 100%; object-fit: cover; pointer-events: none; user-select: none; }
.chirp-pr-hero__crop { overflow: hidden; }
.chirp-pr-hero__background-crop { width: 105%; height: 102.93%; max-width: none; margin-left: -2.5%; }
.chirp-pr-hero__title { display: flex; flex-direction: column; align-items: flex-end; gap: 1px; }
.chirp-pr-hero[data-breakpoint="base"] .chirp-pr-hero__title, .chirp-pr-hero[data-breakpoint="min-768"] .chirp-pr-hero__title { gap: var(--space-2); }
.chirp-pr-hero__wordmark { position: relative; width: 100%; height: var(--name-height); flex: none; }
.chirp-pr-hero__name, .chirp-pr-hero__logo { position: absolute; display: block; max-width: none; transform: scale(var(--svg-scale)); transform-origin: top left; user-select: none; pointer-events: none; }
.chirp-pr-hero__name { left: 0; top: 0; }
.chirp-pr-hero__logo { left: var(--logo-x); top: var(--logo-y); }
.chirp-pr-hero__copy { display: flex; flex-direction: column; align-items: flex-start; gap: var(--space-3); box-sizing: content-box; width: var(--copy-width); padding-right: var(--copy-padding-right); }
.chirp-pr-hero__heading { margin: 0; width: 100%; color: var(--accent-aubergine); font-family: var(--text-font-sans); font-size: var(--title-size); font-weight: 500; line-height: 1.25; letter-spacing: .01em; text-align: right; white-space: nowrap; text-shadow: 2.276px 4.552px 15.054px rgb(44 31 57 / .1); font-variation-settings: "wght" 500, "GRAD" 0, "XOPQ" 96, "XTRA" 468, "YOPQ" 25, "YTAS" 750, "YTDE" -203, "YTFI" 738, "YTLC" 514, "YTUC" 712, "wdth" 100; }
.chirp-pr-hero__heading--sr-only { position: absolute; width: 1px; height: 1px; padding: 0; overflow: hidden; clip-path: inset(50%); border: 0; }
.chirp-pr-hero__case-title { position: relative; flex: none; }
.chirp-pr-hero__case-title-svg { position: absolute; display: block; max-width: none; transform: scale(var(--svg-scale)); transform-origin: top left; pointer-events: none; user-select: none; }
@media (prefers-reduced-motion: reduce) { .chirp-pr-hero__layer { will-change: auto; } }

/* Initial server paint uses the same scene profiles, selected by CSS. */
.chirp-pr-hero { container-type: inline-size; }
.chirp-pr-hero__picture { display: contents; }
.chirp-pr-hero {
  --initial-scale: var(--base-scale);
  --initial-title-top: var(--base-title-top);
  --initial-name-height: var(--base-name-height);
  --initial-copy-width: var(--base-copy-width);
  --initial-copy-padding: var(--base-copy-padding);
  --initial-title-size: var(--base-title-size);
  --initial-title-gap: var(--base-title-gap);
  --initial-logo-x: var(--base-logo-x);
  --initial-logo-y: var(--base-logo-y);
  --initial-slot-width: var(--base-slot-width);
  --initial-slot-height: var(--base-slot-height);
  --initial-slot-x: var(--base-slot-x);
  --initial-slot-y: var(--base-slot-y);
  --initial-role-padding: var(--base-role-padding);
  --initial-role-margin: var(--base-role-margin);
  --initial-role-width: var(--base-role-width);
  --initial-base-display: var(--base-base-display);
  --initial-web-display: var(--base-web-display);
  --initial-crop-width: var(--base-crop-width);
  --initial-crop-height: var(--base-crop-height);
  --initial-crop-left: var(--base-crop-left);
  --initial-x0: var(--base-x0);
  --initial-y0: var(--base-y0);
  --initial-w0: var(--base-w0);
  --initial-h0: var(--base-h0);
  --initial-x1: var(--base-x1);
  --initial-y1: var(--base-y1);
  --initial-w1: var(--base-w1);
  --initial-h1: var(--base-h1);
  --initial-x2: var(--base-x2);
  --initial-y2: var(--base-y2);
  --initial-w2: var(--base-w2);
  --initial-h2: var(--base-h2);
  --initial-x3: var(--base-x3);
  --initial-y3: var(--base-y3);
  --initial-w3: var(--base-w3);
  --initial-h3: var(--base-h3);
}
@media (min-width: 768px) {
.chirp-pr-hero {
  --initial-scale: var(--min-768-scale);
  --initial-title-top: var(--min-768-title-top);
  --initial-name-height: var(--min-768-name-height);
  --initial-copy-width: var(--min-768-copy-width);
  --initial-copy-padding: var(--min-768-copy-padding);
  --initial-title-size: var(--min-768-title-size);
  --initial-title-gap: var(--min-768-title-gap);
  --initial-logo-x: var(--min-768-logo-x);
  --initial-logo-y: var(--min-768-logo-y);
  --initial-slot-width: var(--min-768-slot-width);
  --initial-slot-height: var(--min-768-slot-height);
  --initial-slot-x: var(--min-768-slot-x);
  --initial-slot-y: var(--min-768-slot-y);
  --initial-role-padding: var(--min-768-role-padding);
  --initial-role-margin: var(--min-768-role-margin);
  --initial-role-width: var(--min-768-role-width);
  --initial-base-display: var(--min-768-base-display);
  --initial-web-display: var(--min-768-web-display);
  --initial-crop-width: var(--min-768-crop-width);
  --initial-crop-height: var(--min-768-crop-height);
  --initial-crop-left: var(--min-768-crop-left);
  --initial-x0: var(--min-768-x0);
  --initial-y0: var(--min-768-y0);
  --initial-w0: var(--min-768-w0);
  --initial-h0: var(--min-768-h0);
  --initial-x1: var(--min-768-x1);
  --initial-y1: var(--min-768-y1);
  --initial-w1: var(--min-768-w1);
  --initial-h1: var(--min-768-h1);
  --initial-x2: var(--min-768-x2);
  --initial-y2: var(--min-768-y2);
  --initial-w2: var(--min-768-w2);
  --initial-h2: var(--min-768-h2);
  --initial-x3: var(--min-768-x3);
  --initial-y3: var(--min-768-y3);
  --initial-w3: var(--min-768-w3);
  --initial-h3: var(--min-768-h3);
}
}
@media (min-width: 1024px) {
.chirp-pr-hero {
  --initial-scale: var(--min-1024-scale);
  --initial-title-top: var(--min-1024-title-top);
  --initial-name-height: var(--min-1024-name-height);
  --initial-copy-width: var(--min-1024-copy-width);
  --initial-copy-padding: var(--min-1024-copy-padding);
  --initial-title-size: var(--min-1024-title-size);
  --initial-title-gap: var(--min-1024-title-gap);
  --initial-logo-x: var(--min-1024-logo-x);
  --initial-logo-y: var(--min-1024-logo-y);
  --initial-slot-width: var(--min-1024-slot-width);
  --initial-slot-height: var(--min-1024-slot-height);
  --initial-slot-x: var(--min-1024-slot-x);
  --initial-slot-y: var(--min-1024-slot-y);
  --initial-role-padding: var(--min-1024-role-padding);
  --initial-role-margin: var(--min-1024-role-margin);
  --initial-role-width: var(--min-1024-role-width);
  --initial-base-display: var(--min-1024-base-display);
  --initial-web-display: var(--min-1024-web-display);
  --initial-crop-width: var(--min-1024-crop-width);
  --initial-crop-height: var(--min-1024-crop-height);
  --initial-crop-left: var(--min-1024-crop-left);
  --initial-x0: var(--min-1024-x0);
  --initial-y0: var(--min-1024-y0);
  --initial-w0: var(--min-1024-w0);
  --initial-h0: var(--min-1024-h0);
  --initial-x1: var(--min-1024-x1);
  --initial-y1: var(--min-1024-y1);
  --initial-w1: var(--min-1024-w1);
  --initial-h1: var(--min-1024-h1);
  --initial-x2: var(--min-1024-x2);
  --initial-y2: var(--min-1024-y2);
  --initial-w2: var(--min-1024-w2);
  --initial-h2: var(--min-1024-h2);
  --initial-x3: var(--min-1024-x3);
  --initial-y3: var(--min-1024-y3);
  --initial-w3: var(--min-1024-w3);
  --initial-h3: var(--min-1024-h3);
}
}
@media (min-width: 1280px) {
.chirp-pr-hero {
  --initial-scale: var(--min-1280-scale);
  --initial-title-top: var(--min-1280-title-top);
  --initial-name-height: var(--min-1280-name-height);
  --initial-copy-width: var(--min-1280-copy-width);
  --initial-copy-padding: var(--min-1280-copy-padding);
  --initial-title-size: var(--min-1280-title-size);
  --initial-title-gap: var(--min-1280-title-gap);
  --initial-logo-x: var(--min-1280-logo-x);
  --initial-logo-y: var(--min-1280-logo-y);
  --initial-slot-width: var(--min-1280-slot-width);
  --initial-slot-height: var(--min-1280-slot-height);
  --initial-slot-x: var(--min-1280-slot-x);
  --initial-slot-y: var(--min-1280-slot-y);
  --initial-role-padding: var(--min-1280-role-padding);
  --initial-role-margin: var(--min-1280-role-margin);
  --initial-role-width: var(--min-1280-role-width);
  --initial-base-display: var(--min-1280-base-display);
  --initial-web-display: var(--min-1280-web-display);
  --initial-crop-width: var(--min-1280-crop-width);
  --initial-crop-height: var(--min-1280-crop-height);
  --initial-crop-left: var(--min-1280-crop-left);
  --initial-x0: var(--min-1280-x0);
  --initial-y0: var(--min-1280-y0);
  --initial-w0: var(--min-1280-w0);
  --initial-h0: var(--min-1280-h0);
  --initial-x1: var(--min-1280-x1);
  --initial-y1: var(--min-1280-y1);
  --initial-w1: var(--min-1280-w1);
  --initial-h1: var(--min-1280-h1);
  --initial-x2: var(--min-1280-x2);
  --initial-y2: var(--min-1280-y2);
  --initial-w2: var(--min-1280-w2);
  --initial-h2: var(--min-1280-h2);
  --initial-x3: var(--min-1280-x3);
  --initial-y3: var(--min-1280-y3);
  --initial-w3: var(--min-1280-w3);
  --initial-h3: var(--min-1280-h3);
}
}
@media (min-width: 1440px) {
.chirp-pr-hero {
  --initial-scale: var(--min-1440-scale);
  --initial-title-top: var(--min-1440-title-top);
  --initial-name-height: var(--min-1440-name-height);
  --initial-copy-width: var(--min-1440-copy-width);
  --initial-copy-padding: var(--min-1440-copy-padding);
  --initial-title-size: var(--min-1440-title-size);
  --initial-title-gap: var(--min-1440-title-gap);
  --initial-logo-x: var(--min-1440-logo-x);
  --initial-logo-y: var(--min-1440-logo-y);
  --initial-slot-width: var(--min-1440-slot-width);
  --initial-slot-height: var(--min-1440-slot-height);
  --initial-slot-x: var(--min-1440-slot-x);
  --initial-slot-y: var(--min-1440-slot-y);
  --initial-role-padding: var(--min-1440-role-padding);
  --initial-role-margin: var(--min-1440-role-margin);
  --initial-role-width: var(--min-1440-role-width);
  --initial-base-display: var(--min-1440-base-display);
  --initial-web-display: var(--min-1440-web-display);
  --initial-crop-width: var(--min-1440-crop-width);
  --initial-crop-height: var(--min-1440-crop-height);
  --initial-crop-left: var(--min-1440-crop-left);
  --initial-x0: var(--min-1440-x0);
  --initial-y0: var(--min-1440-y0);
  --initial-w0: var(--min-1440-w0);
  --initial-h0: var(--min-1440-h0);
  --initial-x1: var(--min-1440-x1);
  --initial-y1: var(--min-1440-y1);
  --initial-w1: var(--min-1440-w1);
  --initial-h1: var(--min-1440-h1);
  --initial-x2: var(--min-1440-x2);
  --initial-y2: var(--min-1440-y2);
  --initial-w2: var(--min-1440-w2);
  --initial-h2: var(--min-1440-h2);
  --initial-x3: var(--min-1440-x3);
  --initial-y3: var(--min-1440-y3);
  --initial-w3: var(--min-1440-w3);
  --initial-h3: var(--min-1440-h3);
}
}
@media (min-width: 1920px) {
.chirp-pr-hero {
  --initial-scale: var(--min-1920-scale);
  --initial-title-top: var(--min-1920-title-top);
  --initial-name-height: var(--min-1920-name-height);
  --initial-copy-width: var(--min-1920-copy-width);
  --initial-copy-padding: var(--min-1920-copy-padding);
  --initial-title-size: var(--min-1920-title-size);
  --initial-title-gap: var(--min-1920-title-gap);
  --initial-logo-x: var(--min-1920-logo-x);
  --initial-logo-y: var(--min-1920-logo-y);
  --initial-slot-width: var(--min-1920-slot-width);
  --initial-slot-height: var(--min-1920-slot-height);
  --initial-slot-x: var(--min-1920-slot-x);
  --initial-slot-y: var(--min-1920-slot-y);
  --initial-role-padding: var(--min-1920-role-padding);
  --initial-role-margin: var(--min-1920-role-margin);
  --initial-role-width: var(--min-1920-role-width);
  --initial-base-display: var(--min-1920-base-display);
  --initial-web-display: var(--min-1920-web-display);
  --initial-crop-width: var(--min-1920-crop-width);
  --initial-crop-height: var(--min-1920-crop-height);
  --initial-crop-left: var(--min-1920-crop-left);
  --initial-x0: var(--min-1920-x0);
  --initial-y0: var(--min-1920-y0);
  --initial-w0: var(--min-1920-w0);
  --initial-h0: var(--min-1920-h0);
  --initial-x1: var(--min-1920-x1);
  --initial-y1: var(--min-1920-y1);
  --initial-w1: var(--min-1920-w1);
  --initial-h1: var(--min-1920-h1);
  --initial-x2: var(--min-1920-x2);
  --initial-y2: var(--min-1920-y2);
  --initial-w2: var(--min-1920-w2);
  --initial-h2: var(--min-1920-h2);
  --initial-x3: var(--min-1920-x3);
  --initial-y3: var(--min-1920-y3);
  --initial-w3: var(--min-1920-w3);
  --initial-h3: var(--min-1920-h3);
}
}

.chirp-pr-hero[data-ready="false"] .chirp-pr-hero__stage { height: auto !important; padding-top: var(--initial-title-top); }
.chirp-pr-hero[data-ready="false"] .chirp-pr-hero__role { padding: var(--initial-role-padding) 0; margin-top: var(--initial-role-margin); }
.chirp-pr-hero[data-ready="false"] .chirp-pr-hero__role > * { width: var(--initial-role-width); }
.chirp-pr-hero__initial-role-base { display: var(--initial-base-display); }
.chirp-pr-hero__initial-role-web { display: var(--initial-web-display); }
.chirp-pr-hero[data-ready="false"] .chirp-pr-hero__layer:nth-child(1) { left: var(--initial-x0) !important; top: var(--initial-y0) !important; width: var(--initial-w0) !important; height: var(--initial-h0) !important; }
.chirp-pr-hero[data-ready="false"] .chirp-pr-hero__layer:nth-child(2) { left: var(--initial-x1) !important; top: var(--initial-y1) !important; width: var(--initial-w1) !important; height: var(--initial-h1) !important; }
.chirp-pr-hero[data-ready="false"] .chirp-pr-hero__layer:nth-child(3) { left: var(--initial-x2) !important; top: var(--initial-y2) !important; width: var(--initial-w2) !important; height: var(--initial-h2) !important; }
.chirp-pr-hero[data-ready="false"] .chirp-pr-hero__layer:nth-child(4) { left: var(--initial-x3) !important; top: var(--initial-y3) !important; width: var(--initial-w3) !important; height: var(--initial-h3) !important; }

.chirp-pr-hero[data-ready="false"] .chirp-pr-hero__layer.chirp-pr-hero__title {
 position: relative; top: 0 !important; height: auto !important; gap: var(--initial-title-gap);
 --name-height: var(--initial-name-height) !important; --copy-width: var(--initial-copy-width) !important;
 --copy-padding-right: var(--initial-copy-padding) !important; --title-size: var(--initial-title-size) !important;
 --svg-scale: var(--initial-scale) !important; --logo-x: var(--initial-logo-x) !important; --logo-y: var(--initial-logo-y) !important;
}
.chirp-pr-hero[data-ready="false"] .chirp-pr-hero__case-title { width: var(--initial-slot-width) !important; height: var(--initial-slot-height) !important; }
.chirp-pr-hero[data-ready="false"] .chirp-pr-hero__case-title-svg { left: var(--initial-slot-x) !important; top: var(--initial-slot-y) !important; }
.chirp-pr-hero[data-ready="false"] .chirp-pr-hero__layer:first-child .chirp-pr-hero__raster { width: var(--initial-crop-width); height: var(--initial-crop-height); margin-left: var(--initial-crop-left); }

</style>
