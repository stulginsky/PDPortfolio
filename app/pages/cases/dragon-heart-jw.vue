<script setup lang="ts">
import { ref } from 'vue'
import DsBtnNav from '../../components/DsBtnNav.vue'
import DsRoleFocus from '../../components/DsRoleFocus.vue'
import DsCaseImagePreview from '../../components/DsCaseImagePreview.vue'
import DsCaseImageViewer from '../../components/DsCaseImageViewer.vue'
import DsFooter from '../../components/DsFooter.vue'
import DsPageUp from '../../components/DsPageUp.vue'
import TypoText from '../../components/TypoText.vue'
import content from '../../../content/cases/dragon-heart-jw.json'

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
  <main ref="root" class="dragon-heart-case" tabindex="-1" data-figma-frame="7:191">
    <div class="dragon-heart-case__back" data-figma-frame="7:209"><DsBtnNav tag="a" href="/" :aria-label="copy.backLabel" /></div>
    <section class="dragon-heart-case__opening" data-figma-frame="7:192">
      <div class="dragon-heart-case__copy" data-figma-text="7:193">
        <TypoText v-for="(paragraph, index) in copy.paragraphs" :key="index" tag="p" :content="paragraph" />
      </div>
      <DsRoleFocus class="dragon-heart-case__role" :role="copy.role" :focus="copy.focus" data-figma-frame="7:194" />
    </section>
    <section class="dragon-heart-case__media" data-figma-frame="7:195">
      <video class="dragon-heart-case__video" :src="copy.video.src" controls playsinline preload="metadata"
        :aria-label="copy.video.title" width="848" height="480" data-figma-frame="7:294">
        <a :href="copy.video.src"><TypoText :content="copy.video.fallback" /></a>
      </video>
      <DsCaseImagePreview v-for="media in copy.media" :key="media.id" class="dragon-heart-case__image"
        type="v2" :title="media.title" :data-figma-frame="media.id" @zoom="openImage(media)">
        <img class="dragon-heart-case__art" :src="media.src" :alt="media.title" :width="media.width" :height="media.height" loading="lazy" decoding="async" />
      </DsCaseImagePreview>
    </section>
    <div class="dragon-heart-case__ending" data-figma-frame="7:205">
      <DsFooter />
      <div class="dragon-heart-case__page-up-slot" aria-hidden="true" data-figma-frame="7:207" />
    </div>
    <DsPageUp @click="scrollToStart" />
    <DsCaseImageViewer v-if="selected" v-model:open="viewerOpen" type="v2" :title="selected.title"
      initial-scale="cover" fit-area="viewport" align-x="center" align-y="viewport-center">
      <img :src="selected.src" :alt="selected.title" :width="selected.width" :height="selected.height" />
    </DsCaseImageViewer>
  </main>
</template>

<style scoped>
.dragon-heart-case {
  position: relative; display: flex; flex-direction: column; align-items: center;
  gap: var(--space-8); padding-top: 144px; outline: none;
  background: linear-gradient(104.06290034526089deg, rgba(229,231,235,.3) 55.519%, rgba(184,221,205,.3) 85.813%), var(--surface-default);
}
.dragon-heart-case__back { position: absolute; left: 0; top: .606px; height: 100px; display: flex; align-items: center; padding: var(--space-6); box-sizing: border-box; }
.dragon-heart-case__opening { width: calc(100% - 2 * var(--space-4)); max-width: 924px; display: flex; flex-direction: column; align-items: center; gap: var(--space-8); }
.dragon-heart-case__copy { width: 100%; display: flex; flex-direction: column; gap: var(--space-8); color: var(--text-default); font-family: var(--text-font-sans); font-size: var(--text-size-16); font-weight: var(--text-weight-regular); line-height: 1.6; font-variation-settings: var(--body-16-regular-font-variation); }
.dragon-heart-case__copy :deep(p) { margin: 0; }
.dragon-heart-case__role { width: 100%; }
.dragon-heart-case__media { box-sizing: border-box; width: 100%; display: flex; flex-direction: column; align-items: center; gap: var(--space-8); padding: var(--space-4); }
.dragon-heart-case__video { display: block; width: 100%; max-width: 924px; height: auto; aspect-ratio: 924 / 522.688782; object-fit: contain; background: #000; }
.dragon-heart-case__image { max-width: 924px; }
.dragon-heart-case__art { width: 100%; aspect-ratio: 1218 / 783; object-fit: cover; }
.dragon-heart-case__ending { width: 100%; display: flex; flex-direction: column; gap: var(--space-8); padding-top: var(--space-8); }
.dragon-heart-case__page-up-slot { height: 98px; }
@media (min-width: 768px) {
  .dragon-heart-case, .dragon-heart-case__opening, .dragon-heart-case__media, .dragon-heart-case__ending { gap: var(--space-12); }
  .dragon-heart-case__ending { padding-top: var(--space-12); }
}
@media (min-width: 1280px) {
  .dragon-heart-case { gap: var(--space-20); }
  .dragon-heart-case__copy { font-size: var(--text-size-20); font-weight: var(--text-weight-light); font-variation-settings: var(--body-20-regular-font-variation); letter-spacing: .2px; }
  .dragon-heart-case__media { gap: 144px; padding: var(--space-20); }
  .dragon-heart-case__ending { gap: var(--space-20); padding-top: var(--space-20); }
}
</style>
