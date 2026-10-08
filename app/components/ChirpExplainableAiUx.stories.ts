import type { Meta, StoryObj } from '@storybook/vue3-vite'
import './chirp-explainable-ai-ux.sandbox.css'
import { expect, userEvent, waitFor } from 'storybook/test'
import ChirpExplainableAiUx from './ChirpExplainableAiUx.vue'
import ChirpExplainableAiUxSandbox from './ChirpExplainableAiUxSandbox.vue'
import cards from '../../content/home-cards.json'

const meta = {
  title: 'Compositions/Showcase cards/Chirp Explainable AI UX',
  component: ChirpExplainableAiUx, tags: ['autodocs'],
  args: { title: cards[1]!.title, subtitle: cards[1]!.subtitle, badges: cards[1]!.badges.split(',').map(x => x.trim()), href: cards[1]!.href },
  parameters: { layout: 'fullscreen', docs: { description: { component: `
[Figma 815:2114](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=815-2114)

<details>
<summary>Техническое описание</summary>

Width100%/max430px; height500px below462px,532px from462px. Base <768px / min-768 ≥768px. phonesUX-v2 — один исходный слой Figma; X/Y/Width/Height/Rotation настраиваются отдельно по состояниям и breakpoint. Реальные Default/Hover/ActivePressed, 300ms ease-out; press 150ms. Touch без Hover. Reduced motion отключает переходы. DsBadge и исходные изображения Figma. Согласованное приближение progressive blur: один blur с градиентной маской. Ссылка ведёт в кейс; Sandbox предотвращает переход для проверки анимации. Выбор ширины не подменяет viewport breakpoint.

</details>
` } } },
} satisfies Meta<typeof ChirpExplainableAiUx>
export default meta
type Story = StoryObj<typeof meta>
export const Sandbox: Story = {
  render: args => ({
    components: { ChirpExplainableAiUxSandbox },
    setup() { return { args } },
    template: `<ChirpExplainableAiUxSandbox :card-args="args" />`,
  }),
  play: async ({ canvas, canvasElement }) => {
    const card = canvas.getByRole('link')
    await waitFor(() => expect(canvas.getByTestId('scene-breakpoint')).toHaveTextContent(window.innerWidth < 768 ? 'base' : 'min-768'))
    await waitFor(() => expect(Math.round(card.getBoundingClientRect().width)).toBe(Math.min(430, canvasElement.querySelector('.chirp-ux-sandbox__preview')!.clientWidth)))
    await expect(card).toHaveAttribute('href', cards[1]!.href)
    await expect(canvas.getByRole('heading', { level: 2 })).toHaveTextContent(cards[1]!.title.replace(/\s/g, ' '))
    await expect(canvas.getAllByRole('listitem')).toHaveLength(6)
    const badges = canvasElement.querySelector<HTMLElement>('.chirp-ux__badges')!
    await waitFor(() => expect(Math.round(badges.getBoundingClientRect().width)).toBe(Math.round(badges.parentElement!.getBoundingClientRect().width)))
    const phones = canvasElement.querySelectorAll<HTMLImageElement>('.chirp-ux__phone')
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
