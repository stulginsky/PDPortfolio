<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId, watch } from 'vue'
import DsTopStickyBar from './DsTopStickyBar.vue'
import DsScroll from './DsScroll.vue'

const props = withDefaults(defineProps<{ open?: boolean; title?: string }>(), { open: false, title: 'Value' })
const emit = defineEmits<{ 'update:open': [value: boolean]; close: []; zoom: [value: number]; loaded: [] }>()
const dialog = ref<HTMLElement | null>(null)
const viewport = ref<HTMLElement | null>(null)
const media = ref<HTMLElement | null>(null)
const scrollId = `case-viewer-${useId()}`
const ready = ref(false), web = ref(false), fit = ref(false), scale = ref(1)
const size = ref({ width: 1, height: 1 }), headerHeight = ref(144)
const gutter = computed(() => web.value ? 64 : 16)
const bottom = computed(() => web.value ? 24 : 32)
const top = computed(() => headerHeight.value + 24)
const zoom = computed(() => scale.value * 100)
let mounted = false, savedOverflow = '', savedFocus: HTMLElement | null = null
let query: MediaQueryList | undefined, observer: ResizeObserver | undefined
let inertElements: { el: HTMLElement; inert: boolean }[] = []
let session = 0, zoomSequence = 0, renderedScale = 1
const pointers = new Map<number, { x: number; y: number }>()
let drag: { x: number; y: number; left: number; top: number } | undefined
let pinch: { distance: number; scale: number; point: { x: number; y: number } } | undefined

function refreshScroll() { viewport.value?.dispatchEvent(new Event('scroll')) }
function dimensions() {
  const header = dialog.value?.querySelector('header')
  if (header) headerHeight.value = header.getBoundingClientRect().height
}
async function fitScreen() {
  if (!ready.value || !viewport.value) return
  dimensions()
  fit.value = true
  const el = viewport.value
  const currentSession = session
  scale.value = Math.max(.01, Math.min((el.clientWidth - gutter.value * 2) / size.value.width,
    (el.clientHeight - top.value - bottom.value) / size.value.height))
  await nextTick()
  if (!props.open || currentSession !== session) return
  renderedScale = scale.value
  el.scrollTo(0, 0)
  refreshScroll()
  emit('zoom', zoom.value)
}
function center() {
  const el = viewport.value!, rect = el.getBoundingClientRect()
  return { x: rect.left + el.clientWidth / 2, y: rect.top + top.value + (el.clientHeight - top.value - bottom.value) / 2 }
}
async function setScale(value: number, anchor = center(), fixedPoint?: { x: number; y: number }) {
  if (!ready.value || !viewport.value || !media.value) return
  const seq = ++zoomSequence
  const rect = media.value.getBoundingClientRect()
  const point = fixedPoint ?? { x: (anchor.x - rect.left) / renderedScale, y: (anchor.y - rect.top) / renderedScale }
  fit.value = false
  scale.value = Math.max(.01, Math.min(16, value))
  await nextTick()
  if (seq !== zoomSequence || !media.value || !viewport.value) return
  const updated = media.value.getBoundingClientRect()
  viewport.value.scrollLeft += updated.left + point.x * scale.value - anchor.x
  viewport.value.scrollTop += updated.top + point.y * scale.value - anchor.y
  renderedScale = scale.value
  refreshScroll()
  emit('zoom', zoom.value)
}
function preset(value: number) { void setScale(value / 100) }
function wheel(event: WheelEvent) {
  if (!event.ctrlKey && !event.metaKey) return
  event.preventDefault()
  void setScale(scale.value * Math.exp(-event.deltaY * .002), { x: event.clientX, y: event.clientY })
}
function measure() {
  const image = media.value?.querySelector('img')
  const svg = media.value?.querySelector('svg')
  let width = 0, height = 0
  if (image) { width = image.naturalWidth; height = image.naturalHeight }
  else if (svg) {
    width = svg.width.baseVal.value || svg.viewBox.baseVal.width
    height = svg.height.baseVal.value || svg.viewBox.baseVal.height
  }
  if (!width || !height || ready.value) return
  size.value = { width, height }
  ready.value = true
  const currentSession = session
  void nextTick(async () => {
    if (!props.open || currentSession !== session) return
    dimensions()
    if (web.value) await fitScreen()
    else { scale.value = 1; renderedScale = 1; await nextTick(); viewport.value?.scrollTo(0, 0); refreshScroll() }
    if (props.open && currentSession === session) emit('loaded')
  })
}
function point(event: PointerEvent) { return { x: event.clientX, y: event.clientY } }
function beginDrag(p: { x: number; y: number }) {
  drag = { ...p, left: viewport.value!.scrollLeft, top: viewport.value!.scrollTop }
}
function pointerDown(event: PointerEvent) {
  if (!ready.value || event.button !== 0) return
  pointers.set(event.pointerId, point(event))
  viewport.value?.setPointerCapture(event.pointerId)
  if (pointers.size === 1) beginDrag(point(event))
  if (pointers.size === 2) {
    const [a, b] = [...pointers.values()]
    const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }, rect = media.value!.getBoundingClientRect()
    pinch = { distance: Math.hypot(a.x - b.x, a.y - b.y), scale: scale.value,
      point: { x: (mid.x - rect.left) / renderedScale, y: (mid.y - rect.top) / renderedScale } }
    drag = undefined
  }
}
function pointerMove(event: PointerEvent) {
  if (!pointers.has(event.pointerId) || !viewport.value) return
  pointers.set(event.pointerId, point(event))
  if (pointers.size === 2 && pinch?.distance) {
    const [a, b] = [...pointers.values()]
    void setScale(pinch.scale * Math.hypot(a.x - b.x, a.y - b.y) / pinch.distance,
      { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }, pinch.point)
  } else if (drag) {
    viewport.value.scrollLeft = drag.left - (event.clientX - drag.x)
    viewport.value.scrollTop = drag.top - (event.clientY - drag.y)
  }
}
function pointerEnd(event: PointerEvent) {
  pointers.delete(event.pointerId)
  pinch = undefined; drag = undefined
  if (pointers.size === 1 && viewport.value) beginDrag([...pointers.values()][0])
}
function close() { ready.value = false; emit('update:open', false); emit('close') }
function keydown(event: KeyboardEvent) {
  if (!props.open) return
  if ((event.target as HTMLElement)?.closest('.ds-fs-menu__overlay')) return
  if (event.key === 'Escape') {
    if (dialog.value?.querySelector('[aria-expanded="true"]')) return
    event.preventDefault(); close(); return
  }
  if (event.key === 'Tab') {
    const nodes = [...dialog.value!.querySelectorAll<HTMLElement>('button, [tabindex="0"], a[href]')]
      .filter(el => el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden')
    const first = nodes[0], last = nodes.at(-1)
    if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog.value)) { event.preventDefault(); last?.focus() }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
  }
}
function teardown() {
  ++session; ++zoomSequence
  observer?.disconnect(); observer = undefined
  viewport.value?.removeEventListener('wheel', wheel)
  document.removeEventListener('keydown', keydown)
  for (const entry of inertElements) entry.el.inert = entry.inert
  if (inertElements.length) document.body.style.overflow = savedOverflow
  inertElements = []
  ready.value = false; pointers.clear(); drag = undefined; pinch = undefined
  scale.value = 1; renderedScale = 1; fit.value = false
  if (savedFocus?.isConnected) savedFocus.focus()
  savedFocus = null
}
async function openSession() {
  const current = ++session
  savedFocus = document.activeElement as HTMLElement | null
  savedOverflow = document.body.style.overflow
  ready.value = false; scale.value = 1; fit.value = web.value
  await nextTick()
  if (current !== session || !props.open || !dialog.value) return
  inertElements = [...document.body.children].filter(el => el instanceof HTMLElement && el !== dialog.value)
    .map(el => ({ el: el as HTMLElement, inert: (el as HTMLElement).inert }))
  for (const entry of inertElements) entry.el.inert = true
  document.body.style.overflow = 'hidden'
  document.addEventListener('keydown', keydown)
  viewport.value?.addEventListener('wheel', wheel, { passive: false })
  observer = new ResizeObserver(() => {
    dimensions()
    if (fit.value && ready.value) void fitScreen()
    else void nextTick(refreshScroll)
  })
  observer.observe(dialog.value)
  const header = dialog.value.querySelector('header')
  if (header) observer.observe(header)
  dialog.value.querySelector<HTMLElement>('[aria-label="Закрыть просмотрщик"]')?.focus()
  measure()
}
function updateViewport() {
  web.value = Boolean(query?.matches)
  if (ready.value && fit.value) void nextTick(fitScreen)
}
watch(() => props.open, open => { if (mounted) { if (open) void openSession(); else teardown() } })
onMounted(() => {
  mounted = true
  query = window.matchMedia('(min-width: 768px)'); updateViewport()
  query.addEventListener('change', updateViewport)
  if (props.open) void openSession()
})
onBeforeUnmount(() => { teardown(); query?.removeEventListener('change', updateViewport) })
</script>

<template>
  <Teleport to="body">
    <section v-if="open" ref="dialog" class="ds-case-image-viewer" :class="{ 'ds-case-image-viewer--web': web }"
      role="dialog" aria-modal="true" :aria-label="title" tabindex="-1" :aria-busy="!ready"
      :style="{ '--viewer-header-height': `${headerHeight}px` }">
      <div :id="scrollId" ref="viewport" class="ds-case-image-viewer__viewport"
        @dragstart.prevent @pointerdown="pointerDown" @pointermove="pointerMove" @pointerup="pointerEnd" @pointercancel="pointerEnd">
        <div class="ds-case-image-viewer__stage" :style="{ width: `max(100%, ${size.width * scale + gutter * 2}px)`, minHeight: `max(100%, ${top + size.height * scale + bottom}px)`, paddingTop: `${top}px` }">
          <div class="ds-case-image-viewer__scaled" :style="{ width: `${size.width * scale}px`, height: `${size.height * scale}px` }">
            <div ref="media" class="ds-case-image-viewer__media" :style="{ width: `${size.width}px`, height: `${size.height}px`, transform: `scale(${scale})` }" @load.capture="measure"><slot /></div>
          </div>
        </div>
      </div>
      <DsTopStickyBar class="ds-case-image-viewer__header" :text="title" :zoom="zoom" :fit-to-screen="fit" :viewer-ready="ready" @update:zoom="preset" @fit="fitScreen" @close="close" />
      <DsScroll class="ds-case-image-viewer__scroll-x" axis="X" :scroll-id="scrollId" />
      <DsScroll class="ds-case-image-viewer__scroll-y" axis="Y" :scroll-id="scrollId" />
    </section>
  </Teleport>
</template>

<style scoped>
.ds-case-image-viewer { position: fixed; inset: 0; z-index: 400; width: 100dvw; height: 100dvh; overflow: hidden;
  background: linear-gradient(98.0535351534deg, rgb(228.9900005 231.0300046 235.1099977) 41.653%, rgb(184.0356919 220.531624 205.3823537) 99.224%); }
.ds-case-image-viewer--web { background: linear-gradient(128.2256906854deg, rgb(228.9900005 231.0300046 235.1099977) 41.653%, rgb(184.0356919 220.531624 205.3823537) 99.224%); }
.ds-case-image-viewer__viewport { position: absolute; inset: 0; overflow: auto; scrollbar-width: none; touch-action: none; overscroll-behavior: contain; cursor: grab; }
.ds-case-image-viewer__viewport::-webkit-scrollbar { display: none; }
.ds-case-image-viewer__viewport:active { cursor: grabbing; }
.ds-case-image-viewer__stage { box-sizing: border-box; padding: 0 16px 32px; }
.ds-case-image-viewer--web .ds-case-image-viewer__stage { padding-right: 64px; padding-left: 64px; padding-bottom: 24px; }
.ds-case-image-viewer__scaled { position: relative; margin: 0 auto; }
.ds-case-image-viewer__media { position: absolute; left: 0; top: 0; transform-origin: top left; }
.ds-case-image-viewer__media :deep(img), .ds-case-image-viewer__media :deep(svg) { display: block; max-width: none; user-select: none; -webkit-user-drag: none; }
.ds-case-image-viewer__header { position: absolute; inset: 0 0 auto; z-index: 10; }
.ds-case-image-viewer__scroll-x { position: absolute; bottom: 0; left: 0; width: calc(100% - 20px); z-index: 11; }
.ds-case-image-viewer__scroll-y { position: absolute; top: var(--viewer-header-height); right: 0; height: calc(100% - var(--viewer-header-height) - 20px); z-index: 11; }
</style>
