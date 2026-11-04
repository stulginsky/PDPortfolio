<script setup lang="ts">
import { siteUrl } from '../utils/site-url'

import {computed,ref} from 'vue'
import DsBadge from './DsBadge.vue'
import TypoText from './TypoText.vue'
import './showcase-card-layout.css'
import content from '../../content/pd-portfolio-ds.json'

const emit=defineEmits<{activate:[event:MouseEvent|KeyboardEvent]}>()
const hovered=ref(false),pressed=ref(false)
const state=computed(()=>pressed.value?'ActivePressed':hovered.value?'Hover':'Default')
function enter(e:PointerEvent){if(e.pointerType==='mouse'&&matchMedia('(hover:hover)').matches)hovered.value=true}
function down(e:PointerEvent){if(e.button!==0)return;pressed.value=true;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)}
function up(e:PointerEvent){pressed.value=false;const r=(e.currentTarget as HTMLElement).getBoundingClientRect();hovered.value=e.pointerType==='mouse'&&matchMedia('(hover:hover)').matches&&e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom}
function reset(){pressed.value=false;hovered.value=false}
function keydown(e:KeyboardEvent){if(e.key==='Escape')reset();if(e.key==='Enter'||e.key===' '){e.preventDefault();pressed.value=true}}
function keyup(e:KeyboardEvent){if(e.key==='Enter'||e.key===' '){e.preventDefault();const activate=pressed.value;pressed.value=false;if(activate)emit('activate',e)}}

import {pdPortfolioDsProfiles} from './pd-portfolio-ds.geometry'
type Profile=typeof pdPortfolioDsProfiles[number]
type Frame={x:number;y:number;w:number;h:number;angle:number}
const stateIndex=computed(()=>pressed.value?2:hovered.value?1:0)
const asset=(src:string)=>'/showcase/pd-portfolio-ds/'+src
function selected(profile:Profile){return profile.states[stateIndex.value]}
function frameStyle(f:Frame,native:{w:number;h:number}){return {width:native.w+'px',height:native.h+'px',transform:`translate3d(${f.x}px,${f.y}px,0) rotate(${f.angle}deg) scale(${f.w/native.w},${f.h/native.h})`}}
</script>

<template>
 <div class="pd-portfolio-ds showcase-card" role="button" tabindex="0" :aria-label="content.title" :data-state="state"
  @pointerenter="enter" @pointerleave="hovered=false" @pointerdown="down" @pointerup="up" @pointercancel="reset" @blur="reset" @keydown="keydown" @keyup="keyup" @click="emit('activate',$event)">
  <div v-for="profile in pdPortfolioDsProfiles" :key="profile.name" class="pd-portfolio-ds__art" :data-profile="profile.name" :style="{'--art-width':profile.width+'px'}" aria-hidden="true">
   <div v-for="layer in selected(profile).layers" :key="layer.name" class="pd-portfolio-ds__layer" :data-layer="layer.name" :style="frameStyle(layer.frame,layer.intrinsic)">
    <img class="pd-portfolio-ds__native" :src="siteUrl(asset(layer.src))" alt="" draggable="false" />
   </div>
  </div>
  <div class="pd-portfolio-ds__blur" aria-hidden="true" />
  <div class="pd-portfolio-ds__gradient" aria-hidden="true" />
  <div class="pd-portfolio-ds__copy">
   <div class="pd-portfolio-ds__title-block"><TypoText tag="h2" class="pd-portfolio-ds__title" :content="content.title" /><TypoText tag="p" class="pd-portfolio-ds__subtitle" :content="content.subtitle" /></div>
   <ul class="pd-portfolio-ds__badges" aria-label="Специализации"><li v-for="badge in content.badges" :key="badge"><span class="pd-portfolio-ds__badge-base"><DsBadge :label="badge" type="CardCompact" /></span><span class="pd-portfolio-ds__badge-default"><DsBadge :label="badge" type="Card" /></span></li></ul>
  </div>
 </div>
</template>

<style scoped>
.pd-portfolio-ds {--motion-duration:300ms;position:relative;isolation:isolate;overflow:hidden;border-radius:var(--radius-xlg);background:var(--decorative-showcase-pd-portfolio-ds-background);color:var(--text-inverse);cursor:pointer;font-family:var(--text-font-sans);}
.pd-portfolio-ds[data-state=ActivePressed] {--motion-duration:150ms;}
.pd-portfolio-ds__art {position:absolute;left:calc((100cqw - var(--art-width)) / 2);top:0;width:var(--art-width);height:532px;pointer-events:none;}
.pd-portfolio-ds__art[data-profile=min-768] {display:none;}
.pd-portfolio-ds__layer {position:absolute;left:0;top:0;width:100px;height:100px;transform-origin:0 0;transition:transform var(--motion-duration) ease-out;will-change:transform;backface-visibility:hidden;}
.pd-portfolio-ds__native {position:absolute;left:0;top:0;display:block;max-width:none;transform-origin:0 0;user-select:none;}
.pd-portfolio-ds__blur {position:absolute;inset:auto 0 0;height:200px;backdrop-filter:blur(30px);background:rgb(0 0 0 / .01);mask-image:linear-gradient(to bottom,transparent,black);pointer-events:none;}
.pd-portfolio-ds__gradient {position:absolute;inset:0;background:linear-gradient(to bottom,transparent 19.2307696%,rgb(0 0 0 / .6) 75%,rgb(0 0 0 / .65));pointer-events:none;}
.pd-portfolio-ds__copy {position:absolute;inset:auto var(--space-4) var(--space-4);display:flex;flex-direction:column;gap:var(--space-3);pointer-events:none;}
.pd-portfolio-ds__title-block {display:flex;flex-direction:column;gap:var(--space-1);}
.pd-portfolio-ds__title,.pd-portfolio-ds__subtitle {margin:0;font-weight:600;font-optical-sizing:auto;font-variation-settings:var(--heading-22-font-variation);}
.pd-portfolio-ds__title {font-size:calc(18.333333px * var(--showcase-copy-scale));line-height:1.3;letter-spacing:.03em;}
.pd-portfolio-ds__subtitle {font-size:calc(13.333333px * var(--showcase-copy-scale));line-height:1.5;font-variation-settings:var(--heading-16-font-variation);}
.pd-portfolio-ds__badges {display:flex;flex-wrap:wrap;gap:var(--space-2);margin:0;padding:0;list-style:none;}
.pd-portfolio-ds__badges li,.pd-portfolio-ds__badge-base {display:flex;}
.pd-portfolio-ds__badge-default {display:none;}
.pd-portfolio-ds:focus-visible {outline:2px solid var(--border-focus);outline-offset:3px;}



@media(min-width:462px){
.pd-portfolio-ds__art[data-profile=base] {display:none;}.pd-portfolio-ds__art[data-profile=min-768] {display:block;}
.pd-portfolio-ds__title {font-size:calc(22px * var(--showcase-copy-scale));}
.pd-portfolio-ds__subtitle {font-size:calc(16px * var(--showcase-copy-scale));}
.pd-portfolio-ds__badge-base {display:none;}.pd-portfolio-ds__badge-default {display:flex;}
}
@media(prefers-reduced-motion:reduce){.pd-portfolio-ds__layer{transition:none!important;}}
</style>

