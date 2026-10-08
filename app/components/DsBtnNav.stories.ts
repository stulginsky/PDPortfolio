import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect } from 'storybook/test'
import { ref } from 'vue'
import DsBtnNav from './DsBtnNav.vue'

const meta = {
  title: 'Components/BtnNav',
  component: DsBtnNav,
  tags: ['autodocs'],
  args: {
    direction: 'Left',
    tag: 'button',
    ariaLabel: 'Back',
  },
  argTypes: {
    direction: {
      control: 'inline-radio',
      options: ['Left', 'Right', 'Up'],
      description: 'Canonical Figma Direction property.',
    },
    tag: {
      control: 'inline-radio',
      options: ['button', 'a'],
      description: 'Semantic native element.',
    },
    href: { control: 'text' },
    ariaLabel: { control: 'text' },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: "[BtnNav 281:506](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=281-506)\n\n<details>\n<summary>Техническое описание</summary>\n\nFigma [BtnNav 281:506](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=281-506). It composes `DsButtonIcon` with `raised` and the original `ArrowNavLeft`, `ArrowNavRight`, or `ArrowNavUp` Foundation asset. Hover and ActivePressed are native pointer states.\n\n</details>",
      },
    },
  },
} satisfies Meta<typeof DsBtnNav>

export default meta
type Story = StoryObj<typeof meta>

export const Left: Story = {}
export const Right: Story = { args: { direction: 'Right', ariaLabel: 'Next' } }
export const Up: Story = { args: { direction: 'Up', ariaLabel: 'Up' } }

export const AllVariants: Story = {
  render: () => ({
    components: { DsBtnNav },
    template: `
      <div style="display:flex;gap:16px;padding:24px;background:var(--surface-subtle);align-items:center;">
        <DsBtnNav direction="Left" aria-label="Back" />
        <DsBtnNav direction="Right" aria-label="Next" />
        <DsBtnNav direction="Up" aria-label="Up" />
      </div>
    `,
  }),
  parameters: { layout: 'fullscreen' },
}

export const Sandbox: Story = {
  render: args => ({
    components: { DsBtnNav },
    setup() {
      const clicks = ref(0)
      return { args, clicks }
    },
    template: `
      <div style="display:grid;justify-items:center;gap:16px;padding:32px;">
        <DsBtnNav v-bind="args" @click="clicks += 1" />
        <output role="status" aria-live="polite">Clicks: {{ clicks }}</output>
      </div>
    `,
  }),
  play: async ({ canvas, userEvent }) => {
    const button = canvas.getByRole('button', { name: 'Back' })
    const output = canvas.getByRole('status')

    await expect(button).toBeVisible()
    await expect(output).toHaveTextContent('Clicks: 0')
    await userEvent.click(button)
    await expect(output).toHaveTextContent('Clicks: 1')
  },
}
