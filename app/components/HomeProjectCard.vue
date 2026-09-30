<script setup lang="ts">
import type { HomeCard, HomeCardScene } from "~/types/home-card";
import { parseBadges } from "~/utils/home-cards";

const props = withDefaults(defineProps<{
  card: HomeCard;
  rowSafeHeight?: number;
}>(), {
  rowSafeHeight: 0,
});
const emit = defineEmits<{
  safeHeight: [height: number];
}>();
const route = useRoute();

const badgeList = computed(() => parseBadges(props.card.badges));
const chirpVariant = computed<HomeCardScene>(() => props.card.scene);
const isChirpAiHealth = computed(() => chirpVariant.value === "health");
const isChirpCard = computed(() => chirpVariant.value !== null);
const isHealthDefaultLocked = computed(
  () => chirpVariant.value === "health" && route.query["health-state"] === "default",
);
const isBrandLayerDebug = computed(
  () => chirpVariant.value === "brand" && route.query.layers === "brand",
);
const isBrandHoverLocked = computed(
  () => chirpVariant.value === "brand" && route.query["brand-state"] === "hover",
);
const isBrandActiveLocked = computed(
  () => chirpVariant.value === "brand" && route.query["brand-state"] === "active",
);
const isDsLayerDebug = computed(
  () => chirpVariant.value === "design-system" && route.query.layers === "ds",
);
const isDsDefaultLocked = computed(
  () => chirpVariant.value === "design-system" && route.query["ds-state"] === "default",
);
const isDsHoverLocked = computed(
  () => chirpVariant.value === "design-system" && route.query["ds-state"] === "hover",
);
const isDsActiveLocked = computed(
  () => chirpVariant.value === "design-system" && route.query["ds-state"] === "active",
);
const isDsPointerActive = ref(false);
const isDsActive = computed(
  () => chirpVariant.value === "design-system" && (isDsActiveLocked.value || isDsPointerActive.value),
);
const credRef = ref<HTMLElement | null>(null);
const credContentRef = ref<HTMLElement | null>(null);
const safeCardHeight = ref<number | null>(null);
const appliedCardHeight = computed(() => Math.max(
  safeCardHeight.value ?? 0,
  props.rowSafeHeight,
));

const cardStyle = computed(() => ({
  ...(props.card.backgroundColor ? { "--project-card-background": props.card.backgroundColor } : {}),
  ...(appliedCardHeight.value
    ? { "--project-card-min-height": `${appliedCardHeight.value}px` }
    : {}),
}));

function updateSafeCardHeight() {
  const cred = credRef.value;
  const content = credContentRef.value;
  const card = cred?.closest<HTMLElement>(".project-card");

  if (!card || !cred || !content) return;

  const { paddingTop, paddingBottom } = window.getComputedStyle(cred);
  const contentHeight = content.getBoundingClientRect().height
    + Number.parseFloat(paddingTop)
    + Number.parseFloat(paddingBottom);
  const proportionalHeight = card.clientWidth * (532 / 430);

  const nextSafeHeight = Math.ceil(Math.max(proportionalHeight, contentHeight * 3));

  if (safeCardHeight.value === nextSafeHeight) return;

  safeCardHeight.value = nextSafeHeight;
  emit("safeHeight", nextSafeHeight);
}

let resizeObserver: ResizeObserver | undefined;

onMounted(() => {
  resizeObserver = new ResizeObserver(updateSafeCardHeight);

  const card = credRef.value?.closest<HTMLElement>(".project-card");

  for (const element of [card, credRef.value, credContentRef.value]) {
    if (element) resizeObserver.observe(element);
  }

  nextTick(updateSafeCardHeight);
});

onBeforeUnmount(() => resizeObserver?.disconnect());
</script>

<template>
  <NuxtLink
    :to="card.href"
    class="project-card"
    :class="[
      chirpVariant ? `project-card--chirp-${chirpVariant}` : undefined,
      {
        'project-card--chirp': isChirpCard,
        'project-card--health-default-locked': isHealthDefaultLocked,
        'project-card--brand-debug': isBrandLayerDebug,
        'project-card--brand-hover-locked': isBrandHoverLocked,
        'project-card--brand-active-locked': isBrandActiveLocked,
        'project-card--ds-debug': isDsLayerDebug,
        'project-card--ds-default-locked': isDsDefaultLocked,
        'project-card--ds-hover-locked': isDsHoverLocked,
        'project-card--ds-active-locked': isDsActiveLocked,
      },
    ]"
    :style="cardStyle"
    @pointerdown="isDsPointerActive = true"
    @pointerup="isDsPointerActive = false"
    @pointercancel="isDsPointerActive = false"
    @pointerleave="isDsPointerActive = false"
    :aria-label="`Открыть кейс: ${card.title}`"
  >
    <div
      v-if="isChirpAiHealth"
      class="chirp-health-card__scene"
      aria-hidden="true"
    >
      <div class="chirp-health-card__pict">
        <img
          src="/cases/chirp-ai-health-assistant/layers/phone-profile@2x.png"
          alt=""
          class="chirp-health-card__phone chirp-health-card__phone--profile"
        >
        <img
          src="/cases/chirp-ai-health-assistant/layers/phone-diagnosis@2x.png"
          alt=""
          class="chirp-health-card__phone chirp-health-card__phone--diagnosis"
        >
        <div class="chirp-health-card__treatment-stage">
          <img
            src="/cases/chirp-ai-health-assistant/layers/phone-treatment@2x.png"
            alt=""
            class="chirp-health-card__phone chirp-health-card__phone--treatment"
          >
        </div>
      </div>
    </div>

    <HomeChirpCardScene
      v-if="!isChirpAiHealth"
      :variant="chirpVariant"
      :ds-active="isDsActive"
    />

    <div
      v-if="isChirpAiHealth"
      class="chirp-health-card__backdrop"
      aria-hidden="true"
    >
      <div class="chirp-health-card__blur-fade">
        <div class="chirp-health-card__blurred-pict">
          <img
            src="/cases/chirp-ai-health-assistant/layers/phone-profile@2x.png"
            alt=""
            class="chirp-health-card__phone chirp-health-card__phone--profile"
          >
          <img
            src="/cases/chirp-ai-health-assistant/layers/phone-diagnosis@2x.png"
            alt=""
            class="chirp-health-card__phone chirp-health-card__phone--diagnosis"
          >
          <div class="chirp-health-card__treatment-stage">
            <img
              src="/cases/chirp-ai-health-assistant/layers/phone-treatment@2x.png"
              alt=""
              class="chirp-health-card__phone chirp-health-card__phone--treatment"
            >
          </div>
        </div>
      </div>
    </div>

    <div ref="credRef" class="project-card__cred">
      <div ref="credContentRef" class="project-card__cred-content">
        <div class="project-card__title-block">
          <h2 class="project-card__title">{{ card.title }}</h2>
          <p class="project-card__subtitle">{{ card.subtitle }}</p>
        </div>

        <ul class="project-card__badges" aria-label="Специализации">
          <li
            v-for="badge in badgeList"
            :key="badge"
          >
            <DsBadge :label="badge" />
          </li>
        </ul>
      </div>
    </div>
  </NuxtLink>
</template>

<style scoped>
.project-card {
  position: relative;
  isolation: isolate;
  display: block;
  container-type: inline-size;
  min-width: 0;
  width: 100%;
  max-width: 430px;
  min-height: var(--project-card-min-height, 0px);
  aspect-ratio: 430 / 532;
  align-self: start;
  overflow: hidden;
  border-radius: var(--radius-xlg);
  color: var(--text-inverse);
  background: var(--project-card-background, var(--surface-subtle));
  text-decoration: none;
}

.project-card::after {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2;
  height: 100%;
  background: linear-gradient(
    180deg,
    rgb(0 0 0 / 0) 19%,
    rgb(0 0 0 / 0.6) 75%,
    rgb(0 0 0 / 0.65) 100%
  );
  content: "";
  pointer-events: none;
  transition: height 300ms ease, background 300ms ease;
}

.chirp-health-card__scene {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
}

.chirp-health-card__pict,
.chirp-health-card__blurred-pict {
  position: absolute;
  left: 50%;
  width: 91.5332%;
  aspect-ratio: 1;
  transform: translateX(-50%);
}

.chirp-health-card__pict {
  top: 0;
}

.chirp-health-card__phone,
.chirp-health-card__treatment-stage {
  position: absolute;
  display: block;
  transition:
    top 300ms ease,
    left 300ms ease,
    width 300ms ease,
    height 300ms ease,
    transform 300ms ease;
}

.chirp-health-card__phone {
  max-width: none;
}

.chirp-health-card__phone--profile {
  top: 39.3625%;
  left: 4.135%;
  width: 40.4405%;
  height: 51.6245%;
}

.chirp-health-card__phone--diagnosis {
  top: 21.15%;
  left: 27.9375%;
  width: 33.3523%;
  height: 63.075%;
}

.chirp-health-card__treatment-stage {
  top: 18.52%;
  left: 47.765%;
  width: 48.3495%;
  height: 56.832%;
  display: grid;
  place-items: center;
}

.chirp-health-card__phone--treatment {
  position: relative;
  width: 100%;
  height: 100%;
}

.chirp-health-card__backdrop {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  height: 57.208cqw;
  background: rgb(0 0 0 / 1%);
  overflow: hidden;
  transition: height 300ms ease;
}

.chirp-health-card__blur-fade {
  position: absolute;
  inset: 0;
  mask-image: linear-gradient(to bottom, transparent 0%, black 100%);
  -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 100%);
}

.chirp-health-card__blurred-pict {
  top: calc(100% - 121.739cqw);
  filter: blur(13.73cqw);
}

.project-card__cred {
  position: relative;
  z-index: 3;
  display: flex;
  height: var(--project-card-min-height, auto);
  min-height: 100%;
  flex-direction: column;
  justify-content: flex-end;
  padding: clamp(13.333px, 3.721cqw, 16px);
  box-sizing: border-box;
}

.project-card__cred-content {
  display: flex;
  flex-direction: column;
  gap: clamp(10px, 2.791cqw, 12px);
}

.project-card__title-block {
  display: flex;
  flex-direction: column;
  gap: clamp(3px, 0.93cqw, 4px);
}

.project-card__title,
.project-card__subtitle {
  margin: 0;
}

.project-card__title {
  font-size: clamp(16px, 5.581cqw, 24px);
  font-weight: var(--text-weight-semibold);
  font-variation-settings: var(--font-variation-heading-xl-semibold);
  line-height: 1.3;
}

.project-card__subtitle {
  font-size: clamp(12px, 3.721cqw, 16px);
  font-weight: var(--text-weight-semibold);
  font-variation-settings: var(--font-variation-heading-base);
  line-height: 1.5;
}

.project-card__badges {
  display: flex;
  flex-wrap: wrap;
  gap: clamp(6.667px, 1.86cqw, 8px);
  margin: 0;
  padding: 0;
  list-style: none;
}

@media (hover: hover) and (pointer: fine) {
  .project-card--chirp:hover:not(.project-card--ds-default-locked)::after {
    background: linear-gradient(
      180deg,
      rgb(0 0 0 / 0) 19.231%,
      rgb(0 0 0 / 0.75) 75%,
      rgb(0 0 0 / 0.8) 100%
    );
  }

  .project-card--chirp-health:hover:not(.project-card--health-default-locked) .chirp-health-card__phone--profile {
    top: 2.62%;
    left: -12.4%;
    width: 73.5648%;
    height: 93.9093%;
  }

  .project-card--chirp-health:hover:not(.project-card--health-default-locked) .chirp-health-card__phone--diagnosis {
    top: -16.4525%;
    left: -19.3975%;
    width: 71.8035%;
    height: 135.7933%;
  }

  .project-card--chirp-health:hover:not(.project-card--health-default-locked) .chirp-health-card__treatment-stage {
    top: -37.3325%;
    left: -21.8825%;
    width: 178.11%;
    height: 200.1945%;
  }

  .project-card--chirp-health:hover:not(.project-card--health-default-locked) .chirp-health-card__phone--treatment {
    width: 85.17%;
    height: 89.13%;
    transform: rotate(-9.1deg);
  }

  .project-card--chirp-health:hover:not(.project-card--health-default-locked) .chirp-health-card__backdrop {
    height: 46.9925%;
  }
}

.project-card--brand-hover-locked::after {
  background: linear-gradient(
    180deg,
    rgb(0 0 0 / 0) 19.231%,
    rgb(0 0 0 / 0.75) 75%,
    rgb(0 0 0 / 0.8) 100%
  );
}
.project-card--brand-active-locked::after {
  background: linear-gradient(
    180deg,
    rgb(0 0 0 / 0) 19%,
    rgb(0 0 0 / 0.6) 75%,
    rgb(0 0 0 / 0.65) 100%
  );
}

.project-card--ds-hover-locked::after {
  background: linear-gradient(
    180deg,
    rgb(0 0 0 / 0) 19.231%,
    rgb(0 0 0 / 0.75) 75%,
    rgb(0 0 0 / 0.8) 100%
  );
}

.project-card--ds-active-locked::after {
  height: 100%;
  background: linear-gradient(
    180deg,
    rgb(0 0 0 / 0) 19.231%,
    rgb(0 0 0 / 0.75) 75%,
    rgb(0 0 0 / 0.8) 100%
  );
}

/* Inspection state: keeps the DS card at Default while selecting layers. */
.project-card--ds-default-locked {
  pointer-events: none;
}

.project-card--chirp:active:not(.project-card--health-default-locked):not(.project-card--ds-default-locked)::after {
  height: 87.218%;
  background: linear-gradient(
    180deg,
    rgb(0 0 0 / 0) 19.231%,
    rgb(0 0 0 / 0.75) 75%,
    rgb(0 0 0 / 0.8) 100%
  );
}

.project-card--chirp-health:active:not(.project-card--health-default-locked) .chirp-health-card__phone--profile {
  top: 24.185%;
  left: -6.38%;
  width: 61.2508%;
  height: 78.1895%;
}

.project-card--chirp-health:active:not(.project-card--health-default-locked) .chirp-health-card__phone--diagnosis {
  top: 9.3925%;
  left: 8.7875%;
  width: 50.4028%;
  height: 95.3205%;
}

.project-card--chirp-health:active:not(.project-card--health-default-locked) .chirp-health-card__treatment-stage {
  top: -22.1175%;
  left: -12.5425%;
  width: 159.934%;
  height: 179.7648%;
}

.project-card--chirp-health:active:not(.project-card--health-default-locked) .chirp-health-card__phone--treatment {
  width: 85.23%;
  height: 89.13%;
  transform: rotate(-9.1deg);
}

.project-card--chirp-health:active:not(.project-card--health-default-locked) .chirp-health-card__backdrop {
  height: 46.9925%;
}

.project-card:focus-visible {
  outline: 2px solid var(--border-focus);
  outline-offset: 3px;
}

@media (prefers-reduced-motion: reduce) {
  .project-card,
  .chirp-health-card__phone,
  .chirp-health-card__treatment-stage,
  .chirp-health-card__backdrop {
    transition: none;
  }
}
</style>
