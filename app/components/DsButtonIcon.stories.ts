import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect } from 'storybook/test'
import { ref } from 'vue'
import DsButtonIcon from './DsButtonIcon.vue'

const meta = {
  title: 'Components/ButtonIcon',
  component: DsButtonIcon,
  tags: ['autodocs'],
  args: {
    icon: 'Favicon',
    raised: false,
    toggled: false,
    pressedAppearance: 'ActivePressed',
    ariaLabel: 'Icon action',
  },
  argTypes: {
    icon: {
      control: 'select',
      options: [
        'Download', 'Print', 'ArrowNavLeft', 'ArrowNavRight', 'ArrowNavUp',
        'Cross', 'MagnifyingGlass', 'Sun', 'Moon', 'GitHub', 'Figma', 'ExternalLink',
        'Favicon', 'ChevronDown', 'ChevronUp',
      ],
      description: 'Figma Instance#1258:11; a canonical Foundation icon.',
    },
    raised: {
      control: 'boolean',
      description: 'Figma Raised=Off / On. Raised is available only for State=Default.',
    },
    toggled: {
      control: 'boolean',
      description: 'Persistent Figma State=Toggled.',
    },
    pressedAppearance: {
      control: 'inline-radio',
      options: ['ActivePressed', 'Toggled'],
      description: 'Visual mapping of the physical press; semantic wrappers use Toggled only when Figma composes it literally.',
    },
    ariaLabel: { control: 'text' },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: "[ButtonIcon 1258:6254](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=1258-6254)\n\n<details>\n<summary>Техническое описание</summary>\n\nFigma [ButtonIcon 1258:6254](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=1258-6254).\n\nThe component uses original Foundation SVGs as monochrome masks so the glyph follows the semantic color of each state. Hover and ActivePressed are real pointer states; toggled is the persistent state.\n\n</details>",
      },
    },
  },
} satisfies Meta<typeof DsButtonIcon>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Toggled: Story = {
  args: { toggled: true, ariaLabel: 'Selected icon action' },
}

export const Raised: Story = {
  args: { raised: true, ariaLabel: 'Raised icon action' },
}

export const MomentaryAction: Story = {
  name: 'Click returns to Default',
  render: args => ({
    components: { DsButtonIcon },
    setup() {
      const clicks = ref(0)
      return { args, clicks }
    },
    template: `
      <section style="display:grid;justify-items:center;gap:16px;padding:32px;background:var(--surface-default)">
        <DsButtonIcon v-bind="args" @click="clicks += 1" />
        <output role="status" aria-live="polite">Clicks: {{ clicks }}; persistent toggle: off</output>
      </section>
    `,
  }),
  parameters: { layout: 'fullscreen' },
  play: async ({ canvas, userEvent }) => {
    const button = canvas.getByRole('button', { name: 'Icon action' })
    const output = canvas.getByRole('status')

    await userEvent.click(button)
    await expect(button).not.toHaveAttribute('aria-pressed')
    await expect(output).toHaveTextContent('Clicks: 1; persistent toggle: off')
  },
}

export const ToggleOnClick: Story = {
  name: 'Click toggles persistent state',
  render: args => ({
    components: { DsButtonIcon },
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
        <DsButtonIcon v-bind="args" :toggled="toggled" :aria-pressed="toggled" @click="toggle" />
        <output role="status" aria-live="polite">Clicks: {{ clicks }}; persistent toggle: {{ toggled ? 'on' : 'off' }}</output>
      </section>
    `,
  }),
  parameters: { layout: 'fullscreen' },
  play: async ({ canvas, userEvent }) => {
    const button = canvas.getByRole('button', { name: 'Icon action', pressed: false })
    const output = canvas.getByRole('status')

    await userEvent.hover(button)
    await userEvent.click(button)
    await expect(button).toHaveAttribute('aria-pressed', 'true')
    await expect(button).toHaveClass('button-base--hover-suppressed')
    await expect(button).toHaveStyle({ backgroundColor: 'rgb(47, 13, 74)' })
    await expect(output).toHaveTextContent('Clicks: 1; persistent toggle: on')
    await userEvent.unhover(button)
    await expect(button).not.toHaveClass('button-base--hover-suppressed')
    await userEvent.hover(button)
    // The test runner emulates a non-hover media environment. In a desktop browser
    // the removed lock lets the documented CSS Hover visual apply again here.
    await expect(button).not.toHaveClass('button-base--hover-suppressed')
    await userEvent.click(button)
    await expect(button).toHaveAttribute('aria-pressed', 'false')
    await expect(output).toHaveTextContent('Clicks: 2; persistent toggle: off')
  },
}

export const AllVariants: Story = {
  render: () => ({
    components: { DsButtonIcon },
    template: `
      <section style="display:grid;gap:24px;padding:32px;background:var(--surface-default)">
        <p style="margin:0">Hover and ActivePressed use live pointer interaction in Sandbox.</p>
        <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px">
          <section style="display:grid;justify-items:center;gap:12px">
            <h2 style="margin:0">Default / Raised=Off</h2>
            <DsButtonIcon aria-label="Default icon action" />
          </section>
          <section style="display:grid;justify-items:center;gap:12px">
            <h2 style="margin:0">Default / Raised=On</h2>
            <DsButtonIcon raised aria-label="Raised icon action" />
          </section>
          <section style="display:grid;justify-items:center;gap:12px">
            <h2 style="margin:0">Toggled / Raised=Off</h2>
            <DsButtonIcon toggled aria-label="Toggled icon action" />
          </section>
        </div>
      </section>
    `,
  }),
  parameters: { layout: 'fullscreen' },
}

export const Sandbox: Story = {
  render: args => ({
    components: { DsButtonIcon },
    setup() {
      const toggled = ref(args.toggled)
      const raised = ref(args.raised)
      const pressedAppearance = ref(args.pressedAppearance)
      const pointerDowns = ref(0)
      const clicks = ref(0)
      const toggleOnClick = ref(false)
      const setToggleOnClick = (value: boolean) => {
        toggleOnClick.value = value
        if (!value) toggled.value = false
      }
      const handleIconClick = () => {
        clicks.value += 1
        if (toggleOnClick.value) toggled.value = !toggled.value
      }
      return {
        args,
        clicks,
        handleIconClick,
        pointerDowns,
        pressedAppearance,
        raised,
        setToggleOnClick,
        toggleOnClick,
        toggled,
      }
    },
    template: `
      <section style="display:grid;justify-items:center;gap:16px;padding:32px;background:var(--surface-default)">
        <div role="group" aria-label="Return surface after click" style="display:flex;gap:8px">
          <button type="button" :aria-pressed="!raised" @click="raised = false">Return state: Default</button>
          <button type="button" :aria-pressed="raised" @click="raised = true">Return state: Raised</button>
        </div>
        <div role="group" aria-label="Semantic wrapper press visual" style="display:flex;gap:8px">
          <button type="button" :aria-pressed="pressedAppearance === 'ActivePressed'" @click="pressedAppearance = 'ActivePressed'">Press visual: ActivePressed</button>
          <button type="button" :aria-pressed="pressedAppearance === 'Toggled'" @click="pressedAppearance = 'Toggled'">Press visual: Toggled</button>
        </div>
        <div role="group" aria-label="Click persistence" style="display:flex;gap:8px">
          <button type="button" :aria-pressed="!toggleOnClick" @click="setToggleOnClick(false)">Click returns: Default</button>
          <button type="button" :aria-pressed="toggleOnClick" @click="setToggleOnClick(true)">Click toggles: On</button>
        </div>
        <DsButtonIcon
          v-bind="args"
          :raised="raised"
          :pressed-appearance="pressedAppearance"
          :toggled="toggled"
          :aria-pressed="toggled"
          @pointerdown="pointerDowns += 1"
          @click="handleIconClick"
        />
        <output role="status" aria-live="polite">Toggled: {{ toggled }}; Clicks: {{ clicks }}; Pointer downs: {{ pointerDowns }}; Return state: {{ raised ? 'Raised' : 'Default' }}; Press visual: {{ pressedAppearance }}; Click toggles: {{ toggleOnClick }}</output>
      </section>
    `,
  }),
  parameters: { layout: 'fullscreen' },
  play: async ({ canvas, userEvent }) => {
    const button = canvas.getByRole('button', { name: 'Icon action', pressed: false })
    const raisedOn = canvas.getByRole('button', { name: 'Return state: Raised' })
    const toggledAppearance = canvas.getByRole('button', { name: 'Press visual: Toggled' })
    const toggledOnClick = canvas.getByRole('button', { name: 'Click toggles: On' })
    const output = canvas.getByRole('status')

    await userEvent.hover(button)
    await userEvent.pointer({ target: button, keys: '[MouseLeft>]' })
    await expect(output).toHaveTextContent('Pointer downs: 1')
    await userEvent.pointer({ target: button, keys: '[/MouseLeft]' })
    await expect(button).toHaveAttribute('aria-pressed', 'false')
    await expect(output).toHaveTextContent('Toggled: false; Clicks: 1')
    await userEvent.click(raisedOn)
    await expect(raisedOn).toHaveAttribute('aria-pressed', 'true')
    await expect(button).toHaveClass('button-base--raised')
    await expect(output).toHaveTextContent('Return state: Raised')
    await userEvent.click(toggledAppearance)
    await expect(toggledAppearance).toHaveAttribute('aria-pressed', 'true')
    await expect(button).toHaveClass('button-base--pressed-appearance-toggled')
    await expect(output).toHaveTextContent('Press visual: Toggled')
    await userEvent.pointer({ target: button, keys: '[MouseLeft>]' })
    await expect(button).toHaveStyle({ backgroundColor: 'rgb(47, 13, 74)' })
    await userEvent.pointer({ target: button, keys: '[/MouseLeft]' })
    await userEvent.click(toggledOnClick)
    await expect(toggledOnClick).toHaveAttribute('aria-pressed', 'true')
    await expect(button).toHaveAttribute('aria-pressed', 'false')
    await userEvent.click(button)
    await expect(button).toHaveAttribute('aria-pressed', 'true')
    await userEvent.click(button)
    await expect(button).toHaveAttribute('aria-pressed', 'false')
  },
}
