<script setup lang="ts">
import DsAvatarSm from './DsAvatarSm.vue'
import DsTab from './DsTab.vue'

const props = withDefaults(
  defineProps<{
    /** Accessible name of the sticky portfolio navigation. */
    ariaLabel?: string
    place?: 'Vitrina' | 'Resume'
  }>(),
  {
    ariaLabel: 'Навигация портфолио',
    place: 'Vitrina',
  },
)

const emit = defineEmits<{
  'update:place': [place: 'Vitrina' | 'Resume']
  /** Requests scrolling to the full page header. */
  'avatar-click': [event: MouseEvent]
  /** Requests switching from the showcase to the resume view. */
  resume: [event: MouseEvent]
}>()

function selectPlace(place: 'Vitrina' | 'Resume', event: MouseEvent) {
  if (place === props.place) return
  emit('update:place', place)
  if (place === 'Resume') emit('resume', event)
}
</script>

<template>
  <nav class="ds-top-nav-scroll-vitrina" :aria-label="ariaLabel">
    <div class="ds-top-nav-scroll-vitrina__panel">
      <div class="ds-top-nav-scroll-vitrina__content">
        <DsAvatarSm @click="emit('avatar-click', $event)" />
        <div class="ds-top-nav-scroll-vitrina__tabs">
          <DsTab tab-label="Проекты" :toggled="place === 'Vitrina'" @click="selectPlace('Vitrina', $event)" />
          <DsTab tab-label="Резюме" :toggled="place === 'Resume'" @click="selectPlace('Resume', $event)" />
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
/* TopNavScroll/Vitrina — Figma 1025:5059. */
.ds-top-nav-scroll-vitrina {
  position: sticky;
  top: 0;
  z-index: 10;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  width: 100%;
  height: 82px;
}

.ds-top-nav-scroll-vitrina__panel {
  box-sizing: border-box;
  display: flex;
  width: 100%;
  height: 82px;
  padding: var(--space-4);
  background: var(--surface-default);
  border-radius: 0 0 var(--radius-xxlg) var(--radius-xxlg);
  box-shadow: var(--effect-shadow-1st);
}

.ds-top-nav-scroll-vitrina__content {
  display: flex;
  width: 100%;
  min-width: 0;
  align-items: center;
  justify-content: space-between;
}

.ds-top-nav-scroll-vitrina__tabs {
  display: contents;
}

@media (min-width: 394px) {
  .ds-top-nav-scroll-vitrina {
    width: 394px;
    margin-inline: auto;
  }

  .ds-top-nav-scroll-vitrina__content {
    gap: var(--space-6);
  }

  .ds-top-nav-scroll-vitrina__tabs {
    display: flex;
    width: 288px;
    gap: var(--space-6);
  }

  .ds-top-nav-scroll-vitrina__tabs :deep(.ds-tab) {
    flex: 1 1 0;
    min-width: 0;
  }
}

@media (min-width: 768px) {
  .ds-top-nav-scroll-vitrina {
    height: 90px;
    padding-top: var(--space-2);
  }

  .ds-top-nav-scroll-vitrina__panel {
    border-radius: var(--radius-xxxlg);
  }
}

/* Storybook's constrained canvas cannot change its iframe viewport. */
.ds-top-nav-scroll-vitrina[data-storybook-breakpoint='base'] {
  width: 100%;
  height: 82px;
  padding-top: 0;
}

.ds-top-nav-scroll-vitrina[data-storybook-breakpoint='base'] .ds-top-nav-scroll-vitrina__panel {
  border-radius: 0 0 var(--radius-xxlg) var(--radius-xxlg);
}

.ds-top-nav-scroll-vitrina[data-storybook-breakpoint='base'] .ds-top-nav-scroll-vitrina__content {
  gap: 0;
  justify-content: space-between;
}

.ds-top-nav-scroll-vitrina[data-storybook-breakpoint='base'] .ds-top-nav-scroll-vitrina__tabs {
  display: contents;
  width: auto;
}

.ds-top-nav-scroll-vitrina[data-storybook-breakpoint='base'] .ds-top-nav-scroll-vitrina__tabs :deep(.ds-tab) {
  flex: none;
}

.ds-top-nav-scroll-vitrina[data-storybook-breakpoint='min-394'] .ds-top-nav-scroll-vitrina__panel {
  border-radius: 0 0 var(--radius-xxlg) var(--radius-xxlg);
}

.ds-top-nav-scroll-vitrina[data-storybook-breakpoint='min-394'],
.ds-top-nav-scroll-vitrina[data-storybook-breakpoint='min-768'] {
  width: 394px;
  height: 82px;
  padding-top: 0;
}

.ds-top-nav-scroll-vitrina[data-storybook-breakpoint='min-394'] .ds-top-nav-scroll-vitrina__content,
.ds-top-nav-scroll-vitrina[data-storybook-breakpoint='min-768'] .ds-top-nav-scroll-vitrina__content {
  gap: var(--space-6);
}

.ds-top-nav-scroll-vitrina[data-storybook-breakpoint='min-394'] .ds-top-nav-scroll-vitrina__tabs,
.ds-top-nav-scroll-vitrina[data-storybook-breakpoint='min-768'] .ds-top-nav-scroll-vitrina__tabs {
  display: flex;
  width: 288px;
  gap: var(--space-6);
}

.ds-top-nav-scroll-vitrina[data-storybook-breakpoint='min-394'] .ds-top-nav-scroll-vitrina__tabs :deep(.ds-tab),
.ds-top-nav-scroll-vitrina[data-storybook-breakpoint='min-768'] .ds-top-nav-scroll-vitrina__tabs :deep(.ds-tab) {
  flex: 1 1 0;
  min-width: 0;
}

.ds-top-nav-scroll-vitrina[data-storybook-breakpoint='min-768'] {
  height: 90px;
  padding-top: var(--space-2);
}

.ds-top-nav-scroll-vitrina[data-storybook-breakpoint='min-768'] .ds-top-nav-scroll-vitrina__panel {
  border-radius: var(--radius-xxxlg);
}
@media (max-width: 767px) {
  .ds-top-nav-scroll-vitrina:not([data-storybook-breakpoint='min-768']) :deep(.ds-tab:hover:not(.ds-tab--toggled)) {
    background: transparent;
  }
}

.ds-top-nav-scroll-vitrina[data-storybook-breakpoint='base'] :deep(.ds-tab:hover:not(.ds-tab--toggled)),
.ds-top-nav-scroll-vitrina[data-storybook-breakpoint='min-394'] :deep(.ds-tab:hover:not(.ds-tab--toggled)) {
  background: transparent;
}
</style>
