import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { expect, fn, userEvent, within } from 'storybook/test'
import DsTopNavScrollResume from './DsTopNavScrollResume.vue'

const meta = {
  title: 'Components/TopNavScroll/Resume',
  component: DsTopNavScrollResume,
  tags: ['autodocs'],
  args: { place: 'Resume', ariaLabel: 'Навигация резюме', 'onUpdate:place': fn(), onAvatarClick: fn(), onProjects: fn(), onDownload: fn(), onPrint: fn() },
  argTypes: {
    place: { control: 'inline-radio', options: ['Vitrina', 'Resume'], description: 'Выбранный таб; v-model:place.' },
    ariaLabel: { control: 'text', description: 'Доступное имя навигации.' },
  },
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: "[Figma TopNavScroll/Resume 1047:4060](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=1047-4060)\n\n<details>\n<summary>Техническое описание</summary>\n\n[Figma TopNavScroll/Resume 1047:4060](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=1047-4060).\n\n| Breakpoint | Раскладка |\n|---|---|\n| base <534px | Полный viewport без внешних отступов; reference 320×164; действия второй строкой через 32px |\n| min-534 534–767px | По центру: 394px без действий, 534px с действиями; высота 82px |\n| min-768 ≥768px | 394px без действий, 534px с действиями; высота 90px, верхний отступ 8px, radius 48px |\n\nAvatar-Sm 50×50; табы переключают Toggled без ActivePressed. До min-768 Hover табов отключён.\nDownload/Print: общий entrance из SiteNavResumeActions — fade + translateX(-8px), 300ms, delays 100/200ms; reduced motion отключает анимацию.\nEvents: update:place, avatar-click, projects, download, print. Слотов нет.\n\n</details>" } },
  },
} satisfies Meta<typeof DsTopNavScrollResume>
export default meta
type Story = StoryObj<typeof meta>

export const Sandbox: Story = {
  render: args => ({
    components: { DsTopNavScrollResume },
    setup() {
      const width = ref(320)
      const place = ref<'Vitrina' | 'Resume'>(args.place ?? 'Resume')
      const downloads = ref(0)
      const prints = ref(0)
      const avatarClicks = ref(0)
      const breakpoint = () => width.value < 534 ? 'base' : width.value < 768 ? 'min-534' : 'min-768'
      function selectPlace(value: 'Vitrina' | 'Resume') { place.value = value; args['onUpdate:place']?.(value) }
      function download(e: MouseEvent) { downloads.value++; args.onDownload?.(e) }
      function print(e: MouseEvent) { prints.value++; args.onPrint?.(e) }
      function avatarClick(e: MouseEvent) { avatarClicks.value++; args.onAvatarClick?.(e) }
      return { args, width, place, downloads, prints, avatarClicks, breakpoint, selectPlace, download, print, avatarClick }
    },
    template: `
      <div style="display:grid;gap:24px;overflow:auto;">
        <div style="display:flex;flex-wrap:wrap;gap:8px;padding:16px;">
          <button type="button" @click="width = 320">Base</button>
          <button type="button" @click="width = 534">min-534</button>
          <button type="button" @click="width = 768">min-768</button>
          <label>Ширина примера
            <select v-model.number="width" aria-label="Ширина примера">
              <option v-for="w in [320, 533, 534, 767, 768, 1024]" :key="w" :value="w">{{ w }}px</option>
            </select>
          </label>
        </div>
        <div :style="{ width: 'min(' + width + 'px, 100%)', minHeight: '188px' }">
          <DsTopNavScrollResume :place="place" :aria-label="args.ariaLabel" :data-storybook-breakpoint="breakpoint()"
            @update:place="selectPlace" @avatar-click="avatarClick" @projects="args.onProjects"
            @download="download" @print="print" />
        </div>
        <p role="status" style="padding-inline:16px;">Avatar: {{ avatarClicks }} · Скачивание: {{ downloads }} · Печать: {{ prints }}</p>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const projects = canvas.getByRole('button', { name: 'Проекты' })
    const resume = canvas.getByRole('button', { name: 'Резюме' })
    await expect(resume).toHaveAttribute('aria-current', 'page')
    await userEvent.click(projects)
    await expect(projects).toHaveAttribute('aria-current', 'page')
    await expect(canvas.queryByRole('button', { name: 'Скачать резюме PDF' })).not.toBeInTheDocument()
    await userEvent.click(resume)
    await expect(resume).toHaveAttribute('aria-current', 'page')
    const download = canvas.getByRole('button', { name: 'Скачать резюме PDF' })
    const print = canvas.getByRole('button', { name: 'Печать резюме' })
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      await expect(getComputedStyle(download).animationDuration).toBe('0.3s')
      await expect(getComputedStyle(download).animationDelay).toBe('0.1s')
      await expect(getComputedStyle(print).animationDelay).toBe('0.2s')
    }
    await Promise.all([download, print].flatMap(e => e.getAnimations().map(a => a.finished)))
    await userEvent.click(download)
    await userEvent.click(print)
    await expect(canvas.getByRole('status')).toHaveTextContent('Скачивание: 1 · Печать: 1')
    const nav = canvas.getByRole('navigation', { name: 'Навигация резюме' })
    await expect(Math.round(nav.getBoundingClientRect().height)).toBe(164)
    await userEvent.click(canvas.getByRole('button', { name: 'min-534', exact: true }))
    await expect(Math.round(nav.getBoundingClientRect().width)).toBe(534)
    await userEvent.click(projects)
    await expect(Math.round(nav.getBoundingClientRect().width)).toBe(394)
    await userEvent.click(resume)
    await expect(Math.round(nav.getBoundingClientRect().width)).toBe(534)
    await expect(Math.round(nav.getBoundingClientRect().height)).toBe(82)
    await userEvent.click(canvas.getByRole('button', { name: 'min-768', exact: true }))
    await expect(Math.round(nav.getBoundingClientRect().height)).toBe(90)
    await userEvent.click(canvas.getByRole('button', { name: 'Base', exact: true }))
  },
}
