<script setup lang="ts">
import arrowNavUp from "~/assets/icons/arrow-nav-up.svg?raw";

defineProps<{ visible: boolean }>();

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
</script>

<template>
  <button
    type="button"
    class="scroll-to-top-button"
    :class="{ 'scroll-to-top-button--visible': visible }"
    aria-label="Наверх"
    @click="scrollToTop"
  >
    <span
      class="scroll-to-top-button__icon"
      aria-hidden="true"
      v-html="arrowNavUp"
    />
  </button>
</template>

<style scoped>
.scroll-to-top-button {
  position: fixed;
  z-index: 20;
  right: var(--space-6);
  bottom: var(--space-6);
  display: grid;
  width: 50px;
  height: 50px;
  padding: 10px;
  border: 0;
  border-radius: var(--radius-xxlg);
  background: var(--surface-raised);
  color: var(--text-default);
  box-sizing: border-box;
  cursor: pointer;
  place-items: center;
  pointer-events: none;
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 180ms ease, transform 180ms ease;
}

.scroll-to-top-button--visible {
  pointer-events: auto;
  opacity: 1;
  transform: translateY(0);
}

.scroll-to-top-button__icon {
  display: block;
  width: 24px;
  height: 24px;
  line-height: 0;
}

.scroll-to-top-button__icon :deep(svg) {
  display: block;
  width: 24px;
  height: 24px;
}

.scroll-to-top-button__icon :deep(path) {
  fill: currentColor;
}

@media (hover: hover) and (pointer: fine) {
  .scroll-to-top-button:hover { background: var(--surface-action-hover); }
}

.scroll-to-top-button:active {
  background: var(--surface-action-pressed);
  color: var(--text-inverse);
}

@media (max-width: 720px) {
  .scroll-to-top-button { right: var(--space-4); bottom: var(--space-4); }
}

@media (prefers-reduced-motion: reduce) {
  .scroll-to-top-button { transition: none; }
}
</style>
