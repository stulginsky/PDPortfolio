<script setup lang="ts">
/**
 * DsTopNav — DS component 1025:7335 (TopNav)
 * https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=1025-7335
 *
 * Sticky navigation bar. Composed from TopNavScroll/Vitrina (1025:5059) and TopNavScroll/Resume (1047:4060).
 *
 * Place=Vitrina breakpoints (min-width):
 *   base (<394px): 320×82, full-width
 *   min-394 (394–767px): 394×82
 *   min-768 (≥768px): 394×90 — web composition
 *
 * Place=Resume breakpoints:
 *   base (<534px): 320×164, full-width, 2-row layout
 *   min-534 (534–767px): 534×82, 1-row
 *   min-768 (≥768px): 534×90, web composition
 *
 * The slot composition (avatar, filters, nav, etc.) is injected by the consumer.
 * DsTopNav provides only the sticky shell: background, height, position, z-index.
 */
withDefaults(
  defineProps<{
    /** Which page context */
    place?: 'Vitrina' | 'Resume'
  }>(),
  {
    place: 'Vitrina',
  },
)
</script>

<template>
  <header
    class="ds-top-nav"
    :class="[`ds-top-nav--${place.toLowerCase()}`]"
    role="banner"
  >
    <slot />
  </header>
</template>

<style scoped>
/* TopNav — DS 1025:7335 */
/* Shared: sticky, full-width */
.ds-top-nav {
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 300;
  display: flex;
  align-items: center;
  width: 100%;
  background: var(--surface-default);
  /* Subtle bottom separator to distinguish from content */
  border-bottom: 1px solid var(--border-default);
  /* Glass effect on scroll */
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

/* ── Vitrina ─────────────────────────────── */
/* base (<394px): h=82 */
.ds-top-nav--vitrina {
  height: 82px;
  padding: 0 16px;
}

/* min-394: 394px wide, h=82 */
@media (min-width: 394px) {
  .ds-top-nav--vitrina {
    height: 82px;
    padding: 0 24px;
  }
}

/* min-768: web composition, h=90 */
@media (min-width: 768px) {
  .ds-top-nav--vitrina {
    height: 90px;
    padding: 0 32px;
  }
}

/* ── Resume ──────────────────────────────── */
/* base (<534px): h=164, 2-row layout */
.ds-top-nav--resume {
  height: 164px;
  flex-wrap: wrap;
  padding: 0 16px;
}

/* min-534: 1-row, h=82 */
@media (min-width: 534px) {
  .ds-top-nav--resume {
    height: 82px;
    flex-wrap: nowrap;
    padding: 0 24px;
  }
}

/* min-768: web composition, h=90 */
@media (min-width: 768px) {
  .ds-top-nav--resume {
    height: 90px;
    padding: 0 32px;
  }
}
</style>
