import { computed as computedStoryModel } from 'vue'
import { useArgs } from 'storybook/preview-api'
import { watch as watchStoryArg } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { expect, fn, userEvent, within } from 'storybook/test'
import DsTopNavScrollVitrina from './DsTopNavScrollVitrina.vue'

const meta = {
  title: 'Components/TopNavScroll/Vitrina',
  component: DsTopNavScrollVitrina,
  tags: ['!autodocs', '!dev'],
  args: {
    ariaLabel: 'Навигация портфолио',
    place: 'Vitrina',
    'onUpdate:place': fn(),
    onAvatarClick: fn(),
    onResume: fn(),
  },
  argTypes: {
    place: { control: 'inline-radio', options: ['Vitrina', 'Resume'], description: 'Выбранный tab, v-model:place.' },
    ariaLabel: {
      control: 'text',
      description: 'Доступное имя sticky-навигации витрины.',
    },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: "Компактная навигация при просмотре витрины проектов.\n\n<a href=\"https://www.figma.com/design/TPjPitung1VP3oQg42f56O/PDPortfolio-DS?node-id=1025-5059\" target=\"_blank\" rel=\"noopener noreferrer\">Figma</a>",
      },
    },
  },
} satisfies Meta<typeof DsTopNavScrollVitrina>

export default meta
type Story = StoryObj<typeof meta>

export const Preview: Story = {
  name: 'Sandbox',
  tags: ['!dev'],
  render: args => {
    const [, updateArgs] = useArgs()
    return {
      components: { DsTopNavScrollVitrina },
      setup() {
        const model = computedStoryModel({ get: () => args.place, set: value => updateArgs({ place: value }) })
        return { args, model }
      },
      template: '<DsTopNavScrollVitrina v-bind="args" v-model:place="model" />',
    }
  },
}

export const Sandbox: Story = {
  tags: ['!dev'],
  render: (args) => ({
    components: { DsTopNavScrollVitrina },
    setup() {
      const width = ref(320)
      const place = ref<'Vitrina' | 'Resume'>(args.place ?? 'Vitrina')
watchStoryArg(() => args.place, value => { place.value = value ?? 'Vitrina' })
      function selectPlace(value: 'Vitrina' | 'Resume') {
        place.value = value
        args['onUpdate:place']?.(value)
      }
      const avatarClicks = ref(0)
      const resumeRequests = ref(0)
      const breakpoint = () => width.value < 394 ? 'base' : width.value < 768 ? 'min-394' : 'min-768'
      function avatarClick(event: MouseEvent) {
        avatarClicks.value++
        args.onAvatarClick?.(event)
      }
      function resume(event: MouseEvent) {
        resumeRequests.value++
        args.onResume?.(event)
      }
      return { args, width, place, selectPlace, avatarClicks, resumeRequests, breakpoint, avatarClick, resume }
    },
    template: `
      <div style="display:grid;gap:24px;overflow:auto;">
        <div style="display:flex;flex-wrap:wrap;gap:8px;padding:16px;">
          <button type="button" @click="width = 320">Base</button>
          <button type="button" @click="width = 394">min-394</button>
          <button type="button" @click="width = 768">min-768</button>
          <label>Ширина примера
            <select v-model.number="width" aria-label="Ширина примера">
              <option :value="320">320px</option>
              <option :value="393">393px</option>
              <option :value="394">394px</option>
              <option :value="767">767px</option>
              <option :value="768">768px</option>
              <option :value="1024">1024px</option>
            </select>
          </label>
        </div>
        <div :style="{ width: 'min(' + width + 'px, 100%)', minHeight: '106px' }">
          <DsTopNavScrollVitrina
            :place="place"
            @update:place="selectPlace"
            :aria-label="args.ariaLabel"
            :data-storybook-breakpoint="breakpoint()"
            @avatar-click="avatarClick"
            @resume="resume"
          />
        </div>
        <p role="status" style="padding-inline:16px;">Avatar: {{ avatarClicks }} · Запросов резюме: {{ resumeRequests }}</p>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const nav = canvas.getByRole('navigation', { name: 'Навигация портфолио' })
    const avatar = canvas.getByRole('button', { name: 'К началу страницы' })
    const projects = canvas.getByRole('button', { name: 'Проекты' })
    const resume = canvas.getByRole('button', { name: 'Резюме' })

    await expect(projects).toHaveAttribute('aria-current', 'page')
    await userEvent.click(avatar)
    await expect(canvas.getByRole('status')).toHaveTextContent('Avatar: 1')
    await userEvent.click(resume)
    await expect(resume).toHaveAttribute('aria-current', 'page')
    await expect(projects).not.toHaveAttribute('aria-current')
    await userEvent.click(projects)
    await expect(projects).toHaveAttribute('aria-current', 'page')
    await expect(resume).not.toHaveAttribute('aria-current')
    await expect(canvas.getByRole('status')).toHaveTextContent('Запросов резюме: 1')

    await userEvent.click(canvas.getByRole('button', { name: 'min-394' }))
    await expect(nav).toHaveAttribute('data-storybook-breakpoint', 'min-394')
    await expect(Math.round(nav.getBoundingClientRect().width)).toBe(394)
    for (const width of ['320', '393', '394', '767']) {
      await userEvent.selectOptions(canvas.getByRole('combobox'), width)
      await expect(Math.round(nav.getBoundingClientRect().width)).toBe(Number(width))
      await expect(Math.abs(projects.getBoundingClientRect().width - resume.getBoundingClientRect().width)).toBeLessThan(0.1)
      const gap = Number(width) < 394 ? 16 : 24
      await expect(projects.getBoundingClientRect().left - avatar.getBoundingClientRect().right).toBeCloseTo(gap, 1)
      await expect(resume.getBoundingClientRect().left - projects.getBoundingClientRect().right).toBeCloseTo(gap, 1)
    }
    await userEvent.click(canvas.getByRole('button', { name: 'min-768' }))
    await expect(nav).toHaveAttribute('data-storybook-breakpoint', 'min-768')
    await expect(Math.round(nav.getBoundingClientRect().height)).toBe(90)
    await expect(projects.getBoundingClientRect().left - avatar.getBoundingClientRect().right).toBeCloseTo(24, 1)
    await expect(resume.getBoundingClientRect().left - projects.getBoundingClientRect().right).toBeCloseTo(24, 1)
  },
}
