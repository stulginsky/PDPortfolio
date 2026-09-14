<script setup lang="ts">
import homeCardsData from "#content/home-cards.json";
import type { HomeCard, HomeFilterId } from "~/types/home-card";
import { filterHomeCards, getVisibleHomeCards } from "~/utils/home-cards";

const activeFilter = ref<HomeFilterId>("all");
const homeCards = getVisibleHomeCards(homeCardsData as HomeCard[]);
const filteredCards = computed(() => filterHomeCards(homeCards, activeFilter.value));
const gridRef = ref<HTMLElement | null>(null);
const gridColumns = ref(4);
const cardSafeHeights = ref<Record<string, number>>({});

const rowSafeHeights = computed<Record<string, number>>(() => {
  const rowHeights = new Map<number, number>();
  const columns = gridColumns.value;

  filteredCards.value.forEach((card, index) => {
    const rowIndex = Math.floor(index / columns);
    const safeHeight = cardSafeHeights.value[card.href] ?? 0;

    rowHeights.set(rowIndex, Math.max(rowHeights.get(rowIndex) ?? 0, safeHeight));
  });

  return Object.fromEntries(filteredCards.value.map((card, index) => [
    card.href,
    rowHeights.get(Math.floor(index / columns)) ?? 0,
  ]));
});

function updateCardSafeHeight(cardHref: string, height: number) {
  if (cardSafeHeights.value[cardHref] === height) return;

  cardSafeHeights.value = {
    ...cardSafeHeights.value,
    [cardHref]: height,
  };
}

function updateGridColumns() {
  const grid = gridRef.value;
  if (!grid) return;

  const columns = Number.parseInt(
    window.getComputedStyle(grid).getPropertyValue("--showcase-columns"),
    10,
  );

  if (columns > 0) gridColumns.value = columns;
}

watch(filteredCards, (cards) => {
  const visibleCardHrefs = new Set(cards.map((card) => card.href));

  cardSafeHeights.value = Object.fromEntries(
    Object.entries(cardSafeHeights.value)
      .filter(([cardHref]) => visibleCardHrefs.has(cardHref)),
  );
});

let gridResizeObserver: ResizeObserver | undefined;

onMounted(() => {
  const grid = gridRef.value;
  if (!grid) return;

  gridResizeObserver = new ResizeObserver(updateGridColumns);
  gridResizeObserver.observe(grid);
  updateGridColumns();
});

onBeforeUnmount(() => gridResizeObserver?.disconnect());

useSiteHead();
</script>

<template>
  <main class="home-showcase">
    <div class="home-showcase__inner">
      <HomeShowcaseHeader
        :active-filter="activeFilter"
        @select-filter="activeFilter = $event"
      />

      <section ref="gridRef" class="home-showcase__grid" aria-label="Проекты">
        <HomeProjectCard
          v-for="card in filteredCards"
          :key="card.href"
          :card="card"
          :row-safe-height="rowSafeHeights[card.href]"
          @safe-height="updateCardSafeHeight(card.href, $event)"
        />
        <p v-if="filteredCards.length === 0" class="home-showcase__empty">
          Кейсов этого направления пока нет.
        </p>
      </section>
    </div>

    <SiteFooter />
  </main>
</template>

<style scoped>
.home-showcase {
  min-height: 100vh;
  background: var(--surface-default);
}

.home-showcase__inner {
  width: 100%;
  max-width: 1920px;
  margin: 0 auto;
  padding: 0 var(--space-6);
  box-sizing: border-box;
}

.home-showcase__grid {
  display: grid;
  --showcase-columns: 4;
  width: 100%;
  max-width: 1792px;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 24px;
  align-items: start;
  justify-items: center;
  margin: var(--space-12) auto 0;
}

.home-showcase__empty {
  grid-column: 1 / -1;
  margin: 0;
  padding: var(--space-16) 0;
  color: var(--text-muted);
  text-align: center;
}

@media (max-width: 1440px) {
  .home-showcase__grid {
    --showcase-columns: 3;
    max-width: 1338px;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 1169px) {
  .home-showcase__grid {
    --showcase-columns: 2;
    max-width: 884px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 787px) {
  .home-showcase__grid {
    --showcase-columns: 1;
    max-width: 430px;
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 405px) {
  .home-showcase__inner {
    padding-right: var(--space-3);
    padding-left: var(--space-3);
  }
}

</style>
