import type { HomeCard, HomeFilterId } from "~/types/home-card";

export function parseBadges(badges: string): string[] {
  return badges
    .split(",")
    .map((badge) => badge.trim())
    .filter(Boolean);
}

/** Сортировка по index: 1…6 → три колонки [1][2][3] / [4][5][6]. */
export function sortHomeCards(cards: HomeCard[]): HomeCard[] {
  return [...cards].sort((a, b) => a.index - b.index);
}

export function getVisibleHomeCards(cards: HomeCard[]): HomeCard[] {
  return sortHomeCards(cards).filter((card) => card.show);
}

export function filterHomeCards(
  cards: HomeCard[],
  filter: HomeFilterId,
): HomeCard[] {
  if (filter === "all") return cards;
  return cards.filter((card) => card.directions.includes(filter));
}
