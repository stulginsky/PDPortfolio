<script setup lang="ts">
import { siteSrcset, siteUrl } from '../utils/site-url'

import {ref,useId} from 'vue'
import './showcase-card-layout.css'
import DsComingSoon from './DsComingSoon.vue'
import DsTooltip from './DsTooltip.vue'
import DsBadge from './DsBadge.vue'
import TypoText from './TypoText.vue'
import content from '../../content/li-design-system.json'

defineEmits<{subscribe:[event:MouseEvent]}>()
const showTooltip=ref(false)
const tooltipId=`li-subscribe-${useId()}`
const plain=(s:string)=>s.replace(/\u00a0/g,' ')
const title=plain(content.title).replace(/\s+/g,' ').trim()
const body=plain(content.emailBody).replace('{Название кейса}',title)
const href=`mailto:stulginsky@gmail.com?subject=${encodeURIComponent(plain(content.emailSubject))}&body=${encodeURIComponent(body)}`
function pointerEnter(event:PointerEvent){if(event.pointerType==='mouse'&&matchMedia('(hover: hover)').matches)showTooltip.value=true}
</script>

<template>
 <article class="li-design-system showcase-card" :aria-label="title">
  <div class="li-design-system__scene">
   <picture class="li-design-system__background" aria-hidden="true">
    <source media="(min-width:462px)" :srcset="siteSrcset('/showcase/li-design-system/min-768/group-4224.svg')" />
    <img :src="siteUrl('/showcase/li-design-system/base/group-4224.svg')" width="404" height="216" alt="" />
   </picture>
   <TypoText tag="h2" class="li-design-system__accessible-title" :content="content.title" />
   <img class="li-design-system__logo" :src="siteUrl('/showcase/li-design-system/subtract.svg')" width="80" height="33.1585" alt="" aria-hidden="true" />
   <picture class="li-design-system__title" aria-hidden="true">
    <source media="(min-width:462px)" :srcset="siteSrcset('/showcase/li-design-system/min-768/lidport-ui.svg')" />
    <img :src="siteUrl('/showcase/li-design-system/base/lidport-ui.svg')" width="191" height="108" alt="" />
   </picture>
   <DsComingSoon class="li-design-system__subscribe" :href="siteUrl(href)" :aria-label="content.subscribeLabel"
    :aria-describedby="showTooltip?tooltipId:undefined" @pointerenter="pointerEnter" @pointerleave="showTooltip=false"
    @focus="showTooltip=true" @blur="showTooltip=false" @keydown.esc="showTooltip=false" @click="$emit('subscribe',$event)" />
   <DsTooltip :visible="showTooltip" :id="tooltipId" class="li-design-system__tooltip" pointer="Right" :label="content.tooltip" />
   <ul class="li-design-system__badges" aria-label="Специализации">
    <li v-for="badge in content.badges" :key="badge"><span class="li-design-system__badge-base"><DsBadge :label="badge" type="CardCompact" /></span><span class="li-design-system__badge-default"><DsBadge :label="badge" type="Card" /></span></li>
   </ul>
  </div>
 </article>
</template>

<style scoped>
.li-design-system__scene {position:relative;width:100%;height:100%;overflow:hidden;background:var(--surface-raised);border-radius:var(--radius-xlg);}
.li-design-system__background {position:absolute;left:calc(50% - 201.791015625px);top:284.171142578125px;width:403.6260376px;height:215.8288879px;pointer-events:none;}
.li-design-system__background img {display:block;width:100%;height:100%;}
.li-design-system__title {position:absolute;left:calc(50% - 93.95703125px * var(--showcase-copy-scale));top:199.0029296875px;width:calc(191px * var(--showcase-copy-scale));height:auto;pointer-events:none;}
.li-design-system__title img {display:block;width:100%;height:auto;}
.li-design-system__logo {position:absolute;left:50%;top:131.0625px;width:80px;height:33.1584625244px;transform:translateX(-50%);pointer-events:none;}
.li-design-system__accessible-title {position:absolute;width:1px;height:1px;margin:-1px;padding:0;border:0;overflow:hidden;clip-path:inset(50%);white-space:nowrap;}
.li-design-system__subscribe {position:absolute;top:0;right:0;width:98px;height:98px;}
.li-design-system__tooltip {position:absolute;right:calc(98px + var(--space-2));top:49px;transform:translateY(-50%);z-index:1;max-width:calc(100% - 98px - var(--space-2));}
.li-design-system__tooltip :deep(.ds-tooltip__body) {min-width:0;white-space:normal;text-align:center;}
.li-design-system__badges {position:absolute;inset:auto var(--space-4) var(--space-4);display:flex;flex-wrap:wrap;gap:var(--space-2);margin:0;padding:0;list-style:none;}
.li-design-system__badges li,.li-design-system__badge-base {display:flex;}
.li-design-system__badge-default {display:none;}
@media(min-width:462px){
 .li-design-system__logo {top:110.0625px;}
 .li-design-system__background {left:calc(50% - 241.56640625px);top:209.9705200195px;width:487.1116943px;height:322.0077515px;}
 .li-design-system__title {left:calc(50% - 121.869140625px * var(--showcase-copy-scale));top:174.0390625px;width:calc(247px * var(--showcase-copy-scale));}
 .li-design-system__badge-base {display:none;}
 .li-design-system__badge-default {display:flex;}
}
</style>
