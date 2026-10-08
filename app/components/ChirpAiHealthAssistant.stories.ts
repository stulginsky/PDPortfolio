import type { Meta, StoryObj } from '@storybook/vue3-vite'
import './chirp-ai-health-assistant.sandbox.css'
import { expect, userEvent, waitFor } from 'storybook/test'
import ChirpAiHealthAssistant from './ChirpAiHealthAssistant.vue'
import ChirpAiHealthAssistantSandbox from './ChirpAiHealthAssistantSandbox.vue'
import cards from '../../content/home-cards.json'

const meta = {
  title: 'Compositions/Showcase cards/Chirp AI health assistant',
  component: ChirpAiHealthAssistant, tags: ['autodocs'],
  args: { title: cards[0]!.title, subtitle: cards[0]!.subtitle, badges: cards[0]!.badges.split(',').map(x => x.trim()), href: cards[0]!.href },
  parameters: { layout: 'fullscreen', docs: { description: { component: `
[Figma 815:2062](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=815-2062)

<details>
<summary>Техническое описание</summary>

Base <768px: reference 264×500. Min-768: reference 430×532. Реальные Default/Hover/ActivePressed, 300ms ease-out; press 150ms. Touch без Hover. Reduced motion отключает переходы. DsBadge и исходные изображения Figma. Согласованное приближение progressive blur: один blur с градиентной маской. Ссылка ведёт в кейс; Sandbox предотвращает переход для проверки анимации. Выбор ширины не подменяет viewport breakpoint.

</details>
` } } },
} satisfies Meta<typeof ChirpAiHealthAssistant>
export default meta
type Story = StoryObj<typeof meta>
export const Sandbox: Story = {
  render: args => ({
    components: { ChirpAiHealthAssistantSandbox },
    setup() { return { args } },
    template: `<ChirpAiHealthAssistantSandbox :card-args="args" />`,
  }),
  play: async ({ canvas, canvasElement }) => {
    const card = canvas.getByRole('link')
    await waitFor(() => expect(canvas.getByTestId('scene-profile')).toHaveTextContent(window.innerWidth < 426 ? 'base-320-425' : window.innerWidth < 768 ? 'base-426-767' : 'min-768'))
    await waitFor(() => expect(Math.round(card.getBoundingClientRect().width)).toBe(Math.min(430, canvasElement.querySelector('.chirp-health-sandbox__preview')!.clientWidth)))
    await expect(card).toHaveAttribute('href', cards[0]!.href)
    await expect(canvas.getByRole('heading', { level: 2 })).toHaveTextContent(cards[0]!.title.replace(/\s/g, ' '))
    await expect(canvas.getAllByRole('listitem')).toHaveLength(6)
    const badges = canvasElement.querySelector<HTMLElement>('.chirp-health__badges')!
    await waitFor(() => expect(Math.round(badges.getBoundingClientRect().width)).toBe(Math.round(badges.parentElement!.getBoundingClientRect().width)))
    const phones = canvasElement.querySelectorAll<HTMLImageElement>('.chirp-health__phone')
    await waitFor(() => { for (const p of phones) expect(p.complete && p.naturalWidth > 0).toBe(true) })
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
