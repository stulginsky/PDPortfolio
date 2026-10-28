<script setup lang="ts">
import { vMediaReady } from './media-readiness'
import DsImgTitle from './DsImgTitle.vue'
import DsImgTitleToolbar from './DsImgTitleToolbar.vue'

type DocumentValue = 'overview' | 'foundation' | 'tokens'

const props = withDefaults(defineProps<{
  /** Image heading; wraps when it exceeds the available panel width. */
  title?: string
  /** Existing heading panel (v1) or centered image-only zoom overlay (v2). */
  type?: 'v1' | 'v2'
  /** Figma Instance swap: use exactly one of the two accepted panels. */
  instance?: 'ImgTitle' | 'ImgTitleToolbar'
  /** Toolbar-only zoom visibility. ImgTitle always includes zoom. */
  showZoom?: boolean
  /** Selected toolbar document; undefined allows the panel's internal state. */
  modelValue?: DocumentValue | null
}>(), { title: 'Value', type: 'v1', instance: 'ImgTitle', showZoom: true, modelValue: undefined })

const emit = defineEmits<{
  /** Request opening the viewer. The media itself is not a trigger. */
  zoom: [event: MouseEvent]
  select: [value: DocumentValue]
  'update:modelValue': [value: DocumentValue]
}>()

defineSlots<{
  /** Media with intrinsic dimensions and an accessible alternative. */
  default(): unknown
}>()
</script>

<template>
  <section class="ds-case-image-preview" :class="{ 'ds-case-image-preview--v2': props.type === 'v2' }" :aria-label="props.title">
    <div v-if="props.type === 'v1'" class="ds-case-image-preview__panel">
      <DsImgTitle
        v-if="props.instance === 'ImgTitle'"
        :title="props.title"
        @zoom="emit('zoom', $event)"
      />
      <DsImgTitleToolbar
        v-else
        :title="props.title"
        :show-zoom="props.showZoom"
        :model-value="props.modelValue"
        @zoom="emit('zoom', $event)"
        @select="emit('select', $event)"
        @update:model-value="emit('update:modelValue', $event)"
      />
    </div>
    <div v-media-ready class="ds-case-image-preview__media media-skeleton">
      <slot />
    </div>
    <DsImgTitle v-if="props.type === 'v2'" class="ds-case-image-preview__overlay" :title="props.title" btn-only @zoom="emit('zoom', $event)" />
  </section>
</template>

<style scoped>
.ds-case-image-preview {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: var(--space-4) var(--space-4) var(--space-8);
  gap: var(--space-6);
}

.ds-case-image-preview__panel,
.ds-case-image-preview__media {
  width: 100%;
  max-width: 924px;
  min-width: 0;
}

.ds-case-image-preview__media {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Native image layout measures intrinsic dimensions; no upscale or fixed height. */
.ds-case-image-preview__media :deep(img),
.ds-case-image-preview__media :deep(svg),
.ds-case-image-preview__media :deep(video) {
  display: block;
  max-width: 100%;
  height: auto;
  flex: 0 1 auto;
}

.ds-case-image-preview__media :deep(picture) {
  display: block;
  max-width: 100%;
}

@media (min-width: 1024px) {
  .ds-case-image-preview {
    padding: var(--space-8) 0 var(--space-12);
    gap: var(--space-8);
  }
}
.ds-case-image-preview.ds-case-image-preview--v2 {
  position: relative;
  padding: 0;
  gap: 0;
  overflow: hidden;
}
.ds-case-image-preview--v2 .ds-case-image-preview__media { max-width: none; }
.ds-case-image-preview__overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
}
</style>
