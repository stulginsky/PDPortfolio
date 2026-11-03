import type {Meta,StoryObj} from '@storybook/vue3-vite'
import {expect,fn,userEvent,waitFor} from 'storybook/test'
import Component4Real3Dweapon from './4Real3Dweapon.vue'
import content from '../../content/4real-3dweapon.json'
const meta={title:'Compositions/Showcase cards/4Real3Dweapon',component:Component4Real3Dweapon,tags:['autodocs'],parameters:{layout:'padded',docs:{description:{component:'[Figma](https://www.figma.com/design/TPjPitung1VP3oQg42f56O/PDPortfolio-DS?node-id=3344-2470). Девять оригинальных кадров, интервал25мс, плавное совмещение и смешивание соседних поз: наведение проигрывает01→09 один раз, уход разворачивает текущий кадр к01. Пружинное приближение и возврат с мягким разгоном и торможением; нажатие меняет только масштаб; синяя полоса сохраняется. Размытие с градиентной маской. На touch нет залипающего Hover. Enter/Space повторяют нажатие, Escape сбрасывает состояние. Переход подключается при интеграции; сейчас компонент сообщает событие activate. Размеры и перенос бэджей — по общему контракту витрины.'}}},args:{onActivate:fn()}} satisfies Meta<typeof Component4Real3Dweapon>
export default meta
type Story=StoryObj<typeof meta>
export const Preview:Story={
 play:async({canvas,args})=>{
  const user=userEvent.setup()
  const card=canvas.getByRole('button',{name:content.title})
  await expect(canvas.queryByRole('link')).not.toBeInTheDocument()
  await expect(canvas.getAllByRole('listitem')).toHaveLength(3)
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
export const Sandbox:Story={render:args=>({components:{Component4Real3Dweapon},setup:()=>({args}),template:'<div style="width:100%;max-width:430px;resize:horizontal;overflow:auto;min-width:264px"><Component4Real3Dweapon v-bind="args" /></div>'}),play:Preview.play}






