<script setup lang="ts">
import DsAvatarSm from './DsAvatarSm.vue'
import DsTab from './DsTab.vue'
import DsButtonIcon from './DsButtonIcon.vue'
import './resume-actions-motion.css'

const props = withDefaults(defineProps<{
  /** Current view; the consumer controls navigation. */
  place?: 'Vitrina' | 'Resume'
  /** Accessible navigation landmark name. */
  ariaLabel?: string
}>(), { place: 'Resume', ariaLabel: 'Навигация резюме' })

const emit = defineEmits<{
  'update:place': [place: 'Vitrina' | 'Resume']
  'avatar-click': [event: MouseEvent]
  projects: [event: MouseEvent]
  download: [event: MouseEvent]
  print: [event: MouseEvent]
}>()

function selectPlace(place: 'Vitrina' | 'Resume', event: MouseEvent) {
  if (place === props.place) return
  emit('update:place', place)
  if (place === 'Vitrina') emit('projects', event)
}
</script>

<template>
  <nav class="ds-top-nav-scroll-resume" :data-place="place" :aria-label="ariaLabel">
    <div class="ds-top-nav-scroll-resume__panel">
      <div class="ds-top-nav-scroll-resume__navigation">
        <DsAvatarSm @click="emit('avatar-click', $event)" />
        <div class="ds-top-nav-scroll-resume__tabs">
          <DsTab tab-label="Проекты" :toggled="place === 'Vitrina'" @click="selectPlace('Vitrina', $event)" />
          <DsTab tab-label="Резюме" :toggled="place === 'Resume'" @click="selectPlace('Resume', $event)" />
        </div>
      </div>
      <div v-if="place === 'Resume'" class="ds-top-nav-scroll-resume__actions resume-actions-enter">
        <DsButtonIcon icon="Download" aria-label="Скачать резюме PDF" @click="emit('download', $event)" />
        <DsButtonIcon icon="Print" aria-label="Печать резюме" @click="emit('print', $event)" />
      </div>
    </div>
  </nav>
</template>

<style scoped>
.ds-top-nav-scroll-resume {
  position: sticky;
  top: 0;
  z-index: 10;
  width: 100%;
  box-sizing: border-box;
  padding-top: 0;
  margin-inline: auto;
}
.ds-top-nav-scroll-resume__panel {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-8);
  padding: var(--space-4);
  background: var(--surface-default);
  border-radius: 0 0 var(--radius-xxlg) var(--radius-xxlg);
  box-shadow: var(--effect-shadow-1st);
}
.ds-top-nav-scroll-resume__navigation {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
.ds-top-nav-scroll-resume__tabs { display: contents; }
.ds-top-nav-scroll-resume__tabs :deep(.ds-tab:last-child) { width: 100px; }
.ds-top-nav-scroll-resume__actions {
  display: flex;
  gap: var(--space-4);
  flex: none;
}
@media (min-width: 534px) {
  .ds-top-nav-scroll-resume { width: var(--resume-nav-width); }
  .ds-top-nav-scroll-resume__panel { flex-direction: row; gap: var(--space-6); }
  .ds-top-nav-scroll-resume__navigation { width: 362px; gap: var(--space-6); flex: none; }
  .ds-top-nav-scroll-resume__tabs { display: flex; width: 288px; gap: var(--space-6); }
  .ds-top-nav-scroll-resume__tabs :deep(.ds-tab) { flex: 1 1 0; min-width: 0; }
}
@media (min-width: 768px) {
  .ds-top-nav-scroll-resume { padding-top: var(--space-2); }
  .ds-top-nav-scroll-resume__panel { border-radius: var(--radius-xxxlg); }
}
@media (max-width: 767px) {
  .ds-top-nav-scroll-resume:not([data-storybook-breakpoint='min-768']) :deep(.ds-tab:hover:not(.ds-tab--toggled)) { background: transparent; }
}
.ds-top-nav-scroll-resume[data-storybook-breakpoint='base'] { width: 100%; padding-top: 0; }
.ds-top-nav-scroll-resume[data-storybook-breakpoint='base'] .ds-top-nav-scroll-resume__panel { flex-direction: column; gap: var(--space-8); border-radius: 0 0 var(--radius-xxlg) var(--radius-xxlg); }
.ds-top-nav-scroll-resume[data-storybook-breakpoint='base'] .ds-top-nav-scroll-resume__navigation { width: 100%; gap: 0; }
.ds-top-nav-scroll-resume[data-storybook-breakpoint='base'] .ds-top-nav-scroll-resume__tabs { display: contents; width: auto; }
.ds-top-nav-scroll-resume[data-storybook-breakpoint='base'] .ds-top-nav-scroll-resume__tabs :deep(.ds-tab) { flex: none; }
.ds-top-nav-scroll-resume[data-storybook-breakpoint='min-534'],
.ds-top-nav-scroll-resume[data-storybook-breakpoint='min-768'] { width: var(--resume-nav-width); padding-top: 0; }
.ds-top-nav-scroll-resume[data-storybook-breakpoint='min-534'] .ds-top-nav-scroll-resume__panel,
.ds-top-nav-scroll-resume[data-storybook-breakpoint='min-768'] .ds-top-nav-scroll-resume__panel { flex-direction: row; gap: var(--space-6); }
.ds-top-nav-scroll-resume[data-storybook-breakpoint='min-534'] .ds-top-nav-scroll-resume__navigation,
.ds-top-nav-scroll-resume[data-storybook-breakpoint='min-768'] .ds-top-nav-scroll-resume__navigation { width: 362px; gap: var(--space-6); flex: none; }
.ds-top-nav-scroll-resume[data-storybook-breakpoint='min-534'] .ds-top-nav-scroll-resume__tabs,
.ds-top-nav-scroll-resume[data-storybook-breakpoint='min-768'] .ds-top-nav-scroll-resume__tabs { display: flex; width: 288px; gap: var(--space-6); }
.ds-top-nav-scroll-resume[data-storybook-breakpoint='min-534'] .ds-top-nav-scroll-resume__tabs :deep(.ds-tab),
.ds-top-nav-scroll-resume[data-storybook-breakpoint='min-768'] .ds-top-nav-scroll-resume__tabs :deep(.ds-tab) { flex: 1 1 0; min-width: 0; }
.ds-top-nav-scroll-resume[data-storybook-breakpoint='min-534'] .ds-top-nav-scroll-resume__panel { border-radius: 0 0 var(--radius-xxlg) var(--radius-xxlg); }
.ds-top-nav-scroll-resume[data-storybook-breakpoint='min-768'] { padding-top: var(--space-2); }
.ds-top-nav-scroll-resume[data-storybook-breakpoint='min-768'] .ds-top-nav-scroll-resume__panel { border-radius: var(--radius-xxxlg); }
.ds-top-nav-scroll-resume[data-storybook-breakpoint='base'] :deep(.ds-tab:hover:not(.ds-tab--toggled)),
.ds-top-nav-scroll-resume[data-storybook-breakpoint='min-534'] :deep(.ds-tab:hover:not(.ds-tab--toggled)) { background: transparent; }
.ds-top-nav-scroll-resume[data-place='Vitrina'] { --resume-nav-width: 394px; }
.ds-top-nav-scroll-resume[data-place='Resume'] { --resume-nav-width: 534px; }
</style>
