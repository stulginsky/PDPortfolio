import { computed as computedStoryModel } from 'vue'
import { useArgs } from 'storybook/preview-api'
import { watch as watchStoryArg } from 'vue'
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within, waitFor } from 'storybook/test'
import DsTopStickyBar from './DsTopStickyBar.vue'

const meta = {
  title: 'Components/TopStickyBar', component: DsTopStickyBar, tags: ['autodocs', '!dev'],
  args: { text: 'От контекста к основанию для действия', zoom: 100, controlsOnly: false },
  argTypes: {
  "controlsOnly": {
    "description": "Figma ControlsOnly: hide title and gradient; raised controls in one row.",
    "control": {
      "type": "boolean"
    }
  }
},
  parameters: { layout: 'fullscreen', docs: { description: { component: "Панель полноэкранного просмотрщика с заголовком, масштабом и действием закрытия.\n\n<a href=\"https://www.figma.com/design/TPjPitung1VP3oQg42f56O/PDPortfolio-DS?node-id=1019-11604\" target=\"_blank\" rel=\"noopener noreferrer\">Figma</a>" } } },
} satisfies Meta<typeof DsTopStickyBar>
export default meta
type Story = StoryObj<typeof meta>
export const Preview: Story = {
  args: { viewerReady: true },
  render: args => {
    const [, updateArgs] = useArgs()
    return {
      components: { DsTopStickyBar },
      setup() {
        const model = computedStoryModel({ get: () => args.zoom, set: value => updateArgs({ zoom: value }) })
        return { args, model }
      },
      template: '<DsTopStickyBar v-bind="args" v-model:zoom="model" />',
    }
  },
}

export const Sandbox: Story = {
  tags: ['dev'],
  render: args => ({
    components: { DsTopStickyBar },
    setup() {
      const zoom = ref(args.zoom), long = ref(false), closed = ref(0), fits = ref(0), fit = ref<'width' | 'height' | 'screen' | null>(null), ready = ref(true)
watchStoryArg(() => args.zoom, value => { zoom.value = value })
      const controlsOnly = ref(args.controlsOnly)
      watch(() => args.controlsOnly, value => { controlsOnly.value = value })
      const viewportWidth = ref(typeof window === 'undefined' ? 320 : window.innerWidth)
      const isWeb = computed(() => viewportWidth.value >= 768)
      function resetScale() { zoom.value = 100; fit.value = isWeb.value ? 'width' : null }
      watch(isWeb, resetScale, { immediate: true })
      const restoreAuto = () => { viewportWidth.value = window.innerWidth }
      onMounted(() => window.addEventListener('resize', restoreAuto))
      onBeforeUnmount(() => window.removeEventListener('resize', restoreAuto))
      function chooseZoom(value: number) { zoom.value = value; fit.value = null }
      function chooseFit(value: 'width' | 'height' | 'screen') { fits.value++; fit.value = value }
      async function reload() { ready.value = false; resetScale(); await nextTick(); ready.value = true }
      return { args, zoom, long, controlsOnly, closed, fits, fit, ready, chooseZoom, chooseFit, reload }
    },
    template: `<div style="min-height:500px;background:var(--surface-subtle)">
      <div style="padding:16px;display:flex;gap:8px;flex-wrap:wrap">

        <label><input type="checkbox" v-model="long"> Long title</label>
        <label><input type="checkbox" v-model="controlsOnly"> ControlsOnly</label>
        <label>Zoom <input type="number" v-model="zoom" @input="fit=null" min="1" max="400" style="width:60px"></label>
        <button @click="reload">Reload viewer</button>
      </div>
      <DsTopStickyBar :text="long ? Array(5).fill(args.text).join(' ') : args.text"
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
    const web = window.innerWidth >= 768
    const header = canvasElement.querySelector('header')!
    await expect(header).not.toHaveAttribute('data-storybook-breakpoint')
    await userEvent.click(c.getByRole('button', { name: 'Reload viewer' }))
    const openScale = () => userEvent.click(web
      ? c.getByRole('button', { name: /^(Fit to (width|height|screen)|Zoom \d+%)$/, exact: true })
      : c.getByRole('button', { name: 'Выбрать масштаб' }))
    await openScale()
    await userEvent.click(within(document.body).getByRole('button', { name: 'Zoom 50%', exact: true }))
    await expect(c.getByRole('status')).toHaveTextContent('Zoom: 50')
    if (web) {
      await openScale()
      await userEvent.click(within(document.body).getByRole('button', { name: 'Fit to screen', exact: true }))
      await expect(c.getByRole('status')).toHaveTextContent('Fit: 1')
    }
    await userEvent.click(c.getByRole('button', { name: 'Закрыть просмотрщик' }))
    await expect(c.getByRole('status')).toHaveTextContent('Close: 1')
    await userEvent.click(c.getByRole('button', { name: 'Reload viewer' }))
    await expect(c.getByRole('status')).toHaveTextContent('Zoom: 100')
    await userEvent.click(controlsToggle)
    await expect(c.queryByRole('heading')).not.toBeInTheDocument()
    expect(getComputedStyle(header).backgroundImage).toBe('none')
    await expect(header.classList.contains('ds-top-sticky-bar--web')).toBe(web)
    if (!initialControlsOnly) await userEvent.click(controlsToggle)
  },
}

export const ControlsOnly: Story = {
  ...Sandbox,
  args: { controlsOnly: true },
}
