<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import DCVendorAppUxHero from '../../components/DCVendorAppUxHero.vue'
import DsBtnNav from '../../components/DsBtnNav.vue'
import DsRoleFocus from '../../components/DsRoleFocus.vue'
import DsPageUp from '../../components/DsPageUp.vue'
import DsCaseImagePreview from '../../components/DsCaseImagePreview.vue'
import DsCaseImageViewer from '../../components/DsCaseImageViewer.vue'
import CaseContentCard from '../../components/CaseContentCard.vue'
import RelatedCases from '../../components/RelatedCases.vue'
import DsFooter from '../../components/DsFooter.vue'
import TypoText from '../../components/TypoText.vue'
import content from '../../../content/cases/dc-vendor-app-ux.json'
import { vMediaReady } from '../../components/media-readiness'

const page=content.page
const text=(id:string)=>(page.nodes as Record<string,string>)[id]!.replace(/\u2028/g,'\n')
const media=(name:string)=>page.media.find(item=>item.name===name)!
const headingParts=(value:string)=>value.match(/[^\u00a0]*\u00a0|[^\u00a0]+/g)??[]
const introPieces=computed(()=>{const value=text('387:31298'),term=page.introAccent,index=value.indexOf(term);return [{text:value.slice(0,index),accent:false},{text:term,accent:true},{text:value.slice(index+term.length),accent:false}]})
const scenarios=[
 {frame:'382:35847',band:'382:35855',heading:'382:35848',body:'382:35852',accent:'382:35853',name:'DCUX04',crop:'cancellation',muted:true},
 {frame:'387:67163',band:'387:67168',heading:'387:67457',body:'387:67459',accent:'387:67460',name:'DCUX05',crop:'proactive'},
 {frame:'387:67626',band:'387:67631',heading:'387:68085',body:'387:68086',name:'DCUX06',crop:'price',muted:true},
 {frame:'382:36185',band:'382:36198',heading:'382:36191',body:'382:36193',accent:'382:36194',name:'DCUX07',crop:'stop'},
 {frame:'382:36673',band:'382:36678',heading:'382:36862',body:'382:36864',name:'DCUX08',crop:'mvp'},
]
const contributions=[
 {title:'382:36963',body:'382:36964',name:'DCUX10-1'},
 {title:'382:36968',body:'382:36969',name:'DCUX10-2'},
 {title:'382:36973',body:'382:36974',name:'DCUX10-3'},
]
const mvpPieces=computed(()=>{const value=text('382:36864'),term=page.mvpEmphasis,index=value.indexOf(term);return [{text:value.slice(0,index),strong:false},{text:term,strong:true},{text:value.slice(index+term.length),strong:false}]})
const start=ref<HTMLElement>(),showPageUp=ref(false)
let observer:IntersectionObserver|undefined
onMounted(()=>{if(start.value){observer=new IntersectionObserver(([entry])=>{if(entry)showPageUp.value=entry.boundingClientRect.bottom<=0});observer.observe(start.value)}})
onUnmounted(()=>observer?.disconnect())
function scrollToStart(){start.value?.focus({preventScroll:true});window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})}
const viewerOpen=ref(false),activeMediaName=ref<string>(),viewerTitle=ref('')
const activeMedia=computed(()=>activeMediaName.value?media(activeMediaName.value):undefined)
function openMedia(name:string,title:string){activeMediaName.value=name;viewerTitle.value=title;viewerOpen.value=true}
useSeoMeta({title:page.pageTitle,description:text('387:31298')})
</script>

<template>
 <main class="ux-case">
  <div ref="start" tabindex="-1" class="ux-case__hero" data-figma-frame="387:31257">
   <DCVendorAppUxHero />
   <div class="ux-case__back"><DsBtnNav tag="a" href="/" :aria-label="page.backLabel" /></div>
  </div>
  <div class="ux-case__flow">
   <section class="ux-case__prose ux-case__about" data-figma-frame="387:31290">
    <h2 class="ux-case__heading"><template v-for="(part,index) in headingParts(text('387:31286'))" :key="index"><TypoText :content="part" /><wbr /></template></h2>
    <p class="ux-case__body ux-case__intro"><TypoText v-for="(piece,index) in introPieces" :key="index" :class="{'ux-case__intro-accent':piece.accent}" :content="piece.text" /></p>
   </section>
   <div class="ux-case__prose ux-case__role" data-figma-frame="387:31274"><DsRoleFocus :role="text('I387:31274;1107:7330')" :focus="text('I387:31274;1107:7333')" /></div>
   <section class="ux-case__prose" data-figma-frame="378:32407">
    <h2 class="ux-case__heading"><template v-for="(part,index) in headingParts(text('378:32408'))" :key="index"><TypoText :content="part" /><wbr /></template></h2>
    <div class="ux-case__copy"><TypoText tag="p" class="ux-case__body" :content="text('378:32410')" /><TypoText tag="p" class="ux-case__accent" :content="text('378:32411')" /></div>
   </section>
   <div class="ux-case__band" data-figma-frame="378:32542">
    <div class="ux-case__window ux-case__window--research">
     <DsCaseImagePreview type="v2" :title="text('378:32408')" @zoom="openMedia('DCUX01 1',text('378:32408'))">
      <div class="ux-case__viewport ux-case__viewport--research"><img :src="media('DCUX01 1').src" :width="media('DCUX01 1').width" :height="media('DCUX01 1').height" :alt="text('378:32408')" loading="lazy" /></div>
     </DsCaseImagePreview>
    </div>
   </div>
   <section class="ux-case__prose" data-figma-frame="382:32554">
    <h2 class="ux-case__heading"><template v-for="(part,index) in headingParts(text('382:32546'))" :key="index"><TypoText :content="part" /><wbr /></template></h2>
    <div class="ux-case__copy ux-case__directions-copy"><TypoText v-for="id in ['382:32548','382:32549','382:32550','382:32551','382:32552']" :key="id" :tag="['382:32549','382:32551'].includes(id)?'h3':'p'" :class="['382:32549','382:32551'].includes(id)?'ux-case__subheading':'ux-case__body'" :content="text(id)" /></div>
   </section>
   <section data-figma-frame="382:32662">
    <div class="ux-case__band ux-case__band--muted">
     <div class="ux-case__window ux-case__window--directions"><DsCaseImagePreview type="v2" :title="text('382:32546')" @zoom="openMedia('DCUX02',text('382:32546'))"><div class="ux-case__viewport"><img :src="media('DCUX02').src" :width="media('DCUX02').width" :height="media('DCUX02').height" :alt="text('382:32546')" loading="lazy" /></div></DsCaseImagePreview></div>
    </div>
    <div v-media-ready class="media-skeleton ux-case__photo"><div class="ux-case__photo-crop"><img :src="media('DCUX03').src" :width="media('DCUX03').width" :height="media('DCUX03').height" :alt="text('382:32546')" loading="lazy" /></div></div>
   </section>
   <section class="ux-case__prose" data-figma-frame="382:32650">
    <h2 class="ux-case__heading"><template v-for="(part,index) in headingParts(text('382:32651'))" :key="index"><TypoText :content="part" /><wbr /></template></h2>
    <TypoText tag="p" class="ux-case__body" :content="text('382:32663')" />
   </section>
   <div class="ux-case__band" data-figma-frame="382:32665"><div class="ux-case__window ux-case__window--process"><DsCaseImagePreview type="v2" :title="text('382:32651')" @zoom="openMedia('DCUX03-1',text('382:32651'))"><div class="ux-case__viewport ux-case__viewport--process"><img :src="media('DCUX03-1').src" :width="media('DCUX03-1').width" :height="media('DCUX03-1').height" :alt="text('382:32651')" loading="lazy" /></div></DsCaseImagePreview></div></div>
   <template v-for="item in scenarios" :key="item.frame">
    <section class="ux-case__prose" :data-figma-frame="item.frame">
     <h2 class="ux-case__heading"><template v-for="(part,index) in headingParts(text(item.heading))" :key="index"><TypoText :content="part" /><wbr /></template></h2>
     <div class="ux-case__copy">
      <p v-if="item.crop==='mvp'" class="ux-case__body"><TypoText v-for="(piece,index) in mvpPieces" :key="index" :class="{'ux-case__strong':piece.strong}" :content="piece.text" /></p>
      <TypoText v-else tag="p" class="ux-case__body" :content="text(item.body)" />
      <TypoText v-if="item.accent" tag="p" class="ux-case__accent" :content="text(item.accent)" />
     </div>
    </section>
    <div class="ux-case__band" :class="{'ux-case__band--muted':item.muted}" :data-figma-frame="item.band">
     <div class="ux-case__window ux-case__window--rounded" :class="'ux-case__window--'+item.crop">
      <DsCaseImagePreview type="v2" :title="text(item.heading)" @zoom="openMedia(item.name,text(item.heading))">
       <div class="ux-case__viewport" :class="'ux-case__viewport--'+item.crop">
        <div v-if="item.crop==='stop'" class="ux-case__stop-source"><img :src="media(item.name).src" :width="media(item.name).width" :height="media(item.name).height" :alt="text(item.heading)" loading="lazy" /></div>
        <img v-else :src="media(item.name).src" :width="media(item.name).width" :height="media(item.name).height" :alt="text(item.heading)" loading="lazy" />
       </div>
      </DsCaseImagePreview>
     </div>
    </div>
   </template>
   <section class="ux-case__results" data-figma-frame="382:36920">
    <div class="ux-case__results-heading ux-case__prose">
     <h2 class="ux-case__heading"><template v-for="(part,index) in headingParts(text('382:36922'))" :key="index"><TypoText :content="part" /><wbr /></template></h2>
     <TypoText tag="p" class="ux-case__body" :content="text('382:36923')" />
    </div>
    <div class="ux-case__results-images"><img v-for="name in ['DCUX09-1','DCUX09-2']" :key="name" :src="media(name).src" :width="media(name).width" :height="media(name).height" :alt="text('382:36922')" loading="lazy" /></div>
   </section>
   <section class="ux-case__contribution" data-figma-frame="382:36956">
    <TypoText tag="h2" class="ux-case__heading" :content="text('382:36958')" />
    <div class="case-content-layout"><div class="case-content-grid"><CaseContentCard v-for="item in contributions" :key="item.title" :title="text(item.title)" :body="text(item.body)" :src="media(item.name).src" :width="754" :height="450" :alt="text(item.title)" /></div></div>
   </section>
   <section class="ux-case__related" data-figma-frame="382:36975">
    <div class="ux-case__related-heading ux-case__prose">
     <h2 class="ux-case__heading"><template v-for="(part,index) in headingParts(text('382:36978'))" :key="index"><TypoText :content="part" /><wbr /></template></h2>
     <TypoText tag="p" class="ux-case__body" :content="text('382:36979')" />
    </div>
    <RelatedCases :card-names="['DCVendorAppPr']" current-case-href="/cases/dc-vendor-app-ux" />
    <DsFooter class="ux-case__footer" />
    <div class="ux-case__end" aria-hidden="true" />
   </section>
  </div>
  <DsPageUp v-if="showPageUp" @click="scrollToStart" />
  <DsCaseImageViewer v-if="activeMedia" v-model:open="viewerOpen" type="v2" :title="viewerTitle"><img :src="activeMedia.src" :width="activeMedia.width" :height="activeMedia.height" :alt="viewerTitle" /></DsCaseImageViewer>
 </main>
</template>

<style scoped>
.ux-case { --ux-gap:72px; --ux-media-height:256px; --ux-media-inset:16px; width:100%; overflow-x:clip; color:var(--text-default); background:var(--surface-default); }
.ux-case p,.ux-case h2,.ux-case h3 { margin:0; }
.ux-case__hero { position:relative; outline:none; }
.ux-case__back { position:absolute; top:0; left:0; height:100px; padding:var(--space-6); display:flex; align-items:center; box-sizing:border-box; z-index:2; }
.ux-case__flow { display:flex; flex-direction:column; gap:var(--ux-gap); padding-top:var(--ux-gap); }
.ux-case__prose { width:calc(100% - 32px); max-width:924px; margin-inline:auto; display:flex; flex-direction:column; gap:48px; min-width:0; }
.ux-case__heading { color:var(--accent-aubergine); font-size:48px; line-height:58px; font-weight:500; letter-spacing:-.005em; font-variation-settings:var(--heading-48-font-variation), "wght" 500; overflow-wrap:anywhere; white-space:pre-line; }
.ux-case__body { font-size:16px; line-height:26px; font-weight:400; letter-spacing:0; font-variation-settings:var(--body-16-regular-font-variation); white-space:pre-wrap; }
.ux-case__accent { font-size:20px; line-height:32px; font-weight:300; letter-spacing:.01em; color:var(--text-accent-dc); font-variation-settings:var(--body-20-regular-font-variation); white-space:pre-wrap; }
.ux-case__heading,.ux-case__body,.ux-case__accent { font-optical-sizing:auto; }
.ux-case__intro { max-width:846px; }
.ux-case__role { min-height:148px; }
.ux-case__intro-accent { color:var(--text-link-default); }
.ux-case__copy { display:flex; flex-direction:column; gap:32px; }
.ux-case__band { --band-opacity:.3; box-sizing:border-box; padding:72px var(--ux-media-inset); height:calc(var(--ux-media-height) + 144px); display:flex; justify-content:center; align-items:flex-start; background:linear-gradient(112.367602714deg,rgba(229,231,235,var(--band-opacity)) 55.519%,rgba(184,221,205,var(--band-opacity)) 85.813%); }
.ux-case__window { width:100%; min-width:0; overflow:hidden; }
.ux-case__viewport { position:relative; width:100%; height:var(--ux-media-height); overflow:hidden; }
.ux-case__viewport > img { position:absolute; top:0; left:50%; transform:translateX(-50%); display:block; max-width:none; height:100%; width:auto; flex:none; }
.ux-case__window--research { max-width:933.895447px; }
.ux-case__window--directions { max-width:978.445251px; }
.ux-case__directions-copy { gap:24px; }
.ux-case__subheading { font-size:22px; line-height:29px; font-weight:600; letter-spacing:.03em; font-variation-settings:var(--heading-22-font-variation); }
.ux-case__band--muted { --band-opacity:.25; }
.ux-case__photo { position:relative; width:100%; height:202px; overflow:hidden; }
.ux-case__photo-crop { position:absolute; width:720px; height:202px; left:50%; transform:translateX(-50%); overflow:hidden; }
.ux-case__photo img { display:block; position:absolute; width:104.62%; height:100.07%; max-width:none; left:.01%; top:.07%; }
.ux-case__viewport--process > img { width:2700px; height:645px; }
.ux-case__window--rounded { border-radius:var(--radius-md); }
.ux-case__window--cancellation,.ux-case__window--price { max-width:1477.734375px; }
.ux-case__window--stop { max-width:924px; }
.ux-case__window--mvp { max-width:1280px; }
.ux-case__viewport--cancellation { height:246px; }
.ux-case__viewport--cancellation > img,.ux-case__viewport--price > img,.ux-case__viewport--proactive > img,.ux-case__viewport--mvp > img { left:0; transform:none; }
.ux-case__stop-source { position:absolute; width:366.08px; height:256px; left:50%; transform:translateX(-50%); overflow:hidden; }
.ux-case__stop-source > img { position:absolute; display:block; max-width:none; width:calc(100% * 1184 / 1144); height:calc(100% * 840 / 800); left:calc(-100% * 16.9765625 / 1144); top:calc(-100% * 13.9521484375 / 800); }
.ux-case__viewport--mvp > img { width:498.9711px; height:256px; object-fit:cover; }
.ux-case__strong { font-weight:500; font-variation-settings:var(--body-20-strong-font-variation); }
.ux-case__results { padding-top:72px; display:flex; flex-direction:column; gap:72px; }
.ux-case__results-heading { gap:24px; text-align:center; }
.ux-case__results-images { display:flex; flex-direction:column; align-items:center; padding-inline:16px; }
.ux-case__results-images > img { display:block; height:auto; max-width:100%; flex:none; }
.ux-case__contribution { padding:72px 16px 0; display:flex; flex-direction:column; gap:48px; width:100%; max-width:1920px; margin-inline:auto; box-sizing:border-box; }
.ux-case__contribution > h2 { text-align:center; }
.ux-case__related { display:flex; flex-direction:column; gap:72px; padding-top:72px; }
.ux-case__related-heading { text-align:center; gap:24px; }
.ux-case__related-heading > p { font-size:20px; line-height:32px; font-weight:300; letter-spacing:.01em; font-variation-settings:var(--body-20-regular-font-variation); }
.ux-case__footer { align-self:center; }
.ux-case__end { height:98px; }
@media(min-width:425px){.ux-case__role { min-height:76px; }}
@media(min-width:768px){
 .ux-case { --ux-media-height:650px; }
 .ux-case__heading { font-size:72px; line-height:90px; letter-spacing:.01em; font-variation-settings:var(--heading-72-font-variation); }
 .ux-case__body { font-size:20px; line-height:32px; font-weight:300; letter-spacing:.01em; font-variation-settings:var(--body-20-regular-font-variation); }
 .ux-case__accent { font-size:24px; line-height:38px; letter-spacing:.03em; font-variation-settings:var(--body-24-regular-font-variation); }
 .ux-case__photo { height:396px; }
 .ux-case__photo-crop { width:1408px; height:396px; }
 .ux-case__viewport--process > img { left:0; transform:none; top:2.5px; }
 .ux-case__viewport--cancellation { height:650px; }
 .ux-case__window--proactive { max-width:1156.119873px; }
 .ux-case__viewport--proactive > img { width:100%; height:auto; top:50%; transform:translateY(-50%); }
 .ux-case__stop-source { width:924px; height:650px; left:50%; transform:translateX(-50%); }
 .ux-case__viewport--mvp > img { width:1266.918823px; height:650px; }
 .ux-case__contribution { gap:48px; }
}
@media(min-width:1024px){
 .ux-case { --ux-gap:144px; --ux-media-inset:72px; }
 .ux-case__band { background:linear-gradient(141.202395575deg,rgba(229,231,235,var(--band-opacity)) 55.519%,rgba(184,221,205,var(--band-opacity)) 85.813%); }
 .ux-case__photo { height:auto; aspect-ratio:1920/540; }
 .ux-case__photo-crop { width:100%; height:100%; }
 .ux-case__viewport--cancellation > img,.ux-case__viewport--price > img { left:50%; transform:translateX(-50%); }
 .ux-case__window--proactive { width:min(1156.119873px,calc(100vw - 32px)); max-width:none; flex:none; }
 .ux-case__viewport--mvp > img { width:100%; height:auto; max-height:650px; object-fit:cover; }
 .ux-case__results-images { flex-direction:row; justify-content:center; padding-inline:72px; }
 .ux-case__results-images > img { min-width:0; max-width:none; }
 .ux-case__contribution { gap:64px; }
}
@media(min-width:1440px){
 .ux-case__contribution { padding-inline:72px; gap:72px; }
 .ux-case__stop-source { left:50%; transform:translateX(-50%); }
}
@media(min-width:1280px) and (max-width:1439px){.ux-case__window--research,.ux-case__window--directions { max-width:none; }}
@media(max-width:767px){.ux-case__window--research,.ux-case__window--directions,.ux-case__window--process { border-radius:var(--radius-md); }}
@media(min-width:1920px){.ux-case__contribution > .case-content-layout { min-width:1776px; position:relative; left:50%; transform:translateX(-50%); }}
</style>
