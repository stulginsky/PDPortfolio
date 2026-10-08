import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, waitFor } from 'storybook/test'
import RelatedCases from './RelatedCases.vue'
import RelatedCasesSandbox from './RelatedCasesSandbox.vue'

const meta = {
  title: 'Compositions/RelatedCases',
  component: RelatedCases,
  tags: ['autodocs'],
  args: { ariaLabel: 'Другие кейсы', previousLabel: 'Предыдущие кейсы', nextLabel: 'Следующие кейсы' },
  argTypes: {
    ariaLabel: { control: 'text', description: 'Доступное название области ленты.' },
    previousLabel: { control: 'text', description: 'Доступное название стрелки Left.' },
    nextLabel: { control: 'text', description: 'Доступное название стрелки Right.' },
  },
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: `
[Figma 968:7007](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=968-7007)

<details>
<summary>Техническое описание</summary>

При ширине ленты 924px стрелка вправо сразу раскрывает четвёртую карточку целиком (End), влево — первую (Start); на меньшей ширине сохраняется шаг в одну карточку.

Четыре принятые production-карточки. Base: swipe, поля 16px, cardWidth=min(327.619, railWidth−24). Min-768: k=(16/21)×min(1, railWidth/924), ширина 430k; высота от 532k, растёт под переносы. Badge≥10px, title≥18.333px, description≥13.333px, gap 8px. Стрелки: Start/Middle/End, шаг cardWidth+8, край ограничен содержимым. Переход 300ms ease-out; reduced motion без анимации. ArrowLeft/ArrowRight, Home/End и фокус карточек раскрывают нужную часть ленты. Sandbox блокирует переходы по ссылкам только для проверки взаимодействия; breakpoint выбирается реальным viewport Storybook.

Согласованная проба responsive формулы, приёмка ожидается. Legacy потребители не изменены.

</details>
` } },
  },
} satisfies Meta<typeof RelatedCases>
export default meta
type Story = StoryObj<typeof meta>
export const Sandbox: Story = {
  render: args => ({ components: { RelatedCasesSandbox }, setup: () => ({ args }), template: '<RelatedCasesSandbox :component-args="args" />' }),
  play: async ({ canvas, canvasElement }) => {
    const root = canvasElement.querySelector<HTMLElement>('.related-cases')!
    const rail = canvasElement.querySelector<HTMLElement>('.related-cases__rail')!
    await waitFor(() => expect(root.dataset.breakpoint).toBe(window.innerWidth >= 768 ? 'min-768' : 'base'))
    await expect(canvas.getAllByRole('link')).toHaveLength(4)
    await waitFor(() => expect(root.dataset.position).toBe('Start'))
    const stage = canvasElement.querySelector<HTMLElement>('.related-cases__stage')!
    const item = canvasElement.querySelector<HTMLElement>('.related-cases__card')!
    if (window.innerWidth >= 768) {
      const k = (16 / 21) * Math.min(1, rail.clientWidth / 924)
      await waitFor(() => expect(Number(root.dataset.scale)).toBeCloseTo(k, 4))
      await expect(item.getBoundingClientRect().width).toBeCloseTo(430 * k, 1)
      await expect(item.getBoundingClientRect().height).toBeGreaterThanOrEqual(532 * k - .1)
      await expect(stage.clientWidth).toBe(430)
      await userEvent.click(canvas.getByRole('button', { name: 'Следующие кейсы' }))
      if (rail.clientWidth < 924) {
        await waitFor(() => expect(root.dataset.position).toBe('Middle'))
        await waitFor(() => expect(rail.scrollLeft).toBeCloseTo(430 * k + 8, 0))
        await userEvent.click(canvas.getByRole('button', { name: 'Следующие кейсы' }))
      }
      await waitFor(() => expect(root.dataset.position).toBe('End'))
      const last = canvasElement.querySelector<HTMLElement>('.related-cases__card:last-child')!.getBoundingClientRect()
      await expect(last.right).toBeLessThanOrEqual(rail.getBoundingClientRect().right + 1)
      await expect(last.left).toBeGreaterThanOrEqual(rail.getBoundingClientRect().left - 1)
      await expect(canvas.queryByRole('button', { name: 'Следующие кейсы' })).not.toBeInTheDocument()
      await userEvent.click(canvas.getByRole('button', { name: 'Предыдущие кейсы' }))
      await waitFor(() => expect(root.dataset.position).toBe(rail.clientWidth >= 924 ? 'Start' : 'Middle'))
      if (rail.clientWidth >= 924) {
        await expect(rail.scrollLeft).toBe(0)
        await waitFor(() => expect(canvas.getByRole('button', { name: 'Следующие кейсы' })).toHaveFocus())
      }
    } else {
      await expect(canvas.queryByRole('button', { name: 'Следующие кейсы' })).not.toBeInTheDocument()
      await expect(item.getBoundingClientRect().width).toBeCloseTo(Math.min(430 * 16 / 21, rail.clientWidth - 24), 1)
      rail.scrollLeft = item.clientWidth + 8
      rail.dispatchEvent(new Event('scroll'))
      await waitFor(() => expect(root.dataset.position).toBe('Middle'))
    }
    await userEvent.click(canvas.getByRole('button', { name: 'Reset' }))
    await waitFor(() => expect(canvas.getByTestId('related-position')).toHaveTextContent('Position: Start'))
    const freshRail = canvasElement.querySelector<HTMLElement>('.related-cases__rail')!
    await expect(freshRail.scrollLeft).toBe(0)
    const firstCard = canvas.getAllByRole('link')[0]!
    firstCard.focus()
    await userEvent.keyboard('{End}')
    await waitFor(() => expect(canvas.getByTestId('related-position')).toHaveTextContent('Position: End'))
    await userEvent.keyboard('{Home}')
    await waitFor(() => expect(canvas.getByTestId('related-position')).toHaveTextContent('Position: Start'))
  },
}
