<script setup lang="ts">
import DsButtonIcon from './DsButtonIcon.vue'

const props = withDefaults(
  defineProps<{
    /** Figma TEXT property Title#1016:1. */
    title?: string
  }>(),
  {
    title: 'Value',
  },
)

const emit = defineEmits<{
  /** The consumer opens the image viewer; the media itself is not a trigger. */
  zoom: [event: MouseEvent]
}>()
</script>

<template>
  <section class="ds-img-title" aria-label="Заголовок изображения">
    <div class="ds-img-title__row">
      <div class="ds-img-title__title-wrap">
        <h2 class="ds-img-title__title">{{ props.title }}</h2>
      </div>
      <DsButtonIcon
        class="ds-img-title__zoom"
        icon="MagnifyingGlass"
        :aria-label="`Увеличить изображение «${props.title}»`"
        @click="emit('zoom', $event)"
      />
    </div>
  </section>
</template>

<style scoped>
/* ImgTitle — Figma 1016:5882. */
.ds-img-title {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 100%;
  min-height: 74px;
  padding: var(--space-3) var(--space-3) var(--space-3) var(--space-6);
  border-radius: var(--radius-xxxlg);
  background: var(--surface-subtle);
}

.ds-img-title__row {
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 0;
  gap: var(--space-3);
}

.ds-img-title__title-wrap {
  display: flex;
  align-self: stretch;
  align-items: center;
  flex: 1 1 auto;
  min-width: 0;
  padding-left: var(--space-2);
}

.ds-img-title__title {
  margin: 0;
  color: var(--text-muted);
  font-family: var(--text-font-sans);
  font-size: var(--text-size-lg);
  font-weight: var(--text-weight-semibold);
  font-variation-settings: var(--font-variation-heading-base);
  line-height: 1.45;
  letter-spacing: 0.01em;
  overflow-wrap: break-word;
}

.ds-img-title__zoom {
  flex: none;
  --button-base-default-color: var(--text-muted);
}

@media (hover: hover) and (pointer: fine) {
  .ds-img-title:not([data-storybook-breakpoint='base']) :deep(.button-base:hover:not(:active):not(:disabled):not([aria-disabled='true']):not(.button-base--pressed):not(.button-base--hover-suppressed)) {
    color: var(--text-muted);
  }

  .ds-img-title[data-storybook-breakpoint='base'] :deep(.button-base:hover:not(:active):not(:disabled):not([aria-disabled='true']):not(.button-base--pressed):not(.button-base--hover-suppressed)) {
    background: transparent;
    color: var(--text-muted);
  }
}

@media (max-width: 767px) and (hover: hover) and (pointer: fine) {
  .ds-img-title:not([data-storybook-breakpoint='min-768']) :deep(.button-base:hover:not(:active):not(:disabled):not([aria-disabled='true']):not(.button-base--pressed):not(.button-base--hover-suppressed)) {
    background: transparent;
    color: var(--text-muted);
  }
}

@media (min-width: 768px) {
  .ds-img-title:not([data-storybook-breakpoint='base']) {
    width: 100%;
    max-width: 924px;
    min-height: 74px;
  }

  .ds-img-title:not([data-storybook-breakpoint='base']) .ds-img-title__row {
    padding-left: var(--space-2);
  }

  .ds-img-title:not([data-storybook-breakpoint='base']) .ds-img-title__title-wrap {
    padding-left: 0;
  }

  .ds-img-title:not([data-storybook-breakpoint='base']) .ds-img-title__title {
    font-size: var(--text-size-xl);
    font-variation-settings: var(--font-variation-heading-md);
    line-height: 1.3;
    letter-spacing: 0.03em;
  }
}

/* Storybook's iframe keeps a desktop viewport while its sandbox previews boundaries. */
.ds-img-title[data-storybook-breakpoint='base'] {
  width: 100%;
  min-height: 74px;
}

.ds-img-title[data-storybook-breakpoint='base'] .ds-img-title__row {
  padding-left: 0;
}

.ds-img-title[data-storybook-breakpoint='base'] .ds-img-title__title-wrap {
  padding-left: var(--space-2);
}

.ds-img-title[data-storybook-breakpoint='base'] .ds-img-title__title {
  font-size: var(--text-size-lg);
  font-variation-settings: var(--font-variation-heading-base);
  line-height: 1.45;
  letter-spacing: 0.01em;
}

.ds-img-title[data-storybook-breakpoint='min-768'] {
  width: 100%;
  max-width: 924px;
  min-height: 74px;
}

.ds-img-title[data-storybook-breakpoint='min-768'] .ds-img-title__row {
  padding-left: var(--space-2);
}

.ds-img-title[data-storybook-breakpoint='min-768'] .ds-img-title__title-wrap {
  padding-left: 0;
}

.ds-img-title[data-storybook-breakpoint='min-768'] .ds-img-title__title {
  font-size: var(--text-size-xl);
  font-variation-settings: var(--font-variation-heading-md);
  line-height: 1.3;
  letter-spacing: 0.03em;
}

/* Width boundary is independent of the min-768 typography boundary. */
@media (min-width: 769px) {
  .ds-img-title:not([data-storybook-breakpoint='base']) {
    width: fit-content;
  }
}
</style>
