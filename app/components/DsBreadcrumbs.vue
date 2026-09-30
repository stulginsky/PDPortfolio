<script setup lang="ts">
/**
 * DsBreadcrumbs — DS component 1097:4338.
 * A generic hierarchy path with an optional parent-navigation control.
 * The Overflow mode composes the canonical BreadcrumbsMenu overlay.
 */
import { computed } from 'vue'
import DsBtnNav from './DsBtnNav.vue'
import DsBreadcrumbsItem from './DsBreadcrumbsItem.vue'
import DsBreadcrumbsMenu from './DsBreadcrumbsMenu.vue'

type BreadcrumbItem = {
  id: string
  label: string
}

const props = withDefaults(
  defineProps<{
    /** Visible child path, including the current item as its final entry; it excludes parent. */
    items?: BreadcrumbItem[]
    /** Default renders the whole path; Overflow hides all but its final two items. */
    mode?: 'Default' | 'Overflow'
    /** Enables the left navigation control and identifies its destination. */
    parent?: BreadcrumbItem
  }>(),
  {
    items: () => [],
    mode: 'Default',
    parent: undefined,
  },
)

const emit = defineEmits<{
  /** A non-current hierarchy item or an overflow-menu item was selected. */
  select: [item: BreadcrumbItem]
  /** The optional parent-navigation control was selected. */
  parent: [item: BreadcrumbItem]
}>()

const pathItems = computed(() => props.parent
  ? props.items.filter(({ id }) => id !== props.parent?.id)
  : props.items,
)
const hasOverflow = computed(() => props.mode === 'Overflow' && pathItems.value.length > 2)
const overflowItems = computed(() => hasOverflow.value ? pathItems.value.slice(0, -2) : [])
const visibleItems = computed(() => hasOverflow.value ? pathItems.value.slice(-2) : pathItems.value)
const currentId = computed(() => pathItems.value.at(-1)?.id)
</script>

<template>
  <nav class="ds-breadcrumbs" aria-label="Breadcrumbs">
    <DsBtnNav
      v-if="parent"
      direction="Left"
      tag="button"
      :aria-label="`Go to ${parent.label}`"
      @click="emit('parent', parent)"
    />

    <span class="ds-breadcrumbs__path">
      <DsBreadcrumbsMenu v-if="hasOverflow" :items="overflowItems" @select="emit('select', $event)" />
      <DsBreadcrumbsItem
        v-for="(item, index) in visibleItems"
        :key="item.id"
        :label="item.label"
        :show-dot="index < visibleItems.length - 1"
        :current="item.id === currentId"
        @click="emit('select', item)"
      />
    </span>
  </nav>
</template>

<style scoped>
.ds-breadcrumbs {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  min-height: 26px;
}

.ds-breadcrumbs__path {
  display: inline-flex;
  align-items: center;
  gap: 0;
}
</style>
