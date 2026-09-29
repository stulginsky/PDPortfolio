<script setup lang="ts">
import avatarPortraitUrl from "../assets/img/avatar-portrait.jpeg";
defineEmits<{
  click: [event: MouseEvent];
}>();
</script>

<template>
  <button
    class="ds-avatar-sm"
    type="button"
    aria-label="К началу страницы"
    @click="$emit('click', $event)"
  >
    <img :src="avatarPortraitUrl" alt="" class="ds-avatar-sm__img" />
  </button>
</template>

<style scoped>
/* Avatar-Sm — DS 124:712 */
.ds-avatar-sm {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  padding: 0;
  border: 1px solid var(--border-default);
  border-radius: 60px;
  overflow: hidden;
  background: transparent;
  cursor: pointer;
  position: relative;
  box-sizing: border-box;
}

/* Figma State=Hover: 3px border stays inside the 50x50 component. */
.ds-avatar-sm:hover:not(:active) {
  border: 3px solid var(--border-action-hover);
}

/* Figma State=ActivePressed: 3px border stays inside the 50x50 component. */
.ds-avatar-sm:active {
  border: 3px solid var(--border-action-pressed);
}

/* Figma has no Focus variant; preserve visible keyboard focus without changing geometry. */
.ds-avatar-sm:focus-visible {
  outline: 3px solid var(--border-focus);
  outline-offset: 2px;
}

.ds-avatar-sm__img {
  position: absolute;
  top: -2.07px;
  left: -1.28px;
  display: block;
  width: 52.635px;
  height: 56.087px;
  max-width: none;
  object-fit: cover;
  pointer-events: none;
}

.ds-avatar-sm:hover:not(:active) .ds-avatar-sm__img,
.ds-avatar-sm:active .ds-avatar-sm__img {
  top: -4.07px;
  left: -3.28px;
}
</style>
