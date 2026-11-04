import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { computed, ref, watch } from 'vue'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import DsCaseImagePreview from './DsCaseImagePreview.vue'
import { siteUrl } from '../utils/site-url'
import '../assets/css/case-preview-surface.css'

const media = siteUrl('/cases/chirp-product/media/P02.svg')
const foundationMedia = siteUrl('/cases/chirp-product/media/P03.svg')
const backgroundOptions = [
  { value: 'legacy', label: 'Градиентный' },
  { value: 'default', label: 'Светлый' },
  { value: 'lavender', label: 'Лавандовый' },
] as const
const meta = {
  title: 'Components/CaseImagePreview',
  component: DsCaseImagePreview,
  // Shared runtime fixtures; public Docs belong to the two canonical variants.
  tags: ['!autodocs', '!dev'],
  args: { title: 'Когда включается Chirp', type: 'v1', instance: 'ImgTitle', showZoom: true, onZoom: fn() },
  argTypes: {
    type: { control: false, table: { disable: true } },
    title: { control: 'text', description: 'Заголовок медиа. Переносится при переполнении.' },
    instance: { control: 'select', options: ['ImgTitle', 'ImgTitleToolbar'], description: 'Одна панель: заголовок с лупой либо заголовок с навигацией документов.' },
    showZoom: { control: 'boolean', if: { arg: 'instance', eq: 'ImgTitleToolbar' }, description: 'Видимость лупы только для ImgTitleToolbar.' },
    modelValue: { control: 'select', options: [null, 'overview', 'foundation', 'tokens'], description: 'Выбранное представление toolbar; Figma не меняет выбор.' },
    default: { control: false, description: 'SLOT медиа. Изображение с исходными размерами и alt. Уменьшается до ширины слота, но не увеличивается.' },
    onZoom: { description: 'Запрос потребителю открыть viewer. Preview сам viewer не создаёт.' },
  },
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: "Изображение кейса с доступом к увеличенному просмотру.\n\n<a href=\"https://www.figma.com/design/TPjPitung1VP3oQg42f56O/PDPortfolio-DS?node-id=1016-9326\" target=\"_blank\" rel=\"noopener noreferrer\">Figma</a>\n<a href=\"https://www.figma.com/design/TPjPitung1VP3oQg42f56O/PDPortfolio-DS?node-id=3131-2596\" target=\"_blank\" rel=\"noopener noreferrer\">Figma</a>" } },
  },
} satisfies Meta<typeof DsCaseImagePreview>
export default meta
type Story = StoryObj<typeof meta>

export const Overlay: Story = {
  args: { type: 'v2' },
  render: args => ({
    components: { DsCaseImagePreview },
    setup() {
      const surface = ref<'legacy' | 'default' | 'lavender'>('lavender')
      return { args, media, surface, backgroundOptions }
    },
    template: `<div>
      <div style="display:flex;flex-wrap:wrap;gap:8px;padding:16px">
        <label>Фон <select aria-label="Фон примера" v-model="surface"><option v-for="background in backgroundOptions" :key="background.value" :value="background.value">{{ background.label }}</option></select></label>
      </div>
      <div data-preview-surface :class="{'case-preview-surface':surface === 'legacy'}" :style="surface === 'legacy' ? undefined : {background:surface === 'lavender' ? 'var(--accent-lavender)' : 'var(--surface-default)'}">
        <DsCaseImagePreview v-bind="args"><img :src="media" alt="Схема сценариев Chirp" /></DsCaseImagePreview>
      </div>
    </div>`,
  }),
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
    await expect(canvas.queryByRole('combobox', { name: 'Тип Preview' })).not.toBeInTheDocument()
    const background = canvas.getByRole('combobox', { name: 'Фон примера' })
    await userEvent.selectOptions(background, 'legacy')
    await expect(getComputedStyle(root.parentElement!).backgroundImage).toContain('linear-gradient')
    await userEvent.selectOptions(background, 'default')
    await expect(getComputedStyle(root.parentElement!).backgroundImage).toBe('none')
    const lightBackground = getComputedStyle(root.parentElement!).backgroundColor
    await userEvent.selectOptions(background, 'lavender')
    await expect(getComputedStyle(root.parentElement!).backgroundImage).toBe('none')
    await expect(getComputedStyle(root.parentElement!).backgroundColor).not.toBe(lightBackground)
    await userEvent.click(button)
    await expect(args.onZoom).toHaveBeenCalledTimes(1)
  },
}

export const Sandbox: Story = {
  tags: ['!dev'],
  render: (args) => ({
    components: { DsCaseImagePreview },
    setup() {
      const type = ref<'v1' | 'v2'>(args.type ?? 'v1')
      watch(() => args.type, value => { type.value = value ?? 'v1' })
      const surface = ref<'legacy' | 'default' | 'lavender'>(type.value === 'v1' ? 'legacy' : 'default')
      watch(type, value => { surface.value = value === 'v1' ? 'legacy' : 'default' })
      const toolbar = ref(args.instance === 'ImgTitleToolbar')
      watch(() => args.instance, value => { toolbar.value = value === 'ImgTitleToolbar' })
      const showZoom = ref(args.showZoom ?? true)
      watch(() => args.showZoom, value => { showZoom.value = value ?? true })
      const selected = ref(args.modelValue ?? null)
      watch(() => args.modelValue, value => { selected.value = value ?? null })
      const documentLabels: Record<string, string> = { overview: 'Overview', foundation: 'Foundation.md', tokens: 'Tokens.json' }
      const selectedLabel = computed(() => selected.value ? documentLabels[selected.value] : 'не выбран')
      const zooms = ref(0)
      const long = ref(false)
      function zoom(event: MouseEvent) { zooms.value++; args.onZoom?.(event) }
      function reset() {
        type.value = args.type ?? 'v1'
        surface.value = type.value === 'v1' ? 'legacy' : 'default'
        toolbar.value = args.instance === 'ImgTitleToolbar'
        showZoom.value = args.showZoom ?? true
        selected.value = args.modelValue ?? null
        long.value = false
        zooms.value = 0
      }
      return { args, media, foundationMedia, type, surface, toolbar, showZoom, selected, selectedLabel, zooms, long, zoom, reset, backgroundOptions }
    },
    template: `<div>
      <div style="display:flex;flex-wrap:wrap;gap:8px;padding:16px">
        <label>Фон <select aria-label="Фон примера" v-model="surface"><option v-for="background in backgroundOptions" :key="background.value" :value="background.value">{{ background.label }}</option></select></label>
        <label v-if="type === 'v1'"><input type="checkbox" v-model="toolbar" /> Панель навигации</label>
        <label v-if="type === 'v1' && toolbar"><input type="checkbox" v-model="showZoom" /> Кнопка увеличения</label>
        <label><input type="checkbox" v-model="long" /> Длинный заголовок</label>
        <button type="button" @click="reset">Сбросить</button>
      </div>
      <div data-preview-surface :class="{'case-preview-surface':surface === 'legacy'}" :style="surface === 'legacy' ? undefined : {background:surface === 'lavender' ? 'var(--accent-lavender)' : 'var(--surface-default)'}">
        <DsCaseImagePreview :type="type" :title="long ? Array(30).fill(args.title).join(' ') : args.title"
          :instance="toolbar ? 'ImgTitleToolbar' : 'ImgTitle'" :show-zoom="showZoom" v-model="selected" @zoom="zoom">
          <img :src="selected === 'foundation' ? foundationMedia : media"
            alt="Схема сценариев Chirp" />
        </DsCaseImagePreview>
      </div>
      <p role="status" style="padding:16px">Материал: {{ selectedLabel }} · Нажатий на увеличение: {{ zooms }}</p>
    </div>`,
  }),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByRole('combobox', { name: 'Тип Preview' })).not.toBeInTheDocument()
    await expect(canvas.queryByRole('checkbox', { name: 'Кнопка увеличения' })).not.toBeInTheDocument()
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
    await expect(canvas.getByRole('status')).toHaveTextContent('Нажатий на увеличение: 1')
    await expect(args.onZoom).toHaveBeenCalledTimes(1)
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Длинный заголовок' }))
    await expect(canvasElement.querySelector('.ds-img-title')!.getBoundingClientRect().height).toBeGreaterThan(74)
    await expect(canvasElement.querySelector('.ds-img-title')!.getBoundingClientRect().width).toBeLessThanOrEqual(924)
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Длинный заголовок' }))
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Панель навигации', exact: true }))
    await waitFor(() => expect(canvasElement.querySelector('.ds-img-title-toolbar')).not.toBeNull())
    await expect(canvas.getByRole('checkbox', { name: 'Кнопка увеличения' })).toBeInTheDocument()
    if (!canvas.queryByRole('button', { name: 'Foundation.md', exact: true })) {
      await userEvent.click(canvas.getByRole('button', { name: /^(Overview · Docs · Figma|Выбрать материал)$/ }))
    }
    await userEvent.click(within(document.body).getByRole('button', { name: 'Foundation.md', exact: true }))
    await expect(canvas.getByRole('status')).toHaveTextContent('Материал: Foundation.md')
    await expect(image).toHaveAttribute('src', foundationMedia)
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Кнопка увеличения' }))
    await expect(canvas.queryByRole('button', { name: /Увеличить изображение/ })).not.toBeInTheDocument()
    await expect(getComputedStyle(canvasElement.querySelector('.ds-img-title-toolbar__title')!).textAlign).toBe('center')
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Длинный заголовок' }))
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
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Кнопка увеличения' }))
    await waitFor(assertToolbarBounds)
    await expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(window.innerWidth)
    await userEvent.click(canvas.getByRole('button', { name: 'Сбросить', exact: true }))
    await expect(canvas.getByRole('status')).toHaveTextContent('Материал: не выбран · Нажатий на увеличение: 0')
    await expect(canvas.queryByRole('checkbox', { name: 'Кнопка увеличения' })).not.toBeInTheDocument()
  },
}
