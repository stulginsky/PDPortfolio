import { watch as watchStoryArg } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import DsImgTitleToolbar from './DsImgTitleToolbar.vue'

const meta = {
  title: 'Components/ImgTitle/ImgTitleToolbar',
  component: DsImgTitleToolbar,
  tags: ['autodocs', '!dev'],
  args: {
    title: 'Value',
    showZoom: true,
    modelValue: null,
    onZoom: fn(),
    onSelect: fn(),
  },
  argTypes: {
  "title": {
    "description": "Figma TEXT `Title#1016:1`.",
    "control": {
      "type": "text"
    }
  },
  "showZoom": {
    "description": "Figma BOOLEAN `Show zoom#1016:11`.",
    "control": {
      "type": "boolean"
    }
  },
  "modelValue": {
    "description": "Single-selected internal document. `null` retains the introductory FullscreenMenu trigger.",
    "control": false
  }
},
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: "Панель заголовка изображения с выбором материала и дополнительными действиями.\n\n<a href=\"https://www.figma.com/design/TPjPitung1VP3oQg42f56O/PDPortfolio-DS?node-id=1388-4795\" target=\"_blank\" rel=\"noopener noreferrer\">Figma</a>",
      },
    },
  },
} satisfies Meta<typeof DsImgTitleToolbar>

export default meta
type Story = StoryObj<typeof meta>

export const AllVariants: Story = {
  render: (args) => ({
    components: { DsImgTitleToolbar },
    setup() {
      const value = ref<'overview' | 'foundation' | 'tokens' | null>(null)
      return { args, value }
    },
    template: `
      <div style="display:grid;align-content:start;gap:24px;min-height:480px;box-sizing:border-box;padding:16px;">
        <div style="width:288px"><DsImgTitleToolbar v-bind="args" v-model="value" data-storybook-breakpoint="base" /></div>
        <div style="width:924px"><DsImgTitleToolbar v-bind="args" v-model="value" data-storybook-breakpoint="min-768" /></div>
        <div style="width:457px"><DsImgTitleToolbar v-bind="args" v-model="value" data-storybook-breakpoint="min-768" /></div>
      </div>
    `,
  }),
}

export const Sandbox: Story = {
  tags: ['dev'],
  render: (args) => ({
    components: { DsImgTitleToolbar },
    setup() {


      const value = ref<'overview' | 'foundation' | 'tokens' | null>(null)
      const zooms = ref(0)
      const showZoom = ref(args.showZoom)
watchStoryArg(() => args.showZoom, value => { showZoom.value = value })
      function zoom(event: MouseEvent) {
        zooms.value += 1
        args.onZoom?.(event)
      }
      function select(next: 'overview' | 'foundation' | 'tokens') {
        args.onSelect?.(next)
      }
      return { args, value, zooms, showZoom, zoom, select }
    },
    template: `
      <div style="display:grid;align-content:start;gap:24px;min-height:480px;box-sizing:border-box;padding:16px;">
        <div style="display:flex;flex-wrap:wrap;gap:8px">



          <label><input type="checkbox" v-model="showZoom" /> MagnifyingGlass</label>
        </div>
        <div style="width:100%;min-width:0">
          <DsImgTitleToolbar
            v-bind="args"
            v-model="value"
            :show-zoom="showZoom"

            @zoom="zoom"
            @select="select"
          />
        </div>
        <output role="status" aria-live="polite">Selected: {{ value ?? 'intro' }} · Zooms: {{ zooms }}</output>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const toolbar = canvas.getByRole('region', { name: 'Навигация по материалам изображения' })

    await waitFor(() => expect(toolbar).not.toHaveAttribute('data-storybook-breakpoint'))
    if (!canvas.queryByRole('button', { name: 'Tokens.json', exact: true })) {
      const trigger = toolbar.querySelector('button:not([aria-label="Увеличить изображение"])') as HTMLButtonElement
      await userEvent.click(trigger)
    }
    await userEvent.click(within(document.body).getByRole('button', { name: 'Tokens.json', exact: true }))
    await expect(canvas.getByRole('status')).toHaveTextContent('Selected: tokens')
    await expect(meta.args.onSelect).toHaveBeenCalledWith('tokens')
    await userEvent.click(canvas.getByRole('button', { name: /Увеличить изображение/ }))
    await expect(canvas.getByRole('status')).toHaveTextContent('Zooms: 1')
    await expect(meta.args.onZoom).toHaveBeenCalled()
    await userEvent.click(canvas.getByRole('checkbox', { name: 'MagnifyingGlass' }))
    await expect(canvas.queryByRole('button', { name: /Увеличить изображение/ })).toBeNull()
  },
}