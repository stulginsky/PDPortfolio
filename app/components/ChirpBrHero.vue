<script setup lang="ts">
import { vMediaReady } from './media-readiness'
import { vLayeredScene } from './layered-scene-readiness'
import LayeredSceneFallback from './LayeredSceneFallback.vue'
import { useHeroMotion } from './hero-motion'
import {computed,inject,nextTick,onMounted,onUnmounted,ref } from 'vue'
import ChirpBrHeroNode from './ChirpBrHeroNode'
import caseContent from '../../content/cases/chirp-brand.json'
import {createHeroDraft,getHeroBreakpoint,heroBreakpoints,heroLayouts,heroReferences,heroSceneEditorKey,type HeroBreakpoint} from './chirp-br-hero.scene-context'
const props=defineProps<{role?:string;focus?:string;breakpoint?:HeroBreakpoint}>()
const editor=inject(heroSceneEditorKey,undefined)
const root=ref<HTMLElement>()
const ready=ref(false)
const viewport=ref(320)
const containerWidth=ref(320)
const breakpoint=computed(()=>props.breakpoint??getHeroBreakpoint(viewport.value))
const reference=computed(()=>heroReferences[breakpoint.value])
const defaults=createHeroDraft()
const layers=computed(()=>(editor?.draft??defaults)[breakpoint.value])
const initialProfiles=heroBreakpoints.map(profile=>({
 profile,reference:heroReferences[profile],
 media:props.breakpoint?(props.breakpoint===profile?'all':'not all'):(profile==='base'?'(width < 768px)':profile==='min-1920'?'(min-width: 1920px)':'(min-width: '+profile.slice(4)+'px) and (width < '+heroBreakpoints[heroBreakpoints.indexOf(profile)+1]!.slice(4)+'px)'),
}))
const ratio=computed(()=>containerWidth.value/reference.value.width)
const copy=computed(()=>({...caseContent.hero,role:props.role??caseContent.hero.role,focus:props.focus??caseContent.hero.focus}))
const isMoving = (layer: typeof layers.value[number]) => layer.animationEnabled && !['title','Logo','Role-Focus'].includes(layer.name)
const layerElements:HTMLElement[]=[]
let latestOffsets:number[]=[]
let resizeObserver:ResizeObserver|undefined
function shift(index:number){const layer=layers.value[index]!,base=defaults[breakpoint.value][index]!;return {left:(layer.x-base.x)+'px',top:(layer.y-base.y)+'px'}}
function setLayer(element: unknown, index: number) {
  if (element instanceof HTMLElement) layerElements[index] = element
}
function renderOffsets(values:number[]=latestOffsets){
 latestOffsets=values
 values.forEach((value,index)=>layerElements[index]?.style.setProperty('--hero-motion',(value / ratio.value) + 'px'))
}
const {resetMotion,replayIntro,maybeIntro,pointerDown,release}=useHeroMotion({
 root,layers:()=>layers.value,breakpoint:()=>breakpoint.value,mode:()=>editor?.mode.value,
 width:()=>containerWidth.value,viewport:()=>viewport.value,render:renderOffsets,enabled:isMoving,scope:'hero'
})
function sync() {
  viewport.value = window.innerWidth
  containerWidth.value = root.value?.clientWidth || viewport.value
  nextTick(renderOffsets)
}
onMounted(async()=>{sync();await nextTick();if(!root.value)return;ready.value=true;resizeObserver=new ResizeObserver(sync);resizeObserver.observe(root.value!);;window.addEventListener('resize',sync)})
onUnmounted(()=>{resizeObserver?.disconnect();window.removeEventListener('resize',sync)})
defineExpose({ replayIntro, resetMotion })

</script>
<template>
 <section v-media-ready v-layered-scene ref="root" class="chirp-br-hero media-skeleton" :data-ready="ready" :data-breakpoint="breakpoint" data-motion="neutral" :aria-label="caseContent.pageTitle" :style="{height:reference.height*ratio+'px'}" @scene-ready="maybeIntro" @pointerdown="pointerDown" @pointerleave="release()">
  <LayeredSceneFallback name="chirp-br-hero" />
  <div v-if="ready" class="chirp-br-hero__stage" :style="{width:reference.width+'px',height:reference.height+'px',transform:'scale('+ratio+')'}">
   <div v-for="(layer,index) in layers" :key="breakpoint+layer.id" :ref="el=>setLayer(el,index)" class="chirp-br-hero__layer" :data-layer="layer.name" :data-source-id="layer.id" :data-animation-enabled="layer.animationEnabled" :style="shift(index)">
    <ChirpBrHeroNode :node="heroLayouts[breakpoint][index]!" :copy="copy" :breakpoint="breakpoint" :moving="isMoving(layer)" @loaded="maybeIntro" />
   </div>
  </div>
  <template v-else>
   <div v-for="profile in initialProfiles" :key="profile.profile" class="chirp-br-hero__initial" :data-profile="profile.profile" :style="{aspectRatio:profile.reference.width+' / '+profile.reference.height,display:props.breakpoint?(props.breakpoint===profile.profile?'block':'none'):undefined}">
    <div class="chirp-br-hero__initial-stage" :style="{width:profile.reference.width+'px',height:profile.reference.height+'px',transform:'scale(calc(100cqw / '+profile.reference.width+'px))'}">
    <div v-for="(node,index) in heroLayouts[profile.profile]" :key="node.id" class="chirp-br-hero__layer" :data-layer="defaults[profile.profile][index]!.name">
     <ChirpBrHeroNode :node="node" :copy="copy" :breakpoint="profile.profile" :initial-media="profile.media" />
    </div>
    </div>
   </div>
  </template>
 </section>
</template>
<style scoped>
.chirp-br-hero{position:relative;width:100%;container-type:inline-size;overflow:clip;background:var(--surface-default);touch-action:pan-y}
.chirp-br-hero__stage{position:relative;transform-origin:top left}
.chirp-br-hero__layer{position:absolute;width:100%;height:100%;pointer-events:none}
@media(prefers-reduced-motion:reduce){.chirp-br-hero__layer{will-change:auto}}

.chirp-br-hero[data-ready="false"]{height:auto!important}
.chirp-br-hero__initial{position:relative;display:none;width:100%}
.chirp-br-hero__initial-stage{position:absolute;left:0;top:0;transform-origin:top left}
.chirp-br-hero__initial[data-profile="base"]{display:block}
.chirp-br-hero[data-media-state="loading"] :deep(img){visibility:hidden}
@media(min-width:768px){.chirp-br-hero__initial[data-profile]{display:none}.chirp-br-hero__initial[data-profile="min-768"]{display:block}}
@media(min-width:1024px){.chirp-br-hero__initial[data-profile]{display:none}.chirp-br-hero__initial[data-profile="min-1024"]{display:block}}
@media(min-width:1280px){.chirp-br-hero__initial[data-profile]{display:none}.chirp-br-hero__initial[data-profile="min-1280"]{display:block}}
@media(min-width:1440px){.chirp-br-hero__initial[data-profile]{display:none}.chirp-br-hero__initial[data-profile="min-1440"]{display:block}}
@media(min-width:1920px){.chirp-br-hero__initial[data-profile]{display:none}.chirp-br-hero__initial[data-profile="min-1920"]{display:block}}
</style>
<style>
@media(prefers-reduced-motion:reduce){.chirp-br-hero [data-figma-motion]{translate:none!important}}
</style>
