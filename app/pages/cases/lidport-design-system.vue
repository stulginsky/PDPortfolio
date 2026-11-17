<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { siteUrl } from '../../utils/site-url'
import LIDPortDsHero from '../../components/LIDPortDsHero.vue'
import DsImgTitleToolbar from '../../components/DsImgTitleToolbar.vue'
import DsBtnNav from '../../components/DsBtnNav.vue'
import DsFooter from '../../components/DsFooter.vue'
import DsPageUp from '../../components/DsPageUp.vue'
import TypoText from '../../components/TypoText.vue'
import content from '../../../content/cases/lidport-design-system.json'
import foundation from '../../../content/documents/lidport-design-system/foundation.md?raw'
import tokens from '../../../content/documents/lidport-design-system/tokens.json?raw'
import '../../assets/styles/lidport-overview-tokens.css'

const page = content.page
const text = (id: keyof typeof page.nodes) => page.nodes[id]
const facts = [['4:1381','4:1382'],['4:1384','4:1385'],['4:1387','4:1388'],['4:1390','4:1391']] as const
const navigation = [['4:1400','4:1401','4:1402'],['4:1404','4:1405','4:1406'],['4:1408','4:1409','4:1410'],['30:1121','30:1122','30:1123']] as const
const link = (id: string) => content.source.textNodes.find(node => node.id === id)?.hyperlink?.value
useSeoMeta({ title: content.pageTitle, description: content.hero.focus })
type Tab = 'overview' | 'foundation' | 'tokens'
const tab = ref<Tab>('overview')
const toolbarSelection = ref<Tab | null>(null)
const dark = computed(() => tab.value !== 'overview')
const start = ref<HTMLElement>()
const toolbar = ref<HTMLElement>()
const documentBox = ref<HTMLElement>()
const showPageUp = ref(false)
let observer: IntersectionObserver | undefined
onMounted(() => {
  observer = new IntersectionObserver(([entry]) => {
    if (entry) showPageUp.value = entry.boundingClientRect.bottom <= 0
  })
  if (start.value) observer.observe(start.value)
})
onUnmounted(() => observer?.disconnect())
async function selectTab(value: Tab) {
  toolbarSelection.value = value
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
// Same document rendering as Chirp: preserve source bytes, add syntax spans only.
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
      const value = match[0]
      const kind = tab.value === 'tokens'
        ? value.startsWith('"') ? /^\s*:/.test(line.slice(match.index! + value.length)) ? 'key' : 'string' : 'literal'
        : value.startsWith('#') ? 'heading' : 'code'
      parts.push({ text: value, kind })
      offset = match.index! + value.length
    }
    if (offset < line.length) parts.push({ text: line.slice(offset), kind: 'plain' })
    return parts
  })
})
</script>

<template>
  <main class="lidport-case" :class="{ 'lidport-case--dark': dark }">
    <div class="lidport-case__scene" data-figma-frame="3:1078">
      <div ref="start" class="lidport-case__hero" tabindex="-1">
        <LIDPortDsHero v-bind="content.hero" :panel-appearance="dark ? 'on-dark' : 'on-light'" />
        <div class="lidport-case__back"><DsBtnNav tag="a" :href="siteUrl('/')" :aria-label="page.backLabel" /></div>
      </div>
      <section class="lidport-case__content" data-figma-frame="3:1080">
        <div ref="toolbar" class="lidport-case__column lidport-case__toolbar">
          <DsImgTitleToolbar v-model="toolbarSelection" :title="page.toolbarTitle" :show-zoom="false" :figma-href="page.figmaHref" @select="selectTab" />
        </div>
        <div class="lidport-case__column">
          <article v-if="tab === 'overview'" class="lidport-overview" data-figma-frame="4:1347" :aria-label="text('4:1356')">
            <header class="lidport-overview__header" data-figma-frame="4:1349">
              <TypoText tag="p" class="lidport-overview__caption" :content="text('4:1351')" />
              <div class="lidport-overview__rule" aria-hidden="true" />
              <div class="lidport-overview__intro">
                <div class="lidport-overview__title"><TypoText tag="h2" :content="text('4:1356')" /><TypoText tag="p" class="lidport-overview__caption" :content="text('4:1357')" /></div>
                <TypoText tag="p" class="lidport-overview__lead" :content="text('4:1358')" />
              </div>
            </header>
            <div class="lidport-overview__previews" data-figma-frame="4:1359">
              <section class="lidport-overview__preview" data-figma-frame="4:1360">
                <TypoText tag="h3" class="lidport-overview__preview-title" :content="text('4:1361')" />
                <TypoText tag="p" class="lidport-overview__sample-heading" :content="text('4:1362')" />
                <TypoText tag="p" class="lidport-overview__lead" :content="text('4:1363')" />
              </section>
              <section class="lidport-overview__preview" data-figma-frame="4:1364">
                <TypoText tag="h3" class="lidport-overview__preview-title" :content="text('4:1365')" />
                <TypoText tag="p" class="lidport-overview__sample-button" :content="text('I4:1366;74:4962')" />
                <TypoText tag="p" class="lidport-overview__sample-badge" :content="text('I4:1367;292:5899')" />
                <TypoText tag="p" :content="text('4:1368')" />
              </section>
              <section class="lidport-overview__preview" data-figma-frame="4:1369">
                <TypoText tag="h3" class="lidport-overview__preview-title" :content="text('4:1370')" />
                <div class="lidport-overview__swatches" aria-hidden="true"><span v-for="name in ['neutral-950','slate-700','slate-500','neutral-300','orange-700','orange-800']" :key="name" :style="{background: `var(--lidport-color-palette-${name})`}" /></div>
                <TypoText tag="p" :content="text('4:1378')" />
              </section>
            </div>
            <div class="lidport-overview__facts" data-figma-frame="4:1379">
              <div v-for="[value,label] in facts" :key="value" class="lidport-overview__fact">
                <TypoText tag="p" class="lidport-overview__sample-heading" :content="text(value)" />
                <TypoText tag="p" :content="text(label)" />
              </div>
            </div>
            <section class="lidport-overview__section" data-figma-frame="4:1392">
              <header class="lidport-overview__section-heading">
                <TypoText tag="p" class="lidport-overview__index" :content="text('4:1394')" />
                <div class="lidport-overview__section-copy"><TypoText tag="h3" :content="text('4:1396')" /><TypoText tag="p" :content="text('4:1397')" /></div>
              </header>
              <div class="lidport-overview__navigation">
                <section v-for="[title,body,action] in navigation" :key="title" class="lidport-overview__navigation-card">
                  <div class="lidport-overview__navigation-copy"><TypoText tag="h3" :content="text(title)" /><TypoText tag="p" :content="text(body)" /></div>
                  <a v-if="link(action)" :href="link(action)" target="_blank" rel="noopener noreferrer" :aria-label="text(title) + ' — ' + text(action)"><TypoText :content="text(action)" /></a>
                  <TypoText v-else tag="p" class="lidport-overview__soon" :content="text(action)" />
                </section>
              </div>
            </section>
            <section class="lidport-overview__section" data-figma-frame="4:1411">
              <header class="lidport-overview__section-heading"><TypoText tag="p" class="lidport-overview__index" :content="text('4:1413')" /><div class="lidport-overview__section-copy"><TypoText tag="h3" :content="text('4:1415')" /><TypoText tag="p" :content="text('4:1416')" /></div></header>
              <TypoText tag="p" :content="text('4:1417')" />
            </section>
            <div class="lidport-overview__divider" aria-hidden="true" />
            <TypoText tag="p" class="lidport-overview__caption" :content="text('4:1419')" />
          </article>
          <div v-else :key="tab" ref="documentBox" class="lidport-case__document" role="region" :aria-label="documentName" tabindex="0">
            <ol class="lidport-case__lines"><li v-for="(parts, index) in documentLines" :key="index" class="lidport-case__line">
              <span class="lidport-case__line-number" aria-hidden="true">{{ index + 1 }}</span>
              <code><span v-for="(part, partIndex) in parts" :key="partIndex" :class="'lidport-case__syntax-' + part.kind">{{ part.text }}</span></code>
            </li></ol>
          </div>
        </div>
      </section>
    </div>
    <div class="lidport-case__tail" data-figma-frame="3:1118">
      <DsFooter :style="dark ? { '--text-muted': 'var(--text-inverse)' } : undefined" />
      <div class="lidport-case__end" aria-hidden="true" />
    </div>
    <DsPageUp v-if="showPageUp" @click="scrollToStart" />
  </main>
</template>

<style scoped>
@font-face { font-family:'LADA Pragmatica'; src:url('../../assets/fonts/lada-pragmatica.woff2') format('woff2'); font-weight:400; font-style:normal; font-display:swap; }
@font-face { font-family:'LADA Pragmatica'; src:url('../../assets/fonts/lada-pragmatica-4.woff2') format('woff2'); font-weight:700; font-style:normal; font-display:swap; }
.lidport-case { width:100%; background:var(--surface-default); }
.lidport-case__scene { background:#f0efea; }
.lidport-case--dark,.lidport-case--dark .lidport-case__scene { background:#1e1e1e; }
.lidport-case__hero { position:relative; outline:none; }
.lidport-case__back { position:absolute; top:0; left:0; height:100px; padding:var(--space-6); display:flex; align-items:center; box-sizing:border-box; z-index:2; }
.lidport-case__content { display:flex; flex-direction:column; align-items:center; gap:0; margin-top:var(--space-8); padding:var(--space-4) 0 var(--space-8); }
.lidport-case__column { width:calc(100% - 32px); max-width:var(--case-content-max); min-width:0; }
.lidport-case__document { width:100%; overflow-x:auto; background:#1e1e1e; color:#d4d4d4; padding-block:var(--space-3); border-radius:var(--radius-xlg); }
.lidport-case__document:focus-visible { outline:2px solid var(--border-focus); outline-offset:2px; }
.lidport-case__lines { list-style:none; margin:0; padding:0; width:max-content; min-width:100%; font:var(--text-size-12)/20px ui-monospace,SFMono-Regular,Consolas,monospace; }
.lidport-case__line { display:flex; min-height:20px; }
.lidport-case__line-number { flex:0 0 4ch; text-align:right; padding-right:2ch; color:#a0a0a0; user-select:none; }
.lidport-case__line code { font:inherit; white-space:pre; padding-right:var(--space-4); }
.lidport-case__syntax-key { color:#9cdcfe; }.lidport-case__syntax-string,.lidport-case__syntax-code { color:#ce9178; }.lidport-case__syntax-literal { color:#b5cea8; }.lidport-case__syntax-heading { color:#dcdcaa; font-weight:600; }
.lidport-case__tail { display:flex; flex-direction:column; align-items:center; gap:var(--space-16); padding-block:var(--space-16); margin-top:10px; }
.lidport-case__end { height:98px; width:100%; }
.lidport-overview { display:flex; flex-direction:column; gap:var(--space-12); padding-block:var(--space-12); min-width:0; font-family:var(--text-font-sans); font-size:14px; font-weight:400; line-height:19.6px; letter-spacing:0; color:var(--lidport-color-text-secondary); }
.lidport-overview,.lidport-overview * { box-sizing:border-box; }
.lidport-overview :is(p,h2,h3) { margin:0; min-width:0; letter-spacing:0; }
.lidport-overview h2,.lidport-overview__sample-heading { font-family:var(--lidport-typography-heading-h1-font-family); font-size:var(--lidport-typography-heading-h1-font-size); font-weight:var(--lidport-typography-heading-h1-font-weight); line-height:var(--lidport-typography-heading-h1-line-height); text-box-trim:trim-both; text-box-edge:cap alphabetic; color:var(--lidport-color-text-primary); }
.lidport-overview__header { display:flex; flex-direction:column; gap:var(--space-6); }
.lidport-overview__caption { font-size:12px; line-height:16.8px; white-space:pre-wrap; }
.lidport-overview__rule { height:4px; background:var(--lidport-color-button-accent-brand-background-default); }
.lidport-overview__intro { display:flex; flex-direction:column; gap:var(--space-8); }
.lidport-overview__title { display:flex; flex-direction:column; gap:var(--space-3); min-width:0; }
.lidport-overview__lead { font-size:16px; line-height:24px; }
.lidport-overview__previews { display:grid; grid-template-columns:minmax(0,1fr); gap:var(--space-6); }
.lidport-overview__preview { display:flex; flex-direction:column; align-items:flex-start; gap:var(--space-6); padding:var(--space-6); background:var(--lidport-color-background-subtle); border-radius:var(--radius-lg); }
.lidport-overview__preview-title { width:100%; font-size:16px; line-height:24px; font-weight:500; color:var(--lidport-color-text-primary); }
.lidport-overview__sample-button,.lidport-overview__sample-badge { display:flex; align-items:center; justify-content:center; min-height:40px; flex:none; font-size:16px; font-weight:500; }
.lidport-overview__sample-button { padding:12px 16px; line-height:16px; background:var(--lidport-color-button-accent-brand-background-default); color:var(--lidport-color-button-text-inverse); border-radius:8px; }
.lidport-overview__sample-badge { padding-inline:20px; line-height:24px; background:var(--lidport-color-status-info-subtle); border-radius:12px; }
.lidport-overview__swatches { display:flex; width:100%; gap:var(--space-2); }
.lidport-overview__swatches span { flex:1; min-width:0; height:48px; border-radius:8px; }
.lidport-overview__facts { display:grid; grid-template-columns:minmax(0,1fr); gap:var(--space-6); }
.lidport-overview__fact { display:flex; flex-direction:column; gap:var(--space-3); min-width:0; }
.lidport-overview__fact > p:last-child { white-space:pre-line; }
.lidport-overview__section { display:flex; flex-direction:column; gap:var(--space-6); }
.lidport-overview__section-heading { display:flex; gap:var(--space-6); align-items:flex-start; }
.lidport-overview__index { flex:0 0 48px; font-size:16px; line-height:24px; font-weight:500; color:var(--lidport-color-button-accent-brand-background-default); }
.lidport-overview__section-copy { display:flex; flex-direction:column; gap:var(--space-2); min-width:0; flex:1; }
.lidport-overview__section h3 { font-family:var(--lidport-typography-heading-h2-font-family); font-size:var(--lidport-typography-heading-h2-font-size); font-weight:var(--lidport-typography-heading-h2-font-weight); line-height:var(--lidport-typography-heading-h2-line-height); text-box-trim:trim-both; text-box-edge:cap alphabetic; color:var(--lidport-color-text-primary); }
.lidport-overview__navigation { display:grid; grid-template-columns:minmax(0,1fr); gap:var(--space-6); }
.lidport-overview__navigation-card { display:flex; flex-direction:column; justify-content:space-between; gap:var(--space-4); padding:var(--space-6); min-height:176px; background:var(--lidport-color-background-subtle); border-radius:var(--radius-lg); min-width:0; }
.lidport-overview__navigation-copy { display:flex; flex-direction:column; gap:var(--space-4); }
.lidport-overview a,.lidport-overview__soon { color:var(--lidport-color-button-accent-brand-background-default); }
.lidport-overview a { --link-color:var(--lidport-color-button-accent-brand-background-default); color:var(--link-color); text-decoration:none; transition:color 150ms ease-out; }
.lidport-overview a:hover { color:hsl(from var(--link-color) h s calc(l - 12)); }
.lidport-overview a:focus-visible { outline:2px solid currentColor; outline-offset:4px; }
@media(prefers-reduced-motion:reduce) { .lidport-overview a { transition:none; } }
.lidport-overview__divider { height:1px; background:var(--lidport-color-border-subtle); }
@media(min-width:768px) { .lidport-case__content { gap:var(--space-8); padding:0 0 var(--space-12); } }
@media(min-width:768px) { .lidport-overview__intro { flex-direction:row; }.lidport-overview__intro > * { flex:1; min-width:0; }.lidport-overview__previews { grid-template-columns:repeat(3,minmax(0,1fr)); } }
@media(min-width:768px) { .lidport-overview { padding-block:0; }.lidport-overview__facts { grid-template-columns:repeat(4,minmax(0,1fr)); }.lidport-overview__navigation { grid-template-columns:repeat(3,minmax(0,1fr)); }.lidport-overview__previews { min-height:264px; } }
@media(min-width:1280px) { .lidport-overview__navigation { grid-template-columns:repeat(4,minmax(0,1fr)); } }
@media(min-width:1280px) { .lidport-overview__header { min-height:141px; }.lidport-overview__facts { min-height:74px; }.lidport-overview [data-figma-frame='4:1392'] { min-height:265px; }.lidport-overview [data-figma-frame='4:1411'] { min-height:109px; }.lidport-overview > .lidport-overview__caption { min-height:17px; } }
</style>
