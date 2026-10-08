import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { expect, fn, userEvent, within } from 'storybook/test'
import DsTopNav from './DsTopNav.vue'

const meta = {
  title: 'Components/TopNav',
  component: DsTopNav,
  tags: ['autodocs'],
  args: {
    place: 'Vitrina',
    ariaLabel: 'Навигация портфолио',
    'onUpdate:place': fn(),
    onDownload: fn(),
    onPrint: fn(),
  },
  argTypes: {
    place: {
      control: 'inline-radio',
      options: ['Vitrina', 'Resume'],
      description: 'Текущее представление. Используйте v-model:place; активный таб повторно не переключается.',
    },
    ariaLabel: {
      control: 'text',
      description: 'Доступное имя навигации.',
    },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: "[Figma 1025:7335](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=1025-7335)\n\n<details>\n<summary>Техническое описание</summary>\n\nTopNav — [Figma 1025:7335](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=1025-7335), сверка 2026-10-01.\n\nНавигация полной шапки из готовых Tab и ButtonIcon. Не sticky-шапка: TopNavScroll — отдельные компоненты.\n\n| Breakpoint | Vitrina | Resume |\n|---|---|---|\n| base (<570px) | Равные табы на доступной ширине, поля 16px, gap 24px | Download/Print ниже по центру, gap 32px; высота 132px |\n| min-570 (≥570px) | Табы 288px по центру | Действия справа через 24px; высота 50px |\n\nПодписи: **Проекты**, **Резюме**. Активный таб — Toggled, без ActivePressed при переключении.\nDownload/Print — разовые действия; не меняют выбранное представление.\n\nПоявление действий как в SiteNavResumeActions: fade + сдвиг слева на 8px за 300ms, задержки 100/200ms. Повторяется при переходе «Проекты → Резюме»; reduced motion отключает эффект.\n\n**Events:** update:place — запрос переключения; download / print — MouseEvent, действие выполняет потребитель.\nСлотов нет. PDF, маршрутизация и печать страницы не зашиты в компонент.\n\n</details>",
      },
    },
  },
} satisfies Meta<typeof DsTopNav>

export default meta
type Story = StoryObj<typeof meta>

export const Sandbox: Story = {
  render: (args) => ({
    components: { DsTopNav },
    setup() {
      const place = ref<'Vitrina' | 'Resume'>(args.place ?? 'Vitrina')
      const width = ref(320)
      const downloads = ref(0)
      const prints = ref(0)
      function selectPlace(value: 'Vitrina' | 'Resume') {
        place.value = value
        args['onUpdate:place']?.(value)
      }
      function download(event: MouseEvent) {
        downloads.value++
        args.onDownload?.(event)
      }
      function print(event: MouseEvent) {
        prints.value++
        args.onPrint?.(event)
      }
      return { args, place, width, downloads, prints, selectPlace, download, print }
    },
    template: `
      <div style="display:grid;gap:32px;padding:16px;overflow:auto;">
        <div style="display:flex;align-items:center;flex-wrap:wrap;gap:8px;">
          <button type="button" :aria-pressed="width < 570" @click="width = 320">Base</button>
          <button type="button" :aria-pressed="width >= 570" @click="width = 570">min-570</button>
          <label>Ширина примера
            <select aria-label="Ширина примера" v-model.number="width">
              <option :value="320">320px</option>
              <option :value="569">569px</option>
              <option :value="570">570px</option>
              <option :value="1024">1024px</option>
            </select>
          </label>
        </div>
        <div :style="{ width: width + 'px' }">
          <DsTopNav
            :place="place"
            :aria-label="args.ariaLabel"
            :data-storybook-breakpoint="width < 570 ? 'base' : 'min-570'"
            @update:place="selectPlace"
            @download="download"
            @print="print"
          />
        </div>
        <div style="font-family:var(--text-font-sans);color:var(--text-muted);">
          <p role="status">Представление: {{ place === 'Vitrina' ? 'Проекты' : 'Резюме' }}</p>
          <p>Скачивание: {{ downloads }} · Печать: {{ prints }}</p>
        </div>
      </div>
    `,
  }),
  play: async ({ canvas, args }) => {
    const nav = within(canvas.getByRole('navigation', { name: 'Навигация портфолио' }))
    const projects = nav.getByRole('button', { name: 'Проекты' })
    const resume = nav.getByRole('button', { name: 'Резюме' })
    await expect(projects).toHaveAttribute('aria-current', 'page')
    await expect(nav.queryByRole('button', { name: 'Печать резюме' })).not.toBeInTheDocument()

    await userEvent.click(projects)
    await expect(args['onUpdate:place']).not.toHaveBeenCalled()
    await userEvent.click(resume)
    await expect(resume).toHaveAttribute('aria-current', 'page')
    await expect(projects).not.toHaveAttribute('aria-current')
    await expect(args['onUpdate:place']).toHaveBeenLastCalledWith('Resume')

    const download = nav.getByRole('button', { name: 'Скачать резюме PDF' })
    const print = nav.getByRole('button', { name: 'Печать резюме' })
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      await expect(getComputedStyle(download).animationDuration).toBe('0.3s')
      await expect(getComputedStyle(download).animationDelay).toBe('0.1s')
      await expect(getComputedStyle(print).animationDelay).toBe('0.2s')
    }
    await Promise.all(
      [download, print].flatMap((element) => element.getAnimations().map((animation) => animation.finished)),
    )
    await expect(getComputedStyle(download).opacity).toBe('1')
    await expect(getComputedStyle(print).opacity).toBe('1')
    const near = (actual: number, expected: number) => expect(Math.abs(actual - expected)).toBeLessThan(0.6)
    const frame = canvas.getByRole('navigation')
    const widths = canvas.getByRole('combobox', { name: 'Ширина примера' })

    for (const width of [320, 569, 570, 1024]) {
      await userEvent.selectOptions(widths, String(width))
      const root = frame.getBoundingClientRect()
      const first = projects.getBoundingClientRect()
      const second = resume.getBoundingClientRect()
      const action = download.getBoundingClientRect()
      near(root.width, width)
      near(second.left - first.right, 24)
      near(first.width, second.width)
      near((first.left + second.right) / 2, root.left + root.width / 2)
      near(root.height, width < 570 ? 132 : 50)
      near(print.getBoundingClientRect().left - action.right, 16)
      if (width < 570) {
        near(first.left - root.left, 16)
        near(action.top - first.bottom, 32)
        near((action.left + print.getBoundingClientRect().right) / 2, root.left + width / 2)
      } else {
        near(second.right - first.left, 288)
        near(action.left - second.right, 24)
        near(action.top, first.top)
      }
    }

    await userEvent.click(download)
    await expect(args.onDownload).toHaveBeenCalledTimes(1)
    await userEvent.click(print)
    await expect(args.onPrint).toHaveBeenCalledTimes(1)
    await expect(resume).toHaveAttribute('aria-current', 'page')
    await expect(args['onUpdate:place']).toHaveBeenCalledTimes(1)

    projects.focus()
    await userEvent.keyboard('{Enter}')
    await expect(projects).toHaveAttribute('aria-current', 'page')
    await expect(nav.queryByRole('button', { name: 'Печать резюме' })).not.toBeInTheDocument()
    await userEvent.tab()
    await expect(resume).toHaveFocus()
    await userEvent.keyboard(' ')
    await expect(resume).toHaveAttribute('aria-current', 'page')
    await userEvent.tab()
    await expect(nav.getByRole('button', { name: 'Скачать резюме PDF' })).toHaveFocus()
    await userEvent.tab()
    await expect(nav.getByRole('button', { name: 'Печать резюме' })).toHaveFocus()

    await userEvent.click(projects)
    await userEvent.click(canvas.getByRole('button', { name: 'Base' }))
    projects.blur()
  },
}
