<script setup lang="ts">
const props = withDefaults(defineProps<{ active?: boolean }>(), {
  active: false,
});

const dsAsset = (fileName: string) => `cases/chirp-design-system/layers/${fileName}`;
</script>

<template>
  <div class="chirp-ds-v2" aria-hidden="true">
    <div class="chirp-ds-v2__pict">
      <img :src="dsAsset('color-brand.png')" alt="" class="chirp-ds-v2__layer chirp-ds-v2__color-brand" />
      <img :src="dsAsset('images.png')" alt="" class="chirp-ds-v2__layer chirp-ds-v2__images" />
      <img :src="dsAsset('input-text.png')" alt="" class="chirp-ds-v2__layer chirp-ds-v2__input-text" />
      <img :src="dsAsset('chat-bubble.png')" alt="" class="chirp-ds-v2__layer chirp-ds-v2__chat-bubble" />
      <img :src="dsAsset('logotype.png')" alt="" class="chirp-ds-v2__layer chirp-ds-v2__logotype" />
      <img :src="dsAsset('date-picker.png')" alt="" class="chirp-ds-v2__layer chirp-ds-v2__date-picker" />
      <img :src="dsAsset('row-stepper-item.png')" alt="" class="chirp-ds-v2__layer chirp-ds-v2__row-stepper-middle" />
      <img :src="dsAsset('gender-select.png')" alt="" class="chirp-ds-v2__layer chirp-ds-v2__gender-select" />
      <img :src="dsAsset('button.png')" alt="" class="chirp-ds-v2__layer chirp-ds-v2__button" />
      <img :src="dsAsset('row-stepper-item.png')" alt="" class="chirp-ds-v2__layer chirp-ds-v2__row-stepper-right" />
      <img :src="dsAsset('row-query-result.png')" alt="" class="chirp-ds-v2__layer chirp-ds-v2__row-query" />
      <img :src="dsAsset('row-diagnosis.png')" alt="" class="chirp-ds-v2__layer chirp-ds-v2__row-diagnosis" />
      <img :src="dsAsset('row-list-item.png')" alt="" class="chirp-ds-v2__layer chirp-ds-v2__row-list-item" />

      <div class="chirp-ds-v2__code"><img :src="dsAsset('code.png')" alt="" /></div>
      <img :src="dsAsset('ellipse-active-glow.svg')" alt="" class="chirp-ds-v2__ellipse chirp-ds-v2__ellipse-5" data-layer="Ellipse 5" />
      <img :src="dsAsset(props.active ? 'ellipse-pressed.svg' : 'ellipse-hover.svg')" alt="" class="chirp-ds-v2__ellipse chirp-ds-v2__ellipse-6" data-layer="Ellipse 6" />
    </div>

    <div class="chirp-ds-v2__blur" />
  </div>
</template>

<style>
.chirp-ds-v2 {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  background: #4ff5f5;
}

.chirp-ds-v2__pict {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.chirp-ds-v2__layer,
.chirp-ds-v2__code,
.chirp-ds-v2__ellipse {
  position: absolute;
  display: block;
  max-width: none;
}

.chirp-ds-v2__layer {
  z-index: 1;
  object-fit: cover;
  transition:
    top 300ms cubic-bezier(0.22, 1, 0.36, 1),
    left 300ms cubic-bezier(0.22, 1, 0.36, 1),
    width 300ms cubic-bezier(0.22, 1, 0.36, 1),
    height 300ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 300ms cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 300ms cubic-bezier(0.22, 1, 0.36, 1);
}

.chirp-ds-v2__color-brand { top: -13.043cqw; left: 0; width: 32.737cqw; height: 30.402cqw; }
.chirp-ds-v2__images { top: 18.7cqw; left: 0; width: 32.737cqw; height: 41.857cqw; }
.chirp-ds-v2__input-text { top: 61.902cqw; left: 0; width: 32.737cqw; height: 19.544cqw; }
.chirp-ds-v2__chat-bubble { top: 82.787cqw; left: 0; z-index: 3; width: 32.737cqw; height: 83.606cqw; opacity: 1; }
.chirp-ds-v2__logotype { top: -11.899cqw; left: 34.08cqw; width: 32.514cqw; height: 45.939cqw; }
.chirp-ds-v2__date-picker { top: 35.382cqw; left: 34.08cqw; z-index: 4; width: 32.514cqw; height: 32.136cqw; }
.chirp-ds-v2__row-stepper-middle { top: 68.861cqw; left: 34.08cqw; width: 32.514cqw; height: 10.568cqw; }
.chirp-ds-v2__gender-select { top: 80.771cqw; left: 34.08cqw; width: 32.514cqw; height: 53.272cqw; }
.chirp-ds-v2__button { top: -15.332cqw; left: 67.934cqw; width: 32.066cqw; height: 67.003cqw; }
.chirp-ds-v2__row-stepper-right { top: 53.013cqw; left: 67.934cqw; width: 32.066cqw; height: 10.423cqw; }
.chirp-ds-v2__row-query { top: 64.777cqw; left: 67.934cqw; width: 32.066cqw; height: 10.636cqw; }
.chirp-ds-v2__row-diagnosis { top: 76.754cqw; left: 67.934cqw; width: 32.066cqw; height: 18.612cqw; }
.chirp-ds-v2__row-list-item { top: 96.709cqw; left: 67.934cqw; width: 32.066cqw; height: 42.116cqw; }

.chirp-ds-v2__code {
  top: 110.485cqw;
  left: 0;
  z-index: 5;
  width: 91.5cqw;
  height: 65.652cqw;
  padding-block: 1.194cqw;
  overflow: hidden;
  border-radius: 2.387cqw;
  background: #1e1e1e;
  opacity: 0;
  transition:
    top 300ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 300ms cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 300ms cubic-bezier(0.22, 1, 0.36, 1);
}

.chirp-ds-v2__code img {
  position: absolute;
  top: 0.17%;
  left: 0;
  width: 100.44%;
  height: 858.06%;
  max-width: none;
  transition: top 300ms cubic-bezier(0.22, 1, 0.36, 1);
}

.chirp-ds-v2__ellipse-5 {
  top: -118.53%;
  left: -139.37%;
  z-index: 2;
  width: 278.96%;
  height: 222.76%;
  opacity: 0;
}

.chirp-ds-v2__ellipse-6 {
  top: 40%;
  left: -0.75%;
  z-index: 6;
  width: 223.75%;
  height: 113.32%;
  transition:
    top 300ms cubic-bezier(0.22, 1, 0.36, 1),
    left 300ms cubic-bezier(0.22, 1, 0.36, 1),
    width 300ms cubic-bezier(0.22, 1, 0.36, 1),
    height 300ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 300ms cubic-bezier(0.22, 1, 0.36, 1);
}

.chirp-ds-v2__blur {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 7;
  height: 57.208cqw;
  background: rgb(0 0 0 / 1%);
  backdrop-filter: blur(20cqw);
  mask-image: linear-gradient(to bottom, transparent, black);
  -webkit-mask-image: linear-gradient(to bottom, transparent, black);
  pointer-events: none;
}

:is(.project-card--chirp-design-system:hover:not(.project-card--ds-active-locked):not(:active), .project-card--ds-hover-locked) .chirp-ds-v2__color-brand { top: -21.739cqw; }
:is(.project-card--chirp-design-system:hover:not(.project-card--ds-active-locked):not(:active), .project-card--ds-hover-locked) .chirp-ds-v2__images { top: 10.005cqw; }
:is(.project-card--chirp-design-system:hover:not(.project-card--ds-active-locked):not(:active), .project-card--ds-hover-locked) .chirp-ds-v2__input-text { top: 53.206cqw; }
:is(.project-card--chirp-design-system:hover:not(.project-card--ds-active-locked):not(:active), .project-card--ds-hover-locked) .chirp-ds-v2__logotype { top: -21.739cqw; }
:is(.project-card--chirp-design-system:hover:not(.project-card--ds-active-locked):not(:active), .project-card--ds-hover-locked) .chirp-ds-v2__row-stepper-middle { top: 59.02cqw; }
:is(.project-card--chirp-design-system:hover:not(.project-card--ds-active-locked):not(:active), .project-card--ds-hover-locked) .chirp-ds-v2__gender-select { top: 70.931cqw; }
:is(.project-card--chirp-design-system:hover:not(.project-card--ds-active-locked):not(:active), .project-card--ds-hover-locked) .chirp-ds-v2__button { top: -21.739cqw; }
:is(.project-card--chirp-design-system:hover:not(.project-card--ds-active-locked):not(:active), .project-card--ds-hover-locked) .chirp-ds-v2__row-stepper-right { top: 46.606cqw; }
:is(.project-card--chirp-design-system:hover:not(.project-card--ds-active-locked):not(:active), .project-card--ds-hover-locked) .chirp-ds-v2__row-query { top: 58.37cqw; }
:is(.project-card--chirp-design-system:hover:not(.project-card--ds-active-locked):not(:active), .project-card--ds-hover-locked) .chirp-ds-v2__row-diagnosis { top: 70.348cqw; }
:is(.project-card--chirp-design-system:hover:not(.project-card--ds-active-locked):not(:active), .project-card--ds-hover-locked) .chirp-ds-v2__row-list-item { top: 90.303cqw; }

:is(.project-card--chirp-design-system:hover:not(.project-card--ds-active-locked):not(:active), .project-card--ds-hover-locked) .chirp-ds-v2__chat-bubble {
  top: 7.904cqw;
  left: 8.501cqw;
  width: 55.056cqw;
  height: 140.607cqw;
  box-shadow: 0.756cqw 1.512cqw 5cqw rgb(44 31 57 / 10%);
}

:is(.project-card--chirp-design-system:hover:not(.project-card--ds-active-locked):not(:active), .project-card--ds-hover-locked) .chirp-ds-v2__date-picker {
  top: 14.76cqw;
  left: 44.234cqw;
  width: 47.299cqw;
  height: 46.75cqw;
  box-shadow: 0.756cqw 1.512cqw 7.181cqw rgb(44 31 57 / 30%);
}

:is(.project-card--chirp-design-system:hover:not(.project-card--ds-active-locked):not(:active), .project-card--ds-hover-locked) .chirp-ds-v2__code {
  top: 65.011cqw;
  opacity: 1;
  box-shadow: 0.756cqw 1.512cqw 7.181cqw rgb(44 31 57 / 30%);
}

:is(.project-card--chirp-design-system:hover:not(.project-card--ds-active-locked):not(:active), .project-card--ds-hover-locked) .chirp-ds-v2__code img {
  top: -263.32%;
}

:is(.project-card--chirp-design-system:hover:not(.project-card--ds-active-locked):not(:active), .project-card--ds-hover-locked) .chirp-ds-v2__ellipse-6 {
  top: 59%;
  left: 18.31%;
  width: 113.27%;
  height: 93.32%;
}

:is(.project-card--chirp-design-system:hover:not(.project-card--ds-active-locked):not(:active), .project-card--ds-hover-locked) .chirp-ds-v2__ellipse-5 { opacity: 1; }

/* Pressed — Figma 815:2344. */
:is(.project-card--chirp-design-system:active, .project-card--ds-active-locked) .chirp-ds-v2__color-brand { top: -18.764cqw; width: 32.676cqw; height: 30.346cqw; }
:is(.project-card--chirp-design-system:active, .project-card--ds-active-locked) .chirp-ds-v2__images { top: 12.922cqw; width: 32.676cqw; height: 41.779cqw; }
:is(.project-card--chirp-design-system:active, .project-card--ds-active-locked) .chirp-ds-v2__input-text { top: 56.041cqw; width: 32.676cqw; height: 19.508cqw; }
:is(.project-card--chirp-design-system:active, .project-card--ds-active-locked) .chirp-ds-v2__logotype { top: -18.764cqw; left: 34.016cqw; width: 32.452cqw; height: 45.854cqw; }
:is(.project-card--chirp-design-system:active, .project-card--ds-active-locked) .chirp-ds-v2__row-stepper-middle { top: 61.844cqw; left: 34.016cqw; width: 32.452cqw; height: 10.549cqw; }
:is(.project-card--chirp-design-system:active, .project-card--ds-active-locked) .chirp-ds-v2__gender-select { top: 73.732cqw; left: 34.016cqw; width: 32.452cqw; height: 53.173cqw; }
:is(.project-card--chirp-design-system:active, .project-card--ds-active-locked) .chirp-ds-v2__button { top: -18.764cqw; left: 67.808cqw; width: 32.006cqw; height: 66.879cqw; }
:is(.project-card--chirp-design-system:active, .project-card--ds-active-locked) .chirp-ds-v2__row-stepper-right { top: 49.453cqw; left: 67.808cqw; width: 32.006cqw; height: 10.403cqw; opacity: 0.6; }
:is(.project-card--chirp-design-system:active, .project-card--ds-active-locked) .chirp-ds-v2__row-query { top: 61.197cqw; left: 67.808cqw; width: 32.006cqw; height: 10.616cqw; }

:is(.project-card--chirp-design-system:active, .project-card--ds-active-locked) .chirp-ds-v2__chat-bubble {
  top: 6.938cqw;
  left: 7.735cqw;
  width: 46.092cqw;
  height: 117.714cqw;
  opacity: 1;
  box-shadow: 0.754cqw 1.509cqw 4.99cqw rgb(44 31 57 / 10%);
}

:is(.project-card--chirp-design-system:active, .project-card--ds-active-locked) .chirp-ds-v2__date-picker {
  top: 11.68cqw;
  left: 42.421cqw;
  width: 39.405cqw;
  height: 38.948cqw;
  box-shadow: 0.754cqw 1.509cqw 7.168cqw rgb(44 31 57 / 30%);
}

:is(.project-card--chirp-design-system:active, .project-card--ds-active-locked) .chirp-ds-v2__row-diagnosis {
  top: 52.602cqw;
  left: 56.568cqw;
  width: 45.493cqw;
  height: 26.405cqw;
}

:is(.project-card--chirp-design-system:active, .project-card--ds-active-locked) .chirp-ds-v2__row-list-item {
  top: 81.05cqw;
  left: 56.645cqw;
  width: 45.415cqw;
  height: 59.65cqw;
}

:is(.project-card--chirp-design-system:active, .project-card--ds-active-locked) .chirp-ds-v2__code {
  top: 67.824cqw;
  left: 0;
  width: 91.33cqw;
  height: 65.529cqw;
  opacity: 1;
  box-shadow: 0.754cqw 1.509cqw 7.168cqw rgb(44 31 57 / 30%);
}

:is(.project-card--chirp-design-system:active, .project-card--ds-active-locked) .chirp-ds-v2__code img { top: -435.01%; }

:is(.project-card--chirp-design-system:active, .project-card--ds-active-locked) .chirp-ds-v2__ellipse-5 {
  top: -146.224cqw;
  left: -139.359cqw;
  width: 278.947cqw;
  height: 274.828cqw;
  opacity: 1;
}

:is(.project-card--chirp-design-system:active, .project-card--ds-active-locked) .chirp-ds-v2__ellipse-6 {
  top: 29.451cqw;
  left: -12.011cqw;
  width: 189.906cqw;
  height: 189.737cqw;
}

:is(.project-card--chirp-design-system:active, .project-card--ds-active-locked) .chirp-ds-v2__blur { height: 45.767cqw; }

.project-card--ds-hover-locked .chirp-ds-v2,
.project-card--ds-hover-locked .chirp-ds-v2 *,
.project-card--ds-active-locked .chirp-ds-v2,
.project-card--ds-active-locked .chirp-ds-v2 * {
  transition: none !important;
}

/* Local inspection aid. Enable with ?layers=ds; it is inert otherwise. */
.project-card--ds-debug .chirp-ds-v2__layer,
.project-card--ds-debug .chirp-ds-v2__code,
.project-card--ds-debug .chirp-ds-v2__ellipse {
  outline: 1px dashed #d500ff;
  outline-offset: -1px;
}
</style>
