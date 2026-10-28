<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import ChirpDsHero from '../../components/ChirpDsHero.vue'
import DSOverview from '../../components/DSOverview.vue'
import DsImgTitleToolbar from '../../components/DsImgTitleToolbar.vue'
import DsCaseImageViewer from '../../components/DsCaseImageViewer.vue'
import DsBtnNav from '../../components/DsBtnNav.vue'
import RelatedCases from '../../components/RelatedCases.vue'
import DsFooter from '../../components/DsFooter.vue'
import DsPageUp from '../../components/DsPageUp.vue'
import TypoText from '../../components/TypoText.vue'
import { galleryNativeSize } from '../../components/ds-overview.geometry'
import { heroBreakpoints, heroReferences } from '../../components/chirp-ds-hero.scene-context'
import content from '../../../content/cases/chirp-design-system.json'
import foundation from '../../../content/documents/chirp-design-system/foundation.md?raw'
import tokens from '../../../content/documents/chirp-design-system/tokens.json?raw'

const page = content.page
useSeoMeta({ title: content.pageTitle, description: content.hero.focus })
type Tab = 'overview' | 'foundation' | 'tokens'
const tab = ref<Tab>('overview')
const dark = computed(() => tab.value !== 'overview')
const bannerStyle = Object.fromEntries(heroBreakpoints.map(profile => ['--banner-'+profile, (heroReferences[profile].panel.y / heroReferences[profile].width * 100)+'vw']))
const toolbar = ref<HTMLElement>()
const documentBox = ref<HTMLElement>()
const start = ref<HTMLElement>()
const viewerOpen = ref(false)
const showPageUp = ref(false)
let observer: IntersectionObserver | undefined
onMounted(() => {
  observer = new IntersectionObserver(([entry]) => {
    if (entry) showPageUp.value = entry.boundingClientRect.bottom <= 0
  })
  if (start.value) observer.observe(start.value)
})
onUnmounted(() => { observer?.disconnect() })
async function selectTab(value: Tab) {
  if (tab.value === value) return
  tab.value = value
  await nextTick()
  documentBox.value?.scrollTo(0, 0)
  toolbar.value?.scrollIntoView({ block: 'start', behavior: 'instant' })
}
function scrollToStart() {
  start.value?.focus({ preventScroll: true })
  window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
}
const documentName = computed(() => tab.value === 'tokens' ? page.documents.tokens : page.documents.foundation)
// Preserve the original documents: highlighting adds spans, not HTML or typographic substitutions.
const documentLines = computed(() => {
  const source = tab.value === 'tokens' ? tokens : foundation
  return source.replace(/\r\n/g, '\n').split('\n').map(line => {
    const pattern = tab.value === 'tokens'
      ? /"(?:\\.|[^"\\])*"(?=\s*:)|"(?:\\.|[^"\\])*"|\b(?:true|false|null)\b|-?\b\d+(?:\.\d+)?\b/g
      : /\x60[^\x60]*\x60|^#{1,6}\s.*$|\*\*[^*]+\*\*/g
    const parts: { text: string; kind: string }[] = []
    let offset = 0
    for (const match of line.matchAll(pattern)) {
      if (match.index! > offset) parts.push({ text: line.slice(offset, match.index), kind: 'plain' })
      const text = match[0]
      const kind = tab.value === 'tokens'
        ? text.startsWith('"') ? /^\s*:/.test(line.slice(match.index! + text.length)) ? 'key' : 'string' : 'literal'
        : text.startsWith('#') ? 'heading' : 'code'
      parts.push({ text, kind })
      offset = match.index! + text.length
    }
    if (offset < line.length) parts.push({ text: line.slice(offset), kind: 'plain' })
    return parts
  })
})
</script>

<template>
  <main class="ds-case" :class="{ 'ds-case--dark': dark }">
    <div class="ds-case__scene" :style="bannerStyle">
      <div ref="start" class="ds-case__hero" tabindex="-1">
        <ChirpDsHero :panel-appearance="dark ? 'on-dark' : 'on-light'" />
        <div class="ds-case__back"><DsBtnNav tag="a" href="/" :aria-label="page.backLabel" /></div>
      </div>
      <section class="ds-case__content" data-figma-frame="781:3490">
        <div ref="toolbar" class="ds-case__column ds-case__toolbar">
          <DsImgTitleToolbar :model-value="tab" :title="page.toolbarTitle" :show-zoom="!dark"
            @select="selectTab" @zoom="viewerOpen = true" />
        </div>
        <div class="ds-case__column">
          <DSOverview v-if="tab === 'overview'" />
          <div v-else :key="tab" ref="documentBox" class="ds-case__document" role="region"
            :aria-label="documentName" tabindex="0">
            <ol class="ds-case__lines">
              <li v-for="(parts, index) in documentLines" :key="index" class="ds-case__line">
                <span class="ds-case__line-number" aria-hidden="true">{{ index + 1 }}</span>
                <code><span v-for="(part, partIndex) in parts" :key="partIndex"
                  :class="'ds-case__syntax-' + part.kind">{{ part.text }}</span></code>
              </li>
            </ol>
          </div>
        </div>
      </section>
    </div>
    <div class="ds-case__tail">
      <section class="ds-case__column ds-case__related-copy" data-figma-frame="763:5828">
        <TypoText tag="h2" :content="page.relatedTitle" />
        <TypoText tag="p" :content="page.relatedBody" />
      </section>
      <div class="ds-case__related"><RelatedCases current-case-href="/cases/chirp-design-system" /></div>
      <div class="ds-case__footer" :style="dark ? { '--text-muted': 'var(--text-inverse)' } : undefined"><DsFooter /></div>
      <div class="ds-case__end" aria-hidden="true" />
    </div>
    <DsPageUp v-if="showPageUp" @click="scrollToStart" />
    <DsCaseImageViewer v-model:open="viewerOpen" :title="page.toolbarTitle" :content-size="galleryNativeSize">
      <DSOverview mode="viewer" />
    </DsCaseImageViewer>
  </main>
</template>

<style scoped>
.ds-case { width: 100%; --ds-page-gap: var(--space-8); background: var(--surface-default); }
.ds-case--dark { background: #1e1e1e; }
.ds-case__scene { position: relative; isolation: isolate; }
.ds-case__scene::before { content: ''; position: absolute; inset: var(--banner-height) 0 0; z-index: -1; background: var(--case-image-preview-mob); }
.ds-case--dark .ds-case__scene::before { background: #1e1e1e; }
.ds-case__hero { position: relative; outline: none; }
.ds-case__back { position: absolute; top: 0; left: 0; height: 100px; padding: var(--space-6); display: flex; align-items: center; box-sizing: border-box; z-index: 2; }
.ds-case__content { display: flex; flex-direction: column; align-items: center; gap: var(--space-8); padding: var(--space-8) 0 var(--space-12); }
.ds-case__column { width: calc(100% - 32px); max-width: var(--case-content-max); min-width: 0; }
.ds-case__toolbar { scroll-margin-top: 0; }
.ds-case__document { width: 100%; overflow-x: auto; background: #1e1e1e; color: #d4d4d4; padding-block: var(--space-3); border-radius: var(--radius-xlg); }
.ds-case__document:focus-visible { outline: 2px solid var(--border-focus); outline-offset: 2px; }
.ds-case__lines { list-style: none; margin: 0; padding: 0; width: max-content; min-width: 100%; font: var(--text-size-12)/20px ui-monospace, SFMono-Regular, Consolas, monospace; }
.ds-case__line { display: flex; min-height: 20px; }
.ds-case__line-number { flex: 0 0 4ch; text-align: right; padding-right: 2ch; color: #a0a0a0; user-select: none; }
.ds-case__line code { font: inherit; white-space: pre; padding-right: var(--space-4); }
.ds-case__syntax-key { color: #9cdcfe; }
.ds-case__syntax-string { color: #ce9178; }
.ds-case__syntax-literal { color: #b5cea8; }
.ds-case__syntax-heading { color: #dcdcaa; font-weight: 600; }
.ds-case__syntax-code { color: #ce9178; }
.ds-case__tail { display: flex; flex-direction: column; align-items: center; gap: var(--ds-page-gap); padding-top: var(--ds-page-gap); }
.ds-case__related-copy { display: flex; flex-direction: column; gap: var(--space-6); }
.ds-case__related-copy h2 { margin: 0; color: var(--accent-aubergine); font-size: var(--text-size-24); font-weight: 600; line-height: 1.25; }
.ds-case__related-copy p { margin: 0; color: var(--text-default); font-size: var(--text-size-16); line-height: 1.6; white-space: pre-line; }
.ds-case--dark .ds-case__related-copy h2, .ds-case--dark .ds-case__related-copy p { color: var(--text-inverse); }
.ds-case__related { width: 100%; max-width: 956px; box-sizing: border-box; }
.ds-case__footer { width: 100%; }
.ds-case__end { height: 98px; width: 100%; }
@media (min-width: 768px) {
  .ds-case { --ds-page-gap: var(--space-12); }
  .ds-case__related { padding-inline: var(--space-4); }
  .ds-case__related-copy h2 { font-size: var(--text-size-32); line-height: 1.2; }
}
@media (min-width: 1024px) {
  .ds-case__scene::before { background: var(--case-image-preview-web); }
  .ds-case--dark .ds-case__scene::before { background: #1e1e1e; }
}
@media (min-width: 1280px) {
  .ds-case { --ds-page-gap: var(--space-16); }
  .ds-case__related-copy h2 { font-size: var(--text-size-48); line-height: 1.2; letter-spacing: -.005em; }
  .ds-case__related-copy p { font-size: var(--text-size-20); font-weight: 300; letter-spacing: .01em; }
}

.ds-case__scene{--banner-height:var(--banner-base)}
@media(min-width:768px){.ds-case__scene{--banner-height:var(--banner-min-768)}}
@media(min-width:1024px){.ds-case__scene{--banner-height:var(--banner-min-1024)}}
@media(min-width:1280px){.ds-case__scene{--banner-height:var(--banner-min-1280)}}
@media(min-width:1440px){.ds-case__scene{--banner-height:var(--banner-min-1440)}}
@media(min-width:1920px){.ds-case__scene{--banner-height:var(--banner-min-1920)}}
</style>
