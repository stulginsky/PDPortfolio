<script setup lang="ts">
import { computed, inject, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { siteUrl } from '../utils/site-url'
import { vMediaReady } from './media-readiness'
import { useHeroMotion } from './hero-motion'
import DsRoleFocus from './DsRoleFocus.vue'
import { createLidPortHeroDraft, getLidPortHeroBreakpoint, lidPortHeroReferences, lidPortHeroSceneEditorKey, type LidPortHeroBreakpoint } from './lidport-ds-hero.scene-context'

const props = defineProps<{
  title: string
  role: string
  focus: string
  breakpoint?: LidPortHeroBreakpoint
  panelAppearance?: 'default' | 'on-light' | 'on-dark'
}>()

const root = ref<HTMLElement>()
const panel = ref<HTMLElement>()
const viewport = ref(320)
const containerWidth = ref(320)
const panelHeight = ref<number>()
const breakpoint = computed(() => props.breakpoint ?? getLidPortHeroBreakpoint(viewport.value))
const reference = computed(() => lidPortHeroReferences[breakpoint.value])
const editor = inject(lidPortHeroSceneEditorKey, undefined)
const defaults = createLidPortHeroDraft()
const layers = computed(() => (editor?.draft ?? defaults)[breakpoint.value])
const ratio = computed(() => containerWidth.value / reference.value.width)
const heroHeight = computed(() => reference.value.panel.y * ratio.value + (panelHeight.value ?? reference.value.panel.height))
const logoAsset = computed(() => siteUrl(`/cases/lidport-design-system/hero-layers/${breakpoint.value}/lada-image-logo.svg`))
const headingAsset = computed(() => siteUrl(`/cases/lidport-design-system/hero-layers/${breakpoint.value}/diller-portal-design-system.svg`))
const offsets = ref([0, 0, 0])
let observer: ResizeObserver | undefined

const { resetMotion, replayIntro, maybeIntro, pointerDown, release } = useHeroMotion({
  root,
  layers: () => layers.value,
  breakpoint: () => breakpoint.value,
  mode: () => editor?.mode.value ?? 'Interaction',
  width: () => containerWidth.value,
  viewport: () => viewport.value,
  render: values => { offsets.value = [...values] },
  enabled: layer => layer.animationEnabled,
  scope: 'viewport',
})

function sync() {
  viewport.value = window.innerWidth
  containerWidth.value = root.value?.clientWidth || viewport.value
  if (panel.value) panelHeight.value = panel.value.getBoundingClientRect().height
}
function onPointerLeave(event: PointerEvent) { if (event.pointerType !== 'mouse') release(event) }
watch(breakpoint, async () => { panelHeight.value = undefined; await nextTick(); sync() })
onMounted(() => { sync(); observer = new ResizeObserver(sync); if (root.value) observer.observe(root.value); if (panel.value) observer.observe(panel.value); window.addEventListener('resize', sync) })
onUnmounted(() => { observer?.disconnect(); window.removeEventListener('resize', sync) })
defineExpose({ resetMotion, replayIntro })
</script>

<template>
  <section
    ref="root"
    v-media-ready
    class="lidport-ds-hero media-skeleton media-skeleton--hero"
    :data-breakpoint="breakpoint"
    :data-panel-appearance="panelAppearance ?? 'default'"
    :aria-label="title"
    :style="{ height: `${heroHeight}px`, '--hero-banner-height': `${reference.panel.y * ratio}px` }"
    @pointerdown="pointerDown"
    @pointerleave="onPointerLeave"
  >
    <h1 class="lidport-ds-hero__semantic">{{ title }}</h1>
    <div class="lidport-ds-hero__stage" :style="{ width: `${reference.width}px`, transform: `scale(${ratio})` }">
      <div class="lidport-ds-hero__clip" :data-source-id="reference.clip.id" :style="{ width: `${reference.width}px`, height: `${reference.clip.height}px` }">
        <div class="lidport-ds-hero__graphic" data-layer="LadaImage-logo" :data-source-id="layers[0]?.id" :style="{ left: `${layers[0]?.x}px`, top: `${layers[0]?.y}px`, width: `${layers[0]?.width}px`, height: `${layers[0]?.height}px`, transform: `translate3d(${offsets[0] / ratio}px,0,0)` }">
          <img :src="logoAsset" :width="layers[0]?.width" :height="layers[0]?.height" alt="" aria-hidden="true" draggable="false" @load="maybeIntro" />
        </div>
        <div class="lidport-ds-hero__graphic" data-layer="Diller Portal Design System" :data-source-id="layers[1]?.id" :style="{ left: `${layers[1]?.x}px`, top: `${layers[1]?.y}px`, width: `${layers[1]?.width}px`, height: `${layers[1]?.height}px`, transform: `translate3d(${offsets[1] / ratio}px,0,0)` }">
          <img :src="headingAsset" :width="layers[1]?.width" :height="layers[1]?.height" alt="" aria-hidden="true" draggable="false" fetchpriority="high" @load="maybeIntro" />
        </div>
      </div>
    </div>
    <div ref="panel" class="lidport-ds-hero__panel" :style="{ top: `${reference.panel.y * ratio}px`, paddingBlock: `${reference.panel.padding}px` }">
      <div class="lidport-ds-hero__copy" data-layer="Role-Focus" :data-source-id="layers[2]?.id" :style="{ transform: `translate3d(${(layers[2]?.x ?? reference.role.x) - reference.role.x}px,${(layers[2]?.y ?? reference.role.y) - reference.role.y}px,0)` }">
        <DsRoleFocus :role="role" :focus="focus" :breakpoint="breakpoint === 'base' ? 'base' : 'min-768'" :style="{ color: panelAppearance === 'on-dark' ? 'var(--text-inverse)' : 'var(--text-secondary)' }" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.lidport-ds-hero{position:relative;width:100%;overflow:clip;container-type:inline-size;touch-action:pan-y;--hero-skeleton:#d0d0c8;background:var(--surface-default)}
.lidport-ds-hero[data-media-state=loading]{background:var(--hero-skeleton)}
.lidport-ds-hero[data-panel-appearance=on-light]:not([data-media-state=loading]),.lidport-ds-hero[data-panel-appearance=on-dark]:not([data-media-state=loading]){background:transparent}
.lidport-ds-hero__stage{position:relative;transform-origin:top left}
.lidport-ds-hero__clip{position:absolute;inset:0 auto auto 0;overflow:hidden;background:var(--surface-default)}
.lidport-ds-hero__graphic,.lidport-ds-hero__panel{position:absolute}
.lidport-ds-hero__graphic img{display:block;width:100%;height:100%;max-width:none;pointer-events:none;user-select:none}
.lidport-ds-hero__panel{left:0;width:100%;box-sizing:border-box;background:var(--surface-default);color:var(--text-secondary)}
.lidport-ds-hero__copy{width:min(924px,calc(100% - 32px));margin-inline:auto}
.lidport-ds-hero[data-panel-appearance=on-light] .lidport-ds-hero__panel,.lidport-ds-hero[data-panel-appearance=on-dark] .lidport-ds-hero__panel{background:transparent}
.lidport-ds-hero[data-panel-appearance=on-dark] .lidport-ds-hero__panel{color:var(--text-inverse)}
.lidport-ds-hero__semantic{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;margin:0}
@media(prefers-reduced-motion:reduce){.lidport-ds-hero__graphic{transform:none!important}}
</style>
