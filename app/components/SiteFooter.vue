<script setup lang="ts">
import siteData from "#content/site.json";
import type { SiteContent } from "~/types/site";

const site = siteData as SiteContent;
</script>

<template>
  <footer class="site-footer">
    <div class="site-footer__content">
      <TypoText :content="site.footerCredit" tag="p" class="site-footer__credit" />
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--text-size-base);
  padding: var(--space-16);
  box-sizing: border-box;
}

.site-footer__content {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-16);
  box-sizing: border-box;
}

.site-footer__credit {
  margin: 0;
  color: var(--text-muted);
  font-family: var(--text-font-sans);
  font-size: var(--text-size-base);
  font-weight: var(--text-weight-semibold);
  font-variation-settings: var(--font-variation-heading-base);
  line-height: 1.5;
  text-align: center;
  white-space: nowrap;
}
</style>
