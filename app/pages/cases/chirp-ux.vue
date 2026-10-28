<script setup lang="ts">
import { defineComponent, h, onMounted, onUnmounted, ref, type PropType } from 'vue'
import ChirpUxHero from '../../components/ChirpUxHero.vue'
import DsBtnNav from '../../components/DsBtnNav.vue'
import DsCaseImagePreview from '../../components/DsCaseImagePreview.vue'
import '../../assets/css/case-preview-surface.css'
import DsCaseImageViewer from '../../components/DsCaseImageViewer.vue'
import RelatedCases from '../../components/RelatedCases.vue'
import DsFooter from '../../components/DsFooter.vue'
import DsPageUp from '../../components/DsPageUp.vue'
import TypoText from '../../components/TypoText.vue'
import content from '../../../content/cases/chirp-ux.json'

const page = content.page
useSeoMeta({ title: content.pageTitle, description: page.nodes['295:1293'].text })
type Frame = { id: string; layout?: string; gap?: number; padding?: number[]; radius?: number; children?: Frame[]; asset?: string; width?: number; height?: number }
const nodes = page.nodes as Record<string, { text: string; kind: string; links?: { text: string; href: string }[]; underlines?: string[]; runs: { list: boolean; text: string }[] }>
const roles: Record<string, string> = {
  '295:1282': 'opening', '516:1413': 'panel', '528:2339': 'panel questions',
  '516:1417': 'badge before', '516:1422': 'badge after',
  '516:1431': 'cards', '516:1432': 'cards', '736:2055': 'brand-comparison',
  '736:2056': 'brand-left', '528:2348': 'question-grid', '528:2374': 'question-layout',
  '528:2350': 'number', '528:2354': 'number', '528:2358': 'number', '528:2362': 'number', '528:2366': 'number',
}
// Internal renderer of this case's Figma tree. Artwork stays in original SVGs.
const CaseFrame = defineComponent({
  props: { frame: { type: Object as PropType<Frame>, required: true } },
  setup(props) {
    function render(frame: Frame): ReturnType<typeof h> {
      if (frame.asset) return h('img', { src: frame.asset, alt: '', width: frame.width, height: frame.height, class: frame.id === '528:2372' ? 'ux-case__brain' : 'ux-case__icon', 'data-figma-frame': frame.id })
      if (frame.children) {
        const roleClasses = (roles[frame.id] || '').split(' ').filter(Boolean).map(role => `ux-case__${role}`)
        const children = frame.id === '528:2348'
          ? [...frame.children].sort((a, b) => ['528:2349', '528:2357', '528:2365', '528:2353', '528:2361'].indexOf(a.id) - ['528:2349', '528:2357', '528:2365', '528:2353', '528:2361'].indexOf(b.id))
          : frame.children
        return h('div', { class: ['ux-case__frame', frame.layout === 'HORIZONTAL' && 'ux-case__row', ...roleClasses],
          style: { '--frame-gap': `${frame.gap || 0}px`, padding: (frame.padding || []).map(n => `${n}px`).join(' '), borderRadius: `${frame.radius || 0}px` },
          'data-figma-frame': frame.id,
        }, children.map(render))
      }
      const node = nodes[frame.id]!
      const attrs = { class: `ux-case__${node.kind}`, 'data-figma-text': frame.id }
      if (node.links || node.underlines) {
        let rest = node.text
        const children = []
        const fragments = node.links || node.underlines!.map(text => ({ text, href: undefined }))
        for (const fragment of fragments) {
          const term = fragment.text
          const at = rest.indexOf(term)
          if (at < 0) continue
          children.push(h(TypoText, { content: rest.slice(0, at) }), h(TypoText, {
            tag: fragment.href ? 'a' : 'u', content: term,
            ...(fragment.href ? { href: fragment.href, class: 'ux-case__inline-link' } : {}),
          }))
          rest = rest.slice(at + term.length)
        }
        children.push(h(TypoText, { content: rest }))
        return h('div', { ...attrs, style: { whiteSpace: 'pre-wrap' } }, children)
      }
      if (node.kind === 'heading' || node.kind === 'subheading') return h(TypoText, { ...attrs, tag: node.kind === 'heading' ? 'h2' : 'h3', content: node.text })
      return h('div', attrs, node.runs.map((run, index) => run.list
        ? h('ul', { key: index }, run.text.trim().split('\n').map(text => h('li', {}, h(TypoText, { content: text.trim() }))))
        : h(TypoText, { key: index, tag: 'div', content: run.text.replace(/\u2028/g, '\n') })))
    }
    return () => render(props.frame)
  },
})
const sequence: { frame?: Frame; media?: typeof page.media[number]; collage?: boolean }[] = [
  { frame: page.frames[0] }, { media: page.media[0] }, { frame: page.frames[1] },
  { media: page.media[1] }, { frame: page.frames[2] }, { media: page.media[2] },
  { frame: page.frames[3] }, { media: page.media[3] }, { frame: page.frames[4] },
  { frame: page.frames[5] }, { frame: page.frames[6] }, { collage: true }, { frame: page.frames[7] },
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
  <main class="ux-case">
    <div ref="start" class="ux-case__hero" tabindex="-1">
      <ChirpUxHero />
      <div class="ux-case__back"><DsBtnNav tag="a" href="/" :aria-label="page.backLabel" /></div>
    </div>
    <div class="ux-case__flow">
      <template v-for="(block, index) in sequence" :key="index">
        <div v-if="block.frame" class="ux-case__column"><CaseFrame :frame="block.frame" /></div>
        <div v-else-if="block.media" class="ux-case__illustration">
          <div class="case-preview-surface">
            <DsCaseImagePreview :title="block.media.title" :data-figma-frame="block.media.node" @zoom="openMedia(block.media)">
              <img :src="block.media.src" :alt="block.media.alt" :width="block.media.width" :height="block.media.height" />
            </DsCaseImagePreview>
          </div>
          <div v-if="'caption' in block.media" class="ux-case__column ux-case__caption"><TypoText tag="p" :content="block.media.caption" /></div>
        </div>
        <div v-else-if="block.collage" class="ux-case__collage" :data-figma-frame="page.collage.node">
          <img :src="page.collage.src" :alt="page.collage.alt" :width="page.collage.width" :height="page.collage.height" />
        </div>
      </template>
      <div class="ux-case__related"><RelatedCases current-case-href="/cases/chirp-ux" /></div>
      <DsFooter />
      <div class="ux-case__end" aria-hidden="true" />
    </div>
    <DsPageUp v-if="showPageUp" @click="scrollToStart" />
    <DsCaseImageViewer v-model:open="viewerOpen" :title="selectedMedia.title">
      <img :key="selectedMedia.src" :src="selectedMedia.src" :alt="selectedMedia.alt" />
    </DsCaseImageViewer>
  </main>
</template>

<style scoped>
.ux-case { width: 100%; background: var(--surface-default); }
.ux-case__hero { position: relative; width: 100%; outline: none; }
.ux-case__back { position: absolute; top: 0; left: 0; height: 100px; padding: var(--space-6); display: flex; gap: var(--space-2); align-items: center; box-sizing: border-box; z-index: 2; }
.ux-case__flow { display: flex; flex-direction: column; align-items: center; width: 100%; gap: var(--space-8); padding-top: var(--space-8); }
.ux-case__column { width: 100%; max-width: 956px; padding-inline: var(--space-4); box-sizing: border-box; min-width: 0; }
.ux-case__flow :deep(.ux-case__frame) { display: flex; flex-direction: column; gap: var(--frame-gap); min-width: 0; box-sizing: border-box; }
.ux-case__flow :deep(.ux-case__row) { flex-direction: row; align-items: center; }
.ux-case__flow :deep(.ux-case__opening) { gap: var(--space-8); }
.ux-case__flow :deep(h2), .ux-case__flow :deep(h3), .ux-case__body :deep(ul) { margin: 0; }
.ux-case__flow :deep(.ux-case__heading) { font-size: var(--text-size-24); font-weight: 600; line-height: 1.25; color: var(--accent-aubergine); font-variation-settings: var(--font-variation-heading-xl-semibold); }
.ux-case__flow :deep(.ux-case__subheading) { font-size: var(--text-size-18); font-weight: 600; line-height: 1.45; letter-spacing: .01em; color: var(--text-secondary); font-variation-settings: var(--font-variation-heading-xl-semibold); }
.ux-case__flow :deep(.ux-case__body) { font-size: var(--text-size-16); font-weight: 400; line-height: 1.6; color: var(--text-default); }
.ux-case__flow :deep(.ux-case__small) { font-size: var(--text-size-16); line-height: 1.6; color: var(--text-secondary); }
.ux-case__flow :deep(.ux-case__intro), .ux-case__flow :deep(.ux-case__accent) { font-size: var(--text-size-18); font-weight: 300; line-height: 1.6; letter-spacing: .01em; color: var(--text-secondary); }
.ux-case__flow :deep(.ux-case__question) { font-size: var(--text-size-20); font-weight: 300; line-height: 1.6; letter-spacing: .01em; color: var(--text-accent-chirp); }
.ux-case__flow :deep([data-figma-text] > div) { white-space: pre-wrap; }
.ux-case__flow :deep(.ux-case__body ul) { padding-inline-start: 1.5em; }
.ux-case__flow :deep(.ux-case__inline-link) { color: var(--text-accent-general); text-decoration: none; }
.ux-case__flow :deep(.ux-case__inline-link:hover) { color: var(--text-link-hover); }
.ux-case__flow :deep(.ux-case__inline-link:active) { color: var(--text-link-pressed); }
.ux-case__flow :deep(.ux-case__inline-link:focus-visible) { outline: 2px solid var(--border-focus); outline-offset: 2px; }
.ux-case__flow :deep(.ux-case__panel) { background: var(--surface-subtle); }
.ux-case__flow :deep(.ux-case__badge) { flex: 0 0 auto; font-weight: 600; align-self: flex-start; }
.ux-case__flow :deep(.ux-case__badge .ux-case__small) { line-height: 1.5; }
.ux-case__flow :deep(.ux-case__before) { background: rgb(239 68 68 / .1); }
.ux-case__flow :deep(.ux-case__after) { background: rgb(34 197 94 / .1); }
.ux-case__flow :deep(.ux-case__before .ux-case__small) { color: var(--text-error); font-weight: 600; }
.ux-case__flow :deep(.ux-case__after .ux-case__small) { color: var(--success-500); font-weight: 600; }
.ux-case__flow :deep(.ux-case__brand-comparison .ux-case__accent) { color: var(--text-accent-chirp); }
.ux-case__flow :deep(.ux-case__cards), .ux-case__flow :deep(.ux-case__brand-comparison) { align-items: stretch; flex-direction: column; gap: var(--space-8); }
.ux-case__flow :deep(.ux-case__cards > *), .ux-case__flow :deep(.ux-case__brand-comparison > *) { flex: 1; }
.ux-case__flow :deep(.ux-case__icon) { width: 48px; height: 48px; flex: 0 0 48px; }
.ux-case__flow :deep(.ux-case__question-layout) { flex-direction: column; align-items: stretch; }
.ux-case__flow :deep(.ux-case__question-grid) { display: grid; grid-template-columns: minmax(0, 1fr); gap: var(--space-6); flex: 1; }
.ux-case__flow :deep(.ux-case__number) { width: 48px; height: 48px; padding: 0 !important; flex: 0 0 48px; align-items: center; justify-content: center; background: rgb(86 140 255 / .15); color: #568cff; }
.ux-case__flow :deep(.ux-case__number .ux-case__body) { color: inherit; font-weight: 500; }
.ux-case__flow :deep(.ux-case__brain) { width: 210.895px; max-width: 100%; height: auto; object-fit: contain; align-self: center; }
.ux-case__illustration { width: 100%; display: flex; flex-direction: column; align-items: center; }
.ux-case__caption { padding-top: var(--space-8); padding-bottom: var(--space-6); font-size: var(--text-size-18); font-weight: 300; line-height: 1.6; color: var(--text-secondary); }
.ux-case__caption p { margin: 0; }
.ux-case__collage { width: 100%; overflow: hidden; display: flex; justify-content: center; }
.ux-case__collage img { display: block; width: max(100%, 900.715px); max-width: none; height: auto; flex: 0 0 auto; }
.ux-case__end { width: 100%; height: 98px; }
.ux-case__related { width: 100%; max-width: 956px; box-sizing: border-box; }
@media (min-width: 768px) {
  .ux-case__related { padding-inline: var(--space-4); }
  .ux-case__flow { gap: var(--space-12); padding-top: var(--space-12); }
  .ux-case__flow :deep(.ux-case__opening) { gap: var(--space-12); }
  .ux-case__flow :deep(.ux-case__heading) { font-size: var(--text-size-32); line-height: 1.2; letter-spacing: .015em; }
  .ux-case__flow :deep(.ux-case__cards), .ux-case__flow :deep(.ux-case__brand-comparison) { flex-direction: row; gap: var(--space-16); }
  .ux-case__flow :deep(.ux-case__brand-left) { align-items: flex-end; text-align: right; }
  .ux-case__flow :deep(.ux-case__brand-comparison > .ux-case__brand-left) { flex: 0 0 42.780% ; }
  .ux-case__flow :deep(.ux-case__question-layout) { flex-direction: row; align-items: center; }
}
@media (min-width: 1024px) {
  .ux-case__flow :deep(.ux-case__question-grid) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (min-width: 1280px) {
  .ux-case__flow { gap: var(--space-16); padding-top: 38px; }
  .ux-case__flow :deep(.ux-case__opening) { gap: var(--space-16); }
  .ux-case__flow :deep(.ux-case__body) { font-size: var(--text-size-20); font-weight: 300; font-variation-settings: var(--font-variation-body-accent); letter-spacing: .01em; }
  .ux-case__flow :deep(.ux-case__subheading) { font-size: var(--text-size-22); line-height: 1.3; letter-spacing: .03em; }
  .ux-case__flow :deep(.ux-case__intro) { font-size: var(--text-size-22); }
  .ux-case__flow :deep(.ux-case__accent) { font-size: var(--text-size-24); letter-spacing: .03em; }
.ux-case__caption { font-size: var(--text-size-20); letter-spacing: .03em; }
  .ux-case__flow :deep(.ux-case__question) { font-size: var(--text-size-24); letter-spacing: .03em; }
}
</style>
