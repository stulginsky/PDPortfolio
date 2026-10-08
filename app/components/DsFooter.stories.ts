import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import DsFooter from './DsFooter.vue'

const meta = {
  title: 'Components/Footer',
  component: DsFooter,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: "[1094:6423](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=1094-6423)\n\n<details>\n<summary>Техническое описание</summary>\n\nFooter — DS [1094:6423](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=1094-6423).\n\n| Breakpoint | Layout |\n|---|---|\n| base (<410px) | Centred vertical stack |\n| min-410 (≥410px) | Centred horizontal row |\n\n</details>",
      },
    },
  },
} satisfies Meta<typeof DsFooter>

export default meta
type Story = StoryObj<typeof meta>

export const Sandbox: Story = {
  render: () => ({
    components: { DsFooter },
    setup() {
      const breakpoint = ref<'base' | 'min-410'>('base')
      return { breakpoint }
    },
    template: `
      <div style="display:grid;gap:32px;box-sizing:border-box;width:100%;padding:16px;">
        <div style="display:flex;gap:8px;align-items:center;">
          <button type="button" :aria-pressed="breakpoint === 'base'" @click="breakpoint = 'base'">Base</button>
          <button type="button" :aria-pressed="breakpoint === 'min-410'" @click="breakpoint = 'min-410'">min-410</button>
        </div>
        <DsFooter :data-storybook-breakpoint="breakpoint" />
      </div>
    `,
  }),
}
