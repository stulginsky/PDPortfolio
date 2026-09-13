<script setup lang="ts">
import type { HomeCard } from "~/types/home-card";
import { parseBadges } from "~/utils/home-cards";

const props = defineProps<{ card: HomeCard }>();
const route = useRoute();

const badgeList = computed(() => parseBadges(props.card.badges));
const chirpVariant = computed<"health" | "ux" | "brand" | "design-system" | null>(
  () => ({
    "/cases/chirp-ai-health-assistant": "health",
    "/cases/nested-chirp-ai-check": "ux",
    "/cases/nested-chirp-brand": "brand",
    "/cases/chirp-design-system": "design-system",
  })[props.card.href] ?? null,
);
const isChirpAiHealth = computed(() => chirpVariant.value === "health");
const isChirpCard = computed(() => chirpVariant.value !== null);
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
</script>

<template>
  <NuxtLink
    :to="card.href"
    class="project-card"
    :class="[
      chirpVariant ? `project-card--chirp-${chirpVariant}` : undefined,
      {
        'project-card--chirp': isChirpCard,
        'project-card--brand-debug': isBrandLayerDebug,
        'project-card--brand-hover-locked': isBrandHoverLocked,
        'project-card--brand-active-locked': isBrandActiveLocked,
        'project-card--ds-debug': isDsLayerDebug,
        'project-card--ds-hover-locked': isDsHoverLocked,
        'project-card--ds-active-locked': isDsActiveLocked,
      },
    ]"
    :style="card.backgroundColor ? { '--project-card-background': card.backgroundColor } : undefined"
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

    <img
      v-else-if="!chirpVariant"
      :src="card.image"
      alt=""
      class="project-card__media"
      loading="lazy"
      decoding="async"
    >

    <HomeChirpCardScene
      v-if="chirpVariant && !isChirpAiHealth"
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

    <div class="project-card__cred">
      <div class="project-card__title-block">
        <h2 class="project-card__title">{{ card.title }}</h2>
        <p class="project-card__subtitle">{{ card.subtitle }}</p>
      </div>

      <ul class="project-card__badges" aria-label="Специализации">
        <HomeBadge
          v-for="badge in badgeList"
          :key="badge"
          :label="badge"
          :truncate="false"
        />
      </ul>
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
  aspect-ratio: 437 / 532;
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

.project-card__media {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  clip-path: inset(0 0 35% 0);
  transition: transform 300ms ease;
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
  top: 29.3625%;
  left: 4.135%;
  width: 40.4405%;
  height: 51.6245%;
}

.chirp-health-card__phone--diagnosis {
  top: 11.15%;
  left: 27.9375%;
  width: 33.3523%;
  height: 63.075%;
}

.chirp-health-card__treatment-stage {
  top: 8.52%;
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
  min-height: 100%;
  flex-direction: column;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px;
}

.project-card__title-block {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.project-card__title,
.project-card__subtitle {
  margin: 0;
}

.project-card__title {
  font-size: 24px;
  font-weight: var(--ds-font-weight-semibold);
  font-variation-settings: var(--font-variation-heading-xl-semibold);
  line-height: 1.3;
}

.project-card__subtitle {
  font-size: 16px;
  font-weight: var(--ds-font-weight-semibold);
  font-variation-settings: var(--font-variation-heading-base);
  line-height: 1.5;
}

.project-card__badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

@media (hover: hover) and (pointer: fine) {
  .project-card--chirp:hover::after {
    background: linear-gradient(
      180deg,
      rgb(0 0 0 / 0) 19.231%,
      rgb(0 0 0 / 0.75) 75%,
      rgb(0 0 0 / 0.8) 100%
    );
  }

  .project-card--chirp-health:hover .chirp-health-card__phone--profile {
    top: 2.62%;
    left: -12.4%;
    width: 73.5648%;
    height: 93.9093%;
  }

  .project-card--chirp-health:hover .chirp-health-card__phone--diagnosis {
    top: -16.4525%;
    left: -19.3975%;
    width: 71.8035%;
    height: 135.7933%;
  }

  .project-card--chirp-health:hover .chirp-health-card__treatment-stage {
    top: -37.3325%;
    left: -21.8825%;
    width: 178.11%;
    height: 200.1945%;
  }

  .project-card--chirp-health:hover .chirp-health-card__phone--treatment {
    width: 85.17%;
    height: 89.13%;
    transform: rotate(-9.1deg);
  }

  .project-card--chirp-health:hover .chirp-health-card__backdrop {
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

.project-card--chirp:active::after {
  height: 87.218%;
  background: linear-gradient(
    180deg,
    rgb(0 0 0 / 0) 19.231%,
    rgb(0 0 0 / 0.75) 75%,
    rgb(0 0 0 / 0.8) 100%
  );
}

.project-card--chirp-health:active .chirp-health-card__phone--profile {
  top: 24.185%;
  left: -6.38%;
  width: 61.2508%;
  height: 78.1895%;
}

.project-card--chirp-health:active .chirp-health-card__phone--diagnosis {
  top: 9.3925%;
  left: 8.7875%;
  width: 50.4028%;
  height: 95.3205%;
}

.project-card--chirp-health:active .chirp-health-card__treatment-stage {
  top: -22.1175%;
  left: -12.5425%;
  width: 159.934%;
  height: 179.7648%;
}

.project-card--chirp-health:active .chirp-health-card__phone--treatment {
  width: 85.23%;
  height: 89.13%;
  transform: rotate(-9.1deg);
}

.project-card--chirp-health:active .chirp-health-card__backdrop {
  height: 46.9925%;
}

.project-card:focus-visible {
  outline: 2px solid var(--border-focus);
  outline-offset: 3px;
}

@media (prefers-reduced-motion: reduce) {
  .project-card,
  .project-card__media,
  .chirp-health-card__phone,
  .chirp-health-card__treatment-stage,
  .chirp-health-card__backdrop {
    transition: none;
  }
}
</style>
