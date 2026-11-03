<script setup lang="ts">
import {computed,ref} from 'vue'
import DsBadge from './DsBadge.vue'
import TypoText from './TypoText.vue'
import './showcase-card-layout.css'
import content from '../../content/sapsan-cr.json'

const emit=defineEmits<{activate:[event:MouseEvent|KeyboardEvent]}>()
const hovered=ref(false),pressed=ref(false)
const state=computed(()=>pressed.value?'ActivePressed':hovered.value?'Hover':'Default')
function enter(e:PointerEvent){if(e.pointerType==='mouse'&&matchMedia('(hover:hover)').matches)hovered.value=true}
function down(e:PointerEvent){if(e.button!==0)return;pressed.value=true;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)}
function up(e:PointerEvent){pressed.value=false;const r=(e.currentTarget as HTMLElement).getBoundingClientRect();hovered.value=e.pointerType==='mouse'&&matchMedia('(hover:hover)').matches&&e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom}
function reset(){pressed.value=false;hovered.value=false}
function keydown(e:KeyboardEvent){if(e.key==='Escape')reset();if(e.key==='Enter'||e.key===' '){e.preventDefault();pressed.value=true}}
function keyup(e:KeyboardEvent){if(e.key==='Enter'||e.key===' '){e.preventDefault();const activate=pressed.value;pressed.value=false;if(activate)emit('activate',e)}}

import {sapsanProfiles} from './sapsan-cr.geometry'
type Profile = typeof sapsanProfiles[number]
type Frame = {x:number;y:number;w:number;h:number;angle:number}
const stateIndex=computed(()=>pressed.value?2:hovered.value?1:0)
const asset=(src:string)=>'/showcase/sapsan-cr/'+src
function selected(profile:Profile){return profile.states[stateIndex.value]}
function frameStyle(f:Frame){return {transform:`translate3d(${f.x}px,${f.y}px,0) rotate(${f.angle}deg) scale(${f.w/100},${f.h/100})`}}
function skyStyle(f:Frame){return {'--sky-cover':`max(1,calc(100cqw / ${f.x+f.w}px))`,transform:`translate3d(calc(${f.x}px * var(--sky-cover)),calc(${f.y}px * var(--sky-cover)),0) rotate(${f.angle}deg) scale(calc(${f.w/100} * var(--sky-cover)),calc(${f.h/100} * var(--sky-cover)))`}}
</script>

<template>
 <div class="sapsan-cr showcase-card" role="button" tabindex="0" :aria-label="content.title" :data-state="state"
  @pointerenter="enter" @pointerleave="hovered=false" @pointerdown="down" @pointerup="up" @pointercancel="reset" @blur="reset" @keydown="keydown" @keyup="keyup" @click="emit('activate',$event)">
  <div v-for="profile in sapsanProfiles" :key="'sky-'+profile.name" class="sapsan-cr__sky" :data-profile="profile.name" :style="{'--art-width':profile.width+'px'}" aria-hidden="true">
   <img class="sapsan-cr__layer" data-layer="sky" :style="skyStyle(selected(profile).sky)" :src="asset('sky.png')" width="1086" height="1448" alt="" draggable="false" />
  </div>
  <div v-for="profile in sapsanProfiles" :key="profile.name" class="sapsan-cr__art" :data-profile="profile.name" :style="{'--art-width':profile.width+'px'}" aria-hidden="true">
   <img class="sapsan-cr__layer sapsan-cr__year" data-layer="2009" :style="frameStyle(selected(profile).year)" :src="asset('2009.png')" width="1086" height="1448" alt="" draggable="false" />
   <div v-for="(raster,index) in selected(profile).rasters" :key="raster.name" class="sapsan-cr__layer sapsan-cr__blend" :data-layer="raster.name" :style="frameStyle(raster.frame)">
    <div v-for="source in profile.states" :key="source.name" class="sapsan-cr__texture" :data-texture="source.name" :style="{opacity:source.name===state?1:0}">
     <img class="sapsan-cr__native" :src="asset(source.rasters[index].src)" :width="source.rasters[index].intrinsic.w" :height="source.rasters[index].intrinsic.h" :style="{transform:'matrix('+source.rasters[index].matrix.join(',')+')'}" alt="" draggable="false" />
    </div>
   </div>
   <img class="sapsan-cr__layer" data-layer="my" :style="frameStyle(selected(profile).my)" :src="asset('my.png')" width="1533" height="1026" alt="" draggable="false" />
   <div v-for="(shadow,index) in selected(profile).shadows" :key="shadow.name" class="sapsan-cr__layer sapsan-cr__blend" :data-layer="shadow.name" :style="frameStyle(shadow.frame)">
    <div v-for="source in profile.states" :key="source.name" class="sapsan-cr__texture" :data-texture="source.name" :style="{opacity:source.name===state?1:0}">
     <img class="sapsan-cr__native" :src="asset(source.shadows[index].src)" :width="source.shadows[index].intrinsic.w" :height="source.shadows[index].intrinsic.h" :style="{left:source.shadows[index].x+'px',top:source.shadows[index].y+'px',transform:'scale('+source.shadows[index].sx+','+source.shadows[index].sy+')'}" alt="" draggable="false" />
    </div>
   </div>
  </div>
  <div class="sapsan-cr__blur" aria-hidden="true"><span /><span /></div>
  <div class="sapsan-cr__gradient" aria-hidden="true" />
  <div class="sapsan-cr__copy">
   <div class="sapsan-cr__title-block"><TypoText tag="h2" class="sapsan-cr__title" :content="content.title" /><TypoText tag="p" class="sapsan-cr__subtitle" :content="content.subtitle" /></div>
   <ul class="sapsan-cr__badges" aria-label="Специализации"><li v-for="badge in content.badges" :key="badge"><span class="sapsan-cr__badge-base"><DsBadge :label="badge" type="CardCompact" /></span><span class="sapsan-cr__badge-default"><DsBadge :label="badge" type="Card" /></span></li></ul>
  </div>
 </div>
</template>

<style scoped>
.sapsan-cr {--motion-duration:400ms;--motion-easing:cubic-bezier(.4,0,.2,1);position:relative;isolation:isolate;overflow:hidden;border-radius:var(--radius-xlg);background:var(--decorative-showcase-sapsan-cr-background);color:var(--text-inverse);cursor:pointer;font-family:var(--text-font-sans);}
.sapsan-cr__art,.sapsan-cr__sky {--art-scale:1;position:absolute;left:calc((100cqw - var(--art-width) * var(--art-scale)) / 2);top:0;width:var(--art-width);height:532px;transform-origin:0 0;transform:scale(var(--art-scale));pointer-events:none;}
.sapsan-cr__sky {left:0;width:100%;height:100%;transform:none;}
.sapsan-cr__art[data-profile=min-768],.sapsan-cr__sky[data-profile=min-768] {display:none;}
.sapsan-cr__layer {position:absolute;left:0;top:0;display:block;width:100px;height:100px;max-width:none;transform-origin:0 0;transition:transform var(--motion-duration) var(--motion-easing);will-change:transform;backface-visibility:hidden;user-select:none;}
.sapsan-cr__year {opacity:.4;}
.sapsan-cr__blend {isolation:isolate;}
.sapsan-cr__texture {position:absolute;inset:0;mix-blend-mode:plus-lighter;transition:opacity var(--motion-duration) var(--motion-easing);will-change:opacity;}
.sapsan-cr__native {position:absolute;left:0;top:0;display:block;max-width:none;transform-origin:0 0;user-select:none;}
.sapsan-cr__blur {position:absolute;inset:auto 0 0;height:200px;pointer-events:none;}
.sapsan-cr__blur span {position:absolute;inset:0;}
.sapsan-cr__blur span:first-child {backdrop-filter:blur(6px);mask-image:linear-gradient(to bottom,transparent,black 25%);}
.sapsan-cr__blur span:last-child {backdrop-filter:blur(29.4px);mask-image:linear-gradient(to bottom,transparent 25%,black);}
.sapsan-cr__gradient {position:absolute;inset:0;background:linear-gradient(to bottom,transparent 19.2307696%,rgb(0 0 0 / .6) 75%,rgb(0 0 0 / .65) 100%);pointer-events:none;transition:height var(--motion-duration) var(--motion-easing);}
.sapsan-cr__copy {position:absolute;inset:auto var(--space-4) var(--space-4);display:flex;flex-direction:column;gap:var(--space-3);pointer-events:none;}
.sapsan-cr__title-block {display:flex;flex-direction:column;gap:var(--space-1);}
.sapsan-cr__title,.sapsan-cr__subtitle {margin:0;font-weight:600;font-optical-sizing:auto;font-variation-settings:var(--heading-22-font-variation);}
.sapsan-cr__title {font-size:calc(18.333333px * var(--showcase-copy-scale));line-height:1.3;letter-spacing:.03em;}
.sapsan-cr__subtitle {font-size:calc(13.333333px * var(--showcase-copy-scale));line-height:1.5;font-variation-settings:var(--heading-16-font-variation);}
.sapsan-cr__badges {display:flex;flex-wrap:wrap;gap:var(--space-2);margin:0;padding:0;list-style:none;}
.sapsan-cr__badges li,.sapsan-cr__badge-base {display:flex;}
.sapsan-cr__badge-default {display:none;}
.sapsan-cr:focus-visible {outline:2px solid var(--border-focus);outline-offset:3px;}


.sapsan-cr__gradient {inset:auto 0 0;height:500px;}
.sapsan-cr[data-state=Hover] .sapsan-cr__gradient,.sapsan-cr[data-state=ActivePressed] .sapsan-cr__gradient {height:532px;}
@media(min-width:462px){
.sapsan-cr__art[data-profile=base],.sapsan-cr__sky[data-profile=base] {display:none;}.sapsan-cr__art[data-profile=min-768],.sapsan-cr__sky[data-profile=min-768] {display:block;}
.sapsan-cr__gradient {height:532px;}
.sapsan-cr__title {font-size:calc(22px * var(--showcase-copy-scale));}
.sapsan-cr__subtitle {font-size:calc(16px * var(--showcase-copy-scale));}
.sapsan-cr__badge-base {display:none;}.sapsan-cr__badge-default {display:flex;}
}
@media(prefers-reduced-motion:reduce){.sapsan-cr__layer,.sapsan-cr__texture,.sapsan-cr__gradient{transition:none!important;}}
</style>

