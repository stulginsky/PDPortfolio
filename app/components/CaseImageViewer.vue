<script setup lang="ts">
import DsCrossButton from './DsCrossButton.vue'

const props = defineProps<{
  open: boolean;
  src: string;
  alt: string;
  title: string;
  labels: {
    viewerLabel: string;
    closeViewer: string;
    zoomTo: string;
    zoomToFit: string;
  };
}>();

const emit = defineEmits<{
  close: [];
}>();

const presetOptions = [25, 50, 75] as const;
const viewportRef = ref<HTMLElement | null>(null);
const imageRef = ref<HTMLImageElement | null>(null);
const scale = ref(1);
const isMenuOpen = ref(false);
const naturalSize = ref({ width: 924, height: 594 });
const lastFocusedElement = ref<HTMLElement | null>(null);
const drag = ref<{ x: number; y: number; left: number; top: number } | null>(null);
const pinchDistance = ref<number | null>(null);
const pinchScale = ref(1);

const scaleLabel = computed(() => `${Math.round(scale.value * 100)}%`);

function clampScale(value: number) {
  return Math.min(3, Math.max(0.25, value));
}

function updateScale(value: number) {
  scale.value = clampScale(value);
}

function fitToViewport() {
  const viewport = viewportRef.value;
  if (!viewport) return;

  const availableWidth = Math.max(viewport.clientWidth - 48, 1);
  const availableHeight = Math.max(viewport.clientHeight - 48, 1);
  updateScale(Math.min(availableWidth / naturalSize.value.width, availableHeight / naturalSize.value.height));
}

function setPreset(value: number | "fit") {
  if (value === "fit") fitToViewport();
  else updateScale(value / 100);
  isMenuOpen.value = false;
}

function close() {
  emit("close");
}

function onImageLoad() {
  const image = imageRef.value;
  if (!image?.naturalWidth || !image.naturalHeight) return;
  naturalSize.value = { width: image.naturalWidth, height: image.naturalHeight };
}

function onWheel(event: WheelEvent) {
  event.preventDefault();
  updateScale(scale.value * (event.deltaY < 0 ? 1.1 : 1 / 1.1));
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === "Escape") {
    event.preventDefault();
    close();
    return;
  }

  if ((event.ctrlKey || event.metaKey) && ["+", "=", "-"].includes(event.key)) {
    event.preventDefault();
    updateScale(scale.value * (event.key === "-" ? 1 / 1.1 : 1.1));
  }
}

function onWindowKeydown(event: KeyboardEvent) {
  onKeydown(event);
}

function getDistance(first: PointerEvent, second: PointerEvent) {
  return Math.hypot(first.clientX - second.clientX, first.clientY - second.clientY);
}

const activePointers = new Map<number, PointerEvent>();

function onPointerDown(event: PointerEvent) {
  const viewport = viewportRef.value;
  if (!viewport) return;

  activePointers.set(event.pointerId, event);
  viewport.setPointerCapture(event.pointerId);

  if (activePointers.size === 2) {
    const [first, second] = [...activePointers.values()];
    pinchDistance.value = getDistance(first, second);
    pinchScale.value = scale.value;
    drag.value = null;
    return;
  }

  drag.value = {
    x: event.clientX,
    y: event.clientY,
    left: viewport.scrollLeft,
    top: viewport.scrollTop,
  };
}

function onPointerMove(event: PointerEvent) {
  const viewport = viewportRef.value;
  if (!viewport || !activePointers.has(event.pointerId)) return;

  activePointers.set(event.pointerId, event);
  if (activePointers.size === 2 && pinchDistance.value) {
    const [first, second] = [...activePointers.values()];
    updateScale(pinchScale.value * (getDistance(first, second) / pinchDistance.value));
    return;
  }

  if (!drag.value) return;
  viewport.scrollLeft = drag.value.left - (event.clientX - drag.value.x);
  viewport.scrollTop = drag.value.top - (event.clientY - drag.value.y);
}

function onPointerEnd(event: PointerEvent) {
  activePointers.delete(event.pointerId);
  if (activePointers.size < 2) pinchDistance.value = null;
  if (activePointers.size === 0) drag.value = null;
}

watch(() => props.open, async (isOpen) => {
  if (import.meta.server) return;

  if (isOpen) {
    lastFocusedElement.value = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onWindowKeydown);
    scale.value = 1;
    return;
  }

  document.body.style.overflow = "";
  window.removeEventListener("keydown", onWindowKeydown);
  lastFocusedElement.value?.focus();
});

onBeforeUnmount(() => {
  if (!import.meta.server) {
    document.body.style.overflow = "";
    window.removeEventListener("keydown", onWindowKeydown);
  }
});
</script>

<template>
  <Teleport to="body">
    <section
      v-if="open"
      class="case-image-viewer"
      role="dialog"
      aria-modal="true"
      :aria-label="labels.viewerLabel.replace('{title}', title)"
    >
      <header class="case-image-viewer__header">
        <TypoText :content="title" tag="p" class="case-image-viewer__title" />
        <div class="case-image-viewer__actions">
          <div class="case-image-viewer__scale-control">
            <button
              type="button"
              class="case-image-viewer__scale-button"
              :aria-expanded="isMenuOpen"
              aria-haspopup="menu"
              @click="isMenuOpen = !isMenuOpen"
            >
              {{ scaleLabel }}
              <img src="/cases/chirp-product/media/chevron-down.svg" alt="" aria-hidden="true">
            </button>
            <div v-if="isMenuOpen" class="case-image-viewer__menu" role="menu">
              <button v-for="option in presetOptions" :key="option" type="button" role="menuitem" @click="setPreset(option)">
                <TypoText :content="labels.zoomTo.replace('{value}', String(option))" tag="span" />
              </button>
              <button type="button" role="menuitem" @click="setPreset('fit')"><TypoText :content="labels.zoomToFit" tag="span" /></button>
            </div>
          </div>
          <DsCrossButton :aria-label="labels.closeViewer" @click="close" />
        </div>
      </header>

      <div
        ref="viewportRef"
        class="case-image-viewer__viewport"
        @wheel="onWheel"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerEnd"
        @pointercancel="onPointerEnd"
      >
        <div
          class="case-image-viewer__stage"
          :style="{ width: `max(100%, ${naturalSize.width * scale}px)`, height: `max(100%, ${naturalSize.height * scale}px)` }"
        >
          <div class="case-image-viewer__canvas" :style="{ width: `${naturalSize.width * scale}px`, height: `${naturalSize.height * scale}px` }">
            <img ref="imageRef" :src="src" :alt="alt" draggable="false" @load="onImageLoad">
          </div>
        </div>
      </div>
    </section>
  </Teleport>
</template>

<style scoped>
.case-image-viewer { position: fixed; inset: 0; z-index: 100; display: grid; grid-template-rows: 138px minmax(0, 1fr); background: var(--surface-default); }
.case-image-viewer__header { display: flex; align-items: center; justify-content: space-between; gap: var(--space-4); padding: var(--space-6); background: linear-gradient(90deg, var(--surface-fullscreen-header-start), var(--surface-fullscreen-header-end)); backdrop-filter: blur(12px); }
.case-image-viewer__title { margin: 0; min-width: 0; overflow: hidden; color: var(--text-default); font-size: var(--text-size-xl); font-weight: var(--text-weight-semibold); font-variation-settings: var(--font-variation-heading-xl-semibold); line-height: 1.3; text-overflow: ellipsis; white-space: nowrap; }
.case-image-viewer__actions { display: flex; align-items: center; gap: var(--space-3); }
.case-image-viewer__scale-control { position: relative; }
.case-image-viewer__scale-button { display: inline-flex; align-items: center; gap: var(--space-2); min-height: 50px; padding: 0 var(--space-4); border: 0; border-radius: var(--radius-xlg); color: var(--text-inverse); background: var(--surface-action-toggled); font: inherit; cursor: pointer; }
.case-image-viewer__scale-button img { width: 16px; height: 16px; }
.case-image-viewer__menu { position: absolute; top: calc(100% + var(--space-2)); right: 0; z-index: 1; display: grid; width: 148px; padding: var(--space-2) 0; border-radius: var(--radius-xlg) 0 var(--radius-xlg) var(--radius-xlg); background: var(--surface-menu-item-default); overflow: hidden; }
.case-image-viewer__menu button { min-height: 40px; padding: 0 var(--space-3); border: 0; color: var(--text-inverse); background: transparent; font: inherit; font-size: var(--text-size-sm); text-align: left; cursor: pointer; }
.case-image-viewer__menu button:hover { background: var(--surface-menu-item-hover); }
.case-image-viewer__menu button:active { background: var(--surface-menu-item-pressed); }
.case-image-viewer__viewport { min-width: 0; min-height: 0; overflow: auto; cursor: grab; touch-action: none; }
.case-image-viewer__viewport:active { cursor: grabbing; }
.case-image-viewer__stage { display: grid; place-items: center; min-width: 100%; min-height: 100%; }
.case-image-viewer__canvas { display: grid; place-items: center; }
.case-image-viewer__canvas img { display: block; width: 100%; height: 100%; object-fit: contain; user-select: none; }
@media (max-width: 720px) { .case-image-viewer { grid-template-rows: 138px minmax(0, 1fr); } .case-image-viewer__header { padding: var(--space-4); } .case-image-viewer__title { font-size: var(--text-size-base); } .case-image-viewer__scale-button { min-width: 80px; padding: 0 var(--space-3); font-size: var(--text-size-sm); } }
</style>
