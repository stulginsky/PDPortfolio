<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    label: string;
    /** Одна строка; при переполнении — многоточие. Полный текст в title. */
    truncate?: boolean;
  }>(),
  {
    truncate: true,
  },
);
</script>

<template>
  <li
    class="home-badge"
    :class="{ 'home-badge--truncate': truncate }"
  >
    <TypoText
      :content="label"
      class="home-badge__text"
      :title="truncate ? label : undefined"
    />
  </li>
</template>

<style scoped>
.home-badge {
  display: inline-flex;
  align-items: center;
  max-width: 100%;
  min-width: 0;
  padding: 8px 12px;
  border-radius: 32px;
  background: var(--surface-default);
  list-style: none;
}

.home-badge__text {
  font-family: var(--font-sans);
  font-size: 12px;
  font-weight: var(--ds-font-weight-semibold);
  font-variation-settings: var(--font-variation-body-accent-semibold);
  line-height: 1.1;
  letter-spacing: 0;
  color: var(--text-default);
}

.home-badge--truncate .home-badge__text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
}

</style>
