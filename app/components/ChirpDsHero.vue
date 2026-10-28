<script setup lang="ts">
import { vMediaReady } from './media-readiness'
import { vLayeredScene } from './layered-scene-readiness'
import LayeredSceneFallback from './LayeredSceneFallback.vue'
import { useHeroMotion } from './hero-motion'
import {computed,inject,nextTick,onMounted,onUnmounted,ref,watch} from 'vue'
import DsRoleFocus from './DsRoleFocus.vue'
import TypoText from './TypoText.vue'
import caseContent from '../../content/cases/chirp-design-system.json'
import {createHeroDraft,getHeroBreakpoint,heroBreakpoints,heroReferences,heroSceneEditorKey,type HeroBreakpoint} from './chirp-ds-hero.scene-context'
const props=defineProps<{role?:string;focus?:string;breakpoint?:HeroBreakpoint;panelAppearance?:'default'|'on-light'|'on-dark'}>()
const panelAppearance=computed(()=>props.panelAppearance??'default')
const editor=inject(heroSceneEditorKey,undefined)
const root=ref<HTMLElement>()
const panelBox=ref<HTMLElement>()
const panelHeight=ref<number>()
const ready=ref(false)
const heroHeight=computed(()=>(reference.value.panel.y+(panelHeight.value??reference.value.panel.height))*ratio.value)
const viewport=ref(320)
const containerWidth=ref(320)
const breakpoint=computed(()=>props.breakpoint??getHeroBreakpoint(viewport.value))
const reference=computed(()=>heroReferences[breakpoint.value])
const defaults=createHeroDraft()
const layers=computed(()=>(editor?.draft??defaults)[breakpoint.value])
// CSS and picture select these accepted profiles before JavaScript executes.
const initialProfiles = [...heroBreakpoints].reverse()
function titleAsset(profile: HeroBreakpoint) { return '/cases/chirp-design-system/hero-layers/'+profile+'/'+heroReferences[profile].title.id.replace(':','-')+'/chirp-design-system.svg' }
function initialValues(profile: HeroBreakpoint) {
 const reference=heroReferences[profile], scene=defaults[profile]
 const px=(n:number)=>n+'px'
 return {scale:'calc(100cqw / '+reference.width+'px)',width:px(reference.width),
  clip:px(reference.clip.height),padding:px(reference.panel.padding),
  titleX:px(scene[0]!.x-reference.clip.x),titleY:px(scene[0]!.y-reference.clip.y),
  birdX:px(scene[1]!.x-scene[1]!.width),birdY:px(scene[1]!.y),birdW:px(scene[1]!.width),birdH:px(scene[1]!.height),
  copyX:px(scene[2]!.x-reference.panel.x),copyY:px(scene[2]!.y-reference.role.y),copyW:px(scene[2]!.width),
  bottom:px(reference.panel.padding+Math.max(0,scene[2]!.y-reference.role.y)),
  base:profile==='base'?'block':'none',web:profile==='base'?'none':'block'}
}
const initialStyle=computed(()=>{
 const values:Record<string,string>={}
 for(const profile of heroBreakpoints) for(const [key,value] of Object.entries(initialValues(profile))) values['--'+profile+'-'+key]=value
 if(props.breakpoint) for(const [key,value] of Object.entries(initialValues(props.breakpoint))) values['--initial-'+key]=value
 return values
})
const ratio=computed(()=>containerWidth.value/reference.value.width)
const copy=computed(()=>({...caseContent.hero,role:props.role??caseContent.hero.role,focus:props.focus??caseContent.hero.focus}))
const isMoving = (layer: typeof layers.value[number]) => layer.animationEnabled && layer.name!=='Role-Focus'
const layerElements:HTMLElement[]=[]
let latestOffsets:number[]=[]
let resizeObserver:ResizeObserver|undefined
function shift(index:number){const layer=layers.value[index]!,base=defaults[breakpoint.value][index]!;return {left:(layer.x-base.x)+'px',top:(layer.y-base.y)+'px'}}
function setLayer(element: unknown, index: number) {
  if (element instanceof HTMLElement) layerElements[index] = element
}
function renderOffsets(values:number[]=latestOffsets){
 latestOffsets=values
 values.forEach((value,index)=>layerElements[index]?.style.setProperty('--motion-x',(value / ratio.value) + 'px'))
}
const {resetMotion,replayIntro,maybeIntro,pointerDown,release}=useHeroMotion({
 root,layers:()=>layers.value,breakpoint:()=>breakpoint.value,mode:()=>editor?.mode.value,
 width:()=>containerWidth.value,viewport:()=>viewport.value,render:renderOffsets,enabled:isMoving,scope:'hero'
})
function sync() {
  viewport.value = window.innerWidth
  containerWidth.value = root.value?.clientWidth || viewport.value
  if(panelBox.value) panelHeight.value=panelBox.value.getBoundingClientRect().height/ratio.value
  nextTick(renderOffsets)
}
watch(()=>breakpoint.value,()=>{panelHeight.value=undefined;void nextTick(sync)})
onMounted(async()=>{sync();await nextTick();if(!root.value)return;sync();ready.value=true;resizeObserver=new ResizeObserver(sync);resizeObserver.observe(root.value!);resizeObserver.observe(panelBox.value!);window.addEventListener('resize',sync)})
onUnmounted(()=>{resizeObserver?.disconnect();window.removeEventListener('resize',sync)})
defineExpose({ replayIntro, resetMotion })


</script>
<template>
 <section v-media-ready v-layered-scene ref="root" class="chirp-ds-hero media-skeleton media-skeleton--hero" :data-breakpoint="breakpoint" :data-ready="ready" data-motion="neutral" :aria-label="caseContent.pageTitle" :data-panel-appearance="panelAppearance" :style="[initialStyle,{height:heroHeight+'px', '--hero-banner-height':reference.panel.y*ratio+'px'}]" @scene-ready="maybeIntro" @pointerdown="pointerDown" @pointerleave="release()">
  <LayeredSceneFallback name="chirp-ds-hero" />
  <h1 class="chirp-ds-hero__semantic"><TypoText :content="copy.title" /></h1>
  <div class="chirp-ds-hero__stage" :style="{width:reference.width+'px',transform:'scale('+ratio+')'}">
   <div class="chirp-ds-hero__clip" :data-source-id="reference.clip.id" :style="{left:reference.clip.x+'px',top:reference.clip.y+'px',width:reference.clip.width+'px',height:reference.clip.height+'px'}">
   <div :ref="el=>setLayer(el,0)" data-layer="Chirp design system" :data-source-id="layers[0]!.id" class="chirp-ds-hero__title" :style="{left:(layers[0]!.x-reference.clip.x)+'px',top:(layers[0]!.y-reference.clip.y)+'px'}">
    <picture>
     <template v-if="!ready && !props.breakpoint"><source v-for="profile in initialProfiles" :key="profile" :media="profile==='base'?'(min-width: 0px)':'(min-width: '+heroReferences[profile].width+'px)'" :srcset="titleAsset(profile)" /></template>
     <img :src="titleAsset(breakpoint)" alt="" aria-hidden="true" draggable="false" @load="maybeIntro" />
    </picture>
   </div>
   </div>
   <div ref="panelBox" class="chirp-ds-hero__panel" :style="{left:reference.panel.x+'px',top:reference.panel.y+'px',width:reference.panel.width+'px',paddingTop:reference.panel.padding+'px',paddingBottom:(reference.panel.padding+Math.max(0,layers[2]!.y-reference.role.y))+'px'}">
    <div :ref="el=>setLayer(el,2)" data-layer="Role-Focus" :data-source-id="layers[2]!.id" class="chirp-ds-hero__copy" :style="{left:(layers[2]!.x-reference.panel.x)+'px',top:(layers[2]!.y-reference.role.y)+'px',width:layers[2]!.width+'px'}">
     <DsRoleFocus v-if="ready" :role="copy.role" :focus="copy.focus" :style="{color:panelAppearance==='on-dark'?'var(--text-inverse)':'var(--text-secondary)'}" :breakpoint="breakpoint==='base'?'base':'min-425'" />
     <template v-else><div v-for="variant in (['base','min-425'] as const)" :key="variant" :class="'chirp-ds-hero__initial-role--'+variant"><DsRoleFocus :role="copy.role" :focus="copy.focus" :breakpoint="variant" :style="{color:panelAppearance==='on-dark'?'var(--text-inverse)':'var(--text-secondary)'}" /></div></template>
    </div>
   </div>
   <div :ref="el=>setLayer(el,1)" data-layer="b05-metaphor-songbird-v1 1" :data-source-id="layers[1]!.id" :data-animation-enabled="layers[1]!.animationEnabled" class="chirp-ds-hero__bird" :style="{left:(layers[1]!.x-layers[1]!.width)+'px',top:layers[1]!.y+'px',width:layers[1]!.width+'px',height:layers[1]!.height+'px'}">
    <img src="/cases/chirp-design-system/hero-layers/b05-metaphor-songbird-v1-1.png" :width="layers[1]!.width" :height="layers[1]!.height" alt="" aria-hidden="true" draggable="false" @load="maybeIntro" />
   </div>
  </div>
 </section>
</template>
<style scoped>
.chirp-ds-hero{position:relative;width:100%;container-type:inline-size;overflow:clip;touch-action:pan-y}
.chirp-ds-hero__clip{position:absolute;overflow:hidden;background:var(--decorative-case-background-chirp-ds)}
.chirp-ds-hero__stage{position:relative;transform-origin:top left}
.chirp-ds-hero__title,.chirp-ds-hero__panel,.chirp-ds-hero__bird{position:absolute}
.chirp-ds-hero__title{transform:translate3d(var(--motion-x,0px),0,0)}
.chirp-ds-hero__title img{display:block;max-width:none;pointer-events:none;user-select:none}
.chirp-ds-hero__panel{box-sizing:border-box;background:var(--surface-default)}
.chirp-ds-hero[data-panel-appearance='on-light'] .chirp-ds-hero__panel,.chirp-ds-hero[data-panel-appearance='on-dark'] .chirp-ds-hero__panel{background:transparent}
.chirp-ds-hero__copy{position:relative}
.chirp-ds-hero__bird{transform:translate3d(var(--motion-x,0px),0,0);pointer-events:none}
.chirp-ds-hero__bird img{display:block;transform:scaleX(-1);max-width:none}
.chirp-ds-hero__semantic{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;margin:0}
@media(prefers-reduced-motion:reduce){.chirp-ds-hero__bird,.chirp-ds-hero__title{transform:none}}

/* Server-rendered geometry selected before JavaScript. */
.chirp-ds-hero{--initial-scale:var(--base-scale);--initial-width:var(--base-width);--initial-clip:var(--base-clip);--initial-padding:var(--base-padding);--initial-titleX:var(--base-titleX);--initial-titleY:var(--base-titleY);--initial-birdX:var(--base-birdX);--initial-birdY:var(--base-birdY);--initial-birdW:var(--base-birdW);--initial-birdH:var(--base-birdH);--initial-copyX:var(--base-copyX);--initial-copyY:var(--base-copyY);--initial-copyW:var(--base-copyW);--initial-bottom:var(--base-bottom);--initial-base:var(--base-base);--initial-web:var(--base-web);}
@media(min-width:768px){.chirp-ds-hero{--initial-scale:var(--min-768-scale);--initial-width:var(--min-768-width);--initial-clip:var(--min-768-clip);--initial-padding:var(--min-768-padding);--initial-titleX:var(--min-768-titleX);--initial-titleY:var(--min-768-titleY);--initial-birdX:var(--min-768-birdX);--initial-birdY:var(--min-768-birdY);--initial-birdW:var(--min-768-birdW);--initial-birdH:var(--min-768-birdH);--initial-copyX:var(--min-768-copyX);--initial-copyY:var(--min-768-copyY);--initial-copyW:var(--min-768-copyW);--initial-bottom:var(--min-768-bottom);--initial-base:var(--min-768-base);--initial-web:var(--min-768-web);}
}
@media(min-width:1024px){.chirp-ds-hero{--initial-scale:var(--min-1024-scale);--initial-width:var(--min-1024-width);--initial-clip:var(--min-1024-clip);--initial-padding:var(--min-1024-padding);--initial-titleX:var(--min-1024-titleX);--initial-titleY:var(--min-1024-titleY);--initial-birdX:var(--min-1024-birdX);--initial-birdY:var(--min-1024-birdY);--initial-birdW:var(--min-1024-birdW);--initial-birdH:var(--min-1024-birdH);--initial-copyX:var(--min-1024-copyX);--initial-copyY:var(--min-1024-copyY);--initial-copyW:var(--min-1024-copyW);--initial-bottom:var(--min-1024-bottom);--initial-base:var(--min-1024-base);--initial-web:var(--min-1024-web);}
}
@media(min-width:1280px){.chirp-ds-hero{--initial-scale:var(--min-1280-scale);--initial-width:var(--min-1280-width);--initial-clip:var(--min-1280-clip);--initial-padding:var(--min-1280-padding);--initial-titleX:var(--min-1280-titleX);--initial-titleY:var(--min-1280-titleY);--initial-birdX:var(--min-1280-birdX);--initial-birdY:var(--min-1280-birdY);--initial-birdW:var(--min-1280-birdW);--initial-birdH:var(--min-1280-birdH);--initial-copyX:var(--min-1280-copyX);--initial-copyY:var(--min-1280-copyY);--initial-copyW:var(--min-1280-copyW);--initial-bottom:var(--min-1280-bottom);--initial-base:var(--min-1280-base);--initial-web:var(--min-1280-web);}
}
@media(min-width:1440px){.chirp-ds-hero{--initial-scale:var(--min-1440-scale);--initial-width:var(--min-1440-width);--initial-clip:var(--min-1440-clip);--initial-padding:var(--min-1440-padding);--initial-titleX:var(--min-1440-titleX);--initial-titleY:var(--min-1440-titleY);--initial-birdX:var(--min-1440-birdX);--initial-birdY:var(--min-1440-birdY);--initial-birdW:var(--min-1440-birdW);--initial-birdH:var(--min-1440-birdH);--initial-copyX:var(--min-1440-copyX);--initial-copyY:var(--min-1440-copyY);--initial-copyW:var(--min-1440-copyW);--initial-bottom:var(--min-1440-bottom);--initial-base:var(--min-1440-base);--initial-web:var(--min-1440-web);}
}
@media(min-width:1920px){.chirp-ds-hero{--initial-scale:var(--min-1920-scale);--initial-width:var(--min-1920-width);--initial-clip:var(--min-1920-clip);--initial-padding:var(--min-1920-padding);--initial-titleX:var(--min-1920-titleX);--initial-titleY:var(--min-1920-titleY);--initial-birdX:var(--min-1920-birdX);--initial-birdY:var(--min-1920-birdY);--initial-birdW:var(--min-1920-birdW);--initial-birdH:var(--min-1920-birdH);--initial-copyX:var(--min-1920-copyX);--initial-copyY:var(--min-1920-copyY);--initial-copyW:var(--min-1920-copyW);--initial-bottom:var(--min-1920-bottom);--initial-base:var(--min-1920-base);--initial-web:var(--min-1920-web);}
}
.chirp-ds-hero[data-ready="false"]{height:auto!important}
.chirp-ds-hero[data-ready="false"] .chirp-ds-hero__stage{width:var(--initial-width)!important;transform:none!important;zoom:var(--initial-scale);padding-top:var(--initial-clip)}
.chirp-ds-hero[data-ready="false"] .chirp-ds-hero__clip{left:0!important;top:0!important;width:var(--initial-width)!important;height:var(--initial-clip)!important}
.chirp-ds-hero[data-ready="false"] .chirp-ds-hero__title{left:var(--initial-titleX)!important;top:var(--initial-titleY)!important}
.chirp-ds-hero[data-ready="false"] .chirp-ds-hero__panel{position:relative;left:0!important;top:0!important;width:var(--initial-width)!important;padding-top:var(--initial-padding)!important;padding-bottom:var(--initial-bottom)!important}
.chirp-ds-hero[data-ready="false"] .chirp-ds-hero__copy{left:var(--initial-copyX)!important;top:var(--initial-copyY)!important;width:var(--initial-copyW)!important}
.chirp-ds-hero[data-ready="false"] .chirp-ds-hero__bird{left:var(--initial-birdX)!important;top:var(--initial-birdY)!important;width:var(--initial-birdW)!important;height:var(--initial-birdH)!important}
.chirp-ds-hero[data-ready="false"] .chirp-ds-hero__bird img{width:100%;height:100%}
.chirp-ds-hero__initial-role--base{display:var(--initial-base)}
.chirp-ds-hero__initial-role--min-425{display:var(--initial-web)}
</style>

