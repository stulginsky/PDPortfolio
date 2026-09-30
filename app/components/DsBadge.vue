<script setup lang="ts">
/**
 * Badge — DS component 312:1991
 * https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=312-1991
 *
 * Props:
 *   label   — text content (TEXT override Text#312:0)
 *   type    — 'Card' | 'HeroChirp' | 'CardCompact'  (VARIANT Type)
 *
 * Non-interactive; no states, no transitions.
 * Generic inline element. A consumer that renders a list owns its <li>.
 */
const props = withDefaults(
  defineProps<{
    label: string
    /** DS variant: Card (default) / HeroChirp / CardCompact */
    type?: 'Card' | 'HeroChirp' | 'CardCompact'
  }>(),
  {
    type: 'Card',
  },
)
</script>

<template>
  <span class="ds-badge" :class="`ds-badge--${type.toLowerCase()}`">
    <TypoText :content="label" class="ds-badge__text" />
  </span>
</template>

<style scoped>
/* Base — shared geometry */
.ds-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  max-width: 100%;
  min-width: 0;
  color: var(--text-default);
}

/* Type=Card — DS/Body/xs strong, 94×29, pad 8/12, radius 32, bg surface/default */
.ds-badge--card {
  padding: 8px 12px;
  border-radius: var(--radius-xxlg); /* 32px */
  background: var(--surface-default);
}

.ds-badge--card .ds-badge__text {
  font-family: var(--text-font-sans);
  font-size: var(--text-size-xs); /* 12px */
  font-weight: var(--text-weight-semibold); /* 600 */
  font-variation-settings: "wght" 600, "GRAD" 0, "XOPQ" 96, "XTRA" 468,
    "YOPQ" 79, "YTAS" 750, "YTDE" -203, "YTFI" 738, "YTLC" 514, "YTUC" 712,
    "wdth" 100;
  line-height: 1.1;
  letter-spacing: 0;
}

/* Type=HeroChirp — DS/Body/base strong, 123×40, pad 8/16, radius 32, bg surface/badge-chirp */
.ds-badge--herochirp {
  padding: 8px 16px;
  border-radius: var(--radius-xxlg); /* 32px */
  background: var(--surface-badge-chirp); /* accent/mint */
}

.ds-badge--herochirp .ds-badge__text {
  font-family: var(--text-font-sans);
  font-size: var(--text-size-base); /* 16px */
  font-weight: var(--text-weight-semibold); /* 600 */
  font-variation-settings: "wght" 600, "GRAD" 0, "XOPQ" 96, "XTRA" 468,
    "YOPQ" 79, "YTAS" 750, "YTDE" -203, "YTFI" 738, "YTLC" 514, "YTUC" 712,
    "wdth" 100;
  line-height: 1.5;
  letter-spacing: 0.005em;
}

/* Type=CardCompact — DS/Badge/Card/min, 79×24.33, coeff 5/6, pad 6.67/10, radius 26.67 */
.ds-badge--cardcompact {
  padding: 6.667px 10px;
  border-radius: 26.667px;
  background: var(--surface-default);
}

.ds-badge--cardcompact .ds-badge__text {
  font-family: var(--text-font-sans);
  font-size: var(--text-size-badge-card-min); /* 10px */
  font-weight: var(--text-weight-semibold); /* 600 */
  font-variation-settings: "wght" 600, "GRAD" 0, "XOPQ" 96, "XTRA" 468,
    "YOPQ" 79, "YTAS" 750, "YTDE" -203, "YTFI" 738, "YTLC" 514, "YTUC" 712,
    "wdth" 100;
  line-height: 1.1;
  letter-spacing: 0;
}

/* Shared text element */
.ds-badge__text {
  display: block;
  color: inherit;
}

</style>
