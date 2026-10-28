import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { expect, fn, userEvent, within } from 'storybook/test'
import DsImgTitle from './DsImgTitle.vue'

const title = 'Value'

const meta = {
  title: 'Components/ImgTitle/ImgTitle',
  component: DsImgTitle,
  tags: ['autodocs'],
  args: {
    btnOnly: false,
    title,
    onZoom: fn(),
  },
  argTypes: {
    btnOnly: { control: 'boolean', description: 'Figma Btn only: круглая лупа без видимого заголовка; 128×128 px во всех брейкпоинтах.' },
    title: { control: 'text', description: 'Figma TEXT Title. Текст переносится при переполнении в base и min-768.' },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: "[ImgTitle — Figma 1016:5882](https://www.figma.com/design/TPjPitung1VP3oQg42f56O/PDPortfolio-DS?node-id=1016-5882)\n\n<details>\n<summary>Техническое описание</summary>\n\n[ImgTitle — Figma 1016:5882](https://www.figma.com/design/TPjPitung1VP3oQg42f56O/PDPortfolio-DS?node-id=1016-5882).\n\nBtn only=On: круглая лупа 128×128px, внутренний круг 66×66px, действие 50×50px; видимый заголовок скрыт, текст остаётся в доступном имени действия. Btn only=Off сохраняет панель заголовка и действие увеличения. Дополнительный toolbar будет отдельным компонентом. Лупа обязательна.\n\n| Breakpoint | Типографика заголовка | Геометрия |\n| --- | --- | --- |\n| base (<768px) | Heading/sm — 18px / 145% | Fill; reference 288×74px; padding 12/12/12/24; перенос при переполнении |\n| min-768 | Heading/md — 22px / 130% | Fill при viewport 768px, Hug выше; cap 924px; padding 12/12/12/24; перенос при переполнении |\n\nСобытие zoom — запрос на открытие viewer. Изображение само по себе не является триггером.\n\n</details>",
      },
    },
  },
} satisfies Meta<typeof DsImgTitle>

export default meta
type Story = StoryObj<typeof meta>

export const ButtonOnly: Story = {
  args: { btnOnly: true },
  render: args => ({ components: { DsImgTitle }, setup: () => ({ args }), template: '<div style="padding:24px"><DsImgTitle v-bind="args" /></div>' }),
  play: async ({ canvas, args }) => {
    const button = canvas.getByRole('button', { name: /Увеличить изображение/ })
    const root = button.closest('.ds-img-title')!
    await expect(root.getBoundingClientRect().width).toBe(128)
    await expect(root.getBoundingClientRect().height).toBe(128)
    await expect(canvas.queryByRole('heading')).not.toBeInTheDocument()
    await userEvent.click(button)
    await expect(args.onZoom).toHaveBeenCalledTimes(1)
  },
}

export const Sandbox: Story = {
  render: (args) => ({
    components: { DsImgTitle },
    setup() {
      const breakpoint = ref<'base' | 'min-768'>('base')
      const width = ref(288)
      const zooms = ref(0)
      const titleText = ref(args.title)
      function setBreakpoint(value: 'base' | 'min-768', nextWidth: number) {
        breakpoint.value = value
        width.value = nextWidth
      }
      function zoom(event: MouseEvent) {
        zooms.value++
        args.onZoom?.(event)
      }
      function toggleLongTitle() {
        if (titleText.value === args.title) {
          titleText.value = Array.from({ length: 32 }, () => args.title).join(' ')
          width.value = 924
        } else {
          titleText.value = args.title
        }
      }
      return { args, breakpoint, width, zooms, titleText, setBreakpoint, toggleLongTitle, zoom }
    },
    template: `
      <div style="display:grid;gap:24px;padding:16px;overflow:auto;">
        <div style="display:flex;flex-wrap:wrap;gap:8px;">
          <button type="button" @click="setBreakpoint('base', 288)">Base</button>
          <button type="button" @click="setBreakpoint('min-768', 768)">min-768</button>
          <button type="button" @click="toggleLongTitle">{{ titleText === args.title ? 'Long title' : 'Restore title' }}</button>
        </div>
        <div :style="{ width: width + 'px' }">
          <DsImgTitle
            :title="titleText"
            :data-storybook-breakpoint="breakpoint"
            @zoom="zoom"
          />
        </div>
        <p role="status">Увеличений: {{ zooms }} · {{ breakpoint }}</p>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const component = canvas.getByRole('region', { name: 'Заголовок изображения' })
    const zoomButton = canvas.getByRole('button', { name: /Увеличить изображение/ })
    await expect(component).toHaveAttribute('data-storybook-breakpoint', 'base')
    await expect(Math.round(component.getBoundingClientRect().height)).toBe(74)
    await expect(zoomButton).toHaveStyle({ color: 'rgb(119, 126, 141)' })
    await userEvent.hover(zoomButton)
    await expect(zoomButton).toHaveStyle({ color: 'rgb(119, 126, 141)' })
    await expect(zoomButton).toHaveStyle({ backgroundColor: 'rgba(0, 0, 0, 0)' })
    await userEvent.click(zoomButton)
    await expect(canvas.getByRole('status')).toHaveTextContent('Увеличений: 1')
    await userEvent.click(canvas.getByRole('button', { name: 'min-768', exact: true }))
    await expect(component).toHaveAttribute('data-storybook-breakpoint', 'min-768')
    await userEvent.click(canvas.getByRole('button', { name: 'Long title', exact: true }))
    await expect(component.getBoundingClientRect().width).toBeLessThanOrEqual(924)
    await expect(component.getBoundingClientRect().height).toBeGreaterThan(74)
    await userEvent.click(canvas.getByRole('button', { name: 'Restore title', exact: true }))
    await userEvent.click(canvas.getByRole('button', { name: 'Base', exact: true }))
    await expect(component).toHaveAttribute('data-storybook-breakpoint', 'base')
  },
}
