import type { Meta, StoryObj } from '@storybook/vue3-vite'
import DsCaseImageViewer from './DsCaseImageViewer.vue'
import sharedMeta, { Preview as SharedPreview, Sandbox as SharedSandbox } from './DsCaseImageViewer.stories'

const meta = {
  ...sharedMeta,
  tags: ['autodocs', '!dev'],
  title: 'Components/CaseImageViewer-withTitle',
  component: DsCaseImageViewer,
  argTypes: {
  "type": {
    "table": {
      "disable": true
    },
    "control": false
  }
},
  args: { ...sharedMeta.args, type: 'v1' },
  parameters: {
    ...sharedMeta.parameters,
    docs: { story: { inline: true }, description: { component: "Полноэкранный просмотр изображения с заголовком.\n\n<a href=\"https://www.figma.com/design/TPjPitung1VP3oQg42f56O/PDPortfolio-DS?node-id=1019-11807\" target=\"_blank\" rel=\"noopener noreferrer\">Figma</a>" } },
  },
} satisfies Meta<typeof DsCaseImageViewer>
export default meta
type Story = StoryObj<typeof meta>

export const Preview: Story = {
  ...SharedPreview,
  args: { ...SharedPreview.args, type: 'v1' },
  render: (args, context) => SharedPreview.render!(new Proxy(args, {
    get: (target, key) => key === 'type' ? 'v1' : Reflect.get(target, key),
  }), context),
}

export const Sandbox: Story = {
  ...SharedSandbox,
  tags: ['dev'],
  args: { ...SharedSandbox.args, type: 'v1' },
  render: (args, context) => SharedSandbox.render!(new Proxy(args, {
    get: (target, key) => key === 'type' ? 'v1' : Reflect.get(target, key),
  }), context),
}

