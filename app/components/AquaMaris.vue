<script setup lang="ts">
import { siteUrl } from '../utils/site-url'

import {computed,ref} from 'vue'
import DsBadge from './DsBadge.vue'
import TypoText from './TypoText.vue'
import './showcase-card-layout.css'
import content from '../../content/aqua-maris.json'

const emit=defineEmits<{activate:[event:MouseEvent|KeyboardEvent]}>()
const hovered=ref(false),pressed=ref(false)
const state=computed(()=>pressed.value?'ActivePressed':hovered.value?'Hover':'Default')
function enter(e:PointerEvent){if(e.pointerType==='mouse'&&matchMedia('(hover:hover)').matches)hovered.value=true}
function down(e:PointerEvent){if(e.button!==0)return;pressed.value=true;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)}
function up(e:PointerEvent){pressed.value=false;const r=(e.currentTarget as HTMLElement).getBoundingClientRect();hovered.value=e.pointerType==='mouse'&&matchMedia('(hover:hover)').matches&&e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom}
function reset(){pressed.value=false;hovered.value=false}
function keydown(e:KeyboardEvent){if(e.key==='Escape')reset();if(e.key==='Enter'||e.key===' '){e.preventDefault();pressed.value=true}}
function keyup(e:KeyboardEvent){if(e.key==='Enter'||e.key===' '){e.preventDefault();const activate=pressed.value;pressed.value=false;if(activate)emit('activate',e)}}
</script>

<template>
 <div class="aqua-maris showcase-card" role="button" tabindex="0" :aria-label="content.title" :data-state="state"
  @pointerenter="enter" @pointerleave="hovered=false" @pointerdown="down" @pointerup="up" @pointercancel="reset" @blur="reset" @keydown="keydown" @keyup="keyup" @click="emit('activate',$event)">
  <img class="aqua-maris__image" :src="siteUrl('/showcase/aqua-maris/aqua-maris-back.png')" width="431" height="552" alt="" draggable="false" />
  <div class="aqua-maris__blur" aria-hidden="true" />
  <div class="aqua-maris__gradient" aria-hidden="true" />
  <div class="aqua-maris__copy">
   <div class="aqua-maris__title-block"><TypoText tag="h2" class="aqua-maris__title" :content="content.title" /><TypoText tag="p" class="aqua-maris__subtitle" :content="content.subtitle" /></div>
   <ul class="aqua-maris__badges" aria-label="Специализации"><li v-for="badge in content.badges" :key="badge"><span class="aqua-maris__badge-base"><DsBadge :label="badge" type="CardCompact" /></span><span class="aqua-maris__badge-default"><DsBadge :label="badge" type="Card" /></span></li></ul>
  </div>
 </div>
</template>

<style scoped>
.aqua-maris {--art-width:288px;--x:-29px;--y:-40px;--zoom:1;--angle:0deg;position:relative;isolation:isolate;overflow:hidden;border-radius:var(--radius-xlg);background:var(--decorative-showcase-aqua-maris-background);color:var(--text-inverse);cursor:pointer;font-family:var(--text-font-sans);}
.aqua-maris[data-state=Hover]{--x:-249.879119873px;--y:-171.140853882px;--zoom:1.643291429;--angle:-15deg;}
.aqua-maris[data-state=ActivePressed]{--x:-217.93359375px;--y:-50.980957031px;--zoom:1.317003998;--angle:-22.458750548deg;}
.aqua-maris__image {--art-scale:max(1,calc(100cqw / var(--art-width)));position:absolute;left:0;top:0;width:431px;height:552px;max-width:none;transform-origin:0 0;transform:translate(calc((100cqw - var(--art-width) * var(--art-scale)) / 2 + var(--x) * var(--art-scale)),calc(var(--y) * var(--art-scale))) rotate(var(--angle)) scale(calc(var(--zoom) * var(--art-scale)));transition:transform 300ms ease-out;pointer-events:none;user-select:none;}
.aqua-maris[data-state=ActivePressed] .aqua-maris__image {transition-duration:150ms;}
.aqua-maris__blur {position:absolute;inset:auto 0 0;height:200px;backdrop-filter:blur(30px);background:rgb(0 0 0 / .01);mask-image:linear-gradient(to bottom,transparent,black);pointer-events:none;}
.aqua-maris__gradient {position:absolute;inset:0;background:linear-gradient(to bottom,transparent 19.2307696%,rgb(0 0 0 / .6) 75%,rgb(0 0 0 / .65) 100%);pointer-events:none;}
.aqua-maris__copy {position:absolute;inset:auto var(--space-4) var(--space-4);display:flex;flex-direction:column;gap:var(--space-3);pointer-events:none;}
.aqua-maris__title-block {display:flex;flex-direction:column;gap:var(--space-1);}
.aqua-maris__title,.aqua-maris__subtitle {margin:0;font-weight:600;font-optical-sizing:auto;font-variation-settings:var(--heading-22-font-variation);}
.aqua-maris__title {font-size:calc(22px * var(--showcase-copy-scale));line-height:1.3;letter-spacing:.03em;}
.aqua-maris__subtitle {font-size:calc(16px * var(--showcase-copy-scale));line-height:1.5;font-variation-settings:var(--heading-16-font-variation);}
.aqua-maris__badges {display:flex;flex-wrap:wrap;gap:var(--space-2);margin:0;padding:0;list-style:none;}
.aqua-maris__badges li,.aqua-maris__badge-base {display:flex;}
.aqua-maris__badge-default {display:none;}
.aqua-maris:focus-visible {outline:2px solid var(--border-focus);outline-offset:3px;}
@media(min-width:462px){
 .aqua-maris {--art-width:430px;--x:1px;--y:-20px;}
 .aqua-maris[data-state=Hover]{--x:-192px;--y:-112.9921875px;--zoom:1.53748450755;--angle:-15deg;}
 .aqua-maris[data-state=ActivePressed]{--x:-121.146522522px;--y:-95.554046631px;--zoom:1.347269505193;--angle:-10.415005350deg;}
 .aqua-maris__badge-base {display:none;}
 .aqua-maris__badge-default {display:flex;}
}
@media(prefers-reduced-motion:reduce){.aqua-maris__image{transition:none!important;}}
</style>
