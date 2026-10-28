<script setup lang="ts">
import { computed, defineComponent, h, onMounted, onUnmounted, ref, type PropType } from 'vue'
import content from '../../content/about.json'
import TypoText from './TypoText.vue'
import DsHeader from './DsHeader.vue'
import DsTopNav from './DsTopNav.vue'
import DsTopNavScrollResume from './DsTopNavScrollResume.vue'
import DsPageUp from './DsPageUp.vue'
import DsFooter from './DsFooter.vue'

const emit = defineEmits<{ projects: []; download: []; print: [] }>()
const header = ref<HTMLElement>()
const compact = ref(false)
const place = computed<'Vitrina' | 'Resume'>({ get: () => 'Resume', set: value => { if (value === 'Vitrina') emit('projects') } })
const nodes: Record<string, CopyNode> = content.nodes
type CopyNode = { text: string; unordered: boolean; emphasis: { text: string; weight: number }[] }
const experience = [['1588:8403','1588:8404'],['1588:8406','1588:8407'],['1588:8409','1588:8410'],['1588:8412','1588:8413'],['1588:8415','1588:8416'],['1588:8418','1588:8419'],['1588:8421','1588:8422'],['1588:8424','1588:8425'],['1588:8427','1588:8428']]
const skills = [['1588:8434','1588:8435'],['1588:8437','1588:8438'],['1588:8440','1588:8441'],['1588:8443','1588:8444'],['1588:8446','1588:8447'],['1588:8449','1588:8450']]

// Render whole Typograf strings; retain source emphasis without splitting words
// before typography processing. Paragraphs and list semantics come from Figma.
const AboutCopy = defineComponent({
  props: { node: { type: Object as PropType<CopyNode>, required: true } },
  setup(props) {
    function renderLine(line: string) {
      line = line.replace(/\u2028/g, '\n')
      const matches: { start: number; end: number; weight: number }[] = []
      for (const item of props.node.emphasis) {
        const start = line.indexOf(item.text)
        if (start >= 0) matches.push({ start, end: start + item.text.length, weight: item.weight })
      }
      matches.sort((a,b) => a.start - b.start)
      const spans = []; let cursor = 0
      for (const match of matches) {
        if (match.start < cursor) continue
        if (match.start > cursor) spans.push(h(TypoText, { content: line.slice(cursor, match.start) }))
        spans.push(h(TypoText, { content: line.slice(match.start, match.end), style: { fontWeight: match.weight } }))
        cursor = match.end
      }
      if (cursor < line.length) spans.push(h(TypoText, { content: line.slice(cursor) }))
      return spans
    }
    return () => h(props.node.unordered ? 'ul' : 'div', { class: 'about-copy' }, props.node.text.split('\n').map(line => h(props.node.unordered ? 'li' : 'p', { class: 'about-copy__paragraph' }, renderLine(line))))
  },
})

function scrollToHeader() {
  header.value?.focus({ preventScroll: true })
  header.value?.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
}
let observer: IntersectionObserver | undefined
onMounted(() => {
  if (!header.value) return
  compact.value = header.value.getBoundingClientRect().bottom <= 0
  observer = new IntersectionObserver(([entry]) => { if (entry) compact.value = entry.boundingClientRect.bottom <= 0 }, { threshold: 0 })
  observer.observe(header.value)
})
onUnmounted(() => observer?.disconnect())
</script>

<template>
  <div class="about-page" :data-compact="compact">
    <div ref="header" class="about-page__header" tabindex="-1">
      <DsHeader />
      <DsTopNav v-model:place="place" @download="emit('download')" @print="emit('print')" />
    </div>
    <main class="about-page__body">
      <div class="about-page__experience">
        <section v-for="[title, body] in experience" :key="title" class="about-page__section" :data-figma-node="body">
          <TypoText tag="h2" class="about-page__heading" :content="nodes[title]!.text" />
          <AboutCopy :node="nodes[body]!" :class="{ 'about-page__lada': body === '1588:8404' }" />
        </section>
      </div>
      <aside class="about-page__sidebar">
        <div class="about-page__summary-wrap">
          <img class="about-page__quote-open" src="/resume/quote-open.svg" alt="" aria-hidden="true" />
          <div class="about-page__summary">
            <TypoText tag="p" class="about-page__summary-copy" :content="nodes['1588:8431']!.text" />
            <img class="about-page__quote-close" src="/resume/quote-close.svg" alt="" aria-hidden="true" />
          </div>
        </div>
        <div class="about-page__skills">
          <section v-for="[title, body] in skills" :key="title" class="about-page__section" :data-figma-node="body">
            <TypoText tag="h2" class="about-page__heading" :content="nodes[title]!.text" />
            <AboutCopy :node="nodes[body]!" />
          </section>
        </div>
      </aside>
    </main>
    <div class="about-page__page-up-slot" aria-hidden="true" />
    <DsFooter />
    <template v-if="compact">
      <div class="about-page__compact">
        <DsTopNavScrollResume v-model:place="place" @avatar-click="scrollToHeader" @download="emit('download')" @print="emit('print')" />
      </div>
      <DsPageUp @click="scrollToHeader" />
    </template>
  </div>
</template>

<style scoped>
.about-page { display: flex; flex-direction: column; align-items: center; gap: var(--space-16); width: 100%; padding: 0 var(--space-4) var(--space-16); background: var(--surface-default); }
.about-page__header { width: 100%; }
.about-page__header:focus { outline: none; }
.about-page__body { position: relative; isolation: isolate; display: flex; flex-direction: column; gap: var(--space-12); width: 100%; max-width: 1400px; }
.about-page__experience { display: flex; flex-direction: column; gap: var(--space-8); min-width: 0; }
.about-page__sidebar { display: flex; flex-direction: column; gap: 41px; order: -1; min-width: 0; }
.about-page__section { display: flex; flex-direction: column; gap: var(--space-2-5); min-width: 0; }
.about-page__heading { margin: 0; color: var(--text-muted); font-size: var(--text-size-18); font-weight: var(--text-weight-semibold); font-variation-settings: var(--font-variation-heading-md); line-height: 1.45; letter-spacing: .01em; white-space: pre-line; }
.about-page :deep(.about-copy) { margin: 0; padding: 0; font-size: var(--text-size-16); font-weight: var(--text-weight-regular); font-variation-settings: "YOPQ" 79; line-height: 1.45; }
.about-page :deep(ul.about-copy) { padding-left: var(--space-6); }
.about-page :deep(.about-copy__paragraph) { margin: 0; white-space: pre-line; }
.about-page :deep(.about-page__lada) { line-height: 1.6; }
.about-page__summary-wrap { position: relative; }
.about-page__summary { position: relative; z-index: 1; display: flex; flex-direction: column; padding: var(--space-6); border-radius: var(--radius-xlg); background: var(--surface-action-hover); }
.about-page__summary-copy { margin: 0; color: var(--text-body-accent); font-size: var(--text-size-16); font-weight: var(--text-weight-semibold); font-variation-settings: var(--font-variation-heading-base); line-height: 1.5; white-space: pre-line; }
.about-page__quote-open { display: none; position: absolute; z-index: -1; left: -203.37109375px; top: 0; pointer-events: none; animation: about-quote-open-enter 650ms cubic-bezier(.22,1,.36,1) 200ms both; }
.about-page__quote-close { align-self: flex-end; margin-top: var(--space-6); pointer-events: none; transform: scaleX(-1); }
.about-page__skills { display: flex; flex-direction: column; gap: var(--space-8); }
.about-page__skills :deep(.about-copy) { font-size: var(--text-size-14); line-height: 1.4; }
.about-page__skills :deep(ul.about-copy) { letter-spacing: .01em; }
.about-page__page-up-slot { height: 98px; width: 100%; }
.about-page__compact { position: fixed; inset: 0 0 auto; z-index: 30; }
@keyframes about-quote-open-enter { from { opacity: 0; transform: translateX(28px); } to { opacity: 1; transform: translateX(0); } }
@media (min-width: 768px) {
  .about-page__body { flex-direction: row; gap: var(--space-6); }
  .about-page__experience { flex: 734 1 0; }
  .about-page__sidebar { order: 0; flex: 594 1 0; }
}
@media (min-width: 1464px) {
  .about-page { padding-inline: var(--space-8); }
  .about-page__body { flex-direction: row; gap: 72px; }
  .about-page__experience { width: 734px; flex: 1 1 734px; }
  .about-page__sidebar { order: 0; flex: 0 0 594px; }
  .about-page__summary { display: block; padding: 48px 64px 134px 48px; }
  .about-page__quote-open { display: block; }
  .about-page__quote-close { position: absolute; right: 43.5810547px; top: 506.2841797px; margin: 0; }
}
@media (prefers-reduced-motion: reduce) { .about-page__quote-open { animation: none; } }
@media print { .about-page__compact, .about-page :deep(.ds-page-up), .about-page :deep(.ds-top-nav), .about-page__page-up-slot { display: none; } .about-page__quote-open { animation: none; } .about-page__section, .about-page__summary { break-inside: avoid; } .about-page__body { flex-direction: column; gap: var(--space-12); } .about-page__experience { flex: auto; } .about-page__sidebar { order: -1; flex: auto; } }
</style>
