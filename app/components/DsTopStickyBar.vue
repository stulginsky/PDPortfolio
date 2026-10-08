<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref, watch, useId, nextTick } from 'vue'
import DsFullscreenMenuMob from './DsFullscreenMenuMob.vue'
import DsDropdownSelect from './DsDropdownSelect.vue'
import DsCrossButton from './DsCrossButton.vue'
import DsTooltip from './DsTooltip.vue'

const props = withDefaults(defineProps<{ text?: string; zoom?: number; fitToScreen?: boolean; viewerReady?: boolean }>(), { text: 'Value', zoom: 100, fitToScreen: false, viewerReady: false })
const emit = defineEmits<{ 'update:zoom': [value: number]; fit: []; close: [event: MouseEvent] }>()
const root = ref<HTMLElement | null>(null)
const web = ref(false)
let query: MediaQueryList | undefined
let observer: MutationObserver | undefined
const label = computed(() => props.fitToScreen ? 'Fit to screen' : `Zoom ${Math.round(props.zoom)}%`)
const items = [50, 100, 150].map(value => ({ label: `Zoom ${value}%`, value: String(value), showIcon: false }))
items.push({ label: 'Fit to screen', value: 'fit', showIcon: false })
const hint = ref(false)
const instant = ref(false)
const tooltipId = `zoom-hint-${useId()}`
let timer: ReturnType<typeof setTimeout> | undefined
let mounted = false
function hideHint(immediate = true) {
  clearTimeout(timer)
  instant.value = immediate
  hint.value = false
}
function showMobileHint() {
  hideHint()
  if (!mounted || web.value || !props.viewerReady) return
  instant.value = false
  hint.value = true
  const enter = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 300
  timer = setTimeout(() => hideHint(false), enter + 5000)
}
function showWebHint(event?: Event) {
  if (event?.type === 'focusin' && event.target !== root.value?.querySelector('.ds-top-sticky-bar__menu button')) return
  if (web.value) { instant.value = false; hint.value = true }
}
function leaveWebHint() { if (web.value) hideHint(false) }
function leaveHint(_element: Element, done: () => void) {
  if (instant.value || window.matchMedia('(prefers-reduced-motion: reduce)').matches) done()
  else setTimeout(done, 300)
}
watch(() => props.viewerReady, ready => ready ? showMobileHint() : hideHint())
watch(web, () => { hideHint(); showMobileHint() })
watch(hint, async visible => {
  await nextTick()
  const trigger = root.value?.querySelector('.ds-top-sticky-bar__menu button')
  if (visible) trigger?.setAttribute('aria-describedby', tooltipId)
  else trigger?.removeAttribute('aria-describedby')
})
function close(event: MouseEvent) { hideHint(); emit('close', event) }
function select(item: { value: string }) {
  if (item.value === 'fit') emit('fit')
  else emit('update:zoom', Number(item.value))
}
function update() {
  const forced = root.value?.dataset.storybookBreakpoint
  web.value = forced ? forced === 'min-768' : Boolean(query?.matches)
}
onMounted(() => {
  query = window.matchMedia('(min-width: 768px)')
  query.addEventListener('change', update)
  observer = new MutationObserver(update)
  if (root.value) observer.observe(root.value, { attributes: true, attributeFilter: ['data-storybook-breakpoint'] })
  update()
  mounted = true
  showMobileHint()
})
onBeforeUnmount(() => { hideHint(); query?.removeEventListener('change', update); observer?.disconnect() })
</script>

<template>
  <header ref="root" class="ds-top-sticky-bar" :class="{ 'ds-top-sticky-bar--web': web }">
    <h2 class="ds-top-sticky-bar__title">{{ text }}</h2>
    <div class="ds-top-sticky-bar__menu" @mouseenter="showWebHint" @mouseleave="leaveWebHint" @focusin="showWebHint" @focusout="leaveWebHint" @click.capture="hideHint()">
      <DsDropdownSelect v-if="web" :items="items" :placeholder="label" @change="select" />
      <DsFullscreenMenuMob v-else :items="items" :placeholder="label" aria-label="Выбрать масштаб" @select="select" @open="hideHint()" />
      <Transition name="zoom-hint" @leave="leaveHint">
        <DsTooltip v-if="hint" :id="tooltipId" class="ds-top-sticky-bar__hint" :class="{ 'ds-top-sticky-bar__hint--instant': instant }" pointer="Top"
          :label="web ? 'Масштаб: Ctrl/⌘ + колесо' : 'Разведите или сведите два пальца, чтобы изменить масштаб'" />
      </Transition>
    </div>
    <DsCrossButton class="ds-top-sticky-bar__close" aria-label="Закрыть просмотрщик" @click="close" />
  </header>
</template>

<style scoped>
.ds-top-sticky-bar {
  box-sizing: border-box;
  position: sticky;
  top: 0;
  z-index: 10;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 50px;
  align-items: center;
  column-gap: var(--space-2);
  row-gap: var(--space-3);
  width: 100%;
  padding: var(--space-4);
  background: linear-gradient(90deg, var(--surface-fullscreen-header-start), var(--surface-fullscreen-header-end));
  backdrop-filter: blur(15px);
}
.ds-top-sticky-bar__title {
  min-width: 0;
  margin: 0;
  color: var(--text-muted);
  font-family: var(--text-font-sans);
  font-size: var(--text-size-lg);
  font-weight: var(--text-weight-semibold);
  font-variation-settings: var(--font-variation-heading-base);
  line-height: 1.45;
  letter-spacing: .01em;
  overflow-wrap: anywhere;
}
.ds-top-sticky-bar__close { grid-column: 2; grid-row: 1; }
.ds-top-sticky-bar__menu { position: relative; grid-column: 1 / -1; grid-row: 2; width: 100%; }
.ds-top-sticky-bar__menu :deep(.ds-fs-menu) { width: 100%; }
.ds-top-sticky-bar__menu :deep(.ds-fs-menu__trigger) { width: 100%; max-width: none; }
.ds-top-sticky-bar--web {
  display: flex;
  justify-content: flex-end;
  height: 100px;
  padding: 0 var(--space-6);
  gap: var(--space-3);
}
.ds-top-sticky-bar--web .ds-top-sticky-bar__title {
  flex: 0 1 auto;
  padding: 0 var(--space-4);
  font-size: var(--text-size-xl);
  font-variation-settings: var(--font-variation-heading-md);
  line-height: 1.3;
  letter-spacing: .03em;
}
.ds-top-sticky-bar--web .ds-top-sticky-bar__menu { flex: none; width: auto; }
.ds-top-sticky-bar__close { flex: none; }
.ds-top-sticky-bar__hint { position: absolute; top: calc(100% + 4px); left: 50%; transform: translateX(-50%); width: max-content; max-width: min(288px, calc(100vw - 32px)); z-index: 20; }
.ds-top-sticky-bar__hint :deep(.ds-tooltip__body) { box-sizing: border-box; max-width: 100%; white-space: normal; text-align: center; }
.zoom-hint-enter-active { transition: opacity 300ms ease-out, transform 300ms ease-out; }
.zoom-hint-leave-active { transition: opacity 300ms ease-in; }
.zoom-hint-enter-from { opacity: 0; transform: translate(-50%, 4px); }
.zoom-hint-leave-to { opacity: 0; }
.ds-top-sticky-bar__hint--instant.zoom-hint-leave-active { transition: none; }
@media (prefers-reduced-motion: reduce) { .zoom-hint-enter-active, .zoom-hint-leave-active { transition: none; } .zoom-hint-enter-from { transform: translateX(-50%); } }
</style>
