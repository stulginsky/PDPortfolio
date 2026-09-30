<script setup lang="ts">
/**
 * DsBreadcrumbsMenu — DS component 1262:2524 (BreadcrumbsMenu).
 * The overflow trigger owns keyboard disclosure and positions its list at 26 px.
 */
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import dotIcon from '../assets/icons/dot.svg'
import DsDropdownListItem from './DsDropdownListItem.vue'
import DsDropdownListSelector from './DsDropdownListSelector.vue'

interface MenuItem {
  id: string
  label: string
}

const props = defineProps<{
  items: MenuItem[]
  /** id of the controlled menu element */
  menuId?: string
}>()

const emit = defineEmits<{
  select: [item: MenuItem]
  close: []
}>()

const isOpen = ref(false)
const rootRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLButtonElement | null>(null)
const listRef = ref<HTMLElement | null>(null)
const alignEnd = ref(false)

function toggle() {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    nextTick(() => {
      const firstItem = rootRef.value?.querySelector('[role="menu"] button')
      firstItem?.focus()
      updateListAlignment()
    })
  }
}

function updateListAlignment() {
  const trigger = triggerRef.value
  const list = listRef.value
  if (!trigger || !list) return

  const triggerRect = trigger.getBoundingClientRect()
  const listWidth = list.getBoundingClientRect().width
  const gutter = 16
  alignEnd.value = triggerRect.left + listWidth > window.innerWidth - gutter
    && triggerRect.right - listWidth >= gutter
}

function selectItem(item: MenuItem) {
  emit('select', item)
  isOpen.value = false
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    isOpen.value = false
    triggerRef.value?.focus()
  }
}

function handleClickOutside(event: MouseEvent) {
  if (!rootRef.value?.contains(event.target as Node)) isOpen.value = false
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
  document.addEventListener('keydown', handleKeydown)
  window.addEventListener('resize', updateListAlignment)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
  document.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('resize', updateListAlignment)
})
</script>

<template>
  <div ref="rootRef" class="ds-breadcrumbs-menu" :class="{ 'ds-breadcrumbs-menu--open': isOpen }">
    <button
      ref="triggerRef"
      class="ds-breadcrumbs-menu__trigger"
      type="button"
      :aria-expanded="isOpen"
      :aria-controls="menuId || 'ds-breadcrumbs-menu-list'"
      aria-haspopup="menu"
      @click="toggle"
    >...</button>
    <span
      class="ds-breadcrumbs-menu__dot"
      :style="{ '--ds-breadcrumbs-menu-dot-mask': `url(&quot;${dotIcon}&quot;)` }"
      aria-hidden="true"
    />

    <div
      v-if="isOpen"
      ref="listRef"
      class="ds-breadcrumbs-menu__list-position"
      :class="{ 'ds-breadcrumbs-menu__list-position--end': alignEnd }"
    >
      <DsDropdownListSelector
        :id="menuId || 'ds-breadcrumbs-menu-list'"
        class="ds-breadcrumbs-menu__list"
        type="General"
        role="menu"
      >
        <li v-for="item in items" :key="item.id" role="none">
          <DsDropdownListItem
            :label="item.label"
            appearance="Sm"
            role="menuitem"
            @click="selectItem(item)"
          />
        </li>
      </DsDropdownListSelector>
    </div>
  </div>
</template>

<style scoped>
.ds-breadcrumbs-menu {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  height: 26px;
  padding-right: var(--space-2);
  color: var(--text-muted);
}

.ds-breadcrumbs-menu__trigger {
  -webkit-appearance: none;
  appearance: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  margin: 0;
  height: 26px;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: none;
  color: inherit;
  cursor: pointer;
  font-family: var(--text-font-sans);
  font-size: var(--text-size-base);
  font-weight: var(--text-weight-regular);
  font-variation-settings: "wght" 400, "GRAD" 0, "XOPQ" 96, "XTRA" 468,
    "YOPQ" 79, "YTAS" 750, "YTDE" -203, "YTFI" 738, "YTLC" 514, "YTUC" 712,
    "wdth" 100;
  letter-spacing: 0;
  line-height: 1.6;
}

.ds-breadcrumbs-menu__trigger:hover:not(:active) { color: var(--text-link-hover); }
.ds-breadcrumbs-menu__trigger:active { color: var(--text-link-pressed); }

.ds-breadcrumbs-menu__trigger:focus-visible {
  outline: 2px solid var(--border-focus);
  outline-offset: 2px;
  border-radius: 2px;
}

.ds-breadcrumbs-menu__dot {
  width: 4px;
  height: 4px;
  flex: none;
  background: currentColor;
  -webkit-mask: var(--ds-breadcrumbs-menu-dot-mask) center / contain no-repeat;
  mask: var(--ds-breadcrumbs-menu-dot-mask) center / contain no-repeat;
}

.ds-breadcrumbs-menu__trigger:hover:not(:active) + .ds-breadcrumbs-menu__dot {
  background: var(--text-link-hover);
}

.ds-breadcrumbs-menu__trigger:active + .ds-breadcrumbs-menu__dot,
.ds-breadcrumbs-menu--open .ds-breadcrumbs-menu__dot {
  background: var(--surface-action-toggled);
}

.ds-breadcrumbs-menu--open .ds-breadcrumbs-menu__trigger { color: var(--surface-action-toggled); }

.ds-breadcrumbs-menu__list-position {
  position: absolute;
  top: 26px;
  left: 0;
  z-index: 100;
  width: max-content;
  min-width: 100%;
  max-width: calc(100vw - 32px);
}

.ds-breadcrumbs-menu__list-position--end {
  right: 0;
  left: auto;
}
</style>
