<script setup lang="ts">
import homeCardsData from "#content/home-cards.json";
import type { HomeCard, HomeFilterId } from "~/types/home-card";
import { filterHomeCards, getVisibleHomeCards } from "~/utils/home-cards";

const activeFilter = ref<HomeFilterId>("all");
const homeCards = getVisibleHomeCards(homeCardsData as HomeCard[]);
const filteredCards = computed(() => filterHomeCards(homeCards, activeFilter.value));

useSiteHead();
</script>

<template>
  <main class="home-showcase">
    <div class="home-showcase__inner">
      <HomeShowcaseHeader
        :active-filter="activeFilter"
        @select-filter="activeFilter = $event"
      />

      <section class="home-showcase__grid" aria-label="Проекты">
        <HomeProjectCard
          v-for="card in filteredCards"
          :key="card.href"
          :card="card"
        />
        <p v-if="filteredCards.length === 0" class="home-showcase__empty">
          Кейсов этого направления пока нет.
        </p>
      </section>
    </div>
  </main>
</template>

<style scoped>
.home-showcase {
  min-height: 100vh;
  background: var(--surface-default);
}

.home-showcase__inner {
  width: 100%;
  padding: 0 var(--space-6) var(--space-16);
}

.home-showcase__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--space-6);
  margin-top: var(--space-12);
}

.home-showcase__empty {
  grid-column: 1 / -1;
  margin: 0;
  padding: var(--space-16) 0;
  color: var(--text-muted);
  text-align: center;
}

</style>
