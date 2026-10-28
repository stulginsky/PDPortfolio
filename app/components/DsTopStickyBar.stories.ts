import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within, waitFor } from 'storybook/test'
import DsTopStickyBar from './DsTopStickyBar.vue'

const meta = {
  title: 'Components/TopStickyBar', component: DsTopStickyBar, tags: ['autodocs'],
  args: { text: 'От контекста к основанию для действия', zoom: 100, controlsOnly: false },
  argTypes: { controlsOnly: { control: 'boolean', description: 'Figma ControlsOnly: hide title and gradient; raised controls in one row.' } },
  parameters: { layout: 'fullscreen', docs: { description: { component: "[Figma 1019:11604](https://www.figma.com/design/TPjPitung1VP3oQg42f56O/PDPortfolio-DS?node-id=1019-11604)\n\n<details>\n<summary>Техническое описание</summary>\n\nFigma 1019:11604. controlsOnly=false сохраняет полную шапку; controlsOnly=true скрывает заголовок и градиент, выставляет Raised для обеих кнопок и располагает их в одну строку (base по центру, web Hug справа). Непрозрачность градиентной заливки полного режима 45%, контент не затрагивается. Base <768: FullscreenMenu/Mob, полный заголовок, Hug. Min-768: DropdownSelect-web, высота 100px. Presets Zoom 50% / Zoom 100% / Zoom 150% / Fit to width / Fit to height / Fit to screen. fitMode (width / height / screen / null) управляет подписью Fit, иначе Zoom N%. viewerReady запускает mobile tooltip: общий Tooltip fade 300ms, 5s показ, 300ms скрытие; reduced motion без анимации. Web tooltip на hover/focus. Меню и close запускают общее плавное скрытие подсказки. Шапка сообщает zoom/fit/close; сама не масштабирует медиа. Reload viewer имитирует загрузку.\n\n</details>" } } },
} satisfies Meta<typeof DsTopStickyBar>
export default meta
type Story = StoryObj<typeof meta>
export const Sandbox: Story = {
  render: args => ({
    components: { DsTopStickyBar },
    setup() {
      const mode = ref<string | undefined>(), zoom = ref(args.zoom), long = ref(false), closed = ref(0), fits = ref(0), fit = ref<'width' | 'height' | 'screen' | null>(null), ready = ref(true)
      const controlsOnly = ref(args.controlsOnly)
      watch(() => args.controlsOnly, value => { controlsOnly.value = value })
      const viewportWidth = ref(typeof window === 'undefined' ? 320 : window.innerWidth)
      const isWeb = computed(() => mode.value ? mode.value === 'min-768' : viewportWidth.value >= 768)
      function resetScale() { zoom.value = 100; fit.value = isWeb.value ? 'width' : null }
      watch(isWeb, resetScale, { immediate: true })
      const restoreAuto = () => { viewportWidth.value = window.innerWidth; mode.value = undefined }
      onMounted(() => window.addEventListener('resize', restoreAuto))
      onBeforeUnmount(() => window.removeEventListener('resize', restoreAuto))
      function chooseZoom(value: number) { zoom.value = value; fit.value = null }
      function chooseFit(value: 'width' | 'height' | 'screen') { fits.value++; fit.value = value }
      async function reload() { ready.value = false; resetScale(); await nextTick(); ready.value = true }
      return { args, mode, zoom, long, controlsOnly, closed, fits, fit, ready, chooseZoom, chooseFit, reload }
    },
    template: `<div style="min-height:500px;background:var(--surface-subtle)">
      <div style="padding:16px;display:flex;gap:8px;flex-wrap:wrap">
        <button @click="mode=undefined">Auto</button><button @click="mode='base'">Base</button><button @click="mode='min-768'">min-768</button>
        <label><input type="checkbox" v-model="long"> Long title</label>
        <label><input type="checkbox" v-model="controlsOnly"> ControlsOnly</label>
        <label>Zoom <input type="number" v-model="zoom" @input="fit=null" min="1" max="400" style="width:60px"></label>
        <button @click="reload">Reload viewer</button>
      </div>
      <DsTopStickyBar :data-storybook-breakpoint="mode" :text="long ? Array(5).fill(args.text).join(' ') : args.text"
        :zoom="zoom" :fit-mode="fit" :viewer-ready="ready" :controls-only="controlsOnly" @update:zoom="chooseZoom" @fit="chooseFit" @close="closed++; ready=false" />
      <p role="status" style="padding:16px">Zoom: {{zoom}} · Fit: {{fits}} · Close: {{closed}}</p>
    </div>`,
  }),
  play: async ({ canvasElement }) => {
    if (new URLSearchParams(window.location.search).get('embed') === 'true') return
    const c = within(canvasElement)
    const controlsToggle = c.getByRole('checkbox', { name: 'ControlsOnly' }) as HTMLInputElement
    const initialControlsOnly = controlsToggle.checked
    if (initialControlsOnly) await userEvent.click(controlsToggle)
    await userEvent.click(c.getByRole('button', { name: 'Base', exact: true }))
    await userEvent.click(c.getByRole('button', { name: 'Reload viewer' }))
    await waitFor(() => expect(c.getByRole('tooltip')).toHaveTextContent('Разведите или сведите'))
    await userEvent.click(c.getByRole('button', { name: 'Выбрать масштаб' }))
    await waitFor(() => expect(c.queryByRole('tooltip')).not.toBeInTheDocument())
    await userEvent.click(within(document.body).getByRole('button', { name: 'Zoom 50%', exact: true }))
    await expect(c.getByRole('status')).toHaveTextContent('Zoom: 50')
    await userEvent.click(c.getByRole('checkbox', { name: 'Long title' }))
    await expect(canvasElement.querySelector('header')!.getBoundingClientRect().height).toBeGreaterThan(144)
    await userEvent.click(c.getByRole('checkbox', { name: 'Long title' }))
    await userEvent.click(c.getByRole('button', { name: 'min-768', exact: true }))
    await waitFor(() => expect(c.getByRole('button', { name: 'Fit to width', exact: true })).toBeInTheDocument())
    await userEvent.click(c.getByRole('button', { name: 'Fit to width', exact: true }))
    await userEvent.click(within(canvasElement.querySelector('.ds-dropdown-select__list')! as HTMLElement).getByRole('button', { name: 'Fit to screen', exact: true }))
    await expect(c.getByRole('status')).toHaveTextContent('Fit: 1')
    await expect(c.getByRole('button', { name: 'Fit to screen', exact: true })).toBeInTheDocument()
    await userEvent.click(c.getByRole('button', { name: 'Закрыть просмотрщик' }))
    await expect(c.getByRole('status')).toHaveTextContent('Close: 1')
    await userEvent.click(c.getByRole('button', { name: 'Base', exact: true }))
    await userEvent.click(c.getByRole('button', { name: 'Reload viewer' }))
    await expect(c.getByRole('status')).toHaveTextContent('Zoom: 100')
    await expect(canvasElement.querySelector('.ds-fs-menu__trigger')).toHaveTextContent('Zoom 100%')
    await userEvent.click(controlsToggle)
    await expect(c.queryByRole('heading')).not.toBeInTheDocument()
    const header = canvasElement.querySelector('header')!
    expect(getComputedStyle(header).backgroundImage).toBe('none')
    expect(header.getBoundingClientRect().height).toBe(82)
    expect(getComputedStyle(header.querySelector('.ds-btn-cross')!).backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
    await userEvent.click(c.getByRole('button', { name: 'Выбрать масштаб' }))
    await userEvent.click(within(document.body).getByRole('button', { name: 'Zoom 150%', exact: true }))
    await expect(c.getByRole('status')).toHaveTextContent('Zoom: 150')
    await userEvent.click(c.getByRole('button', { name: 'min-768', exact: true }))
    await waitFor(() => expect(header.getBoundingClientRect().height).toBe(100))
    await expect(c.queryByRole('heading')).not.toBeInTheDocument()
    expect(getComputedStyle(header).backgroundImage).toBe('none')
    await userEvent.click(c.getByRole('button', { name: 'Fit to width', exact: true }))
    await userEvent.click(within(canvasElement.querySelector('.ds-dropdown-select__list')! as HTMLElement).getByRole('button', { name: 'Zoom 100%', exact: true }))
    await expect(c.getByRole('status')).toHaveTextContent('Zoom: 100')
    await userEvent.click(c.getByRole('button', { name: 'Закрыть просмотрщик' }))
    await expect(c.getByRole('status')).toHaveTextContent('Close: 2')
    if (!initialControlsOnly) await userEvent.click(controlsToggle)
    await userEvent.click(c.getByRole('button', { name: 'Auto', exact: true }))
    await waitFor(() => expect(canvasElement.querySelector('header')!.classList.contains('ds-top-sticky-bar--web')).toBe(window.innerWidth >= 768))
  },
}

export const ControlsOnly: Story = {
  ...Sandbox,
  args: { controlsOnly: true },
}
