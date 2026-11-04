<script setup lang="ts">
import { siteUrl } from '../utils/site-url'

import {computed,onMounted,onUnmounted,ref,watch} from 'vue'
import DsBadge from './DsBadge.vue'
import TypoText from './TypoText.vue'
import './showcase-card-layout.css'
import content from '../../content/dragon-heart-jw.json'
import {dragonHeartJwProfiles} from './dragon-heart-jw.geometry'

const emit=defineEmits<{activate:[event:MouseEvent|KeyboardEvent]}>()
const hovered=ref(false),pressed=ref(false)
const state=computed(()=>pressed.value?'ActivePressed':hovered.value?'Hover':'Default')
const stateIndex=computed(()=>pressed.value?2:hovered.value?1:0)
const hoverProgress=ref(0),pressProgress=ref(0),animating=ref(false),reduced=ref(false)
let hoverVelocity=0,pressVelocity=0,request=0,lastTime=0,media:MediaQueryList|undefined
function step(value:number,velocity:number,target:number,dt:number,omega:number){
 const offset=value-target,decay=Math.exp(-omega*dt),coefficient=velocity+omega*offset
 const next=target+(offset+coefficient*dt)*decay,speed=(velocity-omega*coefficient*dt)*decay
 return Math.abs(next-target)<.001&&Math.abs(speed)<.015?{value:target,velocity:0}:{value:next,velocity:speed}
}
function stop(){cancelAnimationFrame(request);request=0;lastTime=0;animating.value=false}
function tick(time:number){
 request=0;const dt=Math.max(0,Math.min((time-lastTime)/1000,.05));lastTime=time
 const hover=step(hoverProgress.value,hoverVelocity,hovered.value?1:0,dt,12),press=step(pressProgress.value,pressVelocity,pressed.value?1:0,dt,16)
 hoverProgress.value=hover.value;hoverVelocity=hover.velocity;pressProgress.value=press.value;pressVelocity=press.velocity
 if(hover.value!==(hovered.value?1:0)||press.value!==(pressed.value?1:0))request=requestAnimationFrame(tick)
 else stop()
}
function sync(){
 if(reduced.value){stop();hoverProgress.value=hovered.value?1:0;pressProgress.value=pressed.value?1:0;hoverVelocity=0;pressVelocity=0;return}
 if(!request){lastTime=performance.now();animating.value=true;request=requestAnimationFrame(tick)}
}
function syncReduced(){reduced.value=media?.matches??false}
watch([hovered,pressed,reduced],sync,{flush:'sync'})
onMounted(()=>{media=matchMedia('(prefers-reduced-motion:reduce)');syncReduced();media.addEventListener('change',syncReduced)})
onUnmounted(()=>{stop();media?.removeEventListener('change',syncReduced)})
function enter(e:PointerEvent){if(e.pointerType==='mouse'&&matchMedia('(hover:hover)').matches)hovered.value=true}
function reset(){hovered.value=false;pressed.value=false}
function down(e:PointerEvent){if(e.button!==0)return;pressed.value=true;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)}
function up(e:PointerEvent){pressed.value=false;const r=(e.currentTarget as HTMLElement).getBoundingClientRect();hovered.value=e.pointerType==='mouse'&&matchMedia('(hover:hover)').matches&&e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom}
function keydown(e:KeyboardEvent){if(e.key==='Escape')reset();if(e.key==='Enter'||e.key===' '){e.preventDefault();pressed.value=true}}
function keyup(e:KeyboardEvent){if(e.key==='Enter'||e.key===' '){e.preventDefault();const activate=pressed.value;pressed.value=false;if(activate)emit('activate',e)}}
type Layer=typeof dragonHeartJwProfiles[number]['states'][number]['layers'][number]
type Profile=typeof dragonHeartJwProfiles[number]
function layers(profile:Profile){return profile.states[0].layers.map((base,index)=>{
 const hover=profile.states[1].layers[index]!,active=profile.states[2].layers[index]!
 const blend=(key:'x'|'y'|'w'|'h'|'opacity')=>{const rest=base[key]+(hover[key]-base[key])*hoverProgress.value;return rest+(active[key]-rest)*pressProgress.value}
 return {...base,x:blend('x'),y:blend('y'),w:blend('w'),h:blend('h'),opacity:blend('opacity'),glow:profile.states[stateIndex.value].layers[index]!.glow}
})}
function layerStyle(layer:ReturnType<typeof layers>[number],native:Layer){
 const edge=['sky','Mountain','shader'].includes(layer.name)
 const scaled=['pendant','moon'].includes(layer.name)
 return {width:edge?`calc(${layer.w}px + 2 * var(--edge-extra))`:(scaled?native.w:layer.w)+'px',height:(scaled?native.h:layer.h)+'px',transform:edge?`translate3d(calc(${layer.x}px - var(--edge-extra)),${layer.y}px,0)`:`translate3d(${layer.x}px,${layer.y}px,0)${scaled?` scale(${layer.w/native.w},${layer.h/native.h})`:''}`,opacity:layer.opacity,filter:layer.name==='pendant'?(layer.glow?'drop-shadow(0 4px 55.75px var(--decorative-showcase-dragon-heart-jw-glow))':'drop-shadow(0 4px 55.75px transparent)'):undefined}
}
</script>

<template>
 <div class="dragon-heart-jw showcase-card" role="button" tabindex="0" :aria-label="content.title" :data-state="state" :data-animating="animating"
  @pointerenter="enter" @pointerleave="reset" @pointerdown="down" @pointerup="up" @pointercancel="reset" @blur="reset" @keydown="keydown" @keyup="keyup" @click="emit('activate',$event)">
  <div v-for="profile in dragonHeartJwProfiles" :key="profile.name" class="dragon-heart-jw__art" :data-profile="profile.name" :style="{'--art-width':profile.width+'px'}" aria-hidden="true">
   <div v-for="(layer,index) in layers(profile)" :key="layer.name" class="dragon-heart-jw__layer" :data-layer="layer.name" :style="layerStyle(layer,profile.states[0].layers[index]!)">
    <img v-if="layer.name!=='shader'" :src="siteUrl('/showcase/dragon-heart-jw/'+layer.name.toLowerCase()+'.png')" alt="" draggable="false" />
   </div>
  </div>
  <div class="dragon-heart-jw__blur" aria-hidden="true" />
  <div class="dragon-heart-jw__gradient" aria-hidden="true" />
  <div class="dragon-heart-jw__copy">
   <div class="dragon-heart-jw__title-block"><TypoText tag="h2" class="dragon-heart-jw__title" :content="content.title" /><TypoText tag="p" class="dragon-heart-jw__subtitle" :content="content.subtitle" /></div>
   <ul class="dragon-heart-jw__badges" aria-label="Специализации"><li v-for="badge in content.badges" :key="badge"><span class="dragon-heart-jw__badge-base"><DsBadge :label="badge" type="CardCompact" /></span><span class="dragon-heart-jw__badge-default"><DsBadge :label="badge" type="Card" /></span></li></ul>
  </div>
 </div>
</template>

<style scoped>
.dragon-heart-jw {--motion-duration:300ms;position:relative;isolation:isolate;overflow:hidden;border-radius:var(--radius-xlg);background:var(--decorative-showcase-dragon-heart-jw-background);color:var(--text-inverse);cursor:pointer;font-family:var(--text-font-sans);}
.dragon-heart-jw[data-state=ActivePressed] {--motion-duration:150ms;}
.dragon-heart-jw__art {--edge-extra:max(0px,calc((100cqw - var(--art-width)) / 2));position:absolute;left:calc((100cqw - var(--art-width)) / 2);top:0;width:var(--art-width);height:100%;pointer-events:none;}
.dragon-heart-jw__art[data-profile=min-768] {display:none;}
.dragon-heart-jw__layer {position:absolute;left:0;top:0;overflow:hidden;transform-origin:0 0;transition:filter 450ms ease-in-out;}
.dragon-heart-jw__layer[data-layer=pendant],.dragon-heart-jw__layer[data-layer=moon] {will-change:transform;}
.dragon-heart-jw__layer img {position:absolute;inset:0;display:block;width:100%;height:100%;max-width:none;object-fit:cover;user-select:none;}
.dragon-heart-jw__layer[data-layer=shader] {background:var(--decorative-showcase-dragon-heart-jw-shader);}
.dragon-heart-jw__layer[data-layer=pendant] img {inset:auto;width:199.230756964%;height:113.586449564%;left:-51.655426568%;top:-2.028327708%;}
.dragon-heart-jw__blur {position:absolute;inset:auto 0 0;height:200px;backdrop-filter:blur(30px);background:rgb(0 0 0 / .01);mask-image:linear-gradient(to bottom,transparent,black);pointer-events:none;}
.dragon-heart-jw__gradient {position:absolute;inset:0;background:linear-gradient(to bottom,transparent 19.2307696%,rgb(0 0 0 / .6) 75%,rgb(0 0 0 / .65));pointer-events:none;}
.dragon-heart-jw__copy {position:absolute;inset:auto var(--space-4) var(--space-4);display:flex;flex-direction:column;gap:var(--space-3);pointer-events:none;}
.dragon-heart-jw__title-block {display:flex;flex-direction:column;gap:var(--space-1);}
.dragon-heart-jw__title,.dragon-heart-jw__subtitle {margin:0;font-weight:600;font-optical-sizing:auto;font-variation-settings:var(--heading-22-font-variation);}
.dragon-heart-jw__title {font-size:calc(18.333333px * var(--showcase-copy-scale));line-height:1.3;letter-spacing:.03em;}
.dragon-heart-jw__subtitle {font-size:calc(13.333333px * var(--showcase-copy-scale));line-height:1.5;font-variation-settings:var(--heading-16-font-variation);}
.dragon-heart-jw__badges {display:flex;flex-wrap:wrap;gap:var(--space-2);margin:0;padding:0;list-style:none;}
.dragon-heart-jw__badges li,.dragon-heart-jw__badge-base {display:flex;}
.dragon-heart-jw__badge-default {display:none;}
.dragon-heart-jw:focus-visible {outline:2px solid var(--border-focus);outline-offset:3px;}
@media(min-width:462px){
 .dragon-heart-jw__art[data-profile=base] {display:none;}.dragon-heart-jw__art[data-profile=min-768] {display:block;}
 .dragon-heart-jw__title {font-size:calc(22px * var(--showcase-copy-scale));}
 .dragon-heart-jw__subtitle {font-size:calc(16px * var(--showcase-copy-scale));}
 .dragon-heart-jw__badge-base {display:none;}.dragon-heart-jw__badge-default {display:flex;}
}
@media(prefers-reduced-motion:reduce){.dragon-heart-jw__layer{transition:none!important;}}
</style>
