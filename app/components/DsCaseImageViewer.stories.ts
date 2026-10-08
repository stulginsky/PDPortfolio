import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import DsCaseImageViewer from './DsCaseImageViewer.vue'
import DsCaseImagePreview from './DsCaseImagePreview.vue'
const meta = {
  title: 'Components/CaseImageViewer', component: DsCaseImageViewer, tags: ['autodocs'],
  args: { title: 'Когда включается Chirp', open: false },
  parameters: { layout: 'fullscreen', docs: { description: { component: `
[Figma 1019:11807](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=1019-11807)

<details>
<summary>Техническое описание</summary>

SLOT — одно img/inline SVG с исходными размерами. Base открывается в 100%, min-768 в Fit to screen. Media gap 24px, поля 16/64px. Wheel scroll, Ctrl/⌘+wheel zoom; drag/pinch pan/zoom. DsScroll X/Y при overflow. Escape/close возвращают фокус, scroll страницы и начальное состояние. Tooltip управляется загрузкой медиа. Sandbox открывает реальный fullscreen viewer из production preview; режим определяется viewport.

</details>
` } } },
} satisfies Meta<typeof DsCaseImageViewer>
export default meta
type Story = StoryObj<typeof meta>
export const Sandbox: Story = {
  render: args => ({
    components: { DsCaseImageViewer, DsCaseImagePreview },
    setup() { const open = ref(false), zoom = ref(100); return { args, open, zoom } },
    template: `<div style="min-height:120vh">
      <DsCaseImagePreview :title="args.title" @zoom="open=true"><img src="/cases/chirp-product/media/P02.svg" alt="Схема сценариев Chirp" /></DsCaseImagePreview>
      <p role="status" style="padding:16px">Zoom: {{ Math.round(zoom) }}%</p>
      <DsCaseImageViewer v-model:open="open" :title="args.title" @zoom="zoom=$event"><img src="/cases/chirp-product/media/P02.svg" alt="Схема сценариев Chirp" /></DsCaseImageViewer>
    </div>`,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement), body = within(document.body)
    const trigger = canvas.getByRole('button', { name: /Увеличить изображение/ })
    trigger.focus()
    await userEvent.click(trigger)
    const dialog = body.getByRole('dialog', { name: 'Когда включается Chirp', exact: true })
    await waitFor(() => expect(dialog).toHaveAttribute('aria-busy', 'false'))
    await expect(document.body.style.overflow).toBe('hidden')
    const d = within(dialog)
    const triggerMenu = window.innerWidth >= 768 ? d.getByRole('button', { name: 'Fit to screen', exact: true }) : d.getByRole('button', { name: 'Выбрать масштаб' })
    await userEvent.click(triggerMenu)
    if (window.innerWidth < 768) {
      const option = body.getByRole('button', { name: 'Zoom 150%', exact: true })
      const rect = option.getBoundingClientRect()
      await expect(document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2)?.closest('.ds-fs-menu__overlay')).not.toBeNull()
    }
    const options = window.innerWidth >= 768 ? within(dialog.querySelector('.ds-dropdown-select__list')! as HTMLElement) : body
    await userEvent.click(options.getByRole('button', { name: 'Zoom 150%', exact: true }))
    await expect(canvas.getByRole('status')).toHaveTextContent('Zoom: 150%')
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(body.queryByRole('dialog', { name: 'Когда включается Chirp', exact: true })).not.toBeInTheDocument())
    await expect(trigger).toHaveFocus()
    await expect(document.body.style.overflow).not.toBe('hidden')
    await userEvent.click(trigger)
    await waitFor(() => expect(body.getByRole('dialog', { name: 'Когда включается Chirp', exact: true })).toHaveAttribute('aria-busy', 'false'))
    if (window.innerWidth >= 768) await expect(body.getByRole('button', { name: 'Fit to screen', exact: true })).toBeInTheDocument()
    else await expect(document.querySelector('.ds-case-image-viewer .ds-fs-menu__trigger')).toHaveTextContent('Zoom 100%')
    await userEvent.click(body.getByRole('button', { name: 'Закрыть просмотрщик' }))
  },
}
