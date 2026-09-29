<script setup lang="ts">
import type { HomeCard } from "~/types/home-card";

const props = defineProps<{
  cards: HomeCard[];
  labels: {
    relatedTitle: string;
    relatedDescription: string;
    previousRelated: string;
    nextRelated: string;
  };
}>();

const currentStep = ref(0);
const maxStep = computed(() => Math.max(props.cards.length - 1, 0));
const canGoBack = computed(() => currentStep.value > 0);
const canGoForward = computed(() => currentStep.value < maxStep.value);

function move(direction: -1 | 1) {
  currentStep.value = Math.min(maxStep.value, Math.max(0, currentStep.value + direction));
}
</script>

<template>
  <section class="case-related" aria-labelledby="related-cases-title">
    <div class="case-related__title-row">
      <TypoText id="related-cases-title" :content="labels.relatedTitle" tag="h2" />
      <TypoText :content="labels.relatedDescription" tag="p" />
    </div>

    <div class="case-related__viewport">
      <div class="case-related__track" :style="{ '--case-related-index': currentStep }">
        <HomeProjectCard v-for="card in cards" :key="card.href" :card="card" />
      </div>
      <button
        v-if="canGoBack"
        type="button"
        class="case-related__nav case-related__nav--left"
        :aria-label="labels.previousRelated"
        @click="move(-1)"
      >
        <img src="/cases/chirp-product/media/nav-arrow.svg" alt="" aria-hidden="true">
      </button>
      <button
        v-if="canGoForward"
        type="button"
        class="case-related__nav case-related__nav--right"
        :aria-label="labels.nextRelated"
        @click="move(1)"
      >
        <img src="/cases/chirp-product/media/nav-arrow.svg" alt="" aria-hidden="true">
      </button>
    </div>
  </section>
</template>

<style scoped>
.case-related { width: min(924px, calc(100% - (var(--space-page-x) * 2))); margin: 0 auto; padding: var(--space-8) 0 var(--space-16); }
.case-related__title-row { display: grid; gap: var(--space-6); margin-bottom: var(--space-16); }
.case-related__title-row h2, .case-related__title-row p { margin: 0; }
.case-related__title-row h2 { color: var(--accent-aubergine); font-size: var(--text-size-2xl); font-weight: var(--text-weight-semibold); font-variation-settings: var(--font-variation-heading-xl-semibold); letter-spacing: -0.16px; line-height: 1.2; }
.case-related__title-row p { color: var(--text-default); font-size: var(--text-size-lg-plus); font-weight: var(--text-weight-light); font-variation-settings: var(--font-variation-body-accent); letter-spacing: 0.2px; line-height: 1.6; white-space: pre-line; }
.case-related__viewport { position: relative; width: 100%; overflow: hidden; }
.case-related__track { display: flex; gap: var(--space-2); width: max-content; transform: translateX(calc(var(--case-related-index) * var(--case-related-step, 408px) * -1)); transition: transform 240ms ease; }
.case-related__track :deep(.project-card) { width: 400px; flex: 0 0 400px; }
.case-related__nav { position: absolute; top: 50%; z-index: 2; display: grid; width: 50px; height: 50px; place-items: center; padding: 0; border: 0; border-radius: 50%; background: var(--surface-raised); box-shadow: var(--effect-shadow-2nd); cursor: pointer; transform: translateY(-50%); }
.case-related__nav:hover { background: var(--surface-action-hover); }
.case-related__nav:active { background: var(--surface-action-pressed); }
.case-related__nav img { width: 18px; height: 18px; }
.case-related__nav--left { left: -23px; }
.case-related__nav--right { right: -23px; }
.case-related__nav--right img { transform: rotate(180deg); }
@media (max-width: 720px) { .case-related { width: min(100% - (var(--space-6) * 2), 924px); padding: var(--space-8) 0 var(--space-16); } .case-related__track { --case-related-step: 276px; gap: var(--space-4); } .case-related__track :deep(.project-card) { width: 260px; max-width: 260px; height: 708px; min-height: 708px; aspect-ratio: 260 / 708; flex: 0 0 260px; } .case-related__nav--right { right: -23px; } .case-related__nav--left { left: -23px; } }
</style>
