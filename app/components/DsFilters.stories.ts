import { computed as computedStoryModel } from 'vue'
import { ref, watch } from 'vue'
import { useArgs } from 'storybook/preview-api'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, within } from 'storybook/test'
import DsFilters from './DsFilters.vue'

const meta = {
  title: 'Components/Filters',
  component: DsFilters,
  tags: ['autodocs', '!dev'],
  args: {
    modelValue: 'all',
    ariaLabel: 'Фильтры портфолио',
  },
  argTypes: {
  "modelValue": {
    "options": [
      "all",
      "product",
      "ux",
      "design-system",
      "branding",
      "creative",
      "jewelry",
      "landing",
      "gamedev",
      "video",
      "packaging"
    ],
    "description": "Единственная выбранная категория. `all` соответствует «Все кейсы».",
    "control": {
      "type": "select"
    }
  },
  "ariaLabel": {
    "description": "Доступное имя фильтров во всех breakpoint-композициях.",
    "control": {
      "type": "text"
    }
  }
},
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: "Набор категорий для фильтрации витрины проектов.\n\n### Брейкпоинты\n\n- **До 1024 px (base):** выбор категории в полноэкранном меню.\n- **1024–1279 px (min-1024):** семь основных категорий и выпадающий список остальных.\n- **От 1280 px (min-1280):** все категории в одной строке.\n\nВ Sandbox меняйте ширину через панель viewport Storybook.\n\n<a href=\"https://www.figma.com/design/TPjPitung1VP3oQg42f56O/PDPortfolio-DS?node-id=1021-3477\" target=\"_blank\" rel=\"noopener noreferrer\">Figma</a>",
      },
    },
  },
} satisfies Meta<typeof DsFilters>

export default meta
type Story = StoryObj<typeof meta>

/** One interactive canvas for the three Figma breakpoint variants. */
export const Preview: Story = {
  render: args => {
    const [, updateArgs] = useArgs()
    return {
      components: { DsFilters },
      setup() {
        const model = computedStoryModel({ get: () => args.modelValue, set: value => updateArgs({ modelValue: value }) })
        return { args, model }
      },
      template: '<DsFilters v-bind="args" v-model="model" />',
    }
  },
}

export const Sandbox: Story = {
  tags: ['dev'],
  play: async ({ canvas, userEvent }) => {
    const mobile = canvas.queryByRole('button', { name: 'Выбрать категорию' })
    if (!mobile) {
      const product = canvas.getByRole('button', { name: 'Продукт', exact: true })
      await userEvent.click(product)
      await expect(product).toHaveClass('ds-filter--toggled')
      return
    }
    await userEvent.click(mobile)
    const dialog = within(document.body).getByRole('dialog')
    const buttons = within(dialog).getAllByRole('button')
    const labels = buttons.map(button => button.textContent?.trim())
    expect(labels.indexOf('Лэндинг')).toBe(labels.indexOf('Jewelry') + 1)
    await userEvent.click(within(dialog).getByRole('button', { name: 'Лэндинг', exact: true }))
    await expect(canvas.getByRole('button', { name: 'Выбрать категорию' })).toHaveTextContent('Лэндинг')
  },
  render: args => ({
    components: { DsFilters },
    setup() {
      const model = ref(args.modelValue)
      watch(() => args.modelValue, value => { model.value = value })
      return { args, model }
    },
    template: '<DsFilters v-bind="args" v-model="model" />',
  }),
}
