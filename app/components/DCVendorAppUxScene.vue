<script setup lang="ts">
import background from '../../public/cases/dc-vendor-app-ux/hero-layers/01-background.png'
import chef from '../../public/cases/dc-vendor-app-ux/hero-layers/02-chef.png'
import countertop from '../../public/cases/dc-vendor-app-ux/hero-layers/03-countertop.png'
import bagReflection from '../../public/cases/dc-vendor-app-ux/hero-layers/04-delivery-bag-reflection.png'
import phoneReflection from '../../public/cases/dc-vendor-app-ux/hero-layers/05-phone-reflection.png'
import shadow from '../../public/cases/dc-vendor-app-ux/hero-layers/04-05-shadow.png'
import bag from '../../public/cases/dc-vendor-app-ux/hero-layers/04-delivery-bag.png'
import phone from '../../public/cases/dc-vendor-app-ux/hero-layers/05-phone.png'
import foreground from '../../public/cases/dc-vendor-app-ux/hero-layers/06-foreground.png'
import type { VendorUxLayer } from './dc-vendor-app-ux.scene-context'

type SceneLayer = VendorUxLayer & { name: string; blur: number; crop: {left:number;top:number;width:number;height:number} | null; position: VendorUxLayer }
const props = defineProps<{ layers: readonly SceneLayer[] }>()
const images: Record<string,string> = {'01-Background':background,'02-Chef':chef,'03-Countertop':countertop,'04-DeliveryBag-reflection':bagReflection,'05-Phone-reflection':phoneReflection,'04-05-shadow':shadow,'04-DeliveryBag':bag,'05-Phone':phone,'06-Foreground':foreground}
function style(layer:SceneLayer) {
  const p=layer.position
  return {left:p.x+'px',top:p.y+'px',width:p.width+'px',height:p.height+'px',transform:`rotate(${-p.rotation}deg)`,filter:layer.blur?`blur(${layer.blur*p.width/layer.width}px)`:'none'}
}
function cropStyle(layer:SceneLayer) {
  const c=layer.crop
  return c?{left:c.left+'%',top:c.top+'%',width:c.width+'%',height:c.height+'%'}:undefined
}
</script>

<template>
  <div class="dc-vendor-app-ux__scene" aria-hidden="true">
    <div v-for="layer in props.layers" :key="layer.name" class="dc-vendor-app-ux__layer" :data-layer="layer.name" :style="style(layer)">
      <div class="dc-vendor-app-ux__crop"><img :src="images[layer.name]" :style="cropStyle(layer)" alt="" draggable="false" /></div>
    </div>
  </div>
</template>

<style scoped>
.dc-vendor-app-ux__scene { position:absolute;inset:0;pointer-events:none; }
.dc-vendor-app-ux__layer { position:absolute;transform-origin:0 0;transition:left var(--card-duration) ease-out,top var(--card-duration) ease-out,width var(--card-duration) ease-out,height var(--card-duration) ease-out,transform var(--card-duration) ease-out,filter var(--card-duration) ease-out; }
.dc-vendor-app-ux__crop { position:absolute;inset:0;overflow:hidden; }
.dc-vendor-app-ux__crop img { position:absolute;inset:auto;left:0;top:0;width:100%;height:100%;max-width:none;object-fit:cover;user-select:none; }
@media(prefers-reduced-motion:reduce) { .dc-vendor-app-ux__layer {transition:none} }
</style>
