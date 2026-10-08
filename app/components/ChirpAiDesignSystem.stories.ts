import type { Meta, StoryObj } from '@storybook/vue3-vite'
import './chirp-ai-design-system.sandbox.css'
import { expect, userEvent, waitFor } from 'storybook/test'
import ChirpAiDesignSystem from './ChirpAiDesignSystem.vue'
import ChirpAiDesignSystemSandbox from './ChirpAiDesignSystemSandbox.vue'
import cards from '../../content/home-cards.json'

const meta = {
  title: 'Compositions/Showcase cards/Chirp AI Design System',
  component: ChirpAiDesignSystem, tags: ['autodocs'],
  args: { title: cards[3]!.title, subtitle: cards[3]!.subtitle, badges: cards[3]!.badges.split(',').map(x => x.trim()), href: cards[3]!.href },
  parameters: { layout: 'fullscreen', docs: { description: { component: `
[Figma 815:2280](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=815-2280)

<details>
<summary>Техническое описание</summary>

Ширина100%/max430px; высота500px ниже462px,532px от462px. Base <768px / min-768 ≥768px. Пятнадцать исходных слоёв Figma, самостоятельные Default/Hover/ActivePressed и редактор X/Y/Width/Height/Rotation по слою, состоянию и breakpoint. Motion300ms ease-out; press150ms. Reduced motion без переходов. DsBadge и исходные изображения/SVG Figma. Progressive blur — согласованное приближение. Sandbox предотвращает переход в кейс.

</details>
` } } },
} satisfies Meta<typeof ChirpAiDesignSystem>
export default meta
type Story = StoryObj<typeof meta>
export const Sandbox: Story = {
  render: args => ({
    components: { ChirpAiDesignSystemSandbox },
    setup() { return { args } },
    template: `<ChirpAiDesignSystemSandbox :card-args="args" />`,
  }),
  play: async ({ canvas, canvasElement }) => {
    const card = canvas.getByRole('link')
    await waitFor(() => expect(canvas.getByTestId('scene-breakpoint')).toHaveTextContent(window.innerWidth < 768 ? 'base' : 'min-768'))
    await waitFor(() => expect(Math.round(card.getBoundingClientRect().width)).toBe(Math.min(430, canvasElement.querySelector('.chirp-ds-card-sandbox__preview')!.clientWidth)))
    const pict = canvasElement.querySelector<HTMLElement>('.chirp-ds-card__pict')!
    const blurScene = canvasElement.querySelector<HTMLElement>('.chirp-ds-card__blur-scene')!
    await waitFor(() => {
      const matrix = new DOMMatrix(getComputedStyle(pict).transform)
      const expectedScale = window.innerWidth < 768 ? Math.max(1, card.clientWidth / 364.1666564941406) : 1
      expect(matrix.a).toBeCloseTo(expectedScale, 4)
      expect(matrix.d).toBeCloseTo(expectedScale, 4)
      expect(getComputedStyle(blurScene).transform).toBe(getComputedStyle(pict).transform)
    })
    await expect(card).toHaveAttribute('href', cards[3]!.href)
    await expect(canvas.getByRole('heading', { level: 2 })).toHaveTextContent(cards[3]!.title.replace(/\s/g, ' '))
    await expect(canvas.getAllByRole('listitem')).toHaveLength(5)
    const badges = canvasElement.querySelector<HTMLElement>('.chirp-ds-card__badges')!
    await waitFor(() => expect(Math.round(badges.getBoundingClientRect().width)).toBe(Math.round(badges.parentElement!.getBoundingClientRect().width)))
    const phones = canvasElement.querySelectorAll<HTMLImageElement>('.chirp-ds-card__scene img')
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
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      await waitFor(() => {
        for (const name of ['ChatBubble', 'DatePickerBoundary']) {
          const layer = canvasElement.querySelector<HTMLElement>(`.chirp-ds-card__pict [data-layer="${name}"]`)!
          const transitions = layer.getAnimations().map(animation => (animation as CSSTransition).transitionProperty)
          expect(transitions).toEqual(expect.arrayContaining(['left', 'top', 'width', 'height']))
        }
      }, { timeout: 250 })
    }
    await userEvent.click(canvas.getByRole('button', { name: 'ActivePressed', exact: true }))
    await expect(card).toHaveAttribute('data-state', 'ActivePressed')
    if (window.innerWidth < 768 && card.clientWidth > 364.1666564941406) {
      await waitFor(() => {
        const cardRect = card.getBoundingClientRect()
        const left = canvasElement.querySelector<HTMLElement>('.chirp-ds-card__pict [data-layer="ColorBrand"]')!.getBoundingClientRect()
        const right = canvasElement.querySelector<HTMLElement>('.chirp-ds-card__pict [data-layer="Button"]')!.getBoundingClientRect()
        const fillScale = cardRect.width / 364.1666564941406
        expect(left.left - cardRect.left).toBeCloseTo(25.08327865600586 * fillScale / 3, 1)
        expect(cardRect.right - right.right).toBeCloseTo((364.1666564941406 - 339.0832824707031) * fillScale / 3, 1)
        expect(getComputedStyle(blurScene).transform).toBe(getComputedStyle(pict).transform)
      })
    }
    await userEvent.click(canvas.getByRole('button', { name: 'Default', exact: true }))
    await userEvent.clear(xInput)
    await userEvent.type(xInput, String(originalX))
    await waitFor(() => expect(Number(xInput.value)).toBeCloseTo(originalX, 2))
    await userEvent.click(canvas.getByRole('button', { name: 'Interaction', exact: true }))
    await userEvent.unhover(card)
    await waitFor(() => expect(card).toHaveAttribute('data-state', 'Default'))
  },
}
