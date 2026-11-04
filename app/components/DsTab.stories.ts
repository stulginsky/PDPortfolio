import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent } from 'storybook/test'
import { ref } from 'vue'
import DsTab from './DsTab.vue'

const meta = {
  title: 'Components/Tab',
  component: DsTab,
  tags: ['autodocs', '!dev'],
  args: {
    tabLabel: 'TabValue',
    iconRight: false,
    toolbar: 'Main',
    toggled: false,
  },
  argTypes: {
  "tabLabel": {
    "description": "Figma TEXT property TabLabel",
    "control": {
      "type": "text"
    }
  },
  "iconRight": {
    "description": "Figma property IconRight: Off / On",
    "control": {
      "type": "boolean"
    }
  },
  "toolbar": {
    "options": [
      "Main",
      "Image"
    ],
    "description": "Figma property Toolbar",
    "control": {
      "type": "inline-radio"
    }
  },
  "toggled": {
    "description": "Controlled state; maps to Figma State=Toggled.",
    "control": {
      "type": "boolean"
    }
  },
  "click": {
    "action": "click"
  }
},
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: "Вкладка для переключения представления или раздела.\n\n<a href=\"https://www.figma.com/design/TPjPitung1VP3oQg42f56O/PDPortfolio-DS?node-id=33-1544\" target=\"_blank\" rel=\"noopener noreferrer\">Figma</a>",
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

    await document.fonts.ready
    if (CSS.supports('text-box', 'trim-both cap alphabetic')) {
      for (const tab of [firstTab, secondTab]) {
        const outer = tab.getBoundingClientRect(), glyph = tab.querySelector('.ds-tab__glyphs')!.getBoundingClientRect()
        await expect(outer.height).toBe(50)
        await expect(Math.abs(glyph.y + glyph.height / 2 - outer.y - outer.height / 2)).toBeLessThan(.2)
      }
    }
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
