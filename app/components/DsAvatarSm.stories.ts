import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent } from 'storybook/test'
import { ref } from 'vue'
import DsAvatarSm from './DsAvatarSm.vue'

/**
 * Avatar — DS components 124:712 (Avatar-Sm) and 124:563 (Avatar-Lg)
 * Figma: https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=124-712
 * DS docs: ds/components.md § Avatar-Sm, § Avatar-Lg
 */

// ---------- Avatar-Sm ----------

const smMeta = {
  title: "Components/Avatar-Sm",
  component: DsAvatarSm,
  tags: ["autodocs"],
  argTypes: {
    click: {
      action: "click",
      description: "Action that returns to the full page header.",
    },
  },
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
DS Avatar-Sm 124:712. Interactive compact avatar 50×50, radius=60.
Action: scroll to hero top (К началу страницы).
Uses the original Figma asset AvatarPortrait.

| State | Border | Image origin |
|---|---|---|
| Default | border/default 1px inside | -0.28 / -1.07px |
| Hover | border/action-hover 3px inside | -0.28 / -1.07px |
| ActivePressed | border/action-pressed 3px inside | -0.28 / -1.07px |
        `,
      },
    },
  },
} satisfies Meta<typeof DsAvatarSm>;

export default smMeta
type SmStory = StoryObj<typeof smMeta>

export const Default: SmStory = {}

export const Sandbox: SmStory = {
  render: () => ({
    components: { DsAvatarSm },
    setup() {
      const activations = ref(0)
      const scrollToFullHeader = () => {
        activations.value += 1
      }
      return { activations, scrollToFullHeader }
    },
    template: `
      <div style="display:flex;flex-direction:column;align-items:center;gap:16px;padding:32px;font-family:var(--text-font-sans);">
        <DsAvatarSm @click="scrollToFullHeader" />
        <output role="status" aria-live="polite">Activations: {{ activations }}</output>
        <p style="font-size:12px;color:var(--text-subtle);">Keyboard: Enter or Space. Hover and press use the Figma border tokens.</p>
      </div>
    `,
  }),
  parameters: { layout: 'fullscreen' },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button')
    const output = canvas.getByRole('status')

    await expect(button).toBeVisible()
    await expect(output).toHaveTextContent('Activations: 0')
    await userEvent.tab()
    await expect(button).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await expect(output).toHaveTextContent('Activations: 1')
    await userEvent.keyboard(' ')
    await expect(output).toHaveTextContent('Activations: 2')
  },
}
