<script setup lang="ts">
import './showcase-card-layout.css'
import DsComingSoon from './DsComingSoon.vue'
import DsTooltip from './DsTooltip.vue'
import DsBadge from './DsBadge.vue'
import { ref, useId } from 'vue'
import TypoText from './TypoText.vue'
import content from '../../content/dc-picker-app-ux.json'

const email = 'stulginsky@gmail.com'
const showTooltip = ref(false)
const tooltipId = `picker-subscribe-${useId()}`
function pointerEnter(event: PointerEvent) {
  if (event.pointerType === 'mouse' && matchMedia('(hover: hover)').matches) showTooltip.value = true
}
// Mail body uses normal spaces for an editable email draft.
const plain = (text: string) => text.replace(/\u00a0/g, ' ')
const caseTitle = plain(content.title).replace(/\s+/g, ' ').trim()
const emailBody = plain(content.emailBody).replace('{Название кейса}', caseTitle)
const href = `mailto:${email}?subject=${encodeURIComponent(plain(content.emailSubject))}&body=${encodeURIComponent(emailBody)}`
defineEmits<{ subscribe: [event: MouseEvent] }>()
</script>

<template>
  <article class="dc-picker-app-ux showcase-card" :aria-label="content.title.replace(/\s+/g, ' ')">
    <div class="dc-picker-app-ux__scene">
      <TypoText tag="h2" class="dc-picker-app-ux__accessible-title" :content="content.title" />
      <img class="dc-picker-app-ux__title" src="/showcase/dc-picker-app-ux/picker-app.svg" width="173" height="157" alt="" aria-hidden="true" />
      <DsComingSoon class="dc-picker-app-ux__subscribe" :href="href" :aria-label="content.subscribeLabel"
        :aria-describedby="showTooltip ? tooltipId : undefined"
        @pointerenter="pointerEnter" @pointerleave="showTooltip = false"
        @focus="showTooltip = true" @blur="showTooltip = false"
        @keydown.esc="showTooltip = false" @click="$emit('subscribe', $event)" />
      <DsTooltip :visible="showTooltip" :id="tooltipId" class="dc-picker-app-ux__tooltip" pointer="Right" :label="content.tooltip" />
      <ul class="dc-picker-app-ux__badges" aria-label="Специализации">
        <li v-for="badge in content.badges" :key="badge"><DsBadge :label="badge" type="Card" /></li>
      </ul>
    </div>
  </article>
</template>

<style scoped>
.dc-picker-app-ux { width: 100%; max-width: 430px; container-type: inline-size; }
.dc-picker-app-ux__scene {
  position: relative;
  width: 100%;
  height:100%;
  overflow: hidden;
  background: var(--surface-raised);
  border-radius: var(--radius-xlg);
}
.dc-picker-app-ux__title {
  position: absolute;
  left: calc(50% - 84.03125px * var(--showcase-copy-scale));
  top: 146.35546875px;
  width: calc(173px * var(--showcase-copy-scale));
  height: auto;
  display: block;
}
.dc-picker-app-ux__accessible-title {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  border: 0;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
.dc-picker-app-ux__subscribe {
  position: absolute;
  top: 0;
  right: 0;
  width: 98px;
  height: 98px;
  aspect-ratio: 1;
}
.dc-picker-app-ux__tooltip {
  position: absolute;
  right: calc(98px + var(--space-2));
  top: 49px;
  transform: translateY(-50%);
  z-index: 1;
  max-width: calc(100% - 98px - var(--space-2));
}
.dc-picker-app-ux__tooltip :deep(.ds-tooltip__body) {
  min-width: 0;
  white-space: normal;
  text-align: center;
}
.dc-picker-app-ux__badges { position:absolute; inset:auto var(--space-4) var(--space-4); display:flex; flex-wrap:wrap; gap:var(--space-2); margin:0; padding:0; list-style:none; }
.dc-picker-app-ux__badges li { display:flex; }
@media(min-width:462px) {
 .dc-picker-app-ux__title { left:calc(50% - 84.419921875px * var(--showcase-copy-scale)); top:194.35546875px; }
}
</style>
