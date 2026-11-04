<script setup lang="ts">
import { siteUrl } from '../utils/site-url'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import DsHeader from './DsHeader.vue'
import DsTopNav from './DsTopNav.vue'
import DsTopNavScrollVitrina from './DsTopNavScrollVitrina.vue'
import DsFilters from './DsFilters.vue'
import DsPageUp from './DsPageUp.vue'
import DsFooter from './DsFooter.vue'
import ChirpAiHealthAssistant from './ChirpAiHealthAssistant.vue'
import ChirpExplainableAiUx from './ChirpExplainableAiUx.vue'
import ChirpAiMedicalBrand from './ChirpAiMedicalBrand.vue'
import ChirpAiDesignSystem from './ChirpAiDesignSystem.vue'
import DCVendorAppPr from './DCVendorAppPr.vue'
import DCVendorAppUx from './DCVendorAppUx.vue'
import DCPickerAppUx from './DCPickerAppUx.vue'
import LIDesignSystem from './LIDesignSystem.vue'
import Component4Real3Dweapon from './4Real3Dweapon.vue'
import Skins4Real from './Skins4Real.vue'
import BlackGold from './BlackGold.vue'
import Absolut from './Absolut.vue'
import AquaMaris from './AquaMaris.vue'
import SapsanCr from './SapsanCr.vue'
import DragonHeartJw from './DragonHeartJw.vue'
import FoxJw from './FoxJw.vue'

const emit = defineEmits<{ resume: [] }>()
type Category = 'all' | 'product' | 'ux' | 'design-system' | 'branding' | 'creative' | 'jewelry' | 'landing' | 'gamedev' | 'video' | 'packaging'
const category = ref<Category>('all')
const categoryStorageKey = 'pdportfolio:showcase:category'
const categoryValues: readonly Category[] = ['all', 'product', 'ux', 'design-system', 'branding', 'creative', 'jewelry', 'landing', 'gamedev', 'video', 'packaging']
watch(category, value => {
  try { window.localStorage.setItem(categoryStorageKey, value) } catch { /* Storage may be unavailable. */ }
}, { flush: 'sync' })
const fullHeader = ref<HTMLElement>()
const compact = ref(false)
const place = computed<'Vitrina' | 'Resume'>({
  get: () => 'Vitrina',
  set: value => { if (value === 'Resume') emit('resume') },
})
// Category membership belongs to the page; each accepted card owns its data and art.
const cases = [
  { id: 'ChirpAiHealthAssistant', category: 'product', component: ChirpAiHealthAssistant },
  { id: 'ChirpExplainableAiUx', category: 'ux', component: ChirpExplainableAiUx },
  { id: 'ChirpAiMedicalBrand', category: 'branding', component: ChirpAiMedicalBrand },
  { id: 'ChirpAiDesignSystem', category: 'design-system', component: ChirpAiDesignSystem },
  { id: 'DCVendorAppPr', category: 'product', component: DCVendorAppPr, href: '/cases/dc-vendor-app-pr' },
  { id: 'DCVendorAppUx', category: 'ux', component: DCVendorAppUx, href: '/cases/dc-vendor-app-ux' },
  { id: '4Real3Dweapon', category: 'landing', component: Component4Real3Dweapon, activateHref: '/cases/4real-3dweapon' },
  { id: 'Absolut', category: 'creative', component: Absolut, activateHref: '/cases/absolut' },
  { id: 'AquaMaris', category: 'creative', component: AquaMaris, activateHref: '/cases/aqua-maris' },
  { id: 'SapsanCr', category: 'creative', component: SapsanCr, activateHref: '/cases/sapsan-cr' },
  { id: 'DragonHeartJw', category: 'jewelry', component: DragonHeartJw, activateHref: '/cases/dragon-heart-jw' },
  { id: 'FoxJw', category: 'jewelry', component: FoxJw, activateHref: '/cases/fox-jw' },
  { id: 'DCPickerAppUx', category: 'ux', component: DCPickerAppUx },
  { id: 'LIDesignSystem', category: 'design-system', component: LIDesignSystem },
  { id: 'Skins4Real', category: 'landing', component: Skins4Real },
  { id: 'BlackGold', category: 'landing', component: BlackGold },
] as const
const visibleCases = computed(() => cases.filter(item => category.value === 'all' || item.category === category.value))
function activateCase(item: typeof cases[number], event: MouseEvent | KeyboardEvent) {
  if (!('activateHref' in item) || (event.type === 'click' && event.defaultPrevented)) return
  if (event.ctrlKey || event.metaKey || event.shiftKey) window.open(siteUrl(item.activateHref), '_blank', 'noopener')
  else window.location.assign(siteUrl(item.activateHref))
}

function scrollToHeader() {
  const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
  fullHeader.value?.focus({ preventScroll: true })
  fullHeader.value?.scrollIntoView({ behavior, block: 'start' })
}

let observer: IntersectionObserver | undefined
onMounted(() => {
  try {
    const saved = window.localStorage.getItem(categoryStorageKey)
    if (saved && !['gamedev', 'video', 'packaging'].includes(saved) && categoryValues.includes(saved as Category)) category.value = saved as Category
  } catch { /* Keep the default when browser storage is unavailable. */ }
  if (!fullHeader.value) return
  compact.value = fullHeader.value.getBoundingClientRect().bottom <= 0
  observer = new IntersectionObserver(([entry]) => {
    if (entry) compact.value = entry.boundingClientRect.bottom <= 0
  }, { threshold: 0 })
  observer.observe(fullHeader.value)
})
onUnmounted(() => observer?.disconnect())
</script>

<template>
  <div class="main-page" :data-compact="compact">
    <main class="main-page__flow">
      <div ref="fullHeader" class="main-page__header" tabindex="-1">
        <DsHeader />
        <DsTopNav v-model:place="place" />
      </div>
      <DsFilters v-model="category" class="main-page__filters" />
      <div class="main-page__cases" :data-category="category">
        <div v-for="item in visibleCases" :key="item.id" class="main-page__case" :data-case-href="'activateHref' in item ? item.activateHref : undefined">
          <component :is="item.component" v-bind="'href' in item ? { href: item.href } : {}" @activate="event => activateCase(item, event)" />
        </div>
      </div>
    </main>

    <!-- Figma 1585:7996 retains Footer spacing; PageUp itself is fixed. -->
    <div class="main-page__page-up-slot" aria-hidden="true" />
    <DsFooter />

    <template v-if="compact">
      <div class="main-page__compact">
        <DsTopNavScrollVitrina v-model:place="place" @avatar-click="scrollToHeader" />
      </div>
      <DsPageUp @click="scrollToHeader" />
    </template>
  </div>
</template>

<style scoped>
.main-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-8);
  width: 100%;
  padding-bottom: var(--space-16);
  background: var(--surface-default);
}
.main-page__flow {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-8);
  width: 100%;
  min-width: 0;
  padding-inline: var(--space-4);
}
.main-page__header { width: 100%; }
.main-page__header:focus { outline: none; }
.main-page[data-compact='true'] .main-page__filters { visibility: hidden; }
.main-page__cases {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  gap: var(--space-6);
  width: 100%;
  max-width: calc(4 * 430px + 3 * var(--space-6));
}
.main-page__case {
  flex: 0 1 430px;
  width: 100%;
  min-width: 0;
  max-width: 430px;
}
.main-page__page-up-slot { width: 100%; height: 98px; }
.main-page__compact { position: fixed; inset: 0 0 auto; z-index: 30; }
@media (min-width: 768px) {
  .main-page { gap: var(--space-16); }
}
@media (min-width: 1920px) {
  .main-page__flow { padding-inline: 0; }
}
</style>
