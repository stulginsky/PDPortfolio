import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { fn } from 'storybook/test'
import DsComingSoon from './DsComingSoon.vue'
const meta = {
  title: 'Components/coming-soon',
  component: DsComingSoon,
  tags: ['autodocs'],
  args: { href: 'mailto:stulginsky@gmail.com', ariaLabel: 'Скоро — сообщить о публикации', onClick: fn((event: MouseEvent) => event.preventDefault()) },
  argTypes: { href: { control: 'text' }, ariaLabel: { control: 'text' } },
  parameters: { layout: 'centered', docs: { description: { component: 'Кнопка анонса. Hover добавляет тень, нажатие убирает её. В демонстрации открытие почтового клиента перехвачено. [Figma](https://www.figma.com/design/TPjPitung1VP3oQg42f56O/PDPortfolio-DS?node-id=3149-3406).' } } },
} satisfies Meta<typeof DsComingSoon>
export default meta
type Story = StoryObj<typeof meta>
export const Sandbox: Story = {}
