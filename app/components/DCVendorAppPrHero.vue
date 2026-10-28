<script setup lang="ts">
import { computed, inject, nextTick, onMounted, onUnmounted, ref } from 'vue'
import TypoText from './TypoText.vue'
import content from '../../content/cases/dc-vendor-app-pr.json'
import { useHeroMotion } from './hero-motion'
import { vMediaReady } from './media-readiness'
import { vLayeredScene } from './layered-scene-readiness'
import LayeredSceneFallback from './LayeredSceneFallback.vue'
import { createHeroDraft, getHeroBreakpoint, heroBreakpoints, heroReferences, heroSceneEditorKey, type HeroBreakpoint } from './dc-vendor-app-pr-hero.scene-context'
import { heroAssets } from './dc-vendor-app-pr-hero.assets'

const props=defineProps<{breakpoint?:HeroBreakpoint}>()
const root=ref<HTMLElement>(), viewport=ref(320), width=ref(320), ready=ref(false)
const editor=inject(heroSceneEditorKey,undefined), defaults=createHeroDraft()
const breakpoint=computed(()=>props.breakpoint??getHeroBreakpoint(viewport.value))
const layers=computed(()=>(editor?.draft??defaults)[breakpoint.value])
const reference=computed(()=>heroReferences[breakpoint.value])
const nodes:HTMLElement[]=[]
let offsets:number[]=[]
function render(values=offsets){offsets=values;nodes.forEach((node,i)=>node?.style.setProperty('--parallax-x',(values[i]??0)+'px'))}
const {resetMotion,replayIntro,maybeIntro,pointerDown}=useHeroMotion({
 root,layers:()=>layers.value,breakpoint:()=>breakpoint.value,mode:()=>editor?.mode.value??'Interaction',
 width:()=>width.value,viewport:()=>viewport.value,render,scope:'viewport',
})
const profiles=[...heroBreakpoints].reverse()
function asset(profile:HeroBreakpoint,index:number){return '/cases/dc-vendor-app-pr/hero-layers/'+profile+'/'+heroAssets[profile][index]!.file}
function media(profile:HeroBreakpoint){return '(min-width: '+(profile==='base'?0:Number(profile.slice(4)))+'px)'}
function profileValues(profile:HeroBreakpoint){
 const r=heroReferences[profile],scene=defaults[profile],values:Record<string,string>={aspect:r.width+' / '+r.height}
 const length=(n:number)=>n/r.width*100+'cqw'
 scene.forEach((l,i)=>{const a=heroAssets[profile][i]!;values['x'+i]=length(l.x+a.x);values['y'+i]=length(l.y+a.y);values['w'+i]=length(a.width);values['h'+i]=length(a.height)})
 return values
}
const rootStyle=computed(()=>{
 const values:Record<string,string>={}
 for(const bp of heroBreakpoints)for(const [key,value]of Object.entries(profileValues(bp)))values['--'+bp+'-'+key]=value
 if(props.breakpoint)for(const [key,value]of Object.entries(profileValues(props.breakpoint)))values['--initial-'+key]=value
 if(ready.value)values.aspectRatio=reference.value.width+' / '+reference.value.height
 return values
})
function geometry(index:number){
 if(!ready.value)return
 const layer=layers.value[index]!,a=heroAssets[breakpoint.value][index]!,length=(n:number)=>n/reference.value.width*100+'cqw'
 return {left:length(layer.x+a.x),top:length(layer.y+a.y),width:length(a.width),height:length(a.height)}
}
function sync(){viewport.value=window.innerWidth;width.value=root.value?.getBoundingClientRect().width||viewport.value;void nextTick(()=>render())}
let observer:ResizeObserver|undefined
onMounted(()=>{sync();ready.value=true;observer=new ResizeObserver(sync);observer.observe(root.value!);window.addEventListener('resize',sync)})
onUnmounted(()=>{observer?.disconnect();window.removeEventListener('resize',sync)})
defineExpose({resetMotion,replayIntro})
</script>

<template>
 <section v-media-ready v-layered-scene ref="root" class="dc-vendor-app-pr-hero media-skeleton" :data-breakpoint="breakpoint" :data-ready="ready" :style="rootStyle" :aria-label="content.hero.title" @scene-ready="maybeIntro" @pointerdown="pointerDown">
  <LayeredSceneFallback name="dc-vendor-app-pr-hero" />
  <div class="dc-vendor-app-pr-hero__art" aria-hidden="true">
   <picture v-for="(layer,index) in layers" v-media-ready :key="layer.name" :ref="el=>{if(el)nodes[index]=el as HTMLElement}" class="dc-vendor-app-pr-hero__layer" :class="'dc-layer-'+index" :data-layer="layer.name" :data-animation-enabled="layer.animationEnabled" :style="geometry(index)">
    <template v-if="!props.breakpoint"><source v-for="profile in profiles" :key="profile" :media="media(profile)" :srcset="asset(profile,index)" /></template>
    <img :src="asset(breakpoint,index)" :fetchpriority="layer.name === 'Title' ? 'high' : 'auto'" alt="" draggable="false" decoding="async" @load="maybeIntro" />
   </picture>
  </div>
  <div class="dc-vendor-app-pr-hero__semantic">
   <TypoText tag="h1" :content="content.hero.title" />
   <TypoText tag="p" :content="content.hero.subtitle" />
   <TypoText tag="p" :content="content.hero.description" />
   <TypoText tag="p" :content="content.hero.markers" />
  </div>
 </section>
</template>

<style scoped>
.dc-vendor-app-pr-hero{position:relative;isolation:isolate;container-type:inline-size;width:100%;overflow:hidden;aspect-ratio:var(--initial-aspect,var(--aspect));touch-action:pan-y}
.dc-vendor-app-pr-hero__art{position:absolute;inset:0;pointer-events:none;z-index:1}
.dc-vendor-app-pr-hero__layer{position:absolute;display:block;transform:translate3d(var(--parallax-x,0px),0,0)}
.dc-vendor-app-pr-hero__layer img{display:block;width:100%;height:100%;max-width:none;user-select:none}
.dc-vendor-app-pr-hero[data-media-state=loading] .dc-vendor-app-pr-hero__art{visibility:hidden}
.dc-vendor-app-pr-hero[data-media-state=loading]{background-color:#C3D9EA}
.dc-vendor-app-pr-hero__layer[data-layer=Title][data-media-state=ready]{visibility:visible}
.dc-vendor-app-pr-hero__semantic{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0}
.dc-vendor-app-pr-hero{--aspect:var(--base-aspect);--x0:var(--base-x0);--y0:var(--base-y0);--w0:var(--base-w0);--h0:var(--base-h0);--x1:var(--base-x1);--y1:var(--base-y1);--w1:var(--base-w1);--h1:var(--base-h1);--x2:var(--base-x2);--y2:var(--base-y2);--w2:var(--base-w2);--h2:var(--base-h2);--x3:var(--base-x3);--y3:var(--base-y3);--w3:var(--base-w3);--h3:var(--base-h3);--x4:var(--base-x4);--y4:var(--base-y4);--w4:var(--base-w4);--h4:var(--base-h4);--x5:var(--base-x5);--y5:var(--base-y5);--w5:var(--base-w5);--h5:var(--base-h5);--x6:var(--base-x6);--y6:var(--base-y6);--w6:var(--base-w6);--h6:var(--base-h6);--x7:var(--base-x7);--y7:var(--base-y7);--w7:var(--base-w7);--h7:var(--base-h7);}
@media(min-width:768px){.dc-vendor-app-pr-hero{--aspect:var(--min-768-aspect);--x0:var(--min-768-x0);--y0:var(--min-768-y0);--w0:var(--min-768-w0);--h0:var(--min-768-h0);--x1:var(--min-768-x1);--y1:var(--min-768-y1);--w1:var(--min-768-w1);--h1:var(--min-768-h1);--x2:var(--min-768-x2);--y2:var(--min-768-y2);--w2:var(--min-768-w2);--h2:var(--min-768-h2);--x3:var(--min-768-x3);--y3:var(--min-768-y3);--w3:var(--min-768-w3);--h3:var(--min-768-h3);--x4:var(--min-768-x4);--y4:var(--min-768-y4);--w4:var(--min-768-w4);--h4:var(--min-768-h4);--x5:var(--min-768-x5);--y5:var(--min-768-y5);--w5:var(--min-768-w5);--h5:var(--min-768-h5);--x6:var(--min-768-x6);--y6:var(--min-768-y6);--w6:var(--min-768-w6);--h6:var(--min-768-h6);--x7:var(--min-768-x7);--y7:var(--min-768-y7);--w7:var(--min-768-w7);--h7:var(--min-768-h7);}}
@media(min-width:1024px){.dc-vendor-app-pr-hero{--aspect:var(--min-1024-aspect);--x0:var(--min-1024-x0);--y0:var(--min-1024-y0);--w0:var(--min-1024-w0);--h0:var(--min-1024-h0);--x1:var(--min-1024-x1);--y1:var(--min-1024-y1);--w1:var(--min-1024-w1);--h1:var(--min-1024-h1);--x2:var(--min-1024-x2);--y2:var(--min-1024-y2);--w2:var(--min-1024-w2);--h2:var(--min-1024-h2);--x3:var(--min-1024-x3);--y3:var(--min-1024-y3);--w3:var(--min-1024-w3);--h3:var(--min-1024-h3);--x4:var(--min-1024-x4);--y4:var(--min-1024-y4);--w4:var(--min-1024-w4);--h4:var(--min-1024-h4);--x5:var(--min-1024-x5);--y5:var(--min-1024-y5);--w5:var(--min-1024-w5);--h5:var(--min-1024-h5);--x6:var(--min-1024-x6);--y6:var(--min-1024-y6);--w6:var(--min-1024-w6);--h6:var(--min-1024-h6);--x7:var(--min-1024-x7);--y7:var(--min-1024-y7);--w7:var(--min-1024-w7);--h7:var(--min-1024-h7);}}
@media(min-width:1280px){.dc-vendor-app-pr-hero{--aspect:var(--min-1280-aspect);--x0:var(--min-1280-x0);--y0:var(--min-1280-y0);--w0:var(--min-1280-w0);--h0:var(--min-1280-h0);--x1:var(--min-1280-x1);--y1:var(--min-1280-y1);--w1:var(--min-1280-w1);--h1:var(--min-1280-h1);--x2:var(--min-1280-x2);--y2:var(--min-1280-y2);--w2:var(--min-1280-w2);--h2:var(--min-1280-h2);--x3:var(--min-1280-x3);--y3:var(--min-1280-y3);--w3:var(--min-1280-w3);--h3:var(--min-1280-h3);--x4:var(--min-1280-x4);--y4:var(--min-1280-y4);--w4:var(--min-1280-w4);--h4:var(--min-1280-h4);--x5:var(--min-1280-x5);--y5:var(--min-1280-y5);--w5:var(--min-1280-w5);--h5:var(--min-1280-h5);--x6:var(--min-1280-x6);--y6:var(--min-1280-y6);--w6:var(--min-1280-w6);--h6:var(--min-1280-h6);--x7:var(--min-1280-x7);--y7:var(--min-1280-y7);--w7:var(--min-1280-w7);--h7:var(--min-1280-h7);}}
@media(min-width:1440px){.dc-vendor-app-pr-hero{--aspect:var(--min-1440-aspect);--x0:var(--min-1440-x0);--y0:var(--min-1440-y0);--w0:var(--min-1440-w0);--h0:var(--min-1440-h0);--x1:var(--min-1440-x1);--y1:var(--min-1440-y1);--w1:var(--min-1440-w1);--h1:var(--min-1440-h1);--x2:var(--min-1440-x2);--y2:var(--min-1440-y2);--w2:var(--min-1440-w2);--h2:var(--min-1440-h2);--x3:var(--min-1440-x3);--y3:var(--min-1440-y3);--w3:var(--min-1440-w3);--h3:var(--min-1440-h3);--x4:var(--min-1440-x4);--y4:var(--min-1440-y4);--w4:var(--min-1440-w4);--h4:var(--min-1440-h4);--x5:var(--min-1440-x5);--y5:var(--min-1440-y5);--w5:var(--min-1440-w5);--h5:var(--min-1440-h5);--x6:var(--min-1440-x6);--y6:var(--min-1440-y6);--w6:var(--min-1440-w6);--h6:var(--min-1440-h6);--x7:var(--min-1440-x7);--y7:var(--min-1440-y7);--w7:var(--min-1440-w7);--h7:var(--min-1440-h7);}}
@media(min-width:1920px){.dc-vendor-app-pr-hero{--aspect:var(--min-1920-aspect);--x0:var(--min-1920-x0);--y0:var(--min-1920-y0);--w0:var(--min-1920-w0);--h0:var(--min-1920-h0);--x1:var(--min-1920-x1);--y1:var(--min-1920-y1);--w1:var(--min-1920-w1);--h1:var(--min-1920-h1);--x2:var(--min-1920-x2);--y2:var(--min-1920-y2);--w2:var(--min-1920-w2);--h2:var(--min-1920-h2);--x3:var(--min-1920-x3);--y3:var(--min-1920-y3);--w3:var(--min-1920-w3);--h3:var(--min-1920-h3);--x4:var(--min-1920-x4);--y4:var(--min-1920-y4);--w4:var(--min-1920-w4);--h4:var(--min-1920-h4);--x5:var(--min-1920-x5);--y5:var(--min-1920-y5);--w5:var(--min-1920-w5);--h5:var(--min-1920-h5);--x6:var(--min-1920-x6);--y6:var(--min-1920-y6);--w6:var(--min-1920-w6);--h6:var(--min-1920-h6);--x7:var(--min-1920-x7);--y7:var(--min-1920-y7);--w7:var(--min-1920-w7);--h7:var(--min-1920-h7);}}
.dc-layer-0{left:var(--initial-x0,var(--x0));top:var(--initial-y0,var(--y0));width:var(--initial-w0,var(--w0));height:var(--initial-h0,var(--h0))}
.dc-layer-1{left:var(--initial-x1,var(--x1));top:var(--initial-y1,var(--y1));width:var(--initial-w1,var(--w1));height:var(--initial-h1,var(--h1))}
.dc-layer-2{left:var(--initial-x2,var(--x2));top:var(--initial-y2,var(--y2));width:var(--initial-w2,var(--w2));height:var(--initial-h2,var(--h2))}
.dc-layer-3{left:var(--initial-x3,var(--x3));top:var(--initial-y3,var(--y3));width:var(--initial-w3,var(--w3));height:var(--initial-h3,var(--h3))}
.dc-layer-4{left:var(--initial-x4,var(--x4));top:var(--initial-y4,var(--y4));width:var(--initial-w4,var(--w4));height:var(--initial-h4,var(--h4))}
.dc-layer-5{left:var(--initial-x5,var(--x5));top:var(--initial-y5,var(--y5));width:var(--initial-w5,var(--w5));height:var(--initial-h5,var(--h5))}
.dc-layer-6{left:var(--initial-x6,var(--x6));top:var(--initial-y6,var(--y6));width:var(--initial-w6,var(--w6));height:var(--initial-h6,var(--h6))}
.dc-layer-7{left:var(--initial-x7,var(--x7));top:var(--initial-y7,var(--y7));width:var(--initial-w7,var(--w7));height:var(--initial-h7,var(--h7))}
</style>

