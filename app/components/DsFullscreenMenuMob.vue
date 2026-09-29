<script setup lang="ts">
/**
 * DsFullscreenMenuMob — DS component 1021:3359 (FullscreenMenu/Mob)
 * https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=1021-3359
 *
 * Universal fullscreen menu for mobile (320px–767px).
 * Default (closed): trigger 97×50 showing label + chevronDown.
 * ActivePressed: from tap/press to release — pressed styling + chevronUp.
 * Opened: full-width overlay with slot items + close button (DsCrossButton).
 *
 * Default intro label (for Filters): "Продукт · креатив · бренд & more"
 * After selection: shows selected item label.
 * Items: single-select — selecting item applies value and closes.
 * Current item / Cross / click outside → close without change.
 */
import { ref, computed, onMounted, onUnmounted } from 'vue'
import DsDropdownListItem from './DsDropdownListItem.vue'
import DsCrossButton from './DsCrossButton.vue'

interface MenuItem {
  label: string
  value: string
}

const props = withDefaults(
  defineProps<{
    items: MenuItem[]
    modelValue?: string | null
    /** Initial intro label shown when no item is selected */
    placeholder?: string
    /** aria-label for the trigger button */
    ariaLabel?: string
  }>(),
  {
    modelValue: null,
    placeholder: 'Продукт · креатив · бренд & more',
    ariaLabel: 'Открыть меню',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string | null]
  select: [item: MenuItem]
  open: []
  close: []
}>()

const isOpen = ref(false)
const isActive = ref(false)
const triggerRef = ref<HTMLButtonElement | null>(null)

const triggerLabel = computed(() => {
  if (props.modelValue) {
    const found = props.items.find((i) => i.value === props.modelValue)
    if (found) return found.label
  }
  return props.placeholder
})

function open() {
  isOpen.value = true
  emit('open')
}

function close() {
  isOpen.value = false
  emit('close')
  // Return focus to trigger
  triggerRef.value?.focus()
}

function selectItem(item: MenuItem) {
  emit('update:modelValue', item.value)
  emit('select', item)
  isOpen.value = false
}

function handleKeydown(e: KeyboardEvent) {
  if (isOpen.value && e.key === 'Escape') {
    close()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="ds-fs-menu">
    <!-- Trigger (Default / ActivePressed) -->
    <button
      ref="triggerRef"
      class="ds-fs-menu__trigger"
      :class="{ 'ds-fs-menu__trigger--active': isActive }"
      type="button"
      :aria-label="ariaLabel"
      :aria-expanded="isOpen"
      aria-haspopup="dialog"
      @pointerdown="isActive = true"
      @pointerup="isActive = false; open()"
      @pointercancel="isActive = false"
      @keydown.enter.prevent="open()"
      @keydown.space.prevent="open()"
    >
      <span class="ds-fs-menu__trigger-label">{{ triggerLabel }}</span>
      <!-- chevronDown (closed) / chevronUp (opened) -->
      <svg
        class="ds-fs-menu__chevron"
        :class="{ 'ds-fs-menu__chevron--up': isOpen }"
        width="8" height="5" viewBox="0 0 8.167 4.072" fill="none"
        aria-hidden="true"
      >
        <path d="M6.959 0.156C7.287-0.097 7.758-0.036 8.011 0.292 8.263 0.62 8.202 1.091 7.875 1.344L4.541 3.916C4.271 4.124 3.895 4.124 3.625 3.916L0.292 1.344C-0.036 1.091-0.097 0.62 0.156 0.292 0.409-0.036 0.88-0.097 1.208 0.156L4.083 2.374 6.959 0.156Z" fill="currentColor"/>
      </svg>
    </button>

    <!-- Opened overlay -->
    <Teleport to="body">
      <div
        v-if="isOpen"
        class="ds-fs-menu__overlay"
        role="dialog"
        aria-modal="true"
        :aria-label="ariaLabel"
      >
        <!-- Header with close button -->
        <div class="ds-fs-menu__header">
          <DsCrossButton aria-label="Закрыть меню" @click="close()" />
        </div>

        <!-- Items list -->
        <ul class="ds-fs-menu__list" role="listbox">
          <li
            v-for="item in items"
            :key="item.value"
            role="option"
            :aria-selected="modelValue === item.value"
          >
            <DsDropdownListItem
              :label="item.label"
              appearance="Lr"
              type="Filter"
              :show-icon="false"
              @click="selectItem(item)"
            />
          </li>
        </ul>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
/* FullscreenMenu/Mob — DS 1021:3359 */
/* Trigger: 97×50 closed */
.ds-fs-menu__trigger {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  height: 50px;
  min-width: 97px;
  padding: 0 16px;
  border: 1px solid var(--border-default);
  border-radius: 24px;
  background: transparent;
  font-family: var(--text-font-sans);
  font-size: var(--text-size-sm); /* DS/Control/base */
  font-weight: var(--text-weight-medium);
  font-variation-settings: "wght" 500, "GRAD" 0, "XOPQ" 96, "XTRA" 468,
    "YOPQ" 79, "YTAS" 750, "YTDE" -203, "YTFI" 738, "YTLC" 514, "YTUC" 712,
    "wdth" 100;
  color: var(--text-action);
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

/* ActivePressed */
.ds-fs-menu__trigger--active,
.ds-fs-menu__trigger:active {
  background: var(--surface-action-pressed);
  color: var(--text-inverse);
  border-color: var(--surface-action-pressed);
}

.ds-fs-menu__trigger:hover:not(:active):not(.ds-fs-menu__trigger--active) {
  background: var(--surface-action-hover);
}

.ds-fs-menu__trigger:focus-visible {
  outline: 2px solid var(--border-focus);
  outline-offset: 2px;
}

.ds-fs-menu__trigger-label {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
}

.ds-fs-menu__chevron {
  flex-shrink: 0;
  transition: transform 0.2s ease;
}

.ds-fs-menu__chevron--up {
  transform: rotate(180deg);
}
</style>

<style>
/* Non-scoped: overlay rendered via Teleport */
.ds-fs-menu__overlay {
  position: fixed;
  inset: 0;
  z-index: 500;
  display: flex;
  flex-direction: column;
  background: var(--surface-default);
  padding: 0;
  overflow: hidden auto;
}

.ds-fs-menu__header {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 8px 8px 0;
  min-height: 50px;
}

.ds-fs-menu__list {
  list-style: none;
  margin: 0;
  padding: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.ds-fs-menu__list li > button {
  width: 100%;
}
</style>
