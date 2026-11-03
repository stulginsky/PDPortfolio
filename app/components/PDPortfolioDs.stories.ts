import type {Meta,StoryObj} from '@storybook/vue3-vite'
import {expect,fn,userEvent,waitFor} from 'storybook/test'
import PDPortfolioDs from './PDPortfolioDs.vue'
import content from '../../content/pd-portfolio-ds.json'
const meta={title:'Compositions/Showcase cards/PDPortfolioDs',component:PDPortfolioDs,tags:['autodocs'],parameters:{layout:'padded',docs:{description:{component:'[Figma](https://www.figma.com/design/TPjPitung1VP3oQg42f56O/PDPortfolio-DS?node-id=3349-2569). Оригинальные SVG-слои: наведение и возврат300мс, нажатие150мс. Мобильная композиция сохраняет исходный масштаб. На touch нет залипающего Hover. Enter/Space повторяют нажатие, Escape сбрасывает состояние. Пока кейс не готов, переход отключён; компонент сообщает событие activate. Размеры и перенос бэджей — по общему контракту витрины.'}}},args:{onActivate:fn()}} satisfies Meta<typeof PDPortfolioDs>
export default meta
type Story=StoryObj<typeof meta>
export const Preview:Story={
 play:async({canvas,args})=>{
  const user=userEvent.setup()
  const card=canvas.getByRole('button',{name:content.title})
  await expect(canvas.queryByRole('link')).not.toBeInTheDocument()
  await expect(canvas.getAllByRole('listitem')).toHaveLength(6)
  await user.hover(card);await waitFor(()=>expect(card).toHaveAttribute('data-state','Hover'))
  await user.pointer({keys:'[MouseLeft>]',target:card});await expect(card).toHaveAttribute('data-state','ActivePressed')
  await user.pointer({keys:'[/MouseLeft]',target:card});await waitFor(()=>expect(card).toHaveAttribute('data-state','Hover'))
  await expect(args.onActivate).toHaveBeenCalledTimes(1)
  await user.unhover(card);await expect(card).toHaveAttribute('data-state','Default')
  card.focus();await user.keyboard('[Space>]');await expect(card).toHaveAttribute('data-state','ActivePressed')
  await user.keyboard('[/Space]');await expect(card).toHaveAttribute('data-state','Default')
  await expect(args.onActivate).toHaveBeenCalledTimes(2)
  await user.keyboard('[Enter>]');await expect(card).toHaveAttribute('data-state','ActivePressed')
  await user.keyboard('{Escape}');await user.keyboard('[/Enter]')
  await expect(args.onActivate).toHaveBeenCalledTimes(2)
  await waitFor(()=>expect(card).toHaveAttribute('data-state','Default'))
 },
}
export const Sandbox:Story={render:args=>({components:{PDPortfolioDs},setup:()=>({args}),template:'<div style="width:100%;max-width:430px;resize:horizontal;overflow:auto;min-width:264px"><PDPortfolioDs v-bind="args" /></div>'}),play:Preview.play}




