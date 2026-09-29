<script setup lang="ts">
/**
 * DsBreadcrumbsOverflow — DS component 1097:4338 (BreadcrumbsOverflow)
 * https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=1097-4338
 *
 * Composite breadcrumbs row for history > 2 cases.
 * Layout: [… (BreadcrumbsMenu)] · [prev] · [current]
 * BreadcrumbsMenu renders as overlay under "…", does not increase layout height.
 *
 * history: all items; last two shown as prev + current; items[0..n-2] go into overflow menu.
 *
 * Contract examples:
 *   Vitrina → A           → only BtnNav/Left, no breadcrumbs (parent handles this)
 *   Vitrina → A → B       → A · B            (2 items, no overflow)
 *   Vitrina → A → B → C  → … · B · C        (3 items, A in overflow menu)
 */
import { computed } from 'vue'
import DsBreadcrumbs from './DsBreadcrumbs.vue'
import DsBreadcrumbsMenu from './DsBreadcrumbsMenu.vue'


interface HistoryItem {
  label: string
  href: string
}

const props = defineProps<{
  /** Full navigation history (Vitrina excluded) */
  history: HistoryItem[]
  /** Current page label */
  currentLabel: string
}>()

defineEmits<{
  select: [item: HistoryItem]
}>()

// Derived
const hasOverflow = computed(() => props.history.length > 1)
const overflowItems = computed(() => props.history.slice(0, -1))
const prevItem = computed(() => props.history[props.history.length - 1])
</script>

<template>
  <nav class="ds-bcr-overflow" aria-label="Хлебные крошки">
    <!-- Overflow trigger: "…" with menu of earlier history items -->
    <DsBreadcrumbsMenu
      v-if="hasOverflow"
      :items="overflowItems"
      @select="$emit('select', $event)"
    />

    <!-- Previous item (second from end) -->
    <DsBreadcrumbs
      v-if="prevItem"
      :label="prevItem.label"
      :href="prevItem.href"
      :show-dot="hasOverflow"
    />

    <!-- Current item (Toggled, no link) -->
    <DsBreadcrumbs
      :label="currentLabel"
      :show-dot="true"
      :toggled="true"
    />
  </nav>
</template>

<style scoped>
/* BreadcrumbsOverflow — DS 1097:4338 */
.ds-bcr-overflow {
  display: inline-flex;
  align-items: center;
  gap: 0;
  height: 26px;
  position: relative; /* stacking context for BreadcrumbsMenu overlay */
}
</style>
