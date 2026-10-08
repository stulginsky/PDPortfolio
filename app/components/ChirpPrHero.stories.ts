import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, waitFor } from 'storybook/test'
import ChirpPrHero from './ChirpPrHero.vue'
import ChirpPrHeroSandbox from './ChirpPrHeroSandbox.vue'
import content from '../../content/cases/chirp-product.json'
import { getHeroBreakpoint, createHeroDraft } from './chirp-pr-hero.scene-context'

const meta = {
  title: 'Compositions/Case heroes/Chirp-Pr-hero',
  component: ChirpPrHero,
  tags: ['autodocs'],
  args: { title: content.hero.title, badge: content.hero.badge },
  parameters: { layout: 'fullscreen', docs: { description: { component: `
[Figma 1003:4914](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=1003-4914)

<details><summary>Техническое описание</summary>

Шесть mobile-first профилей. Вертикальная композиция до 1024px; desktop от min-1024. Оригинальные слои Figma, DS Roboto Flex wght500/YOPQ25 и Badge/HeroChirp. Pointer-driven параллакс, mobile-вступление, reduced motion. В Sandbox — X/Y reference, скорость, направление вступления и включение анимации каждого слоя. Черновик сохраняется локально; JSON содержит все профили. Страница кейса пока не переподключена.

</details>
` } } },
} satisfies Meta<typeof ChirpPrHero>
export default meta
type Story = StoryObj<typeof meta>

export const Sandbox: Story = {
  render: args => ({
    components: { ChirpPrHeroSandbox },
    setup() { return { args } },
    template: '<ChirpPrHeroSandbox :hero-args="args" />',
  }),
  play: async ({ canvas, canvasElement }) => {
    const root = canvasElement.querySelector<HTMLElement>('.chirp-pr-hero')!
    await waitFor(() => expect(root.dataset.breakpoint).toBe(getHeroBreakpoint(window.innerWidth)))
    await waitFor(() => {
      const images = canvasElement.querySelectorAll<HTMLImageElement>('.chirp-pr-hero img')
      expect(images.length).toBe(5)
      for (const image of images) expect(image.complete && image.naturalWidth > 0).toBe(true)
    })
    await expect(canvas.getByRole('heading', { level: 1 })).toHaveTextContent(content.hero.title.replace(/\s/g, ' '))
    await userEvent.click(canvas.getByRole('button', { name: 'Neutral', exact: true }))
    const x = canvas.getByRole('spinbutton', { name: 'X', exact: true }) as HTMLInputElement
    const originalX = x.value
    const y = canvas.getByRole('spinbutton', { name: 'Y', exact: true }) as HTMLInputElement
    const speed = canvas.getByRole('spinbutton', { name: 'Скорость ×' }) as HTMLInputElement
    const direction = canvas.getByRole('combobox', { name: 'Направление вступления' }) as HTMLSelectElement
    const original = { y: y.value, speed: speed.value, direction: direction.value, enabled: (canvas.getByRole('checkbox', { name: 'Анимация слоя' }) as HTMLInputElement).checked }
    await userEvent.clear(x)
    await userEvent.type(x, '20')
    await waitFor(() => expect(x.value).toBe('20'))
    const layerSelect = canvas.getByRole('combobox', { name: 'Слой', exact: true })
    await userEvent.selectOptions(layerSelect, '1')
    await userEvent.selectOptions(layerSelect, '0')
    await expect(x.value).toBe('20')
    const enabled = canvas.getByRole('checkbox', { name: 'Анимация слоя' })
    if ((enabled as HTMLInputElement).checked) await userEvent.click(enabled)
    await expect(canvas.getByRole('spinbutton', { name: 'Скорость ×' })).toBeDisabled()
    const first = root.querySelector<HTMLElement>('[data-layer]')!
    await expect(first).toHaveAttribute('data-animation-enabled', 'false')
    await userEvent.click(canvas.getByRole('button', { name: 'Interaction', exact: true }))
    window.dispatchEvent(new PointerEvent('pointermove', { pointerType: 'mouse', clientX: window.innerWidth }))
    await waitFor(() => expect(first.style.getPropertyValue('--parallax-x')).toBe('0px'))
    await userEvent.click(canvas.getByRole('button', { name: 'Neutral', exact: true }))
    await userEvent.click(canvas.getByRole('button', { name: 'Копировать JSON' }))
    const json = canvas.getByRole('textbox', { name: 'JSON всех профилей' }) as HTMLTextAreaElement
    const exported = JSON.parse(json.value)
    expect(exported.version).toBe(1)
    expect(Object.keys(exported.scenes)).toHaveLength(6)
    expect(exported.scenes[root.dataset.breakpoint!][0].x).toBe(20)
    expect(exported.scenes[root.dataset.breakpoint!][0].animationEnabled).toBe(false)
    await userEvent.click(canvas.getByRole('button', { name: 'Сбросить слой', exact: true }))
    await waitFor(() => expect(x.value).toBe(String(createHeroDraft()[getHeroBreakpoint(window.innerWidth)][0]!.x)))
    await expect(enabled).toBeChecked()
    // Return this browser-test draft to its original X; user sandbox storage is a separate context.
    await userEvent.clear(x)
    await userEvent.type(x, originalX)
    await userEvent.clear(y)
    await userEvent.type(y, original.y)
    await userEvent.clear(speed)
    await userEvent.type(speed, original.speed)
    await userEvent.selectOptions(direction, original.direction)
    if (!original.enabled) await userEvent.click(enabled)
    await userEvent.click(canvas.getByRole('button', { name: 'Interaction', exact: true }))
  },
}
