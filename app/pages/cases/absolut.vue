<script setup lang="ts">
import { siteUrl } from '../../utils/site-url'

import { ref } from 'vue'
import DsBtnNav from '../../components/DsBtnNav.vue'
import DsRoleFocus from '../../components/DsRoleFocus.vue'
import DsCaseImagePreview from '../../components/DsCaseImagePreview.vue'
import DsCaseImageViewer from '../../components/DsCaseImageViewer.vue'
import DsFooter from '../../components/DsFooter.vue'
import DsPageUp from '../../components/DsPageUp.vue'
import TypoText from '../../components/TypoText.vue'
import content from '../../../content/cases/absolut.json'

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
  <main ref="root" class="absolut-case" tabindex="-1" data-figma-frame="14:6723">
    <div class="absolut-case__back" data-figma-frame="45:114"><DsBtnNav tag="a" :href="siteUrl('/')" :aria-label="copy.backLabel" /></div>
    <section class="absolut-case__opening" data-figma-frame="14:6727">
      <div class="absolut-case__copy" data-figma-text="14:6728">
        <TypoText v-for="(paragraph, index) in copy.paragraphs" :key="index" tag="p" :content="paragraph" />
      </div>
      <DsRoleFocus class="absolut-case__role" :role="copy.role" :focus="copy.focus" data-figma-frame="14:6729" />
    </section>
    <section class="absolut-case__posters" data-figma-frame="14:6735">
      <DsCaseImagePreview v-for="(media, index) in copy.media" :key="media.id" class="absolut-case__poster"
        type="v2" :title="media.title" :data-figma-frame="media.id" @zoom="openImage(media)">
        <img :src="siteUrl(media.src)" :alt="media.title" :width="media.width" :height="media.height"
          :loading="index === 0 ? 'eager' : 'lazy'" :fetchpriority="index === 0 ? 'high' : 'auto'" decoding="async" />
      </DsCaseImagePreview>
    </section>
    <div class="absolut-case__ending" data-figma-frame="14:6870">
      <DsFooter />
      <div class="absolut-case__page-up-slot" aria-hidden="true" data-figma-frame="14:6878" />
    </div>
    <DsPageUp @click="scrollToStart" />
    <DsCaseImageViewer v-if="selected" v-model:open="viewerOpen" type="v2" :title="selected.title"
      :initial-scale="{ base: 'fit-screen', 'min-768': 'fit-height' }"
      :align-y="{ base: 'viewport-center', 'min-768': 'top' }"
      fit-area="viewport">
      <img :src="siteUrl(selected.src)" :alt="selected.title" :width="selected.width" :height="selected.height" />
    </DsCaseImageViewer>
  </main>
</template>

<style scoped>
.absolut-case {
  display: flex; flex-direction: column; align-items: center; gap: var(--space-8);
  position: relative; padding-top: 144px; outline: none;
  background: linear-gradient(98.61515668712278deg, rgba(229,231,235,.3) 55.519%, rgba(184,221,205,.3) 85.813%), var(--surface-default);
}
.absolut-case__back { position: absolute; left: 0; top: .606px; height: 100px; display: flex; align-items: center; padding: var(--space-6); box-sizing: border-box; }
.absolut-case__opening { width: calc(100% - 2 * var(--space-4)); max-width: 924px; display: flex; flex-direction: column; align-items: center; gap: var(--space-8); }
.absolut-case__copy { width: 100%; display: flex; flex-direction: column; gap: var(--space-6); color: var(--text-default); font-family: var(--text-font-sans); font-size: var(--text-size-16); font-weight: var(--text-weight-regular); line-height: 1.6; font-variation-settings: var(--body-16-regular-font-variation); }
.absolut-case__copy :deep(p) { margin: 0; }
.absolut-case__role { width: 100%; max-width: 924px; }
.absolut-case__posters { box-sizing: border-box; width: 100%; display: flex; flex-direction: column; align-items: center; gap: var(--space-8); padding: var(--space-4); }
.absolut-case__poster { max-width: 924px; }
.absolut-case__ending { width: 100%; display: flex; flex-direction: column; gap: var(--space-8); padding-top: var(--space-8); }
.absolut-case__page-up-slot { height: 98px; }
@media (min-width: 768px) {
  .absolut-case, .absolut-case__opening, .absolut-case__posters, .absolut-case__ending { gap: var(--space-12); }
  .absolut-case__ending { padding-top: var(--space-12); }
}
@media (min-width: 1280px) {
  .absolut-case { gap: var(--space-20); }
  .absolut-case__copy { font-size: var(--text-size-20); font-weight: var(--text-weight-light); font-variation-settings: var(--body-20-regular-font-variation); letter-spacing: .2px; gap: var(--space-8); }
  .absolut-case__posters { gap: 144px; padding: var(--space-20); }
  .absolut-case__ending { gap: var(--space-20); padding-top: var(--space-20); }
}
</style>
