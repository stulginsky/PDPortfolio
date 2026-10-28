<script setup lang="ts">
import { vMediaReady } from './media-readiness'
import manifest from '../../public/cases/chirp-design-system/overview/manifest.json'

import { galleryNativeSize } from './ds-overview.geometry'

withDefaults(defineProps<{ mode?: 'preview' | 'viewer' }>(), { mode: 'preview' })

// Case-specific DSOverview frame, not a new universal gallery component.
// The flat DOM keeps the approved left-to-right reading order at every width.
const assets = [
  ...manifest.assets.filter(asset => asset.canonicalName.startsWith('Asset/Color')),
  ...manifest.assets.filter(asset => asset.canonicalName === 'Asset/Logotype'),
  ...manifest.assets.filter(asset => !asset.canonicalName.startsWith('Asset/Color') && asset.canonicalName !== 'Asset/Logotype'),
]
const layouts = [1, 2, 3].map(count => {
  const ratios = Array(count).fill(0) as number[]
  const lengths = Array(count).fill(0) as number[]
  const positions = assets.map((asset, index) => {
    const column = count === 3 ? asset.sourceColumn : index % count
    const position = { column, ratio: ratios[column]!, gaps: lengths[column]! }
    ratios[column]! += asset.height / asset.width
    lengths[column]!++
    return position
  })
  return { positions, height: 'max(' + ratios.map((ratio, column) =>
    `calc(${ratio} * var(--card-width) + ${Math.max(0, lengths[column]! - 1)} * var(--space-8))`,
  ).join(',') + ')' }
})
const heights = Object.fromEntries(layouts.map((layout, index) => [`--height-${index + 1}`, layout.height]))
const positions = assets.map((_, index) => Object.fromEntries(layouts.flatMap((layout, mode) => {
  const position = layout.positions[index]!
  return [
    [`--left-${mode + 1}`, `calc(${position.column} * (var(--card-width) + var(--space-8)))`],
    [`--top-${mode + 1}`, `calc(${position.ratio} * var(--card-width) + ${position.gaps} * var(--space-8))`],
  ]
})))
</script>

<template>
  <div :data-mode="mode" :style="mode === 'viewer' ? { width: galleryNativeSize.width + 'px' } : undefined" class="ds-overview" data-figma-frame="781:3508">
    <div class="ds-overview__items" :style="heights">
      <figure v-media-ready v-for="(asset, index) in assets" :key="asset.figmaId"
        class="ds-overview__item media-skeleton" :style="positions[index]"
        :data-asset="asset.canonicalName" :data-figma-frame="asset.figmaId">
        <img :src="asset.src" :alt="asset.canonicalName.replace('Asset/', '')"
          :width="asset.width" :height="asset.height" decoding="async" />
      </figure>
    </div>
  </div>
</template>

<style scoped>
.ds-overview { width: 100%; max-width: var(--case-content-max); container-type: inline-size; }
.ds-overview__items {
  --columns: 1;
  --card-width: calc((100cqw - (var(--columns) - 1) * var(--space-8)) / var(--columns));
  position: relative;
  height: var(--height-1);
}
.ds-overview__item {
  position: absolute; margin: 0; width: var(--card-width);
  left: var(--left-1); top: var(--top-1);
}
.ds-overview__item img { display: block; width: 100%; height: auto; }
@media (min-width: 768px) {
  .ds-overview__items { --columns: 2; height: var(--height-2); }
  .ds-overview__item { left: var(--left-2); top: var(--top-2); }
}
@media (min-width: 1280px) {
  .ds-overview__items { --columns: 3; height: var(--height-3); }
  .ds-overview__item { left: var(--left-3); top: var(--top-3); }
}
.ds-overview[data-mode='viewer'] { max-width: none; }
.ds-overview[data-mode='viewer'] .ds-overview__items { --columns: 3; height: var(--height-3); }
.ds-overview[data-mode='viewer'] .ds-overview__item { left: var(--left-3); top: var(--top-3); }
</style>
