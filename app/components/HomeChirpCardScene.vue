<script setup lang="ts">
type ChirpSceneVariant = "ux" | "brand" | "design-system";

defineProps<{
  variant: ChirpSceneVariant;
  dsActive?: boolean;
}>();
</script>

<template>
  <div v-if="variant === 'ux'" class="chirp-scene chirp-scene--ux" aria-hidden="true">
    <div class="chirp-scene__pict chirp-ux__pict">
      <img
        src="/cases/nested-chirp-ai-check/layers/phones-ux.png"
        alt=""
        class="chirp-ux__phones"
      >
    </div>
    <div class="chirp-scene__progressive-blur chirp-ux__blur" />
  </div>

  <HomeChirpBrandCardScene v-else-if="variant === 'brand'" />

  <HomeChirpDesignSystemCardScene v-else :active="dsActive" />
</template>

<style>
.chirp-scene {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
}

.chirp-scene__pict,
.chirp-ds__pict {
  position: absolute;
  inset: 0;
}

.chirp-scene__progressive-blur {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  height: 57.208cqw;
  background: rgb(0 0 0 / 1%);
  backdrop-filter: blur(20cqw);
  mask-image: linear-gradient(to bottom, transparent, black);
  -webkit-mask-image: linear-gradient(to bottom, transparent, black);
  pointer-events: none;
  transition: height 300ms ease;
}

/* Explainable AI UX — exact Figma coordinates at the 437px base width. */
.chirp-scene--ux { background: #63ffe3; }
.chirp-ux__phones {
  position: absolute;
  top: 2.835cqw;
  left: 0.503cqw;
  width: 98.214cqw;
  height: 85.03cqw;
  max-width: none;
  transition: inset 300ms ease, width 300ms ease, height 300ms ease;
}

/* Medical AI Brand */
.chirp-scene--brand { background: #4ff5f5; }
.chirp-scene--brand {
  --chirp-brand-duration: 300ms;
  --chirp-brand-ease: cubic-bezier(.22, 1, .36, 1);
}
.chirp-brand__orb {
  position: absolute;
  border-radius: 50%;
  transition:
    top var(--chirp-brand-duration) var(--chirp-brand-ease),
    left var(--chirp-brand-duration) var(--chirp-brand-ease),
    width var(--chirp-brand-duration) var(--chirp-brand-ease),
    height var(--chirp-brand-duration) var(--chirp-brand-ease),
    filter var(--chirp-brand-duration) var(--chirp-brand-ease);
}
.chirp-brand__orb--outer { top: 5.247cqw; left: 25.737cqw; width: 76.722cqw; height: 77.132cqw; background: rgb(169 252 255 / 72%); }
.chirp-brand__orb--middle { top: 16.231cqw; left: 36.662cqw; width: 54.871cqw; height: 55.164cqw; background: rgb(112 237 239 / 84%); filter: blur(1.144cqw); box-shadow: 0 1.129cqw 27.147cqw rgb(133 221 245 / 68%); }
.chirp-brand__orb--inner { top: 25.839cqw; left: 46.219cqw; width: 35.756cqw; height: 35.947cqw; background: #8ff7fb; filter: blur(.564cqw); }
.chirp-brand__orb--core { top: 34.844cqw; left: 55.177cqw; width: 17.843cqw; height: 17.938cqw; background: #75ecef; filter: blur(.564cqw); box-shadow: 0 1.129cqw 27.147cqw rgb(133 221 245 / 68%); }
.chirp-brand__orb--pulse { top: 38.81cqw; left: 59.121cqw; width: 9.951cqw; height: 10.004cqw; background: #13c6d2; filter: blur(.318cqw); opacity: .22; }
.chirp-brand__wave { position: absolute; display: flex; align-items: center; gap: 4.736cqw; transition: opacity var(--chirp-brand-duration) var(--chirp-brand-ease); }
.chirp-brand__wave i { display: block; width: 5.189cqw; height: var(--bar-height); border-radius: 5.189cqw; background: #14d7e4; filter: blur(.282cqw); box-shadow: 0 1.129cqw 5.728cqw rgb(133 221 245 / 68%); }
.chirp-brand__wave i:nth-child(even) { background: #2fbecb; }
.chirp-brand__wave i:nth-child(4) { opacity: .76; }
.chirp-brand__wave i:nth-child(5) { background: #12bfca; opacity: .41; }
.chirp-brand__wave i:nth-child(6) { background: #28a2ad; opacity: .32; }
.chirp-brand__wave--main { top: 32.561cqw; left: 3.341cqw; }
.chirp-brand__wave--large { top: 43.858cqw; left: -30.123cqw; gap: 6.618cqw; opacity: 0; }
.chirp-brand__wave--large i { width: 7.252cqw; border-radius: 7.252cqw; filter: blur(.394cqw); }
.chirp-brand__wave--pressed { top: 37.24cqw; left: -12.906cqw; gap: 5.117cqw; opacity: 0; }
.chirp-brand__wave--pressed i { width: 5.607cqw; border-radius: 5.117cqw; filter: blur(.305cqw); }
.chirp-brand__wave--main i:nth-child(2) { width: 4.827cqw; }
.chirp-brand__wave--main i:nth-child(4) { width: 4.328cqw; }
.chirp-brand__wave--large i:nth-child(2) { width: 6.746cqw; }
.chirp-brand__wave--large i:nth-child(4) { width: 6.048cqw; }
.chirp-brand__wave--pressed i:nth-child(2) { width: 5.216cqw; }
.chirp-brand__wave--pressed i:nth-child(4) { width: 4.676cqw; }
.chirp-brand__wordmark { position: absolute; display: block; transition: opacity 180ms ease; }
.chirp-brand__wordmark--default { top: 9.382cqw; left: 5.327cqw; width: 12.109cqw; height: 3.877cqw; }
.chirp-brand__wordmark--hover, .chirp-brand__wordmark--pressed { top: 9.661cqw; left: 6.955cqw; width: 45.61cqw; height: 14.601cqw; opacity: 0; }
.chirp-brand__bird {
  position: absolute;
  display: block;
  max-width: none;
  object-fit: contain;
  transition:
    top var(--chirp-brand-duration) var(--chirp-brand-ease),
    left var(--chirp-brand-duration) var(--chirp-brand-ease),
    width var(--chirp-brand-duration) var(--chirp-brand-ease),
    height var(--chirp-brand-duration) var(--chirp-brand-ease),
    opacity 180ms ease;
}
.chirp-brand__bird--main { top: 6.178cqw; left: 28.684cqw; width: 93.573cqw; height: 93.573cqw; }
.chirp-brand__bird--main img { position: absolute; inset: 0; width: 100%; height: 100%; }
.chirp-brand__bird--main img:last-child { mix-blend-mode: multiply; opacity: .7; }
.chirp-brand__bird--left { top: 45.941cqw; left: -23.478cqw; width: 60.232cqw; height: 59.701cqw; display: grid; place-items: center; }
.chirp-brand__bird--left img {
  width: 49.724cqw;
  height: 35.109cqw;
  transform: scaleY(-1) rotate(-136.47deg);
  transition: width var(--chirp-brand-duration) var(--chirp-brand-ease), height var(--chirp-brand-duration) var(--chirp-brand-ease);
}
.chirp-brand__bird-echo { mix-blend-mode: multiply; opacity: .7; }
.chirp-brand__bird--right { top: 72.994cqw; left: 59.146cqw; width: 32.647cqw; height: 35.762cqw; display: grid; place-items: center; }
.chirp-brand__bird--right img {
  width: 29.326cqw;
  height: 20.707cqw;
  transform: rotate(-59.8deg);
  transition:
    width var(--chirp-brand-duration) var(--chirp-brand-ease),
    height var(--chirp-brand-duration) var(--chirp-brand-ease),
    transform var(--chirp-brand-duration) var(--chirp-brand-ease);
}
.chirp-brand__bird--top { top: -1.934cqw; left: 71.478cqw; width: 26.147cqw; height: 25.917cqw; display: grid; place-items: center; }
.chirp-brand__bird--top img { width: 21.586cqw; height: 15.241cqw; transform: rotate(-43.53deg); }

/* Design System */
.chirp-scene--design-system { background: #4ff5f5; }
.chirp-ds__pict { overflow: hidden; }
.chirp-ds__tile,
.chirp-ds__code,
.chirp-ds__ellipse { position: absolute; display: block; max-width: none; object-fit: cover; transition: all 300ms ease; }
.chirp-ds__tile--color-brand { top: -18.764cqw; left: 0; width: 32.737cqw; height: 30.402cqw; }
.chirp-ds__tile--images { top: 12.979cqw; left: 0; width: 32.737cqw; height: 41.857cqw; }
.chirp-ds__tile--input-text { top: 56.181cqw; left: 0; width: 32.737cqw; height: 19.544cqw; }
.chirp-ds__tile--chat-bubble { top: 77.066cqw; left: 0; width: 32.737cqw; height: 83.606cqw; }
.chirp-ds__tile--logotype { top: -18.764cqw; left: 34.08cqw; width: 32.514cqw; height: 45.939cqw; }
.chirp-ds__tile--date-picker { top: 28.517cqw; left: 34.08cqw; width: 32.514cqw; height: 32.136cqw; }
.chirp-ds__tile--row-list { top: 61.996cqw; left: 34.08cqw; width: 32.514cqw; height: 10.568cqw; }
.chirp-ds__tile--gender-select { top: 73.906cqw; left: 34.08cqw; width: 32.514cqw; height: 53.272cqw; }
.chirp-ds__tile--input-search { top: 128.52cqw; left: 34.08cqw; width: 32.514cqw; height: 19.411cqw; }
.chirp-ds__tile--button { top: -18.764cqw; left: 67.934cqw; width: 32.066cqw; height: 67.003cqw; }
.chirp-ds__tile--row-query { top: 61.345cqw; left: 67.934cqw; width: 32.066cqw; height: 10.636cqw; }
.chirp-ds__tile--row-diagnosis { top: 73.322cqw; left: 67.934cqw; width: 32.066cqw; height: 18.612cqw; }
.chirp-ds__tile--row-list-tall { top: 93.277cqw; left: 67.934cqw; width: 32.066cqw; height: 42.116cqw; }
.chirp-ds__code { top: 110.485cqw; left: 0; width: 91.5cqw; height: 65.652cqw; overflow: hidden; border-radius: 2.387cqw; background: #1e1e1e; opacity: .21; }
.chirp-ds__code img { width: 100.44%; max-width: none; transform: translateY(.17%); }
.chirp-ds__ellipse { top: 59.74%; left: 16.25%; width: 123.75%; height: 93.32%; }
.chirp-ds__ellipse--hover, .chirp-ds__ellipse--pressed { opacity: 0; }

:global(.project-card--chirp-ux:hover) .chirp-ux__phones { top: -41.414cqw; left: -51.698cqw; width: 203.078cqw; height: 175.818cqw; }
:global(.project-card--chirp-ux:hover) .chirp-scene__progressive-blur { height: 57.208cqw; }
:global(.project-card--chirp-ux:active) .chirp-ux__phones { top: -18.794cqw; left: -25.57cqw; width: 150.822cqw; height: 130.576cqw; }
:global(.project-card--chirp-ux:active) .chirp-scene__progressive-blur { height: 57.208cqw; }

:global(.project-card--chirp-brand:hover) .chirp-brand__orb--outer { top: -3.076cqw; left: 9.767cqw; width: 120.546cqw; height: 121.012cqw; }
:global(.project-card--chirp-brand:hover) .chirp-brand__orb--middle { top: 14.156cqw; left: 26.908cqw; width: 86.087cqw; height: 86.501cqw; filter: blur(1.795cqw); }
:global(.project-card--chirp-brand:hover) .chirp-brand__orb--inner { top: 29.229cqw; left: 41.902cqw; width: 56.097cqw; height: 56.398cqw; filter: blur(.885cqw); }
:global(.project-card--chirp-brand:hover) .chirp-brand__orb--core { top: 43.355cqw; left: 55.954cqw; width: 27.994cqw; height: 28.144cqw; filter: blur(.885cqw); }
:global(.project-card--chirp-brand:hover) .chirp-brand__orb--pulse { top: 49.579cqw; left: 62.144cqw; width: 15.613cqw; height: 15.696cqw; filter: blur(.499cqw); }
:global(.project-card--chirp-brand:hover) .chirp-brand__wave--main { top: 36.89cqw; left: -46.677cqw; transform: scale(1.527); opacity: 0; }
:global(.project-card--chirp-brand:hover) .chirp-brand__wave--large { top: 43.858cqw; left: -30.123cqw; opacity: 1; }
:global(.project-card--chirp-brand:hover) .chirp-brand__wordmark--default { opacity: 0; }
:global(.project-card--chirp-brand:hover) .chirp-brand__wordmark--hover { opacity: 1; }
:global(.project-card--chirp-brand:hover) .chirp-brand__bird--main { top: -3.076cqw; left: 9.767cqw; width: 153.039cqw; height: 153.039cqw; }
:global(.project-card--chirp-brand:hover) .chirp-brand__bird--left { top: 36.89cqw; left: -46.677cqw; width: 95.197cqw; height: 67.217cqw; }
:global(.project-card--chirp-brand:hover) .chirp-brand__bird--right { top: -26.093cqw; left: 83.377cqw; width: 36.895cqw; height: 26.051cqw; transform: rotate(-43.53deg); }
:global(.project-card--chirp-brand:hover) .chirp-brand__blur { height: 57.208cqw; }

:global(.project-card--chirp-brand:active) .chirp-brand__orb--outer { top: -2.961cqw; left: 9.767cqw; width: 120.369cqw; height: 121.012cqw; }
:global(.project-card--chirp-brand:active) .chirp-brand__wordmark--hover { opacity: 0; }
:global(.project-card--chirp-brand:active) .chirp-brand__wordmark--pressed { top: 9.776cqw; left: 31.639cqw; width: 38.135cqw; height: 12.208cqw; opacity: 1; }
:global(.project-card--chirp-brand:active) .chirp-brand__bird--main { top: 5.481cqw; left: 13.906cqw; width: 118.318cqw; height: 118.318cqw; }
:global(.project-card--chirp-brand:active) .chirp-brand__bird--left { top: 37.24cqw; left: -30.849cqw; width: 64.25cqw; height: 45.366cqw; }
:global(.project-card--chirp-brand:active) .chirp-brand__bird--right { top: 88.036cqw; left: 53.627cqw; width: 29.326cqw; height: 20.707cqw; }
:global(.project-card--chirp-brand:active) .chirp-brand__blur { height: 57.208cqw; }

:global(.project-card--chirp-design-system:hover) .chirp-ds__tile { opacity: .44; }
:global(.project-card--chirp-design-system:hover) .chirp-ds__tile--color-brand { top: -21.739cqw; left: 0; width: 32.737cqw; height: 30.402cqw; }
:global(.project-card--chirp-design-system:hover) .chirp-ds__tile--images { top: 10.005cqw; left: 0; }
:global(.project-card--chirp-design-system:hover) .chirp-ds__tile--input-text { top: 53.206cqw; left: 0; }
:global(.project-card--chirp-design-system:hover) .chirp-ds__tile--chat-bubble { top: 7.904cqw; left: 8.501cqw; width: 55.056cqw; height: 140.607cqw; box-shadow: .756cqw 1.512cqw 5cqw rgb(44 31 57 / 10%); }
:global(.project-card--chirp-design-system:hover) .chirp-ds__tile--logotype { top: -21.739cqw; left: 34.08cqw; }
:global(.project-card--chirp-design-system:hover) .chirp-ds__tile--date-picker { top: 14.76cqw; left: 44.234cqw; width: 47.299cqw; height: 46.75cqw; opacity: 1; box-shadow: .756cqw 1.512cqw 7.181cqw rgb(44 31 57 / 30%); }
:global(.project-card--chirp-design-system:hover) .chirp-ds__tile--row-list { top: 59.02cqw; left: 34.08cqw; }
:global(.project-card--chirp-design-system:hover) .chirp-ds__tile--gender-select { top: 70.931cqw; left: 34.08cqw; }
:global(.project-card--chirp-design-system:hover) .chirp-ds__tile--input-search { top: 125.545cqw; left: 34.08cqw; }
:global(.project-card--chirp-design-system:hover) .chirp-ds__tile--button { top: -21.739cqw; left: 67.934cqw; }
:global(.project-card--chirp-design-system:hover) .chirp-ds__tile--row-query { top: 58.37cqw; left: 67.934cqw; }
:global(.project-card--chirp-design-system:hover) .chirp-ds__tile--row-diagnosis { top: 70.348cqw; left: 67.934cqw; }
:global(.project-card--chirp-design-system:hover) .chirp-ds__tile--row-list-tall { top: 90.303cqw; left: 67.934cqw; }
:global(.project-card--chirp-design-system:hover) .chirp-ds__code { top: 65.011cqw; left: 0; width: 91.5cqw; height: 65.652cqw; opacity: 1; box-shadow: .756cqw 1.512cqw 7.181cqw rgb(44 31 57 / 30%); }
:global(.project-card--chirp-design-system:hover) .chirp-ds__ellipse--default { opacity: 0; }
:global(.project-card--chirp-design-system:hover) .chirp-ds__ellipse--hover { top: 59%; left: 18.31%; width: 113.27%; height: 93.32%; opacity: 1; }
:global(.project-card--chirp-design-system:hover) .chirp-ds__blur { height: 45.767cqw; }

:global(.project-card--chirp-design-system:active) .chirp-ds__tile { opacity: .44; }
:global(.project-card--chirp-design-system:active) .chirp-ds__tile--color-brand { top: -18.764cqw; left: 0; width: 32.677cqw; height: 30.345cqw; }
:global(.project-card--chirp-design-system:active) .chirp-ds__tile--images { top: 12.922cqw; left: 0; width: 32.677cqw; height: 41.779cqw; }
:global(.project-card--chirp-design-system:active) .chirp-ds__tile--input-text { top: 56.041cqw; left: 0; width: 32.677cqw; height: 19.508cqw; }
:global(.project-card--chirp-design-system:active) .chirp-ds__tile--chat-bubble { top: 6.939cqw; left: 7.735cqw; width: 46.092cqw; height: 117.714cqw; box-shadow: .755cqw 1.509cqw 4.99cqw rgb(44 31 57 / 10%); }
:global(.project-card--chirp-design-system:active) .chirp-ds__tile--logotype { top: -18.764cqw; left: 34.016cqw; width: 32.454cqw; height: 45.854cqw; }
:global(.project-card--chirp-design-system:active) .chirp-ds__tile--date-picker { top: 11.68cqw; left: 42.42cqw; width: 39.405cqw; height: 38.948cqw; opacity: 1; box-shadow: .754cqw 1.509cqw 7.168cqw rgb(44 31 57 / 30%); }
:global(.project-card--chirp-design-system:active) .chirp-ds__tile--row-list { top: 61.845cqw; left: 34.016cqw; width: 32.454cqw; height: 10.548cqw; }
:global(.project-card--chirp-design-system:active) .chirp-ds__tile--gender-select { top: 73.732cqw; left: 34.016cqw; width: 32.454cqw; height: 53.173cqw; }
:global(.project-card--chirp-design-system:active) .chirp-ds__tile--input-search { top: 128.245cqw; left: 34.016cqw; width: 32.454cqw; height: 19.375cqw; }
:global(.project-card--chirp-design-system:active) .chirp-ds__tile--button { top: -18.764cqw; left: 67.807cqw; width: 32.007cqw; height: 66.878cqw; }
:global(.project-card--chirp-design-system:active) .chirp-ds__tile--row-query { top: 61.124cqw; left: 67.807cqw; width: 32.007cqw; height: 10.617cqw; }
:global(.project-card--chirp-design-system:active) .chirp-ds__tile--row-diagnosis { top: 52.602cqw; left: 56.568cqw; width: 45.493cqw; height: 26.406cqw; opacity: 1; }
:global(.project-card--chirp-design-system:active) .chirp-ds__tile--row-list-tall { top: 81.05cqw; left: 56.646cqw; width: 45.415cqw; height: 59.65cqw; opacity: 1; }
:global(.project-card--chirp-design-system:active) .chirp-ds__code { top: 67.824cqw; left: 0; width: 91.33cqw; height: 65.53cqw; opacity: 1; box-shadow: .754cqw 1.509cqw 7.168cqw rgb(44 31 57 / 30%); }
:global(.project-card--chirp-design-system:active) .chirp-ds__ellipse--default { opacity: 0; }
:global(.project-card--chirp-design-system:active) .chirp-ds__ellipse--pressed { top: 59%; left: 18.31%; width: 113.27%; height: 93.32%; opacity: 1; }

/* Parent/child state selectors deliberately stay unscoped: the card owns hover,
   while this component owns the animated layers. */
.project-card--chirp-ux:hover .chirp-ux__phones { top: -41.414cqw; left: -51.698cqw; width: 203.078cqw; height: 175.818cqw; }
.project-card--chirp-ux:hover .chirp-ux__blur,
.project-card--chirp-ux:active .chirp-ux__blur { height: 57.208cqw; }
.project-card--chirp-ux:active .chirp-ux__phones { top: -18.794cqw; left: -25.57cqw; width: 150.822cqw; height: 130.576cqw; }

.project-card--chirp-brand:hover .chirp-brand__orb--outer { top: -3.076cqw; left: 9.767cqw; width: 120.546cqw; height: 121.012cqw; }
.project-card--chirp-brand:hover .chirp-brand__orb--middle { top: 14.156cqw; left: 26.908cqw; width: 86.087cqw; height: 86.501cqw; filter: blur(1.795cqw); }
.project-card--chirp-brand:hover .chirp-brand__orb--inner { top: 29.229cqw; left: 41.902cqw; width: 56.097cqw; height: 56.398cqw; }
.project-card--chirp-brand:hover .chirp-brand__orb--core { top: 43.355cqw; left: 55.954cqw; width: 27.994cqw; height: 28.144cqw; filter: blur(.885cqw); }
.project-card--chirp-brand:hover .chirp-brand__orb--pulse { top: 49.579cqw; left: 62.144cqw; width: 15.613cqw; height: 15.696cqw; filter: blur(.499cqw); }
.project-card--chirp-brand:hover .chirp-brand__bird--main { top: -3.076cqw; left: 9.767cqw; width: 153.039cqw; height: 153.039cqw; }
.project-card--chirp-brand:hover .chirp-brand__bird--left { top: 36.89cqw; left: -46.677cqw; width: 115.315cqw; height: 114.297cqw; }
.project-card--chirp-brand:hover .chirp-brand__bird--left img { width: 95.197cqw; height: 67.217cqw; }
.project-card--chirp-brand:hover .chirp-brand__bird-echo { opacity: 0; }
.project-card--chirp-brand:hover .chirp-brand__bird--right { top: -26.094cqw; left: 83.377cqw; width: 44.693cqw; height: 44.299cqw; }
.project-card--chirp-brand:hover .chirp-brand__bird--right img { transform: rotate(-43.53deg); }
.project-card--chirp-brand:hover .chirp-brand__bird--top { opacity: 0; }
.project-card--chirp-brand:hover .chirp-brand__bird--right img { width: 36.895cqw; height: 26.051cqw; }
.project-card--chirp-brand:hover .chirp-brand__wordmark--default { opacity: 0; }
.project-card--chirp-brand:hover .chirp-brand__wordmark--hover { opacity: 1; }
.project-card--chirp-brand:hover .chirp-brand__wave--main { opacity: 0; }
.project-card--chirp-brand:hover .chirp-brand__wave--large { opacity: 1; }
.project-card--chirp-brand:hover .chirp-brand__blur,
.project-card--chirp-brand:active .chirp-brand__blur { height: 57.208cqw; }
.project-card--chirp-brand:active .chirp-brand__orb--outer { top: -2.961cqw; left: 9.767cqw; width: 120.369cqw; height: 121.012cqw; }
.project-card--chirp-brand:active .chirp-brand__orb--middle { top: 14.27cqw; left: 26.908cqw; width: 86.087cqw; height: 86.547cqw; filter: blur(1.795cqw); }
.project-card--chirp-brand:active .chirp-brand__orb--inner { top: 29.344cqw; left: 41.902cqw; width: 56.097cqw; height: 56.398cqw; filter: blur(.885cqw); }
.project-card--chirp-brand:active .chirp-brand__orb--core { top: 43.47cqw; left: 55.954cqw; width: 27.994cqw; height: 28.144cqw; filter: blur(.885cqw); }
.project-card--chirp-brand:active .chirp-brand__orb--pulse { top: 49.693cqw; left: 62.144cqw; width: 15.613cqw; height: 15.696cqw; filter: blur(.499cqw); }
.project-card--chirp-brand:active .chirp-brand__bird--main { top: 5.481cqw; left: 13.906cqw; width: 118.318cqw; height: 118.318cqw; }
.project-card--chirp-brand:active .chirp-brand__bird--left { top: 49.693cqw; left: -30.849cqw; width: 77.827cqw; height: 77.141cqw; }
.project-card--chirp-brand:active .chirp-brand__bird--left img { width: 64.25cqw; height: 45.366cqw; }
.project-card--chirp-brand:active .chirp-brand__bird-echo { opacity: 0; }
.project-card--chirp-brand:active .chirp-brand__bird--right { top: 88.036cqw; left: 53.627cqw; width: 32.647cqw; height: 35.762cqw; }
.project-card--chirp-brand:active .chirp-brand__bird--right img { transform: rotate(-59.8deg); }
.project-card--chirp-brand:active .chirp-brand__bird--top { opacity: 0; }
.project-card--chirp-brand:active .chirp-brand__wave--main,
.project-card--chirp-brand:active .chirp-brand__wave--large { opacity: 0; }
.project-card--chirp-brand:active .chirp-brand__wave--pressed { opacity: 1; }
.project-card--chirp-brand:active .chirp-brand__wordmark--default { opacity: 0; }
.project-card--chirp-brand:active .chirp-brand__wordmark--hover { opacity: 0; }
.project-card--chirp-brand:active .chirp-brand__wordmark--pressed { top: 9.776cqw; left: 6.955cqw; width: 38.135cqw; height: 12.208cqw; opacity: 1; }

.project-card--chirp-design-system:hover .chirp-ds__tile,
.project-card--chirp-design-system:active .chirp-ds__tile { opacity: .44; }
.project-card--chirp-design-system:hover .chirp-ds__tile--chat-bubble { top: 7.904cqw; left: 8.501cqw; width: 55.056cqw; height: 140.607cqw; }
.project-card--chirp-design-system:hover .chirp-ds__tile--date-picker { top: 14.76cqw; left: 44.234cqw; width: 47.299cqw; height: 46.75cqw; opacity: 1; }
.project-card--chirp-design-system:hover .chirp-ds__code { top: 65.011cqw; opacity: 1; }
.project-card--chirp-design-system:hover .chirp-ds__ellipse--default { opacity: 0; }
.project-card--chirp-design-system:hover .chirp-ds__ellipse--hover { opacity: 1; }
.project-card--chirp-design-system:active .chirp-ds__tile--chat-bubble { top: 6.939cqw; left: 7.735cqw; width: 46.092cqw; height: 117.714cqw; }
.project-card--chirp-design-system:active .chirp-ds__tile--date-picker { top: 11.68cqw; left: 42.42cqw; width: 39.405cqw; height: 38.948cqw; opacity: 1; }
.project-card--chirp-design-system:active .chirp-ds__code { top: 67.824cqw; opacity: 1; }
.project-card--chirp-design-system:active .chirp-ds__ellipse--default { opacity: 0; }
.project-card--chirp-design-system:active .chirp-ds__ellipse--pressed { opacity: 1; }

@media (prefers-reduced-motion: reduce) {
  .chirp-scene *,
  .chirp-scene { transition: none !important; }
}
</style>
