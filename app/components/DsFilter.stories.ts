import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent } from 'storybook/test'
import DsFilter from './DsFilter.vue'

/**
 * Filter — DS component 43:867
 * Figma: https://www.figma.com/design/TPjPitung1VP3oQg42f56O/PDPortfolio-DS?node-id=43-867
 * DS docs: ds/components.md § Filter
 *
 * Portfolio category filter chip. 90×50 reference, radius=24.
 * 5 states including Disabled. Default color: text/action (accent/aubergine).
 */
const meta = {
  title: 'Components/Filter',
  component: DsFilter,
  tags: ['autodocs', '!dev'],
  args: {
    label: 'Продукт',
    toggled: false,
    disabled: false,
  },
  argTypes: {
  "label": {
    "description": "Filter label text (Text-filter#182:0)",
    "control": {
      "type": "text"
    }
  },
  "toggled": {
    "description": "Toggled/Selected state (aria-pressed=true)",
    "table": {
      "defaultValue": {
        "summary": "false"
      }
    },
    "control": {
      "type": "boolean"
    }
  },
  "disabled": {
    "control": {
      "type": "boolean"
    }
  }
},
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: "Переключатель категории в списке фильтров.\n\n<a href=\"https://www.figma.com/design/TPjPitung1VP3oQg42f56O/PDPortfolio-DS?node-id=43-867\" target=\"_blank\" rel=\"noopener noreferrer\">Figma</a>",
      },
    },
  },
} satisfies Meta<typeof DsFilter>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    const filter = canvas.getByRole('button', { name: 'Продукт' })

    await userEvent.tab()
    await expect(filter).toHaveFocus()
  },
}

export const Toggled: Story = {
  args: { toggled: true, label: 'Все кейсы' },
}

export const Disabled: Story = {
  args: { disabled: true, label: 'Упаковка' },
}

export const AllVariants: Story = {
  render: () => ({
    components: { DsFilter },
    template: `
      <div style="display:flex;flex-wrap:wrap;gap:8px;padding:24px;background:var(--surface-subtle);">
        <DsFilter label="Все кейсы" :toggled="true" />
        <DsFilter label="Продукт" />
        <DsFilter label="UX" />
        <DsFilter label="Дизайн система" />
        <DsFilter label="Брендинг" />
        <DsFilter label="Упаковка" :disabled="true" />
      </div>
    `,
  }),
  parameters: { layout: 'fullscreen' },
}

/** Sandbox: single-select filter group */
export const Sandbox: Story = {
  render: () => ({
    components: { DsFilter },
    data() {
      return {
        filters: ['Все кейсы', 'Продукт', 'UX', 'Дизайн система', 'Брендинг', 'Креатив'],
        selected: 'Все кейсы',
      }
    },
    methods: {
      select(f: string) {
        (this as any).selected = f
      },
    },
    template: `
      <div style="display:flex;flex-wrap:wrap;gap:8px;padding:24px;background:var(--surface-subtle);">
        <DsFilter
          v-for="f in filters"
          :key="f"
          :label="f"
          :toggled="selected === f"
          @click="select(f)"
        />
      </div>
    `,
  }),
  parameters: { layout: 'fullscreen' },
}
