import { computed as computedStoryModel } from 'vue'
import { useArgs } from 'storybook/preview-api'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect } from 'storybook/test'
import DsDropdownFilter from './DsDropdownFilter.vue'

/**
 * DropdownFilter-web — DS component 1016:6638
 * Figma: https://www.figma.com/design/TPjPitung1VP3oQg42f56O/PDPortfolio-DS?node-id=1016-6638
 */
const meta = {
  title: 'Components/DropdownFilter',
  component: DsDropdownFilter,
  tags: ['autodocs', '!dev'],
  args: {
    items: ['Gamedev', 'Видео', 'Упаковка'],
    modelValue: null,
    showIcons: true,
    lockInitialWidth: false,
  },
  argTypes: {
  "modelValue": {
    "options": [
      null,
      "Gamedev",
      "Видео",
      "Упаковка"
    ],
    "description": "Выбранная категория. null — выбор отсутствует.",
    "control": {
      "type": "select"
    }
  },
  "showIcons": {
    "description": "Shows canonical Favicon in standalone list rows.",
    "control": {
      "type": "boolean"
    }
  },
  "lockInitialWidth": {
    "description": "Locks the Default trigger width when labels vary in a composed filter row.",
    "control": {
      "type": "boolean"
    }
  }
},
  parameters: {
    layout: 'centered',
    docs: {
      story: { inline: true },
      description: {
        component: "Выбор категории из выпадающего списка дополнительных фильтров.\n\n<a href=\"https://www.figma.com/design/TPjPitung1VP3oQg42f56O/PDPortfolio-DS?node-id=1016-6638\" target=\"_blank\" rel=\"noopener noreferrer\">Figma</a>",
      },
    },
  },
} satisfies Meta<typeof DsDropdownFilter>

export default meta
type Story = StoryObj<typeof meta>

export const Preview: Story = {
  render: args => {
    const [, updateArgs] = useArgs()
    return {
      components: { DsDropdownFilter },
      setup() {
        const model = computedStoryModel({ get: () => args.modelValue, set: value => updateArgs({ modelValue: value }) })
        return { args, model }
      },
      template: '<div :style="{ paddingBottom: `${(args.items?.length ?? 3) * 48 + 20}px` }"><DsDropdownFilter v-bind="args" v-model="model" /></div>',
    }
  },
}

export const Default: Story = { args: { modelValue: null } }

export const Selected: Story = {
  args: { modelValue: 'Gamedev' },
}

export const Sandbox: Story = {
  render: () => ({
    components: { DsDropdownFilter },
    data() {
      return {
        // Global filter state (simulated)
        allFilters: ['Все кейсы', 'Продукт', 'UX', 'Дизайн система', 'Брендинг', 'Креатив'],
        overflowFilters: ['Gamedev', 'Видео', 'Упаковка'],
        selectedFilter: 'Все кейсы',
        overflowValue: null as string | null,
      }
    },
    methods: {
      selectMain(f: string) {
        (this as any).selectedFilter = f
        ;(this as any).overflowValue = null
      },
      selectOverflow(val: string | null) {
        if (val) {
          (this as any).selectedFilter = val
          ;(this as any).overflowValue = val
        }
      },
    },
    template: `
      <div style="padding:32px;background:var(--surface-subtle);font-family:var(--text-font-sans);">
        <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-bottom:24px;">
          <button
            v-for="f in allFilters"
            :key="f"
            style="padding:8px 16px;border:1px solid var(--border-default);border-radius:24px;background:none;cursor:pointer;font-family:var(--text-font-sans);font-size:14px;"
            :style="selectedFilter === f && !overflowValue ? 'background:var(--surface-action-toggled);color:var(--text-inverse);border-color:var(--surface-action-toggled)' : 'color:var(--text-action)'"
            @click="selectMain(f)"
          >{{ f }}</button>
          <!-- Overflow dropdown -->
          <DsDropdownFilter
            :model-value="overflowValue"
            :items="overflowFilters"
            @update:model-value="selectOverflow($event)"
          />
        </div>
        <p style="font-size:14px;color:var(--text-muted);">Active: <strong>{{ selectedFilter }}</strong></p>
        <p style="font-size:12px;color:var(--text-subtle);">Viewport 1024–1279px: overflow items hidden from main row</p>
      </div>
    `,
  }),
  parameters: { layout: 'fullscreen' },
  play: async ({ canvas, userEvent }) => {
    const button = canvas.getByRole('button', { name: 'Gamedev & more' })
    const icon = button.querySelector('.ds-button__icon')
    const closedMask = icon instanceof HTMLElement
      ? icon.style.getPropertyValue('--ds-button-icon-mask')
      : ''

    await expect(closedMask).not.toBe('')
    await userEvent.hover(button)
    await userEvent.click(button)
    await expect(button).toHaveAttribute('aria-expanded', 'true')
    await expect(button).toHaveClass('button-base--hover-suppressed')
    await expect(button).toHaveClass('ds-dropdown-filter__trigger--hover-suppressed')
    await expect(
      icon instanceof HTMLElement
        ? icon.style.getPropertyValue('--ds-button-icon-mask')
        : '',
    ).not.toBe(closedMask)
    await userEvent.unhover(button)
    await expect(button).not.toHaveClass('button-base--hover-suppressed')
    await expect(button).not.toHaveClass('ds-dropdown-filter__trigger--hover-suppressed')
    await userEvent.click(canvas.getByRole('button', { name: 'Gamedev' }))
    await expect(button).toHaveAttribute('aria-expanded', 'false')
    await expect(button).toHaveClass('button-base--toggled')
    await expect(
      button.querySelector('.ds-button__icon') instanceof HTMLElement
        ? button.querySelector('.ds-button__icon')?.style.getPropertyValue('--ds-button-icon-mask')
        : '',
    ).toBe(closedMask)
    await userEvent.click(button)
    await expect(button).toHaveAttribute('aria-expanded', 'true')
    await expect(button).toHaveClass('button-base--toggled')
  },
}
