import type { Meta, StoryObj } from '@storybook/vue3-vite'
import DsTooltip from './DsTooltip.vue'

/**
 * Tooltip — DS component 324:2111
 * Figma: https://www.figma.com/design/TPjPitung1VP3oQg42f56O/PDPortfolio-DS?node-id=324-2111
 * DS docs: ds/components.md § Tooltip
 *
 * Static tooltip with 4 pointer directions. DS/Body/sm, text/inverse.
 * Shown/hidden by parent; not self-managing.
 */
const meta = {
  title: 'Components/Tooltip',
  component: DsTooltip,
  tags: ['autodocs', '!dev'],
  args: {
    label: 'Tooltip',
    pointer: 'Top',
  },
  argTypes: {
  "visible": {
    "description": "Плавное появление и скрытие за 300 мс. Компонент остаётся смонтированным.",
    "control": {
      "type": "boolean"
    }
  },
  "label": {
    "description": "Tooltip text (Text#324:8)",
    "control": {
      "type": "text"
    }
  },
  "pointer": {
    "options": [
      "Top",
      "Bottom",
      "Left",
      "Right"
    ],
    "description": "Arrow direction (Pointer variant)",
    "control": {
      "type": "inline-radio"
    }
  }
},
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: "Короткая поясняющая подсказка рядом с элементом интерфейса.\n\n<a href=\"https://www.figma.com/design/TPjPitung1VP3oQg42f56O/PDPortfolio-DS?node-id=324-2111\" target=\"_blank\" rel=\"noopener noreferrer\">Figma</a>",
      },
    },
  },
} satisfies Meta<typeof DsTooltip>

export default meta
type Story = StoryObj<typeof meta>

export const PointerTop: Story = { args: { pointer: 'Top', label: 'Download' } }
export const PointerBottom: Story = { args: { pointer: 'Bottom', label: 'Print' } }
export const PointerLeft: Story = { args: { pointer: 'Left', label: 'Share' } }
export const PointerRight: Story = { args: { pointer: 'Right', label: 'Open' } }

export const AllVariants: Story = {
  render: () => ({
    components: { DsTooltip },
    template: `
      <div style="display:flex;flex-wrap:wrap;gap:48px;padding:48px;background:var(--surface-subtle);justify-content:center;align-items:center;">
        <div style="display:flex;flex-direction:column;align-items:center;gap:8px;">
          <DsTooltip label="Top pointer" pointer="Top" />
          <code style="font-size:11px;color:var(--text-muted)">Pointer=Top</code>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:8px;">
          <DsTooltip label="Bottom pointer" pointer="Bottom" />
          <code style="font-size:11px;color:var(--text-muted)">Pointer=Bottom</code>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:8px;">
          <DsTooltip label="Left pointer" pointer="Left" />
          <code style="font-size:11px;color:var(--text-muted)">Pointer=Left</code>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:8px;">
          <DsTooltip label="Right pointer" pointer="Right" />
          <code style="font-size:11px;color:var(--text-muted)">Pointer=Right</code>
        </div>
      </div>
    `,
  }),
  parameters: { layout: 'fullscreen' },
}
