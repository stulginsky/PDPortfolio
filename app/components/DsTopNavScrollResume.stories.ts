import { computed as computedStoryModel } from 'vue'
import { useArgs } from 'storybook/preview-api'
import { watch as watchStoryArg } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { expect, fn, userEvent, within } from 'storybook/test'
import DsTopNavScrollResume from './DsTopNavScrollResume.vue'
import DsTopNavScrollVitrina from './DsTopNavScrollVitrina.vue'

const meta = {
  title: 'Components/TopNavScroll',
  component: DsTopNavScrollResume,
  tags: ['autodocs', '!dev'],
  args: { place: 'Resume', ariaLabel: 'Навигация резюме', 'onUpdate:place': fn(), onAvatarClick: fn(), onProjects: fn(), onDownload: fn(), onPrint: fn() },
  argTypes: {
  "place": {
    "options": [
      "Vitrina",
      "Resume"
    ],
    "description": "Выбранный таб; v-model:place.",
    "control": {
      "type": "inline-radio"
    }
  },
  "ariaLabel": {
    "description": "Доступное имя навигации.",
    "control": {
      "type": "text"
    }
  }
},
  parameters: {
    layout: 'fullscreen',
    docs: { story: { inline: true }, description: { component: "Компактная навигация между проектами и резюме. Переключатель place меняет композицию; в режиме Resume доступны скачивание и печать резюме.\n\n<a href=\"https://www.figma.com/design/TPjPitung1VP3oQg42f56O/PDPortfolio-DS?node-id=1047-4060\" target=\"_blank\" rel=\"noopener noreferrer\">Figma</a>" } },
  },
} satisfies Meta<typeof DsTopNavScrollResume>
export default meta
type Story = StoryObj<typeof meta>

export const Preview: Story = {
  name: 'Sandbox',
  tags: ['dev'],
  render: args => {
    const [, updateArgs] = useArgs()
    return {
      components: { DsTopNavScrollResume, DsTopNavScrollVitrina },
      setup() {
        const model = computedStoryModel({ get: () => args.place, set: value => updateArgs({ place: value }) })
        return { args, model }
      },
      template: '<div style="box-sizing:border-box;min-height:204px;padding-block:32px"><DsTopNavScrollResume v-if="model === \'Resume\'" v-bind="args" v-model:place="model" /><DsTopNavScrollVitrina v-else v-bind="args" v-model:place="model" /></div>',
    }
  },
}

export const Sandbox: Story = {
  tags: ['!dev'],
  render: args => ({
    components: { DsTopNavScrollResume },
    setup() {
      const width = ref(320)
      const place = ref<'Vitrina' | 'Resume'>(args.place ?? 'Resume')
watchStoryArg(() => args.place, value => { place.value = value ?? 'Resume' })
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
              <option v-for="w in [320, 375, 393, 425, 533, 534, 767, 768, 1024]" :key="w" :value="w">{{ w }}px</option>
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
    await expect(Math.round(nav.getBoundingClientRect().height)).toBe(140)
    const assertFill = async () => {
      const a = projects.getBoundingClientRect()
      const b = resume.getBoundingClientRect()
      await expect(Math.abs(a.width - b.width)).toBeLessThan(0.1)
      await expect(b.left - a.right).toBeCloseTo(16, 1)
      await expect(nav.getBoundingClientRect().right - b.right).toBeCloseTo(16, 1)
    }
    await assertFill()
    for (const width of ['375', '393', '425', '533']) {
      await userEvent.selectOptions(canvas.getByRole('combobox'), width)
      await assertFill()
      await expect(Math.round(nav.getBoundingClientRect().height)).toBe(140)
    }
    await userEvent.click(canvas.getByRole('button', { name: 'min-534', exact: true }))
    await expect(Math.round(nav.getBoundingClientRect().width)).toBe(534)
    await userEvent.click(projects)
    await expect(Math.round(nav.getBoundingClientRect().width)).toBe(534)
    await userEvent.click(resume)
    await expect(Math.round(nav.getBoundingClientRect().width)).toBe(534)
    await expect(Math.round(nav.getBoundingClientRect().height)).toBe(82)
    await userEvent.selectOptions(canvas.getByRole('combobox'), '767')
    await expect(Math.round(nav.getBoundingClientRect().width)).toBe(767)
    await expect(Math.abs(projects.getBoundingClientRect().width - resume.getBoundingClientRect().width)).toBeLessThan(0.1)
    await userEvent.click(canvas.getByRole('button', { name: 'min-768', exact: true }))
    await expect(Math.round(nav.getBoundingClientRect().height)).toBe(90)
    await userEvent.click(canvas.getByRole('button', { name: 'Base', exact: true }))
  },
}
