import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect } from 'storybook/test'
import DsAvatarLg from './DsAvatarLg.vue'

const meta = {
  title: 'Components/Avatar-Lg',
  component: DsAvatarLg,
  tags: ['autodocs', '!dev'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: "Крупный портрет автора для полной шапки страницы.\n\n<a href=\"https://www.figma.com/design/TPjPitung1VP3oQg42f56O/PDPortfolio-DS?node-id=124-563\" target=\"_blank\" rel=\"noopener noreferrer\">Figma</a>",
      },
    },
  },
} satisfies Meta<typeof DsAvatarLg>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const photo = canvasElement.querySelector('.ds-avatar-lg__photo')
    await expect(photo).toHaveAttribute('alt', '')
    await expect(photo).toHaveAttribute('src')
  },
}
