import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect } from 'storybook/test'
import DsAvatarLg from './DsAvatarLg.vue'

const meta = {
  title: 'Components/Avatar-Lg',
  component: DsAvatarLg,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: "[Avatar-Lg 124:563](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=124-563)\n\n<details>\n<summary>Техническое описание</summary>\n\nFigma [Avatar-Lg 124:563](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=124-563). Static 120×120 author portrait with a 2px `border/default` stroke. The registered local `AvatarPortrait` asset is fixed by the component; it has no public props or interaction states.\n\n</details>",
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
