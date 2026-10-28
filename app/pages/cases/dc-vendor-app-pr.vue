<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import DCVendorAppPrHero from '../../components/DCVendorAppPrHero.vue'
import DsBtnNav from '../../components/DsBtnNav.vue'
import DsRoleFocus from '../../components/DsRoleFocus.vue'
import DsFooter from '../../components/DsFooter.vue'
import DsPageUp from '../../components/DsPageUp.vue'
import TypoText from '../../components/TypoText.vue'
import CaseContentCard from '../../components/CaseContentCard.vue'
import RelatedCases from '../../components/RelatedCases.vue'
import content from '../../../content/cases/dc-vendor-app-pr.json'
import { vMediaReady } from '../../components/media-readiness'

const page = content.page
const text = (id: string) => (page.nodes as Record<string, string>)[id]!
const media = (id: string) => page.media.find(item => item.node === id)!
const researchRows = [
  ['190:1610', '190:1611', '190:1612'], ['190:1613', '190:1614', '190:1615'],
  ['190:1616', '190:1617', '190:1618'], ['190:1619', '190:1620', '190:1621'],
]
const discovery = [
  { frame: '191:1728', image: '249:4691', label: '191:1752', title: '191:1753', body: '191:1754' },
  { frame: '191:1733', image: '249:4690', label: '191:1757', title: '191:1758', body: '191:1759' },
  { frame: '191:1738', image: '249:4688', label: '193:701', title: '193:702', body: '193:703' },
  { frame: '191:1743', image: '249:4689', label: '193:706', title: '193:707', body: '193:708' },
]
const contributions = [
  { frame: '190:1514', image: '249:4674', title: '190:1517', body: '190:1518' },
  { frame: '190:1519', image: '261:23399', title: '190:1522', body: '190:1523' },
  { frame: '190:1524', image: '249:4673', title: '190:1527', body: '190:1528' },
]
useSeoMeta({ title: content.pageTitle, description: text('190:1468') })
const start = ref<HTMLElement>()
const showPageUp = ref(false)
let observer: IntersectionObserver | undefined
onMounted(() => {
  if (!start.value) return
  observer = new IntersectionObserver(([entry]) => { if (entry) showPageUp.value = entry.boundingClientRect.bottom <= 0 })
  observer.observe(start.value)
})
onUnmounted(() => observer?.disconnect())
function scrollToStart() {
  start.value?.focus({ preventScroll: true })
  window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
}
</script>

<template>
  <main class="dc-product">
    <div ref="start" class="dc-product__hero" tabindex="-1" data-figma-frame="213:7487">
      <DCVendorAppPrHero />
      <div class="dc-product__back"><DsBtnNav tag="a" href="/" :aria-label="page.backLabel" /></div>
    </div>
    <div class="dc-product__flow">
      <section class="dc-product__about-title dc-product__two dc-product__inset" data-figma-frame="220:1791">
        <TypoText tag="h2" class="dc-product__heading" :content="text('190:1466')" />
      </section>
      <section class="dc-product__intro dc-product__two dc-product__inset" data-figma-frame="220:1793">
        <DsRoleFocus class="dc-product__role" :role="text('I190:1626;1107:7330')" :focus="text('I190:1626;1107:7333')" />
        <div class="dc-product__intro-copy">
          <TypoText tag="p" class="dc-product__body" :content="text('190:1468')" />
          <TypoText tag="p" class="dc-product__accent" :content="text('190:1469')" />
          <TypoText tag="p" class="dc-product__body" :content="text('190:1470')" />
        </div>
      </section>
      <section class="dc-product__influence dc-product__two dc-product__inset" data-figma-frame="220:1792">
        <div v-media-ready class="media-skeleton dc-product__influence-image"><img v-bind="{ src: media('249:4705').src, width: 852, height: 785 }" alt="" class="dc-product__image" /></div>
        <div class="dc-product__influence-group">
          <TypoText tag="h2" class="dc-product__heading" :content="text('190:1486')" />
          <div class="dc-product__influence-copy">
            <TypoText tag="div" class="dc-product__body" :content="text('190:1484')" />
            <TypoText tag="p" class="dc-product__accent" :content="text('190:1485')" />
          </div>
        </div>
      </section>
      <section class="dc-product__research-outer" data-figma-frame="249:5449">
        <div class="dc-product__research dc-product__inset" data-figma-frame="190:1568">
        <img :src="media('249:4706').src" width="1404" height="824" alt="" class="dc-product__map" />
        <div class="dc-product__research-content">
          <div class="dc-product__stats">
            <div class="dc-product__stat"><TypoText tag="p" class="dc-product__number" :content="text('190:1574')" /><TypoText tag="p" :content="text('190:1575')" /></div>
            <div class="dc-product__stat-divider" aria-hidden="true" />
            <div class="dc-product__stat"><TypoText tag="p" class="dc-product__number" :content="text('190:1570')" /><TypoText tag="p" :content="text('190:1571')" /></div>
            <div class="dc-product__stat-divider" aria-hidden="true" />
            <TypoText tag="p" class="dc-product__methods" :content="text('190:1576')" />
          </div>
          <TypoText tag="div" class="dc-product__body dc-product__research-copy" :content="text('190:1623')" />
          <div class="dc-product__table-scroll">
            <table class="dc-product__table">
              <thead><tr><th v-for="id in ['190:1607', '190:1608', '190:1609']" :key="id" scope="col"><TypoText :content="text(id)" /></th></tr></thead>
              <tbody><tr v-for="row in researchRows" :key="row[0]"><td v-for="id in row" :key="id"><TypoText :content="text(id)" /></td></tr></tbody>
            </table>
          </div>
        </div>
        </div>
      </section>
      <section class="dc-product__growth dc-product__two dc-product__inset" data-figma-frame="191:1635">
        <div v-media-ready class="media-skeleton dc-product__ecosystem"><img :src="media('249:4700').src" width="810" height="785" alt="" class="dc-product__image" /></div>
        <div class="dc-product__growth-group">
          <TypoText tag="h2" class="dc-product__heading" :content="text('190:1463')" />
          <div class="dc-product__growth-copy">
            <TypoText tag="div" class="dc-product__body" :content="text('190:1474')" />
            <TypoText tag="p" class="dc-product__accent" :content="text('190:1475')" />
          </div>
        </div>
      </section>
      <section class="dc-product__discovery dc-product__inset" data-figma-frame="191:1724">
        <TypoText tag="h2" class="dc-product__heading dc-product__center" :content="text('191:1726')" />
        <div class="case-content-layout"><div class="case-content-grid case-content-grid--two">
          <CaseContentCard v-for="item in discovery" :key="item.frame" :data-figma-frame="item.frame"
            :title="text(item.title)" :body="text(item.body)" :eyebrow="text(item.label)" :src="media(item.image).src"
            :width="754" :height="450" />
        </div></div>
      </section>
      <section class="dc-product__contribution dc-product__inset" data-figma-frame="190:1510">
        <TypoText tag="h2" class="dc-product__heading dc-product__center" :content="text('190:1512')" />
        <div class="case-content-layout"><div class="case-content-grid">
          <CaseContentCard v-for="item in contributions" :key="item.frame" :data-figma-frame="item.frame"
            :title="text(item.title)" :body="text(item.body)" :src="media(item.image).src" :width="754" :height="450" />
        </div></div>
      </section>
      <section class="dc-product__related" data-figma-frame="190:1494">
        <div class="dc-product__related-heading">
          <TypoText tag="h2" class="dc-product__heading" :content="text('190:1497')" />
          <TypoText tag="p" class="dc-product__body" :content="text('190:1498')" />
        </div>
        <RelatedCases :card-names="['DCVendorAppUx', 'DCPickerAppUx']" current-case-href="/cases/dc-vendor-app-pr" />
        <DsFooter class="dc-product__footer" />
        <div class="dc-product__end" aria-hidden="true" />
      </section>
    </div>
    <DsPageUp v-if="showPageUp" @click="scrollToStart" />
  </main>
</template>

<style scoped>
.dc-product { --case-gap: 64px; --case-inset: 16px; width: 100%; overflow-x: clip; background: var(--surface-default); color: var(--text-default); }
.dc-product p, .dc-product h2, .dc-product h3 { margin: 0; }
.dc-product__hero { position: relative; outline: none; }
.dc-product__heading, .dc-product__body, .dc-product__accent, .dc-product__stats, .dc-product__table { font-optical-sizing: auto; }
.dc-product__back { position: absolute; top: 0; left: 0; height: 100px; padding: var(--space-6); display: flex; align-items: center; box-sizing: border-box; z-index: 2; }
.dc-product__flow { display: flex; flex-direction: column; gap: var(--case-gap); padding-top: var(--case-gap); width:100%; max-width:2000px; margin-inline:auto; box-sizing:border-box; }
.dc-product__inset { padding-inline: var(--case-inset); }
.dc-product__two { display: grid; grid-template-columns: minmax(0, 1fr); gap: var(--case-gap); }
.dc-product__two > * { min-width: 0; }
.dc-product__heading { overflow-wrap: anywhere; font-size: 48px; font-weight: 600; line-height: 58px; letter-spacing: -.005em; color: var(--accent-aubergine); font-variation-settings: var(--heading-48-font-variation); }
.dc-product__body { font-size: 16px; font-weight: 400; line-height: 26px; letter-spacing: 0; font-variation-settings: var(--body-16-regular-font-variation); white-space: pre-wrap; }
.dc-product__accent { font-size: 20px; font-weight: 300; line-height: 1.6; letter-spacing: .01em; color: var(--text-accent-dc); font-variation-settings: var(--font-variation-body-accent); white-space: pre-wrap; }
.dc-product__intro-copy { padding-top: 32px; display: flex; flex-direction: column; gap: 32px; max-width: 846px; }
.dc-product__role { width: 100%; min-height: 174px; }
.dc-product__influence-image { aspect-ratio: 1000 / 921; }
.dc-product__influence-image .dc-product__image { height: 100%; object-fit: cover; }
.dc-product__ecosystem { aspect-ratio: 370 / 358; }
.dc-product__ecosystem .dc-product__image { height: 100%; object-fit: cover; }
.dc-product__image { display: block; width: 100%; height: auto; }
.dc-product__influence { padding-top: 0; gap: 48px; }
.dc-product__intro { gap: 48px; }
.dc-product__influence-copy { display: flex; flex-direction: column; gap: 32px; }
.dc-product__influence-group { display: flex; flex-direction: column; gap: 48px; align-self: center; }
.dc-product__research-outer { padding-top: 24px; }
.dc-product__research { position: relative; overflow: hidden; padding-block: 48px; background: #eefdfa; }
.dc-product__map { position: absolute; display: block; left: calc(50% - 173px); top: 251px; width: 336px; height: 197px; max-width: none; }
.dc-product__research-content { position: relative; display: flex; flex-direction: column; gap: 48px; }
.dc-product__stats { display: flex; flex-direction: column; align-items: center; gap: 24px; color: #015346; font-size: 32px; font-weight: 500; line-height: 51px; letter-spacing: .01em; font-variation-settings: var(--body-20-strong-font-variation); }
.dc-product__stat { text-align: center; }
.dc-product__number { font-size: 118px; font-weight: 700; line-height: 118px; font-variation-settings: var(--body-20-strong-font-variation), "wght" 700; }
.dc-product__methods { white-space: pre-wrap; text-align: center; }
.dc-product__stat-divider { width: 100%; height: 0; box-shadow: 0 0 0 .5px #015346; }
.dc-product__table { display: grid; grid-template-columns: 140px minmax(140px, 1fr); column-gap: 8px; row-gap: 24px; width: 100%; border-collapse: collapse; font-size: 20px; line-height: 32px; letter-spacing: .01em; font-weight: 500; font-variation-settings: var(--body-20-strong-font-variation); }
.dc-product__table thead, .dc-product__table tbody, .dc-product__table tr { display: contents; }
.dc-product__table th, .dc-product__table td { padding: 0; text-align: left; vertical-align: top; font-weight: inherit; }
.dc-product__table th { color: var(--text-muted); }
.dc-product__table tr > :first-child { white-space: nowrap; }
.dc-product__table tr > :nth-child(2) { width: 140px; text-align: center; }
.dc-product__table th:last-child { display: none; }
.dc-product__table td:last-child { grid-column: 1 / -1; color: var(--text-secondary); }
.dc-product__growth { padding-top: 24px; gap: 48px; }
.dc-product__growth-group, .dc-product__growth-copy { display: flex; flex-direction: column; gap: 32px; }
.dc-product__growth-group { gap: 48px; }
.dc-product__ecosystem { width: 370px; justify-self: center; }
.dc-product__growth-group { align-self: center; }
.dc-product__discovery, .dc-product__contribution { display: flex; flex-direction: column; gap: 48px; padding-top: 24px; }
.dc-product__center { text-align: left; }
.dc-product__related { display: flex; flex-direction: column; gap: 48px; padding: 24px 0 0; align-items: center; }
.dc-product__related-heading { padding-inline:16px; display: flex; flex-direction: column; gap: 24px; width: 100%; max-width: 924px; box-sizing: border-box; }
.dc-product__related-heading > p { text-align: center; }
.dc-product__end { width: 100%; height: 98px; }
.dc-product__footer { width: 100%; }
@media (min-width: 768px) {
  .dc-product__influence { padding-top: 0; }
  .dc-product__influence-image { display: block; aspect-ratio: 852 / 785; }
  .dc-product__research-outer { padding-top: var(--space-20); }
  .dc-product__map { left: calc(50% - 180px); top: 241px; width: 369px; height: 217px; }
  .dc-product__growth, .dc-product__discovery { padding-top: var(--space-20); }
  .dc-product__discovery > .dc-product__heading, .dc-product__contribution > .dc-product__heading { text-align: center; }
  .dc-product__stat-divider { max-width: 600px; }
  .dc-product__ecosystem { width: 100%; aspect-ratio: 736 / 713; }
  .dc-product__growth-copy { gap: 24px; }
  .dc-product__role { min-height: 0; }
  .dc-product__contribution { padding-top: var(--space-20); }
  .dc-product__related { padding-top: var(--space-20); }
}
@media (min-width: 1024px) {
  .dc-product { --case-gap: var(--space-20); --case-inset: var(--space-20); }
  .dc-product__two { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .dc-product__hero { min-height: calc(100vw * 830 / 1920); }
  .dc-product__heading { font-size: 72px; font-weight: 500; line-height: 1.25; letter-spacing: .01em; font-variation-settings: var(--heading-72-font-variation); }
  .dc-product__body { font-size: 20px; font-weight: 300; line-height: 32px; letter-spacing: .01em; font-variation-settings: var(--body-20-regular-font-variation); }
  .dc-product__accent { font-size: 24px; line-height: 38px; }
  .dc-product__about-title > * { grid-column: 2; }
  .dc-product__intro { gap: var(--case-gap); }
  .dc-product__role { justify-self: end; width: 424px; }
  .dc-product__influence { padding-top: 0; gap: var(--space-20); }
  .dc-product__influence-image { display: block; aspect-ratio: 852 / 785; }
  .dc-product__influence-group { gap: var(--space-20); }
  .dc-product__research-outer { padding-top: var(--space-20); }
  .dc-product__research { padding-block: var(--space-20); }
  .dc-product__research-content { width: min(1263.277px, 100%); gap: var(--space-20); }
  .dc-product__map { left: calc(681 / 1920 * 100%); top: -20px; width: 1404px; height: 824px; }
  .dc-product__stats { flex-direction: row; align-items: center; justify-content: space-between; font-size: 50px; line-height: 80px; gap: 0; }
  .dc-product__stat, .dc-product__methods { text-align: left; }
  .dc-product__stat-divider { width: 0; height: 171.354px; }
  .dc-product__research-copy { width: 542px; max-width: 100%; }
  .dc-product__table { grid-template-columns: 127px 186.713px minmax(0, 1fr); }
  .dc-product__table tr > :nth-child(2) { width: 181.595px; }
  .dc-product__table th:last-child { display: block; }
  .dc-product__table td:last-child { grid-column: auto; color: inherit; }
  .dc-product__ecosystem { max-width: 810px; justify-self: start; aspect-ratio: 810 / 785; }
  .dc-product__growth-copy { gap: 32px; }
  .dc-product__growth { padding-top: var(--space-20); gap: var(--space-20); }
  .dc-product__growth-group { gap: 48px; }
  .dc-product__discovery, .dc-product__contribution { padding-top: var(--space-20); gap: var(--space-20); }
  .dc-product__center { text-align: center; }
  .dc-product__intro-copy { padding-top: 0; }
  .dc-product__related { padding: var(--space-20) 0 0; gap: var(--space-20); }
  .dc-product__related-heading { padding-inline:0; }
  .dc-product__related-heading > h2 { text-align: center; }
  .dc-product__footer { width: 405px; }
}

/* Keep the authored1920 grid when classic scrollbars consume viewport space. */
@media(min-width:1920px){
 .dc-product__discovery > .case-content-layout,.dc-product__contribution > .case-content-layout { min-width:1776px; position:relative; left:50%; transform:translateX(-50%); }
}
</style>
