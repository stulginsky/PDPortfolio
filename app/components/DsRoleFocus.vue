<script setup lang="ts">
/**
 * DsRoleFocus — DS component 1107:7326 (Role-Focus)
 * https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=1107-7326
 *
 * Case role/focus info block. Two responsive breakpoints.
 * Non-interactive; Hug height.
 *
 * base (<425px): vertical layout, each pair stacked; DS/Heading/lg label + DS/Body/base value
 * min-425 (>=425px): horizontal layout, label column 116px; DS/Heading/lg label + DS/Body/md value
 *
 * All text: text/secondary (gray-700).
 */
defineProps<{
  role: string
  focus: string
}>()
</script>

<template>
  <div class="ds-role-focus">
    <div class="ds-role-focus__row">
      <span class="ds-role-focus__label">My role</span>
      <span class="ds-role-focus__value">{{ role }}</span>
    </div>
    <div class="ds-role-focus__row">
      <span class="ds-role-focus__label">Case focus</span>
      <span class="ds-role-focus__value">{{ focus }}</span>
    </div>
  </div>
</template>

<style scoped>
/* Role-Focus — DS 1107:7326 */
.ds-role-focus {
  display: flex;
  flex-direction: column;
  gap: var(--space-3); /* 12px between rows */
  color: var(--text-secondary); /* gray-700 */
}

.ds-role-focus__row {
  display: flex;
  flex-direction: column; /* base: vertical */
  gap: 0;
}

.ds-role-focus__label {
  font-family: var(--text-font-sans);
  font-size: var(--text-size-xl); /* DS/Heading/lg — 22px */
  font-weight: var(--text-weight-semibold); /* 600 */
  font-variation-settings: "wght" 600, "GRAD" 0, "XOPQ" 96, "XTRA" 468,
    "YOPQ" 25, "YTAS" 750, "YTDE" -203, "YTFI" 738, "YTLC" 514, "YTUC" 712,
    "wdth" 100;
  line-height: 1.3;
  letter-spacing: 0;
}

.ds-role-focus__value {
  font-family: var(--text-font-sans);
  font-size: var(--text-size-base); /* base: DS/Body/base — 16px */
  font-weight: var(--text-weight-regular); /* 400 */
  font-variation-settings: "wght" 400, "GRAD" 0, "XOPQ" 96, "XTRA" 468,
    "YOPQ" 79, "YTAS" 750, "YTDE" -203, "YTFI" 738, "YTLC" 514, "YTUC" 712,
    "wdth" 100;
  line-height: 1.6; /* 160% */
  letter-spacing: 0;
}

/* min-425: horizontal layout */
@media (min-width: 425px) {
  .ds-role-focus__row {
    flex-direction: row;
    gap: var(--space-3); /* 12px between label col and value */
  }

  .ds-role-focus__label {
    flex: 0 0 116px; /* fixed label column */
    width: 116px;
    min-width: 116px;
  }

  .ds-role-focus__value {
    flex: 1;
    font-size: var(--text-size-lg-plus); /* min-425: DS/Body/md — 20px */
    font-weight: var(--text-weight-light); /* 300 */
    font-variation-settings: "wght" 300, "GRAD" 0, "XOPQ" 96, "XTRA" 468,
      "YOPQ" 79, "YTAS" 750, "YTDE" -203, "YTFI" 738, "YTLC" 514, "YTUC" 712,
      "wdth" 100;
  }
}
</style>
