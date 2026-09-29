import type { Meta, StoryObj } from '@storybook/vue3-vite'
import DsRoleFocus from './DsRoleFocus.vue'

/**
 * Role-Focus — DS component 1107:7326
 * Figma: https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=1107-7326
 * DS docs: ds/components.md § Role-Focus
 *
 * Case metadata block. Non-interactive.
 * base (<425px): vertical, DS/Body/base values.
 * min-425 (>=425px): horizontal, 116px label col, DS/Body/md values.
 */
const meta = {
  title: 'Components/RoleFocus',
  component: DsRoleFocus,
  tags: ['autodocs'],
  args: {
    role: 'Product designer',
    focus: 'Mobile app UX, Design system',
  },
  argTypes: {
    role: { control: 'text', description: 'Role value text' },
    focus: { control: 'text', description: 'Focus value text' },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
DS Role-Focus 1107:7326. Case role/focus block, non-interactive.
Static labels: "My role" / "Case focus". Values from props.

| Breakpoint | Layout | Typography |
|---|---|---|
| base (<425px) | vertical (label over value) | DS/Body/base 16px w400 |
| min-425 (>=425px) | horizontal (label col 116px) | DS/Body/md 20px w300 |
        `,
      },
    },
  },
} satisfies Meta<typeof DsRoleFocus>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Mobile: Story = {
  args: {
    role: 'UX Designer, PM',
    focus: 'User research, AI product strategy',
  },
  parameters: {
    viewport: { defaultViewport: 'mobile320' },
  },
}

export const Desktop: Story = {
  args: {
    role: 'UX Designer, PM',
    focus: 'User research, AI product strategy, MVP Scope',
  },
  parameters: {
    viewport: { defaultViewport: 'desktop1440' },
  },
}

export const AllVariants: Story = {
  render: () => ({
    components: { DsRoleFocus },
    template: `
      <div style="display:flex;flex-direction:column;gap:48px;padding:24px;background:var(--surface-subtle);">
        <div>
          <div style="font-size:11px;color:var(--text-muted);margin-bottom:12px;font-family:var(--text-font-sans);">base (&lt;425px) — vertical layout</div>
          <div style="max-width:288px;border:1px dashed var(--border-default);padding:12px;">
            <DsRoleFocus role="Product designer" focus="Mobile app UX, Design system" />
          </div>
        </div>
        <div>
          <div style="font-size:11px;color:var(--text-muted);margin-bottom:12px;font-family:var(--text-font-sans);">min-425 — horizontal layout</div>
          <div style="min-width:425px;border:1px dashed var(--border-default);padding:12px;">
            <DsRoleFocus role="Product designer" focus="Mobile app UX, Design system" />
          </div>
        </div>
      </div>
    `,
  }),
  parameters: { layout: 'fullscreen' },
}
