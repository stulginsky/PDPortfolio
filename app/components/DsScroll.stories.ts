import type { Meta, StoryObj } from '@storybook/vue3-vite'
import DsScroll from './DsScroll.vue'

/**
 * Scroll — DS component 968:3619
 * Figma: https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=968-3619
 */
const meta = {
  title: 'Components/Scroll',
  component: DsScroll,
  tags: ['autodocs'],
  args: {
    axis: 'Y',
    scrollId: 'scroll-demo',
  },
  argTypes: {
    axis: {
      control: 'inline-radio',
      options: ['X', 'Y'],
    },
    scrollId: { control: 'text', description: 'id of the controlled scroll container' },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
DS Scroll 968:3619. Custom scrollbar overlay for X or Y axis.

Track: X=72×20, Y=20×72. Thumb min=48px, radius=8px (radius/md).
Visible only when overflow exists on that axis.

| State | Token |
|---|---|
| Default | surface/scroll-thumb |
| Hover | surface/scroll-thumb-hover |
| ActivePressed | surface/scroll-thumb-pressed |

**Thumb formula:**
\`\`\`
available = trackLength - 24
thumbLength = min(available, max(48, available * clientSize / scrollSize))
travel = available - thumbLength
thumbOffset = 12 + (scrollPos / (scrollSize - clientSize)) * travel
\`\`\`

Desktop: thumb draggable via pointer capture. Mobile: indicator only (no drag).
Keyboard: Arrow / PgUp / PgDown / Home / End.
        `,
      },
    },
  },
} satisfies Meta<typeof DsScroll>

export default meta
type Story = StoryObj<typeof meta>

/** Vertical scroll demo */
export const VerticalY: Story = {
  render: () => ({
    components: { DsScroll },
    template: `
      <div style="display:flex;gap:0;align-items:flex-start;width:240px;height:200px;border:1px solid var(--border-default);border-radius:8px;overflow:hidden;position:relative;">
        <!-- Scroll container -->
        <div
          id="scroll-y-demo"
          style="flex:1;height:200px;overflow:hidden auto;padding:16px;scrollbar-width:none;"
        >
          <p v-for="i in 12" :key="i" style="margin:0 0 12px;font-family:var(--text-font-sans);font-size:14px;color:var(--text-default);">
            Line {{ i }}: Lorem ipsum dolor sit amet.
          </p>
        </div>
        <!-- Custom scrollbar -->
        <DsScroll axis="Y" scroll-id="scroll-y-demo" style="position:absolute;right:0;top:0;height:200px;" />
      </div>
    `,
  }),
  parameters: { layout: 'centered' },
}

/** Horizontal scroll demo */
export const HorizontalX: Story = {
  render: () => ({
    components: { DsScroll },
    template: `
      <div style="display:flex;flex-direction:column;gap:0;width:300px;height:120px;border:1px solid var(--border-default);border-radius:8px;overflow:hidden;position:relative;">
        <!-- Scroll container -->
        <div
          id="scroll-x-demo"
          style="flex:1;overflow:auto hidden;padding:16px;scrollbar-width:none;white-space:nowrap;"
        >
          <span v-for="i in 20" :key="i" style="display:inline-block;margin-right:24px;font-family:var(--text-font-sans);font-size:14px;color:var(--text-default);">
            Item {{ i }}
          </span>
        </div>
        <!-- Custom horizontal scrollbar -->
        <DsScroll axis="X" scroll-id="scroll-x-demo" style="width:100%;" />
      </div>
    `,
  }),
  parameters: { layout: 'centered' },
}
