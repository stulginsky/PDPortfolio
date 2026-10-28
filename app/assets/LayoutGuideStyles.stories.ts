import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect } from 'storybook/test'
import packet from './layout-guide-styles.json'

const styles = packet.styles
function preview(style: typeof styles[number]) {
 const grid = style.layoutGrids[0]!
 if (style.layoutGrids.length !== 1 || grid.pattern !== 'COLUMNS' || grid.alignment !== 'STRETCH') throw new Error('Unsupported guide style: ' + style.name)
 return { width:style.referenceWidth+'px', boxSizing:'border-box', display:'grid', gridTemplateColumns:'repeat('+grid.count+', minmax(0,1fr))', columnGap:grid.gutterSize+'px', paddingInline:grid.offset+'px', height:'120px', background:'var(--surface-default)', color:'var(--text-default)' }
}
const meta = {
 title:'Foundation/Layout guide styles',
 parameters:{layout:'padded'},
} satisfies Meta
export default meta
type Story=StoryObj<typeof meta>

export const Catalog:Story={
 render:()=>({
  setup:()=>({styles,preview,color:(style:typeof styles[number])=>{const c=style.layoutGrids[0]!.color;return 'rgba('+c.r*255+','+c.g*255+','+c.b*255+','+c.a+')'}}),
  template:`
   <div style="display:flex;flex-direction:column;gap:32px;min-width:0">
    <section v-for="style in styles" :key="style.key" :data-guide-style="style.key">
     <h2 style="font-size:24px;line-height:1.25;margin:0 0 16px">{{style.name}}</h2>
     <p style="margin:0 0 16px">Width {{style.referenceWidth}}px · {{style.layoutGrids[0].count}} columns · offset {{style.layoutGrids[0].offset}}px · gutter {{style.layoutGrids[0].gutterSize}}px</p>
     <div role="region" :aria-label="style.name+' — направляющие'" tabindex="0" style="overflow-x:auto;max-width:100%;outline-offset:4px">
      <div data-guide-preview :style="preview(style)" aria-hidden="true">
       <div v-for="column in style.layoutGrids[0].count" :key="column" data-guide-column :style="{background:color(style),display:'grid',placeItems:'center'}">{{column}}</div>
      </div>
     </div>
    </section>
   </div>`,
 }),
 play:async({canvasElement})=>{
  for(const style of styles){
   const section=canvasElement.querySelector('[data-guide-style="'+style.key+'"]')!
   const grid=style.layoutGrids[0]!,preview=section.querySelector<HTMLElement>('[data-guide-preview]')!
   const columns=section.querySelectorAll<HTMLElement>('[data-guide-column]')
   await expect(columns.length).toBe(grid.count)
   const bounds=preview.getBoundingClientRect(),first=columns[0]!.getBoundingClientRect()
   await expect(Math.abs(bounds.width-style.referenceWidth)).toBeLessThan(.1)
   await expect(Math.abs(first.left-bounds.left-grid.offset)).toBeLessThan(.1)
   const expected=(style.referenceWidth-2*grid.offset-(grid.count-1)*grid.gutterSize)/grid.count
   await expect(Math.abs(first.width-expected)).toBeLessThan(.1)
   if(columns.length>1)await expect(Math.abs(columns[1]!.getBoundingClientRect().left-first.right-grid.gutterSize)).toBeLessThan(.1)
  }
 },
}
