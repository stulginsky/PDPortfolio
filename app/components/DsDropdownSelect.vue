<script setup lang="ts">
/**
 * DsDropdownSelect — DS component 1015:4517 (DropdownSelect-web)
 * https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=1015-4517
 *
 * Compact universal web dropdown. States: Default / Hover / Opened.
 * ActivePressed is a Figma reference only: this local toggle switches directly to Opened.
 * Default/Hover → closed Button with ChevronDown.
 * Opened → Button in Toggled state with ChevronUp + list of up to 4 ListItem/Sm.
 * Select new item → apply + close. Select current item / re-click / click outside / Escape → close only.
 */
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import DsButton from './DsButton.vue'
import DsDropdownListSelector from './DsDropdownListSelector.vue'
import DsDropdownListItem from './DsDropdownListItem.vue'

interface DropdownItem {
  label: string
  value: string
}

const props = withDefaults(
  defineProps<{
    items: DropdownItem[]
    modelValue?: string
    placeholder?: string
    /** Raised Default surface inherited from DsButton. */
    raised?: boolean
  }>(),
  {
    placeholder: 'Select',
    raised: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [item: DropdownItem]
}>()

const isOpen = ref(false)
const triggerRef = ref<HTMLElement | null>(null)
const listRef = ref<HTMLElement | null>(null)
const alignEnd = ref(false)

const currentLabel = computed(() => {
  const found = props.items.find((i) => i.value === props.modelValue)
  return found?.label ?? props.placeholder
})

function toggle() {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    nextTick(() => {
      triggerRef.value?.querySelector('.ds-dropdown-select__list button')?.focus()
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

function select(item: DropdownItem) {
  if (item.value !== props.modelValue) {
    emit('update:modelValue', item.value)
    emit('change', item)
  }
  isOpen.value = false
}

function handleClickOutside(e: MouseEvent) {
  const target = e.target as Node
  if (!triggerRef.value?.contains(target)) {
    isOpen.value = false
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    isOpen.value = false
    // Focus trigger
    triggerRef.value?.querySelector('button')?.focus()
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
  <div class="ds-dropdown-select" ref="triggerRef">
    <DsButton
      :text="currentLabel"
      :raised="props.raised"
      :toggled="isOpen"
      :icon="isOpen ? 'ChevronUp' : 'ChevronDown'"
      icon-right
      :aria-expanded="isOpen"
      aria-controls="ds-dropdown-select-list"
      @click="toggle"
    />

    <div
      v-if="isOpen"
      ref="listRef"
      class="ds-dropdown-select__list-position"
      :class="{ 'ds-dropdown-select__list-position--end': alignEnd }"
    >
      <DsDropdownListSelector
        id="ds-dropdown-select-list"
        class="ds-dropdown-select__list"
        type="General"
        aria-label="Select options"
      >
        <li
          v-for="item in items.slice(0, 4)"
          :key="item.value"
        >
          <DsDropdownListItem
            :label="item.label"
            appearance="Sm"
            @click="select(item)"
          />
        </li>
      </DsDropdownListSelector>
    </div>
  </div>
</template>

<style scoped>
/* DropdownSelect-web — DS 1015:4517 */
.ds-dropdown-select {
  position: relative;
  display: inline-flex;
}

.ds-dropdown-select__list-position {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  z-index: 200;
  width: max-content;
  min-width: 100%;
  max-width: calc(100vw - 32px);
}

/* The visible menu is at least as wide as its trigger, but may hug longer rows. */
:deep(.ds-dropdown-select__list) {
  min-width: 100%;
}

/* Local disclosure toggles directly to Opened; never flash ActivePressed. */
:deep(.button-base.button-base--pressed),
:deep(.button-base:active) {
  background: var(--surface-action-toggled) !important;
  color: var(--text-inverse) !important;
}

.ds-dropdown-select__list-position--end {
  right: 0;
  left: auto;
}
</style>
