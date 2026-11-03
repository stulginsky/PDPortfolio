<script setup lang="ts">
import {computed,ref} from 'vue'
import DsBadge from './DsBadge.vue'
import TypoText from './TypoText.vue'
import './showcase-card-layout.css'
import content from '../../content/absolut.json'

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
 <div class="absolut showcase-card" role="button" tabindex="0" :aria-label="content.title" :data-state="state"
  @pointerenter="enter" @pointerleave="hovered=false" @pointerdown="down" @pointerup="up" @pointercancel="reset" @blur="reset" @keydown="keydown" @keyup="keyup" @click="emit('activate',$event)">
  <div class="absolut__art" aria-hidden="true">
   <img class="absolut__image-17-1" src="/showcase/absolut/image-17-1.png" width="294" height="532" alt="" draggable="false" />
   <div class="absolut__art-blur" />
   <img class="absolut__image-15" src="/showcase/absolut/image-15.png" width="1536" height="1140" alt="" draggable="false" />
  </div>
  <div class="absolut__blur" aria-hidden="true" />
  <div class="absolut__gradient" aria-hidden="true" />
  <div class="absolut__copy">
   <div class="absolut__title-block"><TypoText tag="h2" class="absolut__title" :content="content.title" /><TypoText tag="p" class="absolut__subtitle" :content="content.subtitle" /></div>
   <ul class="absolut__badges" aria-label="Специализации"><li v-for="badge in content.badges" :key="badge"><span class="absolut__badge-base"><DsBadge :label="badge" type="CardCompact" /></span><span class="absolut__badge-default"><DsBadge :label="badge" type="Card" /></span></li></ul>
  </div>
 </div>
</template>

<style scoped>
.absolut {--art-width:288px;--art-height:500px;position:relative;isolation:isolate;overflow:hidden;border-radius:var(--radius-xlg);background:var(--decorative-showcase-absolut-background);color:var(--text-inverse);cursor:pointer;font-family:var(--text-font-sans);}
.absolut {--front-anchor-y:34.20789610210218px;--back-x:-214.947265625px;--back-y:-109px;--back-w:419px;--back-h:758px;--front-x:-110.947265625px;--front-y:16px;--front-w:548.3790283203125px;--front-h:407.0000305175781px;--front-angle:0deg;}
.absolut[data-state=Hover] {--front-anchor-y:-11.43354067043671px;--back-x:-109px;--back-y:0px;--back-w:276px;--back-h:499px;--front-x:-269px;--front-y:80.4801254272461px;--front-w:706.4466552734375px;--front-h:524.31591796875px;--front-angle:-16.401771044335604deg;}
.absolut[data-state=ActivePressed] {--front-anchor-y:21.826974881743933px;--back-x:-173.81884765625px;--back-y:-51px;--back-w:355px;--back-h:643px;--front-x:-155.86572265625px;--front-y:22.3564453125px;--front-w:588.1729125976562px;--front-h:436.5345764160156px;--front-angle:-3.402857737828132deg;}
.absolut__art {--art-scale:max(1,calc(100cqw / var(--art-width)));position:absolute;left:calc((100cqw - var(--art-width) * var(--art-scale)) / 2);top:0;width:var(--art-width);height:var(--art-height);transform-origin:0 0;transform:scale(var(--art-scale));pointer-events:none;}
.absolut__image-17-1,.absolut__image-15 {position:absolute;display:block;max-width:none;object-fit:cover;transform-origin:0 0;transition:left 300ms ease-out,top 300ms ease-out,width 300ms ease-out,height 300ms ease-out,transform 300ms ease-out;user-select:none;}
.absolut__image-17-1 {left:var(--back-x);top:var(--back-y);width:var(--back-w);height:var(--back-h);}
.absolut__image-15 {left:calc(var(--back-x) + var(--back-w) - var(--front-w) * 0.5735677083333334);top:calc(var(--front-anchor-y) - var(--front-h) * 0.04473684210526316);width:var(--front-w);height:var(--front-h);transform-origin:57.356770833333336% 4.473684210526316%;transform:rotate(var(--front-angle));}
.absolut[data-state=ActivePressed] img {transition-duration:150ms;}
.absolut__art-blur {position:absolute;inset:0;background:rgb(217 217 217 / .02);backdrop-filter:blur(3.5px);}
.absolut__blur {position:absolute;inset:auto 0 0;height:200px;backdrop-filter:blur(30px);background:rgb(0 0 0 / .01);mask-image:linear-gradient(to bottom,transparent,black);pointer-events:none;}
.absolut__gradient {position:absolute;inset:0;background:linear-gradient(to bottom,transparent 19.2307696%,rgb(0 0 0 / .6) 75%,rgb(0 0 0 / .65) 100%);pointer-events:none;}
.absolut__copy {position:absolute;inset:auto var(--space-4) var(--space-4);display:flex;flex-direction:column;gap:var(--space-3);pointer-events:none;}
.absolut__title-block {display:flex;flex-direction:column;gap:var(--space-1);}
.absolut__title,.absolut__subtitle {margin:0;font-weight:600;font-optical-sizing:auto;font-variation-settings:var(--heading-22-font-variation);}
.absolut__title {font-size:calc(22px * var(--showcase-copy-scale));line-height:1.3;letter-spacing:.03em;}
.absolut__subtitle {font-size:calc(13.333333px * var(--showcase-copy-scale));line-height:1.5;font-variation-settings:var(--heading-16-font-variation);}
.absolut__badges {display:flex;flex-wrap:wrap;gap:var(--space-2);margin:0;padding:0;list-style:none;}
.absolut__badges li,.absolut__badge-base {display:flex;}
.absolut__badge-default {display:none;}
.absolut:focus-visible {outline:2px solid var(--border-focus);outline-offset:3px;}

@media(min-width:462px){
.absolut {--art-width:430px;--art-height:532px;}
.absolut {--front-anchor-y:36.46052768104955px;--back-x:-152px;--back-y:-117px;--back-w:448px;--back-h:810px;--front-x:-41px;--front-y:17px;--front-w:586.1052856445312px;--front-h:435.0000305175781px;--front-angle:0deg;}
.absolut[data-state=Hover] {--front-anchor-y:-20.151863835585004px;--back-x:-41px;--back-y:0px;--back-w:294px;--back-h:532px;--front-x:-210.79859924316406px;--front-y:54.92753601074219px;--front-w:753.0857543945312px;--front-h:558.9308471679688px;--front-angle:-13.305991125934431deg;}
.absolut[data-state=ActivePressed] {--front-anchor-y:24.598287839717326px;--back-x:-128px;--back-y:-53px;--back-w:382px;--back-h:690px;--front-x:-109.36186981201172px;--front-y:25.170001983642578px;--front-w:632px;--front-h:469px;--front-angle:-3.402857737828132deg;}
.absolut__subtitle {font-size:calc(16px * var(--showcase-copy-scale));}
.absolut__badge-base {display:none;}.absolut__badge-default {display:flex;}
}
@media(prefers-reduced-motion:reduce){.absolut img{transition:none!important;}}
</style>
