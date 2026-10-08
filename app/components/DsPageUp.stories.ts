import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent } from 'storybook/test'
import { ref } from 'vue'
import DsPageUp from './DsPageUp.vue'

const meta = {
  title: 'Components/PageUp',
  component: DsPageUp,
  tags: ['autodocs'],
  argTypes: {
    click: { action: 'click' },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: "[PageUp 1094:6509](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=1094-6509)\n\n<details>\n<summary>Техническое описание</summary>\n\nИсточник: Figma component [PageUp 1094:6509](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=1094-6509).\n\nКомпонент фиксирует оболочку 98×98 в правом нижнем углу viewport и композиционно использует `DsBtnNav` с `Direction=Up`. У него нет props состояния: родитель условно монтирует PageUp из того же источника видимости компактной шапки, что и Avatar-Sm, и передаёт один обработчик прокрутки через `@click`.\n\n</details>",
      },
    },
  },
} satisfies Meta<typeof DsPageUp>

export default meta
type Story = StoryObj<typeof meta>

const renderInViewport = () => ({
  components: { DsPageUp },
  template: `
    <div style="min-height: 240px">
      <DsPageUp />
    </div>
  `,
})

export const Default: Story = { render: renderInViewport }

export const Sandbox: Story = {
  render: () => ({
    components: { DsPageUp },
    setup() {
      const activations = ref(0)
      const scrollToPageStart = () => {
        activations.value += 1
      }
      return { activations, scrollToPageStart }
    },
    template: `
      <div style="min-height: 240px">
        <p style="max-width: 460px; margin: 0; color: var(--text-secondary)">
          Focus — Tab; Hover и ActivePressed — наведением и удержанием указателя; действие — Enter или Space.
        </p>
        <DsPageUp @click="scrollToPageStart" />
        <output role="status" aria-live="polite">
          Срабатываний: {{ activations }}
        </output>
      </div>
    `,
  }),
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: 'К началу страницы' })
    const output = canvas.getByRole('status')

    await expect(button).toBeVisible()
    await expect(output).toHaveTextContent('Срабатываний: 0')
    await userEvent.tab()
    await expect(button).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await expect(output).toHaveTextContent('Срабатываний: 1')
    await userEvent.keyboard(' ')
    await expect(output).toHaveTextContent('Срабатываний: 2')
  },
}
