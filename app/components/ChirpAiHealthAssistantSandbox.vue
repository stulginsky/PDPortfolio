<script setup lang="ts">
import { computed, onMounted, onUnmounted, provide, reactive, ref, watch } from 'vue'
import ChirpAiHealthAssistant from './ChirpAiHealthAssistant.vue'
import { createHealthSceneDraft, getHealthSceneProfile, healthSceneProfiles, healthSceneEditorKey, healthStates, type HealthBreakpoint, type HealthPhone, type HealthState, type HealthSceneDraft } from './chirp-ai-health-assistant.scene-context'

const props = defineProps<{ cardArgs: { title?: string; subtitle?: string; badges?: string[]; href?: string } }>()
const mode = ref<HealthState | 'Interaction'>('Interaction')
const draft = reactive(createHealthSceneDraft())
provide(healthSceneEditorKey, { mode, draft })
const preview = ref<HTMLElement>()
const breakpoint = ref<HealthBreakpoint>('base')
const profile = ref(getHealthSceneProfile(320))
const cardWidth = ref(430)
const phoneIndex = ref(0)
const lockRatio = ref(true)
const status = ref('')
const showExport = ref(false)
const fields: (keyof HealthPhone)[] = ['x', 'y', 'width', 'height', 'rotation']
const labels = { x: 'X', y: 'Y', width: 'Width', height: 'Height', rotation: 'Rotation' }
const editingState = computed(() => mode.value === 'Interaction' ? 'Default' : mode.value)
const phone = computed(() => draft[profile.value][editingState.value][phoneIndex.value]!)
const storageKey = 'pdportfolio:chirp-health-scene:v1'
const sourceBaseline = createHealthSceneDraft()
const backupKey = storageKey + ':backup'
const backup = ref<HealthSceneDraft>()
const payload = computed(() => JSON.stringify({ version: 2, component: 'ChirpAiHealthAssistant', coordinateSpace: 'card at width 430px; x shifts by (actualWidth-430)/2', rotation: 'Figma degrees (CSS uses opposite sign)', preview: { breakpoint: breakpoint.value, profile: profile.value, cardWidth: cardWidth.value }, scenes: draft }, null, 2))

function displayedValue(field: keyof HealthPhone) {
  const value = phone.value[field] + (field === 'x' ? (cardWidth.value - 430) / 2 : 0)
  return Math.round(value * 1000) / 1000
}
function edit(field: keyof HealthPhone, event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.value.trim()) return
  const value = Number(input.value)
  if (!Number.isFinite(value) || ((field === 'width' || field === 'height') && value <= 0)) return
  if (lockRatio.value && (field === 'width' || field === 'height')) {
    const ratio = phone.value.width / phone.value.height
    if (field === 'width') phone.value.height = value / ratio
    else phone.value.width = value * ratio
  }
  phone.value[field] = value - (field === 'x' ? (cardWidth.value - 430) / 2 : 0)
  status.value = 'Черновик изменён'
}
function reset() {
  draft[profile.value] = createHealthSceneDraft()[profile.value]
  status.value = `${profile.value}: все состояния сброшены`
}
async function copy() {
  showExport.value = true
  try { await navigator.clipboard.writeText(payload.value); status.value = 'JSON скопирован' }
  catch { status.value = 'Выделите и скопируйте JSON из поля ниже' }
}
function sync() {
  breakpoint.value = window.innerWidth >= 768 ? 'min-768' : 'base'
  profile.value = getHealthSceneProfile(window.innerWidth)
  cardWidth.value = preview.value?.querySelector('a')?.clientWidth || 430
}
let observer: ResizeObserver | undefined
let stopSaving: (() => void) | undefined
function validScenes(value: unknown, keys: readonly string[] = healthSceneProfiles): value is Record<string, Record<HealthState, HealthPhone[]>> {
  const scenes = value as Record<string, Record<HealthState, HealthPhone[]>> | undefined
  return !!scenes && keys.every(bp => healthStates.every(state => Array.isArray(scenes[bp]?.[state]) && scenes[bp][state].length === 3 && scenes[bp][state].every(p => !!p && fields.every(field => typeof p[field] === 'number' && Number.isFinite(p[field])) && p.width > 0 && p.height > 0)))
}
function legacyScenes(scenes: Record<string, Record<HealthState, HealthPhone[]>>): HealthSceneDraft {
  return JSON.parse(JSON.stringify({ 'base-320-425': scenes.base, 'base-426-767': scenes.base, 'min-768': scenes['min-768'] }))
}
function save() {
  try { localStorage.setItem(storageKey, JSON.stringify({ version: 2, scenes: draft, sourceBaseline })) }
  catch { status.value = 'Локальное сохранение недоступно; используйте JSON' }
}
function restoreBackup() {
  if (!backup.value) return
  for (const bp of healthSceneProfiles) draft[bp] = JSON.parse(JSON.stringify(backup.value[bp]))
  status.value = 'Прежний черновик восстановлен'
}
onMounted(() => {
  try {
    const previousBackup = JSON.parse(localStorage.getItem(backupKey) || 'null')
    if (validScenes(previousBackup?.scenes)) backup.value = previousBackup.scenes as HealthSceneDraft
    else if (validScenes(previousBackup?.scenes, ['base', 'min-768'])) backup.value = legacyScenes(previousBackup.scenes)
    const saved = JSON.parse(localStorage.getItem(storageKey) || 'null')
    if (saved?.version === 1 && validScenes(saved.scenes, ['base', 'min-768'])) {
      backup.value = legacyScenes(saved.scenes)
      localStorage.setItem(backupKey, JSON.stringify({ version: 2, scenes: backup.value, legacy: saved }))
      status.value = 'Новые профили загружены; прежний черновик сохранён'
    } else if (saved?.version === 2 && validScenes(saved.scenes)) {
      const changed = JSON.stringify(saved.sourceBaseline) !== JSON.stringify(sourceBaseline)
      if (changed) {
        localStorage.setItem(backupKey, JSON.stringify({ version: 2, scenes: saved.scenes }))
        backup.value = saved.scenes as HealthSceneDraft
        if (validScenes(saved.sourceBaseline)) {
          for (const bp of healthSceneProfiles) for (const state of healthStates) {
            draft[bp][state] = saved.scenes[bp][state].map((phone: HealthPhone, i: number) => {
              const updated = { ...phone }
              for (const field of fields) if (saved.sourceBaseline[bp][state][i][field] !== sourceBaseline[bp][state][i]![field]) updated[field] = sourceBaseline[bp][state][i]![field]
              return updated
            })
          }
        }
        status.value = 'Новые настройки загружены; прежний черновик сохранён'
      } else {
        for (const bp of healthSceneProfiles) draft[bp] = saved.scenes[bp]
        status.value = 'Локальный черновик восстановлен'
      }
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
  <div class="chirp-health-sandbox">
    <div ref="preview" class="chirp-health-sandbox__preview">
      <ChirpAiHealthAssistant v-bind="props.cardArgs" @click.prevent />
    </div>
    <section class="chirp-health-sandbox__editor" aria-label="Редактор сцены">
      <p>Breakpoint: <output data-testid="scene-breakpoint">{{ breakpoint }}</output> · {{ cardWidth }}px</p>
      <p>Профиль: <output data-testid="scene-profile">{{ profile }}</output></p>
      <div class="chirp-health-sandbox__modes" aria-label="Состояние">
        <button v-for="value in ['Interaction', ...healthStates]" :key="value" type="button" :aria-pressed="mode === value" @click="mode = value as typeof mode">{{ value }}</button>
      </div>
      <label>Изображение
        <select v-model="phoneIndex">
          <option :value="0">1 · Профиль</option>
          <option :value="1">2 · Диагноз</option>
          <option :value="2">3 · Лечение</option>
        </select>
      </label>
      <p v-if="mode === 'Interaction'">Проверьте hover и press на плитке. Для редактирования выберите фиксированное состояние.</p>
      <fieldset :disabled="mode === 'Interaction'">
        <legend>Координаты от карточки · {{ editingState }}</legend>
        <label v-for="field in fields" :key="field">{{ labels[field] }}
          <input type="number" step="0.1" :min="field === 'width' || field === 'height' ? 0.1 : undefined" :value="displayedValue(field)" @input="edit(field, $event)" />
        </label>
        <label><input v-model="lockRatio" type="checkbox" /> Сохранять пропорции</label>
      </fieldset>
      <p>Rotation — градусы Figma. Черновик сохраняется в этом браузере.</p>
      <div class="chirp-health-sandbox__modes">
        <button type="button" @click="reset">Сбросить профиль</button>
        <button type="button" @click="copy">Копировать JSON</button>
        <button v-if="backup" type="button" @click="restoreBackup">Вернуть прежний черновик</button>
      </div>
      <p role="status">{{ status }}</p>
      <label v-if="showExport">JSON всех состояний
        <textarea :value="payload" readonly rows="10" @focus="($event.target as HTMLTextAreaElement).select()" />
      </label>
    </section>
  </div>
</template>
