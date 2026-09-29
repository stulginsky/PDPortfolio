import type { Meta, StoryObj } from '@storybook/vue3-vite'
import DsBreadcrumbs from './DsBreadcrumbs.vue'

/**
 * Breadcrumbs — DS component 317:2055
 * Figma: https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=317-2055
 */
const meta = {
  title: 'Components/Breadcrumbs',
  component: DsBreadcrumbs,
  tags: ['autodocs'],
  args: {
    label: 'Product discovery',
    showDot: true,
    toggled: false,
    href: '#',
  },
  argTypes: {
    label: { control: 'text' },
    showDot: { control: 'boolean' },
    toggled: { control: 'boolean', description: 'Current page — non-interactive, text/secondary' },
    href: { control: 'text' },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
DS Breadcrumbs 317:2055. Single breadcrumb item. DS/Body/base, h=26.

| State | Text color | Interactive |
|---|---|---|
| Default | text/muted | ✅ |
| Hover | text/link-hover | ✅ |
| ActivePressed | text/link-pressed | ✅ |
| Toggled | text/secondary | ❌ (current page) |
        `,
      },
    },
  },
} satisfies Meta<typeof DsBreadcrumbs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { toggled: false } }
export const Toggled: Story = { args: { toggled: true } }
export const NoDot: Story = { args: { showDot: false, label: 'First item' } }

export const AllVariants: Story = {
  render: () => ({
    components: { DsBreadcrumbs },
    template: `
      <div style="display:flex;align-items:center;gap:0;padding:24px;background:var(--surface-subtle);">
        <DsBreadcrumbs label="Chirp product" href="#" :show-dot="false" />
        <DsBreadcrumbs label="AI UX" href="#" :show-dot="true" />
        <DsBreadcrumbs label="Current case" :show-dot="true" :toggled="true" />
      </div>
    `,
  }),
  parameters: { layout: 'fullscreen' },
}

/** Full navigation row: A → B (2 items) */
export const TwoItems: Story = {
  render: () => ({
    components: { DsBreadcrumbs },
    template: `
      <nav style="display:inline-flex;align-items:center;padding:24px;background:var(--surface-subtle);">
        <DsBreadcrumbs label="Chirp product" href="#" :show-dot="false" />
        <DsBreadcrumbs label="Chirp UX" :show-dot="true" :toggled="true" />
      </nav>
    `,
  }),
  parameters: { layout: 'fullscreen' },
}
