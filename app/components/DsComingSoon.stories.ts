import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { fn } from 'storybook/test'
import DsComingSoon from './DsComingSoon.vue'
const meta = {
  title: 'Components/coming-soon',
  component: DsComingSoon,
  tags: ['autodocs', '!dev'],
  args: { href: 'mailto:stulginsky@gmail.com', ariaLabel: 'Скоро — сообщить о публикации', onClick: fn((event: MouseEvent) => event.preventDefault()) },
  argTypes: {
  "href": {
    "control": {
      "type": "text"
    }
  },
  "ariaLabel": {
    "control": {
      "type": "text"
    }
  }
},
  parameters: { layout: 'centered', docs: { description: { component: "Кнопка анонса ещё не опубликованного материала.\n\n<a href=\"https://www.figma.com/design/TPjPitung1VP3oQg42f56O/PDPortfolio-DS?node-id=3149-3406\" target=\"_blank\" rel=\"noopener noreferrer\">Figma</a>" } } },
} satisfies Meta<typeof DsComingSoon>
export default meta
type Story = StoryObj<typeof meta>
export const Sandbox: Story = {
  tags: ['!dev'],}
