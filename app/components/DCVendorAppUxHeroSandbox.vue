<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, provide, reactive, ref, watch } from 'vue'
import DCVendorAppUxHero from './DCVendorAppUxHero.vue'
import { createHeroDraft, getHeroBreakpoint, heroAmplitudes, heroBreakpoints, heroReferences, heroSceneEditorKey, validHeroDraft, migrateHeroLayer, type HeroBreakpoint } from './dc-vendor-app-ux-hero.scene-context'

const props = defineProps<{ heroArgs?: Record<string, never> }>()
const draft = reactive(createHeroDraft())
const mode = ref<'Neutral' | 'Interaction'>('Interaction')
provide(heroSceneEditorKey, { draft, mode })
const hero = ref<InstanceType<typeof DCVendorAppUxHero>>()
const breakpoint = ref<HeroBreakpoint>('base')
const layerIndex = ref(0)
// Profiles contain different layer counts and source orders. Keep selection by
// source name (or the title's last slot), never leave an out-of-range index.
watch(breakpoint, (next, previous) => {
  const old = draft[previous][layerIndex.value]
  const same = draft[next].findIndex(layer => layer.name === old?.name)
  layerIndex.value = same >= 0 ? same : layerIndex.value === draft[previous].length - 1 ? draft[next].length - 1 : 0
})
const selected = computed(() => draft[breakpoint.value][layerIndex.value]!)
const motionLocked = computed(() => false)
const status = ref('')
const showExport = ref(false)
const storageKey = 'pdportfolio:dc-vendor-app-ux-hero:scene:v1'
const baseline = createHeroDraft()
const numericFields = ['x', 'y', 'viscosity', 'returnSpeed', 'amplitude', 'baseOffset'] as const
const payload = computed(() => JSON.stringify({
  version: 2, component: 'DCVendorAppUxHero',
  coordinateSpace: 'Geometry: Figma reference pixels; baseOffset: physical CSS pixels; viscosity/returnSpeed: shared hero-motion time scale',
  preview: { breakpoint: breakpoint.value, mode: mode.value },
  references: Object.fromEntries(heroBreakpoints.map(bp => [bp, { width: heroReferences[bp].width, height: heroReferences[bp].height }])),
  scenes: draft,
}, null, 2))
function edit(field: typeof numericFields[number], event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.value.trim()) return
  const value = Number(input.value)
  if (!Number.isFinite(value) || (['viscosity','returnSpeed'].includes(field) && (value < .1 || value > 20)) || (field === 'amplitude' && (value < 0 || value > 4)) || (field === 'baseOffset' && value < 0)) return
  selected.value[field] = value
  status.value = 'Черновик изменён'
}
function resetLayer() {
  draft[breakpoint.value][layerIndex.value] = { ...createHeroDraft()[breakpoint.value][layerIndex.value]! }
  hero.value?.resetMotion()
  status.value = 'Выбранный слой сброшен'
}
function resetProfile() {
  draft[breakpoint.value] = createHeroDraft()[breakpoint.value]
  hero.value?.resetMotion()
  status.value = 'Текущий профиль сброшен'
}
function resetAll() {
  const defaults = createHeroDraft()
  for (const bp of heroBreakpoints) draft[bp] = defaults[bp]
  hero.value?.resetMotion()
  status.value = 'Все профили сброшены'
}
async function replay() {
  mode.value = 'Interaction'
  await nextTick()
  hero.value?.replayIntro()
}
async function copy() {
  showExport.value = true
  try { await navigator.clipboard.writeText(payload.value); status.value = 'JSON скопирован' }
  catch { status.value = 'Выделите и скопируйте JSON из поля ниже' }
}
function sync() { breakpoint.value = getHeroBreakpoint(window.innerWidth) }
let stopSaving: (() => void) | undefined
onMounted(() => {
  sync()
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || 'null')
    if ([1,2].includes(saved?.version) && validHeroDraft(saved.scenes)) {
      for (const bp of heroBreakpoints) draft[bp] = saved.scenes[bp].map((layer: typeof selected.value, index: number) => migrateHeroLayer(layer,index,bp))
      if (validHeroDraft(saved.baseline)) {
        for (const bp of heroBreakpoints) for(let index=0;index<draft[bp].length;index++) {
          const old=migrateHeroLayer(saved.scenes[bp][index],index,bp), previous=migrateHeroLayer(saved.baseline[bp][index],index,bp)
          for(const key of ['x','y','width','height','viscosity','returnSpeed','amplitude','baseOffset','pointerDirection','introDirection','animationEnabled'] as const) {
            if(old[key]===previous[key]) Object.assign(draft[bp][index]!,{[key]:baseline[bp][index]![key]})
          }
        }
      }
      status.value = 'Локальный черновик восстановлен'
    }
  } catch { status.value = 'Локальное сохранение недоступно; используйте JSON' }
  stopSaving = watch(draft, () => {
    try { localStorage.setItem(storageKey, JSON.stringify({ version: 2, scenes: draft, baseline })) }
    catch { status.value = 'Локальное сохранение недоступно; используйте JSON' }
  }, { deep: true })
  window.addEventListener('resize', sync)
})
onUnmounted(() => { stopSaving?.(); window.removeEventListener('resize', sync) })
</script>

<template>
  <div class="hero-sandbox">
    <DCVendorAppUxHero ref="hero" v-bind="props.heroArgs" />
    <section class="hero-sandbox__editor" aria-label="Редактор слоёв hero">
      <p>Breakpoint: <output data-testid="hero-breakpoint">{{ breakpoint }}</output> · reference {{ heroReferences[breakpoint].width }}×{{ heroReferences[breakpoint].height }}</p>
      <div class="hero-sandbox__actions">
        <button v-for="value in ['Neutral', 'Interaction']" :key="value" type="button" :aria-pressed="mode === value" @click="mode = value as typeof mode">{{ value }}</button>
        <button type="button" @click="replay">Повторить вступление</button>
      </div>
      <label class="hero-sandbox__select">Слой
        <select v-model="layerIndex">
          <option v-for="(layer, index) in draft[breakpoint]" :key="layer.name" :value="index">{{ layer.name }}</option>
        </select>
      </label>
      <fieldset>
        <legend>Исходное положение · {{ selected.name }}</legend>
        <label>X<input type="number" step="0.1" :value="selected.x" @input="edit('x', $event)" /></label>
        <label>Y<input type="number" step="0.1" :value="selected.y" @input="edit('y', $event)" /></label>
      </fieldset>
      <fieldset>
        <legend>Движение слоя</legend>
        <p v-if="motionLocked">Этот слой неподвижен по контракту; доступны координаты.</p>
        <label class="hero-sandbox__toggle"><input v-model="selected.animationEnabled" :disabled="motionLocked" type="checkbox" /> Анимация слоя</label>
        <label>Вязкость ×<input type="number" step="0.1" min="0.1" max="20" :disabled="!selected.animationEnabled || motionLocked" :value="selected.viscosity" @input="edit('viscosity', $event)" /></label>
        <label>Скорость возврата ×<input type="number" step="0.1" min="0.1" max="20" :disabled="!selected.animationEnabled || motionLocked" :value="selected.returnSpeed" @input="edit('returnSpeed', $event)" /></label>
        <label>Амплитуда ×<input type="number" step="0.1" min="0" max="4" :disabled="!selected.animationEnabled || motionLocked" :value="selected.amplitude" @input="edit('amplitude', $event)" /></label>
        <label>Базовое смещение, px<input type="number" step="0.1" min="0" :disabled="!selected.animationEnabled || motionLocked" :value="selected.baseOffset" @input="edit('baseOffset', $event)" /></label>
        <label>Направление движения<select v-model="selected.pointerDirection" :disabled="!selected.animationEnabled || motionLocked"><option :value="1">По движению</option><option :value="-1">Против движения</option></select></label>
        <label>Направление вступления<select v-model="selected.introDirection" :disabled="!selected.animationEnabled || motionLocked"><option :value="-1">Влево</option><option :value="1">Вправо</option></select></label>
      </fieldset>
      <p>X/Y — пиксели reference. Размах в реальных px = базовое смещение × амплитуда. Больше вязкость — медленнее отклик; больше скорость возврата — быстрее откат. Через80ms без движения слой возвращается к старту, даже при удержании пальца. Одинаковые значения во всех hero означают одинаковую механику. Шаг0,1. Вступление:25% размаха, пауза300ms. Черновик сохраняется в браузере.</p>
      <div class="hero-sandbox__actions">
        <button type="button" @click="resetLayer">Сбросить слой</button>
        <button type="button" @click="resetProfile">Сбросить профиль</button>
        <button type="button" @click="resetAll">Сбросить всё</button>
        <button type="button" @click="copy">Копировать JSON</button>
      </div>
      <p role="status">{{ status }}</p>
      <label v-if="showExport" class="hero-sandbox__export">JSON всех профилей
        <textarea :value="payload" readonly rows="14" @focus="($event.target as HTMLTextAreaElement).select()" />
      </label>
      <button v-if="showExport" type="button" @click="showExport = false">Скрыть JSON</button>
    </section>
  </div>
</template>

<style scoped>
.hero-sandbox { width: 100%; }
.hero-sandbox__editor { margin: var(--space-6) var(--space-4); max-width: 924px; font-family: var(--text-font-sans); font-size: var(--text-size-16); color: var(--text-default); }
.hero-sandbox__actions { display: flex; flex-wrap: wrap; gap: var(--space-2); margin-block: var(--space-3); }
.hero-sandbox__editor button { min-height: 32px; }
.hero-sandbox__select { display: flex; flex-wrap: wrap; gap: var(--space-2); align-items: center; margin-block: var(--space-3); }
.hero-sandbox__editor fieldset { display: grid; gap: var(--space-3); min-width: 0; margin-block: var(--space-3); }
.hero-sandbox__editor fieldset label { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: var(--space-2); }
.hero-sandbox__editor input[type=number] { box-sizing: border-box; width: 140px; max-width: 100%; }
.hero-sandbox__editor select { max-width: 100%; }
.hero-sandbox__editor fieldset .hero-sandbox__toggle { justify-content: flex-start; }
.hero-sandbox__export { display: flex; flex-direction: column; gap: var(--space-2); }
.hero-sandbox__export textarea { box-sizing: border-box; width: 100%; }
</style>
