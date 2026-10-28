<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref, watch, useId, nextTick } from 'vue'
import DsFullscreenMenuMob from './DsFullscreenMenuMob.vue'
import DsDropdownSelect from './DsDropdownSelect.vue'
import DsBtnCross from './DsBtnCross.vue'
import DsTooltip from './DsTooltip.vue'

const props = withDefaults(defineProps<{ text?: string; zoom?: number; fitMode?: 'width' | 'height' | 'screen' | null; viewerReady?: boolean; controlsOnly?: boolean }>(), { text: 'Value', zoom: 100, fitMode: null, viewerReady: false, controlsOnly: false })
const emit = defineEmits<{ 'update:zoom': [value: number]; fit: [mode: 'width' | 'height' | 'screen']; close: [event: MouseEvent] }>()
const root = ref<HTMLElement | null>(null)
const web = ref(false)
let query: MediaQueryList | undefined
let observer: MutationObserver | undefined
const selected = computed(() => props.fitMode ? `fit-${props.fitMode}` : [50, 100, 150].includes(props.zoom) ? String(props.zoom) : undefined)
const label = computed(() => props.fitMode ? `Fit to ${props.fitMode}` : `Zoom ${Math.round(props.zoom)}%`)
const items = computed(() => [
  ...[50, 100, 150].map(value => ({ label: `Zoom ${value}%`, value: String(value) })),
  ...(['width', 'height', 'screen'] as const).map(mode => ({ label: `Fit to ${mode}`, value: `fit-${mode}` })),
].map(item => ({ ...item, icon: 'Check' as const, showIcon: item.value === selected.value })))
const selection = computed({
  get: () => selected.value,
  set: (value: string | null | undefined) => { if (value) select({ value }) },
})
const hint = ref(false)
const tooltipId = `zoom-hint-${useId()}`
let timer: ReturnType<typeof setTimeout> | undefined
let mounted = false
function hideHint() {
  clearTimeout(timer)
  hint.value = false
}
function showMobileHint() {
  hideHint()
  if (!mounted || web.value || !props.viewerReady) return
  hint.value = true
  const enter = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 300
  timer = setTimeout(() => hideHint(), enter + 5000)
}
function showWebHint(event?: Event) {
  if (root.value?.querySelector('.ds-top-sticky-bar__menu [aria-expanded="true"]')) return
  if (event?.type === 'focusin' && event.target !== root.value?.querySelector('.ds-top-sticky-bar__menu button')) return
  if (web.value) hint.value = true
}
function leaveWebHint() { if (web.value) hideHint() }
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
  if (item.value === selected.value) return
  if (item.value === 'fit-width') emit('fit', 'width')
  else if (item.value === 'fit-height') emit('fit', 'height')
  else if (item.value === 'fit-screen') emit('fit', 'screen')
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
  <header ref="root" class="ds-top-sticky-bar" :class="{ 'ds-top-sticky-bar--web': web, 'ds-top-sticky-bar--controls-only': controlsOnly }" :aria-label="controlsOnly ? text : undefined">
    <h2 v-if="!controlsOnly" class="ds-top-sticky-bar__title">{{ text }}</h2>
    <div class="ds-top-sticky-bar__menu" @mouseenter="showWebHint" @mouseleave="leaveWebHint" @focusin="showWebHint" @focusout="leaveWebHint" @click.capture="hideHint()">
      <DsDropdownSelect v-if="web" :items="items" :placeholder="label" :raised="controlsOnly" v-model="selection" />
      <DsFullscreenMenuMob v-else :items="items" :placeholder="label" :raised="controlsOnly" v-model="selection" aria-label="Выбрать масштаб" @open="hideHint()" />
        <DsTooltip :visible="hint" :id="tooltipId" class="ds-top-sticky-bar__hint" pointer="Top"
          :label="web ? 'Масштаб: Ctrl/⌘ + колесо' : 'Разведите или сведите два пальца, чтобы изменить масштаб'" />
    </div>
    <DsBtnCross class="ds-top-sticky-bar__close" :raised="controlsOnly" aria-label="Закрыть просмотрщик" @click="close" />
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
  /* Figma gradient paint opacity45%; do not fade the header's content. */
  background: linear-gradient(90deg,
    color-mix(in srgb, var(--surface-fullscreen-header-start) 45%, transparent),
    color-mix(in srgb, var(--surface-fullscreen-header-end) 45%, transparent));
  backdrop-filter: var(--image-preview-header-blur);
}
.ds-top-sticky-bar__title {
  min-width: 0;
  margin: 0;
  color: var(--text-muted);
  font-family: var(--text-font-sans);
  font-size: var(--text-size-18);
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
  font-size: var(--text-size-22);
  font-variation-settings: var(--font-variation-heading-md);
  line-height: 1.3;
  letter-spacing: .03em;
}
.ds-top-sticky-bar--web .ds-top-sticky-bar__menu { flex: none; width: auto; }
.ds-top-sticky-bar__close { flex: none; }
.ds-top-sticky-bar--controls-only {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  min-height: 78px;
  background: none;
}
.ds-top-sticky-bar--controls-only .ds-top-sticky-bar__menu { flex: none; width: auto; }
.ds-top-sticky-bar--controls-only .ds-top-sticky-bar__menu :deep(.ds-fs-menu),
.ds-top-sticky-bar--controls-only .ds-top-sticky-bar__menu :deep(.ds-fs-menu__trigger) { width: auto; }
.ds-top-sticky-bar--controls-only.ds-top-sticky-bar--web {
  justify-content: flex-end;
  width: max-content;
  max-width: 100%;
  margin-left: auto;
}
.ds-top-sticky-bar__hint { position: absolute; top: calc(100% + 4px); left: 50%; transform: translateX(-50%); width: max-content; max-width: min(288px, calc(100vw - 32px)); z-index: 20; }
.ds-top-sticky-bar__hint :deep(.ds-tooltip__body) { box-sizing: border-box; max-width: 100%; white-space: normal; text-align: center; }
</style>
