import type {Meta,StoryObj} from '@storybook/vue3-vite'
import {expect,within} from 'storybook/test'
import CaseContentCard from './CaseContentCard.vue'
import content from '../../content/cases/dc-vendor-app-pr.json'
import './CaseContentCard.stories.css'
const nodes=content.page.nodes as Record<string,string>
const fixed=content.page.media.find(m=>m.node==='249:4691')!
const examples=[
 ['191:1728','249:4691','191:1752','191:1753','191:1754'],
 ['191:1733','249:4690','191:1757','191:1758','191:1759'],
 ['191:1738','249:4688','193:701','193:702','193:703'],
 ['191:1743','249:4689','193:706','193:707','193:708'],
 ['190:1514','249:4674','','190:1517','190:1518'],
 ['190:1519','261:23399','','190:1522','190:1523'],
 ['190:1524','249:4673','','190:1527','190:1528'],
].map(([frame,image,label,title,body])=>{const m=content.page.media.find(m=>m.node===image)!;return {frame,src:m.src,eyebrow:label?nodes[label]:undefined,title:nodes[title],body:nodes[body],width:754,height:450}})
const meta={
 title:'Components/CaseContentCard',component:CaseContentCard,tags:['autodocs', '!dev'],
 args:{title:nodes['191:1753'],body:nodes['191:1754'],eyebrow:nodes['191:1752'],src:fixed.src,width:754,height:450},
 parameters:{layout:'padded',docs:{description:{component:"Карточка содержимого кейса с изображением, заголовком и текстом.\n\n<a href=\"https://www.figma.com/design/TPjPitung1VP3oQg42f56O/PDPortfolio-DS?node-id=3177-2103\" target=\"_blank\" rel=\"noopener noreferrer\">Figma</a>"}}},

  } satisfies Meta<typeof CaseContentCard>
export default meta
type Story=StoryObj<typeof meta>
const verify=async({canvasElement}:{canvasElement:HTMLElement})=>{
 const cards=canvasElement.querySelectorAll<HTMLElement>('article')
 for(const card of cards){
  const image=card.querySelector('img')!
  await image.decode()
  const r=image.getBoundingClientRect()
  const framed=getComputedStyle(card).borderTopWidth!=='0px'
  await expect(r.width/r.height).toBeCloseTo(framed?Number(image.getAttribute('width'))/Number(image.getAttribute('height')):544/342,2)
  await expect(getComputedStyle(image).objectFit).toBe('cover')
  await expect(card.getBoundingClientRect().width).toBeLessThanOrEqual(framed?852.1:544.1)
  if(framed)await expect(card.getBoundingClientRect().width).toBeGreaterThanOrEqual(367.9)
  await expect(card.querySelector('.case-content-card__eyebrow-slot')!.getBoundingClientRect().height).toBeGreaterThanOrEqual(framed?32:26)
 }
 await expect(within(canvasElement).queryByRole('button')).not.toBeInTheDocument()
}
export const Compact:Story={name:'Base',render:args=>({components:{CaseContentCard},setup:()=>({args}),template:'<div class="case-content-layout" style="max-width:544px"><div class="case-content-grid"><CaseContentCard v-bind="args" /></div></div>'}),play:verify}
export const Fixed:Story={name:'Two Columns',render:args=>({components:{CaseContentCard},setup:()=>({args}),template:'<div class="case-content-layout"><div class="case-content-grid case-content-grid--two"><CaseContentCard v-for="i in 2" :key="i" v-bind="args" /></div></div>'}),play:verify}
export const Proportional:Story={name:'Three Columns',render:args=>({components:{CaseContentCard},setup:()=>({args}),template:'<div class="case-content-layout"><div class="case-content-grid"><CaseContentCard v-for="i in 3" :key="i" v-bind="args" /></div></div>'}),play:verify}
export const Sandbox: Story = {
  tags: ['dev'],...Proportional}
export const ExistingGrid:Story={
 parameters:{layout:'fullscreen'},
 render:()=>({components:{CaseContentCard},setup:()=>({examples}),template:'<div class="case-card-demo"><div class="case-content-layout"><div class="case-content-grid case-content-grid--two"><CaseContentCard v-for="item in examples.slice(0,4)" :key="item.frame" v-bind="item" /></div></div><div class="case-content-layout"><div class="case-content-grid"><CaseContentCard v-for="item in examples.slice(4)" :key="item.frame" v-bind="item" /></div></div></div>'}),
 play:verify,
}
export const ProportionalAdaptive:Story={...Compact,name:'Design Frame Ratio'}
