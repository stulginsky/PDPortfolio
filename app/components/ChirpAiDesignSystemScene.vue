<script setup lang="ts">
import { computed } from 'vue'
import colorBrand from '../../public/cases/chirp-design-system/card-layers/color-brand.png'
import images from '../../public/cases/chirp-design-system/card-layers/images.png'
import inputText from '../../public/cases/chirp-design-system/card-layers/input-text.png'
import chatBubble from '../../public/cases/chirp-design-system/card-layers/chat-bubble.png'
import logotype from '../../public/cases/chirp-design-system/card-layers/logotype.png'
import datePickerBoundary from '../../public/cases/chirp-design-system/card-layers/date-picker-boundary.png'
import inputGenderSelect from '../../public/cases/chirp-design-system/card-layers/input-gender-select.png'
import button from '../../public/cases/chirp-design-system/card-layers/button.png'
import rowDiagnosisItem from '../../public/cases/chirp-design-system/card-layers/row-diagnosis-item.png'
import rowQueryResultItem from '../../public/cases/chirp-design-system/card-layers/row-query-result-item.png'
import rowListItemShort from '../../public/cases/chirp-design-system/card-layers/row-list-item-short.png'
import rowListItemTall from '../../public/cases/chirp-design-system/card-layers/row-list-item-tall.png'
import codeImage from '../../public/cases/chirp-design-system/card-layers/code/image.png'
import imgEllipseBottom from '../../public/cases/chirp-design-system/card-layers/base/ellipse-bottom.svg'
import imgEllipseTop from '../../public/cases/chirp-design-system/card-layers/base/ellipse-top.svg'
import imgEllipseBottom1 from '../../public/cases/chirp-design-system/card-layers/base/active-pressed/ellipse-bottom.svg'
import imgEllipseBottom2 from '../../public/cases/chirp-design-system/card-layers/min-768/ellipse-bottom.svg'
import imgEllipseTop1 from '../../public/cases/chirp-design-system/card-layers/min-768/ellipse-top.svg'
import imgEllipseBottom3 from '../../public/cases/chirp-design-system/card-layers/min-768/active-pressed/ellipse-bottom.svg'
import type { DesignSystemBreakpoint, DesignSystemLayer, DesignSystemState } from './chirp-ai-design-system.scene-context'
type SceneLayer = DesignSystemLayer & { name: string; opacity: number; radius: number; shadow: string; blur: number; position: DesignSystemLayer; background?: string; image?: DesignSystemLayer & { matrix: readonly (readonly number[])[] } }
const props = defineProps<{ layers: readonly SceneLayer[]; breakpoint: DesignSystemBreakpoint; state: DesignSystemState }>()
// Keep animated DOM nodes in a stable order: moving keyed nodes between
// siblings can cancel CSS transitions. Preserve Figma stacking via z-index.
const layerOrder = props.layers.map(layer => layer.name)
const stableLayers = computed(() => layerOrder.map(name => props.layers.find(layer => layer.name === name)!))
const assets: Record<string, string> = { ColorBrand: colorBrand, Images: images, InputText: inputText, ChatBubble: chatBubble, Logotype: logotype, DatePickerBoundary: datePickerBoundary, InputGenderSelect: inputGenderSelect, Button: button, RowDiagnosisItem: rowDiagnosisItem, RowQueryResultItem: rowQueryResultItem, RowListItemShort: rowListItemShort, RowListItemTall: rowListItemTall }
const ellipses = [{ src: imgEllipseBottom, breakpoint: 'base', name: 'EllipseBottom', pressed: false, width: 911.811, height: 880.321 },
{ src: imgEllipseTop, breakpoint: 'base', name: 'EllipseTop', pressed: false, width: 1054.91, height: 1000.83 },
{ src: imgEllipseBottom1, breakpoint: 'base', name: 'EllipseBottom', pressed: true, width: 911.811, height: 880.321 },
{ src: imgEllipseBottom2, breakpoint: 'min-768', name: 'EllipseBottom', pressed: false, width: 1094.17, height: 1056.39 },
{ src: imgEllipseTop1, breakpoint: 'min-768', name: 'EllipseTop', pressed: false, width: 1265.9, height: 1201 },
{ src: imgEllipseBottom3, breakpoint: 'min-768', name: 'EllipseBottom', pressed: true, width: 1094.17, height: 1056.39 }]
function layerStyle(layer: SceneLayer) {
 const p = layer.position
 return { left: p.x+'px', top:p.y+'px', width:p.width+'px', height:p.height+'px', transform:`rotate(${-p.rotation}deg)`, opacity:layer.name==='EllipseTop' ? (layer.opacity ? 1 : 0) : layer.opacity, borderRadius:layer.radius*(p.width/layer.width)+'px', boxShadow:layer.shadow, background:layer.background }
}
function ellipseStyle(layer: SceneLayer, asset: typeof ellipses[number]) {
 const sx=layer.position.width/layer.width, sy=layer.position.height/layer.height
 return { left:-layer.blur*sx+'px',top:-layer.blur*sy+'px',width:asset.width+'px',height:asset.height+'px',transform:`scale(${sx},${sy})`,opacity:asset.pressed===(props.state==='ActivePressed')||asset.name==='EllipseTop'?1:0 }
}
function codeSlot(layer: SceneLayer) {
 const i=layer.image!
 return { left:100*i.x/layer.width+'%',top:100*i.y/layer.height+'%',width:100*i.width/layer.width+'%',height:100*i.height/layer.height+'%' }
}
function codeImageStyle(layer: SceneLayer) {
 const t=layer.image!.matrix
 return {left:-100*t[0]![2]!/t[0]![0]!+'%',top:-100*t[1]![2]!/t[1]![1]!+'%',width:100/t[0]![0]!+'%',height:100/t[1]![1]!+'%'}
}
</script>
<template>
 <div class="chirp-ds-card__scene" aria-hidden="true">
  <div v-for="layer in stableLayers" :key="layer.name" :data-layer="layer.name" class="chirp-ds-card__layer" :class="{ 'chirp-ds-card__code': layer.name === 'code' }" :style="{ ...layerStyle(layer), zIndex: props.layers.indexOf(layer) }">
   <template v-if="layer.name.startsWith('Ellipse')">
    <img v-for="asset in ellipses.filter(a => a.breakpoint === props.breakpoint && a.name === layer.name)" :key="asset.src" :src="asset.src" class="chirp-ds-card__ellipse" :style="ellipseStyle(layer, asset)" alt="" draggable="false" />
   </template>
   <div v-else-if="layer.name === 'code'" class="chirp-ds-card__code-slot" :style="codeSlot(layer)">
    <img :src="codeImage" class="chirp-ds-card__code-image" :style="codeImageStyle(layer)" alt="" draggable="false" />
   </div>
   <img v-else :src="assets[layer.name]" class="chirp-ds-card__raster" alt="" draggable="false" />
  </div>
 </div>
</template>
<style scoped>
.chirp-ds-card__scene { position:absolute;inset:0;pointer-events:none; }
.chirp-ds-card__layer, .chirp-ds-card__ellipse, .chirp-ds-card__code-image { position:absolute;transform-origin:0 0;transition:left var(--card-duration) ease-out,top var(--card-duration) ease-out,width var(--card-duration) ease-out,height var(--card-duration) ease-out,transform var(--card-duration) ease-out,opacity var(--card-duration) ease-out,box-shadow var(--card-duration) ease-out; }
.chirp-ds-card__raster { position:absolute;inset:0;width:100%;height:100%;object-fit:cover;max-width:none;user-select:none; }
.chirp-ds-card__ellipse, .chirp-ds-card__code-image { max-width:none;user-select:none; }
.chirp-ds-card__code, .chirp-ds-card__code-slot { overflow:hidden; }
.chirp-ds-card__code-slot { position:absolute; }
@media(prefers-reduced-motion:reduce) { .chirp-ds-card__scene * { transition:none; } }
</style>
