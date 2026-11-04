import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect } from 'storybook/test'
import SiteNavResumeActions from './SiteNavResumeActions.vue'

const meta = {
  title: 'Compositions/SiteNavResumeActions',
  component: SiteNavResumeActions,
  tags: ['autodocs', '!dev'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: "Действия скачивания и печати резюме.",
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
    const download = canvas.getByRole('link', { name: 'Скачать резюме PDF' })
    const print = canvas.getByRole('button', { name: 'Печать резюме' })
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      await expect(getComputedStyle(download).animationDuration).toBe('0.3s')
      await expect(getComputedStyle(download).animationDelay).toBe('0.1s')
      await expect(getComputedStyle(print).animationDelay).toBe('0.2s')
    }
    await Promise.all(
      [download, print].flatMap((element) => element.getAnimations().map((animation) => animation.finished)),
    )
    await expect(getComputedStyle(download).opacity).toBe('1')
    await expect(getComputedStyle(print).opacity).toBe('1')
  },
}
