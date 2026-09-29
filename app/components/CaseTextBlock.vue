<script setup lang="ts">
defineOptions({ inheritAttrs: false });
</script>

<template>
  <section class="case-text-block" v-bind="$attrs">
    <header v-if="$slots.title" class="case-text-block__title">
      <slot name="title" />
    </header>
    <div v-if="$slots.default" class="case-text-block__content">
      <slot />
    </div>
    <div v-if="$slots.accent" class="case-text-block__accent">
      <slot name="accent" />
    </div>
    <div v-if="$slots.conclusion" class="case-text-block__conclusion">
      <slot name="conclusion" />
    </div>
  </section>
</template>

<style scoped>
.case-text-block {
  display: grid;
  gap: var(--case-text-block-gap);
  width: 100%;
}

.case-text-block :deep(h2),
.case-text-block :deep(h3),
.case-text-block :deep(p) {
  margin: 0;
}

.case-text-block__title :deep(h2),
.case-text-block__content :deep(h2) {
  color: var(--accent-aubergine);
  font-size: var(--case-heading-size);
  font-weight: var(--text-weight-semibold);
  font-variation-settings: var(--font-variation-heading-xl-semibold);
  letter-spacing: -0.005em;
  line-height: var(--case-heading-line-height);
}

.case-text-block__content {
  display: grid;
  gap: var(--case-text-block-gap);
}

.case-text-block__content :deep(p),
.case-text-block__conclusion :deep(p) {
  color: var(--text-default);
  font-size: var(--case-body-size);
  font-weight: var(--case-body-weight);
  font-variation-settings: var(--case-body-variation);
  letter-spacing: 0.01em;
  line-height: 1.6;
}

.case-text-block__content :deep(h3) {
  margin-top: var(--space-4);
  font-size: var(--case-subheading-size);
  font-weight: var(--text-weight-semibold);
  font-variation-settings: var(--font-variation-heading-xl-semibold);
  line-height: var(--case-subheading-line-height);
}

.case-text-block__accent :deep(p) {
  color: var(--text-accent-chirp);
  font-size: var(--case-accent-size);
  font-weight: var(--text-weight-light);
  font-variation-settings: var(--font-variation-body-accent);
  letter-spacing: 0.03em;
  line-height: 1.6;
}
</style>
