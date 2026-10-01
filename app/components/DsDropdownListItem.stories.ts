import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { expect } from 'storybook/test'
import DsDropdownListItem from './DsDropdownListItem.vue'

const iconOptions = [
  'Favicon',
  'Download',
  'Print',
  'ArrowNavLeft',
  'ArrowNavRight',
  'ArrowNavUp',
  'Cross',
  'MagnifyingGlass',
  'Sun',
  'Moon',
  'GitHub',
  'Figma',
  'ExternalLink',
  'ChevronDown',
  'ChevronUp',
]

/**
 * DropdownListItem — DS component 325:1613
 * Figma: https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=325-1613
 */
const meta = {
  title: 'Components/DropdownListItem',
  component: DsDropdownListItem,
  tags: ['autodocs'],
  args: {
    label: 'List item',
    appearance: 'Sm',
    icon: 'Favicon',
    showIcon: true,
    type: 'General',
  },
  argTypes: {
    label: { control: 'text', description: 'Figma TextListItem#1295:0' },
    appearance: { control: 'inline-radio', options: ['Sm', 'Lr'] },
    icon: { control: 'select', options: iconOptions },
    showIcon: { control: 'boolean', description: 'Figma Show Icon#1295:39' },
    type: { control: 'inline-radio', options: ['General', 'Filter'] },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'General aligns text and icon to opposing edges. Filter centers the text-plus-icon group. Long text wraps; it is never truncated with an ellipsis.',
      },
    },
  },
} satisfies Meta<typeof DsDropdownListItem>

export default meta
type Story = StoryObj<typeof meta>

export const AppearanceSm: Story = {
  args: { appearance: 'Sm', label: 'Product design' },
  play: async ({ canvas }) => {
    const item = canvas.getByRole('button', { name: 'Product design' })
    await expect(item.querySelector('.ds-dropdown-list-item__icon')).toBeVisible()
  },
}

export const AppearanceLr: Story = {
  args: { appearance: 'Lr', label: 'UX research', type: 'Filter', showIcon: false },
}

export const FilterType: Story = {
  args: { label: 'Centered filter row', type: 'Filter' },
  play: async ({ canvas }) => {
    const item = canvas.getByRole('button', { name: 'Centered filter row' })
    await expect(item).toHaveClass('ds-dropdown-list-item--filter')
  },
}

export const WithExternalLink: Story = {
  args: {
    label: 'External resource',
    href: 'https://www.figma.com/',
    icon: 'ExternalLink',
  },
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link', { name: 'External resource' })
    await expect(link).toHaveAttribute('target', '_blank')
  },
}

export const AllVariants: Story = {
  render: () => ({
    components: { DsDropdownListItem },
    template: `
      <div style="display:flex;gap:24px;padding:24px;background:var(--surface-subtle);flex-wrap:wrap;align-items:flex-start;">
        <div style="display:flex;flex-direction:column;gap:8px;width:286px;">
          <div style="font:12px var(--text-font-sans);color:var(--text-muted);">General / Sm</div>
          <DsDropdownListItem label="List item" appearance="Sm" type="General" />
          <DsDropdownListItem label="Ямнчмячмячм" appearance="Sm" type="General" icon="ExternalLink" />
        </div>
        <div style="display:flex;flex-direction:column;gap:8px;width:286px;">
          <div style="font:12px var(--text-font-sans);color:var(--text-muted);">Filter / Sm</div>
          <DsDropdownListItem label="List item" appearance="Sm" type="Filter" />
          <DsDropdownListItem label="Long menu text wraps instead of being truncated" appearance="Sm" type="Filter" />
        </div>
        <div style="display:flex;flex-direction:column;gap:8px;width:286px;">
          <div style="font:12px var(--text-font-sans);color:var(--text-muted);">Filter / Lr / no icon</div>
          <DsDropdownListItem label="List item" appearance="Lr" type="Filter" :show-icon="false" />
        </div>
      </div>
    `,
  }),
  parameters: { layout: 'fullscreen' },
}

export const Sandbox: Story = {
  render: (args) => ({
    components: { DsDropdownListItem },
    setup() {
      const clicks = ref(0)
      return { args, clicks }
    },
    template: `
      <div style="padding:32px;font-family:var(--text-font-sans);">
        <p style="font-size:14px;color:var(--text-muted);margin-bottom:16px;">Use Controls to change every prop. Hover and press the real row to inspect its documented states.</p>
        <DsDropdownListItem
          :label="args.label"
          :appearance="args.appearance"
          :icon="args.icon"
          :show-icon="args.showIcon"
          :type="args.type"
          @click="clicks += 1"
        />
        <p style="margin-top:16px;font-size:14px;color:var(--text-muted);">Clicks: {{ clicks }}</p>
      </div>
    `,
  }),
  parameters: { layout: 'fullscreen' },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'List item' }))
    await expect(canvas.getByText('Clicks: 1')).toBeVisible()
  },
}
