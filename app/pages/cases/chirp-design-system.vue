<script setup lang="ts">
useSiteHead("Chirp Design System");
</script>

<template>
  <main class="design-system-placeholder">
    <NuxtLink to="/" class="design-system-placeholder__back">← К проектам</NuxtLink>
    <h1>Chirp Design System</h1>
    <p>тут будет ДС</p>
  </main>
</template>

<style scoped>
.design-system-placeholder {
  display: grid;
  min-height: 100vh;
  place-content: center;
  gap: var(--space-4);
  padding: var(--space-8);
  text-align: center;
}

.design-system-placeholder h1,
.design-system-placeholder p { margin: 0; }
.design-system-placeholder h1 { font-size: var(--ds-text-size-2xl); }
.design-system-placeholder__back { color: var(--ds-text-action); }
</style>
