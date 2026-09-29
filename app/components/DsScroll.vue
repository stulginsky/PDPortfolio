<script setup lang="ts">
/**
 * DsScroll — DS component 968:3619 (Scroll)
 * https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=968-3619
 *
 * Custom scrollbar X or Y. Wraps a scroll container and renders a thumb overlay.
 * States: Default / Hover / ActivePressed.
 * Visible only when overflow exists on the specified axis.
 *
 * Thumb formula (per contract):
 *   available = trackLength - 24
 *   thumbLength = min(available, max(48, available * clientSize / scrollSize))
 *   travel = available - thumbLength
 *   thumbOffset = 12 + (scrollPosition / (scrollSize - clientSize)) * travel
 *
 * Desktop: thumb draggable (pointer capture). Mobile: indicator only (Default state only).
 * Accessibility: role=scrollbar, aria-orientation, aria-controls, aria-valuemin/max/now.
 * Arrow/PgUp/PgDown/Home/End keyboard navigation.
 */
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    /** Scroll direction */
    axis: 'X' | 'Y'
    /** id of the scroll container to control */
    scrollId: string
  }>(),
  {
    axis: 'Y',
  },
)

const TRACK_PADDING = 12 // 12px on each end
const MIN_THUMB = 48

// State
const thumbState = ref<'default' | 'hover' | 'pressed'>('default')
const thumbOffset = ref(TRACK_PADDING)
const thumbLength = ref(MIN_THUMB)
const visible = ref(false)

// Track ref (the visual overlay element)
const trackRef = ref<HTMLDivElement | null>(null)
let scrollEl: HTMLElement | null = null
let isDragging = false
let dragStart = 0
let dragScrollStart = 0

function getContainerEl(): HTMLElement | null {
  if (typeof document === 'undefined') return null
  return document.getElementById(props.scrollId)
}

function updateThumb() {
  if (!scrollEl || !trackRef.value) return
  const isX = props.axis === 'X'
  const scrollSize = isX ? scrollEl.scrollWidth : scrollEl.scrollHeight
  const clientSize = isX ? scrollEl.clientWidth : scrollEl.clientHeight
  const scrollPos = isX ? scrollEl.scrollLeft : scrollEl.scrollTop
  const trackLength = isX ? trackRef.value.clientWidth : trackRef.value.clientHeight

  if (scrollSize <= clientSize) {
    visible.value = false
    return
  }
  visible.value = true

  const available = trackLength - TRACK_PADDING * 2
  const tLen = Math.min(available, Math.max(MIN_THUMB, available * clientSize / scrollSize))
  const travel = available - tLen
  const maxScroll = scrollSize - clientSize
  const tOffset = TRACK_PADDING + (maxScroll > 0 ? (scrollPos / maxScroll) * travel : 0)

  thumbLength.value = tLen
  thumbOffset.value = tOffset

  // Update aria
  if (trackRef.value) {
    const valueNow = Math.round((scrollPos / maxScroll) * 100)
    trackRef.value.setAttribute('aria-valuenow', String(valueNow))
  }
}

function onScroll() {
  updateThumb()
}

function onPointerEnter() {
  if (!isDragging) thumbState.value = 'hover'
}

function onPointerLeave() {
  if (!isDragging) thumbState.value = 'default'
}

function onPointerDown(e: PointerEvent) {
  e.preventDefault()
  isDragging = true
  thumbState.value = 'pressed'
  const thumb = e.currentTarget as HTMLElement
  thumb.setPointerCapture(e.pointerId)
  dragStart = props.axis === 'X' ? e.clientX : e.clientY
  dragScrollStart = props.axis === 'X'
    ? (scrollEl?.scrollLeft ?? 0)
    : (scrollEl?.scrollTop ?? 0)
}

function onPointerMove(e: PointerEvent) {
  if (!isDragging || !scrollEl || !trackRef.value) return
  const isX = props.axis === 'X'
  const delta = (isX ? e.clientX : e.clientY) - dragStart
  const trackLength = isX ? trackRef.value.clientWidth : trackRef.value.clientHeight
  const available = trackLength - TRACK_PADDING * 2
  const travel = available - thumbLength.value
  const scrollSize = isX ? scrollEl.scrollWidth : scrollEl.scrollHeight
  const clientSize = isX ? scrollEl.clientWidth : scrollEl.clientHeight
  const maxScroll = scrollSize - clientSize

  const scrollDelta = travel > 0 ? (delta / travel) * maxScroll : 0
  if (isX) {
    scrollEl.scrollLeft = Math.max(0, Math.min(maxScroll, dragScrollStart + scrollDelta))
  } else {
    scrollEl.scrollTop = Math.max(0, Math.min(maxScroll, dragScrollStart + scrollDelta))
  }
}

function onPointerUp(e: PointerEvent) {
  isDragging = false
  const thumb = e.currentTarget as HTMLElement
  thumb.releasePointerCapture(e.pointerId)
  const rect = thumb.getBoundingClientRect()
  const overThumb = e.clientX >= rect.left && e.clientX <= rect.right &&
                    e.clientY >= rect.top && e.clientY <= rect.bottom
  thumbState.value = overThumb ? 'hover' : 'default'
}

function onTrackKeydown(e: KeyboardEvent) {
  if (!scrollEl) return
  const isX = props.axis === 'X'
  const clientSize = isX ? scrollEl.clientWidth : scrollEl.clientHeight
  const step = clientSize * 0.1
  const page = clientSize

  if (isX) {
    if (e.key === 'ArrowRight') { e.preventDefault(); scrollEl.scrollLeft += step }
    if (e.key === 'ArrowLeft') { e.preventDefault(); scrollEl.scrollLeft -= step }
    if (e.key === 'End') { e.preventDefault(); scrollEl.scrollLeft = scrollEl.scrollWidth }
    if (e.key === 'Home') { e.preventDefault(); scrollEl.scrollLeft = 0 }
    if (e.key === 'PageDown') { e.preventDefault(); scrollEl.scrollLeft += page }
    if (e.key === 'PageUp') { e.preventDefault(); scrollEl.scrollLeft -= page }
  } else {
    if (e.key === 'ArrowDown') { e.preventDefault(); scrollEl.scrollTop += step }
    if (e.key === 'ArrowUp') { e.preventDefault(); scrollEl.scrollTop -= step }
    if (e.key === 'End') { e.preventDefault(); scrollEl.scrollTop = scrollEl.scrollHeight }
    if (e.key === 'Home') { e.preventDefault(); scrollEl.scrollTop = 0 }
    if (e.key === 'PageDown') { e.preventDefault(); scrollEl.scrollTop += page }
    if (e.key === 'PageUp') { e.preventDefault(); scrollEl.scrollTop -= page }
  }
}

const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updateThumb) : null

onMounted(() => {
  scrollEl = getContainerEl()
  if (!scrollEl) return
  scrollEl.addEventListener('scroll', onScroll, { passive: true })
  ro?.observe(scrollEl)
  updateThumb()
})

onUnmounted(() => {
  scrollEl?.removeEventListener('scroll', onScroll)
  ro?.disconnect()
})
</script>

<template>
  <div
    ref="trackRef"
    class="ds-scroll"
    :class="[
      `ds-scroll--${axis.toLowerCase()}`,
      { 'ds-scroll--visible': visible }
    ]"
    role="scrollbar"
    :aria-orientation="axis === 'X' ? 'horizontal' : 'vertical'"
    :aria-controls="scrollId"
    aria-valuemin="0"
    aria-valuemax="100"
    aria-valuenow="0"
    tabindex="0"
    @keydown="onTrackKeydown"
  >
    <div
      class="ds-scroll__thumb"
      :class="[`ds-scroll__thumb--${thumbState}`]"
      :style="
        axis === 'X'
          ? { left: thumbOffset + 'px', width: thumbLength + 'px' }
          : { top: thumbOffset + 'px', height: thumbLength + 'px' }
      "
      @pointerenter="onPointerEnter"
      @pointerleave="onPointerLeave"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
    />
  </div>
</template>

<style scoped>
/* Scroll — DS 968:3619 */
.ds-scroll {
  display: none; /* hidden by default */
  position: relative;
  overflow: hidden;
  outline: none;
}

.ds-scroll--visible {
  display: block;
}

/* X: 72×20 track */
.ds-scroll--x {
  width: 100%;
  height: 20px;
}

/* Y: 20×72 track */
.ds-scroll--y {
  width: 20px;
  height: 100%;
}

/* Thumb */
.ds-scroll__thumb {
  position: absolute;
  border-radius: var(--radius-md); /* 8px */
  cursor: pointer;
  touch-action: none;
  user-select: none;
}

/* X axis thumb: 48×12 reference */
.ds-scroll--x .ds-scroll__thumb {
  height: 12px;
  top: 4px;
}

/* Y axis thumb: 12×48 reference */
.ds-scroll--y .ds-scroll__thumb {
  width: 12px;
  left: 4px;
}

/* States */
.ds-scroll__thumb--default {
  background: var(--surface-scroll-thumb, var(--gray-300));
}

.ds-scroll__thumb--hover {
  background: var(--surface-scroll-thumb-hover, var(--gray-500));
}

.ds-scroll__thumb--pressed {
  background: var(--surface-scroll-thumb-pressed, var(--gray-700));
}
</style>
