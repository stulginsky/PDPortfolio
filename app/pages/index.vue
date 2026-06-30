<script setup lang="ts">
import homeCardsData from "#content/home-cards.json";
import type { HomeCard } from "~/types/home-card";
import { getCardsInColumn, getVisibleHomeCards } from "~/utils/home-cards";

const homeCards = getVisibleHomeCards(homeCardsData as HomeCard[]);

const columnCount = ref(3);

function updateColumnCount() {
  if (typeof window === "undefined") return;
  const width = window.innerWidth;
  columnCount.value = width <= 720 ? 1 : width <= 1100 ? 2 : 3;
}

onMounted(() => {
  updateColumnCount();
  window.addEventListener("resize", updateColumnCount, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener("resize", updateColumnCount);
});

useSiteHead();
</script>

<template>
  <main class="home">
    <div class="home__inner">
      <SiteHero
        :key="$route.path"
        active-tab="projects"
      />

      <section class="cards-masonry" aria-label="Проекты">
        <div
          v-for="col in columnCount"
          :key="col"
          class="cards-masonry__col"
        >
          <div
            v-for="card in getCardsInColumn(homeCards, col, columnCount)"
            :key="card.index"
            class="cards-masonry__item"
          >
            <HomeProjectCard :card="card" />
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
.home {
  min-height: 100vh;
  background: var(--surface-default);
}

.home__inner {
  max-width: var(--page-max);
  margin: 0 auto;
  padding: var(--space-hero-y) var(--space-page-x);
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
}

.cards-masonry {
  display: flex;
  align-items: flex-start;
  gap: var(--card-column-gap);
}

.cards-masonry__col {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: var(--card-column-gap);
}

@media (max-width: 720px) {
  .home__inner {
    padding: var(--space-8) var(--space-4);
  }
}
</style>
