import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent, waitFor } from 'storybook/test'
import { computed, ref } from 'vue'
import DCPickerAppUx from './DCPickerAppUx.vue'

const meta = {
  title: 'Compositions/Showcase cards/DCPickerApp-UX',
  component: DCPickerAppUx,
  tags: ['autodocs'],
  parameters: { layout: 'padded', docs: { description: { component: `Анонс будущего кейса. Карточка без перехода; кнопка «Скоро» открывает системный почтовый клиент через mailto:.

Получатель: **stulginsky@gmail.com**

Тема: **Сообщите о новом кейсе**

Текст письма:

> Привет, Константин! Очень хочу посмотреть новый кейс {Название кейса}. Сообщите о публикации. Спасибо.

Название берётся из карточки и подставляется с обычными пробелами: для этой карточки — **Picker App**.

Письмо открывается как редактируемый черновик. Пользователь отправляет его самостоятельно. В Preview запуск перехвачен; в Sandbox переключатель «Открывать почтовый клиент» разрешает настоящий переход по mailto:. По умолчанию переключатель выключен. Production-компонент содержит полную ссылку с адресом, темой и телом письма.

[Figma](https://www.figma.com/design/TPjPitung1VP3oQg42f56O/PDPortfolio-DS?node-id=3217-3056). Ширина430px сохранена по общему контракту витрины. Семь бэджей переносятся строками; мобильное положение заголовка из base.` } } },
  args: { onSubscribe: fn() },
} satisfies Meta<typeof DCPickerAppUx>
export default meta
type Story = StoryObj<typeof meta>
export const Preview: Story = {
  args: { onSubscribe: fn((event: MouseEvent) => event.preventDefault()) },
  play: async ({ canvas, args }) => {
    const card = canvas.getByRole('article')
    await expect(canvas.getAllByRole('listitem')).toHaveLength(7)
    const link = canvas.getByRole('link', { name: /Скоро/ })
    await expect(canvas.getAllByRole('link')).toHaveLength(1)
    await expect(card).not.toHaveAttribute('tabindex')
    const uri = new URL(link.getAttribute('href')!)
    await expect(link).toHaveAttribute('target', '_blank')
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    await expect(uri.protocol).toBe('mailto:')
    await expect(uri.pathname).toBe('stulginsky@gmail.com')
    await expect(uri.searchParams.get('body')).toBe('Привет, Константин! Очень хочу посмотреть новый кейс Picker App. Сообщите о публикации. Спасибо.')
    await userEvent.click(card)
    await expect(args.onSubscribe).not.toHaveBeenCalled()
    await userEvent.click(link)
    await expect(args.onSubscribe).toHaveBeenCalledTimes(1)
    await userEvent.hover(link)
    await expect(canvas.getByRole('tooltip')).toHaveTextContent(/Подписаться/)
    await expect(link).toHaveAttribute('aria-describedby', canvas.getByRole('tooltip').id)
    link.focus()
    await userEvent.keyboard('{Enter}')
    await expect(args.onSubscribe).toHaveBeenCalledTimes(2)
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(canvas.queryByRole('tooltip')).not.toBeInTheDocument())
  },
}
export const Sandbox: Story = {
  render: args => ({
    components: { DCPickerAppUx },
    setup() {
      const openMailClient = ref(false)
      const bindings = computed(() => ({
        ...args,
        onSubscribe(event: MouseEvent) {
          if (!openMailClient.value) event.preventDefault()
          args.onSubscribe?.(event)
        },
      }))
      return { openMailClient, bindings }
    },
    template: `<div style="display:grid;gap:16px">
      <label style="display:flex;align-items:center;gap:8px">
        <input v-model="openMailClient" type="checkbox" />Открывать почтовый клиент
      </label>
      <div style="width:100%;max-width:430px;resize:horizontal;overflow:auto;min-width:264px"><DCPickerAppUx v-bind="bindings" /></div>
    </div>`,
  }),
  play: async ({ canvas }) => {
    if (new URLSearchParams(window.location.search).get('embed') === 'true') return
    const toggle = canvas.getByRole('checkbox', { name: 'Открывать почтовый клиент' })
    const link = canvas.getByRole('link', { name: /Скоро/ })
    await expect(toggle).not.toBeChecked()
    const prevented: boolean[] = []
    // Observe the component handler, then suppress native launch during tests only.
    const observe = (event: Event) => { prevented.push(event.defaultPrevented); event.preventDefault() }
    link.addEventListener('click', observe)
    try {
      await userEvent.click(link)
      await userEvent.click(toggle)
      await expect(toggle).toBeChecked()
      await userEvent.click(link)
      await expect(prevented).toEqual([true, false])
    } finally {
      link.removeEventListener('click', observe)
      if ((toggle as HTMLInputElement).checked) await userEvent.click(toggle)
    }
  },
}
