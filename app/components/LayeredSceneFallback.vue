<script setup lang="ts">
import './layered-scene-fallback.css'

const props = defineProps<{ name: string }>()
const widths = [1920, 1440, 1280, 1024, 768, 720, 534, 425, 410, 370] as const
const source = (width: number) => `/layered-fallbacks/${props.name}/viewport-${width}.webp`
const relatedWidths = [462, 425, 410, 370] as const
const relatedSource = (width: number) => `/layered-fallbacks/${props.name}/related-viewport-${width}.webp`
</script>

<template>
  <picture class="layered-scene-fallback layered-scene-fallback--default" data-scene-fallback aria-hidden="true">
    <source v-for="width in widths" :key="width" :media="`(min-width: ${width}px)`" :srcset="source(width)" />
    <img :src="source(320)" alt="" draggable="false" decoding="async" />
  </picture>
  <picture class="layered-scene-fallback layered-scene-fallback--related" data-scene-fallback aria-hidden="true">
    <source v-for="width in relatedWidths" :key="width" :media="`(min-width: ${width}px)`" :srcset="relatedSource(width)" />
    <img :src="source(320)" alt="" draggable="false" decoding="async" />
  </picture>
</template>
