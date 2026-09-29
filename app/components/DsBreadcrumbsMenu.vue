<script setup lang="ts">
/**
 * DsBreadcrumbsMenu — DS component 1262:2524 (BreadcrumbsMenu)
 * https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=1262-2524
 *
 * Tooltip/dropdown под триггером "…". Contains DsDropdownListItem.
 * Items: { label, href } — navigates on select, closes menu.
 * Closes on: item select, click outside, Escape, re-click trigger.
 * Accessible: aria-expanded/aria-controls; focus returns to trigger on close without navigation.
 */
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import DsDropdownListSelector from './DsDropdownListSelector.vue'
import DsDropdownListItem from './DsDropdownListItem.vue'

interface MenuItem {
  label: string
  href: string
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
  alignEnd.value =
    triggerRect.left + listWidth > window.innerWidth - gutter &&
    triggerRect.right - listWidth >= gutter
}

function selectItem(item: MenuItem) {
  emit('select', item)
  isOpen.value = false
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    isOpen.value = false
    triggerRef.value?.focus()
  }
}

function handleClickOutside(e: MouseEvent) {
  const target = e.target as Node
  if (!rootRef.value?.contains(target)) {
    isOpen.value = false
  }
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
  <div ref="rootRef" class="ds-bcr-menu">
    <!-- Trigger "…" -->
    <button
      ref="triggerRef"
      class="ds-bcr-menu__trigger"
      type="button"
      :aria-expanded="isOpen"
      :aria-controls="menuId || 'ds-bcr-menu-list'"
      aria-haspopup="true"
      @click="toggle"
    >…</button>

    <!-- Dropdown -->
    <div
      v-if="isOpen"
      ref="listRef"
      class="ds-bcr-menu__list-position"
      :class="{ 'ds-bcr-menu__list-position--end': alignEnd }"
    >
      <DsDropdownListSelector
        :id="menuId || 'ds-bcr-menu-list'"
        class="ds-bcr-menu__list"
        type="General"
        role="menu"
      >
        <li v-for="item in items" :key="item.href" role="none">
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
/* BreadcrumbsMenu — DS 325:1622 */
.ds-bcr-menu {
  position: relative;
  display: inline-flex;
}

.ds-bcr-menu__trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  border: none;
  background: none;
  font-family: var(--text-font-sans);
  font-size: var(--text-size-base);
  font-weight: var(--text-weight-regular);
  color: var(--text-muted);
  cursor: pointer;
  height: 26px;
  letter-spacing: 0.02em;
  line-height: 1;
}

.ds-bcr-menu__trigger:hover:not(:active) {
  color: var(--text-link-hover);
}

.ds-bcr-menu__trigger:active {
  color: var(--text-link-pressed);
}

.ds-bcr-menu__trigger:focus-visible {
  outline: 2px solid var(--border-focus);
  outline-offset: 2px;
  border-radius: 2px;
}

/* Dropdown list */
.ds-bcr-menu__list-position {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  z-index: 100;
  width: max-content;
  min-width: 146px;
  max-width: calc(100vw - 32px);
}

.ds-bcr-menu__list-position--end {
  right: 0;
  left: auto;
}
</style>
