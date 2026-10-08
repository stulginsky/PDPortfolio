<script setup lang="ts">
import DsAvatarLg from './DsAvatarLg.vue'
import TypoText from './TypoText.vue'
import site from '../../content/site.json'
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  name?: string
  description?: string
  email?: string
  phone?: string
  telegramLabel?: string
  telegramUrl?: string
}>(), {
  name: site.name,
  description: site.role + ' ' + site.experience,
  email: site.email,
  phone: site.phone,
  telegramLabel: site.telegramLabel,
  telegramUrl: site.telegramUrl,
})
const emailHref = computed(() => `mailto:${props.email.trim()}`)
const phoneHref = computed(() => `tel:${props.phone.replace(/[^+\d]/g, '')}`)
</script>

<template>
  <header class="ds-header">
    <div class="ds-header__identity">
      <DsAvatarLg />
      <div class="ds-header__copy">
        <TypoText class="ds-header__name" tag="h1" :content="name" />
        <TypoText class="ds-header__description" tag="p" :content="description" />
        <div class="ds-header__contacts">
          <TypoText class="ds-header__email" tag="a" :href="emailHref" target="_blank" rel="noopener noreferrer" :content="email" />
          <span class="ds-header__separator ds-header__separator--email" aria-hidden="true">·</span>
          <TypoText tag="a" :href="phoneHref" :content="phone" />
          <span class="ds-header__separator" aria-hidden="true">·</span>
          <TypoText tag="a" :href="telegramUrl" target="_blank" rel="noopener noreferrer" :content="telegramLabel" />
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.ds-header {
  --header-top: var(--space-6);
  --header-bottom: var(--space-8);
  --header-avatar-gap: var(--space-3);
  --header-copy-gap: var(--space-2);
  --header-name-size: var(--text-size-2xl);
  --header-name-tracking: .015em;
  --header-name-axes: var(--font-variation-heading-xl);
  --header-description-size: var(--text-size-base);
  --header-description-leading: 1.5;
  --header-description-tracking: 0;
  box-sizing: border-box;
  width: 100%;
  max-width: 1376px;
  margin-inline: auto;
  padding-top: var(--header-top);
  background: var(--surface-default);
  font-family: var(--text-font-sans);
}
.ds-header__identity { display: flex; flex-direction: column; align-items: center; gap: var(--header-avatar-gap); padding-bottom: var(--header-bottom); }
.ds-header__copy { display: flex; flex-direction: column; align-items: center; gap: var(--header-copy-gap); width: 100%; }
.ds-header__name { margin: 0; width: 100%; text-align: center; color: var(--text-default); font-size: var(--header-name-size); line-height: 1.2; font-weight: var(--text-weight-semibold); font-variation-settings: var(--header-name-axes); letter-spacing: var(--header-name-tracking); }
.ds-header__description { margin: 0; width: 100%; text-align: center; color: var(--text-default); font-size: var(--header-description-size); line-height: var(--header-description-leading); font-weight: var(--text-weight-semibold); font-variation-settings: var(--font-variation-heading-base); letter-spacing: var(--header-description-tracking); }
.ds-header__contacts { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 5px; color: var(--text-secondary); font-size: var(--text-size-base); line-height: 1.6; font-weight: var(--text-weight-regular); }
.ds-header__contacts > span,
.ds-header__contacts > a { white-space: nowrap; }
.ds-header__contacts > a { color: inherit; text-decoration: none; }
.ds-header__email { flex-basis: 100%; text-align: center; }
.ds-header__separator { font-size: 14px; line-height: 1.35; }
.ds-header__separator--email { display: none; }
@media (min-width: 768px) {
  .ds-header { --header-avatar-gap: var(--space-2); --header-copy-gap: var(--space-3); --header-description-size: var(--text-size-lg); --header-description-leading: 1.45; --header-description-tracking: .01em; }
  .ds-header__email { flex-basis: auto; }
  .ds-header__separator--email { display: inline; }
}
@media (min-width: 1920px) {
  .ds-header { --header-top: var(--space-16); --header-bottom: var(--space-12); --header-avatar-gap: var(--space-4); --header-name-size: var(--text-size-3xl); --header-name-tracking: -.005em; --header-name-axes: var(--font-variation-heading-2xl); }
}
.ds-header[data-storybook-breakpoint='base'] { --header-top: var(--space-6); --header-bottom: var(--space-8); --header-avatar-gap: var(--space-3); --header-copy-gap: var(--space-2); --header-name-size: var(--text-size-2xl); --header-name-tracking: .015em; --header-name-axes: var(--font-variation-heading-xl); --header-description-size: var(--text-size-base); --header-description-leading: 1.5; --header-description-tracking: 0; }
.ds-header[data-storybook-breakpoint='base'] .ds-header__email { flex-basis: 100%; }
.ds-header[data-storybook-breakpoint='base'] .ds-header__separator--email { display: none; }
.ds-header[data-storybook-breakpoint='min-768'],
.ds-header[data-storybook-breakpoint='min-1920'] { --header-top: var(--space-6); --header-bottom: var(--space-8); --header-avatar-gap: var(--space-2); --header-copy-gap: var(--space-3); --header-name-size: var(--text-size-2xl); --header-name-tracking: .015em; --header-name-axes: var(--font-variation-heading-xl); --header-description-size: var(--text-size-lg); --header-description-leading: 1.45; --header-description-tracking: .01em; }
.ds-header[data-storybook-breakpoint='min-768'] .ds-header__email,
.ds-header[data-storybook-breakpoint='min-1920'] .ds-header__email { flex-basis: auto; }
.ds-header[data-storybook-breakpoint='min-768'] .ds-header__separator--email,
.ds-header[data-storybook-breakpoint='min-1920'] .ds-header__separator--email { display: inline; }
.ds-header[data-storybook-breakpoint='min-1920'] { --header-top: var(--space-16); --header-bottom: var(--space-12); --header-avatar-gap: var(--space-4); --header-name-size: var(--text-size-3xl); --header-name-tracking: -.005em; --header-name-axes: var(--font-variation-heading-2xl); }
</style>
