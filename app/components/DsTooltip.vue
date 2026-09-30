<script setup lang="ts">
import { computed } from 'vue'
import tooltipPointerTop from '../assets/icons/tooltip-pointer-top.svg'
import tooltipPointerBottom from '../assets/icons/tooltip-pointer-bottom.svg'
import tooltipPointerLeft from '../assets/icons/tooltip-pointer-left.svg'
import tooltipPointerRight from '../assets/icons/tooltip-pointer-right.svg'

/**
 * DsTooltip — DS component 324:2111 (Tooltip)
 * https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=324-2111
 *
 * Static tooltip with 4 pointer directions. DS/Body/sm, text/inverse, bg accent/plum.
 * Non-interactive; shown/hidden by parent.
 */
const props = withDefaults(defineProps<{
  label?: string
  /** Pointer position relative to tooltip body */
  pointer?: 'Top' | 'Bottom' | 'Left' | 'Right'
}>(), {
  label: 'Tooltip',
  pointer: 'Top',
})

const pointerAssets = {
  Top: tooltipPointerTop,
  Bottom: tooltipPointerBottom,
  Left: tooltipPointerLeft,
  Right: tooltipPointerRight,
} as const

const pointerAsset = computed(() => pointerAssets[props.pointer])
</script>

<template>
  <div
    class="ds-tooltip"
    :class="`ds-tooltip--${pointer.toLowerCase()}`"
    role="tooltip"
  >
    <span class="ds-tooltip__pointer-slot" aria-hidden="true">
      <span class="ds-tooltip__pointer-canvas">
        <img class="ds-tooltip__pointer" :src="pointerAsset" alt="" />
      </span>
    </span>
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
  filter: drop-shadow(var(--effect-shadow-2nd));
}

.ds-tooltip__body {
  padding: 8px 12px;
  border-radius: var(--radius-md); /* 8px */
  background: var(--accent-plum);
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

/* Figma Frame 324:2128 has cornerSmoothing=1 (100%).
 * `corner-shape` is progressive: unsupported browsers retain the documented
 * 8px rounded-corner fallback above. */
@supports (corner-shape: superellipse(1.6)) {
  .ds-tooltip__body {
    corner-shape: superellipse(1.6);
  }
}

.ds-tooltip__pointer-slot {
  position: relative;
  flex: none;
  width: 12px;
  height: 8px;
}

.ds-tooltip__pointer-canvas {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 12px;
  height: 8px;
  transform: translate(-50%, -50%);
}

.ds-tooltip__pointer {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  display: block;
  width: 12px;
  height: 6.66667px;
}

.ds-tooltip--top {
  flex-direction: column;
}

.ds-tooltip--top .ds-tooltip__pointer-slot {
  order: -1;
}

.ds-tooltip--bottom {
  flex-direction: column;
}

.ds-tooltip--bottom .ds-tooltip__pointer-slot {
  order: 1;
}

.ds-tooltip--left {
  flex-direction: row;
  align-items: center;
}

.ds-tooltip--left .ds-tooltip__pointer-slot {
  width: 8px;
  height: 12px;
  order: -1;
}

.ds-tooltip--right {
  flex-direction: row;
  align-items: center;
}

.ds-tooltip--right .ds-tooltip__pointer-slot {
  width: 8px;
  height: 12px;
  order: 1;
}

.ds-tooltip--bottom .ds-tooltip__pointer-canvas { transform: translate(-50%, -50%) rotate(180deg); }
.ds-tooltip--left .ds-tooltip__pointer-canvas { transform: translate(-50%, -50%) rotate(-90deg); }
.ds-tooltip--right .ds-tooltip__pointer-canvas { transform: translate(-50%, -50%) rotate(90deg); }
</style>
