import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect } from 'storybook/test'
import DsCrossButton from './DsCrossButton.vue'

const meta = {
  title: 'Components/CrossButton',
  component: DsCrossButton,
  tags: ['autodocs'],
  args: {
    ariaLabel: 'Close',
  },
  argTypes: {
    ariaLabel: { control: 'text', description: 'Accessible name for screen readers.' },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Figma [cross button 290:1960](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=290-1960). It composes `DsButtonIcon` with the canonical `Cross` asset. Default is transparent; Hover and ActivePressed are native pointer states.',
      },
    },
  },
} satisfies Meta<typeof DsCrossButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Close' })).toBeVisible()
  },
}

export const Sandbox: Story = {
  render: () => ({
    components: { DsCrossButton },
    data() { return { closed: false } },
    template: `
      <div style="display:flex;flex-direction:column;align-items:center;gap:16px;padding:32px;font-family:var(--text-font-sans);">
        <div v-if="!closed" style="position:relative;width:200px;height:120px;background:var(--surface-subtle);border-radius:16px;display:flex;align-items:center;justify-content:center;">
          <span style="font-size:14px;color:var(--text-muted);">Viewer content</span>
          <div style="position:absolute;top:8px;right:8px;">
            <DsCrossButton aria-label="Close viewer" @click="closed = true" />
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
