<script setup lang="ts">
import { siteSrcset, siteUrl } from '../utils/site-url'

import {ref,useId} from 'vue'
import './showcase-card-layout.css'
import DsComingSoon from './DsComingSoon.vue'
import DsTooltip from './DsTooltip.vue'
import DsBadge from './DsBadge.vue'
import TypoText from './TypoText.vue'
import content from '../../content/black-gold.json'

defineEmits<{subscribe:[event:MouseEvent]}>()
const showTooltip=ref(false)
const tooltipId=`black-gold-subscribe-${useId()}`
const plain=(s:string)=>s.replace(/\u00a0/g,' ')
const title=plain(content.title).replace(/\s+/g,' ').trim()
const body=plain(content.emailBody).replace('{Название кейса}',title)
const href=`mailto:stulginsky@gmail.com?subject=${encodeURIComponent(plain(content.emailSubject))}&body=${encodeURIComponent(body)}`
function pointerEnter(event:PointerEvent){if(event.pointerType==='mouse'&&matchMedia('(hover: hover)').matches)showTooltip.value=true}
</script>

<template>
 <article class="black-gold showcase-card" :aria-label="title">
  <div class="black-gold__scene">
   <TypoText tag="h2" class="black-gold__accessible-title" :content="content.title" />
   <picture class="black-gold__title" aria-hidden="true">
    <source media="(min-width:462px)" :srcset="siteSrcset('/showcase/black-gold/min-768/pict.svg')" />
    <img :src="siteUrl('/showcase/black-gold/base/pict.svg')" width="288" height="500" alt="" />
   </picture>
   <DsComingSoon class="black-gold__subscribe" :href="siteUrl(href)" :aria-label="content.subscribeLabel"
    :aria-describedby="showTooltip?tooltipId:undefined" @pointerenter="pointerEnter" @pointerleave="showTooltip=false"
    @focus="showTooltip=true" @blur="showTooltip=false" @keydown.esc="showTooltip=false" @click="$emit('subscribe',$event)" />
   <DsTooltip :visible="showTooltip" :id="tooltipId" class="black-gold__tooltip" pointer="Right" :label="content.tooltip" />
   <ul class="black-gold__badges" aria-label="Специализации">
    <li v-for="badge in content.badges" :key="badge"><span class="black-gold__badge-base"><DsBadge :label="badge" type="CardCompact" /></span><span class="black-gold__badge-default"><DsBadge :label="badge" type="Card" /></span></li>
   </ul>
  </div>
 </article>
</template>

<style scoped>
.black-gold__scene {position:relative;width:100%;height:100%;overflow:hidden;background:var(--surface-raised);border-radius:var(--radius-xlg);}
.black-gold__title {position:absolute;left:50%;top:0;width:288px;height:500px;transform:translateX(-50%);pointer-events:none;}
.black-gold__title img {display:block;width:100%;height:100%;}
.black-gold__accessible-title {position:absolute;width:1px;height:1px;margin:-1px;padding:0;border:0;overflow:hidden;clip-path:inset(50%);white-space:nowrap;}
.black-gold__subscribe {position:absolute;top:0;right:0;width:98px;height:98px;}
.black-gold__tooltip {position:absolute;right:calc(98px + var(--space-2));top:49px;transform:translateY(-50%);z-index:1;max-width:calc(100% - 98px - var(--space-2));}
.black-gold__tooltip :deep(.ds-tooltip__body) {min-width:0;white-space:normal;text-align:center;}
.black-gold__badges {position:absolute;inset:auto var(--space-4) var(--space-4);display:flex;flex-wrap:wrap;gap:var(--space-2);margin:0;padding:0;list-style:none;}
.black-gold__badges li,.black-gold__badge-base {display:flex;}
.black-gold__badge-default {display:none;}
@media(min-width:462px){
 .black-gold__title {width:430px;height:532px;}
 .black-gold__badge-base {display:none;}
 .black-gold__badge-default {display:flex;}
}
</style>
