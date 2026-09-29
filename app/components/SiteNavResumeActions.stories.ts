import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect } from 'storybook/test'
import SiteNavResumeActions from './SiteNavResumeActions.vue'

const meta = {
  title: 'Compositions/SiteNavResumeActions',
  component: SiteNavResumeActions,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Resume action composition from Figma TopNav and TopNavScroll/Resume. It uses the `Download` and `Print` instances of `DsButtonIcon`.',
      },
    },
  },
} satisfies Meta<typeof SiteNavResumeActions>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: 'Скачать резюме PDF' })).toHaveAttribute('download')
    await expect(canvas.getByRole('button', { name: 'Печать резюме' })).toHaveClass('ds-button-icon')
  },
}
