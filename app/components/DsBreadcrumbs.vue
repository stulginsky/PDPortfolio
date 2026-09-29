<script setup lang="ts">
/**
 * DsBreadcrumbs — DS component 317:2055 (Breadcrumbs)
 * https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=317-2055
 *
 * Single breadcrumb item. DS/Body/base; h=26, no padding constraint.
 * States: Default text/muted · Hover text/link-hover · ActivePressed text/link-pressed · Toggled text/secondary.
 * showDot prop renders separator dot before the label.
 * Toggled = current page → rendered as <span>, others as <a> or button.
 */
const props = withDefaults(
  defineProps<{
    label: string
    href?: string
    /** Show leading separator dot (·) */
    showDot?: boolean
    /** Toggled = current, non-interactive */
    toggled?: boolean
  }>(),
  {
    showDot: true,
    toggled: false,
  },
)

defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<template>
  <span class="ds-breadcrumbs">
    <span v-if="showDot" class="ds-breadcrumbs__dot" aria-hidden="true">·</span>

    <!-- Toggled: current page, non-interactive -->
    <span
      v-if="toggled"
      class="ds-breadcrumbs__item ds-breadcrumbs__item--toggled"
      aria-current="page"
    >
      <TypoText :content="label" />
    </span>

    <!-- Link -->
    <a
      v-else-if="href"
      :href="href"
      class="ds-breadcrumbs__item ds-breadcrumbs__item--link"
      @click="$emit('click', $event)"
    >
      <TypoText :content="label" />
    </a>

    <!-- Button (no href) -->
    <button
      v-else
      type="button"
      class="ds-breadcrumbs__item ds-breadcrumbs__item--link"
      @click="$emit('click', $event)"
    >
      <TypoText :content="label" />
    </button>
  </span>
</template>

<style scoped>
/* Breadcrumbs — DS 317:2055 */
.ds-breadcrumbs {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 26px;
}

.ds-breadcrumbs__dot {
  font-family: var(--text-font-sans);
  font-size: var(--text-size-base); /* DS/Body/base 16px */
  font-weight: var(--text-weight-regular);
  font-variation-settings: "wght" 400, "GRAD" 0, "XOPQ" 96, "XTRA" 468,
    "YOPQ" 79, "YTAS" 750, "YTDE" -203, "YTFI" 738, "YTLC" 514, "YTUC" 712,
    "wdth" 100;
  color: var(--text-muted);
  line-height: 1;
  user-select: none;
}

.ds-breadcrumbs__item {
  display: inline-flex;
  align-items: center;
  font-family: var(--text-font-sans);
  font-size: var(--text-size-base); /* DS/Body/base 16px */
  font-weight: var(--text-weight-regular);
  font-variation-settings: "wght" 400, "GRAD" 0, "XOPQ" 96, "XTRA" 468,
    "YOPQ" 79, "YTAS" 750, "YTDE" -203, "YTFI" 738, "YTLC" 514, "YTUC" 712,
    "wdth" 100;
  line-height: 1.5;
  text-decoration: none;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}

/* Default → text/muted */
.ds-breadcrumbs__item--link {
  color: var(--text-muted);
}

/* Hover → text/link-hover */
.ds-breadcrumbs__item--link:hover:not(:active) {
  color: var(--text-link-hover);
}

/* ActivePressed → text/link-pressed */
.ds-breadcrumbs__item--link:active {
  color: var(--text-link-pressed);
}

/* Focus */
.ds-breadcrumbs__item--link:focus-visible {
  outline: 2px solid var(--border-focus);
  outline-offset: 2px;
  border-radius: 2px;
}

/* Toggled → text/secondary, no cursor */
.ds-breadcrumbs__item--toggled {
  color: var(--text-secondary);
  cursor: default;
}
</style>
