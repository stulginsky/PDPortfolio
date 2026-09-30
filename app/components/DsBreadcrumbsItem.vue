<script setup lang="ts">
import dotIcon from '../assets/icons/dot.svg'

withDefaults(
  defineProps<{
    /** Visible label of a single hierarchy step. */
    label: string
    /** Keeps the Figma separator after this item. */
    showDot?: boolean
    /** Marks the current, non-interactive hierarchy step. */
    current?: boolean
  }>(),
  {
    showDot: true,
    current: false,
  },
)

defineEmits<{
  click: []
}>()
</script>

<template>
  <span class="ds-breadcrumbs-item" :class="{ 'ds-breadcrumbs-item--current': current }">
    <span v-if="current" class="ds-breadcrumbs-item__label" aria-current="page">{{ label }}</span>
    <button v-else class="ds-breadcrumbs-item__label" type="button" @click="$emit('click')">{{ label }}</button>
    <span
      v-if="showDot"
      class="ds-breadcrumbs-item__dot"
      :style="{ '--ds-breadcrumbs-item-dot-mask': `url(&quot;${dotIcon}&quot;)` }"
      aria-hidden="true"
    />
  </span>
</template>

<style scoped>
.ds-breadcrumbs-item {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  min-height: 26px;
  padding-right: var(--space-2);
  color: var(--text-muted);
  font-family: var(--text-font-sans);
  font-size: var(--text-size-base);
  font-weight: var(--text-weight-regular);
  font-variation-settings: "wght" 400, "GRAD" 0, "XOPQ" 96, "XTRA" 468,
    "YOPQ" 79, "YTAS" 750, "YTDE" -203, "YTFI" 738, "YTLC" 514, "YTUC" 712,
    "wdth" 100;
  line-height: 1.6;
}

.ds-breadcrumbs-item__label {
  padding: 0;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  line-height: inherit;
  text-decoration: none;
  white-space: nowrap;
}

button.ds-breadcrumbs-item__label { cursor: pointer; }
button.ds-breadcrumbs-item__label:hover:not(:active) { color: var(--text-link-hover); }
button.ds-breadcrumbs-item__label:active { color: var(--text-link-pressed); }

button.ds-breadcrumbs-item__label:focus-visible {
  outline: 2px solid var(--border-focus);
  outline-offset: 2px;
  border-radius: 2px;
}

.ds-breadcrumbs-item__dot {
  width: 4px;
  height: 4px;
  flex: none;
  background: currentColor;
  -webkit-mask: var(--ds-breadcrumbs-item-dot-mask) center / contain no-repeat;
  mask: var(--ds-breadcrumbs-item-dot-mask) center / contain no-repeat;
}

.ds-breadcrumbs-item--current { color: var(--text-secondary); }
</style>
