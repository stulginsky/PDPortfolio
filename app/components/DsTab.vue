<script setup lang="ts">
import externalLinkIcon from '../assets/icons/external-link.svg?raw'

withDefaults(
  defineProps<{
    /** Figma property TabLabel. */
    tabLabel?: string
    /** Figma property Icon right=On. */
    iconRight?: boolean
    /** Figma property Toolbar. */
    toolbar?: 'Main' | 'Image'
    /** Current page or section; maps to Figma State=Toggled. */
    toggled?: boolean
  }>(),
  {
    tabLabel: 'Value',
    iconRight: false,
    toolbar: 'Main',
    toggled: false,
  },
)

defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<template>
  <button
    class="ds-tab"
    :class="[
      `ds-tab--toolbar-${toolbar.toLowerCase()}`,
      { 'ds-tab--toggled': toggled, 'ds-tab--icon-right': iconRight },
    ]"
    type="button"
    :aria-current="toggled ? 'page' : undefined"
    @click="$emit('click', $event)"
  >
    <span class="ds-tab__label">{{ tabLabel }}</span>
    <span
      v-if="iconRight"
      class="ds-tab__icon"
      aria-hidden="true"
      v-html="externalLinkIcon"
    />
  </button>
</template>

<style scoped>
/* Tab — DS 33:1544. Height 50; horizontal padding 16; radius 24. */
.ds-tab {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  padding: 0 var(--space-4);
  border: none;
  border-radius: var(--radius-xlg);
  background: transparent;
  color: var(--text-default);
  font-family: var(--text-font-sans);
  font-size: var(--text-size-base);
  font-weight: var(--text-weight-medium);
  font-variation-settings: var(--font-variation-body-accent-medium);
  line-height: 1.35;
  letter-spacing: 0.01em;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  -webkit-tap-highlight-color: transparent;
}

.ds-tab--toolbar-image {
  color: var(--text-muted);
}

.ds-tab--icon-right {
  gap: var(--space-1);
}

.ds-tab:hover:not(.ds-tab--toggled) {
  background: var(--surface-action-hover);
}

.ds-tab--toggled {
  background: var(--surface-action-toggled);
  color: var(--text-inverse);
  cursor: default;
}

.ds-tab:focus-visible {
  outline: 2px solid var(--border-focus);
  outline-offset: 2px;
}

.ds-tab__label {
  line-height: inherit;
}

.ds-tab__icon {
  display: block;
  width: 16px;
  height: 16px;
  line-height: 0;
}

.ds-tab__icon :deep(svg) {
  display: block;
  width: 16px;
  height: 16px;
}

/* Original Figma ExternalLink; semantic text color controls its state color. */
.ds-tab__icon :deep(path) {
  fill: none;
  stroke: currentColor;
}
</style>
