<script setup lang="ts">
/**
 * DsTooltip — DS component 324:2111 (Tooltip)
 * https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=324-2111
 *
 * Static tooltip with 4 pointer directions. DS/Body/sm, text/inverse, bg accent/aubergine.
 * Non-interactive; shown/hidden by parent.
 */
defineProps<{
  label: string
  /** Pointer position relative to tooltip body */
  pointer?: 'Top' | 'Bottom' | 'Left' | 'Right'
}>()
</script>

<template>
  <div
    class="ds-tooltip"
    :class="`ds-tooltip--${(pointer || 'Top').toLowerCase()}`"
    role="tooltip"
  >
    <div class="ds-tooltip__arrow" aria-hidden="true" />
    <div class="ds-tooltip__body">{{ label }}</div>
  </div>
</template>

<style scoped>
/* Tooltip — DS 324:2111 */
.ds-tooltip {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  pointer-events: none;
}

.ds-tooltip__body {
  padding: 8px 12px;
  border-radius: var(--radius-md); /* 8px */
  background: var(--accent-aubergine); /* text/body-accent source */
  color: var(--text-inverse);
  font-family: var(--text-font-sans);
  font-size: var(--text-size-sm); /* DS/Body/sm — 14px */
  font-weight: var(--text-weight-regular);
  font-variation-settings: "wght" 400, "GRAD" 0, "XOPQ" 96, "XTRA" 468,
    "YOPQ" 79, "YTAS" 750, "YTDE" -203, "YTFI" 738, "YTLC" 514, "YTUC" 712,
    "wdth" 100;
  line-height: 1.5;
  letter-spacing: 0;
  white-space: nowrap;
}

/* Arrow — small triangle */
.ds-tooltip__arrow {
  width: 0;
  height: 0;
  border: 6px solid transparent;
}

/* Pointer=Top: arrow above body, pointing up */
.ds-tooltip--top {
  flex-direction: column;
}

.ds-tooltip--top .ds-tooltip__arrow {
  border-bottom-color: var(--accent-aubergine);
  order: -1;
}

/* Pointer=Bottom: arrow below body, pointing down */
.ds-tooltip--bottom {
  flex-direction: column;
}

.ds-tooltip--bottom .ds-tooltip__arrow {
  border-top-color: var(--accent-aubergine);
  order: 1;
}

/* Pointer=Left: arrow left of body, pointing left */
.ds-tooltip--left {
  flex-direction: row;
  align-items: center;
}

.ds-tooltip--left .ds-tooltip__arrow {
  border-right-color: var(--accent-aubergine);
  order: -1;
}

/* Pointer=Right: arrow right of body, pointing right */
.ds-tooltip--right {
  flex-direction: row;
  align-items: center;
}

.ds-tooltip--right .ds-tooltip__arrow {
  border-left-color: var(--accent-aubergine);
  order: 1;
}
</style>
