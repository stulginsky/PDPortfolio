import type { HomeCard } from "~/types/home-card";

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

/** Номер колонки (1…columnCount) для карточки по index. */
export function getCardColumn(index: number, columnCount: number): number {
  return ((index - 1) % columnCount) + 1;
}

/** Номер ряда (1, 2, …) внутри колонки. */
export function getCardRow(index: number, columnCount: number): number {
  return Math.floor((index - 1) / columnCount) + 1;
}

/** Карточки одной колонки, сверху вниз по index. */
export function getCardsInColumn(
  cards: HomeCard[],
  column: number,
  columnCount: number,
): HomeCard[] {
  return cards
    .filter((card) => getCardColumn(card.index, columnCount) === column)
    .sort((a, b) => a.index - b.index);
}

/** index из координат сетки (удобно при правке JSON). */
export function indexFromPlacement(
  column: number,
  row: number,
  columnCount = 3,
): number {
  return (row - 1) * columnCount + column;
}
