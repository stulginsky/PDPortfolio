<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, provide, reactive, ref, watch } from 'vue'
import LIDPortDsHero from './LIDPortDsHero.vue'
import { createLidPortHeroDraft, getLidPortHeroBreakpoint, lidPortHeroBreakpoints, lidPortHeroReferences, lidPortHeroSceneEditorKey, migrateLidPortHeroLayer, validLidPortHeroDraft, type LidPortHeroLayer } from './lidport-ds-hero.scene-context'

const props = defineProps<{ heroArgs: { title: string; role: string; focus: string; panelAppearance?: 'default' | 'on-light' | 'on-dark' } }>()
const storageKey = 'pdportfolio:lidport-ds-hero-scene:v2'
const baseline = createLidPortHeroDraft()
const draft = reactive(createLidPortHeroDraft())
const mode = ref<'Neutral' | 'Interaction'>('Interaction')
const appearance = ref(props.heroArgs.panelAppearance ?? 'default')
const breakpoint = ref(getLidPortHeroBreakpoint(320))
const layerIndex = ref(0)
const hero = ref<InstanceType<typeof LIDPortDsHero>>()
const status = ref('')
const showExport = ref(false)
const motionModes = ['Neutral', 'Interaction'] as const
let stopSaving: (() => void) | undefined

provide(lidPortHeroSceneEditorKey, { draft, mode })

const selected = computed(() => draft[breakpoint.value][layerIndex.value]!)
const motionLocked = computed(() => selected.value.name === 'Role-Focus')
const payload = computed(() => JSON.stringify({
  version: 2,
  component: 'LIDPortDsHero',
  coordinateSpace: 'Geometry: Figma reference pixels; motion offsets: physical CSS pixels; viscosity/returnSpeed: shared hero-motion time scale',
  preview: { breakpoint: breakpoint.value, mode: mode.value },
  references: Object.fromEntries(lidPortHeroBreakpoints.map(value => [value, { width: lidPortHeroReferences[value].width, height: lidPortHeroReferences[value].height }])),
  scenes: draft,
}, null, 2))

function syncBreakpoint() {
  breakpoint.value = getLidPortHeroBreakpoint(window.innerWidth)
  if (layerIndex.value >= draft[breakpoint.value].length) layerIndex.value = 0
}

function edit(field: 'x' | 'y' | 'viscosity' | 'returnSpeed' | 'amplitude' | 'baseOffset', event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.value.trim()) return
  const value = Number(input.value)
  if (!Number.isFinite(value) || (['viscosity', 'returnSpeed'].includes(field) && (value < .1 || value > 20)) || (field === 'amplitude' && (value < 0 || value > 4)) || (field === 'baseOffset' && value < 0)) return
  selected.value[field] = value
  status.value = 'Черновик изменён'
}

function resetLayer() {
  draft[breakpoint.value][layerIndex.value] = { ...baseline[breakpoint.value][layerIndex.value]! }
  hero.value?.resetMotion()
  status.value = 'Выбранный слой сброшен'
}
function resetProfile() {
  draft[breakpoint.value] = baseline[breakpoint.value].map(layer => ({ ...layer }))
  hero.value?.resetMotion()
  status.value = 'Текущий профиль сброшен'
}
function resetAll() {
  for (const value of lidPortHeroBreakpoints) draft[value] = baseline[value].map(layer => ({ ...layer }))
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
  try {
    await navigator.clipboard.writeText(payload.value)
    status.value = 'JSON скопирован'
  } catch {
    status.value = 'Выделите и скопируйте JSON из поля ниже'
  }
}

onMounted(() => {
  syncBreakpoint()
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || 'null')
    if (saved?.version === 2 && validLidPortHeroDraft(saved.scenes)) {
      for (const value of lidPortHeroBreakpoints) draft[value] = saved.scenes[value].map((layer: LidPortHeroLayer, index: number) => migrateLidPortHeroLayer(layer, index))
      status.value = 'Локальный черновик восстановлен'
    }
  } catch {
    status.value = 'Локальное сохранение недоступно; используйте JSON'
  }
  stopSaving = watch(draft, () => {
    try { localStorage.setItem(storageKey, JSON.stringify({ version: 2, scenes: draft })) }
    catch { status.value = 'Локальное сохранение недоступно; используйте JSON' }
  }, { deep: true })
  window.addEventListener('resize', syncBreakpoint)
})
onUnmounted(() => {
  stopSaving?.()
  window.removeEventListener('resize', syncBreakpoint)
})
</script>

<template>
  <div class="hero-sandbox">
    <LIDPortDsHero ref="hero" v-bind="props.heroArgs" :panel-appearance="appearance" />
    <section class="hero-sandbox__editor" aria-label="Редактор слоёв LIDPort hero">
      <label class="hero-sandbox__select">Окружение
        <select v-model="appearance">
          <option value="default">Default · собственная панель</option>
          <option value="on-light">Overview · светлый фон</option>
          <option value="on-dark">Foundation / Tokens · тёмный фон</option>
        </select>
      </label>
      <p>Breakpoint: <output data-testid="hero-breakpoint">{{ breakpoint }}</output> · reference {{ lidPortHeroReferences[breakpoint].width }}×{{ lidPortHeroReferences[breakpoint].height }}</p>
      <div class="hero-sandbox__actions">
        <button v-for="value in motionModes" :key="value" type="button" :aria-pressed="mode === value" @click="mode = value">{{ value }}</button>
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
        <p v-if="motionLocked">Этот слой неподвижен по контракту; доступны только координаты.</p>
        <label class="hero-sandbox__toggle"><input v-model="selected.animationEnabled" :disabled="motionLocked" type="checkbox" /> Анимация слоя</label>
        <label>Вязкость ×<input type="number" step="0.1" min="0.1" max="20" :disabled="!selected.animationEnabled || motionLocked" :value="selected.viscosity" @input="edit('viscosity', $event)" /></label>
        <label>Скорость возврата ×<input type="number" step="0.1" min="0.1" max="20" :disabled="!selected.animationEnabled || motionLocked" :value="selected.returnSpeed" @input="edit('returnSpeed', $event)" /></label>
        <label>Амплитуда ×<input type="number" step="0.1" min="0" max="4" :disabled="!selected.animationEnabled || motionLocked" :value="selected.amplitude" @input="edit('amplitude', $event)" /></label>
        <label>Базовое смещение, px<input type="number" step="0.1" min="0" :disabled="!selected.animationEnabled || motionLocked" :value="selected.baseOffset" @input="edit('baseOffset', $event)" /></label>
        <label>Движение<select v-model="selected.pointerDirection" :disabled="!selected.animationEnabled || motionLocked"><option :value="1">По pointer</option><option :value="-1">Против pointer</option></select></label>
        <label>Вступление<select v-model="selected.introDirection" :disabled="!selected.animationEnabled || motionLocked"><option :value="-1">Влево</option><option :value="1">Вправо</option></select></label>
      </fieldset>
      <p>X/Y — пиксели Figma reference. Логотип и заголовок имеют независимые координаты и motion-профили. Role-Focus остаётся неподвижным.</p>
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
.hero-sandbox{width:100%}.hero-sandbox__editor{max-width:924px;margin:var(--space-6) auto;padding:0 var(--space-4);font-family:var(--text-font-sans);font-size:var(--text-size-16);color:var(--text-default)}
.hero-sandbox__actions{display:flex;flex-wrap:wrap;gap:var(--space-2);margin-block:var(--space-3)}.hero-sandbox__editor button{min-height:32px}.hero-sandbox__select{display:flex;flex-wrap:wrap;align-items:center;gap:var(--space-2);margin-block:var(--space-3)}
.hero-sandbox__editor fieldset{display:grid;gap:var(--space-3);min-width:0;margin-block:var(--space-3)}.hero-sandbox__editor fieldset label{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:var(--space-2)}.hero-sandbox__editor input[type=number]{box-sizing:border-box;width:140px;max-width:100%}.hero-sandbox__editor select{max-width:100%}.hero-sandbox__editor fieldset .hero-sandbox__toggle{justify-content:flex-start}.hero-sandbox__export{display:flex;flex-direction:column;gap:var(--space-2)}.hero-sandbox__export textarea{box-sizing:border-box;width:100%}
</style>
