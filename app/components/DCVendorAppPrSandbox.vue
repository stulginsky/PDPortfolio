<script setup lang="ts">
import { computed, onMounted, onUnmounted, provide, reactive, ref, watch } from 'vue'
import DCVendorAppPr from './DCVendorAppPr.vue'
import { createVendorPrSceneDraft, getVendorPrSceneProfile, vendorPrBreakpoints, vendorPrSceneEditorKey, vendorPrStates, vendorPrLayerNames, vendorPrCoordinateSpace, vendorPrLayerXShift, type VendorPrBreakpoint, type VendorPrLayer, type VendorPrState, type VendorPrSceneDraft } from './dc-vendor-app-pr.scene-context'

const props = defineProps<{ cardArgs: { title?: string; subtitle?: string; badges?: string[]; href?: string } }>()
const mode = ref<VendorPrState | 'Interaction'>('Interaction')
const draft = reactive(createVendorPrSceneDraft())
provide(vendorPrSceneEditorKey, { mode, draft })
const preview = ref<HTMLElement>()
const breakpoint = ref<VendorPrBreakpoint>('base')
const cardWidth = ref(430)
const viewportWidth = ref(320)
const layerYShift = computed(() => {
 const name=vendorPrLayerNames[layerIndex.value]!,viewport=viewportWidth.value
 return (viewport>=320&&viewport<=424&&!['09-ostrich','08-dimmer'].includes(name)?-50:0)+(viewport>=320&&viewport<=410&&['05-landform_city-1st','06-landform_city-2nd','04-water','07-tussock 1'].includes(name)?30:0)
})
const layerIndex = ref(0)
const lockRatio = ref(true)
const status = ref('')
const showExport = ref(false)
const fields: (keyof VendorPrLayer)[] = ['x', 'y', 'width', 'height', 'rotation']
const labels = { x: 'X', y: 'Y', width: 'Width', height: 'Height', rotation: 'Rotation' }
const editingState = computed(() => mode.value === 'Interaction' ? 'Default' : mode.value)
const layer = computed(() => draft[breakpoint.value][editingState.value][layerIndex.value]!)
const storageKey = 'pdportfolio:dc-vendor-app-pr-scene:v1'
const sourceBaseline = createVendorPrSceneDraft()
const backup = ref<VendorPrSceneDraft>()
const payload = computed(() => JSON.stringify({ version: 1, component: 'DCVendorAppPr', coordinateSpace: vendorPrCoordinateSpace, rotation: 'Figma degrees (CSS uses opposite sign)', layers: vendorPrLayerNames, preview: { breakpoint: breakpoint.value, cardWidth: cardWidth.value }, scenes: draft }, null, 2))
function displayedValue(field: keyof VendorPrLayer) {
  return Math.round((layer.value[field] + (field === 'x' ? vendorPrLayerXShift(vendorPrLayerNames[layerIndex.value]!, cardWidth.value) : field === 'y' ? layerYShift.value : 0)) * 1000) / 1000
}
function edit(field: keyof VendorPrLayer, event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.value.trim()) return
  const value = Number(input.value)
  if (!Number.isFinite(value) || ((field === 'width' || field === 'height') && value <= 0)) return
  if (lockRatio.value && (field === 'width' || field === 'height')) {
    const ratio = layer.value.width / layer.value.height
    if (field === 'width') layer.value.height = value / ratio
    else layer.value.width = value * ratio
  }
  layer.value[field] = value - (field === 'x' ? vendorPrLayerXShift(vendorPrLayerNames[layerIndex.value]!, cardWidth.value) : field === 'y' ? layerYShift.value : 0)
  status.value = 'Черновик изменён'
}
function reset() { draft[breakpoint.value] = createVendorPrSceneDraft()[breakpoint.value]; status.value = `${breakpoint.value}: все состояния сброшены` }
async function copy() {
  showExport.value = true
  try { await navigator.clipboard.writeText(payload.value); status.value = 'JSON скопирован' }
  catch { status.value = 'Выделите и скопируйте JSON из поля ниже' }
}
function sync() {
  viewportWidth.value = window.innerWidth
  breakpoint.value = getVendorPrSceneProfile(window.innerWidth)
  cardWidth.value = preview.value?.querySelector('a')?.clientWidth || 430
}
function validScenes(value: unknown): value is VendorPrSceneDraft {
  const scenes = value as VendorPrSceneDraft | undefined
  return !!scenes && vendorPrBreakpoints.every(bp => vendorPrStates.every(state => Array.isArray(scenes[bp]?.[state]) && scenes[bp][state].length === vendorPrLayerNames.length && scenes[bp][state].every(p => !!p && fields.every(field => typeof p[field] === 'number' && Number.isFinite(p[field])) && p.width > 0 && p.height > 0)))
}
function save() {
  try { localStorage.setItem(storageKey, JSON.stringify({ version: 1, scenes: draft, sourceBaseline })) }
  catch { status.value = 'Локальное сохранение недоступно; используйте JSON' }
}
function restoreBackup() {
  if (!backup.value) return
  for (const bp of vendorPrBreakpoints) draft[bp] = JSON.parse(JSON.stringify(backup.value[bp]))
  status.value = 'Прежний черновик восстановлен'
}
let observer: ResizeObserver | undefined
let stopSaving: (() => void) | undefined
onMounted(() => {
  try {
    const previousBackup = JSON.parse(localStorage.getItem(storageKey + ':backup') || 'null')
    const saved = JSON.parse(localStorage.getItem(storageKey) || 'null')
    // Existing v1 drafts gain an independent copy of their base profile.
    for (const value of [saved?.scenes, saved?.sourceBaseline, previousBackup?.scenes]) {
      if (value?.base && !value['534-720']) value['534-720'] = JSON.parse(JSON.stringify(value.base))
      if (value?.['min-768'] && !value['1024-1920']) value['1024-1920'] = JSON.parse(JSON.stringify(value['min-768']))
    }
    if (validScenes(previousBackup?.scenes)) backup.value = previousBackup.scenes
    if (saved?.version === 1 && validScenes(saved.scenes)) {
      if (JSON.stringify(saved.sourceBaseline) === JSON.stringify(sourceBaseline)) {
        for (const bp of vendorPrBreakpoints) draft[bp] = saved.scenes[bp]
      } else {
        backup.value = saved.scenes
        localStorage.setItem(storageKey + ':backup', JSON.stringify({ scenes: saved.scenes }))
        if (validScenes(saved.sourceBaseline)) for (const bp of vendorPrBreakpoints) for (const state of vendorPrStates) {
          draft[bp][state] = vendorPrLayerNames.map((_, index) => {
            const updated = { ...saved.scenes[bp][state][index] }
            for (const field of fields) if (saved.sourceBaseline[bp][state][index][field] !== sourceBaseline[bp][state][index]![field]) updated[field] = sourceBaseline[bp][state][index]![field]
            return updated as VendorPrLayer
          })
        }
      }
      status.value = 'Локальный черновик восстановлен'
    }
  } catch { status.value = 'Локальное сохранение недоступно; используйте JSON' }
  save()
  stopSaving = watch(draft, save, { deep: true })
  sync()
  observer = new ResizeObserver(sync)
  if (preview.value) observer.observe(preview.value)
  window.addEventListener('resize', sync)
})
onUnmounted(() => { observer?.disconnect(); stopSaving?.(); window.removeEventListener('resize', sync) })
</script>

<template>
  <div class="dc-vendor-app-pr-sandbox">
    <div ref="preview" class="dc-vendor-app-pr-sandbox__preview"><DCVendorAppPr v-bind="props.cardArgs" @click.prevent /></div>
    <section class="dc-vendor-app-pr-sandbox__editor" aria-label="Редактор сцены">
      <p>Breakpoint: <output data-testid="scene-breakpoint">{{ breakpoint }}</output> · {{ cardWidth }}px</p>
      <div class="dc-vendor-app-pr-sandbox__modes" aria-label="Состояние">
        <button v-for="value in ['Interaction', ...vendorPrStates]" :key="value" type="button" :aria-pressed="mode === value" @click="mode = value as typeof mode">{{ value }}</button>
      </div>
      <label>Слой<select v-model="layerIndex"><option v-for="(name, index) in vendorPrLayerNames" :key="name" :value="index">{{ name }}</option></select></label>
      <p v-if="mode === 'Interaction'">Проверьте hover и press на плитке. Для редактирования выберите фиксированное состояние.</p>
      <fieldset :disabled="mode === 'Interaction'">
        <legend>Координаты от карточки · {{ editingState }}</legend>
        <label v-for="field in fields" :key="field">{{ labels[field] }}
          <input type="number" step="0.1" :min="field === 'width' || field === 'height' ? 0.1 : undefined" :value="displayedValue(field)" @input="edit(field, $event)" />
        </label>
        <label><input v-model="lockRatio" type="checkbox" /> Сохранять пропорции</label>
      </fieldset>
      <p>Rotation — градусы Figma. Черновик сохраняется в этом браузере.</p>
      <div class="dc-vendor-app-pr-sandbox__modes">
        <button type="button" @click="reset">Сбросить профиль</button>
        <button type="button" @click="copy">Копировать JSON</button>
        <button v-if="backup" type="button" @click="restoreBackup">Вернуть прежний черновик</button>
      </div>
      <p role="status">{{ status }}</p>
      <label v-if="showExport">JSON всех состояний<textarea :value="payload" readonly rows="10" @focus="($event.target as HTMLTextAreaElement).select()" /></label>
    </section>
  </div>
</template>
