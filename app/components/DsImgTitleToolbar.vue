<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import DsButtonIcon from './DsButtonIcon.vue'
import DsFullscreenMenuMob from './DsFullscreenMenuMob.vue'
import DsDropdownSelect from './DsDropdownSelect.vue'
import DsTab from './DsTab.vue'
import DsButton from './DsButton.vue'

defineOptions({ inheritAttrs: false })

type InternalValue = 'overview' | 'foundation' | 'tokens'

interface NavigationItem {
  label: string
  value: InternalValue | 'figma'
  href?: string
  icon?: 'ExternalLink'
  showIcon?: boolean
}

const props = withDefaults(
  defineProps<{
    /** Figma TEXT property Title#1016:1. */
    title?: string
    /** Figma BOOLEAN property Show zoom#1016:11. */
    showZoom?: boolean
    /** Selected internal document. Null preserves the introductory mobile trigger. */
    modelValue?: InternalValue | null
  }>(),
  {
    title: 'Value',
    showZoom: true,
    modelValue: undefined,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: InternalValue]
  select: [value: InternalValue]
  zoom: [event: MouseEvent]
}>()

const rootRef = ref<HTMLElement | null>(null)
const measureRef = ref<HTMLElement | null>(null)
const mobileMeasureRef = ref<HTMLElement | null>(null)
const internalValue = ref<InternalValue | null>(null)
const viewportIsWeb = ref(false)
const menuForOverflow = ref(false)
const mobileSingleRow = ref(false)
const storybookBreakpoint = ref<string | undefined>()
let observer: ResizeObserver | undefined
let mediaQuery: MediaQueryList | undefined
let attributeObserver: MutationObserver | undefined

const items: NavigationItem[] = [
  { label: 'Overview', value: 'overview', showIcon: false },
  { label: 'Foundation.md', value: 'foundation', showIcon: false },
  { label: 'Tokens.json', value: 'tokens', showIcon: false },
  {
    label: 'Figma',
    value: 'figma',
    href: 'https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=1394-6239',
    icon: 'ExternalLink',
    showIcon: true,
  },
]

const isWeb = computed(() => {
  if (storybookBreakpoint.value === 'base') return false
  if (storybookBreakpoint.value === 'min-768') return true
  return viewportIsWeb.value
})
const selectedValue = computed(() => props.modelValue === undefined ? internalValue.value : props.modelValue)
const selectedTab = computed<InternalValue>(() => selectedValue.value ?? 'overview')
const triggerLabel = computed(() => items.find(item => item.value === selectedValue.value)?.label ?? 'Overview · Docs · Figma')
const useMenu = computed(() => !isWeb.value || menuForOverflow.value)
const internalItems = computed(() => items.filter((item): item is NavigationItem & { value: InternalValue } => item.value !== 'figma'))

function select(value: InternalValue) {
  if (props.modelValue === undefined) internalValue.value = value
  emit('update:modelValue', value)
  emit('select', value)
}

function selectMenuItem(item: NavigationItem) {
  if (item.value !== 'figma') select(item.value)
}

function openFigma() {
  const figmaItem = items.find((item) => item.value === 'figma')
  if (figmaItem?.href) window.open(figmaItem.href, '_blank', 'noopener,noreferrer')
}

async function updateNavigation() {
  await nextTick()

  const rootWidth = rootRef.value?.parentElement?.clientWidth ?? 0
  const availableWidth = Math.min(rootWidth, 924)
  if (!isWeb.value) {
    menuForOverflow.value = true
    // 8px outer padding on each side + 16px title inset, same in both layouts.
    mobileSingleRow.value = rootWidth > 0 && (mobileMeasureRef.value?.scrollWidth ?? Infinity) + (props.showZoom ? 32 : 16) <= availableWidth
    return
  }

  const measuredWidth = measureRef.value?.scrollWidth ?? 0
  // 24px left + 12px right padding are outside the uninterrupted inline row.
  menuForOverflow.value = rootWidth > 0 && measuredWidth + 36 > availableWidth
}

function updateViewport() {
  viewportIsWeb.value = mediaQuery?.matches ?? false
  void updateNavigation()
}

watch(
  () => [props.title, props.showZoom, selectedValue.value, storybookBreakpoint.value],
  () => void updateNavigation(),
)

onMounted(() => {
  storybookBreakpoint.value = rootRef.value?.dataset.storybookBreakpoint
  mediaQuery = window.matchMedia('(min-width: 768px)')
  updateViewport()
  mediaQuery.addEventListener('change', updateViewport)
  observer = typeof ResizeObserver === 'undefined'
    ? undefined
    : new ResizeObserver(() => void updateNavigation())
  if (rootRef.value?.parentElement) observer?.observe(rootRef.value.parentElement)
  if (measureRef.value) observer?.observe(measureRef.value)
  if (mobileMeasureRef.value) observer?.observe(mobileMeasureRef.value)
  void document.fonts.ready.then(() => updateNavigation())
  attributeObserver = new MutationObserver(() => {
    storybookBreakpoint.value = rootRef.value?.dataset.storybookBreakpoint
    void updateNavigation()
  })
  if (rootRef.value) {
    attributeObserver.observe(rootRef.value, {
      attributes: true,
      attributeFilter: ['data-storybook-breakpoint'],
    })
  }
})

onBeforeUnmount(() => {
  mediaQuery?.removeEventListener('change', updateViewport)
  observer?.disconnect()
  attributeObserver?.disconnect()
})
</script>

<template>
  <section
    ref="rootRef"
    v-bind="$attrs"
    class="ds-img-title-toolbar"
    :class="{
      'ds-img-title-toolbar--menu': useMenu,
      'ds-img-title-toolbar--inline': !useMenu,
      'ds-img-title-toolbar--single-row': !isWeb && mobileSingleRow,
      'ds-img-title-toolbar--without-zoom': !props.showZoom,
    }"
    aria-label="Навигация по материалам изображения"
  >
    <div class="ds-img-title-toolbar__header">
      <h2 class="ds-img-title-toolbar__title">{{ props.title }}</h2>

      <nav v-if="!useMenu" class="ds-img-title-toolbar__tabs" aria-label="Материалы">
        <DsTab
          v-for="item in internalItems"
          :key="item.value"
          :tab-label="item.label"
          toolbar="Image"
          :toggled="selectedTab === item.value"
          @click="select(item.value)"
        />
        <DsTab
          tab-label="Figma"
          icon-right
          toolbar="Image"
          @click="openFigma"
        />
      </nav>

      <DsDropdownSelect
        v-else-if="isWeb"
        class="ds-img-title-toolbar__menu ds-img-title-toolbar__menu--web"
        :items="items"
        :model-value="selectedValue ?? undefined"
        type="Filter"
        placeholder="Overview · Docs · Figma"
        aria-label="Выбрать материал"
        @change="selectMenuItem"
      />

      <DsFullscreenMenuMob
        v-else
        class="ds-img-title-toolbar__menu ds-img-title-toolbar__menu--base"
        :items="items"
        :model-value="selectedValue"
        placeholder="Overview · Docs · Figma"
        aria-label="Выбрать материал"
        @select="selectMenuItem"
      />

      <DsButtonIcon
        v-if="props.showZoom"
        class="ds-img-title-toolbar__zoom"
        icon="MagnifyingGlass"
        :aria-label="`Увеличить изображение «${props.title}»`"
        @click="emit('zoom', $event)"
      />
    </div>

    <div class="ds-img-title-toolbar__measure-clip" inert aria-hidden="true">
    <div
      ref="measureRef"
      class="ds-img-title-toolbar__measure"
      inert
      aria-hidden="true"
    >
      <span class="ds-img-title-toolbar__measure-title">{{ props.title }}</span>
      <div class="ds-img-title-toolbar__measure-tabs">
        <DsTab
          v-for="item in internalItems"
          :key="`measure-${item.value}`"
          :tab-label="item.label"
          toolbar="Image"
          :toggled="selectedTab === item.value"
        />
        <DsTab tab-label="Figma" icon-right toolbar="Image" />
      </div>
      <span v-if="props.showZoom" class="ds-img-title-toolbar__measure-zoom" />
    </div>
    <div ref="mobileMeasureRef" class="ds-img-title-toolbar__measure ds-img-title-toolbar__measure--mobile">
      <span class="ds-img-title-toolbar__measure-title">{{ props.title }}</span>
      <DsButton :text="triggerLabel" icon="ChevronDown" icon-right />
      <span v-if="props.showZoom" class="ds-img-title-toolbar__measure-zoom" />
    </div>
    </div>
  </section>
</template>

<style scoped>
/* ImgTitleToolbar — Figma 1388:4795. Base: Breakpoint=base, Navigation=Menu. */
.ds-img-title-toolbar {
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-width: min(288px, 100%);
  max-width: 100%;
  min-height: 128px;
  padding: var(--space-2);
  gap: var(--space-3);
  border-radius: var(--radius-xxlg);
  background: var(--surface-subtle);
}

.ds-img-title-toolbar__header {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 50px;
  grid-template-rows: minmax(50px, auto) 50px;
  align-items: center;
  width: 100%;
  min-height: 50px;
  min-width: 0;
  gap: var(--space-3);
}

.ds-img-title-toolbar__title {
  flex: 1 1 auto;
  min-width: 0;
  margin: 0;
  padding-left: var(--space-4);
  color: var(--text-muted);
  font-family: var(--text-font-sans);
  font-size: var(--text-size-lg);
  font-weight: var(--text-weight-semibold);
  font-variation-settings: var(--font-variation-heading-base);
  line-height: 1.45;
  letter-spacing: 0.01em;
  overflow-wrap: break-word;
}

.ds-img-title-toolbar__zoom {
  grid-column: 2;
  grid-row: 1;
  flex: none;
  --button-base-default-color: var(--text-muted);
}

.ds-img-title-toolbar__menu--base {
  grid-column: 1 / -1;
  grid-row: 2;
  justify-self: center;
  width: auto;
}

.ds-img-title-toolbar__menu :deep(.ds-fs-menu),
.ds-img-title-toolbar__menu :deep(.ds-fs-menu__trigger) {
  width: 100%;
}

.ds-img-title-toolbar__menu--base :deep(.ds-fs-menu__trigger) {
  max-width: none;
}

.ds-img-title-toolbar__tabs {
  display: flex;
  flex: none;
  align-items: center;
  gap: var(--space-3);
}

.ds-img-title-toolbar__measure {
  position: absolute;
  visibility: hidden;
  display: flex;
  align-items: center;
  width: max-content;
  height: 50px;
  gap: var(--space-3);
  pointer-events: none;
  white-space: nowrap;
}

.ds-img-title-toolbar__measure-clip {
  position: absolute;
  inset: 0 auto auto 0;
  width: 0;
  height: 0;
  overflow: hidden;
  contain: strict;
  pointer-events: none;
}

.ds-img-title-toolbar__measure--mobile .ds-img-title-toolbar__measure-title {
  font-size: var(--text-size-lg);
  font-variation-settings: var(--font-variation-heading-base);
  line-height: 1.45;
  letter-spacing: 0.01em;
}

.ds-img-title-toolbar__measure-title {
  color: var(--text-muted);
  font-family: var(--text-font-sans);
  font-size: var(--text-size-xl);
  font-weight: var(--text-weight-semibold);
  font-variation-settings: var(--font-variation-heading-md);
  line-height: 1.3;
  letter-spacing: 0.03em;
}

.ds-img-title-toolbar__measure-tabs {
  display: flex;
  gap: var(--space-3);
}

.ds-img-title-toolbar__measure-zoom {
  display: block;
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

/* The forced attribute is Storybook evidence only; viewport behavior stays automatic. */
@media (min-width: 768px) {
  .ds-img-title-toolbar:not([data-storybook-breakpoint='base']) {
    flex-direction: row;
    width: fit-content;
    min-width: 0;
    max-width: min(924px, 100%);
    min-height: 74px;
    padding: var(--space-3) var(--space-3) var(--space-3) var(--space-6);
    gap: var(--space-3);
    border-radius: var(--radius-xxxlg);
  }

  .ds-img-title-toolbar:not([data-storybook-breakpoint='base']) .ds-img-title-toolbar__header {
    display: flex;
    gap: var(--space-3);
  }

  .ds-img-title-toolbar:not([data-storybook-breakpoint='base']) .ds-img-title-toolbar__title {
    flex: 0 1 auto;
    padding-left: 0;
    font-size: var(--text-size-xl);
    font-variation-settings: var(--font-variation-heading-md);
    line-height: 1.3;
    letter-spacing: 0.03em;
    overflow-wrap: anywhere;
    white-space: normal;
  }

  .ds-img-title-toolbar:not([data-storybook-breakpoint='base']) .ds-img-title-toolbar__menu--web {
    flex: none;
    width: auto;
  }
}

.ds-img-title-toolbar[data-storybook-breakpoint='base'] {
  flex-direction: column;
  width: 100%;
  min-width: min(288px, 100%);
  min-height: 128px;
  padding: var(--space-2);
  border-radius: var(--radius-xxlg);
}

.ds-img-title-toolbar[data-storybook-breakpoint='base'] .ds-img-title-toolbar__title {
  flex: 1 1 auto;
  padding-left: var(--space-4);
  font-size: var(--text-size-lg);
  font-variation-settings: var(--font-variation-heading-base);
  line-height: 1.45;
  letter-spacing: 0.01em;
  overflow-wrap: break-word;
  white-space: normal;
}

.ds-img-title-toolbar[data-storybook-breakpoint='base'] .ds-img-title-toolbar__header {
  display: grid;
}

.ds-img-title-toolbar[data-storybook-breakpoint='min-768'] {
  flex-direction: row;
  width: fit-content;
  min-width: 0;
  max-width: min(924px, 100%);
  min-height: 74px;
  padding: var(--space-3) var(--space-3) var(--space-3) var(--space-6);
  gap: var(--space-3);
  border-radius: var(--radius-xxxlg);
}

.ds-img-title-toolbar[data-storybook-breakpoint='min-768'] .ds-img-title-toolbar__header {
  display: flex;
  gap: var(--space-3);
}

.ds-img-title-toolbar[data-storybook-breakpoint='min-768'] .ds-img-title-toolbar__title {
  flex: 0 1 auto;
  padding-left: 0;
  font-size: var(--text-size-xl);
  font-variation-settings: var(--font-variation-heading-md);
  line-height: 1.3;
  letter-spacing: 0.03em;
  overflow-wrap: anywhere;
  white-space: normal;
}

.ds-img-title-toolbar[data-storybook-breakpoint='min-768'] .ds-img-title-toolbar__menu--web {
  flex: none;
  width: auto;
}

.ds-img-title-toolbar.ds-img-title-toolbar--single-row {
  width: fit-content;
  min-height: 66px;
}

.ds-img-title-toolbar.ds-img-title-toolbar--single-row .ds-img-title-toolbar__header {
  display: flex;
}

.ds-img-title-toolbar--single-row .ds-img-title-toolbar__title,
.ds-img-title-toolbar--single-row .ds-img-title-toolbar__menu--base {
  flex: none;
  white-space: nowrap;
}

.ds-img-title-toolbar--without-zoom .ds-img-title-toolbar__header {
  grid-template-columns: minmax(0, 1fr);
}

.ds-img-title-toolbar.ds-img-title-toolbar--without-zoom .ds-img-title-toolbar__title {
  flex: 1 1 auto;
  padding-left: 0;
  text-align: center;
}
</style>
