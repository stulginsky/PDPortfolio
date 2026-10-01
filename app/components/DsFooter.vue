<script setup lang="ts">
/**
 * DsFooter — DS component 1094:6423 (Footer)
 * https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=1094-6423
 */
import favicon from '../assets/icons/favicon.svg'
</script>

<template>
  <footer class="ds-footer">
    <div class="ds-footer__content">
      <p class="ds-footer__credit ds-footer__credit--designed">Designed &amp; Developed</p>
      <img class="ds-footer__icon" :src="favicon" alt="" aria-hidden="true" />
      <p class="ds-footer__credit">Constantine Bazarov</p>
    </div>
  </footer>
</template>

<style scoped>
/* Footer — DS 1094:6423 */
.ds-footer {
  display: flex;
  justify-content: center;
  width: 100%;
  padding: var(--space-4);
  box-sizing: border-box;
}

.ds-footer__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  padding: var(--space-16) 0;
}

.ds-footer__credit {
  margin: 0;
  color: var(--text-muted);
  font-family: var(--text-font-sans);
  font-size: var(--text-size-base);
  font-weight: var(--text-weight-semibold);
  font-variation-settings: "wght" 600, "GRAD" 0, "XOPQ" 96, "XTRA" 468,
    "YOPQ" 25, "YTAS" 750, "YTDE" -203, "YTFI" 738, "YTLC" 514,
    "YTUC" 712, "wdth" 100;
  line-height: 1.5;
  white-space: nowrap;
}

.ds-footer__credit--designed {
  text-align: right;
}

.ds-footer__icon {
  display: block;
  width: 24px;
  height: 24px;
}

@media (min-width: 410px) {
  .ds-footer__content {
    flex-direction: row;
  }
}

/* Sandbox-only selection of the documented Figma variant. */
.ds-footer[data-storybook-breakpoint='base'] .ds-footer__content {
  flex-direction: column;
}

.ds-footer[data-storybook-breakpoint='min-410'] .ds-footer__content {
  flex-direction: row;
}
</style>
