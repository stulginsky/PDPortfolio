<script setup lang="ts">
import { computed, inject } from 'vue'
import { getButtonIconSource, type ButtonIconName } from './button-icons'
import { dropdownListTypeKey, type DropdownListType } from './dropdown-list-context'

/**
 * DsDropdownListItem — DS component 325:1613 (DropdownListItem)
 * https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=325-1613
 *
 * Menu row. Type=General aligns text and icon to opposing edges;
 * Type=Filter centers the text-plus-icon group.
 */
const props = withDefaults(
  defineProps<{
    label: string
    appearance?: 'Sm' | 'Lr'
    icon?: ButtonIconName
    showIcon?: boolean
    type?: DropdownListType
  }>(),
  {
    appearance: 'Sm',
    icon: 'Favicon',
    showIcon: true,
    type: 'General',
  },
)

const inheritedType = inject(dropdownListTypeKey, undefined)
const resolvedType = computed(() => inheritedType?.value ?? props.type)

defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<template>
  <button
    class="ds-dropdown-list-item"
    :class="[
      `ds-dropdown-list-item--${appearance.toLowerCase()}`,
      `ds-dropdown-list-item--${resolvedType.toLowerCase()}`,
    ]"
    type="button"
    @click="$emit('click', $event)"
  >
    <span class="ds-dropdown-list-item__label">{{ label }}</span>
    <span
      v-if="showIcon"
      class="ds-dropdown-list-item__icon"
      :style="{ '--ds-dropdown-list-item-icon-mask': `url(&quot;${getButtonIconSource(icon)}&quot;)` }"
      aria-hidden="true"
    />
  </button>
</template>

<style scoped>
/* DropdownListItem — DS 325:1613 */
.ds-dropdown-list-item {
  display: flex;
  align-items: center;
  width: fit-content;
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
  border: none;
  background: var(--surface-menu-item-default); /* accent/plum */
  color: var(--text-inverse);
  font-family: var(--text-font-sans);
  font-size: var(--text-size-sm);
  font-weight: var(--text-weight-regular);
  font-variation-settings: "wght" 400, "GRAD" 0, "XOPQ" 96, "XTRA" 468,
    "YOPQ" 79, "YTAS" 750, "YTDE" -203, "YTFI" 738, "YTLC" 514, "YTUC" 712,
    "wdth" 100;
  line-height: 1.5;
  letter-spacing: 0;
  gap: 12px;
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.ds-dropdown-list-item--general {
  justify-content: space-between;
  text-align: left;
}

.ds-dropdown-list-item--filter {
  justify-content: center;
  text-align: center;
}

.ds-dropdown-list-item__label {
  min-width: 0;
  padding: 8px 0;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.ds-dropdown-list-item--general .ds-dropdown-list-item__label {
  flex: 1 1 auto;
}

.ds-dropdown-list-item--filter .ds-dropdown-list-item__label {
  flex: 0 1 auto;
  max-width: calc(100% - 28px);
}

.ds-dropdown-list-item__icon {
  display: block;
  width: 16px;
  height: 16px;
  background: currentColor;
  mask: var(--ds-dropdown-list-item-icon-mask) center / contain no-repeat;
  -webkit-mask: var(--ds-dropdown-list-item-icon-mask) center / contain no-repeat;
  flex-shrink: 0;
}

/* Sm: 40px minimum; long text may increase the row height. */
.ds-dropdown-list-item--sm {
  min-height: 40px;
  padding: 0 12px;
}

/* Lr: 52px minimum; used by mobile fullscreen menus. */
.ds-dropdown-list-item--lr {
  min-height: 52px;
  padding: 0 12px;
  min-width: 105px;
  font-size: var(--text-size-base);
  line-height: 1.6;
}

/* Hover */
.ds-dropdown-list-item:hover:not(:active) {
  background: var(--surface-menu-item-hover); /* accent/violet */
}

/* ActivePressed */
.ds-dropdown-list-item:active {
  background: var(--surface-menu-item-pressed); /* accent/aubergine */
}

/* Focus visible */
.ds-dropdown-list-item:focus-visible {
  outline: 2px solid var(--border-focus);
  outline-offset: -2px;
}
</style>
