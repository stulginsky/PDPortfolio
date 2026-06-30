<script setup lang="ts">
import type { HomeCard } from "~/types/home-card";
import { parseBadges } from "~/utils/home-cards";

const props = defineProps<{
  card: HomeCard;
}>();

const badgeList = computed(() => parseBadges(props.card.badges));

const cardStyle = computed(() => ({
  "--card-bg": props.card["background-color"],
  "--card-bg-hover": props.card["background-color-hover"],
  "--card-bg-active": props.card["background-color-active"],
  "--card-bg-tap": props.card["background-color-tap"],
  height: props.card.height,
}));

const showComingSoon = computed(
  () =>
    props.card["coming-soon"].show &&
    Boolean(props.card["coming-soon"]["badge-image"]),
);

const isClickable = computed(() => Boolean(props.card.href));

const isCompactImage = computed(
  () =>
    props.card.href === "/cases/lecar-online-oms" ||
    props.card.href === "/cases/platforma-lada-business",
);
</script>

<template>
  <NuxtLink
    v-if="isClickable"
    :to="card.href"
    class="project-card project-card--link"
    :style="cardStyle"
  >
    <div class="project-card__cred">
      <div class="project-card__title-block">
        <TypoText
          :content="card.title"
          tag="h2"
          class="project-card__title text-heading-3xl"
        />
        <TypoText
          :content="card.subtitle"
          tag="p"
          class="project-card__subtitle text-heading-xl text-heading-xl--semibold"
        />
      </div>

      <ul v-if="badgeList.length" class="project-card__badges" aria-label="Теги">
        <HomeBadge
          v-for="badge in badgeList"
          :key="badge"
          :label="badge"
        />
      </ul>
    </div>

    <div class="project-card__pict">
      <img
        :src="card.image"
        :alt="card.title"
        class="project-card__image"
        :class="{ 'project-card__image--compact': isCompactImage }"
        loading="lazy"
      />
    </div>

    <div
      v-if="showComingSoon"
      class="project-card__coming-soon"
    >
      <img
        :src="card['coming-soon']['badge-image']"
        alt="Coming soon"
        class="project-card__coming-soon-img"
        width="96"
        height="96"
      />
    </div>
  </NuxtLink>

  <article v-else class="project-card" :style="cardStyle">
    <div class="project-card__cred">
      <div class="project-card__title-block">
        <TypoText
          :content="card.title"
          tag="h2"
          class="project-card__title text-heading-3xl"
        />
        <TypoText
          :content="card.subtitle"
          tag="p"
          class="project-card__subtitle text-heading-xl text-heading-xl--semibold"
        />
      </div>

      <ul v-if="badgeList.length" class="project-card__badges" aria-label="Теги">
        <HomeBadge
          v-for="badge in badgeList"
          :key="badge"
          :label="badge"
        />
      </ul>
    </div>

    <div class="project-card__pict">
      <img
        :src="card.image"
        :alt="card.title"
        class="project-card__image"
        :class="{ 'project-card__image--compact': isCompactImage }"
        loading="lazy"
      />
    </div>

    <div
      v-if="showComingSoon"
      class="project-card__coming-soon"
    >
      <img
        :src="card['coming-soon']['badge-image']"
        alt="Coming soon"
        class="project-card__coming-soon-img"
        width="96"
        height="96"
      />
    </div>
  </article>
</template>

<style scoped>
.project-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  width: 100%;
  padding-top: var(--space-6);
  border-radius: var(--radius-xlg);
  overflow: hidden;
  border: 1px solid transparent;
  text-decoration: none;
  color: inherit;
  background-color: var(--card-bg);
  transition:
    background-color 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
  -webkit-tap-highlight-color: transparent;
}

.project-card--link {
  cursor: pointer;
}

@media (hover: hover) and (pointer: fine) {
  .project-card:hover {
    background-color: var(--card-bg-hover);
  }

  .project-card--link:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 24px rgba(17, 24, 39, 0.08);
  }

  .project-card:active {
    background-color: var(--card-bg-active);
  }
}

@media (hover: none) {
  .project-card:active {
    background-color: var(--card-bg-tap);
  }
}

.project-card--link:focus-visible {
  outline: 2px solid var(--accent-violet);
  outline-offset: 2px;
}

.project-card__coming-soon {
  position: absolute;
  top: -1px;
  right: -1px;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 96px;
  height: 96px;
  border-bottom-left-radius: var(--radius-lg);
  opacity: 1;
  pointer-events: none;
  box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.project-card__coming-soon-img {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.8;
}

.project-card__cred {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  padding: 0 var(--space-6) var(--space-5);
}

.project-card__title-block {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.project-card__title {
  margin: 0;
  color: var(--text-default);
}

.project-card__subtitle {
  margin: 0;
  line-height: 1.35;
  letter-spacing: 0.01em;
  color: var(--text-default);
  hyphens: auto;
}

.project-card__badges {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  width: 100%;
  min-width: 0;
  margin: 0;
  padding: 0;
  list-style: none;
}

.project-card__pict {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  min-height: 0;
  padding: 0;
  overflow: hidden;
}

.project-card__image {
  width: fit-content;
  max-width: 780px;
  height: auto;
  object-fit: cover;
  object-position: top center;
  pointer-events: none;
}

.project-card__image--compact {
  max-width: 696px;
}
</style>
