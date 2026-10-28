import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import DsCaseImageViewer from './DsCaseImageViewer.vue'
import DSOverview from './DSOverview.vue'
import { galleryNativeSize } from './ds-overview.geometry'
const meta = {
  title: 'Components/CaseImageViewer', component: DsCaseImageViewer, tags: ['autodocs'],
  args: { title: 'Когда включается Chirp', open: true, type: 'v1' },
  argTypes: { type: { control: 'inline-radio', options: ['v1', 'v2'], description: 'v1 — полная шапка, v2 — только контролы. Оба режима полноэкранные, desktop Fit to width, mobile Zoom 100%.' } },
  parameters: { layout: 'fullscreen', docs: { description: { component: `
[Figma 1019:11807](https://www.figma.com/design/TPjPitung1VP3oQg42f56O/PDPortfolio-DS?node-id=1019-11807)

<details>
<summary>Техническое описание</summary>

Тип v1 — полная шапка; v2 — только контролы масштаба и закрытия (Controls only). Оба типа полноэкранные, с прокруткой X/Y при переполнении. SLOT — одно img/inline SVG с исходными размерами; для составного содержимого передайте contentSize={width,height}. Все изображения композиции должны загрузиться до ready. Base открывается в 100%, min-768 в Fit to width. Media gap 24px, поля 16/64px. Wheel scroll, Ctrl/⌘+wheel zoom; drag/pinch pan/zoom. DsScroll X/Y при overflow. Escape/close возвращают фокус, scroll страницы и начальное состояние. Tooltip управляется загрузкой медиа. Sandbox сразу показывает открытый fullscreen viewer; режим определяется viewport.

</details>
` } } },
} satisfies Meta<typeof DsCaseImageViewer>
export default meta
type Story = StoryObj<typeof meta>
export const Sandbox: Story = {
  render: args => ({
    components: { DsCaseImageViewer },
    setup() { const open = ref(true), zoom = ref(100); return { args, open, zoom } },
    template: `<div>
      <button @click="open=true">Открыть просмотрщик</button>
      <p role="status" style="padding:16px">Zoom: {{ Math.round(zoom) }}%</p>
      <DsCaseImageViewer v-model:open="open" :type="args.type" :title="args.title" @zoom="zoom=$event"><img src="/cases/chirp-product/media/P02.svg" alt="Схема сценариев Chirp" /></DsCaseImageViewer>
    </div>`,
  }),
  play: async ({ canvasElement }) => {
    if (new URLSearchParams(window.location.search).get('embed') === 'true') return
    const canvas = within(canvasElement), body = within(document.body)
    const dialog = await body.findByRole('dialog', { name: 'Когда включается Chirp', exact: true })
    await waitFor(() => expect(dialog).toHaveAttribute('aria-busy', 'false'))
    await expect(document.body.style.overflow).toBe('hidden')
    const d = within(dialog)
    const triggerMenu = window.innerWidth >= 768 ? d.getByRole('button', { name: 'Fit to width', exact: true }) : d.getByRole('button', { name: 'Выбрать масштаб' })
    await userEvent.click(triggerMenu)
    if (window.innerWidth < 768) {
      const option = body.getByRole('button', { name: 'Zoom 150%', exact: true })
      const rect = option.getBoundingClientRect()
      await expect(document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2)?.closest('.ds-fs-menu__overlay')).not.toBeNull()
    }
    const options = window.innerWidth >= 768 ? within(dialog.querySelector('.ds-dropdown-select__list')! as HTMLElement) : body
    const optionList = window.innerWidth >= 768 ? dialog.querySelector('.ds-dropdown-select__list')! : document.querySelector('.ds-fs-menu__list')!
    await expect(within(optionList as HTMLElement).getAllByRole('button')).toHaveLength(6)
    if (window.innerWidth >= 768) {
      await userEvent.hover(d.getByRole('button', { name: 'Закрыть просмотрщик' }))
      await userEvent.hover(options.getByRole('button', { name: 'Zoom 50%', exact: true }))
      await waitFor(() => expect(d.queryByRole('tooltip')).not.toBeInTheDocument())
    }
    const initial = options.getByRole('button', { name: window.innerWidth >= 768 ? 'Fit to width' : 'Zoom 100%', exact: true })
    await expect(initial).toHaveAttribute('aria-current', 'true')
    await userEvent.click(options.getByRole('button', { name: 'Zoom 150%', exact: true }))
    await expect(canvas.getByRole('status')).toHaveTextContent('Zoom: 150%')
    const menuButton = () => window.innerWidth >= 768 ? dialog.querySelector('.ds-top-sticky-bar__menu button') as HTMLElement : d.getByRole('button', { name: 'Выбрать масштаб' })
    const media = dialog.querySelector('.ds-case-image-viewer__media') as HTMLElement
    const viewport = dialog.querySelector('.ds-case-image-viewer__viewport') as HTMLElement
    const intrinsic = media.offsetWidth
    for (const mode of ['height', 'screen', 'width']) {
      await userEvent.click(menuButton())
      const list = window.innerWidth >= 768 ? within(dialog.querySelector('.ds-dropdown-select__list')! as HTMLElement) : within(document.querySelector('.ds-fs-menu__list')! as HTMLElement)
      await userEvent.click(list.getByRole('button', { name: `Fit to ${mode}`, exact: true }))
      await waitFor(() => expect(menuButton()).toHaveTextContent(`Fit to ${mode}`))
      const header = dialog.querySelector('header')!.getBoundingClientRect().height
      const widthScale = (viewport.clientWidth - (window.innerWidth >= 768 ? 128 : 32)) / intrinsic
      const heightScale = (viewport.clientHeight - header - 24 - (window.innerWidth >= 768 ? 24 : 32)) / media.offsetHeight
      const expected = Math.max(.01, mode === 'width' ? widthScale : mode === 'height' ? heightScale : Math.min(widthScale, heightScale))
      await waitFor(() => expect(media.getBoundingClientRect().width / intrinsic).toBeCloseTo(expected, 4))
      viewport.scrollTop = 30
      const previousTop = viewport.scrollTop
      await userEvent.click(menuButton())
      const repeatList = window.innerWidth >= 768 ? within(dialog.querySelector('.ds-dropdown-select__list')! as HTMLElement) : within(document.querySelector('.ds-fs-menu__list')! as HTMLElement)
      await expect(repeatList.getByRole('button', { name: `Fit to ${mode}`, exact: true })).toHaveAttribute('aria-current', 'true')
      await userEvent.click(repeatList.getByRole('button', { name: `Fit to ${mode}`, exact: true }))
      await expect(viewport.scrollTop).toBe(previousTop)
    }
    if (window.innerWidth >= 768) {
      await userEvent.click(menuButton())
      await userEvent.keyboard('{Escape}')
      await expect(dialog).toBeInTheDocument()
      await expect(dialog.querySelector('.ds-dropdown-select__list')).toBeNull()
    }
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(body.queryByRole('dialog', { name: 'Когда включается Chirp', exact: true })).not.toBeInTheDocument())
    const trigger = canvas.getByRole('button', { name: 'Открыть просмотрщик', exact: true })
    await expect(document.body.style.overflow).not.toBe('hidden')
    await userEvent.click(trigger)
    await waitFor(() => expect(body.getByRole('dialog', { name: 'Когда включается Chirp', exact: true })).toHaveAttribute('aria-busy', 'false'))
    if (window.innerWidth >= 768) await expect(body.getByRole('button', { name: 'Fit to width', exact: true })).toBeInTheDocument()
    else await expect(document.querySelector('.ds-case-image-viewer .ds-fs-menu__trigger')).toHaveTextContent('Zoom 100%')
    await userEvent.click(body.getByRole('button', { name: 'Закрыть просмотрщик' }))
    await expect(trigger).toHaveFocus()
    await userEvent.click(trigger)
    await waitFor(() => expect(body.getByRole('dialog', { name: 'Когда включается Chirp', exact: true })).toHaveAttribute('aria-busy', 'false'))
  },
}

export const ControlsOnly: Story = {
  ...Sandbox,
  args: { type: 'v2' },
  play: async context => {
    const dialog = await within(document.body).findByRole('dialog', { name: 'Когда включается Chirp', exact: true })
    await expect(dialog.querySelector('header')).toHaveClass('ds-top-sticky-bar--controls-only')
    await expect(dialog.querySelector('header h2')).toBeNull()
    await Sandbox.play?.(context)
  },
}

export const Composite: Story = {
  args: { title: 'Mobile & Web' },
  render: args => ({
    components: { DsCaseImageViewer, DSOverview },
    setup() { const open = ref(true); return { args, open, galleryNativeSize } },
    template: `<div>
      <button @click="open=true">Открыть галерею</button>
      <DsCaseImageViewer v-model:open="open" :title="args.title" :content-size="galleryNativeSize">
        <DSOverview mode="viewer" />
      </DsCaseImageViewer>
    </div>`,
  }),
  play: async ({ canvasElement }) => {
    if (new URLSearchParams(location.search).get('embed') === 'true') return
    const body = within(document.body), canvas = within(canvasElement)
    const dialog = await body.findByRole('dialog', { name: 'Mobile & Web', exact: true })
    await waitFor(() => expect(dialog).toHaveAttribute('aria-busy', 'false'), { timeout: 20000 })
    const media = dialog.querySelector<HTMLElement>('.ds-case-image-viewer__media')!
    expect(media.offsetWidth).toBe(galleryNativeSize.width)
    expect(Math.abs(media.offsetHeight - galleryNativeSize.height)).toBeLessThan(1)
    expect(dialog.querySelectorAll('[data-asset]')).toHaveLength(50)
    const gallery = dialog.querySelector<HTMLElement>('.ds-overview')!
    expect(gallery.offsetWidth).toBe(1873)
    expect(Math.abs(gallery.getBoundingClientRect().height - media.getBoundingClientRect().height)).toBeLessThan(1)
    const viewport = dialog.querySelector<HTMLElement>('.ds-case-image-viewer__viewport')!
    const d = within(dialog)
    const trigger = () => window.innerWidth >= 768
      ? dialog.querySelector<HTMLElement>('.ds-top-sticky-bar__menu button')!
      : d.getByRole('button', { name: 'Выбрать масштаб' })
    for (const mode of ['height', 'screen', 'width']) {
      await userEvent.click(trigger())
      const list = window.innerWidth >= 768
        ? dialog.querySelector<HTMLElement>('.ds-dropdown-select__list')!
        : document.querySelector<HTMLElement>('.ds-fs-menu__list')!
      await userEvent.click(within(list).getByRole('button', { name: `Fit to ${mode}`, exact: true }))
      const header = dialog.querySelector('header')!.getBoundingClientRect().height
      const widthScale = (viewport.clientWidth - (innerWidth >= 768 ? 128 : 32)) / galleryNativeSize.width
      const heightScale = (viewport.clientHeight - header - 24 - (innerWidth >= 768 ? 24 : 32)) / galleryNativeSize.height
      const expected = Math.max(.01, mode === 'width' ? widthScale : mode === 'height' ? heightScale : Math.min(widthScale, heightScale))
      await waitFor(() => expect(media.getBoundingClientRect().width / galleryNativeSize.width).toBeCloseTo(expected, 4))
    }
    viewport.scrollTop = viewport.scrollHeight
    expect(viewport.scrollTop).toBeGreaterThan(0)
    await userEvent.click(d.getByRole('button', { name: 'Закрыть просмотрщик' }))
    const opener = canvas.getByRole('button', { name: 'Открыть галерею' })
    await userEvent.click(opener)
    await waitFor(() => expect(body.getByRole('dialog', { name: 'Mobile & Web' })).toHaveAttribute('aria-busy', 'false'))
    await userEvent.keyboard('{Escape}')
    expect(opener).toHaveFocus()
    await userEvent.click(opener)
    await waitFor(() => expect(body.getByRole('dialog', { name: 'Mobile & Web' })).toHaveAttribute('aria-busy', 'false'))
  },
}
