<script setup lang="ts">
import { computed } from 'vue'
import DsDropdownFilter from './DsDropdownFilter.vue'
import DsFilter from './DsFilter.vue'
import DsFullscreenMenuMob from './DsFullscreenMenuMob.vue'

const filterItems = [
  { label: 'Все кейсы', value: 'all' },
  { label: 'Продукт', value: 'product' },
  { label: 'UX', value: 'ux' },
  { label: 'Дизайн система', value: 'design-system' },
  { label: 'Брендинг', value: 'branding' },
  { label: 'Креатив', value: 'creative' },
  { label: 'Jewelry', value: 'jewelry' },
  { label: 'Gamedev', value: 'gamedev' },
  { label: 'Видео', value: 'video' },
  { label: 'Упаковка', value: 'packaging' },
] as const

type FilterValue = (typeof filterItems)[number]['value']

const props = withDefaults(
  defineProps<{
    /** The single selected portfolio category. */
    modelValue?: FilterValue
    /** Accessible label for every breakpoint composition. */
    ariaLabel?: string
  }>(),
  {
    modelValue: 'all',
    ariaLabel: 'Фильтры портфолио',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: FilterValue]
  change: [value: FilterValue]
}>()

const priorityItems = filterItems.slice(0, 7)
const overflowItems = filterItems.slice(7)
const overflowLabels = overflowItems.map((item) => item.label)

const selectedValue = computed({
  get: () => props.modelValue,
  set: (value: FilterValue) => {
    emit('update:modelValue', value)
    emit('change', value)
  },
})

const selectedOverflowLabel = computed(() => {
  const item = overflowItems.find((candidate) => candidate.value === selectedValue.value)
  return item?.label ?? null
})

const mobileMenuValue = computed(() =>
  selectedValue.value === 'all' ? null : selectedValue.value,
)

function select(value: FilterValue) {
  selectedValue.value = value
}

function selectOverflow(label: string | null) {
  const item = overflowItems.find((candidate) => candidate.label === label)
  if (item) select(item.value)
}

function selectMobile(value: string | null) {
  const item = filterItems.find((candidate) => candidate.value === value)
  if (item) select(item.value)
}
</script>

<template>
  <nav class="ds-filters" :aria-label="ariaLabel">
    <div class="ds-filters__mobile">
      <DsFullscreenMenuMob
        :items="filterItems"
        :model-value="mobileMenuValue"
        placeholder="Продукт · Креатив · Бренд & ..."
        aria-label="Выбрать категорию"
        :toggled="selectedValue !== 'all'"
        @update:model-value="selectMobile"
      />
    </div>

    <div class="ds-filters__tablet" role="group" :aria-label="ariaLabel">
      <div class="ds-filters__priority-row">
        <DsFilter
          v-for="item in priorityItems"
          :key="item.value"
          :label="item.label"
          :toggled="selectedValue === item.value"
          @click="select(item.value)"
        />
      </div>
      <DsDropdownFilter
        class="ds-filters__overflow"
        :items="overflowLabels"
        :model-value="selectedOverflowLabel"
        :show-icons="false"
        lock-initial-width
        @update:model-value="selectOverflow"
      />
    </div>

    <div class="ds-filters__desktop" role="group" :aria-label="ariaLabel">
      <DsFilter
        v-for="item in filterItems"
        :key="item.value"
        :label="item.label"
        :toggled="selectedValue === item.value"
        @click="select(item.value)"
      />
    </div>
  </nav>
</template>

<style scoped>
/* Filters — DS 1021:3477 */
.ds-filters {
  width: 100%;
}

.ds-filters__mobile,
.ds-filters__tablet,
.ds-filters__desktop {
  display: none;
}

.ds-filters__mobile {
  display: flex;
  justify-content: center;
  width: min(288px, calc(100vw - 32px));
  margin: 0 auto;
}

@media (min-width: 1024px) {
  .ds-filters__mobile {
    display: none;
  }

  .ds-filters__tablet {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-3);
  }

  .ds-filters__priority-row {
    display: flex;
    align-items: center;
    gap: var(--space-4);
  }

}

@media (min-width: 1280px) {
  .ds-filters__tablet {
    display: none;
  }

  .ds-filters__desktop {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-4);
  }
}

/* Storybook Sandbox selects a documented Figma variant on the real component.
   Production never supplies this preview-only data attribute. */
.ds-filters[data-storybook-breakpoint='base'] .ds-filters__mobile {
  display: flex;
}

.ds-filters[data-storybook-breakpoint='base'] .ds-filters__tablet,
.ds-filters[data-storybook-breakpoint='base'] .ds-filters__desktop,
.ds-filters[data-storybook-breakpoint='min-1024'] .ds-filters__mobile,
.ds-filters[data-storybook-breakpoint='min-1024'] .ds-filters__desktop,
.ds-filters[data-storybook-breakpoint='min-1280'] .ds-filters__mobile,
.ds-filters[data-storybook-breakpoint='min-1280'] .ds-filters__tablet {
  display: none;
}

.ds-filters[data-storybook-breakpoint='min-1024'] .ds-filters__tablet {
  display: flex;
}

.ds-filters[data-storybook-breakpoint='min-1280'] .ds-filters__desktop {
  display: flex;
}
</style>
