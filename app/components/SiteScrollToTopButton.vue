<script setup lang="ts">
import arrowUpUrl from "~/assets/icons/arrow-up-nav.svg";
import arrowUpPressedUrl from "~/assets/icons/arrow-up-nav-pressed.svg";

defineProps<{ visible: boolean }>();

const isPressed = ref(false);

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
</script>

<template>
  <button
    type="button"
    class="scroll-to-top-button"
    :class="{
      'scroll-to-top-button--visible': visible,
      'scroll-to-top-button--pressed': isPressed,
    }"
    aria-label="Наверх"
    @pointerdown="isPressed = true"
    @pointerup="isPressed = false"
    @pointercancel="isPressed = false"
    @pointerleave="isPressed = false"
    @click="scrollToTop"
  >
    <img :src="isPressed ? arrowUpPressedUrl : arrowUpUrl" alt="" width="24" height="24">
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

.scroll-to-top-button img {
  display: block;
  width: 24px;
  height: 24px;
  transform: scaleY(-1);
}

@media (hover: hover) and (pointer: fine) {
  .scroll-to-top-button:hover { background: var(--surface-action-hover); }
}

.scroll-to-top-button:active,
.scroll-to-top-button--pressed { background: var(--surface-action-pressed); }

@media (max-width: 720px) {
  .scroll-to-top-button { right: var(--space-4); bottom: var(--space-4); }
}

@media (prefers-reduced-motion: reduce) {
  .scroll-to-top-button { transition: none; }
}
</style>
