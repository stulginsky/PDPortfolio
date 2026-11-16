import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, waitFor } from 'storybook/test'
import LIDPortDsHero from './LIDPortDsHero.vue'
import LIDPortDsHeroSandbox from './LIDPortDsHeroSandbox.vue'
import { getLidPortHeroBreakpoint } from './lidport-ds-hero.scene-context'

const args = {
  title: 'Diller’s Portal Design System',
  role: 'Design System Designer · Product Designer',
  focus: 'Design System Architecture · Design Tokens · UI Foundations · Component Architecture · Figma Library',
  panelAppearance: 'default' as const,
}

const meta = {
  title: 'Compositions/Case heroes/LIDPort-Ds-hero',
  component: LIDPortDsHero,
  tags: ['autodocs', '!dev'],
  args,
  argTypes: {
    breakpoint: { options: ['base', 'min-768', 'min-1024', 'min-1280', 'min-1440', 'min-1920'], control: 'radio' },
    panelAppearance: { options: ['default', 'on-light', 'on-dark'], control: 'radio' },
    title: { control: 'text' }, role: { control: 'text' }, focus: { control: 'text' },
  },
  parameters: { layout: 'fullscreen', docs: { description: { component: '<a href="https://www.figma.com/design/TPjPitung1VP3oQg42f56O/PDPortfolio-DS?node-id=3748-2421" target="_blank" rel="noopener noreferrer">Figma</a>\n\nПервый экран кейса LIDPort. Логотип и SVG-заголовок — отдельные слои с независимыми координатами и motion-профилями; runtime-механика общая с ChirpDsHero.' } } },
} satisfies Meta<typeof LIDPortDsHero>

export default meta
type Story = StoryObj<typeof meta>

export const Preview: Story = {}

export const Sandbox: Story = {
  tags: ['dev'],
  argTypes: { breakpoint: { control: false } },
  render: storyArgs => ({ components: { LIDPortDsHeroSandbox }, setup: () => ({ storyArgs }), template: '<LIDPortDsHeroSandbox :hero-args="storyArgs" />' }),
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector<HTMLElement>('.lidport-ds-hero')!
    await waitFor(() => expect(root.dataset.breakpoint).toBe(getLidPortHeroBreakpoint(window.innerWidth)))
    await waitFor(() => expect(root.dataset.mediaState).toBe('ready'))
    await expect(root.querySelector('h1')).toHaveTextContent(args.title)
    await expect(root.querySelectorAll('.ds-role-focus')).toHaveLength(1)
    await expect(root.querySelector('[data-layer="LadaImage-logo"] img')).toHaveAttribute('src', expect.stringContaining('lada-image-logo.svg'))
    await expect(root.querySelector('[data-layer="Diller’s Portal Design System"] img')).toHaveAttribute('src', expect.stringContaining('dillers-portal-design-system.svg'))
    await expect(canvasElement.querySelectorAll('.hero-sandbox__editor option')).toHaveLength(10)
  },
}
