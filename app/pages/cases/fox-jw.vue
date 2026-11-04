<script setup lang="ts">
import { ref } from 'vue'
import DsBtnNav from '../../components/DsBtnNav.vue'
import DsRoleFocus from '../../components/DsRoleFocus.vue'
import DsCaseImagePreview from '../../components/DsCaseImagePreview.vue'
import DsCaseImageViewer from '../../components/DsCaseImageViewer.vue'
import DsFooter from '../../components/DsFooter.vue'
import DsPageUp from '../../components/DsPageUp.vue'
import TypoText from '../../components/TypoText.vue'
import content from '../../../content/cases/fox-jw.json'

const copy = content.page
const root = ref<HTMLElement>()
const selected = ref<(typeof copy.media)[number]>()
const viewerOpen = ref(false)
useSeoMeta({ title: content.pageTitle, description: copy.paragraphs[0] })
function openImage(media: (typeof copy.media)[number]) { selected.value = media; viewerOpen.value = true }
function scrollToStart() {
  root.value?.focus({ preventScroll: true })
  window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
}
</script>

<template>
  <main ref="root" class="fox-case" tabindex="-1" data-figma-frame="2:204">
    <div class="fox-case__back" data-figma-frame="2:229"><DsBtnNav tag="a" href="/" :aria-label="copy.backLabel" /></div>
    <section class="fox-case__opening" data-figma-frame="2:205">
      <div class="fox-case__copy" data-figma-text="2:206">
        <TypoText v-for="(paragraph, index) in copy.paragraphs" :key="index" tag="p" :content="paragraph" />
      </div>
      <DsRoleFocus class="fox-case__role" :role="copy.role" :focus="copy.focus" data-figma-frame="2:207" />
    </section>
    <section class="fox-case__media" data-figma-frame="2:208">
      <iframe class="fox-case__player" :src="copy.player.src" :title="copy.player.title"
        allow="autoplay; fullscreen; xr-spatial-tracking" allowfullscreen
        xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share
        data-figma-frame="2:421" />
      <DsCaseImagePreview v-for="media in copy.media" :key="media.id" class="fox-case__image"
        type="v2" :title="media.title" :data-figma-frame="media.id" @zoom="openImage(media)">
        <div class="fox-case__crop" :data-art="media.title"><img class="fox-case__art" :src="media.src" :alt="media.title" :width="media.width" :height="media.height" loading="lazy" decoding="async" /></div>
      </DsCaseImagePreview>
    </section>
    <div class="fox-case__ending" data-figma-frame="2:225">
      <DsFooter />
      <div class="fox-case__page-up-slot" aria-hidden="true" data-figma-frame="2:227" />
    </div>
    <DsPageUp @click="scrollToStart" />
    <DsCaseImageViewer v-if="selected" v-model:open="viewerOpen" type="v2" :title="selected.title" :content-size="{ width: 2170.829834, height: 1080 }"
      initial-scale="cover" fit-area="viewport" align-x="center" align-y="viewport-center">
      <div class="fox-case__viewer-art" :data-art="selected.title"><img :src="selected.src" :alt="selected.title" :width="selected.width" :height="selected.height" /></div>
    </DsCaseImageViewer>
  </main>
</template>

<style scoped>
.fox-case {
  position: relative; display: flex; flex-direction: column; align-items: center;
  gap: var(--space-8); padding-top: 144px; outline: none;
  background: linear-gradient(103.40247446719006deg, rgba(229,231,235,.3) 55.519%, rgba(184,221,205,.3) 85.813%), var(--surface-default);
}
.fox-case__back { position: absolute; left: 0; top: .606px; height: 100px; display: flex; align-items: center; padding: var(--space-6); box-sizing: border-box; }
.fox-case__opening { width: calc(100% - 2 * var(--space-4)); max-width: 924px; display: flex; flex-direction: column; align-items: center; gap: var(--space-8); }
.fox-case__copy { width: 100%; display: flex; flex-direction: column; gap: var(--space-8); color: var(--text-default); font-family: var(--text-font-sans); font-size: var(--text-size-16); font-weight: var(--text-weight-regular); line-height: 1.6; font-variation-settings: var(--body-16-regular-font-variation); }
.fox-case__copy :deep(p) { margin: 0; }
.fox-case__role { width: 100%; }
.fox-case__media { box-sizing: border-box; width: 100%; display: flex; flex-direction: column; align-items: center; gap: var(--space-8); padding: var(--space-4); }
.fox-case__player { display: block; width: 100%; max-width: 924px; aspect-ratio: 924 / 522.806824; border: 0; }
.fox-case__image { max-width: 924px; }
.fox-case__crop { position: relative; width: 100%; aspect-ratio: 924 / 1080; overflow: hidden; }
.fox-case__crop .fox-case__art { position: absolute; max-width: none; width: 234.727%; height: 155.37%; left: -67.3517%; top: -30.8%; }
.fox-case__crop[data-art="fox02"] .fox-case__art { left: -58.7172%; top: -33.28%; }
.fox-case__viewer-art { position: relative; width: 2170.829834px; height: 1080px; overflow: hidden; }
.fox-case__viewer-art img { position: absolute; max-width: none; width: 99.91%; height: 155.37%; left: .05%; top: -30.8%; }
.fox-case__viewer-art[data-art="fox02"] img { left: .04%; top: -33.28%; }
.fox-case__ending { width: 100%; display: flex; flex-direction: column; gap: var(--space-8); padding-top: var(--space-8); }
.fox-case__page-up-slot { height: 98px; }
@media (min-width: 768px) {
  .fox-case, .fox-case__opening, .fox-case__media, .fox-case__ending { gap: var(--space-12); }
  .fox-case__ending { padding-top: var(--space-12); }
}
@media (min-width: 1280px) {
  .fox-case { gap: var(--space-20); }
  .fox-case__copy { font-size: var(--text-size-20); font-weight: var(--text-weight-light); font-variation-settings: var(--body-20-regular-font-variation); letter-spacing: .2px; }
  .fox-case__media { gap: 144px; padding: var(--space-20); }
  .fox-case__ending { gap: var(--space-20); padding-top: var(--space-20); }
}
</style>
