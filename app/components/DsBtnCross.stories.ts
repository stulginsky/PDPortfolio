import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect } from 'storybook/test'
import DsBtnCross from './DsBtnCross.vue'

const meta = {
  title: 'Components/BtnCross',
  component: DsBtnCross,
  tags: ['autodocs'],
  args: {
    ariaLabel: 'Close',
    raised: false,
  },
  argTypes: {
    ariaLabel: { control: 'text', description: 'Accessible name for screen readers.' },
    raised: { control: 'boolean', description: 'Nested ButtonIcon Raised; Default surface only.' },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: "[BtnCross 290:1960](https://www.figma.com/design/TPjPitung1VP3oQg42f56O/PDPortfolio-DS?node-id=290-1960)\n\n<details>\n<summary>Техническое описание</summary>\n\nFigma [BtnCross 290:1960](https://www.figma.com/design/TPjPitung1VP3oQg42f56O/PDPortfolio-DS?node-id=290-1960). It composes `DsButtonIcon` with the canonical `Cross` asset. Default is transparent unless raised=true forwards the original ButtonIcon Raised surface (surface/raised); Hover and ActivePressed are native pointer states.\n\n</details>",
      },
    },
  },
} satisfies Meta<typeof DsBtnCross>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Close' })).toBeVisible()
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
