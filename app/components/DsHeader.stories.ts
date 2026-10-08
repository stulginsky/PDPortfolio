import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { expect, userEvent, within } from 'storybook/test'
import DsHeader from './DsHeader.vue'
import site from '../../content/site.json'

const meta = {
  title: 'Components/Header',
  component: DsHeader,
  tags: ['autodocs'],
  args: { name: site.name, description: site.role + ' ' + site.experience, email: site.email, phone: site.phone, telegramLabel: site.telegramLabel },
  argTypes: {
    name: { control: 'text', description: 'Имя; heading xl / 2xl.' },
    description: { control: 'text', description: 'Полное описание, переносится без truncate.' },
    email: { control: 'text' },
    phone: { control: 'text' },
    telegramLabel: { control: 'text' },
    telegramUrl: { control: 'text' },
  },
  parameters: { layout: 'fullscreen', docs: { description: { component: "[Header / Figma 1021:5460](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=1021-5460)\n\n<details>\n<summary>Техническое описание</summary>\n\n[Header / Figma 1021:5460](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=1021-5460).\nAvatar-Lg, имя, описание, контакты. Не содержит навигацию и фильтры. Show Filters и скрытый legacy Tabs удалены по решению пользователя 2026-10-04.\n\n| Breakpoint | Reference | Отступы |\n|---|---|---|\n| base <768px | 288×385 | top 24, bottom 32; avatar gap 12; copy gap 8 |\n| min-768 768–1919px | 768×298 | top 24, bottom 32; avatar gap 8; copy gap 12 |\n| min-1920 ≥1920px | 1376×382 | top 64, bottom 48; avatar gap 16; copy gap 12 |\n\nШирину предоставляет родитель; максимум 1376px. Высота следует содержимому. Контакты в base: email отдельной строкой, телефон и TG ниже. Текстовые props не сокращаются. Слотов и событий нет. Default content из сгенерированного site.json.\n\n</details>" } } },
} satisfies Meta<typeof DsHeader>
export default meta
type Story = StoryObj<typeof meta>

export const Sandbox: Story = {
  render: args => ({
    components: { DsHeader },
    setup() {
      const breakpoint = ref('base')
      const width = () => breakpoint.value === 'base' ? 288 : breakpoint.value === 'min-768' ? 768 : 1376
      return { args, breakpoint, width }
    },
    template: `
      <div style="overflow:auto;">
        <div style="display:flex;gap:8px;padding:16px;">
          <button type="button" @click="breakpoint = 'base'">Base</button>
          <button type="button" @click="breakpoint = 'min-768'">min-768</button>
          <button type="button" @click="breakpoint = 'min-1920'">min-1920</button>
        </div>
        <div :style="{ width: width() + 'px', marginInline: 'auto' }">
          <DsHeader v-bind="args" :data-storybook-breakpoint="breakpoint" />
        </div>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement)
    const header = canvasElement.querySelector('header')!
    await expect(c.getByRole('heading', { level: 1 })).toHaveTextContent(site.name)
    await expect(c.getByText(site.email)).toBeVisible()
    await expect(c.getByRole('link', { name: site.email })).toHaveAttribute('href', `mailto:${site.email}`)
    await expect(c.getByRole('link', { name: site.email })).toHaveAttribute('target', '_blank')
    await expect(c.getByRole('link', { name: site.email })).toHaveAttribute('rel', 'noopener noreferrer')
    await expect(c.getByRole('link', { name: site.phone })).toHaveAttribute('href', 'tel:+79258493933')
    await expect(c.getByRole('link', { name: site.telegramLabel })).toHaveAttribute('href', site.telegramUrl)
    await expect(c.getByRole('link', { name: site.telegramLabel })).toHaveAttribute('target', '_blank')
    await expect(header).toHaveAttribute('data-storybook-breakpoint', 'base')
    for (const bp of ['min-768', 'min-1920']) {
      await userEvent.click(c.getByRole('button', { name: bp, exact: true }))
      await expect(header).toHaveAttribute('data-storybook-breakpoint', bp)
    }
    await userEvent.click(c.getByRole('button', { name: 'Base', exact: true }))
  },
}
