import type { Meta, StoryObj } from '@storybook/vue3-vite'
import './chirp-ai-medical-brand.sandbox.css'
import { expect, userEvent, waitFor } from 'storybook/test'
import ChirpAiMedicalBrand from './ChirpAiMedicalBrand.vue'
import ChirpAiMedicalBrandSandbox from './ChirpAiMedicalBrandSandbox.vue'
import cards from '../../content/home-cards.json'

const meta = {
  title: 'Compositions/Showcase cards/Chirp AI Medical Brand',
  component: ChirpAiMedicalBrand, tags: ['autodocs'],
  args: { title: cards[2]!.title, subtitle: cards[2]!.subtitle, badges: cards[2]!.badges.split(',').map(x => x.trim()), href: cards[2]!.href },
  parameters: { layout: 'fullscreen', docs: { description: { component: `
[Figma 815:2160](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=815-2160)

<details>
<summary>Техническое описание</summary>

Ширина100%/max430px; высота500px ниже462px,532px от462px. Base <768px / min-768 ≥768px. Шесть исходных слоёв Figma, самостоятельные Default/Hover/ActivePressed и редактор X/Y/Width/Height/Rotation по слою, состоянию и breakpoint. Motion300ms ease-out; press150ms. Reduced motion без переходов. DsBadge и исходные изображения/SVG Figma. Progressive blur — согласованное приближение. Sandbox предотвращает переход в кейс.

</details>
` } } },
} satisfies Meta<typeof ChirpAiMedicalBrand>
export default meta
type Story = StoryObj<typeof meta>
export const Sandbox: Story = {
  render: args => ({
    components: { ChirpAiMedicalBrandSandbox },
    setup() { return { args } },
    template: `<ChirpAiMedicalBrandSandbox :card-args="args" />`,
  }),
  play: async ({ canvas, canvasElement }) => {
    const card = canvas.getByRole('link')
    await waitFor(() => expect(canvas.getByTestId('scene-breakpoint')).toHaveTextContent(window.innerWidth < 768 ? 'base' : 'min-768'))
    await waitFor(() => expect(Math.round(card.getBoundingClientRect().width)).toBe(Math.min(430, canvasElement.querySelector('.chirp-brand-sandbox__preview')!.clientWidth)))
    await expect(card).toHaveAttribute('href', cards[2]!.href)
    await expect(canvas.getByRole('heading', { level: 2 })).toHaveTextContent(cards[2]!.title.replace(/\s/g, ' '))
    await expect(canvas.getAllByRole('listitem')).toHaveLength(7)
    const badges = canvasElement.querySelector<HTMLElement>('.chirp-brand__badges')!
    await waitFor(() => expect(Math.round(badges.getBoundingClientRect().width)).toBe(Math.round(badges.parentElement!.getBoundingClientRect().width)))
    const phones = canvasElement.querySelectorAll<HTMLImageElement>('.chirp-brand__scene img')
    await waitFor(() => { for (const p of phones) expect(p.complete && p.naturalWidth > 0).toBe(true) }, { timeout: 10000 })
    await waitFor(() => expect(card).toHaveAttribute('data-state', 'Default'))
    if (window.matchMedia('(hover: hover)').matches) {
      const pointer = userEvent.setup()
      await userEvent.hover(card)
      await waitFor(() => expect(card).toHaveAttribute('data-state', 'Hover'))
      await pointer.pointer({ target: card, keys: '[MouseLeft>]' })
      await waitFor(() => expect(card).toHaveAttribute('data-state', 'ActivePressed'))
      await expect(card.style.getPropertyValue('--card-duration')).toBe('150ms')
      await pointer.pointer({ target: card, keys: '[/MouseLeft]' })
      await waitFor(() => expect(card).toHaveAttribute('data-state', 'Hover'))
      await expect(card.style.getPropertyValue('--card-duration')).toBe('300ms')
      await userEvent.unhover(card)
      await waitFor(() => expect(card).toHaveAttribute('data-state', 'Default'))
    }
    card.focus()
    await expect(card).toHaveFocus()
    await userEvent.click(canvas.getByRole('button', { name: 'Default', exact: true }))
    await expect(card).toHaveAttribute('data-state', 'Default')
    const xInput = canvas.getByRole('spinbutton', { name: 'X', exact: true }) as HTMLInputElement
    const originalX = Number(xInput.value)
    await userEvent.clear(xInput)
    await userEvent.type(xInput, String(originalX + 10))
    await waitFor(() => expect(Number(xInput.value)).toBeCloseTo(originalX + 10, 2))
    await userEvent.click(canvas.getByRole('button', { name: 'Hover', exact: true }))
    await expect(card).toHaveAttribute('data-state', 'Hover')
    await userEvent.click(canvas.getByRole('button', { name: 'ActivePressed', exact: true }))
    await expect(card).toHaveAttribute('data-state', 'ActivePressed')
    await userEvent.click(canvas.getByRole('button', { name: 'Default', exact: true }))
    await userEvent.clear(xInput)
    await userEvent.type(xInput, String(originalX))
    await waitFor(() => expect(Number(xInput.value)).toBeCloseTo(originalX, 2))
    await userEvent.click(canvas.getByRole('button', { name: 'Interaction', exact: true }))
    await userEvent.unhover(card)
    await waitFor(() => expect(card).toHaveAttribute('data-state', 'Default'))
  },
}
