import { watch as watchStoryArg } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect } from 'storybook/test'
import { ref } from 'vue'
import DsButton from './DsButton.vue'

const meta = {
  title: 'Components/Button',
  component: DsButton,
  tags: ['autodocs', '!dev'],
  args: {
    text: 'Button',
    icon: 'Favicon',
    iconRight: false,
    raised: false,
    toggled: false,
    disabled: false,
    tag: 'button',
  },
  argTypes: {
  "text": {
    "description": "Текст кнопки.",
    "control": {
      "type": "text"
    }
  },
  "icon": {
    "options": [
      "Favicon",
      "ChevronDown",
      "ChevronUp",
      "ExternalLink"
    ],
    "description": "Иконка справа от текста. Видна, когда включено iconRight.",
    "control": {
      "type": "select"
    }
  },
  "iconRight": {
    "description": "Показывает иконку справа от текста.",
    "control": {
      "type": "boolean"
    }
  },
  "raised": {
    "description": "Добавляет тень в исходном состоянии. Наведите указатель, чтобы увидеть переход.",
    "control": {
      "type": "boolean"
    }
  },
  "toggled": {
    "description": "Включает устойчивое выбранное состояние.",
    "control": {
      "type": "boolean"
    }
  },
  "disabled": {
    "description": "Отключает взаимодействие с кнопкой.",
    "control": {
      "type": "boolean"
    }
  },
  "tag": {
    "name": "tag — кнопка или ссылка",
    "options": [
      "button",
      "a"
    ],
    "description": "button — кнопка действия; a — ссылка на адрес из href. Меняет HTML-элемент и поведение, внешний вид сохраняется.",
    "control": {
      "type": "inline-radio"
    }
  },
  "href": {
    "description": "Адрес перехода при tag=a.",
    "control": {
      "type": "text"
    }
  },
  "ariaLabel": {
    "description": "Доступное название для скринридера. Внешний вид не меняется.",
    "control": {
      "type": "text"
    }
  },
  "ariaControls": {
    "description": "ID управляемого элемента. Внешний вид не меняется.",
    "control": {
      "type": "text"
    }
  },
  "ariaExpanded": {
    "description": "Сообщает скринридеру, раскрыт ли управляемый элемент. Само по себе ничего не раскрывает.",
    "control": {
      "type": "boolean"
    }
  }
},
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: "Кнопка действия или перехода по ссылке. Свойства ниже позволяют менять текст, иконку и состояние.\n\n<a href=\"https://www.figma.com/design/TPjPitung1VP3oQg42f56O/PDPortfolio-DS?node-id=968-5914\" target=\"_blank\" rel=\"noopener noreferrer\">Figma</a>",
      },
    },
  },
} satisfies Meta<typeof DsButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Raised: Story = {
  args: { raised: true },
}

export const WithIconRight: Story = {
  args: { iconRight: true },
}

export const Toggled: Story = {
  args: { text: 'Opened', toggled: true, iconRight: true, icon: 'ChevronUp' },
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const ClickReturnsToDefault: Story = {
  render: args => ({
    components: { DsButton },
    setup() {
      const clicks = ref(0)
      return { args, clicks }
    },
    template: `
      <section style="display:grid;justify-items:center;gap:16px;padding:32px;background:var(--surface-default)">
        <DsButton v-bind="args" @click="clicks += 1" />
        <output role="status" aria-live="polite">Clicks: {{ clicks }}; persistent toggle: off</output>
      </section>
    `,
  }),
  parameters: { layout: 'fullscreen' },
  play: async ({ canvas, userEvent }) => {
    const button = canvas.getByRole('button', { name: 'Button' })
    const output = canvas.getByRole('status')

    await userEvent.click(button)
    await expect(button).not.toHaveAttribute('aria-pressed')
    await expect(output).toHaveTextContent('Clicks: 1; persistent toggle: off')
  },
}

export const ClickTogglesPersistentState: Story = {
  render: args => ({
    components: { DsButton },
    setup() {
      const clicks = ref(0)
      const toggled = ref(false)
      const toggle = () => {
        clicks.value += 1
        toggled.value = !toggled.value
      }
      return { args, clicks, toggle, toggled }
    },
    template: `
      <section style="display:grid;justify-items:center;gap:16px;padding:32px;background:var(--surface-default)">
        <DsButton v-bind="args" :toggled="toggled" :aria-pressed="toggled" @click="toggle" />
        <output role="status" aria-live="polite">Clicks: {{ clicks }}; persistent toggle: {{ toggled ? 'on' : 'off' }}</output>
      </section>
    `,
  }),
  parameters: { layout: 'fullscreen' },
  play: async ({ canvas, userEvent }) => {
    const button = canvas.getByRole('button', { name: 'Button', pressed: false })
    const output = canvas.getByRole('status')

    await userEvent.hover(button)
    await userEvent.click(button)
    await expect(button).toHaveAttribute('aria-pressed', 'true')
    await expect(button).toHaveClass('button-base--hover-suppressed')
    await expect(button).toHaveStyle({ backgroundColor: 'rgb(47, 13, 74)' })
    await expect(output).toHaveTextContent('Clicks: 1; persistent toggle: on')
    await userEvent.unhover(button)
    await expect(button).not.toHaveClass('button-base--hover-suppressed')
    await userEvent.click(button)
    await expect(button).toHaveAttribute('aria-pressed', 'false')
    await expect(output).toHaveTextContent('Clicks: 2; persistent toggle: off')
  },
}

export const AllVariants: Story = {
  render: () => ({
    components: { DsButton },
    template: `
      <section style="display:grid;gap:24px;padding:32px;background:var(--surface-default)">
        <p style="margin:0">Hover and ActivePressed use live pointer interaction in Sandbox.</p>
        <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px">
          <section style="display:grid;justify-items:center;gap:12px">
            <h2 style="margin:0">Default / IconRight=Off / Raised=Off</h2>
            <DsButton text="Button" />
          </section>
          <section style="display:grid;justify-items:center;gap:12px">
            <h2 style="margin:0">Default / IconRight=Off / Raised=On</h2>
            <DsButton text="Button" raised />
          </section>
          <section style="display:grid;justify-items:center;gap:12px">
            <h2 style="margin:0">Default / IconRight=On / Raised=Off</h2>
            <DsButton text="Button" icon-right />
          </section>
          <section style="display:grid;justify-items:center;gap:12px">
            <h2 style="margin:0">Default / IconRight=On / Raised=On</h2>
            <DsButton text="Button" icon-right raised />
          </section>
          <section style="display:grid;justify-items:center;gap:12px">
            <h2 style="margin:0">Toggled / IconRight=Off</h2>
            <DsButton text="Button" toggled />
          </section>
          <section style="display:grid;justify-items:center;gap:12px">
            <h2 style="margin:0">Toggled / IconRight=On</h2>
            <DsButton text="Button" toggled icon-right icon="ChevronUp" />
          </section>
        </div>
      </section>
    `,
  }),
  parameters: { layout: 'fullscreen' },
}

export const Sandbox: Story = {
  render: args => ({
    components: { DsButton },
    setup() {
      const toggled = ref(args.toggled)
watchStoryArg(() => args.toggled, value => { toggled.value = value })
      return { args, toggled }
    },
    template: `
      <section style="display:grid;justify-items:center;gap:16px;padding:32px;background:var(--surface-default)">
        <DsButton
          v-bind="args"
          :toggled="toggled"
          :icon="toggled ? 'ChevronUp' : args.icon"
          :aria-pressed="toggled"
          @click="toggled = !toggled"
        />
        <output role="status" aria-live="polite">Persistent toggle: {{ toggled ? 'on' : 'off' }}</output>
      </section>
    `,
  }),
  parameters: { layout: 'fullscreen' },
}
