<script setup lang="ts">
import { vendorPrAssets, vendorPrRawImageSizes } from './dc-vendor-app-pr.assets'
import { vendorPrGeometry } from './dc-vendor-app-pr.geometry'
import { type VendorPrLayer, type VendorPrState } from './dc-vendor-app-pr.scene-context'
import parts from './dc-vendor-app-pr.parts.json'

type ExportRect={x:number;y:number;width:number;height:number}
type Layer=VendorPrLayer & {name:string;opacity:number;file:string;exportRect:ExportRect|null;crop:{left:number;top:number;width:number;height:number}|null}
type PositionedLayer=Layer & {position:VendorPrLayer}
type Part=typeof parts.reference[number]
const props=defineProps<{layers:readonly PositionedLayer[];breakpoint:'base'|'min-768';state:VendorPrState}>()
function reference(layer:Layer){
 const source=vendorPrGeometry[props.breakpoint].Default.layers.find(l=>l.name===layer.name)!
 return layer.file==='1024-1920/04-water.svg'||layer.file==='04-water.svg'
  ? {...source,file:layer.file,width:430,height:186,exportRect:{x:0,y:0,width:430,height:186}}
  : source
}
function frameStyle(layer:PositionedLayer){
 const p=layer.position,r=reference(layer)
 // One interpolated transform also scales the actual SVG, crops and export overflow.
 return {width:r.width+'px',height:r.height+'px',opacity:layer.opacity,transform:`translate(${p.x}px,${p.y}px) rotate(${-p.rotation}deg) scale(${p.width/r.width},${p.height/r.height})`}
}
function assetStyle(source:Layer,layer:PositionedLayer){
 const r=source.exportRect!
 const base=reference(layer),sx=base.width/source.width,sy=base.height/source.height
 return {left:r.x*sx+'px',top:r.y*sy+'px',width:r.width*sx+'px',height:r.height*sy+'px',
  ...(layer.file==='04-water.svg'?{transform:`scaleY(${1+30/layer.position.height})`,transformOrigin:'50% 100%'}:{})}
}
function partStyle(layer:PositionedLayer,part:Part,index:number){
 const target=parts.scenes[props.breakpoint][props.state][index]!
 const source=vendorPrGeometry[props.breakpoint][props.state].layers.find(l=>l.name===layer.name)!
 const base=reference(layer),sx=base.width/source.width,sy=base.height/source.height
 // Keep one original painted part alive. Its own geometry follows Figma;
 // the parent still owns the user's ten-layer editor transform.
 return {width:part.width+'px',height:part.height+'px',transform:`translate(${target.x*sx}px,${target.y*sy}px) scale(${target.width*sx/part.width},${target.height*sy/part.height})`}
}
function partAssetStyle(part:Part){
 const r=part.exportRect
 return r?{left:r.x+'px',top:r.y+'px',width:r.width+'px',height:r.height+'px'}:{left:'0',top:'0',width:'100%',height:'100%',objectFit:'cover' as const}
}
function cropStyle(layer:PositionedLayer){
 const size=vendorPrRawImageSizes[layer.file]!
 const aspect=layer.position.width/layer.position.height
 const w=Math.max(1,size.width/size.height/aspect),h=Math.max(1,aspect/(size.width/size.height))
 const c=layer.crop ?? {left:(1-w)*50,top:(1-h)*50,width:w*100,height:h*100}
 return {left:c.left+'%',top:c.top+'%',width:c.width+'%',height:c.height+'%'}
}
</script>

<template>
 <div class="dc-vendor-app-pr__scene" aria-hidden="true">
  <div v-for="layer in props.layers" :key="layer.name" class="dc-vendor-app-pr__layer" :data-layer="layer.name" :style="frameStyle(layer)">
   <template v-if="layer.name==='05-landform_city-1st'">
    <div v-for="(part,index) in parts.reference" :key="part.name" class="dc-vendor-app-pr__part" :data-part="part.name" :style="partStyle(layer,part,index)">
     <img :src="vendorPrAssets[part.file]" :style="partAssetStyle(part)" alt="" draggable="false" />
    </div>
   </template>
   <template v-else-if="layer.exportRect">
    <img class="dc-vendor-app-pr__export" :src="vendorPrAssets[reference(layer).file]" :width="reference(layer).exportRect!.width" :height="reference(layer).exportRect!.height" :style="assetStyle(reference(layer),layer)" alt="" draggable="false" />
   </template>
   <div v-else class="dc-vendor-app-pr__crop"><img :src="vendorPrAssets[layer.file]" :style="cropStyle(layer)" alt="" draggable="false" /></div>
  </div>
 </div>
</template>

<style scoped>
.dc-vendor-app-pr__scene {position:absolute;inset:0;pointer-events:none}
.dc-vendor-app-pr__layer {position:absolute;left:0;top:0;transform-origin:0 0;transition:transform var(--card-duration) ease-out,opacity var(--card-duration) ease-out}
.dc-vendor-app-pr__crop {position:absolute;inset:0;overflow:hidden}
.dc-vendor-app-pr__crop img {position:absolute;left:0;top:0;width:100%;height:100%;max-width:none;user-select:none;transition:left var(--card-duration) ease-out,top var(--card-duration) ease-out,width var(--card-duration) ease-out,height var(--card-duration) ease-out}
.dc-vendor-app-pr__part {position:absolute;left:0;top:0;transform-origin:0 0;transition:transform var(--card-duration) ease-out}
.dc-vendor-app-pr__part img,.dc-vendor-app-pr__export {position:absolute;max-width:none;user-select:none}
@media(prefers-reduced-motion:reduce){.dc-vendor-app-pr__scene * {transition:none}}
</style>
