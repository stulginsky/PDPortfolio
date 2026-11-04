import type { Meta, StoryObj } from '@storybook/vue3-vite'
import DsFooter from './DsFooter.vue'

const meta = {
  title: 'Components/Footer',
  component: DsFooter,
  tags: ['autodocs', '!dev'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: "Завершающий блок страницы.\n\n### Брейкпоинты\n\n- **До 410 px (base):** подписи и иконка расположены вертикально.\n- **От 410 px (min-410):** подписи и иконка расположены в одной строке.\n\nВ Sandbox меняйте ширину через панель viewport Storybook.\n\n<a href=\"https://www.figma.com/design/TPjPitung1VP3oQg42f56O/PDPortfolio-DS?node-id=1094-6423\" target=\"_blank\" rel=\"noopener noreferrer\">Figma</a>",
      },
    },
  },
} satisfies Meta<typeof DsFooter>

export default meta
type Story = StoryObj<typeof meta>

export const Sandbox: Story = {
  tags: ['dev'],
  render: () => ({
    components: { DsFooter },
    template: '<DsFooter />',
  }),
}
