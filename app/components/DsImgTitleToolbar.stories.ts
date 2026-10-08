import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import DsImgTitleToolbar from './DsImgTitleToolbar.vue'

const meta = {
  title: 'Components/ImgTitle/ImgTitleToolbar',
  component: DsImgTitleToolbar,
  tags: ['autodocs'],
  args: {
    title: 'Value',
    showZoom: true,
    modelValue: null,
    onZoom: fn(),
    onSelect: fn(),
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Figma TEXT `Title#1016:1`.',
    },
    showZoom: {
      control: 'boolean',
      description: 'Figma BOOLEAN `Show zoom#1016:11`.',
    },
    modelValue: {
      control: false,
      description: 'Single-selected internal document. `null` retains the introductory FullscreenMenu trigger.',
    },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: "[ImgTitleToolbar — Figma 1388:4795](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=1388-4795)\n\n<details>\n<summary>Техническое описание</summary>\n\n[ImgTitleToolbar — Figma 1388:4795](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=1388-4795).\n\nНавигационный toolbar использует DsTab, мобильный DsFullscreenMenuMob, web DsDropdownSelect и DsButtonIcon.\n\n| Figma variant | Production rule |\n| --- | --- |\n| base + Menu | 320–767px: title + текущий trigger + zoom в одной строке, если помещаются (Hug); иначе две строки на всю доступную ширину (Fill). Меню остаётся FullscreenMenu/Mob. |\n| min-768 + Inline | Ряд tab, пока он помещается в доступную ширину до 924px. |\n| min-768 + Menu | Автоматический overflow fallback: web dropdown с DropdownListSelector Type=Filter. |\n\nNavigation не является prop: режим выбирается измерением реального ряда. Figma открывается в новом окне и не меняет modelValue.\nПри отключённой лупе заголовок центрируется. Скрытые измерительные ряды изолированы и не создают горизонтальный scroll.\n\n</details>",
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
  render: (args) => ({
    components: { DsImgTitleToolbar },
    setup() {
      const breakpoint = ref<'base' | 'min-768'>('base')
      const width = ref(288)
      const value = ref<'overview' | 'foundation' | 'tokens' | null>(null)
      const zooms = ref(0)
      const showZoom = ref(args.showZoom)
      function base() {
        breakpoint.value = 'base'
        width.value = 288
      }
      function inline() {
        breakpoint.value = 'min-768'
        width.value = 924
      }
      function overflow() {
        breakpoint.value = 'min-768'
        width.value = 457
      }
      function zoom(event: MouseEvent) {
        zooms.value += 1
        args.onZoom?.(event)
      }
      function select(next: 'overview' | 'foundation' | 'tokens') {
        args.onSelect?.(next)
      }
      return { args, breakpoint, width, value, zooms, showZoom, base, inline, overflow, zoom, select }
    },
    template: `
      <div style="display:grid;align-content:start;gap:24px;min-height:480px;box-sizing:border-box;padding:16px;">
        <div style="display:flex;flex-wrap:wrap;gap:8px">
          <button type="button" @click="base">Base</button>
          <button type="button" @click="inline">min-768</button>
          <button type="button" @click="overflow">Overflow</button>
          <label><input type="checkbox" v-model="showZoom" /> MagnifyingGlass</label>
        </div>
        <div :style="{ width: width + 'px' }">
          <DsImgTitleToolbar
            v-bind="args"
            v-model="value"
            :show-zoom="showZoom"
            :data-storybook-breakpoint="breakpoint"
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

    await userEvent.click(canvas.getByRole('button', { name: 'Base', exact: true }))
    await waitFor(() => expect(toolbar).toHaveClass('ds-img-title-toolbar--menu'))
    const mobileTrigger = canvas.getByRole('button', { name: 'Выбрать материал' })
    await expect(mobileTrigger).toHaveTextContent('Overview · Docs · Figma')
    await userEvent.click(mobileTrigger)
    const overlay = within(document.body)
    await userEvent.click(overlay.getByRole('button', { name: 'Foundation.md' }))
    await expect(canvas.getByRole('status')).toHaveTextContent('Selected: foundation')
    await expect(overlay.queryByRole('dialog')).toBeNull()

    await userEvent.click(canvas.getByRole('button', { name: 'Выбрать материал' }))
    const figma = overlay.getByRole('link', { name: 'Figma' })
    await expect(figma).toHaveAttribute('target', '_blank')
    await userEvent.click(figma)
    await expect(overlay.queryByRole('dialog')).toBeNull()
    await expect(canvas.getByRole('status')).toHaveTextContent('Selected: foundation')

    await userEvent.click(canvas.getByRole('button', { name: 'min-768', exact: true }))
    await waitFor(() => expect(toolbar).toHaveClass('ds-img-title-toolbar--inline'))
    await userEvent.click(canvas.getByRole('button', { name: 'Tokens.json' }))
    await expect(canvas.getByRole('status')).toHaveTextContent('Selected: tokens')

    await userEvent.click(canvas.getByRole('button', { name: 'Overflow', exact: true }))
    await waitFor(() => expect(toolbar).toHaveClass('ds-img-title-toolbar--menu'))
    const webTrigger = canvas.getByRole('button', { name: 'Tokens.json', exact: true })
    await userEvent.click(webTrigger)
    await expect(canvas.getByRole('list', { name: 'Select options' })).toHaveClass('ds-dropdown-list-selector--filter')
    await expect(overlay.queryByRole('dialog')).toBeNull()
    await userEvent.click(canvas.getByRole('button', { name: 'Overview', exact: true }))
    await expect(canvas.getByRole('status')).toHaveTextContent('Selected: overview')

    await userEvent.click(canvas.getByRole('button', { name: /Увеличить изображение/ }))
    await expect(canvas.getByRole('status')).toHaveTextContent('Zooms: 1')
    const widthWithZoom = toolbar.getBoundingClientRect().width
    await userEvent.click(canvas.getByRole('checkbox', { name: 'MagnifyingGlass' }))
    await expect(canvas.queryByRole('button', { name: /Увеличить изображение/ })).toBeNull()
    await waitFor(() => expect(toolbar.getBoundingClientRect().width).toBeLessThan(widthWithZoom))
    await userEvent.click(canvas.getByRole('button', { name: 'Base', exact: true }))
    await waitFor(() => expect(toolbar).toHaveClass('ds-img-title-toolbar--menu'))
    const baseHeight = toolbar.getBoundingClientRect().height
    await userEvent.click(canvas.getByRole('checkbox', { name: 'MagnifyingGlass' }))
    await expect(toolbar.getBoundingClientRect().height).toBe(baseHeight)
  },
}
