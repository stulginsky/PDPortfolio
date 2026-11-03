import type {Meta,StoryObj} from '@storybook/vue3-vite'
import {expect,fn,userEvent,waitFor} from 'storybook/test'
import DragonHeartJw from './DragonHeartJw.vue'

const meta={title:'Compositions/Showcase cards/DragonHeart-Jw',component:DragonHeartJw,tags:['autodocs'],parameters:{layout:'padded',docs:{description:{component:'[Figma](https://www.figma.com/design/TPjPitung1VP3oQg42f56O/PDPortfolio-DS?node-id=3463-2340). Пять оригинальных изображений. Плавное следование без отскока: слои сохраняют текущую позицию и скорость при прерывании перехода. Touch без залипающего Hover; Enter/Space активируют, Escape сбрасывает. До появления кейса переход отключён; событие activate. Размеры — по общему контракту витрины, CardCompact во всех мобильных состояниях.'}}},args:{onActivate:fn()}} satisfies Meta<typeof DragonHeartJw>
export default meta
type Story=StoryObj<typeof meta>
export const Preview:Story={play:async({canvas,args})=>{
 const user=userEvent.setup(),card=canvas.getByRole('button',{name:'Сердце дракона'})
 await expect(canvas.queryByRole('link')).not.toBeInTheDocument()
 await expect(canvas.getAllByRole('listitem')).toHaveLength(4)
 await user.hover(card);await waitFor(()=>expect(card).toHaveAttribute('data-state','Hover'))
 await user.pointer({keys:'[MouseLeft>]',target:card});await expect(card).toHaveAttribute('data-state','ActivePressed')
 await user.pointer({keys:'[/MouseLeft]',target:card});await expect(card).toHaveAttribute('data-state','Hover')
 await expect(args.onActivate).toHaveBeenCalledTimes(1)
 await user.unhover(card);await expect(card).toHaveAttribute('data-state','Default')
 card.focus();await user.keyboard('[Space>]');await expect(card).toHaveAttribute('data-state','ActivePressed')
 await user.keyboard('[/Space]');await expect(args.onActivate).toHaveBeenCalledTimes(2)
 await user.keyboard('[Enter>]');await user.keyboard('{Escape}');await user.keyboard('[/Enter]')
 await expect(args.onActivate).toHaveBeenCalledTimes(2)
 await expect(card).toHaveAttribute('data-state','Default')
}}
export const Sandbox:Story={render:args=>({components:{DragonHeartJw},setup:()=>({args}),template:'<div style="width:100%;max-width:430px;resize:horizontal;overflow:auto;min-width:264px"><DragonHeartJw v-bind="args" /></div>'}),play:Preview.play}
