import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import DsFilters from './DsFilters.vue'

const meta = {
  title: 'Components/Filters',
  component: DsFilters,
  tags: ['autodocs'],
  args: {
    modelValue: 'all',
    ariaLabel: 'Фильтры портфолио',
  },
  argTypes: {
    modelValue: {
      control: 'select',
      options: ['all', 'product', 'ux', 'design-system', 'branding', 'creative', 'jewelry', 'gamedev', 'video', 'packaging'],
      description: 'Единственная выбранная категория. `all` соответствует «Все кейсы».',
    },
    ariaLabel: {
      control: 'text',
      description: 'Доступное имя фильтров во всех breakpoint-композициях.',
    },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: "[1021:3477](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=1021-3477)\n\n<details>\n<summary>Техническое описание</summary>\n\nResponsive portfolio filters — DS [1021:3477](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=1021-3477).\n\n| Breakpoint | Composition |\n|---|---|\n| base (<1024px) | FullscreenMenu/Mob with all ten categories |\n| min-1024 (1024–1279px) | Seven priority filters + Gamedev & more overflow |\n| min-1280 (≥1280px) | All ten filters in one row |\n\n</details>",
      },
    },
  },
} satisfies Meta<typeof DsFilters>

export default meta
type Story = StoryObj<typeof meta>

/** One interactive canvas for the three Figma breakpoint variants. */
export const Sandbox: Story = {
  render: (args) => ({
    components: { DsFilters },
    setup() {
      const value = ref(args.modelValue ?? 'all')
      const breakpoint = ref<'base' | 'min-1024' | 'min-1280'>('base')
      const breakpoints = [
        { value: 'base', label: 'Base' },
        { value: 'min-1024', label: 'min-1024' },
        { value: 'min-1280', label: 'min-1280' },
      ] as const

      return { args, breakpoint, breakpoints, value }
    },
    template: `
      <div style="display:grid;gap:32px;box-sizing:border-box;width:100%;padding:32px 16px;">
        <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;">
          <button
            v-for="item in breakpoints"
            :key="item.value"
            type="button"
            :aria-pressed="breakpoint === item.value"
            @click="breakpoint = item.value"
          >{{ item.label }}</button>
        </div>
        <DsFilters
          v-model="value"
          :aria-label="args.ariaLabel"
          :data-storybook-breakpoint="breakpoint"
        />
      </div>
    `,
  }),
}
