import type {Meta,StoryObj} from '@storybook/vue3-vite'
import {expect,fn,userEvent,waitFor} from 'storybook/test'
import FoxJw from './FoxJw.vue'
const meta={title:'Compositions/Showcase cards/Fox-Jw',component:FoxJw,tags:['autodocs'],parameters:{layout:'padded',docs:{description:{component:'[Figma](https://www.figma.com/design/TPjPitung1VP3oQg42f56O/PDPortfolio-DS?node-id=3465-2332). Оригинальные слои лисы и свечения глаз. При наведении хвосты плавно покачиваются, а зрачки слегка следят за курсором. На touch слежение продолжается до отрыва пальца, включая выход за края карточки; прокрутка страницы сохраняется, протяжка не активирует карточку. Переходы сохраняют текущую позицию и скорость. Reduced motion отключает движение. Touch без залипания Hover, Enter/Space активируют, Escape сбрасывает. Пока кейс не подключён, перехода нет; событие activate. Размеры и типографика — по общему контракту витрины.'}}},args:{onActivate:fn()}} satisfies Meta<typeof FoxJw>
export default meta
type Story=StoryObj<typeof meta>
export const Preview:Story={play:async({canvas,args})=>{
 const user=userEvent.setup(),card=canvas.getByRole('button',{name:/Миф, пойманный/})
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
export const Sandbox:Story={render:args=>({components:{FoxJw},setup:()=>({args}),template:'<div style="width:100%;max-width:430px;resize:horizontal;overflow:auto;min-width:264px"><FoxJw v-bind="args" /></div>'}),play:Preview.play}
