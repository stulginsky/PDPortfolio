import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent } from 'storybook/test'
import { ref } from 'vue'
import DsBreadcrumbsItem from './DsBreadcrumbsItem.vue'

const meta = {
  title: 'Components/BreadcrumbsItem',
  component: DsBreadcrumbsItem,
  tags: ['autodocs'],
  args: {
    label: 'Product discovery',
    showDot: true,
    current: false,
  },
  argTypes: {
    label: { control: 'text' },
    showDot: { control: 'boolean' },
    current: { control: 'boolean' },
    click: { action: 'click' },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: "<details>\n<summary>Техническое описание</summary>\n\nOne Figma breadcrumb step. It owns its 8 px label-to-dot gap and 8 px trailing spacing; composition controls real navigation through `click`.\n\n</details>",
      },
    },
  },
} satisfies Meta<typeof DsBreadcrumbsItem>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Current: Story = {
  args: { label: 'UX / UI', showDot: false, current: true },
}

export const AllVariants: Story = {
  render: () => ({
    components: { DsBreadcrumbsItem },
    template: `
      <div style="display:flex;align-items:center;background:var(--surface-default);padding:24px">
        <DsBreadcrumbsItem label="Product discovery" />
        <DsBreadcrumbsItem label="UX / UI" :show-dot="false" current />
      </div>
    `,
  }),
  parameters: { layout: 'fullscreen' },
}

export const Sandbox: Story = {
  render: () => ({
    components: { DsBreadcrumbsItem },
    setup() {
      const clicks = ref(0)
      return { clicks }
    },
    template: `
      <div style="display:grid;gap:16px;padding:32px;background:var(--surface-default)">
        <DsBreadcrumbsItem label="Product discovery" @click="clicks += 1" />
        <output role="status">Selected: {{ clicks }}</output>
      </div>
    `,
  }),
  parameters: { layout: 'fullscreen' },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Product discovery' }))
    await expect(canvas.getByRole('status')).toHaveTextContent('Selected: 1')
  },
}
