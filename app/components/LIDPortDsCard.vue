<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { siteUrl } from '../utils/site-url'
import DsBadge from './DsBadge.vue'
import TypoText from './TypoText.vue'
import copy from '../../content/lidport-ds-card.json'
import { lidPortDsCardGeometry, type LIDPortDsCardRect } from './lidport-ds-card.geometry'

const props = withDefaults(defineProps<{ title?: string; subtitle?: string; badges?: string[]; href?: string }>(), {
  title: copy.title, subtitle: copy.subtitle, badges: () => copy.badges, href: copy.href,
})
const backSource = '/showcase/lidport-ds/lidport-card-back.png'
const window1Source = '/showcase/lidport-ds/window1.png'
const window2Source = '/showcase/lidport-ds/window2.png'
const root = ref<HTMLElement>()
const viewport = ref(320)
const width = ref(288)
const hovered = ref(false)
const pressed = ref(false)
const breakpoint = computed(() => viewport.value >= 768 ? 'min-768' : 'base')
const state = computed(() => pressed.value ? 'ActivePressed' : hovered.value ? 'Hover' : 'Default')
const geometry = computed(() => lidPortDsCardGeometry[breakpoint.value][state.value])
const referenceWidth = computed(() => breakpoint.value === 'base' ? 288 : 430)
const height = computed(() => viewport.value >= 462 ? 532 : 500)
const rootStyle = computed(() => ({ height: `${height.value}px`, '--card-duration': state.value === 'ActivePressed' ? '150ms' : '300ms' }))
function style(rect: LIDPortDsCardRect) { return { left: `${rect.x + (width.value - referenceWidth.value) / 2}px`, top: `${rect.y}px`, width: `${rect.width}px`, height: `${rect.height}px`, opacity: rect.opacity ?? 1, filter: rect.shadow ? 'drop-shadow(7px 18px 23.2px rgb(0 0 0 / 25%))' : 'none' } }
function window2OverlayStyle() { return { ...style(geometry.value.window2), opacity: state.value === 'Hover' ? geometry.value.window2.opacity ?? 1 : 0 } }
function canHover(e: PointerEvent) { return e.pointerType === 'mouse' && matchMedia('(hover:hover)').matches }
function sync() { viewport.value = innerWidth; width.value = root.value?.clientWidth || referenceWidth.value }
function release() { pressed.value = false }
let observer: ResizeObserver | undefined
onMounted(() => { sync(); observer = new ResizeObserver(sync); if (root.value) observer.observe(root.value); addEventListener('resize', sync); addEventListener('pointerup', release); addEventListener('pointercancel', release) })
onUnmounted(() => { observer?.disconnect(); removeEventListener('resize', sync); removeEventListener('pointerup', release); removeEventListener('pointercancel', release) })
</script>

<template>
  <a ref="root" class="lidport-card showcase-card" :href="siteUrl(props.href)" :style="rootStyle" :data-state="state" :data-breakpoint="breakpoint"
    @pointerenter="e => { if (canHover(e)) hovered = true }" @pointerleave="hovered = false; pressed = false" @pointerdown="e => { if (e.button === 0) pressed = true }" @pointerup="release" @pointercancel="release" @dragstart.prevent>
    <div class="lidport-card__pict" aria-hidden="true">
      <img class="lidport-card__layer" :src="siteUrl(backSource)" :style="style(geometry.background)" alt="" draggable="false">
      <div class="lidport-card__layer lidport-card__window1" :style="style(geometry.window1)"><img :src="siteUrl(window1Source)" alt="" draggable="false"></div>
      <img class="lidport-card__layer lidport-card__window2" :src="siteUrl(window2Source)" :style="style(geometry.window2)" alt="" draggable="false">
      <img class="lidport-card__layer lidport-card__window2-overlay" :src="siteUrl(window2Source)" :style="window2OverlayStyle()" alt="" draggable="false">
    </div>
    <div class="lidport-card__cred">
      <div class="lidport-card__blur" aria-hidden="true" />
      <div class="lidport-card__gradient" aria-hidden="true" />
      <div class="lidport-card__copy">
        <div class="lidport-card__title-block"><TypoText tag="h2" class="lidport-card__title" :content="props.title" /><TypoText tag="p" class="lidport-card__subtitle" :content="props.subtitle" /></div>
        <ul class="lidport-card__badges" aria-label="Специализации"><li v-for="badge in props.badges" :key="badge"><DsBadge :label="badge" :type="viewport < 410 ? 'CardCompact' : 'Card'" /></li></ul>
      </div>
    </div>
  </a>
</template>

<style scoped>
.lidport-card { position:relative; display:block; isolation:isolate; overflow:hidden; width:100%; max-width:430px; border-radius:24px; background:#e8e9ec; color:var(--text-inverse); font-family:var(--text-font-sans); text-decoration:none }
.lidport-card__pict { position:absolute; inset:0; height:539px; overflow:hidden }
.lidport-card__layer { position:absolute; max-width:none; object-fit:cover; will-change:left,top,width,height,opacity; transition:left var(--card-duration) ease-out,top var(--card-duration) ease-out,width var(--card-duration) ease-out,height var(--card-duration) ease-out,opacity var(--card-duration) ease-out,filter var(--card-duration) ease-out }
.lidport-card__window1 { z-index:2; overflow:hidden }.lidport-card__window2 { z-index:1 }.lidport-card__window2-overlay { z-index:3; pointer-events:none }.lidport-card__window1 img { position:absolute; left:0; top:-2.53%; width:138.31%; height:113.96%; max-width:none; object-fit:cover }
.lidport-card__cred { position:absolute; z-index:4; inset:0; pointer-events:none }
.lidport-card__blur { position:absolute; z-index:1; right:0; bottom:0; left:0; height:200px; overflow:hidden; background:rgb(0 0 0 / 1%); backdrop-filter:blur(60px); -webkit-backdrop-filter:blur(60px); mask-image:linear-gradient(to bottom,transparent,black); -webkit-mask-image:linear-gradient(to bottom,transparent,black); transform:translateZ(0); contain:paint }
.lidport-card__gradient { position:absolute; z-index:2; inset:0; background:linear-gradient(180deg,transparent 19.231%,rgb(0 0 0 / 60%) 75%,rgb(0 0 0 / 65%) 100%) }
.lidport-card__copy { position:absolute; z-index:3; right:16px; bottom:16px; left:16px; display:flex; flex-direction:column; gap:12px }
.lidport-card__title-block { display:flex; flex-direction:column; gap:4px }.lidport-card__title,.lidport-card__subtitle { margin:0; font-weight:var(--text-weight-semibold); font-variation-settings:var(--font-variation-heading-md) }
.lidport-card__title { font-size:18.333px; line-height:1.3; letter-spacing:.03em }.lidport-card__subtitle { font-size:13.333px; line-height:1.5 }
.lidport-card__badges { display:flex; flex-wrap:wrap; gap:8px; margin:0; padding:0; list-style:none }.lidport-card__badges li { display:flex }
.lidport-card:focus-visible { outline:2px solid var(--border-focus); outline-offset:3px }
@media(min-width:410px){.lidport-card__title{font-size:22px}.lidport-card__subtitle{font-size:16px}}
@media(prefers-reduced-motion:reduce){.lidport-card__layer{transition:none}}
</style>
