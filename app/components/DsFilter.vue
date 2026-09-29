<script setup lang="ts">
/**
 * DsFilter — DS component 43:867 (Filter, Design=2nd)
 * https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=43-867
 *
 * Portfolio filter chip. 90×50, radius=24. DS/Control/base.
 * States: Default (text/action), Hover, ActivePressed, Toggled/Selected, Disabled.
 * Use aria-pressed for toggle semantics.
 */
withDefaults(
  defineProps<{
    label: string
    /** Toggled = selected/active filter */
    toggled?: boolean
    disabled?: boolean
  }>(),
  {
    toggled: false,
    disabled: false,
  },
)

defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<template>
  <button
    class="ds-filter"
    :class="{ 'ds-filter--toggled': toggled }"
    :disabled="disabled"
    :aria-pressed="toggled"
    type="button"
    @click="$emit('click', $event)"
  >
    {{ label }}
  </button>
</template>

<style scoped>
/* Filter — DS 43:867, Design=2nd */
.ds-filter {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  padding: 0 var(--space-4); /* 0 16px */
  border: none;
  border-radius: var(--radius-xlg); /* 24px */
  background: transparent;
  font-family: var(--text-font-sans);
  font-size: var(--text-size-base); /* DS/Control/base */
  font-weight: var(--text-weight-medium);
  font-variation-settings: "wght" 500, "GRAD" 0, "XOPQ" 96, "XTRA" 468,
    "YOPQ" 79, "YTAS" 750, "YTDE" -203, "YTFI" 738, "YTLC" 514, "YTUC" 712,
    "wdth" 100;
  line-height: 1.35;
  letter-spacing: 0.01em;
  color: var(--text-action); /* Default: accent/aubergine */
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  -webkit-tap-highlight-color: transparent;
}

/* Hover (only when not toggled) */
.ds-filter:hover:not(:disabled):not(.ds-filter--toggled) {
  background: var(--surface-action-hover);
  color: var(--text-default);
}

/* ActivePressed */
.ds-filter:active:not(:disabled) {
  background: var(--surface-action-pressed);
  color: var(--text-inverse);
}

/* Toggled/Selected */
.ds-filter--toggled,
.ds-filter--toggled:hover {
  background: var(--surface-action-toggled);
  color: var(--text-inverse);
}

/* Disabled */
.ds-filter:disabled {
  color: var(--text-muted);
  cursor: not-allowed;
}
</style>
