<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, provide, reactive, ref, watch } from 'vue'
import ChirpPrHero from './ChirpPrHero.vue'
import { createHeroDraft, getHeroBreakpoint, heroBreakpoints, heroReferences, heroSceneEditorKey, validHeroDraft, type HeroBreakpoint, type HeroLayer } from './chirp-pr-hero.scene-context'

const props = defineProps<{ heroArgs: { title?: string; badge?: string } }>()
const draft = reactive(createHeroDraft())
const mode = ref<'Neutral' | 'Interaction'>('Interaction')
provide(heroSceneEditorKey, { draft, mode })
const hero = ref<InstanceType<typeof ChirpPrHero>>()
const breakpoint = ref<HeroBreakpoint>('base')
const layerIndex = ref(0)
const selected = computed(() => draft[breakpoint.value][layerIndex.value]!)
const status = ref('')
const showExport = ref(false)
const storageKey = 'pdportfolio:chirp-pr-hero:scene:v1'
const baseline = createHeroDraft()
const numericFields = ['x', 'y', 'speed'] as const
const payload = computed(() => JSON.stringify({
  version: 1, component: 'ChirpPrHero',
  coordinateSpace: 'Figma reference pixels per breakpoint; preview scales geometry to container width',
  preview: { breakpoint: breakpoint.value, mode: mode.value },
  references: Object.fromEntries(heroBreakpoints.map(bp => [bp, { width: heroReferences[bp].width, height: heroReferences[bp].height }])),
  scenes: draft,
}, null, 2))
function edit(field: typeof numericFields[number], event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.value.trim()) return
  const value = Number(input.value)
  if (!Number.isFinite(value) || (field === 'speed' && (value < .25 || value > 4))) return
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
    if (saved?.version === 1 && validHeroDraft(saved.scenes)) {
      for (const bp of heroBreakpoints) draft[bp] = saved.scenes[bp]
      // Source changes update untouched fields without discarding user edits.
      if (validHeroDraft(saved.baseline)) {
        for (const bp of heroBreakpoints) for (let index = 0; index < 4; index++) {
          for (const key of ['x', 'y', 'width', 'height', 'speed', 'introDirection', 'animationEnabled'] as const) {
            if (saved.scenes[bp][index][key] === saved.baseline[bp][index][key]) {
              Object.assign(draft[bp][index]!, { [key]: baseline[bp][index]![key] })
            }
          }
        }
      }
      status.value = 'Локальный черновик восстановлен'
    }
  } catch { status.value = 'Локальное сохранение недоступно; используйте JSON' }
  stopSaving = watch(draft, () => {
    try { localStorage.setItem(storageKey, JSON.stringify({ version: 1, scenes: draft, baseline })) }
    catch { status.value = 'Локальное сохранение недоступно; используйте JSON' }
  }, { deep: true })
  window.addEventListener('resize', sync)
})
onUnmounted(() => { stopSaving?.(); window.removeEventListener('resize', sync) })
</script>

<template>
  <div class="hero-sandbox">
    <ChirpPrHero ref="hero" v-bind="props.heroArgs" />
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
        <label class="hero-sandbox__toggle"><input v-model="selected.animationEnabled" type="checkbox" /> Анимация слоя</label>
        <label>Скорость ×<input type="number" step="0.25" min="0.25" max="4" :disabled="!selected.animationEnabled" :value="selected.speed" @input="edit('speed', $event)" /></label>
        <label>Направление вступления
          <select v-model="selected.introDirection" :disabled="!selected.animationEnabled">
            <option :value="-1">Влево</option><option :value="1">Вправо</option>
          </select>
        </label>
      </fieldset>
      <p>X/Y — пиксели указанного reference, не текущего viewport. Скорость 1×: отклонение 300ms, возврат 600ms, пауза 300ms. Выключенный слой неподвижен. Черновик сохраняется в этом браузере.</p>
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
    </section>
  </div>
</template>

<style scoped>
.hero-sandbox { width: 100%; }
.hero-sandbox__editor { margin: var(--space-6) var(--space-4); max-width: 924px; font-family: var(--text-font-sans); font-size: var(--text-size-base); color: var(--text-default); }
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
