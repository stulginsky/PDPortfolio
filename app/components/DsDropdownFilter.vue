<script setup lang="ts">
/**
 * DsDropdownFilter — DS component 1016:6638 (DropdownFilter-web)
 * https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=1016-6638
 *
 * Overflow filter selector for viewport 1024–1279px.
 * Contains 3 ListItem/Sm (Gamedev, Видео, Упаковка).
 * Selecting one makes it the only active filter; trigger label and closed visual stay Toggled.
 * Selecting an external filter → dropdown returns to Default, shows "Gamedev & more".
 * Opened: 256×198, 3 items × 40px.
 */
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import DsButton from './DsButton.vue'
import DsDropdownListSelector from './DsDropdownListSelector.vue'
import DsDropdownListItem from './DsDropdownListItem.vue'

const DEFAULT_LABEL = 'Gamedev & more'

const props = withDefaults(
  defineProps<{
    items?: string[]
    /** Currently selected value from outside (external filter active) */
    externalValue?: string | null
    modelValue?: string | null
    /** List item icons are visible in the standalone Figma component by default. */
    showIcons?: boolean
    /** Keep the initial Default trigger width after its label changes. */
    lockInitialWidth?: boolean
  }>(),
  {
    items: () => ['Gamedev', 'Видео', 'Упаковка'],
    externalValue: null,
    modelValue: null,
    showIcons: true,
    lockInitialWidth: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string | null]
  select: [label: string | null]
}>()

const isOpen = ref(false)
const triggerRef = ref<HTMLElement | null>(null)
const suppressTriggerHover = ref(false)
const triggerWidth = ref<number | null>(null)

// Show selected label if active, else default
const triggerLabel = computed(() => {
  if (props.modelValue && props.items.includes(props.modelValue)) {
    return props.modelValue
  }
  return DEFAULT_LABEL
})

// An overflow value belongs to this selector only when it is one of its items.
// In that case the closed trigger keeps the persistent Button Toggled visual.
const hasSelectedOverflow = computed(() =>
  Boolean(props.modelValue && props.items.includes(props.modelValue)),
)

function toggle() {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    nextTick(() => {
      triggerRef.value?.querySelector('.ds-dropdown-filter__list button')?.focus()
    })
  }
}

function suppressHoverUntilLeave() {
  suppressTriggerHover.value = true
}

function restoreHover() {
  suppressTriggerHover.value = false
}

function select(label: string) {
  emit('update:modelValue', label)
  emit('select', label)
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
    triggerRef.value?.querySelector('button')?.focus()
  }
}

function lockInitialWidth() {
  if (!props.lockInitialWidth || triggerWidth.value || !triggerRef.value) return

  const trigger = triggerRef.value.querySelector('button')
  if (!(trigger instanceof HTMLElement)) return

  const width = Math.ceil(trigger.getBoundingClientRect().width)
  if (width > 0) triggerWidth.value = width
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
  document.addEventListener('keydown', handleKeydown)
  if (props.lockInitialWidth) {
    void nextTick(lockInitialWidth)
    void document.fonts?.ready.then(lockInitialWidth)
  }
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div
    class="ds-dropdown-filter"
    :class="{ 'ds-dropdown-filter--initial-width-locked': lockInitialWidth }"
    ref="triggerRef"
    :style="lockInitialWidth && triggerWidth ? { width: `${triggerWidth}px` } : undefined"
  >
    <DsButton
      class="ds-dropdown-filter__trigger"
      :class="{ 'ds-dropdown-filter__trigger--hover-suppressed': suppressTriggerHover }"
      :text="triggerLabel"
      :toggled="isOpen || hasSelectedOverflow"
      :icon="isOpen ? 'ChevronUp' : 'ChevronDown'"
      icon-right
      :aria-expanded="isOpen"
      aria-controls="ds-dropdown-filter-list"
      @pointerdown="suppressHoverUntilLeave"
      @pointerleave="restoreHover"
      @click="toggle"
    />

    <!-- Opened: Button 256×50 + 4px gap + DropdownListSelector 256×144 -->
    <div
      v-if="isOpen"
      class="ds-dropdown-filter__list-position"
    >
      <DsDropdownListSelector
        id="ds-dropdown-filter-list"
        class="ds-dropdown-filter__list"
        type="Filter"
        aria-label="Filter options"
      >
        <li v-for="item in items" :key="item">
          <DsDropdownListItem
            :label="item"
            :show-icon="showIcons"
            appearance="Sm"
            @click="select(item)"
          />
        </li>
      </DsDropdownListSelector>
    </div>
  </div>
</template>

<style scoped>
/* DropdownFilter-web — DS 1016:6638 */
.ds-dropdown-filter {
  position: relative;
  display: inline-flex;
}

.ds-dropdown-filter__list-position {
  position: absolute;
  top: calc(100% + 4px);
  left: 50%;
  z-index: 200;
  width: max-content;
  min-width: 100%;
  max-width: calc(100vw - 32px);
  transform: translateX(-50%);
}

.ds-dropdown-filter--initial-width-locked .ds-dropdown-filter__trigger,
.ds-dropdown-filter--initial-width-locked .ds-dropdown-filter__list-position {
  width: 100%;
}

/* Local disclosure toggles directly to Opened; never flash ActivePressed. */
:deep(.button-base.button-base--pressed),
:deep(.button-base:active) {
  background: var(--surface-action-toggled) !important;
  color: var(--text-inverse) !important;
}

/* Keep the first hover out of the Default → Toggled transition. */
:deep(.ds-dropdown-filter__trigger--hover-suppressed.button-base:hover) {
  background: var(--surface-action-toggled) !important;
  color: var(--text-inverse) !important;
}
</style>
