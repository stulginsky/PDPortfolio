<script setup lang="ts">
import { computed, nextTick, ref, useId } from 'vue'
import DsButton from './DsButton.vue'
import type { ButtonIconName } from './button-icons'
import DsCrossButton from './DsCrossButton.vue'
import DsDropdownListItem from './DsDropdownListItem.vue'
import DsScroll from './DsScroll.vue'

/**
 * DsFullscreenMenuMob — DS component 1021:3359 (FullscreenMenu-mob)
 * https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=1021-3359
 *
 * Mobile-only single-select menu. Trigger uses the canonical DS Button;
 * the opened surface fills the device viewport and owns its inner scroll.
 */
interface MenuItem {
  label: string
  value: string
  icon?: ButtonIconName
  showIcon?: boolean
  /** External resource: opens separately and does not change the selected value. */
  href?: string
}

const props = withDefaults(
  defineProps<{
    items: MenuItem[]
    modelValue?: string | null
    /** Initial intro label shown when no item is selected. */
    placeholder?: string
    /** Accessible name for the trigger and opened dialog. */
    ariaLabel?: string
    /** Figma Button Raised=On for the closed Default trigger only. */
    raised?: boolean
    /** Persistent Figma Button State=Toggled for a selected filter trigger. */
    toggled?: boolean
  }>(),
  {
    modelValue: null,
    placeholder: 'Продукт · Креатив · Бренд & ...',
    ariaLabel: 'Открыть меню',
    raised: false,
    toggled: false,
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
const listRef = ref<HTMLElement | null>(null)
const triggerRef = ref<{ $el: HTMLElement } | null>(null)
const menuId = `ds-fullscreen-menu-mob-${useId()}`
const listId = `${menuId}-list`
const swipeStart = ref<{ pointerId: number; y: number } | null>(null)

const triggerLabel = computed(() => {
  if (props.modelValue) {
    const found = props.items.find((item) => item.value === props.modelValue)
    if (found) return found.label
  }

  return props.placeholder
})

function open() {
  if (isOpen.value) return

  isActive.value = false
  isOpen.value = true
  emit('open')
}

function close() {
  if (!isOpen.value) return

  isOpen.value = false
  swipeStart.value = null
  emit('close')

  // Keyboard focus may exist when the mobile story is reviewed on desktop.
  // This has no persistent visual state: the DS Button returns to Default.
  void nextTick(() => triggerRef.value?.$el.focus())
}

function selectItem(item: MenuItem) {
  if (!item.href) {
    emit('update:modelValue', item.value)
    emit('select', item)
  }
  close()
}

function startPress() {
  isActive.value = true
}

function endPress() {
  isActive.value = false
}

function beginSwipe(event: PointerEvent) {
  if (event.pointerType !== 'touch' || (listRef.value?.scrollTop ?? 0) > 1) return

  swipeStart.value = { pointerId: event.pointerId, y: event.clientY }
  const target = event.currentTarget
  if (target instanceof HTMLElement && target.setPointerCapture) {
    target.setPointerCapture(event.pointerId)
  }
}

function finishSwipe(event: PointerEvent) {
  const gesture = swipeStart.value
  swipeStart.value = null

  if (!gesture || gesture.pointerId !== event.pointerId) return

  const movedDown = event.clientY - gesture.y
  if (movedDown >= 72 && (listRef.value?.scrollTop ?? 0) <= 1) close()
}
</script>

<template>
  <div class="ds-fs-menu">
    <DsButton
      ref="triggerRef"
      class="ds-fs-menu__trigger"
      :class="{
        'ds-fs-menu__trigger--raised': raised && !isActive,
        'ds-fs-menu__trigger--toggled': toggled && !isActive,
      }"
      :text="triggerLabel"
      :icon="isActive ? 'ChevronUp' : 'ChevronDown'"
      icon-right
      :raised="raised && !isActive"
      :toggled="toggled && !isActive"
      :aria-label="ariaLabel"
      aria-haspopup="dialog"
      :aria-controls="menuId"
      :aria-expanded="isOpen"
      @pointerdown="startPress"
      @pointerup="endPress"
      @pointercancel="endPress"
      @lostpointercapture="endPress"
      @click="open"
    />

    <Teleport to="body">
      <section
        v-if="isOpen"
        :id="menuId"
        class="ds-fs-menu__overlay"
        role="dialog"
        aria-modal="true"
        :aria-label="ariaLabel"
        @pointerdown="beginSwipe"
        @pointerup="finishSwipe"
        @pointercancel="swipeStart = null"
      >
        <div class="ds-fs-menu__handle-area" aria-hidden="true">
          <span class="ds-fs-menu__handle" />
        </div>

        <div class="ds-fs-menu__content">
          <div class="ds-fs-menu__list-wrap">
            <ul
              :id="listId"
              ref="listRef"
              class="ds-fs-menu__list"
              role="list"
              :aria-label="ariaLabel"
            >
              <li v-for="item in items" :key="item.value">
                <DsDropdownListItem
                  class="ds-fs-menu__item"
                  style="width: 100%"
                  :label="item.label"
                  :icon="item.icon"
                  :show-icon="item.showIcon ?? false"
                  :href="item.href"
                  appearance="Lr"
                  type="Filter"
                  @click="selectItem(item)"
                />
              </li>
            </ul>
            <DsScroll
              class="ds-fs-menu__scroll"
              style="position: absolute; top: 0; right: 0"
              axis="Y"
              :scroll-id="listId"
            />
          </div>

          <DsCrossButton
            class="ds-fs-menu__close"
            aria-label="Закрыть меню"
            pressed-appearance="Toggled"
            @click="close"
          />
        </div>
      </section>
    </Teleport>
  </div>
</template>

<style>
/* FullscreenMenu-mob — DS 1021:3359 */
.ds-fs-menu__trigger {
  max-width: min(288px, calc(100vw - 32px));
}

/* The component represents a touch UI even when Storybook is inspected with a mouse. */
@media (hover: hover) and (pointer: fine) {
  .button-base.ds-fs-menu__trigger:hover:not(:active):not(:disabled):not([aria-disabled="true"]):not(.button-base--pressed):not(.button-base--hover-suppressed) {
    background: transparent;
    color: var(--text-default);
  }

  .button-base.ds-fs-menu__trigger--raised:hover:not(:active):not(:disabled):not([aria-disabled="true"]):not(.button-base--pressed):not(.button-base--hover-suppressed) {
    background: var(--surface-raised);
  }

  .button-base.ds-fs-menu__trigger--toggled:hover:not(:active):not(:disabled):not([aria-disabled="true"]):not(.button-base--pressed):not(.button-base--hover-suppressed) {
    background: var(--surface-action-toggled);
    color: var(--text-inverse);
  }

  .button-base.ds-fs-menu__close:hover:not(:active):not(:disabled):not([aria-disabled="true"]):not(.button-base--pressed):not(.button-base--hover-suppressed) {
    background: transparent;
    color: var(--text-inverse);
  }

  .ds-fs-menu__overlay .ds-dropdown-list-item:hover:not(:active) {
    background: var(--surface-menu-item-default);
  }
}
</style>

<style>
/* Teleported fullscreen surface. */
.ds-fs-menu__overlay {
  position: fixed;
  z-index: 500;
  inset: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  width: 100dvw;
  height: 100dvh;
  box-sizing: border-box;
  overflow: hidden;
  padding: var(--space-6) 0;
  background: var(--surface-menu-item-default);
  /* Figma effect/shadow/bottom-sheet; no Foundation token exists yet. */
  box-shadow: 1px -2px 8px rgb(170 170 170 / 25%);
  touch-action: pan-y;
}

.ds-fs-menu__handle-area {
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  justify-content: center;
  min-height: 64px;
}

.ds-fs-menu__handle {
  display: block;
  width: 64px;
  height: 4px;
  border-radius: var(--radius-sm);
  background: var(--accent-violet);
}

.ds-fs-menu__content {
  display: flex;
  flex: 0 1 auto;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 0;
  gap: var(--space-2);
}

.ds-fs-menu__list-wrap {
  position: relative;
  display: flex;
  flex: 0 1 auto;
  width: 100%;
  min-height: 0;
  max-height: calc(100dvh - 162px);
}

.ds-fs-menu__list {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  width: 100%;
  min-height: 0;
  max-height: calc(100dvh - 162px);
  margin: 0;
  padding: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: none;
  list-style: none;
}

.ds-fs-menu__list::-webkit-scrollbar {
  display: none;
}

.ds-fs-menu__list li,
.ds-fs-menu__list li > button {
  display: flex;
  width: 100%;
}

.ds-fs-menu__close {
  --button-base-default-color: var(--text-inverse);
  flex: none;
}

@media (prefers-reduced-motion: reduce) {
  .ds-fs-menu__overlay {
    scroll-behavior: auto;
  }
}
</style>
