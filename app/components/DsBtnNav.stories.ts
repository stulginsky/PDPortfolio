import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect } from 'storybook/test'
import { ref } from 'vue'
import DsBtnNav from './DsBtnNav.vue'

const meta = {
  id: 'components-btnnav',
  title: 'Components/ButtonNav',
  component: DsBtnNav,
  tags: ['autodocs', '!dev'],
  args: {
    direction: 'Left',
    tag: 'button',
    ariaLabel: 'Back',
  },
  argTypes: {
  "direction": {
    "options": [
      "Left",
      "Right",
      "Up"
    ],
    "description": "Canonical Figma Direction property.",
    "control": {
      "type": "inline-radio"
    }
  },
  "tag": {
    "options": [
      "button",
      "a"
    ],
    "description": "Semantic native element.",
    "control": {
      "type": "inline-radio"
    }
  },
  "href": {
    "control": {
      "type": "text"
    }
  },
  "ariaLabel": {
    "control": {
      "type": "text"
    }
  }
},
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: "Кнопка направленной навигации.\n\n<a href=\"https://www.figma.com/design/TPjPitung1VP3oQg42f56O/PDPortfolio-DS?node-id=281-506\" target=\"_blank\" rel=\"noopener noreferrer\">Figma</a>",
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
