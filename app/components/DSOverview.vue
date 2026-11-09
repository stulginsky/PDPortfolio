<script setup lang="ts">
import { siteUrl } from '../utils/site-url'

import { vMediaReady } from './media-readiness'
import manifest from '../../public/cases/chirp-design-system/overview/manifest.json'
import content from '../../content/cases/chirp-design-system.json'
import TypoText from './TypoText.vue'

import { galleryNativeSize } from './ds-overview.geometry'

withDefaults(defineProps<{ mode?: 'preview' | 'viewer' }>(), { mode: 'preview' })
const overview = content.overview

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
  <article v-if="mode === 'preview'" class="ds-overview-cover" data-figma-frame="1788:6113" :aria-label="overview.title">
    <TypoText tag="p" class="ds-overview-cover__caption" :content="overview.eyebrow" />
    <div class="ds-overview-cover__rule" aria-hidden="true" />
    <header class="ds-overview-cover__intro" data-figma-frame="1785:5413">
      <TypoText tag="h2" :content="overview.title" />
      <TypoText tag="p" class="ds-overview-cover__lead" :content="overview.description" />
    </header>
    <section class="ds-overview-cover__character" data-figma-frame="1785:5416">
      <div v-media-ready class="ds-overview-cover__logo media-skeleton">
        <img :src="siteUrl('/cases/chirp-design-system/overview/asset/logo/lockup-primary-version2.svg')"
          alt="" width="225.333" height="72.136" decoding="async" />
      </div>
      <div class="ds-overview-cover__copy">
        <TypoText tag="h3" :content="overview.characterTitle" />
        <TypoText tag="p" class="ds-overview-cover__lead" :content="overview.characterBody" />
      </div>
    </section>
    <section class="ds-overview-cover__copy" data-figma-frame="1785:5421">
      <TypoText tag="h3" :content="overview.startTitle" />
      <TypoText tag="p" class="ds-overview-cover__muted" :content="overview.startBody" />
      <div class="ds-overview-cover__cards">
        <section v-for="(section, index) in overview.sections" :key="section.href"
          class="ds-overview-cover__card" :data-section="index">
          <div class="ds-overview-cover__copy">
            <TypoText tag="h4" :content="section.title" />
            <TypoText tag="p" :content="section.body" />
          </div>
          <a :href="section.href" target="_blank" rel="noopener noreferrer" :aria-label="section.title + ' — ' + overview.openLabel">
            <TypoText :content="overview.openLabel" />
          </a>
        </section>
      </div>
    </section>
    <section class="ds-overview-cover__copy" data-figma-frame="1785:5437">
      <TypoText tag="h3" :content="overview.usageTitle" />
      <TypoText tag="p" :content="overview.usageBody" />
    </section>
    <a class="ds-overview-cover__caption ds-overview-cover__muted" :href="overview.guideHref" target="_blank" rel="noopener noreferrer">
      <TypoText :content="overview.guideLabel" />
    </a>
  </article>
  <!-- Retained only for the existing generic viewer's composite regression fixture. -->
  <div v-else :data-mode="mode" :style="{ width: galleryNativeSize.width + 'px' }" class="ds-overview" data-figma-frame="781:3508">
    <div class="ds-overview__items" :style="heights">
      <figure v-media-ready v-for="(asset, index) in assets" :key="asset.figmaId"
        class="ds-overview__item media-skeleton" :style="positions[index]"
        :data-asset="asset.canonicalName" :data-figma-frame="asset.figmaId">
        <img :src="siteUrl(asset.src)" :alt="asset.canonicalName.replace('Asset/', '')"
          :width="asset.width" :height="asset.height" decoding="async" />
      </figure>
    </div>
  </div>
</template>

<style scoped>
/* Chirp's own semantic values, scoped to the embedded library cover. */
.ds-overview-cover {
  --color-text-default: rgb(66 66 66 / .9);
  --color-text-secondary: rgb(66 66 66 / .7);
  --color-action-primary-default: #27afcd;
  --color-action-primary-subtle: rgb(39 175 205 / .12);
  --color-bg-subtle: rgb(66 66 66 / .05);
  display: flex;
  flex-direction: column;
  gap: 40px;
  width: 100%;
  min-width: 0;
  padding-block: var(--space-12);
  font-family: 'PT Sans', sans-serif;
  font-size: var(--text-size-16);
  font-weight: 400;
  font-variation-settings: normal;
  line-height: 24px;
  letter-spacing: 0;
  color: var(--color-text-default);
}
.ds-overview-cover, .ds-overview-cover * { box-sizing: border-box; }
.ds-overview-cover :is(p, h2, h3, h4) { margin: 0; min-width: 0; width: 100%; font-variation-settings: normal; letter-spacing: 0; }
.ds-overview-cover h2 { font-size: 30px; line-height: 36px; font-weight: 700; }
.ds-overview-cover :is(h3, h4) { font-size: var(--text-size-24); line-height: 32px; font-weight: 700; }
.ds-overview-cover__caption { font-size: var(--text-size-14); line-height: 20px; color: var(--color-text-secondary); white-space: pre-wrap; }
.ds-overview-cover__rule { width: 100%; height: 1px; background: var(--color-action-primary-default); }
.ds-overview-cover__intro, .ds-overview-cover__copy { display: flex; flex-direction: column; gap: var(--space-4); min-width: 0; }
.ds-overview-cover__lead { font-size: var(--text-size-18); line-height: 24px; white-space: pre-line; }
.ds-overview-cover__character { display: flex; flex-direction: column; gap: var(--space-12); align-items: flex-start; padding: var(--space-8); border-radius: var(--radius-lg); background: var(--color-action-primary-subtle); }
.ds-overview-cover__logo { width: 100%; aspect-ratio: 287.3834533691406 / 92; flex: none; }
.ds-overview-cover__logo img { display: block; width: 100%; height: auto; }
.ds-overview-cover__muted { color: var(--color-text-secondary); }
.ds-overview-cover__cards { display: grid; grid-template-columns: minmax(0, 1fr); gap: var(--space-6); }
.ds-overview-cover__card { display: flex; flex-direction: column; justify-content: space-between; height: 180px; min-width: 0; padding: var(--space-6); border-radius: var(--radius-lg); background: var(--color-bg-subtle); }
.ds-overview-cover__card:last-child { height: auto; }
.ds-overview-cover a { text-decoration: none; }
.ds-overview-cover__card a { font-size: var(--text-size-14); line-height: 20px; color: var(--color-action-primary-default); }
.ds-overview-cover a:focus-visible { outline: 2px solid var(--color-action-primary-default); outline-offset: 4px; }
@media (min-width: 768px) {
  .ds-overview-cover__rule { height: 4px; }
  .ds-overview-cover__intro { flex-direction: row; gap: var(--space-12); }
  .ds-overview-cover__intro h2 { flex: 0 0 calc(384 / 924 * 100%); width: auto; }
  .ds-overview-cover__intro > p { flex: 1; }
  .ds-overview-cover__character { flex-direction: row; align-items: center; }
  .ds-overview-cover__logo { width: 225.333px; }
  .ds-overview-cover__cards { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .ds-overview-cover__card { height: auto; min-height: 180px; gap: var(--space-4); }
  .ds-overview-cover__card:last-child { min-height: 180px; }
}
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
