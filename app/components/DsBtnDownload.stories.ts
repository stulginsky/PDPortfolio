import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn } from 'storybook/test'
import DsButtonIcon from './DsButtonIcon.vue'

const meta = {
  title: 'Components/BtnDownload',
  component: DsButtonIcon,
  tags: ['autodocs', '!dev'],
  args: { icon: 'Download', ariaLabel: 'Скачать', raised: false, toggled: false, pressedAppearance: 'ActivePressed', onClick: fn() },
  argTypes: {
  "icon": {
    "control": false
  },
  "raised": {
    "control": false
  },
  "toggled": {
    "control": false
  },
  "pressedAppearance": {
    "control": false
  }
},
  parameters: {
    layout: 'centered',
    docs: { description: { component: "Кнопка действия «Скачать».\n\n<a href=\"https://www.figma.com/design/TPjPitung1VP3oQg42f56O/PDPortfolio-DS?node-id=1258-8979\" target=\"_blank\" rel=\"noopener noreferrer\">Figma</a>" } },
  },
} satisfies Meta<typeof DsButtonIcon>
export default meta
type Story = StoryObj<typeof meta>

export const Sandbox: Story = {
  play: async ({ canvas, args, userEvent }) => {
    const button = canvas.getByRole('button', { name: 'Скачать', exact: true })
    await userEvent.hover(button)
    await userEvent.pointer({ target: button, keys: '[MouseLeft>]' })
    await expect(button).not.toHaveAttribute('aria-pressed')
    await userEvent.pointer({ target: button, keys: '[/MouseLeft]' })
    await expect(args.onClick).toHaveBeenCalledTimes(1)
    await userEvent.unhover(button)
    button.focus()
    await userEvent.keyboard('{Enter}')
    await expect(args.onClick).toHaveBeenCalledTimes(2)
  },
}

