import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import DsCaseImagePreview from './DsCaseImagePreview.vue'

const media = '/cases/chirp-product/media/P02.svg'
const meta = {
  title: 'Components/CaseImagePreview',
  component: DsCaseImagePreview,
  tags: ['autodocs'],
  args: { title: 'Когда включается Chirp', instance: 'ImgTitle', showZoom: true, onZoom: fn() },
  argTypes: {
    title: { control: 'text', description: 'Заголовок медиа. Переносится при переполнении.' },
    instance: { control: 'select', options: ['ImgTitle', 'ImgTitleToolbar'], description: 'Одна панель: заголовок с лупой либо заголовок с навигацией документов.' },
    showZoom: { control: 'boolean', if: { arg: 'instance', eq: 'ImgTitleToolbar' }, description: 'Видимость лупы только для ImgTitleToolbar.' },
    modelValue: { control: 'select', options: [null, 'overview', 'foundation', 'tokens'], description: 'Выбранное представление toolbar; Figma не меняет выбор.' },
    default: { control: false, description: 'SLOT медиа. Изображение с исходными размерами и alt. Уменьшается до ширины слота, но не увеличивается.' },
    onZoom: { description: 'Запрос потребителю открыть viewer. Preview сам viewer не создаёт.' },
  },
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: "[CaseImagePreview — Figma 1016:9326](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=1016-9326)\n\n<details>\n<summary>Техническое описание</summary>\n\n[CaseImagePreview — Figma 1016:9326](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=1016-9326).\n\nОдна панель и SLOT медиа. Высота Hug по содержимому. Изображение не обрезается и не открывает viewer по клику.\n\n| Оболочка | Отступы top/right/bottom/left | Gap | SLOT |\n| --- | --- | --- | --- |\n| Mob, viewport <1024px | 16/16/32/16 | 24px | доступная ширина, cap 924px |\n| Web, viewport ≥1024px | 32/0/48/0 | 32px | 924px |\n\nМедиа сохраняет исходные размеры; если шире SLOT — пропорционально уменьшается, иначе не растягивается. Центрируется по обеим осям. ImgTitle: Fill при viewport ≤768px, Hug выше; типографика и навигация переключаются независимо при min-768.\n\nМобильный ImgTitleToolbar использует одну строку, если title + текущий trigger + zoom помещаются; иначе занимает две строки и всю доступную ширину. Без лупы заголовок центрируется. Small asset исключён из Sandbox.\n\nEvents: zoom(MouseEvent), select и update:modelValue(overview/foundation/tokens). Потребитель меняет SLOT по выбранному документу. Figma открывается отдельно и сохраняет выбор. Общий Instance swap в Figma не сохраняет независимые defaults breakpoint для Mob/Web; production это ограничение не воспроизводит.\n\n</details>" } },
  },
} satisfies Meta<typeof DsCaseImagePreview>
export default meta
type Story = StoryObj<typeof meta>

export const Sandbox: Story = {
  render: (args) => ({
    components: { DsCaseImagePreview },
    setup() {
      const toolbar = ref(false)
      const showZoom = ref(true)
      const selected = ref<'overview' | 'foundation' | 'tokens' | null>(null)
      const zooms = ref(0)
      const long = ref(false)
      function zoom(event: MouseEvent) { zooms.value++; args.onZoom?.(event) }
      function reset() {
        toolbar.value = false
        showZoom.value = args.showZoom
        selected.value = null
        long.value = false
        zooms.value = 0
      }
      return { args, media, toolbar, showZoom, selected, zooms, long, zoom, reset }
    },
    template: `<div>
      <div style="display:flex;flex-wrap:wrap;gap:8px;padding:16px">
        <label><input type="checkbox" v-model="toolbar" /> Toolbar</label>
        <label v-if="toolbar"><input type="checkbox" v-model="showZoom" /> MagnifyingGlass</label>
        <label><input type="checkbox" v-model="long" /> Long title</label>
        <button type="button" @click="reset">Reset</button>
      </div>
      <DsCaseImagePreview :title="long ? Array(30).fill(args.title).join(' ') : args.title"
        :instance="toolbar ? 'ImgTitleToolbar' : 'ImgTitle'" :show-zoom="showZoom" v-model="selected" @zoom="zoom">
        <img :src="selected === 'foundation' ? '/cases/chirp-product/media/P03.svg' : media"
          alt="Схема сценариев Chirp" />
      </DsCaseImagePreview>
      <p role="status" style="padding:16px">Selected: {{ selected ?? 'none' }} · Zooms: {{ zooms }}</p>
    </div>`,
  }),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByRole('checkbox', { name: 'MagnifyingGlass' })).not.toBeInTheDocument()
    const image = canvas.getByRole('img', { name: 'Схема сценариев Chirp' }) as HTMLImageElement
    await waitFor(() => expect(image.naturalWidth).toBeGreaterThan(0))
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
