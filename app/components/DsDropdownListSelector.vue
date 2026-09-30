<script setup lang="ts">
import { computed, provide } from 'vue'
import { dropdownListTypeKey, type DropdownListType } from './dropdown-list-context'
/**
 * DsDropdownListSelector — DS component 1282:6724 (DropdownListSelector)
 * https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=1282-6724
 *
 * Shared web dropdown-list surface. Figma documents 3- and 4-row references;
 * production receives any number of DsDropdownListItem rows through its default slot.
 */
const props = withDefaults(
  defineProps<{
    type?: DropdownListType
  }>(),
  { type: 'General' },
)

provide(dropdownListTypeKey, computed(() => props.type))
</script>

<template>
  <ul class="ds-dropdown-list-selector" :class="`ds-dropdown-list-selector--${type.toLowerCase()}`">
    <slot />
  </ul>
</template>

<style scoped>
/* DropdownListSelector — DS 1282:6724 */
.ds-dropdown-list-selector {
  display: flex;
  flex-direction: column;
  width: fit-content;
  min-width: 0;
  max-width: 100%;
  box-sizing: border-box;
  overflow: clip;
  list-style: none;
  margin: 0;
  padding: 12px 0;
  border-radius: var(--radius-xlg);
  background: var(--surface-menu-item-default);
  box-shadow: var(--effect-shadow-2nd);
}

/* All Figma variants have radius/xlg with cornerSmoothing=1 (100%).
 * Unsupported browsers retain the documented 24px rounded-corner fallback. */
@supports (corner-shape: superellipse(1.6)) {
  .ds-dropdown-list-selector {
    corner-shape: superellipse(1.6);
  }
}

.ds-dropdown-list-selector--filter {
  width: 100%;
  min-width: 100%;
}

:slotted(li) {
  display: flex;
  width: 100%;
  min-width: 0;
  align-self: stretch;
}

/* Literal Figma instance override for rows placed in the dropdown surface. */
:deep(.ds-dropdown-list-item) {
  flex: 1 1 auto;
  width: 100%;
  padding-right: 32px;
  padding-left: 32px;
}

/* Web menus expand to the longest row; they never create a two-line option. */
.ds-dropdown-list-selector--general :deep(.ds-dropdown-list-item__label) {
  white-space: nowrap;
  overflow-wrap: normal;
  word-break: normal;
}
</style>
