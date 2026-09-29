import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect } from 'storybook/test'
import { ref } from 'vue'
import DsButton from './DsButton.vue'

const meta = {
  title: 'Components/Button',
  component: DsButton,
  tags: ['autodocs'],
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
    text: {
      control: 'text',
      description: 'Figma Text#968:17.',
    },
    icon: {
      control: 'select',
      options: ['Favicon', 'ChevronDown', 'ChevronUp', 'ExternalLink'],
      description: 'Figma Instance#968:0; used only while Icon right=On.',
    },
    iconRight: {
      control: 'boolean',
      description: 'Figma Icon right=Off / On.',
    },
    raised: {
      control: 'boolean',
      description: 'Figma Raised=Off / On; only the Default surface is raised.',
    },
    toggled: {
      control: 'boolean',
      description: 'Persistent Figma State=Toggled.',
    },
    disabled: {
      control: 'boolean',
      description: 'Native safety state; no separate Figma variant exists.',
    },
    tag: {
      control: 'inline-radio',
      options: ['button', 'a'],
    },
    href: { control: 'text' },
    ariaLabel: { control: 'text' },
    ariaControls: { control: 'text' },
    ariaExpanded: { control: 'boolean' },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Figma [Button 968:5914](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=968-5914). `Raised` exists only for `State=Default`; hover and physical press are live DOM states, and `toggled` is controlled persistent state.',
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
    await expect(button).toHaveStyle({ backgroundColor: 'rgb(44, 31, 57)' })
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
            <h2 style="margin:0">Default / Icon right=Off / Raised=Off</h2>
            <DsButton text="Button" />
          </section>
          <section style="display:grid;justify-items:center;gap:12px">
            <h2 style="margin:0">Default / Icon right=Off / Raised=On</h2>
            <DsButton text="Button" raised />
          </section>
          <section style="display:grid;justify-items:center;gap:12px">
            <h2 style="margin:0">Default / Icon right=On / Raised=Off</h2>
            <DsButton text="Button" icon-right />
          </section>
          <section style="display:grid;justify-items:center;gap:12px">
            <h2 style="margin:0">Default / Icon right=On / Raised=On</h2>
            <DsButton text="Button" icon-right raised />
          </section>
          <section style="display:grid;justify-items:center;gap:12px">
            <h2 style="margin:0">Toggled / Icon right=Off</h2>
            <DsButton text="Button" toggled />
          </section>
          <section style="display:grid;justify-items:center;gap:12px">
            <h2 style="margin:0">Toggled / Icon right=On</h2>
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
