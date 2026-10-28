<script setup lang="ts">
import TypoText from './TypoText.vue'
import { vMediaReady } from './media-readiness'
import './case-content-grid.css'

withDefaults(defineProps<{
 title:string
 body:string
 eyebrow?:string
 src:string
 /** Desktop media frame dimensions; Base uses the authored 544:342 frame. */
 width:number
 height:number
 alt?:string
}>(),{alt:''})
</script>

<template>
 <article class="case-content-card">
  <div v-media-ready class="case-content-card__media media-skeleton" :style="{'--case-card-media-ratio':width+'/'+height}">
   <img :src="src" :width="width" :height="height" :alt="alt" loading="lazy" />
  </div>
  <div class="case-content-card__copy">
   <div class="case-content-card__eyebrow-slot"><TypoText v-if="eyebrow" tag="p" class="case-content-card__eyebrow" :content="eyebrow" /></div>
   <TypoText tag="h3" class="case-content-card__title" :content="title" />
   <TypoText tag="p" class="case-content-card__body" :content="body" />
  </div>
 </article>
</template>

<style scoped>
.case-content-card { display:flex; flex-direction:column; gap:var(--space-2); width:100%; max-width:544px; min-width:0; padding:0; border:0; border-radius:var(--radius-xlg); box-sizing:border-box; font-family:var(--text-font-sans); font-optical-sizing:auto; }
.case-content-card__media { position:relative; width:100%; flex:none; aspect-ratio:544/342; border-radius:var(--radius-lg); overflow:hidden; }
.case-content-card__media img { position:absolute; inset:0; display:block; width:100%; height:100%; object-fit:cover; object-position:center; }
.case-content-card__copy { display:flex; flex-direction:column; gap:var(--space-3); }
.case-content-card__copy > * { margin:0; }
.case-content-card__eyebrow-slot { min-height:26px; }
.case-content-card__eyebrow-slot > * { margin:0; }
.case-content-card__eyebrow { color:var(--text-secondary); font-size:var(--text-size-16); line-height:26px; font-weight:400; letter-spacing:0; font-variation-settings:var(--body-16-regular-font-variation); }
.case-content-card__title { color:var(--text-default); font-size:var(--text-size-24); line-height:30px; font-weight:600; letter-spacing:0; font-variation-settings:var(--heading-24-font-variation); overflow-wrap:break-word; }
.case-content-card__body { color:var(--text-default); font-size:var(--text-size-16); line-height:26px; font-weight:400; letter-spacing:0; font-variation-settings:var(--body-16-regular-font-variation); white-space:pre-wrap; }
@media(min-width:934px) {
@container case-content-layout (min-width:790px) {
 .case-content-card { min-width:368px; max-width:852px; padding:var(--space-12); border:1px solid var(--border-case-card); }
 .case-content-card__media { aspect-ratio:var(--case-card-media-ratio); }
 .case-content-card__eyebrow-slot { min-height:32px; }
 .case-content-card__eyebrow { font-size:var(--text-size-20); line-height:32px; font-weight:300; letter-spacing:.01em; font-variation-settings:var(--body-20-regular-font-variation); }
}
@container case-content-layout (min-width:1776px) {
 .case-content-card__title { font-size:var(--text-size-32); line-height:38px; letter-spacing:.015em; font-variation-settings:var(--heading-32-font-variation); }
 .case-content-card__body { font-size:var(--text-size-20); line-height:32px; font-weight:300; letter-spacing:.01em; font-variation-settings:var(--body-20-regular-font-variation); }
}
}
</style>

