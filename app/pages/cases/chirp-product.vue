<script setup lang="ts">
import { defineComponent, h, onMounted, onUnmounted, ref, type PropType } from 'vue'
import ChirpPrHero from '../../components/ChirpPrHero.vue'
import DsBtnNav from '../../components/DsBtnNav.vue'
import DsCaseImagePreview from '../../components/DsCaseImagePreview.vue'
import '../../assets/css/case-preview-surface.css'
import DsCaseImageViewer from '../../components/DsCaseImageViewer.vue'
import RelatedCases from '../../components/RelatedCases.vue'
import DsFooter from '../../components/DsFooter.vue'
import DsPageUp from '../../components/DsPageUp.vue'
import TypoText from '../../components/TypoText.vue'
import content from '../../../content/cases/chirp-product.json'

const page = content.page
useSeoMeta({ title: content.pageTitle, description: page.nodes['344:2992'].text })
type Frame = { id: string; children?: Frame[] }
const nodes = page.nodes as Record<string, { text: string; kind: string; runs: { list: boolean; text: string; breakAfter?: boolean }[] }>
// Internal renderer for the source Figma tree; not a reusable DS component.
const CaseFrame = defineComponent({
  props: { frame: { type: Object as PropType<Frame>, required: true } },
  setup(props) {
    function render(frame: Frame): ReturnType<typeof h> {
      if (frame.children) return h('section', {
        class: ['product-case__section', frame.id === '344:2981' && 'product-case__opening'],
        'data-figma-frame': frame.id,
      }, frame.children.map(render))
      const node = nodes[frame.id]!
      const attrs = { class: `product-case__${node.kind}`, 'data-figma-text': frame.id }
      if (node.kind === 'heading' || node.kind === 'subheading') {
        return h(TypoText, { ...attrs, tag: node.kind === 'heading' ? 'h2' : 'h3', content: node.text })
      }
      return h('div', attrs, node.runs.map((run, index) => run.list
        ? h('ul', { key: index }, run.text.trim().split('\n').map(text => h('li', {}, h(TypoText, { content: text.trim() }))))
        : h(TypoText, { key: index, tag: 'div', style: run.breakAfter ? { marginBottom: '1lh' } : undefined, content: run.text.replace(/\u2028/g, '\n') })))
    }
    return () => render(props.frame)
  },
})
const sequence: { frame?: Frame; media?: typeof page.media[number] }[] = [
  { frame: page.frames[0] },
  { media: page.media[0] },
  { frame: page.frames[1] },
  { frame: page.frames[2] },
  { frame: page.frames[3] },
  { media: page.media[1] },
  { frame: page.frames[4] },
  { frame: page.frames[5] },
  { media: page.media[2] },
  { frame: page.frames[6] },
  { media: page.media[3] },
  { frame: page.frames[7] },
  { frame: page.frames[8] },
  { media: page.media[4] },
  { frame: page.frames[9] },
  { frame: page.frames[10] },
  { media: page.media[5] },
  { frame: page.frames[11] },
  { frame: page.frames[12] },
  { frame: page.frames[13] },
  { media: page.media[6] },
  { frame: page.frames[14] },
  { frame: page.frames[15] },
]
const viewerOpen = ref(false)
const selectedMedia = ref(page.media[0]!)
function openMedia(media: typeof page.media[number]) { selectedMedia.value = media; viewerOpen.value = true }
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
  <main class="product-case">
    <div ref="start" class="product-case__hero" tabindex="-1">
      <ChirpPrHero />
      <div class="product-case__back"><DsBtnNav tag="a" href="/" :aria-label="page.backLabel" /></div>
    </div>
    <div class="product-case__flow">
      <template v-for="(block, index) in sequence" :key="index">
        <div v-if="block.frame" class="product-case__column"><CaseFrame :frame="block.frame" /></div>
        <div v-else-if="block.media" class="case-preview-surface">
          <DsCaseImagePreview :title="block.media.title" :data-figma-frame="block.media.node" @zoom="openMedia(block.media)">
            <img :src="block.media.src" :alt="block.media.alt" :width="block.media.width" :height="block.media.height" />
          </DsCaseImagePreview>
        </div>
      </template>
      <div class="product-case__related"><RelatedCases current-case-href="/cases/chirp-product" /></div>
      <DsFooter />
      <div class="product-case__end" aria-hidden="true" />
    </div>
    <DsPageUp v-if="showPageUp" @click="scrollToStart" />
    <DsCaseImageViewer v-model:open="viewerOpen" :title="selectedMedia.title">
      <img :key="selectedMedia.src" :src="selectedMedia.src" :alt="selectedMedia.alt" />
    </DsCaseImageViewer>
  </main>
</template>

<style scoped>
.product-case { width: 100%; background: var(--surface-default); }
.product-case__hero { position: relative; width: 100%; outline: none; }
.product-case__back { position: absolute; top: 0; left: 0; height: 100px; padding: var(--space-6); display: flex; gap: var(--space-2); align-items: center; box-sizing: border-box; z-index: 2; }
.product-case__flow { display: flex; flex-direction: column; align-items: center; width: 100%; gap: var(--space-8); }
.product-case__column { width: 100%; max-width: 956px; padding-inline: var(--space-4); box-sizing: border-box; min-width: 0; }
.product-case__flow :deep(.product-case__section) { display: flex; flex-direction: column; gap: var(--space-6); min-width: 0; }
.product-case__flow :deep(.product-case__opening) { gap: var(--space-16); }
.product-case__flow :deep(.product-case__section h2), .product-case__flow :deep(.product-case__section h3), .product-case__flow :deep(.product-case__section ul) { margin: 0; }
.product-case__flow :deep(.product-case__heading) { font-size: var(--text-size-24); font-weight: 600; line-height: 1.25; color: var(--accent-aubergine); font-variation-settings: var(--font-variation-heading-xl-semibold); }
.product-case__flow :deep(.product-case__subheading) { font-size: var(--text-size-18); font-weight: 600; line-height: 1.45; letter-spacing: .01em; color: var(--text-secondary); font-variation-settings: var(--font-variation-heading-xl-semibold); }
.product-case__flow :deep(.product-case__body) { font-size: var(--text-size-16); font-weight: 400; line-height: 1.6; color: var(--text-default); font-variation-settings: normal; }
.product-case__flow :deep(.product-case__question) { font-size: var(--text-size-20); font-weight: 300; line-height: 1.6; letter-spacing: .01em; color: var(--text-accent-chirp); font-variation-settings: var(--font-variation-body-accent); }
.product-case__flow :deep([data-figma-text] > div) { white-space: pre-wrap; }
.product-case__flow :deep(.product-case__body ul) { padding-inline-start: 1.5em; }
.product-case__end { width: 100%; height: 98px; }
.product-case__related { width: 100%; max-width: 956px; box-sizing: border-box; }
@media (min-width: 768px) {
  .product-case__related { padding-inline: var(--space-4); }
  .product-case__flow { gap: var(--space-12); }
  .product-case__flow :deep(.product-case__heading) { font-size: var(--text-size-32); line-height: 1.2; letter-spacing: .015em; }
}
@media (min-width: 1280px) {
  .product-case__flow { gap: var(--space-16); }
  .product-case__flow :deep(.product-case__body) { font-size: var(--text-size-20); font-weight: 300; font-variation-settings: var(--font-variation-body-accent); letter-spacing: .01em; }
  .product-case__flow :deep(.product-case__subheading) { font-size: var(--text-size-22); line-height: 1.3; letter-spacing: .03em; }
  .product-case__flow :deep(.product-case__question) { font-size: var(--text-size-24); letter-spacing: .03em; }
}
</style>
