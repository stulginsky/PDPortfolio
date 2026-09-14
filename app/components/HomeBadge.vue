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
  justify-content: center;
  max-width: 100%;
  min-width: 0;
  padding:
    clamp(6.667px, 1.86cqw, 8px)
    clamp(10px, 2.791cqw, 12px);
  border-radius: clamp(26.667px, 7.442cqw, 32px);
  background: var(--surface-default);
  list-style: none;
}

.home-badge__text {
  display: block;
  font-family: var(--text-font-sans);
  font-size: clamp(10px, 2.791cqw, 12px);
  font-weight: var(--text-weight-semibold);
  font-variation-settings: var(--font-variation-body-accent-semibold);
  line-height: 1.1;
  letter-spacing: 0;
  color: var(--text-default);
  transform: none;
}

.home-badge--truncate .home-badge__text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
}

</style>
