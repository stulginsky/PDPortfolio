<script setup lang="ts">
import {computed,onMounted,onUnmounted,ref,watch} from 'vue'
import DsBadge from './DsBadge.vue'
import TypoText from './TypoText.vue'
import './showcase-card-layout.css'
import content from '../../content/4real-3dweapon.json'
import {weaponProfiles,weaponFrames,weaponPoseAnchors} from './4real-3dweapon.geometry'
import {advanceWeaponMotion,alignWeaponPose,interpolateWeaponPose} from './4real-3dweapon.motion'

const emit=defineEmits<{activate:[event:MouseEvent|KeyboardEvent]}>()
const root=ref<HTMLElement>(),hovered=ref(false),pressed=ref(false)
const state=computed(()=>pressed.value?'ActivePressed':hovered.value?'Hover':'Default')
const framesReady=ref(false),framesFailed=ref(false),reduced=ref(false)
const poseProgress=ref(0),geometryProgress=ref(0),pressProgress=ref(0)
const poseCursor=computed(()=>Math.max(0,Math.min(8,poseProgress.value*8)))
const frameIndex=computed(()=>Math.round(poseCursor.value))
const targetPose=computed(()=>interpolateWeaponPose(weaponPoseAnchors,poseCursor.value))
function frameStyle(index:number){const lower=Math.floor(poseCursor.value),fraction=poseCursor.value-lower,mix=fraction*fraction*(3-2*fraction),opacity=index===lower?1-mix:index===lower+1?mix:0;return {visibility:opacity>0?'visible' as const:'hidden' as const,opacity,transform:opacity===0||Math.abs(poseCursor.value-index)<1e-9?'none':alignWeaponPose(weaponPoseAnchors[index]!,targetPose.value)}}
const frameIntervalMs=25
const sequenceState=computed(()=>framesFailed.value?'error':framesReady.value?'ready':'loading')
const animating=ref(false)
const asset=(src:string)=>'/showcase/4real-3dweapon/ak-47/'+src
type Profile=typeof weaponProfiles[number]
type Rect={x:number;y:number;w:number;h:number}
function selected(p:Profile){
 const idle=p.states[0].weapon,hover=p.states[1].weapon,active=p.states[2].weapon
 const blend=(key:keyof Rect)=>{const rest=idle[key]+(hover[key]-idle[key])*geometryProgress.value;return rest+(active[key]-rest)*pressProgress.value}
 return {weapon:{x:blend('x'),y:blend('y'),w:blend('w'),h:blend('h')}}
}
function weaponStyle(f:Rect){return {transform:`translate3d(${f.x}px,${f.y}px,0) scale(${f.w/945},${f.h/564})`}}
function stripeStyle(f:Rect){return {left:f.x+'px',top:f.y+'px',width:f.w+'px',height:f.h+'px'}}

let request=0,lastTime=0,disposed=false
let geometryVelocity=0,pressVelocity=0
let media:MediaQueryList|undefined
function stopPlayback(){cancelAnimationFrame(request);request=0;lastTime=0;animating.value=false}
function tick(time:number){
 request=0
 if(disposed||reduced.value){stopPlayback();return}
 const dt=Math.max(0,Math.min((time-lastTime)/1000,.05));lastTime=time
 const target=hovered.value?1:0,poseTarget=framesReady.value?target:0,pressTarget=pressed.value?1:0
 const poseStep=Math.min(dt,1/48)/(frameIntervalMs*8/1000),poseGap=poseTarget-poseProgress.value
 const geometry=advanceWeaponMotion(geometryProgress.value,geometryVelocity,target,dt,14)
 const press=advanceWeaponMotion(pressProgress.value,pressVelocity,pressTarget,dt,20)
 poseProgress.value+=Math.sign(poseGap)*Math.min(Math.abs(poseGap),poseStep)
 geometryProgress.value=geometry.value;geometryVelocity=geometry.velocity
 pressProgress.value=press.value;pressVelocity=press.velocity
 if(poseProgress.value!==poseTarget||geometryProgress.value!==target||pressProgress.value!==pressTarget)request=requestAnimationFrame(tick)
 else {lastTime=0;animating.value=false}
}
function syncPlayback(){
 const target=hovered.value?1:0
 if(reduced.value){stopPlayback();poseProgress.value=0;geometryProgress.value=target;pressProgress.value=pressed.value?1:0;geometryVelocity=0;pressVelocity=0;return}
 if(!request){lastTime=performance.now();animating.value=true;request=requestAnimationFrame(tick)}
}
watch([hovered,pressed,framesReady,reduced],syncPlayback,{flush:'sync'})
function syncReduced(){reduced.value=media?.matches??false}
onMounted(async()=>{
 media=matchMedia('(prefers-reduced-motion:reduce)');syncReduced();media.addEventListener('change',syncReduced)
 const images=[...(root.value?.querySelectorAll('img')??[])]
 const decoded=await Promise.allSettled(images.map(image=>image.decode()))
 if(disposed)return
 framesFailed.value=decoded.some(v=>v.status==='rejected')
 framesReady.value=!framesFailed.value
})
onUnmounted(()=>{disposed=true;stopPlayback();media?.removeEventListener('change',syncReduced)})
function enter(e:PointerEvent){if(e.pointerType==='mouse'&&matchMedia('(hover:hover)').matches)hovered.value=true}
function leave(){hovered.value=false;pressed.value=false}
function down(e:PointerEvent){if(e.button!==0)return;pressed.value=true;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)}
function up(e:PointerEvent){pressed.value=false;const r=(e.currentTarget as HTMLElement).getBoundingClientRect();hovered.value=e.pointerType==='mouse'&&matchMedia('(hover:hover)').matches&&e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom}
function reset(){hovered.value=false;pressed.value=false}
function keydown(e:KeyboardEvent){if(e.key==='Escape')reset();if(e.key==='Enter'||e.key===' '){e.preventDefault();pressed.value=true}}
function keyup(e:KeyboardEvent){if(e.key==='Enter'||e.key===' '){e.preventDefault();const activate=pressed.value;pressed.value=false;if(activate)emit('activate',e)}}
</script>

<template>
 <div ref="root" class="card-4real-3dweapon showcase-card" role="button" tabindex="0" :aria-label="content.title" :data-state="state" :data-frame="frameIndex+1" :data-frame-position="(poseCursor+1).toFixed(4)" :data-sequence="sequenceState" :data-animating="animating"
  @pointerenter="enter" @pointerleave="leave" @pointerdown="down" @pointerup="up" @pointercancel="reset" @blur="reset" @keydown="keydown" @keyup="keyup" @click="emit('activate',$event)">
  <div v-for="profile in weaponProfiles" :key="profile.name" class="card-4real-3dweapon__art" :data-profile="profile.name" :style="{'--art-width':profile.width+'px'}" aria-hidden="true">
   <div class="card-4real-3dweapon__stripe" :style="{...stripeStyle(profile.stripe),clipPath:`inset(0 ${pressProgress*50}%)`}" />
   <div class="card-4real-3dweapon__weapon" :style="weaponStyle(selected(profile).weapon)">
    <img v-for="(frame,index) in weaponFrames" :key="frame.src" class="card-4real-3dweapon__frame" :src="asset(frame.src)" width="945" height="564" :style="frameStyle(index)" alt="" draggable="false" />
   </div>
  </div>
  <div class="card-4real-3dweapon__blur" aria-hidden="true" />
  <div class="card-4real-3dweapon__gradient" aria-hidden="true" />
  <div class="card-4real-3dweapon__copy">
   <div class="card-4real-3dweapon__title-block"><TypoText tag="h2" class="card-4real-3dweapon__title" :content="content.title" /><TypoText tag="p" class="card-4real-3dweapon__subtitle" :content="content.subtitle" /></div>
   <ul class="card-4real-3dweapon__badges" aria-label="Специализации"><li v-for="badge in content.badges" :key="badge"><span class="card-4real-3dweapon__badge-base"><DsBadge :label="badge" type="CardCompact" /></span><span class="card-4real-3dweapon__badge-default"><DsBadge :label="badge" type="Card" /></span></li></ul>
  </div>
 </div>
</template>

<style scoped>
.card-4real-3dweapon {position:relative;isolation:isolate;overflow:hidden;border-radius:var(--radius-xlg);background:var(--decorative-showcase-4real-3dweapon-background);color:var(--text-inverse);cursor:pointer;font-family:var(--text-font-sans);}
.card-4real-3dweapon__art {position:absolute;left:calc((100cqw - var(--art-width)) / 2);top:0;width:var(--art-width);height:100%;pointer-events:none;}
.card-4real-3dweapon__art[data-profile=min-768] {display:none;}
.card-4real-3dweapon__weapon {position:absolute;left:0;top:0;width:945px;height:564px;transform-origin:0 0;will-change:transform;backface-visibility:hidden;isolation:isolate;}
.card-4real-3dweapon__frame {position:absolute;left:0;top:0;display:block;width:945px;height:564px;max-width:none;user-select:none;mix-blend-mode:plus-lighter;transform-origin:0 0;}
.card-4real-3dweapon__stripe {position:absolute;background:var(--decorative-showcase-4real-3dweapon-stripe);}
.card-4real-3dweapon__blur {position:absolute;inset:auto 0 0;height:200px;backdrop-filter:blur(30px);background:rgb(0 0 0 / .01);mask-image:linear-gradient(to bottom,transparent,black);pointer-events:none;}
.card-4real-3dweapon__gradient {position:absolute;inset:0;background:linear-gradient(to bottom,transparent 19.2307696%,rgb(0 0 0 / .6) 75%,rgb(0 0 0 / .65));pointer-events:none;}
.card-4real-3dweapon__copy {position:absolute;inset:auto var(--space-4) var(--space-4);display:flex;flex-direction:column;gap:var(--space-3);pointer-events:none;}
.card-4real-3dweapon__title-block {display:flex;flex-direction:column;gap:var(--space-1);}
.card-4real-3dweapon__title,.card-4real-3dweapon__subtitle {margin:0;font-weight:600;font-optical-sizing:auto;font-variation-settings:var(--heading-22-font-variation);}
.card-4real-3dweapon__title {font-size:calc(18.333333px * var(--showcase-copy-scale));line-height:1.3;letter-spacing:.03em;}
.card-4real-3dweapon__subtitle {font-size:calc(13.333333px * var(--showcase-copy-scale));line-height:1.5;font-variation-settings:var(--heading-16-font-variation);}
.card-4real-3dweapon__badges {display:flex;flex-wrap:wrap;gap:var(--space-2);margin:0;padding:0;list-style:none;}
.card-4real-3dweapon__badges li,.card-4real-3dweapon__badge-base {display:flex;}
.card-4real-3dweapon__badge-default {display:none;}
.card-4real-3dweapon:focus-visible {outline:2px solid var(--border-focus);outline-offset:3px;}




@media(min-width:462px){
.card-4real-3dweapon__art[data-profile=base] {display:none;}.card-4real-3dweapon__art[data-profile=min-768] {display:block;}
.card-4real-3dweapon__title {font-size:calc(22px * var(--showcase-copy-scale));}
.card-4real-3dweapon__subtitle {font-size:calc(16px * var(--showcase-copy-scale));}
.card-4real-3dweapon__badge-base {display:none;}.card-4real-3dweapon__badge-default {display:flex;}
}
@media(prefers-reduced-motion:reduce){.card-4real-3dweapon__weapon,.card-4real-3dweapon__stripe{transition:none!important;}}
</style>

