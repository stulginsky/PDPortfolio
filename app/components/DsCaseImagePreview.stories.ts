import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref, watch } from 'vue'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import DsCaseImagePreview from './DsCaseImagePreview.vue'
import '../assets/css/case-preview-surface.css'

const media = '/cases/chirp-product/media/P02.svg'
const meta = {
  title: 'Components/CaseImagePreview',
  component: DsCaseImagePreview,
  tags: ['autodocs'],
  args: { title: 'Когда включается Chirp', type: 'v1', instance: 'ImgTitle', showZoom: true, onZoom: fn() },
  argTypes: {
    type: { control: 'inline-radio', options: ['v1', 'v2'], description: 'v1 — заголовок над медиа; v2 — круглая лупа поверх медиа, без внешних отступов и лимита 924px.' },
    title: { control: 'text', description: 'Заголовок медиа. Переносится при переполнении.' },
    instance: { control: 'select', options: ['ImgTitle', 'ImgTitleToolbar'], description: 'Одна панель: заголовок с лупой либо заголовок с навигацией документов.' },
    showZoom: { control: 'boolean', if: { arg: 'instance', eq: 'ImgTitleToolbar' }, description: 'Видимость лупы только для ImgTitleToolbar.' },
    modelValue: { control: 'select', options: [null, 'overview', 'foundation', 'tokens'], description: 'Выбранное представление toolbar; Figma не меняет выбор.' },
    default: { control: false, description: 'SLOT медиа. Изображение с исходными размерами и alt. Уменьшается до ширины слота, но не увеличивается.' },
    onZoom: { description: 'Запрос потребителю открыть viewer. Preview сам viewer не создаёт.' },
  },
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: `[CaseImagePreview v1 — Figma](https://www.figma.com/design/TPjPitung1VP3oQg42f56O/PDPortfolio-DS?node-id=1016-9326) · [v2 — Figma](https://www.figma.com/design/TPjPitung1VP3oQg42f56O/PDPortfolio-DS?node-id=3131-2596)

Оба компонента прозрачные: фон задаёт родитель. В существующих v1-композициях обычная обёртка с классом case-preview-surface сохраняет прежний Mob/Web градиент. Sandbox позволяет менять фон родителя независимо от типа Preview.

<details><summary>Техническое описание</summary>

v1 сохраняет панель ImgTitle/ImgTitleToolbar, отступы и cap 924px. v2 — центрированная круглая лупа 128px, без внешних отступов и cap; прямоугольный фрейм без скруглений с Clip content как в Figma. Высота обоих типов определяется содержимым, пропорции изображения сохраняются. Клик по изображению Viewer не открывает.

| v1 | Отступы top/right/bottom/left | Gap | SLOT |
| --- | --- | --- | --- |
| Mob, viewport <1024px | 16/16/32/16 | 24px | доступная ширина, cap 924px |
| Web, viewport ≥1024px | 32/0/48/0 | 32px | 924px |

Медиа сохраняет исходные размеры, пропорционально уменьшается до SLOT и не растягивается сверх оригинала. ImgTitle: Fill до768px включительно, Hug выше. Внутренняя типографика и навигация переключаются независимо при min-768. Toolbar переносится по вместимости, без лупы заголовок центрируется. Общий Instance swap Figma не воспроизводится как ограничение production-адаптива.

Публичные props и события прежние: zoom(MouseEvent), select и update:modelValue(overview/foundation/tokens). Выбор документа обновляет SLOT; Figma открывается отдельно, сохраняя выбор. Внутренние поверхности панелей, кнопок, эффекты и взаимодействия не меняются.

</details>` } },
  },
} satisfies Meta<typeof DsCaseImagePreview>
export default meta
type Story = StoryObj<typeof meta>

export const Overlay: Story = {
  args: { type: 'v2' },
  render: args => ({ components: { DsCaseImagePreview }, setup: () => ({ args, media }), template: '<div style="background:var(--accent-lavender)"><DsCaseImagePreview v-bind="args"><img :src="media" alt="Схема сценариев Chirp" /></DsCaseImagePreview></div>' }),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: /Увеличить изображение/ })
    const root = canvasElement.querySelector('.ds-case-image-preview')!
    const control = button.closest('.ds-img-title')!
    await expect(root).toHaveClass('ds-case-image-preview--v2')
    await expect(getComputedStyle(root).padding).toBe('0px')
    await expect(getComputedStyle(root).backgroundColor).toBe('rgba(0, 0, 0, 0)')
    await expect(getComputedStyle(root).backgroundImage).toBe('none')
    await expect(getComputedStyle(root).borderRadius).toBe('0px')
    await expect(getComputedStyle(root).overflow).toBe('hidden')
    await expect(control.getBoundingClientRect().width).toBe(128)
    await expect(canvasElement.querySelector('.ds-case-image-preview__panel')).toBeNull()
    await userEvent.click(button)
    await expect(args.onZoom).toHaveBeenCalledTimes(1)
  },
}

export const Sandbox: Story = {
  render: (args) => ({
    components: { DsCaseImagePreview },
    setup() {
      const type = ref<'v1' | 'v2'>(args.type ?? 'v1')
      watch(() => args.type, value => { type.value = value ?? 'v1' })
      const surface = ref<'legacy' | 'default' | 'lavender'>(type.value === 'v1' ? 'legacy' : 'default')
      watch(type, value => { surface.value = value === 'v1' ? 'legacy' : 'default' })
      const toolbar = ref(false)
      const showZoom = ref(true)
      const selected = ref<'overview' | 'foundation' | 'tokens' | null>(null)
      const zooms = ref(0)
      const long = ref(false)
      function zoom(event: MouseEvent) { zooms.value++; args.onZoom?.(event) }
      function reset() {
        type.value = args.type ?? 'v1'
        surface.value = type.value === 'v1' ? 'legacy' : 'default'
        toolbar.value = false
        showZoom.value = args.showZoom
        selected.value = null
        long.value = false
        zooms.value = 0
      }
      return { args, media, type, surface, toolbar, showZoom, selected, zooms, long, zoom, reset }
    },
    template: `<div>
      <div style="display:flex;flex-wrap:wrap;gap:8px;padding:16px">
        <label>Тип <select aria-label="Тип Preview" v-model="type"><option value="v1">v1 — панель</option><option value="v2">v2 — лупа поверх медиа</option></select></label>
        <label>Фон родителя <select aria-label="Фон родителя" v-model="surface"><option value="legacy">Прежний градиент</option><option value="default">Surface/default</option><option value="lavender">Accent/lavender</option></select></label>
        <label v-if="type === 'v1'"><input type="checkbox" v-model="toolbar" /> Toolbar</label>
        <label v-if="type === 'v1' && toolbar"><input type="checkbox" v-model="showZoom" /> MagnifyingGlass</label>
        <label><input type="checkbox" v-model="long" /> Long title</label>
        <button type="button" @click="reset">Reset</button>
      </div>
      <div data-preview-surface :class="{'case-preview-surface':surface === 'legacy'}" :style="surface === 'legacy' ? undefined : {background:surface === 'lavender' ? 'var(--accent-lavender)' : 'var(--surface-default)'}">
        <DsCaseImagePreview :type="type" :title="long ? Array(30).fill(args.title).join(' ') : args.title"
          :instance="toolbar ? 'ImgTitleToolbar' : 'ImgTitle'" :show-zoom="showZoom" v-model="selected" @zoom="zoom">
          <img :src="selected === 'foundation' ? '/cases/chirp-product/media/P03.svg' : media"
            alt="Схема сценариев Chirp" />
        </DsCaseImagePreview>
      </div>
      <p role="status" style="padding:16px">Selected: {{ selected ?? 'none' }} · Zooms: {{ zooms }}</p>
    </div>`,
  }),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByRole('checkbox', { name: 'MagnifyingGlass' })).not.toBeInTheDocument()
    const image = await canvas.findByRole('img', { name: 'Схема сценариев Chirp' }) as HTMLImageElement
    await waitFor(() => expect(image.naturalWidth).toBeGreaterThan(0))
    const root = canvasElement.querySelector('.ds-case-image-preview')!
    await expect(getComputedStyle(root).backgroundColor).toBe('rgba(0, 0, 0, 0)')
    await expect(getComputedStyle(root).backgroundImage).toBe('none')
    await expect(getComputedStyle(root.parentElement!).backgroundImage).toContain('linear-gradient')
    await expect(image.getBoundingClientRect().width).toBeLessThanOrEqual(924)
    await userEvent.click(image)
    await expect(args.onZoom).not.toHaveBeenCalled()
    await userEvent.click(canvas.getByRole('button', { name: /Увеличить изображение/ }))
    await expect(canvas.getByRole('status')).toHaveTextContent('Zooms: 1')
    await expect(args.onZoom).toHaveBeenCalledTimes(1)
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Long title' }))
    await expect(canvasElement.querySelector('.ds-img-title')!.getBoundingClientRect().height).toBeGreaterThan(74)
    await expect(canvasElement.querySelector('.ds-img-title')!.getBoundingClientRect().width).toBeLessThanOrEqual(924)
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Long title' }))
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Toolbar', exact: true }))
    await waitFor(() => expect(canvasElement.querySelector('.ds-img-title-toolbar')).not.toBeNull())
    await expect(canvas.getByRole('checkbox', { name: 'MagnifyingGlass' })).toBeInTheDocument()
    if (!canvas.queryByRole('button', { name: 'Foundation.md', exact: true })) {
      await userEvent.click(canvas.getByRole('button', { name: /^(Overview · Docs · Figma|Выбрать материал)$/ }))
    }
    await userEvent.click(within(document.body).getByRole('button', { name: 'Foundation.md', exact: true }))
    await expect(canvas.getByRole('status')).toHaveTextContent('Selected: foundation')
    await expect(image).toHaveAttribute('src', '/cases/chirp-product/media/P03.svg')
    await userEvent.click(canvas.getByRole('checkbox', { name: 'MagnifyingGlass' }))
    await expect(canvas.queryByRole('button', { name: /Увеличить изображение/ })).not.toBeInTheDocument()
    await expect(getComputedStyle(canvasElement.querySelector('.ds-img-title-toolbar__title')!).textAlign).toBe('center')
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Long title' }))
    const assertToolbarBounds = () => {
      const root = canvasElement.querySelector('.ds-img-title-toolbar')! as HTMLElement
      const heading = root.querySelector('.ds-img-title-toolbar__title')! as HTMLElement
      const menu = root.querySelector('.ds-img-title-toolbar__menu')! as HTMLElement
      expect(heading.scrollWidth).toBeLessThanOrEqual(heading.clientWidth + 1)
      expect(root.getBoundingClientRect().width).toBeLessThanOrEqual(Math.min(924, root.parentElement!.clientWidth))
      if (window.innerWidth >= 768) {
        expect(heading.getBoundingClientRect().right + 11).toBeLessThanOrEqual(menu.getBoundingClientRect().left)
      }
    }
    await waitFor(assertToolbarBounds)
    await userEvent.click(canvas.getByRole('checkbox', { name: 'MagnifyingGlass' }))
    await waitFor(assertToolbarBounds)
    await expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(window.innerWidth)
    await userEvent.click(canvas.getByRole('button', { name: 'Reset', exact: true }))
    await expect(canvas.getByRole('status')).toHaveTextContent('Selected: none · Zooms: 0')
    await expect(canvas.queryByRole('checkbox', { name: 'MagnifyingGlass' })).not.toBeInTheDocument()
  },
}
