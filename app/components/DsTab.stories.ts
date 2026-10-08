import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent } from 'storybook/test'
import { ref } from 'vue'
import DsTab from './DsTab.vue'

const meta = {
  title: 'Components/Tab',
  component: DsTab,
  tags: ['autodocs'],
  args: {
    tabLabel: 'TabValue',
    iconRight: false,
    toolbar: 'Main',
    toggled: false,
  },
  argTypes: {
    tabLabel: { control: 'text', description: 'Figma TEXT property TabLabel' },
    iconRight: { control: 'boolean', description: 'Figma property Icon right: Off / On' },
    toolbar: { control: 'inline-radio', options: ['Main', 'Image'], description: 'Figma property Toolbar' },
    toggled: { control: 'boolean', description: 'Controlled state; maps to Figma State=Toggled.' },
    click: { action: 'click' },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: "[Tab 33:1544](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=33-1544)\n\n<details>\n<summary>Техническое описание</summary>\n\nFigma [Tab 33:1544](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=33-1544).\n\nDefault and Hover are real pointer states. For this local tab switcher, `ActivePressed` remains only a Figma reference; `toggled` is the controlled persistent state and sets `aria-current=\"page\"`.\n\nThe icon is the original Figma ExternalLink asset.\n\n</details>",
      },
    },
  },
} satisfies Meta<typeof DsTab>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Toggled: Story = { args: { toggled: true } }
export const ImageToolbar: Story = { args: { toolbar: 'Image', tabLabel: 'TabValue' } }
export const WithExternalLink: Story = { args: { iconRight: true, tabLabel: 'TabValue' } }

export const Sandbox: Story = {
  render: () => ({
    components: { DsTab },
    setup() {
      const current = ref<'first' | 'second'>('first')
      const toolbar = ref<'Main' | 'Image'>('Main')
      const select = (tab: 'first' | 'second') => { current.value = tab }
      const selectToolbar = (value: 'Main' | 'Image') => { toolbar.value = value }
      return { current, select, selectToolbar, toolbar }
    },
    template: `
      <div style="display:grid;gap:16px;padding:24px;background:var(--surface-default)">
        <div role="group" aria-label="Toolbar" style="display:flex;gap:8px">
          <button type="button" :aria-pressed="toolbar === 'Main'" @click="selectToolbar('Main')">Toolbar = Main</button>
          <button type="button" :aria-pressed="toolbar === 'Image'" @click="selectToolbar('Image')">Toolbar = Image</button>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:12px">
          <DsTab tab-label="TabValue" :toolbar="toolbar" :toggled="current === 'first'" @click="select('first')" />
          <DsTab tab-label="TabValue" :toolbar="toolbar" :toggled="current === 'second'" @click="select('second')" />
        </div>
        <output role="status" aria-live="polite">Current Tab: TabValue; Toolbar: {{ toolbar }}</output>
      </div>
    `,
  }),
  parameters: { layout: 'fullscreen' },
  play: async ({ canvas }) => {
    const [firstTab, secondTab] = canvas.getAllByRole('button', { name: 'TabValue' })
    const imageToolbar = canvas.getByRole('button', { name: 'Toolbar = Image' })
    const output = canvas.getByRole('status')

    await expect(firstTab).toHaveAttribute('aria-current', 'page')
    await userEvent.click(imageToolbar)
    await expect(imageToolbar).toHaveAttribute('aria-pressed', 'true')
    await expect(firstTab).toHaveClass('ds-tab--toolbar-image')
    await expect(secondTab).toHaveClass('ds-tab--toolbar-image')
    await userEvent.click(secondTab)
    await expect(secondTab).toHaveAttribute('aria-current', 'page')
    await expect(firstTab).not.toHaveAttribute('aria-current')
    await expect(output).toHaveTextContent('Current Tab: TabValue; Toolbar: Image')
  },
}
