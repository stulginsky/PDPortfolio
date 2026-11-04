import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, within } from 'storybook/test'
import DsHeader from './DsHeader.vue'
import site from '../../content/site.json'

const meta = {
  title: 'Components/Header',
  component: DsHeader,
  tags: ['autodocs', '!dev'],
  args: { name: site.name, description: site.role + ' ' + site.experience, email: site.email, phone: site.phone, telegramLabel: site.telegramLabel },
  argTypes: {
  "name": {
    "description": "Имя; heading xl / 2xl.",
    "control": {
      "type": "text"
    }
  },
  "description": {
    "description": "Полное описание, переносится без truncate.",
    "control": {
      "type": "text"
    }
  },
  "email": {
    "control": {
      "type": "text"
    }
  },
  "phone": {
    "control": {
      "type": "text"
    }
  },
  "telegramLabel": {
    "control": {
      "type": "text"
    }
  },
  "telegramUrl": {
    "control": {
      "type": "text"
    }
  }
},
  parameters: { layout: 'fullscreen', docs: { description: { component: "Полная шапка с информацией об авторе и навигацией.\n\n<a href=\"https://www.figma.com/design/TPjPitung1VP3oQg42f56O/PDPortfolio-DS?node-id=1021-5460\" target=\"_blank\" rel=\"noopener noreferrer\">Figma</a>" } } },
} satisfies Meta<typeof DsHeader>
export default meta
type Story = StoryObj<typeof meta>

export const Sandbox: Story = {
  tags: ['dev'],
  render: args => ({
    components: { DsHeader },
    setup: () => ({ args }),
    template: '<DsHeader v-bind="args" />',
  }),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement)
    const header = canvasElement.querySelector('header')!
    await expect(c.getByRole('heading', { level: 1 })).toHaveTextContent(site.name)
    await expect(c.getByText(site.email)).toBeVisible()
    await expect(c.getByRole('link', { name: site.email })).toHaveAttribute('href', `mailto:${site.email}`)
    await expect(c.getByRole('link', { name: site.email })).toHaveAttribute('target', '_blank')
    await expect(c.getByRole('link', { name: site.email })).toHaveAttribute('rel', 'noopener noreferrer')
    await expect(c.getByRole('link', { name: site.phone })).toHaveAttribute('href', 'tel:+79258493933')
    await expect(c.getByRole('link', { name: site.telegramLabel })).toHaveAttribute('href', site.telegramUrl)
    await expect(c.getByRole('link', { name: site.telegramLabel })).toHaveAttribute('target', '_blank')
    await expect(c.getByRole('link', { name: site.maxLabel })).toHaveAttribute('href', site.maxUrl)
    await expect(c.getByRole('link', { name: site.maxLabel })).toHaveAttribute('target', '_blank')
    await expect(c.getByRole('link', { name: site.maxLabel })).toHaveAttribute('rel', 'noopener noreferrer')
    await expect(header).not.toHaveAttribute('data-storybook-breakpoint')
  },
}
