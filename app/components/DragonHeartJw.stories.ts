import type {Meta,StoryObj} from '@storybook/vue3-vite'
import {expect,fn,userEvent,waitFor} from 'storybook/test'
import DragonHeartJw from './DragonHeartJw.vue'

const meta={title:'Compositions/Showcase cards/DragonHeart-Jw',component:DragonHeartJw,tags:['autodocs', '!dev'],parameters:{layout:'padded',docs:{description:{component:"Интерактивная карточка кейса «DragonHeart-Jw» для витрины проектов.\n\n<a href=\"https://www.figma.com/design/TPjPitung1VP3oQg42f56O/PDPortfolio-DS?node-id=3463-2340\" target=\"_blank\" rel=\"noopener noreferrer\">Figma</a>"}}},args:{onActivate:fn()}
  ,
  } satisfies Meta<typeof DragonHeartJw>
export default meta
type Story=StoryObj<typeof meta>
export const Preview:Story={play:async({canvas,args})=>{
 const user=userEvent.setup(),card=canvas.getByRole('button',{name:'Сердце дракона'})
 const sharp=card.querySelector<HTMLElement>('[data-card-scene="sharp"]')!
 const soft=card.querySelector<HTMLElement>('[data-card-scene="restore"]')!
 await expect(sharp).toHaveAttribute('aria-hidden','true')
 await expect(soft).toHaveAttribute('aria-hidden','true')
 await expect(getComputedStyle(sharp.querySelector('.dragon-heart-jw__blur')!).backdropFilter).toBe('blur(30px)')
 await expect(getComputedStyle(sharp.querySelector('.dragon-heart-jw__blur')!).maskImage).toBe('none')
 await expect(getComputedStyle(soft).maskImage).toContain('linear-gradient')
 const assertSceneSync=async()=>{
  const originals=sharp.querySelectorAll<HTMLElement>('.dragon-heart-jw__layer')
  const copies=soft.querySelectorAll<HTMLElement>('.dragon-heart-jw__layer')
  await expect(copies).toHaveLength(originals.length)
  for(let i=0;i<originals.length;i++)await expect(copies[i]!.getAttribute('style')).toBe(originals[i]!.getAttribute('style'))
 }
 await expect(canvas.queryByRole('link')).not.toBeInTheDocument()
 await expect(canvas.getAllByRole('listitem')).toHaveLength(4)
 await user.hover(card);await waitFor(()=>expect(card).toHaveAttribute('data-state','Hover'))
 await assertSceneSync()
 await user.pointer({keys:'[MouseLeft>]',target:card});await expect(card).toHaveAttribute('data-state','ActivePressed')
 await assertSceneSync()
 await user.pointer({keys:'[/MouseLeft]',target:card});await expect(card).toHaveAttribute('data-state','Hover')
 await expect(args.onActivate).toHaveBeenCalledTimes(1)
 await user.unhover(card);await expect(card).toHaveAttribute('data-state','Default')
 await assertSceneSync()
 card.focus();await user.keyboard('[Space>]');await expect(card).toHaveAttribute('data-state','ActivePressed')
 await user.keyboard('[/Space]');await expect(args.onActivate).toHaveBeenCalledTimes(2)
 await user.keyboard('[Enter>]');await user.keyboard('{Escape}');await user.keyboard('[/Enter]')
 await expect(args.onActivate).toHaveBeenCalledTimes(2)
 await expect(card).toHaveAttribute('data-state','Default')
}}
export const Sandbox: Story = {
  tags: ['dev'],render:args=>({components:{DragonHeartJw},setup:()=>({args}),template:'<div style="width:100%;max-width:430px;resize:horizontal;overflow:auto;min-width:264px"><DragonHeartJw v-bind="args" /></div>'}),play:Preview.play}
