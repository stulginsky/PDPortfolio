<script setup lang="ts">
/**
 * DsDropdownFilter — DS component 1016:6638 (DropdownFilter-web)
 * https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=1016-6638
 *
 * Overflow filter selector for viewport 1024–1279px.
 * Contains 3 ListItem/Sm (Gamedev, Видео, Упаковка).
 * Selecting one makes it the only active filter; trigger label changes to selected.
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
  }>(),
  {
    items: () => ['Gamedev', 'Видео', 'Упаковка'],
    externalValue: null,
    modelValue: null,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string | null]
  select: [label: string | null]
}>()

const isOpen = ref(false)
const triggerRef = ref<HTMLElement | null>(null)

// Show selected label if active, else default
const triggerLabel = computed(() => {
  if (props.modelValue && props.items.includes(props.modelValue)) {
    return props.modelValue
  }
  return DEFAULT_LABEL
})

function toggle() {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    nextTick(() => {
      triggerRef.value?.querySelector('[role="listbox"] button')?.focus()
    })
  }
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

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="ds-dropdown-filter" ref="triggerRef">
    <DsButton
      :text="triggerLabel"
      :toggled="isOpen"
      :icon="isOpen ? 'ChevronUp' : 'ChevronDown'"
      icon-right
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
      aria-controls="ds-dropdown-filter-list"
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
        role="listbox"
      >
        <li v-for="item in items" :key="item" role="option" :aria-selected="modelValue === item">
          <DsDropdownListItem
            :label="item"
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
</style>
