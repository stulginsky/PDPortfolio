<script setup lang="ts">
defineProps<{
  title: string;
  src: string;
  alt: string;
  openLabel: string;
}>();

const emit = defineEmits<{
  open: [];
}>();
</script>

<template>
  <figure class="case-media-frame">
    <figcaption class="case-media-frame__header">
      <TypoText :content="title" tag="p" />
      <button type="button" class="icon-button" :aria-label="openLabel.replace('{title}', title)" @click="emit('open')">
        <img src="/cases/chirp-product/media/magnifying-glass.svg" alt="" aria-hidden="true">
      </button>
    </figcaption>
    <img class="case-media-frame__image" :src="src" :alt="alt">
  </figure>
</template>

<style scoped>
.case-media-frame { width: 100%; margin: var(--case-flow-gap) 0 0; padding: var(--space-4) var(--case-page-x) var(--space-8); background: linear-gradient(137.481deg, var(--gray-200) 41.653%, #b8ddcd 99.224%), var(--gray-200); }
.case-media-frame__header { display: flex; min-height: 66px; max-width: var(--case-content-max); align-items: center; justify-content: space-between; gap: var(--space-4); margin: 0 auto var(--space-6); }
.case-media-frame__header p { margin: 0; color: var(--text-muted); font-size: var(--text-size-lg); font-weight: var(--text-weight-semibold); font-variation-settings: var(--font-variation-heading-xl-semibold); line-height: 1.45; }
.case-media-frame__header img { width: 24px; height: 24px; }
.case-media-frame__image { display: block; width: 100%; max-width: var(--case-content-max); height: auto; margin-inline: auto; }
@media (min-width: 1280px) { .case-media-frame { padding-top: var(--space-8); padding-bottom: var(--space-12); } .case-media-frame__header { min-height: 74px; margin-bottom: var(--space-8); } .case-media-frame__header p { font-size: var(--text-size-xl); line-height: 1.3; } }
</style>
