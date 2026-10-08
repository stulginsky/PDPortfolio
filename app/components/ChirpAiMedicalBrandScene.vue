<script setup lang="ts">
import songbirdMain from '../../public/cases/nested-chirp-brand/layers/songbird-main.png'
import songbirdMainMultiply from '../../public/cases/nested-chirp-brand/layers/multiply/songbird-main.png'
import songbirdDecorLeft from '../../public/cases/nested-chirp-brand/layers/songbird-decor-left.png'
import songbirdDecorRight from '../../public/cases/nested-chirp-brand/layers/songbird-decor-right.png'
import baseDefaultLogo from '../../public/cases/nested-chirp-brand/layers/base/default/logotype.svg'
import baseHoverLogo from '../../public/cases/nested-chirp-brand/layers/base/hover/logotype.svg'
import basePressedLogo from '../../public/cases/nested-chirp-brand/layers/base/active-pressed/logotype.svg'
import webDefaultLogo from '../../public/cases/nested-chirp-brand/layers/min-768/default/logotype.svg'
import webHoverLogo from '../../public/cases/nested-chirp-brand/layers/min-768/hover/logotype.svg'
import webPressedLogo from '../../public/cases/nested-chirp-brand/layers/min-768/active-pressed/logotype.svg'
import type { BrandBreakpoint, BrandLayer, BrandState } from './chirp-ai-medical-brand.scene-context'

type Shape = BrandLayer & { opacity: number; radius: number; background: string; blur: number; shadow: string }
type SceneLayer = BrandLayer & { name: string; opacity: number; flipY: boolean; position: BrandLayer; children?: readonly Shape[] }
const props = defineProps<{ layers: readonly SceneLayer[]; breakpoint: BrandBreakpoint; state: BrandState }>()
const logos = [
  { breakpoint: 'base', state: 'Default', src: baseDefaultLogo, width: 44.098, height: 14.1173 },
  { breakpoint: 'base', state: 'Hover', src: baseHoverLogo, width: 166.097, height: 53.1732 },
  { breakpoint: 'base', state: 'ActivePressed', src: basePressedLogo, width: 138.875, height: 44.4584 },
  { breakpoint: 'min-768', state: 'Default', src: webDefaultLogo, width: 52.9176, height: 16.9407 },
  { breakpoint: 'min-768', state: 'Hover', src: webHoverLogo, width: 199.316, height: 63.8079 },
  { breakpoint: 'min-768', state: 'ActivePressed', src: webPressedLogo, width: 166.65, height: 53.3501 },
]
function layerStyle(layer: SceneLayer) {
  const p = layer.position
  return { left: p.x + 'px', top: p.y + 'px', width: p.width + 'px', height: p.height + 'px', transform: `rotate(${-p.rotation}deg) scaleY(${layer.flipY ? -1 : 1})`, opacity: layer.name === 'Logotype' ? 1 : layer.opacity }
}
function shapeStyle(shape: Shape, layer: SceneLayer) {
  const scale = layer.position.width / layer.width
  return { left: 100 * shape.x / layer.width + '%', top: 100 * shape.y / layer.height + '%', width: 100 * shape.width / layer.width + '%', height: 100 * shape.height / layer.height + '%', borderRadius: shape.radius * scale + 'px', background: shape.background, opacity: shape.opacity, filter: `blur(${shape.blur * scale}px)`, boxShadow: shape.shadow }
}
</script>

<template>
  <div class="chirp-brand__scene" aria-hidden="true">
    <div v-for="layer in props.layers" :key="layer.name" class="chirp-brand__layer" :data-layer="layer.name" :style="layerStyle(layer)">
      <template v-if="layer.children">
        <div v-for="(shape, index) in layer.children" :key="index" class="chirp-brand__shape" :style="shapeStyle(shape, layer)" />
      </template>
      <template v-else-if="layer.name === 'SongbirdMain'">
        <img class="chirp-brand__raster" :src="songbirdMain" alt="" draggable="false" />
        <img class="chirp-brand__raster chirp-brand__multiply" :src="songbirdMainMultiply" alt="" draggable="false" />
      </template>
      <template v-else-if="layer.name === 'Logotype'">
        <img v-for="logo in logos" :key="logo.src" class="chirp-brand__logo" :src="logo.src" alt="" draggable="false"
          :style="{ width: logo.width + 'px', height: logo.height + 'px', transform: `scale(${layer.position.width / logo.width}, ${layer.position.height / logo.height})`, opacity: logo.breakpoint === props.breakpoint && logo.state === props.state ? 1 : 0 }" />
      </template>
      <img v-else class="chirp-brand__raster" :class="{ 'chirp-brand__leaf-left': layer.name === 'SongbirdDecorLeft' }" :src="layer.name === 'SongbirdDecorLeft' ? songbirdDecorLeft : songbirdDecorRight" alt="" draggable="false" />
    </div>
  </div>
</template>

<style scoped>
.chirp-brand__scene { position: absolute; inset: 0; pointer-events: none; }
.chirp-brand__layer, .chirp-brand__shape, .chirp-brand__logo { position: absolute; transform-origin: 0 0; transition: left var(--card-duration) ease-out, top var(--card-duration) ease-out, width var(--card-duration) ease-out, height var(--card-duration) ease-out, transform var(--card-duration) ease-out, opacity var(--card-duration) ease-out, border-radius var(--card-duration) ease-out, filter var(--card-duration) ease-out, box-shadow var(--card-duration) ease-out; }
.chirp-brand__raster { position: absolute; inset: 0; width: 100%; height: 100%; max-width: none; user-select: none; }
.chirp-brand__leaf-left { object-fit: cover; transform: scaleX(-1); }
.chirp-brand__multiply { mix-blend-mode: multiply; opacity: .7; }
.chirp-brand__logo { left: 0; top: 0; max-width: none; user-select: none; }
@media (prefers-reduced-motion: reduce) { .chirp-brand__scene * { transition: none; } }
</style>
