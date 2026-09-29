<script setup lang="ts">
/**
 * Badge — DS component 312:1991
 * https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=312-1991
 *
 * Props:
 *   label   — text content (TEXT override Text#312:0)
 *   type    — 'Card' | 'HeroChirp' | 'CardCompact'  (VARIANT Type)
 *   truncate — single-line overflow ellipsis (default: true)
 *
 * Non-interactive; no states, no transitions.
 * aria-hidden if used purely decoratively; caller decides.
 */
const props = withDefaults(
  defineProps<{
    label: string
    /** DS variant: Card (default) / HeroChirp / CardCompact */
    type?: 'Card' | 'HeroChirp' | 'CardCompact'
    /** Single line; overflow → ellipsis. Full text in title. */
    truncate?: boolean
  }>(),
  {
    type: 'Card',
    truncate: true,
  },
)
</script>

<template>
  <li
    class="home-badge"
    :class="[`home-badge--${type.toLowerCase()}`, { 'home-badge--truncate': truncate }]"
  >
    <TypoText
      :content="label"
      class="home-badge__text"
      :title="truncate ? label : undefined"
    />
  </li>
</template>

<style scoped>
/* Base — shared geometry */
.home-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  max-width: 100%;
  min-width: 0;
  list-style: none;
  color: var(--text-default);
}

/* Type=Card — DS/Body/xs strong, 94×29, pad 8/12, radius 16, bg surface/default */
.home-badge--card {
  padding: 8px 12px;
  border-radius: var(--radius-lg); /* 16px */
  background: var(--surface-default);
}

.home-badge--card .home-badge__text {
  font-family: var(--text-font-sans);
  font-size: var(--text-size-xs); /* 12px */
  font-weight: var(--text-weight-semibold); /* 600 */
  font-variation-settings: "wght" 600, "GRAD" 0, "XOPQ" 96, "XTRA" 468,
    "YOPQ" 79, "YTAS" 750, "YTDE" -203, "YTFI" 738, "YTLC" 514, "YTUC" 712,
    "wdth" 100;
  line-height: 1.1;
  letter-spacing: 0;
}

/* Type=HeroChirp — DS/Body/base strong, 123×40, pad 8/16, radius 24, bg surface/badge-chirp */
.home-badge--herochirp {
  padding: 8px 16px;
  border-radius: var(--radius-xlg); /* 24px */
  background: var(--surface-badge-chirp); /* accent/mint */
}

.home-badge--herochirp .home-badge__text {
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
.home-badge--cardcompact {
  padding: 6.667px 10px;
  border-radius: 26.667px;
  background: var(--surface-default);
}

.home-badge--cardcompact .home-badge__text {
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
.home-badge__text {
  display: block;
  color: inherit;
}

.home-badge--truncate .home-badge__text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
}
</style>
