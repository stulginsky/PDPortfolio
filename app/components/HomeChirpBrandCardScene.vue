<template>
  <div class="chirp-brand-v2" aria-hidden="true">
    <div class="chirp-brand-v2__pict">
      <div class="chirp-brand-v2__orb chirp-brand-v2__orb--outer" data-layer="orb / outer" />
      <div class="chirp-brand-v2__orb chirp-brand-v2__orb--middle" data-layer="orb / middle" />
      <div class="chirp-brand-v2__orb chirp-brand-v2__orb--inner" data-layer="orb / inner" />
      <div class="chirp-brand-v2__orb chirp-brand-v2__orb--core" data-layer="orb / core" />
      <div class="chirp-brand-v2__orb chirp-brand-v2__orb--pulse" data-layer="orb / pulse" />

      <div class="chirp-brand-v2__wave chirp-brand-v2__wave--animated" data-layer="wave">
        <i v-for="index in 6" :key="index" />
      </div>

      <img
        src="/cases/nested-chirp-brand/layers/frame-hover.svg"
        alt=""
        class="chirp-brand-v2__wordmark chirp-brand-v2__wordmark--animated"
        data-layer="wordmark"
      />

      <div class="chirp-brand-v2__main-bird" data-layer="songbird / main">
        <img
          src="/cases/nested-chirp-brand/layers/songbird-default.png"
          alt=""
        />
        <img src="/cases/nested-chirp-brand/layers/songbird-hover.png" alt="" />
      </div>

      <div class="chirp-brand-v2__leaf chirp-brand-v2__leaf--left" data-layer="leaf / left">
        <img
          src="/cases/nested-chirp-brand/layers/songbird-pressed.png"
          alt=""
        />
      </div>
      <div class="chirp-brand-v2__leaf chirp-brand-v2__leaf--right" data-layer="leaf / right">
        <img
          src="/cases/nested-chirp-brand/layers/songbird-pressed.png"
          alt=""
        />
      </div>
    </div>

    <div class="chirp-brand-v2__blur" data-layer="progressive blur" />
  </div>
</template>

<style>
.chirp-brand-v2 {
  --brand-motion-duration: 300ms;
  --brand-motion-ease: cubic-bezier(0.22, 1, 0.36, 1);

  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  background: #4ff5f5;
}

.chirp-brand-v2__pict {
  position: absolute;
  inset: 0;
  overflow: hidden;
  transition: transform var(--brand-motion-duration) var(--brand-motion-ease);
}

.chirp-brand-v2__orb {
  position: absolute;
  border-radius: 50%;
  transition:
    top var(--brand-motion-duration) var(--brand-motion-ease),
    left var(--brand-motion-duration) var(--brand-motion-ease),
    width var(--brand-motion-duration) var(--brand-motion-ease),
    height var(--brand-motion-duration) var(--brand-motion-ease),
    filter var(--brand-motion-duration) var(--brand-motion-ease);
}

.chirp-brand-v2__orb--outer {
  top: 5.247cqw;
  left: 25.737cqw;
  width: 76.722cqw;
  height: 77.132cqw;
  background: rgb(169 252 255 / 72%);
}
.chirp-brand-v2__orb--middle {
  top: 16.231cqw;
  left: 36.662cqw;
  width: 54.871cqw;
  height: 55.164cqw;
  background: rgb(112 237 239 / 84%);
  filter: blur(1.144cqw);
  box-shadow: 0 1.129cqw 27.147cqw rgb(133 221 245 / 68%);
}
.chirp-brand-v2__orb--inner {
  top: 25.839cqw;
  left: 46.219cqw;
  width: 35.756cqw;
  height: 35.947cqw;
  background: #8ff7fb;
  filter: blur(0.564cqw);
}
.chirp-brand-v2__orb--core {
  top: 34.844cqw;
  left: 55.177cqw;
  width: 17.843cqw;
  height: 17.938cqw;
  background: #75ecef;
  filter: blur(0.564cqw);
  box-shadow: 0 1.129cqw 27.147cqw rgb(133 221 245 / 68%);
}
.chirp-brand-v2__orb--pulse {
  top: 38.81cqw;
  left: 59.121cqw;
  width: 9.951cqw;
  height: 10.004cqw;
  background: #13c6d2;
  filter: blur(0.318cqw);
  opacity: 0.22;
}

.chirp-brand-v2__wave {
  position: absolute;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: var(--wave-gap);
  transition:
    top var(--brand-motion-duration) var(--brand-motion-ease),
    left var(--brand-motion-duration) var(--brand-motion-ease),
    gap var(--brand-motion-duration) var(--brand-motion-ease);
}

.chirp-brand-v2__wave i {
  display: block;
  width: var(--wave-width);
  height: var(--wave-height);
  border-radius: var(--wave-radius);
  background: #14d7e4;
  filter: blur(var(--wave-blur));
  box-shadow: 0 var(--wave-shadow-y) var(--wave-shadow-blur)
    rgb(133 221 245 / 68%);
  transition:
    width var(--brand-motion-duration) var(--brand-motion-ease),
    height var(--brand-motion-duration) var(--brand-motion-ease),
    border-radius var(--brand-motion-duration) var(--brand-motion-ease),
    filter var(--brand-motion-duration) var(--brand-motion-ease),
    box-shadow var(--brand-motion-duration) var(--brand-motion-ease);
}

.chirp-brand-v2__wave i:nth-child(even) {
  background: #2fbecb;
}
.chirp-brand-v2__wave i:nth-child(4) {
  opacity: 0.76;
}
.chirp-brand-v2__wave i:nth-child(5) {
  background: #12bfca;
  opacity: 0.41;
}
.chirp-brand-v2__wave i:nth-child(6) {
  background: #28a2ad;
  opacity: 0.32;
}
.chirp-brand-v2__wave--animated {
  top: 23.561cqw;
  left: 9.341cqw;
  --wave-gap: 4.736cqw;
  --wave-radius: 4.736cqw;
  --wave-blur: 0.282cqw;
  --wave-shadow-y: 1.129cqw;
  --wave-shadow-blur: 5.728cqw;
}
.chirp-brand-v2__wave--animated i:nth-child(1) {
  --wave-width: 5.189cqw;
  --wave-height: 9.061cqw;
}
.chirp-brand-v2__wave--animated i:nth-child(2) {
  --wave-width: 4.827cqw;
  --wave-height: 41.365cqw;
}
.chirp-brand-v2__wave--animated i:nth-child(3) {
  --wave-width: 5.189cqw;
  --wave-height: 21.345cqw;
}
.chirp-brand-v2__wave--animated i:nth-child(4) {
  --wave-width: 4.328cqw;
  --wave-height: 33.201cqw;
}
.chirp-brand-v2__wave--animated i:nth-child(5) {
  --wave-width: 5.189cqw;
  --wave-height: 14.67cqw;
}
.chirp-brand-v2__wave--animated i:nth-child(6) {
  --wave-width: 5.189cqw;
  --wave-height: 9.061cqw;
}

.chirp-brand-v2__wordmark {
  position: absolute;
  z-index: 3;
  display: block;
  transition:
    top var(--brand-motion-duration) var(--brand-motion-ease),
    left var(--brand-motion-duration) var(--brand-motion-ease),
    width var(--brand-motion-duration) var(--brand-motion-ease),
    height var(--brand-motion-duration) var(--brand-motion-ease),
    opacity var(--brand-motion-duration) var(--brand-motion-ease);
}

.chirp-brand-v2__wordmark--animated {
  top: 9.382cqw;
  left: 7.327cqw;
  width: 23.57cqw;
  height: 7.608cqw;
  opacity: 0.526;
}

.chirp-brand-v2__main-bird {
  position: absolute;
  z-index: 2;
  top: 6.178cqw;
  left: 28.684cqw;
  width: 93.573cqw;
  height: 93.573cqw;
  transition:
    top var(--brand-motion-duration) var(--brand-motion-ease),
    left var(--brand-motion-duration) var(--brand-motion-ease),
    width var(--brand-motion-duration) var(--brand-motion-ease),
    height var(--brand-motion-duration) var(--brand-motion-ease);
}

.chirp-brand-v2__main-bird img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  max-width: none;
}
.chirp-brand-v2__main-bird img:last-child {
  mix-blend-mode: multiply;
  opacity: 0.7;
}

.chirp-brand-v2__leaf {
  position: absolute;
  z-index: 3;
  display: grid;
  place-items: center;
  transition:
    top var(--brand-motion-duration) var(--brand-motion-ease),
    left var(--brand-motion-duration) var(--brand-motion-ease),
    width var(--brand-motion-duration) var(--brand-motion-ease),
    height var(--brand-motion-duration) var(--brand-motion-ease),
    opacity 180ms ease;
}

.chirp-brand-v2__leaf img {
  display: block;
  max-width: none;
  transition:
    width var(--brand-motion-duration) var(--brand-motion-ease),
    height var(--brand-motion-duration) var(--brand-motion-ease),
    transform var(--brand-motion-duration) var(--brand-motion-ease);
}

.chirp-brand-v2__leaf--left {
  top: 57cqw;
  left: -14cqw;
  width: 60.232cqw;
  height: 59.701cqw;
  transform: rotate(35deg);
}
.chirp-brand-v2__leaf--left img {
  width: 49.72cqw;
  height: 41.109cqw;
  transform: scaleY(-1) rotate(-140deg);
}
.chirp-brand-v2__leaf--right {
  top: 72.994cqw;
  left: 59.146cqw;
  width: 32.647cqw;
  height: 35.762cqw;
}
.chirp-brand-v2__leaf--right img {
  width: 29.326cqw;
  height: 20.707cqw;
  transform: rotate(-59.8deg);
}

.chirp-brand-v2__blur {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 4;
  height: 57.208cqw;
  background: rgb(0 0 0 / 1%);
  backdrop-filter: blur(20cqw);
  mask-image: linear-gradient(to bottom, transparent, black);
  -webkit-mask-image: linear-gradient(to bottom, transparent, black);
  pointer-events: none;
  transition: height var(--brand-motion-duration) var(--brand-motion-ease);
}

:is(.project-card--chirp-brand:hover, .project-card--brand-hover-locked) .chirp-brand-v2__orb--outer {
  top: -7.076cqw;
  left: 9.767cqw;
  width: 120.369cqw;
  height: 121.012cqw;
}
:is(.project-card--chirp-brand:hover, .project-card--brand-hover-locked) .chirp-brand-v2__pict {
  transform: translateY(1px);
}
:is(.project-card--chirp-brand:hover, .project-card--brand-hover-locked) .chirp-brand-v2__orb--middle {
  top: 14.156cqw;
  left: 26.908cqw;
  width: 86.087cqw;
  height: 86.547cqw;
  filter: blur(1.795cqw);
}
:is(.project-card--chirp-brand:hover, .project-card--brand-hover-locked) .chirp-brand-v2__orb--inner {
  top: 29.229cqw;
  left: 41.902cqw;
  width: 56.097cqw;
  height: 56.398cqw;
  filter: blur(0.885cqw);
}
:is(.project-card--chirp-brand:hover, .project-card--brand-hover-locked) .chirp-brand-v2__orb--core {
  top: 43.355cqw;
  left: 55.954cqw;
  width: 27.994cqw;
  height: 28.144cqw;
  filter: blur(0.885cqw);
}
:is(.project-card--chirp-brand:hover, .project-card--brand-hover-locked) .chirp-brand-v2__orb--pulse {
  top: 49.579cqw;
  left: 62.144cqw;
  width: 15.613cqw;
  height: 15.696cqw;
  filter: blur(0.499cqw);
}
:is(.project-card--chirp-brand:hover, .project-card--brand-hover-locked) .chirp-brand-v2__wave--animated {
  top: 22.858cqw;
  left: -18.123cqw;
  --wave-gap: 4.618cqw;
  --wave-radius: 6.618cqw;
  --wave-blur: 0.394cqw;
  --wave-shadow-y: 1.577cqw;
  --wave-shadow-blur: 8.005cqw;
}
:is(.project-card--chirp-brand:hover, .project-card--brand-hover-locked) .chirp-brand-v2__wave--animated i:nth-child(1) {
  --wave-width: 7.252cqw;
  --wave-height: 12.663cqw;
}
:is(.project-card--chirp-brand:hover, .project-card--brand-hover-locked) .chirp-brand-v2__wave--animated i:nth-child(2) {
  --wave-width: 6.746cqw;
  --wave-height: 57.81cqw;
}
:is(.project-card--chirp-brand:hover, .project-card--brand-hover-locked) .chirp-brand-v2__wave--animated i:nth-child(3) {
  --wave-width: 7.252cqw;
  --wave-height: 29.83cqw;
}
:is(.project-card--chirp-brand:hover, .project-card--brand-hover-locked) .chirp-brand-v2__wave--animated i:nth-child(4) {
  --wave-width: 6.048cqw;
  --wave-height: 46.4cqw;
}
:is(.project-card--chirp-brand:hover, .project-card--brand-hover-locked) .chirp-brand-v2__wave--animated i:nth-child(5) {
  --wave-width: 7.252cqw;
  --wave-height: 20.502cqw;
}
:is(.project-card--chirp-brand:hover, .project-card--brand-hover-locked) .chirp-brand-v2__wave--animated i:nth-child(6) {
  --wave-width: 7.252cqw;
  --wave-height: 12.663cqw;
}
:is(.project-card--chirp-brand:hover, .project-card--brand-hover-locked) .chirp-brand-v2__wordmark--animated {
  top: 9.661cqw;
  left: 6.955cqw;
  width: 45.61cqw;
  height: 14.601cqw;
  opacity: 1;
}
:is(.project-card--chirp-brand:hover, .project-card--brand-hover-locked) .chirp-brand-v2__main-bird {
  top: -3.076cqw;
  left: 9.767cqw;
  width: 153.039cqw;
  height: 153.039cqw;
}
:is(.project-card--chirp-brand:hover, .project-card--brand-hover-locked) .chirp-brand-v2__leaf--left {
  top: 51cqw;
  left: -46.677cqw;
  width: 115.315cqw;
  height: 114.297cqw;
}
:is(.project-card--chirp-brand:hover, .project-card--brand-hover-locked) .chirp-brand-v2__leaf--left img {
  width: 95.197cqw;
  height: 67.217cqw;
}
:is(.project-card--chirp-brand:hover, .project-card--brand-hover-locked) .chirp-brand-v2__leaf--right {
  top: 105.345cqw;
  left: 61.432cqw;
  width: 32.647cqw;
  height: 35.762cqw;
}
:is(.project-card--chirp-brand:hover, .project-card--brand-hover-locked) .chirp-brand-v2__leaf--right img {
  width: 29.326cqw;
  height: 20.707cqw;
  transform: rotate(-59.8deg);
}
:is(.project-card--chirp-brand:hover, .project-card--brand-hover-locked) .chirp-brand-v2__blur {
  height: 57.208cqw;
}

.project-card--chirp-brand:not(.project-card--brand-hover-locked):is(:active, .project-card--brand-active-locked) .chirp-brand-v2__orb--outer {
  top: 5.039cqw;
  left: 13.767cqw;
  width: 100cqw;
  height: 100cqw;
}
.project-card--chirp-brand:not(.project-card--brand-hover-locked):is(:active, .project-card--brand-active-locked) .chirp-brand-v2__pict {
  transform: translateY(1px);
}
.project-card--chirp-brand:not(.project-card--brand-hover-locked):is(:active, .project-card--brand-active-locked) .chirp-brand-v2__orb--middle {
  top: 17.27cqw;
  left: 24.908cqw;
  width: 86.087cqw;
  height: 86.547cqw;
  filter: blur(1.795cqw);
}
.project-card--chirp-brand:not(.project-card--brand-hover-locked):is(:active, .project-card--brand-active-locked) .chirp-brand-v2__orb--inner {
  top: 28.344cqw;
  left: 37.902cqw;
  width: 56.097cqw;
  height: 56.398cqw;
  filter: blur(0.885cqw);
}
.project-card--chirp-brand:not(.project-card--brand-hover-locked):is(:active, .project-card--brand-active-locked) .chirp-brand-v2__orb--core {
  top: 43.47cqw;
  left: 55.954cqw;
  width: 27.994cqw;
  height: 28.144cqw;
  filter: blur(0.885cqw);
}
.project-card--chirp-brand:not(.project-card--brand-hover-locked):is(:active, .project-card--brand-active-locked) .chirp-brand-v2__orb--pulse {
  top: 49.693cqw;
  left: 62.144cqw;
  width: 15.613cqw;
  height: 15.696cqw;
  filter: blur(0.499cqw);
}
.project-card--chirp-brand:not(.project-card--brand-hover-locked):is(:active, .project-card--brand-active-locked) .chirp-brand-v2__wave--animated {
  top: 25.858cqw;
  left: 0.877cqw;
  --wave-gap: 2.618cqw;
  --wave-radius: 6.618cqw;
  --wave-blur: 0.394cqw;
  --wave-shadow-y: 1.577cqw;
  --wave-shadow-blur: 8.005cqw;
}
.project-card--chirp-brand:not(.project-card--brand-hover-locked):is(:active, .project-card--brand-active-locked) .chirp-brand-v2__wave--animated i:nth-child(1) {
  --wave-width: 5.607cqw;
  --wave-height: 9.79cqw;
}
.project-card--chirp-brand:not(.project-card--brand-hover-locked):is(:active, .project-card--brand-active-locked) .chirp-brand-v2__wave--animated i:nth-child(2) {
  --wave-width: 5.216cqw;
  --wave-height: 44.694cqw;
}
.project-card--chirp-brand:not(.project-card--brand-hover-locked):is(:active, .project-card--brand-active-locked) .chirp-brand-v2__wave--animated i:nth-child(3) {
  --wave-width: 5.607cqw;
  --wave-height: 23.062cqw;
}
.project-card--chirp-brand:not(.project-card--brand-hover-locked):is(:active, .project-card--brand-active-locked) .chirp-brand-v2__wave--animated i:nth-child(4) {
  --wave-width: 4.676cqw;
  --wave-height: 35.873cqw;
}
.project-card--chirp-brand:not(.project-card--brand-hover-locked):is(:active, .project-card--brand-active-locked) .chirp-brand-v2__wave--animated i:nth-child(5) {
  --wave-width: 5.607cqw;
  --wave-height: 15.851cqw;
}
.project-card--chirp-brand:not(.project-card--brand-hover-locked):is(:active, .project-card--brand-active-locked) .chirp-brand-v2__wave--animated i:nth-child(6) {
  --wave-width: 5.607cqw;
  --wave-height: 9.79cqw;
}
.project-card--chirp-brand:not(.project-card--brand-hover-locked):is(:active, .project-card--brand-active-locked) .chirp-brand-v2__wordmark--animated {
  top: 9.776cqw;
  left: 6.955cqw;
  width: 38.135cqw;
  height: 12.208cqw;
  opacity: 1;
}
.project-card--chirp-brand:not(.project-card--brand-hover-locked):is(:active, .project-card--brand-active-locked) .chirp-brand-v2__main-bird {
  top: 5.481cqw;
  left: 13.906cqw;
  width: 118.318cqw;
  height: 118.318cqw;
}
.project-card--chirp-brand:not(.project-card--brand-hover-locked):is(:active, .project-card--brand-active-locked) .chirp-brand-v2__leaf--left {
  top: 49.693cqw;
  left: -30.849cqw;
  width: 77.827cqw;
  height: 77.141cqw;
}
.project-card--chirp-brand:not(.project-card--brand-hover-locked):is(:active, .project-card--brand-active-locked) .chirp-brand-v2__leaf--left img {
  width: 64.25cqw;
  height: 45.366cqw;
}
.project-card--chirp-brand:not(.project-card--brand-hover-locked):is(:active, .project-card--brand-active-locked) .chirp-brand-v2__leaf--right {
  top: 88.036cqw;
  left: 53.627cqw;
  width: 32.647cqw;
  height: 35.762cqw;
}
.project-card--chirp-brand:not(.project-card--brand-hover-locked):is(:active, .project-card--brand-active-locked) .chirp-brand-v2__leaf--right img {
  width: 29.326cqw;
  height: 20.707cqw;
  transform: rotate(-59.8deg);
}
.project-card--chirp-brand:not(.project-card--brand-hover-locked):is(:active, .project-card--brand-active-locked) .chirp-brand-v2__blur {
  height: 57.208cqw;
}

.project-card--brand-hover-locked .chirp-brand-v2,
.project-card--brand-hover-locked .chirp-brand-v2 *,
.project-card--brand-active-locked .chirp-brand-v2,
.project-card--brand-active-locked .chirp-brand-v2 * {
  transition: none !important;
}

/* Local inspection aid. Enable with ?layers=brand; it is inert otherwise. */
.project-card--brand-debug .chirp-brand-v2 [data-layer] {
  outline: 1px dashed #d500ff;
  outline-offset: -1px;
}

.project-card--brand-debug .chirp-brand-v2 [data-layer]:not(img)::after {
  position: absolute;
  z-index: 10;
  top: 0;
  left: 0;
  padding: 2px 4px;
  background: #d500ff;
  color: white;
  content: attr(data-layer);
  font: 10px/1 ui-monospace, monospace;
  pointer-events: none;
  white-space: nowrap;
}

@media (prefers-reduced-motion: reduce) {
  .chirp-brand-v2,
  .chirp-brand-v2 * {
    transition: none !important;
  }
}
</style>
