import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, waitFor } from 'storybook/test'
import ChirpPrHero from './ChirpPrHero.vue'
import ChirpPrHeroSandbox from './ChirpPrHeroSandbox.vue'
import content from '../../content/cases/chirp-product.json'
import { getHeroBreakpoint, createHeroDraft } from './chirp-pr-hero.scene-context'

const meta = {
  title: 'Compositions/Case heroes/Chirp-Pr-hero',
  component: ChirpPrHero,
  tags: ['autodocs', '!dev'],
  args: { title: content.hero.title, badge: content.hero.badge },
  parameters: { layout: 'fullscreen', docs: { description: { component: "Первый экран кейса: знакомит с проектом и задаёт его визуальный контекст.\n\n<a href=\"https://www.figma.com/design/TPjPitung1VP3oQg42f56O/PDPortfolio-DS?node-id=1003-4914\" target=\"_blank\" rel=\"noopener noreferrer\">Figma</a>" } } },

  } satisfies Meta<typeof ChirpPrHero>
export default meta
type Story = StoryObj<typeof meta>

export const Preview: Story = {
  render: args => ({ components: { ChirpPrHero }, setup: () => ({ args }), template: "<ChirpPrHero v-bind=\"args\" />" }),
}

export const Sandbox: Story = {
  tags: ['dev'],
  render: args => ({
    components: { ChirpPrHeroSandbox },
    setup() { return { args } },
    template: '<ChirpPrHeroSandbox :hero-args="args" />',
  }),
  play: async ({ canvas, canvasElement }) => {
    if (new URLSearchParams(window.location.search).get('embed') === 'true') return
    const presets = createHeroDraft()
    expect(presets.base[1]!.introDirection).toBe(1)
    expect(presets.base[3]!.introDirection).toBe(-1)
    expect(presets['min-1920'][1]!.viscosity).toBe(10)
    expect(presets['min-1920'][1]!.returnSpeed).toBe(.3)
    expect(presets['min-1920'][2]!.viscosity).toBe(6)
    expect(presets['min-1920'][2]!.returnSpeed).toBe(.5)
    for (const [bp, layers] of Object.entries(presets)) {
      expect(layers[1]!.viscosity).toBe(10)
      expect(layers[1]!.returnSpeed).toBe(.3)
      expect(layers[2]!.viscosity).toBe(6)
      expect(layers[2]!.returnSpeed).toBe(.5)
      const mobile = bp === 'base' || bp === 'min-768'
      expect(layers[0]!.amplitude).toBe(mobile ? .5 : 1)
      expect(layers[3]!.viscosity).toBe(mobile ? 3 : 1)
      expect(layers[3]!.returnSpeed).toBe(mobile ? .1 : 6)
      expect(layers[3]!.animationEnabled).toBe(mobile)
    }
    const root = canvasElement.querySelector<HTMLElement>('.chirp-pr-hero')!
    await waitFor(() => expect(root.dataset.ready).toBe('true'))
    expect(root.querySelectorAll('.ds-role-focus')).toHaveLength(1)
    await waitFor(() => expect(root.dataset.breakpoint).toBe(getHeroBreakpoint(window.innerWidth)))
    await waitFor(() => {
      const images = [...canvasElement.querySelectorAll<HTMLImageElement>('.chirp-pr-hero img')].filter(image => !image.closest('[data-scene-fallback]'))
      expect(images.length).toBe(6)
      for (const image of images) expect(image.complete && image.naturalWidth > 0).toBe(true)
    })
    await expect(canvas.getByRole('heading', { level: 1 })).toHaveTextContent(content.hero.title.replace(/\s/g, ' '))
    const roleBlock = root.querySelector<HTMLElement>('.ds-role-focus')!
    await expect(roleBlock).toBeVisible()
    if (window.innerWidth >= 768) {
      const label = roleBlock.querySelectorAll('.ds-role-focus__label')[1]!
      const range = document.createRange()
      range.selectNodeContents(label)
      const expectedLeft = root.getBoundingClientRect().left + (root.clientWidth - roleBlock.getBoundingClientRect().width) / 2
      expect(Math.abs(range.getBoundingClientRect().left - expectedLeft)).toBeLessThan(.2)
    }
    await expect(roleBlock).toHaveTextContent(content.hero.role.replace(/\s/g, ' '))
    const focusItems = roleBlock.querySelectorAll('.ds-role-focus__row')[1]!.querySelectorAll('.ds-role-focus__item')
    expect(focusItems).toHaveLength(5)
    expect(focusItems[4]).toHaveTextContent('AI Product Design')
    expect(roleBlock.classList.contains('ds-role-focus--base')).toBe(window.innerWidth < 768)
    await userEvent.click(canvas.getByRole('button', { name: 'Neutral', exact: true }))
    const x = canvas.getByRole('spinbutton', { name: 'X', exact: true }) as HTMLInputElement
    const originalX = x.value
    const y = canvas.getByRole('spinbutton', { name: 'Y', exact: true }) as HTMLInputElement
    const viscosity = canvas.getByRole('spinbutton', { name: 'Вязкость ×' }) as HTMLInputElement
    const direction = canvas.getByRole('combobox', { name: 'Направление вступления' }) as HTMLSelectElement
    const original = { y: y.value, viscosity: viscosity.value, direction: direction.value, enabled: (canvas.getByRole('checkbox', { name: 'Анимация слоя' }) as HTMLInputElement).checked }
    await userEvent.clear(x)
    await userEvent.type(x, '20')
    await waitFor(() => expect(x.value).toBe('20'))
    const layerSelect = canvas.getByRole('combobox', { name: 'Слой', exact: true })
    await userEvent.selectOptions(layerSelect, '1')
    await userEvent.selectOptions(layerSelect, '0')
    await expect(x.value).toBe('20')
    const enabled = canvas.getByRole('checkbox', { name: 'Анимация слоя' })
    if ((enabled as HTMLInputElement).checked) await userEvent.click(enabled)
    await expect(canvas.getByRole('spinbutton', { name: 'Вязкость ×' })).toBeDisabled()
    const first = root.querySelector<HTMLElement>('[data-layer]')!
    await expect(first).toHaveAttribute('data-animation-enabled', 'false')
    await userEvent.click(canvas.getByRole('button', { name: 'Interaction', exact: true }))
    window.dispatchEvent(new PointerEvent('pointermove', { pointerType: 'mouse', clientX: window.innerWidth }))
    await waitFor(() => expect(first.style.getPropertyValue('--parallax-x')).toBe('0px'))
    await userEvent.click(canvas.getByRole('button', { name: 'Neutral', exact: true }))
    await userEvent.click(canvas.getByRole('button', { name: 'Копировать JSON' }))
    const json = canvas.getByRole('textbox', { name: 'JSON всех профилей' }) as HTMLTextAreaElement
    const exported = JSON.parse(json.value)
    expect(exported.version).toBe(2)
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
    await userEvent.clear(viscosity)
    await userEvent.type(viscosity, original.viscosity)
    await userEvent.selectOptions(direction, original.direction)
    if (!original.enabled) await userEvent.click(enabled)
    await userEvent.click(canvas.getByRole('button', { name: 'Interaction', exact: true }))
  },
}
