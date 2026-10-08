<script setup lang="ts">
import { computed, onMounted, onUnmounted, provide, reactive, ref, watch } from 'vue'
import ChirpAiMedicalBrand from './ChirpAiMedicalBrand.vue'
import { createBrandSceneDraft, getBrandSceneProfile, brandBreakpoints, brandSceneEditorKey, brandStates, brandLayerNames, brandCoordinateSpace, brandLayerXShift, type BrandBreakpoint, type BrandLayer, type BrandState, type BrandSceneDraft } from './chirp-ai-medical-brand.scene-context'

const props = defineProps<{ cardArgs: { title?: string; subtitle?: string; badges?: string[]; href?: string } }>()
const mode = ref<BrandState | 'Interaction'>('Interaction')
const draft = reactive(createBrandSceneDraft())
provide(brandSceneEditorKey, { mode, draft })
const preview = ref<HTMLElement>()
const breakpoint = ref<BrandBreakpoint>('base')
const cardWidth = ref(430)
const layerIndex = ref(0)
const lockRatio = ref(true)
const status = ref('')
const showExport = ref(false)
const fields: (keyof BrandLayer)[] = ['x', 'y', 'width', 'height', 'rotation']
const labels = { x: 'X', y: 'Y', width: 'Width', height: 'Height', rotation: 'Rotation' }
const editingState = computed(() => mode.value === 'Interaction' ? 'Default' : mode.value)
const layer = computed(() => draft[breakpoint.value][editingState.value][layerIndex.value]!)
const storageKey = 'pdportfolio:chirp-ai-medical-brand-scene:v1'
const sourceBaseline = createBrandSceneDraft()
const backup = ref<BrandSceneDraft>()
const payload = computed(() => JSON.stringify({ version: 1, component: 'ChirpAiMedicalBrand', coordinateSpace: brandCoordinateSpace, rotation: 'Figma degrees (CSS uses opposite sign)', layers: brandLayerNames, preview: { breakpoint: breakpoint.value, cardWidth: cardWidth.value }, scenes: draft }, null, 2))
function displayedValue(field: keyof BrandLayer) {
  return Math.round((layer.value[field] + (field === 'x' ? brandLayerXShift(brandLayerNames[layerIndex.value]!, cardWidth.value) : 0)) * 1000) / 1000
}
function edit(field: keyof BrandLayer, event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.value.trim()) return
  const value = Number(input.value)
  if (!Number.isFinite(value) || ((field === 'width' || field === 'height') && value <= 0)) return
  if (lockRatio.value && (field === 'width' || field === 'height')) {
    const ratio = layer.value.width / layer.value.height
    if (field === 'width') layer.value.height = value / ratio
    else layer.value.width = value * ratio
  }
  layer.value[field] = value - (field === 'x' ? brandLayerXShift(brandLayerNames[layerIndex.value]!, cardWidth.value) : 0)
  status.value = 'Черновик изменён'
}
function reset() { draft[breakpoint.value] = createBrandSceneDraft()[breakpoint.value]; status.value = `${breakpoint.value}: все состояния сброшены` }
async function copy() {
  showExport.value = true
  try { await navigator.clipboard.writeText(payload.value); status.value = 'JSON скопирован' }
  catch { status.value = 'Выделите и скопируйте JSON из поля ниже' }
}
function sync() {
  breakpoint.value = getBrandSceneProfile(window.innerWidth)
  cardWidth.value = preview.value?.querySelector('a')?.clientWidth || 430
}
function validScenes(value: unknown): value is BrandSceneDraft {
  const scenes = value as BrandSceneDraft | undefined
  return !!scenes && brandBreakpoints.every(bp => brandStates.every(state => Array.isArray(scenes[bp]?.[state]) && scenes[bp][state].length === brandLayerNames.length && scenes[bp][state].every(p => !!p && fields.every(field => typeof p[field] === 'number' && Number.isFinite(p[field])) && p.width > 0 && p.height > 0)))
}
function save() {
  try { localStorage.setItem(storageKey, JSON.stringify({ version: 1, scenes: draft, sourceBaseline })) }
  catch { status.value = 'Локальное сохранение недоступно; используйте JSON' }
}
function restoreBackup() {
  if (!backup.value) return
  for (const bp of brandBreakpoints) draft[bp] = JSON.parse(JSON.stringify(backup.value[bp]))
  status.value = 'Прежний черновик восстановлен'
}
let observer: ResizeObserver | undefined
let stopSaving: (() => void) | undefined
onMounted(() => {
  try {
    const previousBackup = JSON.parse(localStorage.getItem(storageKey + ':backup') || 'null')
    if (validScenes(previousBackup?.scenes)) backup.value = previousBackup.scenes
    const saved = JSON.parse(localStorage.getItem(storageKey) || 'null')
    if (saved?.version === 1 && validScenes(saved.scenes)) {
      if (JSON.stringify(saved.sourceBaseline) === JSON.stringify(sourceBaseline)) {
        for (const bp of brandBreakpoints) draft[bp] = saved.scenes[bp]
      } else {
        backup.value = saved.scenes
        localStorage.setItem(storageKey + ':backup', JSON.stringify({ scenes: saved.scenes }))
        if (validScenes(saved.sourceBaseline)) for (const bp of brandBreakpoints) for (const state of brandStates) {
          draft[bp][state] = brandLayerNames.map((_, index) => {
            const updated = { ...saved.scenes[bp][state][index] }
            for (const field of fields) if (saved.sourceBaseline[bp][state][index][field] !== sourceBaseline[bp][state][index]![field]) updated[field] = sourceBaseline[bp][state][index]![field]
            return updated as BrandLayer
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
  <div class="chirp-brand-sandbox">
    <div ref="preview" class="chirp-brand-sandbox__preview"><ChirpAiMedicalBrand v-bind="props.cardArgs" @click.prevent /></div>
    <section class="chirp-brand-sandbox__editor" aria-label="Редактор сцены">
      <p>Breakpoint: <output data-testid="scene-breakpoint">{{ breakpoint }}</output> · {{ cardWidth }}px</p>
      <div class="chirp-brand-sandbox__modes" aria-label="Состояние">
        <button v-for="value in ['Interaction', ...brandStates]" :key="value" type="button" :aria-pressed="mode === value" @click="mode = value as typeof mode">{{ value }}</button>
      </div>
      <label>Слой<select v-model="layerIndex"><option v-for="(name, index) in brandLayerNames" :key="name" :value="index">{{ name }}</option></select></label>
      <p v-if="mode === 'Interaction'">Проверьте hover и press на плитке. Для редактирования выберите фиксированное состояние.</p>
      <fieldset :disabled="mode === 'Interaction'">
        <legend>Координаты от карточки · {{ editingState }}</legend>
        <label v-for="field in fields" :key="field">{{ labels[field] }}
          <input type="number" step="0.1" :min="field === 'width' || field === 'height' ? 0.1 : undefined" :value="displayedValue(field)" @input="edit(field, $event)" />
        </label>
        <label><input v-model="lockRatio" type="checkbox" /> Сохранять пропорции</label>
      </fieldset>
      <p>Rotation — градусы Figma. Черновик сохраняется в этом браузере.</p>
      <div class="chirp-brand-sandbox__modes">
        <button type="button" @click="reset">Сбросить профиль</button>
        <button type="button" @click="copy">Копировать JSON</button>
        <button v-if="backup" type="button" @click="restoreBackup">Вернуть прежний черновик</button>
      </div>
      <p role="status">{{ status }}</p>
      <label v-if="showExport">JSON всех состояний<textarea :value="payload" readonly rows="10" @focus="($event.target as HTMLTextAreaElement).select()" /></label>
    </section>
  </div>
</template>
