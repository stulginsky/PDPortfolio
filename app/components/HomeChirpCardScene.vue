<script setup lang="ts">
import type { HomeCardScene } from "~/types/home-card";

defineProps<{
  variant: HomeCardScene;
  dsActive?: boolean;
}>();
</script>

<template>
  <div v-if="variant === 'ux'" class="chirp-scene chirp-scene--ux" aria-hidden="true">
    <div class="chirp-scene__pict chirp-ux__pict">
      <img src="/cases/nested-chirp-ai-check/layers/phones-ux.png" alt="" class="chirp-ux__phones">
    </div>
    <div class="chirp-scene__progressive-blur chirp-ux__blur">
      <div class="chirp-ux__blurred-pict">
        <img src="/cases/nested-chirp-ai-check/layers/phones-ux.png" alt="" class="chirp-ux__phones">
      </div>
    </div>
  </div>

  <HomeChirpBrandCardScene v-else-if="variant === 'brand'" />
  <HomeChirpDesignSystemCardScene v-else :active="dsActive" />
</template>

<style>
.chirp-scene { position: absolute; inset: 0; z-index: 0; overflow: hidden; }
.chirp-scene__pict { position: absolute; inset: 0; }
.chirp-scene__progressive-blur {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  height: 57.208cqw;
  overflow: hidden;
  background: rgb(0 0 0 / 1%);
  mask-image: linear-gradient(to bottom, transparent, black);
  -webkit-mask-image: linear-gradient(to bottom, transparent, black);
  pointer-events: none;
  transition: height 300ms ease;
}
.chirp-scene--ux { background: #63ffe3; }
.chirp-ux__phones {
  position: absolute;
  top: 5cqw;
  left: 0.503cqw;
  width: 98.214cqw;
  height: 85.03cqw;
  max-width: none;
  transition: top 300ms ease, left 300ms ease, width 300ms ease, height 300ms ease;
}
.chirp-ux__blurred-pict { position: absolute; inset: 0; filter: blur(20cqw); }

/* The card owns the interaction state; this scene owns its matching layers. */
@media (hover: hover) and (pointer: fine) {
  .project-card--chirp-ux:hover .chirp-ux__phones {
    top: -41.414cqw;
    left: -51.698cqw;
    width: 203.078cqw;
    height: 175.818cqw;
  }
}

.project-card--chirp-ux:active .chirp-ux__phones {
  top: -18.794cqw;
  left: -25.57cqw;
  width: 150.822cqw;
  height: 130.576cqw;
}
</style>
