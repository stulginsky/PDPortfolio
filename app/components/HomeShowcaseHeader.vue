<script setup lang="ts">
import avatarUrl from "~/assets/img/konstantin.png";
import arrowUpUrl from "~/assets/icons/arrow-up-nav.svg";
import { HOME_FILTERS, type HomeFilterId } from "~/types/home-card";

defineProps<{ activeFilter: HomeFilterId }>();

const emit = defineEmits<{ selectFilter: [filter: HomeFilterId] }>();
const sentinelRef = ref<HTMLElement | null>(null);
const { isCompact } = useTopNavScroll(sentinelRef);

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
</script>

<template>
  <header class="showcase-header">
    <SiteHero active-tab="projects" :show-compact-nav="false" />

    <nav class="showcase-header__filters" aria-label="Направления работ">
      <button
        v-for="filter in HOME_FILTERS"
        :key="filter.id"
        class="showcase-header__filter"
        :class="{ 'showcase-header__filter--active': activeFilter === filter.id }"
        type="button"
        :aria-pressed="activeFilter === filter.id"
        @click="emit('selectFilter', filter.id)"
      >
        {{ filter.label }}
      </button>
    </nav>

    <div ref="sentinelRef" class="showcase-header__sentinel" aria-hidden="true" />
  </header>

  <div
    class="showcase-header__compact"
    :class="{ 'showcase-header__compact--visible': isCompact }"
  >
    <nav class="showcase-header__compact-tabs" aria-label="Компактная навигация">
      <button type="button" class="showcase-header__avatar-button" aria-label="Наверх" @click="scrollToTop">
        <img :src="avatarUrl" alt="" width="50" height="50">
      </button>
      <NuxtLink to="/" class="showcase-header__tab showcase-header__tab--active">Проекты</NuxtLink>
      <NuxtLink to="/resume" class="showcase-header__tab">Резюме</NuxtLink>
    </nav>

    <nav class="showcase-header__compact-filters" aria-label="Направления работ">
      <button
        v-for="filter in HOME_FILTERS"
        :key="filter.id"
        class="showcase-header__filter"
        :class="{ 'showcase-header__filter--active': activeFilter === filter.id }"
        type="button"
        :aria-pressed="activeFilter === filter.id"
        @click="emit('selectFilter', filter.id)"
      >
        {{ filter.label }}
      </button>
    </nav>
  </div>

  <button
    type="button"
    class="showcase-header__up-button"
    :class="{ 'showcase-header__up-button--visible': isCompact }"
    aria-label="Наверх"
    @click="scrollToTop"
  >
    <img :src="arrowUpUrl" alt="" width="24" height="24">
  </button>
</template>

<style scoped>
.showcase-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-8);
  padding-top: var(--space-16);
}

.showcase-header__filters,
.showcase-header__compact-tabs,
.showcase-header__compact-filters {
  display: flex;
  align-items: center;
}

.showcase-header__filters { gap: var(--space-4); }

.showcase-header__tab,
.showcase-header__filter {
  display: inline-flex;
  min-height: 40px;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: var(--radius-xlg);
  color: var(--ds-text-action);
  background: transparent;
  font: inherit;
  font-size: var(--ds-text-size-base);
  font-weight: var(--ds-font-weight-medium);
  font-variation-settings: var(--font-variation-body-accent-medium);
  line-height: 1.35;
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  transition: color 160ms ease, background-color 160ms ease;
}

.showcase-header__tab { height: 50px; min-height: 50px; padding: 0 var(--space-4); }
.showcase-header__filter { height: 40px; min-height: 40px; padding: var(--space-2) var(--space-4); }

.showcase-header__tab--active,
.showcase-header__filter--active { color: var(--text-inverse); background: var(--ds-surface-action-toggled); }

@media (hover: hover) and (pointer: fine) {
  .showcase-header__tab:hover:not(.showcase-header__tab--active),
  .showcase-header__filter:hover:not(.showcase-header__filter--active) { background: var(--ds-surface-action-hover); }
}

.showcase-header__tab:active,
.showcase-header__filter:active { color: var(--text-inverse); background: var(--ds-surface-action-pressed); }

.showcase-header__sentinel { width: 100%; height: 1px; margin-top: -1px; visibility: hidden; }

.showcase-header__compact {
  position: fixed;
  z-index: 20;
  top: 0;
  left: 50%;
  display: flex;
  width: min(1138px, 100%);
  flex-direction: column;
  align-items: center;
  padding: var(--space-2) var(--space-8) 0;
  border-radius: 12px 12px 64px 64px;
  gap: var(--space-2);
  box-sizing: border-box;
  pointer-events: none;
  opacity: 0;
  transform: translate(-50%, -16px);
  transition: opacity 180ms ease, transform 180ms ease;
}

.showcase-header__compact--visible { pointer-events: auto; opacity: 1; transform: translate(-50%, 0); }

.showcase-header__compact-tabs,
.showcase-header__compact-filters {
  box-shadow: var(--ds-shadow-1st);
  background: var(--surface-default);
}

.showcase-header__compact-tabs { gap: var(--space-6); padding: var(--space-4); border-radius: 48px; }
.showcase-header__compact-filters { justify-content: center; gap: var(--space-4); padding: var(--space-2); border-radius: 48px; }

.showcase-header__avatar-button { display: grid; width: 50px; height: 50px; padding: 0; border: 0; border-radius: 50%; overflow: hidden; background: transparent; cursor: pointer; }
.showcase-header__avatar-button img { width: 100%; height: 100%; object-fit: cover; }

.showcase-header__up-button {
  position: fixed;
  z-index: 20;
  right: var(--space-6);
  bottom: var(--space-6);
  display: grid;
  width: 50px;
  height: 50px;
  padding: 10px;
  border: 0;
  border-radius: var(--ds-radius-xxlg);
  background: var(--surface-raised);
  cursor: pointer;
  pointer-events: none;
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 180ms ease, transform 180ms ease;
}

.showcase-header__up-button--visible {
  pointer-events: auto;
  opacity: 1;
  transform: translateY(0);
}

.showcase-header__up-button img { width: 24px; height: 24px; }

@media (hover: hover) and (pointer: fine) {
  .showcase-header__up-button:hover { background: var(--ds-surface-action-hover); }
}

.showcase-header__up-button:active { background: var(--ds-surface-action-pressed); }

@media (max-width: 720px) {
  .showcase-header { align-items: stretch; gap: var(--space-5); padding-top: var(--space-8); }
  .showcase-header__filters,
  .showcase-header__compact-filters { justify-content: flex-start; width: 100%; overflow-x: auto; scrollbar-width: none; }
  .showcase-header__filters::-webkit-scrollbar,
  .showcase-header__compact-filters::-webkit-scrollbar { display: none; }
  .showcase-header__compact-tabs { max-width: 100%; overflow-x: auto; }
  .showcase-header__up-button { right: var(--space-4); bottom: var(--space-4); }
}

@media (prefers-reduced-motion: reduce) {
  .showcase-header__tab,
  .showcase-header__filter,
  .showcase-header__compact,
  .showcase-header__up-button { transition: none; }
}
</style>
