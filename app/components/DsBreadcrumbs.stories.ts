import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent } from 'storybook/test'
import { computed, ref } from 'vue'
import DsBreadcrumbs from './DsBreadcrumbs.vue'

const parent = { id: 'parent', label: 'Parent' }

const children = [
  { id: 'child-1', label: 'Child 1' },
  { id: 'child-2', label: 'Child 2' },
  { id: 'child-3', label: 'Child 3' },
  { id: 'child-4', label: 'Child 4' },
]

/**
 * Breadcrumbs — DS component 1097:4338.
 * Figma: https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=1097-4338
 */
const meta = {
  title: 'Components/Breadcrumbs',
  component: DsBreadcrumbs,
  tags: ['autodocs'],
  args: {
    items: children.slice(0, 3),
    mode: 'Default',
    parent,
  },
  argTypes: {
    items: {
      control: 'object',
      description: 'Visible child path; the final item is current and non-interactive. Parent is supplied separately.',
    },
    mode: {
      control: 'inline-radio',
      options: ['Default', 'Overflow'],
      description: 'Overflow keeps the final two items and exposes the earlier path through …. ',
    },
    parent: {
      control: 'object',
      description: 'Optional destination for the left parent-navigation button.',
    },
    select: { action: 'select' },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
One generic hierarchy component. It never renders navigation as placeholder links:
selection is emitted through \`select\`, and the optional parent button emits \`parent\`.

| Mode | Display |
|---|---|
| Default | The complete hierarchy |
| Overflow | \`… · previous · current\`; earlier items open in the menu |
        `,
      },
    },
  },
} satisfies Meta<typeof DsBreadcrumbs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Overflow: Story = {
  args: {
    items: children,
    mode: 'Overflow',
    parent,
  },
}

export const WithoutParentNavigation: Story = {
  args: {
    items: children.slice(0, 2),
    parent: undefined,
  },
}

export const AllVariants: Story = {
  render: () => ({
    components: { DsBreadcrumbs },
    setup() {
      return { children, parent }
    },
    template: `
      <div style="display:grid;gap:32px;padding:24px;background:var(--surface-default)">
        <DsBreadcrumbs aria-label="Default child path" :items="children.slice(0, 3)" :parent="parent" />
        <DsBreadcrumbs aria-label="Overflow child path" :items="children" mode="Overflow" :parent="parent" />
        <DsBreadcrumbs aria-label="Child path without parent navigation" :items="children.slice(0, 2)" />
      </div>
    `,
  }),
  parameters: { layout: 'fullscreen' },
}

export const Sandbox: Story = {
  render: () => ({
    components: { DsBreadcrumbs },
    setup() {
      const currentIndex = ref(3)
      const atParent = ref(false)
      const mode = ref<'Default' | 'Overflow'>('Default')
      const items = computed(() => atParent.value ? [] : children.slice(0, currentIndex.value + 1))
      const current = computed(() => atParent.value ? parent : children[currentIndex.value])
      const select = (item: { id: string }) => {
        const index = children.findIndex(({ id }) => id === item.id)
        if (index >= 0) {
          atParent.value = false
          currentIndex.value = index
        }
      }
      const goToParent = () => { atParent.value = true }
      const showChildPath = () => { atParent.value = false }
      const next = () => {
        if (currentIndex.value < children.length - 1) currentIndex.value += 1
      }

      return { atParent, children, current, currentIndex, goToParent, items, mode, next, parent, select, showChildPath }
    },
    template: `
      <div style="display:grid;gap:24px;padding:32px;background:var(--surface-subtle);font-family:var(--text-font-sans)">
        <div role="group" aria-label="Breadcrumb mode" style="display:flex;gap:8px">
          <button type="button" :aria-pressed="mode === 'Default'" @click="mode = 'Default'">Default mode</button>
          <button type="button" :aria-pressed="mode === 'Overflow'" @click="mode = 'Overflow'">Overflow mode</button>
          <button type="button" :disabled="atParent || currentIndex === children.length - 1" @click="next">Go to next child</button>
          <button v-if="atParent" type="button" @click="showChildPath">Show child path</button>
        </div>
        <DsBreadcrumbs :items="items" :mode="mode" :parent="atParent ? undefined : parent" @select="select" @parent="goToParent" />
        <output role="status" aria-live="polite">Current: {{ current.label }}; Mode: {{ mode }}</output>
      </div>
    `,
  }),
  parameters: { layout: 'fullscreen' },
  play: async ({ canvas }) => {
    const parentButton = canvas.getByRole('button', { name: 'Go to Parent' })
    await userEvent.click(parentButton)
    await expect(canvas.getByRole('status')).toHaveTextContent('Current: Parent')
    await expect(canvas.queryByRole('button', { name: 'Go to Parent' })).not.toBeInTheDocument()

    await userEvent.click(canvas.getByRole('button', { name: 'Show child path' }))

    await userEvent.click(canvas.getByRole('button', { name: 'Overflow mode' }))
    await expect(canvas.getByRole('status')).toHaveTextContent('Mode: Overflow')

    const overflowTrigger = canvas.getByRole('button', { name: '...' })
    await userEvent.click(overflowTrigger)
    await expect(overflowTrigger).toHaveAttribute('aria-expanded', 'true')
    await userEvent.click(canvas.getByRole('menuitem', { name: 'Child 1' }))
    await expect(canvas.getByRole('status')).toHaveTextContent('Current: Child 1')
  },
}
