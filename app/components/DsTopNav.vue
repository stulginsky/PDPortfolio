<script setup lang="ts">
import DsTab from './DsTab.vue'
import DsButtonIcon from './DsButtonIcon.vue'
import './resume-actions-motion.css'

const props = withDefaults(
  defineProps<{
    /** Figma Place: controls the current view and Resume actions. */
    place?: 'Vitrina' | 'Resume'
    /** Accessible name of the navigation landmark. */
    ariaLabel?: string
  }>(),
  {
    place: 'Vitrina',
    ariaLabel: 'Навигация портфолио',
  },
)

const emit = defineEmits<{
  /** Requests a view change; the consumer owns Place. */
  'update:place': [place: 'Vitrina' | 'Resume']
  /** Consumer supplies the download action. */
  download: [event: MouseEvent]
  /** Consumer supplies the print action. */
  print: [event: MouseEvent]
}>()

function selectPlace(place: 'Vitrina' | 'Resume') {
  if (place !== props.place) emit('update:place', place)
}
</script>

<template>
  <nav class="ds-top-nav" :aria-label="ariaLabel">
    <div class="ds-top-nav__layout">
      <div class="ds-top-nav__tabs">
        <DsTab
          class="ds-top-nav__tab"
          tab-label="Проекты"
          :toggled="place === 'Vitrina'"
          @click="selectPlace('Vitrina')"
        />
        <DsTab
          class="ds-top-nav__tab"
          tab-label="Резюме"
          :toggled="place === 'Resume'"
          @click="selectPlace('Resume')"
        />
      </div>
      <div v-if="place === 'Resume'" class="ds-top-nav__actions resume-actions-enter">
        <DsButtonIcon
          icon="Download"
          aria-label="Скачать резюме PDF"
          @click="emit('download', $event)"
        />
        <DsButtonIcon
          icon="Print"
          aria-label="Печать резюме"
          @click="emit('print', $event)"
        />
      </div>
    </div>
  </nav>
</template>

<style scoped>
/* TopNav — 1025:7335. Sticky navigation is a separate Component Set. */
.ds-top-nav {
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  padding: 0 var(--space-4);
}

.ds-top-nav__layout {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-8);
  width: 100%;
  min-width: 0;
}

.ds-top-nav__tabs {
  display: flex;
  align-items: center;
  gap: var(--space-6);
  flex: none;
  width: 100%;
}

.ds-top-nav__tab {
  flex: 1 1 0;
  min-width: 0;
}

.ds-top-nav__actions {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  flex: none;
}

/* Preserve Figma's centred 288px tab group, with actions extending right. */
.ds-top-nav[data-storybook-breakpoint='min-570'] {
  padding: 0;
}

.ds-top-nav[data-storybook-breakpoint='min-570'] .ds-top-nav__layout {
  flex-direction: row;
  gap: var(--space-6);
  width: 288px;
}

@media (min-width: 570px) {
  .ds-top-nav:not([data-storybook-breakpoint='base']) {
    padding: 0;
  }

  .ds-top-nav:not([data-storybook-breakpoint='base']) .ds-top-nav__layout {
    flex-direction: row;
    gap: var(--space-6);
    width: 288px;
  }
}
</style>
