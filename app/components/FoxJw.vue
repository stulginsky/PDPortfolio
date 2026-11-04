<script setup lang="ts">
import { siteUrl } from '../utils/site-url'

import {computed,onMounted,onUnmounted,ref,watch} from 'vue'
import DsBadge from './DsBadge.vue'
import TypoText from './TypoText.vue'
import './showcase-card-layout.css'
import content from '../../content/fox-jw.json'
import {foxJwProfiles} from './fox-jw.geometry'
import {foxJwGazeTextures} from './fox-jw.pupils'

const emit=defineEmits<{activate:[event:MouseEvent|KeyboardEvent]}>()
const root=ref<HTMLElement>(),hovered=ref(false),pressed=ref(false),reduced=ref(false),animating=ref(false),touchActive=ref(false)
const state=computed(()=>pressed.value?'ActivePressed':hovered.value?'Hover':'Default')
const hoverProgress=ref(0),pressProgress=ref(0),tailAngle=ref(0)
const gazeX=ref(0),gazeY=ref(0)
let gazeTargetX=0,gazeTargetY=0,gazeVelocityX=0,gazeVelocityY=0,touchId:number|undefined,touchStartX=0,touchStartY=0,touchDragged=false,suppressClickUntil=0
let hoverVelocity=0,pressVelocity=0,tailVelocity=0,phase=0,request=0,lastTime=0,media:MediaQueryList|undefined
function step(value:number,velocity:number,target:number,dt:number,omega:number){
 const offset=value-target,decay=Math.exp(-omega*dt),coefficient=velocity+omega*offset
 const next=target+(offset+coefficient*dt)*decay,speed=(velocity-omega*coefficient*dt)*decay
 return Math.abs(next-target)<.001&&Math.abs(speed)<.015?{value:target,velocity:0}:{value:next,velocity:speed}
}
function stop(){cancelAnimationFrame(request);request=0;lastTime=0;animating.value=false}
function tick(time:number){
 request=0;const dt=Math.max(0,Math.min((time-lastTime)/1000,.05));lastTime=time
 const moving=hovered.value&&!pressed.value
 if(moving)phase=(phase+dt)%8
 const hover=step(hoverProgress.value,hoverVelocity,hovered.value?1:0,dt,12),press=step(pressProgress.value,pressVelocity,pressed.value?1:0,dt,16)
 const tail=step(tailAngle.value,tailVelocity,moving?-5*Math.sin(phase*Math.PI/4):0,dt,10)
 const x=step(gazeX.value,gazeVelocityX,gazeTargetX,dt,16),y=step(gazeY.value,gazeVelocityY,gazeTargetY,dt,16)
 gazeX.value=x.value;gazeVelocityX=x.velocity;gazeY.value=y.value;gazeVelocityY=y.velocity
 hoverProgress.value=hover.value;hoverVelocity=hover.velocity;pressProgress.value=press.value;pressVelocity=press.velocity;tailAngle.value=tail.value;tailVelocity=tail.velocity
 if(moving||hover.value!==(hovered.value?1:0)||press.value!==(pressed.value?1:0)||tail.value!==0||x.value!==gazeTargetX||y.value!==gazeTargetY)request=requestAnimationFrame(tick)
 else stop()
}
function sync(){
 if((!hovered.value||pressed.value)&&!touchActive.value){gazeTargetX=0;gazeTargetY=0}
 if(reduced.value){stop();hoverProgress.value=hovered.value?1:0;pressProgress.value=pressed.value?1:0;tailAngle.value=0;hoverVelocity=0;pressVelocity=0;tailVelocity=0;gazeX.value=0;gazeY.value=0;gazeVelocityX=0;gazeVelocityY=0;gazeTargetX=0;gazeTargetY=0;return}
 if(!request){lastTime=performance.now();animating.value=true;request=requestAnimationFrame(tick)}
}
function syncReduced(){reduced.value=media?.matches??false}
watch([hovered,pressed,reduced,touchActive],sync,{flush:'sync'})
onMounted(()=>{media=matchMedia('(prefers-reduced-motion:reduce)');syncReduced();media.addEventListener('change',syncReduced)})
onUnmounted(()=>{stop();media?.removeEventListener('change',syncReduced)})
function enter(e:PointerEvent){if(e.pointerType==='mouse'&&matchMedia('(hover:hover)').matches)hovered.value=true}
function reset(){gazeTargetX=0;gazeTargetY=0;touchId=undefined;touchActive.value=false;hovered.value=false;pressed.value=false;sync()}
function track(clientX:number,clientY:number){
 if(reduced.value||!root.value)return
 const r=root.value.getBoundingClientRect(),x=(clientX-r.left-r.width/2)/(r.width/2),y=(clientY-r.top-r.height/2)/(r.height/2),length=Math.max(1,Math.hypot(x,y))
 gazeTargetX=3*x/length;gazeTargetY=2*y/length;sync()
}
function move(e:PointerEvent){if(e.pointerType==='mouse'&&hovered.value&&!pressed.value)track(e.clientX,e.clientY)}
function startTouch(e:TouchEvent){
 if(touchActive.value)return
 const t=e.changedTouches[0];if(!t)return
 touchId=t.identifier;touchStartX=t.clientX;touchStartY=t.clientY;touchDragged=false;touchActive.value=true;pressed.value=true;track(t.clientX,t.clientY)
}
function moveTouch(e:TouchEvent){
 if(!touchActive.value)return
 const t=Array.from(e.touches).find(t=>t.identifier===touchId);if(!t)return
 if(Math.hypot(t.clientX-touchStartX,t.clientY-touchStartY)>8)touchDragged=true
 track(t.clientX,t.clientY)
}
function endTouch(e:TouchEvent){if(!Array.from(e.changedTouches).some(t=>t.identifier===touchId))return;if(touchDragged)suppressClickUntil=performance.now()+500;reset()}
function cancel(e:PointerEvent){if(e.pointerType!=='touch'||!touchActive.value)reset()}
function activate(e:MouseEvent){if(performance.now()<suppressClickUntil){e.preventDefault();return}emit('activate',e)}
function down(e:PointerEvent){if(e.button!==0)return;pressed.value=true;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)}
function up(e:PointerEvent){if(e.pointerType==='touch'&&touchActive.value)return;pressed.value=false;const r=(e.currentTarget as HTMLElement).getBoundingClientRect();hovered.value=e.pointerType==='mouse'&&matchMedia('(hover:hover)').matches&&e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom}
function keydown(e:KeyboardEvent){if(e.key==='Escape')reset();if(e.key==='Enter'||e.key===' '){e.preventDefault();pressed.value=true}}
function keyup(e:KeyboardEvent){if(e.key==='Enter'||e.key===' '){e.preventDefault();const activate=pressed.value;pressed.value=false;if(activate)emit('activate',e)}}

type Profile=typeof foxJwProfiles[number]
function layers(profile:Profile){return profile.states[0].layers.map((base,index)=>{
 const hover=profile.states[1].layers[index]!,active=profile.states[2].layers[index]!
 const blend=(key:'x'|'y'|'w'|'h'|'opacity')=>{const rest=base[key]+(hover[key]-base[key])*hoverProgress.value;return rest+(active[key]-rest)*pressProgress.value}
 return {...base,x:blend('x'),y:blend('y'),w:blend('w'),h:blend('h'),opacity:blend('opacity')}
})}
function layerStyle(layer:ReturnType<typeof layers>[number],native:Profile['states'][0]['layers'][number]){
 if(layer.name==='Fox-back')return {width:`max(${layer.w}px,100cqw)`,height:layer.h+'px',transform:`translate3d(calc((var(--art-width) - max(${layer.w}px,100cqw)) / 2),${layer.y}px,0)`}
 return {width:native.w+'px',height:native.h+'px',transform:`translate3d(${layer.x}px,${layer.y}px,0) scale(${layer.w/native.w},${layer.h/native.h})`,opacity:layer.opacity}
}
type Texture={state:'hover'|'active-pressed';w:number;h:number;dx:number;dy:number;intrinsicW:number;intrinsicH:number}
function textureStyle(texture:Texture,native:Profile['states'][0]['layers'][number]){
 const x=native.w/texture.w,y=native.h/texture.h
 return {width:texture.intrinsicW+'px',height:texture.intrinsicH+'px',transform:`translate(${texture.dx*x}px,${texture.dy*y}px) scale(${x},${y})`,opacity:texture.state==='hover'?1-pressProgress.value:pressProgress.value}
}
function eyeTextures(profile:Profile,name:string){return name==='eyes02'?foxJwGazeTextures.filter(e=>e.profile===profile.name&&e.name==='eyes02'):profile.eyes.filter(e=>e.name===name)}
function pupilTextures(profile:Profile,name:string){return foxJwGazeTextures.filter(e=>e.profile===profile.name&&e.name===name)}
function gazeStyle(layer:ReturnType<typeof layers>[number],native:Profile['states'][0]['layers'][number]){return {transform:`translate(${gazeX.value*native.w/layer.w}px,${gazeY.value*native.h/layer.h}px)`}}
const asset=(file:string)=>'/showcase/fox-jw/'+file
</script>

<template>
 <div ref="root" class="fox-jw showcase-card" role="button" tabindex="0" :aria-label="content.title" :data-state="state" :data-animating="animating"
  @pointerenter="enter" @pointermove="move" @pointerleave="!touchActive&&reset()" @pointerdown="down" @pointerup="up" @pointercancel="cancel" @touchstart.passive="startTouch" @touchmove.passive="moveTouch" @touchend.passive="endTouch" @touchcancel.passive="endTouch" @blur="reset" @keydown="keydown" @keyup="keyup" @click="activate">
  <div v-for="profile in foxJwProfiles" :key="profile.name" class="fox-jw__art" :data-profile="profile.name" :style="{'--art-width':profile.width+'px'}" aria-hidden="true">
   <div v-for="(layer,index) in layers(profile)" :key="layer.name" class="fox-jw__layer" :data-layer="layer.name" :style="layerStyle(layer,profile.states[0].layers[index]!)">
    <img v-if="layer.name==='Fox-back'" :src="siteUrl(asset('fox-back.png'))" alt="" draggable="false" />
    <div v-else-if="layer.name==='Fox-tails'" class="fox-jw__tails" :style="{transform:`rotate(${tailAngle}deg)`}"><img :src="siteUrl(asset('fox-tails.png'))" alt="" draggable="false" /></div>
    <div v-else-if="layer.name==='Fox-head'" class="fox-jw__head-crop"><img :src="siteUrl(asset('fox-head.png'))" alt="" draggable="false" /></div>
    <template v-else>
     <img v-for="texture in eyeTextures(profile,layer.name)" :key="texture.src" class="fox-jw__eye-texture" :src="siteUrl(asset(texture.src))" :width="texture.intrinsicW" :height="texture.intrinsicH" :style="textureStyle(texture,profile.states[0].layers[index]!)" alt="" draggable="false" />
     <div v-if="layer.name==='eyes02'" class="fox-jw__gaze" :style="gazeStyle(layer,profile.states[0].layers[index]!)">
      <div v-for="name in ['Ellipse 330','Ellipse 331']" :key="name" class="fox-jw__pupil" :data-pupil="name"><img v-for="texture in pupilTextures(profile,name)" :key="texture.src" class="fox-jw__eye-texture" :src="siteUrl(asset(texture.src))" :width="texture.intrinsicW" :height="texture.intrinsicH" :style="textureStyle(texture,profile.states[0].layers[index]!)" alt="" draggable="false" /></div>
     </div>
    </template>
   </div>
  </div>
  <div class="fox-jw__blur" aria-hidden="true" />
  <div class="fox-jw__gradient" aria-hidden="true" />
  <div class="fox-jw__copy">
   <div class="fox-jw__title-block"><TypoText tag="h2" class="fox-jw__title" :content="content.title" /><TypoText tag="p" class="fox-jw__subtitle" :content="content.subtitle" /></div>
   <ul class="fox-jw__badges" aria-label="Специализации"><li v-for="badge in content.badges" :key="badge"><span class="fox-jw__badge-base"><DsBadge :label="badge" type="CardCompact" /></span><span class="fox-jw__badge-default"><DsBadge :label="badge" type="Card" /></span></li></ul>
  </div>
 </div>
</template>

<style scoped>
.fox-jw {position:relative;isolation:isolate;overflow:hidden;border-radius:var(--radius-xlg);background:var(--decorative-showcase-fox-jw-background);color:var(--text-inverse);cursor:pointer;font-family:var(--text-font-sans);}
.fox-jw__art {position:absolute;left:calc((100cqw - var(--art-width)) / 2);top:0;width:var(--art-width);height:100%;pointer-events:none;}
.fox-jw__art[data-profile=min-768] {display:none;}
.fox-jw__layer {position:absolute;left:0;top:0;transform-origin:0 0;isolation:isolate;}
.fox-jw__layer>img:not(.fox-jw__eye-texture),.fox-jw__tails img {display:block;width:100%;height:100%;max-width:none;object-fit:cover;user-select:none;}
.fox-jw__tails {width:100%;height:100%;will-change:transform;}
.fox-jw__head-crop {position:absolute;inset:0;overflow:hidden;}
.fox-jw__head-crop img {position:absolute;width:142.355088228%;height:170.743566858%;left:-24.518534023%;top:-41.552114316%;max-width:none;user-select:none;}
.fox-jw__eye-texture {position:absolute;left:0;top:0;display:block;max-width:none;transform-origin:0 0;mix-blend-mode:plus-lighter;user-select:none;}
.fox-jw__gaze,.fox-jw__pupil {position:absolute;inset:0;isolation:isolate;}
.fox-jw__blur {position:absolute;inset:auto 0 0;height:200px;backdrop-filter:blur(30px);background:rgb(0 0 0 / .01);mask-image:linear-gradient(to bottom,transparent,black);pointer-events:none;}
.fox-jw__gradient {position:absolute;inset:0;background:linear-gradient(to bottom,transparent 19.2307696%,rgb(0 0 0 / .6) 75%,rgb(0 0 0 / .65));pointer-events:none;}
.fox-jw__copy {position:absolute;inset:auto var(--space-4) var(--space-4);display:flex;flex-direction:column;gap:var(--space-3);pointer-events:none;}
.fox-jw__title-block {display:flex;flex-direction:column;gap:var(--space-1);}
.fox-jw__title,.fox-jw__subtitle {margin:0;font-weight:600;font-optical-sizing:auto;font-variation-settings:var(--heading-22-font-variation);}
.fox-jw__title {font-size:calc(18.333333px * var(--showcase-copy-scale));line-height:1.3;letter-spacing:.03em;}
.fox-jw__subtitle {font-size:calc(13.333333px * var(--showcase-copy-scale));line-height:1.5;font-variation-settings:var(--heading-16-font-variation);}
.fox-jw__badges {display:flex;flex-wrap:wrap;gap:var(--space-2);margin:0;padding:0;list-style:none;}
.fox-jw__badges li,.fox-jw__badge-base {display:flex;}
.fox-jw__badge-default {display:none;}
.fox-jw:focus-visible {outline:2px solid var(--border-focus);outline-offset:3px;}
@media(min-width:462px){
 .fox-jw__art[data-profile=base] {display:none;}.fox-jw__art[data-profile=min-768] {display:block;}
 .fox-jw__title {font-size:calc(22px * var(--showcase-copy-scale));}
 .fox-jw__subtitle {font-size:calc(16px * var(--showcase-copy-scale));}
 .fox-jw__badge-base {display:none;}.fox-jw__badge-default {display:flex;}
}
</style>
