<script setup lang="ts">
defineProps<{ href: string; ariaLabel: string }>()
defineEmits<{ click: [event: MouseEvent] }>()
</script>

<template>
  <a class="ds-coming-soon" :href="href" target="_blank" rel="noopener noreferrer" :aria-label="ariaLabel" @click="$emit('click', $event)">
    <img src="/showcase/dc-picker-app-ux/coming-soon.png" width="98" height="98" alt="" draggable="false" />
  </a>
</template>

<style scoped>
.ds-coming-soon {
  display: block;
  width: 98px;
  height: 98px;
  border-radius: 0 var(--radius-xlg) 0 var(--radius-lg);
  cursor: pointer;
  filter: drop-shadow(0 0 0 transparent);
  transition: filter 300ms ease-out;
  -webkit-tap-highlight-color: transparent;
}
.ds-coming-soon img { display: block; width: 100%; height: 100%; pointer-events: none; }
@media (hover: hover) {
  .ds-coming-soon:hover { filter: drop-shadow(3.023749px 6.047498px 14.362808px var(--effect-shadow-1st)); transition-duration: 150ms; }
}
.ds-coming-soon:active { filter: drop-shadow(0 0 0 transparent); transition-duration: 0ms; }
.ds-coming-soon:focus-visible { outline: 2px solid var(--border-focus); outline-offset: -3px; }
@media (prefers-reduced-motion: reduce) { .ds-coming-soon { transition: none; } }
</style>
