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
    role: 'Product Designer · UX Researcher',
    focus: 'Product Discovery · Product Architecture · Business Analysis · MVP Scope · AI Product Design',
  },
  argTypes: {
    role: { control: 'text', description: 'Role value text' },
    focus: { control: 'text', description: 'Focus value text' },
    breakpoint: {
      control: 'radio',
      options: ['base', 'min-425'],
      description: 'Optional explicit Figma breakpoint; omitted uses the viewport.',
    },
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

The optional \`breakpoint\` prop forces one Figma variant in a constrained composition; without it, the component follows the viewport.
        `,
      },
    },
  },
} satisfies Meta<typeof DsRoleFocus>

export default meta
type Story = StoryObj<typeof meta>

export const Breakpoints: Story = {
  render: (args) => ({
    components: { DsRoleFocus },
    setup() {
      return { args }
    },
    template: `
      <div style="display:flex;flex-direction:column;gap:32px;align-items:flex-start;font-family:var(--text-font-sans);">
        <section>
          <p style="margin:0 0 12px;font-size:14px;color:var(--text-muted);">base</p>
          <div style="width:288px;max-width:100%;">
            <DsRoleFocus v-bind="args" breakpoint="base" />
          </div>
        </section>
        <section>
          <p style="margin:0 0 12px;font-size:14px;color:var(--text-muted);">min-425</p>
          <div style="width:min(924px, 100%);">
            <DsRoleFocus v-bind="args" breakpoint="min-425" />
          </div>
        </section>
      </div>
    `,
  }),
  parameters: {
    layout: 'padded',
  },
}
