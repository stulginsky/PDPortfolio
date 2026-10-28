import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, waitFor } from 'storybook/test'
import ChirpUxHero from './ChirpUxHero.vue'
import ChirpUxHeroSandbox from './ChirpUxHeroSandbox.vue'
import content from '../../content/cases/chirp-ux.json'
import { getHeroBreakpoint } from './chirp-ux-hero.scene-context'

const meta = {
  title: 'Compositions/Case heroes/Chirp-UX-hero',
  component: ChirpUxHero,
  tags: ['autodocs'],
  args: { ...content.hero },
  parameters: { layout: 'fullscreen', docs: { description: { component: `
[Figma 1455:3417](https://www.figma.com/design/TPjPitung1VP3oQg42f56O/PDPortfolio-DS?node-id=1455-3417)

<details><summary>Техническое описание</summary>

Шесть mobile-first профилей, горизонтальная композиция от1024px. Стандартный CaseTitle — оригинальный прозрачный SVG с контурами и тенью Figma; скрытый h1 берёт текст из generated JSON. Другой title в Controls показывает текстовый fallback DS Roboto Flex wght500/YOPQ25. Badge и Role-Focus остаются отдельными DS-компонентами. Слои реагируют на движение курсора/пальца и возвращаются к старту после остановки, даже при удержании пальца. Вязкость замедляет отклик, скорость возврата ускоряет откат; размах = базовое смещение × амплитуда. Числовой шаг0,1. Mobile-вступление и reduced motion сохранены. Role-Focus и HeroTitle неподвижны по умолчанию. Sandbox: reference X/Y, независимые настройки движения и выключатель для каждого слоя; сбросы, локальное сохранение и JSON всех профилей. Старые speed мигрируют в обратную вязкость. Страница кейса не переподключена.

</details>
` } } },
} satisfies Meta<typeof ChirpUxHero>
export default meta
type Story = StoryObj<typeof meta>

export const Sandbox: Story = {
  render: args => ({
    components: { ChirpUxHeroSandbox },
    setup() { return { args } },
    template: '<ChirpUxHeroSandbox :hero-args="args" />',
  }),
  play: async ({ canvas, canvasElement }) => {
    // Raw embed is used to sample production intro/motion without test edits racing it.
    if (new URLSearchParams(window.location.search).get('embed') === 'true') return
    const root = canvasElement.querySelector<HTMLElement>('.chirp-ux-hero')!
    await waitFor(() => expect(root.dataset.breakpoint).toBe(getHeroBreakpoint(window.innerWidth)))
    const spacing = { base: [8, 0, 4], 'min-768': [12, 0, 4], 'min-1024': [1, 4, 4], 'min-1280': [1, 4, 0], 'min-1440': [1, 8, 8], 'min-1920': [1, 8, 8] }[getHeroBreakpoint(window.innerWidth)]!
    const titleStyle = getComputedStyle(root.querySelector('.chirp-ux-hero__title')!)
    const copyStyle = getComputedStyle(root.querySelector('.chirp-ux-hero__copy')!)
    expect(parseFloat(titleStyle.rowGap)).toBe(spacing[0])
    expect(parseFloat(copyStyle.paddingLeft)).toBe(spacing[1])
    expect(parseFloat(copyStyle.paddingRight)).toBe(spacing[2])
    await waitFor(() => {
      const images = [...root.querySelectorAll<HTMLImageElement>('img')].filter(image => !image.closest('[data-scene-fallback]'))
      expect(images.length).toBe(6)
      for (const image of images) expect(image.complete && image.naturalWidth > 0).toBe(true)
    })
    await expect(canvas.getByRole('heading', { level: 1 })).toHaveTextContent(content.hero.title.replace(/\s/g, ' '))
    const roleValue = root.querySelector('.ds-role-focus__value')!
    await expect(roleValue).toBeVisible()
    await expect(roleValue).toHaveTextContent(content.hero.role.replace(/\s/g, ' '))
    await userEvent.click(canvas.getByRole('button', { name: 'Neutral', exact: true }))
    const select = canvas.getByRole('combobox', { name: 'Слой', exact: true })
    await userEvent.selectOptions(select, '0')
    const toggle = canvas.getByRole('checkbox', { name: 'Анимация слоя' }) as HTMLInputElement
    const originalEnabled = toggle.checked
    if (!originalEnabled) await userEvent.click(toggle)
    const amplitude = canvas.getByRole('spinbutton', { name: 'Амплитуда ×' }) as HTMLInputElement
    const originalAmplitude = amplitude.value
    await userEvent.clear(amplitude)
    await userEvent.type(amplitude, '2')
    await userEvent.selectOptions(select, '1')
    await userEvent.selectOptions(select, '0')
    expect(amplitude.value).toBe('2')
    const baseOffset = canvas.getByRole('spinbutton', { name: 'Базовое смещение, px' }) as HTMLInputElement
    const originalBaseOffset = baseOffset.value
    await userEvent.clear(baseOffset)
    await userEvent.type(baseOffset, '20')
    await userEvent.selectOptions(select, '1')
    await userEvent.selectOptions(select, '0')
    expect(baseOffset.value).toBe('20')
    await userEvent.clear(baseOffset)
    await userEvent.type(baseOffset, originalBaseOffset)
    await userEvent.clear(amplitude)
    await userEvent.type(amplitude, originalAmplitude)
    const x = canvas.getByRole('spinbutton', { name: 'X', exact: true }) as HTMLInputElement
    const originalX = x.value
    await userEvent.clear(x)
    await userEvent.type(x, '20')
    await userEvent.selectOptions(select, '2')
    await userEvent.selectOptions(select, '0')
    await expect(x.value).toBe('20')
    if (toggle.checked) await userEvent.click(toggle)
    await expect(canvas.getByRole('spinbutton', { name: 'Вязкость ×' })).toBeDisabled()
    await expect(canvas.getByRole('spinbutton', { name: 'Скорость возврата ×' })).toBeDisabled()
    await userEvent.click(canvas.getByRole('button', { name: 'Interaction', exact: true }))
    window.dispatchEvent(new PointerEvent('pointermove', { pointerType: 'mouse', clientX: window.innerWidth }))
    await waitFor(() => expect(root.querySelector<HTMLElement>('[data-layer]')!.style.getPropertyValue('--parallax-x')).toBe('0px'))
    await userEvent.click(canvas.getByRole('button', { name: 'Копировать JSON' }))
    const exported = JSON.parse((canvas.getByRole('textbox', { name: 'JSON всех профилей' }) as HTMLTextAreaElement).value)
    expect(exported.component).toBe('ChirpUxHero')
    expect(Object.keys(exported.scenes)).toHaveLength(6)
    expect(exported.scenes[root.dataset.breakpoint!]).toHaveLength(5)
    expect(exported.scenes[root.dataset.breakpoint!][0].x).toBe(20)
    expect(exported.scenes[root.dataset.breakpoint!][0].viscosity).toBeGreaterThanOrEqual(.1)
    expect(exported.scenes[root.dataset.breakpoint!][0].returnSpeed).toBeGreaterThanOrEqual(.1)
    expect(exported.scenes[root.dataset.breakpoint!][0].speed).toBeUndefined()
    canvasElement.querySelectorAll<HTMLInputElement>('input[type="number"]').forEach(input => expect(input.step).toBe('0.1'))
    await userEvent.clear(x)
    await userEvent.type(x, originalX)
    if (originalEnabled) await userEvent.click(toggle)
    await userEvent.click(canvas.getByRole('button', { name: 'Скрыть JSON' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Interaction', exact: true }))
  },
}
