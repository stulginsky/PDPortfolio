<script setup lang="ts">
import { defineComponent, h, onMounted, onUnmounted, ref, type PropType } from 'vue'
import ChirpBrHero from '../../components/ChirpBrHero.vue'
import DsBtnNav from '../../components/DsBtnNav.vue'
import DsCaseImagePreview from '../../components/DsCaseImagePreview.vue'
import '../../assets/css/case-preview-surface.css'
import DsCaseImageViewer from '../../components/DsCaseImageViewer.vue'
import RelatedCases from '../../components/RelatedCases.vue'
import DsFooter from '../../components/DsFooter.vue'
import DsPageUp from '../../components/DsPageUp.vue'
import TypoText from '../../components/TypoText.vue'
import content from '../../../content/cases/chirp-brand.json'

const page = content.page
useSeoMeta({ title: content.pageTitle, description: page.nodes['559:2373'].text })
type Frame = { id: string; gap?: number; children?: Frame[] }
const nodes = page.nodes as Record<string, { text: string; kind: string; links?: { text: string; href: string }[]; runs: { text: string; list: boolean }[] }>
// Native editorial structure of Figma 559:2332; illustrations stay in original SVGs.
const CaseFrame = defineComponent({
  props: { frame: { type: Object as PropType<Frame>, required: true } },
  setup(props) {
    function render(frame: Frame): ReturnType<typeof h> {
      if (frame.children) return h('section', {
        class: 'brand-case__frame', 'data-figma-frame': frame.id,
        style: { '--frame-gap': frame.gap === 64 ? 'var(--brand-section-gap)' : `${frame.gap || 0}px` },
      }, frame.children.map(render))
      const node = nodes[frame.id]!
      const attrs = { class: `brand-case__${node.kind}`, 'data-figma-text': frame.id }
      if (node.kind === 'heading' || node.kind === 'subheading') return h(TypoText, { ...attrs, tag: node.kind === 'heading' ? 'h2' : 'h3', content: node.text })
      if (node.links) {
        let rest = node.text
        const parts = []
        for (const link of node.links) {
          const at = rest.indexOf(link.text)
          if (at < 0) continue
          parts.push(h(TypoText, { content: rest.slice(0, at) }), h(TypoText, { tag: 'a', href: link.href, content: link.text, class: 'brand-case__inline-link' }))
          rest = rest.slice(at + link.text.length)
        }
        parts.push(h(TypoText, { content: rest }))
        return h('div', attrs, parts)
      }
      return h('div', attrs, node.runs.map((run, index) => run.list
        ? h('ul', { key: index }, run.text.trim().split('\n').filter(Boolean).map(text => h('li', {}, h(TypoText, { content: text.trim() }))))
        : h(TypoText, { key: index, tag: 'div', content: run.text.replace(/\u2028/g, '\n') })))
    }
    return () => render(props.frame)
  },
})
const sequence: { frame?: Frame; media?: typeof page.media[number] }[] = [
  { frame: page.frames[0] }, { frame: page.frames[1] }, { media: page.media[0] },
  { frame: page.frames[2] }, { media: page.media[1] }, { frame: page.frames[3] },
  { media: page.media[2] }, { frame: page.frames[4] }, { media: page.media[3] },
  { frame: page.frames[5] }, { media: page.media[4] }, { frame: page.frames[6] },
  { frame: page.frames[7] }, { frame: page.frames[8] },
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
  <main class="brand-case">
    <div ref="start" class="brand-case__hero" tabindex="-1">
      <ChirpBrHero />
      <div class="brand-case__back"><DsBtnNav tag="a" href="/" :aria-label="page.backLabel" /></div>
    </div>
    <div class="brand-case__flow">
      <template v-for="(block, index) in sequence" :key="index">
        <div v-if="block.frame" class="brand-case__column"><CaseFrame :frame="block.frame" /></div>
        <div v-else-if="block.media" class="case-preview-surface">
          <DsCaseImagePreview :title="block.media.title" :data-figma-frame="block.media.node" @zoom="openMedia(block.media)">
            <img :src="block.media.src" :alt="block.media.alt" :width="block.media.width" :height="block.media.height" />
          </DsCaseImagePreview>
        </div>
      </template>
      <div class="brand-case__related"><RelatedCases current-case-href="/cases/chirp-brand" /></div>
      <DsFooter />
      <div class="brand-case__end" aria-hidden="true" />
    </div>
    <DsPageUp v-if="showPageUp" @click="scrollToStart" />
    <DsCaseImageViewer v-model:open="viewerOpen" :title="selectedMedia.title">
      <img :key="selectedMedia.src" :src="selectedMedia.src" :alt="selectedMedia.alt" />
    </DsCaseImageViewer>
  </main>
</template>

<style scoped>
.brand-case { width: 100%; background: var(--surface-default); --brand-section-gap: var(--space-8); }
.brand-case__hero { position: relative; width: 100%; outline: none; }
.brand-case__back { position: absolute; top: 0; left: 0; height: 100px; padding: var(--space-6); display: flex; align-items: center; box-sizing: border-box; z-index: 2; }
.brand-case__flow { display: flex; flex-direction: column; align-items: center; width: 100%; gap: var(--brand-section-gap); padding-top: var(--space-8); }
.brand-case__column { width: 100%; max-width: 956px; padding-inline: var(--space-4); box-sizing: border-box; min-width: 0; }
.brand-case__flow :deep(.brand-case__frame) { display: flex; flex-direction: column; gap: var(--frame-gap); min-width: 0; }
.brand-case__flow :deep(h2), .brand-case__flow :deep(h3), .brand-case__flow :deep(ul) { margin: 0; }
.brand-case__flow :deep(.brand-case__heading) { font-size: var(--text-size-24); font-weight: 600; line-height: 1.25; color: var(--accent-aubergine); font-variation-settings: var(--font-variation-heading-xl-semibold); }
.brand-case__flow :deep(.brand-case__body) { font-size: var(--text-size-16); font-weight: 400; line-height: 1.6; color: var(--text-default); }
.brand-case__flow :deep(.brand-case__subheading) { font-size: var(--text-size-18); font-weight: 600; line-height: 1.45; color: var(--text-secondary); }
.brand-case__flow :deep(.brand-case__accent) { font-size: var(--text-size-20); font-weight: 300; line-height: 1.6; color: var(--text-accent-chirp); letter-spacing: .01em; }
.brand-case__flow :deep([data-figma-text]) { white-space: pre-wrap; }
.brand-case__flow :deep(.brand-case__body ul) { padding-inline-start: 1.5em; white-space: normal; }
.brand-case__flow :deep(.brand-case__inline-link) { color: var(--text-accent-general); text-decoration: none; }
.brand-case__flow :deep(.brand-case__inline-link:hover) { color: var(--text-link-hover); }
.brand-case__flow :deep(.brand-case__inline-link:active) { color: var(--text-link-pressed); }
.brand-case__flow :deep(.brand-case__inline-link:focus-visible) { outline: 2px solid var(--border-focus); outline-offset: 2px; }
.brand-case__related { width: 100%; max-width: 956px; box-sizing: border-box; }
.brand-case__end { width: 100%; height: 98px; }
@media (min-width: 768px) {
  .brand-case { --brand-section-gap: var(--space-12); }
  .brand-case__flow { padding-top: var(--space-12); }
  .brand-case__related { padding-inline: var(--space-4); }
  .brand-case__flow :deep(.brand-case__heading) { font-size: var(--text-size-32); line-height: 1.2; letter-spacing: .015em; }
}
@media (min-width: 1280px) {
  .brand-case { --brand-section-gap: var(--space-16); }
  .brand-case__flow { padding-top: 37px; }
  .brand-case__flow :deep(.brand-case__body) { font-size: var(--text-size-20); font-weight: 300; font-variation-settings: var(--font-variation-body-accent); letter-spacing: .01em; }
  .brand-case__flow :deep(.brand-case__subheading) { font-size: var(--text-size-22); line-height: 1.3; letter-spacing: .03em; }
  .brand-case__flow :deep(.brand-case__accent) { font-size: var(--text-size-24); letter-spacing: .03em; }
}
</style>
