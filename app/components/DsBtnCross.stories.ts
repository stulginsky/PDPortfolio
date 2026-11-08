import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect } from 'storybook/test'
import DsBtnCross from './DsBtnCross.vue'

const meta = {
  id: 'components-btncross',
  title: 'Components/ButtonCross',
  component: DsBtnCross,
  tags: ['autodocs', '!dev'],
  args: {
    ariaLabel: 'Close',
    raised: false,
  },
  argTypes: {
  "ariaLabel": {
    "description": "Accessible name for screen readers.",
    "control": {
      "type": "text"
    }
  },
  "raised": {
    "description": "Nested ButtonIcon Raised; Default surface only.",
    "control": {
      "type": "boolean"
    }
  },
  "pressedAppearance": {
    "table": {
      "disable": true
    },
    "control": false
  }
},
  render: args => ({
    components: { DsBtnCross },
    setup: () => ({ args }),
    template: '<DsBtnCross v-bind="args" pressed-appearance="ActivePressed" />',
  }),
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: "Кнопка закрытия панели или всплывающего элемента.\n\nВ мобильном полноэкранном меню доступны состояния Default и ActivePressed. Оформление нажатия действует только во время удержания кнопки; постоянного состояния Toggled у крестика нет. После активации кнопка закрывает меню.\n\n<a href=\"https://www.figma.com/design/TPjPitung1VP3oQg42f56O/PDPortfolio-DS?node-id=290-1960\" target=\"_blank\" rel=\"noopener noreferrer\">Figma</a>",
      },
    },
  },
} satisfies Meta<typeof DsBtnCross>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    const button = canvas.getByRole('button', { name: 'Close' })
    await expect(button).toBeVisible()
    await expect(button).not.toHaveAttribute('aria-pressed')
    await expect(button).not.toHaveClass('button-base--pressed-appearance-toggled')
    await userEvent.hover(button)
    await userEvent.pointer({ target: button, keys: '[MouseLeft>]' })
    await expect(button).toHaveClass('button-base--pressed')
    await expect(button).not.toHaveClass('button-base--toggled')
    await userEvent.pointer({ target: button, keys: '[/MouseLeft]' })
    await expect(button).not.toHaveClass('button-base--pressed')
    await expect(button).not.toHaveClass('button-base--toggled')
    await userEvent.unhover(button)
  },
}

export const Raised: Story = {
  args: { raised: true },
  play: async ({ canvas, userEvent }) => {
    const button = canvas.getByRole('button', { name: 'Close' })
    await expect(button).toBeVisible()
    expect(getComputedStyle(button).backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
    await userEvent.hover(button)
    await userEvent.unhover(button)
    await userEvent.tab()
    await expect(button).toHaveFocus()
  },
}

export const Sandbox: Story = {
  render: () => ({
    components: { DsBtnCross },
    data() { return { closed: false } },
    template: `
      <div style="display:flex;flex-direction:column;align-items:center;gap:16px;padding:32px;font-family:var(--text-font-sans);">
        <div v-if="!closed" style="position:relative;width:200px;height:120px;background:var(--surface-subtle);border-radius:16px;display:flex;align-items:center;justify-content:center;">
          <span style="font-size:14px;color:var(--text-muted);">Viewer content</span>
          <div style="position:absolute;top:8px;right:8px;">
            <DsBtnCross aria-label="Close viewer" @click="closed = true" />
          </div>
        </div>
        <div v-else style="font-size:14px;color:var(--text-muted);">
          Viewer closed. <button type="button" @click="closed = false" style="background:none;border:none;color:var(--accent-violet);cursor:pointer;font-size:14px;">Reopen</button>
        </div>
      </div>
    `,
  }),
  parameters: { layout: 'fullscreen' },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Close viewer' }))
    await expect(canvas.getByText('Viewer closed.')).toBeVisible()
  },
}
