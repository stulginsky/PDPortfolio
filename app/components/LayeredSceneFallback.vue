<script setup lang="ts">
import { siteSrcset, siteUrl } from '../utils/site-url'

import './layered-scene-fallback.css'

const props = defineProps<{ name: string }>()
const widths = [1920, 1440, 1280, 1024, 768, 720, 534, 425, 410, 370] as const
const source = (width: number) => `/layered-fallbacks/${props.name}/viewport-${width}.webp`
const relatedWidths = [462, 425, 410, 370] as const
const relatedSource = (width: number) => `/layered-fallbacks/${props.name}/related-viewport-${width}.webp`
</script>

<template>
  <picture class="layered-scene-fallback layered-scene-fallback--default" data-scene-fallback aria-hidden="true">
    <source v-for="width in widths" :key="width" :media="`(min-width: ${width}px)`" :srcset="siteSrcset(source(width))" />
    <img :src="siteUrl(source(320))" alt="" draggable="false" decoding="async" />
  </picture>
  <!-- The exporter generates related-card crops only for cards, never heroes. -->
  <picture v-if="!name.endsWith('-hero')" class="layered-scene-fallback layered-scene-fallback--related" data-scene-fallback aria-hidden="true">
    <source v-for="width in relatedWidths" :key="width" :media="`(min-width: ${width}px)`" :srcset="siteSrcset(relatedSource(width))" />
    <img :src="siteUrl(source(320))" alt="" draggable="false" decoding="async" />
  </picture>
</template>
