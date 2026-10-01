import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect } from 'storybook/test'
import DsDropdownSelect from './DsDropdownSelect.vue'

/**
 * DropdownSelect-web — DS component 1015:4517
 * Figma: https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=1015-4517
 */
const meta = {
  title: 'Components/DropdownSelect',
  component: DsDropdownSelect,
  tags: ['autodocs'],
  args: {
    modelValue: '',
    placeholder: 'Select',
    raised: false,
    items: [
      { label: 'Overview', value: 'overview' },
      { label: 'Foundation.md', value: 'foundation' },
      { label: 'Tokens.json', value: 'tokens' },
      {
        label: 'Figma',
        value: 'figma',
        href: 'https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=1015-4517',
        icon: 'ExternalLink',
        showIcon: true,
      },
    ],
  },
  argTypes: {
    placeholder: { control: 'text' },
    modelValue: { control: 'text' },
    raised: { control: 'boolean' },
    items: { control: false, description: 'Menu items accept `href?`; an external item opens in a new tab and preserves `modelValue`.' },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
DS DropdownSelect-web 1015:4517. Compact universal web dropdown.

| State | Trigger |
|---|---|
| Default | Closed Button + ChevronDown |
| Hover | Closed Button + ChevronDown :hover |
| ActivePressed | Figma reference; not rendered for this local toggle |
| Opened | Button Toggled + ChevronUp + list of ≤4 ListItem/Sm |
        `,
      },
    },
  },
} satisfies Meta<typeof DsDropdownSelect>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithSelection: Story = {
  args: { modelValue: 'foundation' },
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Foundation.md' })
    await userEvent.click(trigger)

    const menu = canvas.getByRole('list', { name: 'Select options' })
    await expect(menu.getBoundingClientRect().width).toBeGreaterThanOrEqual(
      trigger.getBoundingClientRect().width,
    )
  },
}

export const Raised: Story = {
  args: { raised: true },
}

export const Sandbox: Story = {
  args: { raised: true },
  render: (args) => ({
    components: { DsDropdownSelect },
    data() {
      return {
        args,
        value: '',
        items: [
          { label: 'Overview', value: 'overview', showIcon: false },
          { label: 'Foundation.md', value: 'foundation', showIcon: false },
          { label: 'Tokens.json', value: 'tokens', showIcon: false },
          {
            label: 'Figma',
            value: 'figma',
            href: 'https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=1015-4517',
            icon: 'ExternalLink',
            showIcon: true,
          },
        ],
      }
    },
    template: `
      <div style="padding:48px 64px;font-family:var(--text-font-sans);display:flex;flex-direction:column;gap:24px;align-items:flex-start;">
        <DsDropdownSelect v-model="value" :items="items" placeholder="Select view" :raised="args.raised" />
        <p style="font-size:14px;color:var(--text-muted);">Selected: {{ value || '(none)' }}</p>
      </div>
    `,
  }),

  parameters: { layout: 'fullscreen' },

  play: async ({ canvas, userEvent }) => {
    const button = canvas.getByRole('button', { name: 'Select view' })
    const icon = button.querySelector('.ds-button__icon')
    const closedMask = icon instanceof HTMLElement
      ? icon.style.getPropertyValue('--ds-button-icon-mask')
      : ''

    await expect(closedMask).not.toBe('')
    await userEvent.click(button)
    await expect(button).toHaveAttribute('aria-expanded', 'true')
    await expect(
      icon instanceof HTMLElement
        ? icon.style.getPropertyValue('--ds-button-icon-mask')
        : '',
    ).not.toBe(closedMask)
    await expect(canvas.getByRole('list', { name: 'Select options' })).toBeVisible()

    await userEvent.click(canvas.getByRole('button', { name: 'Foundation.md' }))
    const foundationButton = canvas.getByRole('button', { name: 'Foundation.md' })

    await userEvent.click(foundationButton)
    const figma = canvas.getByRole('link', { name: 'Figma' })
    await expect(figma).toHaveAttribute('target', '_blank')
    await userEvent.click(figma)
    await expect(canvas.getByRole('button', { name: 'Foundation.md' })).toBeVisible()
  }
}
